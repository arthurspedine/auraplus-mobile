import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = t("auth.login.errorEmailRequired");
    } else if (!validateEmail(email)) {
      newErrors.email = t("auth.login.errorEmailInvalid");
    }

    if (!password.trim()) {
      newErrors.password = t("auth.login.errorPasswordRequired");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      setEmail("");
      setPassword("");
      router.push("/home");
    } else {
      Alert.alert(t("auth.login.errorTitle"), result.error || t("auth.login.errorDefault"));
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-20">
        <View className="mb-12 flex-row items-center justify-between">
          <Text className="font-extrabold text-3xl text-text">{t("auth.login.title")}</Text>
          <Image source={require("@/assets/icon.png")} className="h-12 w-12" resizeMode="contain" />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-sm text-text">{t("auth.login.email")}</Text>
          <TextInput
            className="rounded-lg border border-muted/30 bg-card px-4 py-3 text-text"
            placeholder={t("auth.login.emailPlaceholder")}
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

        <View className="mb-6">
          <Text className="mb-2 font-medium text-sm text-text">{t("auth.login.password")}</Text>
          <TextInput
            className="rounded-lg border border-muted/30 bg-card px-4 py-3 text-text"
            placeholder={t("auth.login.passwordPlaceholder")}
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

        <TouchableOpacity
          className="mb-4 rounded-lg bg-primary py-4"
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-center font-semibold text-base text-white">
            {t("auth.login.loginButton")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-2"
          onPress={() => router.push("/auth/register")}
          disabled={isLoading}
        >
          <Text className="text-center text-muted">
            {t("auth.login.noAccount")}{" "}
            <Text className="font-semibold text-primary">{t("auth.login.createAccount")}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
