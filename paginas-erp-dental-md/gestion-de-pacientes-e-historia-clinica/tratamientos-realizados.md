# Tratamientos Realizados

**Categoría:** Gestión Clínica | **Módulo:** Gestión de Pacientes e Historia Clínica

La página 'Tratamientos Realizados' es un componente esencial dentro del módulo de 'Gestión de Pacientes e Historia Clínica'. Funciona como el registro histórico inmutable de todas las intervenciones clínicas que se han completado para un paciente específico. A diferencia del 'Plan de Tratamiento', que es una hoja de ruta de procedimientos futuros, esta sección es el diario clínico consolidado del pasado y presente del paciente. Su propósito principal es ofrecer a los profesionales de la clínica una vista cronológica, detallada y organizada de la historia dental del paciente, permitiendo consultas rápidas sobre procedimientos anteriores, fechas, profesionales a cargo, piezas dentales tratadas y notas clínicas relevantes. Esta funcionalidad es crucial para la toma de decisiones clínicas informadas, el seguimiento de la evolución de patologías, la evaluación de la efectividad de tratamientos previos y la planificación de nuevas intervenciones. Además de su valor clínico, se integra directamente con el módulo de facturación, ya que cada tratamiento realizado suele estar asociado a un coste y un estado de pago, proporcionando una visión clara de la situación financiera del paciente en relación con los servicios prestados. En resumen, es el núcleo de la historia clínica digital, garantizando la continuidad de la atención y sirviendo como una fuente de datos fundamental para la gestión clínica, administrativa y legal.

## 👥 Roles de Acceso

- Odontólogo
- Auxiliar / Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-pacientes-historia-clinica/`

Esta funcionalidad reside dentro de la feature 'gestion-pacientes-historia-clinica'. La lógica de la página se encuentra en '/pages/TratamientosRealizadosPage.tsx', que se renderiza dentro de una ruta anidada del perfil del paciente. Los componentes reutilizables como la tabla de tratamientos, los filtros y el modal de detalles se ubican en '/components/'. La comunicación con el backend para obtener y gestionar los datos de los tratamientos se centraliza en un archivo dentro de '/apis/', como 'tratamientosApi.ts', que exporta funciones asíncronas para las llamadas a la API.

### Archivos Frontend

- `/features/gestion-pacientes-historia-clinica/pages/TratamientosRealizadosPage.tsx`
- `/features/gestion-pacientes-historia-clinica/components/TablaTratamientosRealizados.tsx`
- `/features/gestion-pacientes-historia-clinica/components/FiltrosHistorialTratamientos.tsx`
- `/features/gestion-pacientes-historia-clinica/components/ModalDetalleTratamiento.tsx`
- `/features/gestion-pacientes-historia-clinica/apis/tratamientosApi.ts`

### Componentes React

- TratamientosRealizadosPage
- TablaTratamientosRealizados
- FiltrosHistorialTratamientos
- ModalDetalleTratamiento
- TimelineItemTratamiento

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en obtener y gestionar el historial de tratamientos de un paciente específico. Se necesita un endpoint principal para listar todos los tratamientos con capacidad de filtrado y paginación, y endpoints adicionales para ver, actualizar o (en casos excepcionales) eliminar un registro de tratamiento.

### `GET` `/api/pacientes/:pacienteId/tratamientos-realizados`

Obtiene una lista paginada y filtrada de todos los tratamientos realizados para un paciente específico.

**Parámetros:** pacienteId (en la URL), page (query, opcional), limit (query, opcional), fechaInicio (query, opcional), fechaFin (query, opcional), odontologoId (query, opcional)

**Respuesta:** Un objeto JSON con la lista de tratamientos y metadatos de paginación.

### `GET` `/api/tratamientos-realizados/:tratamientoId`

Obtiene los detalles completos de un único tratamiento realizado, incluyendo notas clínicas y documentos adjuntos.

**Parámetros:** tratamientoId (en la URL)

**Respuesta:** Un objeto JSON con los datos completos del tratamiento realizado.

### `PUT` `/api/tratamientos-realizados/:tratamientoId`

Actualiza la información de un tratamiento realizado, principalmente para añadir o modificar notas clínicas posteriores al procedimiento.

**Parámetros:** tratamientoId (en la URL), Body: { notasClinicas: string, ...otros campos editables }

**Respuesta:** El objeto JSON del tratamiento actualizado.

### `POST` `/api/pacientes/:pacienteId/tratamientos-realizados`

Crea un nuevo registro de tratamiento realizado. Este endpoint se suele invocar automáticamente cuando un tratamiento se marca como completado en el 'Plan de Tratamiento'.

**Parámetros:** pacienteId (en la URL), Body: { tratamientoBaseId, odontologoId, fechaRealizacion, piezaDental, costo, notasClinicas }

**Respuesta:** El objeto JSON del nuevo tratamiento realizado creado.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con un modelo 'TratamientoRealizado' que almacena cada intervención. Un 'TratamientoRealizadoController' gestiona la lógica de negocio, y las rutas se exponen a través de Express, anidando las operaciones específicas de un paciente bajo la ruta '/api/pacientes/:pacienteId/'.

### Models

#### TratamientoRealizado

paciente: ObjectId (ref: 'Paciente'), tratamientoBase: ObjectId (ref: 'Tratamiento'), odontologo: ObjectId (ref: 'Usuario'), fechaRealizacion: Date, piezaDental: String, superficie: String, notasClinicas: String, costo: Number, estadoPago: String ('Pendiente', 'Pagado Parcial', 'Pagado'), cobrosAsociados: [ObjectId (ref: 'Cobro')], createdBy: ObjectId (ref: 'Usuario'), createdAt: Date, updatedAt: Date

#### Paciente

Campos de información personal del paciente. Relacionado via ObjectId.

#### Tratamiento

Modelo del catálogo de tratamientos, con nombre, código y precio por defecto. Relacionado via ObjectId.

### Controllers

#### TratamientoRealizadoController

- obtenerTratamientosPorPaciente
- obtenerTratamientoPorId
- crearTratamientoRealizado
- actualizarTratamientoRealizado

### Routes

#### `/api/pacientes`

- GET /:pacienteId/tratamientos-realizados
- POST /:pacienteId/tratamientos-realizados

#### `/api/tratamientos-realizados`

- GET /:tratamientoId
- PUT /:tratamientoId

## 🔄 Flujos

1. El odontólogo o auxiliar accede a la ficha de un paciente y navega a la pestaña 'Historia Clínica' -> 'Tratamientos Realizados'.
2. El frontend realiza una llamada a `GET /api/pacientes/:pacienteId/tratamientos-realizados` para cargar el historial inicial.
3. La lista de tratamientos se muestra en una tabla o timeline, ordenada por fecha de forma descendente.
4. El usuario utiliza los controles de filtro (rango de fechas, profesional) para acotar la búsqueda. Cada cambio en los filtros dispara una nueva llamada a la API con los parámetros correspondientes.
5. Al hacer clic en un tratamiento, se abre un modal que obtiene los detalles completos con `GET /api/tratamientos-realizados/:tratamientoId`.
6. Dentro del modal, el odontólogo puede añadir o editar notas clínicas. Al guardar, se envía una petición `PUT /api/tratamientos-realizados/:tratamientoId`.

## 📝 User Stories

- Como odontólogo, quiero ver un listado cronológico de todos los tratamientos realizados a un paciente para comprender rápidamente su historial clínico y tomar decisiones informadas.
- Como odontólogo, quiero poder filtrar el historial de tratamientos por fecha y por el profesional que lo realizó para encontrar rápidamente una intervención específica.
- Como odontólogo, quiero poder hacer clic en un tratamiento realizado para ver todos sus detalles, incluyendo las notas clínicas originales y añadir nuevas notas de seguimiento.
- Como auxiliar, quiero consultar los tratamientos realizados recientemente a un paciente para preparar el instrumental y los materiales adecuados para su próxima cita de revisión.
- Como asistente administrativo, quiero ver la lista de tratamientos realizados de un paciente y su estado de pago asociado para gestionar la facturación y responder a las consultas del paciente sobre su cuenta.

## ⚙️ Notas Técnicas

- Seguridad: Implementar una política de autorización estricta para asegurar que un usuario solo pueda acceder a los registros de pacientes de su clínica asignada. Validar en el backend que el `pacienteId` pertenece a la organización del usuario autenticado.
- Rendimiento: Es crucial implementar paginación en el backend y en la tabla del frontend para manejar pacientes con historiales muy largos de forma eficiente. Usar índices en la base de datos MongoDB sobre los campos `paciente` y `fechaRealizacion` en el modelo `TratamientoRealizado`.
- Integración: La creación de un `TratamientoRealizado` debe ser un proceso atómico, preferiblemente utilizando transacciones de MongoDB. Cuando un tratamiento se marca como 'completado' en el Plan de Tratamiento, se debe crear el registro en `TratamientoRealizado` y actualizar el estado en el plan original en una única operación.
- Auditoría: El modelo `TratamientoRealizado` debe incluir campos como `createdBy`, `createdAt` y `updatedAt` para mantener un registro de auditoría completo de quién y cuándo se creó o modificó un registro clínico.
- Interfaz de Usuario: Considerar una vista alternativa de 'Timeline' (línea de tiempo) además de la tabla, ya que puede ser más intuitiva para visualizar la progresión de los tratamientos a lo largo del tiempo.

