import { request } from "@/helper/request";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SentimentoTipo = "MUITO_TRISTE" | "TRISTE" | "NEUTRO" | "FELIZ" | "MUITO_FELIZ";

interface RelatorioEquipe {
  mesReferente: string;
  anoReferente: string;
  nomeEquipe: string;
  sentimentoMedio: SentimentoTipo;
  descritivo: string;
  totalReports: number;
}

const sentimentosConfig: Record<
  SentimentoTipo,
  { emoji: string; cor: string; nome: string; bgColor: string }
> = {
  MUITO_TRISTE: { emoji: "😢", cor: "#ef4444", nome: "Muito Triste", bgColor: "#ef4444" },
  TRISTE: { emoji: "😕", cor: "#f97316", nome: "Triste", bgColor: "#f97316" },
  NEUTRO: { emoji: "😐", cor: "#fbbf24", nome: "Neutro", bgColor: "#fbbf24" },
  FELIZ: { emoji: "😊", cor: "#84cc16", nome: "Feliz", bgColor: "#84cc16" },
  MUITO_FELIZ: { emoji: "😄", cor: "#22c55e", nome: "Muito Feliz", bgColor: "#22c55e" },
};

export default function RelatoriosColetivoScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [relatorio, setRelatorio] = useState<RelatorioEquipe | null>(null);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [anoSelecionado, setAnoSelecionado] = useState(currentYear);
  const [mesSelecionado, setMesSelecionado] = useState(currentMonth + 1);

  const anos = [currentYear - 2, currentYear - 1, currentYear];
  const meses = [
    { numero: 1, nome: "Janeiro" },
    { numero: 2, nome: "Fevereiro" },
    { numero: 3, nome: "Março" },
    { numero: 4, nome: "Abril" },
    { numero: 5, nome: "Maio" },
    { numero: 6, nome: "Junho" },
    { numero: 7, nome: "Julho" },
    { numero: 8, nome: "Agosto" },
    { numero: 9, nome: "Setembro" },
    { numero: 10, nome: "Outubro" },
    { numero: 11, nome: "Novembro" },
    { numero: 12, nome: "Dezembro" },
  ];

  const carregarRelatorio = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const token = await AsyncStorage.getItem("jwt_token");
      if (!token) return;

      const response: any = await request(
        `/relatorios/equipe?mes=${mesSelecionado}&ano=${anoSelecionado}`,
        "get",
        null,
        { authToken: token }
      );

      setRelatorio(response as RelatorioEquipe);
    } catch (error) {
      // Silenciosamente trata como sem dados disponíveis
      setRelatorio(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarRelatorio();
  }, [mesSelecionado, anoSelecionado]);

  const handleRefresh = () => {
    carregarRelatorio(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-6"
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
        <View className="pt-4">
          <Text className="mb-2 font-extrabold text-3xl text-text">Relatórios Coletivos</Text>
          <Text className="mb-6 text-base text-muted">Visualize o clima da sua equipe</Text>

          {/* Filtros */}
          <View className="mb-4">
            <View className="mb-3 flex-row items-center gap-2">
              <Ionicons name="filter" size={18} color="#1F89DA" />
              <Text className="font-semibold text-sm text-text">Filtros</Text>
            </View>

            {/* Filtro de Ano */}
            <View className="mb-3">
              <Text className="mb-2 font-medium text-xs text-muted">Ano</Text>
              <View className="flex-row gap-2">
                {anos.map((ano) => (
                  <TouchableOpacity
                    key={ano}
                    className={`flex-1 items-center rounded-lg border py-2 ${
                      anoSelecionado === ano
                        ? "border-primary bg-primary/20"
                        : "border-muted/30 bg-card"
                    }`}
                    onPress={() => setAnoSelecionado(ano)}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`font-semibold text-sm ${
                        anoSelecionado === ano ? "text-primary" : "text-text"
                      }`}
                    >
                      {ano}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filtro de Mês */}
            <View>
              <Text className="mb-2 font-medium text-xs text-muted">Mês</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
                contentContainerClassName="gap-2"
              >
                {meses.map((mes) => (
                  <TouchableOpacity
                    key={mes.numero}
                    className={`items-center justify-center rounded-lg border px-3 py-2 ${
                      mesSelecionado === mes.numero
                        ? "border-primary bg-primary/20"
                        : "border-muted/30 bg-card"
                    }`}
                    onPress={() => setMesSelecionado(mes.numero)}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`font-semibold text-xs ${
                        mesSelecionado === mes.numero ? "text-primary" : "text-text"
                      }`}
                    >
                      {mes.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Período Selecionado */}
          <View className="mb-4 rounded-xl bg-primary/10 px-4 py-2">
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name="calendar" size={16} color="#1F89DA" />
              <Text className="font-semibold text-sm text-primary">
                {meses.find((m) => m.numero === mesSelecionado)?.nome} de {anoSelecionado}
              </Text>
            </View>
          </View>

          {/* Conteúdo do Relatório */}
          {loading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#1F89DA" />
            </View>
          ) : relatorio ? (
            <View className="gap-4 pb-6">
              {/* Card da Equipe */}
              <View className="overflow-hidden rounded-3xl bg-card p-6">
                <View className="mb-4 flex-row items-center gap-2">
                  <Ionicons name="people" size={24} color="#1F89DA" />
                  <Text className="font-bold text-xl text-text">Equipe</Text>
                </View>

                <View className="items-center rounded-xl bg-primary/10 p-4">
                  <Text className="font-bold text-2xl text-primary">{relatorio.nomeEquipe}</Text>
                </View>
              </View>

              {/* Card de Sentimento Médio */}
              <View className="overflow-hidden rounded-3xl bg-card p-6">
                <View className="mb-4 flex-row items-center gap-2">
                  <Ionicons name="heart" size={24} color="#1F89DA" />
                  <Text className="font-bold text-xl text-text">Clima Emocional</Text>
                </View>

                {relatorio.sentimentoMedio && sentimentosConfig[relatorio.sentimentoMedio] ? (
                  <View
                    className="items-center rounded-2xl p-6"
                    style={{
                      backgroundColor: `${sentimentosConfig[relatorio.sentimentoMedio].bgColor}20`,
                    }}
                  >
                    <Text className="mb-3 text-6xl">
                      {sentimentosConfig[relatorio.sentimentoMedio].emoji}
                    </Text>
                    <Text
                      className="font-bold text-2xl"
                      style={{ color: sentimentosConfig[relatorio.sentimentoMedio].cor }}
                    >
                      {sentimentosConfig[relatorio.sentimentoMedio].nome}
                    </Text>
                    <Text className="mt-2 text-center text-sm text-muted">
                      Sentimento médio da equipe
                    </Text>
                  </View>
                ) : (
                  <View className="items-center rounded-2xl bg-muted/10 p-6">
                    <Ionicons name="help-circle-outline" size={48} color="#666" />
                    <Text className="mt-3 text-center text-sm text-muted">
                      Dados insuficientes para calcular o clima emocional neste período
                    </Text>
                  </View>
                )}
              </View>

              {/* Card de Reconhecimentos */}
              <View className="overflow-hidden rounded-3xl bg-card p-6">
                <View className="mb-4 flex-row items-center gap-2">
                  <Ionicons name="stats-chart" size={24} color="#1F89DA" />
                  <Text className="font-bold text-xl text-text">Reconhecimentos</Text>
                </View>

                <View className="items-center rounded-2xl bg-green-500/10 p-6">
                  <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <Ionicons name="trophy" size={32} color="#22c55e" />
                  </View>
                  <Text className="mb-1 font-bold text-4xl text-green-500">
                    {relatorio.totalReports}
                  </Text>
                  <Text className="text-center font-medium text-sm text-muted">
                    {relatorio.totalReports === 1
                      ? "Reconhecimento enviado"
                      : "Reconhecimentos enviados"}
                  </Text>
                </View>
              </View>

              {/* Card de Resumo Gerado por IA */}
              {relatorio.descritivo && (
                <View className="overflow-hidden rounded-3xl bg-card p-6">
                  <View className="mb-4 flex-row items-center gap-2">
                    <Ionicons name="sparkles" size={24} color="#1F89DA" />
                    <Text className="font-bold text-xl text-text">Resumo do Período</Text>
                  </View>

                  <View className="rounded-xl bg-primary/5 p-4">
                    <Text className="leading-6 text-sm text-text">{relatorio.descritivo}</Text>
                  </View>

                  <View className="mt-3 flex-row items-center gap-2">
                    <Ionicons name="information-circle" size={16} color="#666" />
                    <Text className="text-muted text-xs">Resumo gerado por IA</Text>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="analytics-outline" size={64} color="#1F89DA" />
              <Text className="mt-4 text-center text-base text-text">
                Nenhum relatório disponível
              </Text>
              <Text className="mt-2 text-center text-sm text-muted">
                Não há dados para o período selecionado.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
