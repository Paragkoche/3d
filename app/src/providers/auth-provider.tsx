"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

type Admin = {
  username: string;
};

type AuthContextType = {
  admin: Admin | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  createUser: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  admin: null,
  login: async () => {},
  logout: () => {},
  createUser: async () => {},
  isLoading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setAdmin({ username });
    }
    setIsLoading(false);
  }, []);

  // Automatically attach token to every request
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });
      const token = response.data.access_token;
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
      setAdmin({ username });
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const createUser = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/create_admin`,
        { username, password } // ✅ Send as JSON body
      );
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      setAdmin({ username });
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAdmin(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ admin, login, logout, createUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
