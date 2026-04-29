import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../lib/theme";

function ErrorCallUI({ error }: { error: string }) {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-4">
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
        <Text className="mt-2 text-base font-sans text-foreground">{error}</Text>
        <Pressable className="mt-4 rounded-xl bg-primary text-foreground" onPress={() => router.back()}>
          <Text className="text-[15px] font-sans-medium text-foreground p-4">Go Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default ErrorCallUI;
