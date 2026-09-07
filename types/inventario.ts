export type EstadoInventario = "disponible" | "agotado";

export type Inventario = {
    id: string;
    productoId: string;
    existencia: number;
    cantidadReservada: number;
};