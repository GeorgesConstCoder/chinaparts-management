import type { Inventario, EstadoInventario } from "@/types/inventario";

export function obtenerCantidadDisponible(registro: Inventario): number {
    return registro.existencia - registro.cantidadReservada;
}

export function obtenerEstadoInventario(registro: Inventario): EstadoInventario {
    return obtenerCantidadDisponible(registro) > 0 ? "disponible" : "agotado";
}