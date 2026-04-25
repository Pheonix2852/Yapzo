import { colors, components } from "@/constants/theme";
import { useAuth } from "@clerk/expo";
import { Image } from "expo-image";

import { icons } from "@/constants/icons";

import { Redirect, Tabs } from "expo-router";
import { ImageSourcePropType, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppTab {
  name: string;
  title: string;
  icon: ImageSourcePropType;
}

interface TabIconProps {
  icon: ImageSourcePropType;
  focused: boolean;
}

export const tabs: AppTab[] = [
  { name: "index", title: "Home", icon: icons.chat },
  { name: "explore", title: "Subscriptions", icon: icons.explore },
  { name: "profile", title: "Insights", icon: icons.profile },
];

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)"} />;
  }

  const TabIcon = ({ icon, focused }: TabIconProps) => {
    return (
      <View
        style={{
          width: components.tabBar.iconFrame,
          height: components.tabBar.iconFrame,
          justifyContent: "center",
          alignItems: "center",
          opacity: focused ? 1 : 0.7,
        }}
      >
        <Image
          source={icon}
          contentFit="contain"
          style={{
            width: components.tabBar.iconFrame * 0.56,
            height: components.tabBar.iconFrame * 0.56,
          }}
        />
      </View>
    );
  };
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, components.tabBar.horizontalInset),
          height: components.tabBar.height,
          borderRadius: components.tabBar.radius,
          marginHorizontal: components.tabBar.horizontalInset,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: components.tabBar.height / 2 - components.tabBar.iconFrame / 1.6,
        },
        tabBarIconStyle: {
          width: components.tabBar.iconFrame,
          height: components.tabBar.iconFrame,
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          name={tab.name}
          key={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => <TabIcon icon={tab.icon} focused={focused} />,
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabsLayout;
