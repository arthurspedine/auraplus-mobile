import { request } from "@/helper/request";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FuncionarioDoMes {
  nome: string;
  numeroIndicacoes: number;
  cargo: string;
  equipe: string;
  mensagemReconhecimento: string;
}

export default function MuralScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [funcionarios, setFuncionarios] = useState<FuncionarioDoMes[]>([]);

  const carregarFuncionarios = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const token = await AsyncStorage.getItem("jwt_token");
      if (!token) return;

      const response: any = await request("/relatorios/usuario/funcionario-do-mes", "get", null, {
        authToken: token,
      });

      setFuncionarios(Array.isArray(response) ? response : []);
    } catch (error) {
      setFuncionarios([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const handleRefresh = () => {
    carregarFuncionarios(true);
  };

  const getIniciais = (nome: string) => {
    return nome
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
          <View className="mb-6">
            <Text className="mb-2 font-extrabold text-3xl text-text">Mural</Text>
            <Text className="text-base text-muted">Funcionários do mês anterior em destaque</Text>
          </View>

          {loading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#1F89DA" />
            </View>
          ) : funcionarios.length > 0 ? (
            <View className="gap-4 pb-6">
              {funcionarios.map((funcionario, index) => (
                <View key={index} className="overflow-hidden rounded-3xl bg-card p-6">
                  {/* Header com troféu */}
                  <View className="mb-4 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
                        <Ionicons name="trophy" size={24} color="#eab308" />
                      </View>
                      <Text className="font-bold text-lg text-text">Funcionário do Mês</Text>
                    </View>
                    <View className="rounded-full bg-primary/10 px-3 py-1">
                      <Text className="font-semibold text-primary text-xs">
                        {funcionario.numeroIndicacoes}{" "}
                        {funcionario.numeroIndicacoes === 1 ? "reconhecimento" : "reconhecimentos"}
                      </Text>
                    </View>
                  </View>

                  {/* Avatar e Info */}
                  <View className="mb-4 flex-row items-center gap-4">
                    <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                      <Text className="font-bold text-2xl text-primary">
                        {getIniciais(funcionario.nome)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 font-bold text-xl text-text">{funcionario.nome}</Text>
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="briefcase" size={14} color="#666" />
                        <Text className="text-muted text-sm">{funcionario.cargo}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Mensagem */}
                  {funcionario.mensagemReconhecimento && (
                    <View className="rounded-xl bg-primary/5 p-4">
                      <View className="mb-2 flex-row items-center gap-2">
                        <Ionicons name="chatbox-ellipses" size={16} color="#1F89DA" />
                        <Text className="font-semibold text-sm text-primary">
                          Mensagem de Reconhecimento
                        </Text>
                      </View>
                      <Text className="leading-5 text-sm text-text">
                        "{funcionario.mensagemReconhecimento}"
                      </Text>
                      <Text className="mt-2 text-right text-muted text-xs">✨ Gerado por IA</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="ribbon-outline" size={64} color="#1F89DA" />
              <Text className="mt-4 text-center text-base text-text">
                Nenhum funcionário em destaque
              </Text>
              <Text className="mt-2 text-center text-sm text-muted">
                Os funcionários do mês aparecerão aqui.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
