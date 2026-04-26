import { COLORS } from "@/src/lib/theme";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import { Image } from "expo-image";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MENU_ITEMS = [
  { icon: "notifications-outline", label: "Notifications", color: COLORS.primary },
  { icon: "bookmark-outline", label: "Saved Items", color: COLORS.accent },
  { icon: "time-outline", label: "History", color: COLORS.accentSecondary },
  { icon: "settings-outline", label: "Settings", color: COLORS.textMuted },
];

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 py-3">
        <Text className="text-2xl font-sans-bold text-foreground">Profile</Text>
      </View>

      <View className="items-center py-5">
        <View className="mb-3.5 relative">
          <Image source={user?.imageUrl} style={{ width: 88, height: 88, borderRadius: 44 }} contentFit="contain" />
          <View className="absolute bottom-[2px] right-[2px] h-[18px] w-[18px] rounded-[9px] bg-accent-secondary border-[3px] border-background" />
        </View>

        <Text className="text-2xl font-sans-bold text-foreground">{user?.fullName || user?.username}</Text>
        <Text className="mt-0.5 text-base text-foreground-muted">{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>

      <View className="mt-2 mb-6 flex-row gap-3 px-5">
        <View className="flex-1 items-center rounded-xl border border-border bg-surface px-4 py-4">
          <Text className="text-2xl font-sans-bold text-primary">24</Text>
          <Text className="mt+1 text-xs text-foreground-muted">Chats</Text>
        </View>

        <View className="flex-1 items-center rounded-xl border border-border bg-surface px-4 py-4">
          <Text className="text-2xl font-sans-bold text-primary">48</Text>
          <Text className="mt+1 text-xs text-foreground-muted">Contacts</Text>
        </View>

        <View className="flex-1 items-center rounded-xl border border-border bg-surface px-4 py-4">
          <Text className="text-2xl font-sans-bold text-primary">36</Text>
          <Text className="mt+1 text-xs text-foreground-muted">Calls</Text>
        </View>
      </View>

      <View className="gap-1 px-5">
        {MENU_ITEMS.map((item, i) => (
          <Pressable
            key={i}
            className="mb-1.5 flex-row items-center gap-3.5 rounded-xl border border-border bg-surface px-4 py-4"
          >
            <View
              className="h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <Text className="flex-1 text-base font-sans-medium text-foreground">{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSubtle} />
          </Pressable>
        ))}
      </View>

      <Pressable
        className="mt-6 mx-5 flex-row items-center justify-center gap-2 rounded-xl border border-[#FF6B6B33] bg-surface px-4 py-4"
        onPress={async () => {
          try {
            await signOut();
            Sentry.logger.info("User signed out successfully", { userId: user?.id });
          } catch (error) {
            Sentry.logger.error("Error signing out", { error, userId: user?.id });
            Sentry.captureException(error);
            Alert.alert("Error", "An error occured while signing out. Please try again");
          }
        }}
      >
        <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
        <Text className="text-base font-sans-medium text-danger">Log Out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProfileScreen;
