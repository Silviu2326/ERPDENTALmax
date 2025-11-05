# Ficha de Empleado

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La Ficha de Empleado es una funcionalidad crítica dentro del ERP dental, diseñada para centralizar toda la información relevante de cada miembro del personal de la clínica o red de clínicas. Actúa como un expediente digital único y completo que abarca desde datos personales y de contacto hasta información contractual, profesional, y de rendimiento. Aunque se encuentra dentro del módulo 'Gestión de Proveedores y Almacén', se conceptualiza bajo la categoría de 'Gestión de Recursos', considerando a los empleados como el recurso más valioso de la organización. Esta funcionalidad permite a los roles autorizados, como RR. HH. y la dirección general, gestionar el ciclo de vida completo de un empleado: alta, modificaciones y baja. La ficha almacena datos como DNI, dirección, información bancaria para nóminas, tipo de contrato, salario, fecha de inicio, rol (odontólogo, higienista, recepcionista, etc.), especialidad, número de colegiado y clínicas asignadas. Además, incluye un gestor documental para adjuntar archivos importantes como el contrato firmado, titulaciones o identificaciones. Su propósito es optimizar la administración de personal, asegurar el cumplimiento normativo, facilitar la gestión de nóminas y permisos, y proporcionar a la dirección una visión clara y actualizada de la estructura de su equipo en tiempo real, algo fundamental en modelos multisede.

## 👥 Roles de Acceso

- RR. HH.
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Toda la lógica de frontend para la gestión de empleados reside en la carpeta '/features/gestion-proveedores-almacen/'. La subcarpeta '/apis/' contiene el cliente API (ej. 'empleadosApi.ts') para interactuar con el backend. En '/components/' se ubican los componentes reutilizables de la ficha, como formularios de datos personales, secciones de contrato, etc. Finalmente, '/pages/' contiene las vistas principales: una para el listado general de empleados con filtros y buscador, y otra para la vista de detalle, creación y edición de una ficha de empleado específica.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/ListaEmpleadosPage.tsx`
- `/features/gestion-proveedores-almacen/pages/FichaEmpleadoDetailPage.tsx`
- `/features/gestion-proveedores-almacen/components/EmpleadoForm.tsx`
- `/features/gestion-proveedores-almacen/components/DocumentosEmpleadoSection.tsx`
- `/features/gestion-proveedores-almacen/apis/empleadosApi.ts`

### Componentes React

- TablaEmpleados
- FiltrosBusquedaEmpleados
- EmpleadoFormGeneral
- SeccionDatosPersonales
- SeccionDatosContractuales
- SeccionDatosProfesionales
- GestorDocumentosEmpleado
- ModalAsignacionClinica

## 🔌 APIs Backend

La API RESTful para la Ficha de Empleado proporciona los endpoints necesarios para realizar operaciones CRUD (Crear, Leer, Actualizar, Borrar) sobre los datos de los empleados, así como para gestionar la documentación asociada.

### `GET` `/api/empleados`

Obtiene un listado paginado de todos los empleados. Permite filtrar por clínica, rol y estado (activo/inactivo).

**Parámetros:** page (number), limit (number), clinicaId (string, opcional), rol (string, opcional), estado (string, opcional)

**Respuesta:** Un objeto con la lista de empleados y metadatos de paginación.

### `POST` `/api/empleados`

Crea un nuevo registro de empleado en la base de datos.

**Parámetros:** Body (JSON con los datos del nuevo empleado)

**Respuesta:** El objeto del empleado recién creado.

### `GET` `/api/empleados/:id`

Obtiene los detalles completos de la ficha de un empleado específico por su ID.

**Parámetros:** id (string, en la URL)

**Respuesta:** El objeto completo del empleado.

### `PUT` `/api/empleados/:id`

Actualiza la información de un empleado existente.

**Parámetros:** id (string, en la URL), Body (JSON con los campos a actualizar)

**Respuesta:** El objeto del empleado actualizado.

### `DELETE` `/api/empleados/:id`

Realiza una baja lógica (soft delete) del empleado, marcándolo como inactivo en el sistema.

**Parámetros:** id (string, en la URL)

**Respuesta:** Un mensaje de confirmación.

### `POST` `/api/empleados/:id/documentos`

Sube un archivo (contrato, DNI, título) y lo asocia a la ficha de un empleado.

**Parámetros:** id (string, en la URL), FormData con el archivo y metadatos (tipo de documento)

**Respuesta:** El array actualizado de documentos del empleado.

## 🗂️ Estructura Backend (MERN)

El backend sigue la arquitectura MERN. El modelo 'Empleado' define el esquema en MongoDB. El 'EmpleadoController' contiene toda la lógica de negocio para gestionar los datos de los empleados, incluyendo validaciones y la interacción con la base de datos. Las rutas, definidas en 'empleadoRoutes.js', mapean los endpoints de la API a las funciones correspondientes del controlador.

### Models

#### Empleado

nombre (string), apellidos (string), dni (string, unique), fechaNacimiento (date), direccion (object), contacto (object: {email, telefono}), datosProfesionales (object: {rol, especialidad, numeroColegiado}), datosContractuales (object: {tipoContrato, salario, fechaInicio, fechaFin}), clinicasAsignadas (array de ObjectId referenciando a 'Clinica'), userId (ObjectId referenciando a 'User'), documentos (array de objects: {nombre, url, tipo}), activo (boolean, default: true)

### Controllers

#### EmpleadoController

- getAllEmpleados
- createEmpleado
- getEmpleadoById
- updateEmpleado
- deactivateEmpleado
- uploadDocumentoEmpleado
- deleteDocumentoEmpleado

### Routes

#### `/api/empleados`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id
- POST /:id/documentos

## 🔄 Flujos

1. Flujo de Alta: El personal de RR. HH. accede a 'Gestión de Recursos', selecciona 'Crear Nuevo Empleado', completa el formulario con todos los datos requeridos, asigna el empleado a una o varias clínicas, y sube su contrato y DNI. El sistema crea el registro y, opcionalmente, un usuario de acceso asociado.
2. Flujo de Consulta y Actualización: Un director general filtra la lista de empleados por 'Clínica Central'. Selecciona a un odontólogo para revisar su ficha. Desde la ficha, actualiza su salario debido a una promoción y guarda los cambios.
3. Flujo de Baja: Un empleado finaliza su relación laboral. RR. HH. busca al empleado en el sistema, accede a su ficha y utiliza la opción 'Dar de Baja'. El estado del empleado cambia a 'inactivo', ocultándolo de las listas activas pero conservando su historial para fines legales y de consulta.

## 📝 User Stories

- Como miembro de RR. HH., quiero crear una nueva ficha de empleado con todos sus datos personales, contractuales y profesionales para mantener un registro centralizado y preciso.
- Como Director General, quiero ver un listado de todos los empleados y poder filtrarlos por clínica y rol para tener una visión clara de la estructura de personal de la empresa.
- Como miembro de RR. HH., quiero adjuntar documentos importantes (DNI, contrato, titulaciones) a la ficha de un empleado para tener toda la documentación legal en un solo lugar y de fácil acceso.
- Como Director General, quiero poder actualizar el salario y el tipo de contrato de un empleado directamente en su ficha para reflejar promociones o cambios en sus condiciones laborales.
- Como miembro de RR. HH., quiero poder dar de baja a un empleado (marcarlo como inactivo) en el sistema cuando finalice su contrato, sin perder su historial.

## ⚙️ Notas Técnicas

- Seguridad y Permisos: Implementar un sistema de control de acceso basado en roles (RBAC) estricto. Solo RR. HH. y Directores deben poder ver/editar datos sensibles como el salario. El resto de roles (ej. Odontólogo) no deberían poder acceder a las fichas de otros empleados.
- Protección de Datos (GDPR/LOPD): Asegurar que todos los datos personales se almacenan y procesan cumpliendo la normativa vigente. Los campos sensibles en la base de datos deberían estar encriptados.
- Integración con Autenticación: El modelo `Empleado` debe estar vinculado a un modelo `User`. Al crear un empleado que necesite acceso al ERP, se debe poder generar automáticamente su cuenta de usuario con los permisos correspondientes a su rol.
- Gestión de Archivos Segura: La subida de documentos debe gestionarse a través de un servicio de almacenamiento seguro como AWS S3 o similar, en lugar de guardarlos directamente en el servidor de la aplicación, para garantizar escalabilidad y seguridad.
- Auditoría: Es recomendable implementar un sistema de logs o un historial de cambios en la ficha del empleado para registrar quién, cuándo y qué modificó, especialmente en campos críticos como el salario o los datos bancarios.

