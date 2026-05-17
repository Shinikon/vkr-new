import { supabase } from "./supabaseClient";

export const getRequests = async () => {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};


export const addRequest = async (request) => {
  const { data, error } = await supabase
    .from("requests")
    .insert([request])
    .select();

  if (error) throw error;
  return data[0];
};


export const updateRequestStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("requests")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};
