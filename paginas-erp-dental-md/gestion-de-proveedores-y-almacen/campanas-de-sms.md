# Campañas de SMS

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad de 'Campañas de SMS' es una herramienta de marketing y comunicación directa que permite a la clínica dental crear, segmentar, programar y analizar campañas de mensajes de texto masivos dirigidas a pacientes. Aunque es una potente herramienta de CRM, se ubica dentro del módulo 'Gestión de Proveedores y Almacén' y la categoría 'Gestión de Recursos' debido a su capacidad para optimizar el uso de recursos clave de la clínica. Por ejemplo, permite lanzar promociones sobre tratamientos que utilizan consumibles específicos del almacén (como kits de blanqueamiento o implantes de una marca particular), ayudando a gestionar el stock y a maximizar el retorno de la inversión en inventario. También se utiliza para gestionar el recurso más valioso, el tiempo de los profesionales, enviando campañas para rellenar huecos en la agenda o promocionando servicios en temporadas de baja afluencia. El sistema permite definir plantillas, segmentar la base de datos de pacientes por múltiples criterios (edad, último tratamiento, fecha de última visita, tratamientos pendientes) y programar los envíos para maximizar su efectividad. Además, ofrece estadísticas detalladas sobre la entrega y el rendimiento de cada campaña, proporcionando información valiosa para futuras estrategias de comunicación y fidelización.

## 👥 Roles de Acceso

- Marketing / CRM

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

La funcionalidad de Campañas de SMS reside dentro de la feature 'gestion-proveedores-almacen'. La lógica de la interfaz se encuentra en '/pages/CampanasSmsPage.tsx', que actúa como el punto de entrada principal. Esta página utiliza componentes reutilizables de '/components/', como 'FormularioNuevaCampanaSms' para la creación y edición, y 'TablaCampanasSms' para listar las campañas existentes. Las interacciones con el backend se gestionan a través de funciones definidas en '/apis/campanasSmsApi.ts', que encapsulan las llamadas a los endpoints del servidor.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/CampanasSmsPage.tsx`
- `/features/gestion-proveedores-almacen/components/TablaCampanasSms.tsx`
- `/features/gestion-proveedores-almacen/components/FormularioNuevaCampanaSms.tsx`
- `/features/gestion-proveedores-almacen/components/ModalEstadisticasCampana.tsx`
- `/features/gestion-proveedores-almacen/components/SelectorSegmentoPacientes.tsx`
- `/features/gestion-proveedores-almacen/apis/campanasSmsApi.ts`

### Componentes React

- CampanasSmsPage
- TablaCampanasSms
- FormularioNuevaCampanaSms
- ModalEstadisticasCampana
- SelectorSegmentoPacientes
- VisualizadorMensajeSms

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan todo el ciclo de vida de una campaña de SMS, desde su creación como borrador hasta el análisis de sus resultados. Se requiere una integración con un proveedor de servicios de SMS externo (como Twilio o Vonage). Los endpoints permiten crear campañas, definir audiencias mediante reglas de segmentación, programarlas y consultar estadísticas de entrega.

### `GET` `/api/sms-campaigns`

Obtiene una lista paginada de todas las campañas de SMS, con filtros opcionales por estado (borrador, programada, enviada).

**Parámetros:** page (number), limit (number), status (string)

**Respuesta:** Un objeto con la lista de campañas y metadatos de paginación.

### `POST` `/api/sms-campaigns`

Crea una nueva campaña de SMS. La campaña se guarda como borrador hasta que se programe.

**Parámetros:** body: { name: string, message: string, targetSegment: object }

**Respuesta:** El objeto de la campaña recién creada.

### `GET` `/api/sms-campaigns/:id`

Obtiene los detalles de una campaña específica por su ID.

**Parámetros:** id (string)

**Respuesta:** El objeto completo de la campaña.

### `PUT` `/api/sms-campaigns/:id`

Actualiza una campaña existente. Se utiliza para modificar el mensaje, el segmento o para programar su envío.

**Parámetros:** id (string), body: { name?: string, message?: string, targetSegment?: object, scheduledAt?: Date }

**Respuesta:** El objeto de la campaña actualizada.

### `DELETE` `/api/sms-campaigns/:id`

Elimina una campaña que se encuentra en estado de borrador.

**Parámetros:** id (string)

**Respuesta:** Mensaje de confirmación de eliminación.

### `GET` `/api/sms-campaigns/:id/stats`

Obtiene las estadísticas de una campaña ya enviada (mensajes enviados, entregados, fallidos, etc.).

**Parámetros:** id (string)

**Respuesta:** Un objeto con las estadísticas de la campaña.

### `POST` `/api/sms-campaigns/preview`

Obtiene una vista previa del número de pacientes que coinciden con un segmento específico, sin crear la campaña.

**Parámetros:** body: { targetSegment: object }

**Respuesta:** Un objeto con el recuento de pacientes que recibirían el SMS.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo 'SmsCampaign' para almacenar la información de cada campaña en MongoDB. Un controlador 'SmsCampaignController' contiene la lógica para gestionar las operaciones CRUD y la programación de envíos, interactuando con el modelo y un servicio externo de SMS. Las rutas se definen en un archivo dedicado que mapea los endpoints HTTP a las funciones del controlador.

### Models

#### SmsCampaign

name (String), message (String), targetSegment (Object, contiene criterios de filtrado como 'lastVisitBefore', 'ageRange', 'pendingTreatments'), status (String, enum: ['draft', 'scheduled', 'sending', 'sent', 'failed']), scheduledAt (Date), sentAt (Date), createdBy (ObjectId, ref: 'User'), stats (Object, { total: Number, sent: Number, delivered: Number, failed: Number })

#### Patient

Se utiliza para la segmentación. Campos relevantes: firstName, lastName, phone, birthDate, lastVisitDate, treatmentHistory (Array).

### Controllers

#### SmsCampaignController

- getAllCampaigns
- getCampaignById
- createCampaign
- updateCampaign
- deleteCampaign
- getCampaignStats
- getSegmentPreviewCount

### Routes

#### `/api/sms-campaigns`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id
- GET /:id/stats
- POST /preview

## 🔄 Flujos

1. El usuario de Marketing accede a la página 'Campañas de SMS' y ve una tabla con las campañas existentes y su estado.
2. El usuario hace clic en 'Crear Nueva Campaña'. Se abre un formulario donde introduce un nombre para la campaña, redacta el mensaje de texto y define el segmento de pacientes (ej: 'pacientes que no han visitado la clínica en los últimos 12 meses').
3. El sistema muestra una vista previa del número de pacientes que cumplen con los criterios del segmento.
4. El usuario guarda la campaña como borrador o la programa para una fecha y hora específicas.
5. Llegada la hora programada, un trabajo en segundo plano (cron job) recupera la campaña, obtiene la lista de pacientes del segmento y envía los SMS a través del proveedor externo.
6. El estado de la campaña se actualiza a 'enviando' y luego a 'enviada'. Las estadísticas de entrega se actualizan a medida que el proveedor de SMS las notifica.
7. El usuario puede volver a la página y consultar las estadísticas de la campaña enviada para evaluar su rendimiento.

## 📝 User Stories

- Como gestor de Marketing, quiero crear una campaña de SMS para promocionar un nuevo servicio de blanqueamiento dental entre pacientes de 25 a 45 años para aumentar las ventas de este servicio.
- Como responsable de CRM, quiero segmentar la lista de pacientes para enviar un recordatorio de revisión anual solo a aquellos que no han acudido en más de un año para mejorar la retención.
- Como gestor de Marketing, quiero programar el envío de una campaña de felicitación de cumpleaños para que se envíe automáticamente en la fecha correcta para fidelizar a los pacientes.
- Como responsable de CRM, quiero ver las estadísticas de mis campañas (tasa de entrega, errores) para entender qué comunicaciones funcionan mejor y optimizar futuras campañas.

## ⚙️ Notas Técnicas

- Es necesaria la integración con un proveedor de SMS Gateway como Twilio, Vonage o similar. Las credenciales (API Key, Secret) deben ser almacenadas de forma segura como variables de entorno en el backend.
- Se debe implementar un sistema de trabajos en segundo plano (cron jobs) con librerías como 'node-cron' o un sistema de colas más robusto (BullMQ con Redis) para gestionar el envío de campañas programadas de forma fiable.
- La lógica de segmentación de pacientes debe estar optimizada para realizar consultas eficientes en la base de datos MongoDB, especialmente con una gran cantidad de pacientes.
- Se debe gestionar el consentimiento explícito de los pacientes para recibir comunicaciones de marketing, en cumplimiento con normativas como GDPR o LOPD. Esto implica tener un campo 'marketingConsent' en el modelo de Paciente.
- Implementar un mecanismo de 'webhook' para recibir actualizaciones de estado de entrega de los SMS desde el proveedor externo y actualizar las estadísticas de la campaña en tiempo real.
- Considerar la gestión de listas de 'opt-out' para que los pacientes puedan darse de baja de las comunicaciones por SMS.

