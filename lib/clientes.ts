import { crearClienteSupabase } from "@/lib/supabase/server";
import type { Cliente } from "@/types/cliente";

type ClienteBaseDatos = {
    id: string;
    nombre: string;
    telefono: string;
    email: string | null;
    activo: boolean;
    fecha_creacion: string;
};

function convertirCliente(
    cliente: ClienteBaseDatos
): Cliente {
    return {
        id: cliente.id,
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        email: cliente.email ?? undefined,
        activo: cliente.activo,
        fechaCreacion: cliente.fecha_creacion,
    };
}

export async function obtenerClientes(): Promise<Cliente[]> {
    const supabase = await crearClienteSupabase();

    const { data, error } = await supabase
        .from("clientes")
        .select(
            "id, nombre, telefono, email, activo, fecha_creacion"
        )
        .eq("activo", true)
        .order("nombre");

    if (error) {
        throw new Error(
            `No se pudieron obtener los clientes: ${error.message}`
        );
    }

    const clientes = (data as ClienteBaseDatos[]) ?? [];

    return clientes.map(convertirCliente);
}

export async function obtenerClientePorId(
    id: string
): Promise<Cliente | undefined> {
    const supabase = await crearClienteSupabase();

    const { data, error } = await supabase
        .from("clientes")
        .select(
            "id, nombre, telefono, email, activo, fecha_creacion"
        )
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw new Error(
            `No se pudo obtener el cliente: ${error.message}`
        );
    }

    if (!data) {
        return undefined;
    }

    return convertirCliente(
        data as ClienteBaseDatos
    );
}