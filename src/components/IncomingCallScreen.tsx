import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Phone, PhoneOff } from "lucide-react-native";
import { useCall } from "@stream-io/video-react-native-sdk";

export function IncomingCallScreen() {
  const call = useCall();

  const acceptCall = async () => {
    await call?.join();
  };

  const rejectCall = async () => {
    await call?.leave();
  };

  return (
    <LinearGradient
      colors={["#140A00", "#2A1200", "#FF6A00", "#140A00"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 justify-center items-center px-6">

        <View className="w-32 h-32 rounded-full bg-[#2A180C] justify-center items-center mb-6">
          <Text className="text-5xl text-white font-bold">Y</Text>
        </View>

        <Text className="text-white text-3xl font-bold">Incoming Call</Text>
        <Text className="text-orange-200 mt-2 text-lg">Yapzo Video Call</Text>

        <View className="flex-row gap-8 mt-16">

          <TouchableOpacity
            onPress={rejectCall}
            className="w-20 h-20 rounded-full bg-red-500 justify-center items-center"
          >
            <PhoneOff color="white" size={30} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={acceptCall}
            className="w-20 h-20 rounded-full bg-green-500 justify-center items-center"
          >
            <Phone color="white" size={30} />
          </TouchableOpacity>

        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}