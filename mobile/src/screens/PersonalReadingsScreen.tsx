import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { BrandedScrollView } from '../components/BrandedScrollView';
import { APP_NAME, DEFAULT_DEV_SETTINGS } from '../config/constants';
import { BrandedConfirmModal } from '../components/BrandedConfirmModal';
import { getPrimaryProfile, loadAccountState } from '../services/profileMemoryService';
import { hasRequiredAstroBirthInputs } from '../services/astroEngine';
import { hasRequiredNumerologyInputs } from '../services/personalNumerologyEngine';
import type { SubjectProfile } from '../types/memory';

type Props = NativeStackScreenProps<RootStackParamList, 'PersonalReadings'>;

type ReadingTypeItem = {
  id:
    | 'birth-chart'
    | 'coffee'
    | 'palm'
    | 'astro-personal'
    | 'tarot-personal'
    | 'numerology-personal'
    | 'numerology-core'
    | 'numerology-period'
    | 'angel-personal'
    | 'manifest-chat'
    | 'dream-interpretation';
  title: string;
  shortTitle: string;
  description: string;
  currentlyAvailable: boolean;
};

type InsightCardItem = ReadingTypeItem | {
  id: 'tests';
  title: string;
  shortTitle: string;
  description: string;
  currentlyAvailable: true;
};

function profileBadge(profile: SubjectProfile, t: TFunction) {
  if (profile.relationshipPrimary === 'kendi') return t('profile.relationshipSelf');
  if (profile.relationshipPrimary === 'cocuk') return t('profile.relationshipChild');
  if (profile.relationshipPrimary === 'es') return t('profile.relationshipSpouse');
  return profile.relationshipPrimary;
}

function sortProfiles(profiles: SubjectProfile[], primaryProfileId: string | null) {
  return [...profiles].sort((a, b) => {
    const aSelf = a.profileId === primaryProfileId || a.relationshipPrimary === 'kendi' || a.isPrimary;
    const bSelf = b.profileId === primaryProfileId || b.relationshipPrimary === 'kendi' || b.isPrimary;
    if (aSelf !== bSelf) return aSelf ? -1 : 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

export function PersonalReadingsScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const devSettings = route.params?.devSettings || DEFAULT_DEV_SETTINGS;
  const [profiles, setProfiles] = useState<SubjectProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<ReadingTypeItem | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [infoModal, setInfoModal] = useState<{ visible: boolean; message: string; title: string }>({
    visible: false,
    message: '',
    title: APP_NAME,
  });
  const [infoAction, setInfoAction] = useState<'profile' | null>(null);

  const closeInfoModal = useCallback(() => {
    setInfoAction(null);
    setInfoModal({ visible: false, message: '', title: APP_NAME });
  }, []);

  const loadProfiles = useCallback(async () => {
    const state = await loadAccountState();
    const sorted = sortProfiles(state.profiles, state.primaryProfileId);
    setProfiles(sorted);
    const fallback = getPrimaryProfile(state)?.profileId || sorted[0]?.profileId || null;
    setSelectedProfileId((current) => (current && sorted.some((p) => p.profileId === current) ? current : fallback));
  }, []);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      void loadProfiles();
    });
    return unsubscribe;
  }, [loadProfiles, navigation]);

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.profileId === selectedProfileId) || null,
    [profiles, selectedProfileId],
  );

  const handleInfoExtraAction = useCallback(() => {
    const targetProfileId = selectedProfile?.profileId;
    closeInfoModal();
    navigation.navigate('ProfileSettings', targetProfileId ? { profileId: targetProfileId } : undefined);
  }, [closeInfoModal, navigation, selectedProfile?.profileId]);

  const oneTimeTypes: ReadingTypeItem[] = useMemo(
    () => [
      {
        id: 'birth-chart',
        title: t('readings.typeBirthChart'),
        shortTitle: t('readings.shortBirthChart'),
        description: t('readings.descBirthChart'),
        currentlyAvailable: true,
      },
      {
        id: 'numerology-core',
        title: t('readings.typeNumerologyCore'),
        shortTitle: t('readings.shortNumerologyCore'),
        description: t('readings.descNumerologyCore'),
        currentlyAvailable: true,
      },
    ],
    [t],
  );

  const insightTypes: InsightCardItem[] = useMemo(
    () => [
      ...oneTimeTypes,
      {
        id: 'tests',
        title: t('tests.title'),
        shortTitle: t('readings.shortTests'),
        description: t('readings.descTests'),
        currentlyAvailable: true,
      },
    ],
    [oneTimeTypes, t],
  );

  const flowTypes: ReadingTypeItem[] = useMemo(
    () => [
      {
        id: 'astro-personal',
        title: t('readings.typeAstro'),
        shortTitle: t('readings.shortAstro'),
        description: t('readings.descAstroSalon'),
        currentlyAvailable: true,
      },
      {
        id: 'coffee',
        title: t('readings.typeCoffee'),
        shortTitle: t('readings.shortCoffee'),
        description: t('readings.descCoffeeSalon'),
        currentlyAvailable: true,
      },
      {
        id: 'palm',
        title: t('readings.typePalm'),
        shortTitle: t('readings.shortPalm'),
        description: t('readings.descPalmSalon'),
        currentlyAvailable: true,
      },
      {
        id: 'tarot-personal',
        title: t('readings.typeTarotPersonal'),
        shortTitle: t('readings.shortTarot'),
        description: t('readings.descTarotSalon'),
        currentlyAvailable: true,
      },
      {
        id: 'numerology-period',
        title: t('readings.typeNumerologyPeriod'),
        shortTitle: t('readings.shortNumerologyPeriod'),
        description: t('readings.descNumerologySalon'),
        currentlyAvailable: true,
      },
      {
        id: 'dream-interpretation',
        title: t('readings.typeDream'),
        shortTitle: t('readings.shortDream'),
        description: t('readings.descDreamSalon'),
        currentlyAvailable: true,
      },
    ],
    [t],
  );

  const handleTypePress = useCallback(
    (item: InsightCardItem) => {
      if (!selectedProfile) {
        setInfoAction('profile');
        setInfoModal({
          visible: true,
          title: APP_NAME,
          message: t('modals.needProfileForReading'),
        });
        return;
      }

      if (item.id === 'tests') {
        navigation.navigate('MbtiTest', {
          profileId: selectedProfile.profileId,
        });
        return;
      }

      if (!item.currentlyAvailable) {
        setInfoAction(null);
        setInfoModal({
          visible: true,
          title: t('modals.comingSoonTitle'),
          message: t('readings.readingComingSoon', { reading: item.title }),
        });
        return;
      }

      if (item.id === 'birth-chart') {
        if (!hasRequiredAstroBirthInputs(selectedProfile)) {
          setInfoAction('profile');
          setInfoModal({
            visible: true,
            title: t('modals.profileInfoRequiredTitle'),
            message: t('modals.birthChartInfoMessage'),
          });
          return;
        }
        navigation.navigate('PersonalBirthChart', {
          profileId: selectedProfile.profileId,
        });
        return;
      }

      if (item.id === 'astro-personal' && !hasRequiredAstroBirthInputs(selectedProfile)) {
        setInfoAction('profile');
        setInfoModal({
          visible: true,
          title: t('modals.profileInfoRequiredTitle'),
          message: t('modals.personalAstroInfoMessage'),
        });
        return;
      }

      if ((item.id === 'numerology-personal' || item.id === 'numerology-core' || item.id === 'numerology-period') && !hasRequiredNumerologyInputs(selectedProfile)) {
        setInfoAction('profile');
        setInfoModal({
          visible: true,
          title: t('modals.profileInfoRequiredTitle'),
          message: t('modals.personalNumerologyInfoMessage'),
        });
        return;
      }

      if (item.id === 'numerology-core') {
        navigation.navigate('PersonalNumerologyReading', {
          profileId: selectedProfile.profileId,
          assistantId: 'berk',
          initialMode: 'core',
        });
        return;
      }

      setPendingType(item);
      setConfirmVisible(true);
    },
    [navigation, selectedProfile, t],
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <BrandedScrollView contentContainerStyle={styles.content} showScrollToTop>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{t('readings.whoForPersonalTitle')}</Text>
          <Text style={styles.helperText}>{t('readings.whoForPersonalHelper')}</Text>
          {profiles.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {profiles.map((profile) => {
                const selected = profile.profileId === selectedProfileId;
                return (
                  <TouchableOpacity
                    key={profile.profileId}
                    style={[styles.profileCard, selected && styles.profileCardSelected]}
                    onPress={() => setSelectedProfileId(profile.profileId)}
                  >
                    <Text style={styles.profileName}>{profile.displayName}</Text>
                    <Text style={styles.profileMeta}>{profileBadge(profile, t)}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.emptyProfileBox}>
              <Text style={styles.emptyProfileText}>{t('profile.noProfilesYet')}</Text>
              <View style={styles.emptyProfileActions}>
                <TouchableOpacity style={styles.emptyProfileButton} onPress={() => navigation.navigate('ProfileSettings')}>
                  <Text style={styles.emptyProfileButtonText}>{t('profile.goToProfileSettings')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.emptyProfileGhostButton} onPress={() => void loadProfiles()}>
                  <Text style={styles.emptyProfileGhostButtonText}>{t('profile.refreshProfiles')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{t('readings.salonReadingsTitle')}</Text>
          <Text style={styles.sectionHelperText}>
            {t('readings.salonReadingsHelper')}
          </Text>
          <View style={styles.grid}>
            {flowTypes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.typeSquareCard, !item.currentlyAvailable && styles.typeSquareCardDisabled]}
                onPress={() => handleTypePress(item)}
              >
                <Text style={styles.typeSquareTitle}>{item.shortTitle}</Text>
                <Text style={styles.typeSquareDescription}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </BrandedScrollView>

      <BrandedConfirmModal
        visible={confirmVisible}
        title={APP_NAME}
        message={
          pendingType && selectedProfile
            ? t('readings.salonConfirmMessage', { name: selectedProfile.displayName, reading: pendingType.title })
            : t('readings.salonConfirmFallback')
        }
        confirmLabel={t('common.yes')}
        cancelLabel={t('common.no')}
        onConfirm={() => {
          if (!pendingType || !selectedProfile) return;
          const selectedType = pendingType;
          setPendingType(null);
          setConfirmVisible(false);
          if (selectedType.id === 'birth-chart') {
            navigation.navigate('PersonalBirthChart', {
              profileId: selectedProfile.profileId,
            });
            return;
          }
          navigation.navigate('PersonalAssistantSelect', {
            devSettings,
            profileId: selectedProfile.profileId,
            readingType: selectedType.id,
          });
        }}
        onCancel={() => {
          setPendingType(null);
          setConfirmVisible(false);
        }}
      />

      <BrandedConfirmModal
        visible={infoModal.visible}
        title={infoModal.title}
        message={infoModal.message}
        confirmLabel={infoAction === 'profile' ? null : t('common.ok')}
        cancelLabel={t('common.close')}
        extraActionLabel={infoAction === 'profile' ? t('profile.goToProfileSettings') : null}
        onExtraAction={infoAction === 'profile' ? handleInfoExtraAction : undefined}
        onConfirm={closeInfoModal}
        onCancel={closeInfoModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14141E' },
  content: { padding: 18, paddingBottom: 30 },
  panel: {
    marginBottom: 14,
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(30, 30, 40, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.18)',
  },
  panelTitle: { color: '#E8C49A', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  helperText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, lineHeight: 16, marginBottom: 10 },
  sectionHelperText: { color: 'rgba(255,255,255,0.66)', fontSize: 10, fontStyle: 'italic', lineHeight: 15, marginBottom: 10 },
  profileCard: {
    width: 100,
    minHeight: 90,
    marginRight: 10,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.18)',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  profileCardSelected: { borderColor: '#D4A574', backgroundColor: 'rgba(212,165,116,0.14)' },
  profileName: { color: '#FFF5E8', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  profileMeta: { color: 'rgba(212,165,116,0.72)', fontSize: 12 },
  emptyProfileBox: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.28)',
    backgroundColor: 'rgba(0,0,0,0.16)',
    padding: 12,
  },
  emptyProfileText: { color: 'rgba(255,255,255,0.72)', fontSize: 12, lineHeight: 18, marginBottom: 10 },
  emptyProfileButton: {
    borderRadius: 12,
    backgroundColor: '#D4A574',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  emptyProfileButtonText: { color: '#14141E', fontSize: 12, fontWeight: '900' },
  emptyProfileActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emptyProfileGhostButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.42)',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  emptyProfileGhostButtonText: { color: '#E8C49A', fontSize: 12, fontWeight: '900' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeSquareCard: {
    width: '48.5%',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.2)',
    backgroundColor: 'rgba(0,0,0,0.16)',
    padding: 12,
  },
  typeSquareCardDisabled: { opacity: 0.72 },
  typeSquareTitle: {
    color: '#FFF5E8',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textAlign: 'left',
    marginBottom: 6,
  },
  typeSquareDescription: {
    color: 'rgba(212,165,116,0.72)',
    fontSize: 10,
    lineHeight: 15,
  },
  typeSquareMeta: {
    color: '#F6C38B',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 14,
    marginBottom: 6,
  },
  typeSquareStateActive: {
    color: '#7DDC9A',
    borderColor: 'rgba(125,220,154,0.45)',
    borderWidth: 1,
    borderRadius: 9,
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  typeSquareStateSoon: {
    color: '#F6C38B',
    borderColor: 'rgba(246,195,139,0.45)',
    borderWidth: 1,
    borderRadius: 9,
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
