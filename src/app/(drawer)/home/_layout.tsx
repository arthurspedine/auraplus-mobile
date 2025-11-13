import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"

export default function HomeTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1F89DA",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111",
        },
        tabBarInactiveTintColor: "#aaa",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="devs"
        options={{
          title: "Desenvolvedores",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="code" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="sobre"
        options={{
          title: "Sobre",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  )
}
