# Calendario Principal de Citas

**Categoría:** Gestión de Citas | **Módulo:** Agenda de Citas y Programación

El Calendario Principal de Citas es el centro neurálgico del módulo 'Agenda de Citas y Programación' y una de las herramientas más utilizadas en el día a día de la clínica dental. Su función principal es ofrecer una representación visual, interactiva y centralizada de todas las citas programadas, la disponibilidad de los profesionales y la ocupación de los recursos (como los boxes o sillones dentales). Esta funcionalidad permite a los usuarios gestionar de forma eficiente la programación de pacientes, optimizando el tiempo de los odontólogos e higienistas y maximizando la capacidad operativa de la clínica. Los usuarios pueden visualizar el calendario en diferentes formatos (día, semana, mes, agenda o línea de tiempo por profesional) y filtrar la información por sede (en caso de clínicas multisede), por profesional específico, por estado de la cita (confirmada, cancelada, no asistió, etc.) o por tipo de tratamiento. El calendario es dinámico: permite crear nuevas citas haciendo clic en un hueco libre, reprogramar citas existentes mediante 'drag and drop' y acceder a los detalles completos de una cita con un simple clic, abriendo un modal con información del paciente, tratamiento, notas y estado. Se integra directamente con otros módulos del ERP, como Ficha de Paciente (para obtener datos del paciente), Facturación (para iniciar procesos de cobro post-cita) e Historia Clínica (para acceder al odontograma y planes de tratamiento).

## 👥 Roles de Acceso

- Propietario / Gerente
- Director / Admin general (multisede)
- Odontólogo
- Higienista
- Recepción / Secretaría
- Call Center

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/agenda-citas-programacion/`

Esta funcionalidad se encuentra dentro de la feature 'agenda-citas-programacion'. La carpeta '/pages' contiene el componente principal 'CalendarioPrincipalPage.tsx' que renderiza la vista completa. La carpeta '/components' alberga los elementos reutilizables como la grilla del calendario ('CalendarioGrid'), los bloques visuales de cada cita ('CitaBlock'), el modal para crear/editar citas ('ModalGestionCita') y los controles de filtrado ('FiltrosCalendario'). La carpeta '/apis' contiene las funciones que encapsulan las llamadas al backend, como 'getCitas', 'createCita', 'updateCita', para mantener la lógica de acceso a datos separada de la UI.

### Archivos Frontend

- `/features/agenda-citas-programacion/pages/CalendarioPrincipalPage.tsx`
- `/features/agenda-citas-programacion/components/CalendarioGrid.tsx`
- `/features/agenda-citas-programacion/components/CitaBlock.tsx`
- `/features/agenda-citas-programacion/components/ModalGestionCita.tsx`
- `/features/agenda-citas-programacion/components/FiltrosCalendario.tsx`
- `/features/agenda-citas-programacion/apis/citasApi.ts`

### Componentes React

- CalendarioGrid
- CitaBlock
- ModalGestionCita
- FiltrosCalendario
- SelectorVistaCalendario
- BarraBusquedaPaciente

## 🔌 APIs Backend

Las APIs para el calendario deben permitir obtener un conjunto de citas basado en un rango de fechas y diversos filtros, así como gestionar el ciclo de vida completo de una cita (creación, actualización y eliminación).

### `GET` `/api/citas/calendario`

Obtiene todas las citas dentro de un rango de fechas y según los filtros aplicados. Es la llamada principal para poblar el calendario.

**Parámetros:** query.fecha_inicio (string ISO), query.fecha_fin (string ISO), query.profesional_id (string, opcional), query.sede_id (string, opcional), query.estado (string, opcional)

**Respuesta:** Array de objetos de Cita con información poblada del paciente y profesional.

### `POST` `/api/citas`

Crea una nueva cita en el sistema. Realiza validaciones de disponibilidad y conflictos.

**Parámetros:** body.paciente (ObjectID), body.profesional (ObjectID), body.fecha_hora_inicio (string ISO), body.fecha_hora_fin (string ISO), body.tratamiento (ObjectID), body.notas (string, opcional)

**Respuesta:** El objeto de la Cita recién creada.

### `PUT` `/api/citas/:id`

Actualiza una cita existente. Se usa para reprogramar, cambiar el estado (ej. confirmar asistencia), o modificar detalles.

**Parámetros:** params.id (ObjectID), body.{campos a actualizar}

**Respuesta:** El objeto de la Cita actualizada.

### `DELETE` `/api/citas/:id`

Cancela o elimina una cita. La lógica de negocio puede optar por un borrado lógico (cambiar estado a 'cancelada') en lugar de físico.

**Parámetros:** params.id (ObjectID)

**Respuesta:** Mensaje de confirmación.

### `GET` `/api/citas/:id`

Obtiene los detalles completos de una única cita, usado al hacer clic en un evento del calendario.

**Parámetros:** params.id (ObjectID)

**Respuesta:** Un objeto de Cita con todos sus campos y referencias pobladas.

## 🗂️ Estructura Backend (MERN)

La estructura backend se apoya en el modelo 'Cita' de MongoDB, que es el núcleo de esta funcionalidad. El 'CitaController' contiene toda la lógica para manejar las operaciones CRUD y las consultas complejas (búsqueda por rango y filtros). Las rutas se definen en un archivo específico para 'citas' que mapea los endpoints HTTP a las funciones del controlador.

### Models

#### Cita

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, profesional: { type: Schema.Types.ObjectId, ref: 'Usuario' }, sede: { type: Schema.Types.ObjectId, ref: 'Sede' }, fecha_hora_inicio: Date, fecha_hora_fin: Date, duracion_minutos: Number, estado: { type: String, enum: ['programada', 'confirmada', 'cancelada', 'realizada', 'no-asistio'] }, tratamiento: { type: Schema.Types.ObjectId, ref: 'Tratamiento' }, notas: String, box_asignado: String, creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }, historial_cambios: [Object]

### Controllers

#### CitaController

- obtenerCitasPorRango
- crearCita
- actualizarCita
- cancelarCita
- obtenerDetalleCita

### Routes

#### `/api/citas`

- GET /calendario -> CitaController.obtenerCitasPorRango
- POST / -> CitaController.crearCita
- PUT /:id -> CitaController.actualizarCita
- DELETE /:id -> CitaController.cancelarCita
- GET /:id -> CitaController.obtenerDetalleCita

## 🔄 Flujos

1. El usuario (recepcionista) inicia sesión y accede al Calendario Principal, que por defecto muestra la vista de 'semana' de la sede actual.
2. El sistema realiza una llamada a GET /api/citas/calendario con el rango de fechas de la semana actual para poblar la vista.
3. Un paciente llama para pedir cita. El recepcionista utiliza los filtros por profesional para ver la agenda del Dr. Pérez.
4. Encuentra un hueco libre, hace clic sobre él, se abre el modal 'ModalGestionCita'.
5. Busca al paciente, selecciona el tratamiento y guarda. El sistema envía un POST a /api/citas.
6. La nueva cita aparece instantáneamente en el calendario para todos los usuarios gracias a una actualización en tiempo real (WebSocket).
7. Otro usuario (odontólogo) arrastra una de sus citas de hoy a mañana para reprogramarla. El frontend dispara una llamada PUT a /api/citas/:id con la nueva fecha.

## 📝 User Stories

- Como recepcionista, quiero ver el calendario por día, semana y mes para tener una visión general de la ocupación y poder agendar citas eficientemente.
- Como odontólogo, quiero ver únicamente mi agenda personal para el día de hoy, con colores distintivos por tipo de cita, para saber qué pacientes y tratamientos tengo programados.
- Como gerente de clínica, quiero filtrar el calendario por profesional y por sede para analizar la carga de trabajo y la productividad de cada uno.
- Como personal de recepción, quiero poder crear una nueva cita en menos de 3 pasos para agilizar la atención telefónica y presencial.
- Como higienista, quiero poder arrastrar y soltar una cita para reprogramarla rápidamente cuando un paciente me lo solicita.
- Como administrador, quiero ver un historial de cambios en una cita para saber quién la modificó y cuándo.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial indexar la colección 'Cita' en MongoDB por 'fecha_hora_inicio', 'profesional' y 'sede' para que la consulta de rangos de fechas sea extremadamente rápida.
- Tiempo Real: Implementar WebSockets con Socket.IO para notificar a todos los clientes conectados de cualquier cambio en las citas (creación, actualización, eliminación). Esto asegura que todos los calendarios estén sincronizados sin necesidad de refrescar la página.
- Prevención de Conflictos: La lógica en el endpoint POST /api/citas y PUT /api/citas/:id debe ser atómica y verificar que no existen otras citas para el mismo profesional o el mismo box en el intervalo de tiempo solicitado antes de guardar el cambio.
- Librería Frontend: Se recomienda usar una librería como 'FullCalendar.io' o 'React Big Calendar' por su robustez, funcionalidades de vistas, manejo de eventos y compatibilidad con React/Next.js.
- Seguridad y Permisos: La API debe estar protegida. Se debe validar el rol del usuario en cada endpoint para asegurar que solo los roles autorizados puedan realizar ciertas acciones (ej. un odontólogo no puede modificar la cita de otro colega, a menos que sea un administrador).
- Usabilidad: Implementar 'tooltips' al pasar el cursor sobre una cita para mostrar un resumen rápido sin necesidad de hacer clic. Los códigos de color por estado o tipo de tratamiento mejoran la legibilidad.

