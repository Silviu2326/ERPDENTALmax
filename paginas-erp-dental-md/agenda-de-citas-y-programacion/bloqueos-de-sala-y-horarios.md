# Bloqueos de Sala y Horarios

**Categoría:** Gestión de Citas | **Módulo:** Agenda de Citas y Programación

La funcionalidad de 'Bloqueos de Sala y Horarios' es una herramienta administrativa esencial dentro del módulo de 'Agenda de Citas y Programación'. Su propósito principal es permitir a los usuarios autorizados reservar o inhabilitar franjas horarias específicas, días completos o incluso periodos prolongados para determinados recursos de la clínica, como un sillón dental (sala), un equipo específico o la agenda de un profesional. Estos bloqueos son cruciales para la gestión operativa diaria, ya que reflejan la disponibilidad real de los recursos. Se utilizan para una variedad de escenarios: mantenimiento de equipos, reuniones de personal, vacaciones o ausencias justificadas de un doctor, días festivos, cursos de formación, o simplemente para reservar tiempo para tareas administrativas. Al crear un bloqueo, el sistema marca visualmente ese espacio de tiempo en el calendario principal como no disponible, impidiendo que se agenden citas en él. Esto previene errores de sobre-asignación (double booking) y asegura que la agenda sea un reflejo fiel y actualizado de la capacidad operativa de la clínica. La herramienta debe permitir especificar el motivo del bloqueo, si es un evento recurrente (ej. reuniones semanales), y a qué recurso o sede afecta, siendo una pieza clave para la planificación y optimización de los recursos de la clínica dental.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Recepción / Secretaría
- RR. HH.

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/agenda-citas-programacion/`

Esta funcionalidad se integra dentro de la feature 'agenda-citas-programacion'. La lógica de la interfaz de usuario residirá en componentes específicos, principalmente un modal para la creación y edición de bloqueos, que será invocado desde el calendario principal. Las llamadas a la API estarán centralizadas en un archivo dentro de la subcarpeta /apis. Aunque no tenga una página dedicada y se gestione principalmente a través de modales sobre el calendario, se podría crear una página en /pages para la gestión avanzada y listado de todos los bloqueos.

### Archivos Frontend

- `/features/agenda-citas-programacion/components/ModalGestionBloqueo.tsx`
- `/features/agenda-citas-programacion/components/FormularioBloqueo.tsx`
- `/features/agenda-citas-programacion/components/VisualizadorBloqueoCalendario.tsx`
- `/features/agenda-citas-programacion/apis/bloqueosApi.ts`
- `/features/agenda-citas-programacion/pages/AdministracionBloqueosPage.tsx`

### Componentes React

- ModalGestionBloqueo
- FormularioBloqueo
- SelectorRecursoBloqueo
- ConfiguradorRecurrencia
- VisualizadorBloqueoCalendario

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan las operaciones CRUD (Crear, Leer, Actualizar, Borrar) de los registros de bloqueo. Deben permitir filtrar bloqueos por rango de fechas, sede y recurso para poder mostrarlos eficientemente en la agenda. La seguridad es clave, validando que el rol del usuario tenga permisos para realizar la acción solicitada.

### `POST` `/api/bloqueos`

Crea un nuevo bloqueo de tiempo para un recurso (sala o profesional).

**Parámetros:** body: { sedeId: string, tipo: 'SALA' | 'PROFESIONAL', recursoId: string, fechaInicio: ISODate, fechaFin: ISODate, motivo: string, esDiaCompleto: boolean, recurrencia?: object }

**Respuesta:** El objeto del bloqueo recién creado.

### `GET` `/api/bloqueos`

Obtiene una lista de todos los bloqueos dentro de un rango de fechas, filtrando opcionalmente por sede o recurso.

**Parámetros:** query: { fechaInicio: ISODate, fechaFin: ISODate, sedeId?: string, recursoId?: string }

**Respuesta:** Un array de objetos de bloqueo.

### `PUT` `/api/bloqueos/:id`

Actualiza la información de un bloqueo existente (ej. cambiar el motivo o la duración).

**Parámetros:** params: { id: string }, body: { ...campos a actualizar... }

**Respuesta:** El objeto del bloqueo actualizado.

### `DELETE` `/api/bloqueos/:id`

Elimina un bloqueo, liberando el espacio de tiempo en la agenda.

**Parámetros:** params: { id: string }

**Respuesta:** Un mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

Para soportar esta funcionalidad, se creará un nuevo modelo 'Bloqueo' en MongoDB. La lógica de negocio se manejará en 'BloqueoController', y los endpoints se definirán en un archivo de rutas dedicado. Este modelo coexistirá con el de 'Cita' y ambos serán consultados para construir la vista completa del calendario.

### Models

#### Bloqueo

sede: { type: ObjectId, ref: 'Sede', required: true }, tipo: { type: String, enum: ['SALA', 'PROFESIONAL'], required: true }, recursoId: { type: ObjectId, required: true }, fechaInicio: { type: Date, required: true, index: true }, fechaFin: { type: Date, required: true, index: true }, motivo: { type: String, required: true }, esDiaCompleto: { type: Boolean, default: false }, recurrencia: { type: Object }, creadoPor: { type: ObjectId, ref: 'Usuario' }

### Controllers

#### BloqueoController

- crearBloqueo
- obtenerBloqueos
- actualizarBloqueo
- eliminarBloqueo
- validarConflictoConCitas

### Routes

#### `/api/bloqueos`

- POST /
- GET /
- PUT /:id
- DELETE /:id

## 🔄 Flujos

1. El recepcionista hace clic en un espacio vacío del calendario, selecciona 'Crear Bloqueo'. Se abre un modal donde elige si bloquear un sillón o un doctor, define el rango horario, escribe el motivo (ej. 'Mantenimiento sillón 3'), y guarda. El espacio aparece coloreado en la agenda como 'no disponible'.
2. Un usuario de RR. HH. accede a la sección de gestión de personal, selecciona a un doctor y elige la opción 'Programar Ausencia'. Esto le lleva a la interfaz de creación de bloqueo, pre-seleccionando al doctor. Define el rango de fechas para las vacaciones y guarda, bloqueando la agenda completa de ese profesional para el periodo.
3. El director de la clínica necesita cancelar una reunión semanal. Busca el bloqueo recurrente en el calendario, hace clic en él y elige 'Eliminar esta ocurrencia' o 'Eliminar toda la serie'. El sistema elimina los bloqueos correspondientes, liberando el tiempo.

## 📝 User Stories

- Como Recepcionista, quiero bloquear un sillón dental por una hora para su limpieza y mantenimiento, para asegurar que no se agenden pacientes durante ese tiempo y garantizar la higiene.
- Como Director de clínica, quiero crear un bloqueo recurrente todos los lunes de 9 a 10 am para la reunión de equipo, para que ese tiempo quede reservado en las agendas de todos los profesionales automáticamente.
- Como profesional de RR. HH., quiero registrar las vacaciones de un odontólogo en el sistema con dos meses de antelación para que su agenda se bloquee y la recepción no pueda asignar citas en esas fechas.
- Como Admin General, quiero poder filtrar y ver todos los bloqueos de una sede específica para el próximo mes para planificar la asignación de recursos y personal.

## ⚙️ Notas Técnicas

- Validación de conflictos: El backend debe realizar una validación estricta para impedir la creación de un bloqueo si ya existen citas confirmadas en ese rango de tiempo para ese recurso. Se debe devolver un error claro al frontend.
- Gestión de recurrencia: La implementación de la lógica de recurrencia (diaria, semanal, mensual) es compleja. Se recomienda usar una librería robusta como 'rrule.js' tanto en el backend (para generar las instancias de bloqueo) como en el frontend (para la UI de configuración).
- Rendimiento de la Agenda: La consulta para obtener los eventos del calendario debe ser optimizada para traer tanto citas como bloqueos de forma eficiente. Usar índices en la base de datos sobre los campos de fecha (`fechaInicio`, `fechaFin`) y de recursos (`recursoId`, `sedeId`) en el modelo `Bloqueo` es fundamental.
- Seguridad y Permisos: La lógica de autorización debe ser implementada a nivel de API usando middleware. Un recepcionista solo debería poder crear/modificar bloqueos en su sede asignada, mientras que un rol de RRHH o Director podría tener permisos más amplios.
- Visualización y UX: Los bloqueos deben diferenciarse visualmente de las citas en la agenda (diferente color de fondo, un patrón de rayas, o un ícono específico) para una rápida identificación por parte del usuario.

