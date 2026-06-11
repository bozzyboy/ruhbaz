// ============================================================
// Ruhbaz Konağı - Sembolik Yorum İbaresi
// ============================================================
// Okuma ekranlarında kalıcı, küçük ama daimî ibare (04/3 madde 3).
// Metin tek kaynaktan gelir: config/legalTexts.ts

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getReadingDisclaimerShort } from '../config/legalTexts';

export function SymbolicDisclaimer() {
  // useTranslation: dil değişiminde yeniden render için abonelik.
  useTranslation();
  return (
    <View style={styles.container} accessibilityRole="text">
      <Text style={styles.text}>{getReadingDisclaimerShort()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  text: {
    color: 'rgba(212, 165, 116, 0.55)',
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
