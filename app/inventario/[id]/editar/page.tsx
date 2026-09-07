import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { editarProducto } from "./actions";
import { crearClienteSupabase } from "@/lib/supabase/server";
import { obtenerProductoPorId } from "@/lib/productos";
import { obtenerInventarioPorProductoId } from "@/lib/inventario";

type EditarProductoPageProps = {
    params: Promise<{
        id: string;
    }>;

    searchParams: Promise<{
        error?: string;
    }>;
};

export default async function EditarProductoPage({
    params,
    searchParams,
}: EditarProductoPageProps) {
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
    const registro = await obtenerInventarioPorProductoId(id);

    if (!producto || !registro) {
        notFound();
    }

    const estiloCampo =
        "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400";

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-2xl">
                <Link
                    href={`/inventario/${producto.id}`}
                    className="text-sm text-amber-400 hover:underline"
                >
                    ← Volver al producto
                </Link>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">
                    <h1 className="text-3xl font-bold">
                        Editar producto
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Modifica los datos y existencias de{" "}
                        {producto.nombre}.
                    </p>

                    {error && (
                        <p className="mt-6 rounded-xl border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
                            {error}
                        </p>
                    )}

                    <form
                        action={editarProducto}
                        className="mt-8 space-y-5"
                    >
                        <input
                            type="hidden"
                            name="productoId"
                            value={producto.id}
                        />

                        <label className="block text-sm text-slate-300">
                            Código

                            <input
                                type="text"
                                name="codigo"
                                required
                                defaultValue={producto.codigo}
                                className={estiloCampo}
                            />
                        </label>

                        <label className="block text-sm text-slate-300">
                            Nombre

                            <input
                                type="text"
                                name="nombre"
                                required
                                defaultValue={producto.nombre}
                                className={estiloCampo}
                            />
                        </label>

                        <label className="block text-sm text-slate-300">
                            Marca

                            <input
                                type="text"
                                name="marca"
                                required
                                defaultValue={producto.marca}
                                className={estiloCampo}
                            />
                        </label>

                        <label className="block text-sm text-slate-300">
                            Tipo

                            <select
                                name="tipo"
                                required
                                defaultValue={producto.tipo}
                                className={estiloCampo}
                            >
                                <option value="repuesto">
                                    Repuesto
                                </option>

                                <option value="maquinaria">
                                    Maquinaria
                                </option>
                            </select>
                        </label>

                        <label className="block text-sm text-slate-300">
                            Existencia total

                            <input
                                type="number"
                                name="existencia"
                                required
                                min={registro.cantidadReservada}
                                step="1"
                                defaultValue={registro.existencia}
                                className={estiloCampo}
                            />

                            <span className="mt-2 block text-xs text-slate-500">
                                Actualmente hay{" "}
                                {registro.cantidadReservada} unidades
                                reservadas.
                            </span>
                        </label>

                        <label className="block text-sm text-slate-300">
                            Descripción

                            <textarea
                                name="descripcion"
                                rows={4}
                                defaultValue={producto.descripcion}
                                className={estiloCampo}
                            />
                        </label>

                        <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                            <Link
                                href={`/inventario/${producto.id}`}
                                className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-center font-semibold text-slate-300 transition hover:bg-slate-800"
                            >
                                Cancelar
                            </Link>

                            <button
                                type="submit"
                                className="flex-1 rounded-xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}