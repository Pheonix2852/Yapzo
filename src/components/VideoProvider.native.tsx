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
  const calls = useCalls().filter((c: Call) => c.ringing);
  const ringingCall = calls[0];

  if (!ringingCall) return null;

  return (
    <StreamCall call={ringingCall}>
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
    let client: any = null;

    const initializeVideoClient = async () => {
      try {
        const tokenProvider = async () => {
          const response = await fetch("/api/token", {
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
        };

        client = StreamVideoClient.getOrCreateInstance({
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
          setVideoClient(null);
        }
      }
    };

    initializeVideoClient();

    return () => {
      isMounted = false;
      if (client) {
        client.disconnectUser().catch((disconnectError: any) => {
          console.error("Error disconnecting video client:", disconnectError);
        });
      }
    };
  }, [isLoaded, user]);

  if (!sdkAvailable || !isLoaded || !user) {
    return <>{children}</>;
  }

  if (!videoClient && !error) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

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
