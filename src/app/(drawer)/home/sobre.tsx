import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function SobreScreen() {
  const { t } = useTranslation();
  const [commitHash, setCommitHash] = useState<string>("dev-mode");

  // Carregar o hash do commit
  useEffect(() => {
    const loadCommitHash = async () => {
      try {
        // Tentar carregar o asset
        const asset = Asset.fromModule(require("../../../../commit-hash.txt"));
        await asset.downloadAsync();

        // Ler o conteúdo do arquivo
        const response = await fetch(asset.localUri || asset.uri);
        const text = await response.text();

        if (text && text.trim()) {
          // Mostrar o hash completo
          setCommitHash(text.trim());
        }
      } catch (error) {
        // Se o arquivo não existir ou houver erro, mantém "dev-mode"
        console.log("Commit hash não encontrado, usando dev-mode");
      }
    };

    loadCommitHash();
  }, []);

  const appInfo = [
    {
      icon: "cube-outline" as const,
      label: t("about.version"),
      value: "1.0.0",
    },
    {
      icon: "git-commit-outline" as const,
      label: t("about.commitHash"),
      value: commitHash,
    },
    {
      icon: "calendar-outline" as const,
      label: t("about.releaseYear"),
      value: "2025",
    },
    {
      icon: "code-slash-outline" as const,
      label: t("about.platform"),
      value: "React Native + Expo",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-8">
        {/* Header */}
        <View className="mb-8 items-center gap-3 pt-4">
          <View className="mb-2 size-24 items-center justify-center rounded-3xl bg-primary/10">
            <Ionicons name="information-circle" size={56} color="#1F89DA" />
          </View>
          <Text className="font-bold text-3xl text-primary">{t("about.appName")}</Text>
          <Text className="mt-2 text-center text-lg text-muted">{t("about.tagline")}</Text>
        </View>

        {/* Card de Informações sobre o Aura+ */}
        <View className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br">
          <View className="bg-primary/10 p-6">
            <View className="mb-3 flex-row items-center gap-2">
              <Ionicons name="heart" size={24} color="#1F89DA" />
              <Text className="font-bold text-lg text-text">{t("about.aboutTitle")}</Text>
            </View>
            <Text className="leading-6 text-sm text-muted">{t("about.aboutText")}</Text>
          </View>
        </View>

        {/* App Info Section */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center">
            <Ionicons name="information-circle-outline" size={24} color="#1F89DA" />
            <Text className="ml-2 font-semibold text-xl text-text">{t("about.appInfo")}</Text>
          </View>
          <View className="gap-3">
            {appInfo.map((info, index) => (
              <View
                key={index}
                className="rounded-xl bg-card p-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="mb-2 flex-row items-center">
                  <View className="mr-3 size-10 items-center justify-center rounded-full bg-primary/10">
                    <Ionicons name={info.icon} size={20} color="#1F89DA" />
                  </View>
                  <Text className="font-medium text-muted text-sm">{info.label}</Text>
                </View>
                <Text className="font-mono font-semibold text-text pl-2" selectable>
                  {info.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View className="mb-8 items-center py-4">
          <Text className="text-center text-muted text-xs">{t("about.copyright")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
