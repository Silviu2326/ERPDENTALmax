# Análisis de Imágenes

**Categoría:** Integraciones | **Módulo:** Integración Radiológica

La funcionalidad de 'Análisis de Imágenes' es una herramienta de diagnóstico visual avanzada, diseñada para que odontólogos y técnicos de radiología puedan interactuar, medir, anotar y diagnosticar directamente sobre las imágenes radiológicas del paciente. Se enmarca dentro del módulo de 'Integración Radiológica', actuando como el espacio de trabajo principal una vez que las imágenes (como radiografías panorámicas, periapicales, tomografías computarizadas de haz cónico - CBCT) han sido importadas o capturadas. Esta página transforma el ERP de un simple repositorio de imágenes a un centro de diagnóstico dinámico. Permite a los profesionales realizar mediciones precisas para planificación de implantes, trazar líneas cefalométricas para ortodoncia, resaltar áreas de interés como caries o lesiones, y añadir notas textuales contextuales. Todo este análisis se guarda de forma no destructiva, como una capa de metadatos sobre la imagen original, vinculada permanentemente al historial del paciente. Esto no solo mejora la precisión del diagnóstico y la planificación del tratamiento, sino que también facilita la comunicación con el paciente, al poder mostrarle visualmente los hallazgos, y la colaboración entre especialistas, que pueden revisar los análisis de forma asíncrona. La integración con el odontograma y los planes de tratamiento permite que un hallazgo en la imagen se convierta directamente en una acción clínica planificada.

## 👥 Roles de Acceso

- Odontólogo
- Técnico de Radiología

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/integracion-radiologica/`

Esta funcionalidad se encuentra dentro de la feature 'integracion-radiologica'. La página principal, 'AnalisisImagenPage.tsx', reside en la subcarpeta '/pages' y actúa como el contenedor principal. Esta página orquesta la renderización de componentes especializados de la carpeta '/components', como el visor de imágenes 'VisorDicomAvanzado', la barra de herramientas 'PanelHerramientasAnalisis', y el panel de notas 'FormularioDiagnosticoImagen'. Las llamadas a la API para obtener imágenes, guardar y cargar análisis se gestionan a través de funciones definidas en la carpeta '/apis', que encapsulan la lógica de comunicación con el backend.

### Archivos Frontend

- `/features/integracion-radiologica/pages/AnalisisImagenPage.tsx`
- `/features/integracion-radiologica/components/VisorDicomAvanzado.tsx`
- `/features/integracion-radiologica/components/PanelHerramientasAnalisis.tsx`
- `/features/integracion-radiologica/components/ListaAnotaciones.tsx`
- `/features/integracion-radiologica/components/FormularioDiagnosticoImagen.tsx`
- `/features/integracion-radiologica/apis/analisisImagenApi.ts`

### Componentes React

- VisorDicomAvanzado
- PanelHerramientasAnalisis
- ListaAnotaciones
- FormularioDiagnosticoImagen
- ModalComparadorImagenes

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en la gestión de las imágenes radiológicas y sus análisis asociados. Se necesita un endpoint para obtener los datos de una imagen específica y otros para crear, leer, actualizar y eliminar los análisis (anotaciones, mediciones, diagnósticos) vinculados a esa imagen. Las rutas están anidadas bajo pacientes e imágenes para mantener una estructura RESTful clara.

### `GET` `/api/pacientes/:pacienteId/imagenes/:imagenId`

Obtiene los metadatos de una imagen radiológica específica, incluyendo su URL de almacenamiento y los análisis previos.

**Parámetros:** pacienteId (string, en la URL), imagenId (string, en la URL)

**Respuesta:** Objeto JSON con los detalles de la imagen y un array de objetos de análisis.

### `POST` `/api/imagenes/:imagenId/analisis`

Crea y guarda un nuevo análisis completo para una imagen. El cuerpo de la solicitud contiene todas las anotaciones, mediciones y el texto del diagnóstico.

**Parámetros:** imagenId (string, en la URL), Body: { diagnostico: string, anotaciones: object, mediciones: object }

**Respuesta:** Objeto JSON del nuevo análisis creado, incluyendo su ID.

### `PUT` `/api/analisis/:analisisId`

Actualiza un análisis existente. Permite modificar el diagnóstico, añadir o eliminar anotaciones y mediciones.

**Parámetros:** analisisId (string, en la URL), Body: { diagnostico: string, anotaciones: object, mediciones: object }

**Respuesta:** Objeto JSON del análisis actualizado.

### `DELETE` `/api/analisis/:analisisId`

Elimina un análisis completo asociado a una imagen.

**Parámetros:** analisisId (string, en la URL)

**Respuesta:** Mensaje de confirmación de la eliminación.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con dos modelos principales: 'ImagenRadiologica' para los metadatos de la imagen y 'AnalisisImagen' para los datos del análisis. Un controlador específico, 'AnalisisImagenController', gestiona la lógica de negocio, mientras que las rutas en Express exponen esta lógica de forma segura y estructurada.

### Models

#### ImagenRadiologica

paciente (ObjectId, ref: 'Paciente'), tipo (String, ej: 'Panorámica', 'Periapical'), fecha (Date), url_almacenamiento (String), formato (String, ej: 'DICOM', 'JPEG'), notas (String)

#### AnalisisImagen

imagen (ObjectId, ref: 'ImagenRadiologica'), usuario (ObjectId, ref: 'Usuario'), fecha (Date), diagnostico (String), anotaciones (Object), mediciones (Object)

### Controllers

#### AnalisisImagenController

- crearAnalisis
- obtenerAnalisisPorImagen
- actualizarAnalisis
- eliminarAnalisis

### Routes

#### `/api/analisis`

- PUT /:analisisId
- DELETE /:analisisId

#### `/api/imagenes`

- POST /:imagenId/analisis

## 🔄 Flujos

1. El odontólogo selecciona un paciente y accede a su galería de imágenes radiológicas.
2. Al hacer clic en una imagen, se abre la página de 'Análisis de Imágenes', cargando la imagen en el visor avanzado.
3. El sistema carga simultáneamente cualquier análisis previo guardado para esa imagen, superponiendo las anotaciones y mediciones.
4. El usuario utiliza el panel de herramientas para seleccionar una función: zoom, medición de distancia, medición de ángulo, dibujo a mano alzada o anotación de texto.
5. Realiza la acción sobre la imagen. Los datos (coordenadas, texto, etc.) se registran en el estado del componente.
6. El usuario escribe sus conclusiones en el campo de diagnóstico.
7. Al presionar 'Guardar', se envía una solicitud POST o PUT al backend con el objeto de análisis completo, que es persistido en la base de datos.

## 📝 User Stories

- Como odontólogo, quiero medir con precisión la altura y anchura del hueso alveolar en una radiografía para determinar la viabilidad y el tamaño de un implante dental.
- Como técnico de radiología, quiero resaltar áreas sospechosas en una radiografía panorámica para que el odontólogo las revise eficientemente.
- Como ortodoncista, quiero trazar puntos y líneas cefalométricas sobre una telerradiografía lateral de cráneo para realizar mi análisis y planificar el tratamiento.
- Como odontólogo, quiero escribir notas directamente sobre una lesión apical en una radiografía periapical para documentar su tamaño y características para seguimiento.
- Como odontólogo, quiero comparar una radiografía pre-tratamiento con una post-tratamiento lado a lado para evaluar el resultado de una endodoncia.

## ⚙️ Notas Técnicas

- Es crucial integrar una librería de frontend especializada para la visualización y manipulación de imágenes DICOM, como Cornerstone.js o DWV (DICOM Web Viewer). Esto manejará la complejidad de renderizar los datos de la imagen y proporcionará las herramientas base de manipulación (zoom, paneo, windowing).
- Las imágenes radiológicas, especialmente los archivos DICOM, son grandes. Deben almacenarse en un servicio de almacenamiento de objetos como AWS S3 o Google Cloud Storage, no directamente en MongoDB. La base de datos solo almacenará metadatos y la URL segura para acceder al archivo.
- La capa de anotaciones y mediciones debe ser guardada como un objeto JSON en el modelo 'AnalisisImagen'. Esto permite una superposición no destructiva sobre la imagen original y facilita la edición y eliminación de elementos individuales del análisis.
- La seguridad y el cumplimiento de normativas como HIPAA son primordiales. El acceso a las imágenes y análisis debe estar estrictamente controlado por roles. Todas las URLs a los archivos de imagen deben ser pre-firmadas y de corta duración para evitar el acceso no autorizado.
- El rendimiento es clave. Implementar carga diferida (lazy loading) para las imágenes en la galería y optimizar la renderización en el visor para garantizar una experiencia de usuario fluida, incluso con archivos CBCT de gran tamaño.

