import { Header } from "@/components/header";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        header: () => <Header />,
        drawerActiveTintColor: "#1F89DA",
        drawerInactiveTintColor: "#ccc",
        drawerStyle: {
          backgroundColor: "#222",
        },
        drawerLabelStyle: {
          color: "#ccc",
        },
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: "Home",
          drawerIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="equipe"
        options={{
          title: "Minha Equipe",
          drawerIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="account"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="logout"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}
