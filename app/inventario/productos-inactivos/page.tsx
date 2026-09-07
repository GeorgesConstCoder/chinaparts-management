import Link from "next/link";
import { redirect } from "next/navigation";
import { reactivarProducto } from "./actions";
import { crearClienteSupabase } from "@/lib/supabase/server";
import { obtenerProductosInactivos } from "@/lib/productos";
import { obtenerInventario } from "@/lib/inventario";
import { obtenerCantidadDisponible } from "@/lib/disponibilidad";

type ProductosInactivosPageProps = {
    searchParams: Promise<{
        error?: string;
    }>;
};

export default async function ProductosInactivosPage({
    searchParams,
}: ProductosInactivosPageProps) {
    const { error } = await searchParams;

    const supabase = await crearClienteSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const [productos, inventario] = await Promise.all([
        obtenerProductosInactivos(),
        obtenerInventario(),
    ]);

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/inventario"
                    className="text-sm text-amber-400 hover:underline"
                >
                    ← Volver al inventario
                </Link>

                <div className="mt-6">
                    <h1 className="text-3xl font-bold">
                        Productos inactivos
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Productos retirados del inventario operativo
                        que pueden volver a activarse.
                    </p>
                </div>

                {error && (
                    <p className="mt-6 rounded-xl border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
                        {error}
                    </p>
                )}

                {productos.length === 0 ? (
                    <section className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
                        <h2 className="text-xl font-semibold">
                            No hay productos inactivos
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Los productos desactivados aparecerán
                            en esta sección.
                        </p>

                        <Link
                            href="/inventario"
                            className="mt-6 inline-flex rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
                        >
                            Ir al inventario
                        </Link>
                    </section>
                ) : (
                    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-800 bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400">
                                    <tr>
                                        <th className="px-5 py-4">
                                            Código
                                        </th>

                                        <th className="px-5 py-4">
                                            Producto
                                        </th>

                                        <th className="px-5 py-4">
                                            Tipo
                                        </th>

                                        <th className="px-5 py-4 text-center">
                                            Existencia
                                        </th>

                                        <th className="px-5 py-4 text-center">
                                            Disponible
                                        </th>

                                        <th className="px-5 py-4 text-right">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-800">
                                    {productos.map((producto) => {
                                        const registro =
                                            inventario.find(
                                                (item) =>
                                                    item.productoId ===
                                                    producto.id
                                            );

                                        const disponible = registro
                                            ? obtenerCantidadDisponible(
                                                registro
                                            )
                                            : 0;

                                        return (
                                            <tr
                                                key={producto.id}
                                                className="transition hover:bg-slate-800/40"
                                            >
                                                <td className="whitespace-nowrap px-5 py-4 font-mono text-amber-400">
                                                    {producto.codigo}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-white">
                                                        {producto.nombre}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {producto.marca}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 capitalize text-slate-300">
                                                    {producto.tipo}
                                                </td>

                                                <td className="px-5 py-4 text-center text-slate-300">
                                                    {registro?.existencia ??
                                                        0}
                                                </td>

                                                <td className="px-5 py-4 text-center font-semibold text-slate-200">
                                                    {disponible}
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <form
                                                        action={
                                                            reactivarProducto
                                                        }
                                                    >
                                                        <input
                                                            type="hidden"
                                                            name="productoId"
                                                            value={
                                                                producto.id
                                                            }
                                                        />

                                                        <button
                                                            type="submit"
                                                            className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
                                                        >
                                                            Reactivar
                                                        </button>
                                                    </form>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}