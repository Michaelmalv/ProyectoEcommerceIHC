import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, signIn, signOut, signUp, getSession } from "../../utils/api";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; phone?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    getSession().then((session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const data = await signIn(email, password);
    setSession(data.session);
    setUser(data.user);
  };

  const logout = async () => {
    await signOut();
    setSession(null);
    setUser(null);
  };

  const register = async (data: { email: string; password: string; fullName: string; phone?: string }) => {
    await signUp(data);
    // Después del registro, hacer login automático
    const loginData = await signIn(data.email, data.password);
    setSession(loginData.session);
    setUser(loginData.user);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
