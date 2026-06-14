import React, { useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export type BrandedPickerOption<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  label?: string;
  selectedValue: T;
  options: BrandedPickerOption<T>[];
  onValueChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  compact?: boolean;
  /** Uzun listelerde arama kutusu. Verilmezse eşik (20) aşılınca otomatik açılır. */
  searchable?: boolean;
};

// Bu eşiğin üstündeki listelerde arama kutusu otomatik gösterilir (ülke/şehir/yıl gibi).
const SEARCH_AUTO_THRESHOLD = 20;

export function BrandedPicker<T extends string>({
  label,
  selectedValue,
  options,
  onValueChange,
  placeholder = 'Seç',
  disabled = false,
  compact = false,
  searchable,
}: Props<T>) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const selected = useMemo(() => options.find((option) => option.value === selectedValue) || null, [options, selectedValue]);
  const showSearch = searchable ?? options.length > SEARCH_AUTO_THRESHOLD;
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    if (!showSearch || !q) return options;
    return options.filter((option) => option.label.toLocaleLowerCase('tr-TR').includes(q));
  }, [options, query, showSearch]);

  const open = () => {
    if (disabled) return;
    setQuery('');
    setVisible(true);
  };
  const close = () => setVisible(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.trigger, compact && styles.triggerCompact, disabled && styles.disabled]}
        activeOpacity={0.88}
        onPress={open}
        disabled={disabled}
      >
        {label ? <Text style={styles.inlineLabel}>{label}</Text> : null}
        <Text style={[styles.triggerText, !selected && styles.placeholder]} numberOfLines={1}>
          {selected?.label || placeholder}
        </Text>
      </TouchableOpacity>
      {visible ? (
        <Modal visible transparent animationType="fade" onRequestClose={close}>
          <View style={[styles.overlay, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>{label || placeholder}</Text>
                <TouchableOpacity onPress={close}>
                  <Text style={styles.closeText}>{t('common.close')}</Text>
                </TouchableOpacity>
              </View>
              {showSearch ? (
                <TextInput
                  style={styles.search}
                  value={query}
                  onChangeText={setQuery}
                  placeholder={t('common.search')}
                  placeholderTextColor="rgba(255,255,255,0.42)"
                  autoCorrect={false}
                  autoCapitalize="none"
                  selectionColor="#D4A574"
                />
              ) : null}
              <FlatList
                data={filtered}
                style={styles.optionScroll}
                contentContainerStyle={styles.optionContent}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) => item.value}
                initialNumToRender={16}
                maxToRenderPerBatch={16}
                windowSize={9}
                removeClippedSubviews
                ItemSeparatorComponent={renderSeparator}
                ListEmptyComponent={showSearch ? <Text style={styles.emptyText}>{t('common.noResults')}</Text> : null}
                renderItem={({ item }) => {
                  const active = item.value === selectedValue;
                  return (
                    <TouchableOpacity
                      style={[styles.optionRow, active && styles.optionRowActive]}
                      onPress={() => {
                        onValueChange(item.value);
                        close();
                      }}
                    >
                      <Text style={[styles.optionText, active && styles.optionTextActive]}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}

function renderSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.25)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.18)',
    marginBottom: 10,
  },
  triggerCompact: {
    paddingHorizontal: 8,
    paddingVertical: 9,
    marginBottom: 0,
  },
  disabled: { opacity: 0.55 },
  inlineLabel: { color: '#D4A574', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  triggerText: { color: '#FFF5E8', fontSize: 14, fontWeight: '700' },
  placeholder: { color: 'rgba(255,255,255,0.42)' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,10,18,0.72)',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  card: {
    maxHeight: '82%',
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(30,30,40,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.35)',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  title: { color: '#D4A574', fontSize: 16, fontWeight: '800', flex: 1, paddingRight: 10 },
  closeText: { color: '#E8C49A', fontSize: 13, fontWeight: '800' },
  search: {
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFF5E8',
    backgroundColor: 'rgba(0,0,0,0.22)',
    fontSize: 14,
    marginBottom: 10,
  },
  optionScroll: { flexShrink: 1 },
  optionContent: { paddingBottom: 4 },
  separator: { height: 8 },
  emptyText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', paddingVertical: 16 },
  optionRow: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.2)',
    backgroundColor: 'rgba(0,0,0,0.16)',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  optionRowActive: {
    borderColor: '#D4A574',
    backgroundColor: 'rgba(212,165,116,0.16)',
  },
  optionText: { color: '#FFF5E8', fontSize: 14, fontWeight: '700' },
  optionTextActive: { color: '#E8C49A' },
});
