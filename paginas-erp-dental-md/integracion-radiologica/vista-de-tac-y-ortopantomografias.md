# Vista de TAC y Ortopantomografías

**Categoría:** Integraciones | **Módulo:** Integración Radiológica

La funcionalidad 'Vista de TAC y Ortopantomografías' es un componente central del módulo de 'Integración Radiológica'. Proporciona una interfaz web avanzada y especializada para la visualización, análisis y gestión de estudios de imagenología diagnóstica en formato DICOM, como Tomografías Axiales Computarizadas (TAC) y Ortopantomografías. Su propósito principal es eliminar la dependencia de software de escritorio de terceros y centralizar toda la información clínica del paciente, incluidas las imágenes radiológicas, dentro del ERP dental. Al integrarse directamente con la ficha del paciente, permite a los odontólogos y especialistas acceder a los estudios de imagen con un solo clic, contextualizando el diagnóstico con el historial clínico, el odontograma y los planes de tratamiento. La página no es un simple visor de imágenes; incorpora herramientas interactivas esenciales para el diagnóstico dental: zoom de alta fidelidad, medición de distancias y ángulos, ajuste de brillo/contraste, y la capacidad de añadir anotaciones y marcadores directamente sobre las imágenes. Esto facilita la planificación de implantes, la evaluación de patologías óseas, el estudio de endodoncias complejas y la comunicación con el paciente y otros colegas. Su funcionamiento se basa en la carga de archivos DICOM desde un almacenamiento seguro (cloud o local) y su renderización en el navegador mediante librerías especializadas de JavaScript, garantizando un rendimiento fluido y una experiencia de usuario profesional.

## 👥 Roles de Acceso

- Odontólogo
- Técnico de Radiología

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/integracion-radiologica/`

Esta funcionalidad se encuentra dentro de la feature 'integracion-radiologica'. La página principal, ubicada en /pages, actúa como el contenedor del visor. En /components se alojan los elementos especializados: el componente principal del visor DICOM, la barra de herramientas interactivas, la galería de miniaturas para navegar entre diferentes estudios del paciente y el panel de metadatos del estudio. El directorio /apis contiene las funciones para comunicarse con el backend, específicamente para obtener la lista de estudios de un paciente y para solicitar el archivo DICOM a visualizar.

### Archivos Frontend

- `/features/integracion-radiologica/pages/VisorEstudiosRadiologicosPage.tsx`
- `/features/integracion-radiologica/components/VisorDicom.tsx`
- `/features/integracion-radiologica/components/BarraHerramientasVisor.tsx`
- `/features/integracion-radiologica/components/GaleriaEstudiosPaciente.tsx`
- `/features/integracion-radiologica/components/PanelMetadatosEstudio.tsx`
- `/features/integracion-radiologica/apis/estudiosApi.ts`

### Componentes React

- VisorEstudiosRadiologicosPage
- VisorDicom
- BarraHerramientasVisor
- GaleriaEstudiosPaciente
- PanelMetadatosEstudio

## 🔌 APIs Backend

Las APIs para esta funcionalidad se encargan de gestionar los metadatos de los estudios radiológicos y de proporcionar acceso seguro a los archivos DICOM, que son la base para la visualización. Se necesita un endpoint para listar todos los estudios asociados a un paciente y otro para obtener la información y el enlace de descarga seguro de un estudio específico.

### `GET` `/api/radiologia/estudios/paciente/:pacienteId`

Obtiene una lista de todos los estudios radiológicos (metadatos) asociados a un ID de paciente específico. Se usa para poblar la galería de estudios.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Un array de objetos, donde cada objeto contiene metadatos del estudio como id, tipoEstudio, fechaEstudio, descripción.

### `GET` `/api/radiologia/estudios/:estudioId`

Obtiene los detalles completos de un estudio radiológico específico, incluyendo un enlace seguro y de corta duración (signed URL) para acceder al archivo DICOM.

**Parámetros:** estudioId (en la URL)

**Respuesta:** Un objeto con los metadatos completos del estudio y el campo 'urlDicom' para que el frontend lo cargue en el visor.

### `POST` `/api/radiologia/estudios/:estudioId/anotaciones`

Guarda las anotaciones (texto, mediciones, dibujos) realizadas por el odontólogo sobre un estudio. Las anotaciones se almacenan como un objeto JSON.

**Parámetros:** estudioId (en la URL), Body: { anotaciones: {...} }

**Respuesta:** Objeto con el estado de la operación y las anotaciones actualizadas.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo 'EstudioRadiologico' para almacenar en MongoDB los metadatos de cada estudio. Es crucial entender que los archivos DICOM, por su tamaño, no se guardan en la base de datos, sino en un servicio de almacenamiento de objetos (como AWS S3 o MinIO). El modelo solo guarda la referencia (path o URL) a dicho archivo. El controlador gestiona la lógica para consultar estos metadatos y para generar los enlaces de acceso seguro a los archivos.

### Models

#### EstudioRadiologico

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true }, tipoEstudio: { type: String, enum: ['TAC', 'Ortopantomografía', 'Periapical', 'Cefalometría'], required: true }, fechaEstudio: { type: Date, default: Date.now }, descripcion: String, tecnicoAsignado: { type: Schema.Types.ObjectId, ref: 'Usuario' }, notas: String, storagePath: { type: String, required: true }, anotaciones: { type: Object }

### Controllers

#### EstudioRadiologicoController

- getEstudiosByPacienteId
- getEstudioById
- saveAnotaciones

### Routes

#### `/api/radiologia/estudios`

- /paciente/:pacienteId (GET)
- /:estudioId (GET)
- /:estudioId/anotaciones (POST)

## 🔄 Flujos

1. El odontólogo accede a la ficha de un paciente y navega a la pestaña 'Imágenes Radiológicas'.
2. El frontend llama al endpoint GET /api/radiologia/estudios/paciente/:pacienteId para cargar la lista de estudios disponibles para ese paciente en la 'GaleriaEstudiosPaciente'.
3. El usuario hace clic en una miniatura de un estudio (ej. 'Ortopantomografía 2023-10-26').
4. El frontend llama al endpoint GET /api/radiologia/estudios/:estudioId. El backend devuelve los metadatos y una URL firmada y temporal para acceder al archivo DICOM.
5. El componente 'VisorDicom' recibe la URL del archivo y lo carga utilizando una librería especializada (ej. Cornerstone.js), renderizando la imagen en el canvas.
6. El odontólogo utiliza la 'BarraHerramientasVisor' para realizar mediciones, ajustar contraste o añadir anotaciones.
7. Al guardar, las anotaciones se envían mediante POST /api/radiologia/estudios/:estudioId/anotaciones para ser persistidas en la base de datos junto al estudio.

## 📝 User Stories

- Como odontólogo, quiero visualizar las ortopantomografías de mis pacientes directamente en su ficha para poder evaluar la posición de los dientes y detectar posibles problemas sin cambiar de aplicación.
- Como especialista en implantes, quiero tener herramientas de medición precisas sobre la imagen de un TAC para planificar la longitud y el diámetro del implante de forma segura.
- Como técnico de radiología, quiero acceder a los estudios que he subido para confirmar que se visualizan correctamente en el sistema y añadir notas técnicas si es necesario.
- Como odontólogo, quiero poder ajustar el brillo y el contraste de una radiografía para resaltar detalles que no son visibles a simple vista y mejorar la precisión de mi diagnóstico.
- Como odontólogo, quiero guardar mis anotaciones y mediciones sobre una imagen para poder consultarlas en futuras visitas y tener un registro de mis hallazgos.

## ⚙️ Notas Técnicas

- **Librería DICOM Viewer:** Es imprescindible utilizar una librería de JavaScript especializada en la renderización de archivos DICOM en el navegador, como Cornerstone.js, DWV (DICOM Web Viewer) o OHIF Viewer. Estas librerías manejan la complejidad del formato DICOM y proveen las herramientas de visualización necesarias.
- **Almacenamiento de Archivos:** Los archivos DICOM son grandes. No deben almacenarse en MongoDB. La mejor práctica es utilizar un servicio de almacenamiento de objetos (como AWS S3, Google Cloud Storage, o un servidor MinIO auto-hospedado). La base de datos solo almacenará la ruta o clave del objeto.
- **Seguridad de Archivos:** El acceso a los archivos DICOM debe ser estrictamente controlado. Se recomienda el uso de URLs firmadas (pre-signed URLs) con un tiempo de expiración corto. El backend las genera bajo demanda solo para usuarios autenticados y autorizados, evitando la exposición directa de los archivos.
- **Rendimiento:** Para mejorar la experiencia del usuario, se deben implementar estrategias como la carga progresiva de las series de imágenes (en el caso de TACs) y optimizar la comunicación entre el visor y la fuente de datos. El servidor backend debe ser capaz de servir los archivos de forma eficiente.
- **Cumplimiento Normativo:** El manejo de imágenes médicas está sujeto a regulaciones estrictas (como HIPAA en EE.UU. o RGPD en Europa). Se debe garantizar el cifrado de los datos en reposo y en tránsito, así como un control de acceso riguroso basado en roles.

