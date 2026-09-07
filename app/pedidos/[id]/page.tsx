import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { crearClienteSupabase } from "@/lib/supabase/server";
import { obtenerPedidoPorId } from "@/lib/pedidos";
import { obtenerClientePorId } from "@/lib/clientes";
import { obtenerProductoPorId } from "@/lib/productos";
import type { EstadoPedido } from "@/types/pedido";

type PedidoDetallePageProps = {
    params: Promise<{
        id: string;
    }>;
};

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

export default async function PedidoDetallePage({
    params,
}: PedidoDetallePageProps) {
    const { id } = await params;

    const supabase = await crearClienteSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const pedido = await obtenerPedidoPorId(id);

    if (!pedido) {
        notFound();
    }

    const [cliente, productos] = await Promise.all([
        obtenerClientePorId(pedido.clienteId),

        Promise.all(
            pedido.detalles.map((detalle) =>
                obtenerProductoPorId(
                    detalle.productoId
                )
            )
        ),
    ]);

    const numeroPedido = `PED-${String(
        pedido.numero
    ).padStart(6, "0")}`;

    const formatearFecha = (fecha: string) =>
        new Intl.DateTimeFormat("es-BO", {
            dateStyle: "long",
            timeZone: "UTC",
        }).format(new Date(fecha));

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-4xl">
                <Link
                    href="/pedidos"
                    className="text-sm text-amber-400 hover:underline"
                >
                    ← Volver a pedidos
                </Link>

                <section className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                    <header className="border-b border-slate-800 p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <p className="font-mono text-sm text-amber-400">
                                    {numeroPedido}
                                </p>

                                <h1 className="mt-2 text-3xl font-bold">
                                    Pedido de{" "}
                                    {cliente?.nombre ??
                                        "Cliente no disponible"}
                                </h1>
                            </div>

                            <span
                                className={`rounded-full px-3 py-1 text-sm font-medium ${estilosEstado[
                                    pedido.estado
                                ]
                                    }`}
                            >
                                {nombresEstado[pedido.estado]}
                            </span>
                        </div>

                        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                            <div>
                                <p className="text-slate-500">
                                    Fecha de creación
                                </p>

                                <p className="mt-1 text-slate-200">
                                    {formatearFecha(
                                        pedido.fechaCreacion
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">
                                    Recogida prevista
                                </p>

                                <p className="mt-1 text-slate-200">
                                    {formatearFecha(
                                        pedido.fechaRecogidaPrevista
                                    )}
                                </p>
                            </div>
                        </div>
                    </header>

                    <div className="p-8">
                        <h2 className="text-lg font-semibold">
                            Productos reservados
                        </h2>

                        <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400">
                                    <tr>
                                        <th className="px-5 py-4">
                                            Código
                                        </th>

                                        <th className="px-5 py-4">
                                            Producto
                                        </th>

                                        <th className="px-5 py-4 text-right">
                                            Cantidad
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-800">
                                    {pedido.detalles.map(
                                        (detalle, indice) => {
                                            const producto =
                                                productos[indice];

                                            return (
                                                <tr
                                                    key={
                                                        detalle.id
                                                    }
                                                >
                                                    <td className="px-5 py-4 font-mono text-amber-400">
                                                        {producto?.codigo ??
                                                            "—"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p className="font-semibold text-white">
                                                            {producto?.nombre ??
                                                                "Producto no disponible"}
                                                        </p>

                                                        {producto && (
                                                            <p className="mt-1 text-xs text-slate-400">
                                                                {
                                                                    producto.marca
                                                                }
                                                            </p>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-right text-lg font-bold">
                                                        {
                                                            detalle.cantidad
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {pedido.observaciones && (
                            <div className="mt-6 rounded-xl bg-slate-950 p-5">
                                <p className="text-sm text-slate-500">
                                    Observaciones
                                </p>

                                <p className="mt-2 leading-6 text-slate-300">
                                    {pedido.observaciones}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}