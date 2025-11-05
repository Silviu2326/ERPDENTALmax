# Mis Documentos (Consentimientos/Recetas)

**Categoría:** Portal del Paciente | **Módulo:** Portal del Paciente

La página 'Mis Documentos' es una funcionalidad esencial dentro del 'Portal del Paciente', diseñada para centralizar y facilitar el acceso seguro del paciente a toda su documentación clínica relevante. Este espacio digital actúa como un repositorio personal donde los pacientes pueden visualizar, descargar y, en casos específicos como los consentimientos informados, firmar digitalmente los documentos generados por la clínica. Su propósito principal es mejorar la comunicación, la transparencia y la eficiencia administrativa, eliminando la necesidad de gestionar grandes cantidades de papel y permitiendo al paciente tener un control y conocimiento completo sobre su historial de tratamiento. Dentro del ecosistema del ERP dental, esta página se nutre de la información generada en otros módulos: los planes de tratamiento se crean en el módulo de Odontograma, las recetas se emiten tras una consulta en el módulo de Historia Clínica, y las facturas se generan desde el módulo de Facturación. 'Mis Documentos' agrega todo esto en una interfaz unificada y fácil de usar para el paciente, fortaleciendo la relación clínica-paciente y asegurando el cumplimiento normativo en cuanto a la gestión y firma de consentimientos legales. Es una herramienta clave para la modernización de la experiencia del paciente.

## 👥 Roles de Acceso

- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-paciente/`

Esta funcionalidad reside dentro de la feature 'portal-paciente'. La página principal se define en '/pages/MisDocumentosPage.tsx'. Esta página utiliza componentes reutilizables de '/components/' como 'DocumentosLista.tsx' para mostrar las diferentes categorías de documentos y 'VisorPDF.tsx' para previsualizarlos. La lógica para interactuar con el backend, como obtener la lista de documentos o enviar una firma, se encapsula en '/apis/documentosApi.ts', manteniendo la separación de responsabilidades.

### Archivos Frontend

- `/features/portal-paciente/pages/MisDocumentosPage.tsx`
- `/features/portal-paciente/components/DocumentosLista.tsx`
- `/features/portal-paciente/components/DocumentoItem.tsx`
- `/features/portal-paciente/components/VisorPDFModal.tsx`
- `/features/portal-paciente/components/FirmaDigitalCanvas.tsx`
- `/features/portal-paciente/apis/documentosApi.ts`

### Componentes React

- MisDocumentosPage
- DocumentosLista
- DocumentoItem
- VisorPDFModal
- FirmaDigitalCanvas

## 🔌 APIs Backend

Las APIs para esta sección deben ser seguras y estar autenticadas, asegurando que un paciente solo pueda acceder a sus propios documentos. Se necesitan endpoints para listar todos los documentos, obtener el contenido de un archivo específico y para procesar la firma digital de consentimientos.

### `GET` `/api/portal/documentos`

Obtiene una lista paginada de todos los documentos asociados al paciente autenticado, con metadatos como tipo, fecha, nombre y estado (ej: 'Pendiente de Firma').

**Parámetros:** query: page (number), query: limit (number), query: tipo (string, opcional para filtrar por 'consentimiento', 'receta', etc.)

**Respuesta:** Un objeto con un array de documentos y metadatos de paginación.

### `GET` `/api/portal/documentos/:documentoId/descargar`

Genera y devuelve una URL segura y de corta duración (pre-signed URL) para descargar el archivo físico (PDF) del documento, o directamente el stream del archivo.

**Parámetros:** path: documentoId (string)

**Respuesta:** JSON con la URL de descarga o el archivo PDF.

### `POST` `/api/portal/documentos/:documentoId/firmar`

Recibe la firma digital del paciente (ej: imagen en base64), la asocia al documento (consentimiento), actualiza su estado a 'Firmado' y registra la fecha/hora de la firma.

**Parámetros:** path: documentoId (string), body: { firmaData: string (base64) }

**Respuesta:** El objeto del documento actualizado.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo 'Documento' para almacenar la metadata de cada archivo. Los archivos físicos se guardan en un servicio de almacenamiento de objetos (como S3). Un controlador específico, 'PortalDocumentoController', gestiona la lógica de negocio para las peticiones que provienen del portal del paciente, aplicando las reglas de autorización correspondientes.

### Models

#### Documento

pacienteId: ObjectId (ref: 'Paciente'), tipo: String (enum: ['Consentimiento', 'Receta', 'PlanTratamiento', 'Factura']), nombreArchivo: String, urlAlmacenamiento: String, fechaCreacion: Date, estado: String (enum: ['Pendiente de Firma', 'Firmado', 'Generado']), firmaDigital: { data: String, fecha: Date }, metadatos: Object

### Controllers

#### PortalDocumentoController

- listarDocumentosDelPaciente
- obtenerUrlDescargaDocumento
- firmarDocumentoPaciente

### Routes

#### `/api/portal/documentos`

- GET /
- GET /:documentoId/descargar
- POST /:documentoId/firmar

## 🔄 Flujos

1. El paciente inicia sesión en el portal y navega a la sección 'Mis Documentos'.
2. El frontend realiza una petición GET a '/api/portal/documentos' para obtener la lista de sus documentos.
3. La interfaz muestra los documentos agrupados por tipo (Consentimientos, Recetas, etc.), destacando los que requieren firma.
4. El paciente hace clic en un consentimiento 'Pendiente de Firma'. Se abre un modal con el visor de PDF y un lienzo para firmar.
5. Tras revisar el documento, el paciente dibuja su firma y hace clic en 'Aceptar'.
6. El frontend envía la firma en base64 mediante un POST a '/api/portal/documentos/:documentoId/firmar'.
7. El backend valida la petición, guarda la firma, actualiza el estado del documento y devuelve el documento actualizado. La interfaz se refresca mostrando el documento como 'Firmado'.

## 📝 User Stories

- Como paciente, quiero acceder a una sección donde pueda ver todos mis consentimientos, recetas y planes de tratamiento para tener un control centralizado de mi información.
- Como paciente, quiero poder descargar mis recetas en PDF para poder enviarlas a la farmacia o imprimirlas fácilmente.
- Como paciente, quiero revisar y firmar digitalmente los consentimientos informados desde mi casa para ahorrar tiempo el día de la cita.
- Como paciente, quiero ver un indicador claro que me muestre qué documentos están pendientes de mi firma para no olvidar ninguna acción importante.

## ⚙️ Notas Técnicas

- Seguridad: Es imperativo que todos los endpoints estén protegidos por un middleware de autenticación (JWT) que valide la identidad del paciente y asegure que solo pueda acceder a sus propios documentos.
- Almacenamiento de Archivos: Utilizar un servicio de almacenamiento en la nube como AWS S3 o Google Cloud Storage para los archivos PDF. La base de datos solo debe almacenar la ruta o clave del objeto, no el archivo binario.
- URLs Pre-firmadas: Para la descarga de documentos, el backend debe generar URLs pre-firmadas con un tiempo de expiración corto. Esto evita la exposición de enlaces permanentes y el acceso no autorizado a los archivos.
- Firma Digital: La firma capturada en el frontend (ej. con 'react-signature-canvas') debe ser almacenada de forma segura. Una opción es incrustarla en una nueva versión del PDF en el backend usando librerías como 'pdf-lib' para crear un registro inmutable.
- Cumplimiento Legal: Asegurarse de que el proceso de firma digital y el almacenamiento de documentos cumplen con las normativas locales de protección de datos y validez legal de documentos electrónicos (como HIPAA, GDPR, etc., según corresponda).

