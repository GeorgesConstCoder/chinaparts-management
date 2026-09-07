"use server";

import { redirect } from "next/navigation";
import { crearClienteSupabase } from "@/lib/supabase/server";

export async function iniciarSesion(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
        redirect("/login?error=Completa todos los campos");
    }

    const supabase = await crearClienteSupabase();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        redirect("/login?error=Correo o contraseña incorrectos");
    }

    redirect("/inventario");
}

export async function cerrarSesion() {
    const supabase = await crearClienteSupabase();
    await supabase.auth.signOut();
    redirect("/login");
}