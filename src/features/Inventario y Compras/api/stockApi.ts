// API para gestión de stock e inventario
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface ProductoInventario {
  _id?: string;
  nombre: string;
  sku: string;
  descripcion?: string;
  categoria: string;
  proveedor: {
    _id: string;
    nombre: string;
  };
  unidadMedida: string;
  cantidadActual: number;
  puntoReorden: number;
  costoUnitario: number;
  fechaCaducidad?: string;
  ubicacion?: string;
  sede: {
    _id: string;
    nombre: string;
  };
  activo: boolean;
}

export interface MovimientoInventario {
  _id?: string;
  producto: string | ProductoInventario;
  tipoMovimiento: 'compra' | 'uso_clinico' | 'ajuste_manual_entrada' | 'ajuste_manual_salida' | 'devolucion';
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  usuario: {
    _id: string;
    nombre: string;
  };
  fecha: string;
  motivo?: string;
  referencia?: string;
}

export interface FiltrosStock {
  page?: number;
  limit?: number;
  search?: string;
  categoria?: string;
  proveedorId?: string;
  sedeId?: string;
  bajo_stock?: boolean;
}

export interface RespuestaStock {
  productos: ProductoInventario[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NuevoProducto {
  nombre: string;
  sku: string;
  descripcion?: string;
  categoria: string;
  proveedor: string;
  unidadMedida: string;
  cantidadInicial: number;
  puntoReorden: number;
  costoUnitario: number;
  fechaCaducidad?: string;
  ubicacion?: string;
  sedeId: string;
}

export interface AjusteStock {
  productoId: string;
  nuevaCantidad: number;
  motivo: string;
  usuarioId: string;
}

// Obtener lista de productos con filtros y paginación
export async function obtenerStockCompleto(filtros: FiltrosStock = {}): Promise<RespuestaStock> {
  const params = new URLSearchParams();
  
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.search) params.append('search', filtros.search);
  if (filtros.categoria) params.append('categoria', filtros.categoria);
  if (filtros.proveedorId) params.append('proveedorId', filtros.proveedorId);
  if (filtros.sedeId) params.append('sedeId', filtros.sedeId);
  if (filtros.bajo_stock !== undefined) params.append('bajo_stock', filtros.bajo_stock.toString());

  const response = await fetch(`${API_BASE_URL}/inventario/stock?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el stock');
  }

  return response.json();
}

// Crear un nuevo producto
export async function crearProducto(producto: NuevoProducto): Promise<ProductoInventario> {
  const response = await fetch(`${API_BASE_URL}/inventario/stock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(producto),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el producto' }));
    throw new Error(error.message || 'Error al crear el producto');
  }

  return response.json();
}

// Obtener detalle de un producto
export async function obtenerDetalleProducto(id: string): Promise<ProductoInventario> {
  const response = await fetch(`${API_BASE_URL}/inventario/stock/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el detalle del producto');
  }

  return response.json();
}

// Actualizar un producto
export async function actualizarProducto(
  id: string,
  datos: Partial<NuevoProducto>
): Promise<ProductoInventario> {
  const response = await fetch(`${API_BASE_URL}/inventario/stock/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el producto' }));
    throw new Error(error.message || 'Error al actualizar el producto');
  }

  return response.json();
}

// Realizar ajuste de stock
export async function realizarAjusteStock(ajuste: AjusteStock): Promise<{
  producto: ProductoInventario;
  movimiento: MovimientoInventario;
}> {
  const response = await fetch(`${API_BASE_URL}/inventario/stock/ajuste`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(ajuste),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al realizar el ajuste' }));
    throw new Error(error.message || 'Error al realizar el ajuste');
  }

  return response.json();
}

// Obtener historial de movimientos de un producto
export async function obtenerHistorialMovimientos(id: string): Promise<MovimientoInventario[]> {
  const response = await fetch(`${API_BASE_URL}/inventario/stock/${id}/movimientos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el historial de movimientos');
  }

  return response.json();
}


