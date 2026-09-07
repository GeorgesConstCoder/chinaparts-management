"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { crearClienteSupabase } from "@/lib/supabase/server";
import { crearPedidoConReserva } from "@/lib/pedidos";
import type { NuevoDetallePedido } from "@/types/pedido";

export async function crearPedido(
    formData: FormData
) {
    const clienteId = String(
        formData.get("clienteId") ?? ""
    );

    const fechaRecogidaPrevista = String(
        formData.get("fechaRecogidaPrevista") ?? ""
    );

    const observaciones = String(
        formData.get("observaciones") ?? ""
    ).trim();

    const detallesTexto = String(
        formData.get("detalles") ?? "[]"
    );

    let detalles: NuevoDetallePedido[] = [];

    try {
        detalles = JSON.parse(
            detallesTexto
        ) as NuevoDetallePedido[];
    } catch {
        redirect(
            `/pedidos/crear-pedido?error=${encodeURIComponent(
                "Los productos del pedido no son válidos"
            )}`
        );
    }

    const detallesValidos =
        Array.isArray(detalles) &&
        detalles.length > 0 &&
        detalles.every(
            (detalle) =>
                typeof detalle.productoId === "string" &&
                detalle.productoId.length > 0 &&
                Number.isInteger(detalle.cantidad) &&
                detalle.cantidad > 0
        );

    if (
        !clienteId ||
        !fechaRecogidaPrevista ||
        !detallesValidos
    ) {
        redirect(
            `/pedidos/crear-pedido?error=${encodeURIComponent(
                "Selecciona un cliente, una fecha y al menos un producto"
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

    let pedidoId: string;

    try {
        pedidoId = await crearPedidoConReserva({
            clienteId,
            fechaRecogidaPrevista,
            observaciones,
            detalles,
        });
    } catch (error: unknown) {
        const mensaje =
            error instanceof Error
                ? error.message
                : "No se pudo crear el pedido";

        redirect(
            `/pedidos/crear-pedido?error=${encodeURIComponent(
                mensaje
            )}`
        );
    }

    revalidatePath("/pedidos");
    revalidatePath("/inventario");

    redirect(`/pedidos/${pedidoId}`);
}