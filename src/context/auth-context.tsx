import { request } from "@/helper/request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface JwtPayload {
  sub: string;
  nome: string;
  role: number;
  email: string;
  equipeId?: number;
  exp: number;
}

interface AuthContextType {
  token: string | null;
  usuario: JwtPayload | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("jwt_token");

      if (storedToken && isValidJwt(storedToken)) {
        setToken(storedToken);
        const decodedToken = jwtDecode<JwtPayload>(storedToken);
        setUsuario(decodedToken);
        console.log(decodedToken);
      } else {
        setToken(null);
        setUsuario(null);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      setToken(null);
      setUsuario(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await request<{ token: string } | null>("/login", "post", {
        username: email,
        password,
      });
      if (!response) {
        return { success: false, error: "Erro ao conectar com o servidor" };
      }

      const receivedToken = response.token;
      console.log("Received token:", receivedToken);

      if (receivedToken && isValidJwt(receivedToken)) {
        await AsyncStorage.setItem("jwt_token", receivedToken);
        setToken(receivedToken);
        const decodedToken = jwtDecode<JwtPayload>(receivedToken);
        setUsuario(decodedToken);
        console.log(decodedToken);
        return { success: true };
      }
      return { success: false, error: "Token inválido recebido" };
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Email ou senha incorretos";
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("jwt_token");
      setToken(null);
      setUsuario(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

function isValidJwt(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
