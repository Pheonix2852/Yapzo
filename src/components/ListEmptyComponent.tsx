import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { COLORS } from "../lib/theme";

const ListEmptyComponent = () => {
  return (
    <View className="items-center gap-2 pt-20">
      <Ionicons name="people-outline" size={48} color={COLORS.textSubtle} />
      <Text className="text-[17px] font-sans-medium text-foreground">No Users Found</Text>
    </View>
  );
};

export default ListEmptyComponent;
