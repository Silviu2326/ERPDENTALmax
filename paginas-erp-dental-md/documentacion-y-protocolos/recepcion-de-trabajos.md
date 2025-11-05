# Recepción de Trabajos

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad 'Recepción de Trabajos' es un componente crucial dentro del módulo 'Documentación y Protocolos' del ERP dental. Actúa como el centro neurálgico para la gestión, seguimiento y documentación de todos los trabajos protésicos enviados y recibidos de laboratorios externos. Su propósito principal es digitalizar y estandarizar el flujo de trabajo entre la clínica y sus laboratorios asociados, eliminando la dependencia de registros en papel, correos electrónicos dispersos o llamadas telefónicas. Esto proporciona una trazabilidad completa del ciclo de vida de cada trabajo: desde que el odontólogo lo prescribe y se envía, pasando por la fecha de entrega prevista, hasta su recepción física en la clínica y su posterior colocación en el paciente. Dentro del ERP, esta funcionalidad se integra directamente con la ficha del paciente, el plan de tratamiento y la agenda, permitiendo que al recibir un trabajo, el sistema pueda sugerir o facilitar la programación de la cita correspondiente. Al formalizar este proceso, se minimizan errores, se reducen los tiempos de espera, se evitan pérdidas de trabajos y se crea un registro auditable y legalmente sólido de todas las interacciones con los proveedores protésicos, mejorando significativamente la eficiencia operativa y la calidad del servicio al paciente.

## 👥 Roles de Acceso

- Recepción / Secretaría
- Odontólogo
- Protésico / Laboratorio

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Esta funcionalidad reside dentro de la carpeta de la feature 'documentacion-protocolos'. La lógica de la interfaz se encuentra en '/pages/RecepcionTrabajosPage.tsx', que utiliza componentes reutilizables de '/components/' como la tabla de trabajos y el modal de gestión. Las llamadas a la API del backend se centralizan en '/apis/trabajosProtesicosApi.ts', manteniendo el código organizado y desacoplado.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/RecepcionTrabajosPage.tsx`
- `/features/documentacion-protocolos/components/TablaTrabajosProtesicos.tsx`
- `/features/documentacion-protocolos/components/ModalGestionTrabajoProtesico.tsx`
- `/features/documentacion-protocolos/components/FiltrosBusquedaTrabajos.tsx`
- `/features/documentacion-protocolos/components/TimelineEstadoTrabajo.tsx`
- `/features/documentacion-protocolos/apis/trabajosProtesicosApi.ts`

### Componentes React

- TablaTrabajosProtesicos
- ModalGestionTrabajoProtesico
- FiltrosBusquedaTrabajos
- TimelineEstadoTrabajo

## 🔌 APIs Backend

APIs RESTful para gestionar el ciclo de vida completo de los trabajos protésicos, permitiendo su creación, consulta, actualización de estado y la adición de notas o archivos.

### `GET` `/api/trabajos-protesicos`

Obtiene una lista paginada y filtrada de trabajos protésicos. Permite buscar por estado, paciente, laboratorio o rango de fechas.

**Parámetros:** query.page (number), query.limit (number), query.estado (string), query.pacienteId (string), query.laboratorioId (string), query.fechaDesde (string), query.fechaHasta (string)

**Respuesta:** Un objeto con la lista de trabajos y metadatos de paginación.

### `POST` `/api/trabajos-protesicos`

Crea un nuevo registro de trabajo protésico cuando se envía un caso al laboratorio.

**Parámetros:** body.pacienteId, body.odontologoId, body.laboratorioId, body.tipoTrabajo, body.fechaEnvio, body.fechaPrevistaRecepcion, body.descripcion

**Respuesta:** El objeto del nuevo trabajo protésico creado.

### `GET` `/api/trabajos-protesicos/:id`

Obtiene los detalles completos de un trabajo protésico específico, incluyendo su historial de estados y notas.

**Parámetros:** params.id (string)

**Respuesta:** El objeto completo del trabajo protésico.

### `PUT` `/api/trabajos-protesicos/:id`

Actualiza el estado de un trabajo. Es la acción principal de la 'recepción', cambiando el estado a 'Recibido de Laboratorio'.

**Parámetros:** params.id (string), body.estado (string), body.fechaRealRecepcion (Date), body.notas (string)

**Respuesta:** El objeto del trabajo protésico actualizado.

### `POST` `/api/trabajos-protesicos/:id/adjuntos`

Añade uno o más archivos adjuntos (ej. escaneos, fotos) a un trabajo existente.

**Parámetros:** params.id (string), body.urls (array de strings)

**Respuesta:** El objeto del trabajo protésico con la lista de adjuntos actualizada.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se basa en el patrón MVC. El modelo 'TrabajoProtesico' define los datos en MongoDB. El 'TrabajoProtesicoController' contiene la lógica para procesar las solicitudes, y las rutas en 'trabajosProtesicosRoutes' mapean los endpoints HTTP a las funciones del controlador.

### Models

#### TrabajoProtesico

pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente' }, odontologoId: { type: Schema.Types.ObjectId, ref: 'Usuario' }, laboratorioId: { type: Schema.Types.ObjectId, ref: 'Laboratorio' }, fechaEnvio: Date, fechaPrevistaRecepcion: Date, fechaRealRecepcion: Date, tipoTrabajo: String, descripcion: String, estado: { type: String, enum: ['Creado', 'Enviado a Laboratorio', 'Recibido de Laboratorio', 'Finalizado', 'Cancelado'] }, historialEstados: [{ estado: String, fecha: Date, usuarioId: Schema.Types.ObjectId }], archivosAdjuntos: [String], notas: [{ texto: String, fecha: Date, autorId: Schema.Types.ObjectId }]

### Controllers

#### TrabajoProtesicoController

- crearTrabajo
- obtenerTodosLosTrabajos
- obtenerTrabajoPorId
- actualizarEstadoTrabajo
- agregarAdjunto

### Routes

#### `/api/trabajos-protesicos`

- GET /
- POST /
- GET /:id
- PUT /:id
- POST /:id/adjuntos

## 🔄 Flujos

1. El odontólogo crea un nuevo 'trabajo protésico' desde la ficha del paciente, rellenando los detalles y la fecha de envío.
2. El personal de recepción accede a la página 'Recepción de Trabajos' y filtra por 'Enviado a Laboratorio' para ver los trabajos pendientes.
3. Cuando llega un paquete del laboratorio, el recepcionista busca el trabajo en el sistema (por nombre de paciente o código de trabajo) y cambia su estado a 'Recibido de Laboratorio'.
4. El sistema registra la fecha y hora de recepción y envía una notificación automática al odontólogo responsable.
5. El odontólogo puede entonces revisar el trabajo y programar la cita con el paciente para la prueba o colocación.

## 📝 User Stories

- Como recepcionista, quiero ver una lista de todos los trabajos enviados a laboratorios con sus fechas de entrega previstas para poder organizar la agenda de los pacientes y reclamar trabajos retrasados.
- Como odontólogo, quiero registrar el envío de un trabajo a un laboratorio, adjuntando la prescripción y los modelos digitales, para asegurar que el protésico tiene toda la información necesaria.
- Como odontólogo, quiero recibir una notificación automática cuando un trabajo para uno de mis pacientes ha sido recibido en la clínica para poder programar la cita de prueba lo antes posible.
- Como protésico, quiero acceder a un portal para ver los trabajos que me ha asignado una clínica, descargar los archivos adjuntos y actualizar el estado del trabajo para mantener a la clínica informada.
- Como gerente de la clínica, quiero generar un informe sobre los tiempos de entrega promedio por laboratorio para evaluar el rendimiento de mis proveedores.

## ⚙️ Notas Técnicas

- Seguridad: Implementar control de acceso basado en roles (RBAC) para asegurar que los usuarios de laboratorio solo puedan ver y modificar los trabajos que les han sido asignados.
- Almacenamiento: Utilizar un servicio de almacenamiento de objetos como AWS S3 o Google Cloud Storage para los archivos adjuntos (escaneos 3D, fotos), guardando solo la URL en MongoDB para no sobrecargar la base de datos.
- Notificaciones: Integrar un sistema de notificaciones en tiempo real (ej. WebSockets con Socket.io) para alertar a los odontólogos cuando el estado de un trabajo cambia, especialmente al ser recibido.
- Rendimiento: Implementar paginación y filtros eficientes en el backend (usando índices en MongoDB en campos como 'estado', 'laboratorioId', 'fechaPrevistaRecepcion') para manejar un gran volumen de trabajos sin degradar el rendimiento del frontend.
- Integración: El modelo 'TrabajoProtesico' debe estar vinculado ('ref') a los modelos 'Paciente', 'Tratamiento' y 'Usuario' para mantener la integridad de los datos y permitir una navegación fluida a través del ERP.

