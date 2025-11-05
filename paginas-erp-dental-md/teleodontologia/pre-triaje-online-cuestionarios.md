# Pre-triaje Online (Cuestionarios)

**Categoría:** Telemedicina | **Módulo:** Teleodontología

El Pre-triaje Online es una funcionalidad clave dentro del módulo de Teleodontología, diseñada para optimizar la preparación de las consultas y mejorar la seguridad tanto del paciente como del personal clínico. Su propósito principal es permitir a la clínica dental crear y enviar cuestionarios digitales personalizados a los pacientes antes de su visita física o teleconsulta. Estos cuestionarios pueden abarcar desde la actualización del historial médico y dental, consentimiento informado, hasta sondeos específicos sobre síntomas (como los relacionados con COVID-19 u otras condiciones infecciosas). El funcionamiento es sencillo pero potente: el personal autorizado (recepción u odontólogo) crea plantillas de cuestionarios a través de una interfaz de construcción de formularios. Al programar una cita, se puede asociar uno de estos cuestionarios y enviarlo automáticamente al paciente a través de un enlace seguro por email o SMS. El paciente completa el formulario desde su dispositivo (móvil o computador) a través del portal del paciente o un enlace público seguro. Las respuestas se almacenan de forma segura en el ERP, asociadas al registro del paciente y a la cita correspondiente. Esto permite al odontólogo revisar la información con antelación, identificar posibles alertas médicas, preparar el equipo necesario y reducir significativamente el tiempo administrativo durante la consulta, dedicando más tiempo a la atención clínica real. Además, minimiza el contacto con papel y fomenta un entorno más seguro y eficiente en la clínica.

## 👥 Roles de Acceso

- Paciente
- Recepción / Secretaría
- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/teleodontologia/`

La funcionalidad de Pre-triaje Online reside dentro de la feature 'teleodontologia'. La subcarpeta /pages contendrá las páginas principales: una para la gestión de plantillas de cuestionarios, otra para la visualización de respuestas y una para que el paciente complete el formulario. En /components se ubicarán los componentes reutilizables como el constructor de formularios (QuestionnaireBuilder), el formulario dinámico para el paciente (QuestionnaireForm), y el visor de respuestas (QuestionnaireViewer). La carpeta /apis gestionará la comunicación con el backend, conteniendo funciones para crear/leer/actualizar plantillas y enviar/recuperar las respuestas de los pacientes.

### Archivos Frontend

- `/features/teleodontologia/pages/GestionPlantillasCuestionarioPage.tsx`
- `/features/teleodontologia/pages/RespuestasCuestionarioPage.tsx`
- `/features/teleodontologia/pages/CompletarCuestionarioPacientePage.tsx`

### Componentes React

- QuestionnaireBuilder
- QuestionnaireForm
- QuestionnaireViewer
- QuestionnaireTemplateList
- SubmittedQuestionnaireTable

## 🔌 APIs Backend

Las APIs son fundamentales para gestionar todo el ciclo de vida de los cuestionarios, desde la creación de plantillas por parte del personal, la asignación a pacientes, la recepción de sus respuestas y la posterior consulta por parte de los profesionales.

### `GET` `/api/questionnaire-templates`

Obtiene una lista de todas las plantillas de cuestionarios disponibles en la clínica.

**Respuesta:** Array de objetos de QuestionnaireTemplate.

### `POST` `/api/questionnaire-templates`

Crea una nueva plantilla de cuestionario.

**Parámetros:** body: { name: string, description: string, questions: [object] }

**Respuesta:** El objeto de la QuestionnaireTemplate recién creada.

### `PUT` `/api/questionnaire-templates/:templateId`

Actualiza una plantilla de cuestionario existente.

**Parámetros:** path: templateId, body: { name: string, description: string, questions: [object] }

**Respuesta:** El objeto de la QuestionnaireTemplate actualizada.

### `POST` `/api/questionnaire-assignments`

Asigna un cuestionario a un paciente para una cita específica, generando un enlace único.

**Parámetros:** body: { patientId: string, templateId: string, appointmentId: string (opcional) }

**Respuesta:** Objeto con el token de acceso único para el paciente.

### `GET` `/api/questionnaire-assignments/:token`

Endpoint público que usa el paciente para obtener la estructura del cuestionario que debe completar.

**Parámetros:** path: token

**Respuesta:** El objeto de la QuestionnaireTemplate a completar.

### `POST` `/api/questionnaire-submissions`

Endpoint que recibe las respuestas del cuestionario completado por el paciente.

**Parámetros:** body: { assignmentToken: string, answers: [object] }

**Respuesta:** Objeto de confirmación de la recepción.

### `GET` `/api/questionnaire-submissions`

Obtiene las respuestas de cuestionarios, filtrables por paciente o cita.

**Parámetros:** query: patientId, query: appointmentId

**Respuesta:** Array de objetos de QuestionnaireSubmission.

## 🗂️ Estructura Backend (MERN)

El backend soportará esta funcionalidad con tres modelos principales: uno para las plantillas (QuestionnaireTemplate), otro para las asignaciones (QuestionnaireAssignment) que vincula una plantilla a un paciente y genera un token, y un tercero para las respuestas enviadas (QuestionnaireSubmission). Los controladores gestionarán la lógica de negocio y las rutas expondrán los endpoints de la API de forma segura y organizada.

### Models

#### QuestionnaireTemplate

name: String, description: String, questions: [{ type: String ('text', 'select', 'checkbox', 'radio'), label: String, options: [String], required: Boolean }]

#### QuestionnaireAssignment

patientId: ObjectId (ref: 'Patient'), templateId: ObjectId (ref: 'QuestionnaireTemplate'), appointmentId: ObjectId (ref: 'Appointment'), uniqueToken: String (indexed, unique), status: String ('pending', 'completed'), expiresAt: Date

#### QuestionnaireSubmission

assignmentId: ObjectId (ref: 'QuestionnaireAssignment'), patientId: ObjectId (ref: 'Patient'), templateId: ObjectId (ref: 'QuestionnaireTemplate'), submissionDate: Date, answers: [{ questionLabel: String, answer: mongoose.Schema.Types.Mixed }]

### Controllers

#### QuestionnaireTemplateController

- createTemplate
- getAllTemplates
- getTemplateById
- updateTemplate
- deleteTemplate

#### QuestionnaireController

- createAssignment
- getQuestionnaireByToken
- submitAnswers
- getSubmissions

### Routes

#### `/api/questionnaire-templates`

- GET /
- POST /
- GET /:templateId
- PUT /:templateId
- DELETE /:templateId

#### `/api/questionnaires`

- POST /assignments
- GET /assignments/:token
- POST /submissions
- GET /submissions

## 🔄 Flujos

1. Flujo de Creación de Plantilla: El odontólogo o administrador accede a la sección de gestión de cuestionarios, crea una nueva plantilla, añade preguntas de diferentes tipos (texto, selección, etc.), y la guarda en el sistema para uso futuro.
2. Flujo de Envío a Paciente: El personal de recepción, al agendar una cita, selecciona una plantilla de pre-triaje de la lista. El sistema genera un enlace único y lo envía al paciente por correo electrónico o SMS.
3. Flujo de Respuesta del Paciente: El paciente recibe el enlace, accede a un formulario web seguro (en el portal o público), completa las preguntas y envía sus respuestas. El sistema registra la finalización.
4. Flujo de Revisión Clínica: Antes de la consulta, el odontólogo abre la ficha del paciente o el detalle de la cita, accede a la pestaña de cuestionarios y revisa las respuestas enviadas para preparar la atención.

## 📝 User Stories

- Como Odontólogo, quiero crear plantillas de cuestionarios personalizadas para recoger la información médica más relevante antes de una primera visita.
- Como Recepcionista, quiero enviar automáticamente el cuestionario de 'Actualización COVID-19' a todos los pacientes 24 horas antes de su cita para garantizar la seguridad en la clínica.
- Como Paciente, quiero completar mi historial médico desde mi móvil antes de llegar a la clínica para no perder tiempo en la sala de espera.
- Como Odontólogo, quiero ver una alerta en la agenda si un paciente ha respondido 'Sí' a preguntas críticas en el cuestionario de pre-triaje, como alergias a medicamentos.
- Como Recepcionista, quiero poder verificar en el sistema si un paciente ha completado el cuestionario enviado para poder recordárselo si no lo ha hecho.

## ⚙️ Notas Técnicas

- Seguridad: Implementar autenticación JWT para todos los endpoints accedidos por personal de la clínica. Los enlaces para pacientes deben usar tokens de un solo uso o con caducidad corta (ej. 48h) para mitigar riesgos. Asegurar el cumplimiento de normativas de protección de datos como LOPD/GDPR/HIPAA.
- Integración: El sistema debe integrarse con un servicio de notificaciones (ej. Twilio, SendGrid) para el envío de los enlaces por SMS y email. Las respuestas deben vincularse directamente a los modelos de Paciente y Cita.
- UI/UX: El constructor de cuestionarios ('QuestionnaireBuilder') debe ser intuitivo, preferiblemente con una interfaz de arrastrar y soltar (drag-and-drop) para los tipos de pregunta. El formulario para el paciente debe ser responsive y accesible.
- Versionado: Considerar un sistema de versionado para las plantillas de cuestionarios. Si una plantilla se actualiza, las respuestas antiguas deben permanecer vinculadas a la versión con la que fueron creadas.
- Lógica Condicional: Para una funcionalidad avanzada, el 'QuestionnaireBuilder' podría permitir lógica condicional (mostrar una pregunta basada en la respuesta de otra).

