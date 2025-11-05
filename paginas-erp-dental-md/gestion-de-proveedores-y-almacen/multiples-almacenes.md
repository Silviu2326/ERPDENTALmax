# Múltiples Almacenes

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad de 'Múltiples Almacenes' es un pilar fundamental dentro del módulo de 'Gestión de Proveedores y Almacén', diseñada para clínicas dentales que operan en una o varias sedes. Permite la creación, gestión y seguimiento de inventario en distintas ubicaciones físicas o lógicas, como pueden ser el almacén principal de una clínica, un almacén central para un grupo de clínicas, o incluso los gabinetes específicos donde se guardan materiales de alto valor. Su propósito principal es proporcionar un control granular y preciso sobre los recursos materiales de la organización. Gracias a esta funcionalidad, el personal de compras y los administradores pueden saber exactamente qué cantidad de cada producto (implantes, composites, guantes, etc.) se encuentra en cada ubicación en tiempo real. Esto optimiza las órdenes de compra, evita tanto el exceso de stock como las roturas, y facilita la logística interna, como las transferencias de material entre sedes. En el contexto del ERP dental, esta gestión se integra directamente con los módulos de compras (al especificar el almacén de destino para un pedido), tratamientos (al descontar material del almacén correspondiente tras un procedimiento) y finanzas (al valorar el inventario por centro de coste/clínica).

## 👥 Roles de Acceso

- Compras / Inventario
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

La funcionalidad se encapsula dentro de la feature 'gestion-proveedores-almacen'. La carpeta '/pages' contendrá el componente principal de la página para gestionar los almacenes. La carpeta '/components' albergará los elementos de UI reutilizables como la tabla de almacenes, el formulario modal para crear/editar un almacén, y el modal para gestionar transferencias de stock. Finalmente, la carpeta '/apis' contendrá las funciones que realizan las llamadas a los endpoints del backend para todas las operaciones CRUD y de transferencia.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/GestionAlmacenesPage.tsx`
- `/features/gestion-proveedores-almacen/pages/DetalleAlmacenPage.tsx`

### Componentes React

- AlmacenesDataTable
- ModalCrearEditarAlmacen
- ModalTransferenciaStock
- InventarioPorAlmacenList

## 🔌 APIs Backend

Las APIs proporcionan los endpoints necesarios para realizar operaciones CRUD sobre los almacenes, consultar el stock específico de cada uno y gestionar las transferencias de material entre ellos.

### `GET` `/api/almacenes`

Obtiene una lista de todos los almacenes registrados en el sistema, con información básica como nombre, ubicación y responsable.

**Parámetros:** query: clinicaId (opcional, para filtrar por clínica)

**Respuesta:** Array de objetos Almacen.

### `POST` `/api/almacenes`

Crea un nuevo almacén en el sistema.

**Parámetros:** body: { nombre: string, direccion: object, responsableId: ObjectId, clinicaAsociadaId: ObjectId }

**Respuesta:** El objeto del nuevo Almacen creado.

### `GET` `/api/almacenes/:id`

Obtiene los detalles completos de un almacén específico, incluyendo el listado de productos y sus cantidades en stock.

**Parámetros:** path: id (ID del almacén)

**Respuesta:** Objeto Almacen con la relación de inventario poblada.

### `PUT` `/api/almacenes/:id`

Actualiza la información de un almacén existente.

**Parámetros:** path: id (ID del almacén), body: { ... campos a actualizar ... }

**Respuesta:** El objeto del Almacen actualizado.

### `DELETE` `/api/almacenes/:id`

Elimina un almacén. Solo se permite si el almacén no tiene stock.

**Parámetros:** path: id (ID del almacén)

**Respuesta:** Mensaje de confirmación.

### `POST` `/api/almacenes/transferencias`

Inicia una transferencia de stock entre dos almacenes. Esta operación es transaccional para garantizar la consistencia de los datos.

**Parámetros:** body: { almacenOrigenId: ObjectId, almacenDestinoId: ObjectId, productos: [{ productoId: ObjectId, cantidad: number }] }

**Respuesta:** Objeto de la Transferencia creada.

## 🗂️ Estructura Backend (MERN)

El backend utiliza el modelo 'Almacen' para la persistencia de datos en MongoDB. Un controlador 'AlmacenController' gestiona toda la lógica de negocio, incluyendo la validación y las operaciones transaccionales para las transferencias. Las rutas se definen en un archivo dedicado que mapea los endpoints HTTP a las funciones del controlador.

### Models

#### Almacen

nombre: String, direccion: {calle: String, ciudad: String, codigoPostal: String}, esPrincipal: Boolean, clinicaAsociada: { type: Schema.Types.ObjectId, ref: 'Clinica' }, responsable: { type: Schema.Types.ObjectId, ref: 'Usuario' }, activo: Boolean, createdAt: Date, updatedAt: Date

#### Producto

...otros campos del producto..., stockPorAlmacen: [{ almacen: { type: Schema.Types.ObjectId, ref: 'Almacen' }, cantidad: Number }]

#### Transferencia

almacenOrigen: { type: Schema.Types.ObjectId, ref: 'Almacen' }, almacenDestino: { type: Schema.Types.ObjectId, ref: 'Almacen' }, productos: [{ producto: { type: Schema.Types.ObjectId, ref: 'Producto' }, cantidad: Number }], estado: String, fechaEnvio: Date, fechaRecepcion: Date, usuarioResponsable: { type: Schema.Types.ObjectId, ref: 'Usuario' }

### Controllers

#### AlmacenController

- listarAlmacenes
- crearAlmacen
- obtenerDetalleAlmacen
- actualizarAlmacen
- eliminarAlmacen
- realizarTransferenciaStock

### Routes

#### `/api/almacenes`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id
- POST /transferencias

## 🔄 Flujos

1. El administrador general de un grupo de clínicas crea un nuevo almacén para una nueva sede, asociándolo a la clínica y asignando un responsable.
2. El responsable de inventario accede a la lista de almacenes para tener una vista general de todas las ubicaciones de stock.
3. El responsable de inventario de la Clínica A nota que tiene bajo stock de un composite, pero ve que el Almacén Central tiene excedente. Inicia una transferencia de 20 unidades desde el Almacén Central al almacén de la Clínica A.
4. El sistema registra la transferencia, descuenta el stock del origen y lo añade al destino de forma atómica. Se genera un registro de auditoría.
5. Al realizar un pedido a un proveedor, el usuario de compras selecciona el almacén de destino donde se recibirá la mercancía.

## 📝 User Stories

- Como Director General, quiero crear y gestionar los almacenes de cada una de mis clínicas para tener un control centralizado de los activos de inventario.
- Como responsable de Compras, quiero visualizar el stock de un producto específico desglosado por almacén para decidir si necesito comprar más o si puedo transferirlo desde otra sede.
- Como responsable de Inventario, quiero realizar transferencias de material entre almacenes de forma sencilla y segura, para asegurar que cada clínica tenga los recursos que necesita.
- Como Director General, quiero poder desactivar un almacén (por ejemplo, por cierre de una clínica) sin eliminar el histórico de movimientos, para mantener la integridad de los datos.

## ⚙️ Notas Técnicas

- La operación de transferencia de stock entre almacenes debe ser implementada utilizando transacciones de MongoDB para garantizar la atomicidad. Si falla la actualización en un almacén, debe revertirse en el otro.
- Es crucial implementar un sistema de control de acceso basado en roles (RBAC) a nivel de API. Un gestor de una clínica no debería poder autorizar transferencias desde almacenes de otras clínicas sin los permisos adecuados.
- Se debe mantener un registro de auditoría (log) para cada movimiento de inventario (entradas, salidas, transferencias, ajustes), almacenando qué usuario realizó la acción y cuándo.
- La consulta del stock de un producto distribuido en múltiples almacenes debe estar optimizada. Es necesario crear índices en la base de datos sobre los campos 'almacen' y 'producto' en las colecciones correspondientes.
- La eliminación de un almacén debe ser 'lógica' (marcar como inactivo) en lugar de física si ya tiene movimientos de inventario asociados, para no perder el histórico y la integridad referencial.

