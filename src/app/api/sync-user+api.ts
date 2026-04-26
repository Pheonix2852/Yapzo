import * as Sentry from "@sentry/react-native";
import { StreamChat } from "stream-chat";

const API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY as string;
const SECRET_KEY = process.env.STREAM_SECRET_KEY as string;

export async function POST(request: Request) {
  if (!API_KEY || !SECRET_KEY) {
    return Response.json(
      { error: "Stream keys are not configured. Set EXPO_PUBLIC_STREAM_API_KEY and STREAM_SECRET_KEY." },
      { status: 500 },
    );
  }

  const client = StreamChat.getInstance(API_KEY, SECRET_KEY);

  const body = await request.json();

  const { userId, name, image } = body;

  if (!userId) {
    return Response.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    await client.upsertUser({
      id: userId,
      name: name || "Guest User",
      image: image,
    });

    return Response.json({ success: true, userId });
  } catch (error) {
    console.error("Error syncing user with Stream:", error);

    Sentry.captureException(error, {
      extra: { userId, name, image },
    });

    return Response.json({ error: "Failed to Sync" }, { status: 500 });
  }
}
