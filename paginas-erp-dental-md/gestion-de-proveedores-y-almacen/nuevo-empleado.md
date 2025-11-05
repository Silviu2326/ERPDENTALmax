# Nuevo Empleado

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad 'Nuevo Empleado' es una página crítica dentro del ERP dental, diseñada para que el departamento de Recursos Humanos pueda dar de alta a nuevos miembros del personal de la clínica de manera centralizada y segura. A pesar de estar alojada conceptualmente bajo el módulo 'Gestión de Proveedores y Almacén', su categoría 'Gestión de Recursos' la posiciona correctamente como la herramienta para administrar el recurso más valioso de la clínica: su capital humano. Esta aparente incongruencia se resuelve al entender el módulo padre como un gestor de todos los 'recursos' necesarios para el funcionamiento de la clínica, tanto materiales (proveedores, stock) como humanos (personal). Esta página consiste en un formulario exhaustivo y estructurado que captura toda la información relevante de un nuevo empleado, abarcando desde datos personales básicos (nombre, DNI, dirección) hasta información contractual detallada (puesto, salario, tipo de contrato, fecha de inicio) y credenciales de acceso al sistema. Su propósito es crear un perfil único y completo para cada empleado, que servirá como la fuente única de verdad en todo el ERP. Este perfil se integra con otros módulos: en 'Agenda', para asignar odontólogos o higienistas a las citas; en 'Facturación', para calcular comisiones; y en 'Historial Clínico', para registrar qué profesional realizó cada tratamiento, garantizando la trazabilidad y el cumplimiento normativo. Además, permite adjuntar documentación esencial como contratos, titulaciones o identificaciones, digitalizando y asegurando el expediente del empleado.

## 👥 Roles de Acceso

- RR. HH.
- Administrador del Sistema

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

La funcionalidad 'Nuevo Empleado' se encapsula dentro de la feature 'gestion-proveedores-almacen'. La página principal, 'NuevoEmpleadoPage.tsx', se encuentra en la subcarpeta '/pages'. Esta página importa y organiza múltiples componentes React reutilizables desde la carpeta '/components', como formularios para datos personales, contractuales y de acceso. Todas las interacciones con el backend, como el envío del formulario o la obtención de listas de roles, se gestionan a través de funciones definidas en la carpeta '/apis', que abstraen las llamadas a la API RESTful.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/NuevoEmpleadoPage.tsx`
- `/features/gestion-proveedores-almacen/components/FormularioNuevoEmpleado.tsx`
- `/features/gestion-proveedores-almacen/components/SeccionDatosPersonales.tsx`
- `/features/gestion-proveedores-almacen/components/SeccionInformacionContractual.tsx`
- `/features/gestion-proveedores-almacen/components/SeccionAccesosSistema.tsx`
- `/features/gestion-proveedores-almacen/apis/empleadosApi.ts`

### Componentes React

- NuevoEmpleadoPage
- FormularioNuevoEmpleado
- SeccionDatosPersonales
- SeccionInformacionContractual
- SeccionAccesosSistema
- UploaderDocumentosEmpleado

## 🔌 APIs Backend

Se requiere un conjunto de APIs para gestionar la creación de empleados. El endpoint principal es para crear el nuevo registro de empleado en la base de datos. Adicionalmente, se necesitan endpoints para obtener datos auxiliares (como la lista de roles disponibles para asignar) y para manejar la subida de archivos adjuntos.

### `POST` `/api/empleados`

Crea un nuevo registro de empleado con toda su información personal, contractual y de sistema.

**Parámetros:** Body: Objeto JSON con los datos del empleado (nombre, apellidos, dni, email, fechaContratacion, salario, puesto, rolId, etc.)

**Respuesta:** Objeto JSON del empleado recién creado, incluyendo su _id único.

### `GET` `/api/roles`

Obtiene la lista de todos los roles de sistema disponibles (ej: Odontólogo, Recepcionista, RR. HH.) para poblar el selector en el formulario.

**Respuesta:** Array de objetos JSON, donde cada objeto representa un rol con su _id y nombre.

### `POST` `/api/empleados/:id/documentos`

Sube un archivo (DNI, contrato, etc.) y lo asocia con un empleado existente. El ':id' es el del empleado recién creado.

**Parámetros:** Path: id del empleado., Body: FormData con el archivo y metadatos (ej: tipoDeDocumento).

**Respuesta:** Objeto JSON con los metadatos del archivo subido y su URL de acceso.

## 🗂️ Estructura Backend (MERN)

El backend sigue la arquitectura MERN. El modelo 'Empleado' define la estructura de los datos en MongoDB. El 'EmpleadoController' contiene la lógica de negocio para validar los datos y crear el empleado, interactuando con el modelo. Las rutas en 'empleadoRoutes.js' exponen los endpoints del controlador a través de Express, aplicando middlewares de autenticación y autorización para asegurar que solo los roles permitidos puedan acceder.

### Models

#### Empleado

nombre: String, apellidos: String, dni: { type: String, unique: true }, email: { type: String, unique: true }, telefono: String, direccion: Object, fechaNacimiento: Date, puesto: String, fechaContratacion: Date, salario: Number, tipoContrato: String, numeroSeguridadSocial: String, datosBancarios: Object, activo: { type: Boolean, default: true }, usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario' }, documentos: [{ nombre: String, url: String, fechaSubida: Date }]

#### Usuario

email: { type: String, unique: true }, password: String (hashed), rolId: { type: Schema.Types.ObjectId, ref: 'Rol' }, empleadoId: { type: Schema.Types.ObjectId, ref: 'Empleado' }, activo: Boolean

### Controllers

#### EmpleadoController

- crearEmpleado
- subirDocumentoEmpleado

#### RolController

- obtenerTodosLosRoles

### Routes

#### `/api/empleados`

- POST /
- POST /:id/documentos

#### `/api/roles`

- GET /

## 🔄 Flujos

1. El usuario de RR.HH. accede a 'Gestión de Recursos' y selecciona la opción 'Nuevo Empleado'.
2. Se muestra un formulario multi-paso: 'Datos Personales', 'Información Contractual' y 'Acceso al Sistema'.
3. El usuario completa los campos obligatorios en cada sección. El sistema realiza validaciones en tiempo real (formato de DNI, email, etc.).
4. En la sección 'Acceso al Sistema', el usuario selecciona un rol de una lista desplegable (cargada desde la API) y establece una contraseña inicial.
5. El usuario puede opcionalmente subir documentos como el contrato firmado o el DNI escaneado.
6. Al hacer clic en 'Guardar Empleado', el frontend envía los datos al endpoint POST /api/empleados.
7. El backend valida los datos, crea el registro en la colección 'Empleados', crea un registro asociado en la colección 'Usuarios' y devuelve el nuevo objeto de empleado.
8. El frontend recibe la confirmación y redirige al usuario a la lista de empleados o al perfil del nuevo empleado, mostrando un mensaje de éxito.

## 📝 User Stories

- Como miembro de RR.HH., quiero registrar todos los datos personales y de contacto de un nuevo empleado para tener un registro completo y oficial.
- Como miembro de RR.HH., quiero definir la información contractual, como salario, tipo de contrato y fecha de inicio, para gestionar la nómina y las obligaciones legales.
- Como miembro de RR.HH., quiero asignar un rol y permisos específicos en el sistema a un nuevo empleado para controlar su acceso a las diferentes funcionalidades del ERP.
- Como miembro de RR.HH., quiero subir documentos importantes como su DNI, contrato y titulaciones para mantener un expediente digital centralizado y seguro.

## ⚙️ Notas Técnicas

- Seguridad: Toda la información personal identificable (PII) debe ser encriptada en tránsito (SSL/TLS) y en reposo. El acceso a esta funcionalidad debe estar estrictamente controlado por roles (RBAC). Se debe realizar una validación exhaustiva de todos los datos de entrada en el backend (usando Zod o Joi) para prevenir ataques de inyección.
- Almacenamiento de Archivos: Los documentos de los empleados no deben almacenarse en la base de datos ni en el sistema de archivos del servidor. Utilizar un servicio de almacenamiento en la nube como AWS S3 o Google Cloud Storage para mayor seguridad, escalabilidad y disponibilidad.
- Integración de Módulos: La creación de un empleado debe desencadenar la creación de una cuenta de usuario asociada. El `empleadoId` generado será la clave foránea en otros módulos (citas, tratamientos, etc.) para vincular acciones a un profesional específico.
- Experiencia de Usuario (UX): Implementar un formulario dividido en secciones o pasos (wizard) para no abrumar al usuario. Utilizar componentes de carga y notificaciones (toasts) para proporcionar feedback claro durante el proceso de guardado y subida de archivos.
- Atomicidad: La creación del empleado y su cuenta de usuario asociada debe ser una operación atómica. Si falla la creación del usuario, se debe revertir la creación del empleado (o viceversa), utilizando transacciones de MongoDB si es posible.

