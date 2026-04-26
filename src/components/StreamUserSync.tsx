import { useUser } from "@clerk/expo";
import { useEffect, useRef } from "react";

const syncUserToStream = async (payload: { userId: string; name: string; image?: string | null }) => {
  try {
    const response = await fetch("/api/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Stream user sync failed:", response.status, text);
    }
  } catch (error) {
    console.error("Failed to sync user with Stream:", error);
  }
};

const StreamUserSync = () => {
  const { user, isLoaded } = useUser();
  const syncedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }

    if (syncedUserId.current === user.id) {
      return;
    }

    syncedUserId.current = user.id;

    const name =
      user.fullName ?? user.username ?? user.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? "Guest User";

    syncUserToStream({
      userId: user.id,
      name,
      image: user.imageUrl,
    });
  }, [isLoaded, user]);

  return null;
};

export default StreamUserSync;
