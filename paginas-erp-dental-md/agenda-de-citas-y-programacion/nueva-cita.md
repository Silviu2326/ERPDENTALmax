# Nueva Cita

**Categoría:** Gestión de Citas | **Módulo:** Agenda de Citas y Programación

La funcionalidad 'Nueva Cita' es el núcleo operativo del módulo 'Agenda de Citas y Programación'. Se trata de una interfaz interactiva y guiada diseñada para permitir a los usuarios autorizados crear, programar y asignar citas para pacientes de manera eficiente y precisa. Su propósito principal es centralizar y estandarizar el proceso de agendamiento, minimizando errores humanos y optimizando la ocupación de los profesionales y los recursos de la clínica. Dentro del ERP, esta página funciona como un centro de conexión que integra información de múltiples módulos: consulta el maestro de 'Pacientes' para buscar o crear fichas, accede a los horarios y disponibilidad de los 'Recursos Humanos' (odontólogos, higienistas), y utiliza el catálogo de 'Tratamientos y Servicios' para determinar la duración y los requisitos de cada cita. El flujo de trabajo está pensado para ser secuencial y lógico: el usuario primero identifica al paciente, luego selecciona el tratamiento y el profesional, y finalmente el sistema presenta una vista de calendario con los huecos disponibles que se ajustan a la duración del tratamiento seleccionado, evitando así conflictos de programación y sobreasignación de recursos. Su correcta implementación es vital para la gestión del flujo de pacientes, la planificación de la capacidad de la clínica y la maximización de la facturación.

## 👥 Roles de Acceso

- Recepción / Secretaría
- Call Center
- Odontólogo
- Higienista

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/agenda-citas-programacion/`

Toda la lógica de frontend para la agenda reside en la carpeta '/features/agenda-citas-programacion/'. La página principal para esta funcionalidad, 'NuevaCitaPage.tsx', se encuentra en la subcarpeta '/pages'. Esta página actúa como un contenedor principal que organiza y renderiza múltiples componentes especializados de la subcarpeta '/components', como 'BuscadorPacientes' o 'CalendarioDisponibilidad'. La comunicación con el backend se abstrae en funciones específicas dentro de la subcarpeta '/apis', como 'citasApi.ts', que gestionan las llamadas a los endpoints RESTful para buscar disponibilidad, obtener datos y crear la cita.

### Archivos Frontend

- `/features/agenda-citas-programacion/pages/NuevaCitaPage.tsx`
- `/features/agenda-citas-programacion/components/FormularioNuevaCita.tsx`
- `/features/agenda-citas-programacion/components/BuscadorPacientes.tsx`
- `/features/agenda-citas-programacion/components/SelectorProfesionalTratamiento.tsx`
- `/features/agenda-citas-programacion/components/CalendarioDisponibilidad.tsx`
- `/features/agenda-citas-programacion/components/ModalConfirmacionCita.tsx`
- `/features/agenda-citas-programacion/apis/citasApi.ts`

### Componentes React

- FormularioNuevaCita
- BuscadorPacientes
- SelectorProfesionalTratamiento
- CalendarioDisponibilidad
- ModalConfirmacionCita
- CrearPacienteRapidoModal

## 🔌 APIs Backend

Se requieren varios endpoints para alimentar el formulario de nueva cita. Es necesario buscar pacientes, listar profesionales y tratamientos, consultar la disponibilidad en tiempo real y, finalmente, persistir la nueva cita en la base de datos.

### `GET` `/api/pacientes/buscar`

Busca pacientes existentes por nombre, apellidos, DNI o teléfono para el componente de autocompletado.

**Parámetros:** query (string de búsqueda)

**Respuesta:** Array de objetos de pacientes que coinciden con la búsqueda.

### `GET` `/api/usuarios/profesionales`

Obtiene una lista de todos los usuarios con rol de 'Odontólogo' o 'Higienista' para poblar el selector de profesional.

**Respuesta:** Array de objetos de usuarios profesionales.

### `GET` `/api/tratamientos`

Obtiene el catálogo completo de tratamientos con su duración estimada para el selector correspondiente.

**Parámetros:** filter (opcional, para buscar)

**Respuesta:** Array de objetos de tratamientos.

### `GET` `/api/agenda/disponibilidad`

Endpoint crucial que calcula y devuelve los huecos de tiempo disponibles para un profesional en un rango de fechas, considerando su horario laboral, citas existentes y la duración del tratamiento requerido.

**Parámetros:** profesionalId, fechaInicio, fechaFin, duracionMinutos

**Respuesta:** Array de objetos con los slots de tiempo disponibles (ej: { start: 'ISODate', end: 'ISODate' }).

### `POST` `/api/citas`

Crea un nuevo registro de cita en la base de datos con toda la información recopilada en el formulario.

**Parámetros:** Body: { pacienteId, profesionalId, tratamientoId, fechaInicio, fechaFin, notas, estado }

**Respuesta:** Objeto de la cita recién creada.

## 🗂️ Estructura Backend (MERN)

La lógica de negocio se reparte entre varios controladores. El 'CitaController' gestiona la creación y la lógica de disponibilidad, interactuando con los modelos 'Cita', 'Usuario' (para horarios) y 'ConfiguracionClinica' (para festivos). Otros controladores exponen datos de sus respectivos modelos (Pacientes, Tratamientos).

### Models

#### Cita

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, profesional: { type: Schema.Types.ObjectId, ref: 'Usuario' }, tratamiento: { type: Schema.Types.ObjectId, ref: 'Tratamiento' }, fechaInicio: Date, fechaFin: Date, estado: String ('Programada', 'Confirmada', 'Cancelada', 'Realizada'), consultorio: String, notas: String, creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }

#### Usuario

nombre: String, apellidos: String, rol: String ('Odontologo', 'Higienista', ...), horarioLaboral: [{ diaSemana: Number, horaInicio: String, horaFin: String }], activo: Boolean

#### Paciente

nombre: String, apellidos: String, documentoIdentidad: String, telefono: String, email: String

#### Tratamiento

nombre: String, descripcion: String, duracionEstimadaMinutos: Number, precio: Number

### Controllers

#### CitaController

- crearCita
- obtenerDisponibilidadProfesional

#### PacienteController

- buscarPacientes

#### UsuarioController

- obtenerProfesionalesActivos

#### TratamientoController

- obtenerTodosLosTratamientos

### Routes

#### `/api/citas`

- POST /

#### `/api/agenda`

- GET /disponibilidad

#### `/api/pacientes`

- GET /buscar

## 🔄 Flujos

1. El usuario (recepcionista) inicia el flujo de 'Nueva Cita'.
2. El sistema presenta un formulario. El usuario comienza a escribir en el campo 'Paciente' y el sistema realiza una búsqueda en tiempo real (debounce) para sugerir pacientes existentes.
3. Si el paciente no existe, el usuario puede hacer clic en un botón para abrir un modal de 'Creación Rápida de Paciente' sin abandonar el flujo de cita.
4. Una vez seleccionado el paciente, se habilitan los selectores de 'Profesional' y 'Tratamiento'.
5. Al seleccionar un tratamiento, su duración estimada se carga automáticamente.
6. Con el profesional y la duración definidos, el sistema realiza una llamada a la API de disponibilidad y muestra en un componente de calendario los días y horas libres.
7. El usuario selecciona un hueco disponible en el calendario.
8. Aparece un modal de confirmación con un resumen de la cita: paciente, profesional, tratamiento, fecha y hora.
9. Al confirmar, el sistema guarda la cita, bloquea el espacio en la agenda del profesional y puede disparar una notificación de confirmación al paciente vía email o SMS.

## 📝 User Stories

- Como recepcionista, quiero buscar un paciente por nombre, DNI o teléfono mientras agendo una cita para encontrar su ficha rápidamente.
- Como agente de call center, quiero ver un calendario claro con solo los huecos disponibles de un doctor para ofrecer opciones de cita al paciente sin tener que calcular mentalmente los espacios.
- Como odontólogo, quiero agendar una próxima cita para mi paciente al final de su consulta actual, seleccionando un tratamiento y viendo mi propia disponibilidad en las próximas semanas.
- Como higienista, quiero poder programar una cita para una limpieza seleccionando al paciente y que el sistema automáticamente me asigne la duración estándar para ese procedimiento.
- Como recepcionista, si un paciente nuevo llama, quiero poder crear una ficha básica con su nombre y teléfono directamente desde la pantalla de nueva cita para no perder tiempo cambiando de módulo.

## ⚙️ Notas Técnicas

- Rendimiento del endpoint de disponibilidad: La consulta de disponibilidad (`/api/agenda/disponibilidad`) es crítica. Debe ser optimizada para calcular rápidamente los huecos, cruzando horarios laborales, citas existentes, festivos y posibles ausencias del profesional. Considerar el uso de índices en la base de datos sobre `profesionalId` y `fechaInicio` en la colección de Citas.
- Gestión de concurrencia: Implementar un mecanismo para prevenir la doble reserva del mismo slot. Una estrategia es realizar una última comprobación de disponibilidad en la transacción de base de datos justo antes de insertar la nueva cita (optimistic locking).
- Validación de datos: Es crucial una validación exhaustiva tanto en el frontend (para una mejor UX) como en el backend (por seguridad). Validar que la hora de la cita esté dentro del horario laboral del profesional y del horario de apertura de la clínica.
- Integración con Notificaciones: La creación exitosa de una cita debería emitir un evento (ej. usando un message broker como RabbitMQ o un simple hook) que un servicio de notificaciones pueda consumir para enviar confirmaciones por SMS/Email/WhatsApp.
- Experiencia de Usuario (UX): El buscador de pacientes debe utilizar una estrategia de 'debounce' para no sobrecargar el servidor con peticiones mientras el usuario escribe. El calendario de disponibilidad debe ser visualmente claro, diferenciando entre horas ocupadas, fuera de horario y disponibles.

