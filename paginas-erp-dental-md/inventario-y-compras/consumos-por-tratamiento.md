# Consumos por Tratamiento

**Categoría:** Gestión de Recursos | **Módulo:** Inventario y Compras

La funcionalidad 'Consumos por Tratamiento' es un componente estratégico dentro del módulo de 'Inventario y Compras' del ERP dental. Su propósito fundamental es crear una conexión directa y cuantificable entre los procedimientos clínicos realizados y los recursos materiales que estos requieren. En esencia, permite a los administradores de la clínica definir una 'receta' o 'lista de materiales' estándar para cada tratamiento ofrecido. Por ejemplo, se puede especificar que una 'Obturación con Composite Clase I' consume sistemáticamente: 1 cápsula de composite, 1 aplicador de adhesivo, 2 rollos de algodón y 1 cartucho de anestésico. Esta definición estandarizada es crucial para la gestión eficiente de la clínica. Sirve para múltiples propósitos: primero, automatiza el control de inventario, ya que al marcar un tratamiento como completado en el odontograma del paciente, el sistema puede deducir automáticamente las cantidades especificadas del stock, manteniendo los niveles de inventario actualizados en tiempo real. Segundo, permite un análisis de costos mucho más preciso, calculando el costo real de los materiales por cada procedimiento, lo que ayuda a fijar precios de manera más informada. Tercero, optimiza la logística interna, ya que los asistentes pueden consultar esta lista para preparar los gabinetes dentales de manera rápida y sin omisiones. En resumen, esta funcionalidad es el puente que une la operación clínica con la gestión administrativa y financiera, garantizando un uso controlado de los recursos, evitando roturas de stock y proporcionando datos valiosos para la toma de decisiones.

## 👥 Roles de Acceso

- Compras / Inventario
- Auxiliar / Asistente
- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/inventario-y-compras/`

Esta funcionalidad reside dentro de la feature 'inventario-y-compras'. La página principal, '/pages/TratamientoConsumosPage.tsx', orquesta la interfaz, mostrando una lista de tratamientos. Utiliza componentes de '/components/' como 'TratamientoConsumosList' para listar los tratamientos y 'ModalEditarConsumos' para la edición. Todas las interacciones con el backend se centralizan en un archivo dentro de la carpeta '/apis/', llamado 'tratamientoConsumosApi.ts', que exporta funciones para obtener y actualizar los datos.

### Archivos Frontend

- `/features/inventario-y-compras/pages/TratamientoConsumosPage.tsx`
- `/features/inventario-y-compras/components/TratamientoConsumosList.tsx`
- `/features/inventario-y-compras/components/ModalEditarConsumos.tsx`
- `/features/inventario-y-compras/components/TablaItemsConsumo.tsx`
- `/features/inventario-y-compras/components/SelectorInventario.tsx`
- `/features/inventario-y-compras/apis/tratamientoConsumosApi.ts`

### Componentes React

- TratamientoConsumosList
- ModalEditarConsumos
- TablaItemsConsumo
- SelectorInventario

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan la relación entre los tratamientos y los productos de inventario. Se necesita un endpoint para listar todos los tratamientos, otro para obtener la lista de consumos de un tratamiento específico, y un endpoint para guardar/actualizar dicha lista. Adicionalmente, se requiere un endpoint de búsqueda de productos del inventario para agregarlos a un tratamiento.

### `GET` `/api/tratamientos`

Obtiene una lista paginada de todos los tratamientos de la clínica. Puede incluir un resumen de cuántos ítems de consumo tiene cada uno.

**Parámetros:** query.search: string (para buscar por nombre o código), query.page: number, query.limit: number

**Respuesta:** Un objeto con la lista de tratamientos y metadatos de paginación: { data: [Tratamiento], total: number, page: number, limit: number }

### `GET` `/api/tratamientos/:id/consumos`

Obtiene la lista detallada de productos de inventario y sus cantidades asociadas a un tratamiento específico.

**Parámetros:** params.id: string (ID del tratamiento)

**Respuesta:** Un array de objetos de consumo: [{ producto: { _id, nombre, unidadMedida }, cantidad: number }]

### `PUT` `/api/tratamientos/:id/consumos`

Crea o reemplaza completamente la lista de consumos para un tratamiento específico. El body de la petición debe contener la lista completa de consumos.

**Parámetros:** params.id: string (ID del tratamiento), body.consumos: [{ productoId: string, cantidad: number }]

**Respuesta:** El objeto del tratamiento actualizado con la nueva lista de consumos: { _id, nombre, ..., consumos: [...] }

### `GET` `/api/inventario/productos`

Endpoint de utilidad para buscar productos en el inventario por nombre o SKU, usado en el modal para agregar nuevos ítems de consumo.

**Parámetros:** query.search: string

**Respuesta:** Un array de objetos de ProductoInventario que coinciden con la búsqueda.

## 🗂️ Estructura Backend (MERN)

Para soportar esta funcionalidad, el modelo 'Tratamiento' en MongoDB debe ser extendido para incluir un array de consumos. Cada elemento de este array referenciará un 'ProductoInventario' y especificará la cantidad. Se creará una lógica específica en 'TratamientoController' para manejar la obtención y actualización de estos consumos, expuesta a través de las rutas correspondientes.

### Models

#### Tratamiento

nombre: String, codigo: String, precio: Number, consumos: [{ producto: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductoInventario', required: true }, cantidad: { type: Number, required: true, min: 0 } }]

#### ProductoInventario

nombre: String, sku: String, descripcion: String, stockActual: Number, unidadMedida: String (ej: 'unidad', 'ml', 'g')

### Controllers

#### TratamientoController

- getAllTratamientos
- getConsumosByTratamientoId
- updateConsumosByTratamientoId

#### ProductoInventarioController

- searchProductos

### Routes

#### `/api/tratamientos`

- GET /
- GET /:id/consumos
- PUT /:id/consumos

#### `/api/inventario/productos`

- GET /

## 🔄 Flujos

1. El usuario con rol 'Compras / Inventario' accede a la página 'Consumos por Tratamiento' desde el menú de 'Inventario y Compras'.
2. La interfaz muestra una lista de todos los tratamientos de la clínica. El usuario puede buscar o filtrar para encontrar un tratamiento específico.
3. Al seleccionar un tratamiento, el sistema realiza una llamada a la API para obtener y mostrar la lista actual de materiales y cantidades asociados.
4. El usuario pulsa el botón 'Editar' o 'Gestionar Consumos', lo que abre un modal.
5. Dentro del modal, el usuario puede eliminar ítems existentes o agregar nuevos. Para agregar, utiliza un campo de búsqueda que consulta en tiempo real los productos del inventario.
6. Una vez seleccionado un producto, el usuario introduce la cantidad consumida para ese tratamiento.
7. Al guardar, el sistema envía la lista completa de ítems y cantidades al backend a través de una petición PUT, que actualiza el documento del tratamiento en la base de datos.
8. Posteriormente, al marcar un tratamiento como 'realizado' en la ficha de un paciente, otro módulo (Atención Clínica) deberá consultar esta configuración y disparar la reducción de stock correspondiente.

## 📝 User Stories

- Como gestor de 'Compras / Inventario', quiero asignar una lista de materiales consumibles a cada tratamiento para estandarizar el uso de recursos y automatizar el control de stock.
- Como administrador de la clínica, quiero conocer el costo exacto en materiales de cada tratamiento para poder definir una política de precios rentable.
- Como 'Auxiliar / Asistente', quiero consultar la lista de materiales de un tratamiento antes de que el paciente llegue para poder preparar el gabinete de forma eficiente y completa.
- Como 'Odontólogo', quiero tener visibilidad sobre los materiales estándar de un procedimiento para validar que todo está preparado y solicitar materiales adicionales si el caso lo requiere.

## ⚙️ Notas Técnicas

- El modelo `Tratamiento` debe utilizar 'population' de Mongoose en la consulta GET /:id/consumos para devolver los detalles completos del producto (nombre, unidad) y no solo su ObjectId.
- La operación PUT /:id/consumos debe ser atómica para evitar inconsistencias. Reemplazar el array completo es una estrategia sencilla y robusta.
- Implementar debouncing en el campo de búsqueda de productos del inventario (`SelectorInventario`) para evitar un exceso de llamadas a la API mientras el usuario escribe.
- Es fundamental definir una estrategia de integración con el módulo de 'Odontograma' o 'Atención Clínica'. Un evento (ej: 'tratamientoCompletado') podría ser emitido, y un listener en el módulo de inventario se encargaría de procesar la deducción de stock.
- Manejo de unidades: La interfaz debe mostrar claramente la `unidadMedida` del producto (ej: 'ml', 'unidades', 'caja') para que el usuario ingrese la `cantidad` de forma coherente.
- Seguridad: La ruta PUT para modificar consumos debe estar protegida y accesible únicamente para roles con permisos de gestión de inventario, mientras que la lectura (GET) puede ser más permisiva.

