import { Ionicons } from "@expo/vector-icons"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HelpScreen() {
  const faqItems = [
    {
      question: "Como criar uma conta?",
      answer:
        "Para criar uma conta, clique em 'Registrar' na tela de login e preencha suas informações.",
    },
    {
      question: "Como redefinir minha senha?",
      answer:
        "Na tela de login, clique em 'Esqueci minha senha' e siga as instruções enviadas por email.",
    },
    {
      question: "Como atualizar meu perfil?",
      answer:
        "Acesse a tela de Perfil através do menu lateral e clique em 'Editar Perfil'.",
    },
    {
      question: "Como posso entrar em contato com o suporte?",
      answer:
        "Você pode entrar em contato através do email suporte@auraplus.com ou pela seção de mensagens.",
    },
  ]

  const helpTopics = [
    {
      icon: "help-circle",
      title: "Central de Ajuda",
      description: "Encontre respostas para suas dúvidas",
      color: "#1F89DA",
    },
    {
      icon: "chatbubbles",
      title: "Chat com Suporte",
      description: "Converse com nossa equipe",
      color: "#10B981",
    },
    {
      icon: "mail",
      title: "Email",
      description: "suporte@auraplus.com",
      color: "#F59E0B",
    },
    {
      icon: "call",
      title: "Telefone",
      description: "(11) 1234-5678",
      color: "#8B5CF6",
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6">
        <Text className="mb-2 font-extrabold text-3xl text-text">Ajuda</Text>
        <Text className="mb-6 text-base text-muted">
          Como podemos te ajudar?
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="mb-6">
          <Text className="mb-3 font-bold text-text text-lg">
            Entre em Contato
          </Text>
          <View className="gap-3">
            {helpTopics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center rounded-xl bg-card p-4"
              >
                <View
                  className="mr-4 items-center justify-center rounded-full p-3"
                  style={{ backgroundColor: `${topic.color}20` }}
                >
                  <Ionicons name={topic.icon as any} size={24} color={topic.color} />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 font-semibold text-base text-text">
                    {topic.title}
                  </Text>
                  <Text className="text-muted text-sm">{topic.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="mb-3 font-bold text-text text-lg">
            Perguntas Frequentes
          </Text>
          {faqItems.map((item, index) => (
            <View key={index} className="mb-3 rounded-xl bg-card p-4">
              <View className="mb-2 flex-row items-start">
                <Ionicons
                  name="help-circle"
                  size={20}
                  color="#1F89DA"
                  style={{ marginRight: 8, marginTop: 2 }}
                />
                <Text className="flex-1 font-semibold text-base text-text">
                  {item.question}
                </Text>
              </View>
              <Text className="leading-5 text-muted text-sm">{item.answer}</Text>
            </View>
          ))}
        </View>

        <View className="mb-6">
          <Text className="mb-3 font-bold text-text text-lg">
            Recursos Adicionais
          </Text>
          <TouchableOpacity className="mb-3 flex-row items-center justify-between rounded-xl bg-card p-4">
            <View className="flex-row items-center">
              <Ionicons
                name="book-outline"
                size={24}
                color="#999"
                style={{ marginRight: 12 }}
              />
              <Text className="text-base text-text">Documentação</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity className="mb-3 flex-row items-center justify-between rounded-xl bg-card p-4">
            <View className="flex-row items-center">
              <Ionicons
                name="videocam-outline"
                size={24}
                color="#999"
                style={{ marginRight: 12 }}
              />
              <Text className="text-base text-text">Tutoriais em Vídeo</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between rounded-xl bg-card p-4">
            <View className="flex-row items-center">
              <Ionicons
                name="people-outline"
                size={24}
                color="#999"
                style={{ marginRight: 12 }}
              />
              <Text className="text-base text-text">Comunidade</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
