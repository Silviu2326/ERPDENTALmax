# Historial Radiológico del Paciente

**Categoría:** Integraciones | **Módulo:** Integración Radiológica

El Historial Radiológico del Paciente es una funcionalidad crítica dentro del módulo de 'Integración Radiológica' del ERP dental. Su propósito principal es centralizar, organizar y visualizar todas las imágenes radiológicas de un paciente a lo largo de su historia en la clínica. Esto incluye una variedad de tipos de imágenes como radiografías periapicales, de aleta de mordida (bitewing), oclusales, panorámicas (ortopantomografías) y tomografías computarizadas de haz cónico (CBCT). La página funciona como una galería visual e interactiva, donde el odontólogo o el técnico de radiología pueden acceder rápidamente a cualquier imagen, verla en alta resolución, compararla con estudios anteriores y añadir anotaciones o diagnósticos. Su integración dentro del ERP es fundamental para proporcionar una visión de 360 grados del paciente, conectando directamente los hallazgos radiológicos con los planes de tratamiento, odontogramas y notas clínicas. Elimina la necesidad de sistemas de archivo de imágenes (PACS) separados o la gestión de archivos en carpetas locales, reduciendo el riesgo de pérdida de datos y mejorando la eficiencia del flujo de trabajo clínico. El módulo padre, 'Integración Radiológica', proporciona la infraestructura subyacente para conectar con los sensores de rayos X, escáneres y servidores DICOM, y esta página es la interfaz principal donde el usuario final interactúa con los datos recopilados.

## 👥 Roles de Acceso

- Odontólogo
- Técnico de Radiología

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/integracion-radiologica/`

La funcionalidad del Historial Radiológico se encuentra dentro de la carpeta de la feature 'integracion-radiologica'. La página principal, que muestra la galería de imágenes del paciente, reside en `/pages`. Los componentes reutilizables, como la galería de miniaturas (`GaleriaRadiologica`), el visor de imágenes de alta resolución con herramientas de zoom/contraste (`VisorDicomDetallado`), y el formulario de carga de nuevas imágenes (`ModalCargaRadiografia`), se ubican en `/components`. La comunicación con el backend para obtener, subir y gestionar los metadatos de las imágenes se encapsula en funciones dentro de la carpeta `/apis`.

### Archivos Frontend

- `/features/integracion-radiologica/pages/HistorialRadiologicoPacientePage.tsx`
- `/features/integracion-radiologica/components/GaleriaRadiologica.tsx`
- `/features/integracion-radiologica/components/VisorDicomDetallado.tsx`
- `/features/integracion-radiologica/components/ModalCargaRadiografia.tsx`
- `/features/integracion-radiologica/components/FiltrosHistorialRadiologico.tsx`
- `/features/integracion-radiologica/apis/radiologiaApi.ts`

### Componentes React

- HistorialRadiologicoPacientePage
- GaleriaRadiologica
- VisorDicomDetallado
- ModalCargaRadiografia
- FiltrosHistorialRadiologico
- MiniaturaRadiografia

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida de los registros radiológicos. Se encargan de obtener la lista de imágenes para un paciente, permitir la carga de nuevos archivos (que se almacenarán en un servicio de object storage como S3), actualizar metadatos como notas o diagnósticos, y eliminar registros. Las rutas están anidadas bajo pacientes para una correcta estructura RESTful.

### `GET` `/api/pacientes/:pacienteId/radiologias`

Obtiene una lista paginada de todos los registros radiológicos de un paciente específico. Permite filtrar por tipo de radiografía y rango de fechas.

**Parámetros:** path: pacienteId, query: ?page=1&limit=20&tipo=panoramica&fechaDesde=YYYY-MM-DD&fechaHasta=YYYY-MM-DD

**Respuesta:** Un objeto JSON con una lista de registros radiológicos (metadata) y datos de paginación.

### `POST` `/api/pacientes/:pacienteId/radiologias`

Sube un nuevo archivo de imagen radiológica (ej. JPG, PNG, DICOM) y crea su registro de metadatos asociado en la base de datos. Se utiliza 'multipart/form-data'.

**Parámetros:** path: pacienteId, body (form-data): file (el archivo de imagen), tipoRadiografia (string), fechaToma (date), notas (string)

**Respuesta:** El objeto JSON del nuevo registro radiológico creado.

### `GET` `/api/radiologias/:radiologiaId`

Obtiene los detalles completos y metadatos de un único registro radiológico.

**Parámetros:** path: radiologiaId

**Respuesta:** El objeto JSON completo del registro radiológico.

### `PUT` `/api/radiologias/:radiologiaId`

Actualiza los metadatos de un registro radiológico existente, como las notas o el diagnóstico asociado.

**Parámetros:** path: radiologiaId, body: { notas: '...', diagnosticoAsociado: '...' }

**Respuesta:** El objeto JSON del registro radiológico actualizado.

### `DELETE` `/api/radiologias/:radiologiaId`

Elimina un registro radiológico y su archivo asociado del almacenamiento. Requiere permisos elevados.

**Parámetros:** path: radiologiaId

**Respuesta:** Un mensaje de confirmación de éxito.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo 'Radiologia' en MongoDB para almacenar los metadatos de cada imagen. Los archivos físicos se guardan en un bucket de S3. El 'RadiologiaController' contiene la lógica para interactuar con la base de datos y el servicio de almacenamiento. Las rutas de Express exponen esta lógica a través de los endpoints RESTful definidos.

### Models

#### Radiologia

paciente: { type: ObjectId, ref: 'Paciente' }, odontologo: { type: ObjectId, ref: 'Usuario' }, tipoRadiografia: { type: String, enum: ['Periapical', 'Bitewing', 'Oclusal', 'Panorámica', 'CBCT'] }, fechaToma: Date, urlArchivo: String, nombreArchivoOriginal: String, tamañoArchivo: Number, notas: String, diagnosticoAsociado: String, createdAt: Date, updatedAt: Date

### Controllers

#### RadiologiaController

- obtenerRadiologiasPorPaciente
- crearRadiologiaConSubida
- obtenerRadiologiaPorId
- actualizarRadiologia
- eliminarRadiologia

### Routes

#### `/api/pacientes/:pacienteId/radiologias`

- GET /
- POST /

#### `/api/radiologias`

- GET /:radiologiaId
- PUT /:radiologiaId
- DELETE /:radiologiaId

## 🔄 Flujos

1. 1. El odontólogo accede a la ficha de un paciente y selecciona la pestaña 'Historial Radiológico'.
2. 2. El frontend realiza una llamada GET a `/api/pacientes/:pacienteId/radiologias` para cargar las miniaturas de las imágenes existentes.
3. 3. La página muestra una galería con las miniaturas, ordenadas por fecha descendente, junto con opciones de filtrado (por tipo, fecha).
4. 4. El usuario hace clic en una miniatura, lo que abre un modal con el componente 'VisorDicomDetallado', cargando la imagen en alta resolución desde su URL.
5. 5. Dentro del visor, el usuario puede hacer zoom, pan, y ajustar brillo/contraste.
6. 6. Para añadir una nueva imagen, el usuario hace clic en 'Añadir Radiografía', abriendo el modal 'ModalCargaRadiografia'.
7. 7. El usuario arrastra un archivo de imagen, completa los campos de tipo y fecha, y hace clic en 'Guardar'.
8. 8. El frontend envía una petición POST `multipart/form-data` al backend. El backend procesa el archivo, lo sube a S3, guarda los metadatos en MongoDB y devuelve el nuevo registro.
9. 9. El frontend recibe la respuesta, cierra el modal y actualiza la galería para mostrar la nueva radiografía.

## 📝 User Stories

- Como Odontólogo, quiero ver todas las radiografías de un paciente en una única galería cronológica para poder evaluar la evolución de su salud dental y planificar tratamientos.
- Como Odontólogo, quiero abrir una radiografía en un visor de alta calidad con herramientas de zoom y ajuste de imagen para poder realizar un diagnóstico preciso.
- Como Técnico de Radiología, quiero poder subir una nueva radiografía al sistema de forma rápida y sencilla, asociándola inmediatamente al paciente correcto para que esté disponible para el odontólogo.
- Como Odontólogo, quiero filtrar el historial radiológico por tipo (ej. 'Panorámica') para encontrar y comparar rápidamente estudios específicos.
- Como Odontólogo, quiero poder añadir notas o un diagnóstico preliminar a una radiografía para documentar mis hallazgos.

## ⚙️ Notas Técnicas

- Almacenamiento de Archivos: Es imperativo NO almacenar los archivos de imagen directamente en MongoDB. Utilizar un servicio de almacenamiento de objetos como AWS S3, Google Cloud Storage o MinIO. La base de datos solo debe contener la URL del archivo y sus metadatos.
- Seguridad y Cumplimiento (HIPAA): Las imágenes radiológicas son Información de Salud Protegida (PHI). Todo el sistema debe cumplir con normativas como HIPAA. Esto implica encriptación en tránsito (TLS) y en reposo (en S3 y DB). El acceso a los archivos debe ser a través de URLs pre-firmadas con una vida útil corta para evitar el acceso no autorizado.
- Rendimiento del Frontend: La galería debe usar miniaturas (`thumbnails`) generadas en el backend al momento de la subida para que la página cargue rápidamente. Implementar 'lazy loading' para las imágenes a medida que el usuario se desplaza por la galería.
- Manejo de DICOM: Si se soportan archivos DICOM, se necesitará una librería de frontend especializada como Cornerstone.js o DWV (DICOM Web Viewer) para parsear y renderizar las imágenes correctamente en el navegador, así como para manejar múltiples frames (en caso de CBCT).
- Manejo de Cargas Pesadas: La subida de archivos, especialmente los CBCT, puede ser de gran tamaño. Implementar un sistema de carga robusto en el backend (ej. usando 'multer' con almacenamiento en S3) y mostrar una barra de progreso en el frontend.

