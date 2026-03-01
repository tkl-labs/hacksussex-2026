import {useMemo, useState} from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { useAppTheme } from '@/theme';
import {
  Button,
  Text,
} from '@concerns/atomics';

const sections = [
  {
    title: 'Colors',
    items: [
      { label: 'Primary', colorKey: 'primary' },
      { label: 'Secondary', colorKey: 'secondary' },
      { label: 'Tertiary', colorKey: 'tertiary' },
      { label: 'primaryContainer', colorKey: 'primaryContainer' },
      { label: 'secondaryContainer', colorKey: 'secondaryContainer' },
      { label: 'Surface', colorKey: 'surface' },
      { label: 'SurfaceVariant', colorKey: 'surfaceVariant' },
      { label: 'StarDust', colorKey: 'starDust' },
      { label: 'Error', colorKey: 'error' },
    ],
  },
];

export default function DevScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  const [selectedChip, setSelectedChip] = useState<string>('all');

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing(2.5),
      paddingTop: theme.spacing(7.5),
      paddingBottom: theme.spacing(7.5),
    },
    header: {
      marginBottom: theme.spacing(4),
    },
    backButton: {
      marginBottom: theme.spacing(2),
    },
    section: {
      marginBottom: theme.spacing(4.5),
    },
    sectionTitle: {
      marginBottom: theme.spacing(1.75),
    },
    swatchGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing(1.5),
    },
    swatchItem: {
      width: '30%',
      alignItems: 'center',
    },
    swatch: {
      width: '100%',
      height: 52,
      borderRadius: theme.borderRadius.medium,
      marginBottom: theme.spacing(0.75),
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    surfaceRow: {
      padding: theme.spacing(1.75),
      borderRadius: theme.borderRadius.small,
      marginBottom: theme.spacing(1),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    iconRow: {
      flexDirection: 'row',
      gap: theme.spacing(1),
      alignItems: 'center',
    },
  }), [theme]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text variant="titleSmall" style={{ color: theme.colors.primary }}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text variant="headline">Dev Preview</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Theme & Component Reference
        </Text>
      </View>

      <View style={[styles.section, { gap: theme.spacing(1.5) }]}>
        <Text variant="caption" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          Screens
        </Text>
        <Button mode="outlined" onPress={() => router.push('/onboarding')}>
          Onboarding
        </Button>
        <Button mode="outlined" onPress={() => router.push('/auth')}>
          Login / Register
        </Button>
        <Button mode="outlined" onPress={() => router.push('/personalise')}>
          Personalisation
        </Button>
      </View>

      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text variant="caption" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            {section.title}
          </Text>
          <View style={styles.swatchGrid}>
            {section.items.map((item) => {
              const color = theme.colors[item.colorKey as keyof typeof theme.colors] as string;
              return (
                <View key={item.label} style={styles.swatchItem}>
                  <View style={[styles.swatch, { backgroundColor: color }]} />
                  <Text variant="bodySmall" style={{ textAlign: 'center', fontWeight: '600' }}>
                    {item.label}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                    {color}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      ))}

      <View style={styles.section}>
        <Text variant="caption" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          Typography
        </Text>
        <Text variant="headline">Headline</Text>
        <Text variant="titleLarge">Title Large</Text>
        <Text variant="titleMedium">Title Medium</Text>
        <Text variant="titleSmall">Title Small</Text>
        <Text variant="bodyLarge">Body Large</Text>
        <Text variant="bodyMedium">Body Medium</Text>
        <Text variant="bodySmall">Body Small</Text>
        <Text variant="caption">Caption</Text>
      </View>

      <View style={styles.section}>
        <Text variant="caption" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          Surfaces
        </Text>
        {[
          { label: 'Background', colorKey: 'background' },
          { label: 'Surface', colorKey: 'surface' },
          { label: 'Surface Variant', colorKey: 'surfaceVariant' },
          { label: 'Star Dust', colorKey: 'starDust' },
          { label: 'Primary Container', colorKey: 'primaryContainer' },
        ].map((s) => {
          const bg = theme.colors[s.colorKey as keyof typeof theme.colors] as string;
          return (
            <View key={s.label} style={[styles.surfaceRow, { backgroundColor: bg }]}>
              <Text variant="bodySmall" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
                {s.label}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {bg}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}