
import Link from "next/link";
import type { Producto } from "@/types/producto";
import type { Inventario } from "@/types/inventario";
import {
    obtenerCantidadDisponible,
    obtenerEstadoInventario,
} from "@/lib/disponibilidad";

type ProductoCardProps = {
    producto: Producto;
    registro?: Inventario;
};

export default function ProductoCard({
    producto,
    registro,
}: ProductoCardProps) {
    const disponible = registro ? obtenerCantidadDisponible(registro) : null;
    const estado = registro ? obtenerEstadoInventario(registro) : null;

    const existenciaTotal = registro?.existencia ?? 0;
    const porcentajeDisponible =
        existenciaTotal > 0 && disponible !== null
            ? Math.min(100, Math.max(0, Math.round((disponible / existenciaTotal) * 100)))
            : 0;

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-6 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/5">
            {/* Top ambient glow on hover */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-amber-500/10 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

            {/* Header: Category & Status Badge */}
            <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {producto.tipo === "maquinaria" ? (
                        <svg
                            className="h-3.5 w-3.5 text-amber-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 14v4m4-4v4m4-4v4M3 9l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="h-3.5 w-3.5 text-sky-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    )}
                    {producto.tipo}
                </span>

                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${estado === "disponible"
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                        : estado === "agotado"
                            ? "bg-rose-950/40 text-rose-400 border-rose-500/30"
                            : "bg-slate-900 text-slate-400 border-slate-800"
                        }`}
                >
                    {estado === "disponible" ? (
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                    ) : estado === "agotado" ? (
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                    ) : (
                        <span className="h-2 w-2 rounded-full bg-slate-500" />
                    )}

                    {estado === "disponible"
                        ? "Disponible"
                        : estado === "agotado"
                            ? "Agotado"
                            : "Sin inventario"}
                </span>
            </div>

            {/* SKU and Brand tags */}
            <div className="mt-5 flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 font-mono text-xs font-semibold text-amber-300">
                    {producto.codigo}
                </span>

                <span className="text-xs font-medium text-slate-400">
                    Marca:{" "}
                    <strong className="text-slate-200 font-semibold">
                        {producto.marca}
                    </strong>
                </span>
            </div>

            {/* Product Title */}
            <h2 className="mt-3 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-amber-300 line-clamp-1">
                {producto.nombre}
            </h2>

            {/* Description */}
            <p className="mt-2 text-sm leading-relaxed text-slate-400 line-clamp-2 min-h-[2.75rem]">
                {producto.descripcion || "Sin descripción disponible para este producto."}
            </p>

            {/* Inventory Metrics Box */}
            <div className="mt-auto pt-5">
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                    {registro ? (
                        <>
                            <div className="flex items-end justify-between">
                                <span className="text-xs uppercase tracking-wider font-medium text-slate-400">
                                    Disponibilidad neta
                                </span>

                                <div className="text-right">
                                    <span
                                        className={`text-2xl font-bold tabular-nums tracking-tight ${(disponible ?? 0) > 0
                                            ? "text-emerald-400"
                                            : "text-rose-400"
                                            }`}
                                    >
                                        {disponible}
                                    </span>
                                    <span className="ml-1 text-xs text-slate-500">
                                        uds
                                    </span>
                                </div>
                            </div>

                            {/* Stock progress bar */}
                            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${(disponible ?? 0) > 5
                                        ? "bg-emerald-400"
                                        : (disponible ?? 0) > 0
                                            ? "bg-amber-400"
                                            : "bg-rose-500"
                                        }`}
                                    style={{ width: `${porcentajeDisponible}%` }}
                                />
                            </div>

                            <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                                    Total:{" "}
                                    <strong className="text-slate-200">
                                        {registro.existencia}
                                    </strong>
                                </span>

                                <span className="inline-flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    Reservadas:{" "}
                                    <strong className="text-slate-200">
                                        {registro.cantidadReservada}
                                    </strong>
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center py-2 text-xs text-slate-500">
                            Sin registro de inventario asociado
                        </div>
                    )}
                </div>

                <Link
                    href={`/inventario/${producto.id}`}
                    className="mt-4 flex h-11 items-center justify-between rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-sm font-semibold text-white transition-all duration-200 hover:border-amber-400/80 hover:bg-amber-400 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                >
                    <span>Ver detalle del producto</span>
                    <svg
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>
            </div>
        </article>
    );
}