import { Stack } from "expo-router"
import { useColorScheme } from "react-native"
import "@/global.css"
import { AuthProvider } from "@/context/auth-context"

function InitialLayout() {
  useColorScheme()
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  )
}
