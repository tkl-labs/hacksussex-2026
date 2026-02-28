import { useMemo } from "react";
import { StyleSheet, TextStyle } from "react-native";
import { Text as PaperText, TextProps as PaperTextProps } from "react-native-paper";

import { useAppTheme } from "@/theme";

type TextVariant =
  | "headline"
  | "titleLarge"
  | "titleMedium"
  | "titleSmall"
  | "bodyLarge"
  | "bodyMedium"
  | "bodySmall"
  | "caption";

type TextProps = Omit<PaperTextProps<string>, "variant"> & {
  variant?: TextVariant;
};

const variantStyles: Record<TextVariant, TextStyle> = {
  headline: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  titleLarge: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  titleSmall: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 26,
    letterSpacing: 0.15,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  caption: {
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
};

export const Text = ({ variant = "bodyMedium", style, ...props }: TextProps) => {
  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          color: theme.colors.onBackground,
          ...variantStyles[variant],
        },
      }),
    [theme, variant]
  );

  return (
    <PaperText
      style={[styles.base, style]}
      {...props}
    />
  );
};