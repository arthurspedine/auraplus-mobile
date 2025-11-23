import { Ionicons } from "@expo/vector-icons";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/components/language-toggle";
import { Alert, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

type RootDrawerParamList = {
  Home: undefined;
};

export function Header() {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleLogout = async () => {
    Alert.alert(t("navigation.logoutConfirmTitle"), t("navigation.logoutConfirmMessage"), [
      { text: t("navigation.cancel"), style: "cancel" },
      {
        text: t("navigation.logout"),
        style: "destructive",
        onPress: async () => {
          setSheetVisible(false);
          router.replace("/logout");
        },
      },
    ]);
  };

  const handleConta = () => {
    setSheetVisible(false);
    router.push("/account");
  };

  return (
    <>
      <View className="h-28 flex-row items-center justify-between bg-background px-4 py-3 pt-14 shadow-sm">
        {/* Botão para abrir o Drawer */}
        <View>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color={"#fff"} />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-4">
          <LanguageToggle />
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-blue-100"
            onPress={() => setSheetVisible(true)}
          >
            <Ionicons name="person" size={24} color="#1F89DA" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setSheetVisible(false)}>
          <View className="absolute right-0 bottom-0 left-0 items-center rounded-t-2xl bg-card p-2 pb-12">
            <Pressable
              className="mb-4 w-full flex-row items-center justify-center border-gray-400 border-b py-6"
              onPress={handleConta}
            >
              <Ionicons
                name="person-circle-outline"
                size={22}
                color="#1F89DA"
                style={{ marginRight: 8 }}
              />
              <Text className="font-semibold text-lg text-primary">{t("navigation.account")}</Text>
            </Pressable>
            <Pressable
              className="w-full flex-row items-center justify-center py-4"
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color="#dc2626"
                style={{ marginRight: 8 }}
              />
              <Text className="font-semibold text-lg text-red-600">{t("navigation.logout")}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
