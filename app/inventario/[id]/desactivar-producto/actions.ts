"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { crearClienteSupabase } from "@/lib/supabase/server";

export async function desactivarProducto(
    formData: FormData
) {
    const productoId = String(
        formData.get("productoId") ?? ""
    );

    if (!productoId) {
        redirect("/inventario");
    }

    const supabase = await crearClienteSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const {
        data: productoActualizado,
        error,
    } = await supabase
        .from("productos")
        .update({
            activo: false,
        })
        .eq("id", productoId)
        .eq("activo", true)
        .select("id")
        .maybeSingle();

    if (error || !productoActualizado) {
        redirect(
            `/inventario/${productoId}/desactivar-producto?error=${encodeURIComponent(
                "No se pudo desactivar el producto"
            )}`
        );
    }

    revalidatePath("/inventario");
    revalidatePath(`/inventario/${productoId}`);

    redirect("/inventario");
}