# Circuitos Automáticos (Recalls)

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

Los Circuitos Automáticos, comúnmente conocidos como 'Recalls', son una funcionalidad estratégica diseñada para automatizar la comunicación con los pacientes con el fin de programar citas de seguimiento, revisiones periódicas, higienes o fases posteriores de un tratamiento. Su objetivo principal es maximizar la retención de pacientes, asegurar la continuidad de los cuidados de salud bucodental y optimizar la ocupación de la agenda de la clínica. Dentro del ERP, este sistema funciona creando reglas lógicas (circuitos) que se disparan basadas en eventos clínicos, como por ejemplo: '6 meses después de la última limpieza', '1 año después de la última ortopantomografía' o '15 días después de una cirugía de implante'. Una vez que un paciente cumple con los criterios de un circuito, el sistema inicia una secuencia de comunicación predefinida y multicanal (SMS, email, WhatsApp) para invitarle a agendar una nueva cita. Aunque su naturaleza está íntimamente ligada al CRM y marketing, su inclusión en el módulo 'Gestión de Proveedores y Almacén' bajo la categoría 'Gestión de Recursos' se conceptualiza de forma abstracta: la base de datos de pacientes es el 'recurso' más valioso de la clínica, y esta funcionalidad gestiona el 'almacén' de oportunidades de comunicación y el 'suministro' de recordatorios para mantener activo dicho recurso, previniendo la pérdida de pacientes y asegurando un flujo constante de ingresos.

## 👥 Roles de Acceso

- Marketing / CRM
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Esta funcionalidad reside dentro de la feature 'gestion-proveedores-almacen'. La lógica de la interfaz se organiza en subcarpetas: `/pages` contiene los componentes de página principal como `CircuitosRecallsPage.tsx`; `/components` aloja los componentes reutilizables específicos de esta funcionalidad como `RecallsTable.tsx` o `RecallCircuitForm.tsx`; y `/apis` gestiona las funciones que realizan las llamadas a los endpoints del backend para obtener, crear y modificar los circuitos de recall.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/CircuitosRecallsPage.tsx`
- `/features/gestion-proveedores-almacen/pages/ConfiguracionRecallPage.tsx`
- `/features/gestion-proveedores-almacen/components/RecallsTable.tsx`
- `/features/gestion-proveedores-almacen/components/RecallCircuitForm.tsx`
- `/features/gestion-proveedores-almacen/components/CommunicationStepBuilder.tsx`
- `/features/gestion-proveedores-almacen/components/RecallStatsWidget.tsx`
- `/features/gestion-proveedores-almacen/apis/recallsApi.ts`

### Componentes React

- CircuitosRecallsPage
- ConfiguracionRecallPage
- RecallsTable
- RecallCircuitForm
- CommunicationStepBuilder
- RecallStatsWidget
- PatientPreviewModal

## 🔌 APIs Backend

El backend debe proporcionar una API RESTful para gestionar el ciclo de vida completo de los circuitos de recall. Esto incluye operaciones CRUD (Crear, Leer, Actualizar, Borrar), así como endpoints para ejecutar los circuitos, previsualizar los pacientes afectados y obtener estadísticas de rendimiento.

### `GET` `/api/recalls`

Obtiene una lista de todos los circuitos de recall configurados en la clínica.

**Parámetros:** status (opcional, para filtrar por activos/inactivos)

**Respuesta:** Un array de objetos RecallCircuit.

### `POST` `/api/recalls`

Crea un nuevo circuito de recall.

**Parámetros:** Body: Objeto con la definición del circuito (nombre, trigger, secuencia de comunicación, etc.)

**Respuesta:** El objeto RecallCircuit recién creado.

### `GET` `/api/recalls/:id`

Obtiene los detalles de un circuito de recall específico por su ID.

**Parámetros:** id (path param)

**Respuesta:** Un único objeto RecallCircuit.

### `PUT` `/api/recalls/:id`

Actualiza la configuración de un circuito de recall existente.

**Parámetros:** id (path param), Body: Objeto con los campos a actualizar.

**Respuesta:** El objeto RecallCircuit actualizado.

### `DELETE` `/api/recalls/:id`

Elimina un circuito de recall.

**Parámetros:** id (path param)

**Respuesta:** Mensaje de confirmación.

### `GET` `/api/recalls/:id/preview-patients`

Devuelve una lista paginada de pacientes que cumplen los criterios del trigger del circuito en el momento de la consulta.

**Parámetros:** id (path param), page (query param), limit (query param)

**Respuesta:** Array de objetos de pacientes simplificados.

### `GET` `/api/recalls/stats`

Obtiene estadísticas agregadas sobre el rendimiento de todos los circuitos (ej: mensajes enviados, citas agendadas, tasa de conversión).

**Respuesta:** Objeto con métricas de rendimiento.

## 🗂️ Estructura Backend (MERN)

El backend utiliza la arquitectura MERN. El modelo `RecallCircuit` define la estructura de datos en MongoDB. El `RecallController` contiene la lógica de negocio para gestionar estos circuitos y su ejecución, que es invocada a través de las rutas definidas en `recallRoutes.js`.

### Models

#### RecallCircuit

name: String, description: String, isActive: Boolean, trigger: { type: String, details: { treatmentId: ObjectId, appointmentType: String }, daysAfter: Number }, communicationSequence: [{ step: Number, channel: String, templateId: ObjectId, delayDays: Number }], createdBy: ObjectId, clinicId: ObjectId

#### RecallLog

recallCircuitId: ObjectId, patientId: ObjectId, communicationStep: Number, channel: String, status: String, sentAt: Date, errorDetails: String, appointmentBookedId: ObjectId

### Controllers

#### RecallController

- createRecallCircuit
- getAllRecallCircuits
- getRecallCircuitById
- updateRecallCircuit
- deleteRecallCircuit
- getEligiblePatientsForCircuit
- getRecallPerformanceStats
- triggerScheduledRecalls

### Routes

#### `/api/recalls`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id
- GET /:id/preview-patients
- GET /stats

## 🔄 Flujos

1. El usuario de Marketing accede a la página de 'Circuitos Automáticos', donde ve una tabla con los circuitos existentes y sus estadísticas básicas (activos/inactivos, pacientes contactados).
2. Para crear un nuevo circuito, el usuario hace clic en 'Nuevo Circuito'. Se abre un formulario donde define el nombre, el disparador (ej: 'Tratamiento finalizado', selecciona el tratamiento 'Implante', y establece '180 días después'), y construye la secuencia de comunicación (Paso 1: Email a los 180 días; Paso 2: SMS a los 190 días si no hay respuesta).
3. El usuario guarda el circuito. El sistema valida la configuración y lo almacena como 'activo'.
4. Diariamente, un proceso automatizado en el backend (cron job) recorre todos los circuitos activos.
5. Para cada circuito, el sistema busca en la base de datos de pacientes aquellos que cumplen las condiciones del disparador y que no hayan sido contactados para este paso del circuito.
6. El sistema envía las comunicaciones correspondientes (email/SMS) a través de servicios de terceros y registra la acción en el modelo `RecallLog`.
7. El usuario de Marketing puede revisar el rendimiento de un circuito, viendo cuántos mensajes se enviaron, cuántos pacientes agendaron cita (requiere seguimiento de enlaces o códigos), y la tasa de conversión.

## 📝 User Stories

- Como responsable de Marketing, quiero crear un circuito de recall para pacientes que no han venido a una limpieza en más de 8 meses, para fomentar su regreso y mantener la salud dental de nuestros pacientes.
- Como gestor de CRM, quiero configurar una secuencia de comunicación multicanal (email primero, luego SMS) para aumentar las posibilidades de que el paciente vea el recordatorio.
- Como responsable de IT, quiero poder desactivar temporalmente todos los circuitos de recall con un solo clic durante periodos festivos o de cierre de la clínica.
- Como responsable de Marketing, quiero ver un listado de los pacientes que serán contactados por un circuito antes de activarlo para asegurar que los criterios de selección son correctos.
- Como gestor de CRM, quiero analizar un panel con estadísticas que me muestre qué circuitos de recall generan más citas para poder replicar las estrategias exitosas.

## ⚙️ Notas Técnicas

- Es crucial implementar un manejador de tareas en segundo plano (background job scheduler) como `node-cron` o un sistema de colas más robusto como BullMQ con Redis para ejecutar la lógica de los recalls sin bloquear el servidor principal y garantizar su ejecución periódica y fiable.
- Se requiere la integración con APIs de terceros para el envío de comunicaciones: Twilio para SMS, SendGrid/Postmark/Mailgun para emails. Las credenciales de estas APIs deben ser almacenadas de forma segura (ej: en variables de entorno o un servicio de gestión de secretos).
- El sistema debe respetar las preferencias de comunicación del paciente. Antes de enviar cualquier mensaje, se debe verificar en el perfil del paciente si ha consentido recibir comunicaciones de marketing por ese canal (cumplimiento de GDPR/LOPD).
- Las consultas a la base de datos para encontrar pacientes elegibles deben estar altamente optimizadas. Se deben usar índices en MongoDB sobre los campos de fecha de última cita, tipo de tratamiento, y clínica para evitar escaneos de colección completos.
- Los mensajes deben ser personalizables mediante un sistema de plantillas (ej: usando `Handlebars.js`) que permita insertar variables como el nombre del paciente, el nombre del doctor o la fecha de su última visita.
- Se debe implementar un mecanismo de 'debounce' o bloqueo para evitar que un mismo paciente reciba múltiples recordatorios conflictivos si cumple los criterios para varios circuitos a la vez. Debe existir una lógica de priorización o exclusión.

