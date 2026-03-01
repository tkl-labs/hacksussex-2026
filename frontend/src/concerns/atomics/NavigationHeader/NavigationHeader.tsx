import { ReactNode, useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text, PageHeader } from "@concerns/atomics";
import { useAppTheme } from "@/theme";

export type NavigationHeaderProps = {
  back?: boolean | (() => void);
  title?: string | ReactNode;
  rightNode?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export const NavigationHeader = ({
  back,
  title,
  rightNode,
  containerStyle,
}: NavigationHeaderProps) => {
  const router = useRouter();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outlineVariant,
          paddingHorizontal: theme.spacing(2),
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
        },
        backButton: {
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing(0.5),
          paddingVertical: theme.spacing(0.5),
        },
        backText: {
          color: theme.colors.primary,
        },
        titleText: {
          textAlign: "center",
        },
      }),
    [theme, insets],
  );

  const leftNode = useMemo(() => {
    if (!back) return null;

    const handlePress = typeof back === "function" ? back : () => router.back();

    return (
      <TouchableOpacity onPress={handlePress} style={styles.backButton}>
        <Text variant="titleSmall" style={styles.backText}>
          ← Back
        </Text>
      </TouchableOpacity>
    );
  }, [back, styles, router]);

  const centerNode = useMemo(() => {
    if (!title) return null;
    if (typeof title === "string") {
      return (
        <Text variant="titleMedium" style={styles.titleText}>
          {title}
        </Text>
      );
    }
    return <>{title}</>;
  }, [title, styles]);

  return (
    <PageHeader
      left={leftNode ?? <View />}
      center={centerNode}
      right={rightNode ?? <View />}
      containerStyle={[styles.container, containerStyle]}
    />
  );
};
