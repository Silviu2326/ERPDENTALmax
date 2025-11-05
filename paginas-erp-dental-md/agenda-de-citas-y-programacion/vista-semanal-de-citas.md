# Vista Semanal de Citas

**Categoría:** Gestión de Citas | **Módulo:** Agenda de Citas y Programación

La 'Vista Semanal de Citas' es una de las interfaces más cruciales dentro del módulo 'Agenda de Citas y Programación'. Funciona como el centro neurálgico para la gestión operativa diaria y semanal de la clínica dental. Esta funcionalidad presenta un calendario interactivo que muestra todas las citas programadas a lo largo de una semana completa, generalmente distribuida en columnas por día y filas por horas. Su propósito principal es ofrecer una visión clara, completa y rápida de la ocupación de la clínica, permitiendo a los distintos roles (desde recepción hasta los odontólogos y gerentes) comprender la carga de trabajo, identificar huecos disponibles, y gestionar las citas existentes con agilidad. Dentro del ERP, esta vista no es solo un display pasivo; es una herramienta de trabajo activa. Permite la creación rápida de nuevas citas haciendo clic en un espacio vacío, la modificación de citas existentes a través de una interfaz de 'arrastrar y soltar' (drag-and-drop) para reprogramar, y el acceso a detalles completos de cada cita con un solo clic. La vista se integra con múltiples módulos: extrae información de 'Pacientes' para mostrar el nombre, de 'Tratamientos' para indicar el procedimiento a realizar, y de 'Personal' para asignar la cita al profesional correcto. Además, utiliza un sistema de codificación por colores para representar visualmente el estado de cada cita (confirmada, pendiente, cancelada, etc.), mejorando la eficiencia operativa y reduciendo errores.

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

Esta funcionalidad reside dentro de la feature 'agenda-citas-programacion'. La página principal estará en `/pages/VistaSemanalPage.tsx`, que actuará como contenedor. Los componentes reutilizables como la cuadrícula del calendario (`SemanaCalendarioGrid.tsx`), las tarjetas de cita individuales (`CitaCardSemanal.tsx`), los filtros (`FiltrosVistaSemanal.tsx`) y el modal de detalles (`ModalDetalleCita.tsx`) se ubicarán en la carpeta `/components/`. Las llamadas al backend para obtener y manipular las citas se centralizarán en un archivo dentro de `/apis/citasApi.ts`, promoviendo una arquitectura limpia y modular.

### Archivos Frontend

- `/features/agenda-citas-programacion/pages/VistaSemanalPage.tsx`
- `/features/agenda-citas-programacion/components/SemanaCalendarioGrid.tsx`
- `/features/agenda-citas-programacion/components/CitaCardSemanal.tsx`
- `/features/agenda-citas-programacion/components/FiltrosVistaSemanal.tsx`
- `/features/agenda-citas-programacion/apis/citasApi.ts`

### Componentes React

- VistaSemanalPage
- SemanaCalendarioGrid
- CitaCardSemanal
- ModalDetalleCita
- FiltrosVistaSemanal
- SelectorSemana

## 🔌 APIs Backend

Se requieren APIs para obtener el conjunto de citas de una semana específica, con capacidad de filtrado, y para actualizar la información de una cita, especialmente su fecha, hora y recursos asignados (profesional, box) como resultado de una acción de 'arrastrar y soltar'.

### `GET` `/api/citas/semanal`

Obtiene todas las citas para un rango de fechas específico (una semana) con la opción de filtrar por profesional, sede o box/gabinete.

**Parámetros:** fecha_inicio (query, string, YYYY-MM-DD), fecha_fin (query, string, YYYY-MM-DD), id_profesional (query, opcional, string), id_sede (query, opcional, string), id_box (query, opcional, string)

**Respuesta:** Un array de objetos Cita, cada uno con detalles populados del paciente, profesional, tratamiento y estado.

### `PUT` `/api/citas/:id/mover`

Actualiza la fecha, hora y/o el profesional/box de una cita existente. Utilizado para la funcionalidad de arrastrar y soltar (drag-and-drop).

**Parámetros:** id (param, string), nueva_fecha_hora_inicio (body, datetime), id_profesional_nuevo (body, string), id_box_nuevo (body, string)

**Respuesta:** El objeto Cita actualizado.

### `GET` `/api/citas/:id`

Obtiene los detalles completos de una cita específica para mostrar en el modal, incluyendo historial del paciente y notas asociadas.

**Parámetros:** id (param, string)

**Respuesta:** Un objeto Cita detallado con información expandida.

## 🗂️ Estructura Backend (MERN)

El backend se apoya en el modelo 'Cita' de MongoDB para almacenar toda la información de las citas. Un 'CitaController' gestiona la lógica de negocio, como la consulta de citas por rango de fechas y filtros, y la validación de disponibilidad al mover una cita. Las rutas se definen en un archivo de rutas dedicado para las citas, siguiendo las convenciones RESTful.

### Models

#### Cita

paciente (ObjectId, ref: 'Paciente'), profesional (ObjectId, ref: 'Usuario'), sede (ObjectId, ref: 'Sede'), box (ObjectId, ref: 'Box'), fecha_hora_inicio (Date), fecha_hora_fin (Date), tratamientos ([ObjectId, ref: 'Tratamiento']), estado (String, enum: ['Programada', 'Confirmada', 'En Sala de Espera', 'En Proceso', 'Completada', 'Cancelada', 'No Asistió']), notas (String), color (String), creado_por (ObjectId, ref: 'Usuario').

### Controllers

#### CitaController

- obtenerCitasSemanales
- obtenerDetalleCita
- moverCita

### Routes

#### `/api/citas`

- GET /semanal
- GET /:id
- PUT /:id/mover

## 🔄 Flujos

1. El usuario (Recepción) accede a la Vista Semanal. El sistema realiza una llamada a la API para cargar las citas de la semana actual para todos los profesionales de su sede.
2. Un Odontólogo accede a la vista. El sistema detecta su rol y filtra automáticamente el calendario para mostrar únicamente sus citas programadas.
3. El usuario utiliza los controles de filtro para seleccionar un profesional o un box específico, y la vista se actualiza dinámicamente para mostrar solo las citas que coinciden.
4. El usuario hace clic en una tarjeta de cita. Un modal se abre mostrando toda la información detallada y botones de acción (confirmar, cancelar, editar).
5. El usuario arrastra una cita de un hueco a otro. Al soltar, se realiza una llamada a la API para validar la disponibilidad y, si es correcta, se actualiza la cita en la base de datos y en la interfaz.
6. El usuario navega a la semana siguiente o anterior usando los controles de paginación de la semana, lo que desencadena una nueva llamada a la API con el nuevo rango de fechas.

## 📝 User Stories

- Como recepcionista, quiero ver la agenda de toda la semana de un vistazo para poder encontrar rápidamente huecos disponibles y agendar nuevos pacientes por teléfono.
- Como odontólogo, quiero acceder a mi agenda semanal en mi tablet para saber qué pacientes y tratamientos tengo programados cada día y prepararme adecuadamente.
- Como gerente de clínica, quiero poder filtrar la vista semanal por profesional para evaluar la carga de trabajo, la productividad y la ocupación de los boxes.
- Como personal de Call Center (multisede), quiero poder cambiar fácilmente entre las vistas semanales de diferentes sedes para gestionar citas de forma centralizada y eficiente.
- Como higienista, quiero poder arrastrar y soltar una cita para reprogramarla fácilmente si un paciente llama para cambiarla, sin tener que navegar por múltiples menús.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial indexar los campos `fecha_hora_inicio`, `profesional`, `sede` y `box` en el modelo 'Cita' de MongoDB para garantizar que la consulta de citas semanales sea rápida y eficiente, incluso con un gran volumen de datos.
- Interactividad (Frontend): Se recomienda el uso de una librería de calendario robusta como `react-big-calendar` o `FullCalendar` para gestionar la renderización de la cuadrícula, los eventos y la funcionalidad de 'drag and drop', adaptándola a los requisitos específicos de la clínica.
- Sincronización en Tiempo Real: Para un entorno multisuario, implementar WebSockets (ej. con Socket.io) es altamente recomendable. Esto permitirá que los cambios en una cita (creación, movimiento, cambio de estado) se reflejen instantáneamente en las pantallas de todos los usuarios conectados, previniendo conflictos de programación.
- Lógica de Negocio y Validaciones: El backend debe contener una lógica robusta para validar cualquier cambio en una cita. Esto incluye verificar que el nuevo horario no entre en conflicto con otra cita para el mismo profesional o box, y que esté dentro del horario laboral del profesional.
- Seguridad y Permisos: La API debe estar protegida y validar en cada petición que el usuario tiene los permisos adecuados para la acción que intenta realizar. Un odontólogo solo debería poder modificar sus propias citas, mientras que un gerente o recepcionista podría tener permisos más amplios.

