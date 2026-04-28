import ExploreUserCard from "@/src/components/ExploreUserCard";
import ListEmptyComponent from "@/src/components/ListEmptyComponent";
import { useAppContext } from "@/src/context/AppProvider";
import useStartChat from "@/src/hooks/useStartChat";
import useStreamUsers from "@/src/hooks/useStreamUsers";
import { COLORS } from "@/src/lib/theme";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import type { UserResponse } from "stream-chat";
import { useChatContext } from "stream-chat-expo";

const explore = () => {
  const { setChannel } = useAppContext();
  const { user } = useUser();
  const chatContext = useChatContext();
  const client = chatContext?.client;
  const userId = user?.id ?? "";

  if (!client || !user) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground">Loading chat...</Text>
      </SafeAreaView>
    );
  }

  const [creating, setCreating] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { users, loading } = useStreamUsers({ client, userId });

  const { handleStartChat } = useStartChat({ client, userId, setChannel, setCreating });

  const fileteredUsers = !search.trim()
    ? users
    : users.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase()),
      );

  const renderUserItem = ({ item }: { item: UserResponse }) => (
    <ExploreUserCard item={item} creating={creating} onStartChat={handleStartChat} />
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-3 pb-1">
        <Text className="text-[28px] font-sans-bold text-foreground">Explore</Text>
        <Text className="text-sm text-foreground-muted mt-1">Find People and Start Chatting</Text>
      </View>

      <View className="flex-row items-center bg-surface mx-5 my-4 px-3.5 py-3 rounded-[14px] gap-2.5 border border-border">
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          placeholder="Search People"
          className="flex-1 text-[15px] text-foreground"
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={"large"} color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={fileteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmptyComponent />}
        />
      )}
    </SafeAreaView>
  );
};

export default explore;
