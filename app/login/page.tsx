import { iniciarSesion } from "./actions";

type LoginPageProps = {
    searchParams: Promise<{
        error?: string;
    }>;
};

export default async function LoginPage({
    searchParams,
}: LoginPageProps) {
    const { error } = await searchParams;

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
                    ChinaParts
                </p>

                <h1 className="mt-3 text-3xl font-bold">
                    Iniciar sesión
                </h1>

                <p className="mt-2 text-slate-400">
                    Ingresa para administrar el inventario.
                </p>

                {error && (
                    <p className="mt-5 rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300">
                        {error}
                    </p>
                )}

                <form action={iniciarSesion} className="mt-8 space-y-5">
                    <label className="block text-sm text-slate-300">
                        Correo electrónico

                        <input
                            type="email"
                            name="email"
                            required
                            autoComplete="email"
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
                        />
                    </label>

                    <label className="block text-sm text-slate-300">
                        Contraseña

                        <input
                            type="password"
                            name="password"
                            required
                            autoComplete="current-password"
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
                        />
                    </label>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 hover:bg-amber-300"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </main>
    );
}