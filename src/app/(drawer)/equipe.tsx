import { useAuth } from "@/context/auth-context";
import { request } from "@/helper/request";
import type { Usuario } from "@/interfaces/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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

interface UsuarioEquipe {
  idUser: number;
  email: string;
  cargo: string;
  nome: string;
}

interface PageableResponse {
  content: UsuarioEquipe[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
}

export default function EquipePage() {
  const { token } = useAuth();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioEquipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioEquipe | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  const fetchData = async (page = 0, isRefresh = false) => {
    if (!token) return;

    if (isRefresh) {
      setRefreshing(true);
    } else if (page > 0) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      // Busca dados do usuário
      const usuarioResponse = await request("/usuario/me", "get", null, {
        authToken: token,
      });
      setUsuario(usuarioResponse as Usuario);

      // Só busca membros da equipe se o usuário tiver equipe
      if ((usuarioResponse as Usuario).equipeId !== null) {
        const usuariosResponse = await request(
          `/equipe/usuarios?page=${page}&size=${pageSize}&sort=nome,asc`,
          "get",
          null,
          { authToken: token }
        );

        const pageableData = usuariosResponse as PageableResponse;
        const usuarioLogado = usuarioResponse as Usuario;

        // Reorganiza para colocar o usuário logado no topo
        let usuariosOrdenados = [...pageableData.content];
        const indexUsuarioLogado = usuariosOrdenados.findIndex(
          (u) => u.idUser === usuarioLogado.id
        );

        if (indexUsuarioLogado > -1) {
          const [usuarioAtual] = usuariosOrdenados.splice(indexUsuarioLogado, 1);
          usuariosOrdenados.unshift(usuarioAtual);
        }

        if (isRefresh || page === 0) {
          setUsuarios(usuariosOrdenados);
        } else {
          setUsuarios((prev) => [...prev, ...usuariosOrdenados]);
        }

        setTotalPages(pageableData.totalPages);
        setTotalElements(pageableData.totalElements);
        setCurrentPage(pageableData.number);
      }
    } catch (error) {
      console.error("Erro ao carregar equipe:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchData(0, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && currentPage + 1 < totalPages) {
      fetchData(currentPage + 1);
    }
  };

  const handleAbrirReconhecimento = (usuario: UsuarioEquipe) => {
    setUsuarioSelecionado(usuario);
    setModalVisible(true);
  };

  const handleFecharModal = () => {
    setModalVisible(false);
    setUsuarioSelecionado(null);
    setTitulo("");
    setDescricao("");
  };

  const handleEnviarReconhecimento = async () => {
    if (!usuarioSelecionado || !token) return;

    if (!titulo.trim()) {
      Alert.alert("Campo obrigatório", "Por favor, insira um título para o reconhecimento.");
      return;
    }

    setEnviando(true);
    try {
      await request(
        `/reconhecimento/${usuarioSelecionado.idUser}`,
        "post",
        {
          titulo: titulo.trim(),
          descricao: descricao.trim() || undefined,
        },
        {
          authToken: token,
        }
      );

      Alert.alert(
        "Reconhecimento enviado! 🎉",
        `Você reconheceu ${usuarioSelecionado.nome} com sucesso.`
      );

      handleFecharModal();
    } catch (error: any) {
      console.error("Erro ao enviar reconhecimento:", error);

      const mensagemErro =
        error?.response?.data?.message ||
        error?.message ||
        "Não foi possível enviar o reconhecimento. Tente novamente.";

      Alert.alert("Erro ao enviar reconhecimento", mensagemErro);
    } finally {
      setEnviando(false);
    }
  };

  const renderUsuarioItem = ({ item }: { item: UsuarioEquipe }) => {
    const iniciais = item.nome
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const isUsuarioLogado = item.idUser === usuario?.id;

    return (
      <View className="mb-3 overflow-hidden rounded-2xl bg-card">
        <View className="flex-row items-center gap-4 p-4">
          {/* Avatar com iniciais */}
          <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/20">
            <Text className="font-bold text-lg text-primary">{iniciais}</Text>
          </View>

          {/* Informações do usuário */}
          <View className="flex-1">
            <View className="mb-1 flex-row items-center gap-2">
              <Text className="font-semibold text-base text-text">{item.nome}</Text>
              {isUsuarioLogado && (
                <View className="rounded-full bg-primary/20 px-2 py-1">
                  <Text className="font-medium text-primary text-xs">(você)</Text>
                </View>
              )}
            </View>

            <View className="mb-1 flex-row items-center gap-2">
              <Ionicons name="mail" size={14} color="#666" />
              <Text className="flex-1 text-muted text-xs">{item.email}</Text>
            </View>

            {item.cargo && (
              <View className="flex-row items-center gap-2">
                <Ionicons name="briefcase" size={14} color="#666" />
                <Text className="text-muted text-xs">{item.cargo}</Text>
              </View>
            )}
          </View>

          {/* Botão de reconhecimento (só para outros usuários) */}
          {!isUsuarioLogado && (
            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
              onPress={() => handleAbrirReconhecimento(item)}
              activeOpacity={0.7}
            >
              <Ionicons name="trophy" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#1F89DA" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View className="items-center py-12">
      <Ionicons name="people-outline" size={64} color="#1F89DA" />
      <Text className="mt-4 text-center text-base text-text">Nenhum membro na equipe</Text>
    </View>
  );

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
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24 }}
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
        {/* Header */}
        <View className="mb-6">
          <Text className="font-extrabold text-3xl text-text">Minha Equipe</Text>
          {usuario?.equipeNome && (
            <Text className="mt-2 text-base text-muted">
              {usuario.equipeNome} • {totalElements} {totalElements === 1 ? "membro" : "membros"}
            </Text>
          )}
        </View>

        {usuario?.equipeId ? (
          <>
            {/* Card de Informações da Equipe */}
            {usuario.equipeNome && (
              <View className="mb-6 overflow-hidden rounded-3xl bg-card p-6">
                <View className="mb-4 flex-row items-center gap-2">
                  <Ionicons name="people" size={24} color="#1F89DA" />
                  <Text className="flex-1 font-bold text-xl text-text">{usuario.equipeNome}</Text>
                </View>

                {/* Mock temporário da descrição até a API retornar */}
                <Text className="leading-6 text-sm text-muted">
                  {usuario.equipeDescricao ||
                    "Trabalhando juntos para alcançar nossos objetivos e criar um ambiente colaborativo."}
                </Text>
              </View>
            )}

            {/* Lista de Membros */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-bold text-lg text-text">Membros</Text>
              {totalPages > 1 && (
                <Text className="text-sm text-muted">
                  Página {currentPage + 1} de {totalPages}
                </Text>
              )}
            </View>

            <FlatList
              data={usuarios}
              keyExtractor={(item) => item.idUser.toString()}
              renderItem={renderUsuarioItem}
              ListEmptyComponent={renderEmpty}
              ListFooterComponent={renderFooter}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              scrollEnabled={false}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="people-outline" size={64} color="#1F89DA" />
            <Text className="mt-4 text-center text-base text-text">
              Você não faz parte de uma equipe
            </Text>
            <Text className="mt-2 text-center text-sm text-muted">
              Entre em contato com seu gestor para ser adicionado a uma equipe.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Reconhecimento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleFecharModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 items-center justify-center bg-black/80 px-6">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="w-full max-w-96 rounded-3xl bg-card p-6">
                {/* Header do Modal */}
                <View className="mb-6 items-center">
                  <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <Ionicons name="trophy" size={32} color="#22c55e" />
                  </View>
                  <Text className="font-bold text-2xl text-text">Reconhecer Colega</Text>
                  {usuarioSelecionado && (
                    <Text className="mt-2 text-center text-sm text-muted">
                      Envie um reconhecimento para {usuarioSelecionado.nome}
                    </Text>
                  )}
                </View>

                {/* Campos do formulário */}
                <View className="gap-4">
                  <View>
                    <Text className="mb-2 font-medium text-sm text-text">Título *</Text>
                    <TextInput
                      className="h-12 rounded-xl border border-muted/30 bg-secondary px-4 text-base text-text"
                      placeholder="Ex: Excelente trabalho em equipe"
                      value={titulo}
                      onChangeText={setTitulo}
                      placeholderTextColor="#999"
                      autoCorrect={false}
                    />
                  </View>

                  <View>
                    <Text className="mb-2 font-medium text-sm text-text">Descrição</Text>
                    <View className="rounded-xl border border-muted/30 bg-secondary p-4">
                      <TextInput
                        className="min-h-24 text-base text-text"
                        placeholder="Descreva o que você gostaria de reconhecer..."
                        value={descricao}
                        onChangeText={setDescricao}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        placeholderTextColor="#999"
                        autoCorrect={false}
                      />
                    </View>
                  </View>
                </View>

                {/* Botões de ação */}
                <View className="mt-6 flex-row gap-3">
                  <TouchableOpacity
                    className="h-12 flex-1 items-center justify-center rounded-xl border border-muted/30 bg-background"
                    onPress={handleFecharModal}
                    disabled={enviando}
                  >
                    <Text className="font-medium text-base text-muted">Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="h-12 flex-1 items-center justify-center rounded-xl bg-green-500"
                    onPress={handleEnviarReconhecimento}
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
