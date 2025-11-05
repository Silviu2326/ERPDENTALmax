# Listado de Materiales Dentales

**Categoría:** Gestión de Recursos | **Módulo:** Inventario y Compras

La página de 'Listado de Materiales Dentales' es el núcleo central del módulo de 'Inventario y Compras' en el ERP dental. Funciona como un catálogo digital interactivo y en tiempo real de todos los insumos y productos que la clínica utiliza, desde consumibles básicos como guantes y mascarillas, hasta materiales especializados como composites, implantes y anestésicos. Su propósito principal es proporcionar una visión clara, completa y actualizada del estado del inventario. Esto permite a los diferentes roles de la clínica tomar decisiones informadas: el personal de compras puede planificar adquisiciones para evitar desabastecimientos, los asistentes pueden localizar materiales rápidamente para preparar procedimientos, y los odontólogos pueden consultar la disponibilidad de productos específicos. La funcionalidad se integra directamente con el resto del módulo, ya que los niveles de stock que aquí se muestran se actualizan automáticamente con la recepción de órdenes de compra y el consumo de materiales en los tratamientos registrados. La página se presenta típicamente como una tabla de datos avanzada, equipada con herramientas de búsqueda, filtrado por categoría o proveedor, y ordenamiento por criterios como nombre, stock actual o fecha de caducidad. Esta vista centralizada es fundamental para la eficiencia operativa, el control de costos y la garantía de que siempre se disponga de los recursos necesarios para ofrecer una atención al paciente ininterrumpida y de alta calidad.

## 👥 Roles de Acceso

- Compras / Inventario
- Auxiliar / Asistente
- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/inventario-y-compras/`

Toda la lógica de frontend para la gestión de inventario y compras reside en '/features/inventario-y-compras/'. La página 'Listado de Materiales Dentales' se implementa en '/pages/ListadoMaterialesPage.tsx', que actúa como el contenedor principal. Esta página utiliza componentes reutilizables de '/components/', como 'TablaMateriales.tsx' para renderizar la lista y 'FiltrosMateriales.tsx' para la funcionalidad de búsqueda y filtrado. Las interacciones con el backend se gestionan a través de funciones definidas en '/apis/materialesApi.ts', que encapsulan las llamadas a la API RESTful, manteniendo la lógica de datos separada de la presentación.

### Archivos Frontend

- `/features/inventario-y-compras/pages/ListadoMaterialesPage.tsx`
- `/features/inventario-y-compras/components/TablaMateriales.tsx`
- `/features/inventario-y-compras/components/FiltrosMateriales.tsx`
- `/features/inventario-y-compras/components/ModalDetalleMaterial.tsx`
- `/features/inventario-y-compras/apis/materialesApi.ts`

### Componentes React

- TablaMateriales
- FiltrosMateriales
- ModalDetalleMaterial
- PaginacionTabla
- IndicadorEstadoStock

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en obtener y gestionar la información de los materiales dentales. El endpoint principal es el de listado, que debe ser robusto y soportar paginación, búsqueda y filtrado del lado del servidor para garantizar un buen rendimiento.

### `GET` `/api/materiales`

Obtiene una lista paginada y filtrada de todos los materiales dentales. Es el endpoint principal de la página.

**Parámetros:** page (number), limit (number), sortBy (string), sortOrder (asc|desc), search (string), categoria (string, ObjectId), estado (string: en_stock, bajo_stock, agotado)

**Respuesta:** Un objeto con un array de materiales y metadatos de paginación: { data: [Material], total: number, page: number, limit: number }

### `GET` `/api/materiales/:id`

Obtiene los detalles completos de un material dental específico, usado para poblar el modal de detalles.

**Parámetros:** id (string, ObjectId)

**Respuesta:** Un objeto completo del Material, incluyendo información detallada del proveedor y historial de movimientos si aplica.

### `DELETE` `/api/materiales/:id`

Desactiva un material del inventario (borrado lógico). Esta acción estaría restringida al rol 'Compras / Inventario'.

**Parámetros:** id (string, ObjectId)

**Respuesta:** { message: 'Material desactivado exitosamente' }

## 🗂️ Estructura Backend (MERN)

El backend utiliza el modelo 'Material' para estructurar los datos en MongoDB. El 'MaterialController' contiene la lógica de negocio para interactuar con la base de datos (consultas, filtros, etc.), y las rutas en 'materialesRoutes' exponen esta lógica a través de endpoints RESTful seguros y bien definidos.

### Models

#### Material

{ codigoSKU: String (único, indexado), nombre: String (indexado), descripcion: String, categoria: { type: Schema.Types.ObjectId, ref: 'CategoriaMaterial' }, proveedorPrincipal: { type: Schema.Types.ObjectId, ref: 'Proveedor' }, stockActual: Number, stockMinimo: Number, unidadMedida: String, costoUnitario: Number, fechaCaducidad: Date, ubicacion: String, estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' } }

### Controllers

#### MaterialController

- getAllMateriales
- getMaterialById
- updateMaterial
- deleteMaterial

### Routes

#### `/api/materiales`

- GET /
- GET /:id
- PUT /:id
- DELETE /:id

## 🔄 Flujos

1. El usuario accede a la página 'Listado de Materiales'. El sistema realiza una llamada inicial a 'GET /api/materiales' para poblar la tabla con la primera página de resultados.
2. El usuario escribe 'resina' en la barra de búsqueda. Se activa una nueva llamada a 'GET /api/materiales?search=resina' y la tabla se actualiza con los resultados filtrados.
3. El usuario hace clic en la cabecera de la columna 'Stock Actual' para ordenar. Se realiza una llamada a 'GET /api/materiales?sortBy=stockActual&sortOrder=asc' para reordenar la lista.
4. El usuario identifica un material con bajo stock (resaltado en amarillo) y hace clic para ver detalles, abriendo un modal que se puebla con datos de 'GET /api/materiales/:id'.
5. El rol 'Compras / Inventario' decide que un material está obsoleto y utiliza la acción de 'eliminar' en la fila, lo que desencadena una llamada a 'DELETE /api/materiales/:id' para desactivarlo.

## 📝 User Stories

- Como gestor de 'Compras / Inventario', quiero ver una lista paginada de todos los materiales para poder gestionar el inventario sin sobrecargar la interfaz.
- Como 'Auxiliar / Asistente', quiero filtrar los materiales por ubicación para encontrar rápidamente lo que necesito en el almacén o en un gabinete específico.
- Como 'Odontólogo', quiero ver de un vistazo qué materiales están por debajo del stock mínimo para poder notificar al personal de compras durante mi jornada.
- Como gestor de 'Compras / Inventario', quiero ordenar la lista por fecha de caducidad para implementar una estrategia de 'primero en caducar, primero en salir' (FEFO) y reducir el desperdicio.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial implementar indexación en la colección 'Material' de MongoDB sobre los campos 'nombre', 'codigoSKU' y 'categoria' para optimizar las consultas de búsqueda y filtrado.
- Seguridad: Implementar middleware en el backend para verificar roles. Las rutas PUT y DELETE en '/api/materiales' deben ser accesibles solo para roles autorizados como 'Compras / Inventario'.
- Usabilidad: Utilizar 'debouncing' en el campo de búsqueda del frontend para evitar realizar llamadas a la API en cada pulsación de tecla, mejorando la experiencia y reduciendo la carga del servidor.
- Integración: Esta lista debe ser la fuente de verdad para otros módulos. Por ejemplo, al completar un tratamiento, el sistema debería poder descontar automáticamente el material utilizado del stock que se muestra aquí.
- Estado Visual: La tabla en React debe usar renderizado condicional para aplicar estilos CSS específicos a las filas o celdas según el estado del stock (ej: fondo rojo para stock < 0, amarillo para stock < stockMinimo).

