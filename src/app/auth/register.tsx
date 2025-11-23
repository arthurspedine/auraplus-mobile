import { request } from "@/helper/request";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = t("auth.register.errorNameRequired");
    }

    if (!email.trim()) {
      newErrors.email = t("auth.register.errorEmailRequired");
    } else if (!validateEmail(email)) {
      newErrors.email = t("auth.register.errorEmailInvalid");
    }

    if (!password.trim()) {
      newErrors.password = t("auth.register.errorPasswordRequired");
    } else if (password.length < 6) {
      newErrors.password = t("auth.register.errorPasswordLength");
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t("auth.register.errorConfirmRequired");
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t("auth.register.errorPasswordMismatch");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const registerData = {
      nome: name,
      email,
      senha: password,
    };

    setIsLoading(true);
    try {
      console.log("Registrando");

      await request("/usuario", "post", registerData);
      Alert.alert(t("auth.register.successTitle"), t("auth.register.successMessage"));
      setEmail("");
      setName("");
      setPassword("");
      setConfirmPassword("");
      router.back(); // Voltar para a tela de login após registro bem-sucedido
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || t("auth.register.errorDefault");
      Alert.alert(t("auth.register.errorTitle"), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-20">
        <View className="mb-12 flex-row items-center justify-between">
          <Text className="font-extrabold text-3xl text-text">{t("auth.register.title")}</Text>
          <Image source={require("@/assets/icon.png")} className="h-12 w-12" resizeMode="contain" />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-sm text-text">{t("auth.register.name")}</Text>
          <TextInput
            className="rounded-lg border border-muted/30 bg-card px-4 py-3 text-text"
            placeholder={t("auth.register.namePlaceholder")}
            placeholderTextColor="#999"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            autoCapitalize="words"
          />
          {errors.name && <Text className="mt-1 text-red-500 text-xs">{errors.name}</Text>}
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-sm text-text">{t("auth.register.email")}</Text>
          <TextInput
            className="rounded-lg border border-muted/30 bg-card px-4 py-3 text-text"
            placeholder={t("auth.register.emailPlaceholder")}
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text className="mt-1 text-red-500 text-xs">{errors.email}</Text>}
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-sm text-text">{t("auth.register.password")}</Text>
          <TextInput
            className="rounded-lg border border-muted/30 bg-card px-4 py-3 text-text"
            placeholder={t("auth.register.passwordPlaceholder")}
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.password && <Text className="mt-1 text-red-500 text-xs">{errors.password}</Text>}
        </View>

        <View className="mb-6">
          <Text className="mb-2 font-medium text-sm text-text">
            {t("auth.register.confirmPassword")}
          </Text>
          <TextInput
            className="rounded-lg border border-muted/30 bg-card px-4 py-3 text-text"
            placeholder={t("auth.register.confirmPasswordPlaceholder")}
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
            }}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.confirmPassword && (
            <Text className="mt-1 text-red-500 text-xs">{errors.confirmPassword}</Text>
          )}
        </View>

        <TouchableOpacity
          className="mb-4 rounded-lg bg-primary py-4"
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text className="text-center font-semibold text-base text-white">
            {t("auth.register.registerButton")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-2" onPress={() => router.back()} disabled={isLoading}>
          <Text className="text-center text-muted">
            {t("auth.register.haveAccount")}{" "}
            <Text className="font-semibold text-primary">{t("auth.register.login")}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
