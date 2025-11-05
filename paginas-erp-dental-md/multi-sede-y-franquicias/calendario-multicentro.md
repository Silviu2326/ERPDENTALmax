# Calendario Multicentro

**Categoría:** Multi-sede | **Módulo:** Multi-sede y Franquicias

El Calendario Multicentro es una funcionalidad avanzada y centralizada, diseñada para la gestión de citas y recursos en grupos de clínicas dentales, franquicias o empresas con múltiples sedes. Su propósito principal es ofrecer una vista unificada y consolidada de las agendas de todos los centros o de una selección de ellos, desde una única interfaz. Esto elimina la necesidad de iniciar sesión en sistemas separados para cada clínica, optimizando drásticamente la eficiencia operativa. Para el personal de un call center, permite encontrar rápidamente la primera cita disponible para un paciente considerando todas las ubicaciones, mejorando la experiencia del cliente y maximizando la ocupación. Para la dirección, proporciona una herramienta de supervisión estratégica, permitiendo analizar la carga de trabajo de los profesionales, la utilización de los gabinetes y la distribución de pacientes entre las diferentes sedes. Funciona agregando los datos de citas, profesionales y disponibilidad de cada clínica en una vista de calendario interactiva (diaria, semanal, mensual). Los usuarios pueden aplicar filtros dinámicos por sede, profesional, especialidad o gabinete para refinar la vista según sus necesidades. Esta funcionalidad es un pilar del módulo 'Multi-sede y Franquicias', ya que materializa la visión de una gestión centralizada y cohesionada, fundamental para el crecimiento escalable del negocio dental.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Recepción / Secretaría
- Call Center

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/multi-sede-franquicias/`

La funcionalidad del Calendario Multicentro reside dentro de la carpeta /features/multi-sede-franquicias/. La lógica de la interfaz se encuentra en /pages/CalendarioMulticentroPage.tsx, que actúa como contenedor principal. Esta página importa y organiza componentes reutilizables desde la carpeta /components/, como 'FiltrosMulticentro' para la selección de sedes y profesionales, y 'GridCalendarioMultisede' que renderiza el calendario visual (potencialmente usando una librería como FullCalendar). Las llamadas al backend para obtener los datos consolidados se gestionan en /apis/calendarioMulticentroApi.ts, manteniendo la lógica de comunicación separada de la UI.

### Archivos Frontend

- `/features/multi-sede-franquicias/pages/CalendarioMulticentroPage.tsx`
- `/features/multi-sede-franquicias/components/GridCalendarioMultisede.tsx`
- `/features/multi-sede-franquicias/components/FiltrosMulticentro.tsx`
- `/features/multi-sede-franquicias/components/ModalCitaMultisede.tsx`
- `/features/multi-sede-franquicias/apis/calendarioMulticentroApi.ts`

### Componentes React

- CalendarioMulticentroPage
- GridCalendarioMultisede
- FiltrosMulticentro
- SelectorSede
- SelectorProfesionalMultisede
- ModalCitaMultisede
- LeyendaColoresSede

## 🔌 APIs Backend

Las APIs para el Calendario Multicentro deben ser capaces de agregar y filtrar grandes volúmenes de datos de citas de múltiples bases de datos o colecciones de sedes de manera eficiente. La seguridad es clave, garantizando que un usuario solo pueda acceder a la información de las sedes a las que tiene permiso.

### `GET` `/api/multisede/citas`

Obtiene las citas para un rango de fechas y un conjunto de sedes y profesionales seleccionados.

**Parámetros:** query.fechaInicio: string (ISO 8601), query.fechaFin: string (ISO 8601), query.sedes: string (IDs de sedes separadas por coma), query.profesionales: string (IDs de profesionales separados por coma)

**Respuesta:** Un array de objetos de citas, donde cada objeto incluye detalles del paciente, profesional, tratamiento y la sede a la que pertenece.

### `GET` `/api/multisede/profesionales`

Obtiene una lista de profesionales que trabajan en las sedes seleccionadas.

**Parámetros:** query.sedes: string (IDs de sedes separadas por coma)

**Respuesta:** Un array de objetos de profesionales, incluyendo su ID, nombre y especialidad.

### `GET` `/api/sedes/accesibles`

Obtiene la lista de sedes a las que el usuario autenticado tiene acceso.

**Respuesta:** Un array de objetos de sede, cada uno con su ID y nombre.

### `POST` `/api/citas`

Crea una nueva cita en una sede específica. Utiliza el endpoint de citas genérico, pero el formulario en el frontend debe incluir un selector de sede.

**Parámetros:** body.pacienteId: string, body.profesionalId: string, body.sedeId: string, body.fechaHoraInicio: string (ISO 8601), body.fechaHoraFin: string (ISO 8601), body.estado: string, body.notas: string

**Respuesta:** El objeto de la cita recién creada.

## 🗂️ Estructura Backend (MERN)

El backend se apoya en modelos clave para relacionar la información. El modelo 'Cita' debe tener una referencia directa a la 'Sede'. El modelo 'Usuario' (para profesionales) debe contener un array de las sedes a las que está asignado. El 'MultisedeController' contendrá la lógica de negocio para realizar consultas agregadas que crucen estos modelos y devuelvan la información consolidada que el frontend necesita.

### Models

#### Cita

profesional: ObjectId (ref: 'Usuario'), paciente: ObjectId (ref: 'Paciente'), sede: ObjectId (ref: 'Sede'), fechaHoraInicio: Date, fechaHoraFin: Date, estado: String, tratamiento: ObjectId, notas: String

#### Sede

nombre: String, direccion: String, telefono: String, colorIdentificativo: String

#### Usuario

nombre: String, apellidos: String, rol: String, especialidad: ObjectId, sedesAsignadas: [ObjectId (ref: 'Sede')]

### Controllers

#### MultisedeController

- obtenerCitasMultisede
- obtenerProfesionalesPorSedes

#### SedeController

- obtenerSedesAccesiblesPorUsuario

#### CitaController

- crearCita
- actualizarCita

### Routes

#### `/api/multisede`

- GET /citas
- GET /profesionales

#### `/api/sedes`

- GET /accesibles

## 🔄 Flujos

1. El usuario del Call Center accede a la página 'Calendario Multicentro'. El sistema carga por defecto la vista semanal con las citas de todas las sedes a las que tiene acceso.
2. Un paciente llama para pedir cita con un especialista. El usuario utiliza el filtro de 'Profesional' para seleccionarlo, y el calendario muestra únicamente la disponibilidad de ese doctor en todas las clínicas donde trabaja.
3. El Director General quiere revisar la ocupación. Selecciona dos sedes de bajo rendimiento en el filtro 'Sedes' y una vista mensual para comparar visualmente la densidad de citas.
4. Para crear una nueva cita, el usuario hace clic en un hueco libre. Se abre el 'ModalCitaMultisede' donde primero debe seleccionar la 'Sede', lo que automáticamente filtra la lista de 'Profesionales' disponibles en esa ubicación y en ese horario.

## 📝 User Stories

- Como agente del Call Center, quiero ver una agenda unificada de todas las clínicas para poder ofrecer al paciente la primera cita disponible sin importar la ubicación, agilizando el proceso de reserva.
- Como Director General, quiero filtrar el calendario por una o varias sedes a la vez para analizar y comparar su rendimiento y carga de trabajo.
- Como recepcionista, quiero ver el calendario de un doctor que trabaja en varias sedes para poder coordinar su agenda y citas de seguimiento entre clínicas.
- Como agente del Call Center, quiero que el calendario se actualice en tiempo real para evitar reservar una cita en un hueco que acaba de ser ocupado por una recepcionista en otra clínica.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial indexar los campos 'sede', 'profesional' y 'fechaHoraInicio' en el modelo 'Cita' de MongoDB para acelerar las consultas. Para vistas de largo alcance (ej. mensual), considerar la paginación de datos o la carga bajo demanda al hacer scroll.
- Seguridad: Implementar un middleware de autorización que verifique en cada petición a la API que el usuario autenticado tiene permisos para acceder a las sedes solicitadas en los parámetros de la consulta.
- UI/UX: Utilizar un código de colores distintivo para cada sede en el calendario. Esto permite una identificación visual rápida de dónde es cada cita. Los tooltips sobre las citas deben mostrar información clave, incluyendo el nombre de la sede.
- Tiempo Real: Para evitar colisiones de citas (doble reserva), se recomienda implementar WebSockets (ej. Socket.io). Cuando se crea o modifica una cita, el servidor debe emitir un evento a todos los clientes conectados que estén viendo el calendario para que su vista se actualice instantáneamente.
- Manejo de Zonas Horarias: Todas las fechas y horas deben almacenarse en la base de datos en formato UTC. La conversión a la zona horaria local de cada clínica debe gestionarse en el frontend para evitar inconsistencias si las sedes se encuentran en diferentes husos horarios.

