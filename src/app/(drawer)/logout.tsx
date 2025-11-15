import { useAuth } from "@/context/auth-context"
import { router } from "expo-router"
import { useEffect } from "react"
import { View } from "react-native"

export default function LogoutPage() {
  const { logout } = useAuth()
  useEffect(() => {
    const doLogout = async () => {
      await logout()
    }
    doLogout()
    router.replace("/auth/login")
  }, [logout])

  return <View />
}
