# Recepción de Mercancías

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad de 'Recepción de Mercancías' es un componente crítico dentro del módulo de 'Gestión de Proveedores y Almacén' del ERP dental. Su propósito principal es formalizar y registrar la entrada física de productos y materiales pedidos a los proveedores. Este proceso actúa como el puente esencial entre la creación de una orden de compra y la actualización real del inventario de la clínica. Cuando un proveedor entrega un pedido (ya sean consumibles como guantes y mascarillas, o materiales de alto valor como implantes y resinas), el personal autorizado utiliza esta interfaz para verificar la entrega. El funcionamiento es sencillo pero riguroso: el usuario busca y selecciona la orden de compra correspondiente. El sistema muestra entonces todos los artículos solicitados, permitiendo al usuario introducir la cantidad exacta recibida para cada uno, junto con datos vitales como el número de lote y la fecha de caducidad. Esta información es fundamental para la trazabilidad de los materiales, un requisito indispensable en el sector sanitario. Al confirmar la recepción, el sistema realiza varias acciones automáticas: actualiza el nivel de stock de cada producto en el almacén, modifica el estado de la orden de compra (a 'parcialmente recibido' o 'recibido por completo') y genera un registro de entrada (albarán de recepción) que sirve como justificante para futuras conciliaciones con las facturas del proveedor. Por tanto, esta página no solo garantiza la precisión del inventario, sino que también fortalece el control financiero y la seguridad del paciente.

## 👥 Roles de Acceso

- Compras
- Inventario
- Administrador de Clínica

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Toda la lógica de frontend para esta funcionalidad reside dentro de la carpeta '/features/gestion-proveedores-almacen/'. La página principal es '/pages/RecepcionMercanciasPage.tsx', que orquesta la vista. Los componentes reutilizables como el formulario principal ('FormularioRecepcionMercancias.tsx'), la tabla de artículos a recibir ('TablaLineasPedidoRecepcion.tsx') y el modal para buscar órdenes de compra ('ModalBusquedaPedidos.tsx') se encuentran en '/components/'. La comunicación con el backend se centraliza en '/apis/recepcionApi.ts', que exporta funciones asíncronas para cada endpoint requerido.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/RecepcionMercanciasPage.tsx`
- `/features/gestion-proveedores-almacen/components/FormularioRecepcionMercancias.tsx`
- `/features/gestion-proveedores-almacen/components/TablaLineasPedidoRecepcion.tsx`
- `/features/gestion-proveedores-almacen/components/ModalBusquedaPedidos.tsx`
- `/features/gestion-proveedores-almacen/apis/recepcionApi.ts`

### Componentes React

- RecepcionMercanciasPage
- FormularioRecepcionMercancias
- TablaLineasPedidoRecepcion
- ModalBusquedaPedidos
- SelectorOrdenCompra

## 🔌 APIs Backend

Las APIs para la recepción de mercancías se centran en obtener información de las órdenes de compra pendientes y en crear el registro de recepción, que a su vez desencadena las actualizaciones de inventario y estado del pedido.

### `GET` `/api/pedidos-compra`

Busca y obtiene una lista de órdenes de compra filtradas, típicamente aquellas con estado 'abierto' o 'parcialmente_recibido' para ser seleccionadas en la recepción.

**Parámetros:** query.estado: String (ej: 'abierto,parcialmente_recibido'), query.proveedor: String (ID del proveedor), query.search: String (búsqueda por número de pedido)

**Respuesta:** Un array de objetos de PedidoCompra con información resumida.

### `GET` `/api/pedidos-compra/:id`

Obtiene los detalles completos de una orden de compra específica, incluyendo todas sus líneas de producto, cantidades pedidas y cantidades ya recibidas.

**Parámetros:** params.id: String (ObjectID de la orden de compra)

**Respuesta:** Un objeto de PedidoCompra completo con sus líneas de producto pobladas.

### `POST` `/api/recepciones`

Crea un nuevo registro de recepción de mercancías. Esta es la operación principal que actualiza el stock de los productos y el estado de la orden de compra asociada.

**Parámetros:** body: { pedidoCompraId: ObjectID, fechaRecepcion: Date, numeroAlbaran: String, notas: String, lineas: [{ productoId: ObjectID, cantidadRecibida: Number, lote: String, fechaCaducidad: Date }] }

**Respuesta:** El objeto de la RecepcionMercancia recién creada.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con tres modelos principales: 'PedidoCompra' (para leer y actualizar), 'Producto' (para actualizar el stock) y 'RecepcionMercancia' (para registrar la entrada). El 'RecepcionController' contiene la lógica de negocio clave para procesar la recepción.

### Models

#### RecepcionMercancia

pedidoCompra: { type: Schema.Types.ObjectId, ref: 'PedidoCompra' }, fechaRecepcion: { type: Date, default: Date.now }, numeroAlbaran: String, estadoPedidoResultante: String, lineas: [{ producto: { type: Schema.Types.ObjectId, ref: 'Producto' }, cantidadRecibida: Number, lote: String, fechaCaducidad: Date }], creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }, notas: String

#### PedidoCompra

Los campos relevantes para esta funcionalidad son 'estado' (String con valores como 'abierto', 'parcialmente_recibido', 'recibido') y el array 'lineas' con las cantidades pedidas y recibidas por producto.

#### Producto

Los campos relevantes son 'stockActual' (Number) y un posible array 'lotes' para gestionar el inventario por lotes: lotes: [{ numero: String, cantidad: Number, fechaCaducidad: Date }]

### Controllers

#### RecepcionController

- crearRecepcion
- obtenerRecepciones

#### PedidoCompraController

- obtenerPedidosParaRecepcion
- obtenerDetallePedido

### Routes

#### `/api/recepciones`

- POST / (crearRecepcion)
- GET / (obtenerRecepciones)

#### `/api/pedidos-compra`

- GET / (obtenerPedidosParaRecepcion)
- GET /:id (obtenerDetallePedido)

## 🔄 Flujos

1. El usuario de inventario navega a la página de 'Recepción de Mercancías'.
2. Utiliza el buscador para encontrar la Orden de Compra pendiente, ya sea por número o seleccionando el proveedor.
3. Al seleccionar una orden, el sistema carga los productos y cantidades pedidas en una tabla.
4. Para cada producto en la tabla, el usuario introduce la cantidad que ha llegado físicamente, el número de lote y la fecha de caducidad.
5. El usuario introduce el número de albarán del proveedor y cualquier nota relevante.
6. Al hacer clic en 'Confirmar Recepción', el sistema valida los datos, crea el registro de 'RecepcionMercancia', actualiza el stock de cada producto y cambia el estado de la Orden de Compra a 'Recibido' o 'Parcialmente Recibido'.

## 📝 User Stories

- Como responsable de inventario, quiero buscar una orden de compra pendiente para registrar una entrega de un proveedor.
- Como encargado de compras, quiero que al seleccionar una orden de compra se pre-rellenen los productos que se esperaban, para solo tener que confirmar las cantidades.
- Como responsable de inventario, quiero poder introducir el número de lote y la fecha de caducidad para cada material recibido, para cumplir con las normativas de trazabilidad.
- Como administrador de clínica, quiero que el inventario se actualice en tiempo real tras una recepción para tener una visión precisa de nuestros recursos disponibles.
- Como responsable de inventario, quiero poder gestionar recepciones parciales si un proveedor no entrega el pedido completo de una vez.

## ⚙️ Notas Técnicas

- La creación de una recepción debe implementarse como una transacción de MongoDB para garantizar la atomicidad. La operación debe actualizar el stock en el modelo 'Producto', el estado en 'PedidoCompra' y crear el documento 'RecepcionMercancia' de forma conjunta. Si algo falla, todo debe revertirse.
- Implementar validaciones en el backend para asegurar que la 'cantidadRecibida' no exceda la 'cantidadPendiente' de la orden de compra, a menos que se permita explícitamente la sobre-recepción.
- Considerar la integración con un lector de códigos de barras (QR o EAN-13) para agilizar la identificación de productos y la captura de lotes/caducidades.
- El endpoint de búsqueda de órdenes de compra debe estar optimizado con índices en la base de datos sobre los campos 'estado' y 'proveedor' para un rendimiento rápido.
- El sistema debe registrar qué usuario ha confirmado cada recepción para fines de auditoría y seguimiento de responsabilidad.

