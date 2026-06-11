import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { APP_NAME, getAssistantLabel } from '../config/constants';
import { FOLLOW_UP_QUESTION_MAX_CHARS, FOLLOW_UP_QUESTION_MIN_CHARS, normalizeLimitedInput } from '../config/llmTokenPolicy';
import { AssistantLoading } from '../components/AssistantLoading';
import { BrandedPicker } from '../components/BrandedPicker';
import { BrandedConfirmModal } from '../components/BrandedConfirmModal';
import { BrandedScrollView } from '../components/BrandedScrollView';
import { SelectableFormattedText } from '../components/SelectableFormattedText';
import { TokenUsage } from '../components/TokenUsage';
import {
  createAstroRelationshipFollowUp,
  createAstroRelationshipReading,
  type AstroCompatibilityContext,
  type AstroRelationshipSubject,
} from '../services/astroEngine';
import { analyzeMemoryTranscript } from '../services/memoryAnalysisService';
import {
  applyMemoryAnalysisResult,
  appendReadingDerivedTheme,
  appendReadingSummary,
  appendUserConversationMemory,
  createProfile,
  loadAccountState,
  loadProfileMemorySnippet,
} from '../services/profileMemoryService';
import { addPersonalTokenUsage, GEMINI_FLASH_LITE_INPUT_PRICE_USD_PER_M, GEMINI_FLASH_LITE_OUTPUT_PRICE_USD_PER_M } from '../services/tokenLedgerService';
import type { AccountState, BirthInfo, ProfileGender, RelationshipPrimary, SubjectProfile } from '../types/memory';
import type { TokenUsageData } from '../types';
import { SymbolicDisclaimer } from '../components/SymbolicDisclaimer';

type Props = NativeStackScreenProps<RootStackParamList, 'AstroRelationshipReading'>;

type SubjectDraft = {
  localId: string;
  profileId: string | null;
  displayName: string;
  relationshipPrimary: RelationshipPrimary;
  relationshipFreeform: string;
  gender: ProfileGender | 'bos';
  birthDate: string;
  birthTime: string;
  birthCountry: string;
  birthCity: string;
  birthDistrict: string;
  saveProfile: boolean;
};

type FollowUpMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

const RELATIONSHIP_OPTIONS: RelationshipPrimary[] = [
  'sevgili',
  'es',
  'sevgili_adayi',
  'arkadas',
  'anne',
  'baba',
  'kardes',
  'cocuk',
  'akraba',
  'evcil_hayvan',
  'is',
  'diger',
].filter((item): item is RelationshipPrimary => item !== 'is');

const GENDER_OPTIONS: Array<ProfileGender | 'bos'> = ['bos', 'kadin', 'erkek', 'hicbiri', 'belirtmek_istemiyorum'];
function contextOptions(t: TFunction): Array<{ value: AstroCompatibilityContext; label: string }> {
  return [
    { value: 'genel', label: t('flows.contextGeneral') },
    { value: 'ask', label: t('flows.contextLove') },
    { value: 'is', label: t('flows.contextWork') },
    { value: 'ev-arkadasligi', label: t('flows.contextRoommate') },
    { value: 'dostluk', label: t('flows.contextFriendship') },
    { value: 'komsuluk', label: t('flows.contextNeighbor') },
    { value: 'aile', label: t('flows.contextFamily') },
    { value: 'diger', label: t('flows.contextOther') },
  ];
}

const EMPTY_BIRTH: BirthInfo = {
  date: null,
  time: null,
  timeKnown: false,
  location: {
    country: null,
    cityOrRegion: null,
    district: null,
    subdistrict: null,
    freeform: null,
  },
};

function makeDraft(seed: string, profile?: SubjectProfile | null): SubjectDraft {
  if (profile) {
    return {
      localId: seed,
      profileId: profile.profileId,
      displayName: profile.displayName,
      relationshipPrimary: profile.relationshipPrimary === 'kendi' ? 'arkadas' : profile.relationshipPrimary,
      relationshipFreeform: profile.relationshipFreeform || '',
      gender: profile.gender || 'bos',
      birthDate: profile.birth.date || '',
      birthTime: profile.birth.time || '',
      birthCountry: profile.birth.location.country || '',
      birthCity: profile.birth.location.cityOrRegion || '',
      birthDistrict: profile.birth.location.district || '',
      saveProfile: false,
    };
  }
  return {
    localId: seed,
    profileId: null,
    displayName: '',
    relationshipPrimary: 'arkadas',
    relationshipFreeform: '',
    gender: 'bos',
    birthDate: '',
    birthTime: '',
    birthCountry: '',
    birthCity: '',
    birthDistrict: '',
    saveProfile: false,
  };
}

// DİKKAT: labelForRelationship LLM bağlamına (roleLabel) ve okuma geçmişine
// (relationshipLabel) yazılır; bu yüzden TR sabit kalır. UI gösterimleri için
// relationshipUiLabel (i18n) kullanılır.
function labelForRelationship(value: RelationshipPrimary) {
  const labels: Record<RelationshipPrimary, string> = {
    kendi: 'Kendim',
    es: 'Eş',
    sevgili: 'Sevgili',
    eski_sevgili: 'Eski sevgili',
    sevgili_adayi: 'Sevgili adayı',
    anne: 'Anne',
    baba: 'Baba',
    kardes: 'Kardeş',
    cocuk: 'Çocuk',
    arkadas: 'Arkadaş',
    evcil_hayvan: 'Evcil hayvan',
    akraba: 'Akraba',
    diger: 'Diğer',
  };
  return labels[value];
}

function relationshipUiLabel(value: RelationshipPrimary, t: TFunction) {
  const keys: Record<RelationshipPrimary, string> = {
    kendi: 'profile.relationshipSelf',
    es: 'profile.relationshipSpouse',
    sevgili: 'profile.relationshipLover',
    eski_sevgili: 'flows.relationshipExLoverShort',
    sevgili_adayi: 'profile.relationshipLoverCandidate',
    anne: 'profile.relationshipMother',
    baba: 'profile.relationshipFather',
    kardes: 'profile.relationshipSibling',
    cocuk: 'profile.relationshipChild',
    arkadas: 'profile.relationshipFriend',
    evcil_hayvan: 'profile.relationshipPet',
    akraba: 'profile.relationshipRelative',
    diger: 'profile.relationshipOther',
  };
  return t(keys[value]);
}

function labelForGender(value: ProfileGender | 'bos', t: TFunction) {
  if (value === 'bos') return t('flows.genderEmptyOption');
  if (value === 'kadin') return t('profile.genderFemale');
  if (value === 'erkek') return t('profile.genderMale');
  if (value === 'hicbiri') return t('profile.genderNone');
  return t('profile.genderPreferNotToSay');
}

function compactSummary(text: string) {
  return text.replace(/\s+/g, ' ').trim().slice(0, 420);
}

function birthFromDraft(draft: SubjectDraft): BirthInfo {
  const cleanTime = /^\d{2}:\d{2}$/.test(draft.birthTime.trim()) ? draft.birthTime.trim() : null;
  return {
    ...EMPTY_BIRTH,
    date: draft.birthDate.trim() || null,
    time: cleanTime,
    timeKnown: Boolean(cleanTime),
    location: {
      country: draft.birthCountry.trim() || null,
      cityOrRegion: draft.birthCity.trim() || null,
      district: draft.birthDistrict.trim() || null,
      subdistrict: null,
      freeform: null,
    },
  };
}

function relationshipFreeformForDraft(draft: SubjectDraft) {
  if (draft.relationshipPrimary === 'evcil_hayvan' || draft.relationshipPrimary === 'diger') {
    return draft.relationshipFreeform.trim() || null;
  }
  return null;
}

function profileFromDraft(draft: SubjectDraft, accountId: string, fallbackId: string): SubjectProfile {
  const now = new Date().toISOString();
  return {
    profileId: draft.profileId || fallbackId,
    accountId,
    isPrimary: false,
    displayName: draft.displayName.trim(),
    relationshipPrimary: draft.relationshipPrimary,
    relationshipDetail: null,
    relationshipFreeform: relationshipFreeformForDraft(draft),
    gender: draft.gender === 'bos' ? null : draft.gender,
    birth: birthFromDraft(draft),
    chartPrecision: draft.birthTime.trim() ? 'full' : draft.birthCountry.trim() && draft.birthCity.trim() ? 'date_plus_place' : 'date_only',
    createdAt: now,
    updatedAt: now,
  };
}

function validateDrafts(drafts: SubjectDraft[], mode: 'compatibility' | 'family', t: TFunction) {
  const requiredCount = mode === 'compatibility' ? 2 : 2;
  if (drafts.length < requiredCount) return t('flows.validationMinTwo');
  const missing = drafts.find((draft) => !draft.displayName.trim() || !draft.birthDate.trim());
  if (missing) return t('flows.validationNameBirth');
  const missingPlace = drafts.find((draft) => !draft.birthCountry.trim() || !draft.birthCity.trim());
  if (missingPlace) return t('flows.validationBirthPlace');
  const invalidDate = drafts.find((draft) => draft.birthDate.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(draft.birthDate.trim()));
  if (invalidDate) return t('flows.validationDateFormat');
  const invalidTime = drafts.find((draft) => draft.birthTime.trim() && !/^\d{2}:\d{2}$/.test(draft.birthTime.trim()));
  if (invalidTime) return t('flows.validationTimeFormat');
  return null;
}

export function AstroRelationshipReadingScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { profileId, assistantId, mode } = route.params;
  const insets = useSafeAreaInsets();
  const assistantLabel = useMemo(() => getAssistantLabel(assistantId), [assistantId]);
  const [accountState, setAccountState] = useState<AccountState | null>(null);
  const [drafts, setDrafts] = useState<SubjectDraft[]>([makeDraft('a'), makeDraft('b')]);
  const [context, setContext] = useState<AstroCompatibilityContext>('genel');
  const [text, setText] = useState('');
  const [preparedSubjects, setPreparedSubjects] = useState<AstroRelationshipSubject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [followUps, setFollowUps] = useState<FollowUpMessage[]>([]);
  const [isSendingQuestion, setIsSendingQuestion] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<TokenUsageData>({ inputTokens: 0, outputTokens: 0, textInputTokens: 0, imageInputTokens: 0 });
  const [infoModal, setInfoModal] = useState({ visible: false, title: APP_NAME, message: '' });
  const [completedManualIds, setCompletedManualIds] = useState<string[]>([]);

  useEffect(() => {
    void loadAccountState().then((state) => {
      setAccountState(state);
      const selected = state.profiles.find((profile) => profile.profileId === profileId) || state.profiles[0] || null;
      if (mode === 'compatibility') {
        setDrafts([makeDraft('a', selected), makeDraft('b')]);
      } else {
        const family = [selected, ...state.profiles.filter((profile) => profile.profileId !== selected?.profileId)].filter(Boolean).slice(0, 3) as SubjectProfile[];
        setDrafts(family.length >= 2 ? family.map((profile, index) => makeDraft(`f-${index}`, profile)) : [makeDraft('f-0', selected), makeDraft('f-1')]);
      }
    });
  }, [mode, profileId]);

  useEffect(() => {
    navigation.setOptions({ title: mode === 'family' ? t('flows.familyNavTitle') : t('flows.compatibilityNavTitle') });
  }, [mode, navigation, t]);

  const updateDraft = useCallback((localId: string, patch: Partial<SubjectDraft>) => {
    setDrafts((current) => current.map((draft) => (draft.localId === localId ? { ...draft, ...patch } : draft)));
  }, []);

  const selectSavedProfile = useCallback((localId: string, selectedProfileId: string) => {
    const profile = accountState?.profiles.find((item) => item.profileId === selectedProfileId);
    if (!profile) return;
    setDrafts((current) => current.map((draft) => (draft.localId === localId ? makeDraft(localId, profile) : draft)));
    setCompletedManualIds((current) => current.filter((id) => id !== localId));
  }, [accountState]);

  const switchToManualDraft = useCallback((localId: string) => {
    updateDraft(localId, makeDraft(localId));
    setCompletedManualIds((current) => current.filter((id) => id !== localId));
  }, [updateDraft]);

  const markManualDraftComplete = useCallback((localId: string) => {
    setCompletedManualIds((current) => (current.includes(localId) ? current : [...current, localId]));
  }, []);

  const addFamilyMember = useCallback(() => {
    setDrafts((current) => [...current, makeDraft(`f-${Date.now()}`)]);
  }, []);

  const removeDraft = useCallback((localId: string) => {
    setDrafts((current) => (current.length <= 2 ? current : current.filter((draft) => draft.localId !== localId)));
    setCompletedManualIds((current) => current.filter((id) => id !== localId));
  }, []);

  const prepareSubjects = useCallback(async (): Promise<AstroRelationshipSubject[] | null> => {
    if (!accountState) return null;
    const validation = validateDrafts(drafts, mode, t);
    if (validation) {
      setInfoModal({ visible: true, title: t('flows.missingInfoTitle'), message: validation });
      return null;
    }
    let nextState = accountState;
    const subjects: AstroRelationshipSubject[] = [];
    for (const draft of drafts) {
      let profile = draft.profileId ? nextState.profiles.find((item) => item.profileId === draft.profileId) || null : null;
      if (!profile && draft.saveProfile) {
        nextState = await createProfile({
          displayName: draft.displayName.trim(),
          relationshipPrimary: draft.relationshipPrimary,
          relationshipDetail: null,
          relationshipFreeform: relationshipFreeformForDraft(draft),
          gender: draft.gender === 'bos' ? null : draft.gender,
          birth: birthFromDraft(draft),
          isPrimary: false,
        });
        profile = [...nextState.profiles].reverse().find((item) => item.displayName === draft.displayName.trim()) || null;
      }
      if (!profile) {
        profile = profileFromDraft(draft, nextState.accountId, `temporary-${draft.localId}-${Date.now()}`);
      }
      subjects.push({
        profile,
        roleLabel: labelForRelationship(profile.relationshipPrimary),
        source: draft.profileId || draft.saveProfile ? 'saved' : 'temporary',
      });
    }
    setAccountState(nextState);
    return subjects;
  }, [accountState, drafts, mode, t]);

  const readyToInterpret = useMemo(() => {
    if (isLoading || text) return false;
    if (drafts.length < 2) return false;
    return drafts.every((draft) => {
      if (draft.profileId) return true;
      return completedManualIds.includes(draft.localId) && draft.displayName.trim() && draft.birthDate.trim() && draft.birthCountry.trim() && draft.birthCity.trim();
    });
  }, [completedManualIds, drafts, isLoading, text]);

  const loadReading = useCallback(async () => {
    if (isLoading || text) return;
    const subjects = await prepareSubjects();
    if (!subjects) return;
    setIsLoading(true);
    try {
      const state = await loadAccountState();
      const memoryQuery = subjects.map((subject) => subject.profile.displayName).join(' ');
      const memorySnippet = await loadProfileMemorySnippet(state, profileId, { semanticQuery: memoryQuery }).catch(() => null);
      const subjectMemoryPairs = await Promise.all(
        subjects.map(async (subject) => {
          if (subject.source !== 'saved') return [subject.profile.profileId, null] as const;
          const snippet = await loadProfileMemorySnippet(state, subject.profile.profileId, {
            semanticQuery: `${memoryQuery} aile uyum rol iletişim kişisel eğilim`,
          }).catch(() => null);
          return [subject.profile.profileId, snippet] as const;
        }),
      );
      const subjectMemoryById = new Map(subjectMemoryPairs);
      const enrichedSubjects = subjects.map((subject) => ({
        ...subject,
        memorySnippet: subjectMemoryById.get(subject.profile.profileId) || null,
      }));
      const reading = await createAstroRelationshipReading({
        mode,
        subjects: enrichedSubjects,
        assistantId,
        assistantLabel,
        compatibilityContext: mode === 'compatibility' ? context : 'aile',
        memorySnippet,
      });
      setPreparedSubjects(enrichedSubjects);
      setText(reading.text);
      const inputTokens = reading.usage?.inputTokens || 0;
      const outputTokens = reading.usage?.outputTokens || 0;
      setTokenUsage((current) => ({
        inputTokens: current.inputTokens + inputTokens,
        outputTokens: current.outputTokens + outputTokens,
        textInputTokens: (current.textInputTokens || 0) + inputTokens,
        imageInputTokens: current.imageInputTokens || 0,
      }));
      await addPersonalTokenUsage({
        modelName: reading.modelName || 'gemini-2.5-flash-lite',
        readingName: mode === 'family' ? 'Astrolojik Aile Okuması' : 'Astrolojik Uyum Analizi',
        textInputTokens: inputTokens,
        outputTokens,
      }).catch(() => {});
    } catch (err: any) {
      setInfoModal({
        visible: true,
        title: APP_NAME,
        message: err?.message || t('flows.relationshipFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [assistantId, assistantLabel, context, isLoading, mode, prepareSubjects, profileId, t, text]);

  const handleSendQuestion = useCallback(async () => {
    const question = normalizeLimitedInput(questionText, FOLLOW_UP_QUESTION_MAX_CHARS);
    if (question.length < FOLLOW_UP_QUESTION_MIN_CHARS || !text || isSendingQuestion || !preparedSubjects.length) return;
    const previousFollowUps = followUps.map(({ role, text }) => ({ role, text }));
    setFollowUps((current) => [...current, { id: `u-${Date.now()}`, role: 'user', text: question }]);
    setQuestionText('');
    setIsSendingQuestion(true);
    try {
      await appendUserConversationMemory(profileId, question).catch(() => {});
      const state = await loadAccountState();
      const memorySnippet = await loadProfileMemorySnippet(state, profileId, { semanticQuery: question }).catch(() => null);
      const answer = await createAstroRelationshipFollowUp({
        mode,
        subjects: preparedSubjects,
        assistantId,
        assistantLabel,
        compatibilityContext: mode === 'compatibility' ? context : 'aile',
        readingText: text,
        question,
        previousFollowUps,
        memorySnippet,
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
        readingName: mode === 'family' ? 'Astrolojik Aile Sorusu' : 'Astrolojik Uyum Sorusu',
        textInputTokens: inputTokens,
        outputTokens,
      }).catch(() => {});
    } catch (err: any) {
      setInfoModal({ visible: true, title: APP_NAME, message: err?.message || t('flows.relationshipAnswerFailed') });
    } finally {
      setIsSendingQuestion(false);
    }
  }, [assistantId, assistantLabel, context, followUps, isSendingQuestion, mode, preparedSubjects, profileId, questionText, t, text]);

  const buildTranscript = useCallback(() => {
    const intro = [
      {
        role: 'user' as const,
        text:
          mode === 'family'
            ? `Astrolojik aile okuması: ${preparedSubjects.map((subject) => subject.profile.displayName).join(', ')}`
            : `Astrolojik uyum analizi (${context}): ${preparedSubjects.map((subject) => subject.profile.displayName).join(' - ')}`,
        timestamp: Date.now(),
      },
    ];
    return [
      ...intro,
      { role: 'assistant' as const, text, timestamp: Date.now() },
      ...followUps.map((message) => ({ role: message.role, text: message.text, timestamp: Date.now() })),
    ];
  }, [context, followUps, mode, preparedSubjects, text]);

  const persistReadingAndEnd = useCallback(async () => {
    if (!text || !preparedSubjects.length) return;
    const transcript = buildTranscript();
    const subjectsForHistory = preparedSubjects.map((subject) => ({
      profileId: subject.source === 'saved' ? subject.profile.profileId : null,
      displayName: subject.profile.displayName,
      relationshipLabel: labelForRelationship(subject.profile.relationshipPrimary),
      isPet: subject.profile.relationshipPrimary === 'evcil_hayvan',
    }));
    await appendReadingSummary({
      profileId,
      assistantId,
      readingType: mode === 'family' ? 'astro-family' : 'astro-compatibility',
      surfacesRead: [],
      astroRelationship: {
        mode,
        context: mode === 'compatibility' ? context : 'aile',
        subjects: subjectsForHistory,
      },
      summary: compactSummary(text),
      transcript,
    }).catch(() => {});
    await appendReadingDerivedTheme(
      profileId,
      mode === 'family' ? 'astrolojik aile okuması' : `astrolojik uyum analizi: ${context}`,
      `${mode}-${preparedSubjects.map((subject) => subject.profile.profileId).join('-')}`,
    ).catch(() => {});
    void loadAccountState()
      .then((state) => loadProfileMemorySnippet(state, profileId))
      .then((memorySnippet) =>
        analyzeMemoryTranscript({
          profileId,
          profileName: accountState?.profiles.find((profile) => profile.profileId === profileId)?.displayName || 'Profil',
          readingType: mode === 'family' ? 'astro-family' : 'astro-compatibility',
          memorySnippet,
          transcript,
        }),
      )
      .then((result) => applyMemoryAnalysisResult(profileId, result))
      .catch(() => {});
    navigation.goBack();
  }, [accountState, assistantId, buildTranscript, context, mode, navigation, preparedSubjects, profileId, text]);

  const renderSubjectDraft = (draft: SubjectDraft, index: number) => {
    const title = mode === 'family' ? t('flows.familyMemberTitle', { num: index + 1 }) : index === 0 ? t('flows.firstPerson') : t('flows.secondPerson');
    const previousDraft = drafts[index - 1];
    const waitsForPrevious =
      !draft.profileId &&
      index > 0 &&
      previousDraft &&
      !previousDraft.profileId &&
      !completedManualIds.includes(previousDraft.localId);
    const manualComplete = completedManualIds.includes(draft.localId);
    const canCompleteManual = Boolean(draft.displayName.trim() && draft.birthDate.trim());

    return (
    <View key={draft.localId} style={styles.subjectCard}>
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectTitle}>{title}</Text>
        {mode === 'family' && drafts.length > 2 ? (
          <TouchableOpacity onPress={() => removeDraft(draft.localId)}>
            <Text style={styles.removeText}>{t('flows.remove')}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {accountState?.profiles.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.profileStrip}>
          {accountState.profiles.map((profile) => (
            <TouchableOpacity
              key={profile.profileId}
              style={[styles.profileChip, draft.profileId === profile.profileId && styles.profileChipSelected]}
              onPress={() => selectSavedProfile(draft.localId, profile.profileId)}
            >
              <Text style={styles.profileChipText}>{profile.displayName}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.profileChip, !draft.profileId && styles.profileChipSelected]} onPress={() => switchToManualDraft(draft.localId)}>
            <Text style={styles.profileChipText}>{t('flows.manualEntry')}</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : null}
      {draft.profileId ? (
        <View style={styles.selectedSubjectBox}>
          <Text style={styles.selectedSubjectLabel}>{t('flows.selectedProfileLabel')}</Text>
          <Text style={styles.selectedSubjectName}>{draft.displayName}</Text>
        </View>
      ) : waitsForPrevious ? (
        <Text style={styles.miniHelper}>{t('flows.waitPreviousPerson')}</Text>
      ) : manualComplete ? (
        <View style={styles.selectedSubjectBox}>
          <Text style={styles.selectedSubjectLabel}>{t('flows.manualEntered')}</Text>
          <Text style={styles.selectedSubjectName}>{draft.displayName}</Text>
          <TouchableOpacity onPress={() => setCompletedManualIds((current) => current.filter((id) => id !== draft.localId))}>
            <Text style={styles.editSubjectText}>{t('profile.editButton')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <>
      <TextInput style={styles.input} value={draft.displayName} onChangeText={(value) => updateDraft(draft.localId, { displayName: value, profileId: null })} placeholder={t('profile.nameLabel')} placeholderTextColor="rgba(255,255,255,0.35)" />
      <BrandedPicker
        selectedValue={draft.relationshipPrimary}
        onValueChange={(value) => updateDraft(draft.localId, { relationshipPrimary: value, profileId: null })}
        options={RELATIONSHIP_OPTIONS.map((option) => ({ label: relationshipUiLabel(option, t), value: option }))}
      />
      {draft.relationshipPrimary === 'evcil_hayvan' || draft.relationshipPrimary === 'diger' ? (
        <TextInput style={styles.input} value={draft.relationshipFreeform} onChangeText={(value) => updateDraft(draft.localId, { relationshipFreeform: value, profileId: null })} placeholder={draft.relationshipPrimary === 'evcil_hayvan' ? t('flows.petTypePlaceholderFull') : t('flows.relationshipDescPlaceholder')} placeholderTextColor="rgba(255,255,255,0.35)" />
      ) : null}
      <BrandedPicker
        selectedValue={draft.gender}
        onValueChange={(value) => updateDraft(draft.localId, { gender: value, profileId: null })}
        options={GENDER_OPTIONS.map((option) => ({ label: labelForGender(option, t), value: option }))}
      />
      <TextInput style={styles.input} value={draft.birthDate} onChangeText={(value) => updateDraft(draft.localId, { birthDate: value, profileId: null })} placeholder={t('flows.birthDatePlaceholder')} placeholderTextColor="rgba(255,255,255,0.35)" />
      <TextInput style={styles.input} value={draft.birthTime} onChangeText={(value) => updateDraft(draft.localId, { birthTime: value, profileId: null })} placeholder={t('flows.birthTimePlaceholder')} placeholderTextColor="rgba(255,255,255,0.35)" />
      <Text style={styles.miniHelper}>{t('flows.birthPlaceHelper')}</Text>
      <TextInput style={styles.input} value={draft.birthCountry} onChangeText={(value) => updateDraft(draft.localId, { birthCountry: value, profileId: null })} placeholder={t('flows.countryPlaceholder')} placeholderTextColor="rgba(255,255,255,0.35)" />
      <TextInput style={styles.input} value={draft.birthCity} onChangeText={(value) => updateDraft(draft.localId, { birthCity: value, profileId: null })} placeholder={t('flows.cityPlaceholder')} placeholderTextColor="rgba(255,255,255,0.35)" />
      <TextInput style={styles.input} value={draft.birthDistrict} onChangeText={(value) => updateDraft(draft.localId, { birthDistrict: value, profileId: null })} placeholder={t('flows.districtPlaceholder')} placeholderTextColor="rgba(255,255,255,0.35)" />
      {!draft.profileId ? (
        <TouchableOpacity style={[styles.saveToggle, draft.saveProfile && styles.saveToggleActive]} onPress={() => updateDraft(draft.localId, { saveProfile: !draft.saveProfile })}>
          <Text style={styles.saveToggleText}>{draft.saveProfile ? t('flows.saveAsProfileActive') : t('flows.saveAsProfile')}</Text>
          <Text style={styles.saveToggleSub}>{t('flows.saveAsProfileSub')}</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity
        style={[styles.addSubjectButton, !canCompleteManual && styles.disabled]}
        onPress={() => markManualDraftComplete(draft.localId)}
        disabled={!canCompleteManual}
      >
        <Text style={styles.addSubjectButtonText}>{t('flows.addPerson')}</Text>
      </TouchableOpacity>
      </>
      )}
    </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <SymbolicDisclaimer />
        <BrandedScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]} keyboardShouldPersistTaps="handled" showScrollToTop>
          <TokenUsage usage={tokenUsage} inputPrice={GEMINI_FLASH_LITE_INPUT_PRICE_USD_PER_M} outputPrice={GEMINI_FLASH_LITE_OUTPUT_PRICE_USD_PER_M} />
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>{mode === 'family' ? t('flows.familyReading') : t('flows.relationshipCompatibility')}</Text>
            <Text style={styles.headerText}>{assistantLabel}</Text>
          </View>
          {!text ? (
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>{mode === 'family' ? t('flows.familyMembersTitle') : t('flows.whoCompatibilityTitle')}</Text>
              <Text style={styles.helperText}>{t('flows.relationshipHelper')}</Text>
              {mode === 'compatibility' ? (
                <View style={styles.contextBox}>
                  <Text style={styles.contextLabel}>{t('flows.compatibilityContextLabel')}</Text>
                  <BrandedPicker selectedValue={context} onValueChange={setContext} options={contextOptions(t)} />
                </View>
              ) : null}
              {drafts.map(renderSubjectDraft)}
              {mode === 'family' ? (
                <TouchableOpacity style={styles.secondaryButton} onPress={addFamilyMember}>
                  <Text style={styles.secondaryButtonText}>{t('flows.addFamilyMember')}</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity style={[styles.primaryButton, !readyToInterpret && styles.disabled]} onPress={() => void loadReading()} disabled={!readyToInterpret}>
                <Text style={styles.primaryButtonText}>{isLoading ? t('flows.preparing') : t('session.interpret')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.panel}>
                <Text style={styles.panelTitle}>{t('session.interpretation')}</Text>
                <SelectableFormattedText text={text} style={styles.readingText} />
              </View>
              <View style={styles.panel}>
                {followUps.map((message) => (
                  <View key={message.id} style={[styles.chatBubble, message.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
                    <Text style={styles.chatRole}>{message.role === 'user' ? t('session.you') : assistantLabel}</Text>
                    <SelectableFormattedText text={message.text} style={styles.chatText} />
                  </View>
                ))}
                {isSendingQuestion ? <AssistantLoading compact /> : null}
                <TextInput
                  style={styles.questionInput}
                  value={questionText}
                  onChangeText={setQuestionText}
                  maxLength={FOLLOW_UP_QUESTION_MAX_CHARS}
                  placeholder={t('session.askPlaceholder')}
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  multiline
                />
                <View style={styles.actionRow}>
                  <TouchableOpacity style={[styles.primaryButton, (!questionText.trim() || isSendingQuestion) && styles.disabled]} onPress={() => void handleSendQuestion()} disabled={!questionText.trim() || isSendingQuestion}>
                    <Text style={styles.primaryButtonText}>{isSendingQuestion ? t('session.asking') : t('session.ask')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.secondaryButton, isSendingQuestion && styles.disabled]} onPress={() => void persistReadingAndEnd()} disabled={isSendingQuestion}>
                    <Text style={styles.secondaryButtonText}>{t('session.endInterpretation')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </BrandedScrollView>
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
  content: { padding: 18, paddingBottom: 28 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12, paddingHorizontal: 4 },
  headerText: { color: '#E8C49A', fontSize: 13, fontWeight: '800' },
  panel: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(30,30,40,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.18)',
  },
  panelTitle: { color: '#E8C49A', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  helperText: { color: 'rgba(255,255,255,0.68)', fontSize: 13, lineHeight: 19, marginBottom: 10 },
  miniHelper: { color: 'rgba(255,255,255,0.52)', fontSize: 12, lineHeight: 17, marginBottom: 8 },
  contextBox: { marginBottom: 12 },
  contextLabel: { color: '#E8C49A', fontSize: 12, fontWeight: '800', marginBottom: 6 },
  subjectCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.22)',
    backgroundColor: 'rgba(0,0,0,0.16)',
    padding: 12,
    marginBottom: 12,
  },
  subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subjectTitle: { color: '#FFF5E8', fontSize: 14, fontWeight: '800' },
  removeText: { color: '#FFB4A8', fontSize: 12, fontWeight: '800' },
  profileStrip: { marginBottom: 8 },
  profileChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 6,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  profileChipSelected: { backgroundColor: 'rgba(212,165,116,0.18)', borderColor: '#D4A574' },
  profileChipText: { color: '#E8C49A', fontSize: 12, fontWeight: '700' },
  selectedSubjectBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.22)',
    backgroundColor: 'rgba(212,165,116,0.08)',
    padding: 10,
  },
  selectedSubjectLabel: { color: 'rgba(255,255,255,0.58)', fontSize: 11, fontWeight: '700', marginBottom: 3 },
  selectedSubjectName: { color: '#FFF5E8', fontSize: 14, fontWeight: '900' },
  editSubjectText: { color: '#E8C49A', fontSize: 12, fontWeight: '800', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.25)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#FFF5E8',
    backgroundColor: 'rgba(0,0,0,0.18)',
    marginBottom: 8,
  },
  saveToggle: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.28)',
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  saveToggleActive: { backgroundColor: 'rgba(125,220,154,0.13)', borderColor: 'rgba(125,220,154,0.4)' },
  saveToggleText: { color: '#FFF5E8', fontSize: 12, fontWeight: '800' },
  saveToggleSub: { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 3 },
  addSubjectButton: {
    borderRadius: 12,
    backgroundColor: '#D4A574',
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 10,
  },
  addSubjectButtonText: { color: '#14141E', fontSize: 13, fontWeight: '900' },
  readingText: { color: '#FFF5E8', fontSize: 15, lineHeight: 22 },
  chatBubble: { marginBottom: 10, borderRadius: 12, borderWidth: 1, padding: 12 },
  userBubble: { borderColor: 'rgba(125,220,154,0.28)', backgroundColor: 'rgba(125,220,154,0.08)' },
  assistantBubble: { borderColor: 'rgba(212,165,116,0.24)', backgroundColor: 'rgba(0,0,0,0.16)' },
  chatRole: { color: '#D4A574', fontSize: 11, fontWeight: '800', marginBottom: 5 },
  chatText: { color: '#FFF5E8', fontSize: 15, lineHeight: 22 },
  questionInput: {
    minHeight: 86,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.28)',
    backgroundColor: 'rgba(0,0,0,0.18)',
    color: '#FFF5E8',
    fontSize: 15,
    lineHeight: 22,
    padding: 12,
    textAlignVertical: 'top',
  },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#D4A574',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: { color: '#14141E', fontSize: 13, fontWeight: '800' },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.45)',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  secondaryButtonText: { color: '#E8C49A', fontSize: 13, fontWeight: '800' },
  disabled: { opacity: 0.55 },
});
