import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

import type { AppTheme } from "./useAppTheme";
import { Colors } from "./colors";

const sharedColors = {
  primary: Colors.primary,
  onPrimary: Colors.onPrimary,
  primaryContainer: Colors.primaryContainer,
  onPrimaryContainer: Colors.onPrimaryContainer,
  secondary: Colors.secondary,
  onSecondary: Colors.onSecondary,
  secondaryContainer: Colors.secondaryContainer,
  onSecondaryContainer: Colors.onSecondaryContainer,
  tertiary: Colors.tertiary,
  onTertiary: Colors.onTertiary,
  tertiaryContainer: Colors.tertiaryContainer,
  onTertiaryContainer: Colors.onTertiaryContainer,
  error: Colors.error,
  onError: Colors.onError,
  errorContainer: Colors.errorContainer,
  onErrorContainer: Colors.onErrorContainer,
  background: Colors.background,
  onBackground: Colors.onBackground,
  surface: Colors.surface,
  onSurface: Colors.onSurface,
  surfaceVariant: Colors.surfaceVariant,
  onSurfaceVariant: Colors.onSurfaceVariant,
  outline: Colors.outline,
  outlineVariant: Colors.outlineVariant,
  shadow: Colors.shadow,
  scrim: Colors.scrim,
  inverseSurface: Colors.inverseSurface,
  inverseOnSurface: Colors.inverseOnSurface,
  inversePrimary: Colors.inversePrimary,
};

const customProperties = {
  // spacing(1) = 8, spacing(2) = 16, spacing(3) = 24 etc.
  spacing: (multiplier: number) => multiplier * 8,
  borderRadius: {
    semiRound: 20,
    round: 32,
    fiftyPercent: 9999,
  },
};

export const AppDarkTheme: AppTheme = {
  ...MD3DarkTheme,
  ...customProperties,
  colors: {
    ...MD3DarkTheme.colors,
    ...sharedColors,
  },
} as AppTheme;

export const AppLightTheme: AppTheme = {
  ...MD3LightTheme,
  ...customProperties,
  colors: {
    ...MD3LightTheme.colors,
    ...sharedColors,
  },
} as AppTheme;