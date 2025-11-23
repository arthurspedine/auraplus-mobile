import { useAuth } from "@/context/auth-context";
import { request } from "@/helper/request";
import type { Usuario } from "@/interfaces/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilScreen() {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [usuario, setUsuario] = useState<Usuario>();
  const [erro, setErro] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getRoleName = (role: string) => {
    return t(`account.roles.${role}`, { defaultValue: role });
  };

  const fetchData = async () => {
    if (!token) return;

    try {
      const response = await request("/usuario/me", "get", null, {
        authToken: token,
      });

      setUsuario(response as Usuario);
      setErro("");
    } catch (error) {
      setErro(t("account.errorLoading"));
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleChangePassword = () => {
    setModalVisible(true);
  };

  const submitPasswordChange = async () => {
    if (!usuario || !token) return;
    if (!newPassword.trim()) {
      Alert.alert(t("account.passwordModal.errorTitle"), t("account.passwordModal.errorEmpty"));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t("account.passwordModal.errorTitle"), t("account.passwordModal.errorMismatch"));
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(t("account.passwordModal.errorTitle"), t("account.passwordModal.errorLength"));
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
      Alert.alert(
        t("account.passwordModal.successTitle"),
        t("account.passwordModal.successMessage")
      );
      setModalVisible(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert(t("account.passwordModal.errorMessage"));
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
        {/* Header */}
        <View className="mb-8 flex-row items-center justify-between pt-4">
          <View className="flex-1">
            <Text className="font-extrabold text-3xl text-text">{t("account.title")}</Text>
            <Text className="mt-1 text-sm text-muted">{usuario?.nome || t("account.loading")}</Text>
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
                      {usuario.cargo || t("account.noCargo")}
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="flex-row items-center gap-3 rounded-lg bg-card/50 p-3"
                    onPress={() => router.push("/(drawer)/equipe")}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="people-outline" size={18} color="#1F89DA" />
                    <Text className="flex-1 text-sm text-text">
                      {usuario.equipeNome || t("account.noTeam")}
                    </Text>
                    {usuario.equipeNome && (
                      <Ionicons name="chevron-forward" size={16} color="#1F89DA" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Ações Rápidas */}
            <View className="rounded-2xl bg-card p-5">
              <Text className="mb-4 font-bold text-base text-text">{t("account.settings")}</Text>

              <TouchableOpacity
                className="flex-row items-center justify-between rounded-lg border border-muted/20 bg-secondary p-4"
                onPress={handleChangePassword}
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                    <Ionicons name="key-outline" size={20} color="#1F89DA" />
                  </View>
                  <View>
                    <Text className="font-medium text-text">{t("account.changePassword")}</Text>
                    <Text className="text-muted text-xs">{t("account.changePasswordDesc")}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#1F89DA" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#1F89DA" />
            <Text className="mt-4 text-muted">{t("account.loading")}</Text>
          </View>
        )}
        {erro && (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <Text className="mt-4 text-center text-base text-red-500">{erro}</Text>
          </View>
        )}
      </ScrollView>

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
                <Text className="font-bold text-xl text-text">
                  {t("account.passwordModal.title")}
                </Text>
              </View>
              <TouchableOpacity onPress={closeModal} className="rounded-full bg-secondary p-2">
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <View>
                <Text className="mb-2 font-medium text-sm text-text">
                  {t("account.passwordModal.newPassword")}
                </Text>
                <View className="flex-row items-center rounded-lg border border-muted/30 bg-secondary px-4">
                  <Ionicons name="lock-closed" size={18} color="#1F89DA" />
                  <TextInput
                    className="flex-1 py-3 pl-3 text-base text-text"
                    placeholder={t("account.passwordModal.newPasswordPlaceholder")}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View>
                <Text className="mb-2 font-medium text-sm text-text">
                  {t("account.passwordModal.confirmPassword")}
                </Text>
                <View className="flex-row items-center rounded-lg border border-muted/30 bg-secondary px-4">
                  <Ionicons name="lock-closed" size={18} color="#1F89DA" />
                  <TextInput
                    className="flex-1 py-3 pl-3 text-base text-text"
                    placeholder={t("account.passwordModal.confirmPasswordPlaceholder")}
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
                  <Text className="font-medium text-base text-muted">
                    {t("account.passwordModal.cancel")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="h-12 flex-1 items-center justify-center rounded-lg bg-primary"
                  onPress={submitPasswordChange}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-semibold text-base text-white">
                      {t("account.passwordModal.save")}
                    </Text>
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
