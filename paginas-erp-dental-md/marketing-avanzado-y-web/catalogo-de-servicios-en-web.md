# Catálogo de Servicios en Web

**Categoría:** Marketing y Web | **Módulo:** Marketing Avanzado y Web

El 'Catálogo de Servicios en Web' es una funcionalidad crucial dentro del módulo de 'Marketing Avanzado y Web' del ERP dental. Su propósito principal es servir como un sistema de gestión de contenido (CMS) especializado para los tratamientos y servicios que la clínica dental ofrece y desea promocionar en su sitio web público. Permite al personal autorizado, como los gestores de marketing o la recepción, crear, editar, organizar y publicar la información de los servicios directamente desde el ERP, eliminando la necesidad de conocimientos técnicos de desarrollo web o la intervención de un programador para actualizar la oferta comercial de la clínica. Esta herramienta centraliza la información, asegurando que los precios, descripciones, y promociones que se muestran en la web sean consistentes con la información interna. El funcionamiento es simple pero potente: el usuario gestiona una lista de servicios, a los que puede añadir descripciones detalladas (con formato enriquecido), precios (normal y promocional), imágenes, videos, y asignarlos a categorías específicas (ej. 'Ortodoncia', 'Implantología', 'Estética Dental'). Al marcar un servicio como 'publicado', la información se vuelve accesible a través de una API segura que el sitio web de la clínica consume para mostrar el catálogo actualizado en tiempo real. Esto facilita la agilidad en las campañas de marketing, permitiendo destacar tratamientos, lanzar ofertas temporales y mantener a los pacientes potenciales informados sobre la gama completa de cuidados que ofrece la clínica.

## 👥 Roles de Acceso

- Marketing / CRM
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/marketing-avanzado-web/`

Esta funcionalidad reside dentro de la carpeta del módulo padre '/features/marketing-avanzado-web/'. La subcarpeta '/pages/' contiene el componente principal 'CatalogoServiciosWebPage.tsx' que renderiza la interfaz de gestión. En '/components/' se ubican los elementos reutilizables como 'ServicioWebForm.tsx' (el formulario para crear/editar servicios), 'ServicioWebCard.tsx' (la vista de un servicio en la lista) y 'GestionCategoriasModal.tsx' para manejar las categorías. La comunicación con el backend se centraliza en '/apis/serviciosWebAPI.ts', que exporta funciones para realizar las operaciones CRUD sobre los servicios y categorías.

### Archivos Frontend

- `/features/marketing-avanzado-web/pages/CatalogoServiciosWebPage.tsx`
- `/features/marketing-avanzado-web/components/ServicioWebForm.tsx`
- `/features/marketing-avanzado-web/components/ServicioWebCard.tsx`
- `/features/marketing-avanzado-web/components/ListaServiciosWeb.tsx`
- `/features/marketing-avanzado-web/components/GestionCategoriasModal.tsx`
- `/features/marketing-avanzado-web/apis/serviciosWebAPI.ts`

### Componentes React

- CatalogoServiciosWebPage
- ServicioWebForm
- ServicioWebCard
- ListaServiciosWeb
- GestionCategoriasModal

## 🔌 APIs Backend

Conjunto de APIs RESTful para la gestión completa (CRUD) de los servicios y sus categorías que se mostrarán en el sitio web público. Estos endpoints son para uso interno del ERP.

### `GET` `/api/marketing/servicios-web`

Obtiene una lista paginada de todos los servicios del catálogo web, con opciones de filtro y búsqueda.

**Parámetros:** page (opcional): Número de página, limit (opcional): Resultados por página, search (opcional): Término de búsqueda por nombre, categoria (opcional): ID de la categoría para filtrar

**Respuesta:** Un objeto con un array de servicios y metadatos de paginación.

### `POST` `/api/marketing/servicios-web`

Crea un nuevo servicio en el catálogo web.

**Parámetros:** Body: Objeto con datos del servicio (nombre, descripcionLarga, precio, categoria, etc.)

**Respuesta:** El objeto del servicio recién creado.

### `PUT` `/api/marketing/servicios-web/:id`

Actualiza la información de un servicio específico por su ID.

**Parámetros:** id: ID del servicio, Body: Objeto con los campos a actualizar

**Respuesta:** El objeto del servicio actualizado.

### `DELETE` `/api/marketing/servicios-web/:id`

Elimina un servicio del catálogo.

**Parámetros:** id: ID del servicio

**Respuesta:** Mensaje de confirmación de eliminación.

### `GET` `/api/marketing/categorias-servicios-web`

Obtiene la lista completa de categorías de servicios web.

**Respuesta:** Un array de objetos de categorías.

### `POST` `/api/marketing/categorias-servicios-web`

Crea una nueva categoría de servicio.

**Parámetros:** Body: Objeto con { nombre, descripcion }

**Respuesta:** El objeto de la categoría recién creada.

## 🗂️ Estructura Backend (MERN)

La lógica del backend se organiza en modelos de Mongoose para definir la estructura de datos, controladores para la lógica de negocio y rutas de Express para exponer los endpoints de la API.

### Models

#### ServicioWeb

nombre: String, slug: String (único), descripcionCorta: String, descripcionLarga: String (HTML/JSON), precio: Number, precioPromocional: Number, categoria: ObjectId (ref: 'CategoriaServicioWeb'), imagenes: [String], videoURL: String, publicado: Boolean, destacado: Boolean, createdAt: Date, updatedAt: Date

#### CategoriaServicioWeb

nombre: String (único), slug: String (único), descripcion: String

### Controllers

#### ServicioWebController

- getAllServiciosWeb
- createServicioWeb
- getServicioWebById
- updateServicioWeb
- deleteServicioWeb

#### CategoriaServicioWebController

- getAllCategorias
- createCategoria
- updateCategoria
- deleteCategoria

### Routes

#### `/api/marketing/servicios-web`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id

#### `/api/marketing/categorias-servicios-web`

- GET /
- POST /
- PUT /:id
- DELETE /:id

## 🔄 Flujos

1. El usuario de Marketing inicia sesión y navega a 'Marketing Avanzado y Web' > 'Catálogo de Servicios en Web'.
2. La interfaz muestra una lista de los servicios existentes, indicando su estado (Publicado/Borrador) y si son destacados.
3. El usuario hace clic en 'Añadir Servicio', se abre un formulario (modal o página nueva) donde introduce el nombre, descripción, precio, categoría, y sube imágenes.
4. Al guardar, el sistema valida los datos, crea el nuevo servicio en la base de datos con estado 'Borrador' y actualiza la lista.
5. El usuario puede editar un servicio existente, modificar sus detalles y cambiar su estado a 'Publicado' para que esté disponible a través de la API pública del sitio web.
6. El usuario puede gestionar las categorías a través de un modal, permitiendo crear, renombrar o eliminar categorías.

## 📝 User Stories

- Como Gestor de Marketing, quiero poder añadir un nuevo tratamiento con descripción detallada, fotos y precio, para que aparezca en la página web de la clínica.
- Como Personal de Recepción, quiero poder cambiar rápidamente el precio de un servicio o marcarlo como una oferta especial para reflejar una campaña actual.
- Como Gestor de Marketing, quiero organizar los servicios en categorías como 'Estética', 'Cirugía' u 'Ortodoncia' para facilitar la navegación del usuario en la web.
- Como Gestor de Marketing, quiero desactivar temporalmente un servicio del catálogo web sin eliminarlo, para poder volver a publicarlo en el futuro.
- Como Gestor de CRM, quiero poder ver todos los servicios que se ofrecen en la web para alinear las campañas de email marketing con la oferta pública.

## ⚙️ Notas Técnicas

- Implementar un sistema de subida de archivos a un servicio de almacenamiento en la nube (ej. AWS S3) para las imágenes de los servicios, guardando solo la URL en MongoDB.
- El campo 'descripcionLarga' debe usar un editor de texto enriquecido (WYSIWYG) en el frontend, y el backend debe sanitizar el HTML recibido para prevenir ataques XSS.
- El backend debe generar automáticamente un 'slug' único y amigable para SEO a partir del nombre del servicio y de la categoría al momento de su creación/actualización.
- Se debe crear un set de endpoints públicos (ej. /api/public/servicios-web) que solo expongan los servicios con estado 'publicado', con menos campos y optimizados para el consumo del sitio web.
- Implementar caché a nivel de API (ej. con Redis) para los endpoints públicos para mejorar el tiempo de carga del sitio web y reducir la carga de la base de datos.
- La eliminación de una categoría solo debe ser posible si no hay servicios asociados a ella, o debe solicitar al usuario que reasigne los servicios existentes a otra categoría.

