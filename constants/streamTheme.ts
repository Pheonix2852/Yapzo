import type { DeepPartial, Theme } from "stream-chat-expo";

export const streamTheme: DeepPartial<Theme> = {
  colors: {
    accent_blue: "#6C5CE7",
    white: "#FFFFFF",
    black: "#FFFFFE",
    grey_whisper: "#1A1A2E",
    grey_gainsboro: "#232946",
  },

  messageInput: {
    container: {
      backgroundColor: "#1A1A2E",
      borderTopWidth: 0,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },

    inputBoxContainer: {
      backgroundColor: "#16213E",
      borderRadius: 28,
      borderWidth: 1,
      borderColor: "#232946",
      paddingHorizontal: 12,
    },

    inputBox: {
      color: "#FFFFFE",
      fontSize: 16,
      minHeight: 48,
      paddingVertical: 10,
    },

    sendButton: {
      marginLeft: 8,
      backgroundColor: "#6C5CE7",
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    attachButton: {
      marginRight: 8,
    },
  },
};
