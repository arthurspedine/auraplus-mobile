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

interface RelatorioIndividual {
  numeroIndicacoes: number;
  descritivo: string;
  nomeUsuario: string;
  mes: string;
  ano: string;
}

export default function RelatoriosIndividuaisScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [relatorio, setRelatorio] = useState<RelatorioIndividual | null>(null);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [anoSelecionado, setAnoSelecionado] = useState(currentYear);
  const [mesSelecionado, setMesSelecionado] = useState(currentMonth);

  const anos = [currentYear - 2, currentYear - 1, currentYear];
  const meses = [
    { numero: 0, nome: "Janeiro" },
    { numero: 1, nome: "Fevereiro" },
    { numero: 2, nome: "Março" },
    { numero: 3, nome: "Abril" },
    { numero: 4, nome: "Maio" },
    { numero: 5, nome: "Junho" },
    { numero: 6, nome: "Julho" },
    { numero: 7, nome: "Agosto" },
    { numero: 8, nome: "Setembro" },
    { numero: 9, nome: "Outubro" },
    { numero: 10, nome: "Novembro" },
    { numero: 11, nome: "Dezembro" },
  ];

  const carregarRelatorio = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response: any = await request(
        `/relatorios/usuario?mes=${mesSelecionado}&ano=${anoSelecionado}`,
        "get",
        null,
        { authToken: token }
      );

      setRelatorio(response as RelatorioIndividual);
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
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
          <Text className="mb-2 font-extrabold text-3xl text-text">Relatórios Individuais</Text>
          <Text className="mb-6 text-base text-muted">Acompanhe suas estatísticas pessoais</Text>

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
                {meses[mesSelecionado].nome} de {anoSelecionado}
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
              {/* Card de Estatísticas */}
              <View className="overflow-hidden rounded-3xl bg-card p-6">
                <View className="mb-4 flex-row items-center gap-2">
                  <Ionicons name="stats-chart" size={24} color="#1F89DA" />
                  <Text className="font-bold text-xl text-text">Estatísticas</Text>
                </View>

                {/* Nome do Usuário */}
                <View className="mb-4 flex-row items-center gap-2 rounded-xl bg-primary/10 p-3">
                  <Ionicons name="person" size={20} color="#1F89DA" />
                  <Text className="flex-1 font-semibold text-base text-text">
                    {relatorio.nomeUsuario}
                  </Text>
                </View>

                {/* Reconhecimentos Recebidos */}
                <View className="items-center rounded-2xl bg-green-500/10 p-6">
                  <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <Ionicons name="trophy" size={32} color="#22c55e" />
                  </View>
                  <Text className="mb-1 font-bold text-4xl text-green-500">
                    {relatorio.numeroIndicacoes}
                  </Text>
                  <Text className="text-center font-medium text-sm text-muted">
                    {relatorio.numeroIndicacoes === 1
                      ? "Reconhecimento recebido"
                      : "Reconhecimentos recebidos"}
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
              <Ionicons name="document-text-outline" size={64} color="#1F89DA" />
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
