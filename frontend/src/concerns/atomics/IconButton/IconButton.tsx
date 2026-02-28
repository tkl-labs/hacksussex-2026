import { ReactNode, useMemo } from "react";
import { StyleSheet } from "react-native";
import { IconButton as PaperIconButton, IconButtonProps as PaperIconButtonProps } from "react-native-paper";

import { useAppTheme } from "@/theme";

type IconButtonVariant = "filled" | "outlined" | "ghost";
type IconButtonSize = "small" | "medium" | "large";

type IconButtonProps = Omit<PaperIconButtonProps, "icon" | "size"> & {
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
};

const sizeMap = {
  small: 32,
  medium: 40,
  large: 48,
};

const iconSizeMap = {
  small: 14,
  medium: 18,
  large: 22,
};

export const IconButton = ({
  icon,
  variant = "ghost",
  size = "medium",
  disabled,
  style,
  ...props
}: IconButtonProps) => {
  const theme = useAppTheme();
  const dimension = sizeMap[size];
  const iconSize = iconSizeMap[size];

  const variantStyles = {
    filled: {
      backgroundColor: theme.colors.primary,
      borderWidth: 0,
    },
    outlined: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: theme.colors.outline,
    },
    ghost: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 0,
    },
  };

  const styles = useMemo(() => StyleSheet.create({
    button: {
      width: dimension,
      height: dimension,
      borderRadius: theme.borderRadius.fiftyPercent,
      margin: 0,
      ...variantStyles[variant],
    },
  }), [theme, variant, size]);

  return (
    <PaperIconButton
      icon={() => icon}
      size={iconSize}
      disabled={disabled}
      style={[styles.button, style]}
      rippleColor={`${theme.colors.primary}30`}
      theme={{
        colors: {
          onSurfaceVariant: variant === "filled"
            ? theme.colors.onPrimary
            : theme.colors.onSurfaceVariant,
        },
      }}
      {...props}
    />
  );
};