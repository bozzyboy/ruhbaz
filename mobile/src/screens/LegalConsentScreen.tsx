// ============================================================
// Ruhbaz Konağı - Onboarding Yasal Onay Kapısı
// ============================================================
// İlk açılışta (veya onay sürümü değiştiğinde) navigator yerine gösterilir.
// Onay verilmeden konağa girilmez (04/3 madde 1).
// Metinler tek kaynaktan: config/legalTexts.ts (TASLAK — Ozan onayı bekliyor).

import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { getOnboardingTexts } from '../config/legalTexts';
import { recordLegalConsentAcceptance } from '../services/legalConsentService';
import { trackEvent } from '../services/analyticsService';

type Props = {
  onAccepted: () => void;
};

export function LegalConsentScreen({ onAccepted }: Props) {
  useTranslation(); // dil değişiminde yeniden render
  const texts = getOnboardingTexts();
  const [isSaving, setIsSaving] = useState(false);

  const handleAccept = async () => {
    if (isSaving) {
      return;
    }
    setIsSaving(true);
    try {
      await recordLegalConsentAcceptance();
      trackEvent({ name: 'onboarding_consent_accepted' });
      onAccepted();
    } catch {
      // Kayıt yazılamadıysa kullanıcıyı kilitleme: onayı bu oturum için kabul et,
      // bir sonraki açılışta ekran yeniden gelir.
      onAccepted();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{texts.title}</Text>
        {texts.body.map((paragraph, index) => (
          <Text key={index} style={index === 1 ? styles.frameParagraph : styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={texts.acceptLabel}
          activeOpacity={0.82}
          style={styles.acceptButton}
          onPress={handleAccept}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#14141E" />
          ) : (
            <Text style={styles.acceptButtonText}>{texts.acceptLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#14141E',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 36,
    gap: 16,
  },
  title: {
    color: '#D4A574',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  paragraph: {
    color: '#C8C8D4',
    fontSize: 14.5,
    lineHeight: 22,
  },
  frameParagraph: {
    color: '#E7C190',
    fontSize: 14.5,
    lineHeight: 22,
    fontStyle: 'italic',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(212, 165, 116, 0.42)',
    paddingLeft: 12,
  },
  footer: {
    padding: 24,
    paddingTop: 8,
  },
  acceptButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#D4A574',
  },
  acceptButtonText: {
    color: '#14141E',
    fontSize: 16,
    fontWeight: '800',
  },
});
