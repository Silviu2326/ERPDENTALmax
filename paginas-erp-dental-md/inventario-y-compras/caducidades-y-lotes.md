# Caducidades y Lotes

**Categoría:** Gestión de Recursos | **Módulo:** Inventario y Compras

La funcionalidad de 'Caducidades y Lotes' es un componente crítico dentro del módulo de 'Inventario y Compras', diseñado para garantizar la seguridad del paciente, el cumplimiento normativo y la optimización de los recursos de la clínica dental. Su propósito principal es registrar y monitorizar de forma exhaustiva cada lote de material consumible que ingresa al inventario, asociándolo con su número de lote específico y su fecha de caducidad. Esto abarca desde anestésicos y composites hasta implantes, suturas y material de esterilización. Al recibir un pedido, el personal encargado registra cada producto no solo aumentando el stock general, sino detallando los lotes recibidos. El sistema utiliza esta información para generar alertas automáticas y proactivas sobre productos que están próximos a caducar, permitiendo a la clínica implementar estrategias de gestión de inventario como FEFO (First-Expired, First-Out). Esto minimiza el desperdicio de materiales costosos y, fundamentalmente, previene el uso de productos caducados en tratamientos, protegiendo la salud de los pacientes. Además, esta funcionalidad es vital para la trazabilidad; en caso de una alerta sanitaria o retirada de un producto por parte del fabricante, la clínica puede identificar instantáneamente qué lotes se han utilizado y en qué pacientes, facilitando una respuesta rápida y eficaz.

## 👥 Roles de Acceso

- Compras / Inventario
- Auxiliar / Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/inventario-y-compras/`

Esta funcionalidad reside dentro de la feature 'inventario-y-compras'. La lógica de la interfaz de usuario se encuentra en '/pages/CaducidadesLotesPage.tsx', que utiliza componentes reutilizables de '/components/' como la tabla de lotes y los filtros. Las interacciones con el backend se gestionan a través de funciones definidas en '/apis/lotesApi.ts', que encapsulan las llamadas a los endpoints del servidor.

### Archivos Frontend

- `/features/inventario-y-compras/pages/CaducidadesLotesPage.tsx`
- `/features/inventario-y-compras/components/TablaLotesCaducidad.tsx`
- `/features/inventario-y-compras/components/FiltrosCaducidad.tsx`
- `/features/inventario-y-compras/components/ModalRegistroLote.tsx`
- `/features/inventario-y-compras/components/AlertaCaducidadBadge.tsx`
- `/features/inventario-y-compras/apis/lotesApi.ts`

### Componentes React

- TablaLotesCaducidad
- FiltrosCaducidad
- ModalRegistroLote
- ModalDetalleLote
- AlertaCaducidadBadge

## 🔌 APIs Backend

Las APIs para esta funcionalidad permiten la gestión completa (CRUD) de los lotes de productos. Facilitan la consulta con filtros avanzados para el monitoreo de caducidades y proveen un endpoint específico para alertas que puede ser consumido por el dashboard principal o un sistema de notificaciones.

### `GET` `/api/inventario/lotes`

Obtiene una lista paginada y filtrada de todos los lotes de productos. Ideal para alimentar la tabla principal.

**Parámetros:** page (number): Número de página, limit (number): Resultados por página, productoId (string): Filtrar por ID de producto, fechaCaducidadAntes (date): Filtrar lotes que caducan antes de esta fecha, fechaCaducidadDespues (date): Filtrar lotes que caducan después de esta fecha, estado (string): Filtrar por estado ('Activo', 'PorCaducar', 'Caducado')

**Respuesta:** Un objeto con la lista de lotes y metadatos de paginación.

### `POST` `/api/inventario/lotes`

Crea un nuevo lote para un producto existente. Se utiliza al recibir mercancía de una orden de compra.

**Parámetros:** Body (JSON): { producto: ObjectId, numeroLote: string, fechaCaducidad: date, cantidadInicial: number }

**Respuesta:** El objeto del nuevo lote creado.

### `GET` `/api/inventario/lotes/alertas`

Obtiene un resumen de los lotes que requieren atención inmediata (caducados o por caducar en los próximos X días).

**Parámetros:** diasAnticipacion (number): Número de días para considerar un lote como 'PorCaducar'. Default: 30

**Respuesta:** Un objeto con dos arrays: 'caducados' y 'porCaducar'.

### `PUT` `/api/inventario/lotes/:id/consumir`

Registra el consumo de una cantidad de un lote específico, actualizando su cantidad actual. Se invoca al usar el material en un tratamiento.

**Parámetros:** id (ObjectId) en la URL, Body (JSON): { cantidadConsumida: number, tratamientoId?: ObjectId }

**Respuesta:** El objeto del lote actualizado.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con un modelo 'LoteProducto' que se relaciona con el modelo 'Producto' existente. Un 'LoteController' contiene toda la lógica de negocio para manipular estos lotes, expuesta a través de rutas específicas definidas en Express.

### Models

#### LoteProducto

producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true }, numeroLote: { type: String, required: true }, fechaCaducidad: { type: Date, required: true }, fechaRecepcion: { type: Date, default: Date.now }, cantidadInicial: { type: Number, required: true }, cantidadActual: { type: Number, required: true }, estado: { type: String, enum: ['Activo', 'PorCaducar', 'Caducado'], default: 'Activo' }, historialConsumo: [{ tratamientoId: ObjectId, cantidad: Number, fecha: Date }]

#### Producto

nombre: String, sku: String, proveedor: ObjectId, stockTotal: Number (este campo se actualizaría con la suma de las cantidades actuales de todos sus lotes activos)

### Controllers

#### LoteController

- listarLotes
- crearLote
- obtenerLotePorId
- registrarConsumoLote
- obtenerAlertasCaducidad
- actualizarEstadosLotes (función interna para cron job)

### Routes

#### `/api/inventario/lotes`

- GET /
- POST /
- GET /alertas
- PUT /:id/consumir

## 🔄 Flujos

1. Registro de Lote: Al confirmar la recepción de una orden de compra, el usuario de Inventario selecciona un producto y el sistema le presenta un modal ('ModalRegistroLote') para introducir el número de lote, fecha de caducidad y cantidad de cada lote recibido.
2. Monitoreo de Caducidades: El usuario de Inventario accede a la página 'Caducidades y Lotes', donde ve una tabla ('TablaLotesCaducidad') con todos los lotes. Utiliza los filtros ('FiltrosCaducidad') para buscar productos que caducan en el próximo mes y planificar su uso.
3. Alerta Automática: El sistema ejecuta una tarea programada diariamente que verifica las fechas de caducidad. Si un lote entra en el umbral de 'PorCaducar' (ej. 30 días), su estado cambia y se genera una notificación en el dashboard principal.
4. Trazabilidad en Tratamiento: Durante un procedimiento, un Auxiliar registra los materiales usados. Al seleccionar un producto (ej. 'Composite Resina A2'), el sistema le muestra los lotes disponibles con su fecha de caducidad, recomendando el más próximo a vencer. El auxiliar selecciona el lote usado y la cantidad, y el sistema actualiza la 'cantidadActual' del lote y lo asocia al registro del tratamiento del paciente.

## 📝 User Stories

- Como responsable de Compras/Inventario, quiero registrar el número de lote y la fecha de caducidad de cada producto que ingresa a la clínica para mantener un control estricto del inventario y cumplir con las normativas sanitarias.
- Como responsable de Compras/Inventario, quiero visualizar una lista de todos los productos que caducarán en los próximos 30 días para poder priorizar su uso y evitar pérdidas económicas.
- Como Auxiliar de clínica, quiero que al registrar el uso de un material, el sistema me sugiera el lote más próximo a caducar para asegurar una rotación eficiente del stock (FEFO).
- Como responsable de Compras/Inventario, quiero recibir notificaciones automáticas de los productos ya caducados para retirarlos del almacén inmediatamente y prevenir cualquier riesgo para los pacientes.
- Como gerente de la clínica, en caso de una alerta de retirada de un lote por parte de un fabricante, quiero poder buscar ese lote en el sistema y obtener una lista de todos los pacientes en los que se utilizó para contactarlos de manera proactiva.

## ⚙️ Notas Técnicas

- Notificaciones Proactivas: Implementar un cron job en el backend (ej. con 'node-cron') que se ejecute diariamente para invocar una función 'actualizarEstadosLotes' en el 'LoteController'. Esta función actualizará el campo 'estado' de los lotes a 'PorCaducar' o 'Caducado' según corresponda y podrá generar notificaciones.
- Rendimiento de Base de Datos: Crear índices en la colección 'LoteProducto' de MongoDB sobre los campos 'fechaCaducidad', 'producto' y 'estado' para optimizar las consultas de filtrado y ordenamiento, especialmente en clínicas con un gran volumen de inventario.
- Integración con Tratamientos: La funcionalidad de 'consumir' un lote debe estar profundamente integrada con el módulo de 'Historia Clínica' o 'Tratamientos'. Al registrar un tratamiento, se debe poder asociar uno o varios LoteProducto, lo que decrementará el stock y creará un registro de trazabilidad inmutable.
- Consistencia de Datos: Utilizar transacciones de MongoDB al registrar un nuevo lote para asegurar que tanto la creación del documento 'LoteProducto' como la actualización del 'stockTotal' en el documento 'Producto' se realicen de forma atómica.
- Seguridad y Auditoría: El acceso para crear o modificar lotes debe estar restringido a roles específicos. Se recomienda implementar un log de auditoría que registre quién, cuándo y qué cambios se realizaron sobre los lotes para una trazabilidad completa.

