# Editar Cita

**Categoría:** Gestión de Citas | **Módulo:** Agenda de Citas y Programación

La funcionalidad 'Editar Cita' es un componente esencial del módulo 'Agenda de Citas y Programación' dentro del ERP dental. Su propósito principal es permitir a los usuarios autorizados modificar los detalles de una cita ya existente de manera rápida y eficiente. Esta página, generalmente presentada como un modal o una vista de formulario dedicada, se activa al seleccionar una cita en el calendario principal o en la lista de citas de un paciente. Permite alterar información crítica como la fecha y hora, el profesional asignado, el consultorio, la duración, los tratamientos programados, el estado de la cita (ej. de 'Programada' a 'Confirmada' o 'Cancelada'), y añadir o modificar notas internas. Su funcionamiento es vital para la gestión diaria de la clínica, ya que permite adaptarse a imprevistos como cancelaciones de pacientes, cambios de horario solicitados, emergencias o la necesidad de ajustar la duración de un procedimiento. Al integrarse directamente con el calendario, cualquier modificación se refleja en tiempo real para todos los usuarios, evitando conflictos de programación y asegurando que la agenda esté siempre actualizada. Además, esta funcionalidad debe incluir validaciones de negocio, como la comprobación de disponibilidad del profesional y del consultorio para la nueva fecha/hora, garantizando que no se produzcan solapamientos. Un historial de cambios es crucial para la auditoría y seguimiento.

## 👥 Roles de Acceso

- Recepción / Secretaría
- Call Center
- Odontólogo
- Higienista

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/agenda-citas-programacion/`

Esta funcionalidad reside dentro de la feature 'agenda-citas-programacion'. La interfaz de usuario principal es el componente 'ModalEditarCita.tsx', que se invoca desde la página del calendario principal. Este modal contiene subcomponentes para cada parte del formulario, como selectores de fecha/hora, profesional y tratamiento. La lógica para obtener los datos de la cita y enviar las actualizaciones se encapsula en funciones dentro del archivo 'apis/citas.ts', manteniendo la lógica de API separada de la UI.

### Archivos Frontend

- `/features/agenda-citas-programacion/components/ModalEditarCita.tsx`
- `/features/agenda-citas-programacion/components/FormEditarCita.tsx`
- `/features/agenda-citas-programacion/apis/citas.ts`

### Componentes React

- ModalEditarCita
- FormEditarCita
- SelectorFechaHoraCita
- SelectorProfesional
- SelectorTratamientoCita
- SelectorEstadoCita
- InputNotasCita

## 🔌 APIs Backend

Se necesitan APIs para obtener los detalles de una cita específica para pre-rellenar el formulario de edición, y para enviar los datos actualizados. Adicionalmente, se requiere un endpoint para verificar la disponibilidad en tiempo real al reprogramar, previniendo conflictos.

### `GET` `/api/citas/:id`

Obtiene los detalles completos de una cita específica por su ID para poblar el formulario de edición.

**Parámetros:** id (en la URL): El ObjectId de la cita a obtener.

**Respuesta:** Un objeto JSON con los datos de la cita, incluyendo información poblada del paciente y profesional.

### `PUT` `/api/citas/:id`

Actualiza una cita existente con los nuevos datos proporcionados en el cuerpo de la solicitud.

**Parámetros:** id (en la URL): El ObjectId de la cita a modificar., Body (JSON): Objeto con los campos a actualizar (fechaHoraInicio, profesional, tratamientos, estado, notas, etc.).

**Respuesta:** El objeto JSON de la cita actualizada.

### `GET` `/api/disponibilidad/profesional`

Verifica los horarios disponibles de un profesional en una fecha específica, excluyendo la propia cita que se está editando, para evitar conflictos al reprogramar.

**Parámetros:** profesionalId: ObjectId del profesional., fecha: Fecha para la cual se consulta la disponibilidad., duracion: Duración del tratamiento en minutos., excluirCitaId: ObjectId de la cita actual para ignorarla en la comprobación de conflictos.

**Respuesta:** Un array de objetos con los slots de tiempo disponibles.

## 🗂️ Estructura Backend (MERN)

La lógica del backend se centra en el modelo 'Cita', el controlador 'CitaController' y las rutas definidas en 'citaRoutes'. El controlador maneja la lógica de negocio, como la validación de conflictos, el registro de cambios y la actualización del documento en MongoDB.

### Models

#### Cita

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true }, profesional: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }, consultorio: { type: Schema.Types.ObjectId, ref: 'Consultorio', required: true }, fechaHoraInicio: { type: Date, required: true }, fechaHoraFin: { type: Date, required: true }, duracion: { type: Number, required: true }, tratamientos: [{ type: Schema.Types.ObjectId, ref: 'Tratamiento' }], estado: { type: String, enum: ['Programada', 'Confirmada', 'En Sala de Espera', 'En Progreso', 'Completada', 'Cancelada', 'No Asistió'], default: 'Programada' }, notas: String, historialCambios: [{ usuario: Schema.Types.ObjectId, fecha: Date, cambios: Object }]

### Controllers

#### CitaController

- getCitaById
- updateCita

#### DisponibilidadController

- checkDisponibilidadProfesional

### Routes

#### `/api/citas`

- GET /:id
- PUT /:id

## 🔄 Flujos

1. El usuario (Recepción/Odontólogo) hace clic en una cita existente en el calendario principal.
2. El sistema abre el modal 'Editar Cita', precargando todos los datos actuales de la cita mediante una llamada a 'GET /api/citas/:id'.
3. El usuario modifica uno o más campos: fecha/hora, profesional, tratamiento, duración, estado o notas.
4. Si se cambia la fecha/hora, el profesional o la duración, el sistema realiza una validación de disponibilidad en tiempo real ('GET /api/disponibilidad/profesional') para mostrar advertencias de conflictos.
5. Al hacer clic en 'Guardar', el frontend envía los datos actualizados a 'PUT /api/citas/:id'.
6. El backend valida los datos, previene solapamientos, actualiza la cita en la base de datos, registra el cambio en 'historialCambios' y devuelve la cita actualizada.
7. El modal se cierra y el calendario se actualiza visualmente para reflejar el cambio (moviendo el bloque de la cita, cambiando su color, etc.).
8. Opcional: El sistema dispara una notificación (email/SMS) al paciente informando sobre la modificación de su cita.

## 📝 User Stories

- Como recepcionista, quiero poder reprogramar una cita fácilmente cuando un paciente me lo solicita por teléfono, para mantener la agenda del doctor organizada y ofrecer alternativas al instante.
- Como odontólogo, quiero poder cambiar el estado de una cita a 'Completada' y añadir notas clínicas post-procedimiento directamente desde la agenda, para que el historial del paciente esté actualizado para la siguiente visita.
- Como personal de Call Center, quiero poder modificar el tratamiento asociado a una cita si el paciente cambia de opinión antes de su visita, para que el equipo clínico y de facturación estén al tanto.
- Como higienista, quiero poder ajustar la duración de una cita si una limpieza se extiende más de lo previsto, para asegurar que mi agenda refleje el tiempo real y no se generen retrasos.

## ⚙️ Notas Técnicas

- Implementar un sistema de bloqueo optimista (usando el campo '__v' de Mongoose o un campo 'version') para prevenir condiciones de carrera donde dos usuarios modifican la misma cita simultáneamente.
- Asegurar que todas las fechas se almacenen en UTC en la base de datos (MongoDB) y se conviertan a la zona horaria local de la clínica en el frontend (React) para evitar inconsistencias horarias.
- El subdocumento 'historialCambios' es fundamental. Debe registrar el ID del usuario que realizó el cambio, la fecha y un 'diff' del antes y el después para una auditoría completa.
- El endpoint 'PUT /api/citas/:id' debe estar protegido y validar que el rol del usuario tiene permisos para modificar la cita. Por ejemplo, un odontólogo solo podría modificar sus propias citas.
- Utilizar WebSockets o una librería de SWR (Stale-While-Revalidate) como 'React Query' o 'SWR' en el frontend para que el calendario se actualice en tiempo real para todos los usuarios conectados si un usuario edita una cita.

