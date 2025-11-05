# Ortodoncia: Diagnóstico (Fotos/Modelos)

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

Esta funcionalidad es un componente esencial dentro del módulo de 'Especialidades Clínicas', diseñada específicamente para la gestión integral de los registros diagnósticos en tratamientos de ortodoncia. Actúa como un repositorio digital centralizado y estructurado para todas las imágenes y modelos necesarios para el diagnóstico, planificación y seguimiento de casos ortodónticos. Permite a los ortodoncistas y técnicos subir, clasificar y visualizar fotografías intraorales y extraorales, radiografías (cefalométricas, panorámicas) y modelos de estudio digitales (escaneos 3D en formatos como STL u OBJ). La página está organizada para presentar los registros de manera cronológica y por etapas del tratamiento (por ejemplo, 'Inicial', 'Progreso 1', 'Final'), facilitando la comparación visual de la evolución del paciente. Esta digitalización elimina la necesidad de álbumes de fotos físicos y modelos de yeso, reduciendo costos de almacenamiento y riesgo de pérdida o deterioro. Además de ser una herramienta clínica para el análisis de casos, es fundamental para la comunicación con el paciente, permitiendo mostrarle de forma clara el antes, el durante y el después del tratamiento. También sirve como un registro médico-legal robusto y fácilmente compartible con otros especialistas para interconsultas, todo dentro de un entorno seguro y cumpliendo con las normativas de protección de datos del paciente.

## 👥 Roles de Acceso

- Odontólogo
- Técnico de Radiología

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

La funcionalidad se encuentra dentro de la feature 'especialidades-clinicas'. La página principal, definida en la carpeta /pages, renderiza la interfaz de gestión de diagnósticos. Esta página utiliza múltiples componentes reutilizables de la carpeta /components, como una galería de imágenes, un modal de subida de archivos y un visor de imágenes avanzado. La lógica para interactuar con el backend (obtener, subir y eliminar datos) está encapsulada en funciones dentro de la carpeta /apis, que realizan las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/OrtodonciaDiagnosticoPage.tsx`

### Componentes React

- GaleriaDiagnosticoOrtodoncia
- VisorImagenDentalAvanzado
- UploaderArchivosDiagnostico
- ComparadorImagenesSideBySide
- TimelineEtapasTratamiento

## 🔌 APIs Backend

Las APIs gestionan todas las operaciones CRUD para los registros de diagnóstico ortodóntico de un paciente. Incluye endpoints para obtener todos los registros de un paciente, crear un nuevo conjunto de registros (manejando la subida de múltiples archivos), y eliminar archivos individuales o conjuntos completos. Se requiere un manejo especial para subidas de archivos (multipart/form-data).

### `GET` `/api/pacientes/:pacienteId/ortodoncia/diagnosticos`

Obtiene todos los conjuntos de registros de diagnóstico ortodóntico para un paciente específico, ordenados por fecha.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Un array de objetos OrtodonciaDiagnostico.

### `POST` `/api/pacientes/:pacienteId/ortodoncia/diagnosticos`

Crea un nuevo conjunto de registros de diagnóstico. Maneja la subida de múltiples archivos (fotos, modelos) y los asocia al paciente y a una etapa del tratamiento.

**Parámetros:** pacienteId (en la URL), formData (en el body): { fecha: Date, etapa: string, notas: string, archivos: File[] }

**Respuesta:** El nuevo objeto OrtodonciaDiagnostico creado.

### `DELETE` `/api/ortodoncia/diagnosticos/:diagnosticoId`

Elimina un conjunto completo de registros de diagnóstico (por ejemplo, todas las fotos de la etapa 'Inicial').

**Parámetros:** diagnosticoId (en la URL)

**Respuesta:** Un mensaje de confirmación.

### `PUT` `/api/ortodoncia/diagnosticos/:diagnosticoId/archivos/:archivoId`

Actualiza la metadata de un archivo específico, como su categoría o subtipo.

**Parámetros:** diagnosticoId (en la URL), archivoId (en la URL), body: { tipo: string, subtipo: string }

**Respuesta:** El objeto OrtodonciaDiagnostico actualizado.

### `DELETE` `/api/ortodoncia/diagnosticos/:diagnosticoId/archivos/:archivoId`

Elimina un único archivo de un conjunto de diagnóstico.

**Parámetros:** diagnosticoId (en la URL), archivoId (en la URL)

**Respuesta:** El objeto OrtodonciaDiagnostico actualizado sin el archivo eliminado.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo de MongoDB 'OrtodonciaDiagnostico' para estructurar los datos. Este modelo está referenciado al modelo 'Paciente'. El controlador 'OrtodonciaDiagnosticoController' contiene la lógica para manejar las operaciones, incluyendo la interacción con un servicio de almacenamiento en la nube (como S3) para los archivos. Las rutas de Express exponen estas funcionalidades de forma segura y RESTful.

### Models

#### OrtodonciaDiagnostico

pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true }, fecha: { type: Date, required: true }, etapa: { type: String, enum: ['Inicial', 'Progreso', 'Final', 'Retención'], required: true }, notas: String, archivos: [{ _id: Schema.Types.ObjectId, nombreArchivo: String, url: String, tipo: String, subtipo: String, fechaSubida: Date }]

### Controllers

#### OrtodonciaDiagnosticoController

- obtenerDiagnosticosPorPaciente
- crearDiagnosticoConArchivos
- eliminarDiagnosticoCompleto
- actualizarMetadataArchivo
- eliminarArchivo

### Routes

#### `/api/ortodoncia/diagnosticos`

- GET /pacientes/:pacienteId/ortodoncia/diagnosticos
- POST /pacientes/:pacienteId/ortodoncia/diagnosticos
- DELETE /:diagnosticoId
- PUT /:diagnosticoId/archivos/:archivoId
- DELETE /:diagnosticoId/archivos/:archivoId

## 🔄 Flujos

1. El odontólogo selecciona un paciente y navega a la sección 'Ortodoncia: Diagnóstico' desde la ficha del paciente.
2. La interfaz carga y muestra todos los conjuntos de diagnósticos existentes para ese paciente, agrupados por etapas (Inicial, Progreso, etc.) en una línea de tiempo visual.
3. El usuario (Odontólogo o Técnico) hace clic en 'Añadir Registro'. Se abre un modal donde selecciona la etapa, la fecha y arrastra las fotos y/o modelos de estudio.
4. Para cada archivo subido, el sistema permite al usuario asignar una categoría (ej. 'Foto Intraoral') y subcategoría (ej. 'Oclusal Superior').
5. Una vez confirmada la subida, el nuevo conjunto de imágenes aparece en la galería.
6. El odontólogo puede hacer clic en una imagen para abrirla en un visor a pantalla completa con herramientas de zoom y paneo.
7. El odontólogo utiliza la función de 'Comparar' para seleccionar dos imágenes (ej. una 'Inicial' y otra de 'Progreso') y verlas una al lado de la otra para analizar la evolución.

## 📝 User Stories

- Como Ortodoncista, quiero subir y categorizar todas las fotos y modelos de estudio de un paciente en un solo lugar para tener un registro diagnóstico completo y organizado.
- Como Ortodoncista, quiero ver las fotos iniciales y de progreso de un paciente una al lado de la otra para evaluar la evolución del tratamiento y tomar decisiones clínicas.
- Como Técnico de Radiología, quiero subir las radiografías y fotos que he tomado de un paciente directamente a su ficha de ortodoncia para que el doctor pueda acceder a ellas inmediatamente.
- Como Ortodoncista, quiero añadir notas a un conjunto de registros diagnósticos para documentar mis observaciones y plan de tratamiento.
- Como Ortodoncista, quiero acceder rápidamente al historial fotográfico completo de un paciente desde cualquier dispositivo para poder discutir el caso con el paciente o con otros colegas.

## ⚙️ Notas Técnicas

- Almacenamiento de archivos: Se debe utilizar un servicio de almacenamiento de objetos en la nube (ej. AWS S3, Google Cloud Storage) para alojar los archivos. En la base de datos MongoDB solo se guardará la URL o identificador del archivo, no el binario.
- Seguridad: Los endpoints de la API deben estar protegidos para garantizar que solo los roles autorizados puedan acceder o modificar los datos de un paciente. Las URLs de acceso a los archivos deben ser firmadas (presigned URLs) o servidas a través de un proxy en el backend para controlar el acceso y evitar la exposición pública.
- Rendimiento: Implementar la generación automática de miniaturas (thumbnails) en el backend al momento de la subida. La galería debe cargar las miniaturas y solo descargar la imagen de alta resolución bajo demanda (cuando el usuario hace clic) para optimizar los tiempos de carga.
- Manejo de archivos grandes: El backend debe estar configurado para aceptar archivos de gran tamaño, especialmente para los modelos 3D (.STL). Utilizar librerías como 'multer' con un storage engine para S3 permite subir archivos directamente al servicio en la nube sin sobrecargar el servidor de la aplicación.
- Integración DICOM: Para una visualización adecuada de radiografías en formato DICOM, se recomienda integrar una librería de visualización DICOM en el frontend, como Cornerstone.js o DWV (DICOM Web Viewer).

