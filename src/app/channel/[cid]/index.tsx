import EmptyState from "@/src/components/EmptyState";
import FullScreenLoader from "@/src/components/FullScreenLoader";
import { useAppContext } from "@/src/context/AppProvider";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Channel, MessageComposer, MessageList, useChatContext } from "stream-chat-expo";

const ChannelScreen = () => {
  const { channel, setThread } = useAppContext();
  const { client } = useChatContext();

  const router = useRouter();
  const navigation = useNavigation();

  const headerHeight = useHeaderHeight();

  let displayName = "Chat";
  let avatarUrl = "";

  if (channel) {
    const members = Object.values(channel.state.members || {});
    const otherMember = members.find((m) => m.user_id && m.user_id !== client?.userID);
    displayName = otherMember?.user?.name ?? otherMember?.user_id ?? "Chat";
    avatarUrl = otherMember?.user?.image ?? "";
  }

  if (!channel) {
    return <FullScreenLoader message="Loading chat..." />;
  }

  return (
    <View className="flex-1 bg-border">
      <Channel channel={channel} keyboardVerticalOffset={headerHeight}>
        <View className="flex-1">
          {channel.state.messages.length === 0 ? (
            <EmptyState icon="chatbubbles" title="No messages yet" subtitle="Start a conversation!" />
          ) : (
            <MessageList
              onThreadSelect={(thread) => {
                setThread(thread);
                router.push(`/channel/${channel.id}/thread/${thread?.id}`);
              }}
            />
          )}
        </View>

        <View className="pb-5 bg-surface">
          <MessageComposer />
        </View>
      </Channel>
    </View>
  );
};

export default ChannelScreen;
