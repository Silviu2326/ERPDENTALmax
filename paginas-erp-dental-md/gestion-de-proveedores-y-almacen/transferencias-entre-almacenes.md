# Transferencias entre Almacenes

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad de 'Transferencias entre Almacenes' es un componente crítico dentro del módulo de 'Gestión de Proveedores y Almacén' en el ERP dental. Su propósito principal es permitir y registrar el movimiento controlado de insumos, materiales y productos dentales entre diferentes ubicaciones de almacenamiento dentro de la misma clínica o entre sucursales. En una clínica dental, los 'almacenes' pueden ser desde un almacén central principal, donde se recibe la mercancía de los proveedores, hasta almacenes más pequeños o 'sub-almacenes' como los gabinetes de cada odontólogo, el laboratorio, o el área de esterilización. Esta funcionalidad permite mantener una trazabilidad exacta del inventario, asegurando que los niveles de stock se reflejen con precisión en tiempo real en cada ubicación. El proceso funciona de la siguiente manera: un usuario autorizado inicia una solicitud de transferencia, especificando el almacén de origen, el de destino, los productos a mover y sus cantidades. Esta transferencia se crea en un estado 'Pendiente'. Una vez que los materiales son físicamente movidos y recibidos en el destino, otro usuario autorizado confirma la recepción en el sistema. En ese momento, el ERP ejecuta la lógica de negocio para disminuir el stock del almacén de origen y aumentarlo en el de destino de forma atómica. Esto es fundamental para la gestión de costes, la prevención de mermas, la planificación de compras y para garantizar que los profesionales siempre dispongan del material necesario en su lugar de trabajo, optimizando la operativa diaria de la clínica.

## 👥 Roles de Acceso

- Compras
- Inventario
- Administrador de Clínica

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Toda la lógica de frontend para esta funcionalidad se encuentra dentro de la feature 'gestion-proveedores-almacen'. La carpeta /pages contendrá el archivo principal para la interfaz de gestión de transferencias. La carpeta /components albergará componentes reutilizables como la tabla de transferencias, el formulario de creación/edición, y modales de confirmación. Finalmente, la carpeta /apis contendrá las funciones que realizan las llamadas a los endpoints del backend para crear, listar y actualizar transferencias.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/TransferenciasAlmacenesPage.tsx`
- `/features/gestion-proveedores-almacen/pages/DetalleTransferenciaPage.tsx`
- `/features/gestion-proveedores-almacen/components/TablaTransferencias.tsx`
- `/features/gestion-proveedores-almacen/components/FormularioNuevaTransferencia.tsx`
- `/features/gestion-proveedores-almacen/components/ModalConfirmarRecepcion.tsx`
- `/features/gestion-proveedores-almacen/apis/transferenciasApi.ts`

### Componentes React

- TransferenciasAlmacenesPage
- DetalleTransferenciaPage
- TablaTransferencias
- FormularioNuevaTransferencia
- ModalConfirmarRecepcion
- SelectorAlmacen
- SelectorProductoInventario

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de una transferencia de almacén, desde su creación y listado hasta su confirmación, lo que desencadena las actualizaciones de stock.

### `GET` `/api/transferencias-almacen`

Obtiene una lista paginada de todas las transferencias. Permite filtrar por estado, almacén de origen, almacén de destino y rango de fechas.

**Parámetros:** page (number), limit (number), estado (string), origenId (string), destinoId (string), fechaInicio (string), fechaFin (string)

**Respuesta:** Un objeto con una lista de transferencias y metadatos de paginación.

### `POST` `/api/transferencias-almacen`

Crea una nueva solicitud de transferencia. Se guarda en estado 'Pendiente' y no afecta al stock hasta su confirmación.

**Parámetros:** Body: { almacenOrigenId: string, almacenDestinoId: string, productos: [{ productoId: string, cantidad: number, lote?: string }], notas?: string }

**Respuesta:** El objeto de la transferencia recién creada.

### `GET` `/api/transferencias-almacen/:id`

Obtiene los detalles completos de una transferencia específica, incluyendo los productos y sus cantidades.

**Parámetros:** id (string, en la URL)

**Respuesta:** El objeto completo de la transferencia solicitada.

### `PUT` `/api/transferencias-almacen/:id/confirmar`

Confirma la recepción de una transferencia. Cambia el estado a 'Completada' y ejecuta la lógica transaccional para actualizar el stock en los almacenes de origen y destino.

**Parámetros:** id (string, en la URL)

**Respuesta:** El objeto de la transferencia actualizado.

### `PUT` `/api/transferencias-almacen/:id/cancelar`

Cancela una transferencia que está en estado 'Pendiente'. No se realizan cambios en el stock.

**Parámetros:** id (string, en la URL)

**Respuesta:** El objeto de la transferencia actualizado con estado 'Cancelada'.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se apoya en el patrón MVC. El modelo 'TransferenciaAlmacen' define los datos. El 'TransferenciaAlmacenController' contiene la lógica de negocio, incluyendo la importante lógica transaccional para la actualización de stock. Las rutas exponen los endpoints para que el frontend pueda interactuar con el sistema.

### Models

#### TransferenciaAlmacen

codigo: String (autogenerado, ej: TR-2024-001), almacenOrigen: ObjectId (ref: 'Almacen'), almacenDestino: ObjectId (ref: 'Almacen'), estado: String (enum: ['Pendiente', 'Completada', 'Cancelada']), productos: [{ producto: ObjectId (ref: 'Producto'), cantidad: Number, lote: String }], usuarioSolicitante: ObjectId (ref: 'Usuario'), usuarioReceptor: ObjectId (ref: 'Usuario'), fechaCreacion: Date, fechaCompletado: Date, notas: String

#### Almacen

nombre: String, ubicacion: String, esPrincipal: Boolean, responsable: ObjectId (ref: 'Usuario')

#### Stock

producto: ObjectId (ref: 'Producto'), almacen: ObjectId (ref: 'Almacen'), cantidad: Number, lote: String

### Controllers

#### TransferenciaAlmacenController

- crearTransferencia
- listarTransferencias
- obtenerTransferenciaPorId
- confirmarRecepcionTransferencia
- cancelarTransferencia

### Routes

#### `/api/transferencias-almacen`

- GET /
- POST /
- GET /:id
- PUT /:id/confirmar
- PUT /:id/cancelar

## 🔄 Flujos

1. El usuario de inventario accede a la página 'Transferencias entre Almacenes' y ve una tabla con las transferencias existentes.
2. Para crear una nueva, hace clic en 'Nueva Transferencia'.
3. En el formulario, selecciona el almacén de origen y el de destino de dos listas desplegables.
4. Añade productos a la transferencia buscándolos por nombre o código. El sistema muestra el stock disponible en el almacén de origen para cada producto seleccionado.
5. Una vez añadidos todos los productos y sus cantidades, guarda la transferencia, que queda en estado 'Pendiente'.
6. Cuando los productos llegan al destino, un usuario en esa ubicación busca la transferencia pendiente, la abre y hace clic en 'Confirmar Recepción'.
7. El sistema valida la operación, actualiza el stock (disminuye en origen, aumenta en destino) y cambia el estado de la transferencia a 'Completada'.

## 📝 User Stories

- Como gestor de inventario, quiero crear una transferencia de materiales desde el almacén central a un gabinete dental para reponer su stock.
- Como asistente dental, quiero confirmar la recepción de los materiales en mi gabinete para que el sistema refleje el nuevo stock disponible y pueda usarlo en los tratamientos.
- Como administrador de la clínica, quiero ver un historial de todas las transferencias entre almacenes para realizar auditorías y controlar el movimiento de inventario.
- Como gestor de inventario, quiero poder cancelar una transferencia que aún no ha sido enviada si se ha creado por error.
- Como usuario, al crear una transferencia, quiero ver el stock actual del producto en el almacén de origen para no intentar transferir más de lo que hay disponible.

## ⚙️ Notas Técnicas

- Transaccionalidad: La confirmación de una transferencia debe ser una operación atómica. Se deben usar las transacciones de MongoDB para asegurar que la disminución de stock en el origen y el aumento en el destino se completen exitosamente juntas, o no se realice ninguna si una de ellas falla.
- Validación de Stock en Tiempo Real: Antes de permitir crear o confirmar una transferencia, el backend debe realizar una validación estricta para asegurar que el almacén de origen tiene suficiente stock de los productos solicitados.
- Control de concurrencia: Implementar un mecanismo de bloqueo (optimista o pesimista) para evitar que dos usuarios intenten procesar la misma transferencia o transferir el mismo stock al mismo tiempo.
- Trazabilidad y Auditoría: Cada cambio de estado en una transferencia (creación, confirmación, cancelación) debe registrar qué usuario realizó la acción y la fecha/hora. Esto es crucial para auditorías futuras.
- Rendimiento: La búsqueda de productos para añadir a la transferencia debe ser rápida, utilizando indexación en la base de datos y posiblemente un componente de autocompletado en el frontend que haga llamadas debounced a la API.

