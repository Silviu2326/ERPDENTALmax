# Nueva Orden de Trabajo

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad 'Nueva Orden de Trabajo' es un componente esencial dentro del módulo 'Documentación y Protocolos' del ERP dental. Su propósito principal es formalizar y estandarizar la comunicación entre la clínica dental y los laboratorios protésicos, ya sean internos o externos. Una orden de trabajo es un documento técnico-legal que detalla con precisión las especificaciones para la fabricación de una prótesis dental, como coronas, puentes, carillas, dentaduras, implantes, entre otros. Esta página permite a los odontólogos y asistentes crear, completar y enviar estas órdenes de manera digital, centralizada y trazable. Funciona como el nexo de unión entre el diagnóstico y plan de tratamiento clínico y la fase de fabricación protésica. Al estar integrada en el ERP, cada orden se vincula directamente con el expediente de un paciente y un tratamiento específico de su plan, garantizando la coherencia y el acceso rápido a toda la información relevante. La digitalización de este proceso elimina la ambigüedad de las órdenes en papel, reduce errores de comunicación, agiliza los tiempos de envío y recepción, y crea un registro histórico inmutable para consultas futuras, control de calidad y responsabilidades legales. Además, facilita la gestión de costes asociados al laboratorio y el seguimiento del estado de cada trabajo protésico en tiempo real, desde su envío hasta su recepción en la clínica.

## 👥 Roles de Acceso

- Odontólogo
- Auxiliar / Asistente
- Protésico / Laboratorio

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

La funcionalidad se encuentra dentro de la feature 'documentacion-protocolos'. La página principal, 'NuevaOrdenTrabajoPage.tsx', reside en la subcarpeta '/pages' y orquesta la presentación y el estado general. Los componentes reutilizables y complejos como el formulario, el selector de pacientes o el diagrama dental se ubican en '/components' para mantener el código modular y limpio. La comunicación con el backend se abstrae en el archivo '/apis/ordenesTrabajoApi.ts', que contiene todas las funciones para realizar las llamadas a los endpoints de la API RESTful.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/NuevaOrdenTrabajoPage.tsx`
- `/features/documentacion-protocolos/components/FormularioOrdenTrabajo.tsx`
- `/features/documentacion-protocolos/components/SelectorPacienteTratamiento.tsx`
- `/features/documentacion-protocolos/components/DiagramaDentalInteractivo.tsx`
- `/features/documentacion-protocolos/components/UploaderArchivosOrden.tsx`
- `/features/documentacion-protocolos/apis/ordenesTrabajoApi.ts`

### Componentes React

- FormularioOrdenTrabajo
- SelectorPacienteTratamiento
- DiagramaDentalInteractivo
- UploaderArchivosOrden
- SelectorLaboratorio

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan la creación y recuperación de datos maestros (pacientes, laboratorios, tratamientos) necesarios para rellenar la orden, así como la creación de la propia orden de trabajo y la gestión de los archivos adjuntos.

### `POST` `/api/ordenes-trabajo`

Crea una nueva orden de trabajo en la base de datos, vinculándola al paciente, tratamiento y laboratorio correspondientes.

**Parámetros:** Body: { pacienteId, tratamientoId, laboratorioId, fechaEntregaPrevista, piezasDentales: [], tipoProtesis, material, color, instrucciones, archivosAdjuntos: [] }

**Respuesta:** JSON con el objeto de la orden de trabajo recién creada, incluyendo su ID y número de orden único.

### `GET` `/api/pacientes/buscar`

Busca pacientes por nombre o DNI para el autocompletado en el formulario.

**Parámetros:** Query: ?q={termino_busqueda}

**Respuesta:** Array de objetos de pacientes que coinciden con el término de búsqueda.

### `GET` `/api/tratamientos/paciente/{pacienteId}`

Obtiene la lista de tratamientos pendientes o en curso para un paciente seleccionado.

**Parámetros:** Path: pacienteId

**Respuesta:** Array de objetos de tratamientos asociados al paciente.

### `GET` `/api/laboratorios`

Obtiene la lista de todos los laboratorios protésicos registrados en el sistema.

**Respuesta:** Array de objetos de laboratorios.

### `POST` `/api/ordenes-trabajo/upload`

Sube archivos (escaneos 3D, imágenes, etc.) a un almacenamiento en la nube (ej. S3) y devuelve la URL para asociarla a la orden de trabajo.

**Parámetros:** Body: FormData con el archivo

**Respuesta:** JSON con la URL del archivo subido. { url: '...' }

## 🗂️ Estructura Backend (MERN)

La estructura del backend se basa en el patrón MVC. El modelo 'OrdenTrabajo' define el esquema de datos en MongoDB. El 'OrdenTrabajoController' contiene la lógica de negocio para crear, leer y actualizar las órdenes. Las rutas en 'ordenesTrabajoRoutes.js' exponen los endpoints de la API para que el frontend pueda interactuar con los datos.

### Models

#### OrdenTrabajo

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, tratamiento: { type: Schema.Types.ObjectId, ref: 'Tratamiento' }, laboratorio: { type: Schema.Types.ObjectId, ref: 'Laboratorio' }, odontologo: { type: Schema.Types.ObjectId, ref: 'User' }, numeroOrden: { type: String, unique: true }, fechaCreacion: { type: Date, default: Date.now }, fechaEntregaPrevista: Date, estado: { type: String, enum: ['Creada', 'Enviada', 'En Proceso', 'Recibida', 'Finalizada'], default: 'Creada' }, piezasDentales: [String], tipoProtesis: String, material: String, color: String, instrucciones: String, archivosAdjuntos: [{ nombre: String, url: String, fechaSubida: Date }]

### Controllers

#### OrdenTrabajoController

- crearOrdenTrabajo
- subirArchivosParaOrden

#### PacienteController

- buscarPacientes

#### LaboratorioController

- listarLaboratorios

### Routes

#### `/api/ordenes-trabajo`

- POST /
- POST /upload

## 🔄 Flujos

1. El odontólogo o asistente accede a la sección 'Nueva Orden de Trabajo' desde el menú de 'Documentación y Protocolos' o directamente desde el expediente de un paciente.
2. El sistema presenta un formulario. El usuario busca y selecciona al paciente. El sistema carga automáticamente los tratamientos asociados a ese paciente.
3. El usuario selecciona el tratamiento correspondiente, el laboratorio de destino y la fecha de entrega prevista.
4. Utilizando un diagrama dental interactivo, el usuario selecciona las piezas dentales involucradas en el trabajo protésico.
5. El usuario completa los campos de especificaciones técnicas: tipo de prótesis, material, color e instrucciones detalladas para el protésico.
6. El usuario utiliza el componente de carga de archivos para adjuntar escaneos intraorales, fotografías u otros documentos relevantes.
7. Al hacer clic en 'Guardar' o 'Enviar', el sistema valida los datos, crea el registro en la base de datos, le asigna un número de orden único y cambia su estado a 'Creada' o 'Enviada'.

## 📝 User Stories

- Como Odontólogo, quiero crear una orden de trabajo digitalmente para un laboratorio, especificando todos los detalles técnicos y adjuntando archivos de escáner intraoral, para asegurar la máxima precisión en la fabricación de la prótesis.
- Como Asistente Dental, quiero poder pre-rellenar una orden de trabajo seleccionando un paciente y su tratamiento para que el odontólogo solo tenga que revisar y añadir las especificaciones técnicas, agilizando así el flujo de trabajo.
- Como Protésico/Laboratorio, quiero recibir notificaciones y acceder a una vista clara y completa de las nuevas órdenes de trabajo, con toda la información y archivos descargables en un solo lugar, para evitar errores y consultas innecesarias.
- Como Odontólogo, quiero que el sistema me sugiera laboratorios con los que trabajo habitualmente y me permita ver un historial de órdenes enviadas para un control y seguimiento eficientes.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un estricto control de acceso basado en roles (RBAC). Los odontólogos/asistentes pueden crear/editar órdenes de su clínica. El rol de laboratorio solo puede ver las órdenes destinadas a él. Todos los datos sensibles deben ser transmitidos sobre HTTPS.
- Gestión de Archivos: Es crucial utilizar un servicio de almacenamiento de objetos como AWS S3, Google Cloud Storage o Azure Blob Storage para los archivos adjuntos. No almacenar archivos directamente en el servidor de la aplicación. Generar URLs pre-firmadas para el acceso seguro y temporal a los archivos.
- Generación de PDF: Implementar una función para generar una versión en PDF de la orden de trabajo completada, que pueda ser descargada, impresa o enviada por correo electrónico, sirviendo como un registro físico o backup.
- Validación: Realizar validación de datos tanto en el frontend (para una UX fluida) como en el backend (para la integridad de los datos) utilizando librerías como Zod o Joi.
- Notificaciones: Considerar la implementación de un sistema de notificaciones (email, SMS o dentro de la app) para alertar al laboratorio cuando se crea una nueva orden y a la clínica cuando el laboratorio actualiza el estado del trabajo.

