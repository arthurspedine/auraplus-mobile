import { Ionicons } from "@expo/vector-icons"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function FavoritesScreen() {
  const favorites = [
    {
      id: 1,
      title: "React Native - Guia Completo",
      category: "Desenvolvimento",
      date: "15 Nov 2025",
      icon: "code-slash",
      color: "#1F89DA",
    },
    {
      id: 2,
      title: "Design Patterns em TypeScript",
      category: "Programação",
      date: "14 Nov 2025",
      icon: "cube",
      color: "#10B981",
    },
    {
      id: 3,
      title: "UX/UI Best Practices",
      category: "Design",
      date: "13 Nov 2025",
      icon: "color-palette",
      color: "#F59E0B",
    },
    {
      id: 4,
      title: "Mobile App Architecture",
      category: "Arquitetura",
      date: "12 Nov 2025",
      icon: "construct",
      color: "#8B5CF6",
    },
    {
      id: 5,
      title: "Performance Optimization",
      category: "Otimização",
      date: "11 Nov 2025",
      icon: "speedometer",
      color: "#EF4444",
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6">
        <Text className="mb-2 font-extrabold text-3xl text-text">Favoritos</Text>
        <Text className="mb-6 text-base text-muted">
          Seus itens salvos
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {favorites.length > 0 ? (
          favorites.map(favorite => (
            <View
              key={favorite.id}
              className="mb-4 rounded-2xl bg-card p-4"
            >
              <View className="mb-3 flex-row items-start justify-between">
                <View className="mr-3 items-center justify-center rounded-xl bg-primary/20 p-3">
                  <Ionicons
                    name={favorite.icon as any}
                    size={28}
                    color={favorite.color}
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 font-bold text-base text-text">
                    {favorite.title}
                  </Text>
                  <View className="mb-2 flex-row items-center">
                    <View className="mr-3 flex-row items-center">
                      <Ionicons
                        name="folder-outline"
                        size={14}
                        color="#999"
                        style={{ marginRight: 4 }}
                      />
                      <Text className="text-muted text-xs">
                        {favorite.category}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color="#999"
                        style={{ marginRight: 4 }}
                      />
                      <Text className="text-muted text-xs">{favorite.date}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity className="ml-2">
                  <Ionicons name="heart" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity className="flex-1 items-center rounded-lg bg-primary/10 py-2">
                  <Text className="font-medium text-primary text-sm">
                    Abrir
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 items-center rounded-lg bg-muted/10 py-2">
                  <Text className="font-medium text-muted text-sm">
                    Compartilhar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="heart-outline" size={80} color="#333" />
            <Text className="mt-4 text-center text-muted text-lg">
              Nenhum item favorito ainda
            </Text>
            <Text className="mt-2 text-center text-muted/60 text-sm">
              Adicione itens aos favoritos para vê-los aqui
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
