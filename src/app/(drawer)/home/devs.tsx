import { Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function DevsScreen() {
  const developers = [
    {
      name: "Matheus Esteves",
      rm: "554769",
      imageUrl: "https://github.com/matheus-esteves10.png",
    },
    {
      name: "Gabriel Falanga",
      rm: "555061",
      imageUrl: "https://github.com/gabrielfalanga.png",
    },
    {
      name: "Arthur Spedine",
      rm: "554489",
      imageUrl: "https://github.com/arthurspedine.png",
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-background px-8">
      <Text className="text-text">FIRST COMMIT</Text>
    </SafeAreaView>
  )
}
