# Incidencias de Esterilización

**Categoría:** Calidad y Seguridad | **Módulo:** Esterilización y Trazabilidad

La funcionalidad 'Incidencias de Esterilización' es un componente crítico dentro del módulo de 'Esterilización y Trazabilidad', diseñado para registrar, gestionar y analizar cualquier evento adverso o no conformidad que ocurra durante el proceso de esterilización de instrumental dental. Su propósito principal es garantizar la máxima seguridad del paciente y la calidad de los procedimientos clínicos, proporcionando un sistema robusto para la gestión de la calidad. Esta página permite a los auxiliares y administradores documentar detalladamente fallos como un test biológico positivo, un empaquetado dañado, un ciclo de autoclave fallido, o cualquier otra desviación de los protocolos establecidos. El sistema no solo registra el problema, sino que también facilita el seguimiento de las acciones correctivas y preventivas implementadas, creando un ciclo de mejora continua. Dentro del ERP, esta funcionalidad se integra directamente con los registros de ciclos de esterilización. Por ejemplo, si un ciclo marcado en el sistema falla, el usuario puede generar una incidencia asociada directamente a ese lote, vinculando automáticamente la información del equipo (autoclave), el operador y los paquetes de instrumental afectados. Esto es fundamental para la trazabilidad, ya que permite identificar y retirar de la circulación todo el material potencialmente no estéril de forma inmediata, evitando su uso en pacientes. Para la dirección, esta herramienta se convierte en un panel de control de calidad, ofreciendo estadísticas y reportes sobre los tipos de incidencias más comunes, los equipos que más fallan o el personal que requiere re-entrenamiento, fundamentando decisiones basadas en datos para la mejora de procesos y la inversión en equipamiento.

## 👥 Roles de Acceso

- Auxiliar / Asistente
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/esterilizacion-trazabilidad/`

Toda la lógica de esta funcionalidad reside en la carpeta '/features/esterilizacion-trazabilidad/'. La página principal se define en '/pages/IncidenciasEsterilizacionPage.tsx', que utiliza componentes reutilizables de '/components/' como la tabla de incidencias y el formulario de creación. Las llamadas al backend están encapsuladas en funciones dentro de '/apis/incidenciasApi.ts', que se encargan de la comunicación con los endpoints del servidor para crear, leer, actualizar y eliminar incidencias.

### Archivos Frontend

- `/features/esterilizacion-trazabilidad/pages/IncidenciasEsterilizacionPage.tsx`

### Componentes React

- TablaIncidenciasEsterilizacion
- ModalGestionIncidencia
- FormularioNuevaIncidencia
- FiltrosBusquedaIncidencias
- DetalleIncidenciaViewer

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de una incidencia de esterilización, permitiendo su creación, consulta con filtros avanzados, actualización para añadir acciones correctivas, y la obtención de detalles específicos de un registro.

### `POST` `/api/esterilizacion/incidencias`

Crea un nuevo registro de incidencia de esterilización.

**Parámetros:** body: { tipoIncidencia, descripcion, loteEsterilizacionId, equiposImplicados, personalInvolucradoId, idClinica }

**Respuesta:** El objeto de la incidencia creada.

### `GET` `/api/esterilizacion/incidencias`

Obtiene un listado de todas las incidencias, con capacidad de filtrado.

**Parámetros:** query: { fechaInicio, fechaFin, estado, tipoIncidencia, idClinica }

**Respuesta:** Un array de objetos de incidencia que coinciden con los filtros.

### `GET` `/api/esterilizacion/incidencias/:id`

Obtiene los detalles completos de una incidencia específica.

**Parámetros:** params: { id }

**Respuesta:** El objeto completo de la incidencia solicitada, incluyendo datos poblados de lote, personal y equipo.

### `PUT` `/api/esterilizacion/incidencias/:id`

Actualiza una incidencia existente, principalmente para añadir acciones correctivas o cambiar su estado.

**Parámetros:** params: { id }, body: { accionesCorrectivas, estado, solucion }

**Respuesta:** El objeto de la incidencia actualizada.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se basa en el patrón MVC. El modelo 'IncidenciaEsterilizacion' define el esquema de datos en MongoDB. El 'IncidenciaEsterilizacionController' contiene la lógica para procesar las peticiones HTTP (crear, leer, etc.), y las rutas en 'esterilizacionRoutes.ts' mapean los endpoints de la API a las funciones del controlador correspondientes.

### Models

#### IncidenciaEsterilizacion

idClinica: ObjectId, fechaIncidencia: Date, tipoIncidencia: String (Enum: 'FALLO_BIOLOGICO', 'FALLO_QUIMICO', 'PAQUETE_DAÑADO', 'CICLO_INCOMPLETO'), descripcion: String, loteAfectado: { type: ObjectId, ref: 'LoteEsterilizacion' }, equiposImplicados: [{ type: ObjectId, ref: 'Equipo' }], personalInvolucrado: { type: ObjectId, ref: 'User' }, accionesCorrectivas: String, estado: String (Enum: 'ABIERTA', 'EN_INVESTIGACION', 'CERRADA'), evidenciaUrl: [String], createdAt: Date, updatedAt: Date

### Controllers

#### IncidenciaEsterilizacionController

- crearIncidencia
- obtenerIncidencias
- obtenerIncidenciaPorId
- actualizarIncidencia

### Routes

#### `/api/esterilizacion`

- POST /incidencias
- GET /incidencias
- GET /incidencias/:id
- PUT /incidencias/:id

## 🔄 Flujos

1. El Auxiliar detecta un test biológico positivo. Accede a 'Esterilización y Trazabilidad' > 'Incidencias', pulsa 'Nueva Incidencia'. Rellena el formulario seleccionando el tipo 'Fallo Biológico', describe lo ocurrido, asocia el lote de esterilización afectado y guarda. El sistema crea la incidencia con estado 'Abierta'.
2. El Director de la clínica recibe una notificación de nueva incidencia. Entra en la página, filtra las incidencias por estado 'Abierta'. Revisa los detalles, añade en el campo 'Acciones Correctivas' las instrucciones ('Retirar y reprocesar todo el lote. Poner autoclave en cuarentena para revisión técnica') y cambia el estado a 'En Investigación'.
3. Para una auditoría de calidad, el Admin general filtra todas las incidencias 'Cerradas' del último año en una sede específica para generar un informe de no conformidades y las soluciones aplicadas.

## 📝 User Stories

- Como Auxiliar de clínica, quiero registrar una incidencia de esterilización de forma clara y rápida, asociándola al ciclo correspondiente, para asegurar que no se utiliza material comprometido y que el problema queda documentado.
- Como Director de clínica, quiero visualizar un dashboard con todas las incidencias de mi centro, pudiendo filtrarlas por tipo, estado y fecha, para supervisar la calidad de los procesos y tomar acciones correctivas de manera oportuna.
- Como Admin general (multisede), quiero generar reportes de incidencias por clínica para comparar el rendimiento, identificar problemas sistémicos y planificar formaciones o mantenimientos a nivel global.
- Como Auxiliar, quiero poder adjuntar una fotografía del paquete dañado o del test fallido al registrar una incidencia para proporcionar evidencia visual clara del problema.

## ⚙️ Notas Técnicas

- Implementar un sistema de notificaciones en tiempo real (ej. WebSockets) o por email para alertar a los roles de dirección cuando se crea una nueva incidencia de alta gravedad.
- La relación entre 'IncidenciaEsterilizacion' y 'LoteEsterilizacion' debe ser robusta (usando `ref` en Mongoose) para garantizar la trazabilidad completa. Al ver una incidencia, se debe poder navegar fácilmente al detalle del lote afectado.
- Utilizar un sistema de borrado lógico (soft delete) para los registros de incidencias. Nunca deben ser eliminados permanentemente de la base de datos por motivos de auditoría y cumplimiento normativo.
- Para la subida de archivos de evidencia (imágenes), se debe integrar un servicio de almacenamiento de objetos como AWS S3 o Google Cloud Storage para no sobrecargar el servidor de la aplicación y la base de datos.
- Los enums para 'tipoIncidencia' y 'estado' deben estar centralizados y ser consistentes entre el frontend y el backend para evitar discrepancias de datos.
- El endpoint de consulta (`GET /api/esterilizacion/incidencias`) debe estar optimizado con paginación e indexación en la base de datos (por idClinica, fecha y estado) para manejar grandes volúmenes de datos de manera eficiente, especialmente en entornos multisede.

