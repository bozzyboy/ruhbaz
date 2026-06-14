import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { BrandedScrollView } from '../components/BrandedScrollView';
import { SymbolicDisclaimer } from '../components/SymbolicDisclaimer';
import { getAssistantLabel } from '../config/constants';
import { getManorFeed, type ResolvedManorFeedItem } from '../services/manorFeedService';
import type { ManorFeedKind } from '../data/manorFeedSeed';

type Props = NativeStackScreenProps<RootStackParamList, 'ManorFeed'>;

function kindLabel(kind: ManorFeedKind, t: ReturnType<typeof useTranslation>['t']): string {
  switch (kind) {
    case 'sky':
      return t('manorFeed.kindSky');
    case 'ritual':
      return t('manorFeed.kindRitual');
    case 'invite':
      return t('manorFeed.kindInvite');
    case 'wisdom':
    default:
      return t('manorFeed.kindWisdom');
  }
}

export function ManorFeedScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [items, setItems] = useState<ResolvedManorFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const feed = await getManorFeed();
      setItems(feed);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: t('nav.manorFeed') });
    void load();
  }, [navigation, t, load]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      void load();
    });
    return unsubscribe;
  }, [navigation, load]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <SymbolicDisclaimer />
      <BrandedScrollView contentContainerStyle={styles.content} showScrollToTop>
        <Text style={styles.intro}>{t('manorFeed.intro')}</Text>

        {loading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t('common.wait')}</Text>
          </View>
        ) : items.length ? (
          items.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.attribution}>
                  {item.personaId ? getAssistantLabel(item.personaId) : t('manorFeed.byManor')}
                </Text>
                <Text style={styles.kindBadge}>{kindLabel(item.kind, t)}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>{t('manorFeed.emptyTitle')}</Text>
            <Text style={styles.emptyText}>{t('manorFeed.emptyText')}</Text>
          </View>
        )}
      </BrandedScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14141E' },
  content: { padding: 18, paddingBottom: 36 },
  intro: { color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 20, marginBottom: 14 },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(30,30,40,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.2)',
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 10 },
  attribution: { color: '#E8C49A', fontSize: 13, fontWeight: '800', flex: 1 },
  kindBadge: {
    color: '#D4A574',
    borderColor: 'rgba(212,165,116,0.45)',
    borderWidth: 1,
    borderRadius: 9,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  cardTitle: { color: '#FFF5E8', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  cardBody: { color: 'rgba(255,255,255,0.82)', fontSize: 14, lineHeight: 21 },
  emptyCard: {
    borderRadius: 16,
    padding: 18,
    backgroundColor: 'rgba(30,30,40,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.18)',
  },
  emptyTitle: { color: '#E8C49A', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  emptyText: { color: 'rgba(255,255,255,0.68)', fontSize: 13, lineHeight: 20 },
});
