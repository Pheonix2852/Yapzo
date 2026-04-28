import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SSOCallback() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      // The SSO flow is complete, Clerk has set up the session
      // Navigation will happen automatically via the auth guard
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#A29BFE" />
      </SafeAreaView>
    );
  }

  // If signed in, redirect to home; otherwise go back to auth
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}
