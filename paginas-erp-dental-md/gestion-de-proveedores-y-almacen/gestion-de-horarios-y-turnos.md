# Gestión de Horarios y Turnos

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad de 'Gestión de Horarios y Turnos' es un componente esencial dentro de la categoría de 'Gestión de Recursos' del ERP dental. Su propósito principal es permitir la planificación, asignación y seguimiento de los horarios de trabajo de todo el personal de la clínica, incluyendo odontólogos, higienistas, asistentes, y personal administrativo. Este módulo permite definir turnos rotativos, horarios fijos, jornadas partidas, así como gestionar ausencias, vacaciones y permisos. Aunque conceptualmente se asocia a RR.HH., su ubicación bajo 'Gestión de Proveedores y Almacén' subraya una visión holística de los recursos de la clínica: así como se gestiona el stock de materiales (recursos físicos), es igualmente crítico gestionar la disponibilidad del personal (recursos humanos) que utiliza dichos materiales y equipos. Una correcta planificación de horarios asegura que los recursos del almacén, como kits de implantes o materiales de ortodoncia, sean utilizados por el personal cualificado y disponible, optimizando tanto el inventario como la productividad del equipo. El sistema permite crear plantillas de horarios reutilizables, asignar turnos de forma masiva o individual, y visualizar la planificación en vistas de calendario (diaria, semanal, mensual). Esta gestión impacta directamente en la disponibilidad de la agenda de citas, asegurando que solo se puedan reservar citas cuando el profesional y los recursos necesarios estén programados para estar disponibles.

## 👥 Roles de Acceso

- RR. HH.
- Director / Admin general (multisede)
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Esta funcionalidad reside dentro de la feature 'gestion-proveedores-almacen'. La carpeta '/pages' contiene el componente principal de la página, 'GestionHorariosTurnosPage.tsx', que renderiza la interfaz de usuario. La carpeta '/components' alberga los elementos de UI reutilizables como el calendario de turnos ('CalendarioHorariosProfesional'), el modal para editar un turno ('ModalGestionTurno') y los formularios para crear plantillas ('FormularioPlantillaHorario'). Finalmente, la carpeta '/apis' contiene los hooks y funciones, como 'useHorariosApi.ts', que encapsulan las llamadas a la API del backend para obtener, crear y modificar datos de horarios y turnos.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/GestionHorariosTurnosPage.tsx`
- `/features/gestion-proveedores-almacen/components/CalendarioHorariosProfesional.tsx`
- `/features/gestion-proveedores-almacen/components/ModalGestionTurno.tsx`
- `/features/gestion-proveedores-almacen/components/FormularioPlantillaHorario.tsx`
- `/features/gestion-proveedores-almacen/components/PanelSolicitudesAusencia.tsx`
- `/features/gestion-proveedores-almacen/apis/horariosApi.ts`

### Componentes React

- GestionHorariosTurnosPage
- CalendarioHorariosProfesional
- ModalGestionTurno
- FormularioPlantillaHorario
- SelectorProfesionalSede
- PanelSolicitudesAusencia

## 🔌 APIs Backend

Las APIs para la gestión de horarios deben permitir operaciones CRUD completas sobre los turnos, plantillas y solicitudes de ausencia, con la capacidad de filtrar por profesional, sede y rango de fechas para optimizar la carga de datos.

### `GET` `/api/horarios`

Obtiene los horarios/turnos de los profesionales, filtrados por sede y rango de fechas.

**Parámetros:** query: sedeId (string, opcional), query: fechaInicio (string, formato ISO), query: fechaFin (string, formato ISO)

**Respuesta:** Array de objetos de HorarioProfesional.

### `POST` `/api/horarios`

Crea un nuevo turno o bloque de horario para un profesional.

**Parámetros:** body: { profesionalId, sedeId, fechaInicio, fechaFin, tipo: 'trabajo' | 'ausencia' | 'vacaciones' }

**Respuesta:** El objeto del HorarioProfesional creado.

### `PUT` `/api/horarios/:horarioId`

Actualiza un turno o bloque de horario existente.

**Parámetros:** path: horarioId, body: { fechaInicio, fechaFin, tipo }

**Respuesta:** El objeto del HorarioProfesional actualizado.

### `DELETE` `/api/horarios/:horarioId`

Elimina un turno o bloque de horario.

**Parámetros:** path: horarioId

**Respuesta:** Mensaje de confirmación.

### `GET` `/api/horarios/plantillas`

Obtiene todas las plantillas de horarios disponibles.

**Respuesta:** Array de objetos de PlantillaHorario.

### `POST` `/api/horarios/plantillas`

Crea una nueva plantilla de horarios.

**Parámetros:** body: { nombre, descripcion, turnos: [{ diaSemana, horaInicio, horaFin }] }

**Respuesta:** El objeto de la PlantillaHorario creada.

## 🗂️ Estructura Backend (MERN)

La lógica de backend se apoya en tres modelos principales: 'HorarioProfesional' para los turnos concretos, 'PlantillaHorario' para los modelos reutilizables y 'SolicitudAusencia' para gestionar permisos. El 'HorarioController' maneja toda la lógica de negocio, interactuando con estos modelos para responder a las peticiones que llegan a través de las rutas definidas en 'horarioRoutes.js'.

### Models

#### HorarioProfesional

profesional: { type: ObjectId, ref: 'User' }, sede: { type: ObjectId, ref: 'Sede' }, fechaInicio: Date, fechaFin: Date, tipo: { type: String, enum: ['trabajo', 'ausencia_justificada', 'vacaciones', 'bloqueo'] }, notas: String, creadoPor: { type: ObjectId, ref: 'User' }

#### PlantillaHorario

nombre: String, descripcion: String, turnos: [{ diaSemana: Number, horaInicio: String, horaFin: String }], sede: { type: ObjectId, ref: 'Sede', opcional }

#### SolicitudAusencia

profesional: { type: ObjectId, ref: 'User' }, fechaInicio: Date, fechaFin: Date, motivo: String, estado: { type: String, enum: ['pendiente', 'aprobada', 'rechazada'] }, gestionadoPor: { type: ObjectId, ref: 'User' }

### Controllers

#### HorarioController

- getHorarios
- createHorario
- updateHorario
- deleteHorario

#### PlantillaHorarioController

- getPlantillas
- createPlantilla

### Routes

#### `/api/horarios`

- GET /
- POST /
- PUT /:horarioId
- DELETE /:horarioId
- GET /plantillas
- POST /plantillas

## 🔄 Flujos

1. El usuario de RR.HH. accede a la página, crea una nueva 'Plantilla Horario de Mañana' para los Lunes a Viernes de 9:00 a 14:00.
2. El Director General selecciona a un nuevo odontólogo y aplica la plantilla 'Horario de Mañana' para las próximas 4 semanas, generando automáticamente todos los turnos de trabajo en el calendario.
3. La recepcionista visualiza el calendario semanal, ve que un asistente ha llamado por enfermedad, hace clic en el turno del día, lo cambia a 'ausencia_justificada' y añade una nota.
4. Un odontólogo solicita sus vacaciones de verano a través de su portal. La solicitud aparece en el 'Panel de Solicitudes de Ausencia' para que el Director la apruebe.
5. Al aprobar la solicitud, el sistema crea automáticamente un bloque de 'vacaciones' en el horario del odontólogo para esas fechas, lo que impide que se agenden citas en su calendario.

## 📝 User Stories

- Como miembro de RR.HH., quiero crear y gestionar plantillas de horarios para poder asignar turnos estandarizados de forma rápida y consistente al personal.
- Como Director General, quiero tener una vista de calendario mensual de todos los profesionales y sedes para identificar carencias de personal y planificar la cobertura eficientemente.
- Como recepcionista, quiero poder modificar un turno específico de un profesional para reflejar cambios de última hora, como una enfermedad o una emergencia.
- Como recepcionista, quiero filtrar el calendario por profesional para ver rápidamente su disponibilidad de la semana y poder informar a los pacientes.
- Como Director General, quiero recibir, revisar y aprobar o rechazar solicitudes de vacaciones del personal para formalizar el proceso de permisos.

## ⚙️ Notas Técnicas

- Integración Crítica: Cualquier cambio en esta sección (creación de turnos, aprobación de ausencias) debe propagarse en tiempo real al módulo de 'Agenda de Citas' para bloquear o liberar huecos, previniendo conflictos de agendamiento. Usar webhooks o un sistema de eventos para la comunicación entre módulos.
- Rendimiento: La carga de horarios para múltiples profesionales y sedes en un rango de fechas amplio puede ser pesada. Implementar paginación en el calendario (cargar semana a semana o mes a mes) y usar índices en la base de datos (por profesional, sede y fecha) en MongoDB.
- Seguridad y Permisos (RBAC): Es fundamental implementar un middleware en el backend para verificar roles. Un recepcionista solo puede modificar horarios de su sede, mientras que RR.HH. o el Director pueden gestionar todas las sedes.
- Manejo de Zonas Horarias: Para clínicas multisede en diferentes países o regiones, todas las fechas/horas deben almacenarse en la base de datos en formato UTC. La conversión a la zona horaria local de la sede debe realizarse en el frontend.
- Auditoría: Es recomendable registrar quién crea, modifica o elimina un turno. Añadir campos como 'creadoPor' y 'modificadoPor' en el modelo `HorarioProfesional` para llevar un control de cambios.

