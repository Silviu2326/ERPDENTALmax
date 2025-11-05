# Solicitud de Cita por Internet

**Categoría:** Plataforma Digital | **Módulo:** Portal de Cita Online y Móvil

La funcionalidad 'Solicitud de Cita por Internet' es un componente crucial del 'Portal de Cita Online y Móvil', diseñado para que los pacientes, tanto nuevos como existentes, puedan solicitar citas de manera autónoma a través de la página web de la clínica. Su objetivo principal es descongestionar las líneas telefónicas y el trabajo administrativo de recepción, mejorar la experiencia del paciente ofreciendo un servicio 24/7, y actuar como una herramienta de captación de nuevos clientes. El proceso funciona como un asistente guiado: el paciente selecciona el motivo de la consulta (tratamiento), su profesional de preferencia (o elige 'cualquiera disponible'), y visualiza un calendario interactivo que muestra únicamente los días y horas con disponibilidad real. Esta disponibilidad se calcula en tiempo real consultando la agenda central del ERP, cruzando los horarios de los profesionales, la duración estimada de los tratamientos y las citas ya programadas. Una vez que el paciente completa sus datos y envía la solicitud, el sistema no crea una cita directamente, sino una 'solicitud de cita' con estado 'pendiente'. Esto permite al personal de recepción revisar la solicitud, verificar la información y los huecos en la agenda, y finalmente confirmarla, momento en el cual se convierte en una cita oficial en el sistema, notificando automáticamente al paciente por correo electrónico. Esta página es la puerta de entrada digital para la programación de pacientes, integrándose directamente con los módulos de Agenda, Pacientes y Profesionales del ERP.

## 👥 Roles de Acceso

- Paciente (Portal)
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-cita-online-movil/`

Esta funcionalidad se encuentra dentro de la carpeta 'portal-cita-online-movil'. La subcarpeta '/pages' contiene el archivo principal 'SolicitarCitaPage.tsx', que renderiza la interfaz pública para la solicitud de citas. La lógica y el estado del formulario se gestionan en componentes dentro de '/components', como 'FormularioSolicitudCita.tsx'. Las interacciones con el backend, como obtener disponibilidad o enviar la solicitud, se manejan a través de funciones definidas en '/apis/citasOnlineApi.ts'.

### Archivos Frontend

- `/features/portal-cita-online-movil/pages/SolicitarCitaPage.tsx`
- `/features/portal-cita-online-movil/pages/ConfirmacionSolicitudPage.tsx`
- `/features/portal-cita-online-movil/components/FormularioSolicitudCita.tsx`
- `/features/portal-cita-online-movil/components/CalendarioDisponibilidad.tsx`
- `/features/portal-cita-online-movil/components/SelectorHorario.tsx`
- `/features/portal-cita-online-movil/apis/citasOnlineApi.ts`

### Componentes React

- FormularioSolicitudCita
- SelectorTratamientoOnline
- SelectorProfesionalOnline
- CalendarioDisponibilidad
- SelectorHorario
- ResumenSolicitudCita
- InputDatosPaciente

## 🔌 APIs Backend

APIs públicas para alimentar el formulario de solicitud de citas. Estas APIs deben ser seguras y optimizadas, ya que serán accedidas por usuarios no autenticados. Proveen listas de tratamientos y profesionales disponibles para cita online, calculan la disponibilidad horaria en tiempo real y reciben la solicitud final del paciente.

### `GET` `/api/public/tratamientos`

Obtiene la lista de tratamientos que la clínica ha habilitado para ser reservados por internet.

**Parámetros:** disponibleOnline=true

**Respuesta:** Array de objetos de Tratamiento, cada uno con { _id, nombre, duracionEstimada }.

### `GET` `/api/public/profesionales`

Obtiene la lista de profesionales que aceptan citas por internet.

**Parámetros:** aceptaCitasOnline=true

**Respuesta:** Array de objetos de Profesional, cada uno con { _id, nombreCompleto, especialidad }.

### `GET` `/api/public/disponibilidad`

Calcula y devuelve los días y horas disponibles para un mes específico, basado en el profesional y la duración del tratamiento.

**Parámetros:** mes (Number), ano (Number), profesionalId (opcional, String), tratamientoId (String)

**Respuesta:** Objeto con fechas como claves y arrays de horas disponibles como valores. Ej: { '2024-07-29': ['09:00', '09:30', '11:00'], ... }

### `POST` `/api/public/solicitudes-cita`

Recibe los datos del formulario y crea una nueva 'Solicitud de Cita' en la base de datos con estado 'pendiente'.

**Parámetros:** Body: { paciente: { nombre, apellido, email, telefono }, profesionalId, tratamientoId, fechaHora, notas (opcional) }

**Respuesta:** Objeto con el resumen de la solicitud creada y un mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

La lógica del backend se apoya en el modelo 'SolicitudCita' para almacenar las peticiones de los pacientes. Un controlador específico, 'PublicController' o 'SolicitudCitaController', maneja la lógica de negocio pública (cálculo de disponibilidad, creación de solicitudes), interactuando con otros modelos como 'Profesional', 'Tratamiento' y 'Cita' para obtener la información necesaria. Las rutas están agrupadas bajo un prefijo como '/api/public' para diferenciarlas de las rutas internas que requieren autenticación.

### Models

#### SolicitudCita

pacienteInfo: { nombre: String, apellido: String, email: String, telefono: String }, profesional: { type: ObjectId, ref: 'Profesional' }, tratamiento: { type: ObjectId, ref: 'Tratamiento' }, fechaHoraSolicitada: Date, estado: { type: String, enum: ['pendiente', 'confirmada', 'rechazada'], default: 'pendiente' }, notasPaciente: String, fechaCreacion: Date

#### Profesional

nombreCompleto: String, especialidad: String, horario: Object, aceptaCitasOnline: Boolean

#### Tratamiento

nombre: String, duracionEstimada: Number (en minutos), disponibleOnline: Boolean

### Controllers

#### SolicitudCitaController

- getTratamientosOnline
- getProfesionalesOnline
- calcularDisponibilidad
- crearSolicitudCita

### Routes

#### `/api/public`

- GET /tratamientos
- GET /profesionales
- GET /disponibilidad
- POST /solicitudes-cita

## 🔄 Flujos

1. Flujo del Paciente: El usuario accede a la página, selecciona tratamiento y/o profesional, el sistema le muestra un calendario con días disponibles. Al elegir un día, se muestran las horas libres. Elige una hora, rellena sus datos personales y envía la solicitud. Recibe un email de 'solicitud recibida'.
2. Flujo de Recepción: Recepción recibe una notificación en el ERP y un email sobre una nueva solicitud. Accede a la sección de 'Solicitudes Pendientes', revisa los detalles, comprueba la agenda y hace clic en 'Confirmar'. El sistema convierte la solicitud en una cita firme en la agenda, asigna al paciente (o lo crea si es nuevo) y envía un email de confirmación al paciente con los detalles de su cita.

## 📝 User Stories

- Como paciente nuevo, quiero poder solicitar mi primera cita desde la web de la clínica a cualquier hora del día para no tener que esperar al horario de apertura.
- Como paciente recurrente, quiero ver los horarios disponibles de mi dentista habitual para agendar mi próxima revisión de forma cómoda.
- Como recepcionista, quiero gestionar todas las solicitudes de cita online desde un único panel en el ERP para confirmar o reprogramar de manera eficiente.
- Como gerente de la clínica, quiero ofrecer la reserva de citas online para mejorar la satisfacción del paciente y optimizar la carga de trabajo de mi equipo de recepción.

## ⚙️ Notas Técnicas

- Seguridad: Implementar reCAPTCHA en el formulario de envío para prevenir spam. Validar y sanitizar estrictamente todos los datos del formulario en el backend para prevenir ataques XSS y de inyección.
- Rendimiento: La API de disponibilidad (`/api/public/disponibilidad`) debe estar altamente optimizada. Utilizar índices en la colección de Citas por `profesionalId` y `fechaHoraInicio`. Considerar una capa de caché (ej. Redis) para las consultas de disponibilidad, invalidándola cuando se crea o modifica una cita.
- Concurrencia: Al momento de enviar el formulario, el backend debe volver a verificar si el slot de tiempo seleccionado sigue disponible antes de crear la solicitud, para evitar dobles reservas.
- Integración: Es fundamental una integración robusta con un servicio de correo transaccional (como SendGrid o AWS SES) para el envío fiable de notificaciones por email al paciente y al personal de la clínica.
- UX/UI: El diseño debe ser totalmente responsive (mobile-first). El calendario y selector de hora deben ser intuitivos y accesibles. Proporcionar feedback instantáneo al usuario durante el proceso (ej. spinners de carga, mensajes de éxito/error).

