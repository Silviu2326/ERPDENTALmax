# Webhooks y API Pública

**Categoría:** Integraciones y APIs | **Módulo:** Integraciones y APIs

La funcionalidad de 'Webhooks y API Pública' es una herramienta esencial dentro del módulo de 'Integraciones y APIs' del ERP dental. Su propósito principal es permitir que sistemas externos se integren con el ERP de forma bidireccional, tanto recibiendo notificaciones automáticas (webhooks) como permitiendo que aplicaciones externas accedan a los datos del ERP mediante una API REST pública y segura. Los webhooks permiten que el ERP notifique a sistemas externos cuando ocurren eventos importantes (como la creación de una cita, el pago de una factura, o la actualización de un paciente), mientras que la API pública permite que aplicaciones de terceros consulten y modifiquen datos del ERP de forma controlada y autenticada. Esta funcionalidad es fundamental para crear ecosistemas de integración, permitiendo que la clínica dental se conecte con sistemas de contabilidad externos, plataformas de marketing, sistemas de gestión de laboratorios, o cualquier otra herramienta que necesite interactuar con los datos del ERP.

## 👥 Roles de Acceso

- IT / Integraciones / Seguridad
- Administrador del Sistema
- Desarrolladores Externos (solo para API pública con autenticación)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/Integraciones y APIs/`

Esta funcionalidad reside dentro de la carpeta 'Integraciones y APIs'. La subcarpeta '/pages' contiene el componente principal 'Integraciones y APIsPage.tsx' que actúa como contenedor y navegador entre las diferentes secciones de integraciones. La carpeta '/components' alberga los componentes especializados como 'WebhooksView.tsx' para la gestión de webhooks y 'APIsPublicasView.tsx' para la gestión de la API pública. La lógica de comunicación con el backend se encapsula en la carpeta '/api', que contiene funciones para manejar webhooks y configuraciones de la API pública.

### Archivos Frontend

- `/features/Integraciones y APIs/pages/Integraciones y APIsPage.tsx`
- `/features/Integraciones y APIs/components/WebhooksView.tsx`
- `/features/Integraciones y APIs/components/APIsPublicasView.tsx`
- `/features/Integraciones y APIs/api/integracionesApi.ts`

### Componentes React

- WebhooksView
- APIsPublicasView
- WebhookForm
- WebhookList
- ApiKeyManager
- ApiEndpointList
- WebhookLogsViewer

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan la creación, actualización y eliminación de webhooks, así como la generación y gestión de claves de API para acceso a la API pública. También proporcionan endpoints para verificar el estado de los webhooks, ver logs de eventos enviados y gestionar la configuración de la API pública.

### `GET` `/api/integraciones/webhooks`

Obtiene una lista de todos los webhooks configurados en el sistema.

**Respuesta:** Array de objetos Webhook con información detallada de cada webhook.

### `POST` `/api/integraciones/webhooks`

Crea un nuevo webhook para notificar eventos del ERP a una URL externa.

**Parámetros:** Body: { url: string, evento: string, secret?: string, estado: 'activo' | 'inactivo' }

**Respuesta:** Objeto Webhook creado con su ID y datos.

### `PUT` `/api/integraciones/webhooks/:id`

Actualiza la configuración de un webhook existente.

**Parámetros:** id (en la URL), Body: { url?: string, evento?: string, secret?: string, estado?: 'activo' | 'inactivo' }

**Respuesta:** Objeto Webhook actualizado.

### `DELETE` `/api/integraciones/webhooks/:id`

Elimina un webhook del sistema.

**Parámetros:** id (en la URL)

**Respuesta:** Mensaje de confirmación.

### `POST` `/api/integraciones/webhooks/:id/test`

Envía una solicitud de prueba al webhook para verificar que funciona correctamente.

**Parámetros:** id (en la URL)

**Respuesta:** { exito: boolean, mensaje: string, respuesta?: any }

### `GET` `/api/integraciones/webhooks/:id/logs`

Obtiene el historial de intentos de envío de un webhook, incluyendo éxitos y fallos.

**Parámetros:** id (en la URL), page (opcional): número de página, limit (opcional): resultados por página

**Respuesta:** Array de logs con información de cada intento de envío.

### `GET` `/api/integraciones/apis-publicas`

Obtiene la lista de endpoints disponibles en la API pública y su estado.

**Respuesta:** Array de objetos ApiPublica con información de cada endpoint.

### `POST` `/api/integraciones/apis-publicas/keys`

Genera una nueva clave de API para acceso a la API pública.

**Parámetros:** Body: { nombre: string, permisos: string[], expiracion?: Date }

**Respuesta:** Objeto con la clave de API generada (solo se muestra una vez).

### `GET` `/api/integraciones/apis-publicas/keys`

Obtiene la lista de claves de API activas (sin mostrar el valor completo por seguridad).

**Respuesta:** Array de objetos con información de las claves (nombre, permisos, fecha de creación, última utilización).

### `DELETE` `/api/integraciones/apis-publicas/keys/:id`

Revoca una clave de API, invalidándola inmediatamente.

**Parámetros:** id (en la URL)

**Respuesta:** Mensaje de confirmación.

### `GET` `/api/integraciones/apis-publicas/documentacion`

Obtiene la documentación completa de la API pública en formato JSON o Markdown.

**Respuesta:** Documentación estructurada de todos los endpoints disponibles.

## 🗂️ Estructura Backend (MERN)

El backend utiliza modelos para persistir la configuración de webhooks y claves de API de forma segura. Los controladores contienen la lógica para enviar webhooks, validar autenticación de la API pública y gestionar las claves de acceso.

### Models

#### Webhook

url: String (requerido), evento: String (requerido, enum: ['cita.creada', 'cita.actualizada', 'cita.cancelada', 'factura.creada', 'factura.pagada', 'paciente.creado', 'paciente.actualizado', 'presupuesto.aprobado', 'presupuesto.rechazado']), secret: String (opcional, para firma HMAC), estado: String (enum: ['activo', 'inactivo']), clinicId: ObjectId, createdAt: Date, updatedAt: Date

#### WebhookLog

webhookId: ObjectId, evento: String, payload: Object, respuesta: Object, statusCode: Number, exito: Boolean, error: String, intentadoEn: Date

#### ApiKey

nombre: String, clave: String (hash), permisos: [String], clinicId: ObjectId, creadoPor: ObjectId, expiracion: Date (opcional), ultimaUtilizacion: Date, createdAt: Date

### Controllers

#### WebhooksController

- obtenerWebhooks
- crearWebhook
- actualizarWebhook
- eliminarWebhook
- probarWebhook
- obtenerLogsWebhook
- enviarWebhook (método interno llamado por eventos del sistema)

#### ApiPublicaController

- obtenerEndpoints
- generarApiKey
- obtenerApiKeys
- revocarApiKey
- obtenerDocumentacion
- validarApiKey (middleware)

### Routes

#### `/api/integraciones/webhooks`

- GET /
- POST /
- PUT /:id
- DELETE /:id
- POST /:id/test
- GET /:id/logs

#### `/api/integraciones/apis-publicas`

- GET /
- POST /keys
- GET /keys
- DELETE /keys/:id
- GET /documentacion

## 🔄 Flujos

1. El administrador accede a la sección de Webhooks y crea un nuevo webhook para notificar cuando se cree una nueva cita, configurando la URL del sistema externo y un secreto para validar la autenticidad.
2. Cuando se crea una nueva cita en el ERP, el sistema detecta el evento, busca todos los webhooks activos configurados para el evento 'cita.creada' y envía una solicitud HTTP POST a cada URL con los datos de la cita.
3. El sistema externo recibe el webhook, valida la firma HMAC usando el secreto compartido y procesa la información de la nueva cita.
4. El administrador puede ver en los logs del webhook si el envío fue exitoso o si hubo algún error, permitiendo diagnosticar problemas de integración.
5. Un desarrollador externo necesita acceder a la API pública para consultar información de pacientes. Solicita una clave de API a través del panel de administración, especificando qué permisos necesita.
6. El sistema genera una clave de API única y la muestra al desarrollador (solo una vez por seguridad).
7. El desarrollador utiliza esta clave en las cabeceras de sus solicitudes HTTP a la API pública para autenticarse y acceder a los datos permitidos.
8. El sistema registra cada uso de la clave de API, permitiendo al administrador ver qué aplicaciones están utilizando la API y revocar acceso si es necesario.

## 📝 User Stories

- Como Administrador de IT, quiero configurar webhooks para notificar a nuestro sistema de contabilidad cuando se cree una factura, para mantener los sistemas sincronizados automáticamente.
- Como Administrador de IT, quiero ver los logs de los webhooks para diagnosticar problemas cuando un sistema externo no recibe las notificaciones correctamente.
- Como Desarrollador Externo, quiero obtener una clave de API para acceder a los datos de pacientes de forma programática, respetando los permisos y la seguridad.
- Como Administrador del Sistema, quiero revocar claves de API que ya no se utilizan o que han sido comprometidas, para mantener la seguridad del sistema.
- Como Administrador de IT, quiero probar un webhook antes de activarlo para asegurarme de que la URL externa responde correctamente.

## ⚙️ Notas Técnicas

- Seguridad Webhooks: Implementar firma HMAC-SHA256 en todos los webhooks para que los sistemas externos puedan verificar la autenticidad de las solicitudes. El secreto debe ser único por webhook y almacenarse de forma cifrada.
- Reintentos: Implementar un sistema de reintentos exponenciales para webhooks que fallen, con un máximo de 3-5 intentos antes de marcar el webhook como fallido.
- Rate Limiting: Implementar límites de tasa para la API pública para prevenir abusos y asegurar la disponibilidad del sistema.
- Autenticación API: Utilizar Bearer Token authentication para la API pública, donde el token es la clave de API generada.
- Documentación: Proporcionar documentación interactiva (Swagger/OpenAPI) para la API pública, facilitando a los desarrolladores externos entender cómo utilizarla.
- Logging: Registrar todas las solicitudes a la API pública y todos los intentos de envío de webhooks para auditoría y diagnóstico.
- Validación: Validar estrictamente todas las URLs de webhooks antes de guardarlas, asegurándose de que sean HTTPS para mayor seguridad.
- Timeout: Configurar timeouts apropiados para las solicitudes de webhooks (ej. 10 segundos) para evitar que el sistema se bloquee esperando respuestas lentas.


