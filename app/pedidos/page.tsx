import Link from "next/link";
import { redirect } from "next/navigation";
import { crearClienteSupabase } from "@/lib/supabase/server";
import { obtenerPedidos } from "@/lib/pedidos";
import { obtenerClientes } from "@/lib/clientes";
import type { EstadoPedido } from "@/types/pedido";

const nombresEstado: Record<EstadoPedido, string> = {
    pendiente: "Pendiente",
    confirmado: "Confirmado",
    listo_para_recoger: "Listo para recoger",
    entregado: "Entregado",
    cancelado: "Cancelado",
};

const estilosEstado: Record<EstadoPedido, string> = {
    pendiente:
        "bg-amber-500/10 text-amber-400",
    confirmado:
        "bg-blue-500/10 text-blue-400",
    listo_para_recoger:
        "bg-purple-500/10 text-purple-400",
    entregado:
        "bg-emerald-500/10 text-emerald-400",
    cancelado:
        "bg-red-500/10 text-red-400",
};

export default async function PedidosPage() {
    const supabase = await crearClienteSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    let pedidos: Awaited<
        ReturnType<typeof obtenerPedidos>
    > = [];

    let clientes: Awaited<
        ReturnType<typeof obtenerClientes>
    > = [];

    let errorCarga: string | null = null;

    try {
        [pedidos, clientes] = await Promise.all([
            obtenerPedidos(),
            obtenerClientes(),
        ]);
    } catch (error: unknown) {
        errorCarga =
            error instanceof Error
                ? error.message
                : "No se pudieron cargar los pedidos";
    }

    const formatearFecha = (fecha: string) =>
        new Intl.DateTimeFormat("es-BO", {
            dateStyle: "medium",
            timeZone: "UTC",
        }).format(new Date(fecha));

    const pedidosPendientes = pedidos.filter(
        (pedido) => pedido.estado === "pendiente"
    ).length;

    const pedidosListos = pedidos.filter(
        (pedido) =>
            pedido.estado === "listo_para_recoger"
    ).length;

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
            <div className="mx-auto max-w-7xl">
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

                    <div className="flex items-center gap-4 text-sm">
                        <Link
                            href="/clientes"
                            className="text-slate-400 transition hover:text-white"
                        >
                            Clientes
                        </Link>

                        <Link
                            href="/inventario"
                            className="text-slate-400 transition hover:text-white"
                        >
                            Inventario
                        </Link>
                    </div>
                </nav>

                <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Pedidos
                        </h1>

                        <p className="mt-2 text-slate-400">
                            Seguimiento de reservas y recogidas de
                            clientes.
                        </p>
                    </div>

                    <Link
                        href="/pedidos/crear-pedido"
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-amber-400 px-5 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
                    >
                        + Crear pedido
                    </Link>
                </header>

                {!errorCarga && (
                    <section className="mt-8 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                            <p className="text-sm text-slate-400">
                                Total de pedidos
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {pedidos.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                            <p className="text-sm text-slate-400">
                                Pendientes
                            </p>

                            <p className="mt-2 text-3xl font-bold text-amber-400">
                                {pedidosPendientes}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                            <p className="text-sm text-slate-400">
                                Listos para recoger
                            </p>

                            <p className="mt-2 text-3xl font-bold text-purple-400">
                                {pedidosListos}
                            </p>
                        </div>
                    </section>
                )}

                {errorCarga && (
                    <p className="mt-8 rounded-xl border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
                        {errorCarga}
                    </p>
                )}

                {!errorCarga && pedidos.length === 0 && (
                    <section className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
                        <h2 className="text-xl font-semibold">
                            No existen pedidos
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Crea el primer pedido para reservar
                            productos del inventario.
                        </p>

                        <Link
                            href="/pedidos/crear-pedido"
                            className="mt-6 inline-flex rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
                        >
                            Crear primer pedido
                        </Link>
                    </section>
                )}

                {!errorCarga && pedidos.length > 0 && (
                    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400">
                                    <tr>
                                        <th className="px-5 py-4">
                                            Pedido
                                        </th>

                                        <th className="px-5 py-4">
                                            Cliente
                                        </th>

                                        <th className="px-5 py-4 text-center">
                                            Unidades
                                        </th>

                                        <th className="px-5 py-4">
                                            Recogida
                                        </th>

                                        <th className="px-5 py-4">
                                            Estado
                                        </th>

                                        <th className="px-5 py-4 text-right">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-800">
                                    {pedidos.map((pedido) => {
                                        const cliente =
                                            clientes.find(
                                                (item) =>
                                                    item.id ===
                                                    pedido.clienteId
                                            );

                                        const totalUnidades =
                                            pedido.detalles.reduce(
                                                (
                                                    total,
                                                    detalle
                                                ) =>
                                                    total +
                                                    detalle.cantidad,
                                                0
                                            );

                                        return (
                                            <tr
                                                key={pedido.id}
                                                className="transition hover:bg-slate-800/40"
                                            >
                                                <td className="whitespace-nowrap px-5 py-4 font-mono font-semibold text-amber-400">
                                                    PED-
                                                    {String(
                                                        pedido.numero
                                                    ).padStart(
                                                        6,
                                                        "0"
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-white">
                                                        {cliente?.nombre ??
                                                            "Cliente no disponible"}
                                                    </p>

                                                    {cliente && (
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {
                                                                cliente.telefono
                                                            }
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-center font-semibold">
                                                    {totalUnidades}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                                                    {formatearFecha(
                                                        pedido.fechaRecogidaPrevista
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${estilosEstado[
                                                            pedido
                                                                .estado
                                                            ]
                                                            }`}
                                                    >
                                                        {
                                                            nombresEstado[
                                                            pedido
                                                                .estado
                                                            ]
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <Link
                                                        href={`/pedidos/${pedido.id}`}
                                                        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-amber-400 hover:text-amber-400"
                                                    >
                                                        Ver detalle
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}