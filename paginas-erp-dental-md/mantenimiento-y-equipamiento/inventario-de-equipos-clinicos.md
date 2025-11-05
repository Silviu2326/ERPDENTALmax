# Inventario de Equipos Clínicos

**Categoría:** Gestión de Recursos | **Módulo:** Mantenimiento y Equipamiento

La funcionalidad 'Inventario de Equipos Clínicos' es un componente esencial dentro del módulo 'Mantenimiento y Equipamiento' del ERP dental. Su propósito principal es proporcionar un registro centralizado, detallado y actualizado de todos los activos físicos de la clínica, desde equipos de alto valor como unidades dentales, autoclaves y equipos de rayos X, hasta instrumental especializado. Esta herramienta va más allá de una simple lista; permite a la administración y al personal de compras gestionar el ciclo de vida completo de cada equipo. Se puede registrar información crítica como marca, modelo, número de serie, fecha y costo de adquisición, proveedor, y ubicación exacta (sede y gabinete específico).  Además, es fundamental para la planificación del mantenimiento preventivo, permitiendo programar y registrar cada intervención, adjuntar informes técnicos y establecer alertas para próximas revisiones o vencimientos de garantía. Para una clínica multisede, esta funcionalidad es vital, ya que ofrece una visión global y consolidada de todos los recursos, facilitando la toma de decisiones estratégicas sobre nuevas adquisiciones, transferencias de equipos entre sedes, y planificación de presupuestos de capital. Al integrarse con otros módulos, como el financiero, puede automatizar el cálculo de la depreciación de activos, proporcionando una visión contable precisa del valor del equipamiento de la clínica.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Compras / Inventario

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/mantenimiento-equipamiento/`

Esta funcionalidad se encuentra dentro de la feature 'mantenimiento-equipamiento'. La carpeta '/pages' contiene el archivo 'InventarioEquiposPage.tsx', que renderiza la vista principal con la tabla de equipos. La carpeta '/components' alberga los componentes reutilizables como 'TablaInventarioEquipos' para mostrar los datos, 'FormularioEquipo' para la creación y edición, 'FiltrosBusquedaEquipos' para la búsqueda avanzada, y 'ModalDetalleEquipo' para una vista rápida. La lógica de comunicación con el backend se encapsula en funciones dentro de la carpeta '/apis'.

### Archivos Frontend

- `/features/mantenimiento-equipamiento/pages/InventarioEquiposPage.tsx`
- `/features/mantenimiento-equipamiento/components/TablaInventarioEquipos.tsx`
- `/features/mantenimiento-equipamiento/components/FormularioEquipo.tsx`
- `/features/mantenimiento-equipamiento/components/FiltrosBusquedaEquipos.tsx`
- `/features/mantenimiento-equipamiento/components/ModalDetalleEquipo.tsx`
- `/features/mantenimiento-equipamiento/apis/equiposApi.ts`

### Componentes React

- TablaInventarioEquipos
- FormularioEquipo
- FiltrosBusquedaEquipos
- ModalDetalleEquipo
- HistorialMantenimientoEquipo

## 🔌 APIs Backend

Se requiere un conjunto de APIs RESTful para gestionar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) de los equipos clínicos, permitiendo la consulta con filtros, paginación y la gestión de su información asociada.

### `GET` `/api/equipos`

Obtiene una lista paginada de todos los equipos clínicos. Permite filtrar por estado, ubicación (sede), tipo de equipo y buscar por nombre o número de serie.

**Parámetros:** page (number), limit (number), sedeId (string), estado (string), query (string)

**Respuesta:** Un objeto con la lista de equipos y metadatos de paginación.

### `POST` `/api/equipos`

Crea un nuevo registro de equipo clínico en el inventario.

**Parámetros:** Body con el objeto del nuevo equipo (nombre, marca, modelo, numeroSerie, etc.)

**Respuesta:** El objeto del equipo recién creado.

### `GET` `/api/equipos/:id`

Obtiene los detalles completos de un equipo clínico específico por su ID.

**Parámetros:** id (string) en la URL

**Respuesta:** El objeto completo del equipo solicitado.

### `PUT` `/api/equipos/:id`

Actualiza la información de un equipo clínico existente (ej: cambiar estado, registrar un mantenimiento).

**Parámetros:** id (string) en la URL, Body con los campos a actualizar.

**Respuesta:** El objeto del equipo actualizado.

### `DELETE` `/api/equipos/:id`

Elimina un equipo clínico del inventario. Se recomienda un borrado lógico (cambiar estado a 'De baja') en lugar de uno físico.

**Parámetros:** id (string) en la URL

**Respuesta:** Un mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

La lógica del backend se organiza en tres capas. El modelo 'EquipoClinico' define la estructura de los datos en MongoDB. El 'EquipoClinicoController' contiene la lógica de negocio para cada operación. Las rutas en 'equipoRoutes' exponen los endpoints de la API y los enlazan con las funciones del controlador.

### Models

#### EquipoClinico

nombre: String, marca: String, modelo: String, numeroSerie: String (único), fechaAdquisicion: Date, costo: Number, proveedor: ObjectId (ref a 'Proveedor'), ubicacion: { sede: ObjectId (ref a 'Sede'), gabinete: String }, estado: String (enum: ['Operativo', 'En Mantenimiento', 'Fuera de Servicio', 'De Baja']), fechaUltimoMantenimiento: Date, fechaProximoMantenimiento: Date, garantiaHasta: Date, documentos: [{ nombre: String, url: String }], historialMantenimiento: [ObjectId (ref a 'RegistroMantenimiento')], notas: String

### Controllers

#### EquipoClinicoController

- getAllEquipos
- createEquipo
- getEquipoById
- updateEquipo
- deleteEquipo

### Routes

#### `/api/equipos`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id

## 🔄 Flujos

1. El usuario de 'Compras' accede a la página de Inventario, hace clic en 'Añadir Nuevo Equipo' y completa el formulario con los detalles de una nueva unidad dental, incluyendo factura y garantía escaneada.
2. El Director General filtra el inventario para ver todos los equipos de la 'Sede Central' con estado 'En Mantenimiento' para evaluar los tiempos de inactividad.
3. Un encargado de inventario localiza un equipo de esterilización, actualiza su estado a 'Operativo' tras una revisión y programa la fecha del próximo mantenimiento preventivo.
4. El Admin general busca un equipo por su número de serie para consultar rápidamente la fecha de vencimiento de su garantía antes de contactar al soporte técnico del proveedor.

## 📝 User Stories

- Como Director, quiero ver un listado completo y filtrable de todos los equipos de todas las sedes para tener una visión global de los activos de la empresa.
- Como encargado de Compras / Inventario, quiero registrar un nuevo equipo con todos sus datos (costo, proveedor, garantía, manual) para mantener un control de activos preciso desde el primer día.
- Como encargado de Compras / Inventario, quiero actualizar el estado de un equipo (ej. de 'Operativo' a 'En Mantenimiento') para que todos en el sistema conozcan su disponibilidad actual.
- Como Director, quiero generar un reporte de los equipos cuya garantía está por vencer en los próximos 6 meses para planificar la renovación de contratos de soporte o la compra de nuevos equipos.
- Como encargado de Compras / Inventario, quiero poder adjuntar documentos digitales (facturas, manuales, certificados) a cada equipo para tener toda la información centralizada y accesible.

## ⚙️ Notas Técnicas

- Seguridad: Implementar RBAC (Role-Based Access Control) para que solo los roles autorizados puedan crear, modificar o eliminar registros de equipos. Validar todos los datos de entrada en el backend para prevenir inyecciones NoSQL.
- Rendimiento: Utilizar paginación en la API GET `/api/equipos` para manejar grandes volúmenes de datos. Crear índices en la colección de MongoDB en campos de búsqueda frecuente como `numeroSerie`, `ubicacion.sede` y `estado`.
- Integraciones: El campo `historialMantenimiento` debe integrarse con un futuro sub-módulo de 'Órdenes de Mantenimiento'. El campo `costo` y `fechaAdquisicion` deben poder ser consumidos por el módulo de 'Contabilidad' para cálculos de depreciación.
- Manejo de Archivos: La subida de documentos (PDFs, imágenes) debe gestionarse a través de un servicio de almacenamiento como AWS S3 o Cloudinary, guardando solo la URL de referencia en la base de datos MongoDB para no sobrecargarla.
- Notificaciones: Desarrollar un servicio de background (ej. con cron jobs) que revise periódicamente el campo `fechaProximoMantenimiento` y `garantiaHasta` para enviar alertas automáticas al personal correspondiente.

