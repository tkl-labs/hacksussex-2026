export const Colors = {
  primary: "#FF5A5F",
  onPrimary: "#FFFFFF",
  primaryContainer: "#FFDAD6",
  onPrimaryContainer: "#3D0002",

  secondary: "#00A699",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#D6F5F1",
  onSecondaryContainer: "#003733",

  tertiary: "#FC642D",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#FFDBC9",
  onTertiaryContainer: "#3B1200",

  error: "#D93B40",
  onError: "#FFFFFF",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#3D0002",

  background: "#FFFFFF",
  onBackground: "#222222",

  surface: "#FFFFFF",
  onSurface: "#222222",
  surfaceVariant: "#F7F7F7",
  onSurfaceVariant: "#717171",

  outline: "#DDDDDD",
  outlineVariant: "#EBEBEB",

  inverseSurface: "#222222",
  inverseOnSurface: "#F7F7F7",
  inversePrimary: "#FF8A8D",

  shadow: "#000000",
  scrim: "#000000",
} as const;

export type AppColors = typeof Colors;
