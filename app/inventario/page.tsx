import Link from "next/link";
import { redirect } from "next/navigation";
import { crearClienteSupabase } from "@/lib/supabase/server";
import { obtenerProductos } from "@/lib/productos";
import { obtenerInventario } from "@/lib/inventario";
import { cerrarSesion } from "@/app/login/actions";
import ProductosLista from "@/components/productos/productos-lista";

export default async function InventarioPage() {
    const supabase = await crearClienteSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    let productos: Awaited<ReturnType<typeof obtenerProductos>> = [];
    let inventario: Awaited<ReturnType<typeof obtenerInventario>> = [];
    let errorCarga: string | null = null;

    try {
        [productos, inventario] = await Promise.all([
            obtenerProductos(),
            obtenerInventario(),
        ]);
    } catch (err: unknown) {
        errorCarga =
            err instanceof Error
                ? err.message
                : "Error al consultar la base de datos de Supabase";
    }

    return (
        <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-[#040711] px-5 py-8 text-white sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Top Navigation & Profile Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 font-extrabold text-slate-950 shadow-md shadow-amber-500/20">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold tracking-tight text-white sm:text-lg">
                                    China<span className="text-amber-400">Parts</span>
                                </span>
                                <span className="rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                                    Enterprise
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Sistema de Gestión de Maquinaria
                            </p>
                        </div>
                    </div>

                    {/* User profile & Actions */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>

                            <div className="text-left">
                                <p className="max-w-[150px] truncate text-xs font-medium text-slate-200 sm:max-w-[200px]">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <form action={cerrarSesion}>
                            <button
                                type="submit"
                                title="Cerrar sesión"
                                className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Header Action Section */}
                <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Inventario General
                        </h1>
                        <p className="mt-1 text-sm text-slate-400 sm:text-base">
                            Monitoreo y control en tiempo real de maquinaria pesada, repuestos y existencias.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/inventario/agregar-producto"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all duration-200 hover:from-amber-300 hover:to-amber-400 hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Agregar producto</span>
                        </Link>
                    </div>
                </header>

                {/* Graceful Database Error Alert */}
                {errorCarga && (
                    <div className="rounded-2xl border border-rose-900/60 bg-rose-950/40 p-6 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-base font-bold text-rose-200">
                                    Permiso denegado en la base de datos de Supabase
                                </h3>
                                <p className="text-sm text-rose-300/90">
                                    {errorCarga}
                                </p>
                                <p className="text-xs text-rose-300/70">
                                    Para solucionarlo, ejecuta en el SQL Editor de Supabase:{" "}
                                    <code className="rounded bg-rose-950 px-2 py-0.5 font-mono text-rose-200">
                                        GRANT SELECT ON public.productos, public.inventario TO authenticated;
                                    </code>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Listing Component */}
                <ProductosLista
                    productos={productos}
                    inventario={inventario}
                />
            </div>
        </main>
    );
}