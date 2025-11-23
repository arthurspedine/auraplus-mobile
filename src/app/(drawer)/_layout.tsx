import { Header } from "@/components/header";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";

export default function DrawerLayout() {
  const { t } = useTranslation();
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
          title: t("navigation.home"),
          drawerIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="equipe"
        options={{
          title: t("navigation.team"),
          drawerIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="relatorios"
        options={{
          title: t("navigation.reports"),
          drawerIcon: ({ color, size }) => <Ionicons name="bar-chart" color={color} size={size} />,
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
