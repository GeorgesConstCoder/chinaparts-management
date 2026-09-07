"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { crearClienteSupabase } from "@/lib/supabase/server";

export async function editarProducto(formData: FormData) {
    const productoId = String(
        formData.get("productoId") ?? ""
    );

    const codigo = String(
        formData.get("codigo") ?? ""
    ).trim();

    const nombre = String(
        formData.get("nombre") ?? ""
    ).trim();

    const marca = String(
        formData.get("marca") ?? ""
    ).trim();

    const tipo = String(
        formData.get("tipo") ?? ""
    );

    const descripcion = String(
        formData.get("descripcion") ?? ""
    ).trim();

    const existencia = Number(
        formData.get("existencia")
    );

    const rutaEdicion =
        `/inventario/${productoId}/editar`;

    if (
        !productoId ||
        !codigo ||
        !nombre ||
        !marca ||
        !["maquinaria", "repuesto"].includes(tipo) ||
        !Number.isInteger(existencia) ||
        existencia < 0
    ) {
        redirect(
            `${rutaEdicion}?error=${encodeURIComponent(
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

    // Obtenemos las unidades reservadas actuales.
    const {
        data: inventarioActual,
        error: errorConsultaInventario,
    } = await supabase
        .from("inventario")
        .select("cantidad_reservada")
        .eq("producto_id", productoId)
        .maybeSingle();

    if (errorConsultaInventario || !inventarioActual) {
        redirect(
            `${rutaEdicion}?error=${encodeURIComponent(
                "No se encontró el inventario del producto"
            )}`
        );
    }

    // La existencia nunca puede ser menor que lo reservado.
    if (
        existencia <
        inventarioActual.cantidad_reservada
    ) {
        redirect(
            `${rutaEdicion}?error=${encodeURIComponent(
                `La existencia no puede ser menor que las ${inventarioActual.cantidad_reservada} unidades reservadas`
            )}`
        );
    }

    const { error: errorProducto } = await supabase
        .from("productos")
        .update({
            codigo,
            nombre,
            marca,
            tipo,
            descripcion,
        })
        .eq("id", productoId);

    if (errorProducto) {
        const mensaje =
            errorProducto.code === "23505"
                ? "Ya existe otro producto con ese código"
                : "No se pudo actualizar el producto";

        redirect(
            `${rutaEdicion}?error=${encodeURIComponent(
                mensaje
            )}`
        );
    }

    const { error: errorInventario } = await supabase
        .from("inventario")
        .update({
            existencia,
        })
        .eq("producto_id", productoId);

    if (errorInventario) {
        redirect(
            `${rutaEdicion}?error=${encodeURIComponent(
                "El producto se actualizó, pero no se pudo actualizar su existencia"
            )}`
        );
    }

    revalidatePath("/inventario");
    revalidatePath(`/inventario/${productoId}`);

    redirect(`/inventario/${productoId}`);
}