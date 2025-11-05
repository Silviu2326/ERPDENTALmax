# Control de Stock

**Categoría:** Gestión de Recursos | **Módulo:** Inventario y Compras

La funcionalidad 'Control de Stock' es un componente esencial dentro del módulo 'Inventario y Compras' del ERP dental. Su propósito principal es proporcionar una visión centralizada, precisa y en tiempo real de todos los materiales, consumibles e insumos utilizados en la clínica dental. Desde guantes y mascarillas hasta composites, implantes y fresas, este sistema permite un seguimiento exhaustivo de cada artículo. Sirve para optimizar la gestión de recursos, evitar situaciones críticas como la falta de material indispensable durante un procedimiento (stockouts), y prevenir el exceso de inventario que inmoviliza capital y puede llevar a la caducidad de productos (overstocking). El funcionamiento se basa en un catálogo de productos donde cada ítem tiene atributos clave como cantidad actual, punto de reorden, proveedor, costo y fecha de caducidad. El sistema permite registrar entradas de material (recepción de compras), salidas (uso en tratamientos, que idealmente se descuentan automáticamente) y ajustes manuales (por conteo físico, mermas o roturas). Dentro de su módulo padre, 'Inventario y Compras', esta funcionalidad es el corazón operativo, ya que los datos que genera (principalmente los niveles de stock y los puntos de reorden) son el principal disparador para iniciar el proceso de compra, generando alertas y sugerencias para la creación de nuevas órdenes de pedido.

## 👥 Roles de Acceso

- Compras / Inventario
- Director / Admin general (multisede)
- Auxiliar / Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/inventario-y-compras/`

Toda la lógica de frontend para el módulo 'Inventario y Compras' reside en la carpeta /features/inventario-y-compras/. Dentro, la subcarpeta /pages/ contiene el componente principal de esta funcionalidad, ControlStockPage.tsx. Los componentes reutilizables específicos, como la tabla de inventario, los filtros y los modales para ajustes o nuevos productos, se ubican en /components/. Las llamadas a la API del backend se abstraen en funciones dentro de la carpeta /apis/, por ejemplo en un archivo stock.api.ts, para mantener el código limpio y organizado.

### Archivos Frontend

- `/features/inventario-y-compras/pages/ControlStockPage.tsx`
- `/features/inventario-y-compras/pages/DetalleProductoStockPage.tsx`

### Componentes React

- TablaStockPrincipal
- FiltrosStock
- ModalAjusteStock
- ModalNuevoProducto
- CardResumenStock
- HistorialMovimientosProducto

## 🔌 APIs Backend

Las APIs para el Control de Stock gestionan todas las operaciones CRUD sobre los productos del inventario y registran cada movimiento. Permiten consultar el listado de productos con filtros, obtener el detalle y el historial de un ítem específico, crear nuevos productos, actualizar sus propiedades y, fundamentalmente, realizar ajustes de stock de forma controlada y auditable.

### `GET` `/api/inventario/stock`

Obtiene la lista de todos los productos en el inventario. Soporta paginación y filtros por nombre, categoría, proveedor, sede y nivel de stock (ej. bajo_stock=true).

**Parámetros:** page (number), limit (number), search (string), categoria (string), proveedorId (string), sedeId (string), bajo_stock (boolean)

**Respuesta:** Un objeto con un array de productos y metadatos de paginación.

### `POST` `/api/inventario/stock`

Crea un nuevo producto en el inventario.

**Parámetros:** Body: { nombre, sku, categoria, proveedor, cantidadInicial, puntoReorden, costoUnitario, sedeId, ... }

**Respuesta:** El objeto del nuevo producto creado.

### `GET` `/api/inventario/stock/{id}`

Obtiene los detalles completos de un producto específico del inventario por su ID.

**Parámetros:** id (string) - ID del producto

**Respuesta:** El objeto completo del producto.

### `PUT` `/api/inventario/stock/{id}`

Actualiza la información de un producto existente (nombre, proveedor, punto de reorden, etc.). No modifica la cantidad.

**Parámetros:** id (string) - ID del producto, Body: { ...campos a actualizar... }

**Respuesta:** El objeto del producto actualizado.

### `POST` `/api/inventario/stock/ajuste`

Realiza un ajuste manual en la cantidad de un producto. Registra un movimiento de inventario.

**Parámetros:** Body: { productoId, nuevaCantidad, motivo, usuarioId }

**Respuesta:** Un objeto de confirmación con el nuevo stock y el movimiento registrado.

### `GET` `/api/inventario/stock/{id}/movimientos`

Obtiene el historial de todos los movimientos (compras, usos, ajustes) para un producto específico.

**Parámetros:** id (string) - ID del producto

**Respuesta:** Un array con todos los registros de MovimientoInventario para ese producto.

## 🗂️ Estructura Backend (MERN)

El backend utiliza Mongoose para definir dos modelos principales: 'ProductoInventario' para los datos maestros de cada ítem y 'MovimientoInventario' para la auditoría de cambios. Un 'StockController' contiene la lógica de negocio para gestionar estas entidades, y las rutas se exponen a través de un router de Express en '/api/inventario'.

### Models

#### ProductoInventario

nombre (string), sku (string, unique), descripcion (string), categoria (string), proveedor (ObjectId, ref: 'Proveedor'), unidadMedida (string), cantidadActual (number), puntoReorden (number), costoUnitario (number), fechaCaducidad (Date), ubicacion (string), sede (ObjectId, ref: 'Sede'), activo (boolean, default: true)

#### MovimientoInventario

producto (ObjectId, ref: 'ProductoInventario'), tipoMovimiento (enum: ['compra', 'uso_clinico', 'ajuste_manual_entrada', 'ajuste_manual_salida', 'devolucion']), cantidad (number), stock_anterior (number), stock_nuevo (number), usuario (ObjectId, ref: 'Usuario'), fecha (Date), motivo (string), referencia (string, ej: ordenCompraId o tratamientoId)

### Controllers

#### StockController

- obtenerStockCompleto
- crearProducto
- obtenerDetalleProducto
- actualizarProducto
- realizarAjusteStock
- obtenerHistorialMovimientos

### Routes

#### `/api/inventario`

- GET /stock
- POST /stock
- GET /stock/:id
- PUT /stock/:id
- POST /stock/ajuste
- GET /stock/:id/movimientos

## 🔄 Flujos

1. El usuario accede a la página 'Control de Stock' y ve una tabla paginada con todos los productos de su sede.
2. Utiliza la barra de búsqueda y los filtros para encontrar rápidamente un material específico, como 'Composite A2'.
3. El sistema resalta en rojo los productos cuya cantidad actual es igual o inferior al punto de reorden.
4. El auxiliar realiza un conteo físico y detecta una discrepancia. Selecciona el producto, hace clic en 'Ajustar Stock', introduce la cantidad correcta y un motivo ('Merma por producto dañado'), y guarda. El sistema actualiza la cantidad y crea un registro en MovimientoInventario.
5. Al recibir un pedido, el encargado de compras busca los productos, registra la entrada (a través de la confirmación de una orden de compra) y el stock se actualiza automáticamente, creando movimientos de tipo 'compra'.

## 📝 User Stories

- Como encargado de Compras, quiero ver una lista de todos los productos que están por debajo del punto de reorden para poder generar órdenes de compra de manera eficiente.
- Como Auxiliar de clínica, quiero poder añadir un nuevo producto al inventario cuando adquirimos un material que no habíamos usado antes.
- Como Director de clínica, quiero ver el valor totalizado del inventario de mi sede para controlar los costos y el capital inmovilizado.
- Como Asistente, quiero buscar un producto por su nombre o SKU para confirmar rápidamente si tenemos stock disponible antes de un tratamiento.
- Como encargado de Inventario, quiero ver el historial de movimientos de un producto para investigar discrepancias o entender su patrón de consumo.

## ⚙️ Notas Técnicas

- La deducción de stock por uso clínico debe ser una transacción atómica para garantizar la consistencia de los datos, especialmente si se descuentan varios productos en un solo tratamiento.
- Implementar un sistema de alertas (notificaciones en la app y/o por email) para avisar proactivamente sobre stock bajo y productos próximos a caducar.
- Para un rendimiento óptimo con miles de productos, todas las consultas a la base de datos deben estar indexadas (por ej. en sku, nombre, sede) y la carga de datos en el frontend debe usar paginación y carga diferida (lazy loading).
- La seguridad es crítica. Se deben aplicar validaciones en el backend para asegurar que un usuario solo pueda ver y gestionar el inventario de las sedes a las que tiene permiso.
- Considerar el uso de WebSockets para actualizar en tiempo real la vista de stock para todos los usuarios conectados si un producto sufre un cambio crítico (ej. se agota).

