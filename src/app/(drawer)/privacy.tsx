import { Ionicons } from "@expo/vector-icons"
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState } from "react"

export default function PrivacyScreen() {
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [activityStatus, setActivityStatus] = useState(true)
  const [dataCollection, setDataCollection] = useState(false)
  const [personalizedAds, setPersonalizedAds] = useState(false)

  const privacySettings = [
    {
      title: "Perfil Público",
      description: "Permitir que outros usuários vejam seu perfil",
      value: profileVisibility,
      onChange: setProfileVisibility,
      icon: "person",
    },
    {
      title: "Status de Atividade",
      description: "Mostrar quando você está online",
      value: activityStatus,
      onChange: setActivityStatus,
      icon: "radio-button-on",
    },
    {
      title: "Coleta de Dados",
      description: "Permitir coleta de dados para melhorias",
      value: dataCollection,
      onChange: setDataCollection,
      icon: "analytics",
    },
    {
      title: "Anúncios Personalizados",
      description: "Receber anúncios baseados em seus interesses",
      value: personalizedAds,
      onChange: setPersonalizedAds,
      icon: "pricetag",
    },
  ]

  const dataOptions = [
    {
      icon: "download-outline",
      title: "Baixar Seus Dados",
      description: "Solicite uma cópia dos seus dados",
      color: "#1F89DA",
    },
    {
      icon: "shield-checkmark-outline",
      title: "Política de Privacidade",
      description: "Leia nossa política completa",
      color: "#10B981",
    },
    {
      icon: "document-text-outline",
      title: "Termos de Uso",
      description: "Consulte os termos e condições",
      color: "#F59E0B",
    },
    {
      icon: "trash-outline",
      title: "Excluir Conta",
      description: "Remover permanentemente sua conta",
      color: "#EF4444",
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6">
        <Text className="mb-2 font-extrabold text-3xl text-text">
          Privacidade
        </Text>
        <Text className="mb-6 text-base text-muted">
          Controle suas informações pessoais
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="mb-6">
          <Text className="mb-3 font-bold text-text text-lg">
            Configurações de Privacidade
          </Text>
          <View className="rounded-2xl bg-card p-4">
            {privacySettings.map((setting, index) => (
              <View
                key={index}
                className={`flex-row items-center justify-between ${index < privacySettings.length - 1 ? "mb-4 pb-4 border-b border-muted/10" : ""}`}
              >
                <View className="flex-1 flex-row items-center">
                  <Ionicons
                    name={setting.icon as any}
                    size={24}
                    color="#999"
                    style={{ marginRight: 12 }}
                  />
                  <View className="flex-1">
                    <Text className="mb-1 font-medium text-base text-text">
                      {setting.title}
                    </Text>
                    <Text className="text-muted text-xs">
                      {setting.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={setting.value}
                  onValueChange={setting.onChange}
                  trackColor={{ false: "#333", true: "#1F89DA" }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="mb-3 font-bold text-text text-lg">
            Gerenciar Dados
          </Text>
          {dataOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              className="mb-3 flex-row items-center rounded-xl bg-card p-4"
            >
              <View
                className="mr-4 items-center justify-center rounded-full p-3"
                style={{ backgroundColor: `${option.color}20` }}
              >
                <Ionicons name={option.icon as any} size={24} color={option.color} />
              </View>
              <View className="flex-1">
                <Text className="mb-1 font-semibold text-base text-text">
                  {option.title}
                </Text>
                <Text className="text-muted text-sm">{option.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-6 rounded-2xl bg-primary/10 p-4">
          <View className="mb-2 flex-row items-start">
            <Ionicons
              name="information-circle"
              size={20}
              color="#1F89DA"
              style={{ marginRight: 8, marginTop: 2 }}
            />
            <Text className="flex-1 font-semibold text-base text-primary">
              Suas informações estão seguras
            </Text>
          </View>
          <Text className="leading-5 text-primary/80 text-sm">
            Utilizamos criptografia de ponta a ponta para proteger seus dados.
            Suas informações nunca serão compartilhadas sem sua permissão.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
