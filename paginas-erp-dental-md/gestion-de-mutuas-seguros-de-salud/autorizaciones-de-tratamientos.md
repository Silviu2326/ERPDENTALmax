# Autorizaciones de Tratamientos

**Categoría:** Gestión Financiera | **Módulo:** Gestión de Mutuas/Seguros de Salud

La funcionalidad de 'Autorizaciones de Tratamientos' es un componente crítico dentro del módulo de 'Gestión de Mutuas/Seguros de Salud'. Su propósito principal es digitalizar, centralizar y automatizar el proceso de solicitud, seguimiento y gestión de pre-autorizaciones que las compañías de seguros de salud (mutuas) exigen para ciertos tratamientos dentales. Antes de realizar procedimientos de alto coste o complejidad, como implantes, ortodoncias o cirugías mayores, las clínicas deben obtener una aprobación formal de la aseguradora del paciente para garantizar la cobertura y el posterior reembolso. Esta página sirve como el centro de control para todas estas solicitudes. Permite al personal de recepción crear una nueva solicitud de autorización directamente desde el plan de tratamiento del paciente, adjuntar la documentación necesaria (radiografías, informes del odontólogo, presupuestos), y registrar la fecha de envío. El sistema realiza un seguimiento del estado de cada autorización (ej: 'Pendiente', 'Aprobada', 'Rechazada', 'Requiere Información Adicional'), permitiendo al personal de la clínica tener una visión clara y actualizada del progreso. Esto es vital para la planificación clínica, ya que un odontólogo no puede proceder con un tratamiento hasta que la autorización sea aprobada. Además, agiliza la gestión financiera al reducir drásticamente el riesgo de realizar tratamientos no cubiertos, minimizando las denegaciones de pago y mejorando el flujo de caja de la clínica.

## 👥 Roles de Acceso

- Recepción / Secretaría
- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-mutuas-seguros-salud/`

Toda la lógica de frontend para la gestión de mutuas, incluyendo las autorizaciones, reside en la carpeta 'gestion-mutuas-seguros-salud'. La subcarpeta '/pages' contiene el componente de página principal 'AutorizacionesTratamientosPage.tsx', que renderiza la interfaz principal. La subcarpeta '/components' alberga los componentes reutilizables como 'TablaAutorizaciones' para listar las solicitudes, 'FormularioAutorizacion' para crear o editar una, y 'VisorDocumentos' para ver los archivos adjuntos. La comunicación con el backend se gestiona a través de funciones definidas en la subcarpeta '/apis', que encapsulan las llamadas a la API RESTful.

### Archivos Frontend

- `/features/gestion-mutuas-seguros-salud/pages/AutorizacionesTratamientosPage.tsx`
- `/features/gestion-mutuas-seguros-salud/components/TablaAutorizaciones.tsx`
- `/features/gestion-mutuas-seguros-salud/components/FormularioAutorizacion.tsx`
- `/features/gestion-mutuas-seguros-salud/components/ModalDetalleAutorizacion.tsx`
- `/features/gestion-mutuas-seguros-salud/components/SelectorEstadoAutorizacion.tsx`
- `/features/gestion-mutuas-seguros-salud/apis/autorizacionesApi.ts`

### Componentes React

- AutorizacionesTratamientosPage
- TablaAutorizaciones
- FiltrosAutorizaciones
- FormularioAutorizacion
- ModalDetalleAutorizacion
- SelectorEstadoAutorizacion
- UploaderDocumentosAutorizacion

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de una solicitud de autorización. Se requiere un conjunto de endpoints RESTful para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre las autorizaciones, así como para manejar la carga y gestión de documentos asociados a cada solicitud. La API debe permitir filtrar y paginar los resultados para un rendimiento óptimo.

### `GET` `/api/autorizaciones`

Obtiene una lista paginada de todas las autorizaciones. Permite filtrar por paciente, mutua, estado y rango de fechas.

**Parámetros:** page (number), limit (number), pacienteId (string), mutuaId (string), estado (string), fechaDesde (string), fechaHasta (string)

**Respuesta:** Un objeto con la lista de autorizaciones y metadatos de paginación.

### `POST` `/api/autorizaciones`

Crea una nueva solicitud de autorización para un tratamiento específico de un paciente.

**Parámetros:** Body: { pacienteId, tratamientoPlanificadoId, mutuaId, notas (opcional) }

**Respuesta:** El objeto de la nueva autorización creada.

### `GET` `/api/autorizaciones/:id`

Obtiene los detalles completos de una autorización específica, incluyendo su historial de cambios y documentos adjuntos.

**Parámetros:** id (string) - ID de la autorización

**Respuesta:** El objeto completo de la autorización.

### `PUT` `/api/autorizaciones/:id`

Actualiza una autorización existente. Se usa principalmente para cambiar el estado (ej. de 'Pendiente' a 'Aprobada'), añadir el código de autorización proporcionado por la mutua, o agregar notas.

**Parámetros:** id (string) - ID de la autorización, Body: { estado, codigoAutorizacion, notas, fechaRespuesta }

**Respuesta:** El objeto de la autorización actualizada.

### `POST` `/api/autorizaciones/:id/documentos`

Sube uno o más documentos (ej. PDF, JPG) y los asocia a una autorización específica.

**Parámetros:** id (string) - ID de la autorización, FormData: archivos (file[])

**Respuesta:** El objeto de la autorización actualizada con la nueva lista de documentos.

## 🗂️ Estructura Backend (MERN)

El backend sigue la estructura MERN. Un modelo 'Autorizacion' en MongoDB define el esquema de datos. El 'AutorizacionController' contiene la lógica de negocio para gestionar las autorizaciones, como la creación, actualización y consulta, además de la lógica para manejar subidas de archivos a un servicio de almacenamiento (ej. AWS S3). Las rutas en Express exponen las funciones del controlador como endpoints RESTful bajo la ruta base '/api/autorizaciones'.

### Models

#### Autorizacion

paciente: { type: ObjectId, ref: 'Paciente' }, tratamientoPlanificado: { type: ObjectId, ref: 'Tratamiento' }, mutua: { type: ObjectId, ref: 'Mutua' }, estado: { type: String, enum: ['Pendiente', 'Aprobada', 'Rechazada', 'Requiere Información Adicional'], default: 'Pendiente' }, codigoSolicitud: { type: String, unique: true }, codigoAutorizacion: { type: String }, fechaSolicitud: { type: Date, default: Date.now }, fechaRespuesta: { type: Date }, notas: { type: String }, documentos: [{ nombreArchivo: String, url: String, subidoPor: { type: ObjectId, ref: 'Usuario' }, fechaSubida: Date }], historialEstados: [{ estado: String, fecha: Date, modificadoPor: { type: ObjectId, ref: 'Usuario' } }]

### Controllers

#### AutorizacionController

- crearAutorizacion
- obtenerTodasLasAutorizaciones
- obtenerAutorizacionPorId
- actualizarAutorizacion
- adjuntarDocumentoAAutorizacion

### Routes

#### `/api/autorizaciones`

- GET /
- POST /
- GET /:id
- PUT /:id
- POST /:id/documentos

## 🔄 Flujos

1. El personal de recepción identifica un tratamiento en el plan del paciente que requiere autorización. Accede a la sección de autorizaciones y crea una nueva solicitud, asociándola al paciente y al tratamiento.
2. El sistema genera la solicitud en estado 'Pendiente'. El personal adjunta los documentos necesarios (informes, radiografías) a través de la interfaz.
3. Periódicamente, el personal de recepción filtra la lista para ver todas las autorizaciones 'Pendientes' y realiza el seguimiento con las mutuas.
4. Cuando la mutua responde, el personal actualiza la autorización en el sistema, cambiando su estado a 'Aprobada' o 'Rechazada' y añadiendo el código de autorización si aplica.
5. El odontólogo, al revisar el plan de tratamiento del paciente, puede ver de forma inmediata el estado 'Aprobada' de la autorización y proceder con el tratamiento con la seguridad de que está cubierto.

## 📝 User Stories

- Como personal de recepción, quiero crear una nueva solicitud de autorización para un tratamiento de un paciente para poder enviarla a su mutua y comenzar el proceso de aprobación.
- Como personal de secretaría, quiero ver una lista de todas las autorizaciones pendientes con su fecha de solicitud para poder hacer un seguimiento proactivo con las mutuas y evitar retrasos en los tratamientos.
- Como odontólogo, quiero comprobar rápidamente si el tratamiento de un paciente está autorizado antes de comenzar el procedimiento para asegurar la cobertura y el pago.
- Como personal de recepción, quiero adjuntar fácilmente radiografías e informes a una solicitud de autorización para cumplir con los requisitos de la aseguradora.
- Como personal de administración, quiero filtrar las autorizaciones por mutua y estado para generar informes de gestión y evaluar los tiempos de respuesta de cada aseguradora.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un control de acceso basado en roles (RBAC) para que solo el personal autorizado pueda modificar o ver información financiera sensible. Las rutas de la API deben estar protegidas.
- Gestión de Archivos: La subida de documentos debe ser segura. Utilizar un servicio de almacenamiento en la nube como AWS S3 o Google Cloud Storage en lugar de almacenar archivos en el servidor del backend para mayor escalabilidad y seguridad. Realizar validación de tipos de archivo y tamaño.
- Notificaciones: Considerar la implementación de un sistema de notificaciones (por ejemplo, con WebSockets) para alertar al personal relevante en tiempo real cuando el estado de una autorización cambia.
- Rendimiento: La lista de autorizaciones puede crecer mucho. Es fundamental implementar paginación y filtros eficientes en el backend (usando índices en MongoDB en los campos de filtrado) para mantener la interfaz rápida y responsiva.
- Integridad de Datos: Usar referencias de ObjectId de MongoDB para enlazar de forma robusta las autorizaciones con los pacientes, tratamientos y mutuas, asegurando la consistencia de los datos.

