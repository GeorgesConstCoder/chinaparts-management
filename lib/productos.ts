import { crearClienteSupabase } from "@/lib/supabase/server";
import type { Producto } from "@/types/producto";

type ProductoBaseDatos = {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    marca: string;
    tipo: Producto["tipo"];
};

export async function obtenerProductos(): Promise<Producto[]> {
    const supabase = await crearClienteSupabase();

    const { data, error } = await supabase
        .from("productos")
        .select("id, codigo, nombre, descripcion, marca, tipo")
        .order("nombre");

    if (error) {
        throw new Error(`No se pudieron obtener los productos: ${error.message}`);
    }

    return (data as ProductoBaseDatos[]) ?? [];
}

export async function obtenerProductoPorId(
    id: string
): Promise<Producto | undefined> {
    const supabase = await crearClienteSupabase();

    const { data, error } = await supabase
        .from("productos")
        .select("id, codigo, nombre, descripcion, marca, tipo")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw new Error(`No se pudo obtener el producto: ${error.message}`);
    }

    return (data as ProductoBaseDatos | null) ?? undefined;
}