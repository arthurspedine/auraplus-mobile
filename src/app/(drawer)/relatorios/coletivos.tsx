import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RelatoriosColetivoScreen() {
  const [refreshing, setRefreshing] = useState(false);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    // Aqui virá a lógica de carregar dados
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
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
                {meses[mesSelecionado].nome} de {anoSelecionado}
              </Text>
            </View>
          </View>

          {/* Placeholder de Conteúdo */}
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="analytics-outline" size={64} color="#1F89DA" />
            <Text className="mt-4 text-center text-base text-text">
              Relatórios em desenvolvimento
            </Text>
            <Text className="mt-2 text-center text-sm text-muted">
              Em breve você poderá visualizar estatísticas coletivas da equipe, incluindo clima
              emocional e reconhecimentos.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
