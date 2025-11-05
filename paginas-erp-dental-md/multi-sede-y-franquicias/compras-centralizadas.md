# Compras Centralizadas

**Categoría:** Multi-sede | **Módulo:** Multi-sede y Franquicias

La funcionalidad de 'Compras Centralizadas' es un componente estratégico dentro del módulo de 'Multi-sede y Franquicias', diseñado para optimizar la cadena de suministro de una red de clínicas dentales. Su objetivo principal es centralizar y estandarizar el proceso de adquisición de materiales, insumos y equipos para todas las sedes, permitiendo a la organización aprovechar economías de escala, negociar mejores precios con proveedores y mantener un control riguroso sobre los costos operativos. A través de este panel, los responsables de compras pueden crear órdenes de compra consolidadas que abastecen a múltiples clínicas simultáneamente, eliminando la redundancia y la ineficiencia de gestionar pedidos de forma individual por sede. El sistema facilita la gestión de un catálogo unificado de proveedores y productos aprobados, garantizando la calidad y consistencia de los materiales utilizados en toda la red. Además, se integra directamente con los módulos de inventario de cada clínica, automatizando la actualización de stock una vez que los pedidos son recibidos. Este flujo de trabajo conectado proporciona una visibilidad completa del ciclo de compra, desde la solicitud y aprobación hasta la recepción y el pago, ofreciendo a la dirección herramientas analíticas para monitorear el gasto, identificar patrones de consumo y tomar decisiones financieras informadas.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Compras / Inventario
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/multi-sede-franquicias/`

Esta funcionalidad se encuentra dentro de la feature 'multi-sede-franquicias'. La subcarpeta '/pages/' contiene el componente principal 'ComprasCentralizadasPage.tsx' que renderiza el dashboard de gestión. Los componentes reutilizables como tablas, modales y formularios se ubican en '/components/'. Las llamadas al backend están encapsuladas en funciones dentro de la carpeta '/apis/', que se encargan de la comunicación con los endpoints de Express.

### Archivos Frontend

- `/features/multi-sede-franquicias/pages/ComprasCentralizadasPage.tsx`
- `/features/multi-sede-franquicias/pages/DetalleOrdenCompraPage.tsx`
- `/features/multi-sede-franquicias/components/TablaOrdenesCompra.tsx`
- `/features/multi-sede-franquicias/components/ModalCrearEditarOrden.tsx`
- `/features/multi-sede-franquicias/components/FiltrosCompras.tsx`
- `/features/multi-sede-franquicias/apis/comprasApi.ts`

### Componentes React

- TablaOrdenesCompra
- ModalCrearEditarOrden
- FiltrosCompras
- SelectorProveedor
- SelectorSedesDestino
- PanelEstadoCompra

## 🔌 APIs Backend

Las APIs para Compras Centralizadas gestionan el ciclo de vida completo de las órdenes de compra, proveedores y la interacción con los inventarios de las sedes.

### `GET` `/api/compras-centralizadas/ordenes`

Obtiene una lista paginada de todas las órdenes de compra centralizadas. Permite filtrar por estado, proveedor, sede de destino y rango de fechas.

**Parámetros:** page (number), limit (number), estado (string), proveedorId (string), sedeId (string), fechaInicio (date), fechaFin (date)

**Respuesta:** Un objeto con un array de órdenes de compra y metadatos de paginación.

### `POST` `/api/compras-centralizadas/ordenes`

Crea una nueva orden de compra centralizada.

**Parámetros:** Body: { proveedorId, sedesDestino, items: [{ productoId, cantidad, precioUnitario }], notas }

**Respuesta:** El objeto de la orden de compra recién creada.

### `GET` `/api/compras-centralizadas/ordenes/:id`

Obtiene los detalles completos de una orden de compra específica.

**Parámetros:** id (string) - ID de la orden de compra

**Respuesta:** El objeto completo de la orden de compra.

### `PUT` `/api/compras-centralizadas/ordenes/:id/estado`

Actualiza el estado de una orden de compra (ej: de 'Pendiente Aprobacion' a 'Aprobada'). Acciones como 'Recibida' pueden requerir un body con detalles de la recepción por sede.

**Parámetros:** id (string) - ID de la orden, Body: { nuevoEstado, detallesRecepcion (opcional) }

**Respuesta:** El objeto de la orden de compra actualizada.

### `GET` `/api/proveedores`

Obtiene una lista de todos los proveedores disponibles para compras.

**Respuesta:** Un array de objetos de proveedores.

## 🗂️ Estructura Backend (MERN)

La lógica del backend se organiza en modelos de MongoDB para la persistencia de datos, controladores para la lógica de negocio y rutas de Express para exponer los endpoints de la API.

### Models

#### OrdenCompraCentralizada

codigoOrden (String, único), proveedor (ObjectId, ref: 'Proveedor'), sedesDestino ([ObjectId], ref: 'Sede'), items ([{ producto (ObjectId, ref: 'ProductoInventario'), cantidad (Number), precioUnitario (Number) }]), estado (String, enum: ['Borrador', 'Pendiente Aprobacion', 'Aprobada', 'Enviada', 'Recibida Parcial', 'Recibida Completa', 'Cancelada']), creadoPor (ObjectId, ref: 'User'), costoTotal (Number), fechaCreacion (Date), notas (String)

#### Proveedor

nombre (String), cif (String), direccion (Object), contacto (Object), catalogoProductos ([ObjectId], ref: 'ProductoInventario'), condicionesPago (String), activo (Boolean)

### Controllers

#### OrdenCompraCentralizadaController

- crearOrden
- listarOrdenes
- obtenerOrdenPorId
- actualizarOrden
- cambiarEstadoOrden

#### ProveedorController

- crearProveedor
- listarProveedores
- obtenerProveedorPorId

### Routes

#### `/api/compras-centralizadas`

- GET /ordenes
- POST /ordenes
- GET /ordenes/:id
- PUT /ordenes/:id
- PUT /ordenes/:id/estado

#### `/api/proveedores`

- GET /
- POST /
- GET /:id

## 🔄 Flujos

1. El Gestor de Compras crea una nueva orden de compra, selecciona un proveedor, elige las sedes de destino y añade los productos necesarios.
2. La orden se guarda con estado 'Pendiente Aprobacion'. El sistema notifica al Director General.
3. El Director General revisa la orden en el dashboard, la aprueba o la rechaza. Si la aprueba, el estado cambia a 'Aprobada'.
4. El Gestor de Compras envía la orden al proveedor y actualiza el estado a 'Enviada'.
5. Cuando el material llega a una sede, el personal de esa sede lo registra en su módulo de inventario, lo que a su vez actualiza el estado de la orden central a 'Recibida Parcial' o 'Recibida Completa'.
6. El rol de Contabilidad accede a las órdenes 'Recibidas' para procesar los pagos a proveedores y conciliar las facturas.

## 📝 User Stories

- Como Gestor de Compras, quiero crear una única orden de compra para varias sedes para simplificar la gestión y obtener mejores precios por volumen.
- Como Director General, quiero tener un panel para revisar y aprobar todas las órdenes de compra que excedan un determinado valor para mantener el control presupuestario.
- Como Contable, quiero acceder a un historial de órdenes de compra completadas y sus facturas asociadas para agilizar el proceso de pago y la contabilidad.
- Como Gestor de Compras, quiero filtrar y buscar órdenes por estado, proveedor o fecha para hacer un seguimiento rápido del estado de mis pedidos.
- Como responsable de inventario de una sede, quiero ser notificado cuando un pedido para mi clínica ha sido enviado para poder planificar la recepción de material.

## ⚙️ Notas Técnicas

- Seguridad: Implementar una lógica de autorización robusta para que solo los roles designados puedan crear, y especialmente, aprobar órdenes de compra. El acceso a los datos debe estar segmentado por la jerarquía de la organización.
- Integración de Inventario: La actualización del estado de la orden a 'Recibida' debe disparar una transacción en la base de datos que incremente el stock de los productos correspondientes en los inventarios de las sedes de destino. Utilizar transacciones de MongoDB para garantizar la atomicidad de esta operación.
- Notificaciones: Implementar un sistema de notificaciones en tiempo real (ej. WebSockets) o por correo electrónico para alertar a los roles implicados sobre cambios de estado importantes (ej. 'Nueva orden para aprobar', 'Pedido recibido en sede X').
- Rendimiento: La lista de órdenes de compra puede crecer significativamente. Es crucial implementar paginación del lado del servidor, junto con capacidades de búsqueda y filtrado eficientes a nivel de base de datos para no sobrecargar el frontend.
- Reporting: Desarrollar endpoints específicos para la generación de informes que agreguen datos de compras por proveedor, por producto o por sede, para facilitar el análisis de gastos.

