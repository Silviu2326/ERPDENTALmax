# Agenda Mobile (Vista Profesional)

**Categoría:** Plataforma Digital | **Módulo:** Portal de Cita Online y Móvil

La 'Agenda Mobile (Vista Profesional)' es una interfaz web optimizada para dispositivos móviles (smartphones y tablets) que proporciona a los profesionales de la clínica (odontólogos, higienistas) y al personal de apoyo (recepción) un acceso rápido, claro y en tiempo real a la programación de citas. Esta funcionalidad es una pieza clave del 'Portal de Cita Online y Móvil', extendiendo la gestión de la agenda más allá del puesto de trabajo tradicional en el escritorio. Su propósito principal es ofrecer portabilidad y conveniencia, permitiendo a los usuarios consultar su jornada laboral, los detalles de los pacientes programados y los tratamientos a realizar desde cualquier lugar. Funciona como una vista simplificada pero potente de la agenda principal del ERP, priorizando la legibilidad y la facilidad de uso en pantallas pequeñas. La vista móvil no busca replicar el 100% de las funcionalidades de la agenda de escritorio, sino que se centra en las acciones más comunes y necesarias 'on-the-go': visualización de la agenda por día/semana, acceso a detalles esenciales de la cita (paciente, tratamiento, hora), cambio de estado de la cita (ej. de 'Confirmada' a 'En clínica'), y acceso rápido a datos de contacto del paciente. Es una herramienta fundamental para la agilidad operativa, la mejora de la comunicación interna y la preparación de los profesionales antes de cada cita.

## 👥 Roles de Acceso

- Odontólogo
- Higienista
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-cita-online-movil/`

Esta funcionalidad se encuentra dentro de la feature 'portal-cita-online-movil'. La página principal, definida en la subcarpeta '/pages', renderiza la interfaz de la agenda. Esta página utiliza componentes reutilizables de la subcarpeta '/components' para construir la vista, como el calendario, las tarjetas de cita y los filtros. Las interacciones del usuario que requieren datos del servidor se gestionan a través de funciones definidas en '/apis', que se encargan de realizar las llamadas a los endpoints del backend correspondientes.

### Archivos Frontend

- `/features/portal-cita-online-movil/pages/AgendaProfesionalMobilePage.tsx`
- `/features/portal-cita-online-movil/components/MobileAgendaView.tsx`
- `/features/portal-cita-online-movil/components/AppointmentCardMobile.tsx`
- `/features/portal-cita-online-movil/components/DateNavigatorMobile.tsx`
- `/features/portal-cita-online-movil/components/ProfessionalFilterMobile.tsx`
- `/features/portal-cita-online-movil/apis/agendaProfesionalApi.ts`

### Componentes React

- AgendaProfesionalMobilePage
- MobileAgendaView
- AppointmentCardMobile
- DateNavigatorMobile
- ProfessionalFilterMobile
- AppointmentStatusChip

## 🔌 APIs Backend

Las APIs para la agenda móvil están diseñadas para ser ligeras y rápidas. Proveen los datos de citas filtrados por profesional y rango de fechas, así como endpoints para obtener detalles específicos de una cita o para realizar acciones rápidas como cambiar su estado.

### `GET` `/api/agenda/profesional`

Obtiene la lista de citas para uno o más profesionales en un rango de fechas determinado. Es el endpoint principal para poblar la vista de la agenda.

**Parámetros:** profesionalId: string (ID del profesional. Opcional, si no se provee y el rol es admin/recepción, se devuelven todas. Si el rol es profesional, se usa su propio ID), fechaInicio: string (ISO Date), fechaFin: string (ISO Date)

**Respuesta:** Un array de objetos de cita con información esencial (ID, hora, paciente, tratamiento, estado).

### `GET` `/api/citas/:id/detalles-movil`

Obtiene detalles ampliados pero optimizados para móvil de una cita específica, incluyendo notas importantes del paciente o del tratamiento.

**Parámetros:** id: string (ID de la cita)

**Respuesta:** Un objeto con los detalles de la cita, incluyendo datos del paciente (teléfono, alertas médicas) y notas de la cita.

### `PUT` `/api/citas/:id/estado`

Permite cambiar rápidamente el estado de una cita (ej: de 'Confirmada' a 'Paciente en sala de espera').

**Parámetros:** id: string (ID de la cita), body: { estado: string }

**Respuesta:** El objeto de la cita actualizado.

### `GET` `/api/profesionales/activos`

Obtiene una lista de los profesionales activos en la clínica. Usado por el rol de Recepción para filtrar la agenda.

**Respuesta:** Un array de objetos de profesional (id, nombreCompleto).

## 🗂️ Estructura Backend (MERN)

La estructura del backend se apoya en el modelo 'Cita' como eje central. El controlador 'AgendaController' contiene la lógica de negocio para consultar y manipular las citas de manera eficiente, con funciones específicas para la vista móvil que optimizan los datos devueltos. Las rutas definen los endpoints RESTful que el frontend consumirá.

### Models

#### Cita

paciente: ObjectId (ref a 'Paciente'), profesional: ObjectId (ref a 'Profesional'), tratamiento: ObjectId (ref a 'Tratamiento'), fechaHoraInicio: Date, fechaHoraFin: Date, estado: String ('Pendiente', 'Confirmada', 'Paciente en espera', 'En box', 'Finalizada', 'Cancelada'), notas: String, clinica: ObjectId (ref a 'Clinica')

#### Profesional

nombre: String, apellidos: String, especialidad: String, colorAgenda: String, usuario: ObjectId (ref a 'Usuario')

#### Paciente

nombre: String, apellidos: String, telefono: String, email: String, alertasMedicas: String

### Controllers

#### AgendaController

- getAgendaProfesional
- getDetallesCitaMovil
- updateEstadoCita

#### ProfesionalController

- getProfesionalesActivos

### Routes

#### `/api/agenda`

- GET /profesional

#### `/api/citas`

- GET /:id/detalles-movil
- PUT /:id/estado

#### `/api/profesionales`

- GET /activos

## 🔄 Flujos

1. El odontólogo abre el ERP en su móvil, accede a la 'Agenda Mobile' y visualiza por defecto sus citas del día actual.
2. El profesional se desplaza entre días o cambia a la vista semanal usando el 'DateNavigatorMobile'.
3. El profesional pulsa sobre una 'AppointmentCardMobile' para ver detalles del paciente, como su número de teléfono o alertas médicas.
4. Desde la vista de detalle, el profesional pulsa un botón para iniciar una llamada al paciente.
5. La recepcionista accede a la agenda móvil, usa el 'ProfessionalFilterMobile' para seleccionar a un higienista y consultar su disponibilidad para la próxima semana.
6. Cuando un paciente llega a la clínica, el higienista actualiza el estado de la cita a 'Paciente en espera' directamente desde su móvil.

## 📝 User Stories

- Como odontólogo, quiero ver mi agenda diaria en mi teléfono móvil para estar al tanto de mis citas del día antes de llegar a la clínica.
- Como higienista, quiero acceder a mi programación semanal en mi tablet para preparar el material necesario para los tratamientos con antelación.
- Como recepcionista, quiero poder filtrar la agenda por profesional desde el móvil para confirmar rápidamente la próxima cita de un doctor a un paciente que llama por teléfono.
- Como odontólogo, quiero poder tocar una cita y ver las notas importantes y el teléfono del paciente para poder contactarle si surge un imprevisto.
- Como profesional, quiero poder marcar que un paciente ha llegado a la clínica directamente desde mi dispositivo móvil para que todo el equipo esté informado en tiempo real.

## ⚙️ Notas Técnicas

- Seguridad: Todos los endpoints deben estar protegidos por autenticación (JWT) y autorización basada en roles (RBAC). Un profesional solo puede ver su propia agenda, mientras que un rol de recepción puede ver la de todos.
- Rendimiento: Es crucial implementar paginación o carga 'lazy loading' para las vistas semanales/mensuales para no sobrecargar el dispositivo. Las consultas a la base de datos deben estar optimizadas con los índices adecuados (profesional, fechaHoraInicio).
- UI/UX: El diseño debe ser 'mobile-first'. Usar componentes táctiles grandes y evitar el 'hover'. La información debe ser concisa y visualmente clara, utilizando colores (ej. 'colorAgenda' del profesional) para diferenciar citas.
- Sincronización en tiempo real: Para una experiencia óptima, se podría implementar WebSockets (ej. Socket.io) para notificar al cliente de cambios en la agenda (nuevas citas, cancelaciones) en tiempo real. Como alternativa más sencilla, se puede implementar un mecanismo de 'pull-to-refresh'.
- PWA (Progressive Web App): Considerar la implementación de un Service Worker para permitir la consulta de la agenda en modo offline (con los últimos datos cacheados) y para ofrecer la opción de 'Añadir a la pantalla de inicio'.

