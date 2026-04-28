import { useUser } from "@clerk/expo";
import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { Chat, OverlayProvider, useCreateChatClient } from "stream-chat-expo";
import { yapzo } from "../lib/theme";
import FullScreenLoader from "./FullScreenLoader";

const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY!;

type SyncableUser = {
  id: string;
  fullName?: string | null;
  username?: string | null;
  imageUrl?: string | null;
  emailAddresses?: Array<{ emailAddress: string }>;
};

const getUserDisplayName = (user: SyncableUser) => {
  return user.fullName ?? user.username ?? user.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? "Guest User";
};

const syncUserToStream = async (user: SyncableUser) => {
  try {
    await fetch("/api/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        name: getUserDisplayName(user),
        image: user.imageUrl,
      }),
    });
  } catch (error) {
    console.error("Failed to sync user with stream", error);
  }
};

const ChatClient = ({ children, user }: { children: ReactNode; user: SyncableUser }) => {
  const syncedRef = useRef(false);
  const userDisplayName = useMemo(() => getUserDisplayName(user), [user]);
  const userImage = useMemo(() => user.imageUrl ?? undefined, [user.imageUrl]);

  useEffect(() => {
    // needed cuz so that the method isn't run twice
    if (!syncedRef.current) {
      syncedRef.current = true;
      syncUserToStream(user);
    }
  }, [user]);

  const tokenProvider = useCallback(async () => {
    const response = await fetch("/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch Stream token (${response.status}): ${text}`);
    }

    const data = await response.json();
    return data.token;
  }, [user.id]);

  const userData = useMemo(
    () => ({
      id: user.id,
      name: userDisplayName,
      image: userImage,
    }),
    [user.id, userDisplayName, userImage],
  );

  const chatClient = useCreateChatClient({
    apiKey: STREAM_API_KEY,
    userData,
    tokenOrProvider: tokenProvider,
  });

  if (!chatClient) return <FullScreenLoader message="Loading Chat..." />;
  return (
    <OverlayProvider value={{ style: yapzo }}>
      <Chat client={chatClient} style={yapzo}>
        {children}
      </Chat>
    </OverlayProvider>
  );
};

const ChatWrapper = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <FullScreenLoader message="Loading Chat..." />;
  }

  //if not signed in, show auth
  if (!user) {
    return <>{children}</>;
  }
  return <ChatClient user={user}>{children}</ChatClient>;
};

export default ChatWrapper;
