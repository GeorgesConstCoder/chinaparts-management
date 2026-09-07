import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerProductos } from "@/lib/productos";
import { obtenerInventario } from "@/lib/inventario";
import { obtenerCantidadDisponible } from "@/lib/disponibilidad";

type ProductoPageProps = {
    params: Promise<{ id: string }>;
};

export default async function ProductoPage({
    params,
}: ProductoPageProps) {
    const { id } = await params;

    const productos = await obtenerProductos();
    const inventario = await obtenerInventario();

    const producto = productos.find((item) => item.id === id);

    if (!producto) {
        notFound();
    }

    const registro = inventario.find(
        (item) => item.productoId === producto.id
    );

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/inventario"
                    className="text-sm text-amber-400 hover:underline"
                >
                    ← Volver al inventario
                </Link>

                <article className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">
                    <p className="text-sm uppercase text-slate-400">
                        {producto.tipo} · {producto.codigo}
                    </p>

                    <h1 className="mt-3 text-3xl font-bold">
                        {producto.nombre}
                    </h1>

                    <p className="mt-2 text-amber-400">
                        {producto.marca}
                    </p>

                    <p className="mt-6 text-slate-300">
                        {producto.descripcion}
                    </p>

                    <div className="mt-8 rounded-xl bg-slate-950 p-5">
                        {registro ? (
                            <>
                                <p className="text-slate-400">
                                    Unidades disponibles
                                </p>

                                <p className="mt-2 text-4xl font-bold">
                                    {obtenerCantidadDisponible(registro)}
                                </p>

                                <p className="mt-4 text-sm text-slate-400">
                                    Existencias: {registro.existencia} · Reservadas:{" "}
                                    {registro.cantidadReservada}
                                </p>
                            </>
                        ) : (
                            <p className="text-slate-400">
                                Sin cantidades registradas.
                            </p>
                        )}
                    </div>
                </article>
            </div>
        </main>
    );
}