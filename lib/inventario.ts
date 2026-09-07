import { crearClienteSupabase } from "@/lib/supabase/server";
import type { Inventario } from "@/types/inventario";

type InventarioBaseDatos = {
    id: string;
    producto_id: string;
    existencia: number;
    cantidad_reservada: number;
};

function convertirInventario(
    registro: InventarioBaseDatos
): Inventario {
    return {
        id: registro.id,
        productoId: registro.producto_id,
        existencia: registro.existencia,
        cantidadReservada: registro.cantidad_reservada,
    };
}

export async function obtenerInventario(): Promise<Inventario[]> {
    const supabase = await crearClienteSupabase();

    const { data, error } = await supabase
        .from("inventario")
        .select(
            "id, producto_id, existencia, cantidad_reservada"
        );

    if (error) {
        throw new Error(
            `No se pudo obtener el inventario: ${error.message}`
        );
    }

    const registros = (data as InventarioBaseDatos[]) ?? [];

    return registros.map(convertirInventario);
}

export async function obtenerInventarioPorProductoId(
    productoId: string
): Promise<Inventario | undefined> {
    const supabase = await crearClienteSupabase();

    const { data, error } = await supabase
        .from("inventario")
        .select(
            "id, producto_id, existencia, cantidad_reservada"
        )
        .eq("producto_id", productoId)
        .maybeSingle();

    if (error) {
        throw new Error(
            `No se pudo obtener el inventario del producto: ${error.message}`
        );
    }

    if (!data) {
        return undefined;
    }

    return convertirInventario(
        data as InventarioBaseDatos
    );
}