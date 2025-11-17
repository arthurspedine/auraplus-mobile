import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function SobreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6">
        <Text className="mb-2 font-extrabold text-3xl text-text">Sobre</Text>
        <Text className="mb-6 text-base text-muted">
          Conheça mais sobre o AuraPlus
        </Text>

        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-3 font-bold text-text text-xl">O que é AuraPlus?</Text>
          <Text className="leading-6 text-muted">
            AuraPlus é uma plataforma mobile moderna desenvolvida para oferecer
            a melhor experiência aos nossos usuários. Com um design intuitivo e
            funcionalidades avançadas, buscamos sempre inovar e melhorar.
          </Text>
        </View>

        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-3 font-bold text-text text-xl">Versão</Text>
          <Text className="text-muted">1.0.0</Text>
        </View>

        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-3 font-bold text-text text-xl">Missão</Text>
          <Text className="leading-6 text-muted">
            Nossa missão é proporcionar uma experiência excepcional através de
            tecnologia de ponta e design focado no usuário.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
