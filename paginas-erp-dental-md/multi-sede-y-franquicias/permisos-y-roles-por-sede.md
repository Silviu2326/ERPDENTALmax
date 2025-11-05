# Permisos y Roles por Sede

**Categoría:** Multi-sede | **Módulo:** Multi-sede y Franquicias

La funcionalidad 'Permisos y Roles por Sede' es un panel de control administrativo centralizado y de alta seguridad, diseñado para la gestión granular del acceso de usuarios en un entorno de múltiples clínicas o franquicias. Su propósito principal es permitir a los administradores generales y al personal de TI definir roles de trabajo específicos (como 'Recepcionista', 'Odontólogo', 'Director de Clínica', 'Asistente Dental') y asignarles un conjunto detallado de permisos para cada sede de forma independiente. Por ejemplo, un rol de 'Recepcionista' en la 'Sede Central' podría tener permiso para gestionar la facturación, mientras que el mismo rol en una franquicia nueva podría tener ese permiso deshabilitado. Esta herramienta es fundamental dentro del módulo 'Multi-sede y Franquicias', ya que proporciona el mecanismo de control que hace posible una operación segura y segmentada. Sin esta funcionalidad, todos los usuarios tendrían el mismo nivel de acceso en todas las sedes, creando graves brechas de seguridad y problemas de gestión de datos. El sistema funciona mediante la creación de plantillas de roles que luego se asignan a usuarios específicos dentro de una o más sedes, garantizando que cada empleado solo pueda ver y manipular la información y las funcionalidades pertinentes a su puesto y su ubicación física, manteniendo la integridad y confidencialidad de los datos de pacientes y de negocio.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/multi-sede-franquicias/`

Esta funcionalidad reside dentro de la carpeta 'multi-sede-franquicias'. La página principal se define en '/pages/PermisosRolesSedePage.tsx'. Esta página utiliza componentes reutilizables de '/components/' como 'PermissionsMatrix' para mostrar y editar la matriz de permisos por rol, 'RolesList' para listar los roles existentes, y 'UserSedeRoleAssignmentModal' para asignar usuarios a roles en sedes específicas. Las llamadas al backend para obtener, crear y actualizar roles y asignaciones se gestionan a través de funciones encapsuladas en la subcarpeta '/apis/'.

### Archivos Frontend

- `/features/multi-sede-franquicias/pages/PermisosRolesSedePage.tsx`

### Componentes React

- PermissionsMatrix
- RolesList
- UserSedeRoleAssignmentModal
- RoleEditorForm

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan la creación, lectura, actualización y eliminación (CRUD) de roles, la obtención de la lista de permisos disponibles en el sistema, y la gestión de las asignaciones que vinculan usuarios, roles y sedes.

### `GET` `/api/sedes/:sedeId/roles-asignaciones`

Obtiene todos los usuarios y sus roles asignados para una sede específica.

**Parámetros:** sedeId (en la URL)

**Respuesta:** Un array de objetos, donde cada objeto contiene información del usuario y el rol que tiene asignado en esa sede.

### `GET` `/api/roles`

Obtiene la lista completa de todos los roles definidos en el sistema con sus permisos.

**Respuesta:** Un array de objetos de Rol.

### `POST` `/api/roles`

Crea un nuevo rol en el sistema.

**Parámetros:** Body: { name: string, description: string, permissions: string[] }

**Respuesta:** El objeto del nuevo rol creado.

### `PUT` `/api/roles/:roleId`

Actualiza un rol existente, incluyendo su nombre, descripción y la lista de permisos asociados.

**Parámetros:** roleId (en la URL), Body: { name: string, description: string, permissions: string[] }

**Respuesta:** El objeto del rol actualizado.

### `POST` `/api/asignaciones`

Asigna un rol específico a un usuario en una sede determinada.

**Parámetros:** Body: { userId: string, roleId: string, sedeId: string }

**Respuesta:** Un objeto de confirmación con la nueva asignación.

### `DELETE` `/api/asignaciones/:assignmentId`

Elimina la asignación de un rol a un usuario en una sede.

**Parámetros:** assignmentId (en la URL)

**Respuesta:** Un mensaje de confirmación de éxito.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con modelos para Roles y Usuarios. El modelo 'User' contiene un array de 'asignaciones' que especifica el rol y la sede para cada una de sus vinculaciones. Los controladores gestionan la lógica de negocio para roles y asignaciones, y las rutas exponen estos servicios de forma segura.

### Models

#### Role

name: String (único), description: String, permissions: [String] (array de claves de permiso, ej: 'agenda.read', 'billing.create').

#### User

..., assignments: [{ sede: { type: ObjectId, ref: 'Sede' }, role: { type: ObjectId, ref: 'Role' } }] (Array de asignaciones que vincula al usuario con un rol en una sede específica).

### Controllers

#### RoleController

- getAllRoles
- createRole
- updateRoleById

#### AssignmentController

- getAssignmentsBySede
- createAssignment
- deleteAssignmentById

### Routes

#### `/api/roles`

- GET /
- POST /
- PUT /:roleId

#### `/api/asignaciones`

- POST /
- DELETE /:assignmentId

#### `/api/sedes`

- GET /:sedeId/roles-asignaciones

## 🔄 Flujos

1. El Admin General accede a la página 'Permisos y Roles por Sede'.
2. El sistema carga y muestra una lista de los roles existentes (ej: Odontólogo, Recepcionista).
3. El admin selecciona un rol y el sistema muestra una matriz con todos los permisos disponibles, marcando los que están actualmente asignados a ese rol.
4. El admin modifica los permisos para ese rol y guarda los cambios. El sistema actualiza el rol en la base de datos.
5. Luego, el admin selecciona una sede de un desplegable. El sistema carga la lista de usuarios asignados a esa sede con sus roles.
6. El admin hace clic en 'Asignar Usuario', selecciona un usuario y un rol de la lista, y confirma. El sistema crea una nueva asignación en el perfil del usuario.

## 📝 User Stories

- Como Admin General, quiero crear roles personalizados con nombres específicos para reflejar la estructura de personal de mis clínicas.
- Como Director de TI, quiero asignar un conjunto granular de permisos a cada rol para asegurar que los empleados solo accedan a la información estrictamente necesaria para su trabajo (principio de mínimo privilegio).
- Como Admin General, quiero asignar un usuario a un rol específico dentro de una sede particular, para que su acceso esté limitado geográficamente a esa clínica.
- Como Director de TI, quiero poder modificar los permisos de un rol (ej: añadir acceso a 'Reportes Financieros' al rol 'Director de Clínica') y que el cambio se aplique automáticamente a todos los usuarios que tengan ese rol asignado.
- Como Admin General, quiero poder ver rápidamente qué usuarios y qué roles están asignados a una sede específica para realizar auditorías de acceso.

## ⚙️ Notas Técnicas

- Seguridad: Es crucial implementar un middleware en el backend que verifique en cada petición a la API si el usuario autenticado tiene el permiso necesario para la acción que intenta realizar, basándose en su rol y la sede activa en su sesión.
- JWT Payload: El token JWT del usuario debe contener su ID. Al iniciar sesión o cambiar de sede, el frontend debe solicitar los permisos actualizados para esa sesión y almacenarlos de forma segura para controlar la visibilidad de los elementos de la UI.
- Gestión de Permisos: Los permisos deben ser definidos como constantes (enums o un objeto congelado) en un archivo compartido tanto por el backend como por el frontend para mantener la consistencia y evitar errores de tipeo.
- Rendimiento: La lista completa de permisos del sistema puede ser cacheadas en el backend, ya que raramente cambia. Las consultas a la base de datos deben estar optimizadas, utilizando índices en los campos `sede` y `role` dentro del array `assignments` del modelo User.
- Atomicidad: Las operaciones de actualización de roles y asignaciones deben ser atómicas para evitar estados inconsistentes en la base de datos.

