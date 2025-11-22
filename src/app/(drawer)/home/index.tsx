import { useAuth } from "@/context/auth-context";
import { request } from "@/helper/request";
import type { Usuario } from "@/interfaces/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Sentimento = "MUITO_TRISTE" | "TRISTE" | "NEUTRO" | "FELIZ" | "MUITO_FELIZ";

interface SentimentoOption {
  type: Sentimento;
  emoji: string;
  label: string;
  color: string;
}

interface SentimentoRegistrado {
  tipoSentimento: Sentimento | null;
  data: string | null;
}

const sentimentos: SentimentoOption[] = [
  { type: "MUITO_TRISTE", emoji: "😢", label: "Muito Triste", color: "#ef4444" },
  { type: "TRISTE", emoji: "😕", label: "Triste", color: "#f97316" },
  { type: "NEUTRO", emoji: "😐", label: "Neutro", color: "#fbbf24" },
  { type: "FELIZ", emoji: "😊", label: "Feliz", color: "#84cc16" },
  { type: "MUITO_FELIZ", emoji: "😄", label: "Muito Feliz", color: "#22c55e" },
];

export default function HomePage() {
  const { token } = useAuth();
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSentimento, setSelectedSentimento] = useState<SentimentoOption | null>(null);
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sentimentoRegistrado, setSentimentoRegistrado] = useState<SentimentoRegistrado | null>(
    null
  );

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  const fetchData = async (isRefresh = false) => {
    if (!token) return;

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Primeiro busca dados do usuário
      const usuarioResponse = await request("/usuario/me", "get", null, {
        authToken: token,
      });
      setUsuario(usuarioResponse as Usuario);

      // Só busca sentimento se o usuário faz parte de uma equipe
      if ((usuarioResponse as Usuario).equipeId !== null) {
        const sentimentoResponse = await request("/sentimento", "get", null, {
          authToken: token,
        });
        setSentimentoRegistrado(sentimentoResponse as SentimentoRegistrado);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
  };

  const handleSentimentoPress = (sentimento: SentimentoOption) => {
    setSelectedSentimento(sentimento);
    setModalVisible(true);
  };

  const handleEnviarSentimento = async () => {
    if (!selectedSentimento || !token) return;

    setEnviando(true);
    try {
      await request(
        "/sentimento",
        "post",
        {
          tipo: selectedSentimento.type,
          descricao: descricao.trim() || undefined,
        },
        {
          authToken: token,
        }
      );

      // Atualizar sentimento registrado
      setSentimentoRegistrado({
        tipoSentimento: selectedSentimento.type,
        data: new Date().toISOString(),
      });

      // Fechar modal e resetar
      setModalVisible(false);
      setDescricao("");
      setSelectedSentimento(null);
    } catch (error) {
      console.error("Erro ao enviar sentimento:", error);
      // TODO: Adicionar feedback visual de erro para o usuário
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelar = () => {
    setModalVisible(false);
    setDescricao("");
    setSelectedSentimento(null);
  };

  const getSentimentoOption = (tipo: Sentimento): SentimentoOption | undefined => {
    return sentimentos.find((s) => s.type === tipo);
  };

  const getPrimeiroNome = (nomeCompleto: string) => {
    return nomeCompleto.split(" ")[0];
  };

  const temEquipe = usuario?.equipeId !== null;
  const jaRegistrouHoje = sentimentoRegistrado?.tipoSentimento !== null;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#1F89DA" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1F89DA"
            colors={["#1F89DA"]}
          />
        }
      >
        <View className="px-6 pt-6">
          {/* Header com saudação */}
          <View className="mb-8">
            <Text className="font-extrabold text-3xl text-text">
              Olá, {usuario ? getPrimeiroNome(usuario.nome) : "Usuário"}! 👋
            </Text>
            <Text className="mt-2 text-base text-muted">Como você está se sentindo hoje?</Text>
          </View>

          {/* Card de Sentimentos */}
          <View className="mb-6 overflow-hidden rounded-3xl bg-card p-6">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="heart" size={24} color="#1F89DA" />
              <Text className="font-bold text-xl text-text">Registre seu Humor</Text>
            </View>

            {!temEquipe ? (
              // Mensagem quando não tem equipe
              <View className="items-center py-8">
                <Ionicons name="people-outline" size={64} color="#1F89DA" />
                <Text className="mt-4 text-center text-base text-text">
                  Você precisa fazer parte de uma equipe
                </Text>
                <Text className="mt-2 text-center text-sm text-muted">
                  Entre em contato com seu gestor para ser adicionado a uma equipe e começar a
                  registrar seus sentimentos.
                </Text>
              </View>
            ) : jaRegistrouHoje && sentimentoRegistrado?.tipoSentimento ? (
              // Mensagem quando já registrou hoje
              <View className="items-center py-8">
                <View
                  className="mb-4 h-24 w-24 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      getSentimentoOption(sentimentoRegistrado.tipoSentimento)?.color + "20",
                  }}
                >
                  <Text className="text-6xl">
                    {getSentimentoOption(sentimentoRegistrado.tipoSentimento)?.emoji}
                  </Text>
                </View>
                <Text className="font-bold text-lg text-text">Sentimento Registrado! 🎉</Text>
                <Text className="mt-2 text-center text-sm text-muted">
                  Você já compartilhou como se sente hoje. Volte amanhã para registrar um novo
                  sentimento e continuar acompanhando seu bem-estar.
                </Text>
              </View>
            ) : (
              // Seletor de sentimentos
              <>
                <Text className="mb-6 text-sm text-muted">
                  Selecione como você está se sentindo neste momento. Isso nos ajuda a manter um
                  ambiente de trabalho saudável.
                </Text>

                {/* Grid de Sentimentos */}
                <View className="flex-row justify-between gap-2">
                  {sentimentos.map((sentimento) => (
                    <TouchableOpacity
                      key={sentimento.type}
                      className="flex-1 items-center justify-center rounded-2xl border border-muted/20 bg-secondary py-6"
                      onPress={() => handleSentimentoPress(sentimento)}
                      activeOpacity={0.7}
                    >
                      <Text className="text-4xl">{sentimento.emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>

          {/* Ações Rápidas */}
          <View className="mb-6">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="flash" size={20} color="#1F89DA" />
              <Text className="font-bold text-lg text-text">Ações Rápidas</Text>
            </View>

            <View className="flex-row gap-3">
              {/* Botão Minha Equipe */}
              <TouchableOpacity
                className="flex-1 overflow-hidden rounded-2xl bg-card p-4"
                onPress={() => router.push("/(drawer)/equipe")}
                activeOpacity={0.7}
              >
                <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Ionicons name="people" size={24} color="#1F89DA" />
                </View>
                <Text className="mb-1 font-semibold text-sm text-text">Minha Equipe</Text>
                <Text className="text-muted text-xs">Ver membros e enviar reconhecimentos</Text>
              </TouchableOpacity>

              {/* Botão Relatórios */}
              <TouchableOpacity
                className="flex-1 overflow-hidden rounded-2xl bg-card p-4"
                onPress={() => router.push("/(drawer)/relatorios/individuais")}
                activeOpacity={0.7}
              >
                <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Ionicons name="bar-chart" size={24} color="#1F89DA" />
                </View>
                <Text className="mb-1 font-semibold text-sm text-text">Relatórios</Text>
                <Text className="text-muted text-xs">Resumos mensais por IA</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-3 flex-row gap-3">
              {/* Botão Perfil */}
              <TouchableOpacity
                className="flex-1 overflow-hidden rounded-2xl bg-card p-4"
                onPress={() => router.push("/(drawer)/account")}
                activeOpacity={0.7}
              >
                <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Ionicons name="person" size={24} color="#1F89DA" />
                </View>
                <Text className="mb-1 font-semibold text-sm text-text">Meu Perfil</Text>
                <Text className="text-muted text-xs">Ver informações pessoais</Text>
              </TouchableOpacity>

              {/* Botão Sobre */}
              <TouchableOpacity
                className="flex-1 overflow-hidden rounded-2xl bg-card p-4"
                onPress={() => router.push("/(drawer)/home/sobre")}
                activeOpacity={0.7}
              >
                <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Ionicons name="information-circle" size={24} color="#1F89DA" />
                </View>
                <Text className="mb-1 font-semibold text-sm text-text">Sobre</Text>
                <Text className="text-muted text-xs">Conheça o Aura+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Sentimento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancelar}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 items-center justify-center bg-black/80 px-6">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="w-full max-w-96 rounded-3xl bg-card p-6">
                {/* Header do Modal */}
                <View className="mb-6 items-center">
                  <View
                    className="mb-4 h-20 w-20 items-center justify-center rounded-full overflow-hidden"
                    style={{
                      backgroundColor: selectedSentimento?.color + "20",
                    }}
                  >
                    <Text className="text-5xl leading-none" style={{ marginTop: 4 }}>
                      {selectedSentimento?.emoji}
                    </Text>
                  </View>
                  <Text className="font-bold text-2xl text-text">{selectedSentimento?.label}</Text>
                  <Text className="mt-2 text-center text-sm text-muted">
                    Compartilhe mais sobre como você está se sentindo
                  </Text>
                </View>

                {/* Campo de Descrição */}
                <View className="mb-6">
                  <Text className="mb-2 font-medium text-sm text-text">Descrição (Opcional)</Text>
                  <View className="rounded-xl border border-muted/30 bg-secondary p-4">
                    <TextInput
                      className="min-h-24 text-base text-text"
                      placeholder="Conte-nos mais sobre seu dia..."
                      value={descricao}
                      onChangeText={setDescricao}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Botões de Ação */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="h-12 flex-1 items-center justify-center rounded-xl border border-muted/30 bg-background"
                    onPress={handleCancelar}
                    disabled={enviando}
                  >
                    <Text className="font-medium text-base text-muted">Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="h-12 flex-1 items-center justify-center rounded-xl"
                    style={{ backgroundColor: selectedSentimento?.color }}
                    onPress={handleEnviarSentimento}
                    disabled={enviando}
                  >
                    {enviando ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="font-semibold text-base text-white">Enviar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}
