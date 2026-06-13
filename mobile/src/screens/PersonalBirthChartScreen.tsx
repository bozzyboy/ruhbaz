import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { createBirthChartSnapshot, formatTimezoneForDisplay, hasRequiredAstroBirthInputs, type BirthChartSnapshot } from '../services/astroEngine';
import { appendReadingSummary, appendSelfKnowledgeProfileInsight, loadAccountState } from '../services/profileMemoryService';
import { BrandedConfirmModal } from '../components/BrandedConfirmModal';
import { BrandedScrollView } from '../components/BrandedScrollView';
import { birthChartProfileFingerprint, loadBirthChartInterpretationSession } from '../services/birthChartInterpretationStore';

type Props = NativeStackScreenProps<RootStackParamList, 'PersonalBirthChart'>;

// DISPLAY-ONLY mapper: çevirir AMA motor/persist değerini ASLA değiştirmez.
// Anahtar = astroEngine'in ürettiği kanonik Türkçe değer; bilinmeyen değer
// (ör. burada listelenmeyen bir nokta adı) olduğu gibi gösterilir.
function displaySign(sign: string, t: TFunction): string {
  return sign ? t(`birthChart.signs.${sign}`, { defaultValue: sign }) : sign;
}
function displayPlanet(name: string, t: TFunction): string {
  return name ? t(`birthChart.planets.${name}`, { defaultValue: name }) : name;
}
function displayAspectType(type: string, t: TFunction): string {
  return type ? t(`birthChart.aspects.${type}`, { defaultValue: type }) : type;
}

export function PersonalBirthChartScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { profileId } = route.params;
  const insets = useSafeAreaInsets();
  const [state, setState] = React.useState<{
    loading: boolean;
    title: string;
    lines: string[];
    chart: BirthChartSnapshot | null;
    interpretationExists: boolean;
    modal: { visible: boolean; title: string; message: string };
  }>({
    loading: true,
    title: '',
    lines: [],
    chart: null,
    interpretationExists: false,
    modal: { visible: false, title: '', message: '' },
  });

  const openProfileSettings = React.useCallback(() => {
    navigation.navigate('ProfileSettings', { profileId });
  }, [navigation, profileId]);

  const openInterpretation = React.useCallback(async () => {
    const account = await loadAccountState();
    const profile = account.profiles.find((p) => p.profileId === profileId) || null;
    if (!profile || !hasRequiredAstroBirthInputs(profile)) {
      setState((prev) => ({
        ...prev,
        modal: {
          visible: true,
          title: t('modals.profileInfoRequiredTitle'),
          message: t('flows.chartBeforeInterpretInfo'),
        },
      }));
      return;
    }
    navigation.navigate('BirthChartInterpretation', { profileId });
  }, [navigation, profileId, t]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const account = await loadAccountState();
        const profile = account.profiles.find((p) => p.profileId === profileId) || null;
        if (!profile) {
          if (!cancelled) {
            setState((prev) => ({
              ...prev,
              loading: false,
              modal: { visible: true, title: t('flows.errorTitle'), message: t('session.profileNotFound') },
            }));
          }
          return;
        }

        if (!hasRequiredAstroBirthInputs(profile)) {
          if (!cancelled) {
            setState((prev) => ({
              ...prev,
              loading: false,
              modal: {
                visible: true,
                title: t('modals.profileInfoRequiredTitle'),
                message: t('flows.chartInfoRequired'),
              },
            }));
          }
          return;
        }

        const chart = await createBirthChartSnapshot(profile);
        const interpretation = await loadBirthChartInterpretationSession(profileId, birthChartProfileFingerprint(profile));

        // PERSIST için KANONİK Türkçe satırlar — byte-identical (memory/transcript
        // dilden bağımsız sabit kalır; motor değerlerine dokunulmaz).
        const persistLines = [
          `Güneş Burcu: ${chart.sign}`,
          `Yükselen: ${chart.ascendant || 'Doğum saati gerekli'}`,
          chart.dominantHouse ? `Baskın Ev: ${chart.dominantHouse}. ev` : 'Baskın Ev: Doğum saati gerekli',
          `Zaman dilimi: ${formatTimezoneForDisplay(chart.timezoneUsed)}`,
          '',
          'Gezegen Konumları:',
          ...chart.planets.map((p) => {
            const houseText = p.house ? `, ${p.house}. ev` : ', ev için doğum saati gerekli';
            return `${p.name}: ${p.sign} ${p.degree.toFixed(1)}°${houseText}${p.retrograde ? ' (R)' : ''}`;
          }),
          ...(chart.points?.length
            ? [
                '',
                'Ek Noktalar:',
                ...chart.points.map((p) => {
                  const houseText = p.house ? `, ${p.house}. ev` : ', ev için doğum saati gerekli';
                  return `${p.name}: ${p.sign} ${p.degree.toFixed(1)}°${houseText}`;
                }),
              ]
            : []),
          '',
          'Ana Açılar:',
          ...(chart.aspects.length
            ? chart.aspects.map((a) => `${a.planetA} - ${a.planetB}: ${a.type} (${a.orb.toFixed(1)}° orb)`)
            : ['Belirgin ana açı bulunamadı.']),
          '',
          'Transit ve Gökyüzü Notları:',
          ...chart.transitNotes.map((note) => `- ${note}`),
        ];

        // DISPLAY satırları — yalnızca ekrana çizilir; dile göre etiketler ve
        // burç/gezegen adları çevrilir (motor değeri değişmeden). TR modunda
        // birth Chart anahtarları kanonik metni tuttuğundan persistLines ile aynıdır.
        const houseText = (house: number | null) =>
          house ? t('birthChart.houseSuffix', { house }) : t('birthChart.houseNeedsBirthTime');
        const lines = [
          t('birthChart.sunSignLabel', { sign: displaySign(chart.sign, t) }),
          t('birthChart.ascendantLabel', { value: chart.ascendant ? displaySign(chart.ascendant, t) : t('birthChart.birthTimeNeeded') }),
          chart.dominantHouse
            ? t('birthChart.dominantHouseLabel', { house: chart.dominantHouse })
            : t('birthChart.dominantHouseNeeded'),
          t('birthChart.timezoneLabel', { timezone: formatTimezoneForDisplay(chart.timezoneUsed) }),
          '',
          t('birthChart.planetPositionsHeading'),
          ...chart.planets.map((p) =>
            t('birthChart.planetLine', {
              name: displayPlanet(p.name, t),
              sign: displaySign(p.sign, t),
              degree: p.degree.toFixed(1),
              house: houseText(p.house),
              retro: p.retrograde ? ' (R)' : '',
            }),
          ),
          ...(chart.points?.length
            ? [
                '',
                t('birthChart.extraPointsHeading'),
                ...chart.points.map((p) =>
                  t('birthChart.pointLine', {
                    name: displayPlanet(p.name, t),
                    sign: displaySign(p.sign, t),
                    degree: p.degree.toFixed(1),
                    house: houseText(p.house),
                  }),
                ),
              ]
            : []),
          '',
          t('birthChart.mainAspectsHeading'),
          ...(chart.aspects.length
            ? chart.aspects.map((a) =>
                t('birthChart.aspectLine', {
                  planetA: displayPlanet(a.planetA, t),
                  planetB: displayPlanet(a.planetB, t),
                  type: displayAspectType(a.type, t),
                  orb: a.orb.toFixed(1),
                }),
              )
            : [t('birthChart.noMainAspects')]),
          '',
          t('birthChart.transitNotesHeading'),
          ...chart.transitNotes.map((note) => t('birthChart.transitNoteLine', { note })),
        ];
        if (!chart.cached) {
          const nextState = await appendReadingSummary({
            profileId,
            assistantId: 'selin',
            readingType: 'birth-chart',
            surfacesRead: [],
            summary: persistLines.filter(Boolean).slice(0, 14).join('\n'),
            transcript: [{ role: 'assistant', text: persistLines.filter(Boolean).join('\n'), timestamp: Date.now() }],
          });
          await appendSelfKnowledgeProfileInsight({
            profileId,
            readingId: nextState.readings[0]?.readingId || `birth-chart-${profileId}`,
            source: 'birth-chart',
            title: `Doğum haritası: ${chart.sign}${chart.ascendant ? `, yükselen ${chart.ascendant}` : ''}`,
            summary: persistLines.filter(Boolean).slice(0, 14).join('\n'),
            detailGroup: 'doğum haritası',
            confidence: 0.56,
          });
        }

        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            title: t('flows.chartTitle', { name: profile.displayName }),
            lines,
            chart,
            interpretationExists: Boolean(interpretation),
          }));
        }
      } catch (err: any) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            modal: { visible: true, title: t('flows.errorTitle'), message: err?.message || t('flows.chartFailed') },
          }));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profileId, t]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <BrandedScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]} showScrollToTop>
        <View style={styles.panel}>
          <Text style={styles.title}>{state.title || t('nav.personalBirthChart')}</Text>
          <BirthChartWheel chart={state.chart} housesHint={t('flows.housesNeedBirthTime')} t={t} />
          <TouchableOpacity
            style={[styles.interpretButton, state.loading && styles.interpretButtonDisabled]}
            onPress={() => void openInterpretation()}
            disabled={state.loading}
          >
            <Text style={styles.interpretButtonText}>{state.interpretationExists ? t('flows.askAboutInterpretation') : t('session.interpret')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          {state.loading ? (
            <Text style={styles.text}>{t('flows.preparing')}</Text>
          ) : (
            state.lines.map((line, idx) => (
              <Text key={`${idx}-${line}`} style={line.startsWith('- ') ? styles.bullet : styles.text}>
                {line}
              </Text>
            ))
          )}
        </View>
      </BrandedScrollView>

      <BrandedConfirmModal
        visible={state.modal.visible}
        title={state.modal.title}
        message={state.modal.message}
        confirmLabel={t('common.ok')}
        cancelLabel={t('common.close')}
        onConfirm={() => setState((prev) => ({ ...prev, modal: { visible: false, title: '', message: '' } }))}
        onCancel={() => setState((prev) => ({ ...prev, modal: { visible: false, title: '', message: '' } }))}
        extraActionLabel={state.modal.title === t('modals.profileInfoRequiredTitle') ? t('profile.goToProfileSettings') : null}
        onExtraAction={state.modal.title === t('modals.profileInfoRequiredTitle') ? openProfileSettings : undefined}
      />
    </SafeAreaView>
  );
}

// KANONİK sıralı burç adları (motor değerleriyle aynı). Tekerlek üzerinde
// gösterilirken displaySign ile dile çevrilir; bu dizi DEĞİŞMEZ.
const SIGN_LABELS = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
const PLANET_SYMBOLS: Record<string, string> = {
  Güneş: '☉',
  Ay: '☽',
  Merkür: '☿',
  Venüs: '♀',
  Mars: '♂',
  Jüpiter: '♃',
  Satürn: '♄',
  Uranüs: '♅',
  Neptün: '♆',
  Plüton: '♇',
  'Kuzey Ay Düğümü': '☊',
  'Güney Ay Düğümü': '☋',
  Lilith: '⚸',
};

function point(cx: number, cy: number, radius: number, longitude: number) {
  const angle = ((longitude - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function BirthChartWheel({ chart, housesHint, t }: { chart: BirthChartSnapshot | null; housesHint: string; t: TFunction }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const outer = 126;
  const signRadius = 111;
  const planetRadius = 82;

  return (
    <View style={styles.wheel}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={cx} cy={cy} r={outer} stroke="rgba(212,165,116,0.58)" strokeWidth={1.4} fill="rgba(0,0,0,0.16)" />
        <Circle cx={cx} cy={cy} r={96} stroke="rgba(255,255,255,0.16)" strokeWidth={1} fill="none" />
        <Circle cx={cx} cy={cy} r={58} stroke="rgba(212,165,116,0.24)" strokeWidth={1} fill="none" />
        {SIGN_LABELS.map((label, index) => {
          const line = point(cx, cy, outer, index * 30);
          const text = point(cx, cy, signRadius, index * 30 + 15);
          return (
            <G key={label}>
              <Line x1={cx} y1={cy} x2={line.x} y2={line.y} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
              <SvgText x={text.x} y={text.y} fill="#E8C49A" fontSize="9" fontWeight="700" textAnchor="middle">
                {displaySign(label, t)}
              </SvgText>
            </G>
          );
        })}
        {[...(chart?.planets || []), ...(chart?.points || [])].map((planet, index) => {
          const offset = (index % 3) * 8;
          const pos = point(cx, cy, planetRadius - offset, planet.longitude);
          const lineStart = point(cx, cy, 60, planet.longitude);
          const symbol = PLANET_SYMBOLS[planet.name] || displayPlanet(planet.name, t).slice(0, 2);
          return (
            <G key={`${planet.name}-${index}`}>
              <Line x1={lineStart.x} y1={lineStart.y} x2={pos.x} y2={pos.y} stroke="rgba(246,195,139,0.34)" strokeWidth={1} />
              <Circle cx={pos.x} cy={pos.y} r={11} fill="rgba(20,20,30,0.94)" stroke="#D4A574" strokeWidth={1} />
              <SvgText x={pos.x} y={pos.y + 4} fill="#FFF5E8" fontSize="12" fontWeight="700" textAnchor="middle">
                {symbol}
              </SvgText>
            </G>
          );
        })}
        {!chart?.ascendant ? (
          <SvgText x={cx} y={cy + 4} fill="rgba(255,255,255,0.62)" fontSize="10" textAnchor="middle">
            {housesHint}
          </SvgText>
        ) : (
          <SvgText x={cx} y={cy + 4} fill="#F6C38B" fontSize="11" fontWeight="700" textAnchor="middle">
            {t('birthChart.ascShort', { sign: displaySign(chart.ascendant, t) })}
          </SvgText>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14141E' },
  content: { padding: 16 },
  panel: {
    marginBottom: 12,
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(30,30,40,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.18)',
  },
  title: { color: '#E8C49A', fontSize: 16, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  interpretButton: {
    borderRadius: 12,
    backgroundColor: '#D4A574',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  interpretButtonDisabled: { opacity: 0.55 },
  interpretButtonText: { color: '#14141E', fontSize: 13, fontWeight: '800' },
  text: { color: '#FFF5E8', fontSize: 13, lineHeight: 20, marginBottom: 2 },
  bullet: { color: '#F6C38B', fontSize: 13, lineHeight: 20, marginBottom: 2 },
  wheel: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
