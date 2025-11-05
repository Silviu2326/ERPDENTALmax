# Catálogo de Productos Médicos

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

El Catálogo de Productos Médicos es la base de datos centralizada de todos los materiales, insumos y equipos utilizados en la clínica dental. Esta funcionalidad es el pilar fundamental del módulo 'Gestión de Proveedores y Almacén', ya que proporciona un registro detallado y estandarizado de cada artículo, desde consumibles como guantes y resinas, hasta instrumental esterilizable y equipos. Su propósito principal es estandarizar la información, facilitar la gestión de inventario, controlar los costos y optimizar el proceso de compras. Dentro del ERP, el catálogo funciona como una fuente única de verdad: cada producto tiene un identificador único (SKU), una descripción, categoría, proveedor asociado, costo, unidad de medida, y niveles de stock (actual y mínimo). Al tener esta información centralizada, el sistema puede automatizar alertas de reabastecimiento cuando el stock de un producto cae por debajo del mínimo establecido, evitando así interrupciones en la atención al paciente por falta de material. Además, se integra directamente con la creación de órdenes de compra, permitiendo al personal de compras seleccionar productos del catálogo para generar pedidos a proveedores de forma rápida y sin errores, y posteriormente, con la recepción de mercancía para actualizar los niveles de stock automáticamente.

## 👥 Roles de Acceso

- Compras / Inventario
- Auxiliar / Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

La funcionalidad del catálogo de productos reside dentro de la feature 'gestion-proveedores-almacen'. La carpeta '/pages' contiene el componente principal 'CatalogoProductosPage.tsx' que renderiza la interfaz completa. La carpeta '/components' aloja los componentes reutilizables como 'TablaProductos.tsx' para mostrar la lista, 'FormularioProducto.tsx' para la creación y edición, y 'BarraBusquedaFiltrosProductos.tsx' para la búsqueda y filtrado. Finalmente, la carpeta '/apis' contiene el archivo 'productosApi.ts' que encapsula todas las llamadas a la API REST del backend para gestionar los productos (CRUD).

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/CatalogoProductosPage.tsx`
- `/features/gestion-proveedores-almacen/components/TablaProductos.tsx`
- `/features/gestion-proveedores-almacen/components/FormularioProducto.tsx`
- `/features/gestion-proveedores-almacen/components/BarraBusquedaFiltrosProductos.tsx`
- `/features/gestion-proveedores-almacen/components/ModalDetalleProducto.tsx`
- `/features/gestion-proveedores-almacen/apis/productosApi.ts`

### Componentes React

- CatalogoProductosPage
- TablaProductos
- FormularioProducto
- BarraBusquedaFiltrosProductos
- ModalDetalleProducto

## 🔌 APIs Backend

Las APIs para el catálogo de productos se centran en operaciones CRUD (Crear, Leer, Actualizar, Borrar) para gestionar los registros de productos. Se necesita un endpoint para obtener una lista paginada y filtrable de todos los productos, endpoints para obtener, actualizar y eliminar un producto específico por su ID, y un endpoint para crear un nuevo producto en el catálogo.

### `GET` `/api/productos`

Obtiene una lista paginada de productos. Permite filtrar por nombre, categoría, proveedor y buscar por SKU o nombre.

**Parámetros:** page (number): Número de página, limit (number): Resultados por página, search (string): Término de búsqueda, categoria (string): ID de la categoría para filtrar, proveedor (string): ID del proveedor para filtrar

**Respuesta:** Un objeto con la lista de productos y metadatos de paginación.

### `POST` `/api/productos`

Crea un nuevo producto en el catálogo.

**Parámetros:** Body (JSON): Objeto con los datos del nuevo producto (nombre, sku, descripcion, categoria, proveedorId, costoUnitario, stockMinimo, etc.).

**Respuesta:** El objeto del producto recién creado.

### `GET` `/api/productos/:id`

Obtiene los detalles completos de un único producto por su ID.

**Parámetros:** id (string): ID del producto en MongoDB.

**Respuesta:** El objeto completo del producto.

### `PUT` `/api/productos/:id`

Actualiza la información de un producto existente.

**Parámetros:** id (string): ID del producto a actualizar., Body (JSON): Objeto con los campos a modificar.

**Respuesta:** El objeto del producto actualizado.

### `DELETE` `/api/productos/:id`

Elimina un producto del catálogo (o lo marca como inactivo para mantener la integridad referencial).

**Parámetros:** id (string): ID del producto a eliminar.

**Respuesta:** Un mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

En el backend, el modelo 'Producto' define el esquema de datos en MongoDB. El 'ProductoController' contiene la lógica de negocio para manejar las peticiones HTTP (listar, crear, actualizar, etc.), interactuando con el modelo para acceder a la base de datos. Las rutas, definidas en 'productoRoutes.js', mapean los endpoints de la API (ej. /api/productos) a las funciones correspondientes en el controlador.

### Models

#### Producto

nombre (String), sku (String, unique), descripcion (String), categoria (String, enum: ['Consumible', 'Instrumental', 'Equipamiento', 'Oficina']), proveedorId (ObjectId, ref: 'Proveedor'), costoUnitario (Number), stockActual (Number, default: 0), stockMinimo (Number), unidadMedida (String, enum: ['unidad', 'caja', 'paquete', 'litro']), lote (String), fechaCaducidad (Date), activo (Boolean, default: true)

### Controllers

#### ProductoController

- obtenerProductos
- crearProducto
- obtenerProductoPorId
- actualizarProducto
- eliminarProducto

### Routes

#### `/api/productos`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id

## 🔄 Flujos

1. El usuario de 'Compras' navega a la sección de Catálogo. El sistema realiza una llamada a GET /api/productos para cargar y mostrar la lista inicial en 'TablaProductos'.
2. Para encontrar un artículo, el usuario utiliza 'BarraBusquedaFiltrosProductos', lo que desencadena una nueva llamada a la API con parámetros de búsqueda/filtrado, actualizando la tabla.
3. Para añadir un nuevo material, el usuario hace clic en 'Añadir Producto', lo que abre el componente 'FormularioProducto'. Tras rellenar los datos y guardar, se envía una petición POST /api/productos. Si tiene éxito, la tabla se refresca para mostrar el nuevo ítem.
4. Para modificar un producto existente, el usuario hace clic en el botón 'Editar' de una fila. El 'FormularioProducto' se abre en un modal, precargado con los datos del producto (obtenidos de GET /api/productos/:id). Al guardar los cambios, se envía una petición PUT /api/productos/:id.
5. El sistema resalta visualmente en la tabla los productos cuyo 'stockActual' es igual o menor que su 'stockMinimo'.

## 📝 User Stories

- Como personal de Compras, quiero registrar nuevos productos en el catálogo especificando su SKU, nombre, proveedor, costo y stock mínimo, para asegurar que toda la información necesaria para futuras compras esté disponible.
- Como Auxiliar de clínica, quiero buscar rápidamente un producto por su nombre para verificar cuántas unidades quedan en stock antes de iniciar un procedimiento.
- Como responsable de Inventario, quiero editar la información de un producto, como su costo unitario, cuando un proveedor actualiza sus precios, para mantener la precisión financiera.
- Como personal de Compras, quiero filtrar la lista de productos para ver únicamente aquellos cuyo stock actual está por debajo del mínimo, para poder planificar y generar órdenes de compra eficientemente.
- Como Auxiliar, quiero ver los detalles de un producto, incluyendo su descripción y lote, para asegurar que estoy utilizando el material correcto para un tratamiento específico.

## ⚙️ Notas Técnicas

- Seguridad: Implementar validación en el backend (ej. usando Joi o express-validator) para todos los datos de entrada en las rutas POST y PUT, asegurando la integridad de los datos (ej. costos y stock no pueden ser negativos).
- Rendimiento: Utilizar paginación del lado del servidor para la lista de productos para garantizar que la interfaz de usuario se mantenga rápida y receptiva, incluso con miles de productos en el catálogo.
- Integridad de Datos: Al eliminar un producto, considerar una eliminación lógica ('soft delete' cambiando el campo 'activo' a false) en lugar de una eliminación física para no romper referencias históricas en órdenes de compra o registros de uso de inventario.
- Experiencia de Usuario (UX): Implementar una función de 'debounce' en el campo de búsqueda para evitar realizar una llamada a la API en cada pulsación de tecla, mejorando el rendimiento y reduciendo la carga del servidor.
- Interconexión: El campo 'proveedorId' debe ser una referencia (ObjectId) al modelo 'Proveedor'. La interfaz debe permitir seleccionar un proveedor de una lista desplegable poblada desde la API de proveedores.

