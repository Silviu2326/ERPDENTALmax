# Solicitar/Modificar/Cancelar Cita

**Categoría:** Portal del Paciente | **Módulo:** Portal del Paciente

Esta funcionalidad es un componente central del 'Portal del Paciente', diseñada para empoderar a los pacientes dándoles autonomía para gestionar sus citas dentales de manera digital y asíncrona. Permite a los usuarios registrados solicitar nuevas citas, ver y modificar las ya programadas, y cancelarlas cuando sea necesario, todo sin la intervención directa del personal de la clínica. Su propósito principal es mejorar la experiencia del paciente ofreciendo conveniencia y flexibilidad 24/7, al mismo tiempo que reduce significativamente la carga administrativa en la recepción de la clínica. El sistema funciona consultando en tiempo real la agenda de los odontólogos, los horarios de la clínica y la duración estimada de los tratamientos. Al solicitar una cita, el paciente puede filtrar por tipo de tratamiento, seleccionar un profesional específico o ver la disponibilidad general, y elegir el horario que más le convenga de una lista de espacios libres. Al modificar, el sistema presenta un flujo similar para encontrar un nuevo horario. La cancelación libera automáticamente el espacio en la agenda principal del ERP, haciéndolo disponible para otros pacientes. Esta integración directa y en tiempo real con el módulo de 'Agenda de Citas y Programación' es crucial para evitar conflictos de programación y optimizar la ocupación de la clínica.

## 👥 Roles de Acceso

- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-paciente/`

La funcionalidad reside dentro de la feature 'portal-paciente'. La página principal, '/features/portal-paciente/pages/MisCitasPage.tsx', actúa como el centro de mando para el paciente, desde donde puede visualizar sus citas y acceder a las acciones de solicitar, modificar o cancelar. Esta página utiliza componentes reutilizables de '/features/portal-paciente/components/', como 'ListaCitasPaciente' para mostrar las citas y 'ModalGestionCita' para el formulario de solicitud/modificación. Las llamadas al backend para obtener datos y ejecutar acciones se centralizan en '/features/portal-paciente/apis/citasPacienteApi.ts', que se encarga de la comunicación con los endpoints del servidor.

### Archivos Frontend

- `/features/portal-paciente/pages/MisCitasPage.tsx`
- `/features/portal-paciente/components/ListaCitasPaciente.tsx`
- `/features/portal-paciente/components/TarjetaCitaPaciente.tsx`
- `/features/portal-paciente/components/ModalGestionCita.tsx`
- `/features/portal-paciente/components/SelectorDisponibilidad.tsx`
- `/features/portal-paciente/components/ConfirmacionCancelacionModal.tsx`
- `/features/portal-paciente/apis/citasPacienteApi.ts`

### Componentes React

- MisCitasPage
- ListaCitasPaciente
- TarjetaCitaPaciente
- ModalGestionCita
- SelectorDisponibilidad
- ConfirmacionCancelacionModal

## 🔌 APIs Backend

Se requieren APIs RESTful seguras que permitan al paciente autenticado gestionar exclusivamente sus propias citas. Los endpoints deben cubrir la obtención de citas, la consulta de disponibilidad de horarios, la creación, modificación y cancelación de citas, validando siempre la propiedad de los datos.

### `GET` `/api/portal/citas`

Obtiene una lista de todas las citas (futuras y pasadas) del paciente autenticado.

**Parámetros:** Query:?estado=programada (opcional, para filtrar por estado)

**Respuesta:** Un array de objetos Cita.

### `GET` `/api/portal/disponibilidad`

Consulta los horarios disponibles para una nueva cita, basado en el doctor, tratamiento y rango de fechas.

**Parámetros:** Query: doctor_id (opcional), Query: tratamiento_id (requerido), Query: fecha_inicio (requerido), Query: fecha_fin (requerido)

**Respuesta:** Un array de objetos con fechas y horas disponibles (ej: [{start: 'ISODate', end: 'ISODate'}]).

### `POST` `/api/portal/citas`

Crea una nueva cita para el paciente autenticado.

**Parámetros:** Body: { doctor_id, tratamiento_id, fecha_hora_inicio, notas_paciente }

**Respuesta:** El objeto de la Cita recién creada.

### `PUT` `/api/portal/citas/:id`

Modifica una cita existente del paciente autenticado. El sistema valida que el paciente sea el propietario de la cita.

**Parámetros:** Path: id (ID de la cita), Body: { fecha_hora_inicio (nuevo horario), notas_paciente (opcional) }

**Respuesta:** El objeto de la Cita actualizada.

### `DELETE` `/api/portal/citas/:id`

Cancela una cita programada. El sistema valida la propiedad y las reglas de negocio (ej: no cancelar con menos de 24h de antelación).

**Parámetros:** Path: id (ID de la cita)

**Respuesta:** Un mensaje de confirmación (ej: { message: 'Cita cancelada exitosamente' }).

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo 'Cita' para persistir la información en MongoDB. Un controlador específico, 'CitaPacienteController', contiene la lógica de negocio para las acciones que un paciente puede realizar, garantizando que todas las operaciones estén debidamente autorizadas. Las rutas se definen en un archivo dedicado y se agrupan bajo '/api/portal/', protegidas por un middleware de autenticación que adjunta la información del paciente a la solicitud.

### Models

#### Cita

paciente: ObjectId (ref: 'Paciente'), doctor: ObjectId (ref: 'Usuario'), tratamiento: ObjectId (ref: 'Tratamiento'), sucursal: ObjectId (ref: 'Sucursal'), fecha_hora_inicio: Date, fecha_hora_fin: Date, estado: String ('Programada', 'Confirmada', 'CanceladaPorPaciente', 'CanceladaPorClinica', 'Completada', 'NoAsistio'), notas_paciente: String, creado_por_rol: String ('Paciente', 'Recepcionista', ...)

### Controllers

#### CitaPacienteController

- obtenerMisCitas
- consultarDisponibilidad
- solicitarNuevaCita
- modificarMiCita
- cancelarMiCita

### Routes

#### `/api/portal/citas`

- GET /
- POST /
- PUT /:id
- DELETE /:id

#### `/api/portal/disponibilidad`

- GET /

## 🔄 Flujos

1. Flujo de Solicitud: El paciente inicia sesión, va a 'Mis Citas', pulsa 'Nueva Cita', selecciona tratamiento y doctor (opcional), elige una fecha y hora de la grilla de disponibilidad, confirma y recibe una notificación.
2. Flujo de Modificación: El paciente ve su lista de citas futuras, selecciona 'Modificar' en una de ellas, el sistema le muestra la grilla de disponibilidad para seleccionar una nueva fecha/hora, confirma el cambio y recibe la notificación.
3. Flujo de Cancelación: El paciente ve su lista de citas futuras, selecciona 'Cancelar', un modal de confirmación aparece explicando las políticas de cancelación, el paciente confirma y la cita se marca como cancelada en el sistema.

## 📝 User Stories

- Como paciente, quiero ver una lista clara de mis próximas citas y mi historial de citas pasadas para llevar un control de mi salud dental.
- Como paciente, quiero poder solicitar una cita para un tratamiento específico y ver los horarios disponibles de los doctores que lo realizan, para elegir la opción más conveniente.
- Como paciente, quiero poder reprogramar una cita con facilidad desde el portal si surge un imprevisto, sin tener que llamar a la clínica.
- Como paciente, quiero cancelar una cita con la debida antelación a través del portal para liberar el horario y evitar penalizaciones.
- Como paciente, quiero recibir una confirmación inmediata en el portal y por correo electrónico cada vez que solicito, modifico o cancelo una cita.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un middleware de autorización que verifique que el ID del paciente en el token JWT coincida con el campo 'paciente' de la cita que se intenta modificar o cancelar.
- Manejo de Concurrencia: La lógica para solicitar una cita debe ser atómica. Se debe implementar un mecanismo de 'check-and-set' o transacción para verificar que el horario sigue libre justo antes de insertarlo en la base de datos, evitando dobles reservas.
- Rendimiento: La consulta de disponibilidad puede ser costosa. Se deben crear índices compuestos en la colección de Citas (por ej: en `doctor`, `sucursal` y `fecha_hora_inicio`) para acelerar las búsquedas.
- Integración de Notificaciones: Conectar las acciones de crear, modificar y cancelar a un servicio de email (ej: SendGrid, Mailgun) y/o a un sistema de notificaciones push para mantener al paciente informado en tiempo real.
- Configuración de Reglas de Negocio: Las reglas como 'tiempo mínimo de antelación para cancelar' o 'tipos de cita que no se pueden solicitar online' deben ser configurables a nivel de sistema, no hardcodeadas.

