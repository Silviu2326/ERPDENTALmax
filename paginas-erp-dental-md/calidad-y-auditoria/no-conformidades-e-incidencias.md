# No Conformidades e Incidencias

**Categoría:** Calidad y Auditoría | **Módulo:** Calidad y Auditoría

La funcionalidad de 'No Conformidades e Incidencias' es una herramienta crítica dentro del módulo de 'Calidad y Auditoría', diseñada para la gestión sistemática de cualquier desviación de los estándares de calidad, protocolos clínicos, procedimientos operativos o requisitos regulatorios en la clínica dental. Esto abarca un amplio espectro de eventos, desde no conformidades con materiales o productos (ej. un lote de composites defectuoso), incidencias durante procedimientos clínicos (ej. un error en la dosificación), quejas de pacientes, hasta incidentes de seguridad y salud laboral. Su propósito fundamental es proporcionar un sistema centralizado para registrar, investigar, analizar y resolver estos eventos. Al documentar cada incidencia, la clínica puede realizar un análisis de causa raíz para entender por qué ocurrió el problema, en lugar de solo tratar sus síntomas. Basado en este análisis, se definen y asignan planes de acción, que incluyen tanto acciones correctivas (para solucionar el problema inmediato) como acciones preventivas (para evitar su recurrencia). Este proceso estructurado no solo mejora la seguridad del paciente y la calidad del servicio, sino que también es esencial para cumplir con normativas de calidad como las ISO 9001, y facilita enormemente las auditorías internas y externas, demostrando un compromiso con la mejora continua y la gestión de riesgos.

## 👥 Roles de Acceso

- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/calidad-auditoria/`

Toda la lógica de frontend para el módulo de 'Calidad y Auditoría' se encuentra en la carpeta '/features/calidad-auditoria/'. Esta carpeta contiene subcarpetas: '/apis/' para las funciones que llaman al backend (ej. 'incidenciasApi.ts'), '/components/' para componentes reutilizables (ej. un formulario de incidencias, una tabla de datos), y '/pages/' para las vistas principales. Esta página específica, 'GestionIncidenciasPage.tsx', se ubicará en la carpeta '/pages/', y ensamblará diversos componentes de la carpeta '/components/' para ofrecer la funcionalidad completa.

### Archivos Frontend

- `/features/calidad-auditoria/pages/GestionIncidenciasPage.tsx`
- `/features/calidad-auditoria/pages/DetalleIncidenciaPage.tsx`
- `/features/calidad-auditoria/components/IncidenciasDataTable.tsx`
- `/features/calidad-auditoria/components/IncidenciaForm.tsx`
- `/features/calidad-auditoria/components/PlanAccionCard.tsx`
- `/features/calidad-auditoria/components/DashboardIncidencias.tsx`
- `/features/calidad-auditoria/apis/incidenciasApi.ts`

### Componentes React

- IncidenciasDataTable
- IncidenciaForm
- AnalisisCausaRaizInput
- PlanAccionForm
- IncidenciaStatusBadge
- DashboardIncidencias
- FiltrosIncidencias

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de las no conformidades e incidencias, permitiendo operaciones CRUD, cambios de estado, y la agregación de datos para reportes y dashboards.

### `POST` `/api/incidencias`

Crea una nueva no conformidad o incidencia en el sistema.

**Parámetros:** body: { tipo, descripcion_detallada, fecha_deteccion, clinicaId, reportado_por, area_afectada }

**Respuesta:** El objeto de la incidencia recién creada.

### `GET` `/api/incidencias`

Obtiene un listado paginado y filtrado de todas las incidencias.

**Parámetros:** query: clinicaId (opcional), query: estado (opcional), query: tipo (opcional), query: page (opcional), query: limit (opcional), query: sortBy (opcional)

**Respuesta:** Un objeto con un array de incidencias y metadatos de paginación.

### `GET` `/api/incidencias/:id`

Obtiene los detalles completos de una incidencia específica por su ID.

**Parámetros:** path: id

**Respuesta:** El objeto completo de la incidencia.

### `PUT` `/api/incidencias/:id`

Actualiza una incidencia existente. Se usa para añadir análisis, planes de acción, cambiar estado, etc.

**Parámetros:** path: id, body: { ...campos a actualizar }

**Respuesta:** El objeto de la incidencia actualizado.

### `DELETE` `/api/incidencias/:id`

Realiza un borrado lógico (soft delete) de una incidencia. No se recomienda el borrado físico por temas de auditoría.

**Parámetros:** path: id

**Respuesta:** Un mensaje de confirmación.

### `GET` `/api/incidencias/stats/dashboard`

Obtiene estadísticas agregadas para el dashboard de calidad.

**Parámetros:** query: clinicaId (opcional), query: fechaInicio (opcional), query: fechaFin (opcional)

**Respuesta:** Un objeto con estadísticas clave (ej: { totalAbiertas, cerradasUltimoMes, porTipo: [...], porClinica: [...] }).

## 🗂️ Estructura Backend (MERN)

El backend sigue la estructura MERN. Se define un modelo 'Incidencia' con Mongoose, un 'IncidenciaController' para encapsular la lógica de negocio y las rutas correspondientes en Express para exponer los endpoints de la API RESTful.

### Models

#### Incidencia

folio (String, único), tipo (Enum: ['No Conformidad Producto', 'Incidencia Clínica', 'Queja Paciente', 'Incidente Seguridad']), descripcion_detallada (String), fecha_deteccion (Date), fecha_cierre (Date, opcional), estado (Enum: ['Abierta', 'En Investigación', 'Resuelta', 'Cerrada']), clinica (ObjectId, ref: 'Clinica'), reportado_por (ObjectId, ref: 'Usuario'), analisis_causa_raiz (String, opcional), acciones_correctivas ([{descripcion: String, responsable: ObjectId, fecha_limite: Date, completada: Boolean}]), acciones_preventivas ([{...}]), evidencia_adjunta ([{url: String, nombre_archivo: String}]), isDeleted (Boolean, default: false)

### Controllers

#### IncidenciaController

- crearIncidencia
- obtenerIncidencias
- obtenerIncidenciaPorId
- actualizarIncidencia
- eliminarIncidencia
- obtenerEstadisticasIncidencias

### Routes

#### `/api/incidencias`

- POST /
- GET /
- GET /:id
- PUT /:id
- DELETE /:id
- GET /stats/dashboard

## 🔄 Flujos

1. El Director de clínica detecta una no conformidad, accede al módulo y hace clic en 'Nueva Incidencia'. Rellena el formulario inicial con tipo, descripción y fecha, y lo guarda. El sistema le asigna un folio y la deja en estado 'Abierta'.
2. El Admin general revisa el dashboard y filtra por incidencias 'En Investigación' de todas las clínicas para supervisar el progreso.
3. Un Director selecciona una incidencia 'Abierta', edita el registro para añadir el 'Análisis de Causa Raíz' y define un 'Plan de Acciones Correctivas', asignando cada acción a un usuario responsable con una fecha límite.
4. A medida que las acciones se completan, el responsable las marca como 'Completada'. Una vez todas las acciones están completas, el Director verifica la efectividad y cambia el estado de la incidencia a 'Resuelta' y finalmente a 'Cerrada', adjuntando la evidencia de cierre.

## 📝 User Stories

- Como Director de clínica, quiero registrar una nueva no conformidad cuando se detecta un problema, para asegurar que quede documentada y se pueda hacer seguimiento.
- Como Admin general, quiero visualizar un dashboard con el número de incidencias abiertas por clínica, para identificar qué sedes requieren más atención en temas de calidad.
- Como Director, quiero asignar planes de acción a miembros específicos del equipo, para delegar la resolución de problemas y asegurar la responsabilidad.
- Como Director, quiero adjuntar fotos o documentos como evidencia a una incidencia, para tener un registro completo del caso.
- Como Admin general, quiero filtrar el listado de incidencias por un rango de fechas y tipo, para preparar informes para las auditorías de calidad.
- Como Director, quiero recibir una notificación cuando una acción correctiva asignada a mi equipo está a punto de vencer, para poder hacer seguimiento proactivo.

## ⚙️ Notas Técnicas

- Seguridad: El acceso a la edición y cambio de estado de las incidencias debe estar restringido al rol de Director o superior. Se debe implementar un log de auditoría para registrar todos los cambios importantes en una incidencia.
- Almacenamiento de archivos: Para la 'evidencia_adjunta', se debe usar un servicio de almacenamiento de objetos como AWS S3 o Google Cloud Storage para no sobrecargar la base de datos MongoDB y gestionar los archivos de forma segura y eficiente.
- Rendimiento: Las consultas para el listado principal y el dashboard deben estar optimizadas con los índices adecuados en MongoDB (sobre los campos 'clinica', 'estado', 'tipo', 'fecha_deteccion').
- Notificaciones: Implementar un sistema de notificaciones (por email o push dentro del ERP) para alertar a los usuarios cuando se les asigna una acción o cuando el estado de una incidencia cambia.
- Integración: Una incidencia de tipo 'Queja Paciente' debería poder enlazarse con el perfil del paciente en el módulo de 'Gestión de Pacientes'. Una 'No Conformidad Producto' podría vincularse a un lote específico en el módulo de 'Inventario'.

