import { Text, View } from "react-native";

const ChannelScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-base text-foreground text-center">
        Chat channels are available in the native app build.
      </Text>
    </View>
  );
};

export default ChannelScreen;
