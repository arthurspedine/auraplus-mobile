import { useAuth } from "@/context/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RelatoriosTabsLayout() {
  const { usuario } = useAuth();

  // Se o usuário não está em uma equipe, mostra aviso
  if (!usuario?.equipeId) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 px-6">
          <View className="mb-6 pt-4">
            <Text className="font-extrabold text-3xl text-text">Relatórios</Text>
          </View>

          <View className="flex-1 items-center justify-center">
            <Ionicons name="analytics-outline" size={64} color="#1F89DA" />
            <Text className="mt-4 text-center text-base text-text">
              Você não faz parte de uma equipe
            </Text>
            <Text className="mt-2 px-6 text-center text-sm text-muted">
              Para visualizar relatórios, é necessário fazer parte de uma equipe. Entre em contato
              com seu gestor.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
