"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { crearClienteSupabase } from "@/lib/supabase/server";

export async function crearCliente(
    formData: FormData
) {
    const nombre = String(
        formData.get("nombre") ?? ""
    ).trim();

    const telefono = String(
        formData.get("telefono") ?? ""
    ).trim();

    const email = String(
        formData.get("email") ?? ""
    )
        .trim()
        .toLowerCase();

    const emailValido =
        !email ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!nombre || !telefono || !emailValido) {
        redirect(
            `/clientes/agregar-cliente?error=${encodeURIComponent(
                "Revisa los datos ingresados"
            )}`
        );
    }

    const supabase = await crearClienteSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { error } = await supabase
        .from("clientes")
        .insert({
            nombre,
            telefono,
            email: email || null,
        });

    if (error) {
        redirect(
            `/clientes/agregar-cliente?error=${encodeURIComponent(
                "No se pudo registrar el cliente"
            )}`
        );
    }

    revalidatePath("/clientes");

    redirect("/clientes");
}