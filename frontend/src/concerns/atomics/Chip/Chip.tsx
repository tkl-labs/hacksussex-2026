import {ReactNode, useMemo} from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";

import { useAppTheme } from "@/theme";
import { Text } from "@concerns/atomics";

type ChipVariant = "filled" | "outlined" | "soft";

type ChipProps = {
  label: string;
  selected?: boolean;
  variant?: ChipVariant;
  onPress?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
};

export const Chip = ({
  label,
  selected = false,
  variant = "outlined",
  onPress,
  leftIcon,
  rightIcon,
  disabled = false,
}: ChipProps) => {
  const theme = useAppTheme();

  const styles = useMemo(() => {
    const base = {
      filled: {
        backgroundColor: selected ? theme.colors.primary : theme.colors.surfaceVariant,
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: selected ? theme.colors.primaryContainer : "transparent",
        borderWidth: 1.5,
        borderColor: selected ? theme.colors.primary : theme.colors.outline,
      },
      soft: {
        backgroundColor: selected ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
        borderWidth: 0,
      },
    };

    return StyleSheet.create({
      chip: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: theme.spacing(1.5),
        paddingVertical: theme.spacing(1),
        borderRadius: theme.borderRadius.fiftyPercent,
        gap: theme.spacing(0.5),
        opacity: disabled ? 0.4 : 1,
        ...base[variant],
      },
      label: {
        color: variant === "filled" && selected
          ? theme.colors.onPrimary
          : selected
          ? theme.colors.onSurface
          : theme.colors.onSurfaceVariant,
        fontWeight: selected ? "600" : "400"
      },
    });
  }, [theme, selected, variant, disabled]);

  return (
    <TouchableOpacity
      style={styles.chip}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
    >
      {leftIcon && <View>{leftIcon}</View>}
      <Text variant="bodySmall" style={styles.label}>
        {label}
      </Text>
      {rightIcon && <View>{rightIcon}</View>}
    </TouchableOpacity>
  );
};