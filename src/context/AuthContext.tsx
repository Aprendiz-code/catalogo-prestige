import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types/database.types';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  recoverPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER = {
  id: 'local-admin-id',
  email: 'admin@prestigecol.online',
};

const LOCAL_PROFILE: Profile = {
  id: 'local-admin-id',
  full_name: 'Administrador PRESTIGE',
  role: 'admin',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const isLocalSessionActive = localStorage.getItem('prestige_local_auth') === 'true';
      if (isLocalSessionActive) {
        setUser(LOCAL_USER);
        setProfile(LOCAL_PROFILE);
      }
      setIsLoading(false);
      return;
    }

    // Inicializar estado de Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data as Profile);
      } else {
          // Perfil operativo para instalaciones sin registro asociado.
        setProfile({
          id: userId,
          full_name: 'Administrador PRESTIGE',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      if (email.trim() && password.length >= 4) {
        localStorage.setItem('prestige_local_auth', 'true');
        setUser(LOCAL_USER);
        setProfile(LOCAL_PROFILE);
        return { error: null };
      } else {
        return { error: 'Ingresa un correo válido y una contraseña de al menos 4 caracteres.' };
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Error al iniciar sesión' };
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('prestige_local_auth');
      setUser(null);
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const recoverPassword = async (email: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error ? error.message : null };
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, login, logout, recoverPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
