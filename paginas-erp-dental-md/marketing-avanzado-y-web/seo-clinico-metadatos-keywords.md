# SEO Clínico (Metadatos/Keywords)

**Categoría:** Marketing y Web | **Módulo:** Marketing Avanzado y Web

La funcionalidad 'SEO Clínico' es una herramienta estratégica integrada en el módulo 'Marketing Avanzado y Web' del ERP dental. Su propósito principal es centralizar y simplificar la gestión de la optimización para motores de búsqueda (SEO) del sitio web público de la clínica. Permite a los usuarios autorizados, como el personal de marketing, modificar directamente los metadatos cruciales de cada página web de la clínica (página de inicio, páginas de tratamientos, artículos de blog, etc.) sin necesidad de acceder al código fuente o a un CMS externo. Esto incluye la edición de meta títulos, meta descripciones y la asignación de palabras clave (keywords) relevantes. La herramienta no solo facilita la actualización de estos elementos, sino que también ofrece una vista previa en tiempo real de cómo se mostrará la página en los resultados de búsqueda de Google, ayudando a optimizar el 'snippet' para mejorar la tasa de clics (CTR). Al estar dentro del ERP, se conecta con la información de los tratamientos y servicios que la clínica ofrece, permitiendo al sistema sugerir palabras clave relevantes y mantener una coherencia estratégica entre los servicios clínicos y la presencia online. Es fundamental para atraer nuevos pacientes a través de la búsqueda orgánica, posicionando a la clínica como una autoridad en su área local para procedimientos específicos como 'implantes dentales', 'ortodoncia invisible' o 'blanqueamiento dental'.

## 👥 Roles de Acceso

- Marketing / CRM
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/marketing-avanzado-web/`

Esta funcionalidad reside dentro de la carpeta del feature 'marketing-avanzado-web'. La lógica de la interfaz se encuentra en '/pages/SeoClinicoPage.tsx', que actúa como el contenedor principal. Los componentes reutilizables como el formulario de edición ('SeoEditorForm.tsx') y la vista previa del snippet de Google ('SeoPerformancePreview.tsx') están en la subcarpeta '/components/'. Todas las interacciones con el backend se gestionan a través de funciones definidas en '/apis/seoApi.ts', que abstraen las llamadas a los endpoints REST.

### Archivos Frontend

- `/features/marketing-avanzado-web/pages/SeoClinicoPage.tsx`
- `/features/marketing-avanzado-web/components/SeoEditorForm.tsx`
- `/features/marketing-avanzado-web/components/SeoPageSelector.tsx`
- `/features/marketing-avanzado-web/components/SeoPerformancePreview.tsx`
- `/features/marketing-avanzado-web/components/KeywordSuggestionList.tsx`
- `/features/marketing-avanzado-web/apis/seoApi.ts`

### Componentes React

- SeoClinicoPage
- SeoPageSelector
- SeoEditorForm
- SeoPerformancePreview
- KeywordSuggestionList

## 🔌 APIs Backend

El backend expone una serie de endpoints RESTful para gestionar los metadatos SEO de las páginas públicas de la clínica. Permite obtener una lista de las páginas gestionables, leer los metadatos de una página específica y actualizarlos.

### `GET` `/api/marketing/seo/pages`

Obtiene una lista de todas las páginas públicas de la clínica cuyos metadatos pueden ser gestionados desde el ERP (ej: home, contacto, servicios/implantes).

**Respuesta:** Un array de objetos, cada uno con un 'id' y un 'nombre' de página. Ej: [{id: 'home', name: 'Página de Inicio'}]

### `GET` `/api/marketing/seo/metadata/:pageId`

Recupera los metadatos SEO actuales para una página específica identificada por su ID o slug.

**Parámetros:** pageId (string): Identificador único de la página. Ej: 'servicios-implantes-dentales'

**Respuesta:** Un objeto con los metadatos de la página. Ej: { metaTitle: '...', metaDescription: '...', keywords: [...] }

### `PUT` `/api/marketing/seo/metadata/:pageId`

Actualiza los metadatos SEO para una página específica. Si no existen, los crea.

**Parámetros:** pageId (string): Identificador único de la página., body (object): { metaTitle: string, metaDescription: string, keywords: string[] }

**Respuesta:** Un objeto con los metadatos actualizados y un mensaje de éxito.

## 🗂️ Estructura Backend (MERN)

La lógica del backend se apoya en un modelo de MongoDB 'SeoMetadata' para persistir la información. Un 'SeoController' contiene la lógica de negocio para interactuar con este modelo, y las rutas de Express en 'seoRoutes' exponen estas funciones como endpoints de la API.

### Models

#### SeoMetadata

pageIdentifier: String (identificador único de la página, ej. 'home', 'servicios/ortodoncia'), metaTitle: String, metaDescription: String, keywords: [String], clinicId: ObjectId (referencia a la clínica), lastUpdatedBy: ObjectId (referencia al usuario que actualizó)

### Controllers

#### SeoController

- getManagedPages
- getMetadataForPage
- updateMetadataForPage

### Routes

#### `/api/marketing/seo`

- GET /pages
- GET /metadata/:pageId
- PUT /metadata/:pageId

## 🔄 Flujos

1. El usuario de Marketing accede a la sección 'SEO Clínico' desde el módulo de 'Marketing Avanzado y Web'.
2. El sistema carga y muestra una lista de páginas web de la clínica (Inicio, Sobre nosotros, Implantes, etc.) obtenidas vía GET /api/marketing/seo/pages.
3. El usuario selecciona la página 'Implantes Dentales' para optimizarla.
4. El frontend realiza una llamada GET /api/marketing/seo/metadata/implantes-dentales para obtener los datos actuales.
5. Los datos se cargan en un formulario de edición, y se muestra una vista previa del resultado en Google.
6. El usuario modifica el título y la descripción para que sean más atractivos y añade palabras clave relevantes.
7. Al guardar, el frontend envía una petición PUT a /api/marketing/seo/metadata/implantes-dentales con los nuevos datos.
8. El backend valida y guarda la información en la base de datos, que estará disponible para ser consumida por el sitio web público.

## 📝 User Stories

- Como especialista en Marketing, quiero una interfaz sencilla para editar el título y la descripción de cada tratamiento en la web para mejorar nuestro posicionamiento en Google y atraer más pacientes.
- Como gerente de la clínica, quiero poder supervisar y ajustar la estrategia de palabras clave de nuestro sitio web directamente desde el ERP, sin depender de una agencia externa.
- Como profesional de Marketing, quiero ver una simulación de cómo se verá nuestra clínica en los resultados de búsqueda de Google antes de publicar los cambios para asegurar que el mensaje sea claro y atractivo.
- Como responsable de IT, quiero que el sistema proporcione una forma segura y estructurada de gestionar los metadatos, que luego el sitio web público pueda consumir a través de una API para su renderizado.

## ⚙️ Notas Técnicas

- La integración con el sitio web público es crítica. El sitio (posiblemente Next.js) debe ser configurado para obtener estos metadatos del ERP durante el proceso de build (getStaticProps) o en cada solicitud (getServerSideProps).
- Se deben implementar validaciones en el frontend y backend para limitar la longitud del meta título (~60 caracteres) y la meta descripción (~160 caracteres) para cumplir con las mejores prácticas de SEO.
- La colección 'SeoMetadata' en MongoDB debe tener un índice en 'pageIdentifier' y 'clinicId' para garantizar consultas rápidas.
- Todo el contenido ingresado por el usuario debe ser sanitizado en el backend antes de guardarlo para prevenir vulnerabilidades de Cross-Site Scripting (XSS) en el sitio web público.
- Considerar una futura integración con la API de Google Search Console para mostrar datos de rendimiento (clics, impresiones) directamente en esta interfaz.

