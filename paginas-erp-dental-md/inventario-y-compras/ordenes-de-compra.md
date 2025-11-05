# Órdenes de Compra

**Categoría:** Gestión de Recursos | **Módulo:** Inventario y Compras

La funcionalidad de Órdenes de Compra es un componente crítico dentro del módulo de 'Inventario y Compras' del ERP dental. Su propósito principal es formalizar, estandarizar y rastrear el proceso de adquisición de materiales, insumos y equipos de proveedores externos. Permite a la clínica crear un documento oficial que detalla los productos solicitados, las cantidades, los precios acordados y las condiciones de entrega. Esta formalización es esencial para el control de gastos, la prevención de compras no autorizadas y la correcta gestión presupuestaria. Dentro del flujo del módulo, la orden de compra es el primer paso del ciclo de aprovisionamiento; precede a la recepción de mercancía ('Entradas de Inventario') y a la gestión de facturas y pagos ('Cuentas por Pagar'). Al generar una orden de compra, el sistema puede reservar el presupuesto y dar visibilidad al equipo de inventario sobre los materiales que están en camino, permitiendo una mejor planificación del stock. Para una clínica multisede, esta funcionalidad es vital, ya que permite centralizar las compras o delegarlas por sucursal, manteniendo siempre una visión consolidada del gasto y de las relaciones con los proveedores. El sistema gestiona diferentes estados para cada orden (Borrador, Enviada, Recibida Parcial, Recibida Completa, Cancelada), proporcionando una trazabilidad completa desde la solicitud hasta la recepción final de los productos.

## 👥 Roles de Acceso

- Compras / Inventario
- Contable / Finanzas
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/inventario-y-compras/`

Esta funcionalidad reside dentro de la feature 'inventario-y-compras'. La carpeta '/features/inventario-y-compras/pages/' contiene el componente principal de la página, 'OrdenesCompraPage.tsx', que gestiona el listado y la creación. Los componentes reutilizables específicos, como el formulario de creación o la tabla de listado, se encuentran en '/features/inventario-y-compras/components/'. Las llamadas a la API del backend se abstraen en funciones dentro de '/features/inventario-y-compras/apis/ordenesCompraApi.ts', manteniendo la lógica de la interfaz separada de la comunicación con el servidor.

### Archivos Frontend

- `/features/inventario-y-compras/pages/OrdenesCompraPage.tsx`
- `/features/inventario-y-compras/pages/DetalleOrdenCompraPage.tsx`

### Componentes React

- TablaOrdenesCompra
- FormularioCrearOrdenCompra
- ModalSeleccionarProducto
- ModalSeleccionarProveedor
- VistaImpresionOrdenCompra
- BadgeEstadoOrdenCompra

## 🔌 APIs Backend

Las APIs para las Órdenes de Compra gestionan todas las operaciones CRUD, el cambio de estados y la recuperación de datos relacionados como proveedores y productos del catálogo. Están diseñadas para ser seguras, eficientes y permitir una gestión completa desde el frontend.

### `GET` `/api/ordenes-compra`

Obtiene un listado paginado de todas las órdenes de compra. Permite filtrar por estado, proveedor, rango de fechas y sucursal.

**Parámetros:** page (number), limit (number), estado (string), proveedorId (string), fechaInicio (date), fechaFin (date), sucursalId (string)

**Respuesta:** Un objeto con una lista de órdenes de compra y metadatos de paginación (total, paginas, paginaActual).

### `POST` `/api/ordenes-compra`

Crea una nueva orden de compra. Recibe los datos del proveedor, sucursal y la lista de items (productos, cantidad, precio).

**Parámetros:** Body: { proveedorId, sucursalId, items: [{ productoId, cantidad, precioUnitario }], notas }

**Respuesta:** El objeto de la orden de compra recién creada.

### `GET` `/api/ordenes-compra/:id`

Obtiene los detalles completos de una orden de compra específica, incluyendo información poblada del proveedor y los productos.

**Parámetros:** id (string) en la URL

**Respuesta:** El objeto completo de la orden de compra solicitada.

### `PUT` `/api/ordenes-compra/:id`

Actualiza una orden de compra existente. Típicamente usado para modificar una orden en estado 'Borrador'.

**Parámetros:** id (string) en la URL, Body: { ...campos a actualizar }

**Respuesta:** El objeto de la orden de compra actualizada.

### `PUT` `/api/ordenes-compra/:id/estado`

Actualiza el estado de una orden de compra (ej: de 'Borrador' a 'Enviada', de 'Enviada' a 'Recibida'). Esta acción puede desencadenar otros procesos.

**Parámetros:** id (string) en la URL, Body: { nuevoEstado: 'Enviada' | 'Recibida Parcial' | 'Recibida Completa' | 'Cancelada' }

**Respuesta:** El objeto de la orden de compra con su nuevo estado.

### `DELETE` `/api/ordenes-compra/:id`

Elimina una orden de compra. Esta acción solo debería permitirse para órdenes en estado 'Borrador' o 'Cancelada' para mantener la integridad de los datos.

**Parámetros:** id (string) en la URL

**Respuesta:** Un mensaje de confirmación de la eliminación.

## 🗂️ Estructura Backend (MERN)

La estructura del backend para esta funcionalidad se centra en el modelo 'OrdenCompra' de MongoDB, que contiene toda la información relevante. La lógica de negocio se encapsula en 'OrdenCompraController', y los endpoints se definen en el archivo de rutas correspondiente, siguiendo los principios REST.

### Models

#### OrdenCompra

numeroOrden: String (único, autogenerado), proveedor: ObjectId (ref: 'Proveedor'), sucursal: ObjectId (ref: 'Sucursal'), fechaCreacion: Date, fechaEntregaEstimada: Date, items: [{ producto: ObjectId (ref: 'Producto'), descripcion: String, cantidad: Number, precioUnitario: Number, subtotal: Number }], subtotal: Number, impuestos: Number, total: Number, estado: String (enum: ['Borrador', 'Enviada', 'Recibida Parcial', 'Recibida Completa', 'Cancelada']), creadoPor: ObjectId (ref: 'Usuario'), notas: String, historialEstados: [{ estado: String, fecha: Date, usuario: ObjectId }]

#### Proveedor

nombreComercial: String, razonSocial: String, nif: String, contacto: { nombre: String, email: String, telefono: String }, direccion: { calle: String, ciudad: String, codigoPostal: String }

#### Producto

nombre: String, sku: String, descripcion: String, categoria: String, stockActual: Number, proveedorHabitual: ObjectId (ref: 'Proveedor')

### Controllers

#### OrdenCompraController

- crearOrdenCompra
- obtenerTodasLasOrdenes
- obtenerOrdenPorId
- actualizarOrden
- eliminarOrden
- cambiarEstadoOrden

### Routes

#### `/api/ordenes-compra`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id
- PUT /:id/estado

## 🔄 Flujos

1. Creación de una orden: El usuario de Compras selecciona 'Crear Orden de Compra', busca y elige un proveedor, añade productos del catálogo especificando cantidades y precios, guarda la orden como 'Borrador'.
2. Envío y Aprobación: El usuario revisa la orden en 'Borrador', la edita si es necesario, y la cambia al estado 'Enviada'. El sistema puede generar un PDF y enviarlo automáticamente por correo al proveedor.
3. Seguimiento: Un usuario puede filtrar la lista de órdenes por el estado 'Enviada' para ver qué pedidos están pendientes de recibir y su fecha de entrega estimada.
4. Recepción de mercancía: Cuando llega el pedido, el usuario de Inventario localiza la orden de compra, verifica los productos recibidos contra la orden, y cambia su estado a 'Recibida Parcial' o 'Recibida Completa'. Este cambio de estado inicia el flujo de 'Entrada de Inventario' para actualizar el stock.
5. Consulta Financiera: El rol de Finanzas busca una orden 'Recibida Completa' por su número para compararla con la factura del proveedor antes de autorizar el pago.

## 📝 User Stories

- Como encargado de compras, quiero crear una orden de compra digital para formalizar los pedidos a mis proveedores y tener un registro claro de lo que se ha solicitado.
- Como encargado de inventario, quiero ver un listado de las órdenes de compra enviadas para anticipar la llegada de material y planificar el espacio de almacenamiento.
- Como contable, quiero acceder a las órdenes de compra recibidas para verificar que las facturas de los proveedores coinciden con los productos y precios acordados.
- Como director de la clínica, quiero filtrar las órdenes de compra por sucursal y rango de fechas para analizar los patrones de gasto y controlar el presupuesto.
- Como encargado de compras, quiero poder duplicar una orden de compra anterior para agilizar la reposición de pedidos recurrentes.

## ⚙️ Notas Técnicas

- Seguridad y Permisos: Implementar un middleware de autorización en el backend para asegurar que solo los roles permitidos puedan crear/modificar/eliminar órdenes. Un usuario de compras de una sucursal no debería poder ver las órdenes de otra, a menos que sea un rol de administración general.
- Generación de PDF y Envío por Email: Integrar una librería como 'pdf-lib' en el backend para generar una versión PDF de la orden de compra. Utilizar un servicio como Nodemailer con SendGrid/Mailgun para enviar la orden por correo al proveedor directamente desde la aplicación.
- Atomicidad de Datos: La creación de la orden de compra y cualquier lógica asociada (como la pre-asignación de presupuesto) debe realizarse dentro de una transacción de MongoDB para garantizar la consistencia de los datos.
- Optimización de Búsqueda: La búsqueda de productos y proveedores para añadir a la orden debe ser rápida. Utilizar índices en la base de datos en los campos de búsqueda (nombre, SKU, NIF) y considerar endpoints de búsqueda específicos que devuelvan datos livianos.
- Integración con Inventario: El cambio de estado a 'Recibida Completa' o 'Recibida Parcial' debe estar fuertemente acoplado con el módulo de 'Entradas de Inventario'. Idealmente, debería crear automáticamente un borrador de entrada de inventario con los datos de la orden de compra para que el usuario solo tenga que confirmar las cantidades recibidas.

