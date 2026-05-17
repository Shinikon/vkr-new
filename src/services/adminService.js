import { supabase } from "./supabaseClient";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.REACT_APP_SUPABASE_SERVICE_KEY;


export const createUserByAdmin = async (email, password, fullName, role) => {
  try {

    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || "Ошибка создания пользователя");
    }

    const userData = await response.json();


    const { error: roleError } = await supabase.from("users").insert([
      {
        id: userData.id,
        email: email,
        full_name: fullName,
        role: role,
      },
    ]);

    if (roleError) throw roleError;

    return userData;
  } catch (error) {
    console.error("Ошибка:", error);
    throw error;
  }
};
