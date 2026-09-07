export type Cliente = {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  activo: boolean;
  fechaCreacion: string;
};