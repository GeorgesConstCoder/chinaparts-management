import type { Producto } from "@/types/producto";

export const productos: Producto[] = [
    {
        id: "1",
        codigo: "REP-001",
        nombre: "Filtro de aceite",
        descripcion: "Filtro de aceite para maquinaria pesada.",
        marca: "Caterpillar",
        tipo: "repuesto",
    },
    {
        id: "2",
        codigo: "REP-002",
        nombre: "Filtro de aire",
        descripcion: "Filtro de aire para motor diésel.",
        marca: "Komatsu",
        tipo: "repuesto",
    },
    {
        id: "3",
        codigo: "MAQ-001",
        nombre: "Excavadora 320",
        descripcion: "Excavadora hidráulica sobre orugas.",
        marca: "Caterpillar",
        tipo: "maquinaria",
    },
];