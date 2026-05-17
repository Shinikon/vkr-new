import { supabase } from "./services/supabaseClient";

const testConnection = async () => {
  console.log("Проверка подключения к Supabase...");


  const { data, error } = await supabase.from("requests").select("*");

  if (error) {
    console.error(" Ошибка подключения:", error.message);
  } else {
    console.log("Подключение успешно!");
    console.log(" Найдено заявок:", data.length);
    console.log("Данные:", data);
  }
};

testConnection();
