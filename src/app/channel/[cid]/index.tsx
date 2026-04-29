import EmptyState from "@/src/components/EmptyState";
import FullScreenLoader from "@/src/components/FullScreenLoader";
import { useAppContext } from "@/src/context/AppProvider";
import { COLORS } from "@/src/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Channel, MessageInput, MessageList, useChatContext } from "stream-chat-expo";

const ChannelScreen = () => {
  const { channel, setThread } = useAppContext();
  const { client } = useChatContext();

  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const headerHeight = useHeaderHeight();

  const { displayName, avatarUrl } = useMemo(() => {
    if (!channel) {
      return { displayName: "Chat", avatarUrl: "" };
    }

    const members = Object.values(channel.state.members || {});
    const otherMember = members.find((m) => m.user_id && m.user_id !== client?.userID);

    return {
      displayName: otherMember?.user?.name ?? otherMember?.user_id ?? "Chat",
      avatarUrl: otherMember?.user?.image ?? "",
    };
  }, [channel, client?.userID]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.surface,
        shadowOpacity: 0,
        elevation: 0,
      },
      headerTitleAlign: "center",
      headerTintColor: COLORS.text,
      headerTitleContainerStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} className="ml-2 flex-row items-center justify-center">
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View className="flex-row items-center justify-center" style={{ alignItems: "center" }}>
          {avatarUrl ? (
            <Image source={avatarUrl} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10 }} />
          ) : (
            <View
              className="mr-2.5 h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="text-base font-sans-medium text-foreground">{displayName.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <Text className="font-sans-medium text-foreground">{displayName}</Text>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/call/[callId]",
              params: { callId: channel?.id! },
            });
          }}
          className="mr-3 items-center justify-center"
        >
          <Ionicons name="videocam-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      ),
    });
  }, [avatarUrl, displayName, navigation, router, channel?.id, channel?.cid]);

  if (!channel) {
    return <FullScreenLoader message="Loading chat..." />;
  }

  return (
    <View className="flex-1 bg-border">
      <Channel
        channel={channel}
        keyboardVerticalOffset={headerHeight}
        EmptyStateIndicator={() => (
          <View className="flex-1 items-center justify-center px-5">
            <EmptyState icon="chatbubbles" title="No messages yet" subtitle="Start a conversation!" />
          </View>
        )}
        messageActions={({
          copyMessage,
          deleteForMeMessage,
          deleteMessage,
          editMessage,
          markUnread,
          pinMessage,
          quotedReply,
          unpinMessage,
        }) =>
          [
            editMessage,
            quotedReply,
            copyMessage,
            pinMessage,
            unpinMessage,
            markUnread,
            deleteForMeMessage,
            deleteMessage,
          ].filter((action): action is NonNullable<typeof action> => Boolean(action))
        }
      >
        <MessageList
          onThreadSelect={(thread) => {
            setThread(thread);
            router.push(`/channel/${channel.cid}/thread/${thread?.cid}`);
          }}
        />

        <View className="pb-5 bg-surface">
          <MessageInput audioRecordingEnabled />
        </View>
      </Channel>
    </View>
  );
};

export default ChannelScreen;
