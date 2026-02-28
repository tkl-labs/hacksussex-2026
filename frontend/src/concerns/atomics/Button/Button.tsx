import { useMemo } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Button as PaperButton, ButtonProps } from "react-native-paper";

import { useAppTheme } from "@/theme";

type ButtonMode = "contained" | "outlined" | "text";
type ButtonSize = "medium" | "large";

type CustomButtonProps = Omit<ButtonProps, "mode"> & {
  mode?: ButtonMode;
  size?: ButtonSize;
};

export const Button = ({
  mode = "contained",
  size = "medium",
  style,
  contentStyle,
  loading = false,
  disabled = false,
  children,
  ...props
}: CustomButtonProps) => {
  const theme = useAppTheme();
  const isDisabled = loading || disabled;

  const styles = useMemo(() => {
    const minHeight = size === "large" ? 56 : 44;
    const borderRadius = theme.borderRadius.semiRound;
    const fontSize = size === "large" ? 16 : 14;

    return StyleSheet.create({
      contained: {
        borderRadius,
        minHeight,
        backgroundColor: theme.colors.primary,
        opacity: isDisabled ? 0.4 : 1,
      } as ViewStyle,

      outlined: {
        borderRadius,
        minHeight,
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
        backgroundColor: "transparent",
        opacity: isDisabled ? 0.4 : 1,
      } as ViewStyle,

      text: {
        opacity: isDisabled ? 0.4 : 1,
      } as ViewStyle,

      content: {
        minHeight,
      },

      label: {
        fontSize,
        fontWeight: "600",
        letterSpacing: 0.3,
        color:
          mode === "contained"
            ? theme.colors.onPrimary
            : mode === "outlined"
            ? theme.colors.primary
            : theme.colors.primary,
      },
    });
  }, [theme, mode, size, isDisabled]);

  const buttonStyle =
    mode === "contained"
      ? styles.contained
      : mode === "outlined"
      ? styles.outlined
      : styles.text;

  return (
    <PaperButton
      mode={mode}
      style={[buttonStyle, style]}
      contentStyle={[styles.content, contentStyle]}
      labelStyle={styles.label}
      loading={loading}
      disabled={isDisabled}
      rippleColor={
        mode === "contained"
          ? `${theme.colors.onPrimary}20`
          : `${theme.colors.primary}20`
      }
      {...props}
    >
      {children}
    </PaperButton>
  );
};