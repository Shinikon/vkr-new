import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("employee");
  const [loading, setLoading] = useState(false); // <-- сразу false

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
      } catch (err) {
        console.error("Ошибка:", err);
      }
      // setLoading(false) - не нужно
    };

    getUser();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("email", email)
      .maybeSingle();
    setUserRole(userData?.role || "employee");

    return data;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Ошибка выхода:", err);
    } finally {
      setUser(null);
      setUserRole("employee");
      localStorage.removeItem("supabase.auth.token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading: false, // <-- принудительно false
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
