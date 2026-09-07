import type { Inventario } from "@/types/inventario";

export const inventario: Inventario[] = [
    {
        id: "inv-1",
        productoId: "1",
        existencia: 10,
        cantidadReservada: 0,
    },
    {
        id: "inv-2",
        productoId: "2",
        existencia: 0,
        cantidadReservada: 0,
    },
    {
        id: "inv-3",
        productoId: "3",
        existencia: 1,
        cantidadReservada: 0,
    },
];