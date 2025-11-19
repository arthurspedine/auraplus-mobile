import { useAuth } from "@/context/auth-context";
import { request } from "@/helper/request";
import type { Usuario } from "@/interfaces/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilScreen() {
  const { token } = useAuth();
  const [usuario, setUsuario] = useState<Usuario>();
  const [erro, setErro] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getRoleName = (role: string) => {
    const roles: { [key: string]: string } = {
      NOVO_USUARIO: "Novo Usuário",
      ADMIN: "Administrador",
      COLABORADOR: "Colaborador",
      GESTOR: "Gestor",
    };
    return roles[role] || role;
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await request("/usuario/me", "get", null, {
          authToken: token,
        });

        setUsuario(response as Usuario);
      } catch (error) {
        setErro("Erro ao carregar dados do usuário");
      }
    };
    fetchData();
  }, [token]);

  const handleChangePassword = () => {
    setModalVisible(true);
  };

  const submitPasswordChange = async () => {
    if (!usuario || !token) return;
    if (!newPassword.trim()) {
      Alert.alert("Erro", "A senha não pode estar vazia");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUsuario = {
        nome: usuario.nome,
        email: usuario.email,
        senha: newPassword,
      };
      await request("/usuario/me", "put", updatedUsuario, {
        authToken: token,
      });
      Alert.alert("Sucesso", "Senha alterada com sucesso");
      setModalVisible(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Erro ao alterar senha");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      {/* Header */}
      <View className="mb-8 flex-row items-center justify-between pt-4">
        <View className="flex-1">
          <Text className="font-extrabold text-3xl text-text">Perfil</Text>
          <Text className="mt-1 text-sm text-muted">{usuario?.nome || "Carregando..."}</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} className="rounded-full bg-card p-3">
          <Ionicons name="arrow-back" size={24} color="#1F89DA" />
        </TouchableOpacity>
      </View>

      {usuario && !erro ? (
        <View className="gap-5">
          {/* Card Principal do Usuário */}
          <View className="overflow-hidden rounded-2xl bg-gradient-to-br">
            <View className="bg-primary/20 p-6">
              <View className="mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
                    <Text className="font-bold text-2xl text-white">
                      {usuario.nome.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-bold text-xl text-text">{usuario.nome}</Text>
                    <Text className="mt-1 text-sm text-primary">{getRoleName(usuario.role)}</Text>
                  </View>
                </View>
              </View>

              <View className="gap-3">
                <View className="flex-row items-center gap-3 rounded-lg bg-card/50 p-3">
                  <Ionicons name="mail-outline" size={18} color="#1F89DA" />
                  <Text className="flex-1 text-sm text-text">{usuario.email}</Text>
                </View>

                <View className="flex-row items-center gap-3 rounded-lg bg-card/50 p-3">
                  <Ionicons name="briefcase-outline" size={18} color="#1F89DA" />
                  <Text className="flex-1 text-sm text-text">
                    {usuario.cargo || "Sem cargo cadastrado"}
                  </Text>
                </View>

                <View className="flex-row items-center gap-3 rounded-lg bg-card/50 p-3">
                  <Ionicons name="people-outline" size={18} color="#1F89DA" />
                  <Text className="flex-1 text-sm text-text">
                    {usuario.equipeNome || "Sem equipe atribuída"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Ações Rápidas */}
          <View className="rounded-2xl bg-card p-5">
            <Text className="mb-4 font-bold text-base text-text">Configurações</Text>

            <TouchableOpacity
              className="flex-row items-center justify-between rounded-lg border border-muted/20 bg-secondary p-4"
              onPress={handleChangePassword}
            >
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Ionicons name="key-outline" size={20} color="#1F89DA" />
                </View>
                <View>
                  <Text className="font-medium text-text">Alterar Senha</Text>
                  <Text className="text-muted text-xs">Atualize sua senha de acesso</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#1F89DA" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1F89DA" />
          <Text className="mt-4 text-muted">Carregando perfil...</Text>
        </View>
      )}
      {erro && (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text className="mt-4 text-center text-base text-red-500">{erro}</Text>
        </View>
      )}

      {/* Modal para alterar senha */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 items-center justify-center bg-black/80 px-6">
          <View className="w-full max-w-96 rounded-2xl bg-card p-6">
            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Ionicons name="key" size={20} color="#1F89DA" />
                </View>
                <Text className="font-bold text-xl text-text">Alterar Senha</Text>
              </View>
              <TouchableOpacity onPress={closeModal} className="rounded-full bg-secondary p-2">
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <View>
                <Text className="mb-2 font-medium text-sm text-text">Nova Senha</Text>
                <View className="flex-row items-center rounded-lg border border-muted/30 bg-secondary px-4">
                  <Ionicons name="lock-closed" size={18} color="#1F89DA" />
                  <TextInput
                    className="flex-1 py-3 pl-3 text-base text-text"
                    placeholder="Digite a nova senha"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View>
                <Text className="mb-2 font-medium text-sm text-text">Confirmar Senha</Text>
                <View className="flex-row items-center rounded-lg border border-muted/30 bg-secondary px-4">
                  <Ionicons name="lock-closed" size={18} color="#1F89DA" />
                  <TextInput
                    className="flex-1 py-3 pl-3 text-base text-text"
                    placeholder="Confirme a nova senha"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View className="mt-4 flex-row gap-3">
                <TouchableOpacity
                  className="h-12 flex-1 items-center justify-center rounded-lg border border-muted/30 bg-background"
                  onPress={closeModal}
                >
                  <Text className="font-medium text-base text-muted">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="h-12 flex-1 items-center justify-center rounded-lg bg-primary"
                  onPress={submitPasswordChange}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-semibold text-base text-white">Confirmar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
