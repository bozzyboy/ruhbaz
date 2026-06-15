import { isModerationReplyText } from '../services/inputModerationService';
import { SymbolicDisclaimer } from '../components/SymbolicDisclaimer';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { APP_NAME, getAssistantLabel } from '../config/constants';
import { FOLLOW_UP_QUESTION_MAX_CHARS, FOLLOW_UP_QUESTION_MIN_CHARS, normalizeLimitedInput } from '../config/llmTokenPolicy';
import { AssistantLoading } from '../components/AssistantLoading';
import { BrandedConfirmModal } from '../components/BrandedConfirmModal';
import { SelectableFormattedText } from '../components/SelectableFormattedText';
import { DivinationCastView } from '../components/DivinationCastView';
import { BrandedScrollView } from '../components/BrandedScrollView';
import { TokenUsage } from '../components/TokenUsage';
import {
  applyMemoryAnalysisResult,
  appendReadingDerivedTheme,
  appendReadingSpecificityUsage,
  appendReadingSummary,
  appendUserConversationMemory,
  appendUserReadingIntentMemory,
  loadAccountState,
  loadProfileMemorySnippet,
} from '../services/profileMemoryService';
import { analyzeMemoryTranscript } from '../services/memoryAnalysisService';
import {
  castDivination,
  createPersonalDivinationFollowUp,
  createPersonalDivinationReading,
  type DivinationCast,
  type DivinationFollowUpMessage,
} from '../services/personalDivinationService';
import {
  addPersonalTokenUsage,
  GEMINI_FLASH_LITE_INPUT_PRICE_USD_PER_M,
  GEMINI_FLASH_LITE_OUTPUT_PRICE_USD_PER_M,
} from '../services/tokenLedgerService';
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
import {
  DAILY_MEMORY_WRITER_BUSY_MESSAGE,
  shouldBlockForDailyMemoryWriterMaintenance,
} from '../services/dailyMemoryWriterMaintenanceService';

type Props = NativeStackScreenProps<RootStackParamList, 'PersonalDivinationReading'>;

type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string };

// Açılış davet baloncuğu sabit id'li: okuma başlayınca listeden çıkarılır (yerini cast görseli + yorum alır).
const OPENING_MESSAGE_ID = 'opening-invite';

function makeMessage(role: 'user' | 'assistant', text: string): ChatMessage {
  return { id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role, text };
}

function compactSummary(text: string) {
  return text.replace(/\s+/g, ' ').trim().slice(0, 420);
}

function themeFromCast(cast: DivinationCast) {
  if (cast.kind === 'iching' && cast.iching) return `i-ching: ${cast.iching.present.name}`;
  if (cast.kind === 'rune' && cast.rune) return `rün: ${cast.rune.runes.map((r) => r.rune).join(', ')}`;
  return cast.kind;
}

export function PersonalDivinationReadingScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { profileId, assistantId, kind } = route.params;
  const assistantLabel = useMemo(() => getAssistantLabel(assistantId), [assistantId]);
  const modeLabel = kind === 'iching' ? t('divination.ichingMode') : t('divination.runeMode');
  const [profileName, setProfileName] = useState('');
  const [cast, setCast] = useState<DivinationCast | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [interpretationText, setInterpretationText] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isRecordingQuestion, setIsRecordingQuestion] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [speechMode, setSpeechMode] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [usedClosings, setUsedClosings] = useState<string[]>([]);
  const [tokenUsage, setTokenUsage] = useState<TokenUsageData>({ inputTokens: 0, outputTokens: 0, textInputTokens: 0, imageInputTokens: 0 });
  const [infoModal, setInfoModal] = useState<{ visible: boolean; title: string; message: string }>({ visible: false, title: APP_NAME, message: '' });
  const speechRunRef = useRef(0);
  const questionBaseRef = useRef('');
  const readingScrollRef = useRef<ScrollView>(null);
  const messageYRef = useRef<Record<string, number>>({});
  const sessionNonceRef = useRef(`${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);

  const hasInterpretation = Boolean(interpretationText);
  const isBusy = isLoadingProfile || isSending;

  useEffect(() => {
    navigation.setOptions({ title: modeLabel, headerBackVisible: !isBusy, gestureEnabled: !isBusy });
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (!isBusy) return;
      event.preventDefault();
    });
    return unsubscribe;
  }, [isBusy, modeLabel, navigation]);

  useEffect(() => {
    let mounted = true;
    void loadAccountState()
      .then((state) => {
        if (!mounted) return;
        const profile = state.profiles.find((item) => item.profileId === profileId) || null;
        if (!profile) {
          setInfoModal({ visible: true, title: APP_NAME, message: t('session.profileNotFound') });
          return;
        }
        setProfileName(profile.displayName);
        const drawn = castDivination(kind, `${profileId}:${assistantId}:${sessionNonceRef.current}`);
        setCast(drawn);
        const greet = profile.displayName ? `${t('divination.greeting', { name: profile.displayName })}\n\n` : '';
        setMessages([
          {
            id: OPENING_MESSAGE_ID,
            role: 'assistant',
            text: `${greet}${kind === 'iching' ? t('divination.openingIChing') : t('divination.openingRune')}`,
          },
        ]);
      })
      .catch((err: any) => {
        if (mounted) setInfoModal({ visible: true, title: APP_NAME, message: err?.message || t('session.profileLoadFailed') });
      })
      .finally(() => {
        if (mounted) setIsLoadingProfile(false);
      });
    return () => {
      mounted = false;
      stopAssistantSpeech();
      void stopNativeRecording();
    };
  }, [assistantId, kind, profileId, t]);

  // Okuma/cevap gelince en ALTA değil, yeni içeriğin BAŞINA scroll: ilk okumada en üst
  // (kullanıcı sorusu + cast görseli + okuma başı görünsün), sonraki cevaplarda son balonun başı.
  useEffect(() => {
    if (isLoadingProfile) return;
    const display = hasInterpretation ? messages.filter((message) => message.id !== OPENING_MESSAGE_ID) : messages;
    const last = display[display.length - 1];
    if (!last) return;
    // Durumsuz kural: son mesaj İLK asistan-okuma ise en üst (y:0) → kullanıcı sorusu + hexagram/cast + okuma başı
    // görünür. Sonraki cevaplarda son balonun başı. (Mutable bayrak yok → StrictMode/çift-render güvenli.)
    const firstAssistantIndex = display.findIndex((message) => message.role === 'assistant');
    const isFirstReading = last.role === 'assistant' && display.length - 1 === firstAssistantIndex;
    const scrollToStart = () => {
      if (isFirstReading) {
        readingScrollRef.current?.scrollTo({ y: 0, animated: true });
        return;
      }
      const y = messageYRef.current[last.id];
      if (typeof y === 'number') readingScrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
    };
    const t1 = setTimeout(scrollToStart, 0);
    const t2 = setTimeout(scrollToStart, 120);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [messages, hasInterpretation, isLoadingProfile]);

  const latestReadableText = useMemo(() => {
    const lastAssistant = [...messages].reverse().find((message) => message.role === 'assistant');
    return lastAssistant?.text || '';
  }, [messages]);

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
      if (!isAssistantSpeaking()) setSpeechMode('idle');
    });
  }, [latestReadableText, speechMode]);

  const addUsage = useCallback(async (readingName: string, result: { modelName?: string; usage: { inputTokens: number; outputTokens: number } }) => {
    const inputTokens = result.usage.inputTokens || 0;
    const outputTokens = result.usage.outputTokens || 0;
    setTokenUsage((current) => ({
      inputTokens: current.inputTokens + inputTokens,
      outputTokens: current.outputTokens + outputTokens,
      textInputTokens: (current.textInputTokens || 0) + inputTokens,
      imageInputTokens: current.imageInputTokens || 0,
    }));
    await addPersonalTokenUsage({
      modelName: result.modelName || 'gemini-2.5-flash-lite',
      readingName,
      textInputTokens: inputTokens,
      outputTokens,
    }).catch(() => {});
  }, []);

  const handleSend = useCallback(async () => {
    const text = normalizeLimitedInput(questionText, FOLLOW_UP_QUESTION_MAX_CHARS);
    // İlk okumada konu/soru opsiyoneldir (boş bırakılırsa genel okuma); takip sorusunda metin zorunlu ve min uzunlukta olmalı.
    if (isSending || isLoadingProfile || !cast) return;
    if (hasInterpretation && text.length < FOLLOW_UP_QUESTION_MIN_CHARS) return;
    if (text) setMessages((current) => [...current, makeMessage('user', text)]);
    setQuestionText('');
    setEditorVisible(false);
    setIsSending(true);
    try {
      if (await shouldBlockForDailyMemoryWriterMaintenance()) {
        setInfoModal({ visible: true, title: t('flows.memoryMaintenanceTitle'), message: DAILY_MEMORY_WRITER_BUSY_MESSAGE });
        return;
      }
      const state = await loadAccountState();
      const profile = state.profiles.find((item) => item.profileId === profileId) || null;
      if (!profile) throw new Error(t('session.profileNotFound'));
      const readingName = kind === 'iching' ? 'I-Ching Okuması' : 'Rün Okuması';
      if (!hasInterpretation) {
        // Okuma öncesi konu/niyet girildiyse güçlü userStated 'okuma öncesi konu' olarak yazılır (astro/tarot ile aynı yol);
        // hem bu okumaya hem sonraki okumaların hafıza bağlamına yansır. Boşsa genel okuma yapılır, hafızaya yazılmaz.
        if (text) {
          await appendUserReadingIntentMemory({
            profileId,
            text,
            readingType: kind === 'iching' ? 'personal-iching' : 'personal-rune',
          }).catch(() => {});
        }
        // Niyet YAZILDIKTAN sonra snippet yükle (tarot paritesi): bu okumanın hafıza bağlamı yeni konuyu da içersin.
        const memoryState = text ? await loadAccountState().catch(() => state) : state;
        const memorySnippet = await loadProfileMemorySnippet(memoryState, profileId, text ? { semanticQuery: text } : undefined).catch(() => null);
        const result = await createPersonalDivinationReading({
          profile,
          assistantId,
          assistantLabel,
          kind,
          cast,
          question: text || undefined,
          memorySnippet,
          usedClosings,
        });
        setInterpretationText(result.text);
        setMessages((current) => [...current, makeMessage('assistant', result.text)]);
        if (result.closingSentence) setUsedClosings((current) => [...current, result.closingSentence]);
        if (result.specificityUsage?.events?.length) {
          await appendReadingSpecificityUsage(profileId, result.specificityUsage).catch(() => {});
        }
        await addUsage(readingName, result);
      } else {
        await appendUserConversationMemory(profileId, text).catch(() => {});
        const memoryState = await loadAccountState().catch(() => state);
        const memorySnippet = await loadProfileMemorySnippet(memoryState, profileId, { semanticQuery: text }).catch(() => null);
        const previousFollowUps: DivinationFollowUpMessage[] = messages
          .filter((message) => message.text !== interpretationText)
          .map(({ role, text: messageText }) => ({ role, text: messageText }));
        const result = await createPersonalDivinationFollowUp({
          profileName: profileName || profile.displayName,
          assistantId,
          assistantLabel,
          kind,
          cast,
          readingText: interpretationText,
          question: text,
          previousFollowUps,
          memorySnippet,
          usedClosings,
        });
        setMessages((current) => [...current, makeMessage('assistant', result.text)]);
        if (result.closingSentence) setUsedClosings((current) => [...current, result.closingSentence]);
        await addUsage(`${readingName} - Soru`, result);
      }
      setSpeechMode('idle');
    } catch (err: any) {
      setInfoModal({ visible: true, title: APP_NAME, message: err?.message || t('flows.readingFailed') });
    } finally {
      setIsSending(false);
    }
  }, [
    addUsage,
    assistantId,
    assistantLabel,
    cast,
    hasInterpretation,
    interpretationText,
    isLoadingProfile,
    isSending,
    kind,
    messages,
    profileId,
    profileName,
    questionText,
    t,
    usedClosings,
  ]);

  const persistReadingAndEnd = useCallback(async () => {
    if (!interpretationText) {
      navigation.goBack();
      return;
    }
    if (isModerationReplyText(interpretationText)) {
      stopAssistantSpeech();
      await stopNativeRecording().catch(() => {});
      navigation.goBack();
      return;
    }
    stopAssistantSpeech();
    await stopNativeRecording().catch(() => {});
    const transcript = messages.map((message) => ({ role: message.role, text: message.text, timestamp: Date.now() }));
    await appendReadingSummary({
      profileId,
      assistantId,
      readingType: kind === 'iching' ? 'personal-iching' : 'personal-rune',
      surfacesRead: [],
      summary: compactSummary(interpretationText),
      transcript,
    }).catch(() => {});
    if (cast) await appendReadingDerivedTheme(profileId, themeFromCast(cast), `${kind}-${Date.now()}`).catch(() => {});
    void loadAccountState()
      .then((state) => loadProfileMemorySnippet(state, profileId))
      .then((memorySnippet) =>
        analyzeMemoryTranscript({
          profileId,
          profileName: profileName || 'Profil',
          readingType: kind === 'iching' ? 'personal-iching' : 'personal-rune',
          memorySnippet,
          transcript,
        }),
      )
      .then((result) => applyMemoryAnalysisResult(profileId, result))
      .catch(() => {});
    navigation.goBack();
  }, [assistantId, cast, interpretationText, kind, messages, navigation, profileId, profileName]);

  const mergeQuestionTranscript = useCallback((transcript: string) => {
    const cleaned = transcript.replace(/\s+/g, ' ').trim();
    const base = questionBaseRef.current;
    setQuestionText(base && cleaned ? `${base} ${cleaned}` : cleaned || base);
  }, []);

  const handleQuestionRecordStart = useCallback(async () => {
    if (isRecordingQuestion || isSending) return;
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
        if (message) setInfoModal({ visible: true, title: APP_NAME, message });
      });
    } catch (err: any) {
      setIsRecordingQuestion(false);
      setInfoModal({ visible: true, title: APP_NAME, message: err?.message || t('session.voiceTypingStartFailed') });
    }
  }, [isRecordingQuestion, isSending, mergeQuestionTranscript, questionText, speechMode, t]);

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
        <View style={styles.content}>
          <View style={styles.tokenAckRow}>
            <TokenUsage
              usage={tokenUsage}
              inputPrice={GEMINI_FLASH_LITE_INPUT_PRICE_USD_PER_M}
              outputPrice={GEMINI_FLASH_LITE_OUTPUT_PRICE_USD_PER_M}
            />
          </View>
          <View style={styles.sessionHeaderRow}>
            <Text style={styles.sessionHeaderText}>{profileName || t('session.profileFallback')}</Text>
            <Text style={[styles.sessionHeaderText, styles.modeHeaderText]}>{modeLabel}</Text>
            <Text style={styles.sessionHeaderText}>{assistantLabel}</Text>
          </View>

          <View style={[styles.panel, styles.readingPanel]}>
            <BrandedScrollView
              ref={readingScrollRef}
              containerStyle={styles.readingScrollFrame}
              style={styles.readingScroll}
              contentContainerStyle={styles.readingScrollContent}
              nestedScrollEnabled
              indicatorMode="box"
            >
              {isLoadingProfile ? (
                <AssistantLoading label={t('divination.openingLoading')} detail={t('session.pleaseWait')} />
              ) : (
                <>
                  {(() => {
                    const displayMessages = hasInterpretation
                      ? messages.filter((message) => message.id !== OPENING_MESSAGE_ID)
                      : messages;
                    // Cast görseli (hexagram/rün) kullanıcı konu balonunun ALTINDA, ilk okuma balonunun ÜSTÜNDE render olsun.
                    const firstReadingIndex = displayMessages.findIndex((message) => message.role === 'assistant');
                    return displayMessages.map((message, index) => (
                      <React.Fragment key={message.id}>
                        {hasInterpretation && cast && index === firstReadingIndex ? <DivinationCastView cast={cast} /> : null}
                        <View
                          style={[styles.chatBubble, message.role === 'user' ? styles.userBubble : styles.assistantBubble]}
                          onLayout={(event) => {
                            messageYRef.current[message.id] = event.nativeEvent.layout.y;
                          }}
                        >
                          <Text style={styles.chatRole}>{message.role === 'user' ? t('session.you') : assistantLabel}</Text>
                          <SelectableFormattedText text={message.text} style={styles.chatText} />
                        </View>
                      </React.Fragment>
                    ));
                  })()}
                </>
              )}
              {isSending ? <AssistantLoading compact /> : null}
            </BrandedScrollView>
          </View>

          <View style={styles.readActionsBar}>
            <TouchableOpacity style={styles.secondaryAction} onPress={handlePhoneRead} disabled={!latestReadableText.trim()}>
              <Text style={styles.secondaryActionText}>{speechMode === 'playing' ? t('session.pause') : t('session.phoneRead')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryAction, styles.disabledAction]} disabled>
              <Text style={styles.secondaryActionText}>{t('session.assistantRead', { assistant: assistantLabel })}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.panel, styles.questionPanel]}>
            {!hasInterpretation ? (
              <View style={styles.topicIntro}>
                <Text style={styles.topicIntroTitle}>{t('divination.topicStepTitle')}</Text>
                <Text style={styles.topicIntroHelper}>{t('divination.topicStepHelper')}</Text>
              </View>
            ) : null}
            <TouchableOpacity style={styles.questionInput} activeOpacity={0.88} onPress={() => setEditorVisible(true)}>
              <Text style={[styles.composePreviewText, !questionText.trim() && styles.composePreviewPlaceholder]}>
                {questionText.trim() || t('divination.askPlaceholder')}
              </Text>
            </TouchableOpacity>
            <Modal visible={editorVisible} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setEditorVisible(false)}>
              <KeyboardAvoidingView
                style={styles.editorOverlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'android' ? 24 : 0}
              >
                <View style={styles.editorCard}>
                  <Text style={styles.editorTitle}>{hasInterpretation ? t('session.editQuestionTitle') : t('divination.editTitle')}</Text>
                  <TextInput
                    style={styles.editorInput}
                    value={questionText}
                    onChangeText={setQuestionText}
                    maxLength={FOLLOW_UP_QUESTION_MAX_CHARS}
                    placeholder={hasInterpretation ? t('session.editQuestionPlaceholder') : t('divination.askPlaceholder')}
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
                      style={[styles.editorSendBtn, (isSending || isLoadingProfile || (hasInterpretation && !questionText.trim())) && styles.disabledAction]}
                      onPress={() => void handleSend()}
                      disabled={isSending || isLoadingProfile || (hasInterpretation && !questionText.trim())}
                    >
                      <Text style={styles.editorSendText}>{isSending ? t('session.interpreting') : hasInterpretation ? t('session.ask') : t('divination.startReading')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </Modal>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.holdTalkAction, isRecordingQuestion && styles.holdTalkActionRecording]}
                onPressIn={() => void handleQuestionRecordStart()}
                onPressOut={() => void handleQuestionRecordStop()}
                disabled={isSending || isLoadingProfile}
              >
                <Text style={styles.holdTalkActionText}>{isRecordingQuestion ? t('session.releaseToWrite') : t('session.holdToTalk')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryAction, (isSending || isLoadingProfile || (hasInterpretation && !questionText.trim())) && styles.disabledAction]}
                onPress={() => void handleSend()}
                disabled={isSending || isLoadingProfile || (hasInterpretation && !questionText.trim())}
              >
                <Text style={styles.primaryActionText}>{isSending ? t('session.interpreting') : hasInterpretation ? t('session.ask') : t('divination.startReading')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.endButton, (isSending || !hasInterpretation) && styles.disabledAction]}
              onPress={() => void persistReadingAndEnd()}
              disabled={isSending || !hasInterpretation}
            >
              <Text style={styles.endButtonText}>{t('session.endInterpretation')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <BrandedConfirmModal
          visible={infoModal.visible}
          title={infoModal.title}
          message={infoModal.message}
          confirmLabel={t('common.ok')}
          cancelLabel={t('common.close')}
          onConfirm={() => setInfoModal({ visible: false, title: APP_NAME, message: '' })}
          onCancel={() => setInfoModal({ visible: false, title: APP_NAME, message: '' })}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14141E' },
  content: { flex: 1, padding: 18, paddingBottom: 12 },
  tokenAckRow: { marginBottom: 12 },
  sessionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 6 },
  sessionHeaderText: { color: '#E8C49A', fontSize: 13, fontWeight: '800' },
  modeHeaderText: { fontStyle: 'italic' },
  panel: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(30, 30, 40, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.18)',
  },
  readingPanel: { flex: 1, minHeight: 0 },
  readingScrollFrame: { flex: 1 },
  readingScroll: { flex: 1 },
  readingScrollContent: { paddingBottom: 8 },
  questionPanel: { marginBottom: 0 },
  readActionsBar: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  chatBubble: { marginBottom: 10, borderRadius: 12, borderWidth: 1, padding: 12 },
  userBubble: { borderColor: 'rgba(125,220,154,0.28)', backgroundColor: 'rgba(125,220,154,0.08)' },
  assistantBubble: { borderColor: 'rgba(212,165,116,0.24)', backgroundColor: 'rgba(0,0,0,0.16)' },
  chatRole: { color: '#D4A574', fontSize: 11, fontWeight: '800', marginBottom: 5 },
  chatText: { color: '#FFF5E8', fontSize: 15, lineHeight: 22 },
  questionInput: {
    minHeight: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.28)',
    backgroundColor: 'rgba(0,0,0,0.18)',
    padding: 12,
    marginTop: 10,
  },
  composePreviewText: { color: '#FFF5E8', fontSize: 15, lineHeight: 22 },
  composePreviewPlaceholder: { color: 'rgba(255,255,255,0.42)' },
  topicIntro: { marginBottom: 2 },
  topicIntroTitle: { color: '#E8C49A', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  topicIntroHelper: { color: 'rgba(255,255,255,0.66)', fontSize: 12, lineHeight: 17 },
  editorOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.55)', paddingTop: 20, paddingBottom: 20, paddingHorizontal: 10 },
  editorCard: { borderRadius: 18, backgroundColor: '#1E1E28', borderWidth: 1, borderColor: 'rgba(212,165,116,0.28)', padding: 14, maxHeight: '82%' },
  editorTitle: { color: '#E8C49A', fontSize: 14, fontWeight: '700', marginBottom: 8 },
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
  editorActions: { marginTop: 10, flexDirection: 'row', gap: 10 },
  editorGhostBtn: { flex: 1, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(212,165,116,0.5)', paddingVertical: 11, alignItems: 'center', backgroundColor: 'rgba(212,165,116,0.12)' },
  editorGhostText: { color: '#E8C49A', fontSize: 12, fontWeight: '700' },
  editorSendBtn: { flex: 1, borderRadius: 10, paddingVertical: 11, alignItems: 'center', backgroundColor: '#D4A574' },
  editorSendText: { color: '#14141E', fontSize: 12, fontWeight: '800' },
  quickActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  primaryAction: { flex: 1, borderRadius: 12, backgroundColor: '#D4A574', paddingVertical: 11, alignItems: 'center' },
  primaryActionText: { color: '#14141E', fontSize: 13, fontWeight: '800' },
  secondaryAction: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212,165,116,0.45)', paddingVertical: 11, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.12)' },
  secondaryActionText: { color: '#E8C49A', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  holdTalkAction: { flex: 1, borderRadius: 12, backgroundColor: '#4CAF50', paddingVertical: 11, alignItems: 'center' },
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
});
