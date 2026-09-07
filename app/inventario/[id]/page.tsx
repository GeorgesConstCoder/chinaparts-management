import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { crearClienteSupabase } from "@/lib/supabase/server";
import { obtenerProductoPorId } from "@/lib/productos";
import { obtenerInventarioPorProductoId } from "@/lib/inventario";
import {
    obtenerCantidadDisponible,
    obtenerEstadoInventario,
} from "@/lib/disponibilidad";

type ProductoPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProductoPage({
    params,
}: ProductoPageProps) {
    const { id } = await params;

    const supabase = await crearClienteSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const producto = await obtenerProductoPorId(id);
    const registro = await obtenerInventarioPorProductoId(id);

    if (!producto) {
        notFound();
    }

    const cantidadDisponible = registro
        ? obtenerCantidadDisponible(registro)
        : 0;

    const estado = registro
        ? obtenerEstadoInventario(registro)
        : "agotado";

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-3xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/inventario"
                        className="text-sm text-amber-400 hover:underline"
                    >
                        ← Volver al inventario
                    </Link>

                    <Link
                        href={`/inventario/${producto.id}/editar`}
                        className="rounded-xl border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-400 transition hover:bg-amber-400 hover:text-slate-950"
                    >
                        Editar producto
                    </Link>
                </div>

                <article className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                    <div className="border-b border-slate-800 p-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <p className="text-sm uppercase tracking-wider text-slate-400">
                                {producto.tipo} · {producto.codigo}
                            </p>

                            <span
                                className={
                                    estado === "disponible"
                                        ? "rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400"
                                        : "rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400"
                                }
                            >
                                {estado === "disponible"
                                    ? "Disponible"
                                    : "Agotado"}
                            </span>
                        </div>

                        <h1 className="mt-4 text-3xl font-bold">
                            {producto.nombre}
                        </h1>

                        <p className="mt-2 font-medium text-amber-400">
                            {producto.marca}
                        </p>

                        <p className="mt-6 leading-7 text-slate-300">
                            {producto.descripcion ||
                                "Este producto no tiene descripción."}
                        </p>
                    </div>

                    <div className="grid gap-4 p-8 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-950 p-5">
                            <p className="text-sm text-slate-400">
                                Disponibles
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {cantidadDisponible}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-950 p-5">
                            <p className="text-sm text-slate-400">
                                Existencias
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {registro?.existencia ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-950 p-5">
                            <p className="text-sm text-slate-400">
                                Reservadas
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {registro?.cantidadReservada ?? 0}
                            </p>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
}