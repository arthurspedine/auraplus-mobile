import { Image, ScrollView, Text, View } from "react-native"
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
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6">
        <Text className="mb-2 font-extrabold text-3xl text-text">
          Desenvolvedores
        </Text>
        <Text className="mb-6 text-base text-muted">
          Conheça a equipe por trás do projeto
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="w-full flex-grow-0"
        contentContainerClassName="px-6"
      >
        {developers.map(dev => (
          <View
            key={dev.rm}
            className="mr-6 w-72 overflow-hidden rounded-2xl bg-card p-6"
          >
            <View className="mb-4 items-center">
              <Image
                source={{ uri: dev.imageUrl }}
                className="mb-4 h-32 w-32 rounded-full"
              />
              <Text className="mb-1 text-center font-bold text-text text-xl">
                {dev.name}
              </Text>
              <View className="rounded-full bg-primary/20 px-4 py-1">
                <Text className="font-medium text-primary text-sm">
                  RM: {dev.rm}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
