import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function App() {
  const { isSignedIn, isLoaded, signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)"} />;
  }
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">Welcome to Nativewind!</Text>

      <Pressable onPress={() => signOut()}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}
