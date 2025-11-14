import { router } from "expo-router"
import { useState } from "react"
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleRegister = () => {
    const newErrors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido"
    }

    if (!password.trim()) {
      newErrors.password = "Senha é obrigatória"
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    // TODO: Implementar chamada à API
    const registerData = {
      name,
      email,
      password,
    }

    console.log("Register data:", registerData)
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-20">
        <View className="mb-12 flex-row items-center justify-between">
          <Text className="font-extrabold text-3xl text-text">Criar Conta</Text>
          <Image
            source={require("../../assets/icon.png")}
            className="h-12 w-12"
            resizeMode="contain"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-sm text-text">Nome</Text>
          <TextInput
            className="rounded-lg border border-muted/30 bg-card px-4 py-3 text-text"
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
            value={name}
            onChangeText={text => {
              setName(text)
              if (errors.name) setErrors({ ...errors, name: undefined })
            }}
            autoCapitalize="words"
          />
          {errors.name && (
            <Text className="mt-1 text-red-500 text-xs">{errors.name}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-sm text-text">Email</Text>
          <TextInput
            className="rounded-lg border border-muted/30 bg-card px-4 py-3 text-text"
            placeholder="Digite seu email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={text => {
              setEmail(text)
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && (
            <Text className="mt-1 text-red-500 text-xs">{errors.email}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-sm text-text">Senha</Text>
          <TextInput
            className="rounded-lg border border-muted/30 bg-card px-4 py-3 text-text"
            placeholder="Digite sua senha"
            placeholderTextColor="#999"
            value={password}
            onChangeText={text => {
              setPassword(text)
              if (errors.password) setErrors({ ...errors, password: undefined })
            }}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.password && (
            <Text className="mt-1 text-red-500 text-xs">{errors.password}</Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="mb-2 font-medium text-sm text-text">
            Confirmar Senha
          </Text>
          <TextInput
            className="rounded-lg border border-muted/30 bg-card px-4 py-3 text-text"
            placeholder="Confirme sua senha"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text)
              if (errors.confirmPassword)
                setErrors({ ...errors, confirmPassword: undefined })
            }}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.confirmPassword && (
            <Text className="mt-1 text-red-500 text-xs">
              {errors.confirmPassword}
            </Text>
          )}
        </View>

        <TouchableOpacity
          className="mb-4 rounded-lg bg-primary py-4"
          onPress={handleRegister}
        >
          <Text className="text-center font-semibold text-base text-white">
            Registrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-2" onPress={() => router.back()}>
          <Text className="text-center text-muted">
            Já tem uma conta?{" "}
            <Text className="font-semibold text-primary">Fazer login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
