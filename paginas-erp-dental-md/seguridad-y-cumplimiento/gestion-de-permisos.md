# Gestión de Permisos

**Categoría:** Sistema | **Módulo:** Seguridad y Cumplimiento

La funcionalidad de 'Gestión de Permisos' es el núcleo del control de acceso basado en roles (RBAC) del ERP dental. Sirve como el panel de control centralizado donde los administradores del sistema y directores con privilegios elevados pueden definir, modificar y auditar quién puede hacer qué dentro de la plataforma. Su propósito principal es garantizar la seguridad de los datos, la privacidad del paciente (cumpliendo con normativas como LOPD/RGPD) y la eficiencia operativa, asegurando que cada miembro del personal de la clínica solo tenga acceso a las herramientas e información estrictamente necesarias para su función. Dentro del módulo 'Seguridad y Cumplimiento', esta página es la herramienta de implementación activa de las políticas de seguridad. Mientras que otras partes del módulo pueden tratar sobre auditorías o configuración de contraseñas, la 'Gestión de Permisos' traduce directamente la política en reglas aplicables. El sistema permite la creación de roles (ej: 'Recepcionista', 'Odontólogo General', 'Director de Clínica', 'Higienista') y la asignación granular de permisos a cada uno. Estos permisos se estructuran por módulo (Agenda, Pacientes, Facturación, etc.) y por acción (Crear, Leer, Actualizar, Eliminar). Por ejemplo, un rol 'Recepcionista' podría tener permiso para crear y actualizar citas, pero solo leer la información básica del paciente, y no tener acceso alguno a los informes financieros.

## 👥 Roles de Acceso

- IT / Integraciones / Seguridad
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/seguridad-cumplimiento/`

Esta funcionalidad reside dentro de la carpeta 'seguridad-cumplimiento'. La página principal se define en '/pages/GestionPermisosPage.tsx'. Esta página utiliza componentes reutilizables de '/components/' como 'RolesList' para mostrar los roles disponibles y 'PermissionsMatrix' para visualizar y editar la matriz de permisos para el rol seleccionado. Las interacciones con el backend se manejan a través de funciones definidas en '/apis/permisosApi.ts', que abstraen las llamadas a la API REST.

### Archivos Frontend

- `/features/seguridad-cumplimiento/pages/GestionPermisosPage.tsx`
- `/features/seguridad-cumplimiento/components/RolesList.tsx`
- `/features/seguridad-cumplimiento/components/PermissionsMatrix.tsx`
- `/features/seguridad-cumplimiento/components/RoleEditorModal.tsx`
- `/features/seguridad-cumplimiento/apis/permisosApi.ts`

### Componentes React

- RolesList
- PermissionsMatrix
- RoleEditorModal

## 🔌 APIs Backend

La API proporciona endpoints RESTful para la gestión completa (CRUD) de roles y la asignación de permisos. Un endpoint clave provee el 'esquema de permisos' total de la aplicación, que el frontend utiliza para renderizar dinámicamente la matriz de permisos.

### `GET` `/api/security/roles`

Obtiene una lista de todos los roles definidos en el sistema.

**Respuesta:** Un array de objetos Role, cada uno con su _id, name y description.

### `POST` `/api/security/roles`

Crea un nuevo rol en el sistema.

**Parámetros:** body: { name: string, description: string }

**Respuesta:** El objeto del nuevo rol creado, incluyendo su _id.

### `GET` `/api/security/roles/{roleId}/permissions`

Obtiene el objeto de permisos detallado para un rol específico.

**Parámetros:** path: roleId (string)

**Respuesta:** Un objeto JSON que mapea módulos a acciones permitidas, ej: { 'pacientes': { 'read': true, 'create': false }, ... }

### `PUT` `/api/security/roles/{roleId}/permissions`

Actualiza el conjunto completo de permisos para un rol específico.

**Parámetros:** path: roleId (string), body: { permissions: object }

**Respuesta:** Un mensaje de confirmación de éxito.

### `DELETE` `/api/security/roles/{roleId}`

Elimina un rol. Requiere validación para asegurar que ningún usuario esté asignado a este rol.

**Parámetros:** path: roleId (string)

**Respuesta:** Un mensaje de confirmación de éxito.

### `GET` `/api/security/permissions-schema`

Devuelve la estructura completa de todos los permisos posibles en la aplicación. Usado por el frontend para construir la UI de la matriz de permisos.

**Respuesta:** Un objeto que define todos los módulos y acciones controlables, ej: { 'agenda': ['create', 'read', 'update', 'delete'], 'facturacion': ['read', 'generate_invoice'] }

## 🗂️ Estructura Backend (MERN)

El backend utiliza dos modelos principales: 'Role' para definir los permisos y 'User' para asignar un rol a cada usuario. Un 'RoleController' maneja la lógica de negocio, y las rutas se exponen a través de un router de Express bajo '/api/security'. Es fundamental un middleware de autorización que intercepte cada petición a la API, verifique el rol del usuario y sus permisos antes de permitir el acceso al controlador solicitado.

### Models

#### Role

name: { type: String, required: true, unique: true }, description: String, permissions: { type: Map, of: Map, of: Boolean } // Estructura anidada ej: permissions.get('agenda').get('read') -> true

#### User

email: String, passwordHash: String, name: String, role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }

### Controllers

#### RoleController

- getAllRoles
- createRole
- deleteRole
- getRolePermissions
- updateRolePermissions
- getPermissionsSchema

### Routes

#### `/api/security`

- GET /roles
- POST /roles
- GET /roles/:roleId/permissions
- PUT /roles/:roleId/permissions
- DELETE /roles/:roleId
- GET /permissions-schema

## 🔄 Flujos

1. El Administrador de IT navega a 'Sistema -> Seguridad y Cumplimiento -> Gestión de Permisos'.
2. La página carga y muestra la lista de roles existentes en un panel lateral.
3. El administrador selecciona el rol 'Recepcionista'. La vista principal se actualiza mostrando una matriz con todos los módulos del ERP en filas y las acciones (Ver, Crear, Editar, Borrar) en columnas.
4. El administrador marca la casilla 'Ver' para el módulo 'Informes Financieros (Básico)' y desmarca 'Borrar' para 'Fichas de Pacientes'.
5. Al hacer clic en 'Guardar Cambios', se envía una petición PUT a '/api/security/roles/{id_recepcionista}/permissions' con el nuevo objeto de permisos.
6. El sistema confirma el cambio. A partir de ese momento, cualquier usuario con el rol 'Recepcionista' podrá ver informes básicos, pero ya no podrá eliminar pacientes.

## 📝 User Stories

- Como Director General, quiero crear un nuevo rol llamado 'Auditor Externo' y darle acceso de solo lectura a los módulos de facturación y contabilidad para facilitar las auditorías sin comprometer la seguridad de los datos de los pacientes.
- Como Administrador de Seguridad, quiero modificar los permisos del rol 'Odontólogo' para revocar el acceso a la exportación masiva de datos de pacientes y así prevenir fugas de información.
- Como jefe de una nueva clínica en la organización, quiero clonar el rol 'Recepcionista' de otra sede y hacerle pequeños ajustes, en lugar de configurarlo desde cero.
- Como Administrador de IT, quiero una vista general de todos los permisos de todos los roles para poder documentar y verificar fácilmente que se cumplen nuestras políticas de acceso.

## ⚙️ Notas Técnicas

- Seguridad Crítica: Todos los endpoints de '/api/security' deben estar protegidos por un middleware que verifique que el usuario solicitante tiene el rol de 'IT / Seguridad' o 'Admin General'.
- Registro de Auditoría: Cualquier cambio en los permisos (creación, modificación o eliminación de un rol) debe ser registrado en una colección de logs de auditoría, guardando quién hizo el cambio, qué cambio se hizo y cuándo.
- Middleware de Autorización Global: La implementación de un middleware de Express es esencial. Este middleware se ejecutará en casi todas las rutas de la API, decodificará el token del usuario, cargará su rol y permisos, y lo comparará con el permiso requerido para el endpoint solicitado.
- Evitar eliminación de roles en uso: La lógica del endpoint DELETE /api/security/roles/{roleId} debe verificar primero si algún usuario tiene asignado ese rol. Si es así, debe devolver un error y prevenir la eliminación.
- El 'permissions-schema' puede generarse dinámicamente en el backend a partir de una configuración central o un archivo de definición, facilitando la adición de nuevos módulos y permisos a medida que el ERP crece.

