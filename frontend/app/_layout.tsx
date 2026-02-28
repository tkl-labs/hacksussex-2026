import { Stack } from 'expo-router';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import {StatusBar} from "expo-status-bar";

import { store, persistor } from '@/store';
import { AppDarkTheme, AppLightTheme } from '@/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? AppLightTheme : AppDarkTheme;
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
              animation: "default",
              animationDuration: 200,}}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="dev" />
          </Stack>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}