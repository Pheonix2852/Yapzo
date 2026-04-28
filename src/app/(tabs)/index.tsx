import { useAppContext } from "@/src/context/AppProvider";
import { COLORS } from "@/src/lib/theme";
import { getGreetingForHour } from "@/src/lib/utils";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-3 pb-2">
        <Text className="text-sm text-foreground-muted font-sans-medium">
          {getGreetingForHour()}, {firstName}
        </Text>
      </View>

      <View className="flex-row items-center bg-surface mx-5 mb-3 px-3.5 py-3 rounded-[14px] gap-2.5 border border-border">
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          placeholder="Search for Friends"
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View className="flex-row items-center px-5 my-1.5 gap-2">
        <Ionicons name="chatbubbles" size={16} color={COLORS.primaryLight} />
        <Text className="text-[15px] font-sans-medium text-primary-light">Your Friends</Text>
      </View>

      {ChannelListComponent ? (
        <ChannelListComponent
          filters={filters}
          options={{ state: true, watch: true }} //state true will fetch  initial full data of channel and watch true will keep the channel updated in realtime
          sort={{ last_updated: -1 }}
          channelRenderFilterFn={channelRenderFilterFn}
          onSelect={(channel: Channel) => {
            setChannel(channel);
            router.push(`/channel/${channel.id}`);
          }}
          additionalFlatListProps={{
            contentContainerStyle: { flexGrow: 1 },
          }}
          EmptyStateIndicator={() => (
            <View>
              <Text className="flex-1 text-white">Start Chatting</Text>
            </View>
          )}
        />
      ) : (
        <View className="mx-5 mt-3 rounded-xl border border-border bg-surface p-4">
          <Text className="text-sm font-sans-medium text-foreground-muted">
            Stream chat UI is unavailable in Expo Go. Use a development build to see channels.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Chat;
