# Campañas de Email

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad de 'Campañas de Email' es una herramienta de marketing y comunicación estratégica integrada en el ERP dental. Permite al personal autorizado diseñar, segmentar, programar y analizar campañas de correo electrónico dirigidas a los pacientes de la clínica. Su propósito principal es fortalecer la relación con los pacientes (CRM), fomentar la retención, reactivar pacientes inactivos y comunicar novedades, promociones o consejos de salud bucal. A través de un editor visual intuitivo, los usuarios pueden crear correos atractivos utilizando plantillas personalizables. La característica más potente es su capacidad de segmentación, que permite dirigir las campañas a grupos específicos de pacientes basándose en datos demográficos, historial de tratamientos, fecha de la última visita o saldos pendientes, información extraída directamente del núcleo del ERP. Aunque está alojada bajo el módulo 'Gestión de Proveedores y Almacén', su función está primordialmente orientada al marketing y la gestión de pacientes, sirviendo como un recurso clave para impulsar el crecimiento de la clínica. Potencialmente, podría extenderse para gestionar comunicaciones con proveedores, aunque su diseño y enfoque principal es el CRM de pacientes.

## 👥 Roles de Acceso

- Marketing
- CRM
- Administrador

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Todo el código de frontend para la gestión de proveedores, almacén y funcionalidades asociadas como esta, reside en la carpeta '/features/gestion-proveedores-almacen/'. Esta página específica se implementa a través de archivos en las subcarpetas: '/pages/' contiene el componente principal de la ruta (Ej. EmailCampaignsPage.tsx), '/components/' aloja los componentes reutilizables (editor de campañas, tabla de resultados, selector de segmentos), y '/apis/' define las funciones que interactúan con el backend para crear, leer, actualizar y enviar las campañas.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/EmailCampaignsPage.tsx`
- `/features/gestion-proveedores-almacen/pages/CreateEditCampaignPage.tsx`
- `/features/gestion-proveedores-almacen/pages/CampaignReportPage.tsx`

### Componentes React

- CampaignsListTable
- CampaignEditor
- PatientSegmentBuilder
- EmailTemplateSelector
- CampaignSchedulerModal
- CampaignAnalyticsDashboard

## 🔌 APIs Backend

El backend expone una API RESTful para gestionar el ciclo de vida completo de las campañas de email, desde su creación como borrador hasta el análisis de su rendimiento post-envío. Incluye endpoints para CRUD de campañas y plantillas, un endpoint para la construcción dinámica de segmentos de pacientes y endpoints para programar/enviar las campañas y obtener sus estadísticas.

### `GET` `/api/campaigns`

Obtiene una lista paginada de todas las campañas de email, con información básica como nombre, estado y fecha de creación.

**Parámetros:** page (number), limit (number), sortBy (string), status (string)

**Respuesta:** Un objeto con un array de campañas y metadatos de paginación.

### `POST` `/api/campaigns`

Crea una nueva campaña de email en estado 'borrador'.

**Parámetros:** Body: { name, subject, templateId, segmentCriteria }

**Respuesta:** El objeto de la campaña recién creada.

### `GET` `/api/campaigns/:id`

Obtiene los detalles completos de una campaña específica, incluyendo su contenido HTML y la configuración del segmento.

**Parámetros:** id (string, de la campaña)

**Respuesta:** El objeto completo de la campaña.

### `PUT` `/api/campaigns/:id`

Actualiza los datos de una campaña existente (ej. cambiar el asunto, el contenido, el segmento).

**Parámetros:** id (string, de la campaña), Body: { name, subject, htmlContent, segmentCriteria }

**Respuesta:** El objeto de la campaña actualizada.

### `DELETE` `/api/campaigns/:id`

Elimina una campaña de email (solo si está en estado 'borrador').

**Parámetros:** id (string, de la campaña)

**Respuesta:** Mensaje de confirmación.

### `POST` `/api/campaigns/:id/schedule`

Programa una campaña para ser enviada en una fecha y hora específicas.

**Parámetros:** id (string, de la campaña), Body: { scheduledAt: ISOString }

**Respuesta:** El objeto de la campaña con el estado actualizado a 'programada'.

### `GET` `/api/campaigns/:id/report`

Obtiene las estadísticas de rendimiento de una campaña enviada (aperturas, clics, rebotes, etc.).

**Parámetros:** id (string, de la campaña)

**Respuesta:** Un objeto con las estadísticas de la campaña.

## 🗂️ Estructura Backend (MERN)

La lógica del backend se organiza en modelos de Mongoose para la persistencia de datos, controladores que encapsulan la lógica de negocio para cada entidad, y rutas de Express que exponen los endpoints de la API. Para las campañas, existe un modelo 'EmailCampaign', un controlador 'EmailCampaignController' y un archivo de rutas dedicado.

### Models

#### EmailCampaign

name (String), subject (String), htmlContent (String), status (String, enum: ['draft', 'scheduled', 'sending', 'sent', 'failed']), scheduledAt (Date), sentAt (Date), segmentCriteria (Object), stats: { totalRecipients: Number, opens: Number, clicks: Number, bounces: Number, unsubscribes: Number }

#### EmailTemplate

name (String), htmlContent (String), thumbnailUrl (String)

#### Patient

Se utiliza este modelo existente para la segmentación, consultando campos como: firstName, lastName, email, lastVisitDate, treatments (Array de ObjectIds), accountBalance, etc.

### Controllers

#### EmailCampaignController

- getAllCampaigns
- getCampaignById
- createCampaign
- updateCampaign
- deleteCampaign
- scheduleCampaign
- getCampaignReport

#### PatientSegmentController

- getPatientCountForSegment
- getPatientsInSegment

### Routes

#### `/api/campaigns`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id
- POST /:id/schedule
- GET /:id/report

## 🔄 Flujos

1. Creación de Campaña: El usuario de Marketing accede a la sección, pulsa 'Nueva Campaña', asigna un nombre, elige una plantilla, define los criterios del segmento de pacientes (ej. 'pacientes con visita en los últimos 6 meses'), personaliza el contenido en el editor visual y guarda la campaña como borrador.
2. Programación y Envío: El usuario abre un borrador, previsualiza el email, confirma el número de destinatarios, pulsa 'Programar', selecciona una fecha y hora, y confirma. El sistema cambia el estado a 'programado' y un trabajo en segundo plano se encargará del envío.
3. Análisis de Resultados: Días después del envío, el usuario vuelve a la lista de campañas, localiza la campaña enviada y accede a su informe. En el panel de control, visualiza métricas clave como la tasa de apertura, tasa de clics y el número de bajas para evaluar su efectividad.

## 📝 User Stories

- Como gestor de CRM, quiero crear segmentos de pacientes basados en su historial de tratamientos para enviarles campañas informativas sobre cuidados posteriores específicos.
- Como usuario de Marketing, quiero utilizar plantillas de email pre-diseñadas para asegurar la consistencia de la marca y agilizar la creación de nuevas campañas.
- Como Administrador, quiero ver un listado de todas las campañas programadas y enviadas para tener una visión general de las comunicaciones de marketing de la clínica.
- Como gestor de CRM, quiero analizar las métricas de apertura y clics de cada campaña para entender qué contenido resuena más con nuestros pacientes y optimizar futuras comunicaciones.
- Como usuario de Marketing, quiero poder programar una campaña de felicitación de cumpleaños para que se envíe automáticamente a los pacientes en su día.

## ⚙️ Notas Técnicas

- Integración con Servicio de Email (ESP): El envío de correos masivos no debe realizarse desde el servidor de la aplicación. Es imperativo integrarse con un proveedor de servicios de email como SendGrid, Mailgun o Amazon SES a través de su API para asegurar la entregabilidad y no dañar la reputación del dominio.
- Gestión de Tareas en Segundo Plano: El proceso de envío de emails a una lista de contactos debe ser gestionado por un sistema de colas (ej. BullMQ con Redis). Esto evita bloquear el hilo principal de la aplicación y permite reintentos, control de velocidad y manejo de errores de forma robusta.
- Seguimiento de Eventos (Tracking): El seguimiento de aperturas se implementa con un píxel de 1x1 transparente en el cuerpo del email. El seguimiento de clics se logra reescribiendo todos los enlaces del email para que pasen por un endpoint de redirección en nuestro backend antes de llegar al destino final. Estos endpoints deben registrar el evento y ser altamente eficientes.
- Cumplimiento Normativo (GDPR/LOPD): Cada email de marketing debe incluir un enlace de 'darse de baja' claramente visible. El sistema debe tener un mecanismo para registrar y honrar estas solicitudes de baja de forma inmediata y permanente.
- Optimización de Consultas: Las consultas para generar segmentos de pacientes pueden ser pesadas. Es fundamental asegurar que los campos utilizados para la segmentación en la colección 'Patient' de MongoDB (ej. 'lastVisitDate', 'treatments.treatmentId') tengan los índices adecuados.

