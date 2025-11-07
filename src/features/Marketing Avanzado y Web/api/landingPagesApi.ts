// Tipos para Landing Pages
export interface SEOMeta {
  titulo: string;
  descripcion: string;
}

export interface LandingPageStats {
  visitas: number;
  conversiones: number;
}

export interface BloqueContenido {
  id: string;
  tipo: string;
  contenido: any;
}

export interface ContenidoJson {
  bloques: BloqueContenido[];
}

export interface LandingPage {
  _id: string;
  nombre: string;
  slug: string;
  contenidoJson: ContenidoJson;
  seoMeta: SEOMeta;
  estado: 'borrador' | 'publicada';
  clinicaId: string;
  createdAt: string;
  updatedAt: string;
  stats: LandingPageStats;
}

export interface CrearLandingPageRequest {
  nombre: string;
  plantillaId?: string;
}

export interface ActualizarLandingPageRequest {
  nombre?: string;
  contenidoJson?: ContenidoJson;
  seoMeta?: SEOMeta;
  estado?: 'borrador' | 'publicada';
  slug?: string;
}

export interface LeadRequest {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

const API_BASE_URL = '/api/landing-pages';

/**
 * Crea una nueva landing page en estado de borrador
 */
export async function crearLandingPage(
  datos: CrearLandingPageRequest
): Promise<LandingPage> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al crear la landing page');
  }

  return response.json();
}

/**
 * Obtiene una lista de todas las landing pages
 */
export async function obtenerLandingPages(): Promise<LandingPage[]> {
  const response = await fetch(API_BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las landing pages');
  }

  return response.json();
}

/**
 * Obtiene los datos completos de una landing page específica
 */
export async function obtenerLandingPage(id: string): Promise<LandingPage> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener la landing page');
  }

  return response.json();
}

/**
 * Actualiza una landing page
 */
export async function actualizarLandingPage(
  id: string,
  datos: ActualizarLandingPageRequest
): Promise<LandingPage> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la landing page');
  }

  return response.json();
}

/**
 * Guarda una landing page (crea o actualiza según si tiene _id)
 */
export async function guardarLandingPage(landingPage: LandingPage): Promise<LandingPage> {
  if (landingPage._id) {
    return actualizarLandingPage(landingPage._id, {
      nombre: landingPage.nombre,
      contenidoJson: landingPage.contenidoJson,
      seoMeta: landingPage.seoMeta,
      estado: landingPage.estado,
      slug: landingPage.slug,
    });
  } else {
    return crearLandingPage({
      nombre: landingPage.nombre,
    });
  }
}

/**
 * Elimina una landing page
 */
export async function eliminarLandingPage(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la landing page');
  }
}

/**
 * Obtiene una landing page pública por su slug
 */
export async function obtenerLandingPagePublica(slug: string): Promise<LandingPage> {
  const response = await fetch(`${API_BASE_URL}/public/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener la landing page pública');
  }

  return response.json();
}

/**
 * Captura un lead desde una landing page pública
 */
export async function capturarLead(
  landingPageId: string,
  datosLead: LeadRequest
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/leads/${landingPageId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosLead),
  });

  if (!response.ok) {
    throw new Error('Error al enviar el formulario');
  }
}



