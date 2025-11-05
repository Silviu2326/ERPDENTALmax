# Mensajería Segura con la Clínica

**Categoría:** Portal del Paciente | **Módulo:** Portal del Paciente

La funcionalidad de 'Mensajería Segura con la Clínica' es un componente crítico dentro del 'Portal del Paciente'. Proporciona un canal de comunicación asíncrono, privado y seguro entre los pacientes y el personal de la clínica, como la recepción o secretaría. A diferencia de los métodos de comunicación tradicionales como el correo electrónico estándar o las aplicaciones de mensajería de consumo, este sistema está diseñado para cumplir con normativas de privacidad de datos de salud como HIPAA, garantizando que toda la información compartida esté encriptada y protegida. Su propósito principal es agilizar la comunicación para asuntos no urgentes, como consultas sobre citas, preguntas sobre planes de tratamiento, seguimiento post-operatorio, o el envío y recepción de documentos administrativos. El paciente puede iniciar una conversación, adjuntar archivos relevantes y recibir respuestas directamente en su portal, creando un registro centralizado y permanente de todas las interacciones. Para el personal de la clínica, centraliza las consultas de los pacientes en una única interfaz dentro del ERP, eliminando la dispersión de información y mejorando la eficiencia operativa. Esto reduce la carga de llamadas telefónicas y permite al personal gestionar las consultas de manera más organizada, mejorando la calidad del servicio y la satisfacción del paciente.

## 👥 Roles de Acceso

- Paciente (Portal)
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-paciente/`

Toda la lógica de frontend para esta funcionalidad reside dentro de la carpeta del módulo padre '/features/portal-paciente/'. La mensajería se organiza en sus propias subcarpetas: '/pages/MensajeriaPage.tsx' define la vista principal de la interfaz de chat. Los componentes reutilizables como la lista de conversaciones, la ventana de chat y el campo de entrada de texto están en '/components/mensajeria/'. Las llamadas a la API del backend se abstraen en un archivo dedicado '/apis/mensajeriaApi.ts', que maneja todas las peticiones HTTP relacionadas con los mensajes y conversaciones.

### Archivos Frontend

- `/features/portal-paciente/pages/MensajeriaPage.tsx`
- `/features/portal-paciente/components/mensajeria/ConversationList.tsx`
- `/features/portal-paciente/components/mensajeria/ChatWindow.tsx`
- `/features/portal-paciente/components/mensajeria/MessageInput.tsx`
- `/features/portal-paciente/components/mensajeria/MessageBubble.tsx`
- `/features/portal-paciente/apis/mensajeriaApi.ts`

### Componentes React

- ConversationList
- ConversationListItem
- ChatWindow
- MessageInput
- MessageBubble
- AttachmentViewer

## 🔌 APIs Backend

La API RESTful para la mensajería debe permitir la gestión completa de conversaciones y mensajes, asegurando que solo los usuarios autorizados puedan acceder a sus datos. Incluye endpoints para listar conversaciones, obtener el historial de una conversación específica, enviar nuevos mensajes y actualizar el estado de lectura.

### `GET` `/api/mensajeria/conversaciones`

Obtiene una lista de todas las conversaciones en las que participa el usuario autenticado (paciente o personal).

**Parámetros:** query: page (number), query: limit (number)

**Respuesta:** Un array de objetos de conversación, cada uno con el último mensaje, asunto y participantes.

### `GET` `/api/mensajeria/conversaciones/:id/mensajes`

Obtiene todos los mensajes de una conversación específica, ordenados cronológicamente. Implementa paginación.

**Parámetros:** param: id (string, ID de la conversación), query: page (number), query: limit (number)

**Respuesta:** Un array de objetos de mensaje.

### `POST` `/api/mensajeria/conversaciones/:id/mensajes`

Envía un nuevo mensaje a una conversación existente.

**Parámetros:** param: id (string, ID de la conversación), body: cuerpo (string, contenido del mensaje), body: adjuntos (array de URLs, opcional)

**Respuesta:** El objeto del mensaje recién creado.

### `POST` `/api/mensajeria/conversaciones`

Inicia una nueva conversación. Usado principalmente por el personal para contactar a un paciente.

**Parámetros:** body: destinatarioId (string, ID del paciente), body: asunto (string), body: cuerpo (string, primer mensaje)

**Respuesta:** El objeto de la nueva conversación creada.

### `PUT` `/api/mensajeria/conversaciones/:id/marcar-leido`

Marca todos los mensajes de una conversación como leídos para el usuario actual.

**Parámetros:** param: id (string, ID de la conversación)

**Respuesta:** Un objeto con un mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

El backend utiliza dos modelos principales: 'Conversacion' y 'Mensaje'. El 'MensajeriaController' contiene la lógica para manejar las solicitudes de la API, interactuando con estos modelos para realizar operaciones CRUD. Las rutas se definen en un archivo específico para la mensajería, que mapea los endpoints de la API a las funciones del controlador correspondientes.

### Models

#### Conversacion

participantes: [ObjectId (ref: 'Usuario' o 'Paciente')], asunto: String, fechaCreacion: Date, ultimoMensaje: Date, estado: String ('abierta', 'cerrada')

#### Mensaje

conversacionId: ObjectId (ref: 'Conversacion'), emisor: { id: ObjectId, rol: String }, cuerpo: String, fechaEnvio: Date, leidoPor: [{ lectorId: ObjectId, fechaLectura: Date }], adjuntos: [String]

### Controllers

#### MensajeriaController

- obtenerConversacionesUsuario
- obtenerMensajesDeConversacion
- enviarNuevoMensaje
- iniciarNuevaConversacion
- marcarConversacionComoLeida

### Routes

#### `/api/mensajeria`

- GET /conversaciones
- POST /conversaciones
- GET /conversaciones/:id/mensajes
- POST /conversaciones/:id/mensajes
- PUT /conversaciones/:id/marcar-leido

## 🔄 Flujos

1. El paciente inicia sesión en el Portal, accede a 'Mensajería' y ve una lista de sus conversaciones con la clínica, con indicadores de mensajes no leídos.
2. El paciente selecciona una conversación, la vista de chat se carga con el historial de mensajes. El sistema marca automáticamente los mensajes como leídos.
3. El paciente escribe un nuevo mensaje en el campo de texto y hace clic en 'Enviar'. El mensaje aparece instantáneamente en su vista y se envía al servidor.
4. El personal de recepción recibe una notificación en el ERP sobre un nuevo mensaje. Acceden a la sección de mensajería, ven la conversación y responden al paciente.
5. El paciente recibe una notificación por correo electrónico y/o una notificación dentro del portal informándole de la nueva respuesta de la clínica.

## 📝 User Stories

- Como Paciente, quiero enviar un mensaje a la clínica para preguntar sobre el coste de un tratamiento sin tener que llamar por teléfono.
- Como personal de Recepción, quiero ver todas las conversaciones de los pacientes en un único panel para gestionarlas de forma eficiente y priorizar las más urgentes.
- Como Paciente, quiero poder adjuntar una foto de mi evolución tras una cirugía para que el doctor la revise.
- Como personal de Recepción, quiero iniciar una conversación con un paciente para recordarle que debe enviar un documento necesario antes de su próxima cita.
- Como Paciente, quiero recibir una notificación cuando la clínica haya leído mi mensaje para saber que mi consulta ha sido recibida.

## ⚙️ Notas Técnicas

- Seguridad: Es imperativo utilizar HTTPS para toda la comunicación. La base de datos debe estar encriptada en reposo. Se debe realizar una validación y sanitización estricta de todas las entradas del usuario para prevenir ataques XSS e inyección.
- Tiempo Real: Para una experiencia de usuario óptima, se recomienda implementar WebSockets (usando una librería como Socket.IO) para la entrega de mensajes en tiempo real, notificaciones y para mostrar indicadores de 'escribiendo...'.
- Notificaciones: Integrar un sistema de notificaciones multicanal (email, notificaciones push si hay app móvil, alertas en el portal) para avisar a los usuarios de nuevos mensajes y asegurar una comunicación fluida.
- Archivos Adjuntos: La gestión de archivos adjuntos debe ser segura. Utilizar un servicio de almacenamiento de objetos como AWS S3 o Google Cloud Storage. Generar URLs firmadas con tiempo de expiración limitado para el acceso a los archivos, en lugar de enlaces públicos.
- Rendimiento: Indexar adecuadamente los campos de la base de datos, especialmente `conversacionId` y `fechaEnvio` en la colección de Mensajes, para asegurar que la carga de conversaciones largas sea rápida y eficiente.

