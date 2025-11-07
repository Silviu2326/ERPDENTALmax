// API para gestionar pasarelas de pago (One Pay y Stripe)

export interface ConfiguracionOnePay {
  id?: string;
  apiKey: string;
  sharedSecret: string;
  entorno: 'integracion' | 'produccion';
  activa: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransaccionOnePay {
  id?: string;
  pacienteId: string;
  tratamientoId?: string;
  monto: number;
  estado: 'PENDIENTE' | 'PAGADO' | 'RECHAZADO' | 'ANULADO';
  ordenCompra: string;
  externalUniqueNumber?: string;
  qrCodeData?: string;
  descripcion?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CrearTransaccionOnePayRequest {
  monto: number;
  ordenCompra: string;
  descripcion: string;
  pacienteId: string;
  tratamientoId?: string;
}

export interface CrearTransaccionOnePayResponse {
  qrCodeAsBase64: string;
  ott: string;
  externalUniqueNumber: string;
  issuedAt: string;
}

export interface EstadoTransaccionOnePay {
  estado: 'PAGADO' | 'RECHAZADO' | 'PENDIENTE' | 'ANULADO';
  ordenCompra: string;
  fechaActualizacion?: string;
}

export interface ConfiguracionStripe {
  id?: string;
  publishableKey: string;
  secretKey: string;
  webhookSecret?: string;
  entorno: 'test' | 'live';
  activa: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Funciones para One Pay
export async function obtenerConfiguracionOnePay(): Promise<ConfiguracionOnePay | null> {
  try {
    const response = await fetch('/api/integraciones/pasarelas/onepay/configuracion', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Error al obtener la configuración de One Pay');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener configuración One Pay:', error);
    throw error;
  }
}

export async function guardarConfiguracionOnePay(
  configuracion: Omit<ConfiguracionOnePay, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ConfiguracionOnePay> {
  try {
    const response = await fetch('/api/integraciones/pasarelas/onepay/configuracion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(configuracion),
    });

    if (!response.ok) {
      throw new Error('Error al guardar la configuración de One Pay');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al guardar configuración One Pay:', error);
    throw error;
  }
}

export async function crearTransaccionOnePay(
  datos: CrearTransaccionOnePayRequest
): Promise<CrearTransaccionOnePayResponse> {
  try {
    const response = await fetch('/api/integraciones/pasarelas/onepay/crear-transaccion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error('Error al crear la transacción de One Pay');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear transacción One Pay:', error);
    throw error;
  }
}

export async function consultarEstadoTransaccionOnePay(
  ordenCompra: string
): Promise<EstadoTransaccionOnePay> {
  try {
    const response = await fetch(
      `/api/integraciones/pasarelas/onepay/estado-transaccion/${ordenCompra}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al consultar el estado de la transacción');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al consultar estado transacción One Pay:', error);
    throw error;
  }
}

export async function obtenerTransaccionesOnePay(params?: {
  page?: number;
  limit?: number;
  estado?: string;
}): Promise<{ transacciones: TransaccionOnePay[]; total: number }> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.estado) queryParams.append('estado', params.estado);

    const response = await fetch(
      `/api/integraciones/pasarelas/onepay/transacciones?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener las transacciones de One Pay');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener transacciones One Pay:', error);
    throw error;
  }
}

// Funciones para Stripe
export async function obtenerConfiguracionStripe(): Promise<ConfiguracionStripe | null> {
  try {
    const response = await fetch('/api/integraciones/pasarelas/stripe/configuracion', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Error al obtener la configuración de Stripe');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener configuración Stripe:', error);
    throw error;
  }
}

export async function guardarConfiguracionStripe(
  configuracion: Omit<ConfiguracionStripe, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ConfiguracionStripe> {
  try {
    const response = await fetch('/api/integraciones/pasarelas/stripe/configuracion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(configuracion),
    });

    if (!response.ok) {
      throw new Error('Error al guardar la configuración de Stripe');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al guardar configuración Stripe:', error);
    throw error;
  }
}

export async function probarConexionOnePay(): Promise<{ exito: boolean; mensaje: string }> {
  try {
    const response = await fetch('/api/integraciones/pasarelas/onepay/probar-conexion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al probar la conexión con One Pay');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al probar conexión One Pay:', error);
    throw error;
  }
}

export async function probarConexionStripe(): Promise<{ exito: boolean; mensaje: string }> {
  try {
    const response = await fetch('/api/integraciones/pasarelas/stripe/probar-conexion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al probar la conexión con Stripe');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al probar conexión Stripe:', error);
    throw error;
  }
}



