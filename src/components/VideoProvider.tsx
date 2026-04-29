import { useUser } from "@clerk/expo";
import type { Call } from "@stream-io/video-react-native-sdk";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../lib/theme";

let StreamVideo: any = null;
let StreamVideoClient: any = null;
let useCalls: any = null;
let StreamCall: any = null;
let RingingCallContent: any = null;

// try-catch used because video call requires the specific SDK, so if dev build is not used, everything works except VC
try {
  const sdk = require("@stream-io/video-react-native-sdk");
  StreamVideo = sdk.StreamVideo;
  StreamVideoClient = sdk.StreamVideoClient;
  useCalls = sdk.useCalls;
  StreamCall = sdk.StreamCall;
  RingingCallContent = sdk.RingingCallContent;
} catch (error) {
  console.log("Error while importing SDK", error);
}

const sdkAvailable = !!StreamVideoClient && !!StreamVideo;
const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;

function RingingCalls() {
  //listens for incoming calls globally and shows the ringing screen
  const calls = useCalls().filter((c: Call) => c.ringing);
  const ringingCalls = calls[0];

  if (!ringingCalls) return null;

  return (
    <StreamCall call={ringingCalls}>
      <SafeAreaView style={StyleSheet.absoluteFill}>
        <RingingCallContent />
      </SafeAreaView>
    </StreamCall>
  );
}

const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!sdkAvailable || !user || !isLoaded) {
      return;
    }

    let isMounted = true;

    const initializeVideoClient = async () => {
      try {
        const tokenProvider = async () => {
          try {
            // Use expo-constants to get the API URL
            const response = await fetch(`/api/token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: user.id }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error("Token endpoint error:", response.status, errorText);
              throw new Error(`Token fetch failed: ${response.status}`);
            }

            const data = await response.json();
            if (!data.token) {
              throw new Error("No token returned from API");
            }
            return data.token;
          } catch (err) {
            console.error("Token provider error:", err);
            throw err;
          }
        };

        if (!isMounted) return;

        const client = StreamVideoClient.getOrCreateInstance({
          apiKey,
          user: {
            id: user.id,
            name: user.fullName ?? user.username ?? "Guest",
            image: user.imageUrl,
          },
          tokenProvider,
        });

        if (isMounted) {
          setVideoClient(client);
          setError(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("VideoProvider initialization error:", errorMessage);
        if (isMounted) {
          setError(errorMessage);
          // Still render children even if video client fails
          setVideoClient(null);
        }
      }
    };

    initializeVideoClient();

    //cleanup function
    return () => {
      isMounted = false;
      if (videoClient) {
        videoClient.disconnectUser().catch((err: any) => {
          console.error("Error disconnecting video client:", err);
        });
      }
    };
  }, [isLoaded, user, videoClient]);

  if (!sdkAvailable) {
    console.log("Stream Video SDK not available - returning children");
    return <>{children}</>;
  }

  if (!isLoaded) {
    return <>{children}</>;
  }

  if (!user) {
    return <>{children}</>;
  }

  // If there's an error but videoClient is null, still show loading
  // The app should continue to function even if video client fails
  if (!videoClient && !error) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size={"large"} color={COLORS.primary} />
      </View>
    );
  }

  // If there's an error, log it and still render children (fallback)
  if (error && !videoClient) {
    console.warn("VideoProvider error (app still functional):", error);
    return <>{children}</>;
  }

  return (
    <StreamVideo client={videoClient}>
      {children}
      {useCalls && <RingingCalls />}
    </StreamVideo>
  );
};

export default VideoProvider;
