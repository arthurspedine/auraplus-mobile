import { useAuth } from "@/context/auth-context";
import { request } from "@/helper/request";
import type { Usuario } from "@/interfaces/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

interface EquipeResponse {
  nomeTime: string;
  descricao: string;
  usuarios: PageableResponse;
}

interface NovoMembro {
  email: string;
  cargo: string;
}

export default function EquipePage() {
  const { token, refreshUsuario } = useAuth();
  const { t } = useTranslation();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioEquipe[]>([]);
  const [nomeEquipe, setNomeEquipe] = useState<string | null>(null);
  const [descricaoEquipe, setDescricaoEquipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Modal de reconhecimento
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioEquipe | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Modal de adicionar membros
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [novosMembros, setNovosMembros] = useState<NovoMembro[]>([{ email: "", cargo: "" }]);
  const [adicionandoMembros, setAdicionandoMembros] = useState(false);

  // Modal de criar equipe
  const [modalCriarEquipeVisible, setModalCriarEquipeVisible] = useState(false);
  const [nomeNovaEquipe, setNomeNovaEquipe] = useState("");
  const [descricaoNovaEquipe, setDescricaoNovaEquipe] = useState("");
  const [cargoCriador, setCargoCriador] = useState("");
  const [criandoEquipe, setCriandoEquipe] = useState(false);

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
        const equipeResponse = await request(
          `/equipe/usuarios?page=${page}&size=${pageSize}&sort=nome,asc`,
          "get",
          null,
          { authToken: token }
        );

        const equipeData = equipeResponse as EquipeResponse;
        const pageableData = equipeData.usuarios;
        const usuarioLogado = usuarioResponse as Usuario;

        // Atualiza nome e descrição da equipe
        setNomeEquipe(equipeData.nomeTime);
        setDescricaoEquipe(equipeData.descricao);

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

  const handleAbrirModalAdd = () => {
    setModalAddVisible(true);
    setNovosMembros([{ email: "", cargo: "" }]);
  };

  const handleFecharModalAdd = () => {
    setModalAddVisible(false);
    setNovosMembros([{ email: "", cargo: "" }]);
  };

  const handleAdicionarCampo = () => {
    setNovosMembros([...novosMembros, { email: "", cargo: "" }]);
  };

  const handleRemoverCampo = (index: number) => {
    if (novosMembros.length > 1) {
      const novosMembrosCopy = [...novosMembros];
      novosMembrosCopy.splice(index, 1);
      setNovosMembros(novosMembrosCopy);
    }
  };

  const handleAtualizarMembro = (index: number, field: keyof NovoMembro, value: string) => {
    const novosMembrosCopy = [...novosMembros];
    novosMembrosCopy[index][field] = value;
    setNovosMembros(novosMembrosCopy);
  };

  const handleAbrirModalCriarEquipe = () => {
    setModalCriarEquipeVisible(true);
  };

  const handleFecharModalCriarEquipe = () => {
    setModalCriarEquipeVisible(false);
    setNomeNovaEquipe("");
    setDescricaoNovaEquipe("");
    setCargoCriador("");
  };

  const handleCriarEquipe = async () => {
    if (!token) return;

    if (!nomeNovaEquipe.trim()) {
      Alert.alert(
        t("team.createTeamModal.errorTitle"),
        t("team.createTeamModal.errorNameRequired")
      );
      return;
    }

    if (!cargoCriador.trim()) {
      Alert.alert(
        t("team.createTeamModal.errorTitle"),
        t("team.createTeamModal.errorRoleRequired")
      );
      return;
    }

    setCriandoEquipe(true);
    try {
      await request(
        "/equipe",
        "post",
        {
          nomeEquipe: nomeNovaEquipe,
          descricaoEquipe: descricaoNovaEquipe,
          cargoCriador: cargoCriador,
        },
        { authToken: token }
      );

      Alert.alert(t("team.createTeamModal.successTitle"), t("team.createTeamModal.successMessage"));
      handleFecharModalCriarEquipe();
      await refreshUsuario(); // Atualiza dados do usuário no contexto
      fetchData(0, true);
    } catch (error: any) {
      console.error("Erro ao criar equipe:", error);
      const mensagemErro =
        error?.response?.data?.message || error?.message || t("team.createTeamModal.errorMessage");
      Alert.alert(t("team.createTeamModal.errorTitle"), mensagemErro);
    } finally {
      setCriandoEquipe(false);
    }
  };

  const handleRemoverMembro = async (idUser: number, nome: string) => {
    Alert.alert(t("team.removeModal.title"), t("team.removeModal.message", { name: nome }), [
      { text: t("team.removeModal.cancel"), style: "cancel" },
      {
        text: t("team.removeModal.confirm"),
        style: "destructive",
        onPress: async () => {
          if (!token) return;

          try {
            await request(`/equipe/usuarios/${idUser}`, "delete", null, { authToken: token });

            Alert.alert(
              t("team.removeModal.successTitle"),
              t("team.removeModal.successMessage", { name: nome })
            );
            fetchData(0, true);
          } catch (error: any) {
            console.error("Erro ao remover membro:", error);
            const mensagemErro =
              error?.response?.data?.message ||
              error?.message ||
              t("team.removeModal.errorMessage");
            Alert.alert(t("team.removeModal.errorTitle"), mensagemErro);
          }
        },
      },
    ]);
  };

  const handleAdicionarMembros = async () => {
    if (!token) return;

    const membrosValidos = novosMembros.filter((m) => m.email.trim() && m.cargo.trim());

    if (membrosValidos.length === 0) {
      Alert.alert(t("team.addMembersModal.errorTitle"), t("team.addMembersModal.errorRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailsInvalidos = membrosValidos.filter((m) => !emailRegex.test(m.email));

    if (emailsInvalidos.length > 0) {
      Alert.alert(
        t("team.addMembersModal.errorTitle"),
        t("team.addMembersModal.errorInvalidEmail")
      );
      return;
    }

    setAdicionandoMembros(true);
    try {
      const response: any = await request("/equipe/usuarios", "post", membrosValidos, {
        authToken: token,
      });

      const mensagensErro: string[] = [];

      if (response?.naoEncontrados && response.naoEncontrados.length > 0) {
        const emails = response.naoEncontrados.join(", ");
        mensagensErro.push(t("team.addMembersModal.errorNotFound", { emails }));
      }

      if (response?.jaEmOutroTime && response.jaEmOutroTime.length > 0) {
        const emails = response.jaEmOutroTime.join(", ");
        mensagensErro.push(t("team.addMembersModal.errorInOtherTeam", { emails }));
      }

      if (response?.jaNaEquipe && response.jaNaEquipe.length > 0) {
        const emails = response.jaNaEquipe.join(", ");
        mensagensErro.push(t("team.addMembersModal.errorAlreadyInTeam", { emails }));
      }

      if (mensagensErro.length > 0) {
        Alert.alert(t("team.addMembersModal.warningTitle"), mensagensErro.join("\n\n"));
        return;
      }

      if (response?.adicionados && response.adicionados.length > 0) {
        Alert.alert(
          t("team.addMembersModal.successTitle"),
          t("team.addMembersModal.successMessage", { count: response.adicionados.length })
        );
        handleFecharModalAdd();
        fetchData(0, true);
      } else {
        Alert.alert(
          t("team.addMembersModal.warningTitle"),
          t("team.addMembersModal.noMembersAdded")
        );
      }
    } catch (error: any) {
      console.error("Erro ao adicionar membros:", error);
      const mensagemErro =
        error?.response?.data?.message || error?.message || t("team.addMembersModal.errorMessage");
      Alert.alert(t("team.addMembersModal.errorTitle"), mensagemErro);
    } finally {
      setAdicionandoMembros(false);
    }
  };

  const handleEnviarReconhecimento = async () => {
    if (!usuarioSelecionado || !token) return;

    if (!titulo.trim()) {
      Alert.alert(t("team.recognizeModal.errorTitle"), t("team.recognizeModal.errorRequired"));
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
        t("team.recognizeModal.successTitle"),
        t("team.recognizeModal.successMessage", { name: usuarioSelecionado.nome })
      );

      handleFecharModal();
    } catch (error: any) {
      console.error("Erro ao enviar reconhecimento:", error);

      const mensagemErro =
        error?.response?.data?.message || error?.message || t("team.recognizeModal.errorMessage");

      Alert.alert(t("team.recognizeModal.errorTitle"), mensagemErro);
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
                  <Text className="font-medium text-primary text-xs">{t("team.you")}</Text>
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

          {/* Botões de ação */}
          <View className="flex-row gap-2">
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

            {/* Botão de remover (só para ADMIN e não pode remover a si mesmo) */}
            {usuario?.role === "ADMIN" && !isUsuarioLogado && (
              <TouchableOpacity
                className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
                onPress={() => handleRemoverMembro(item.idUser, item.nome)}
                activeOpacity={0.7}
              >
                <Ionicons name="person-remove" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
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
      <Text className="mt-4 text-center text-base text-text">{t("team.noMembers")}</Text>
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
          <Text className="font-extrabold text-3xl text-text">{t("team.title")}</Text>
          {nomeEquipe && (
            <Text className="mt-2 text-base text-muted">
              {nomeEquipe} • {totalElements}{" "}
              {t(totalElements === 1 ? "team.member" : "team.members")}
            </Text>
          )}
        </View>

        {usuario?.equipeId ? (
          <>
            {/* Card de Informações da Equipe */}
            {nomeEquipe && (
              <View className="mb-6 overflow-hidden rounded-3xl bg-card p-6">
                <View className="mb-4 flex-row items-center gap-2">
                  <Ionicons name="people" size={24} color="#1F89DA" />
                  <Text className="flex-1 font-bold text-xl text-text">{nomeEquipe}</Text>
                </View>

                <Text className="leading-6 text-sm text-muted">
                  {descricaoEquipe || t("team.defaultDescription")}
                </Text>
              </View>
            )}

            {/* Lista de Membros */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-bold text-lg text-text">{t("team.membersTitle")}</Text>
              <View className="flex-row items-center gap-3">
                {usuario?.role === "ADMIN" && (
                  <TouchableOpacity
                    className="flex-row items-center gap-2 rounded-xl bg-primary px-4 py-2"
                    onPress={handleAbrirModalAdd}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="person-add" size={18} color="#fff" />
                    <Text className="font-semibold text-sm text-white">{t("team.addMembers")}</Text>
                  </TouchableOpacity>
                )}
                {totalPages > 1 && (
                  <Text className="text-sm text-muted">
                    {t("team.page", { current: currentPage + 1, total: totalPages })}
                  </Text>
                )}
              </View>
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
            <Text className="mt-4 text-center text-base text-text">{t("team.noTeamTitle")}</Text>
            <Text className="mt-2 mb-6 text-center text-sm text-muted">
              {t("team.noTeamMessage")}
            </Text>

            <TouchableOpacity
              className="flex-row items-center gap-2 rounded-xl bg-primary px-6 py-3"
              onPress={handleAbrirModalCriarEquipe}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text className="font-semibold text-base text-white">{t("team.createTeam")}</Text>
            </TouchableOpacity>
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
                  <Text className="font-bold text-2xl text-text">
                    {t("team.recognizeModal.title")}
                  </Text>
                  {usuarioSelecionado && (
                    <Text className="mt-2 text-center text-sm text-muted">
                      {t("team.recognizeModal.subtitle", { name: usuarioSelecionado.nome })}
                    </Text>
                  )}
                </View>

                <View className="gap-4">
                  <View>
                    <Text className="mb-2 font-medium text-sm text-text">
                      {t("team.recognizeModal.titleLabel")}
                    </Text>
                    <TextInput
                      className="h-12 rounded-xl border border-muted/30 bg-secondary px-4 text-base text-text"
                      placeholder={t("team.recognizeModal.titlePlaceholder")}
                      value={titulo}
                      onChangeText={setTitulo}
                      placeholderTextColor="#999"
                      autoCorrect={false}
                    />
                  </View>

                  <View>
                    <Text className="mb-2 font-medium text-sm text-text">
                      {t("team.recognizeModal.descriptionLabel")}
                    </Text>
                    <View className="rounded-xl border border-muted/30 bg-secondary p-4">
                      <TextInput
                        className="min-h-24 text-base text-text"
                        placeholder={t("team.recognizeModal.descriptionPlaceholder")}
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

                <View className="mt-6 flex-row gap-3">
                  <TouchableOpacity
                    className="h-12 flex-1 items-center justify-center rounded-xl border border-muted/30 bg-background"
                    onPress={handleFecharModal}
                    disabled={enviando}
                  >
                    <Text className="font-medium text-base text-muted">
                      {t("team.recognizeModal.cancel")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="h-12 flex-1 items-center justify-center rounded-xl bg-green-500"
                    onPress={handleEnviarReconhecimento}
                    disabled={enviando}
                  >
                    {enviando ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="font-semibold text-base text-white">
                        {t("team.recognizeModal.send")}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de Adicionar Membros */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAddVisible}
        onRequestClose={handleFecharModalAdd}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 items-center justify-center bg-black/80 px-6">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="w-full max-w-md rounded-3xl bg-card p-6">
                <View className="mb-6 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                      <Ionicons name="person-add" size={20} color="#1F89DA" />
                    </View>
                    <Text className="font-bold text-xl text-text">
                      {t("team.addMembersModal.title")}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleFecharModalAdd}
                    className="rounded-full bg-secondary p-2"
                  >
                    <Ionicons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>

                <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
                  {novosMembros.map((membro, index) => (
                    <View key={index} className="mb-4">
                      <View className="mb-2 flex-row items-center justify-between">
                        <Text className="font-semibold text-sm text-text">
                          {t("team.addMembersModal.memberLabel", { number: index + 1 })}
                        </Text>
                        {novosMembros.length > 1 && (
                          <TouchableOpacity
                            onPress={() => handleRemoverCampo(index)}
                            className="rounded-full bg-red-500/20 p-1"
                          >
                            <Ionicons name="trash" size={16} color="#ef4444" />
                          </TouchableOpacity>
                        )}
                      </View>

                      <View className="mb-2">
                        <Text className="mb-1 font-medium text-xs text-muted">
                          {t("team.addMembersModal.emailLabel")}
                        </Text>
                        <View className="flex-row items-center rounded-lg border border-muted/30 bg-secondary px-3">
                          <Ionicons name="mail" size={16} color="#1F89DA" />
                          <TextInput
                            className="flex-1 py-2 pl-2 text-sm text-text"
                            placeholder={t("team.addMembersModal.emailPlaceholder")}
                            value={membro.email}
                            onChangeText={(text) => handleAtualizarMembro(index, "email", text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#999"
                          />
                        </View>
                      </View>

                      <View>
                        <Text className="mb-1 font-medium text-xs text-muted">
                          {t("team.addMembersModal.roleLabel")}
                        </Text>
                        <View className="flex-row items-center rounded-lg border border-muted/30 bg-secondary px-3">
                          <Ionicons name="briefcase" size={16} color="#1F89DA" />
                          <TextInput
                            className="flex-1 py-2 pl-2 text-sm text-text"
                            placeholder={t("team.addMembersModal.rolePlaceholder")}
                            value={membro.cargo}
                            onChangeText={(text) => handleAtualizarMembro(index, "cargo", text)}
                            placeholderTextColor="#999"
                          />
                        </View>
                      </View>
                    </View>
                  ))}

                  <TouchableOpacity
                    className="mb-4 flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 bg-primary/10 py-3"
                    onPress={handleAdicionarCampo}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add-circle" size={20} color="#1F89DA" />
                    <Text className="font-semibold text-sm text-primary">
                      {t("team.addMembersModal.addAnother")}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>

                <View className="mt-4 flex-row gap-3">
                  <TouchableOpacity
                    className="h-12 flex-1 items-center justify-center rounded-xl border border-muted/30 bg-background"
                    onPress={handleFecharModalAdd}
                    disabled={adicionandoMembros}
                  >
                    <Text className="font-medium text-base text-muted">
                      {t("team.addMembersModal.cancel")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="h-12 flex-1 items-center justify-center rounded-xl bg-primary"
                    onPress={handleAdicionarMembros}
                    disabled={adicionandoMembros}
                  >
                    {adicionandoMembros ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="font-semibold text-base text-white">
                        {t("team.addMembersModal.add")}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de Criar Equipe */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCriarEquipeVisible}
        onRequestClose={handleFecharModalCriarEquipe}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 items-center justify-center bg-black/80 px-6">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="w-full max-w-96 rounded-3xl bg-card p-6">
                <View className="mb-6 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                      <Ionicons name="people" size={24} color="#1F89DA" />
                    </View>
                    <Text className="font-bold text-xl text-text">
                      {t("team.createTeamModal.title")}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleFecharModalCriarEquipe}
                    className="rounded-full bg-muted/20 p-2"
                    disabled={criandoEquipe}
                  >
                    <Ionicons name="close" size={24} color="#999" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View className="mb-4">
                    <Text className="mb-2 font-medium text-sm text-text">
                      {t("team.createTeamModal.nameLabel")}
                    </Text>
                    <View className="flex-row items-center rounded-lg border border-muted/30 bg-secondary px-3">
                      <Ionicons name="people" size={16} color="#1F89DA" />
                      <TextInput
                        className="flex-1 py-2 pl-2 text-sm text-text"
                        placeholder={t("team.createTeamModal.namePlaceholder")}
                        value={nomeNovaEquipe}
                        onChangeText={setNomeNovaEquipe}
                        placeholderTextColor="#999"
                        autoCapitalize="words"
                      />
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="mb-2 font-medium text-sm text-text">
                      {t("team.createTeamModal.descriptionLabel")}
                    </Text>
                    <View className="rounded-lg border border-muted/30 bg-secondary px-3 py-2">
                      <TextInput
                        className="text-sm text-text"
                        placeholder={t("team.createTeamModal.descriptionPlaceholder")}
                        value={descricaoNovaEquipe}
                        onChangeText={setDescricaoNovaEquipe}
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                      />
                    </View>
                  </View>

                  <View className="mb-6">
                    <Text className="mb-2 font-medium text-sm text-text">
                      {t("team.createTeamModal.roleLabel")}
                    </Text>
                    <View className="flex-row items-center rounded-lg border border-muted/30 bg-secondary px-3">
                      <Ionicons name="briefcase" size={16} color="#1F89DA" />
                      <TextInput
                        className="flex-1 py-2 pl-2 text-sm text-text"
                        placeholder={t("team.createTeamModal.rolePlaceholder")}
                        value={cargoCriador}
                        onChangeText={setCargoCriador}
                        placeholderTextColor="#999"
                        autoCapitalize="words"
                      />
                    </View>
                  </View>

                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      className="h-12 flex-1 items-center justify-center rounded-xl border border-muted/30 bg-background"
                      onPress={handleFecharModalCriarEquipe}
                      disabled={criandoEquipe}
                    >
                      <Text className="font-medium text-base text-muted">
                        {t("team.createTeamModal.cancel")}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="h-12 flex-1 items-center justify-center rounded-xl bg-primary"
                      onPress={handleCriarEquipe}
                      disabled={criandoEquipe}
                    >
                      {criandoEquipe ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text className="font-semibold text-base text-white">
                          {t("team.createTeamModal.create")}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}
