import { Ionicons } from "@expo/vector-icons"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HistoryScreen() {
  const historyItems = [
    {
      id: 1,
      action: "Visualizou",
      item: "Tutorial de React Native",
      time: "Há 5 minutos",
      icon: "eye",
      color: "#1F89DA",
    },
    {
      id: 2,
      action: "Adicionou aos favoritos",
      item: "Design Patterns",
      time: "Há 30 minutos",
      icon: "heart",
      color: "#EF4444",
    },
    {
      id: 3,
      action: "Compartilhou",
      item: "Mobile App Architecture",
      time: "Há 1 hora",
      icon: "share-social",
      color: "#10B981",
    },
    {
      id: 4,
      action: "Baixou",
      item: "Guia de TypeScript",
      time: "Há 2 horas",
      icon: "download",
      color: "#8B5CF6",
    },
    {
      id: 5,
      action: "Comentou em",
      item: "UX Best Practices",
      time: "Há 3 horas",
      icon: "chatbubble",
      color: "#F59E0B",
    },
    {
      id: 6,
      action: "Pesquisou",
      item: "Performance optimization",
      time: "Há 4 horas",
      icon: "search",
      color: "#06B6D4",
    },
    {
      id: 7,
      action: "Atualizou perfil",
      item: "Informações pessoais",
      time: "Ontem",
      icon: "person",
      color: "#EC4899",
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6">
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="mb-1 font-extrabold text-3xl text-text">
              Histórico
            </Text>
            <Text className="text-base text-muted">
              Suas atividades recentes
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {historyItems.map((item, index) => (
          <View key={item.id} className="mb-4">
            <View className="flex-row items-start">
              <View className="relative mr-4">
                <View
                  className="items-center justify-center rounded-full bg-card p-3"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                {index < historyItems.length - 1 && (
                  <View className="absolute left-1/2 top-12 h-8 w-0.5 -translate-x-1/2 bg-muted/20" />
                )}
              </View>

              <View className="flex-1 rounded-xl bg-card p-4">
                <Text className="mb-1 font-semibold text-base text-text">
                  {item.action}
                </Text>
                <Text className="mb-2 text-muted text-sm">{item.item}</Text>
                <View className="flex-row items-center">
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color="#999"
                    style={{ marginRight: 4 }}
                  />
                  <Text className="text-muted/60 text-xs">{item.time}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity className="mb-6 mt-4 items-center rounded-xl bg-card py-4">
          <Text className="font-medium text-primary text-sm">
            Carregar mais atividades
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
