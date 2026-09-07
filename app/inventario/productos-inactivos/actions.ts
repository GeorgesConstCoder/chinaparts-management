"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { crearClienteSupabase } from "@/lib/supabase/server";

export async function reactivarProducto(
    formData: FormData
) {
    const productoId = String(
        formData.get("productoId") ?? ""
    );

    if (!productoId) {
        redirect("/inventario/productos-inactivos");
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
            activo: true,
        })
        .eq("id", productoId)
        .eq("activo", false)
        .select("id")
        .maybeSingle();

    if (error || !productoActualizado) {
        redirect(
            `/inventario/productos-inactivos?error=${encodeURIComponent(
                "No se pudo reactivar el producto"
            )}`
        );
    }

    revalidatePath("/inventario");
    revalidatePath("/inventario/productos-inactivos");
    revalidatePath(`/inventario/${productoId}`);

    redirect("/inventario/productos-inactivos");
}