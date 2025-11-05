# Visor de Radiografías

**Categoría:** Integraciones | **Módulo:** Integración Radiológica

El Visor de Radiografías es una funcionalidad crítica dentro del módulo de 'Integración Radiológica'. Su propósito principal es proporcionar a los profesionales de la salud dental una herramienta potente y centralizada para visualizar, analizar y gestionar todo tipo de imágenes radiológicas digitales directamente desde la ficha del paciente en el ERP. Esto incluye radiografías 2D (periapicales, de aleta de mordida, oclusales, panorámicas), cefalometrías y estudios 3D como tomografías computarizadas de haz cónico (CBCT). El visor no es un simple mostrador de imágenes; es una aplicación de grado médico que debe ser capaz de interpretar el formato estándar de la industria, DICOM (Digital Imaging and Communications in Medicine). Permite a odontólogos y técnicos de radiología realizar diagnósticos precisos, planificar tratamientos complejos (implantes, endodoncias, ortodoncia) y comunicar los hallazgos a los pacientes de manera efectiva. Funciona como el puente entre los equipos de adquisición de imágenes (sensores intraorales, ortopantomógrafos, escáneres CBCT) y el registro clínico del paciente. Al estar integrado en el ERP, asocia cada estudio radiológico con un paciente, una fecha y, opcionalmente, con un tratamiento específico, creando un historial radiológico completo y auditable que es fundamental para la continuidad de la atención y el cumplimiento normativo.

## 👥 Roles de Acceso

- Odontólogo
- Técnico de Radiología

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/integracion-radiologica/`

Toda la lógica de esta funcionalidad reside en la carpeta '/features/integracion-radiologica/'. La subcarpeta '/pages/' contiene el componente principal de la página, 'VisorRadiografiasPage.tsx', que se encarga de orquestar la vista y cargar los datos del paciente. La carpeta '/components/' alberga los elementos reutilizables de la UI, como el visor DICOM en sí ('VisorDicomPrincipal.tsx'), la barra de herramientas ('BarraHerramientasVisor.tsx'), y la galería de miniaturas ('GaleriaEstudiosPaciente.tsx'). Finalmente, la carpeta '/apis/' define las funciones ('radiologiaApi.ts') que realizan las llamadas al backend para obtener los estudios, las imágenes y guardar las anotaciones.

### Archivos Frontend

- `/features/integracion-radiologica/pages/VisorRadiografiasPage.tsx`
- `/features/integracion-radiologica/components/VisorDicomPrincipal.tsx`
- `/features/integracion-radiologica/components/BarraHerramientasVisor.tsx`
- `/features/integracion-radiologica/components/GaleriaEstudiosPaciente.tsx`
- `/features/integracion-radiologica/components/ModalMetadatosDicom.tsx`
- `/features/integracion-radiologica/apis/radiologiaApi.ts`

### Componentes React

- VisorRadiografiasPage
- VisorDicomPrincipal
- BarraHerramientasVisor
- GaleriaEstudiosPaciente
- ModalMetadatosDicom

## 🔌 APIs Backend

Las APIs para el Visor de Radiografías se centran en la gestión de estudios e imágenes asociadas a los pacientes. Permiten listar todos los estudios de un paciente, obtener los detalles y los archivos DICOM de un estudio específico y gestionar las anotaciones sobre las imágenes.

### `GET` `/api/radiologia/pacientes/:pacienteId/estudios`

Obtiene una lista con los metadatos de todos los estudios radiológicos de un paciente específico.

**Parámetros:** pacienteId (URL param)

**Respuesta:** Array de objetos de estudio radiológico (sin los datos binarios de las imágenes).

### `GET` `/api/radiologia/estudios/:estudioId`

Obtiene los detalles completos de un estudio radiológico, incluyendo la información de sus series e imágenes.

**Parámetros:** estudioId (URL param)

**Respuesta:** Objeto detallado del estudio con sus series e imágenes.

### `GET` `/api/radiologia/imagenes/:imagenId/archivo`

Descarga el archivo DICOM binario de una imagen específica. Este endpoint es crucial para que el visor del frontend pueda renderizar la imagen.

**Parámetros:** imagenId (URL param)

**Respuesta:** El archivo binario DICOM (content-type: application/dicom).

### `POST` `/api/radiologia/imagenes/:imagenId/anotaciones`

Guarda una nueva anotación (texto, medida, dibujo) asociada a una imagen específica.

**Parámetros:** imagenId (URL param), Body: { tipo: string, datos: object, creadoPor: userId }

**Respuesta:** El objeto de la anotación creada con su nuevo ID.

## 🗂️ Estructura Backend (MERN)

El backend utiliza MongoDB para almacenar los metadatos de las radiografías. Los archivos DICOM, por su gran tamaño, se almacenan en un servicio de almacenamiento de objetos como AWS S3, y en la base de datos solo se guarda la referencia (URL/key). Los controladores gestionan la lógica de negocio y los routes exponen los endpoints RESTful.

### Models

#### RadiografiaEstudio

paciente: ObjectId, fechaEstudio: Date, tipoEstudio: String ('Panorámica', 'Periapical', 'CBCT'), descripcion: String, dicomStudyInstanceUID: String (unique), series: [ObjectId ref to RadiografiaSerie]

#### RadiografiaSerie

estudio: ObjectId, modalidad: String ('DX', 'CT'), dicomSeriesInstanceUID: String (unique), imagenes: [ObjectId ref to RadiografiaImagen]

#### RadiografiaImagen

serie: ObjectId, dicomSOPInstanceUID: String (unique), numeroImagen: Number, storagePath: String (ruta al archivo en S3), anotaciones: [{ tipo: String, datos: Mixed, creadoPor: ObjectId, fecha: Date }]

### Controllers

#### RadiologiaController

- getEstudiosPorPaciente
- getDetalleEstudio
- getArchivoDicom
- crearAnotacion

### Routes

#### `/api/radiologia`

- GET /pacientes/:pacienteId/estudios
- GET /estudios/:estudioId
- GET /imagenes/:imagenId/archivo
- POST /imagenes/:imagenId/anotaciones

## 🔄 Flujos

1. El odontólogo abre la ficha de un paciente y navega a la pestaña de 'Radiología'.
2. El frontend realiza una llamada GET a '/api/radiologia/pacientes/:pacienteId/estudios' para cargar la galería de miniaturas.
3. El usuario hace clic en un estudio de la galería.
4. El sistema carga el estudio seleccionado en el componente 'VisorDicomPrincipal', realizando llamadas GET a '/api/radiologia/imagenes/:imagenId/archivo' para cada imagen del estudio.
5. El odontólogo utiliza las herramientas de la barra ('BarraHerramientasVisor') para hacer zoom, ajustar contraste o medir una distancia.
6. El odontólogo selecciona la herramienta de anotación, dibuja sobre la imagen y añade un texto.
7. Al guardar, el frontend envía una petición POST a '/api/radiologia/imagenes/:imagenId/anotaciones' con los datos de la nueva anotación.
8. La anotación queda permanentemente asociada a la imagen y se mostrará cada vez que se abra el estudio.

## 📝 User Stories

- Como odontólogo, quiero ver todas las radiografías de un paciente ordenadas por fecha para entender la evolución de su estado de salud bucal.
- Como odontólogo, quiero usar una herramienta de medición precisa sobre una radiografía periapical para planificar la longitud de trabajo en un tratamiento de endodoncia.
- Como odontólogo, quiero ajustar el brillo y contraste de una radiografía de aleta de mordida para detectar caries interproximales incipientes.
- Como técnico de radiología, quiero poder acceder al visor para confirmar que la calidad de la imagen panorámica recién tomada es adecuada para el diagnóstico antes de que el paciente se retire.
- Como odontólogo, quiero añadir una flecha y un texto sobre un hallazgo en una tomografía (CBCT) para discutir el caso con un especialista en cirugía maxilofacial.

## ⚙️ Notas Técnicas

- **Biblioteca de Visor DICOM:** Es fundamental utilizar una biblioteca especializada en el frontend para manejar archivos DICOM, como 'cornerstone.js' o 'DWV (DICOM Web Viewer)'. Estas librerías se encargan del parsing del formato, renderizado en canvas y proveen las herramientas básicas (zoom, pan, windowing).
- **Almacenamiento de archivos:** Los archivos DICOM no deben almacenarse en MongoDB. Se debe usar un servicio de almacenamiento de objetos (como AWS S3, Google Cloud Storage, o un servidor de archivos local). La base de datos solo almacenará los metadatos y la ruta al archivo.
- **Rendimiento:** Para estudios grandes como los CBCT (cientos de imágenes), se deben implementar técnicas de optimización. Esto incluye la carga progresiva ('lazy loading') de las imágenes a medida que el usuario navega por los cortes y el posible uso de protocolos DICOMweb (WADO-RS) si se integra con un PACS para solicitar imágenes pre-procesadas y comprimidas.
- **Seguridad y Cumplimiento (HIPAA/LOPD):** Las imágenes radiológicas son datos de salud altamente sensibles. Se debe garantizar la encriptación de los archivos tanto en reposo (en S3) como en tránsito (TLS/SSL). El acceso a los endpoints debe estar estrictamente controlado por roles y registrarse en un log de auditoría.
- **Integración PACS:** En clínicas de mayor tamaño que ya cuenten con un PACS (Picture Archiving and Communication System), el ERP debería integrarse con él mediante el estándar DICOMweb (QIDO-RS, WADO-RS, STOW-RS) en lugar de gestionar los archivos directamente. El ERP actuaría como un cliente de este sistema.

