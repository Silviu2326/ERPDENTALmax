import { UserRole } from '../types/auth';

// Mapeo de emojis a roles del sistema
// 👑 = propietario
// 🧭 = director
// 🦷 = odontologo
// 🪥 = higienista
// 🧑‍⚕️ = auxiliar
// 🤝 = recepcionista
// ☎️ = teleoperador
// 🩻 = tecnico_radiologia
// 🧪 = tecnico_laboratorio
// 💼 = contable
// 🧑‍💼 = rrhh
// 📦 = compras
// 📣 = marketing
// 🧑‍💻 = IT/Seguridad (asignado a director y propietario para seguridad)

// Mapeo de rutas a roles permitidos basado en Estructura.md
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  // Dashboard Principal — 👑🧭
  '/dashboard': ['propietario', 'director'],
  
  // Agenda de Citas y Programación
  // Calendario Principal de Citas — 👑🧭🦷🪥🤝☎️
  '/agenda-citas': ['propietario', 'director', 'odontologo', 'higienista', 'recepcionista', 'teleoperador'],
  '/nueva-cita': ['recepcionista', 'teleoperador', 'odontologo', 'higienista'],
  '/administracion-bloqueos': ['director', 'recepcionista', 'rrhh'],
  '/gestion-disponibilidad': ['director', 'recepcionista', 'rrhh'],
  '/reprogramacion-masiva': ['director', 'recepcionista', 'teleoperador'],
  
  // Gestión de Pacientes e Historia Clínica
  // Listado de Pacientes — 🦷🪥🤝☎️
  '/gestion-pacientes': ['odontologo', 'higienista', 'recepcionista', 'teleoperador'],
  '/nueva-ficha-paciente': ['recepcionista', 'teleoperador'],
  '/paciente-perfil': ['odontologo', 'higienista', 'auxiliar', 'recepcionista'],
  
  // Presupuestos y Planes de Tratamiento
  // Listado de Presupuestos — 🦷🤝💼🧭
  '/presupuestos': ['odontologo', 'recepcionista', 'contable', 'director'],
  '/crear-presupuesto': ['odontologo', 'recepcionista'],
  '/editar-presupuesto': ['odontologo', 'recepcionista'],
  '/plan-tratamiento-builder': ['odontologo'],
  '/simulador-costos': ['odontologo', 'contable', 'director'],
  '/aprobar-presupuesto': ['odontologo', 'recepcionista', 'director'],
  
  // Facturación, Cobros y Contabilidad
  // Panel de Facturación — 💼🧭👑🤝
  '/facturacion-cobros-contabilidad': ['contable', 'director', 'propietario', 'recepcionista'],
  '/nueva-factura': ['recepcionista', 'contable'],
  '/editar-factura': ['contable', 'recepcionista'],
  '/recibos-pagos': ['contable', 'recepcionista'],
  '/anticipos': ['contable', 'recepcionista'],
  '/comisiones-profesional': ['contable', 'director', 'propietario'],
  '/liquidacion-mutuas': ['contable', 'recepcionista', 'director'],
  '/exportacion-contabilidad': ['contable', 'director'], // 🧑‍💻 asignado a director
  
  // Gestión de Mutuas/Seguros de Salud
  '/gestion-mutuas-seguros': ['contable', 'recepcionista', 'director'],
  '/convenios-acuerdos': ['director', 'contable'],
  '/asistente-facturacion': ['contable', 'recepcionista'],
  '/autorizaciones-tratamientos': ['recepcionista', 'odontologo'],
  '/historial-pagos-seguros': ['contable', 'director'],
  
  // Inventario y Compras
  // Control de Stock — 📦🧭🧑‍⚕️
  '/inventario-compras': ['compras', 'director', 'auxiliar'],
  
  // Gestión de Proveedores y Almacén
  '/gestion-proveedores-almacen': ['compras', 'contable'],
  
  // Cuadro de Mandos e Informes
  // Dashboard Principal — 👑🧭
  '/cuadro-mandos-informes': ['propietario', 'director'],
  // Indicadores de Citas — 🧭🤝☎️
  '/informes-configurables': ['director', 'contable', 'compras', 'marketing'],
  
  // Documentación y Protocolos
  // Generador de Documentos — 🦷🤝🧭
  '/documentacion-protocolos': ['odontologo', 'recepcionista', 'director'],
  
  // Integración Radiológica
  // Visor de Radiografías — 🦷🩻
  '/integracion-radiologica': ['odontologo', 'tecnico_radiologia'],
  
  // Portal de Cita Online y Móvil
  // Agenda Mobile (Vista Profesional) — 🦷🪥🤝
  '/portal-cita-online-movil': ['odontologo', 'higienista', 'recepcionista'],
  
  // Pasarela de Pagos y Financiación
  '/pasarela-pagos-financiacion': ['contable', 'recepcionista', 'director'], // 🧑‍💻 asignado a director
  
  // Seguridad y Cumplimiento
  // Registro de Accesos — 🧑‍💻🧭
  '/seguridad-cumplimiento': ['director', 'propietario'], // 🧑‍💻 asignado a director/propietario
  
  // Especialidades Clínicas
  '/especialidades-clinicas': ['odontologo'],
  '/endodoncia-registro': ['odontologo', 'auxiliar'],
  
  // Esterilización y Trazabilidad
  // Registro de Esterilización por Lote — 🧑‍⚕️🧭🧑‍💻
  '/esterilizacion-trazabilidad': ['auxiliar', 'director'], // 🧑‍💻 asignado a director
  '/informes-trazabilidad': ['director'], // 🧑‍💻 asignado a director
  
  // Mantenimiento y Equipamiento
  '/mantenimiento-equipamiento': ['director', 'compras'],
  
  // Encuestas
  '/gestion-encuestas': ['director', 'marketing'], // Basado en contexto
  '/resultados-encuesta': ['director', 'marketing'],
  
  // Teleodontología
  // Sala de Videoconsulta — 🦷👤
  '/teleodontologia': ['odontologo', 'recepcionista', 'teleoperador'],
  
  // Multi-sede y Franquicias
  // Panel Global de Centros — 🧭👑
  '/multi-sede-franquicias': ['director', 'propietario'],
  '/transferencia-pacientes': ['director', 'recepcionista'],
  '/dashboard-sedes': ['director', 'propietario'],
  '/permisos-roles-sede': ['director'], // 🧑‍💻 asignado a director
  
  // Calidad y Auditoría
  // Plan de Calidad (Indicadores) — 🧭👑
  '/calidad-auditoria': ['director', 'propietario'],
  
  // Marketing Avanzado y Web
  // Editor de Landing Pages de Campaña — 📣🧑‍💻
  '/marketing-avanzado-web': ['marketing', 'director'], // 🧑‍💻 asignado a director
  
  // Analítica Avanzada & Data
  // Cohortes de Pacientes (Retención) — 🧭📣
  '/analitica-avanzada-data': ['director', 'marketing'],
  
  // Integraciones y APIs
  // Conectores de Mensajería (SMS/WhatsApp/Email) — 🧑‍💻📣🤝
  '/integraciones-y-apis': ['director', 'propietario'], // 🧑‍💻 asignado a director/propietario
};

// Función para verificar si un usuario puede acceder a una ruta
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  // Si la ruta no está en el mapeo, permitir acceso (para rutas nuevas o no especificadas)
  if (!ROUTE_PERMISSIONS[route]) {
    return true;
  }
  
  // Verificar si el rol del usuario está en la lista de roles permitidos
  return ROUTE_PERMISSIONS[route].includes(userRole);
}

// Función para obtener todas las rutas accesibles para un rol
export function getAccessibleRoutes(userRole: UserRole): string[] {
  return Object.keys(ROUTE_PERMISSIONS).filter(route => 
    ROUTE_PERMISSIONS[route].includes(userRole)
  );
}

