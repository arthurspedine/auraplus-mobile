import { Ionicons } from "@expo/vector-icons"
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState } from "react"

export default function MessagesScreen() {
  const [searchText, setSearchText] = useState("")

  const messages = [
    {
      id: 1,
      name: "Matheus Esteves",
      lastMessage: "Oi, como você está?",
      time: "10:30",
      unread: 2,
      avatar: "https://github.com/matheus-esteves10.png",
    },
    {
      id: 2,
      name: "Gabriel Falanga",
      lastMessage: "Vamos marcar aquela reunião?",
      time: "09:15",
      unread: 0,
      avatar: "https://github.com/gabrielfalanga.png",
    },
    {
      id: 3,
      name: "Arthur Spedine",
      lastMessage: "Obrigado pela ajuda!",
      time: "Ontem",
      unread: 1,
      avatar: "https://github.com/arthurspedine.png",
    },
    {
      id: 4,
      name: "Suporte AuraPlus",
      lastMessage: "Sua solicitação foi processada",
      time: "Ontem",
      unread: 0,
      avatar: "https://github.com/github.png",
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6">
        <Text className="mb-2 font-extrabold text-3xl text-text">Mensagens</Text>
        <Text className="mb-4 text-base text-muted">
          Suas conversas recentes
        </Text>

        <View className="mb-4 flex-row items-center rounded-xl bg-card px-4 py-3">
          <Ionicons
            name="search-outline"
            size={20}
            color="#999"
            style={{ marginRight: 8 }}
          />
          <TextInput
            className="flex-1 text-base text-text"
            placeholder="Buscar mensagens..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {messages.map(message => (
          <TouchableOpacity
            key={message.id}
            className="mb-3 flex-row items-center rounded-xl bg-card p-4"
          >
            <View className="relative mr-4">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/20">
                <Ionicons name="person" size={28} color="#1F89DA" />
              </View>
              {message.unread > 0 && (
                <View className="absolute -right-1 -top-1 h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Text className="font-bold text-white text-xs">
                    {message.unread}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-1">
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="font-semibold text-base text-text">
                  {message.name}
                </Text>
                <Text className="text-muted text-xs">{message.time}</Text>
              </View>
              <Text
                className={`text-sm ${message.unread > 0 ? "font-medium text-text" : "text-muted"}`}
                numberOfLines={1}
              >
                {message.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="px-6 pb-6">
        <TouchableOpacity className="items-center justify-center rounded-full bg-primary py-4">
          <View className="flex-row items-center">
            <Ionicons
              name="add-circle-outline"
              size={24}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text className="font-semibold text-base text-white">
              Nova Mensagem
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
