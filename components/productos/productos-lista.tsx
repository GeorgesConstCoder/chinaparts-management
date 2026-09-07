"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Producto } from "@/types/producto";
import type { Inventario } from "@/types/inventario";
import {
    obtenerCantidadDisponible,
    obtenerEstadoInventario,
} from "@/lib/disponibilidad";
import ProductoCard from "@/components/productos/producto-card";

type ProductosListaProps = {
    productos: Producto[];
    inventario: Inventario[];
};

export default function ProductosLista({
    productos,
    inventario,
}: ProductosListaProps) {
    const [busqueda, setBusqueda] = useState("");
    const [tipo, setTipo] = useState<"todos" | "maquinaria" | "repuesto">("todos");
    const [estado, setEstado] = useState("todos");
    const [orden, setOrden] = useState<"nombre" | "disponible_desc" | "disponible_asc" | "codigo">("nombre");
    const [vista, setVista] = useState<"grid" | "table">("grid");

    // Merge productos with inventario
    const productosConInventario = useMemo(() => {
        return productos.map((producto) => {
            const registro = inventario.find(
                (item) => item.productoId === producto.id
            );
            const disponible = registro ? obtenerCantidadDisponible(registro) : 0;
            const estadoInventario = registro
                ? obtenerEstadoInventario(registro)
                : "sin_inventario";

            return {
                producto,
                registro,
                disponible,
                estadoInventario,
            };
        });
    }, [productos, inventario]);

    // KPI Summary Calculations
    const totalProductos = productos.length;
    const totalMaquinaria = productos.filter((p) => p.tipo === "maquinaria").length;
    const totalRepuestos = productos.filter((p) => p.tipo === "repuesto").length;

    // Filtering
    const resultados = useMemo(() => {
        const textoBuscado = busqueda.trim().toLowerCase();

        const filtrados = productosConInventario.filter(
            ({ producto, estadoInventario }) => {
                const textoProducto =
                    `${producto.nombre} ${producto.codigo} ${producto.marca} ${producto.descripcion}`.toLowerCase();

                const coincideBusqueda =
                    !textoBuscado || textoProducto.includes(textoBuscado);
                const coincideTipo =
                    tipo === "todos" || producto.tipo === tipo;
                const coincideEstado =
                    estado === "todos" || estadoInventario === estado;

                return coincideBusqueda && coincideTipo && coincideEstado;
            }
        );

        // Sorting
        return [...filtrados].sort((a, b) => {
            if (orden === "disponible_desc") {
                return b.disponible - a.disponible;
            }
            if (orden === "disponible_asc") {
                return a.disponible - b.disponible;
            }
            if (orden === "codigo") {
                return a.producto.codigo.localeCompare(b.producto.codigo);
            }
            return a.producto.nombre.localeCompare(b.producto.nombre);
        });
    }, [productosConInventario, busqueda, tipo, estado, orden]);

    function limpiarFiltros() {
        setBusqueda("");
        setTipo("todos");
        setEstado("todos");
        setOrden("nombre");
    }

    const hayFiltrosActivos =
        busqueda.trim() !== "" || tipo !== "todos" || estado !== "todos";

    return (
        <div className="mt-8 space-y-8">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Total Productos */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Total Catálogo
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-4 text-3xl font-bold tracking-tight text-white">
                        {totalProductos}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Ítems únicos registrados
                    </p>
                </div>

                {/* Maquinaria */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Maquinaria
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-4 text-3xl font-bold tracking-tight text-white">
                        {totalMaquinaria}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Equipos pesados en sistema
                    </p>
                </div>

                {/* Repuestos */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Repuestos
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-4 text-3xl font-bold tracking-tight text-white">
                        {totalRepuestos}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Piezas y componentes
                    </p>
                </div>
            </div>

            {/* Main Control Panel: Search & Filters */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-md shadow-xl space-y-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Search bar with icon and clear button */}
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por código, nombre, marca o especificación..."
                            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-3 pl-11 pr-10 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
                        />

                        {busqueda && (
                            <button
                                type="button"
                                onClick={() => setBusqueda("")}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                                title="Borrar búsqueda"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Category Segmented Pills */}
                    <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/80 p-1">
                        <button
                            type="button"
                            onClick={() => setTipo("todos")}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                tipo === "todos"
                                    ? "bg-amber-400 text-slate-950 shadow-md"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            Todos ({totalProductos})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTipo("maquinaria")}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                tipo === "maquinaria"
                                    ? "bg-amber-400 text-slate-950 shadow-md"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            Maquinaria ({totalMaquinaria})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTipo("repuesto")}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                tipo === "repuesto"
                                    ? "bg-amber-400 text-slate-950 shadow-md"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            Repuestos ({totalRepuestos})
                        </button>
                    </div>
                </div>

                {/* Sub-toolbar: Availability, Sorting, and View Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Estado filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-400">Estado:</span>
                            <select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-white outline-none focus:border-amber-400"
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="disponible">✓ Disponible</option>
                                <option value="agotado">✕ Agotado</option>
                                <option value="sin_inventario">○ Sin inventario</option>
                            </select>
                        </div>

                        {/* Sorting */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-400">Ordenar:</span>
                            <select
                                value={orden}
                                onChange={(e) => setOrden(e.target.value as typeof orden)}
                                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-white outline-none focus:border-amber-400"
                            >
                                <option value="nombre">Nombre (A - Z)</option>
                                <option value="disponible_desc">Mayor stock disponible</option>
                                <option value="disponible_asc">Menor stock disponible</option>
                                <option value="codigo">Código de producto</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Switcher: Grid vs Table */}
                        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1">
                            <button
                                type="button"
                                onClick={() => setVista("grid")}
                                title="Vista en tarjetas"
                                className={`rounded p-1.5 transition-colors ${
                                    vista === "grid"
                                        ? "bg-slate-800 text-amber-400"
                                        : "text-slate-500 hover:text-white"
                                }`}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => setVista("table")}
                                title="Vista en tabla"
                                className={`rounded p-1.5 transition-colors ${
                                    vista === "table"
                                        ? "bg-slate-800 text-amber-400"
                                        : "text-slate-500 hover:text-white"
                                }`}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active filters chip row */}
                {hayFiltrosActivos && (
                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/60 pt-3">
                        <span className="text-xs text-slate-500">Filtros aplicados:</span>

                        {busqueda && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
                                Texto: &quot;{busqueda}&quot;
                                <button
                                    type="button"
                                    onClick={() => setBusqueda("")}
                                    className="text-slate-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </span>
                        )}

                        {tipo !== "todos" && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
                                Tipo: {tipo}
                                <button
                                    type="button"
                                    onClick={() => setTipo("todos")}
                                    className="text-slate-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </span>
                        )}

                        {estado !== "todos" && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
                                Estado: {estado}
                                <button
                                    type="button"
                                    onClick={() => setEstado("todos")}
                                    className="text-slate-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={limpiarFiltros}
                            className="text-xs font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300 ml-1"
                        >
                            Restablecer todo
                        </button>
                    </div>
                )}
            </div>

            {/* Results counter */}
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400">
                    Mostrando{" "}
                    <strong className="font-bold text-white">
                        {resultados.length}
                    </strong>{" "}
                    de {productos.length} productos
                </p>

                {resultados.length > 0 && (
                    <span className="text-xs text-slate-500">
                        {tipo === "todos"
                            ? "Catálogo completo"
                            : `Filtrando por ${tipo}`}
                    </span>
                )}
            </div>

            {/* Content: Grid or Table View */}
            {resultados.length > 0 ? (
                vista === "grid" ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {resultados.map(({ producto, registro }) => (
                            <ProductoCard
                                key={producto.id}
                                producto={producto}
                                registro={registro}
                            />
                        ))}
                    </div>
                ) : (
                    /* Table View */
                    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400">
                                    <tr>
                                        <th className="px-5 py-4">Código</th>
                                        <th className="px-5 py-4">Producto</th>
                                        <th className="px-5 py-4">Marca</th>
                                        <th className="px-5 py-4">Tipo</th>
                                        <th className="px-5 py-4 text-center">Total</th>
                                        <th className="px-5 py-4 text-center">Reservadas</th>
                                        <th className="px-5 py-4 text-center">Disponible</th>
                                        <th className="px-5 py-4">Estado</th>
                                        <th className="px-5 py-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {resultados.map(({ producto, registro, disponible, estadoInventario }) => (
                                        <tr
                                            key={producto.id}
                                            className="transition-colors hover:bg-slate-800/40"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-amber-300">
                                                {producto.codigo}
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-white">
                                                    {producto.nombre}
                                                </p>
                                                <p className="text-xs text-slate-500 line-clamp-1">
                                                    {producto.descripcion}
                                                </p>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-slate-400">
                                                {producto.marca}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <span className="inline-flex rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 text-xs font-medium uppercase text-slate-400">
                                                    {producto.tipo}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-center tabular-nums text-slate-300">
                                                {registro ? registro.existencia : "-"}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-center tabular-nums text-slate-400">
                                                {registro ? registro.cantidadReservada : "-"}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-center font-bold tabular-nums">
                                                <span
                                                    className={
                                                        disponible > 0
                                                            ? "text-emerald-400"
                                                            : "text-rose-400"
                                                    }
                                                >
                                                    {disponible}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                                        estadoInventario === "disponible"
                                                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                                                            : estadoInventario === "agotado"
                                                            ? "bg-rose-950/40 text-rose-400 border-rose-500/30"
                                                            : "bg-slate-900 text-slate-400 border-slate-800"
                                                    }`}
                                                >
                                                    {estadoInventario === "disponible" ? (
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                    ) : (
                                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                                                    )}
                                                    {estadoInventario === "disponible"
                                                        ? "Disponible"
                                                        : estadoInventario === "agotado"
                                                        ? "Agotado"
                                                        : "Sin inventario"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-right">
                                                <Link
                                                    href={`/inventario/${producto.id}`}
                                                    className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition hover:border-amber-400 hover:bg-amber-400 hover:text-slate-950"
                                                >
                                                    Detalles →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-400">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-white">
                        {productos.length === 0
                            ? "Aún no hay productos en el inventario"
                            : "No se encontraron productos coincidentes"}
                    </h2>

                    <p className="mt-2 max-w-sm text-sm text-slate-400">
                        {productos.length === 0
                            ? "Comienza agregando tu primera maquinaria o repuesto para gestionar tus existencias."
                            : "Prueba ajustando los términos de búsqueda o restableciendo los filtros activos."}
                    </p>

                    {hayFiltrosActivos ? (
                        <button
                            type="button"
                            onClick={limpiarFiltros}
                            className="mt-6 inline-flex items-center rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md transition hover:bg-amber-300"
                        >
                            Restablecer todos los filtros
                        </button>
                    ) : (
                        productos.length === 0 && (
                            <Link
                                href="/inventario/agregar-producto"
                                className="mt-6 inline-flex items-center rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md transition hover:bg-amber-300"
                            >
                                + Agregar primer producto
                            </Link>
                        )
                    )}
                </div>
            )}
        </div>
    );
}