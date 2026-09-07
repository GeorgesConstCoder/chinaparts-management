import { crearClienteSupabase } from "@/lib/supabase/server";
import type { Inventario } from "@/types/inventario";

type InventarioBaseDatos = {
    id: string;
    producto_id: string;
    existencia: number;
    cantidad_reservada: number;
};

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

    return registros.map((registro) => ({
        id: registro.id,
        productoId: registro.producto_id,
        existencia: registro.existencia,
        cantidadReservada: registro.cantidad_reservada,
    }));
}