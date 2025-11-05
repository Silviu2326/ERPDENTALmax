# Recordatorios de Citas

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad de 'Recordatorios de Citas' es un sistema automatizado diseñado para minimizar las inasistencias de pacientes (no-shows) y optimizar la ocupación de la agenda clínica. Su propósito principal es enviar comunicaciones proactivas a los pacientes a través de múltiples canales (SMS, WhatsApp, Email) para recordarles sus próximas citas, solicitar confirmación y facilitar la cancelación o reprogramación. Aunque nominalmente se encuentra bajo el módulo 'Gestión de Proveedores y Almacén', su rol en la 'Gestión de Recursos' es fundamental. Al asegurar la asistencia de los pacientes, el sistema garantiza que los recursos más valiosos de la clínica —el tiempo de los odontólogos y del personal, el uso de los gabinetes y el equipamiento— se utilicen de manera eficiente. Además, al obtener una confirmación de cita, se puede prever con mayor exactitud el uso de materiales y consumibles específicos para cada tratamiento, permitiendo al área de almacén preparar los kits necesarios y gestionar el inventario de forma proactiva. El sistema permite una personalización completa de las plantillas de mensajes, la configuración de la cadencia de envío (ej., 48 horas y 24 horas antes de la cita) y el seguimiento en tiempo real del estado de cada recordatorio (enviado, entregado, leído, respondido). Esta automatización libera al personal de recepción de la tarea manual de llamar a cada paciente, permitiéndoles centrarse en la atención al cliente en la clínica.

## 👥 Roles de Acceso

- Marketing / CRM
- Recepción / Secretaría
- Call Center

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Esta funcionalidad reside dentro de la feature 'gestion-proveedores-almacen'. La carpeta '/pages/' contiene el componente principal de la interfaz, 'RecordatoriosCitasPage.tsx', que renderiza el panel de control. La carpeta '/components/' alberga componentes reutilizables como 'TablaHistorialRecordatorios' para mostrar el log de envíos, 'FormularioConfiguracionAutomatizacion' para definir las reglas de envío, y 'EditorPlantillasMensajes' para crear y modificar los textos. Finalmente, la carpeta '/apis/' contiene las funciones, como 'recordatoriosApi.ts', que realizan las llamadas a los endpoints del backend para obtener datos y ejecutar acciones.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/RecordatoriosCitasPage.tsx`
- `/features/gestion-proveedores-almacen/pages/ConfiguracionPlantillasPage.tsx`
- `/features/gestion-proveedores-almacen/components/TablaHistorialRecordatorios.tsx`
- `/features/gestion-proveedores-almacen/components/FormularioConfiguracionAutomatizacion.tsx`
- `/features/gestion-proveedores-almacen/components/EditorPlantillasMensajes.tsx`
- `/features/gestion-proveedores-almacen/components/PanelEstadisticasRecordatorios.tsx`
- `/features/gestion-proveedores-almacen/apis/recordatoriosApi.ts`

### Componentes React

- TablaHistorialRecordatorios
- FormularioConfiguracionAutomatizacion
- EditorPlantillasMensajes
- PanelEstadisticasRecordatorios
- ModalVistaPreviaMensaje

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan la configuración de los envíos automáticos, la administración de plantillas de mensajes y la consulta del historial de comunicaciones con los pacientes.

### `GET` `/api/recordatorios/historial`

Obtiene una lista paginada del historial de recordatorios enviados, permitiendo filtrar por rango de fechas, paciente, estado de la cita o estado del envío.

**Parámetros:** query.fechaInicio, query.fechaFin, query.pacienteId, query.estado, query.page, query.limit

**Respuesta:** Un objeto con una lista de historiales de recordatorios y metadatos de paginación.

### `GET` `/api/recordatorios/configuracion`

Obtiene la configuración actual del sistema de recordatorios, como los intervalos de envío y las plantillas por defecto.

**Respuesta:** Un objeto con la configuración actual.

### `PUT` `/api/recordatorios/configuracion`

Actualiza la configuración del sistema de recordatorios.

**Parámetros:** body.reglasEnvio, body.canalesActivos, body.plantillaDefectoId

**Respuesta:** El objeto de configuración actualizado.

### `GET` `/api/recordatorios/plantillas`

Obtiene todas las plantillas de mensajes disponibles.

**Respuesta:** Un array de objetos de plantilla.

### `POST` `/api/recordatorios/plantillas`

Crea una nueva plantilla de mensaje.

**Parámetros:** body.nombre, body.tipo (SMS, Email, WhatsApp), body.cuerpo

**Respuesta:** El objeto de la nueva plantilla creada.

### `PUT` `/api/recordatorios/plantillas/:id`

Actualiza una plantilla de mensaje existente.

**Parámetros:** params.id, body.nombre, body.tipo, body.cuerpo

**Respuesta:** El objeto de la plantilla actualizada.

### `DELETE` `/api/recordatorios/plantillas/:id`

Elimina una plantilla de mensaje.

**Parámetros:** params.id

**Respuesta:** Un mensaje de confirmación.

### `POST` `/api/citas/:id/enviar-recordatorio-manual`

Dispara el envío manual de un recordatorio para una cita específica, fuera del flujo automático.

**Parámetros:** params.id, body.plantillaId

**Respuesta:** Un objeto con el estado del envío.

## 🗂️ Estructura Backend (MERN)

El backend utiliza modelos para las plantillas, el historial y la configuración. Un controlador gestiona toda la lógica de negocio, y las rutas exponen esta lógica a través de una API RESTful. Se apoya en un sistema de tareas programadas (cron job) para la automatización.

### Models

#### RecordatorioPlantilla

nombre: String, tipo: Enum['SMS', 'Email', 'WhatsApp'], asunto: String, cuerpo: String, variables: [String], activo: Boolean

#### RecordatorioHistorial

cita: ObjectId (ref: 'Cita'), paciente: ObjectId (ref: 'Paciente'), plantilla: ObjectId (ref: 'RecordatorioPlantilla'), canal: String, fecha_envio: Date, estado: Enum['Pendiente', 'Enviado', 'Entregado', 'Fallido', 'Confirmado', 'Cancelado'], respuesta_paciente: String, id_mensaje_proveedor: String

#### ConfiguracionRecordatorio

activado: Boolean, reglas_envio: [{tiempo_antes: Number, unidad: String ('horas', 'dias'), plantillaId: ObjectId}], webhooks: {twilio_sid: String}

#### Cita

paciente: ObjectId, fecha_hora_inicio: Date, estado: Enum['Programada', 'Confirmada', 'Cancelada por Paciente', 'Realizada', 'Inasistencia']

### Controllers

#### RecordatorioController

- getHistorial
- getConfiguracion
- updateConfiguracion
- getAllPlantillas
- createPlantilla
- updatePlantilla
- deletePlantilla
- handleIncomingMessageWebhook

#### CitaController

- enviarRecordatorioManual

### Routes

#### `/api/recordatorios`

- GET /historial
- GET /configuracion
- PUT /configuracion
- GET /plantillas
- POST /plantillas
- PUT /plantillas/:id
- DELETE /plantillas/:id
- POST /webhook/respuesta

## 🔄 Flujos

1. El usuario de Marketing configura las plantillas de mensajes (ej. 'Hola {{nombre_paciente}}, te recordamos tu cita el {{fecha_cita}} a las {{hora_cita}}. Responde SÍ para confirmar.') y establece las reglas de envío (ej. un primer recordatorio 48h antes y un segundo 24h antes).
2. Un cron job se ejecuta periódicamente (ej. cada hora), busca las citas que cumplen con las reglas de envío, genera el mensaje personalizado y lo envía a través del proveedor externo (ej. Twilio).
3. El personal de Recepción consulta el panel de 'Recordatorios de Citas' para ver el estado de los envíos del día. Pueden filtrar por 'Pendiente de confirmación' para identificar a los pacientes que no han respondido.
4. Un paciente responde 'SÍ' al SMS. El proveedor externo notifica al backend a través de un webhook. El sistema procesa la respuesta, actualiza el estado del recordatorio a 'Confirmado' y el estado de la cita en la agenda a 'Confirmada'.
5. Si un paciente no responde, el personal del Call Center utiliza la lista de no confirmados para realizar llamadas de seguimiento y confirmar o reprogramar la cita manualmente.

## 📝 User Stories

- Como recepcionista, quiero ver una lista en tiempo real de qué pacientes han confirmado su cita a través del recordatorio para poder gestionar la agenda del día siguiente de forma eficiente.
- Como responsable de Marketing, quiero crear diferentes plantillas de mensajes para distintos tipos de citas (ej. primera visita, revisión, cirugía) para ofrecer una comunicación más personalizada.
- Como personal del Call Center, quiero filtrar fácilmente las citas no confirmadas para centrar mis esfuerzos de llamada en los pacientes que aún no han respondido.
- Como gerente de la clínica, quiero acceder a un dashboard con estadísticas sobre la tasa de confirmación, la reducción de inasistencias y la efectividad de cada canal (SMS vs. WhatsApp) para tomar decisiones basadas en datos.

## ⚙️ Notas Técnicas

- Integración Externa: Es mandatorio integrar con un proveedor de servicios de comunicación como Twilio, Vonage o la API oficial de WhatsApp Business. Las credenciales deben ser almacenadas de forma segura como variables de entorno.
- Tareas Programadas (Cron Jobs): El backend debe implementar un sistema robusto de tareas programadas (ej. `node-cron` o un servicio de cola de trabajos como BullMQ) para automatizar el proceso de envío. Debe ser idempotente para evitar envíos duplicados.
- Webhooks: Se debe exponer un endpoint seguro para recibir webhooks de los proveedores de comunicación y procesar las respuestas de los pacientes de forma asíncrona.
- Protección de Datos (LOPD/GDPR): Los mensajes contienen datos de salud protegidos. Se debe obtener el consentimiento explícito del paciente para recibir estas comunicaciones y asegurar que toda la transmisión y almacenamiento de datos sea encriptada.
- Manejo de Zonas Horarias: El sistema debe ser consciente de la zona horaria de la clínica para que el cron job envíe los recordatorios en las horas correctas (ej. 9:00 AM hora local) y no en mitad de la noche.
- Parsing de Respuestas: Implementar una lógica flexible para interpretar las respuestas de los pacientes (ej. 'Si', 'sí', 'ok', 'confirmo' deben ser interpretadas como una confirmación).

