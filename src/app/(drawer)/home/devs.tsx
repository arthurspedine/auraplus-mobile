import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DevsScreen() {
  const developers = [
    {
      name: "Matheus Esteves",
      rm: "554769",
      imageUrl: "https://github.com/matheus-esteves10.png",
    },
    {
      name: "Gabriel Falanga",
      rm: "555061",
      imageUrl: "https://github.com/gabrielfalanga.png",
    },
    {
      name: "Arthur Spedine",
      rm: "554489",
      imageUrl: "https://github.com/arthurspedine.png",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-4">
          <Text className="mb-2 font-extrabold text-3xl text-text">Desenvolvedores</Text>
          <Text className="mb-6 text-base text-muted">Conheça a equipe por trás do projeto</Text>
        </View>

        {/* Cards dos Desenvolvedores */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6 w-full flex-grow-0"
          contentContainerClassName="px-6"
        >
          {developers.map((dev) => (
            <View key={dev.rm} className="mr-6 w-72 overflow-hidden rounded-2xl bg-card p-6">
              <View className="mb-4 items-center">
                <Image source={{ uri: dev.imageUrl }} className="mb-4 h-32 w-32 rounded-full" />
                <Text className="mb-1 text-center font-bold text-text text-xl">{dev.name}</Text>
                <View className="rounded-full bg-primary/20 px-4 py-1">
                  <Text className="font-medium text-primary text-sm">RM: {dev.rm}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Depoimento da Equipe */}
        <View className="px-6 pb-6">
          <View className="mb-4 flex-row items-center gap-2">
            <Ionicons name="bulb" size={24} color="#1F89DA" />
            <Text className="font-bold text-xl text-text">Nossa História</Text>
          </View>

          <View className="mb-4 rounded-2xl bg-card p-5">
            <View className="mb-3 flex-row items-center gap-2">
              <Ionicons name="rocket" size={20} color="#1F89DA" />
              <Text className="font-semibold text-text">Como surgiu a ideia</Text>
            </View>
            <Text className="leading-6 text-sm text-muted">
              O Aura+ nasceu da observação de um problema real nas empresas: a dificuldade em manter
              os colaboradores engajados e conectados com a cultura organizacional. Notamos que
              muitas vezes os gestores não têm visibilidade do clima emocional de suas equipes, e os
              colaboradores não têm um canal simples para expressar como estão se sentindo.
            </Text>
          </View>

          <View className="mb-4 rounded-2xl bg-card p-5">
            <View className="mb-3 flex-row items-center gap-2">
              <Ionicons name="heart" size={20} color="#1F89DA" />
              <Text className="font-semibold text-text">Nossa missão</Text>
            </View>
            <Text className="leading-6 text-sm text-muted">
              Queremos criar um ambiente onde cada colaborador se sinta valorizado e ouvido.
              Acreditamos que o reconhecimento entre pares e a transparência emocional são
              fundamentais para construir equipes mais unidas e produtivas. O Aura+ é nossa
              contribuição para tornar o ambiente de trabalho mais humano e acolhedor.
            </Text>
          </View>

          <View className="rounded-2xl bg-card p-5">
            <View className="mb-3 flex-row items-center gap-2">
              <Ionicons name="code-slash" size={20} color="#1F89DA" />
              <Text className="font-semibold text-text">Tecnologia e inovação</Text>
            </View>
            <Text className="leading-6 text-sm text-muted">
              Desenvolvemos este projeto como parte da Global Solution 2025-2 da FIAP, aplicando as
              melhores práticas de desenvolvimento mobile com React Native e Expo. Nossa arquitetura
              foi pensada para ser escalável, moderna e proporcionar a melhor experiência possível
              aos usuários.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
