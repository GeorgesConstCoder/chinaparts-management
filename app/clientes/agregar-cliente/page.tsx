import Link from "next/link";
import { redirect } from "next/navigation";
import { crearCliente } from "./actions";
import { crearClienteSupabase } from "@/lib/supabase/server";

type AgregarClientePageProps = {
    searchParams: Promise<{
        error?: string;
    }>;
};

export default async function AgregarClientePage({
    searchParams,
}: AgregarClientePageProps) {
    const { error } = await searchParams;

    const supabase = await crearClienteSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const estiloCampo =
        "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400";

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-2xl">
                <Link
                    href="/clientes"
                    className="text-sm text-amber-400 hover:underline"
                >
                    ← Volver a clientes
                </Link>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">
                    <h1 className="text-3xl font-bold">
                        Agregar cliente
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Registra los datos básicos del cliente para
                        poder crear sus pedidos.
                    </p>

                    {error && (
                        <p className="mt-6 rounded-xl border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
                            {error}
                        </p>
                    )}

                    <form
                        action={crearCliente}
                        className="mt-8 space-y-5"
                    >
                        <label className="block text-sm text-slate-300">
                            Nombre completo o empresa

                            <input
                                type="text"
                                name="nombre"
                                required
                                autoComplete="name"
                                placeholder="Ejemplo: Constructora del Norte"
                                className={estiloCampo}
                            />
                        </label>

                        <label className="block text-sm text-slate-300">
                            Teléfono

                            <input
                                type="tel"
                                name="telefono"
                                required
                                autoComplete="tel"
                                placeholder="Ejemplo: +591 70000000"
                                className={estiloCampo}
                            />
                        </label>

                        <label className="block text-sm text-slate-300">
                            Correo electrónico{" "}
                            <span className="text-slate-500">
                                (opcional)
                            </span>

                            <input
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="cliente@empresa.com"
                                className={estiloCampo}
                            />
                        </label>

                        <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                            <Link
                                href="/clientes"
                                className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-center font-semibold text-slate-300 transition hover:bg-slate-800"
                            >
                                Cancelar
                            </Link>

                            <button
                                type="submit"
                                className="flex-1 rounded-xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
                            >
                                Guardar cliente
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}