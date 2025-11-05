# Portal Web de Citas Online

**Categoría:** Plataforma Digital | **Módulo:** Portal de Cita Online y Móvil

El Portal Web de Citas Online es una funcionalidad crucial dentro del módulo 'Portal de Cita Online y Móvil', diseñada para empoderar a los pacientes permitiéndoles gestionar sus propias citas de forma autónoma, 24/7, a través de cualquier dispositivo con acceso a internet. Su propósito principal es descongestionar las líneas telefónicas y reducir la carga administrativa del personal de recepción, al tiempo que mejora la experiencia y satisfacción del paciente ofreciendo conveniencia y flexibilidad. El portal se integra en tiempo real con la agenda principal del ERP dental. Cuando un paciente consulta la disponibilidad, el sistema verifica directamente los horarios de los profesionales, los tratamientos configurados, los días festivos y las citas ya existentes para mostrar únicamente los huecos reales. El flujo de trabajo típico implica que el paciente seleccione el tipo de tratamiento, elija un profesional (o cualquiera disponible), visualice un calendario con las fechas y horas libres, seleccione un horario y finalmente confirme la reserva introduciendo sus datos. Una vez confirmada, la cita se crea instantáneamente en el sistema central, bloqueando el espacio para evitar dobles reservas y quedando visible para todo el personal de la clínica. Este portal no solo sirve para nuevas reservas, sino que también permite a los pacientes registrados consultar su historial de citas, ver las próximas y, si la política de la clínica lo permite, cancelarlas o reprogramarlas, centralizando así la interacción paciente-clínica en una única plataforma digital.

## 👥 Roles de Acceso

- Paciente (Portal)
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-cita-online-movil/`

Toda la lógica del frontend para esta funcionalidad reside en la carpeta '/features/portal-cita-online-movil/'. La subcarpeta '/pages/' contiene los componentes de página principal como 'BookingPortalPage.tsx', que orquesta el flujo de reserva, y 'MyBookingsPage.tsx' para pacientes registrados. La carpeta '/components/' alberga componentes reutilizables como 'AvailabilityCalendar' para mostrar los horarios, 'ServiceSelector' para elegir tratamientos y 'BookingConfirmationForm' para la entrada de datos del paciente. Finalmente, la carpeta '/apis/' contiene las funciones que encapsulan las llamadas a la API del backend, como 'getAvailableSlots' o 'createAppointment', manteniendo la lógica de comunicación separada de la UI.

### Archivos Frontend

- `/features/portal-cita-online-movil/pages/BookingPortalPage.tsx`
- `/features/portal-cita-online-movil/pages/MyBookingsPage.tsx`
- `/features/portal-cita-online-movil/pages/BookingConfirmationPage.tsx`
- `/features/portal-cita-online-movil/components/ServiceSelector.tsx`
- `/features/portal-cita-online-movil/components/ProfessionalPicker.tsx`
- `/features/portal-cita-online-movil/components/AvailabilityCalendar.tsx`
- `/features/portal-cita-online-movil/components/BookingConfirmationForm.tsx`
- `/features/portal-cita-online-movil/apis/bookingApi.ts`

### Componentes React

- ServiceSelector
- ProfessionalPicker
- AvailabilityCalendar
- TimeSlotPicker
- BookingConfirmationForm
- PatientLoginModal
- AppointmentCard

## 🔌 APIs Backend

Las APIs exponen los datos y la lógica de negocio necesarios para que el portal funcione. Proporcionan listas de servicios y profesionales habilitados para la reserva online, calculan y devuelven los horarios disponibles en tiempo real, y procesan la creación de nuevas citas, asegurando la integridad con la agenda central.

### `GET` `/api/public/services`

Obtiene la lista de todos los tratamientos/servicios que la clínica ha habilitado para ser reservados online.

**Respuesta:** Array de objetos de servicio con { id, nombre, duracionEstimada }.

### `GET` `/api/public/professionals`

Obtiene la lista de profesionales disponibles para reserva online, opcionalmente filtrados por un servicio específico.

**Parámetros:** serviceId (opcional): ID del servicio para filtrar profesionales que lo realizan.

**Respuesta:** Array de objetos de profesional con { id, nombre, especialidad, fotoUrl }.

### `GET` `/api/public/availability`

Endpoint clave que calcula y devuelve los huecos de tiempo disponibles para una combinación de profesional, servicio y rango de fechas.

**Parámetros:** professionalId: ID del profesional., serviceId: ID del servicio (para determinar la duración)., startDate: Fecha de inicio de la búsqueda (YYYY-MM-DD)., endDate: Fecha de fin de la búsqueda (YYYY-MM-DD).

**Respuesta:** Objeto con fechas como claves y arrays de slots disponibles (ej: 'HH:mm') como valores.

### `POST` `/api/public/appointments/book`

Crea una nueva cita en el sistema. Realiza validaciones para asegurar que el slot sigue disponible antes de confirmar.

**Parámetros:** professionalId: ID del profesional., serviceId: ID del servicio., startDateTime: Fecha y hora de inicio de la cita (ISO 8601)., patientData: { nombre, apellidos, email, telefono, esNuevoPaciente }

**Respuesta:** Objeto con los detalles de la cita recién creada.

### `GET` `/api/appointments/my-appointments`

Obtiene las citas futuras y pasadas para el paciente autenticado.

**Parámetros:** token JWT en cabecera de autorización.

**Respuesta:** Objeto con dos arrays: 'upcomingAppointments' y 'pastAppointments'.

## 🗂️ Estructura Backend (MERN)

El backend utiliza una arquitectura MVC. Los modelos de Mongoose definen los esquemas de 'Cita', 'Paciente', 'Profesional', etc. Los controladores, como 'PublicBookingController', contienen la lógica para calcular la disponibilidad y crear citas desde el portal. Las rutas en Express exponen estos controladores como endpoints RESTful, separando las rutas públicas de las que requieren autenticación de paciente.

### Models

#### Cita

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, profesional: { type: Schema.Types.ObjectId, ref: 'Profesional' }, tratamiento: { type: Schema.Types.ObjectId, ref: 'Tratamiento' }, fechaHoraInicio: Date, fechaHoraFin: Date, estado: String ('Confirmada', 'Pendiente', 'Cancelada'), origen: String ('Portal Web', 'Recepción', 'Teléfono'), notasPaciente: String

#### Profesional

nombre: String, especialidad: String, horario: [{ diaSemana: Number, horaInicio: String, horaFin: String }], bloqueos: [{ fechaHoraInicio: Date, fechaHoraFin: Date, motivo: String }], disponibleOnline: Boolean

#### Tratamiento

nombre: String, descripcion: String, duracionEstimadaMinutos: Number, disponibleOnline: Boolean

#### Paciente

nombre: String, apellidos: String, email: String, telefono: String, passwordHash: String (si se registra)

### Controllers

#### PublicBookingController

- getOnlineServices
- getOnlineProfessionals
- calculateAvailability
- createAppointmentFromPortal

#### PatientAppointmentController

- getMyAppointments

### Routes

#### `/api/public`

- GET /services
- GET /professionals
- GET /availability
- POST /appointments/book

#### `/api/appointments`

- GET /my-appointments (protegido por autenticación)

## 🔄 Flujos

1. Un nuevo paciente accede al portal, selecciona 'Primera Visita', elige 'Cualquier profesional', ve el calendario de disponibilidad, selecciona un hueco, rellena sus datos personales y confirma la cita.
2. Un paciente existente inicia sesión, el sistema le da la bienvenida por su nombre, navega a la sección 'Mis Citas' para revisar una próxima cita de 'Limpieza Dental'.
3. El sistema muestra los horarios disponibles calculando la duración del tratamiento seleccionado y cruzándola con la agenda del profesional, excluyendo almuerzos, bloqueos y otras citas ya agendadas.
4. Tras confirmar una cita, el sistema envía automáticamente un correo electrónico de confirmación al paciente y una notificación interna al panel de recepción.
5. Un recepcionista deshabilita un tratamiento para la reserva online desde el panel de administración del ERP, y este deja de aparecer inmediatamente en el portal web.

## 📝 User Stories

- Como un nuevo paciente, quiero reservar mi primera cita online de forma rápida y sencilla para no tener que llamar por teléfono.
- Como un paciente existente, quiero iniciar sesión en el portal para ver mis próximas citas y reservar una nueva sin tener que rellenar mis datos de nuevo.
- Como recepcionista, quiero que las citas reservadas desde el portal se reflejen instantáneamente en la agenda principal para tener una visión unificada y evitar solapamientos.
- Como paciente, quiero recibir un recordatorio por correo electrónico o SMS antes de mi cita para no olvidarme.
- Como administrador de la clínica, quiero poder configurar qué tratamientos y qué profesionales están disponibles para la reserva online para tener control total sobre la agenda.

## ⚙️ Notas Técnicas

- Seguridad: Es crucial implementar protección contra CSRF y XSS, así como validación de datos en el backend para todas las entradas del usuario. Usar reCAPTCHA para el formulario de reserva pública es altamente recomendable para prevenir spam y bots.
- Rendimiento: La consulta de disponibilidad puede ser intensiva. Se deben optimizar las consultas a la base de datos, posiblemente utilizando índices en los campos de fecha de las citas y bloqueos. Considerar cachear la lista de servicios y profesionales.
- Concurrencia: Implementar un mecanismo de bloqueo pesimista o una reserva temporal (ej. 10 minutos) cuando un usuario selecciona un slot para evitar que dos usuarios reserven el mismo hueco simultáneamente.
- Integraciones: Planificar la integración con un proveedor de servicios de correo electrónico (ej. SendGrid, Mailgun) para las confirmaciones y recordatorios, y opcionalmente con un proveedor de SMS (ej. Twilio).
- Autenticación: Para pacientes existentes, implementar un sistema de autenticación seguro basado en JWT (JSON Web Tokens) con tokens de acceso de corta duración y tokens de refresco.

