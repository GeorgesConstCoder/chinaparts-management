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

    const rutaDesactivacion =
        `/inventario/${productoId}/desactivar-producto`;

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

    // Consultamos el inventario antes de desactivar.
    const {
        data: inventario,
        error: errorInventario,
    } = await supabase
        .from("inventario")
        .select("cantidad_reservada")
        .eq("producto_id", productoId)
        .maybeSingle();

    if (errorInventario || !inventario) {
        redirect(
            `${rutaDesactivacion}?error=${encodeURIComponent(
                "No se pudo consultar el inventario del producto"
            )}`
        );
    }

    // Bloqueamos la desactivación si existen reservas.
    if (inventario.cantidad_reservada > 0) {
        redirect(
            `${rutaDesactivacion}?error=${encodeURIComponent(
                `No puedes desactivar este producto porque tiene ${inventario.cantidad_reservada} unidades reservadas`
            )}`
        );
    }

    const {
        data: productoActualizado,
        error: errorProducto,
    } = await supabase
        .from("productos")
        .update({
            activo: false,
        })
        .eq("id", productoId)
        .eq("activo", true)
        .select("id")
        .maybeSingle();

    if (errorProducto || !productoActualizado) {
        redirect(
            `${rutaDesactivacion}?error=${encodeURIComponent(
                "No se pudo desactivar el producto"
            )}`
        );
    }

    revalidatePath("/inventario");
    revalidatePath(`/inventario/${productoId}`);
    revalidatePath(
        "/inventario/productos-inactivos"
    );

    redirect("/inventario");
}