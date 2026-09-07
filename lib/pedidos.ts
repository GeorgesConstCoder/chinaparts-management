import { crearClienteSupabase } from "@/lib/supabase/server";
import type {
    DetallePedido,
    EstadoPedido,
    NuevoDetallePedido,
    Pedido,
} from "@/types/pedido";

type DetallePedidoBaseDatos = {
    id: string;
    pedido_id: string;
    producto_id: string;
    cantidad: number;
};

type PedidoBaseDatos = {
    id: string;
    numero: number;
    cliente_id: string;
    estado: EstadoPedido;
    fecha_creacion: string;
    fecha_recogida_prevista: string;
    observaciones: string;
    detalle_pedido: DetallePedidoBaseDatos[];
};

type CrearPedidoDatos = {
    clienteId: string;
    fechaRecogidaPrevista: string;
    observaciones?: string;
    detalles: NuevoDetallePedido[];
};

function convertirDetalle(
    detalle: DetallePedidoBaseDatos
): DetallePedido {
    return {
        id: detalle.id,
        pedidoId: detalle.pedido_id,
        productoId: detalle.producto_id,
        cantidad: detalle.cantidad,
    };
}

function convertirPedido(
    pedido: PedidoBaseDatos
): Pedido {
    return {
        id: pedido.id,
        numero: pedido.numero,
        clienteId: pedido.cliente_id,
        estado: pedido.estado,
        fechaCreacion: pedido.fecha_creacion,
        fechaRecogidaPrevista:
            pedido.fecha_recogida_prevista,
        observaciones: pedido.observaciones,
        detalles: pedido.detalle_pedido.map(
            convertirDetalle
        ),
    };
}

export async function obtenerPedidos(): Promise<Pedido[]> {
    const supabase = await crearClienteSupabase();

    const { data, error } = await supabase
        .from("pedidos")
        .select(`
            id,
            numero,
            cliente_id,
            estado,
            fecha_creacion,
            fecha_recogida_prevista,
            observaciones,
            detalle_pedido (
                id,
                pedido_id,
                producto_id,
                cantidad
            )
        `)
        .order("fecha_creacion", {
            ascending: false,
        });

    if (error) {
        throw new Error(
            `No se pudieron obtener los pedidos: ${error.message}`
        );
    }

    const pedidos = (data as PedidoBaseDatos[]) ?? [];

    return pedidos.map(convertirPedido);
}

export async function obtenerPedidoPorId(
    id: string
): Promise<Pedido | undefined> {
    const supabase = await crearClienteSupabase();

    const { data, error } = await supabase
        .from("pedidos")
        .select(`
            id,
            numero,
            cliente_id,
            estado,
            fecha_creacion,
            fecha_recogida_prevista,
            observaciones,
            detalle_pedido (
                id,
                pedido_id,
                producto_id,
                cantidad
            )
        `)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw new Error(
            `No se pudo obtener el pedido: ${error.message}`
        );
    }

    if (!data) {
        return undefined;
    }

    return convertirPedido(
        data as PedidoBaseDatos
    );
}

export async function crearPedidoConReserva(
    datos: CrearPedidoDatos
): Promise<string> {
    const supabase = await crearClienteSupabase();

    const { data, error } = await supabase.rpc(
        "crear_pedido_con_reserva",
        {
            p_cliente_id: datos.clienteId,
            p_fecha_recogida_prevista:
                datos.fechaRecogidaPrevista,
            p_observaciones: datos.observaciones ?? "",
            p_detalles: datos.detalles,
        }
    );

    if (error) {
        throw new Error(
            `No se pudo crear el pedido: ${error.message}`
        );
    }

    return data as string;
}