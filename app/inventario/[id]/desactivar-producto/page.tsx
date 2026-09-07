import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { desactivarProducto } from "./actions";
import { crearClienteSupabase } from "@/lib/supabase/server";
import { obtenerProductoPorId } from "@/lib/productos";

type DesactivarProductoPageProps = {
    params: Promise<{
        id: string;
    }>;

    searchParams: Promise<{
        error?: string;
    }>;
};

export default async function DesactivarProductoPage({
    params,
    searchParams,
}: DesactivarProductoPageProps) {
    const { id } = await params;
    const { error } = await searchParams;

    const supabase = await crearClienteSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const producto = await obtenerProductoPorId(id);

    if (!producto) {
        notFound();
    }

    if (!producto.activo) {
        redirect("/inventario");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
            <section className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8">
                <span className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400">
                    Confirmación
                </span>

                <h1 className="mt-5 text-3xl font-bold">
                    Desactivar producto
                </h1>

                <p className="mt-3 leading-7 text-slate-300">
                    Estás por desactivar{" "}
                    <strong className="text-white">
                        {producto.nombre}
                    </strong>{" "}
                    con código{" "}
                    <strong className="text-white">
                        {producto.codigo}
                    </strong>.
                </p>

                <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <p className="text-sm leading-6 text-amber-200">
                        El producto dejará de aparecer en el
                        inventario actual, pero sus datos y
                        existencias no serán eliminados.
                    </p>
                </div>

                {error && (
                    <p className="mt-6 rounded-xl border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
                        {error}
                    </p>
                )}

                <form
                    action={desactivarProducto}
                    className="mt-8"
                >
                    <input
                        type="hidden"
                        name="productoId"
                        value={producto.id}
                    />

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={`/inventario/${producto.id}`}
                            className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-center font-semibold text-slate-300 transition hover:bg-slate-800"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="flex-1 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-400"
                        >
                            Sí, desactivar
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}