# Mis Imágenes (RX/Fotos Clínicas)

**Categoría:** Portal del Paciente | **Módulo:** Portal del Paciente

La funcionalidad 'Mis Imágenes (RX/Fotos Clínicas)' es una sección fundamental dentro del Portal del Paciente. Su propósito principal es ofrecer a los pacientes un acceso directo, seguro y centralizado a todo su historial de imágenes diagnósticas y clínicas, como radiografías (periapicales, panorámicas), tomografías y fotografías intraorales o extraorales. Esta herramienta empodera al paciente, fomentando su participación activa en el cuidado de su salud bucal al permitirle visualizar y comprender mejor los diagnósticos y la planificación de tratamientos propuestos por el profesional. Funciona como un repositorio personal donde el paciente puede consultar su evolución a lo largo del tiempo, comparar el estado 'antes y después' de un tratamiento, o descargar sus estudios para obtener una segunda opinión. Dentro del ERP dental, los odontólogos y asistentes cargan estas imágenes durante las consultas y las asocian al historial clínico del paciente. El Portal del Paciente consume esta información de forma segura y la presenta en una interfaz amigable y fácil de navegar, fortaleciendo la transparencia, la confianza y la comunicación entre la clínica y sus pacientes, y añadiendo un valor diferencial al servicio ofrecido.

## 👥 Roles de Acceso

- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-paciente/`

Toda la lógica de frontend para el Portal del Paciente, incluyendo la sección 'Mis Imágenes', se encuentra dentro de la carpeta '/features/portal-paciente/'. La página principal de esta funcionalidad reside en '/pages/MisImagenesPage.tsx'. Esta página utiliza componentes reutilizables de la carpeta '/components/', como 'GaleriaImagenesGrid' para mostrar las miniaturas y 'VisorImagenModal' para la visualización a pantalla completa. Las llamadas al backend para obtener los datos de las imágenes están encapsuladas en el archivo '/apis/imagenesApi.ts', promoviendo una separación clara de responsabilidades.

### Archivos Frontend

- `/features/portal-paciente/pages/MisImagenesPage.tsx`
- `/features/portal-paciente/components/GaleriaImagenesGrid.tsx`
- `/features/portal-paciente/components/ImagenThumbnail.tsx`
- `/features/portal-paciente/components/VisorImagenModal.tsx`
- `/features/portal-paciente/components/FiltrosImagenes.tsx`
- `/features/portal-paciente/apis/imagenesApi.ts`

### Componentes React

- MisImagenesPage
- GaleriaImagenesGrid
- ImagenThumbnail
- VisorImagenModal
- FiltrosImagenes

## 🔌 APIs Backend

El backend debe proporcionar endpoints seguros y protegidos para que el paciente autenticado pueda listar las metadata de sus imágenes y acceder a los archivos de imagen de forma controlada.

### `GET` `/api/portal/pacientes/me/imagenes`

Obtiene una lista paginada de la metadata de todas las imágenes (RX, fotos) asociadas al paciente actualmente autenticado. Permite filtrar por tipo y rango de fechas.

**Parámetros:** query: page (number), query: limit (number), query: tipo (string, ej: 'RX_PANORAMICA'), query: fechaDesde (string, formato ISO), query: fechaHasta (string, formato ISO)

**Respuesta:** JSON: { data: [ { id, nombre, tipo, fecha_captura, descripcion, url_thumbnail } ], total, pages }

### `GET` `/api/portal/pacientes/me/imagenes/:id/descargar`

Descarga el archivo de imagen original de forma segura. El backend valida que la imagen pertenezca al paciente autenticado antes de servir el archivo.

**Parámetros:** path: id (string, ID de la imagen)

**Respuesta:** El archivo de imagen (ej: image/jpeg, image/png, application/dicom).

## 🗂️ Estructura Backend (MERN)

El backend utiliza el modelo 'ImagenClinica' para almacenar la información de cada imagen, vinculada a un 'Paciente'. El 'PortalImagenesController' contiene la lógica para verificar la propiedad de las imágenes y recuperarlas, mientras que las rutas en 'portalRoutes.js' exponen estos servicios de forma segura para el portal.

### Models

#### ImagenClinica

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true }, profesional: { type: Schema.Types.ObjectId, ref: 'Usuario' }, fecha_captura: { type: Date, default: Date.now }, tipo: { type: String, enum: ['RX_PERIAPICAL', 'RX_BITEWING', 'RX_PANORAMICA', 'FOTO_INTRAORAL', 'FOTO_EXTRAORAL', 'TOMOGRAFIA', 'OTRO'], required: true }, descripcion: { type: String }, url_archivo: { type: String, required: true }, url_thumbnail: { type: String, required: true }, nombre_archivo: { type: String }

### Controllers

#### PortalImagenesController

- obtenerMisImagenes
- descargarMiImagen

### Routes

#### `/api/portal/pacientes`

- GET /me/imagenes
- GET /me/imagenes/:id/descargar

## 🔄 Flujos

1. El paciente inicia sesión en el Portal del Paciente.
2. El paciente navega a la sección 'Mis Imágenes' a través del menú de navegación.
3. El frontend realiza una llamada a `GET /api/portal/pacientes/me/imagenes`.
4. El backend verifica el token de autenticación, identifica al paciente y consulta la base de datos para encontrar todas las 'ImagenClinica' asociadas.
5. La página muestra una galería de miniaturas con la información básica de cada imagen (tipo, fecha).
6. El paciente puede utilizar los filtros para buscar imágenes por tipo (ej: 'Solo Radiografías') o por un rango de fechas.
7. Al hacer clic en una miniatura, se abre un modal que muestra la imagen en alta resolución.
8. Dentro del modal, el paciente tiene un botón para descargar la imagen, que llama al endpoint `GET /api/portal/pacientes/me/imagenes/:id/descargar`.

## 📝 User Stories

- Como paciente, quiero acceder a mi galería de imágenes dentales para poder revisar mi historial radiográfico en cualquier momento.
- Como paciente, quiero filtrar mis imágenes por fecha para encontrar fácilmente las que corresponden a mi última visita a la clínica.
- Como paciente, quiero visualizar mis fotos clínicas en alta calidad para entender mejor la explicación del odontólogo sobre mi tratamiento.
- Como paciente, quiero poder descargar una radiografía específica para enviársela a otro especialista y obtener una segunda opinión.
- Como paciente, quiero que la interfaz sea simple e intuitiva, mostrando mis imágenes de forma ordenada y clara.

## ⚙️ Notas Técnicas

- Seguridad: Es crítico que todos los endpoints estén protegidos por un middleware de autenticación (JWT). La lógica del controlador debe asegurar rigurosamente que un paciente solo pueda acceder a imágenes cuyo 'paciente_id' coincida con su propio ID.
- Almacenamiento de archivos: Las imágenes no deben almacenarse en la base de datos MongoDB. Se recomienda utilizar un servicio de almacenamiento de objetos como AWS S3, Google Cloud Storage o MinIO. MongoDB solo almacenará las rutas (URLs o claves) a los archivos.
- Rendimiento: Se deben generar y almacenar thumbnails de cada imagen en el momento de la carga para agilizar la visualización de la galería. La API de listado de imágenes debe implementar paginación para manejar eficientemente a pacientes con un gran historial de imágenes.
- URLs Seguras: El endpoint de descarga no debe exponer la URL directa del bucket de almacenamiento. Debe actuar como un proxy seguro que primero autentica y autoriza al usuario y luego transmite el archivo (stream), evitando así el acceso no autorizado a los archivos.
- Manejo de DICOM: Si el sistema debe soportar archivos DICOM, el componente 'VisorImagenModal' en el frontend necesitará una librería especializada en JavaScript (como Cornerstone.js) para renderizar este formato correctamente.

