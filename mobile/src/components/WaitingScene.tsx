import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getManorFeed, type ResolvedManorFeedItem } from '../services/manorFeedService';

// Okuma hazırlanırken (K33/F7 bekleme sahnesi) Konak Akışı havuzundan tek bir
// atmosfer kartı gösterir — sıfır ek gecikme (zaten cache'li/bundle tohum) ve
// "davet" türünü eler (okuma sırasında okumaya davet tuhaf olmasın). Akış boşsa
// hiçbir şey göstermez (null), yani mevcut loading deneyimini bozmaz.
let mountRotation = 0;

export function WaitingScene() {
  const { t } = useTranslation();
  const [item, setItem] = useState<ResolvedManorFeedItem | null>(null);

  useEffect(() => {
    let active = true;
    void getManorFeed()
      .then((items) => {
        if (!active) return;
        const pool = items.filter((entry) => entry.kind !== 'invite');
        if (!pool.length) return;
        const idx = mountRotation % pool.length;
        mountRotation += 1;
        setItem(pool[idx]);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (!item) return null;

  return (
    <View style={styles.card} accessibilityRole="text">
      <Text style={styles.label}>{t('manorFeed.whileYouWait')}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    marginTop: 12,
    borderRadius: 14,
    padding: 14,
    backgroundColor: 'rgba(212,165,116,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.22)',
  },
  label: { color: '#D4A574', fontSize: 11, fontWeight: '800', letterSpacing: 0.3, marginBottom: 6 },
  title: { color: '#FFF5E8', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  body: { color: 'rgba(255,255,255,0.78)', fontSize: 13, lineHeight: 20 },
});
