// ============================================================
// Ruhbaz Konağı — Onboarding / Giriş ekranı
// Tasarım handoff: "Ruhbaz Design System/design_handoff_onboarding".
// Tam ekran gündüz/gece konak videosu (expo-video, muted, loop yok → son frame'de donar),
// Cinzel wordmark + altın elmas ayraç + Nunito italik alt metin, iki dairesel cam buton.
// Aura (gündüz/gece) cihaz saatine göre otomatik (06–19 gündüz). Dev parçaları __DEV__ arkasında.
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { colors } from '../theme/ruhbaz';
import { ENABLE_DEVELOPER_DEBUG_UI } from '../config/featureFlags';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;
type Aura = 'day' | 'night';

const DAY_SRC = require('../../assets/manor-bg.mp4');
const NIGHT_SRC = require('../../assets/manor-night.mp4');

function currentAuraFromClock(): Aura {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 19 ? 'day' : 'night';
}

// Gündüz/gece uyarlanan renkler (handoff §2).
const PALETTE = {
  day: {
    wordmark: '#8A6A28',
    wordmarkShadow: 'rgba(36,20,42,0.45)',
    subtitle: '#5A4A52',
    label: '#4d3d43',
    statusBar: 'dark-content' as const,
  },
  night: {
    wordmark: '#E6C173',
    wordmarkShadow: 'rgba(8,6,16,0.9)',
    subtitle: 'rgba(255,246,234,0.88)',
    label: '#FFFFFF',
    statusBar: 'light-content' as const,
  },
};

// ---- İkonlar (handoff §7; 24×24, stroke=currentColor) ----
function CompassIcon({ color }: { color: string }) {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={8.5} />
      <Path d="m15.5 8.5-2 5.5-5 2 2-5.5z" />
    </Svg>
  );
}
function UserIcon({ color }: { color: string }) {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={8.5} r={3.5} />
      <Path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </Svg>
  );
}

// ---- Nefes alan halka (disk + 7px), 6.5s ----
function BreathingRing({ color, motion }: { color: string; motion: boolean }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!motion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 3250, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 3250, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [motion, v]);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ring,
        { borderColor: color },
        motion
          ? { opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.9] }), transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.045] }) }] }
          : { opacity: 0.6 },
      ]}
    />
  );
}

// ---- Dairesel cam buton ----
function GlassButton({
  aura,
  variant,
  label,
  motion,
  onPress,
}: {
  aura: Aura;
  variant: 'explore' | 'kahya';
  label: string;
  motion: boolean;
  onPress: () => void;
}) {
  const sheen = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!motion || variant !== 'kahya') return;
    const loop = Animated.loop(
      Animated.timing(sheen, { toValue: 1, duration: 7500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [motion, variant, sheen]);

  const ringColor = variant === 'explore' ? 'rgba(201,162,74,0.45)' : 'rgba(168,142,232,0.5)';
  const iconColor = variant === 'explore' ? '#B98F3C' : '#6E5AA8';

  return (
    <View style={styles.buttonSlot}>
      <BreathingRing color={ringColor} motion={motion} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [styles.diskPressable, pressed && { transform: [{ scale: 0.95 }] }]}
      >
        <View style={styles.disk}>
          <BlurView intensity={28} tint={aura === 'day' ? 'light' : 'dark'} style={StyleSheet.absoluteFill} />
          {variant === 'explore' ? (
            <View style={[StyleSheet.absoluteFill, styles.exploreFill]} />
          ) : (
            <LinearGradient
              colors={['rgba(217,204,233,0.34)', 'rgba(217,240,238,0.26)', 'rgba(246,217,230,0.34)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          {/* iç hairline */}
          <View
            style={[
              StyleSheet.absoluteFill,
              styles.diskInner,
              { borderColor: variant === 'explore' ? 'rgba(201,162,74,0.34)' : 'rgba(255,255,255,0.5)' },
            ]}
          />
          {/* Kâhya ışık parıltısı */}
          {variant === 'kahya' && motion ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.sheen,
                { transform: [{ rotate: '20deg' }, { translateX: sheen.interpolate({ inputRange: [0, 1], outputRange: [-70, 70] }) }] },
              ]}
            />
          ) : null}
          {variant === 'explore' ? <CompassIcon color={iconColor} /> : <UserIcon color={iconColor} />}
        </View>
      </Pressable>
      <Text style={[styles.buttonLabel, { color: PALETTE[aura].label }]}>{label}</Text>
    </View>
  );
}

export function OnboardingScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const [aura, setAura] = useState<Aura>(currentAuraFromClock);
  const [motion, setMotion] = useState(true);
  const [devToast, setDevToast] = useState<string | null>(null);
  const [kahyaSoon, setKahyaSoon] = useState(false);

  // reduce-motion'a saygı
  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (mounted) setMotion(!reduced);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Video: muted, loop yok → son frame'de donar. Aura değişince kaynak değişir.
  const player = useVideoPlayer(aura === 'day' ? DAY_SRC : NIGHT_SRC, (p) => {
    p.loop = false;
    p.muted = true;
    p.play();
  });
  useEffect(() => {
    player.replace(aura === 'day' ? DAY_SRC : NIGHT_SRC);
    player.loop = false;
    player.muted = true;
    player.play();
  }, [aura, player]);

  const showDevToast = (msg: string) => {
    if (!ENABLE_DEVELOPER_DEBUG_UI) return;
    setDevToast(msg);
    setTimeout(() => setDevToast(null), 1600);
  };

  const onExplore = () => {
    showDevToast('→ manuel kullanım akışı');
    navigation.navigate('Home');
  };
  const onKahya = () => {
    showDevToast('→ orchestrator + navigation agent');
    setKahyaSoon(true);
    setTimeout(() => setKahyaSoon(false), 2400);
  };

  const pal = PALETTE[aura];

  return (
    <View style={styles.root}>
      <StatusBar barStyle={pal.statusBar} translucent backgroundColor="transparent" />
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />

      {/* Üst scrim — wordmark okunurluğu (her aura) */}
      <LinearGradient
        colors={aura === 'night' ? ['rgba(8,6,18,0.42)', 'transparent'] : ['rgba(248,241,232,0.30)', 'transparent']}
        style={styles.topScrim}
        pointerEvents="none"
      />
      {/* Gece sis katmanı */}
      {aura === 'night' ? (
        <>
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(123,108,246,0.07)' }]} />
          <LinearGradient colors={['transparent', 'rgba(14,10,24,0.22)']} style={styles.bottomVignette} pointerEvents="none" />
        </>
      ) : null}

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {/* İçerik üst blok */}
        <View style={styles.header}>
          <Text style={[styles.wordmark, { color: pal.wordmark, textShadowColor: pal.wordmarkShadow }]}>
            {t('onboarding.wordmarkLine1')}
            {'\n'}
            {t('onboarding.wordmarkLine2')}
          </Text>
          <View style={styles.dividerRow}>
            <View style={styles.hairline} />
            <View style={styles.diamond} />
            <View style={styles.hairline} />
          </View>
          <Text style={[styles.subtitle, { color: pal.subtitle }]}>{t('onboarding.subtitle')}</Text>
        </View>
      </SafeAreaView>

      {/* İki dairesel buton — dikey ~%52 (konak kapısı hizası) */}
      <View style={[styles.buttonRow, { top: height * 0.52 }]} pointerEvents="box-none">
        <GlassButton aura={aura} variant="explore" label={t('onboarding.exploreLabel')} motion={motion} onPress={onExplore} />
        <GlassButton aura={aura} variant="kahya" label={t('onboarding.kahyaLabel')} motion={motion} onPress={onKahya} />
      </View>

      {/* Kâhya "yakında" placeholder */}
      {kahyaSoon ? (
        <View style={styles.soonWrap} pointerEvents="none">
          <BlurView intensity={30} tint={aura === 'day' ? 'light' : 'dark'} style={styles.soonCard}>
            <Text style={[styles.soonText, { color: aura === 'day' ? colors.inkPlum : colors.textOnDark }]}>
              {t('onboarding.kahyaSoon')}
            </Text>
          </BlurView>
        </View>
      ) : null}

      {/* Geliştirici parçaları — release'de düşer */}
      {ENABLE_DEVELOPER_DEBUG_UI ? (
        <SafeAreaView style={styles.devLayer} edges={['top', 'bottom']} pointerEvents="box-none">
          <View style={styles.devHud}>
            <Text style={styles.devHudText}>◆ DEV · ROUTING</Text>
            <Text style={styles.devHudSub}>tokens:0 · mem:idle</Text>
            <Pressable onPress={() => setAura((a) => (a === 'day' ? 'night' : 'day'))} style={styles.devToggle}>
              <Text style={styles.devHudSub}>aura: {aura} ⇄</Text>
            </Pressable>
          </View>
          {devToast ? (
            <View style={styles.toast}>
              <Text style={styles.toastText}>{devToast}</Text>
            </View>
          ) : null}
        </SafeAreaView>
      ) : null}
    </View>
  );
}

const DISK = 84;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.nightBase },
  safe: { flex: 1 },
  topScrim: { position: 'absolute', top: 0, left: 0, right: 0, height: 260 },
  bottomVignette: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 220 },

  header: { alignItems: 'center', paddingTop: 56, paddingHorizontal: 24 },
  wordmark: {
    fontFamily: 'Cinzel_600SemiBold',
    fontSize: 52,
    lineHeight: 53,
    letterSpacing: 2,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 16,
  },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 14 },
  hairline: { width: 50, height: 1, backgroundColor: colors.warmGold, opacity: 0.7 },
  diamond: {
    width: 7,
    height: 7,
    backgroundColor: colors.warmGold,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 9,
    shadowColor: colors.warmGold,
    shadowOpacity: 0.7,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold_Italic',
    fontSize: 16,
    lineHeight: 25,
    maxWidth: 272,
    textAlign: 'center',
  },

  buttonRow: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 30 },
  buttonSlot: { alignItems: 'center', justifyContent: 'flex-start' },
  ring: {
    position: 'absolute',
    top: -7,
    width: DISK + 14,
    height: DISK + 14,
    borderRadius: (DISK + 14) / 2,
    borderWidth: 1,
  },
  diskPressable: { width: DISK, height: DISK },
  disk: {
    width: DISK,
    height: DISK,
    borderRadius: DISK / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreFill: { backgroundColor: 'rgba(255,250,243,0.22)' },
  diskInner: { borderRadius: DISK / 2, borderWidth: 1 },
  sheen: {
    position: 'absolute',
    top: -20,
    left: DISK / 2 - 9,
    width: 18,
    height: DISK + 40,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  buttonLabel: {
    marginTop: 12,
    fontFamily: 'Nunito_800ExtraBold_Italic',
    fontSize: 15,
    letterSpacing: 0.15,
    textAlign: 'center',
  },

  soonWrap: { position: 'absolute', left: 0, right: 0, bottom: 110, alignItems: 'center' },
  soonCard: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 999, overflow: 'hidden' },
  soonText: { fontFamily: 'Nunito_700Bold', fontSize: 14 },

  devLayer: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },
  devHud: {
    alignSelf: 'flex-start',
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(201,162,74,0.4)',
  },
  devHudText: { color: '#E6C173', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  devHudSub: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 },
  devToggle: { marginTop: 4 },
  toast: {
    alignSelf: 'center',
    marginBottom: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  toastText: { color: '#FFF', fontSize: 12 },
});
