import Link from "next/link";
import { redirect } from "next/navigation";
import { crearClienteSupabase } from "@/lib/supabase/server";
import { obtenerClientes } from "@/lib/clientes";

export default async function ClientesPage() {
    const supabase = await crearClienteSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    let clientes: Awaited<
        ReturnType<typeof obtenerClientes>
    > = [];

    let errorCarga: string | null = null;

    try {
        clientes = await obtenerClientes();
    } catch (error: unknown) {
        errorCarga =
            error instanceof Error
                ? error.message
                : "No se pudieron cargar los clientes";
    }

    const formatearFecha = (fecha: string) =>
        new Intl.DateTimeFormat("es-BO", {
            dateStyle: "medium",
        }).format(new Date(fecha));

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
            <div className="mx-auto max-w-6xl">
                <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <Link
                        href="/inventario"
                        className="font-bold text-white"
                    >
                        China
                        <span className="text-amber-400">
                            Parts
                        </span>
                    </Link>

                    <Link
                        href="/inventario"
                        className="text-sm text-slate-400 transition hover:text-white"
                    >
                        Ir al inventario
                    </Link>
                </nav>

                <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Clientes
                        </h1>

                        <p className="mt-2 text-slate-400">
                            Administra las personas y empresas que
                            realizan pedidos.
                        </p>
                    </div>

                    <Link
                        href="/clientes/agregar-cliente"
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-amber-400 px-5 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
                    >
                        + Agregar cliente
                    </Link>
                </header>

                {errorCarga && (
                    <p className="mt-8 rounded-xl border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
                        {errorCarga}
                    </p>
                )}

                {!errorCarga && (
                    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
                            <div>
                                <p className="text-sm text-slate-400">
                                    Clientes activos
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    {clientes.length}
                                </p>
                            </div>
                        </div>

                        {clientes.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <h2 className="text-xl font-semibold">
                                    No hay clientes registrados
                                </h2>

                                <p className="mt-2 text-sm text-slate-400">
                                    Registra el primer cliente para
                                    comenzar a crear pedidos.
                                </p>

                                <Link
                                    href="/clientes/agregar-cliente"
                                    className="mt-6 inline-flex rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
                                >
                                    Agregar primer cliente
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400">
                                        <tr>
                                            <th className="px-6 py-4">
                                                Cliente
                                            </th>

                                            <th className="px-6 py-4">
                                                Teléfono
                                            </th>

                                            <th className="px-6 py-4">
                                                Correo
                                            </th>

                                            <th className="px-6 py-4">
                                                Registrado
                                            </th>

                                            <th className="px-6 py-4 text-right">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-800">
                                        {clientes.map((cliente) => (
                                            <tr
                                                key={cliente.id}
                                                className="transition hover:bg-slate-800/40"
                                            >
                                                <td className="px-6 py-4 font-semibold text-white">
                                                    {cliente.nombre}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                                                    {cliente.telefono}
                                                </td>

                                                <td className="px-6 py-4 text-slate-400">
                                                    {cliente.email ??
                                                        "Sin correo"}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                                                    {formatearFecha(
                                                        cliente.fechaCreacion
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                                        Activo
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
}