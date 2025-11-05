# Asignación de Permisos y Roles

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad de 'Asignación de Permisos y Roles' es un componente de seguridad y administración fundamental dentro del ERP dental, específicamente en el contexto de la 'Gestión de Proveedores y Almacén'. Su propósito principal es establecer un sistema de control de acceso basado en roles (RBAC - Role-Based Access Control) que dicta qué acciones puede realizar cada usuario dentro de este módulo. Permite a los administradores del sistema (como IT, RR.HH. o Directores) definir roles laborales específicos, como 'Jefe de Almacén', 'Auxiliar de Compras' o 'Auditor de Inventario', y asignarles un conjunto granular de permisos. Estos permisos pueden incluir acciones como 'Crear nuevo proveedor', 'Ver pedidos de compra', 'Aprobar pedidos de compra mayores a 500€', 'Ajustar stock de un producto' o 'Generar informes de inventario'. Al centralizar la gestión de permisos, se garantiza la coherencia, se minimizan los errores humanos y se previene el acceso no autorizado a información sensible o a funciones críticas, como la modificación de precios de proveedores o la eliminación de registros de stock. Esta página interactúa directamente con los modelos de Usuario y Rol para asegurar que, cuando un usuario inicie sesión, sus permisos sean cargados y aplicados en toda la interfaz, deshabilitando o ocultando botones, campos y páginas a los que no debería tener acceso.

## 👥 Roles de Acceso

- IT / Integraciones / Seguridad
- RR. HH.
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Esta funcionalidad se aloja dentro de la carpeta del módulo padre 'gestion-proveedores-almacen'. La página principal, 'PermisosRolesPage.tsx', reside en la subcarpeta '/pages'. Esta página utiliza componentes de la carpeta '/components', como 'RolesListComponent' para mostrar la lista de roles y 'PermissionsMatrixComponent' para la asignación visual de permisos. Todas las interacciones con el backend se gestionan a través de funciones definidas en '/apis/rolesApi.ts', que se encargan de las llamadas a los endpoints de la API REST.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/PermisosRolesPage.tsx`
- `/features/gestion-proveedores-almacen/components/RolesListComponent.tsx`
- `/features/gestion-proveedores-almacen/components/PermissionsMatrixComponent.tsx`
- `/features/gestion-proveedores-almacen/components/ModalGestionRol.tsx`
- `/features/gestion-proveedores-almacen/apis/rolesApi.ts`

### Componentes React

- PermisosRolesPage
- RolesListComponent
- PermissionsMatrixComponent
- ModalGestionRol
- PermissionGroup

## 🔌 APIs Backend

La API RESTful para esta funcionalidad gestiona las operaciones CRUD para los roles y la consulta de los permisos disponibles. Permite crear nuevos roles, listar los existentes, y lo más importante, actualizar los permisos asociados a un rol específico.

### `GET` `/api/roles`

Obtiene una lista de todos los roles definidos en el sistema.

**Respuesta:** Un array de objetos de Rol, cada uno con su id, nombre y descripción.

### `POST` `/api/roles`

Crea un nuevo rol en el sistema.

**Parámetros:** body: { nombre: string, descripcion: string, permisos: [string] }

**Respuesta:** El objeto del nuevo Rol creado.

### `GET` `/api/roles/:id`

Obtiene los detalles de un rol específico, incluyendo la lista de IDs de permisos asociados.

**Parámetros:** path: id (ID del rol)

**Respuesta:** Un objeto de Rol con sus detalles y permisos populados.

### `PUT` `/api/roles/:id`

Actualiza la información de un rol, principalmente su nombre, descripción y la lista de permisos asignados.

**Parámetros:** path: id (ID del rol), body: { nombre: string, descripcion: string, permisos: [string] }

**Respuesta:** El objeto del Rol actualizado.

### `DELETE` `/api/roles/:id`

Elimina un rol del sistema. Debe incluir una validación para no permitir eliminar roles en uso.

**Parámetros:** path: id (ID del rol)

**Respuesta:** Un mensaje de confirmación.

### `GET` `/api/permissions`

Obtiene la lista completa de permisos disponibles en el sistema, agrupados por módulo.

**Respuesta:** Un objeto donde las claves son los módulos y los valores son arrays de objetos de Permiso.

## 🗂️ Estructura Backend (MERN)

El backend utiliza Mongoose para definir los esquemas 'Role' y 'Permission'. El modelo 'User' se modifica para incluir una referencia a los roles. Un 'RoleController' contiene la lógica para manejar las operaciones CRUD, y las rutas de Express en 'roleRoutes.js' exponen estos controladores como endpoints de la API.

### Models

#### Role

nombre: String (único, requerido), descripcion: String, permisos: [{ type: Schema.Types.ObjectId, ref: 'Permission' }], isSystemRole: Boolean (para roles por defecto no eliminables)

#### Permission

clave: String (único, requerido, ej: 'proveedor.crear'), descripcion: String, modulo: String (ej: 'Gestión de Proveedores y Almacén')

#### User

(Campos existentes...) roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }] (se añade este campo para vincular usuarios a roles)

### Controllers

#### RoleController

- getAllRoles
- createRole
- getRoleById
- updateRole
- deleteRole

#### PermissionController

- getAllPermissions

### Routes

#### `/api/roles`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id

#### `/api/permissions`

- GET /

## 🔄 Flujos

1. El Administrador navega a la sección de 'Asignación de Permisos y Roles'.
2. La interfaz carga y muestra una lista de roles existentes en una columna o tabla.
3. El Administrador selecciona un rol de la lista.
4. Al seleccionar un rol, la interfaz muestra una matriz con todos los permisos disponibles, agrupados por submódulo ('Proveedores', 'Almacén', etc.), marcando las casillas de los permisos que el rol seleccionado ya posee.
5. El Administrador puede crear un nuevo rol haciendo clic en un botón, lo que abre un modal para introducir nombre y descripción.
6. El Administrador modifica los permisos de un rol marcando o desmarcando las casillas y luego hace clic en 'Guardar'.
7. El frontend envía la solicitud PUT a '/api/roles/:id' con la nueva lista de IDs de permisos.
8. El backend actualiza el documento del rol en MongoDB, y los cambios se reflejan en todos los usuarios con ese rol en su próximo inicio de sesión o refresco de token.

## 📝 User Stories

- Como Director General, quiero crear un rol 'Jefe de Compras' y asignarle permisos para crear/editar proveedores y aprobar pedidos de compra, para poder delegar estas responsabilidades de forma segura.
- Como Administrador de IT, quiero modificar los permisos del rol 'Recepcionista de Almacén' para quitarle el permiso de 'Ajustar Stock' y evitar modificaciones accidentales en el inventario.
- Como responsable de RR. HH., quiero poder consultar rápidamente qué permisos tiene asignado un rol específico para verificar si se alinea con la descripción del puesto de trabajo.
- Como Administrador de IT, quiero que el sistema me impida eliminar un rol si hay usuarios asignados a él, para evitar dejar cuentas de usuario en un estado inconsistente.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un middleware de autorización en el backend (ej: 'checkPermission('proveedor.crear')') que se ejecutará en cada endpoint relevante para verificar si el rol del usuario autenticado tiene el permiso necesario. Este middleware es crucial y debe ser utilizado en todas las rutas de la aplicación.
- Atomicidad: Las operaciones de actualización de permisos en el backend deben ser atómicas. Al actualizar un rol, el reemplazo del array de permisos debe ser una única operación para evitar inconsistencias.
- Rendimiento: La lista de permisos y roles no suele ser muy grande, pero las consultas deben usar '.populate()' de Mongoose de forma eficiente para obtener la información relacionada sin causar cuellos de botella.
- Frontend State Management: Utilizar un gestor de estado como Redux Toolkit o Zustand para manejar el estado global de los roles y permisos, facilitando la actualización de la UI en tiempo real tras una modificación.
- Seed de Permisos: Se recomienda crear un script de 'seeding' que popule la colección de 'Permission' con todos los permisos disponibles en el sistema durante el despliegue inicial o las actualizaciones. Esto asegura que la base de datos esté sincronizada con el código.

