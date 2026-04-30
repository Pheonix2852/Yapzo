import ErrorCallUI from "@/src/components/ErrorCallUI";
import { useAppContext } from "@/src/context/AppProvider";
import { COLORS } from "@/src/lib/theme";
import {
  Call,
  CallContent,
  CallingState,
  IncomingCall,
  OutgoingCall,
  StreamCall,
  useCall,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChatContext } from "stream-chat-expo";

const CallScreen = () => {
  const { callId } = useLocalSearchParams<{ callId: string }>();
  const videoClient = useStreamVideoClient();
  const { channel } = useAppContext();
  const { client: chatClient } = useChatContext();

  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoClient || !callId || !channel) return;

    let isMounted = true;

    const startCall = async () => {
      try {
        const members = Object.values(channel.state.members).map((member) => ({
          user_id: member?.user?.id as string,
        }));

        const safeCallId = callId.replace(/[^a-zA-Z0-9_-]/g, "-");
        const nextCall = videoClient.call("default", safeCallId);

        await nextCall.getOrCreate({
          ring: true,
          data: {
            members,
            custom: {
              triggeredBy: chatClient.user?.id,
            },
          },
        });

        if (isMounted) {
          setCall(nextCall);
        }
      } catch (startError) {
        console.error("Failed to start call", startError);
        if (isMounted) {
          setError("Failed to start call. Please try again.");
        }
      }
    };

    startCall();

    return () => {
      isMounted = false;
    };
  }, [videoClient, callId, channel, chatClient.user?.id]);

  if (error) return <ErrorCallUI error={error} />;

  if (!call) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center gap-4">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="mt-2 text-base text-foreground-muted">Starting to Call...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <StreamCall call={call}>
      <CallUI />
    </StreamCall>
  );
};

function CallUI() {
  const call = useCall();
  const router = useRouter();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const isCallCreatedByMe = call?.isCreatedByMe ?? false;

  useEffect(() => {
    if (callingState === CallingState.LEFT) router.back();
  }, [callingState, router]);

  if ([CallingState.RINGING, CallingState.JOINING, CallingState.IDLE].includes(callingState)) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        {isCallCreatedByMe ? <OutgoingCall /> : <IncomingCall />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <CallContent
        onHangupCallHandler={async () => {
          await call?.endCall();
        }}
        layout="spotlight"
      />
    </SafeAreaView>
  );
}

export default CallScreen;
