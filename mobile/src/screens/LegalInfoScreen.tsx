// ============================================================
// Ruhbaz Konağı - Yasal Bilgilendirme Ekranı
// ============================================================
// Ayarlar'dan tek dokunuşla erişilir (04/3 madde 2).
// Metinler tek kaynaktan: config/legalTexts.ts (TASLAK — Ozan onayı bekliyor).

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getLegalInfoSections } from '../config/legalTexts';

export function LegalInfoScreen() {
  useTranslation(); // dil değişiminde yeniden render
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {getLegalInfoSections().map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionBody}>{section.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14141E',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 18,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    color: '#D4A574',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionBody: {
    color: '#C8C8D4',
    fontSize: 13.5,
    lineHeight: 20,
  },
});
