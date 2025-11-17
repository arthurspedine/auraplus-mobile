import { Ionicons } from "@expo/vector-icons"
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState } from "react"

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("")

  const recentSearches = [
    "React Native",
    "Expo Router",
    "NativeWind",
    "TypeScript",
    "Mobile Development",
  ]

  const popularTopics = [
    { icon: "trending-up", title: "Trending", color: "#1F89DA" },
    { icon: "rocket", title: "New Features", color: "#10B981" },
    { icon: "star", title: "Popular", color: "#F59E0B" },
    { icon: "flame", title: "Hot Topics", color: "#EF4444" },
  ]

  const suggestedItems = [
    { title: "Tutorial de React Native", category: "Educação" },
    { title: "Melhores práticas em Mobile", category: "Desenvolvimento" },
    { title: "Design System para Apps", category: "Design" },
    { title: "Performance em React Native", category: "Otimização" },
  ]

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6">
        <Text className="mb-2 font-extrabold text-3xl text-text">Buscar</Text>
        <Text className="mb-4 text-base text-muted">
          Encontre o que você procura
        </Text>

        <View className="mb-6 flex-row items-center rounded-xl bg-card px-4 py-3">
          <Ionicons
            name="search-outline"
            size={24}
            color="#1F89DA"
            style={{ marginRight: 12 }}
          />
          <TextInput
            className="flex-1 text-base text-text"
            placeholder="O que você está procurando?"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {searchQuery.length === 0 && (
          <>
            <View className="mb-6">
              <Text className="mb-3 font-bold text-text text-lg">
                Tópicos Populares
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {popularTopics.map((topic, index) => (
                  <TouchableOpacity
                    key={index}
                    className="flex-row items-center rounded-full bg-card px-4 py-3"
                  >
                    <Ionicons
                      name={topic.icon as any}
                      size={20}
                      color={topic.color}
                      style={{ marginRight: 8 }}
                    />
                    <Text className="font-medium text-text text-sm">
                      {topic.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="mb-3 font-bold text-text text-lg">
                Buscas Recentes
              </Text>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  className="mb-2 flex-row items-center justify-between rounded-xl bg-card p-4"
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color="#999"
                      style={{ marginRight: 12 }}
                    />
                    <Text className="text-base text-text">{search}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </View>

            <View>
              <Text className="mb-3 font-bold text-text text-lg">
                Sugestões para Você
              </Text>
              {suggestedItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="mb-3 rounded-xl bg-card p-4"
                >
                  <Text className="mb-1 font-semibold text-base text-text">
                    {item.title}
                  </Text>
                  <Text className="text-muted text-sm">{item.category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
