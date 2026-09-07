"use client";

import Link from "next/link";
import { useState } from "react";
import { crearPedido } from "@/app/pedidos/crear-pedido/actions";
import type { Cliente } from "@/types/cliente";
import type { Inventario } from "@/types/inventario";
import type { Producto } from "@/types/producto";
import type { NuevoDetallePedido } from "@/types/pedido";

type FormularioPedidoProps = {
    clientes: Cliente[];
    productos: Producto[];
    inventario: Inventario[];
    fechaMinima: string;
    error?: string;
};

export default function FormularioPedido({
    clientes,
    productos,
    inventario,
    fechaMinima,
    error,
}: FormularioPedidoProps) {
    const [detalles, setDetalles] = useState<
        NuevoDetallePedido[]
    >([
        {
            productoId: "",
            cantidad: 1,
        },
    ]);

    const obtenerDisponible = (
        productoId: string
    ): number => {
        const registro = inventario.find(
            (item) => item.productoId === productoId
        );

        if (!registro) {
            return 0;
        }

        return (
            registro.existencia -
            registro.cantidadReservada
        );
    };

    const actualizarProducto = (
        posicion: number,
        productoId: string
    ) => {
        setDetalles((actuales) =>
            actuales.map((detalle, indice) =>
                indice === posicion
                    ? {
                        productoId,
                        cantidad: 1,
                    }
                    : detalle
            )
        );
    };

    const actualizarCantidad = (
        posicion: number,
        cantidad: number
    ) => {
        setDetalles((actuales) =>
            actuales.map((detalle, indice) =>
                indice === posicion
                    ? {
                        ...detalle,
                        cantidad,
                    }
                    : detalle
            )
        );
    };

    const agregarProducto = () => {
        setDetalles((actuales) => [
            ...actuales,
            {
                productoId: "",
                cantidad: 1,
            },
        ]);
    };

    const quitarProducto = (posicion: number) => {
        setDetalles((actuales) =>
            actuales.filter(
                (_, indice) => indice !== posicion
            )
        );
    };

    const detallesParaEnviar = detalles.filter(
        (detalle) => detalle.productoId
    );

    const estiloCampo =
        "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400";

    return (
        <form
            action={crearPedido}
            className="mt-8 space-y-6"
        >
            <input
                type="hidden"
                name="detalles"
                value={JSON.stringify(detallesParaEnviar)}
            />

            {error && (
                <p className="rounded-xl border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
                    {error}
                </p>
            )}

            <label className="block text-sm text-slate-300">
                Cliente

                <select
                    name="clienteId"
                    required
                    defaultValue=""
                    className={estiloCampo}
                >
                    <option value="" disabled>
                        Selecciona un cliente
                    </option>

                    {clientes.map((cliente) => (
                        <option
                            key={cliente.id}
                            value={cliente.id}
                        >
                            {cliente.nombre} —{" "}
                            {cliente.telefono}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block text-sm text-slate-300">
                Fecha prevista de recogida

                <input
                    type="date"
                    name="fechaRecogidaPrevista"
                    required
                    min={fechaMinima}
                    defaultValue={fechaMinima}
                    className={estiloCampo}
                />
            </label>

            <section>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="font-semibold text-white">
                            Productos del pedido
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Las cantidades se reservarán al guardar.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={agregarProducto}
                        className="rounded-lg border border-amber-400 px-3 py-2 text-sm font-semibold text-amber-400 transition hover:bg-amber-400 hover:text-slate-950"
                    >
                        + Agregar
                    </button>
                </div>

                <div className="mt-4 space-y-4">
                    {detalles.map((detalle, posicion) => {
                        const disponible =
                            obtenerDisponible(
                                detalle.productoId
                            );

                        return (
                            <div
                                key={posicion}
                                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                            >
                                <div className="grid gap-4 sm:grid-cols-[1fr_140px_auto] sm:items-end">
                                    <label className="block text-sm text-slate-300">
                                        Producto

                                        <select
                                            value={
                                                detalle.productoId
                                            }
                                            onChange={(evento) =>
                                                actualizarProducto(
                                                    posicion,
                                                    evento.target
                                                        .value
                                                )
                                            }
                                            required
                                            className={
                                                estiloCampo
                                            }
                                        >
                                            <option
                                                value=""
                                                disabled
                                            >
                                                Selecciona un
                                                producto
                                            </option>

                                            {productos.map(
                                                (producto) => {
                                                    const cantidad =
                                                        obtenerDisponible(
                                                            producto.id
                                                        );

                                                    const usadoEnOtraFila =
                                                        detalles.some(
                                                            (
                                                                item,
                                                                indice
                                                            ) =>
                                                                indice !==
                                                                posicion &&
                                                                item.productoId ===
                                                                producto.id
                                                        );

                                                    return (
                                                        <option
                                                            key={
                                                                producto.id
                                                            }
                                                            value={
                                                                producto.id
                                                            }
                                                            disabled={
                                                                cantidad <=
                                                                0 ||
                                                                usadoEnOtraFila
                                                            }
                                                        >
                                                            {
                                                                producto.codigo
                                                            }{" "}
                                                            —{" "}
                                                            {
                                                                producto.nombre
                                                            }{" "}
                                                            (
                                                            {
                                                                cantidad
                                                            }{" "}
                                                            disponibles)
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </label>

                                    <label className="block text-sm text-slate-300">
                                        Cantidad

                                        <input
                                            type="number"
                                            min="1"
                                            max={
                                                disponible ||
                                                undefined
                                            }
                                            step="1"
                                            value={
                                                detalle.cantidad
                                            }
                                            onChange={(evento) =>
                                                actualizarCantidad(
                                                    posicion,
                                                    Number(
                                                        evento
                                                            .target
                                                            .value
                                                    )
                                                )
                                            }
                                            required
                                            className={
                                                estiloCampo
                                            }
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            quitarProducto(
                                                posicion
                                            )
                                        }
                                        disabled={
                                            detalles.length === 1
                                        }
                                        className="h-12 rounded-xl border border-red-500/40 px-4 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        Quitar
                                    </button>
                                </div>

                                {detalle.productoId && (
                                    <p className="mt-3 text-xs text-slate-400">
                                        Máximo disponible:{" "}
                                        <strong className="text-white">
                                            {disponible}
                                        </strong>
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <label className="block text-sm text-slate-300">
                Observaciones{" "}
                <span className="text-slate-500">
                    (opcional)
                </span>

                <textarea
                    name="observaciones"
                    rows={4}
                    placeholder="Indicaciones para la entrega o recogida..."
                    className={estiloCampo}
                />
            </label>

            <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <Link
                    href="/pedidos"
                    className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-center font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                    Cancelar
                </Link>

                <button
                    type="submit"
                    className="flex-1 rounded-xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
                >
                    Crear y reservar pedido
                </button>
            </div>
        </form>
    );
}