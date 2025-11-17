import { Ionicons } from "@expo/vector-icons"
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState } from "react"

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(false)

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6">
        <Text className="mb-2 font-extrabold text-3xl text-text">
          Configurações
        </Text>
        <Text className="mb-6 text-base text-muted">
          Personalize sua experiência
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="mb-6 rounded-2xl bg-card p-4">
          <Text className="mb-4 font-bold text-text text-lg">Preferências</Text>

          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center">
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#999"
                style={{ marginRight: 12 }}
              />
              <View className="flex-1">
                <Text className="font-medium text-base text-text">
                  Notificações
                </Text>
                <Text className="text-muted text-xs">
                  Receber alertas e atualizações
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#333", true: "#1F89DA" }}
              thumbColor="#fff"
            />
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center">
              <Ionicons
                name="moon-outline"
                size={24}
                color="#999"
                style={{ marginRight: 12 }}
              />
              <View className="flex-1">
                <Text className="font-medium text-base text-text">
                  Modo Escuro
                </Text>
                <Text className="text-muted text-xs">Tema escuro ativado</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#333", true: "#1F89DA" }}
              thumbColor="#fff"
            />
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center">
              <Ionicons
                name="download-outline"
                size={24}
                color="#999"
                style={{ marginRight: 12 }}
              />
              <View className="flex-1">
                <Text className="font-medium text-base text-text">
                  Atualização Automática
                </Text>
                <Text className="text-muted text-xs">
                  Baixar atualizações automaticamente
                </Text>
              </View>
            </View>
            <Switch
              value={autoUpdate}
              onValueChange={setAutoUpdate}
              trackColor={{ false: "#333", true: "#1F89DA" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View className="mb-6 rounded-2xl bg-card p-4">
          <Text className="mb-4 font-bold text-text text-lg">Conta</Text>

          <TouchableOpacity className="mb-4 flex-row items-center">
            <Ionicons
              name="person-outline"
              size={24}
              color="#999"
              style={{ marginRight: 12 }}
            />
            <Text className="flex-1 text-base text-text">Editar Perfil</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity className="mb-4 flex-row items-center">
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color="#999"
              style={{ marginRight: 12 }}
            />
            <Text className="flex-1 text-base text-text">Alterar Senha</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center">
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color="#999"
              style={{ marginRight: 12 }}
            />
            <Text className="flex-1 text-base text-text">Privacidade</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
