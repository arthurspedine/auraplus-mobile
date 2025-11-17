import { Header } from "@/components/header"
import { Ionicons } from "@expo/vector-icons"
import { Drawer } from "expo-router/drawer"

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
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="search"
        options={{
          title: "Buscar",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="notifications"
        options={{
          title: "Notificações",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="messages"
        options={{
          title: "Mensagens",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="history"
        options={{
          title: "Histórico",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="time" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: "Perfil",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: "Configurações",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="help"
        options={{
          title: "Ajuda",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="help-circle" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="privacy"
        options={{
          title: "Privacidade",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark" color={color} size={size} />
          ),
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
  )
}
