# Partes de Avería y Correctivos

**Categoría:** Gestión de Recursos | **Módulo:** Mantenimiento y Equipamiento

La funcionalidad 'Partes de Avería y Correctivos' es un componente esencial dentro del módulo 'Mantenimiento y Equipamiento', diseñada para la gestión integral y reactiva de incidencias en el equipamiento de la clínica dental. Su propósito principal es registrar, seguir y resolver cualquier fallo o avería que sufran los activos de la clínica, desde sillones dentales y unidades de rayos X hasta autoclaves y compresores. Este sistema permite a los administradores y al personal de compras documentar de manera precisa la naturaleza del problema, la fecha y hora de la incidencia, el equipo afectado (vinculado directamente desde el inventario central) y la prioridad de la reparación. A través de esta herramienta, se centraliza la comunicación y se agiliza el proceso de resolución, permitiendo la asignación de tareas a técnicos internos o proveedores externos, el seguimiento del estado de la reparación (Abierto, En Progreso, Resuelto, Cerrado) y el registro detallado de todas las acciones correctivas implementadas, incluyendo los costes de piezas, mano de obra y el tiempo de inactividad del equipo. Su integración en el ERP es vital para la continuidad operativa, minimizando el impacto de las averías en la atención al paciente y garantizando que el equipamiento cumple con las normativas de seguridad y funcionamiento. Además, genera un historial valioso por cada equipo, fundamental para la toma de decisiones estratégicas sobre mantenimientos preventivos, renovaciones o sustituciones, optimizando así la inversión y el presupuesto del departamento.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Compras / Inventario

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/mantenimiento-equipamiento/`

Toda la lógica de frontend para esta funcionalidad se encapsula dentro de la carpeta '/features/mantenimiento-equipamiento/'. La subcarpeta '/pages/' contendrá el archivo 'PartesAveriaPage.tsx', que renderiza la interfaz principal con el listado de partes. Los componentes reutilizables como la tabla de partes, el formulario de creación/edición, y modales específicos se ubicarán en '/components/'. Las llamadas al backend se abstraerán en funciones dentro de la carpeta '/apis/', promoviendo un código limpio y mantenible.

### Archivos Frontend

- `/features/mantenimiento-equipamiento/pages/PartesAveriaPage.tsx`
- `/features/mantenimiento-equipamiento/pages/DetalleParteAveriaPage.tsx`

### Componentes React

- TablaPartesAveria
- FormularioCrearEditarParte
- ModalAsignarTecnico
- TimelineHistorialCorrectivos
- VisorDetallesEquipoAveriado
- FiltrosBusquedaPartes

## 🔌 APIs Backend

Las APIs gestionan el ciclo de vida completo de los partes de avería, desde su creación hasta su cierre, incluyendo actualizaciones de estado, asignaciones y el registro de acciones correctivas.

### `GET` `/api/partes-averia`

Obtiene un listado paginado de todos los partes de avería. Permite filtrar por clínica, estado, prioridad y rango de fechas.

**Parámetros:** page (number), limit (number), clinicaId (string), estado (string), prioridad (string), fechaInicio (string), fechaFin (string)

**Respuesta:** Un objeto con un array de partes de avería y metadatos de paginación.

### `POST` `/api/partes-averia`

Crea un nuevo parte de avería.

**Parámetros:** Body (JSON con datos del parte: equipoId, clinicaId, descripcionProblema, reportadoPor, prioridad)

**Respuesta:** El objeto del parte de avería recién creado.

### `GET` `/api/partes-averia/{id}`

Obtiene los detalles completos de un parte de avería específico, incluyendo su historial de correctivos.

**Parámetros:** id (string, ObjectId del parte)

**Respuesta:** El objeto completo del parte de avería.

### `PUT` `/api/partes-averia/{id}`

Actualiza la información de un parte de avería existente (ej: cambiar estado, prioridad, añadir notas).

**Parámetros:** id (string, ObjectId del parte), Body (JSON con los campos a actualizar)

**Respuesta:** El objeto del parte de avería actualizado.

### `POST` `/api/partes-averia/{id}/correctivos`

Añade un nuevo registro de acción correctiva al historial de un parte de avería.

**Parámetros:** id (string, ObjectId del parte), Body (JSON con datos del correctivo: descripcionAccion, costeMateriales, horasTrabajo, realizadoPor)

**Respuesta:** El objeto del parte de avería actualizado con el nuevo correctivo.

### `DELETE` `/api/partes-averia/{id}`

Realiza un borrado lógico (soft delete) de un parte de avería.

**Parámetros:** id (string, ObjectId del parte)

**Respuesta:** Mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

El backend utiliza el modelo 'ParteAveria' en MongoDB para persistir los datos. El 'ParteAveriaController' contiene la lógica para manejar las operaciones CRUD y la lógica de negocio asociada, mientras que las rutas en Express exponen estos servicios de forma segura y RESTful.

### Models

#### ParteAveria

equipoId: { type: Schema.Types.ObjectId, ref: 'Equipo' }, clinicaId: { type: Schema.Types.ObjectId, ref: 'Clinica' }, descripcionProblema: String, fechaAveria: Date, reportadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }, estado: { type: String, enum: ['Abierto', 'En Progreso', 'Resuelto', 'Cerrado'] }, prioridad: { type: String, enum: ['Baja', 'Media', 'Alta', 'Crítica'] }, tecnicoAsignado: String, costeTotal: Number, fechaResolucion: Date, historialCorrectivos: [{ fecha: Date, descripcionAccion: String, realizadoPor: String, costeMateriales: Number, horasTrabajo: Number }], notas: String, isDeleted: { type: Boolean, default: false }

### Controllers

#### ParteAveriaController

- crearParteAveria
- obtenerPartesAveria
- obtenerParteAveriaPorId
- actualizarParteAveria
- eliminarParteAveria
- agregarAccionCorrectiva

### Routes

#### `/api/partes-averia`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id
- POST /:id/correctivos

## 🔄 Flujos

1. El responsable de inventario detecta una avería, accede a la sección 'Partes de Avería' y pulsa 'Nuevo Parte'.
2. Rellena el formulario, seleccionando el equipo afectado desde una lista integrada con el módulo de inventario, describe el problema y establece una prioridad.
3. El sistema crea el parte con estado 'Abierto' y notifica al Director General.
4. El Director revisa el parte, lo asigna a un técnico (interno o externo) y cambia el estado a 'En Progreso'.
5. El técnico realiza la reparación. El responsable de inventario registra las acciones como 'Correctivos' en el parte, detallando costes y trabajo realizado.
6. Una vez solucionado, el estado se cambia a 'Resuelto'.
7. El Director verifica la reparación, aprueba los costes finales y cierra el parte, cambiando el estado a 'Cerrado'. El parte queda archivado en el historial del equipo.

## 📝 User Stories

- Como Director General, quiero visualizar un dashboard con todos los partes de avería abiertos y en progreso, filtrados por clínica y prioridad, para tener un control total sobre la operatividad del equipamiento.
- Como responsable de Compras / Inventario, quiero crear un parte de avería asociándolo a un equipo específico del inventario para que toda la información quede centralizada y trazable.
- Como Director General, quiero poder asignar un parte a un proveedor de servicio técnico externo y registrar sus presupuestos y facturas para un control financiero preciso.
- Como responsable de Compras / Inventario, quiero registrar cada acción correctiva realizada sobre un equipo averiado, incluyendo el coste de las piezas y el tiempo invertido, para calcular el coste total de la reparación.
- Como Director General, quiero generar informes anuales sobre los costes de mantenimiento por equipo para identificar aquellos que son menos fiables y planificar su sustitución.

## ⚙️ Notas Técnicas

- Integración clave: La selección de equipo al crear un parte debe ser un buscador/selector que se conecta en tiempo real con el módulo de Inventario para vincular el `equipoId` correctamente.
- Notificaciones: Implementar un sistema de notificaciones en tiempo real (ej. WebSockets con Socket.io) para alertar a los roles implicados sobre cambios de estado o nuevas asignaciones.
- Historial inmutable: Considerar una colección separada o un campo dentro del modelo para registrar un log de auditoría de todos los cambios realizados en un parte (quién, qué, cuándo).
- Carga de archivos: Permitir la subida de archivos adjuntos (fotos del daño, facturas del proveedor, informes técnicos) a cada parte de avería. Esto requiere un servicio de almacenamiento de objetos como AWS S3 o Google Cloud Storage.
- Búsqueda avanzada: La API de listado debe soportar búsqueda de texto completo en el campo `descripcionProblema` y en las notas para facilitar la localización de incidencias pasadas.
- Soft Delete: La eliminación de partes debe ser lógica (`isDeleted: true`) para no perder datos históricos que son valiosos para análisis a largo plazo.

