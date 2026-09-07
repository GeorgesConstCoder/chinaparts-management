import Link from "next/link";
import { redirect } from "next/navigation";
import FormularioPedido from "@/components/pedidos/formulario-pedido";
import { crearClienteSupabase } from "@/lib/supabase/server";
import { obtenerClientes } from "@/lib/clientes";
import { obtenerProductos } from "@/lib/productos";
import { obtenerInventario } from "@/lib/inventario";

type CrearPedidoPageProps = {
    searchParams: Promise<{
        error?: string;
    }>;
};

export default async function CrearPedidoPage({
    searchParams,
}: CrearPedidoPageProps) {
    const { error } = await searchParams;

    const supabase = await crearClienteSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const [clientes, productos, inventario] =
        await Promise.all([
            obtenerClientes(),
            obtenerProductos(),
            obtenerInventario(),
        ]);

    const fechaMinima = new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "America/La_Paz",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    ).format(new Date());

    const hayProductosDisponibles = productos.some(
        (producto) => {
            const registro = inventario.find(
                (item) =>
                    item.productoId === producto.id
            );

            if (!registro) {
                return false;
            }

            return (
                registro.existencia -
                registro.cantidadReservada >
                0
            );
        }
    );

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/pedidos"
                    className="text-sm text-amber-400 hover:underline"
                >
                    ← Volver a pedidos
                </Link>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">
                    <h1 className="text-3xl font-bold">
                        Crear pedido
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Selecciona el cliente, los productos y la
                        fecha prevista de recogida.
                    </p>

                    {clientes.length === 0 ? (
                        <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
                            <p className="text-sm text-amber-200">
                                Necesitas registrar al menos un
                                cliente antes de crear un pedido.
                            </p>

                            <Link
                                href="/clientes/agregar-cliente"
                                className="mt-4 inline-flex rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950"
                            >
                                Agregar cliente
                            </Link>
                        </div>
                    ) : !hayProductosDisponibles ? (
                        <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
                            <p className="text-sm text-amber-200">
                                No existen productos con unidades
                                disponibles para reservar.
                            </p>

                            <Link
                                href="/inventario"
                                className="mt-4 inline-flex rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950"
                            >
                                Revisar inventario
                            </Link>
                        </div>
                    ) : (
                        <FormularioPedido
                            clientes={clientes}
                            productos={productos}
                            inventario={inventario}
                            fechaMinima={fechaMinima}
                            error={error}
                        />
                    )}
                </section>
            </div>
        </main>
    );
}