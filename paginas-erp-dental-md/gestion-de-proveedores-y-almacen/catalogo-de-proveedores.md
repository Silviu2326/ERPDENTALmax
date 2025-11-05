# Catálogo de Proveedores

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

El Catálogo de Proveedores es una funcionalidad central dentro del módulo de 'Gestión de Proveedores y Almacén'. Actúa como un directorio centralizado y detallado de todas las empresas y personas que suministran materiales, equipos y servicios a la clínica dental. Su propósito principal es estandarizar y organizar la información de los proveedores, facilitando procesos críticos como la creación de órdenes de compra, la gestión de inventario y el control financiero. En esta página, el personal autorizado puede registrar, consultar, editar y desactivar proveedores. Cada registro incluye información vital como nombre comercial, razón social, RFC, datos de contacto, dirección, condiciones de pago, y las categorías de productos que suministran (ej: material de ortodoncia, implantes, consumibles, servicios de laboratorio). Un catálogo bien gestionado es crucial para la eficiencia operativa de la clínica; permite comparar precios, negociar mejores condiciones, asegurar la calidad de los insumos y agilizar todo el ciclo de adquisición. Además, sirve como una base de datos histórica, permitiendo al departamento de finanzas rastrear pagos y conciliar facturas de manera efectiva. Al estar integrado con el inventario, permite asociar productos específicos a sus proveedores, simplificando la reposición de stock.

## 👥 Roles de Acceso

- Compras / Inventario
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Toda la lógica de frontend para la gestión de proveedores reside en la carpeta '/features/gestion-proveedores-almacen/'. La página principal es 'CatalogoProveedoresPage.tsx' dentro de la subcarpeta '/pages'. Esta página utiliza componentes reutilizables de '/components/', como 'ProveedoresTable' para mostrar la lista de proveedores, 'FormularioProveedor' (usado en un modal) para crear y editar registros, y 'FiltrosBusquedaProveedores' para la búsqueda y filtrado. Las llamadas a la API del backend están encapsuladas en funciones dentro de '/apis/proveedoresApi.ts', manteniendo la lógica de comunicación separada de los componentes de la UI.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/CatalogoProveedoresPage.tsx`
- `/features/gestion-proveedores-almacen/components/ProveedoresTable.tsx`
- `/features/gestion-proveedores-almacen/components/FormularioProveedor.tsx`
- `/features/gestion-proveedores-almacen/components/FiltrosBusquedaProveedores.tsx`
- `/features/gestion-proveedores-almacen/components/ModalDetalleProveedor.tsx`
- `/features/gestion-proveedores-almacen/apis/proveedoresApi.ts`

### Componentes React

- ProveedoresTable
- FormularioProveedor
- FiltrosBusquedaProveedores
- ModalDetalleProveedor
- BotonAccionesTabla

## 🔌 APIs Backend

Las APIs para el catálogo de proveedores deben soportar operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar) y permitir la búsqueda y filtrado avanzado para gestionar eficientemente la base de datos de proveedores.

### `GET` `/api/proveedores`

Obtiene una lista paginada y filtrada de todos los proveedores. Permite buscar por texto y filtrar por estado o categoría.

**Parámetros:** page (number): Número de página para la paginación., limit (number): Cantidad de resultados por página., search (string): Término de búsqueda para nombre comercial o RFC., estado (string): 'activo' o 'inactivo' para filtrar por estado.

**Respuesta:** Un objeto con una lista de proveedores y metadatos de paginación (total de documentos, total de páginas, página actual).

### `POST` `/api/proveedores`

Crea un nuevo proveedor en la base de datos.

**Parámetros:** Body (JSON): Objeto con todos los datos del nuevo proveedor (nombreComercial, rfc, contactoPrincipal, etc.).

**Respuesta:** El objeto del proveedor recién creado.

### `GET` `/api/proveedores/{id}`

Obtiene los detalles completos de un proveedor específico por su ID.

**Parámetros:** id (string): ID único del proveedor.

**Respuesta:** El objeto completo del proveedor solicitado.

### `PUT` `/api/proveedores/{id}`

Actualiza la información de un proveedor existente.

**Parámetros:** id (string): ID único del proveedor a actualizar., Body (JSON): Objeto con los campos a modificar.

**Respuesta:** El objeto del proveedor con la información actualizada.

### `DELETE` `/api/proveedores/{id}`

Realiza un borrado lógico (soft delete) de un proveedor, cambiando su estado a 'inactivo'.

**Parámetros:** id (string): ID único del proveedor a desactivar.

**Respuesta:** Un mensaje de confirmación de la desactivación.

## 🗂️ Estructura Backend (MERN)

El backend sigue una arquitectura MERN. El modelo 'Proveedor' define el esquema de datos en MongoDB. El 'ProveedorController' contiene la lógica de negocio para cada operación CRUD. Las rutas en Express, definidas en 'proveedorRoutes', mapean los endpoints HTTP a las funciones correspondientes del controlador.

### Models

#### Proveedor

nombreComercial (String, required), razonSocial (String), rfc (String, unique), contactoPrincipal: { nombre: String, email: String, telefono: String }, direccion: { calle: String, ciudad: String, estado: String, codigoPostal: String }, condicionesPago (String), categorias: [String], notas (String), estado (String, enum: ['activo', 'inactivo'], default: 'activo'), createdAt (Date), updatedAt (Date)

### Controllers

#### ProveedorController

- obtenerProveedores
- crearProveedor
- obtenerProveedorPorId
- actualizarProveedor
- desactivarProveedor

### Routes

#### `/api/proveedores`

- router.get('/', obtenerProveedores)
- router.post('/', crearProveedor)
- router.get('/:id', obtenerProveedorPorId)
- router.put('/:id', actualizarProveedor)
- router.delete('/:id', desactivarProveedor)

## 🔄 Flujos

1. El usuario de Compras accede a la página y ve una tabla con los proveedores activos, paginada.
2. Para encontrar a un proveedor específico, utiliza la barra de búsqueda por nombre o RFC.
3. Para añadir un nuevo proveedor, hace clic en 'Nuevo Proveedor', se abre un modal con el 'FormularioProveedor', completa los datos y guarda. El nuevo proveedor aparece en la tabla.
4. Para editar un proveedor, hace clic en el icono de 'Editar' en la fila correspondiente, el modal se abre con los datos precargados, realiza los cambios y guarda.
5. El usuario de Finanzas necesita desactivar un proveedor que ya no opera con la clínica. Lo busca, hace clic en 'Desactivar', confirma la acción en un diálogo, y el proveedor deja de aparecer en la lista por defecto (filtrada por 'activos').

## 📝 User Stories

- Como gestor de compras, quiero ver una lista de todos nuestros proveedores con su información de contacto principal para poder realizar pedidos rápidamente.
- Como gestor de compras, quiero poder agregar nuevos proveedores al sistema, incluyendo su RFC, dirección y condiciones de pago, para mantener nuestro catálogo actualizado.
- Como personal de finanzas, quiero buscar un proveedor por su razón social o RFC para verificar los datos de facturación y pagos pendientes.
- Como gestor de inventario, quiero filtrar proveedores por categoría de productos (ej. 'Implantes') para encontrar rápidamente a los especialistas en un área.
- Como gestor de compras, quiero poder desactivar proveedores con los que ya no trabajamos para mantener la lista limpia y relevante, sin perder el historial de compras.

## ⚙️ Notas Técnicas

- Seguridad: Implementar middleware de autenticación y autorización en las rutas del backend para asegurar que solo los roles 'Compras / Inventario' y 'Contable / Finanzas' puedan acceder y modificar la información.
- Rendimiento: Utilizar índices en la colección de MongoDB sobre los campos 'nombreComercial', 'rfc' y 'estado' para optimizar las consultas de búsqueda y filtrado.
- Validación de Datos: Aplicar validación tanto en el frontend (formularios React) como en el backend (usando librerías como Joi o express-validator) para garantizar la integridad de los datos, especialmente en campos únicos como el RFC.
- Borrado Lógico (Soft Delete): La operación DELETE no debe eliminar el registro de la base de datos, sino cambiar un campo 'estado' a 'inactivo'. Esto es crucial para mantener la integridad referencial con órdenes de compra y facturas históricas.
- Experiencia de Usuario (UX): La tabla de proveedores debe incluir ordenación por columnas y la búsqueda debe ser reactiva. El formulario de creación/edición debe estar en un modal para no perder el contexto de la lista principal.

