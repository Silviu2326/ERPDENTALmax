# Documentos del Paciente

**Categoría:** Gestión Clínica | **Módulo:** Gestión de Pacientes e Historia Clínica

La página de 'Documentos del Paciente' es un repositorio digital centralizado y seguro, diseñado para almacenar, organizar y gestionar toda la documentación asociada a un paciente dentro de la clínica dental. Esta funcionalidad es un pilar fundamental del módulo 'Gestión de Pacientes e Historia Clínica', ya que complementa la información clínica (odontogramas, periodontogramas, notas de evolución) con evidencia tangible y documentos de soporte. Sirve para múltiples propósitos: desde el punto de vista clínico, permite adjuntar radiografías, tomografías (TACs), informes de otros especialistas, fotografías intraorales y extraorales, y resultados de laboratorio, proporcionando una visión 360 grados de la salud del paciente. Desde una perspectiva administrativa y legal, es crucial para almacenar consentimientos informados firmados, documentos de identidad (DNI/NIE), tarjetas de seguros, presupuestos aceptados y documentos de protección de datos (LOPD/GDPR). El funcionamiento se basa en una interfaz intuitiva que permite al personal autorizado (odontólogos, higienistas, personal de recepción) subir archivos fácilmente, categorizarlos para una rápida localización (ej: 'Radiografías', 'Consentimientos', 'Administrativo'), previsualizarlos directamente en el sistema sin necesidad de descargarlos, y gestionar su ciclo de vida. La seguridad es primordial, garantizando que solo los usuarios con los permisos adecuados puedan acceder a esta información sensible, manteniendo la confidencialidad y el cumplimiento normativo.

## 👥 Roles de Acceso

- Odontólogo
- Higienista
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-pacientes-historia-clinica/`

Esta funcionalidad se encuentra dentro de la feature 'gestion-pacientes-historia-clinica'. La subcarpeta '/pages' contiene el componente principal de la página que renderiza la interfaz completa de gestión de documentos. La carpeta '/components' alberga los elementos de UI reutilizables como la cuadrícula de documentos ('DocumentosGrid'), el modal para subir nuevos archivos ('ModalSubirDocumento') y el visor de documentos ('VisorDocumento'). Finalmente, la carpeta '/apis' contiene las funciones que encapsulan las llamadas a la API REST del backend para obtener, subir y eliminar documentos, manteniendo la lógica de comunicación separada de los componentes visuales.

### Archivos Frontend

- `/features/gestion-pacientes-historia-clinica/pages/PacienteDocumentosPage.tsx`
- `/features/gestion-pacientes-historia-clinica/components/DocumentosGrid.tsx`
- `/features/gestion-pacientes-historia-clinica/components/DocumentoItem.tsx`
- `/features/gestion-pacientes-historia-clinica/components/ModalSubirDocumento.tsx`
- `/features/gestion-pacientes-historia-clinica/components/VisorDocumento.tsx`
- `/features/gestion-pacientes-historia-clinica/apis/documentosApi.ts`

### Componentes React

- DocumentosGrid
- DocumentoItem
- ModalSubirDocumento
- VisorDocumento
- FiltroCategoriasDocumento

## 🔌 APIs Backend

Se requiere una API RESTful para gestionar el ciclo de vida de los documentos de un paciente. Esta API debe manejar la subida de archivos (multipart/form-data), la recuperación de metadatos, la generación de URLs seguras para la descarga/visualización y la eliminación lógica (soft delete) de documentos. Todas las rutas deben estar protegidas y validar que el usuario tenga permisos sobre el paciente en cuestión.

### `GET` `/api/pacientes/:pacienteId/documentos`

Obtiene la lista de todos los documentos asociados a un paciente específico. Permite filtrar por categoría.

**Parámetros:** path: pacienteId (string), query: categoria (string, opcional)

**Respuesta:** Un array de objetos de documento con sus metadatos (sin el contenido del archivo).

### `POST` `/api/pacientes/:pacienteId/documentos`

Sube un nuevo documento para un paciente. La petición debe ser de tipo 'multipart/form-data', incluyendo el archivo y sus metadatos.

**Parámetros:** path: pacienteId (string), formData: file (archivo), formData: categoria (string), formData: descripcion (string, opcional)

**Respuesta:** El objeto del nuevo documento creado en la base de datos.

### `GET` `/api/documentos/:documentoId/url`

Obtiene una URL firmada y de corta duración para visualizar o descargar de forma segura el archivo físico desde el servicio de almacenamiento (ej. S3).

**Parámetros:** path: documentoId (string)

**Respuesta:** Un objeto JSON con la URL segura: { url: '...' }.

### `PUT` `/api/documentos/:documentoId`

Actualiza los metadatos de un documento existente, como su categoría o descripción.

**Parámetros:** path: documentoId (string), body: { categoria: string, descripcion: string }

**Respuesta:** El objeto del documento actualizado.

### `DELETE` `/api/documentos/:documentoId`

Realiza una eliminación lógica (soft delete) de un documento. El archivo no se borra físicamente pero se marca como eliminado.

**Parámetros:** path: documentoId (string)

**Respuesta:** Un mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se centra en el modelo 'Documento', que está referenciado al modelo 'Paciente'. El 'DocumentoController' contiene toda la lógica de negocio: gestión de la subida de archivos a un servicio externo (como AWS S3), validaciones, creación de registros en MongoDB, y comprobaciones de permisos. Las rutas se definen en un archivo separado, siguiendo las convenciones RESTful, para exponer las funciones del controlador a través de la API.

### Models

#### Documento

pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true, index: true }, nombreOriginal: String, nombreAlmacenado: String, url: String, tipoMime: String, tamaño: Number, categoria: { type: String, enum: ['Radiografía', 'Consentimiento', 'Administrativo', 'Informe Externo', 'Fotografía', 'Otro'], required: true }, descripcion: String, fechaSubida: { type: Date, default: Date.now }, subidoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }, isDeleted: { type: Boolean, default: false }

### Controllers

#### DocumentoController

- obtenerDocumentosPorPaciente
- subirDocumento
- generarUrlSegura
- actualizarMetadatosDocumento
- eliminarDocumento

### Routes

#### `/api/documentos`

- GET /:documentoId/url
- PUT /:documentoId
- DELETE /:documentoId

#### `/api/pacientes`

- GET /:pacienteId/documentos
- POST /:pacienteId/documentos

## 🔄 Flujos

1. Flujo de subida: El usuario (ej. Recepción) accede a la ficha de un paciente, va a la pestaña 'Documentos', hace clic en 'Subir Documento', selecciona un archivo (ej. DNI.pdf), elige la categoría 'Administrativo', añade una descripción y guarda. El sistema sube el archivo a un bucket S3, guarda los metadatos en MongoDB y refresca la lista de documentos.
2. Flujo de consulta: Un odontólogo, preparando una cirugía, filtra los documentos del paciente por la categoría 'Radiografía', localiza un TAC reciente, y hace clic en él. El sistema solicita una URL segura al backend y abre el archivo en un visor DICOM o de imágenes integrado en la aplicación.
3. Flujo de gestión: El personal de secretaría revisa los documentos y encuentra un consentimiento informado obsoleto. Hace clic en el icono de eliminar, confirma la acción, y el sistema marca el documento como eliminado, ocultándolo de la vista principal pero conservándolo para fines de auditoría.

## 📝 User Stories

- Como Recepcionista, quiero subir y categorizar el DNI y la tarjeta del seguro de un paciente para tener toda su documentación administrativa centralizada y accesible.
- Como Odontólogo, quiero visualizar rápidamente todas las radiografías y TACs de un paciente, ordenadas por fecha, para evaluar la evolución y planificar un tratamiento de implantes.
- Como Higienista, quiero verificar que el consentimiento informado para un blanqueamiento está subido y firmado antes de iniciar el procedimiento.
- Como Odontólogo, quiero poder adjuntar un informe de un especialista externo (ej. ortodoncista) al historial del paciente para mantener un registro clínico completo y consolidado.

## ⚙️ Notas Técnicas

- Almacenamiento de archivos: Se debe utilizar un servicio de almacenamiento de objetos en la nube (AWS S3, Google Cloud Storage) en lugar de almacenar archivos en el servidor o en la base de datos. Esto mejora la escalabilidad, seguridad y rendimiento.
- Seguridad de acceso: El acceso a los archivos debe realizarse a través de URLs firmadas (signed URLs) con un tiempo de expiración corto. El backend debe validar estrictamente los permisos del usuario contra el paciente del documento solicitado antes de generar cualquier URL.
- Gestión de subidas: Utilizar una librería como 'multer' en el backend Node.js para procesar las peticiones 'multipart/form-data'. Implementar validaciones en el servidor para el tamaño máximo de archivo y los tipos MIME permitidos (p. ej., 'image/jpeg', 'application/pdf', 'application/dicom').
- Previsualización en Frontend: Para mejorar la experiencia de usuario, implementar previsualizadores en el frontend para tipos de archivo comunes. Librerías como 'react-pdf' para PDFs y visores de imágenes estándar. Para archivos DICOM, se pueden integrar librerías especializadas.
- Auditoría y Trazabilidad: Es fundamental implementar un sistema de logs que registre todas las acciones críticas sobre los documentos (quién subió, visualizó, modificó o eliminó un documento y cuándo) para cumplir con normativas de protección de datos como LOPD/GDPR e HIPAA.

