import chat from "@/assets/icons/chat.png";
import explore from "@/assets/icons/explore.png";
import profile from "@/assets/icons/profile.png";

export const icons = {
  chat,
  explore,
  profile,
} as const;

export type IconKey = keyof typeof icons;
