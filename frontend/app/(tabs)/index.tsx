import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/theme";
import { IconButton, NavigationHeader } from "@concerns/atomics";
import { CloseIcon } from "@concerns/atomics/Icons";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    greeting: {
      fontSize: 32,
      fontWeight: "700",
      color: theme.colors.onBackground,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 60,
    },
    devButton: {
      position: "absolute",
      bottom: 24,
      right: 24,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
    },
    devButtonText: {
      fontSize: 13,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Homepage</Text>

      {/*{__DEV__ && (*/}
      {/*  <TouchableOpacity*/}
      {/*    style={styles.devButton}*/}
      {/*    onPress={() => router.push("/dev")}*/}
      {/*  >*/}
      {/*    <Text style={styles.devButtonText}>Dev Preview</Text>*/}
      {/*  </TouchableOpacity>*/}
      {/*)}*/}
    </View>
  );
}
