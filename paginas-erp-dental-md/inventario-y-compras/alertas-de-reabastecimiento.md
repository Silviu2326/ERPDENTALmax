# Alertas de Reabastecimiento

**Categoría:** Gestión de Recursos | **Módulo:** Inventario y Compras

La página de 'Alertas de Reabastecimiento' es un centro de control vital dentro del módulo de 'Inventario y Compras'. Su propósito fundamental es prevenir la interrupción de los servicios clínicos por falta de material, un riesgo operativo significativo en cualquier clínica dental. Esta funcionalidad automatiza la vigilancia de los niveles de stock de todos los productos consumibles y equipamiento, desde guantes y resinas hasta fresas y anestésicos. El sistema funciona comparando constantemente la cantidad actual de cada artículo en el inventario con un 'stock mínimo' predefinido por el administrador. Cuando el consumo de un producto durante un tratamiento o una venta reduce su cantidad por debajo de este umbral, se genera automáticamente una alerta. Esta alerta aparece en un dashboard centralizado, proporcionando al personal de compras y a los administradores una visión clara e inmediata de las necesidades de reabastecimiento. La página no solo informa, sino que es accionable: permite a los usuarios revisar las alertas, marcarlas como gestionadas o, de manera crucial, iniciar el proceso de compra creando un borrador de orden de compra con un solo clic, pre-cargando la información del producto y su proveedor preferido. Esto optimiza el flujo de trabajo, reduce errores manuales, evita compras de pánico a precios elevados y asegura que la clínica siempre esté preparada para atender a sus pacientes sin contratiempos.

## 👥 Roles de Acceso

- Compras / Inventario
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/inventario-y-compras/`

Esta funcionalidad reside dentro de la feature 'inventario-y-compras'. La página principal se define en '/pages/AlertasReabastecimientoPage.tsx', que actúa como el contenedor principal. Esta página utiliza componentes reutilizables de '/components/' como 'TablaAlertasReabastecimiento' para listar las alertas y 'FiltrosAlertas' para permitir al usuario segmentar la información. Las llamadas al backend para obtener y actualizar las alertas se encapsulan en '/apis/alertasApi.ts', manteniendo la lógica de comunicación separada de la UI.

### Archivos Frontend

- `/features/inventario-y-compras/pages/AlertasReabastecimientoPage.tsx`
- `/features/inventario-y-compras/components/TablaAlertasReabastecimiento.tsx`
- `/features/inventario-y-compras/components/ItemAlertaFila.tsx`
- `/features/inventario-y-compras/components/FiltrosAlertas.tsx`
- `/features/inventario-y-compras/components/ModalAccionAlerta.tsx`
- `/features/inventario-y-compras/apis/alertasApi.ts`

### Componentes React

- AlertasReabastecimientoPage
- TablaAlertasReabastecimiento
- ItemAlertaFila
- FiltrosAlertas
- ModalAccionAlerta

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en obtener, gestionar y actuar sobre las alertas de reabastecimiento generadas por el sistema.

### `GET` `/api/inventario/alertas`

Obtiene una lista paginada y filtrada de todas las alertas de reabastecimiento activas.

**Parámetros:** query.page: number (página actual), query.limit: number (ítems por página), query.sortBy: string (campo para ordenar), query.sedeId: string (filtrar por clínica), query.estado: string ('nueva', 'revisada', 'en_proceso_compra')

**Respuesta:** Un objeto con la lista de alertas y metadatos de paginación: { data: [Alerta], total: number, page: number, limit: number }

### `PUT` `/api/inventario/alertas/:alertaId/estado`

Actualiza el estado de una alerta específica (ej. de 'nueva' a 'revisada').

**Parámetros:** path.alertaId: string (ID de la alerta), body.estado: string (nuevo estado de la alerta)

**Respuesta:** El objeto de la alerta actualizada.

### `POST` `/api/inventario/alertas/:alertaId/crear-orden-compra`

Genera un borrador de una orden de compra a partir de una alerta y actualiza el estado de la alerta.

**Parámetros:** path.alertaId: string (ID de la alerta), body.cantidad: number (opcional, cantidad a pedir si es diferente a la sugerida)

**Respuesta:** El objeto de la nueva orden de compra creada en estado 'borrador'.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con modelos para productos y alertas, un controlador para la lógica de negocio y rutas para exponer los endpoints. La generación de alertas se dispara automáticamente cuando una operación reduce el stock de un producto por debajo de su mínimo.

### Models

#### AlertaReabastecimiento

producto: { type: ObjectId, ref: 'ProductoInventario' }, sede: { type: ObjectId, ref: 'Sede' }, stock_actual: Number, stock_minimo_al_generar: Number, cantidad_sugerida_pedido: Number, estado: { type: String, enum: ['nueva', 'revisada', 'en_proceso_compra', 'resuelta'], default: 'nueva' }, fecha_creacion: Date, usuario_revisor: { type: ObjectId, ref: 'Usuario' }, fecha_resolucion: Date

#### ProductoInventario

nombre: String, sku: String, sede: { type: ObjectId, ref: 'Sede' }, stock_actual: Number, stock_minimo: Number, proveedor_preferido: { type: ObjectId, ref: 'Proveedor' }, activo: Boolean. El trigger para crear una AlertaReabastecimiento se basa en la actualización de 'stock_actual' para que sea menor que 'stock_minimo'.

### Controllers

#### AlertaController

- obtenerAlertas(req, res)
- actualizarEstadoAlerta(req, res)
- generarOrdenCompraDesdeAlerta(req, res)
- verificarYGenerarAlerta(productoId, sedeId) (función interna llamada tras actualización de stock)

### Routes

#### `/api/inventario/alertas`

- GET /
- PUT /:alertaId/estado
- POST /:alertaId/crear-orden-compra

## 🔄 Flujos

1. El odontólogo registra el uso de material en un tratamiento. El backend actualiza el stock del 'ProductoInventario'. Si el nuevo 'stock_actual' es menor que el 'stock_minimo', el sistema crea un nuevo documento 'AlertaReabastecimiento'.
2. El gestor de compras accede a la página 'Alertas de Reabastecimiento'. El frontend realiza una llamada a `GET /api/inventario/alertas` y muestra la lista en la 'TablaAlertasReabastecimiento'.
3. El gestor filtra las alertas por la sede 'Principal' y ordena por las más recientes. Revisa una alerta, la considera gestionada por otra vía y la actualiza a estado 'resuelta' usando el endpoint `PUT /api/inventario/alertas/:alertaId/estado`.
4. Para otra alerta, el gestor decide comprar. Hace clic en 'Crear Orden de Compra'. El sistema llama a `POST /api/inventario/alertas/:alertaId/crear-orden-compra`, lo que genera una nueva orden de compra y redirige al usuario a la pantalla de edición de dicha orden.

## 📝 User Stories

- Como gestor de compras, quiero ver una lista centralizada de todos los productos que han alcanzado su nivel mínimo de stock para poder planificar las compras de manera eficiente.
- Como director de clínica, quiero poder filtrar las alertas por sede para supervisar la gestión de inventario en cada una de mis ubicaciones.
- Como encargado de inventario, quiero recibir notificaciones claras y accionables para no olvidar reabastecer materiales críticos y evitar interrupciones en los tratamientos.
- Como gestor de compras, quiero poder crear un borrador de orden de compra directamente desde una alerta para agilizar el proceso de reabastecimiento.
- Como administrador, quiero poder configurar los niveles de stock mínimo para cada producto y que el sistema me alerte automáticamente cuando se alcancen.

## ⚙️ Notas Técnicas

- Generación de Alertas: Implementar la lógica de creación de alertas mediante un middleware o un hook 'post-save' en el modelo 'ProductoInventario' de Mongoose. Esto asegura que cada vez que se modifique y guarde un producto, se verifique su nivel de stock de forma atómica.
- Notificaciones en Tiempo Real: Para mejorar la proactividad, se puede integrar Socket.IO. Cuando se crea una nueva alerta en el backend, se emite un evento a los clientes conectados con los roles pertinentes, mostrando una notificación instantánea en la UI.
- Rendimiento: Es crucial tener índices en la colección 'AlertaReabastecimiento' en los campos 'sede', 'estado' y 'fecha_creacion' para garantizar que las consultas de filtrado y ordenación sean rápidas, especialmente en clínicas con alto volumen de inventario.
- Seguridad y Multisede: Los endpoints de la API deben estar protegidos por un middleware de autenticación y autorización que verifique el rol del usuario. Las consultas a la base de datos deben incluir siempre un filtro por `sedeId` basado en los permisos del usuario para garantizar el aislamiento de datos entre clínicas.
- Evitar Duplicados: La lógica de creación de alertas debe verificar si ya existe una alerta 'nueva' o 'revisada' para el mismo producto en la misma sede antes de crear una nueva, para evitar duplicados innecesarios en la interfaz.

