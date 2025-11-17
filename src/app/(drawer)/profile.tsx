import { Ionicons } from "@expo/vector-icons"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function ProfileScreen() {
  const stats = [
    { label: "Posts", value: "24" },
    { label: "Seguidores", value: "1.2k" },
    { label: "Seguindo", value: "345" },
  ]

  const menuItems = [
    { icon: "person-outline", label: "Informações Pessoais", color: "#1F89DA" },
    { icon: "settings-outline", label: "Configurações", color: "#1F89DA" },
    { icon: "heart-outline", label: "Favoritos", color: "#1F89DA" },
    { icon: "time-outline", label: "Histórico", color: "#1F89DA" },
  ]

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="items-center px-6 pt-8">
          <Image
            source={{ uri: "https://github.com/arthurspedine.png" }}
            className="mb-4 h-32 w-32 rounded-full"
          />
          <Text className="mb-1 font-bold text-2xl text-text">
            Usuário AuraPlus
          </Text>
          <Text className="mb-6 text-base text-muted">usuario@auraplus.com</Text>

          <View className="mb-8 w-full flex-row justify-around rounded-2xl bg-card p-6">
            {stats.map((stat, index) => (
              <View key={index} className="items-center">
                <Text className="mb-1 font-bold text-2xl text-primary">
                  {stat.value}
                </Text>
                <Text className="text-muted text-sm">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="px-6">
          <Text className="mb-4 font-bold text-text text-xl">Menu</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="mb-3 flex-row items-center rounded-xl bg-card p-4"
            >
              <View
                className="mr-4 items-center justify-center rounded-full bg-primary/20 p-3"
              >
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <Text className="flex-1 text-base text-text">{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-6 pb-8 pt-6">
          <TouchableOpacity className="rounded-xl bg-red-500/10 p-4">
            <Text className="text-center font-semibold text-base text-red-500">
              Sair da Conta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
