# Gestión de Disponibilidad de Profesionales

**Categoría:** Gestión de Citas | **Módulo:** Agenda de Citas y Programación

La funcionalidad de 'Gestión de Disponibilidad de Profesionales' es un pilar fundamental dentro del módulo 'Agenda de Citas y Programación'. Su propósito principal es permitir a los administradores, personal de recepción y recursos humanos definir, visualizar y modificar los horarios de trabajo, ausencias y bloqueos especiales de cada profesional de la clínica. Este sistema va más allá de un simple horario semanal; permite configurar patrones de trabajo recurrentes (ej. lunes, miércoles y viernes por la mañana; martes y jueves jornada completa), así como gestionar excepciones puntuales como vacaciones, bajas por enfermedad, asistencia a congresos o cualquier otro tipo de ausencia planificada. Al estar centralizada, esta gestión asegura que el calendario de citas principal solo ofrezca huecos disponibles reales, previniendo errores de agendamiento como el doble booking o la asignación de citas fuera del horario laboral del especialista. Para una clínica dental, especialmente una con múltiples sedes y especialistas, una gestión precisa de la disponibilidad es crítica para optimizar la ocupación de los gabinetes, maximizar la productividad y ofrecer una experiencia fluida al paciente al momento de solicitar una cita. Esta funcionalidad alimenta directamente al motor de búsqueda de citas, asegurando que cada slot propuesto sea viable y esté respaldado por la presencia confirmada del profesional.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Recepción / Secretaría
- RR. HH.

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/agenda-citas-programacion/`

Esta funcionalidad reside dentro de la feature 'agenda-citas-programacion'. La página principal, ubicada en '/pages/GestionDisponibilidadPage.tsx', actúa como el contenedor principal. Utiliza componentes reutilizables de la carpeta '/components/' como 'DisponibilidadCalendarView' para mostrar visualmente los horarios y 'FormularioHorarioProfesional' para editar los patrones de trabajo. Todas las interacciones con el backend para obtener, crear o actualizar la disponibilidad se gestionan a través de funciones encapsuladas en el archivo '/apis/disponibilidadApi.ts', que realiza las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/agenda-citas-programacion/pages/GestionDisponibilidadPage.tsx`
- `/features/agenda-citas-programacion/apis/disponibilidadApi.ts`
- `/features/agenda-citas-programacion/components/DisponibilidadCalendarView.tsx`
- `/features/agenda-citas-programacion/components/FormularioHorarioProfesional.tsx`
- `/features/agenda-citas-programacion/components/ModalGestionExcepcion.tsx`

### Componentes React

- DisponibilidadCalendarView
- FormularioHorarioProfesional
- ModalGestionExcepcion
- SelectorProfesionalSede
- ListaBloqueosHorarios

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en la gestión de dos conceptos clave: los horarios recurrentes (la jornada laboral estándar) y las excepciones (ausencias o bloqueos puntuales). Se necesitan endpoints para obtener la configuración completa de un profesional, para crear/actualizar sus horarios base y para añadir, modificar o eliminar excepciones.

### `GET` `/api/disponibilidad/profesional/:profesionalId`

Obtiene todos los horarios recurrentes y las excepciones para un profesional específico, opcionalmente filtrado por sede y rango de fechas.

**Parámetros:** profesionalId (param), sedeId (query, opcional), fechaInicio (query, opcional), fechaFin (query, opcional)

**Respuesta:** Un objeto con dos arrays: 'horariosRecurrentes' y 'excepciones'.

### `POST` `/api/disponibilidad/horario-recurrente`

Crea o actualiza el conjunto de horarios de trabajo recurrentes para un profesional en una sede específica. Reemplaza la configuración anterior.

**Parámetros:** profesionalId (body), sedeId (body), horarios: [{ diaSemana: number, horaInicio: string, horaFin: string }, ...]

**Respuesta:** El objeto del profesional con su horario actualizado.

### `POST` `/api/disponibilidad/excepcion`

Añade una nueva excepción (ausencia/bloqueo) para un profesional.

**Parámetros:** profesionalId (body), sedeId (body, opcional), fechaInicio (body), fechaFin (body), motivo (string, body), diaCompleto (boolean, body)

**Respuesta:** El objeto de la excepción creada.

### `DELETE` `/api/disponibilidad/excepcion/:excepcionId`

Elimina una excepción de disponibilidad específica.

**Parámetros:** excepcionId (param)

**Respuesta:** Un mensaje de confirmación de la eliminación.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con dos modelos de MongoDB: 'ProfesionalHorario' para los patrones de trabajo semanales y 'ProfesionalExcepcion' para las ausencias. Un 'DisponibilidadController' centraliza la lógica de negocio, como calcular la disponibilidad real en un momento dado (considerando horarios y excepciones). Las rutas se exponen a través de Express en '/routes/disponibilidad.js'.

### Models

#### ProfesionalHorario

profesional: ObjectId, sede: ObjectId, diaSemana: Number (0=Domingo, 6=Sábado), horaInicio: String (HH:mm), horaFin: String (HH:mm), activo: Boolean

#### ProfesionalExcepcion

profesional: ObjectId, sede: ObjectId, fechaInicio: Date, fechaFin: Date, motivo: String, diaCompleto: Boolean, creadoPor: ObjectId

### Controllers

#### DisponibilidadController

- obtenerDisponibilidadCompleta
- guardarHorarioRecurrente
- crearExcepcion
- eliminarExcepcion

### Routes

#### `/api/disponibilidad`

- GET /profesional/:profesionalId
- POST /horario-recurrente
- POST /excepcion
- DELETE /excepcion/:excepcionId

## 🔄 Flujos

1. El usuario de RR. HH. accede a la página, selecciona un profesional y una sede, y define su horario semanal estándar (ej. Lunes a Jueves de 09:00 a 18:00).
2. Un recepcionista recibe una solicitud de vacaciones de un doctor. Entra a la funcionalidad, selecciona al profesional, y crea una nueva 'excepción' de tipo 'vacaciones' para las fechas solicitadas, bloqueando su agenda.
3. El director de la clínica necesita planificar el próximo mes. Utiliza la vista de calendario para ver la disponibilidad de todos los odontólogos generales en la sede principal y detectar posibles carencias de personal.
4. Un administrador necesita bloquear una mañana para una formación de todo el equipo. Crea excepciones para todos los profesionales implicados durante el horario de la formación.

## 📝 User Stories

- Como miembro de RR. HH., quiero establecer y modificar los horarios de trabajo recurrentes de cada profesional para asegurar que la agenda de citas refleje su jornada laboral estándar.
- Como recepcionista, quiero visualizar rápidamente los días y horas no disponibles de un profesional (vacaciones, bajas, conferencias) para no agendar citas por error en esos periodos.
- Como Director de clínica, quiero tener una vista general de la disponibilidad de todos los profesionales en una o varias sedes para planificar la cobertura y la asignación de recursos.
- Como Admin general, quiero poder definir bloqueos específicos de tiempo por motivos excepcionales (ej. reunión de equipo, mantenimiento de equipo) para que no se puedan agendar citas en ese intervalo.

## ⚙️ Notas Técnicas

- Lógica de Cálculo: La lógica para determinar la disponibilidad final de un profesional debe ser robusta, superponiendo el horario recurrente con las excepciones y los bloqueos. Este cálculo debe realizarse preferentemente en el backend para mantener una única fuente de verdad y evitar inconsistencias.
- Zonas Horarias: El sistema debe manejar correctamente las zonas horarias, especialmente en configuraciones multisede. Se recomienda almacenar todas las fechas y horas en UTC en MongoDB y convertirlas a la zona horaria local de la sede en el frontend.
- Rendimiento: Para las vistas de calendario que consultan disponibilidad de múltiples profesionales, la API debe estar optimizada. Considerar la implementación de índices en la base de datos sobre los campos 'profesionalId', 'sedeId' y 'fechaInicio' para acelerar las consultas.
- Integración Crítica: Esta funcionalidad es la base del motor de agendamiento. La API de 'crear cita' debe validar en tiempo real contra la disponibilidad del profesional antes de confirmar la cita, devolviendo un error claro si el slot no está disponible.
- Auditoría: Implementar un log de auditoría para los cambios en la disponibilidad. Registrar quién, cuándo y qué cambió (ej. `userId` modificó el horario del `profesionalId`) es crucial para la trazabilidad.

