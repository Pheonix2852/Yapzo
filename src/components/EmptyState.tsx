import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { COLORS } from "../lib/theme";

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
};

const EmptyState = ({ icon, title, subtitle }: EmptyStateProps) => {
  return (
    <View className="flex-1 items-center justify-center bg-surface-light px-5">
      <View className="mb-4">
        <Ionicons name={icon} size={64} color={COLORS.textSubtle} />
      </View>
      <Text className="text-center text-base font-sans-bold text-foreground-muted">{title}</Text>
      <Text className="mt-1 text-center text-sm text-foreground-subtle">{subtitle}</Text>
    </View>
  );
};

export default EmptyState;
