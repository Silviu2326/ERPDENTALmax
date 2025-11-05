# Listado de Presupuestos

**Categoría:** Gestión Clínica | **Módulo:** Presupuestos y Planes de Tratamiento

La página 'Listado de Presupuestos' es el centro neurálgico para la gestión de todas las propuestas económicas y planes de tratamiento generados en la clínica dental. Funciona como un panel de control integral donde el personal autorizado puede visualizar, rastrear y gestionar el ciclo de vida completo de cada presupuesto. Su propósito principal es ofrecer una visión clara y organizada de la actividad comercial, permitiendo un seguimiento proactivo de las oportunidades de tratamiento. Desde esta interfaz, los usuarios pueden buscar rápidamente presupuestos por paciente o profesional, filtrar por estado (pendiente, aceptado, rechazado, completado), rango de fechas o sede, y ordenar los resultados según diversos criterios. Esta funcionalidad es vital dentro del módulo 'Presupuestos y Planes de Tratamiento', ya que conecta la planificación clínica realizada por el odontólogo con la gestión administrativa y financiera. Facilita la labor de la recepción para realizar seguimiento a los pacientes, ayuda al departamento financiero a prever ingresos y permite a la dirección analizar la tasa de aceptación de tratamientos, identificando patrones y oportunidades de mejora. En resumen, transforma los planes de tratamiento de documentos estáticos a elementos dinámicos y medibles dentro del flujo de trabajo del ERP.

## 👥 Roles de Acceso

- Odontólogo
- Recepción / Secretaría
- Contable / Finanzas
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/presupuestos-planes-tratamiento/`

La funcionalidad se encapsula dentro de la carpeta '/features/presupuestos-planes-tratamiento/'. La subcarpeta '/pages/' contiene el componente principal 'ListadoPresupuestosPage.tsx' que renderiza la página completa. La carpeta '/components/' alberga componentes reutilizables como 'TablaPresupuestos.tsx' para mostrar los datos, 'FiltrosPresupuestos.tsx' para las opciones de filtrado y 'ModalDetallePresupuesto.tsx' para ver un presupuesto en detalle. Las llamadas a la API del backend se gestionan en '/apis/presupuestosApi.ts', manteniendo la lógica de comunicación separada de la UI.

### Archivos Frontend

- `/features/presupuestos-planes-tratamiento/pages/ListadoPresupuestosPage.tsx`
- `/features/presupuestos-planes-tratamiento/components/TablaPresupuestos.tsx`
- `/features/presupuestos-planes-tratamiento/components/FiltrosPresupuestos.tsx`
- `/features/presupuestos-planes-tratamiento/components/BarraBusquedaPresupuestos.tsx`
- `/features/presupuestos-planes-tratamiento/components/MenuAccionesPresupuesto.tsx`
- `/features/presupuestos-planes-tratamiento/apis/presupuestosApi.ts`

### Componentes React

- ListadoPresupuestosPage
- TablaPresupuestos
- FiltrosPresupuestos
- BarraBusquedaPresupuestos
- ModalDetallePresupuesto
- MenuAccionesPresupuesto

## 🔌 APIs Backend

Las APIs para esta página se centran en obtener y manipular la lista de presupuestos. El endpoint principal debe soportar paginación, búsqueda, filtrado y ordenación para manejar grandes volúmenes de datos de manera eficiente.

### `GET` `/api/presupuestos`

Obtiene una lista paginada de presupuestos. Permite filtrar por estado, paciente, profesional, sede y rango de fechas. También soporta búsqueda por texto y ordenación.

**Parámetros:** page (number): Número de página, limit (number): Resultados por página, sortBy (string): Campo para ordenar (ej: fechaCreacion), order (string): 'asc' o 'desc', estado (string): 'Pendiente', 'Aceptado', 'Rechazado', 'Completado', pacienteId (string): ID del paciente, profesionalId (string): ID del profesional, sedeId (string): ID de la sede, fechaDesde (date): Fecha de inicio del rango, fechaHasta (date): Fecha de fin del rango, q (string): Término de búsqueda (nombre paciente, DNI, etc.)

**Respuesta:** Un objeto con la lista de presupuestos (con datos de paciente y profesional populados) y metadatos de paginación (total de páginas, total de resultados).

### `GET` `/api/presupuestos/:id`

Obtiene los detalles completos de un presupuesto específico, incluyendo la lista detallada de tratamientos.

**Parámetros:** id (string): ID del presupuesto

**Respuesta:** Un objeto con todos los datos del presupuesto.

### `PUT` `/api/presupuestos/:id/estado`

Actualiza el estado de un presupuesto (ej: de 'Pendiente' a 'Aceptado').

**Parámetros:** id (string): ID del presupuesto, Body: { estado: 'nuevo_estado' }

**Respuesta:** El objeto del presupuesto actualizado.

### `DELETE` `/api/presupuestos/:id`

Elimina un presupuesto (se recomienda un borrado lógico o soft delete).

**Parámetros:** id (string): ID del presupuesto

**Respuesta:** Mensaje de confirmación de éxito.

## 🗂️ Estructura Backend (MERN)

La estructura del backend sigue el patrón MVC. El modelo 'Presupuesto' define el esquema en MongoDB. El 'PresupuestoController' contiene la lógica para buscar, filtrar y modificar presupuestos. Las rutas en Express exponen los endpoints del controlador al frontend.

### Models

#### Presupuesto

Define la estructura de un presupuesto en MongoDB. Campos clave: paciente (ObjectId, ref: 'Paciente'), profesional (ObjectId, ref: 'Usuario'), sede (ObjectId, ref: 'Sede'), numeroPresupuesto (String, unique), estado (String, enum: ['Pendiente', 'Aceptado', 'Rechazado', 'Completado', 'Anulado']), fechaCreacion (Date), fechaValidez (Date), tratamientos (Array de objetos con {tratamientoId, descripcion, precio, descuento}), subtotal (Number), descuentoTotal (Number), total (Number), notas (String), isDeleted (Boolean, para soft delete).

#### Paciente

Referenciado en 'Presupuesto'. Campos relevantes: nombre, apellidos, dni.

#### Usuario

Referenciado en 'Presupuesto' como 'profesional'. Campos relevantes: nombre, apellidos, rol.

### Controllers

#### PresupuestoController

- listarPresupuestos(req, res): Lógica para filtrar, buscar, ordenar y paginar.
- obtenerPresupuestoPorId(req, res): Obtiene un solo presupuesto.
- actualizarEstadoPresupuesto(req, res): Modifica el campo 'estado'.
- eliminarPresupuesto(req, res): Realiza un borrado lógico (soft delete).

### Routes

#### `/api/presupuestos`

- GET /
- GET /:id
- PUT /:id/estado
- DELETE /:id

## 🔄 Flujos

1. El usuario (ej. Recepción) accede a la página 'Listado de Presupuestos' y ve por defecto los presupuestos más recientes de su sede.
2. El usuario utiliza los filtros para encontrar todos los presupuestos en estado 'Pendiente' creados en el último mes para realizar un seguimiento telefónico.
3. Un odontólogo busca por el nombre de un paciente para revisar rápidamente todos los planes de tratamiento que se le han propuesto.
4. Tras una llamada, el recepcionista cambia el estado de un presupuesto de 'Pendiente' a 'Aceptado', lo que podría desencadenar una notificación para agendar la primera cita del tratamiento.
5. El director general filtra por sede y por estado 'Aceptado' para comparar el rendimiento de ventas entre las diferentes clínicas del grupo.

## 📝 User Stories

- Como recepcionista, quiero filtrar los presupuestos por estado 'Pendiente' para poder hacer un seguimiento proactivo de los pacientes y aumentar la tasa de aceptación.
- Como odontólogo, quiero buscar rápidamente los presupuestos asociados a un paciente para tener el contexto completo de sus planes de tratamiento propuestos antes de su visita.
- Como contable, quiero ver y exportar una lista de todos los presupuestos 'Aceptados' en un rango de fechas para realizar proyecciones de ingresos y gestionar la facturación inicial.
- Como director de clínica, quiero visualizar un resumen con el número de presupuestos creados, aceptados y rechazados por mes para evaluar la efectividad comercial del equipo.
- Como administrador multisede, quiero filtrar el listado de presupuestos por cada sede para comparar su rendimiento y tomar decisiones estratégicas.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial implementar paginación del lado del servidor para evitar cargar miles de registros a la vez. Los filtros también deben procesarse en el backend.
- Seguridad: Aplicar un middleware de autorización para asegurar que los roles solo puedan ver la información permitida (ej. un odontólogo solo ve sus presupuestos o los de su sede, mientras que un director ve todo).
- Indexación de Base de Datos: Crear índices en MongoDB sobre los campos más filtrados ('estado', 'fechaCreacion', 'paciente', 'profesional', 'sede') para optimizar la velocidad de las consultas.
- UI/UX: Implementar 'debouncing' en el campo de búsqueda para evitar realizar una llamada a la API en cada pulsación de tecla. Utilizar un estado de carga ('loading skeleton') para mejorar la experiencia del usuario mientras se obtienen los datos.
- Integración: Al cambiar el estado de un presupuesto a 'Aceptado', el sistema podría integrarse con el módulo de Citas para sugerir la creación de la primera cita del plan de tratamiento, o con el módulo de Facturación para generar el primer pago.

