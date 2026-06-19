// ============================================================
// Ruhbaz Konağı - App.tsx (Entry Point)
// ============================================================

import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SessionScreen } from './src/screens/SessionScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { MemoryDebugScreen } from './src/screens/MemoryDebugScreen';
import { ReadingDetailScreen } from './src/screens/ReadingDetailScreen';
import { ManorFeedScreen } from './src/screens/ManorFeedScreen';
import { GeneralReadingsScreen } from './src/screens/GeneralReadingsScreen';
import { GeneralReadingResultScreen } from './src/screens/GeneralReadingResultScreen';
import { PersonalReadingsScreen } from './src/screens/PersonalReadingsScreen';
import { SelfKnowledgeScreen } from './src/screens/SelfKnowledgeScreen';
import { SimyaLabScreen } from './src/screens/SimyaLabScreen';
import { ProfileSettingsScreen } from './src/screens/ProfileSettingsScreen';
import { PersonalProfileSelectScreen } from './src/screens/PersonalProfileSelectScreen';
import { PersonalReadingTypeSelectScreen } from './src/screens/PersonalReadingTypeSelectScreen';
import { PersonalAssistantSelectScreen } from './src/screens/PersonalAssistantSelectScreen';
import { PersonalReadingSetupScreen } from './src/screens/PersonalReadingSetupScreen';
import { PersonalAstroReadingScreen } from './src/screens/PersonalAstroReadingScreen';
import { PersonalBirthChartScreen } from './src/screens/PersonalBirthChartScreen';
import { BirthChartInterpretationScreen } from './src/screens/BirthChartInterpretationScreen';
import { DreamInterpretationScreen } from './src/screens/DreamInterpretationScreen';
import { PersonalDivinationReadingScreen } from './src/screens/PersonalDivinationReadingScreen';
import { PersonalNumerologyReadingScreen } from './src/screens/PersonalNumerologyReadingScreen';
import { TarotSpreadSelectScreen } from './src/screens/TarotSpreadSelectScreen';
import { TarotReadingScreen } from './src/screens/TarotReadingScreen';
import { MbtiTestScreen } from './src/screens/MbtiTestScreen';
import { AstroRelationshipReadingScreen } from './src/screens/AstroRelationshipReadingScreen';
import { SunCompatibilityScreen } from './src/screens/SunCompatibilityScreen';
import { DaisyReadingScreen } from './src/screens/DaisyReadingScreen';
import { LegalConsentScreen } from './src/screens/LegalConsentScreen';
import { LegalInfoScreen } from './src/screens/LegalInfoScreen';
import { hasAcceptedLegalConsent } from './src/services/legalConsentService';
import { useTranslation } from 'react-i18next';
import { initI18n } from './src/i18n';
import { useFonts } from 'expo-font';
import { Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_600SemiBold_Italic,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_800ExtraBold_Italic,
} from '@expo-google-fonts/nunito';
import { ENABLE_DEVELOPER_DEBUG_UI } from './src/config/featureFlags';
import type { TarotDeckId } from './src/data/tarotImageMap';
import type { DevSettings, SessionConfig } from './src/types';
import type { GeneralDivinationType } from './src/services/divinationEngine';
import type { ReadingSummary } from './src/types/memory';

// i18n, ilk render'dan önce senkron kurulur (kayıtlı tercih asenkron düzeltilir).
initI18n();

export type RootStackParamList = {
  Onboarding: undefined;
  Home: { freshStartToken?: number } | undefined;
  ProfileSettings: { profileId?: string } | undefined;
  LegalInfo: undefined;
  ManorFeed: undefined;
  GeneralReadings: undefined;
  SelfKnowledge: { devSettings: DevSettings } | undefined;
  SimyaLab: { devSettings: DevSettings } | undefined;
  GeneralReadingResult: {
    profileId: string;
    readingId: GeneralDivinationType | 'astro-daily' | 'astro-weekly' | 'astro-monthly';
    title: string;
  };
  SunCompatibility: undefined;
  DaisyReading: undefined;
  PersonalReadings: { devSettings: DevSettings } | undefined;
  PersonalProfileSelect: { devSettings: DevSettings };
  PersonalReadingTypeSelect: { devSettings: DevSettings; profileId: string };
  PersonalAssistantSelect: {
    devSettings: DevSettings;
    profileId: string;
    readingType:
      | 'coffee'
      | 'palm'
      | 'astro-personal'
      | 'tarot-personal'
      | 'numerology-personal'
      | 'numerology-core'
      | 'numerology-period'
      | 'angel-personal'
      | 'manifest-chat'
      | 'dream-interpretation'
      | 'iching-personal'
      | 'rune-personal';
  };
  PersonalReadingSetup:
    | {
        freshStartToken?: number;
        preselectedProfileId?: string;
        preselectedReadingType?: 'coffee' | 'palm';
        preselectedAssistantId?: string;
        preselectedDevSettings?: DevSettings;
      }
    | undefined;
  PersonalAstroReading: {
    profileId: string;
    assistantId: string;
  };
  AstroRelationshipReading: {
    profileId: string;
    assistantId: string;
    mode: 'compatibility' | 'family';
  };
  PersonalBirthChart: {
    profileId: string;
  };
  BirthChartInterpretation: {
    profileId: string;
  };
  DreamInterpretation: {
    profileId: string;
    assistantId: string;
  };
  PersonalDivinationReading: {
    profileId: string;
    assistantId: string;
    kind: 'iching' | 'rune';
  };
  TarotSpreadSelect: {
    profileId: string;
    assistantId: string;
  };
  TarotReading: {
    profileId: string;
    assistantId: string;
    spreadId: string;
    deckId?: TarotDeckId;
  };
  PersonalNumerologyReading: {
    profileId: string;
    assistantId: string;
    initialMode?: 'core' | 'daily' | 'weekly' | 'monthly';
  };
  MbtiTest: {
    profileId: string;
    testId?: 'mbti' | 'compatibility' | 'big-five' | 'attachment' | 'values' | 'coping-style';
  };
  Session: { config: SessionConfig };
  History: { profileId: string; profileName: string };
  MemoryDebug: { profileId: string; profileName: string };
  ReadingDetail: { reading: ReadingSummary; profileName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Deneme bayrağı: beğenilmezse false yapıp eski sistem bara dönebiliriz.
const ENABLE_ANDROID_IMMERSIVE_NAVIGATION = true;

function useAndroidImmersiveNavigation() {
  const applyNavigationMode = useCallback(async () => {
    if (Platform.OS !== 'android' || !ENABLE_ANDROID_IMMERSIVE_NAVIGATION) {
      return;
    }

    try {
      const NavigationBar = await import('expo-navigation-bar');

      // Edge-to-edge modda arka plan rengi ve davranış ayarları desteklenmiyor.
      await NavigationBar.setButtonStyleAsync('light');
      await NavigationBar.setVisibilityAsync('hidden');
    } catch {
      // Native modül dev build'e eklenmemişse uygulama açılmaya devam etsin.
    }
  }, []);

  useEffect(() => {
    void applyNavigationMode();
  }, [applyNavigationMode]);
}

export default function App() {
  useAndroidImmersiveNavigation();
  const { t } = useTranslation();
  const [fontsLoaded, fontError] = useFonts({
    Cinzel_600SemiBold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_600SemiBold_Italic,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_800ExtraBold_Italic,
  });

  // Yasal onay kapısı: null = kontrol sürüyor, false = onay ekranı, true = konak açık.
  const [consentAccepted, setConsentAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    void hasAcceptedLegalConsent().then((accepted) => {
      if (!cancelled) {
        setConsentAccepted(accepted);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (consentAccepted === null || (!fontsLoaded && !fontError)) {
    // Kısa dosya/font kontrolü; boş karanlık ekran yeterli (flash önleme).
    return <SafeAreaProvider><View style={styles.bootScreen} /></SafeAreaProvider>;
  }

  if (!consentAccepted) {
    return (
      <SafeAreaProvider>
        <LegalConsentScreen onAccepted={() => setConsentAccepted(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={({ navigation, route }) => ({
            headerStyle: { backgroundColor: '#1E1E28' },
            headerTintColor: '#D4A574',
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: '#14141E' },
            headerRight: () => (
              <View style={styles.headerActions}>
                {route.name === 'Home' ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={t('common.settings')}
                    activeOpacity={0.82}
                    style={styles.gearButton}
                    onPress={() => navigation.navigate('ProfileSettings')}
                  >
                    <Text style={styles.gearButtonText}>⚙</Text>
                    <Text style={styles.gearButtonLabel}>{t('common.profileSettings')}</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={t('common.exit')}
                  activeOpacity={0.82}
                  style={styles.exitButton}
                  onPress={() => {
                    if (route.name === 'Home' && Platform.OS === 'android') {
                      BackHandler.exitApp();
                      return;
                    }

                    if (route.name !== 'Home') {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                      });
                    }
                  }}
                >
                  <Text style={styles.exitButtonText}>{t('common.exit')}</Text>
                </TouchableOpacity>
              </View>
            ),
          })}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: t('nav.home') }} />
          <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} options={{ title: t('nav.profileSettings') }} />
          <Stack.Screen name="LegalInfo" component={LegalInfoScreen} options={{ title: t('nav.legalInfo') }} />
          <Stack.Screen name="ManorFeed" component={ManorFeedScreen} options={{ title: t('nav.manorFeed') }} />
          <Stack.Screen name="GeneralReadings" component={GeneralReadingsScreen} options={{ title: t('nav.generalReadings') }} />
          <Stack.Screen name="GeneralReadingResult" component={GeneralReadingResultScreen} options={{ title: t('nav.generalReadingResult') }} />
          <Stack.Screen name="SunCompatibility" component={SunCompatibilityScreen} options={{ title: t('nav.sunCompatibility') }} />
          <Stack.Screen name="DaisyReading" component={DaisyReadingScreen} options={{ title: t('nav.daisyReading') }} />
          <Stack.Screen name="PersonalReadings" component={PersonalReadingsScreen} options={{ title: t('nav.personalReadings') }} />
          <Stack.Screen name="SelfKnowledge" component={SelfKnowledgeScreen} options={{ title: t('nav.selfKnowledge') }} />
          <Stack.Screen name="SimyaLab" component={SimyaLabScreen} options={{ title: t('nav.simyaLab') }} />
          <Stack.Screen
            name="PersonalProfileSelect"
            component={PersonalProfileSelectScreen}
            options={{ title: t('nav.personalProfileSelect') }}
          />
          <Stack.Screen
            name="PersonalReadingTypeSelect"
            component={PersonalReadingTypeSelectScreen}
            options={{ title: t('nav.personalReadingTypeSelect') }}
          />
          <Stack.Screen
            name="PersonalAssistantSelect"
            component={PersonalAssistantSelectScreen}
            options={{ title: t('nav.personalAssistantSelect') }}
          />
          <Stack.Screen
            name="PersonalReadingSetup"
            component={PersonalReadingSetupScreen}
            options={{ title: t('nav.personalReadingSetup') }}
          />
          <Stack.Screen
            name="PersonalAstroReading"
            component={PersonalAstroReadingScreen}
            options={{ title: t('nav.personalAstroReading') }}
          />
          <Stack.Screen
            name="AstroRelationshipReading"
            component={AstroRelationshipReadingScreen}
            options={{ title: t('nav.astroRelationshipReading') }}
          />
          <Stack.Screen
            name="PersonalBirthChart"
            component={PersonalBirthChartScreen}
            options={{ title: t('nav.personalBirthChart') }}
          />
          <Stack.Screen
            name="BirthChartInterpretation"
            component={BirthChartInterpretationScreen}
            options={{ title: t('nav.birthChartInterpretation') }}
          />
          <Stack.Screen
            name="DreamInterpretation"
            component={DreamInterpretationScreen}
            options={{ title: t('nav.dreamInterpretation') }}
          />
          <Stack.Screen
            name="PersonalDivinationReading"
            component={PersonalDivinationReadingScreen}
            options={({ route }) => ({ title: route.params.kind === 'iching' ? t('divination.ichingMode') : t('divination.runeMode') })}
          />
          <Stack.Screen
            name="TarotSpreadSelect"
            component={TarotSpreadSelectScreen}
            options={{ title: t('nav.tarotSpreadSelect') }}
          />
          <Stack.Screen
            name="TarotReading"
            component={TarotReadingScreen}
            options={{ title: t('nav.tarotReading') }}
          />
          <Stack.Screen
            name="PersonalNumerologyReading"
            component={PersonalNumerologyReadingScreen}
            options={{ title: t('nav.personalNumerologyReading') }}
          />
          <Stack.Screen
            name="MbtiTest"
            component={MbtiTestScreen}
            options={({ route }) => {
              const titles = {
                mbti: t('nav.testMbti'),
                compatibility: t('nav.testCompatibility'),
                'big-five': t('nav.testBigFive'),
                attachment: t('nav.testAttachment'),
                values: t('nav.testValues'),
                'coping-style': t('nav.testCopingStyle'),
              };
              return { title: titles[route.params.testId || 'mbti'] };
            }}
          />
          <Stack.Screen
            name="Session"
            component={SessionScreen}
            options={{ title: t('nav.home'), headerBackVisible: false }}
          />
          <Stack.Screen name="History" component={HistoryScreen} options={{ title: t('nav.history') }} />
          {ENABLE_DEVELOPER_DEBUG_UI ? (
            <Stack.Screen name="MemoryDebug" component={MemoryDebugScreen} options={{ title: t('nav.memoryDebug') }} />
          ) : null}
          <Stack.Screen name="ReadingDetail" component={ReadingDetailScreen} options={{ title: t('nav.readingDetail') }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  bootScreen: {
    flex: 1,
    backgroundColor: '#14141E',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gearButton: {
    minWidth: 126,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: 'rgba(212, 165, 116, 0.42)',
    borderRadius: 8,
    backgroundColor: 'rgba(212, 165, 116, 0.12)',
  },
  gearButtonText: {
    color: '#E7C190',
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 20,
  },
  gearButtonLabel: {
    color: '#E7C190',
    fontSize: 11,
    fontWeight: '800',
  },
  exitButton: {
    minWidth: 54,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 165, 116, 0.42)',
    borderRadius: 8,
    backgroundColor: 'rgba(212, 165, 116, 0.12)',
  },
  exitButtonText: {
    color: '#E7C190',
    fontSize: 12,
    fontWeight: '800',
  },
});
