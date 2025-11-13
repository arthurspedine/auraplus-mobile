import { useEffect } from "react"
import { View } from "react-native"

async function logout() {
  // Simulate an async logout operation
  return new Promise(resolve => setTimeout(resolve, 1000))
}

export default function LogoutPage() {
  useEffect(() => {
    const doLogout = async () => {
      await logout()
    }
    doLogout()
  }, [])

  return <View />
}
