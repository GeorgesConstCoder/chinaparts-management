export type EstadoPedido =
    | "pendiente"
    | "confirmado"
    | "listo_para_recoger"
    | "entregado"
    | "cancelado";

export type DetallePedido = {
    id: string;
    pedidoId: string;
    productoId: string;
    cantidad: number;
};

export type NuevoDetallePedido = {
    productoId: string;
    cantidad: number;
};

export type Pedido = {
    id: string;
    numero: number;
    clienteId: string;
    estado: EstadoPedido;
    fechaCreacion: string;
    fechaRecogidaPrevista: string;
    observaciones: string;
    detalles: DetallePedido[];
};