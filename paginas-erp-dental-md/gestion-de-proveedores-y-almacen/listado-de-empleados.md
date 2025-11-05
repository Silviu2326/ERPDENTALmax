# Listado de Empleados

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La página 'Listado de Empleados' es el centro neurálgico para la administración del personal de la clínica dental dentro del ERP. Esta funcionalidad proporciona una vista centralizada y organizada de todos los empleados, permitiendo a los roles autorizados realizar operaciones de alta, baja, modificación y consulta de información de manera eficiente. Sirve como el registro maestro del capital humano, conteniendo detalles cruciales como información de contacto, roles, sedes asignadas, especialidades (para personal clínico), y estado laboral (activo/inactivo). Dentro del módulo padre 'Gestión de Proveedores y Almacén', esta página se enmarca en la categoría superior de 'Gestión de Recursos'. Aunque tradicionalmente el personal se gestiona en un módulo de RR.HH. separado, su inclusión aquí responde a una visión holística que considera a los empleados como el recurso interno más valioso, gestionado en paralelo a los recursos externos (proveedores) y materiales (almacén). Esta integración permite una administración unificada de todos los activos de la clínica, facilitando la planificación y la asignación de recursos de manera global. Por ejemplo, al planificar la apertura de un nuevo gabinete, el administrador puede consultar desde este mismo entorno la disponibilidad de personal cualificado, el stock de material necesario y los proveedores asociados, optimizando la toma de decisiones estratégicas.

## 👥 Roles de Acceso

- RR. HH.
- Director / Admin general (multisede)
- Propietario / Gerente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

La funcionalidad se encapsula dentro de la carpeta del módulo padre '/features/gestion-proveedores-almacen/'. La página principal, 'ListadoEmpleadosPage.tsx', reside en la subcarpeta '/pages/'. Esta página ensambla varios componentes reutilizables de la subcarpeta '/components/', como 'TablaEmpleados' para mostrar los datos, 'FiltrosBusquedaEmpleados' para la interacción del usuario y 'ModalGestionEmpleado' para los formularios de creación/edición. Todas las comunicaciones con el backend se gestionan a través de funciones centralizadas en el archivo '/apis/empleados.api.ts', que se encarga de realizar las llamadas HTTP a los endpoints correspondientes.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/ListadoEmpleadosPage.tsx`
- `/features/gestion-proveedores-almacen/components/TablaEmpleados.tsx`
- `/features/gestion-proveedores-almacen/components/FiltrosBusquedaEmpleados.tsx`
- `/features/gestion-proveedores-almacen/components/ModalGestionEmpleado.tsx`
- `/features/gestion-proveedores-almacen/components/ModalDetalleEmpleado.tsx`
- `/features/gestion-proveedores-almacen/apis/empleados.api.ts`

### Componentes React

- TablaEmpleados
- FiltrosBusquedaEmpleados
- ModalGestionEmpleado
- ModalDetalleEmpleado
- PaginacionEmpleados
- BotonCrearEmpleado

## 🔌 APIs Backend

Se requiere un conjunto de APIs RESTful para gestionar el ciclo de vida completo de los empleados (CRUD). Estos endpoints permitirán al frontend listar, buscar, filtrar, crear, ver detalles, actualizar y desactivar registros de empleados de forma segura y eficiente.

### `GET` `/api/empleados`

Obtiene una lista paginada y filtrada de todos los empleados. Permite buscar por texto y filtrar por rol, sede y estado.

**Parámetros:** query.page (número de página), query.limit (resultados por página), query.search (texto de búsqueda para nombre, apellido, email), query.rol (ID del rol), query.sedeId (ID de la sede), query.estado ('Activo' o 'Inactivo')

**Respuesta:** Un objeto JSON con un array de empleados y metadatos de paginación (`totalPaginas`, `paginaActual`, `totalResultados`).

### `POST` `/api/empleados`

Crea un nuevo registro de empleado en la base de datos.

**Parámetros:** body (objeto JSON con los datos del nuevo empleado: nombre, apellidos, email, rol, sede, etc.)

**Respuesta:** El objeto JSON del empleado recién creado, incluyendo su _id.

### `GET` `/api/empleados/:id`

Obtiene los detalles completos de un empleado específico por su ID.

**Parámetros:** params.id (ID del empleado)

**Respuesta:** Un objeto JSON con todos los datos del empleado solicitado.

### `PUT` `/api/empleados/:id`

Actualiza la información de un empleado existente.

**Parámetros:** params.id (ID del empleado), body (objeto JSON con los campos a actualizar)

**Respuesta:** El objeto JSON del empleado con los datos actualizados.

### `DELETE` `/api/empleados/:id`

Realiza una desactivación (soft delete) de un empleado, cambiando su estado a 'Inactivo'. No elimina el registro de la base de datos para mantener la integridad referencial.

**Parámetros:** params.id (ID del empleado)

**Respuesta:** Un mensaje de confirmación en formato JSON.

## 🗂️ Estructura Backend (MERN)

El backend sigue una arquitectura MERN estándar. El modelo 'Empleado' define el esquema de datos en MongoDB. El 'EmpleadoController' contiene la lógica de negocio para cada operación CRUD, interactuando con el modelo. Las 'rutas de empleados' exponen estos controladores a través de endpoints RESTful, gestionando las peticiones HTTP que llegan desde el frontend.

### Models

#### Empleado

Define la estructura de un empleado en MongoDB. Campos principales: `nombre` (String), `apellidos` (String), `dni` (String, unique), `email` (String, unique), `telefono` (String), `fechaContratacion` (Date), `rol` (String, enum ['Odontologo', 'Asistente', 'Recepcionista', 'RR.HH.', 'Gerente']), `sede` (ObjectId, ref: 'Sede'), `usuario` (ObjectId, ref: 'Usuario'), `estado` (String, enum ['Activo', 'Inactivo'], default: 'Activo'), `especialidad` (String, opcional), `numeroColegiado` (String, opcional para odontólogos).

### Controllers

#### EmpleadoController

- obtenerEmpleados
- crearEmpleado
- obtenerEmpleadoPorId
- actualizarEmpleado
- desactivarEmpleado

### Routes

#### `/api/empleados`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id

## 🔄 Flujos

1. El usuario de RR.HH. accede a la página y visualiza la tabla con todos los empleados activos, ordenada por fecha de contratación.
2. El gerente de una sede filtra la lista por 'Sede: Central' y 'Rol: Odontologo' para ver el equipo clínico de su ubicación.
3. Un administrador general busca por el apellido 'García' para encontrar rápidamente a un empleado y consultar su número de teléfono.
4. El usuario de RR.HH. pulsa el botón 'Añadir Empleado', completa el formulario del modal con los datos del nuevo contratado y guarda. El nuevo empleado aparece instantáneamente en la tabla.
5. Al finalizar la relación laboral, un usuario autorizado busca al empleado, abre el menú de acciones y selecciona 'Desactivar'. El sistema pide confirmación y, al aceptarla, el empleado cambia su estado y deja de aparecer en las búsquedas activas y en los selectores de profesionales para citas.

## 📝 User Stories

- Como miembro de RR.HH., quiero ver una lista completa y filtrable de todos los empleados para gestionar altas, bajas y modificaciones de datos de forma centralizada.
- Como Gerente de clínica, quiero buscar rápidamente los datos de contacto de un empleado (teléfono, email) para poder comunicarme con él eficientemente.
- Como Director General (multisede), quiero filtrar la lista de empleados por sede para entender la composición del personal de cada clínica.
- Como miembro de RR.HH., quiero poder añadir un nuevo empleado al sistema, asignándole un rol, sede y credenciales de acceso para que pueda empezar a trabajar.
- Como Propietario, quiero poder desactivar el perfil de un empleado que ha dejado la clínica para revocar su acceso y que no aparezca en listados activos como la agenda de citas.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un middleware de autorización (RBAC) en las rutas del backend para asegurar que solo los roles permitidos puedan ejecutar acciones de creación, edición o desactivación. Todos los datos sensibles deben ser validados y sanitizados en el backend.
- Rendimiento: La consulta `GET /api/empleados` debe usar paginación del lado del servidor para manejar un gran número de empleados. Es crucial crear índices en la colección 'Empleado' de MongoDB para los campos de búsqueda y filtro más comunes (`nombre`, `apellidos`, `email`, `rol`, `sede`, `estado`).
- Integración de Datos: El `_id` del modelo 'Empleado' será una clave foránea fundamental en otros módulos. En 'Agenda', se usará para asignar citas a un profesional. En 'Finanzas', para vincular con nóminas. En 'Auditoría', para registrar qué empleado realizó cada acción en el sistema.
- Soft Delete: La operación de 'borrado' debe ser un soft delete (cambiar el campo `estado` a 'Inactivo') para preservar la integridad histórica de los datos, como los tratamientos realizados por ese empleado en el pasado.

