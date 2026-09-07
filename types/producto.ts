export type TipoProducto = "maquinaria" | "repuesto";

export type Producto = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  marca: string;
  tipo: TipoProducto;
};