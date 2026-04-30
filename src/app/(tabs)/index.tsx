import { useAppContext } from "@/src/context/AppProvider";
import { COLORS } from "@/src/lib/theme";
import { getGreetingForHour } from "@/src/lib/utils";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Channel } from "stream-chat";

const Chat = () => {
  const { user } = useUser();
  const isExpoGo = Constants.executionEnvironment === "storeClient";
  const firstName = user?.firstName || "there";
  const router = useRouter();
  const { setChannel } = useAppContext();
  const [search, setSearch] = useState("");
  const filters = { members: { $in: [user?.id!] }, type: "messaging" };
  const channelRenderFilterFn = (channels: Channel[]) => {
    if (!search.trim()) return channels;

    const q = search.toLowerCase();

    return channels.filter((channel) => {
      const name = (channel.data?.name as string | undefined)?.toLocaleLowerCase() ?? "";
      const cid = channel.cid.toLowerCase();
      return name.includes(q) || cid.includes(q);
    });
  };

  const ChannelListComponent = !isExpoGo ? require("stream-chat-expo").ChannelList : null;

  const ListHeaderComponent = (
    <View>
      {/* Header Section */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center justify-between mb-1">
          <View>
            <Text className="text-xs text-primary-light font-sans-medium uppercase tracking-wider mb-1">
              {getGreetingForHour()}
            </Text>
            <Text className="text-2xl font-sans-bold text-foreground-muted">
              Welcome back, <Text className="text-primary">{firstName}</Text>
            </Text>
          </View>

          <Pressable onPress={() => router.push("/(tabs)/profile")}>
            <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center border border-primary/30 overflow-hidden">
              {user?.imageUrl ? (
                <Image
                  source={user?.imageUrl}
                  style={{ width: 40, height: 40, borderRadius: 40 }}
                  contentFit="contain"
                />
              ) : (
                <Ionicons name="person" size={20} color={COLORS.primary} />
              )}
            </View>
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-4 mb-4">
        <View className="flex-row items-center bg-surface px-4 py-1 rounded-2xl gap-3 border border-border shadow-lg shadow-black/20">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
            <Ionicons name="search" size={18} color={COLORS.primary} />
          </View>
          <TextInput
            placeholder="Search conversations..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              height: 50,
              fontSize: 15,
              paddingVertical: 0,
              lineHeight: 22,
              color: COLORS.textMuted,
              textAlignVertical: "center",
            }}
          />
          {search.length > 0 && (
            <Ionicons name="close-circle" size={20} color={COLORS.textMuted} onPress={() => setSearch("")} />
          )}
        </View>
      </View>

      {/* Section Header */}
      <View className="flex-row items-center justify-between px-6 mb-4">
        <View className="flex-row items-center gap-2.5">
          <View className="w-8 h-8 rounded-xl bg-primary/20 items-center justify-center border border-primary/30">
            <Ionicons name="chatbubbles" size={18} color={COLORS.textMuted} />
          </View>
          <Text className="text-base text-foreground-muted font-sans-bold text-text">Conversations</Text>
        </View>
        <View className="flex-row items-center gap-1.5 bg-surface px-3 py-1.5 rounded-full border border-border">
          <View className="w-2 h-2 rounded-full bg-success" />
          <Text className="text-xs font-sans-medium text-foreground">Active</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {ChannelListComponent ? (
        <ChannelListComponent
          filters={filters}
          options={{ state: true, watch: true }}
          sort={{ last_updated: -1 }}
          channelRenderFilterFn={channelRenderFilterFn}
          onSelect={(channel: Channel) => {
            setChannel(channel);
            router.push(`/channel/${channel.id}`);
          }}
          ListHeaderComponent={ListHeaderComponent}
          additionalFlatListProps={{
            contentContainerStyle: { flexGrow: 1 },
            showsVerticalScrollIndicator: false,
          }}
          EmptyStateIndicator={() => (
            <View className="flex-1 items-center justify-center py-16 px-6">
              <View className="w-20 h-20 rounded-full bg-surface items-center justify-center border border-border mb-4">
                <Ionicons name="chatbubbles-outline" size={36} color={COLORS.textMuted} />
              </View>
              <Text className="text-lg font-sans-bold text-text mb-2">No conversations yet</Text>
              <Text className="text-sm text-textMuted text-center font-sans-medium">
                Start a new conversation to connect with your friends
              </Text>
            </View>
          )}
        />
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {ListHeaderComponent}
          <View className="mx-6 mt-4 rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-black/20">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                <Ionicons name="information-circle" size={22} color={COLORS.primary} />
              </View>
              <Text className="text-base font-sans-bold text-text flex-1">Development Build Required</Text>
            </View>
            <Text className="text-sm font-sans-medium text-textMuted leading-5">
              Stream chat UI requires a development build. Build your app to see the full channel list experience.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Chat;
