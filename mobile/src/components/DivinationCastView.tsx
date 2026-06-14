import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import IChingSymbol from './IChingSymbol';
import type { DivinationCast } from '../services/personalDivinationService';

// Kişisel I-Ching/Rün okumasının çekiliş GÖRSELİ (koyu tema). Genel okumalardaki gibi:
// I-Ching = şimdiki hexagram (→ dönüşüm hexagramı) + altlarında isimler; Rün = 3 rün glyph'i + altlarında anlam.
// Sadece sembolleri gösterir; yorum metni ekranda ayrıca akar.

const RUNE_POSITION_KEYS = ['divination.runePosRoot', 'divination.runePosNow', 'divination.runePosPath'];

export function DivinationCastView({ cast }: { cast: DivinationCast }) {
  const { t } = useTranslation();

  if (cast.kind === 'iching' && cast.iching) {
    const ic = cast.iching;
    return (
      <View style={styles.panel}>
        <View style={styles.hexRow}>
          <View style={styles.hexItem}>
            <IChingSymbol lines={ic.baseLines} size={62} color="#E8C49A" />
            <Text style={styles.hexName} numberOfLines={2}>
              {ic.present.name}
            </Text>
          </View>
          {ic.future ? (
            <>
              <Text style={styles.arrow}>→</Text>
              <View style={styles.hexItem}>
                <IChingSymbol lines={ic.endLines} size={62} color="#D98C7A" />
                <Text style={[styles.hexName, styles.hexNameFuture]} numberOfLines={2}>
                  {ic.future.name}
                </Text>
              </View>
            </>
          ) : null}
        </View>
      </View>
    );
  }

  if (cast.kind === 'rune' && cast.rune) {
    return (
      <View style={styles.panel}>
        <View style={styles.runeRow}>
          {cast.rune.runes.map((rune, index) => (
            <View key={rune.positionNo} style={styles.runeItem}>
              <Svg width={46} height={46} viewBox="0 0 100 100">
                <Path
                  d={rune.path}
                  fill="none"
                  stroke="#E8C49A"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="scale(0.7) translate(22, 10)"
                />
              </Svg>
              <Text style={styles.runeKeyword} numberOfLines={1}>
                {rune.keyword}
              </Text>
              <Text style={styles.runePos} numberOfLines={1}>
                {t(RUNE_POSITION_KEYS[index] || RUNE_POSITION_KEYS[RUNE_POSITION_KEYS.length - 1])}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  panel: {
    marginBottom: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.22)',
    alignItems: 'center',
  },
  hexRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 18 },
  hexItem: { alignItems: 'center', maxWidth: 130 },
  hexName: {
    color: '#E8C49A',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.3,
  },
  hexNameFuture: { color: '#D98C7A' },
  arrow: { color: 'rgba(232,196,154,0.7)', fontSize: 22, marginTop: 18 },
  runeRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 16 },
  runeItem: { alignItems: 'center', maxWidth: 100 },
  runeKeyword: { color: '#FFF5E8', fontSize: 12, fontWeight: '800', textAlign: 'center', marginTop: 6 },
  runePos: { color: 'rgba(255,255,255,0.55)', fontSize: 10, textAlign: 'center', marginTop: 2 },
});

export default DivinationCastView;
