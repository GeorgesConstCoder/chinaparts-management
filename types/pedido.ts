export type EstadoPedido =
    | "pendiente"
    | "confirmado"
    | "listo_para_recoger"
    | "entregado"
    | "cancelado";

export type DetallePedido = {
    productoId: string;
    cantidad: number;
};

export type Pedido = {
    id: string;
    numero: string;
    clienteId: string;
    detalles: DetallePedido[];
    estado: EstadoPedido;
    fechaCreacion: string;
    fechaRecogidaPrevista: string;
    observaciones?: string;
};