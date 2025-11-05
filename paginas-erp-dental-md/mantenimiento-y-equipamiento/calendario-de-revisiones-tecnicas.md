# Calendario de Revisiones Técnicas

**Categoría:** Gestión de Recursos | **Módulo:** Mantenimiento y Equipamiento

El 'Calendario de Revisiones Técnicas' es una funcionalidad crítica dentro del módulo de 'Mantenimiento y Equipamiento' del ERP dental. Su propósito principal es gestionar y visualizar de manera centralizada el ciclo de vida del mantenimiento preventivo y correctivo de todo el equipamiento de la clínica o red de clínicas. Esto incluye equipos vitales como autoclaves, unidades de rayos X, compresores, sillones dentales, y cualquier otro activo que requiera calibración, revisión o certificación periódica. A diferencia del calendario de citas de pacientes, este se enfoca exclusivamente en la operatividad y cumplimiento normativo de los recursos físicos. Permite a los administradores y personal de compras programar revisiones, asignar técnicos responsables (internos o externos), registrar los resultados de las inspecciones y adjuntar documentación relevante como informes técnicos o facturas. El calendario ofrece vistas por día, semana y mes, utilizando códigos de color para identificar rápidamente el estado de una revisión (Programada, Completada, Retrasada, Cancelada). Su integración en el ERP es fundamental para minimizar el tiempo de inactividad del equipo, prevenir fallos costosos, garantizar la seguridad del paciente y del personal, y asegurar que la clínica cumple con todas las regulaciones sanitarias vigentes. Para una gestión multisede, esta herramienta proporciona al Director General una visión global del estado del equipamiento en todas las ubicaciones, permitiendo una toma de decisiones informada y una estandarización de los protocolos de mantenimiento.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Compras / Inventario

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/mantenimiento-equipamiento/`

La funcionalidad completa reside dentro de la carpeta '/features/mantenimiento-equipamiento/'. La página principal, 'CalendarioRevisionesTecnicasPage.tsx', se encuentra en la subcarpeta '/pages' y actúa como el contenedor principal. Esta página importa y organiza componentes reutilizables desde '/components', como el grid del calendario, los modales para crear/editar revisiones y los filtros. Todas las interacciones con el backend se manejan a través de funciones específicas definidas en la subcarpeta '/apis', que encapsulan las llamadas a la API REST, manteniendo la lógica de negocio separada de la UI.

### Archivos Frontend

- `/features/mantenimiento-equipamiento/pages/CalendarioRevisionesTecnicasPage.tsx`
- `/features/mantenimiento-equipamiento/components/CalendarioRevisionesGrid.tsx`
- `/features/mantenimiento-equipamiento/components/ModalFormRevisionTecnica.tsx`
- `/features/mantenimiento-equipamiento/components/FiltrosRevisiones.tsx`
- `/features/mantenimiento-equipamiento/apis/revisionesTecnicasApi.ts`

### Componentes React

- CalendarioRevisionesGrid
- ModalFormRevisionTecnica
- FiltrosRevisiones
- EventoRevisionCard
- SelectorEquipo
- SelectorSede

## 🔌 APIs Backend

La API RESTful proporciona los endpoints necesarios para gestionar el ciclo de vida completo de las revisiones técnicas, desde su programación hasta su finalización. Permite la consulta filtrada de revisiones para poblar el calendario y operaciones CRUD para la gestión individual de cada evento.

### `GET` `/api/revisiones-tecnicas`

Obtiene una lista de revisiones técnicas programadas dentro de un rango de fechas, con capacidad de filtrado por sede, tipo de equipo o estado.

**Parámetros:** startDate (query, string, opcional), endDate (query, string, opcional), sedeId (query, string, opcional), equipoId (query, string, opcional), estado (query, string, opcional: 'Programada', 'Completada', 'Retrasada')

**Respuesta:** Un array de objetos de RevisionTecnica.

### `POST` `/api/revisiones-tecnicas`

Crea una nueva revisión técnica para un equipo específico.

**Parámetros:** body (JSON): { equipoId, fechaProgramada, descripcion, tecnicoResponsable, ... }

**Respuesta:** El objeto de la RevisionTecnica recién creada.

### `GET` `/api/revisiones-tecnicas/{id}`

Obtiene los detalles completos de una revisión técnica específica, incluyendo documentos adjuntos.

**Parámetros:** id (path, string)

**Respuesta:** Un único objeto de RevisionTecnica.

### `PUT` `/api/revisiones-tecnicas/{id}`

Actualiza una revisión técnica existente. Se usa para cambiar su estado (ej. a 'Completada'), modificar la fecha, o añadir notas y documentos.

**Parámetros:** id (path, string), body (JSON): campos a actualizar

**Respuesta:** El objeto de la RevisionTecnica actualizado.

### `DELETE` `/api/revisiones-tecnicas/{id}`

Elimina una revisión técnica programada.

**Parámetros:** id (path, string)

**Respuesta:** Un mensaje de confirmación.

### `GET` `/api/equipos`

Obtiene una lista de todos los equipos registrados en la clínica o sedes para poblar selectores en el formulario.

**Parámetros:** sedeId (query, string, opcional)

**Respuesta:** Un array de objetos de Equipo.

## 🗂️ Estructura Backend (MERN)

El backend utiliza la arquitectura MERN. El modelo 'RevisionTecnica' define la estructura de datos en MongoDB. El 'RevisionTecnicaController' contiene la lógica de negocio para procesar las solicitudes HTTP, interactuando con los modelos. Las rutas definidas en Express enlazan los endpoints de la API con las funciones correspondientes del controlador.

### Models

#### RevisionTecnica

equipo: { type: ObjectId, ref: 'Equipo' }, sede: { type: ObjectId, ref: 'Sede' }, fechaProgramada: Date, fechaRealizacion: Date, estado: { type: String, enum: ['Programada', 'Completada', 'Retrasada', 'Cancelada'] }, tecnicoResponsable: String, descripcionTrabajo: String, notas: String, costo: Number, documentosAdjuntos: [{ nombre: String, url: String }]

#### Equipo

nombre: String, marca: String, modelo: String, numeroSerie: String, sede: { type: ObjectId, ref: 'Sede' }, fechaAdquisicion: Date, intervaloRevisionMeses: Number, proximaRevisionProgramada: Date, estado: { type: String, enum: ['Operativo', 'En Mantenimiento', 'Fuera de Servicio'] }

### Controllers

#### RevisionTecnicaController

- getAllRevisiones
- getRevisionById
- createRevision
- updateRevision
- deleteRevision

#### EquipoController

- getAllEquipos

### Routes

#### `/api/revisiones-tecnicas`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id

#### `/api/equipos`

- GET /

## 🔄 Flujos

1. El usuario (Admin/Compras) accede a la página del Calendario de Revisiones. El sistema realiza una llamada a `GET /api/revisiones-tecnicas` para cargar los eventos del mes actual.
2. Para programar una nueva revisión, el usuario hace clic en el botón 'Nueva Revisión'. Se abre un modal (`ModalFormRevisionTecnica`) que carga la lista de equipos disponibles (`GET /api/equipos`).
3. El usuario completa el formulario (selecciona equipo, fecha, técnico) y guarda. El sistema envía una petición `POST /api/revisiones-tecnicas` y actualiza el calendario con el nuevo evento.
4. Para registrar la finalización de un mantenimiento, el usuario hace clic en un evento 'Programado'. En el modal, cambia el estado a 'Completada', añade la fecha de realización, notas y opcionalmente adjunta el informe técnico. Al guardar, se envía una petición `PUT /api/revisiones-tecnicas/{id}`.
5. El Director General (multisede) utiliza el filtro de 'Sede' para visualizar y supervisar el estado del mantenimiento de cada clínica de forma individual o consolidada.

## 📝 User Stories

- Como responsable de Compras/Inventario, quiero visualizar todas las revisiones técnicas en un calendario para tener una visión clara de la planificación mensual y anual.
- Como Director General, quiero filtrar el calendario por sede para supervisar el cumplimiento del plan de mantenimiento en cada una de mis clínicas.
- Como responsable de Compras/Inventario, quiero crear un nuevo evento de revisión para un equipo, especificando la fecha, el técnico y el tipo de trabajo a realizar, para asegurar que el mantenimiento se programe correctamente.
- Como responsable de Compras/Inventario, quiero poder cambiar el estado de una revisión a 'Completada' y adjuntar el informe del técnico para mantener un registro histórico auditable.
- Como Director General, quiero que el sistema me alerte sobre las revisiones que están próximas a vencer o que ya están retrasadas para poder tomar acciones preventivas y evitar fallos en el equipamiento.

## ⚙️ Notas Técnicas

- Rendimiento: Implementar indexación en la colección 'RevisionTecnica' de MongoDB sobre los campos 'fechaProgramada', 'sede' y 'equipo' para optimizar las consultas de filtrado.
- Librerías Frontend: Se recomienda usar una librería robusta como 'FullCalendar' o 'React Big Calendar' para la renderización y gestión de eventos en el calendario.
- Seguridad: Aplicar un middleware de autorización en todas las rutas del backend para asegurar que solo los roles permitidos ('Director / Admin general', 'Compras / Inventario') puedan acceder y modificar los datos.
- Notificaciones: Desarrollar un job programado (cron job) en el backend que se ejecute diariamente para verificar revisiones próximas o vencidas y envíe notificaciones por correo electrónico o dentro del sistema a los roles responsables.
- Gestión de Archivos: Para los documentos adjuntos, integrar un servicio de almacenamiento de objetos como AWS S3, Google Cloud Storage o similar para gestionar la subida, almacenamiento y acceso seguro a los archivos, en lugar de almacenarlos directamente en la base de datos.

