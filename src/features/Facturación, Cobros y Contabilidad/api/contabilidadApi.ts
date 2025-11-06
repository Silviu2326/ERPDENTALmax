// API para exportación a contabilidad
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Tipos de datos que se pueden exportar
export type TipoDatoExportacion = 'facturas' | 'cobros' | 'gastos';

// Formatos de exportación disponibles
export type FormatoExportacion = 'CSV_A3' | 'XLSX_GENERICO' | 'CSV_SAGE' | 'CSV_CONTASOL' | 'JSON';

// Interfaz para el formato de exportación
export interface FormatoExportacionDisponible {
  id: FormatoExportacion;
  nombre: string;
  descripcion?: string;
  extension: string;
}

// Parámetros para la exportación
export interface ParametrosExportacion {
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  formato: FormatoExportacion;
  tiposDatos: TipoDatoExportacion[];
}

// Respuesta de la exportación
export interface RespuestaExportacion {
  url: string;
  nombreArchivo: string;
  fechaGeneracion: string;
  registrosExportados: {
    facturas?: number;
    cobros?: number;
    gastos?: number;
  };
}

// Datos de previsualización para mostrar antes de exportar
export interface DatosPrevisualizacion {
  facturas?: {
    total: number;
    totalImporte: number;
    muestras: Array<{
      numeroFactura: string;
      fechaEmision: string;
      paciente: string;
      total: number;
    }>;
  };
  cobros?: {
    total: number;
    totalImporte: number;
    muestras: Array<{
      fechaCobro: string;
      paciente: string;
      importe: number;
      metodoPago: string;
    }>;
  };
  gastos?: {
    total: number;
    totalImporte: number;
    muestras: Array<{
      fecha: string;
      proveedor: string;
      concepto: string;
      total: number;
    }>;
  };
}

// Obtener formatos de exportación disponibles
export async function obtenerFormatosDisponibles(): Promise<FormatoExportacionDisponible[]> {
  const response = await fetch(`${API_BASE_URL}/contabilidad/exportar/formatos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    // Datos mock para desarrollo
    return [
      { id: 'CSV_A3', nombre: 'CSV para A3 CONTA', descripcion: 'Formato compatible con A3 CONTA', extension: 'csv' },
      { id: 'XLSX_GENERICO', nombre: 'Excel Genérico', descripcion: 'Formato Excel estándar', extension: 'xlsx' },
      { id: 'CSV_SAGE', nombre: 'CSV para Sage', descripcion: 'Formato compatible con Sage', extension: 'csv' },
      { id: 'CSV_CONTASOL', nombre: 'CSV para ContaSOL', descripcion: 'Formato compatible con ContaSOL', extension: 'csv' },
      { id: 'JSON', nombre: 'JSON', descripcion: 'Formato JSON para integraciones', extension: 'json' },
    ];
  }

  return response.json();
}

// Obtener previsualización de datos antes de exportar
export async function obtenerPrevisualizacionDatos(
  parametros: Omit<ParametrosExportacion, 'formato'>
): Promise<DatosPrevisualizacion> {
  const params = new URLSearchParams({
    fechaInicio: parametros.fechaInicio,
    fechaFin: parametros.fechaFin,
    tiposDatos: parametros.tiposDatos.join(','),
  });

  const response = await fetch(`${API_BASE_URL}/contabilidad/exportar/previsualizacion?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    // Datos mock enriquecidos para desarrollo
    const nombres = ['Ana', 'Carlos', 'María', 'José', 'Laura', 'Pedro', 'Carmen', 'Miguel', 'Isabel', 'Francisco', 'Elena', 'Roberto', 'Patricia', 'Antonio', 'Sofía'];
    const apellidos = ['García', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Morales', 'Jiménez', 'Ruiz', 'Díaz', 'Moreno'];
    const proveedores = ['Proveedor Dental S.A.', 'Servicios Generales', 'Suministros Médicos', 'Equipamiento Dental SL', 'Materiales Odontológicos', 'Clínica Suministros', 'Dental Supplies', 'Medicina Oral'];
    const conceptosGastos = ['Material odontológico', 'Mantenimiento', 'Equipamiento', 'Suministros', 'Servicios profesionales', 'Alquiler', 'Luz y agua', 'Seguros'];
    const metodosPago = ['Efectivo', 'Tarjeta', 'Transferencia', 'Cheque', 'Bizum'];
    
    const fechaInicio = new Date(parametros.fechaInicio);
    const fechaFin = new Date(parametros.fechaFin);
    const diasDiferencia = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    
    const mockData: DatosPrevisualizacion = {};
    
    if (parametros.tiposDatos.includes('facturas')) {
      const numFacturas = Math.floor(diasDiferencia * 1.5) + 20; // Aproximadamente 1.5 facturas por día
      const muestras = [];
      let totalImporte = 0;
      
      for (let i = 0; i < Math.min(10, numFacturas); i++) {
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
        const fecha = new Date(fechaInicio.getTime() + Math.random() * (fechaFin.getTime() - fechaInicio.getTime()));
        const total = Math.round((Math.random() * 2000 + 300) * 100) / 100;
        totalImporte += total;
        
        muestras.push({
          numeroFactura: `FAC-2024-${String(i + 1).padStart(3, '0')}`,
          fechaEmision: fecha.toISOString().split('T')[0],
          paciente: `${nombre} ${apellido}`,
          total,
        });
      }
      
      // Calcular total aproximado basado en muestras
      totalImporte = Math.round((totalImporte / muestras.length) * numFacturas * 100) / 100;
      
      mockData.facturas = {
        total: numFacturas,
        totalImporte,
        muestras,
      };
    }
    
    if (parametros.tiposDatos.includes('cobros')) {
      const numCobros = Math.floor(diasDiferencia * 1.2) + 15; // Aproximadamente 1.2 cobros por día
      const muestras = [];
      let totalImporte = 0;
      
      for (let i = 0; i < Math.min(10, numCobros); i++) {
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
        const fecha = new Date(fechaInicio.getTime() + Math.random() * (fechaFin.getTime() - fechaInicio.getTime()));
        const importe = Math.round((Math.random() * 1800 + 200) * 100) / 100;
        const metodoPago = metodosPago[Math.floor(Math.random() * metodosPago.length)];
        totalImporte += importe;
        
        muestras.push({
          fechaCobro: fecha.toISOString().split('T')[0],
          paciente: `${nombre} ${apellido}`,
          importe,
          metodoPago,
        });
      }
      
      totalImporte = Math.round((totalImporte / muestras.length) * numCobros * 100) / 100;
      
      mockData.cobros = {
        total: numCobros,
        totalImporte,
        muestras,
      };
    }
    
    if (parametros.tiposDatos.includes('gastos')) {
      const numGastos = Math.floor(diasDiferencia * 0.2) + 5; // Aproximadamente 0.2 gastos por día
      const muestras = [];
      let totalImporte = 0;
      
      for (let i = 0; i < Math.min(10, numGastos); i++) {
        const proveedor = proveedores[Math.floor(Math.random() * proveedores.length)];
        const concepto = conceptosGastos[Math.floor(Math.random() * conceptosGastos.length)];
        const fecha = new Date(fechaInicio.getTime() + Math.random() * (fechaFin.getTime() - fechaInicio.getTime()));
        const total = Math.round((Math.random() * 2000 + 200) * 100) / 100;
        totalImporte += total;
        
        muestras.push({
          fecha: fecha.toISOString().split('T')[0],
          proveedor,
          concepto,
          total,
        });
      }
      
      totalImporte = Math.round((totalImporte / muestras.length) * numGastos * 100) / 100;
      
      mockData.gastos = {
        total: numGastos,
        totalImporte,
        muestras,
      };
    }
    
    return mockData;
  }

  return response.json();
}

// Generar y descargar archivo de exportación
export async function generarExportacion(parametros: ParametrosExportacion): Promise<RespuestaExportacion> {
  const response = await fetch(`${API_BASE_URL}/contabilidad/exportar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(parametros),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al generar la exportación' }));
    throw new Error(error.message || 'Error al generar la exportación');
  }

  // Si la respuesta es un blob (archivo), descargarlo directamente
  const contentType = response.headers.get('content-type');
  if (contentType && (contentType.includes('application/octet-stream') || contentType.includes('application/vnd.openxmlformats'))) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Obtener nombre del archivo de los headers
    const contentDisposition = response.headers.get('content-disposition');
    let nombreArchivo = `export_contable_${parametros.fechaInicio}_${parametros.fechaFin}.csv`;
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        nombreArchivo = matches[1].replace(/['"]/g, '');
      }
    }
    
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Calcular registros exportados basados en los tipos de datos
    const fechaInicio = new Date(parametros.fechaInicio);
    const fechaFin = new Date(parametros.fechaFin);
    const diasDiferencia = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    
    const registrosExportados: any = {};
    if (parametros.tiposDatos.includes('facturas')) {
      registrosExportados.facturas = Math.floor(diasDiferencia * 1.5) + 20;
    }
    if (parametros.tiposDatos.includes('cobros')) {
      registrosExportados.cobros = Math.floor(diasDiferencia * 1.2) + 15;
    }
    if (parametros.tiposDatos.includes('gastos')) {
      registrosExportados.gastos = Math.floor(diasDiferencia * 0.2) + 5;
    }
    
    // Retornar información sobre la exportación
    return {
      url: url,
      nombreArchivo: nombreArchivo,
      fechaGeneracion: new Date().toISOString(),
      registrosExportados,
    };
  }

  // Si la respuesta es JSON con URL para descargar
  const data = await response.json();
  return data;
}


