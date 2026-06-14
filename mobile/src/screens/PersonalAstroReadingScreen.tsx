import { SymbolicDisclaimer } from '../components/SymbolicDisclaimer';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getAssistantLabel } from '../config/constants';
import { BrandedConfirmModal } from '../components/BrandedConfirmModal';
import { BrandedScrollView } from '../components/BrandedScrollView';
import { AssistantLoading } from '../components/AssistantLoading';
import { TokenUsage } from '../components/TokenUsage';
import { SelectableFormattedText } from '../components/SelectableFormattedText';
import { applyMemoryAnalysisResult, appendReadingDerivedTheme, appendReadingSummary, appendUserConversationMemory, appendUserReadingIntentMemory, loadAccountState, loadProfileMemorySnippet } from '../services/profileMemoryService';
import { getRetryLaterMessage, isRetryableLlmError } from '../services/llmRetryMessages';
import { moderateUserInput } from '../services/inputModerationService';
import { analyzeMemoryTranscript } from '../services/memoryAnalysisService';
import {
  createPersonalAstroReading,
  createPersonalAstroFollowUp,
  formatTimezoneForDisplay,
  getCachedPersonalAstroReading,
  hasRequiredAstroBirthInputs,
  type AstroPeriod,
} from '../services/astroEngine';
import { APP_NAME } from '../config/constants';
import { FOLLOW_UP_QUESTION_MAX_CHARS, FOLLOW_UP_QUESTION_MIN_CHARS, normalizeLimitedInput, OPTIONAL_READING_TOPIC_MAX_CHARS } from '../config/llmTokenPolicy';
import { addPersonalTokenUsage, GEMINI_FLASH_LITE_INPUT_PRICE_USD_PER_M, GEMINI_FLASH_LITE_OUTPUT_PRICE_USD_PER_M } from '../services/tokenLedgerService';
import type { TokenUsageData } from '../types';
import {
  getLatestNativeTranscript,
  resetNativeTranscript,
  startNativeRecording,
  stopNativeRecording,
} from '../services/nativeSttService';
import {
  getAssistantSpeechProgress,
  isAssistantSpeaking,
  prepareAssistantSpeech,
  startOrResumeAssistantSpeech,
  stopAssistantSpeech,
} from '../services/ttsService';

type Props = NativeStackScreenProps<RootStackParamList, 'PersonalAstroReading'>;

// Hafıza temalarına (themeFromReading) yazılan TR etiketler; UI'da gösterim için
// periodUiLabel (i18n) kullanılır, kalıcı kayıtlar bu sabitten beslenmeye devam eder.
const PERIOD_LABELS: Record<AstroPeriod, string> = {
  daily: 'Günlük',
  weekly: 'Haftalık',
  monthly: 'Aylık',
  yearly: 'Yıllık',
};

const PERIOD_UI_KEYS: Record<AstroPeriod, string> = {
  daily: 'flows.periodDaily',
  weekly: 'flows.periodWeekly',
  monthly: 'flows.periodMonthly',
  yearly: 'flows.periodYearly',
};

function periodUiLabel(period: AstroPeriod, t: TFunction) {
  return t(PERIOD_UI_KEYS[period]);
}

type AstroSelection = AstroPeriod | 'topic';

type FollowUpMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

function compactSummary(text: string) {
  return text.replace(/\s+/g, ' ').trim().slice(0, 420);
}

function themeFromReading(period: AstroPeriod, sign: string, risingSign?: string | null) {
  const periodLabel = PERIOD_LABELS[period].toLocaleLowerCase('tr-TR');
  return `${periodLabel} kişisel astro`;
}

export function PersonalAstroReadingScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { profileId, assistantId } = route.params;
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<AstroPeriod | null>(null);
  const [selection, setSelection] = useState<AstroSelection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [text, setText] = useState('');
  const [meta, setMeta] = useState<{ sign: string; risingSign?: string | null; timezone: string; precisionNote?: string } | null>(null);
  const [readingTheme, setReadingTheme] = useState<{ label: string; key: string } | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsageData>({ inputTokens: 0, outputTokens: 0, textInputTokens: 0, imageInputTokens: 0 });
  const [topicText, setTopicText] = useState('');
  const [topicEditorVisible, setTopicEditorVisible] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [followUps, setFollowUps] = useState<FollowUpMessage[]>([]);
  const [isSendingQuestion, setIsSendingQuestion] = useState(false);
  const [isRecordingQuestion, setIsRecordingQuestion] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectionCollapsed, setSelectionCollapsed] = useState(false);
  const [speechMode, setSpeechMode] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [infoModal, setInfoModal] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: APP_NAME,
    message: '',
  });
  const speechRunRef = useRef(0);
  const questionBaseRef = useRef('');
  const pageScrollRef = useRef<ScrollView>(null);
  const readingPanelYRef = useRef(0);
  const followUpsPanelYRef = useRef(0);
  const messageYRef = useRef<Record<string, number>>({});

  const assistantLabel = useMemo(() => getAssistantLabel(assistantId), [assistantId]);
  const normalizedTopicText = normalizeLimitedInput(topicText, OPTIONAL_READING_TOPIC_MAX_CHARS);
  const modeHeaderLabel = useMemo(
    () => (selection === 'topic' ? t('flows.topicFocusedHeader') : period ? periodUiLabel(period, t) : t('flows.selectPeriodHeader')),
    [period, selection, t],
  );
  const isBusy = isLoading || isSendingQuestion;
  const hasPreparedReading = Boolean(text && period);
  const canPrepareReading = Boolean(period && !isBusy && !hasPreparedReading);

  const showSelectionInfo = useCallback((title: string, message: string) => {
    setInfoModal({ visible: true, title, message });
  }, []);

  const closeInfoModal = useCallback(() => {
    setInfoModal({ visible: false, title: APP_NAME, message: '' });
  }, []);

  const openProfileSettings = useCallback(() => {
    closeInfoModal();
    navigation.navigate('ProfileSettings', { profileId });
  }, [closeInfoModal, navigation, profileId]);

  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: !isBusy,
      gestureEnabled: !isBusy,
    });
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (!isBusy) return;
      event.preventDefault();
    });
    return unsubscribe;
  }, [isBusy, navigation]);

  const applyReadingToScreen = useCallback(
    (reading: Awaited<ReturnType<typeof createPersonalAstroReading>>, selectedPeriod: AstroPeriod, focusQuestion?: string) => {
      setText(reading.text);
      setFollowUps([]);
      setMeta({
        sign: reading.sign,
        risingSign: reading.risingSign,
        timezone: reading.timezoneUsed,
        precisionNote: reading.precisionNote,
      });
      setReadingTheme({
        label: focusQuestion
          ? `konu odaklı kişisel astro: ${focusQuestion.slice(0, 80)}`
          : themeFromReading(selectedPeriod, reading.sign, reading.risingSign),
        key: focusQuestion
          ? `personal-astro-topic-${reading.periodKey}-${Date.now()}`
          : `personal-astro-${selectedPeriod}-${reading.periodKey}`,
      });
      setSelectionCollapsed(true);
      setTimeout(() => {
        pageScrollRef.current?.scrollTo({ y: Math.max(0, readingPanelYRef.current - 2), animated: true });
      }, 120);
    },
    [],
  );

  const handleSelectPeriod = useCallback(
    async (nextPeriod: AstroPeriod) => {
      if (isBusy) return;
      setPeriod(nextPeriod);
      setSelection(nextPeriod);
      setTopicText('');
      setTopicEditorVisible(false);
      setText('');
      setMeta(null);
      setReadingTheme(null);
      setSelectionCollapsed(false);
      setFollowUps([]);
      setQuestionText('');
      try {
        const state = await loadAccountState();
        const profile = state.profiles.find((item) => item.profileId === profileId) || null;
        if (!profile) return;
        setProfileName(profile.displayName);
        if (!hasRequiredAstroBirthInputs(profile)) return;
        const cached = await getCachedPersonalAstroReading({ profile, assistantId, period: nextPeriod });
        if (cached) applyReadingToScreen(cached, nextPeriod);
      } catch {
        // Cache kontrolü sessiz kalmalı; üretim butonu normal akışı sürdürecek.
      }
    },
    [applyReadingToScreen, assistantId, isBusy, profileId],
  );

  const handleSelectTopic = useCallback(() => {
    if (isBusy) return;
    setSelection('topic');
    setPeriod('weekly');
    setText('');
    setMeta(null);
    setReadingTheme(null);
    setSelectionCollapsed(false);
    setFollowUps([]);
    setQuestionText('');
    setTopicEditorVisible(true);
  }, [isBusy]);

  const loadReading = useCallback(async () => {
    if (isBusy || text) return;
    if (!period) {
      setText('');
      setMeta(null);
      setReadingTheme(null);
      return;
    }
    const focusQuestion = selection === 'topic' ? normalizedTopicText : '';
    if (focusQuestion) {
      // K42: konu metni modele/hafızaya/arşive gitmeden denetlenir; engellenirse nazik red.
      const moderation = moderateUserInput(focusQuestion, 'question');
      if (moderation.verdict !== 'allow') {
        setTopicText('');
        setMeta(null);
        setReadingTheme(null);
        setFollowUps([]);
        setText(moderation.replyText);
        setSelectionCollapsed(true);
        return;
      }
    }
    setSelectionCollapsed(true);
    setIsLoading(true);
    setTimeout(() => {
      pageScrollRef.current?.scrollTo({ y: Math.max(0, readingPanelYRef.current - 2), animated: true });
    }, 120);
    try {
      const state = await loadAccountState();
      const profile = state.profiles.find((item) => item.profileId === profileId) || null;
      if (!profile) {
        setInfoModal({
          visible: true,
          title: APP_NAME,
          message: t('session.profileNotFound'),
        });
        setText('');
        return;
      }
      setProfileName(profile.displayName);

      if (!hasRequiredAstroBirthInputs(profile)) {
        setInfoModal({
          visible: true,
          title: t('modals.profileInfoRequiredTitle'),
          message: t('flows.astroInfoRequired'),
        });
        setText('');
        return;
      }

      if (focusQuestion) {
        await appendUserReadingIntentMemory({
          profileId: profile.profileId,
          text: focusQuestion,
          readingType: 'personal-astro',
        }).catch(() => {});
      }
      const memoryState = focusQuestion ? await loadAccountState().catch(() => state) : state;
      const memorySnippet = await loadProfileMemorySnippet(
        memoryState,
        profile.profileId,
        focusQuestion ? { semanticQuery: focusQuestion } : undefined,
      ).catch(() => null);
      const reading = await createPersonalAstroReading({
        period,
        profile,
        assistantId,
        assistantLabel,
        memorySnippet,
        focusQuestion: focusQuestion || undefined,
      });
      if (!reading.cached && reading.usage) {
        const inputTokens = reading.usage.inputTokens || 0;
        const outputTokens = reading.usage.outputTokens || 0;
        setTokenUsage((current) => ({
          inputTokens: current.inputTokens + inputTokens,
          outputTokens: current.outputTokens + outputTokens,
          textInputTokens: (current.textInputTokens || 0) + inputTokens,
          imageInputTokens: current.imageInputTokens || 0,
        }));
        await addPersonalTokenUsage({
          modelName: reading.modelName || 'gemini-2.5-flash-lite',
          readingName: focusQuestion ? 'Kişisel Astro - Konu' : 'Kişisel Astro',
          textInputTokens: inputTokens,
          outputTokens,
        }).catch(() => {});
      }
      applyReadingToScreen(reading, period, focusQuestion);
    } catch (err: any) {
      const retryLater = isRetryableLlmError(err);
      const retryMessage = retryLater ? getRetryLaterMessage('personal-astro', `${profileId}-${period}`) : null;
      setInfoModal({
        visible: true,
        title: retryMessage?.title || APP_NAME,
        message: retryMessage?.message || err?.message || t('flows.astroFailed'),
      });
      setText('');
    } finally {
      setIsLoading(false);
    }
  }, [applyReadingToScreen, assistantId, assistantLabel, isBusy, normalizedTopicText, period, profileId, selection, t, text]);

  useEffect(() => {
    return () => {
      stopAssistantSpeech();
      void stopNativeRecording();
    };
  }, []);

  // Takip cevabı gelince en ALTA değil, yeni balonun BAŞINA scroll (kullanıcı cevabın başını görsün).
  // Mutlak konum = followup paneli Y'si + balonun panel içi Y'si.
  useEffect(() => {
    if (!followUps.length) return;
    const last = followUps[followUps.length - 1];
    const scrollToStart = () => {
      const y = messageYRef.current[last.id];
      if (typeof y === 'number') {
        pageScrollRef.current?.scrollTo({ y: Math.max(0, followUpsPanelYRef.current + y - 8), animated: true });
      }
    };
    const t1 = setTimeout(scrollToStart, 0);
    const t2 = setTimeout(scrollToStart, 120);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [followUps]);

  const latestReadableText = useMemo(() => {
    const lastAssistant = [...followUps].reverse().find((message) => message.role === 'assistant');
    return lastAssistant?.text || text;
  }, [followUps, text]);

  const handlePhoneRead = useCallback(() => {
    const readable = latestReadableText.trim();
    if (!readable) return;
    if (speechMode === 'playing') {
      speechRunRef.current += 1;
      stopAssistantSpeech();
      setSpeechMode('paused');
      return;
    }
    if (speechMode !== 'paused' || getAssistantSpeechProgress().finished) {
      prepareAssistantSpeech(readable);
    }
    const runId = speechRunRef.current + 1;
    speechRunRef.current = runId;
    setSpeechMode('playing');
    void startOrResumeAssistantSpeech().finally(() => {
      if (runId !== speechRunRef.current) return;
      if (!isAssistantSpeaking()) {
        setSpeechMode('idle');
      }
    });
  }, [latestReadableText, speechMode]);

  const handleSendQuestion = useCallback(async () => {
    const question = normalizeLimitedInput(questionText, FOLLOW_UP_QUESTION_MAX_CHARS);
    if (question.length < FOLLOW_UP_QUESTION_MIN_CHARS || !text || !period || isSendingQuestion) return;
    const userMessage: FollowUpMessage = { id: `u-${Date.now()}`, role: 'user', text: question };
    const previousFollowUps = [
      ...(selection === 'topic' && normalizedTopicText
        ? [{ role: 'user' as const, text: `Yorumlanmasını istediğim konu: ${normalizedTopicText}` }]
        : []),
      ...followUps.map(({ role, text }) => ({ role, text })),
    ];
    setFollowUps((current) => [...current, userMessage]);
    setQuestionText('');
    setEditorVisible(false);
    setIsSendingQuestion(true);
    try {
      await appendUserConversationMemory(profileId, question).catch(() => {});
      const accountState = await loadAccountState();
      const activeProfile = accountState.profiles.find((item) => item.profileId === profileId) || null;
      const semanticMemorySnippet = await loadProfileMemorySnippet(accountState, profileId, { semanticQuery: question }).catch(() => null);
      const answer = await createPersonalAstroFollowUp({
        profileName: profileName || 'Profil',
        assistantId,
        assistantLabel,
        period,
        profile: activeProfile,
        readingText: text,
        question,
        previousFollowUps,
        memorySnippet: semanticMemorySnippet,
      });
      setFollowUps((current) => [...current, { id: `a-${Date.now()}`, role: 'assistant', text: answer.text }]);
      const inputTokens = answer.usage.inputTokens || 0;
      const outputTokens = answer.usage.outputTokens || 0;
      setTokenUsage((current) => ({
        inputTokens: current.inputTokens + inputTokens,
        outputTokens: current.outputTokens + outputTokens,
        textInputTokens: (current.textInputTokens || 0) + inputTokens,
        imageInputTokens: current.imageInputTokens || 0,
      }));
      await addPersonalTokenUsage({
        modelName: answer.modelName || 'gemini-2.5-flash-lite',
        readingName: selection === 'topic' ? 'Kişisel Astro - Konu' : 'Kişisel Astro',
        textInputTokens: inputTokens,
        outputTokens,
      }).catch(() => {});
      setSpeechMode('idle');
    } catch (err: any) {
      setInfoModal({
        visible: true,
        title: APP_NAME,
        message: err?.message || t('session.answerFailed'),
      });
    } finally {
      setIsSendingQuestion(false);
    }
  }, [assistantId, assistantLabel, followUps, isSendingQuestion, normalizedTopicText, period, profileName, profileId, questionText, selection, t, text]);

  const buildTranscript = useCallback(
    () => {
      const topicLead =
        selection === 'topic' && normalizedTopicText
          ? [{ role: 'user' as const, text: `Yorumlanmasını istediğim konu: ${normalizedTopicText}`, timestamp: Date.now() }]
          : [];
      return [
        ...topicLead,
        { role: 'assistant' as const, text, timestamp: Date.now() },
        ...followUps.map((message) => ({ role: message.role, text: message.text, timestamp: Date.now() })),
      ];
    },
    [followUps, normalizedTopicText, selection, text],
  );

  const persistReadingAndEnd = useCallback(async () => {
    if (!text || !period) return;
    stopAssistantSpeech();
    await stopNativeRecording().catch(() => {});
    const transcript = buildTranscript();
    await appendReadingSummary({
      profileId,
      assistantId,
      readingType: 'personal-astro',
      period,
      astroFocusQuestion: selection === 'topic' && normalizedTopicText ? normalizedTopicText : undefined,
      surfacesRead: [],
      summary: compactSummary(selection === 'topic' && normalizedTopicText ? `Konu: ${normalizedTopicText}\n\n${text}` : text),
      transcript,
    }).catch(() => {});
    if (readingTheme) {
      await appendReadingDerivedTheme(profileId, readingTheme.label, readingTheme.key).catch(() => {});
    }
    void loadAccountState()
      .then((state) => loadProfileMemorySnippet(state, profileId))
      .then((memorySnippet) =>
        analyzeMemoryTranscript({
          profileId,
          profileName: profileName || 'Profil',
          readingType: 'personal-astro',
          memorySnippet,
          transcript,
        }),
      )
      .then((result) => applyMemoryAnalysisResult(profileId, result))
      .catch(() => {});
    navigation.goBack();
  }, [assistantId, buildTranscript, navigation, normalizedTopicText, period, profileId, profileName, readingTheme, selection, text]);

  const mergeQuestionTranscript = useCallback((transcript: string) => {
    const cleaned = transcript.replace(/\s+/g, ' ').trim();
    const base = questionBaseRef.current;
    setQuestionText(base && cleaned ? `${base} ${cleaned}` : cleaned || base);
  }, []);

  const handleQuestionRecordStart = useCallback(async () => {
    if (isRecordingQuestion || !text) return;
    if (speechMode === 'playing') {
      speechRunRef.current += 1;
      stopAssistantSpeech();
      setSpeechMode('paused');
    }
    questionBaseRef.current = questionText.replace(/\s+/g, ' ').trim();
    resetNativeTranscript();
    setIsRecordingQuestion(true);
    try {
      await startNativeRecording(mergeQuestionTranscript, (_code, message) => {
        if (message) {
          setInfoModal({ visible: true, title: APP_NAME, message });
        }
      });
    } catch (err: any) {
      setIsRecordingQuestion(false);
      setInfoModal({
        visible: true,
        title: APP_NAME,
        message: err?.message || t('session.voiceTypingStartFailed'),
      });
    }
  }, [isRecordingQuestion, mergeQuestionTranscript, questionText, speechMode, t, text]);

  const handleQuestionRecordStop = useCallback(async () => {
    await stopNativeRecording().catch(() => {});
    mergeQuestionTranscript(getLatestNativeTranscript());
    resetNativeTranscript();
    setIsRecordingQuestion(false);
  }, [mergeQuestionTranscript]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 24 : 0}
    >
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <SymbolicDisclaimer />
      <BrandedScrollView
        ref={pageScrollRef}
        showScrollToTop
        contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]}
        onContentSizeChange={() => {
          if (isSendingQuestion) {
            pageScrollRef.current?.scrollToEnd({ animated: true });
          }
        }}
      >
        <View style={styles.tokenAckRow}>
          <TokenUsage
            usage={tokenUsage}
            inputPrice={GEMINI_FLASH_LITE_INPUT_PRICE_USD_PER_M}
            outputPrice={GEMINI_FLASH_LITE_OUTPUT_PRICE_USD_PER_M}
          />
        </View>
        <View style={styles.sessionHeaderRow}>
          <Text style={styles.sessionHeaderText}>{profileName || t('session.profileFallback')}</Text>
          <Text style={[styles.sessionHeaderText, styles.modeHeaderText]}>{modeHeaderLabel}</Text>
          <Text style={styles.sessionHeaderText}>{assistantLabel}</Text>
        </View>
        <View style={[styles.panel, selectionCollapsed && styles.selectionPanelCollapsed]}>
          <TouchableOpacity
            style={styles.selectionHeaderRow}
            activeOpacity={0.82}
            onPress={() => setSelectionCollapsed((current) => !current)}
          >
            <Text style={styles.sectionTitle}>{t('flows.selectPeriodTitle')}</Text>
            <Text style={styles.expandButtonText}>{selectionCollapsed ? t('common.open') : t('common.close')}</Text>
          </TouchableOpacity>
          {!selectionCollapsed ? (
            <>
              <View style={styles.periodRow}>
                {(['daily', 'weekly', 'monthly', 'yearly'] as AstroPeriod[]).map((item) => {
                  const selected = selection === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[styles.periodButton, selected && styles.periodButtonSelected, isBusy && styles.disabledAction]}
                      onPress={() => void handleSelectPeriod(item)}
                      onLongPress={() =>
                        showSelectionInfo(
                          periodUiLabel(item, t),
                          t('flows.periodInfoMessage'),
                        )
                      }
                      disabled={isBusy}
                    >
                      <Text style={[styles.periodButtonText, selected && styles.periodButtonTextSelected]}>
                        {periodUiLabel(item, t)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  style={[styles.periodButton, selection === 'topic' && styles.periodButtonSelected, isBusy && styles.disabledAction]}
                  onPress={handleSelectTopic}
                  onLongPress={() =>
                    showSelectionInfo(
                      t('flows.specificTopic'),
                      t('flows.topicInfoMessage'),
                    )
                  }
                  disabled={isBusy}
                >
                  <Text style={[styles.periodButtonText, selection === 'topic' && styles.periodButtonTextSelected]}>{t('flows.specificTopic')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.periodButton, isBusy && styles.disabledAction]}
                  onPress={() => navigation.navigate('AstroRelationshipReading', { profileId, assistantId, mode: 'compatibility' })}
                  onLongPress={() =>
                    showSelectionInfo(t('flows.relationshipCompatibility'), t('flows.compatibilityInfoMessage'))
                  }
                  disabled={isBusy}
                >
                  <Text style={styles.astroModeTitle}>{t('flows.relationshipCompatibility')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.periodButton, isBusy && styles.disabledAction]}
                  onPress={() => navigation.navigate('AstroRelationshipReading', { profileId, assistantId, mode: 'family' })}
                  onLongPress={() =>
                    showSelectionInfo(t('flows.familyReading'), t('flows.familyInfoMessage'))
                  }
                  disabled={isBusy}
                >
                  <Text style={styles.astroModeTitle}>{t('flows.familyReading')}</Text>
                </TouchableOpacity>
              </View>
              {selection === 'topic' ? (
            <TouchableOpacity style={styles.topicPromptBox} activeOpacity={0.9} onPress={() => setTopicEditorVisible(true)}>
              <Text style={styles.topicPromptLabel}>{t('flows.topicToInterpret')}</Text>
              <Text style={[styles.topicPromptText, !normalizedTopicText && styles.topicPromptPlaceholder]}>
                {normalizedTopicText || t('flows.astroTopicPlaceholder')}
              </Text>
            </TouchableOpacity>
              ) : null}
            </>
          ) : null}
        </View>
        <View style={styles.floatingActionRow}>
          <TouchableOpacity
            style={[styles.floatingPrepareButton, !canPrepareReading && styles.disabledAction]}
            onPress={() => void loadReading()}
            disabled={!canPrepareReading}
          >
            <Text style={styles.floatingPrepareText}>{t('session.interpret')}</Text>
          </TouchableOpacity>
        </View>

        <View
          style={styles.panel}
          onLayout={(event) => {
            readingPanelYRef.current = event.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.sectionTitle}>{t('session.interpretation')}</Text>
          <BrandedScrollView
            containerStyle={styles.readingScrollFrame}
            style={styles.readingScroll}
            contentContainerStyle={styles.readingScrollContent}
            nestedScrollEnabled
            indicatorMode="box"
          >
            {isLoading ? (
              <AssistantLoading label={t('session.interpretationPreparing')} detail={t('session.pleaseWaitKeepOpen')} />
            ) : text ? (
              <SelectableFormattedText text={text} style={styles.readingText} />
            ) : (
              <Text style={styles.loading}>{t('flows.astroEmptyReading')}</Text>
            )}
            {meta ? (
              <Text style={styles.meta}>
                {t('flows.astroMetaLine', {
                  sign: meta.sign,
                  rising: meta.risingSign || t('flows.birthTimeRequired'),
                  timezone: formatTimezoneForDisplay(meta.timezone),
                })}
              </Text>
            ) : null}
          </BrandedScrollView>
          {text ? (
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.secondaryAction} onPress={handlePhoneRead}>
                <Text style={styles.secondaryActionText}>{speechMode === 'playing' ? t('session.pause') : t('session.phoneRead')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryAction, styles.disabledAction]} disabled>
                <Text style={styles.secondaryActionText}>{t('session.assistantRead', { assistant: assistantLabel })}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {text ? (
          <View
            style={styles.panel}
            onLayout={(event) => {
              followUpsPanelYRef.current = event.nativeEvent.layout.y;
            }}
          >
            {followUps.map((message) => (
              <View
                key={message.id}
                style={[styles.chatBubble, message.role === 'user' ? styles.userBubble : styles.assistantBubble]}
                onLayout={(event) => {
                  messageYRef.current[message.id] = event.nativeEvent.layout.y;
                }}
              >
                <Text style={styles.chatRole}>{message.role === 'user' ? t('session.you') : assistantLabel}</Text>
                <SelectableFormattedText text={message.text} style={styles.chatText} />
              </View>
            ))}
            {isSendingQuestion ? <AssistantLoading compact /> : null}
            <TouchableOpacity style={styles.questionInput} activeOpacity={0.88} onPress={() => setEditorVisible(true)}>
              <Text style={[styles.composePreviewText, !questionText.trim() && styles.composePreviewPlaceholder]}>
                {questionText.trim() || t('flows.astroAskPlaceholder')}
              </Text>
            </TouchableOpacity>
            <Modal visible={editorVisible} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setEditorVisible(false)}>
              <KeyboardAvoidingView
                style={styles.editorOverlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'android' ? 24 : 0}
              >
                <View style={styles.editorCard}>
                  <Text style={styles.editorTitle}>{t('session.editQuestionTitle')}</Text>
                  <TextInput
                    style={styles.editorInput}
                    value={questionText}
                    onChangeText={setQuestionText}
                    maxLength={FOLLOW_UP_QUESTION_MAX_CHARS}
                    placeholder={t('flows.questionEditorPlaceholderOptional')}
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    multiline
                    autoFocus
                    scrollEnabled
                  />
                  <View style={styles.editorActions}>
                    <TouchableOpacity style={styles.editorGhostBtn} onPress={() => setEditorVisible(false)}>
                      <Text style={styles.editorGhostText}>{t('common.close')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editorSendBtn, (!questionText.trim() || isSendingQuestion) && styles.disabledAction]}
                      onPress={() => void handleSendQuestion()}
                      disabled={!questionText.trim() || isSendingQuestion}
                    >
                      <Text style={styles.editorSendText}>{isSendingQuestion ? t('session.asking') : t('session.ask')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </Modal>
            <View style={styles.quickActions}>
              <Pressable
                style={[styles.holdTalkAction, isRecordingQuestion && styles.holdTalkActionRecording]}
                onPressIn={() => void handleQuestionRecordStart()}
                onPressOut={() => void handleQuestionRecordStop()}
                onResponderTerminate={() => void handleQuestionRecordStop()}
              >
                <Text style={styles.holdTalkActionText}>{isRecordingQuestion ? t('session.releaseToWrite') : t('session.holdToTalk')}</Text>
              </Pressable>
              <TouchableOpacity
                style={[styles.primaryAction, (!questionText.trim() || isSendingQuestion) && styles.disabledAction]}
                onPress={() => void handleSendQuestion()}
                disabled={!questionText.trim() || isSendingQuestion}
              >
                <Text style={styles.primaryActionText}>{isSendingQuestion ? t('session.asking') : t('session.ask')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.endButton, isSendingQuestion && styles.disabledAction]}
              onPress={() => void persistReadingAndEnd()}
              disabled={isSendingQuestion}
            >
              <Text style={styles.endButtonText}>{t('session.endReading')}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </BrandedScrollView>

      <Modal visible={topicEditorVisible} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setTopicEditorVisible(false)}>
        <KeyboardAvoidingView
          style={styles.editorOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'android' ? 24 : 0}
        >
          <View style={styles.editorCard}>
            <Text style={styles.editorTitle}>{t('flows.topicIntentTitle')}</Text>
            <TextInput
              style={styles.editorInput}
              value={topicText}
              onChangeText={setTopicText}
              maxLength={OPTIONAL_READING_TOPIC_MAX_CHARS}
              placeholder={t('flows.astroTopicPlaceholder')}
              placeholderTextColor="rgba(255,255,255,0.35)"
              multiline
              autoFocus
              scrollEnabled
            />
            <View style={styles.editorActions}>
              <TouchableOpacity style={styles.editorGhostBtn} onPress={() => setTopicEditorVisible(false)}>
                <Text style={styles.editorGhostText}>{t('common.close')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editorSendBtn}
                onPress={() => setTopicEditorVisible(false)}
              >
                <Text style={styles.editorSendText}>{t('session.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <BrandedConfirmModal
        visible={infoModal.visible}
        title={infoModal.title}
        message={infoModal.message}
        confirmLabel={t('common.ok')}
        cancelLabel={null}
        extraActionLabel={infoModal.title === t('modals.profileInfoRequiredTitle') ? t('profile.goToProfileSettings') : null}
        onExtraAction={infoModal.title === t('modals.profileInfoRequiredTitle') ? openProfileSettings : undefined}
        onConfirm={closeInfoModal}
        onCancel={closeInfoModal}
      />
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14141E' },
  content: { padding: 18, paddingBottom: 30 },
  tokenAckRow: { marginBottom: 12 },
  sessionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  sessionHeaderText: {
    color: '#E8C49A',
    fontSize: 13,
    fontWeight: '800',
  },
  modeHeaderText: {
    fontStyle: 'italic',
  },
  panel: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(30, 30, 40, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.18)',
  },
  selectionPanelCollapsed: { paddingVertical: 12 },
  selectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  expandButtonText: { color: '#F6C38B', fontSize: 12, fontWeight: '900' },
  title: { color: '#E8C49A', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  helper: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 10 },
  sectionTitle: { color: '#E8C49A', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  loading: { color: '#FFF5E8', fontSize: 14 },
  readingScrollFrame: { maxHeight: 340, flexGrow: 0 },
  readingScroll: { flexGrow: 0 },
  readingScrollContent: { paddingBottom: 2 },
  readingText: { color: '#FFF5E8', fontSize: 15, lineHeight: 22 },
  meta: { marginTop: 12, color: 'rgba(212,165,116,0.8)', fontSize: 12 },
  precisionNote: { marginTop: 8, color: 'rgba(255,255,255,0.58)', fontSize: 12, lineHeight: 18 },
  chatBubble: {
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  userBubble: {
    borderColor: 'rgba(125,220,154,0.28)',
    backgroundColor: 'rgba(125,220,154,0.08)',
  },
  assistantBubble: {
    borderColor: 'rgba(212,165,116,0.24)',
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  chatRole: { color: '#D4A574', fontSize: 11, fontWeight: '800', marginBottom: 5 },
  chatText: { color: '#FFF5E8', fontSize: 15, lineHeight: 22 },
  questionInput: {
    minHeight: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.28)',
    backgroundColor: 'rgba(0,0,0,0.18)',
    color: '#FFF5E8',
    fontSize: 15,
    lineHeight: 22,
    padding: 12,
    marginTop: 10,
    textAlignVertical: 'top',
  },
  composePreviewText: {
    color: '#FFF5E8',
    fontSize: 15,
    lineHeight: 22,
  },
  composePreviewPlaceholder: {
    color: 'rgba(255,255,255,0.42)',
  },
  editorOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  editorCard: {
    borderRadius: 18,
    backgroundColor: '#1E1E28',
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.28)',
    padding: 14,
    maxHeight: '82%',
  },
  editorTitle: {
    color: '#E8C49A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  editorInput: {
    minHeight: 170,
    maxHeight: 260,
    borderRadius: 12,
    borderColor: 'rgba(212,165,116,0.35)',
    borderWidth: 1,
    backgroundColor: 'rgba(30,30,40,0.95)',
    color: '#FFF5E8',
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  editorActions: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  editorGhostBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.5)',
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: 'rgba(212,165,116,0.12)',
  },
  editorGhostText: {
    color: '#E8C49A',
    fontSize: 12,
    fontWeight: '700',
  },
  editorSendBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: '#D4A574',
  },
  editorSendText: {
    color: '#14141E',
    fontSize: 12,
    fontWeight: '800',
  },
  quickActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  primaryAction: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#D4A574',
    paddingVertical: 11,
    alignItems: 'center',
  },
  primaryActionText: { color: '#14141E', fontSize: 13, fontWeight: '800' },
  secondaryAction: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.45)',
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  secondaryActionText: { color: '#E8C49A', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  holdTalkAction: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    paddingVertical: 11,
    alignItems: 'center',
  },
  holdTalkActionRecording: { backgroundColor: '#FF6B6B' },
  holdTalkActionText: { color: '#14141E', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  endButton: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  endButtonText: { color: '#FFF5E8', fontSize: 13, fontWeight: '800' },
  disabledAction: { opacity: 0.55 },
  periodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 8, marginBottom: 8 },
  periodButton: {
    width: '31.6%',
    minHeight: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.24)',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodButtonSelected: {
    borderColor: '#D4A574',
    backgroundColor: 'rgba(212,165,116,0.16)',
  },
  periodButtonText: { color: '#E8C49A', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  periodButtonTextSelected: { color: '#FFF5E8' },
  topicPromptBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.24)',
    backgroundColor: 'rgba(0,0,0,0.16)',
    padding: 12,
    marginBottom: 10,
  },
  topicPromptLabel: {
    color: '#D4A574',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 5,
  },
  topicPromptText: {
    color: '#FFF5E8',
    fontSize: 14,
    lineHeight: 20,
  },
  topicPromptPlaceholder: {
    color: 'rgba(255,255,255,0.42)',
  },
  astroModeRow: { gap: 6, marginBottom: 8 },
  astroModeButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.24)',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  astroModeTitle: { color: '#E8C49A', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  floatingActionRow: {
    alignItems: 'flex-end',
    marginTop: -6,
    marginBottom: 12,
    paddingRight: 2,
  },
  floatingPrepareButton: {
    minWidth: 118,
    borderRadius: 12,
    backgroundColor: '#D4A574',
    paddingHorizontal: 18,
    paddingVertical: 11,
    alignItems: 'center',
  },
  floatingPrepareText: { color: '#14141E', fontSize: 13, fontWeight: '900' },
  refreshButton: {
    borderRadius: 12,
    backgroundColor: '#D4A574',
    paddingVertical: 11,
    alignItems: 'center',
  },
  refreshButtonText: { color: '#14141E', fontSize: 13, fontWeight: '800' },
});
