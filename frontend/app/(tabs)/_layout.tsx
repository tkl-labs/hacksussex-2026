import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/theme";
import {HomeIcon, PersonWalkingIcon, SettingsIcon} from "@concerns/atomics/Icons";

export default function TabsLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          borderTopWidth: 1,
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: theme.spacing(0.5),
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: theme.spacing(0.25),
        },
        animation: "fade",
      }}
    >
      <Tabs.Screen
        name="walk"
        options={{
          title: "Walk",
          tabBarIcon: ({ focused }) => (
            <PersonWalkingIcon color={focused ? theme.colors.primary : theme.colors.onSurfaceVariant} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
        title: "Home",
         tabBarIcon: ({ focused }) => (
            <HomeIcon color={focused ? theme.colors.primary : theme.colors.onSurfaceVariant} />
        ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <SettingsIcon color={focused ? theme.colors.primary : theme.colors.onSurfaceVariant} />
          ),
        }}
      />
    </Tabs>
  );
}