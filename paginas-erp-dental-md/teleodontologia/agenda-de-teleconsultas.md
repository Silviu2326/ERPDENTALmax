# Agenda de Teleconsultas

**Categoría:** Telemedicina | **Módulo:** Teleodontología

La Agenda de Teleconsultas es una funcionalidad central dentro del módulo de Teleodontología, diseñada para gestionar de manera integral el ciclo de vida de las consultas odontológicas a distancia. Este componente visualiza, organiza y permite la programación de citas virtuales entre odontólogos y pacientes, sirviendo como el punto de control para toda la atención no presencial. Su propósito principal es extender el alcance de la clínica dental más allá de sus paredes físicas, ofreciendo una alternativa conveniente para consultas de seguimiento, diagnósticos iniciales, triaje, presentación de planes de tratamiento y resolución de dudas menores. Dentro del ERP, esta agenda funciona como una vista especializada y paralela a la agenda de citas presenciales, pero enriquecida con funcionalidades específicas para la telemedicina. Se integra directamente con los perfiles de los pacientes para acceder a su historial, con el módulo de facturación para generar los cobros correspondientes a las teleconsultas, y con un sistema de notificaciones automáticas (email, SMS, push) para enviar recordatorios y los enlaces de acceso a la videollamada. A nivel operativo, permite a roles como recepción y call center asignar eficientemente los espacios disponibles, mientras que los odontólogos pueden gestionar su tiempo, prepararse para las citas revisando la información del paciente de antemano y lanzar la sesión de videollamada con un solo clic, optimizando así el flujo de trabajo clínico y mejorando la experiencia del paciente.

## 👥 Roles de Acceso

- Recepción / Secretaría
- Call Center
- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/teleodontologia/`

Toda la lógica de frontend para el módulo de Teleodontología reside en la carpeta '/features/teleodontologia/'. Dentro de ella, la subcarpeta '/pages/' contiene el archivo principal 'AgendaTeleconsultasPage.tsx', que define la ruta y la estructura general de la página. Esta página importa y ensambla componentes reutilizables desde '/components/', como el calendario visual, modales para agendamiento y tarjetas de detalle. La comunicación con el backend se gestiona a través de funciones definidas en '/apis/', que encapsulan las llamadas a los endpoints RESTful para obtener, crear y modificar teleconsultas.

### Archivos Frontend

- `/features/teleodontologia/pages/AgendaTeleconsultasPage.tsx`
- `/features/teleodontologia/components/CalendarioTeleconsultasView.tsx`
- `/features/teleodontologia/components/ModalGestionarTeleconsulta.tsx`
- `/features/teleodontologia/components/TarjetaDetalleTeleconsulta.tsx`
- `/features/teleodontologia/apis/teleconsultasApi.ts`

### Componentes React

- AgendaTeleconsultasPage
- CalendarioTeleconsultasView
- ModalGestionarTeleconsulta
- FiltroTeleconsultas
- TarjetaDetalleTeleconsulta
- BotonIniciarVideollamada

## 🔌 APIs Backend

Las APIs para la Agenda de Teleconsultas gestionan todas las operaciones CRUD (Crear, Leer, Actualizar, Borrar) para las citas virtuales. Permiten filtrar las teleconsultas por múltiples criterios y manejan estados específicos como 'Programada', 'Confirmada', 'En Curso' y 'Completada'. Incluye un endpoint crucial para generar e invalidar los enlaces seguros de la videollamada.

### `GET` `/api/teleconsultas`

Obtiene una lista de teleconsultas. Permite filtrar por rango de fechas, ID de odontólogo, ID de paciente y estado.

**Parámetros:** fechaInicio (query, string), fechaFin (query, string), odontologoId (query, string), pacienteId (query, string), estado (query, string)

**Respuesta:** Array de objetos de Teleconsulta.

### `POST` `/api/teleconsultas`

Crea una nueva teleconsulta en la agenda.

**Parámetros:** pacienteId (body, string), odontologoId (body, string), fechaHoraInicio (body, string), motivoConsulta (body, string)

**Respuesta:** Objeto de la Teleconsulta creada.

### `GET` `/api/teleconsultas/:id`

Obtiene los detalles de una teleconsulta específica.

**Parámetros:** id (param, string)

**Respuesta:** Objeto único de Teleconsulta.

### `PUT` `/api/teleconsultas/:id`

Actualiza una teleconsulta existente (reprogramar, cambiar estado, añadir notas).

**Parámetros:** id (param, string), fechaHoraInicio (body, string), estado (body, string), notasPrevias (body, string)

**Respuesta:** Objeto de la Teleconsulta actualizada.

### `DELETE` `/api/teleconsultas/:id`

Cancela o elimina una teleconsulta.

**Parámetros:** id (param, string)

**Respuesta:** Mensaje de confirmación.

### `POST` `/api/teleconsultas/:id/iniciar`

Genera el enlace de la videollamada y actualiza el estado de la teleconsulta a 'En Curso'.

**Parámetros:** id (param, string)

**Respuesta:** Objeto con el enlace a la videollamada (ej: { url: 'string' }).

## 🗂️ Estructura Backend (MERN)

El backend sigue una arquitectura MERN. El modelo 'Teleconsulta' define el esquema de datos en MongoDB. El 'TeleconsultaController' contiene la lógica de negocio para manejar las peticiones HTTP (crear, leer, etc.), interactuando con el modelo. Las rutas definidas en Express asocian los endpoints de la API con las funciones correspondientes del controlador.

### Models

#### Teleconsulta

pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true }, odontologoId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }, fechaHoraInicio: { type: Date, required: true }, fechaHoraFin: { type: Date }, estado: { type: String, enum: ['Programada', 'Confirmada', 'En Curso', 'Completada', 'Cancelada', 'No Asistió'], default: 'Programada' }, motivoConsulta: String, notasPrevias: String, enlaceVideollamada: String, idSesionVideo: String, creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }

### Controllers

#### TeleconsultaController

- obtenerTeleconsultas
- crearTeleconsulta
- obtenerTeleconsultaPorId
- actualizarTeleconsulta
- eliminarTeleconsulta
- iniciarSesionVideollamada

### Routes

#### `/api/teleconsultas`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id
- POST /:id/iniciar

## 🔄 Flujos

1. El recepcionista accede a la Agenda de Teleconsultas, selecciona un odontólogo y un horario disponible, busca y selecciona a un paciente, completa el motivo de la consulta y guarda. El sistema crea el registro y envía una confirmación al paciente.
2. El odontólogo ingresa a su agenda, visualiza las teleconsultas del día. Antes de la hora, hace clic en una cita para revisar las notas previas y el historial del paciente.
3. A la hora de la cita, el odontólogo presiona el botón 'Iniciar Videollamada'. El sistema genera un enlace único, lo muestra al odontólogo y lo envía al paciente, cambiando el estado de la cita a 'En Curso'.
4. El recepcionista busca una teleconsulta existente, la selecciona y elige la opción de 'Reprogramar' o 'Cancelar'. El sistema actualiza la agenda y notifica al paciente del cambio.

## 📝 User Stories

- Como recepcionista, quiero agendar una teleconsulta para un paciente con un odontólogo específico para poder ofrecer atención remota de manera eficiente.
- Como odontólogo, quiero ver mi agenda de teleconsultas del día en un calendario claro para prepararme para mis citas remotas.
- Como odontólogo, quiero poder iniciar la videollamada directamente desde la agenda para comenzar la consulta sin demoras y sin cambiar de aplicación.
- Como agente de Call Center, quiero poder filtrar la agenda por odontólogo y especialidad para encontrar rápidamente la primera cita de teleconsulta disponible para un paciente.
- Como recepcionista, quiero poder cancelar o reprogramar una teleconsulta fácilmente y que el paciente sea notificado automáticamente para mantener la agenda actualizada y al paciente informado.

## ⚙️ Notas Técnicas

- Integración con API de Videollamada: Es fundamental integrar un servicio de WebRTC de terceros (ej. Twilio Video, Jitsi, Vonage) para la gestión de las sesiones de video. El endpoint '/api/teleconsultas/:id/iniciar' debe comunicarse con esta API para crear salas y generar tokens de acceso.
- Seguridad y Cumplimiento (HIPAA/LOPD): La transmisión de video y el almacenamiento de datos de la consulta deben ser encriptados de extremo a extremo. Se deben implementar controles de acceso basados en roles (RBAC) estrictos para asegurar que solo personal autorizado acceda a la información del paciente.
- Notificaciones en Tiempo Real: Se recomienda el uso de WebSockets (ej. Socket.IO) para que las actualizaciones en la agenda (nuevas citas, cancelaciones) se reflejen instantáneamente en las pantallas de todos los usuarios conectados (odontólogos y personal administrativo) sin necesidad de recargar la página.
- Optimización de Consultas: La base de datos MongoDB debe tener índices en los campos 'fechaHoraInicio', 'odontologoId' y 'pacienteId' del modelo Teleconsulta para garantizar un rendimiento óptimo al filtrar y cargar la agenda.
- Sincronización con Calendario Principal: Debe existir un mecanismo o una vista unificada que permita al odontólogo ver tanto sus citas presenciales como sus teleconsultas en un solo calendario para evitar conflictos de programación.

