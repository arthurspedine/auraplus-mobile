import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RelatoriosTabsLayout() {
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
        name="individuais"
        options={{
          title: "Individuais",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="coletivos"
        options={{
          title: "Coletivos",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "people" : "people-outline"} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
