import { crearClienteSupabase } from "@/lib/supabase/server";

export default async function DiagnosticoPage() {
    const supabase = await crearClienteSupabase();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    return (
        <main className="min-h-screen bg-slate-950 p-10 text-white">
            <h1 className="text-2xl font-bold">
                Diagnóstico de sesión
            </h1>

            <div className="mt-6 space-y-3 rounded-xl bg-slate-900 p-6">
                <p>
                    Sesión:{" "}
                    <strong>
                        {user ? "Iniciada correctamente" : "No iniciada"}
                    </strong>
                </p>

                <p>
                    User UID:{" "}
                    <code className="text-amber-400">
                        {user?.id ?? "No disponible"}
                    </code>
                </p>

                <p>
                    Error:{" "}
                    <code className="text-red-400">
                        {error?.message ?? "Ninguno"}
                    </code>
                </p>
            </div>
        </main>
    );
}