import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { AVAILABLE_ASSISTANTS, applyAssistantPreset, getAssistantLabel, getAssistantSpecialty, getAssistantTagline } from '../config/constants';
import { BrandedScrollView } from '../components/BrandedScrollView';
import { BrandedConfirmModal } from '../components/BrandedConfirmModal';

type Props = NativeStackScreenProps<RootStackParamList, 'PersonalAssistantSelect'>;

export function PersonalAssistantSelectScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { devSettings, profileId, readingType } = route.params;
  const [soonVisible, setSoonVisible] = useState(false);
  const defaultAssistantId = useMemo(() => {
    if (readingType === 'astro-personal') return 'selin';
    if (readingType === 'numerology-personal' || readingType === 'numerology-core' || readingType === 'numerology-period') return 'berk';
    if (readingType === 'tarot-personal') return 'arin';
    if (readingType === 'dream-interpretation') return 'ayse';
    if (readingType === 'palm') return 'teoman';
    return AVAILABLE_ASSISTANTS[0].id;
  }, [readingType]);
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>(defaultAssistantId);

  useEffect(() => {
    setSelectedAssistantId(defaultAssistantId);
  }, [defaultAssistantId]);

  const selectedReadingLabel = useMemo(() => {
    if (readingType === 'coffee') return t('readings.typeCoffee');
    if (readingType === 'palm') return t('readings.typePalm');
    if (readingType === 'astro-personal') return t('readings.typeAstro');
    if (readingType === 'tarot-personal') return t('readings.typeTarotPersonal');
    if (readingType === 'numerology-core') return t('readings.typeNumerologyCore');
    if (readingType === 'numerology-period') return t('readings.typeNumerologyPeriod');
    if (readingType === 'numerology-personal') return t('readings.typeNumerologyPersonal');
    if (readingType === 'dream-interpretation') return t('readings.typeDream');
    if (readingType === 'angel-personal') return t('readings.typeAngelPersonal');
    return t('readings.typeManifestChat');
  }, [readingType, t]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <BrandedScrollView contentContainerStyle={styles.content} showScrollToTop>
        <View style={styles.readingTypeStrip}>
          <Text style={styles.helperText}>{t('readings.selectedReadingType', { reading: selectedReadingLabel })}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{t('readings.assistantSelectTitle')}</Text>
          <View style={styles.assistantGrid}>
            {AVAILABLE_ASSISTANTS.map((assistant) => {
              const selected = selectedAssistantId === assistant.id;
              return (
                <TouchableOpacity
                  key={assistant.id}
                  style={[styles.assistantCard, selected && styles.assistantCardSelected]}
                  onPress={() => setSelectedAssistantId(assistant.id)}
                >
                  <Text style={styles.assistantName}>{getAssistantLabel(assistant.id)}</Text>
                  <Text style={styles.assistantMeta}>{t('readings.assistantSpecialty', { specialty: getAssistantSpecialty(assistant.id) })}</Text>
                  <Text style={styles.assistantTagline}>{getAssistantTagline(assistant.id)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              if (readingType === 'astro-personal') {
                navigation.navigate('PersonalAstroReading', {
                  profileId,
                  assistantId: selectedAssistantId,
                });
                return;
              }

              if (readingType === 'numerology-personal' || readingType === 'numerology-core' || readingType === 'numerology-period') {
                navigation.navigate('PersonalNumerologyReading', {
                  profileId,
                  assistantId: selectedAssistantId,
                  initialMode: readingType === 'numerology-core' ? 'core' : readingType === 'numerology-period' ? 'monthly' : undefined,
                });
                return;
              }

              if (readingType === 'dream-interpretation') {
                navigation.navigate('DreamInterpretation', {
                  profileId,
                  assistantId: selectedAssistantId,
                });
                return;
              }

              if (readingType === 'tarot-personal') {
                navigation.navigate('TarotSpreadSelect', {
                  profileId,
                  assistantId: selectedAssistantId,
                });
                return;
              }

              if (readingType !== 'coffee' && readingType !== 'palm') {
                setSoonVisible(true);
                return;
              }

              navigation.navigate('PersonalReadingSetup', {
                preselectedProfileId: profileId,
                preselectedReadingType: readingType,
                preselectedAssistantId: selectedAssistantId,
                preselectedDevSettings: applyAssistantPreset(devSettings, selectedAssistantId),
              });
            }}
          >
            <Text style={styles.primaryButtonText}>{t('readings.goToReading')}</Text>
          </TouchableOpacity>
        </View>
      </BrandedScrollView>
      <BrandedConfirmModal
        visible={soonVisible}
        title={t('modals.comingSoonTitle')}
        message={t('modals.comingSoonEngineMessage')}
        confirmLabel={t('common.ok')}
        cancelLabel={null}
        onConfirm={() => setSoonVisible(false)}
        onCancel={() => setSoonVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14141E' },
  content: { padding: 18, paddingBottom: 28 },
  readingTypeStrip: {
    minHeight: 38,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(212,165,116,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.16)',
    justifyContent: 'center',
  },
  panel: {
    marginBottom: 14,
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(30,30,40,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.18)',
  },
  panelTitle: { color: '#E8C49A', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  helperText: { color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 18 },
  assistantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  assistantCard: {
    width: '47.5%',
    minHeight: 148,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.18)',
  },
  assistantCardSelected: { borderColor: '#D4A574', backgroundColor: 'rgba(212,165,116,0.14)' },
  assistantName: { color: '#FFF5E8', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  assistantMeta: { color: 'rgba(212,165,116,0.72)', fontSize: 12, marginBottom: 6 },
  assistantTagline: { color: 'rgba(255,255,255,0.74)', fontSize: 12, lineHeight: 18 },
  primaryButton: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: '#D4A574',
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#14141E', fontSize: 14, fontWeight: '800' },
});
