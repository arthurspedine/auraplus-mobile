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
  refreshUsuario: () => Promise<void>;
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

        // Buscar dados atualizados do usuário via API
        try {
          const usuarioAtualizado: any = await request("/usuario/me", "get", null, {
            authToken: storedToken,
          });

          if (usuarioAtualizado) {
            // Mapear para JwtPayload
            const usuarioMapeado: JwtPayload = {
              sub: usuarioAtualizado.id?.toString() || "",
              nome: usuarioAtualizado.nome || "",
              role: usuarioAtualizado.role || 0,
              email: usuarioAtualizado.email || "",
              equipeId: usuarioAtualizado.equipeId,
              exp: 0, // Não usado quando vem da API
            };
            setUsuario(usuarioMapeado);
          } else {
            // Fallback para JWT decodificado
            const decodedToken = jwtDecode<JwtPayload>(storedToken);
            setUsuario(decodedToken);
          }
        } catch (apiError) {
          console.error("Error fetching user data, using JWT:", apiError);
          const decodedToken = jwtDecode<JwtPayload>(storedToken);
          setUsuario(decodedToken);
        }
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

  const refreshUsuario = async () => {
    if (!token) return;

    try {
      const usuarioAtualizado: any = await request("/usuario/me", "get", null, {
        authToken: token,
      });

      if (usuarioAtualizado) {
        const usuarioMapeado: JwtPayload = {
          sub: usuarioAtualizado.id?.toString() || "",
          nome: usuarioAtualizado.nome || "",
          role: usuarioAtualizado.role || 0,
          email: usuarioAtualizado.email || "",
          equipeId: usuarioAtualizado.equipeId,
          exp: 0,
        };
        setUsuario(usuarioMapeado);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
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
    <AuthContext.Provider value={{ token, usuario, login, logout, refreshUsuario, isLoading }}>
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
