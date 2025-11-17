import { Ionicons } from "@expo/vector-icons"
import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function NotificationsScreen() {
  const notifications = [
    {
      id: 1,
      title: "Bem-vindo ao AuraPlus!",
      message: "Obrigado por se juntar a nós. Explore todos os recursos.",
      time: "Há 2 horas",
      read: false,
    },
    {
      id: 2,
      title: "Nova atualização disponível",
      message: "Atualize o app para ter acesso às últimas funcionalidades.",
      time: "Há 1 dia",
      read: true,
    },
    {
      id: 3,
      title: "Dica do dia",
      message: "Você sabia que pode personalizar suas preferências?",
      time: "Há 2 dias",
      read: true,
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6">
        <Text className="mb-2 font-extrabold text-3xl text-text">
          Notificações
        </Text>
        <Text className="mb-6 text-base text-muted">
          Fique por dentro de tudo
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {notifications.map(notification => (
          <View
            key={notification.id}
            className={`mb-4 rounded-2xl bg-card p-4 ${!notification.read ? "border-2 border-primary/30" : ""}`}
          >
            <View className="mb-2 flex-row items-start justify-between">
              <View className="flex-1 flex-row items-center">
                <Ionicons
                  name={notification.read ? "notifications-outline" : "notifications"}
                  size={24}
                  color={notification.read ? "#999" : "#1F89DA"}
                  style={{ marginRight: 8 }}
                />
                <Text className="flex-1 font-bold text-base text-text">
                  {notification.title}
                </Text>
              </View>
              {!notification.read && (
                <View className="ml-2 h-3 w-3 rounded-full bg-primary" />
              )}
            </View>
            <Text className="mb-2 leading-5 text-muted text-sm">
              {notification.message}
            </Text>
            <Text className="text-muted/60 text-xs">{notification.time}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
