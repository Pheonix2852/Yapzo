import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import "react-native-gesture-handler";

import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../../global.css";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Add your Clerk Publishable Key to the .env file");
  }

  const [fontsLoaded] = useFonts({
    "GoogleSans-Regular": require("../../assets/fonts/GoogleSans-Regular.ttf"),
    "GoogleSans-Bold": require("../../assets/fonts/GoogleSans-Bold.ttf"),
    "GoogleSans-Medium": require("../../assets/fonts/GoogleSans-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  Sentry.init({
    dsn: "https://b635d127cfbc83f0a631f5de1baa4efa@o4509574816137216.ingest.de.sentry.io/4511281766465616",

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Enable Logs
    enableLogs: true,

    // Configure Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
  });
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1">
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ClerkProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
