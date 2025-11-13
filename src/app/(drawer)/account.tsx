import {} from "react"
import { Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function PerfilScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-black px-4">
      <Text className="mb-4 text-2xl text-white">Tela de Conta</Text>
    </SafeAreaView>
  )
}
