import Link from "next/link";
import { crearProducto } from "./actions";

type AgregarProductoPageProps = {
    searchParams: Promise<{
        error?: string;
    }>;
};

export default async function AgregarProductoPage({
    searchParams,
}: AgregarProductoPageProps) {
    const { error } = await searchParams;

    const estiloCampo =
        "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400";

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-2xl">
                <Link
                    href="/inventario"
                    className="text-sm text-amber-400 hover:underline"
                >
                    ← Volver al inventario
                </Link>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">
                    <h1 className="text-3xl font-bold">
                        Agregar producto
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Registra un repuesto o una maquinaria en el inventario.
                    </p>

                    {error && (
                        <p className="mt-6 rounded-xl border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
                            {error}
                        </p>
                    )}

                    <form
                        action={crearProducto}
                        className="mt-8 space-y-5"
                    >
                        <label className="block text-sm text-slate-300">
                            Código

                            <input
                                type="text"
                                name="codigo"
                                required
                                placeholder="Ejemplo: REP-002"
                                className={estiloCampo}
                            />
                        </label>

                        <label className="block text-sm text-slate-300">
                            Nombre

                            <input
                                type="text"
                                name="nombre"
                                required
                                placeholder="Ejemplo: Filtro de combustible"
                                className={estiloCampo}
                            />
                        </label>

                        <label className="block text-sm text-slate-300">
                            Marca

                            <input
                                type="text"
                                name="marca"
                                required
                                placeholder="Ejemplo: Caterpillar"
                                className={estiloCampo}
                            />
                        </label>

                        <label className="block text-sm text-slate-300">
                            Tipo

                            <select
                                name="tipo"
                                required
                                defaultValue="repuesto"
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
                            Existencia inicial

                            <input
                                type="number"
                                name="existencia"
                                required
                                min="0"
                                step="1"
                                defaultValue="0"
                                className={estiloCampo}
                            />
                        </label>

                        <label className="block text-sm text-slate-300">
                            Descripción

                            <textarea
                                name="descripcion"
                                rows={4}
                                placeholder="Descripción del producto..."
                                className={estiloCampo}
                            />
                        </label>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 hover:bg-amber-300"
                        >
                            Guardar producto
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}