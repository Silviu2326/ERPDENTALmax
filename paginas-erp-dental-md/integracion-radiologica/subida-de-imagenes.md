# Subida de Imágenes

**Categoría:** Integraciones | **Módulo:** Integración Radiológica

La funcionalidad de 'Subida de Imágenes' es un componente crítico dentro del módulo de 'Integración Radiológica' del ERP dental. Su propósito principal es permitir al personal autorizado, como técnicos de radiología y asistentes, cargar de manera eficiente y segura diversos tipos de imágenes diagnósticas directamente al historial clínico digital del paciente. Esto incluye, pero no se limita a, radiografías panorámicas, periapicales, tomografías computarizadas de haz cónico (CBCT), fotografías intraorales y extraorales, y escaneos digitales. La página está diseñada para ser intuitiva, soportando la carga de múltiples archivos simultáneamente mediante un sistema de 'arrastrar y soltar' (drag-and-drop) o un selector de archivos tradicional. Una vez cargadas, el sistema asocia automáticamente estas imágenes con el paciente seleccionado, permitiendo al personal añadir metadatos cruciales como el tipo de imagen, la fecha de captura y notas relevantes. Esta centralización de la información visual es fundamental para un diagnóstico preciso, la planificación de tratamientos y el seguimiento del progreso del paciente. Al integrarse directamente con el perfil del paciente, los odontólogos y especialistas pueden acceder a todo el historial radiológico desde cualquier lugar, mejorando la colaboración y la toma de decisiones clínicas. La correcta implementación de esta funcionalidad reduce la dependencia de sistemas de archivo físico, minimiza el riesgo de pérdida de información y agiliza los flujos de trabajo en la clínica.

## 👥 Roles de Acceso

- Técnico de Radiología
- Auxiliar / Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/integracion-radiologica/`

La feature se organiza dentro de la carpeta '/features/integracion-radiologica/'. La subcarpeta '/pages/' contiene el componente principal de la página, '/components/' alberga los componentes reutilizables de la interfaz como el área de subida, la previsualización de imágenes y el buscador de pacientes. Finalmente, '/apis/' contiene las funciones que encapsulan las llamadas al backend para buscar pacientes y subir las imágenes.

### Archivos Frontend

- `/features/integracion-radiologica/pages/SubidaImagenesPage.tsx`
- `/features/integracion-radiologica/components/UploaderArea.tsx`
- `/features/integracion-radiologica/components/ImagePreviewCard.tsx`
- `/features/integracion-radiologica/components/PatientSearchAutocomplete.tsx`
- `/features/integracion-radiologica/apis/imagenesApi.ts`

### Componentes React

- SubidaImagenesPage
- UploaderArea
- ImagePreviewCard
- PatientSearchAutocomplete
- UploadProgressBar

## 🔌 APIs Backend

Se necesitan dos APIs principales. Una para buscar pacientes por nombre o DNI y así asociar las imágenes correctamente. La segunda, y más importante, es el endpoint de subida de imágenes, que debe ser capaz de manejar 'multipart/form-data' para recibir los archivos junto con los metadatos asociados (ID del paciente, tipo de imagen, notas).

### `GET` `/api/pacientes/buscar`

Busca pacientes por término de búsqueda (nombre, apellido, DNI) para asociar las imágenes. Devuelve una lista reducida de pacientes que coinciden.

**Parámetros:** query: 'termino' (string)

**Respuesta:** Array de objetos de paciente con { _id, nombre, apellido, dni }

### `POST` `/api/imagenes-radiologicas/upload`

Sube una o más imágenes y las asocia a un paciente. Utiliza 'multipart/form-data' para la carga de archivos.

**Parámetros:** formData: 'pacienteId' (string), formData: 'imagenes' (array de archivos), formData: 'metadata' (JSON string, array de objetos con { nombreOriginal, tipoImagen, notas })

**Respuesta:** Objeto con un mensaje de éxito y los detalles de las imágenes subidas.

## 🗂️ Estructura Backend (MERN)

Para el backend, se necesita un modelo 'ImagenRadiologica' en MongoDB para almacenar los metadatos de cada imagen, incluyendo una referencia al paciente. El archivo físico se guardará en un servicio de almacenamiento de objetos (como AWS S3) y la URL se almacenará en el modelo. Se creará un 'ImagenRadiologicaController' para manejar la lógica de subida y un archivo de rutas para exponer los endpoints necesarios.

### Models

#### ImagenRadiologica

{ pacienteId: ObjectId (ref: 'Paciente'), tipoImagen: String ('Panorámica', 'Periapical', 'Intraoral', etc.), url: String, nombreArchivo: String, fechaCaptura: Date, fechaSubida: Date, subidoPor: ObjectId (ref: 'Usuario'), notas: String }

### Controllers

#### ImagenRadiologicaController

- subirImagenes
- obtenerImagenesPorPaciente

### Routes

#### `/api/imagenes-radiologicas`

- POST /upload

## 🔄 Flujos

1. El Técnico de Radiología accede a la página 'Subida de Imágenes' desde el menú de Integración Radiológica.
2. El sistema muestra un campo de búsqueda. El técnico busca al paciente por nombre o DNI.
3. Una vez seleccionado el paciente, se activa el área de subida.
4. El técnico arrastra y suelta varios archivos de imagen (JPEG, PNG, DICOM) en el área designada o los selecciona mediante un explorador de archivos.
5. El sistema muestra una previsualización de cada imagen, junto con campos para seleccionar el tipo de imagen y añadir notas para cada una.
6. El técnico completa los metadatos y hace clic en el botón 'Subir Imágenes'.
7. El frontend muestra una barra de progreso general para la carga.
8. El backend procesa los archivos, los guarda en el almacenamiento de objetos, crea los registros correspondientes en la base de datos y los asocia con el paciente.
9. El sistema muestra un mensaje de confirmación de éxito o un error detallado si algo falla.
10. Las imágenes ya están disponibles en el historial radiológico del paciente.

## 📝 User Stories

- Como Técnico de Radiología, quiero subir múltiples imágenes a la vez para un paciente para optimizar mi tiempo y agilizar el proceso de digitalización.
- Como Auxiliar, quiero buscar y seleccionar fácilmente a un paciente antes de subir imágenes para asegurar que los archivos se asocian al historial correcto.
- Como Técnico de Radiología, quiero poder especificar el tipo de cada imagen (ej. 'Panorámica', 'Periapical') y añadir notas durante la subida para que el odontólogo tenga todo el contexto necesario para el diagnóstico.
- Como Auxiliar, quiero ver una previsualización de las imágenes antes de confirmar la subida para verificar que estoy subiendo los archivos correctos.
- Como Técnico de Radiología, quiero recibir una confirmación clara cuando las imágenes se hayan subido correctamente para tener la seguridad de que el proceso ha finalizado.

## ⚙️ Notas Técnicas

- Seguridad: Implementar validación en el backend para aceptar solo tipos de archivo de imagen permitidos (ej. image/jpeg, image/png, application/dicom) para prevenir la subida de archivos maliciosos. Proteger el endpoint de subida con autenticación JWT y autorización basada en roles.
- Almacenamiento: No almacenar los archivos de imagen directamente en MongoDB. Utilizar un servicio de almacenamiento de objetos como AWS S3, Google Cloud Storage o Cloudinary. MongoDB solo almacenará los metadatos y la URL del archivo.
- Rendimiento: Implementar compresión de imágenes en el cliente (usando librerías como 'browser-image-compression') antes de la subida para reducir el tamaño de los archivos y acelerar la transferencia, especialmente para fotografías de alta resolución.
- Manejo de Archivos Grandes: Para archivos muy grandes como los de CBCT, utilizar subida en streaming o por partes (multipart upload) para mejorar la fiabilidad y permitir reanudar subidas fallidas.
- Integración DICOM: Considerar el uso de una librería en el backend (ej. 'dicom-parser') para extraer metadatos automáticamente de los archivos DICOM (como datos del paciente, fecha de estudio, etc.) y pre-rellenar los campos correspondientes.
- UI/UX: Proveer feedback visual claro durante todo el proceso: estado de 'arrastre', previsualización de imágenes, progreso de subida individual y total, y mensajes de éxito/error.

