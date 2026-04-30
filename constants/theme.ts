export const colors = {
  background: "#140A00",
  foreground: "#FFF8F2",
  card: "#1F1208",
  muted: "#2A180C",
  mutedForeground: "rgba(255, 248, 242, 0.65)",
  primary: "#FF6A00",
  accent: "#FF8C42",
  border: "rgba(255, 255, 255, 0.08)",
  success: "#22C55E",
  destructive: "#FF5C5C",
  subscription: "#FFC857",
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  18: 72,
  20: 80,
  24: 96,
  30: 120,
} as const;

export const components = {
  tabBar: {
    height: spacing[18],
    horizontalInset: spacing[5],
    radius: spacing[8],
    iconFrame: spacing[12],
    itemPaddingVertical: spacing[2],
  },
} as const;

export const theme = {
  colors,
  spacing,
  components,
} as const;
