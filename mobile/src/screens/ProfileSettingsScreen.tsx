import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { getAppLanguage, setAppLanguage, type AppLanguage } from '../i18n';
import type { RootStackParamList } from '../../App';
import { BrandedPicker } from '../components/BrandedPicker';
import { BrandedConfirmModal } from '../components/BrandedConfirmModal';
import { BrandedScrollView } from '../components/BrandedScrollView';
import { TURKEY_CITY_OPTIONS, TURKEY_DISTRICTS_BY_CITY } from '../data/turkeyLocations';
import { WORLD_COUNTRIES, WORLD_CITIES_BY_COUNTRY } from '../data/worldLocations';
import { countryCodeFromName } from '../services/astroLocationService';
import { moderateUserInput } from '../services/inputModerationService';
import {
  exportBackupToUserFolder,
  importBackupFromUri,
  listBackupsInUserFolder,
  wipeAllLocalData,
} from '../services/dataPortabilityService';
import {
  createProfile,
  deleteProfile,
  getPrimaryProfile,
  loadAccountState,
  updateProfile,
} from '../services/profileMemoryService';
import type {
  AccountState,
  BirthInfo,
  ProfileGender,
  RelationshipPrimary,
  RelationshipRelativeDetail,
  SubjectProfile,
} from '../types/memory';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSettings'>;

type ProfileDraft = {
  profileId: string | null;
  displayName: string;
  relationshipPrimary: RelationshipPrimary;
  relationshipDetail: RelationshipRelativeDetail;
  relationshipFreeform: string;
  gender: ProfileGender | 'bos';
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
  birthCountry: string;
  birthCity: string;
  birthDistrict: string;
};

const RELATIVE_DETAILS: RelationshipRelativeDetail[] = [
  'teyze',
  'dayi',
  'hala',
  'amca',
  'kuzen',
  'dede',
  'nine',
  'anneanne',
  'babaanne',
  'torun',
  'yegen',
  'diger_akraba',
];

const RELATIONSHIP_OPTIONS: RelationshipPrimary[] = [
  'kendi',
  'es',
  'sevgili',
  'eski_sevgili',
  'sevgili_adayi',
  'anne',
  'baba',
  'kardes',
  'cocuk',
  'arkadas',
  'evcil_hayvan',
  'akraba',
  'diger',
];

const GENDER_OPTIONS: Array<ProfileGender | 'bos'> = [
  'bos',
  'kadin',
  'erkek',
  'hicbiri',
  'belirtmek_istemiyorum',
];

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

const YEAR_OPTIONS = Array.from({ length: 90 }, (_, index) => String(new Date().getFullYear() - index));
const MONTH_OPTIONS = [
  { value: '01', labelKey: 'profile.monthJanuary' },
  { value: '02', labelKey: 'profile.monthFebruary' },
  { value: '03', labelKey: 'profile.monthMarch' },
  { value: '04', labelKey: 'profile.monthApril' },
  { value: '05', labelKey: 'profile.monthMay' },
  { value: '06', labelKey: 'profile.monthJune' },
  { value: '07', labelKey: 'profile.monthJuly' },
  { value: '08', labelKey: 'profile.monthAugust' },
  { value: '09', labelKey: 'profile.monthSeptember' },
  { value: '10', labelKey: 'profile.monthOctober' },
  { value: '11', labelKey: 'profile.monthNovember' },
  { value: '12', labelKey: 'profile.monthDecember' },
];
const DAY_OPTIONS = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, '0'));
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));
const DISTRICT_OTHER_VALUE = '__other__';
const CITY_OTHER_VALUE = '__city_other__';

/** Cihaz locale'inden ülke kodu (ISO alpha-2 küçük harf) — ülke listesinde en başa alınır. */
function deviceCountryCode(): string | null {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || '';
    const match = locale.match(/[-_]([A-Za-z]{2})(?:[-_]|$)/);
    return match ? match[1].toLowerCase() : null;
  } catch {
    return null;
  }
}

/** ISO kod → aktif dilde ülke adı (location.country'de saklanır + gösterilir). Bilinmeyen olduğu gibi döner. */
function countryDisplayName(code: string): string {
  const c = code.trim();
  if (!c) return '';
  const match = WORLD_COUNTRIES.find((item) => item.code === c);
  if (match) return getAppLanguage() === 'en' ? match.nameEn : match.nameTr;
  return c;
}

function sortTurkishLabels<T extends string>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => a.localeCompare(b, 'tr-TR', { sensitivity: 'base' }));
}

function labelForRelationship(value: RelationshipPrimary, t: TFunction) {
  switch (value) {
    case 'kendi':
      return t('profile.relationshipSelf');
    case 'es':
      return t('profile.relationshipSpouse');
    case 'sevgili':
      return t('profile.relationshipLover');
    case 'eski_sevgili':
      return t('profile.relationshipExLover');
    case 'sevgili_adayi':
      return t('profile.relationshipLoverCandidate');
    case 'anne':
      return t('profile.relationshipMother');
    case 'baba':
      return t('profile.relationshipFather');
    case 'kardes':
      return t('profile.relationshipSibling');
    case 'cocuk':
      return t('profile.relationshipChild');
    case 'arkadas':
      return t('profile.relationshipFriend');
    case 'evcil_hayvan':
      return t('profile.relationshipPet');
    case 'akraba':
      return t('profile.relationshipRelative');
    case 'diger':
      return t('profile.relationshipOther');
  }
}

function labelForRelative(value: RelationshipRelativeDetail, t: TFunction) {
  if (value === 'diger_akraba') return t('profile.relativeOther');
  const labelKeys: Record<RelationshipRelativeDetail, string> = {
    teyze: 'profile.relativeAuntMaternal',
    dayi: 'profile.relativeUncleMaternal',
    hala: 'profile.relativeAuntPaternal',
    amca: 'profile.relativeUnclePaternal',
    kuzen: 'profile.relativeCousin',
    dede: 'profile.relativeGrandfather',
    nine: 'profile.relativeGrandmother',
    anneanne: 'profile.relativeGrandmotherMaternal',
    babaanne: 'profile.relativeGrandmotherPaternal',
    torun: 'profile.relativeGrandchild',
    yegen: 'profile.relativeNiece',
    diger_akraba: 'profile.relativeOther',
  };
  return t(labelKeys[value]);
}

function labelForGender(value: ProfileGender | 'bos', t: TFunction) {
  switch (value) {
    case 'bos':
      return t('profile.genderSelect');
    case 'kadin':
      return t('profile.genderFemale');
    case 'erkek':
      return t('profile.genderMale');
    case 'hicbiri':
      return t('profile.genderNone');
    case 'belirtmek_istemiyorum':
      return t('profile.genderPreferNotToSay');
  }
}

function profileBadge(profile: SubjectProfile, t: TFunction) {
  if (profile.relationshipPrimary === 'evcil_hayvan') {
    return profile.relationshipFreeform || t('profile.relationshipPet');
  }
  if (profile.relationshipPrimary !== 'akraba') {
    return labelForRelationship(profile.relationshipPrimary, t);
  }
  if (profile.relationshipDetail === 'diger_akraba') {
    return profile.relationshipFreeform || t('profile.relationshipRelative');
  }
  return profile.relationshipDetail ? labelForRelative(profile.relationshipDetail, t) : t('profile.relationshipRelative');
}

function emptyDraft(isPrimary: boolean): ProfileDraft {
  return {
    profileId: null,
    displayName: '',
    relationshipPrimary: isPrimary ? 'kendi' : 'arkadas',
    relationshipDetail: 'teyze',
    relationshipFreeform: '',
    gender: 'bos',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: '',
    birthMinute: '',
    birthCountry: '',
    birthCity: '',
    birthDistrict: '',
  };
}

function draftFromProfile(profile: SubjectProfile): ProfileDraft {
  const [birthYear = '', birthMonth = '', birthDay = ''] = (profile.birth.date || '').split('-');
  const [birthHour = '', birthMinute = ''] = (profile.birth.time || '').split(':');
  return {
    profileId: profile.profileId,
    displayName: profile.displayName,
    relationshipPrimary: profile.relationshipPrimary,
    relationshipDetail: profile.relationshipDetail || 'teyze',
    relationshipFreeform: profile.relationshipFreeform || '',
    gender: profile.gender || 'bos',
    birthYear,
    birthMonth,
    birthDay,
    birthHour,
    birthMinute,
    birthCountry: countryCodeFromName(profile.birth.location.country),
    birthCity: profile.birth.location.cityOrRegion || '',
    birthDistrict: profile.birth.location.district || '',
  };
}

function buildBirthInfo(draft: ProfileDraft): BirthInfo {
  const date =
    draft.birthYear && draft.birthMonth && draft.birthDay
      ? `${draft.birthYear}-${draft.birthMonth}-${draft.birthDay}`
      : null;
  const time = draft.birthHour && draft.birthMinute ? `${draft.birthHour}:${draft.birthMinute}` : null;
  const district = draft.birthDistrict === DISTRICT_OTHER_VALUE ? null : draft.birthDistrict.trim() || null;

  return {
    ...EMPTY_BIRTH,
    date,
    time,
    timeKnown: Boolean(time),
    location: {
      country: countryDisplayName(draft.birthCountry) || null,
      cityOrRegion: draft.birthCity === CITY_OTHER_VALUE ? null : draft.birthCity.trim() || null,
      district,
      subdistrict: null,
      freeform: null,
    },
  };
}

function needsRelationshipFreeform(draft: ProfileDraft) {
  return (
    draft.relationshipPrimary === 'diger' ||
    draft.relationshipPrimary === 'evcil_hayvan' ||
    (draft.relationshipPrimary === 'akraba' && draft.relationshipDetail === 'diger_akraba')
  );
}

function pickerValue(value: string) {
  return value || 'sec';
}

function isTurkeyCountry(value: string) {
  // value artık ISO kod (draft.birthCountry); eski etiketler için de güvenli.
  return value === 'tr' || countryCodeFromName(value) === 'tr';
}

function sortProfiles(profiles: SubjectProfile[], primaryProfileId: string | null) {
  return [...profiles].sort((a, b) => {
    const aSelf = a.profileId === primaryProfileId || a.relationshipPrimary === 'kendi' || a.isPrimary;
    const bSelf = b.profileId === primaryProfileId || b.relationshipPrimary === 'kendi' || b.isPrimary;
    if (aSelf !== bSelf) return aSelf ? -1 : 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

export function ProfileSettingsScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const [state, setState] = useState<AccountState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>(emptyDraft(true));
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [validationModal, setValidationModal] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });
  // Dil tercihi (Faz 4 i18n): vurgu doğrudan i18n.language'dan türetilir;
  // useTranslation languageChanged'de zaten yeniden render eder.
  const appLanguage: AppLanguage = getAppLanguage();
  const handleLanguageChange = useCallback(async (language: AppLanguage) => {
    await setAppLanguage(language);
  }, []);

  // K40 veri taşınabilirliği + KVKK silme akış durumları
  const [dataBusy, setDataBusy] = useState(false);
  const [restoreCandidate, setRestoreCandidate] = useState<{ uri: string; name: string } | null>(null);
  const [wipeStep, setWipeStep] = useState<0 | 1 | 2>(0);
  const requestedProfileOpenedRef = useRef(false);

  const showDataMessage = useCallback((message: string) => {
    setValidationModal({ visible: true, message });
  }, []);

  const handleExportBackup = useCallback(async () => {
    if (dataBusy) return;
    setDataBusy(true);
    try {
      const result = await exportBackupToUserFolder();
      if (result.ok) {
        showDataMessage(t('profile.backupDoneMessage', { file: result.fileName, count: result.fileCount }));
      } else if (result.reason === 'error') {
        showDataMessage(t('profile.backupFailedMessage', { error: result.message || t('profile.unknownError') }));
      }
    } finally {
      setDataBusy(false);
    }
  }, [dataBusy, showDataMessage]);

  const handlePickRestore = useCallback(async () => {
    if (dataBusy) return;
    setDataBusy(true);
    try {
      const result = await listBackupsInUserFolder();
      if (!result.ok) {
        if (result.reason === 'error') {
          showDataMessage(t('profile.backupListFailedMessage', { error: result.message || t('profile.unknownError') }));
        }
        return;
      }
      if (!result.backups.length) {
        showDataMessage(t('profile.backupNotFoundMessage'));
        return;
      }
      setRestoreCandidate(result.backups[0]);
    } finally {
      setDataBusy(false);
    }
  }, [dataBusy, showDataMessage, t]);

  const handleConfirmRestore = useCallback(async () => {
    const candidate = restoreCandidate;
    setRestoreCandidate(null);
    if (!candidate) return;
    setDataBusy(true);
    try {
      const result = await importBackupFromUri(candidate.uri);
      if (result.ok) {
        showDataMessage(t('profile.restoreDoneMessage', { count: result.fileCount }));
      } else {
        showDataMessage(t('profile.restoreFailedMessage', { error: result.message || t('profile.invalidFile') }));
      }
    } finally {
      setDataBusy(false);
    }
  }, [restoreCandidate, showDataMessage]);

  const handleConfirmWipe = useCallback(async () => {
    setWipeStep(0);
    setDataBusy(true);
    try {
      const result = await wipeAllLocalData();
      if (result.ok) {
        showDataMessage(t('profile.wipeDoneMessage'));
      } else {
        showDataMessage(t('profile.wipeFailedMessage', { error: result.message || t('profile.unknownError') }));
      }
    } finally {
      setDataBusy(false);
    }
  }, [showDataMessage, t]);

  const primaryProfile = state ? getPrimaryProfile(state) : null;
  const selectedProfile = useMemo(
    () => state?.profiles.find((profile) => profile.profileId === selectedProfileId) || null,
    [selectedProfileId, state],
  );
  const deleteTargetProfile = useMemo(
    () => state?.profiles.find((profile) => profile.profileId === profileDraft.profileId) || null,
    [profileDraft.profileId, state],
  );
  const editingExistingProfile = Boolean(profileDraft.profileId);
  const editingIsPrimary = profileDraft.profileId
    ? state?.profiles.find((profile) => profile.profileId === profileDraft.profileId)?.isPrimary || false
    : !primaryProfile;
  const deletingPrimaryProfile = Boolean(
    deleteTargetProfile &&
      (deleteTargetProfile.isPrimary ||
        deleteTargetProfile.profileId === state?.primaryProfileId ||
        deleteTargetProfile.relationshipPrimary === 'kendi'),
  );
  const isTurkeyBirthCountry = isTurkeyCountry(profileDraft.birthCountry);
  const turkeyCities = useMemo<string[]>(() => sortTurkishLabels(TURKEY_CITY_OPTIONS), []);
  const selectedCityDistricts = useMemo(
    () => (isTurkeyBirthCountry ? sortTurkishLabels(TURKEY_DISTRICTS_BY_CITY[profileDraft.birthCity] || []) : []),
    [isTurkeyBirthCountry, profileDraft.birthCity],
  );
  const districtIsKnown =
    Boolean(profileDraft.birthDistrict) && selectedCityDistricts.includes(profileDraft.birthDistrict);
  const showDistrictFreeform =
    isTurkeyBirthCountry &&
    Boolean(profileDraft.birthCity) &&
    (profileDraft.birthDistrict === DISTRICT_OTHER_VALUE || (Boolean(profileDraft.birthDistrict) && !districtIsKnown));
  // E1 (K-4=B): tüm dünya için lokalize ülke listesi (cihaz ülkesi başa) + ülkeye göre büyük şehir dropdown.
  const countryOptions = useMemo(() => {
    const lang = getAppLanguage();
    const opts = WORLD_COUNTRIES.map((item) => ({ value: item.code, label: lang === 'en' ? item.nameEn : item.nameTr }));
    opts.sort((a, b) => a.label.localeCompare(b.label, lang === 'en' ? 'en-US' : 'tr-TR', { sensitivity: 'base' }));
    const device = deviceCountryCode();
    if (device) {
      const idx = opts.findIndex((item) => item.value === device);
      if (idx > 0) {
        const [first] = opts.splice(idx, 1);
        opts.unshift(first);
      }
    }
    return opts;
  }, [t]);
  const worldCityOptions = useMemo(() => {
    if (isTurkeyBirthCountry || !profileDraft.birthCountry) return [] as { value: string; label: string }[];
    const lang = getAppLanguage();
    const list = WORLD_CITIES_BY_COUNTRY[profileDraft.birthCountry] || [];
    return list
      .map((item) => {
        const name = lang === 'en' ? item.nameEn : item.nameTr;
        return { value: name, label: name };
      })
      .sort((a, b) => a.label.localeCompare(b.label, lang === 'en' ? 'en-US' : 'tr-TR', { sensitivity: 'base' }));
  }, [isTurkeyBirthCountry, profileDraft.birthCountry, t]);
  const hasWorldCities = worldCityOptions.length > 0;
  const cityIsKnownWorld = hasWorldCities && worldCityOptions.some((item) => item.value === profileDraft.birthCity);
  const showCityFreeform =
    !isTurkeyBirthCountry &&
    hasWorldCities &&
    (profileDraft.birthCity === CITY_OTHER_VALUE || (Boolean(profileDraft.birthCity) && !cityIsKnownWorld));

  const loadState = useCallback(async () => {
    setIsLoading(true);
    try {
      const next = await loadAccountState();
      const sorted = sortProfiles(next.profiles, next.primaryProfileId);
      const sortedState: AccountState = { ...next, profiles: sorted };
      setState(sortedState);
      const requestedProfile = route.params?.profileId
        ? sortedState.profiles.find((profile) => profile.profileId === route.params?.profileId) || null
        : null;
      const fallbackProfile = requestedProfile || getPrimaryProfile(sortedState) || sortedState.profiles[0] || null;
      setSelectedProfileId((current) =>
        current && sortedState.profiles.some((profile) => profile.profileId === current)
          ? current
          : fallbackProfile?.profileId || null,
      );
    } finally {
      setIsLoading(false);
    }
  }, [route.params?.profileId]);

  useEffect(() => {
    void loadState();
  }, [loadState]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      void loadState();
    });
    return unsubscribe;
  }, [loadState, navigation]);

  const openNewProfileModal = useCallback(() => {
    setProfileDraft(emptyDraft(!primaryProfile));
    setProfileModalVisible(true);
  }, [primaryProfile]);

  const openProfileDetailModal = useCallback((profile: SubjectProfile) => {
    setSelectedProfileId(profile.profileId);
    setProfileDraft(draftFromProfile(profile));
    setProfileModalVisible(true);
  }, []);

  useEffect(() => {
    if (!route.params?.profileId || requestedProfileOpenedRef.current || !state) return;
    const requestedProfile = state.profiles.find((profile) => profile.profileId === route.params?.profileId);
    if (!requestedProfile) return;
    requestedProfileOpenedRef.current = true;
    openProfileDetailModal(requestedProfile);
  }, [openProfileDetailModal, route.params?.profileId, state]);

  const handleDraftChange = useCallback(<K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => {
    setProfileDraft((current) => ({ ...current, [key]: value }));
  }, []);

  const handleSaveProfile = useCallback(async () => {
    const trimmedName = profileDraft.displayName.trim();
    if (!trimmedName) {
      setValidationModal({ visible: true, message: t('profile.nameRequired') });
      return;
    }

    if (profileDraft.gender === 'bos') {
      setValidationModal({ visible: true, message: t('profile.genderRequired') });
      return;
    }

    if (!profileDraft.birthYear || !profileDraft.birthMonth || !profileDraft.birthDay) {
      setValidationModal({ visible: true, message: t('profile.birthDateRequired') });
      return;
    }

    if (needsRelationshipFreeform(profileDraft) && !profileDraft.relationshipFreeform.trim()) {
      setValidationModal({ visible: true, message: t('profile.relationshipFreeformRequired') });
      return;
    }

    // K42: profil adı + ilişki açıklaması (kullanıcı serbest metni) kaydedilmeden denetlenir.
    // Doğum haritası/numeroloji/ilişki okumaları bu profil verisinden beslenir; zararlı
    // metin giriş noktasında durur, okuma servislerine taşınmaz.
    for (const candidate of [trimmedName, profileDraft.relationshipFreeform.trim()]) {
      const moderation = moderateUserInput(candidate, 'chat');
      if (moderation.verdict !== 'allow') {
        setValidationModal({ visible: true, message: moderation.replyText });
        return;
      }
    }

    const relationshipPrimary = editingIsPrimary ? 'kendi' : profileDraft.relationshipPrimary;
    const relationshipDetail = relationshipPrimary === 'akraba' ? profileDraft.relationshipDetail : null;
    const relationshipFreeform =
      relationshipPrimary === 'evcil_hayvan'
        ? profileDraft.relationshipFreeform.trim()
        : relationshipPrimary === 'diger' || profileDraft.relationshipDetail === 'diger_akraba'
          ? profileDraft.relationshipFreeform.trim()
          : null;
    const birth = buildBirthInfo(profileDraft);

    const next = profileDraft.profileId
      ? await updateProfile({
          profileId: profileDraft.profileId,
          displayName: trimmedName,
          relationshipPrimary,
          relationshipDetail,
          relationshipFreeform,
          gender: profileDraft.gender,
          birth,
        })
      : await createProfile({
          displayName: trimmedName,
          relationshipPrimary,
          relationshipDetail,
          relationshipFreeform,
          gender: profileDraft.gender,
          birth,
          isPrimary: editingIsPrimary,
        });

    const sorted = sortProfiles(next.profiles, next.primaryProfileId);
    setState({ ...next, profiles: sorted });
    const newestProfile =
      sorted.reduce<SubjectProfile | null>((latest, profile) => {
        if (!latest) return profile;
        return new Date(profile.createdAt).getTime() > new Date(latest.createdAt).getTime() ? profile : latest;
      }, null) || null;
    const targetId = profileDraft.profileId || newestProfile?.profileId || null;
    setSelectedProfileId(targetId);
    setProfileModalVisible(false);
    setProfileDraft(emptyDraft(!getPrimaryProfile(next)));
  }, [editingIsPrimary, profileDraft, t]);

  const handleDeleteProfile = useCallback(async () => {
    if (!profileDraft.profileId) return;
    const next = await deleteProfile(profileDraft.profileId, 'profile-and-data');
    const sorted = sortProfiles(next.profiles, next.primaryProfileId);
    setState({ ...next, profiles: sorted });
    setSelectedProfileId(getPrimaryProfile(next)?.profileId || sorted[0]?.profileId || null);
    setProfileModalVisible(false);
    setDeleteConfirmVisible(false);
  }, [profileDraft.profileId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <Text style={styles.loadingText}>{t('profile.loadingPreparing')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <BrandedScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showScrollToTop>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{t('common.profileSettings')}</Text>
            <Text style={styles.helperText}>{t('profile.profilesHelper')}</Text>
            <View style={styles.subjectGrid}>
              {state?.profiles.map((profile) => {
                const selected = profile.profileId === selectedProfileId;
                return (
                  <View
                    key={profile.profileId}
                    style={[styles.subjectCard, selected && styles.subjectCardSelected]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.86}
                      style={styles.subjectSelectArea}
                      onPress={() => setSelectedProfileId(profile.profileId)}
                    >
                      <Text style={styles.subjectName}>{profile.displayName}</Text>
                      <Text style={styles.subjectMeta}>{profileBadge(profile, t)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`${profile.displayName} profilini düzenle`}
                      activeOpacity={0.82}
                      style={styles.editProfileButton}
                      onPress={() => openProfileDetailModal(profile)}
                    >
                      <Text style={styles.editProfileButtonText}>{t('profile.editButton')}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            <TouchableOpacity style={styles.addProfileButton} onPress={openNewProfileModal}>
              <Text style={styles.addProfilePlus}>+</Text>
              <Text style={styles.addProfileButtonText}>{t('profile.addProfile')}</Text>
            </TouchableOpacity>

            {selectedProfile ? (
              <View style={styles.linkRow}>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() =>
                    navigation.navigate('MemoryDebug', {
                      profileId: selectedProfile.profileId,
                      profileName: selectedProfile.displayName,
                    })
                  }
                >
                  <Text style={styles.linkButtonText}>{t('profile.memorySummaryButton')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() =>
                    navigation.navigate('History', {
                      profileId: selectedProfile.profileId,
                      profileName: selectedProfile.displayName,
                    })
                  }
                >
                  <Text style={styles.linkButtonText}>{t('profile.recentReadingsButton')}</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Yasal Bilgilendirme"
              style={styles.legalLinkButton}
              onPress={() => navigation.navigate('LegalInfo')}
            >
              <Text style={styles.legalLinkButtonText}>{t('settings.legalInfoButton')}</Text>
            </TouchableOpacity>

            <Text style={styles.dataSectionTitle}>{t('settings.dataSectionTitle')}</Text>
            <Text style={styles.dataSectionHint}>{t('settings.dataSectionHint')}</Text>
            <View style={styles.linkRow}>
              <TouchableOpacity
                accessibilityRole="button"
                style={styles.linkButton}
                disabled={dataBusy}
                onPress={() => void handleExportBackup()}
              >
                <Text style={styles.linkButtonText}>{dataBusy ? t('common.wait') : t('settings.backupButton')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                style={styles.linkButton}
                disabled={dataBusy}
                onPress={() => void handlePickRestore()}
              >
                <Text style={styles.linkButtonText}>{dataBusy ? t('common.wait') : t('settings.restoreButton')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Tüm verimi sil"
              style={styles.wipeButton}
              disabled={dataBusy}
              onPress={() => setWipeStep(1)}
            >
              <Text style={styles.wipeButtonText}>{t('settings.wipeButton')}</Text>
            </TouchableOpacity>

            <Text style={styles.dataSectionTitle}>{t('settings.languageSectionTitle')}</Text>
            <View style={styles.linkRow}>
              <TouchableOpacity
                accessibilityRole="button"
                style={[styles.linkButton, appLanguage === 'tr' && styles.languageButtonActive]}
                onPress={() => void handleLanguageChange('tr')}
              >
                <Text style={styles.linkButtonText}>{t('settings.languageTr')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                style={[styles.linkButton, appLanguage === 'en' && styles.languageButtonActive]}
                onPress={() => void handleLanguageChange('en')}
              >
                <Text style={styles.linkButtonText}>{t('settings.languageEn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BrandedScrollView>
      </SafeAreaView>

      <Modal visible={profileModalVisible} animationType="slide" transparent onRequestClose={() => setProfileModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView style={styles.modalSheet} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <SafeAreaView edges={['bottom']} style={styles.modalSafeArea}>
              <BrandedScrollView
                contentContainerStyle={styles.modalContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showScrollToTop
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{editingExistingProfile ? t('profile.profileDetailsTitle') : t('profile.createProfile')}</Text>
                  <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                    <Text style={styles.modalClose}>{t('common.close')}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.inlineLabel}>{t('profile.nameLabel')}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={t('profile.nameLabel')}
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={profileDraft.displayName}
                  onChangeText={(value) => handleDraftChange('displayName', value)}
                />

                {!editingIsPrimary ? (
                  <>
                    <Text style={styles.inlineLabel}>{t('profile.relationshipLabel')}</Text>
                    <BrandedPicker
                      selectedValue={profileDraft.relationshipPrimary}
                      onValueChange={(value) => handleDraftChange('relationshipPrimary', value)}
                      options={RELATIONSHIP_OPTIONS.filter((item) => item !== 'kendi').map((option) => ({
                        label: labelForRelationship(option, t),
                        value: option,
                      }))}
                    />
                  </>
                ) : null}

                {profileDraft.relationshipPrimary === 'akraba' && !editingIsPrimary ? (
                  <>
                    <Text style={styles.inlineLabel}>{t('profile.relativeTypeLabel')}</Text>
                    <BrandedPicker
                      selectedValue={profileDraft.relationshipDetail}
                      onValueChange={(value) => handleDraftChange('relationshipDetail', value)}
                      options={RELATIVE_DETAILS.map((option) => ({ label: labelForRelative(option, t), value: option }))}
                    />
                  </>
                ) : null}

                {needsRelationshipFreeform(profileDraft) && !editingIsPrimary ? (
                  <>
                    <Text style={styles.inlineLabel}>{profileDraft.relationshipPrimary === 'evcil_hayvan' ? t('profile.petTypeLabel') : t('profile.explanationLabel')}</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder={profileDraft.relationshipPrimary === 'evcil_hayvan' ? t('profile.petTypePlaceholder') : t('profile.explanationPlaceholder')}
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      value={profileDraft.relationshipFreeform}
                      onChangeText={(value) => handleDraftChange('relationshipFreeform', value)}
                    />
                  </>
                ) : null}

                <Text style={styles.inlineLabel}>{t('profile.genderLabel')}</Text>
                <BrandedPicker
                  selectedValue={profileDraft.gender}
                  onValueChange={(value) => handleDraftChange('gender', value)}
                  options={GENDER_OPTIONS.map((option) => ({ label: labelForGender(option, t), value: option }))}
                />

                <Text style={styles.inlineLabel}>{t('profile.birthDateLabel')}</Text>
                <Text style={styles.helperText}>{t('profile.birthDateHelper')}</Text>
                <View style={styles.wheelRow}>
                  <View style={styles.wheelColumn}>
                    <Text style={styles.wheelLabel}>{t('profile.yearLabel')}</Text>
                    <BrandedPicker
                      selectedValue={pickerValue(profileDraft.birthYear)}
                      onValueChange={(value) => handleDraftChange('birthYear', value === 'sec' ? '' : value)}
                      options={[{ label: t('profile.yearLabel'), value: 'sec' }, ...YEAR_OPTIONS.map((option) => ({ label: option, value: option }))]}
                      compact
                    />
                  </View>
                  <View style={styles.wheelColumn}>
                    <Text style={styles.wheelLabel}>{t('profile.monthLabel')}</Text>
                    <BrandedPicker
                      selectedValue={pickerValue(profileDraft.birthMonth)}
                      onValueChange={(value) => handleDraftChange('birthMonth', value === 'sec' ? '' : value)}
                      options={[{ label: t('profile.monthLabel'), value: 'sec' }, ...MONTH_OPTIONS.map((option) => ({ label: t(option.labelKey), value: option.value }))]}
                      compact
                    />
                  </View>
                  <View style={styles.wheelColumn}>
                    <Text style={styles.wheelLabel}>{t('profile.dayLabel')}</Text>
                    <BrandedPicker
                      selectedValue={pickerValue(profileDraft.birthDay)}
                      onValueChange={(value) => handleDraftChange('birthDay', value === 'sec' ? '' : value)}
                      options={[{ label: t('profile.dayLabel'), value: 'sec' }, ...DAY_OPTIONS.map((option) => ({ label: option, value: option }))]}
                      compact
                    />
                  </View>
                </View>

                <Text style={styles.inlineLabel}>{t('profile.birthTimeLabel')}</Text>
                <View style={styles.wheelRow}>
                  <View style={styles.wheelColumn}>
                    <Text style={styles.wheelLabel}>{t('profile.hourLabel')}</Text>
                    <BrandedPicker
                      selectedValue={pickerValue(profileDraft.birthHour)}
                      onValueChange={(value) => handleDraftChange('birthHour', value === 'sec' ? '' : value)}
                      options={[{ label: t('profile.hourLabel'), value: 'sec' }, ...HOUR_OPTIONS.map((option) => ({ label: option, value: option }))]}
                      compact
                    />
                  </View>
                  <View style={styles.wheelColumn}>
                    <Text style={styles.wheelLabel}>{t('profile.minuteLabel')}</Text>
                    <BrandedPicker
                      selectedValue={pickerValue(profileDraft.birthMinute)}
                      onValueChange={(value) => handleDraftChange('birthMinute', value === 'sec' ? '' : value)}
                      options={[{ label: t('profile.minuteLabel'), value: 'sec' }, ...MINUTE_OPTIONS.map((option) => ({ label: option, value: option }))]}
                      compact
                    />
                  </View>
                </View>

                <Text style={styles.inlineLabel}>{t('profile.birthPlaceLabel')}</Text>
                <Text style={styles.helperText}>{t('profile.birthPlaceHelper')}</Text>
                <BrandedPicker
                  selectedValue={pickerValue(profileDraft.birthCountry)}
                  onValueChange={(value) => {
                    handleDraftChange('birthCountry', value === 'sec' ? '' : value);
                    handleDraftChange('birthCity', '');
                    handleDraftChange('birthDistrict', '');
                  }}
                  options={[{ label: t('profile.countrySelect'), value: 'sec' }, ...countryOptions.map((option) => ({ label: option.label, value: option.value }))]}
                />
                {isTurkeyBirthCountry ? (
                  <BrandedPicker
                    selectedValue={profileDraft.birthCity && turkeyCities.includes(profileDraft.birthCity) ? profileDraft.birthCity : 'sec'}
                    onValueChange={(value) => {
                      if (value === 'sec') {
                        handleDraftChange('birthCity', '');
                        handleDraftChange('birthDistrict', '');
                        return;
                      }
                      handleDraftChange('birthCity', value);
                      handleDraftChange('birthDistrict', '');
                    }}
                    options={[{ label: t('profile.citySelect'), value: 'sec' }, ...turkeyCities.map((option) => ({ label: option, value: option }))]}
                  />
                ) : hasWorldCities ? (
                  <BrandedPicker
                    selectedValue={cityIsKnownWorld ? profileDraft.birthCity : profileDraft.birthCity ? CITY_OTHER_VALUE : 'sec'}
                    onValueChange={(value) => {
                      if (value === 'sec') {
                        handleDraftChange('birthCity', '');
                        handleDraftChange('birthDistrict', '');
                        return;
                      }
                      handleDraftChange('birthCity', value);
                      handleDraftChange('birthDistrict', '');
                    }}
                    options={[
                      { label: t('profile.citySelect'), value: 'sec' },
                      ...worldCityOptions.map((option) => ({ label: option.label, value: option.value })),
                      { label: t('profile.cityOther'), value: CITY_OTHER_VALUE },
                    ]}
                  />
                ) : (
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('profile.cityPlaceholder')}
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={profileDraft.birthCity}
                    onChangeText={(value) => handleDraftChange('birthCity', value)}
                    selectionColor="#D4A574"
                  />
                )}
                {showCityFreeform ? (
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('profile.cityPlaceholder')}
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={profileDraft.birthCity === CITY_OTHER_VALUE ? '' : profileDraft.birthCity}
                    onChangeText={(value) => handleDraftChange('birthCity', value)}
                    selectionColor="#D4A574"
                  />
                ) : null}
                {isTurkeyBirthCountry && profileDraft.birthCity && selectedCityDistricts.length ? (
                  <BrandedPicker
                    selectedValue={
                      profileDraft.birthDistrict
                        ? districtIsKnown
                          ? profileDraft.birthDistrict
                          : DISTRICT_OTHER_VALUE
                        : 'sec'
                    }
                    onValueChange={(value) => {
                      if (value === 'sec') {
                        handleDraftChange('birthDistrict', '');
                        return;
                      }
                      handleDraftChange('birthDistrict', value);
                    }}
                    options={[
                      { label: t('profile.districtSelect'), value: 'sec' },
                      ...selectedCityDistricts.map((option) => ({ label: option, value: option })),
                      { label: t('profile.districtOther'), value: DISTRICT_OTHER_VALUE },
                    ]}
                  />
                ) : null}
                {showDistrictFreeform ? (
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('profile.districtDetailedPlaceholder')}
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={profileDraft.birthDistrict === DISTRICT_OTHER_VALUE ? '' : profileDraft.birthDistrict}
                    onChangeText={(value) => handleDraftChange('birthDistrict', value)}
                    selectionColor="#D4A574"
                    returnKeyType="done"
                  />
                ) : null}
                {!isTurkeyBirthCountry ? (
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('profile.districtPlaceholder')}
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={profileDraft.birthDistrict}
                    onChangeText={(value) => handleDraftChange('birthDistrict', value)}
                    selectionColor="#D4A574"
                    returnKeyType="done"
                  />
                ) : null}

                <TouchableOpacity style={styles.primaryButton} onPress={() => void handleSaveProfile()}>
                  <Text style={styles.primaryButtonText}>{editingExistingProfile ? t('profile.updateProfileButton') : t('profile.saveProfileButton')}</Text>
                </TouchableOpacity>

                {editingExistingProfile && profileDraft.profileId ? (
                  <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteConfirmVisible(true)}>
                    <Text style={styles.deleteButtonText}>{t('profile.deleteProfileButton')}</Text>
                  </TouchableOpacity>
                ) : null}
              </BrandedScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <BrandedConfirmModal
        visible={deleteConfirmVisible}
        title={t('profile.deleteProfileButton')}
        message={
          deletingPrimaryProfile
            ? t('profile.deletePrimaryWarning')
            : deleteTargetProfile
              ? t('profile.deleteProfileMessage', { name: deleteTargetProfile.displayName })
              : t('profile.deleteProfileFallback')
        }
        confirmLabel={t('profile.yesDelete')}
        cancelLabel={t('common.no')}
        onCancel={() => setDeleteConfirmVisible(false)}
        onConfirm={() => {
          void handleDeleteProfile();
        }}
      />
      <BrandedConfirmModal
        visible={validationModal.visible}
        title={t('profile.missingInfoTitle')}
        message={validationModal.message}
        confirmLabel={t('common.ok')}
        cancelLabel={null}
        onCancel={() => setValidationModal({ visible: false, message: '' })}
        onConfirm={() => setValidationModal({ visible: false, message: '' })}
      />
      <BrandedConfirmModal
        visible={Boolean(restoreCandidate)}
        title={t('settings.restoreButton')}
        message={t('profile.restoreConfirmMessage', { name: restoreCandidate?.name || '' })}
        confirmLabel={t('profile.yesOverwrite')}
        cancelLabel={t('profile.cancelAction')}
        onCancel={() => setRestoreCandidate(null)}
        onConfirm={() => {
          void handleConfirmRestore();
        }}
      />
      <BrandedConfirmModal
        visible={wipeStep === 1}
        title={t('settings.wipeButton')}
        message={t('profile.wipeWarningMessage')}
        confirmLabel={t('profile.continueLabel')}
        cancelLabel={t('profile.cancelAction')}
        onCancel={() => setWipeStep(0)}
        onConfirm={() => setWipeStep(2)}
      />
      <BrandedConfirmModal
        visible={wipeStep === 2}
        title={t('profile.finalConfirmTitle')}
        message={t('profile.finalConfirmMessage')}
        confirmLabel={t('profile.yesDeleteAll')}
        cancelLabel={t('profile.cancelAction')}
        onCancel={() => setWipeStep(0)}
        onConfirm={() => {
          void handleConfirmWipe();
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14141E' },
  safeArea: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  loadingWrap: { flex: 1, backgroundColor: '#14141E', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#E8C49A', fontSize: 16, fontWeight: '700' },
  panel: {
    marginBottom: 18,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(30, 30, 40, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(168, 130, 82, 0.18)',
  },
  panelTitle: { color: '#E8C49A', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  helperText: { color: 'rgba(255,255,255,0.65)', fontSize: 12, lineHeight: 18, marginBottom: 10 },
  inlineLabel: { color: '#D4A574', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  textInput: {
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.25)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.18)',
    marginBottom: 10,
  },
  pickerShell: {
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.25)',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.18)',
    marginBottom: 10,
    overflow: 'hidden',
    minHeight: Platform.OS === 'ios' ? 180 : 50, // iOS için alan açıldı
    justifyContent: 'center',
  },
  pickerShellCompact: {
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.25)',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.18)',
    overflow: 'hidden',
    minHeight: Platform.OS === 'ios' ? 180 : 50, // iOS için alan açıldı
    justifyContent: 'center',
  },
  picker: { 
    color: '#D4A574', 
    height: Platform.OS === 'ios' ? 180 : 50, // iOS'ta tekerlek boyutu ayarlandı
    width: '100%',
  },
  primaryButton: {
    borderRadius: 14,
    backgroundColor: '#D4A574',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#14141E', fontSize: 15, fontWeight: '800' },
  deleteButton: {
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,107,107,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.62)',
    paddingVertical: 13,
    alignItems: 'center',
  },
  deleteButtonText: { color: '#FFB0B0', fontSize: 14, fontWeight: '700' },
  subjectCard: {
    width: '48.5%',
    minHeight: 108,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.18)',
    justifyContent: 'space-between',
  },
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  addProfileButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.24)',
    backgroundColor: 'rgba(0,0,0,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  addProfilePlus: { color: '#E8C49A', fontSize: 20, fontWeight: '700', marginRight: 8 },
  addProfileButtonText: { color: '#FFF5E8', fontSize: 14, fontWeight: '800' },
  subjectCardSelected: { borderColor: '#D4A574', backgroundColor: 'rgba(212,165,116,0.14)' },
  subjectSelectArea: { flex: 1 },
  subjectName: { color: '#FFF5E8', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  subjectMeta: { color: 'rgba(212,165,116,0.72)', fontSize: 12 },
  editProfileButton: {
    marginTop: 10,
    minHeight: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.32)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212,165,116,0.1)',
  },
  editProfileButtonText: { color: '#E8C49A', fontSize: 12, fontWeight: '800' },
  linkRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  linkButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D4A574',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: 'rgba(212,165,116,0.12)',
  },
  linkButtonText: { color: '#E8C49A', fontSize: 13, fontWeight: '700' },
  legalLinkButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.45)',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: 'rgba(212,165,116,0.06)',
  },
  legalLinkButtonText: { color: 'rgba(232,196,154,0.85)', fontSize: 13, fontWeight: '700' },
  languageButtonActive: {
    backgroundColor: 'rgba(212,165,116,0.32)',
    borderWidth: 2,
  },
  dataSectionTitle: { color: '#D4A574', fontSize: 14, fontWeight: '700', marginTop: 22, marginBottom: 4 },
  dataSectionHint: { color: 'rgba(200,200,212,0.75)', fontSize: 12, lineHeight: 17, marginBottom: 10 },
  wipeButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(214,106,106,0.55)',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: 'rgba(214,106,106,0.08)',
  },
  wipeButtonText: { color: 'rgba(230,140,140,0.95)', fontSize: 13, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.52)', justifyContent: 'flex-end' },
  modalSheet: {
    width: '100%',
    height: '92%',
    backgroundColor: '#181820',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },
  modalSafeArea: { flex: 1 },
  modalContent: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 120 : 180 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { color: '#FFF5E8', fontSize: 18, fontWeight: '700' },
  modalClose: { color: '#D4A574', fontSize: 14, fontWeight: '700' },
  wheelRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  wheelColumn: { flex: 1 },
  wheelLabel: { color: 'rgba(255,255,255,0.62)', fontSize: 12, marginBottom: 6 },
});
