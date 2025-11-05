# Editor de Landing Pages de Campaña

**Categoría:** Marketing y Web | **Módulo:** Marketing Avanzado y Web

El 'Editor de Landing Pages de Campaña' es una herramienta visual y potente diseñada para que el equipo de marketing de la clínica dental pueda crear, gestionar y publicar páginas de aterrizaje de alta conversión sin necesidad de conocimientos técnicos de programación. Esta funcionalidad permite construir páginas específicas para campañas de marketing, como promociones de blanqueamiento dental, ofertas de ortodoncia invisible, o captación de nuevos pacientes para implantes. Funciona mediante una interfaz de arrastrar y soltar (drag-and-drop), donde el usuario puede seleccionar componentes predefinidos (bloques de texto, imágenes, galerías, formularios de contacto, testimonios, mapas de ubicación) y organizarlos para crear un diseño atractivo y efectivo. Dentro del módulo padre 'Marketing Avanzado y Web', este editor es fundamental, ya que actúa como el punto de entrada para los leads generados por campañas online. Cada formulario enviado a través de estas landing pages se integra directamente con el módulo de CRM del ERP, creando automáticamente un registro de 'prospecto' y asignándolo a la campaña correspondiente. Esto permite un seguimiento completo del ciclo de vida del paciente, desde el primer contacto hasta la conversión, y proporciona datos cruciales para calcular el Retorno de la Inversión (ROI) de cada iniciativa de marketing. Además, el editor permite configurar metadatos SEO para cada página, optimizando su visibilidad en motores de búsqueda.

## 👥 Roles de Acceso

- Marketing / CRM
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/marketing-avanzado-web/`

Esta funcionalidad reside dentro de la carpeta '/features/marketing-avanzado-web/'. La lógica de la interfaz se divide en 'pages' para las vistas principales (el editor y el listado de páginas) y 'components' para los elementos reutilizables de la UI como el canvas del editor, la librería de bloques, el panel de propiedades y los diferentes tipos de bloques (texto, imagen, formulario). Las llamadas al backend para guardar, cargar y publicar las páginas se gestionan en la subcarpeta 'apis'.

### Archivos Frontend

- `/features/marketing-avanzado-web/pages/LandingPageEditorPage.tsx`
- `/features/marketing-avanzado-web/pages/LandingPageDashboardPage.tsx`
- `/features/marketing-avanzado-web/pages/public/[slug].tsx`

### Componentes React

- LandingPageCanvas
- BlockLibrarySidebar
- PropertyInspectorPanel
- TextBlockEditor
- ImageBlockEditor
- LeadCaptureFormBlock
- TestimonialBlock
- PublishSettingsModal
- LandingPageCard

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de una landing page, desde su creación y almacenamiento (guardando la estructura JSON de los componentes) hasta su publicación y la captura de leads a través de sus formularios.

### `POST` `/api/landing-pages`

Crea una nueva landing page en estado de borrador.

**Parámetros:** nombre: string, plantillaId: string (opcional)

**Respuesta:** El objeto de la nueva landing page creada.

### `GET` `/api/landing-pages`

Obtiene una lista de todas las landing pages creadas, con metadatos y estadísticas básicas.

**Respuesta:** Un array de objetos de landing pages.

### `GET` `/api/landing-pages/:id`

Obtiene los datos completos de una landing page específica, incluyendo su estructura de contenido JSON, para cargarla en el editor.

**Parámetros:** id: string (ID de la landing page)

**Respuesta:** El objeto completo de la landing page.

### `PUT` `/api/landing-pages/:id`

Actualiza una landing page. Se usa para guardar cambios en el contenido, configuración SEO, y para cambiar su estado (borrador/publicada).

**Parámetros:** id: string, body: { nombre, contenidoJson, seoMeta, estado, slug }

**Respuesta:** El objeto de la landing page actualizada.

### `DELETE` `/api/landing-pages/:id`

Elimina una landing page.

**Parámetros:** id: string

**Respuesta:** Un mensaje de confirmación.

### `POST` `/api/landing-pages/leads/:landingPageId`

Endpoint público para que el formulario de una landing page envíe los datos de un nuevo prospecto. Crea un registro en el CRM.

**Parámetros:** landingPageId: string, body: { nombre, email, telefono, mensaje }

**Respuesta:** Un mensaje de éxito.

## 🗂️ Estructura Backend (MERN)

El backend utiliza dos modelos principales: 'LandingPage' para almacenar la configuración y el contenido de cada página, y 'Lead' para los prospectos capturados. Un controlador gestiona las operaciones CRUD de las páginas y otro se encarga de la lógica de captura de leads, asegurando la integración con el CRM.

### Models

#### LandingPage

nombre: String, slug: String (único), contenidoJson: Object, seoMeta: { titulo: String, descripcion: String }, estado: String ('borrador', 'publicada'), clinicaId: ObjectId, createdAt: Date, updatedAt: Date, stats: { visitas: Number, conversiones: Number }

#### Lead

nombre: String, email: String, telefono: String, mensaje: String, fuente: String, origenId: ObjectId (referencia a LandingPage), estado: String ('nuevo', 'contactado', 'descartado'), clinicaId: ObjectId, createdAt: Date

### Controllers

#### LandingPageController

- createLandingPage
- getAllLandingPages
- getLandingPageById
- updateLandingPage
- deleteLandingPage
- getPublicLandingPageBySlug

#### LeadController

- captureLeadFromLandingPage

### Routes

#### `/api/landing-pages`

- POST /
- GET /
- GET /:id
- PUT /:id
- DELETE /:id
- POST /leads/:landingPageId

## 🔄 Flujos

1. El usuario de marketing accede al 'Dashboard de Landing Pages' donde ve una lista de las páginas existentes.
2. Hace clic en 'Crear Nueva Página' y es dirigido al editor con una plantilla en blanco o predefinida.
3. Desde la barra lateral, arrastra componentes (texto, imagen, formulario) al área de trabajo principal (canvas).
4. Selecciona un componente en el canvas y edita sus propiedades (texto, color, imagen de fondo) en el panel de la derecha.
5. Una vez satisfecho con el diseño, abre el modal de 'Publicación', define un nombre, una URL amigable (slug) y los metadatos SEO.
6. Guarda la página como 'borrador' o la 'publica' para que esté accesible en internet.
7. Un visitante potencial encuentra la página, rellena el formulario de contacto y lo envía.
8. El sistema registra el envío, crea un nuevo 'Lead' en el CRM asociado a la campaña y notifica al equipo de la clínica.
9. El usuario de marketing puede revisar el rendimiento de la página (visitas, conversiones) en el dashboard.

## 📝 User Stories

- Como responsable de marketing, quiero un editor visual de 'arrastrar y soltar' para poder crear landing pages de campañas sin depender del equipo de IT.
- Como gestor de campañas, quiero poder guardar mis páginas como borradores para poder trabajar en ellas en varias sesiones antes de publicarlas.
- Como especialista en SEO, quiero poder configurar el título, la descripción meta y la URL de cada landing page para optimizarla para los motores de búsqueda.
- Como gestor de CRM, quiero que cada vez que un usuario rellene un formulario en una landing page, se cree automáticamente un nuevo prospecto en el sistema con la información de la campaña de origen.
- Como director de la clínica, quiero ver un resumen del rendimiento de cada landing page, incluyendo el número de visitas y cuántos prospectos ha generado, para evaluar el ROI de nuestras campañas.

## ⚙️ Notas Técnicas

- Para la implementación del editor drag-and-drop se recomienda el uso de librerías especializadas como 'react-beautiful-dnd', 'Dnd Kit' o una solución más completa como 'GrapesJS' integrada en React, para manejar la lógica de reordenamiento y edición de componentes.
- El contenido de la página ('contenidoJson') debe ser almacenado como un objeto JSON flexible en MongoDB. Esto permite añadir nuevos tipos de bloques en el futuro sin necesidad de migraciones de esquema.
- Las páginas públicas generadas (/pages/public/[slug].tsx) deben ser altamente optimizadas para el rendimiento y SEO. Utilizar Server-Side Rendering (SSR) o Incremental Static Regeneration (ISR) de Next.js es crucial para asegurar tiempos de carga rápidos.
- El endpoint de captura de leads (`/api/landing-pages/leads/:landingPageId`) debe estar protegido contra spam usando técnicas como reCAPTCHA, honeypots y rate limiting.
- Los activos multimedia (imágenes, videos) subidos por el usuario para las landing pages deben ser alojados en un servicio de almacenamiento de objetos (como AWS S3 o Cloudinary) y no en el servidor de la aplicación, para mejorar el rendimiento y la escalabilidad.
- Asegurar que todo el contenido renderizado en la página pública proveniente del editor sea sanitizado para prevenir vulnerabilidades de Cross-Site Scripting (XSS).

