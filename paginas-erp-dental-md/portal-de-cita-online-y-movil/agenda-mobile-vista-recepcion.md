# Agenda Mobile (Vista Recepción)

**Categoría:** Plataforma Digital | **Módulo:** Portal de Cita Online y Móvil

La 'Agenda Mobile (Vista Recepción)' es una interfaz optimizada para dispositivos móviles (smartphones y tablets) diseñada específicamente para el personal de recepción, secretaría y call center. Esta funcionalidad permite gestionar en tiempo real el flujo de pacientes y la programación diaria de la clínica dental desde cualquier lugar. Su propósito principal es liberar al personal de la dependencia de un puesto de escritorio fijo, otorgando agilidad y mejorando la atención al paciente. Por ejemplo, un recepcionista puede dar la bienvenida a un paciente, realizar su check-in y notificar al odontólogo de su llegada directamente desde una tablet en la sala de espera. Dentro del módulo padre 'Portal de Cita Online y Móvil', esta vista actúa como el complemento interno a la agenda que ven los pacientes. Mientras los pacientes usan el portal para solicitar y ver sus propias citas, el personal utiliza la Agenda Mobile para gestionar la totalidad de las citas de la clínica. Funciona en perfecta sincronía con la agenda principal de escritorio y cualquier cambio (un check-in, una cancelación, un cambio de estado) se refleja instantáneamente en todo el sistema gracias a una arquitectura reactiva, asegurando que tanto los doctores en sus gabinetes como otros miembros del personal tengan siempre la información más actualizada.

## 👥 Roles de Acceso

- Recepción / Secretaría
- Call Center

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-cita-online-movil/`

Esta funcionalidad se encuentra dentro de la feature 'portal-cita-online-movil'. La página principal es '/pages/ReceptionMobileAgendaPage.tsx', que renderiza la vista de la agenda. Esta página utiliza componentes específicos de '/components/mobile-agenda/' como 'MobileAppointmentCard' para cada cita y 'MobileAgendaHeader' para la navegación y filtros. Las interacciones con el backend se gestionan a través de funciones definidas en '/apis/agenda.ts', que consumen los endpoints de la API REST.

### Archivos Frontend

- `/features/portal-cita-online-movil/pages/ReceptionMobileAgendaPage.tsx`
- `/features/portal-cita-online-movil/components/mobile-agenda/MobileAgendaHeader.tsx`
- `/features/portal-cita-online-movil/components/mobile-agenda/DoctorColumn.tsx`
- `/features/portal-cita-online-movil/components/mobile-agenda/MobileAppointmentCard.tsx`
- `/features/portal-cita-online-movil/components/mobile-agenda/AppointmentStatusModal.tsx`
- `/features/portal-cita-online-movil/apis/agenda.ts`

### Componentes React

- ReceptionMobileAgendaPage
- MobileAgendaHeader
- DoctorColumn
- MobileAppointmentCard
- AppointmentStatusModal

## 🔌 APIs Backend

Las APIs necesarias se centran en obtener las citas de un día específico para una sucursal y permitir la modificación rápida de su estado para reflejar el flujo de pacientes en tiempo real.

### `GET` `/api/citas/agenda-diaria`

Obtiene todas las citas para una fecha y sucursal específicas, agrupadas por profesional. Es el endpoint principal para poblar la vista de la agenda móvil.

**Parámetros:** query: fecha (YYYY-MM-DD), query: idSucursal (string)

**Respuesta:** JSON con un objeto donde las claves son los IDs de los profesionales y los valores son arrays de objetos de citas.

### `PUT` `/api/citas/:idCita/estado`

Actualiza el estado de una cita específica. Se utiliza para acciones como 'Check-in', 'Confirmar', 'No se presentó', etc.

**Parámetros:** param: idCita (string), body: { estado: 'string' }

**Respuesta:** JSON con el objeto de la cita actualizada.

### `GET` `/api/profesionales/sucursal/:idSucursal`

Obtiene la lista de profesionales (odontólogos, higienistas) que trabajan en una sucursal específica para poder renderizar las columnas de la agenda.

**Parámetros:** param: idSucursal (string)

**Respuesta:** Array de objetos de profesionales con su ID, nombre y especialidad.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con un modelo 'Cita' robusto y controladores que exponen la lógica de negocio a través de rutas RESTful seguras y eficientes.

### Models

#### Cita

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, profesional: { type: Schema.Types.ObjectId, ref: 'Usuario' }, sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' }, fechaHoraInicio: Date, fechaHoraFin: Date, estado: { type: String, enum: ['Pendiente', 'Confirmado', 'En Sala de Espera', 'Atendido', 'Cancelado', 'No se presentó'] }, notasRecepcion: String

#### Usuario

nombre: String, apellido: String, rol: String ('Odontólogo', 'Recepcionista', etc.), sucursalesAsignadas: [{ type: Schema.Types.ObjectId, ref: 'Sucursal' }]

### Controllers

#### CitaController

- getAgendaDiariaPorSucursal
- updateEstadoCita

#### UsuarioController

- getProfesionalesPorSucursal

### Routes

#### `/api/citas`

- GET /agenda-diaria
- PUT /:idCita/estado

#### `/api/profesionales`

- GET /sucursal/:idSucursal

## 🔄 Flujos

1. El usuario (recepcionista) inicia sesión y accede a la 'Agenda Mobile'.
2. La aplicación realiza una llamada a `GET /api/citas/agenda-diaria` con la fecha actual y la sucursal del usuario.
3. La interfaz muestra las citas del día organizadas en columnas por cada profesional.
4. Cuando un paciente llega, el recepcionista localiza su cita, la presiona y selecciona la acción 'Check-in (En Sala de Espera)'.
5. Se realiza una llamada a `PUT /api/citas/:idCita/estado` con el nuevo estado.
6. La tarjeta de la cita cambia de color visualmente, y este cambio se propaga en tiempo real a todas las demás vistas del sistema (ej. la del odontólogo).
7. El usuario puede usar el selector de fecha en la cabecera para navegar a días anteriores o futuros.

## 📝 User Stories

- Como personal de recepción, quiero ver la agenda completa del día en mi tablet para poder gestionar las llegadas y salidas de pacientes mientras me muevo por la clínica.
- Como secretaria, quiero poder cambiar el estado de una cita a 'En Sala de Espera' con un solo toque para notificar al instante al doctor que su paciente ha llegado.
- Como personal de recepción, quiero tener acceso rápido a los datos de contacto del paciente desde su cita en la agenda móvil para poder llamarle si se retrasa.
- Como personal del Call Center, quiero poder visualizar la agenda de cualquier día y sucursal en mi móvil para responder rápidamente a las consultas de disponibilidad de los pacientes por teléfono.

## ⚙️ Notas Técnicas

- Implementar WebSockets (Socket.IO) para la sincronización en tiempo real de los estados de las citas. Un cambio de estado desde la agenda móvil debe reflejarse instantáneamente en la agenda de escritorio del odontólogo y viceversa.
- La API de `GET /api/citas/agenda-diaria` debe estar altamente optimizada. Es crucial usar índices compuestos en la base de datos MongoDB sobre los campos `fechaHoraInicio`, `sucursal` y `profesional` en la colección 'citas'.
- Diseñar una interfaz de usuario 'mobile-first' y altamente responsiva, asegurando que la experiencia sea excelente tanto en smartphones de distintos tamaños como en tablets en orientación vertical y horizontal.
- Implementar un mecanismo de 'optimistic UI updates'. Al cambiar el estado de una cita, la UI se actualiza inmediatamente para el usuario y la llamada a la API se realiza en segundo plano, mejorando la percepción de velocidad.
- Seguridad: Todas las rutas de la API deben estar protegidas por middleware de autenticación y autorización, asegurando que un usuario solo pueda ver y gestionar la agenda de las sucursales a las que tiene permiso.

