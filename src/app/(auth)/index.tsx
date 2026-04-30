import useSocialAuth from "@/src/hooks/useSocialAuth";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const isLoading = loadingStrategy !== null;
  return (
    <View className="flex-1 bg-background">
      <View className="absolute inset-0">
        <LinearGradient
          colors={["#140A00", "#2A1200", "#FF6A00", "#2A1200", "#140A00"]}
          locations={[0, 0.22, 0.5, 0.78, 1]}
          style={{ width: "100%", height: "100%" }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>
      <SafeAreaView className="flex-1 justify-between">
        <View>
          <View className="items-center pt-10 pb-2">
            <View className="w-16 h-16 rounded-[20px] bg-primary/15 items-center justify-center border border-primary/20">
              <Ionicons name="chatbubbles" size={30} color="#FFA24D" />
            </View>

            <Text className="text-3xl font-sans-bold text-foreground tracking-tight mt-4">YAPZO</Text>

            <Text className="text-foreground-muted text-[15px] mt-1.5 tracking-wide font-sans-medium">
              Yap It Out. Figure It Out
            </Text>
          </View>

          <View className="items-center px-6 mt-4">
            <Image
              source={require("@/assets/images/Yapzo_Auth.png")}
              style={{ width: 280, height: 320 }}
              contentFit="cover"
            />
          </View>

          <View className="flex-row flex-wrap justify-center gap-4 px-6">
            {[
              {
                icon: "videocam" as const,
                label: "Video Calls",
                color: "#A29BFE",
                bg: "bg-primary/12 border-primary/20",
              },
              {
                icon: "chatbubbles" as const,
                label: "Messaging",
                color: "#FF6B6B",
                bg: "bg-accent/12 border-accent/20",
              },
              {
                icon: "people" as const,
                label: "Find Partners",
                color: "#00B894",
                bg: "bg-accent-secondary/12 border-accent-secondary/20",
              },
            ].map((chip) => (
              <View
                key={chip.label}
                className={`flex-row items-center gap-2 px-3.5 py-2 rounded-full border ${chip.bg}`}
              >
                <Ionicons name={chip.icon} size={14} color={chip.color} />
                <Text className="text-foreground-muted text-xs font-semibold tracking-wide">{chip.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="px-8 pb-5">
          <View className="flex-row items-center gap-3 mb-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-foreground-subtle text-xs font-medium tracking-widest uppercase">Continue With</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          <View className="flex-row justify-center items-center gap-4 mb-5">
            <Pressable
              className="size-20 rounded-2xl bg-white items-center justify-center active:scale-95 shadow-lg  shadow-white/10"
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              onPress={() => !isLoading && handleSocialAuth("oauth_google")}
            >
              {loadingStrategy === "oauth_google" ? (
                <ActivityIndicator size={"small"} color={"#6C5CE7"} />
              ) : (
                <Image
                  source={require("@/assets/images/google.png")}
                  style={{ width: 28, height: 28 }}
                  contentFit="contain"
                />
              )}
            </Pressable>

            <Pressable
              className="size-20 rounded-2xl bg-white items-center justify-center active:scale-95 shadow-lg  shadow-white/10"
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              onPress={() => !isLoading && handleSocialAuth("oauth_apple")}
            >
              {loadingStrategy === "oauth_apple" ? (
                <ActivityIndicator size={"small"} color={"#6C5CE7"} />
              ) : (
                <Image
                  source={require("@/assets/images/apple.png")}
                  style={{ width: 28, height: 28 }}
                  contentFit="contain"
                />
              )}
            </Pressable>

            <Pressable
              className="size-20 rounded-2xl bg-white items-center justify-center active:scale-95 shadow-lg  shadow-white/10"
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue with Github"
              onPress={() => !isLoading && handleSocialAuth("oauth_github")}
            >
              {loadingStrategy === "oauth_github" ? (
                <ActivityIndicator size={"small"} color={"#6C5CE7"} />
              ) : (
                <Image
                  source={require("@/assets/images/github.png")}
                  style={{ width: 28, height: 28 }}
                  contentFit="contain"
                />
              )}
            </Pressable>
          </View>

          <Text className="text-foreground-subtle text-[11px] text-center leading-4">
            By continuing, you agree to our <Text className="text-primary-light">Terms and Conditions</Text> and our{" "}
            <Text className="text-primary-light">Privacy Policy</Text>
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;
