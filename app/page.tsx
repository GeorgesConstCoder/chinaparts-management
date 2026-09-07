import { redirect } from "next/navigation";
import { crearClienteSupabase } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await crearClienteSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  redirect("/inventario");
}