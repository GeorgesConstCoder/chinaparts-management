"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { crearClienteSupabase } from "@/lib/supabase/server";

export async function crearProducto(formData: FormData) {
  const codigo = String(formData.get("codigo") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const marca = String(formData.get("marca") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "");

  const descripcion = String(
    formData.get("descripcion") ?? ""
  ).trim();

  const existencia = Number(formData.get("existencia"));

  // Validamos los datos recibidos del formulario.
  if (
    !codigo ||
    !nombre ||
    !marca ||
    !["maquinaria", "repuesto"].includes(tipo) ||
    !Number.isInteger(existencia) ||
    existencia < 0
  ) {
    redirect(
      "/inventario/agregar-producto?error=Revisa los datos ingresados"
    );
  }

  const supabase = await crearClienteSupabase();

  // Comprobamos que exista una sesión.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Creamos el producto y recuperamos su ID.
  const {
    data: producto,
    error: errorProducto,
  } = await supabase
    .from("productos")
    .insert({
      codigo,
      nombre,
      marca,
      tipo,
      descripcion,
    })
    .select("id")
    .single();

  if (errorProducto || !producto) {
    const mensaje =
      errorProducto?.code === "23505"
        ? "Ya existe un producto con ese código"
        : "No se pudo crear el producto";

    redirect(
      `/inventario/agregar-producto?error=${encodeURIComponent(
        mensaje
      )}`
    );
  }

  // Creamos el inventario asociado al producto.
  const { error: errorInventario } = await supabase
    .from("inventario")
    .insert({
      producto_id: producto.id,
      existencia,
      cantidad_reservada: 0,
    });

  if (errorInventario) {
    // Si falla el inventario, eliminamos el producto incompleto.
    await supabase
      .from("productos")
      .delete()
      .eq("id", producto.id);

    redirect(
      "/inventario/agregar-producto?error=No se pudo crear el inventario"
    );
  }

  // Actualizamos la información de la página.
  revalidatePath("/inventario");

  // Volvemos al inventario.
  redirect("/inventario");
}