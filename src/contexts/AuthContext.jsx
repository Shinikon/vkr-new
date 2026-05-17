import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("admin");
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);

    // Получаем роль из таблицы users
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("email", email)
      .maybeSingle();
    setUserRole(userData?.role || "employee");

    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole("employee");
  };

  const value = {
    user,
    userRole,
    loading: false,
    login,
    logout,
    isAuthenticated: !!user,
    canAccessApprovals: userRole === "manager" || userRole === "admin",
    canAccessAdmin: userRole === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
