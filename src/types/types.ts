export type Categoria = {
  id: string;
  nombre: string;
};

export type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoriaId: string;
  caracteristicas: string[];
  descuento: number;
  destacado: boolean;
};