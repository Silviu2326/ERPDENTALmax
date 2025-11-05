# Seguimiento de Campañas

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad de 'Seguimiento de Campañas' es una herramienta estratégica diseñada para que las clínicas dentales puedan planificar, ejecutar y analizar la efectividad de sus iniciativas de marketing. Aunque se encuentra bajo el módulo padre de 'Gestión de Proveedores y Almacén', su propósito trasciende la simple gestión de material promocional; se enfoca en el control y optimización del recurso más valioso: la inversión en marketing para la adquisición de nuevos pacientes. Este módulo permite al personal de marketing o a la dirección crear campañas detalladas, asignando presupuestos, definiendo canales (ej: redes sociales, Google Ads, flyers, eventos locales), y estableciendo periodos de actividad. La clave de su funcionamiento reside en la capacidad de vincular directamente a los nuevos pacientes con la campaña que los atrajo. Al registrar un paciente, el personal de recepción puede seleccionar la campaña de origen, cerrando el ciclo de seguimiento. El sistema agrega estos datos para ofrecer un panel de control (dashboard) visual e intuitivo con métricas fundamentales como el Costo por Adquisición (CPA), el Retorno de la Inversión (ROI), el número de nuevos pacientes por campaña y los ingresos generados por estos. Para el Director General de una red multisede, esta herramienta es vital para comparar el rendimiento entre clínicas, asignar presupuestos de marketing de manera más eficiente y tomar decisiones basadas en datos concretos sobre qué estrategias funcionan mejor.

## 👥 Roles de Acceso

- Marketing / CRM
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Esta funcionalidad se implementa dentro de la feature 'gestion-proveedores-almacen'. La carpeta '/pages' contiene el componente principal 'SeguimientoCampanasPage.tsx', que actúa como el dashboard general, y una página de detalle 'DetalleCampanaPage.tsx'. La carpeta '/components' alberga los elementos de UI reutilizables como 'ListaCampanasTable' para mostrar los datos, 'ModalCrearEditarCampana' para la gestión de campañas y 'GraficoRendimientoCampana' para la visualización de métricas. Finalmente, la carpeta '/apis' contiene las funciones que realizan las llamadas a los endpoints del backend para obtener, crear, actualizar y eliminar datos de las campañas.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/SeguimientoCampanasPage.tsx`
- `/features/gestion-proveedores-almacen/pages/DetalleCampanaPage.tsx`
- `/features/gestion-proveedores-almacen/components/CampanaDashboard.tsx`
- `/features/gestion-proveedores-almacen/components/ListaCampanasTable.tsx`
- `/features/gestion-proveedores-almacen/components/ModalCrearEditarCampana.tsx`
- `/features/gestion-proveedores-almacen/components/GraficoRendimientoCampana.tsx`
- `/features/gestion-proveedores-almacen/components/FiltrosCampana.tsx`
- `/features/gestion-proveedores-almacen/components/KPIsCampanaCard.tsx`
- `/features/gestion-proveedores-almacen/apis/campanasApi.ts`

### Componentes React

- CampanaDashboard
- ListaCampanasTable
- ModalCrearEditarCampana
- GraficoRendimientoCampana
- FiltrosCampana
- KPIsCampanaCard

## 🔌 APIs Backend

Las APIs para el seguimiento de campañas se centran en operaciones CRUD para la entidad 'Campana' y en endpoints específicos para obtener métricas y estadísticas de rendimiento, permitiendo alimentar el dashboard y los informes.

### `GET` `/api/campanas`

Obtiene un listado de todas las campañas, permitiendo filtrar por estado (activa, finalizada), clínica y rango de fechas.

**Parámetros:** query.status: string, query.clinicaId: string, query.fechaInicio: string, query.fechaFin: string

**Respuesta:** Un array de objetos Campana.

### `POST` `/api/campanas`

Crea una nueva campaña de marketing.

**Parámetros:** body.nombre: string, body.descripcion: string, body.fechaInicio: Date, body.fechaFin: Date, body.presupuesto: number, body.canal: string, body.clinicaId: ObjectId

**Respuesta:** El objeto de la nueva Campana creada.

### `GET` `/api/campanas/:id`

Obtiene los detalles completos de una campaña específica, incluyendo la lista de pacientes asociados.

**Parámetros:** params.id: string (ObjectId de la campaña)

**Respuesta:** Un objeto Campana con datos detallados.

### `PUT` `/api/campanas/:id`

Actualiza la información de una campaña existente.

**Parámetros:** params.id: string (ObjectId de la campaña), body: (Campos a actualizar)

**Respuesta:** El objeto de la Campana actualizada.

### `DELETE` `/api/campanas/:id`

Elimina o archiva una campaña. Se recomienda un borrado lógico (cambio de estado a 'Archivada').

**Parámetros:** params.id: string (ObjectId de la campaña)

**Respuesta:** Mensaje de confirmación.

### `GET` `/api/campanas/stats/dashboard`

Obtiene estadísticas agregadas para el dashboard principal, como inversión total, total de pacientes captados, CPA promedio y ROI global.

**Parámetros:** query.clinicaId: string (opcional), query.dateRange: string (opcional)

**Respuesta:** Un objeto con las KPIs agregadas.

## 🗂️ Estructura Backend (MERN)

El backend utiliza el patrón MVC. El modelo 'Campana' define la estructura de datos en MongoDB. El 'CampanaController' contiene la lógica para gestionar las campañas y calcular las métricas. Las rutas en 'campanaRoutes' exponen los endpoints de la API de forma segura y organizada.

### Models

#### Campana

nombre: String, descripcion: String, fechaInicio: Date, fechaFin: Date, presupuesto: Number, costoReal: Number, canal: String, estado: String (enum: ['Planificada', 'Activa', 'Finalizada', 'Archivada']), clinicaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinica' }, pacientesAsociados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' }], createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }

#### Paciente

(...) otros campos del paciente, y el campo relevante: campanaOrigenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campana', required: false }

### Controllers

#### CampanaController

- crearCampana
- obtenerTodasLasCampanas
- obtenerCampanaPorId
- actualizarCampana
- eliminarCampana
- obtenerEstadisticasDashboard

### Routes

#### `/api/campanas`

- GET /
- POST /
- GET /stats/dashboard
- GET /:id
- PUT /:id
- DELETE /:id

## 🔄 Flujos

1. El usuario de Marketing accede a la página 'Seguimiento de Campañas' y ve un dashboard con KPIs generales y un listado de campañas existentes.
2. El usuario hace clic en 'Nueva Campaña', se abre un modal donde completa los detalles (nombre, presupuesto, fechas, canal) y guarda.
3. Durante el periodo de la campaña, en la recepción, al dar de alta a un nuevo paciente, se selecciona la campaña correspondiente en el campo '¿Cómo nos conoció?'.
4. El sistema actualiza automáticamente el contador de 'pacientes asociados' de la campaña y recalcula las métricas (CPA, ROI).
5. El Director General filtra el dashboard por clínica y por el último trimestre para comparar el rendimiento y decidir la asignación de presupuestos para el siguiente periodo.

## 📝 User Stories

- Como responsable de Marketing, quiero crear nuevas campañas publicitarias definiendo su presupuesto, duración y canal para poder organizar y lanzar nuevas iniciativas de captación.
- Como responsable de Marketing, quiero visualizar en una tabla todas las campañas con sus métricas clave (costo, pacientes captados, ROI) para poder evaluar rápidamente su rendimiento individual.
- Como Director General, quiero un dashboard con gráficos que comparen el rendimiento (CPA y ROI) de las campañas entre diferentes sedes para tomar decisiones estratégicas sobre la inversión en marketing.
- Como recepcionista, quiero poder seleccionar fácilmente de una lista la campaña de marketing a través de la cual un nuevo paciente ha conocido la clínica para asegurar un seguimiento preciso.
- Como Director General, quiero poder exportar un informe de rendimiento de campañas en formato CSV o PDF para presentarlo en las reuniones de dirección.

## ⚙️ Notas Técnicas

- Integración clave: El formulario de registro de nuevos pacientes (en el módulo 'Gestión de Pacientes') debe incluir un campo de tipo 'select' que se popule dinámicamente con las campañas activas. Este es el punto de enlace de datos más crítico para la funcionalidad.
- Cálculo de métricas: El ROI (Retorno de Inversión) y el CPA (Costo por Adquisición) deben calcularse en el backend a través de pipelines de agregación de MongoDB para garantizar el rendimiento. ROI = (Ingresos de tratamientos de pacientes asociados - Costo de la campaña) / Costo de la campaña.
- Seguridad y Permisos: Implementar middleware en las rutas del backend para verificar que solo los roles 'Marketing / CRM' y 'Director / Admin general' puedan acceder a estos endpoints. Se pueden definir permisos más granulares (ej: Director solo puede ver, no editar).
- Rendimiento del Dashboard: Para la página principal, utilizar paginación en la lista de campañas y cargar las estadísticas agregadas en una llamada a API separada para mejorar la velocidad de carga inicial.
- Visualización de datos: Utilizar una librería de gráficos como 'Recharts' o 'Chart.js' en el frontend para crear visualizaciones interactivas (gráficos de barras para comparación de CPA, gráficos de líneas para evolución de captación).

