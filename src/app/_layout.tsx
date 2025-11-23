import { Stack } from "expo-router";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import "@/global.css";
import { AuthProvider, useAuth } from "@/context/auth-context";
import "@/i18n";

function InitialLayout() {
  const { isLoading } = useAuth();
  useColorScheme();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="##1F89DA" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
