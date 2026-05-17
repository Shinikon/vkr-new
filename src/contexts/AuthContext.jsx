import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data } = await supabase
            .from("users")
            .select("role")
            .eq("email", user.email)
            .maybeSingle();
          setUserRole(data?.role || "employee");
        }
      } catch (error) {
        console.error("Ошибка:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("email", session.user.email)
          .maybeSingle();
        setUserRole(data?.role || "employee");
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        canAccessApprovals: userRole === "manager" || userRole === "admin",
        canAccessAdmin: userRole === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
