import { useCall } from "@stream-io/video-react-native-sdk";
import { LinearGradient } from "expo-linear-gradient";
import { PhoneOff } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function OutgoingCallScreen() {
  const call = useCall();

  const cancelCall = async () => {
    await call?.leave();
  };

  return (
    <LinearGradient colors={["#140A00", "#2A1200", "#FF6A00", "#140A00"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 justify-center items-center">
        <View className="w-32 h-32 rounded-full bg-[#2A180C] justify-center items-center mb-6">
          <Text className="text-5xl text-white font-bold">Y</Text>
        </View>

        <Text className="text-white text-3xl font-bold">Calling...</Text>
        <Text className="text-orange-200 mt-2">Connecting via Yapzo</Text>

        <TouchableOpacity
          onPress={cancelCall}
          className="mt-16 w-20 h-20 rounded-full bg-red-500 justify-center items-center"
        >
          <PhoneOff color="white" size={30} />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}
