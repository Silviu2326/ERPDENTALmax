# Nuevo Material

**Categoría:** Gestión de Recursos | **Módulo:** Inventario y Compras

La página 'Nuevo Material' es un componente fundamental dentro del módulo de 'Inventario y Compras' del ERP dental. Su propósito principal es permitir a los usuarios autorizados, como el personal de compras o los responsables de inventario, registrar de manera sistemática y detallada todos los insumos, consumibles, instrumentos y equipos que se utilizan en la clínica. Esta funcionalidad es el punto de partida para una gestión de inventario efectiva. Al registrar un nuevo material, se capturan datos cruciales como el nombre, descripción, código SKU (Stock Keeping Unit) para una identificación única, categoría, proveedor preferido, costo unitario, unidad de medida (ej. caja, unidad, ml) y el nivel de stock mínimo de alerta. El funcionamiento correcto de esta página asegura la integridad de los datos del inventario desde su origen. La información aquí registrada alimenta directamente otras funcionalidades del módulo, como la generación de órdenes de compra, el control de niveles de stock en tiempo real, el cálculo de costos por tratamiento y la generación de reportes de consumo. Sin un registro preciso de los materiales, sería imposible automatizar las alertas de reabastecimiento o llevar un control financiero exacto de los recursos de la clínica. Por lo tanto, esta página actúa como la base de datos maestra de todos los artículos físicos, garantizando que el resto del sistema opere con información confiable y actualizada.

## 👥 Roles de Acceso

- Compras
- Inventario

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/inventario-compras/`

La funcionalidad 'Nuevo Material' se encuentra dentro de la carpeta de la feature 'inventario-compras'. La subcarpeta '/pages/' contiene el componente principal 'NuevoMaterialPage.tsx', que renderiza la interfaz y gestiona el estado del formulario. En '/components/', residen los componentes reutilizables como 'FormularioMaterial.tsx', que encapsula los campos de entrada, y selectores específicos. La lógica para interactuar con el backend está aislada en '/apis/materialesAPI.ts', que exporta funciones asíncronas para crear el material y obtener datos auxiliares como proveedores y categorías.

### Archivos Frontend

- `/features/inventario-compras/pages/NuevoMaterialPage.tsx`
- `/features/inventario-compras/components/FormularioMaterial.tsx`
- `/features/inventario-compras/apis/materialesAPI.ts`

### Componentes React

- NuevoMaterialPage
- FormularioMaterial
- SelectorProveedor
- SelectorCategoriaMaterial
- AlertaNotificacion

## 🔌 APIs Backend

Se requieren varios endpoints para esta funcionalidad. El principal es un endpoint POST para crear el nuevo material en la base de datos. Adicionalmente, se necesitan endpoints GET para poblar los campos de selección del formulario, como la lista de proveedores registrados y las categorías de materiales existentes, asegurando así la consistencia de los datos.

### `POST` `/api/materiales`

Crea un nuevo material en el inventario de la clínica.

**Parámetros:** body.nombre: string, body.sku: string (único), body.descripcion: string (opcional), body.categoria: ObjectId, body.unidadMedida: string, body.stockMinimo: number, body.proveedorPreferido: ObjectId (opcional), body.costoUnitario: number

**Respuesta:** El objeto del material recién creado.

### `GET` `/api/proveedores?minimal=true`

Obtiene una lista simplificada de proveedores (ID y nombre) para poblar el selector en el formulario.

**Respuesta:** Un array de objetos de proveedores con los campos {_id, nombre}.

### `GET` `/api/categorias-material`

Obtiene la lista de categorías de materiales para el selector correspondiente.

**Respuesta:** Un array de objetos de categorías con los campos {_id, nombre}.

## 🗂️ Estructura Backend (MERN)

Para soportar esta funcionalidad, el backend utiliza el modelo 'Material' de Mongoose para definir el esquema de datos en MongoDB. La lógica de negocio, incluyendo la validación de SKU único y la creación del registro, se maneja en 'MaterialController'. Las rutas son expuestas a través de Express en 'materialRoutes.js', que mapea los endpoints HTTP a las funciones del controlador correspondientes.

### Models

#### Material

nombre: String, sku: String (unique), descripcion: String, categoria: { type: Schema.Types.ObjectId, ref: 'CategoriaMaterial' }, unidadMedida: String, stockMinimo: Number, stockActual: { type: Number, default: 0 }, proveedorPreferido: { type: Schema.Types.ObjectId, ref: 'Proveedor' }, costoUnitario: Number, activo: { type: Boolean, default: true }, fechaCreacion: Date, fechaActualizacion: Date

#### Proveedor

nombre: String, contacto: String, ...

#### CategoriaMaterial

nombre: String, descripcion: String, ...

### Controllers

#### MaterialController

- crearMaterial
- obtenerTodosLosProveedores
- obtenerTodasLasCategorias

### Routes

#### `/api/materiales`

- POST /

#### `/api/proveedores`

- GET /

#### `/api/categorias-material`

- GET /

## 🔄 Flujos

1. El usuario accede a 'Inventario y Compras' > 'Nuevo Material'.
2. El sistema carga un formulario vacío. Simultáneamente, realiza llamadas GET a '/api/proveedores' y '/api/categorias-material' para poblar los menús desplegables.
3. El usuario completa los campos del formulario: nombre, SKU, selecciona una categoría, define el stock mínimo, etc.
4. Al hacer clic en 'Guardar', el frontend valida que los campos requeridos estén completos y tengan el formato correcto.
5. Si la validación es exitosa, se envía una solicitud POST a '/api/materiales' con los datos del formulario en el cuerpo.
6. El backend recibe la solicitud, valida los datos (especialmente la unicidad del SKU) y crea el nuevo documento 'Material' en MongoDB.
7. El backend responde con el objeto del material creado y un código de estado 201.
8. El frontend muestra un mensaje de éxito y redirige al usuario a la lista de inventario o limpia el formulario para permitir un nuevo registro.

## 📝 User Stories

- Como gestor de compras, quiero registrar nuevos materiales en el sistema con todos sus detalles (SKU, proveedor, costo) para poder generar órdenes de compra precisas.
- Como responsable de inventario, quiero añadir un nuevo material al catálogo, especificando su unidad de medida y el stock mínimo, para que el sistema me alerte cuando necesite ser reabastecido.
- Como gestor de compras, quiero poder asociar un proveedor preferido a un nuevo material para agilizar el proceso de re-compra.
- Como responsable de inventario, quiero que el sistema me impida registrar un material con un SKU que ya existe para evitar duplicados y errores en el control de stock.

## ⚙️ Notas Técnicas

- Validación: Implementar validación tanto en el frontend (React Hook Form, Zod) para una experiencia de usuario fluida, como en el backend (Mongoose/Express Validator) para garantizar la integridad de los datos. El campo SKU debe tener un índice único en la base de datos de MongoDB.
- Seguridad: Proteger el endpoint POST '/api/materiales' con middleware de autenticación y autorización para asegurar que solo los roles 'Compras' e 'Inventario' puedan crear nuevos materiales.
- Experiencia de Usuario (UX): Utilizar componentes de autocompletado para los selectores de 'Proveedor' y 'Categoría' para facilitar la búsqueda en listas largas.
- Optimización: Para los endpoints que listan proveedores y categorías, usar proyecciones de MongoDB (`.select('nombre')`) para devolver solo los datos necesarios y minimizar el tamaño de la respuesta.
- Manejo de Errores: Implementar un manejo de errores robusto para comunicar al usuario problemas como un SKU duplicado o fallos de conexión con la base de datos.

