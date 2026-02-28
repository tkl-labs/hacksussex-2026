import { useMemo } from "react";
import { ActivityIndicator as RNActivityIndicator, View, StyleSheet } from "react-native";

import { useAppTheme } from "@/theme";
import { Text } from "@concerns/atomics";

type ActivityIndicatorProps = {
  size?: "small" | "large";
  label?: string;
  fullScreen?: boolean;
  color?: string;
};

export const ActivityIndicator = ({
  size = "large",
  label,
  fullScreen = false,
  color,
}: ActivityIndicatorProps) => {
  const theme = useAppTheme();

  const styles = useMemo(() => StyleSheet.create({
    fullScreen: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: `${theme.colors.background}CC`,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing(1.5),
    },
    inline: {
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing(2),
      gap: theme.spacing(1),
    },
    label: {
      color: theme.colors.onSurfaceVariant,
    },
  }), [theme]);

  return (
    <View style={fullScreen ? styles.fullScreen : styles.inline}>
      <RNActivityIndicator
        size={size}
        color={color ?? theme.colors.primary}
      />
      {label && (
        <Text variant="bodySmall" style={styles.label}>
          {label}
        </Text>
      )}
    </View>
  );
};