# Gestor de Testimonios y Casos Clínicos

**Categoría:** Marketing y Web | **Módulo:** Marketing Avanzado y Web

El 'Gestor de Testimonios y Casos Clínicos' es una herramienta estratégica dentro del módulo de 'Marketing Avanzado y Web', diseñada para capitalizar el activo más valioso de una clínica dental: sus resultados exitosos y la satisfacción de sus pacientes. Esta funcionalidad permite al personal autorizado, como los equipos de Marketing o Recepción, recopilar, administrar y publicar de forma centralizada tanto testimonios escritos de pacientes como casos clínicos detallados con soporte multimedia. Su propósito principal es construir una sólida prueba social (social proof), aumentar la confianza de potenciales pacientes y mostrar la pericia y calidad de los tratamientos ofrecidos por la clínica. Funciona como un repositorio donde se pueden crear fichas para cada caso, asociarlas a tratamientos específicos (implantes, ortodoncia, estética dental, etc.), adjuntar imágenes y vídeos del 'antes' y 'después', y redactar descripciones detalladas del procedimiento y los resultados. Crucialmente, el sistema integra un control de consentimiento del paciente, asegurando que solo se utilice material autorizado y cumpliendo con las normativas de protección de datos. Una vez que un caso o testimonio es aprobado y marcado como 'Publicado', puede ser consumido por la página web de la clínica a través de una API, alimentando dinámicamente secciones de 'Casos de Éxito' o 'Testimonios' sin necesidad de editar el código de la web.

## 👥 Roles de Acceso

- Marketing / CRM
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/marketing-avanzado-web/`

Toda la lógica de frontend para esta funcionalidad reside dentro de la carpeta del módulo padre '/features/marketing-avanzado-web/'. Las llamadas a la API del backend se definen en '/apis/testimoniosApi.ts'. Los componentes reutilizables como tablas, formularios y galerías están en '/components/', y las vistas principales que el usuario navega se encuentran en '/pages/'. Esta página se materializa principalmente en 'GestionTestimoniosPage.tsx' que actúa como el dashboard principal, y 'EditorTestimonioPage.tsx' para la creación y edición de cada elemento.

### Archivos Frontend

- `/features/marketing-avanzado-web/pages/GestionTestimoniosPage.tsx`
- `/features/marketing-avanzado-web/pages/EditorTestimonioPage.tsx`
- `/features/marketing-avanzado-web/components/TestimoniosTable.tsx`
- `/features/marketing-avanzado-web/components/FormularioCasoClinico.tsx`
- `/features/marketing-avanzado-web/components/GaleriaMultimediaCaso.tsx`
- `/features/marketing-avanzado-web/apis/testimoniosApi.ts`

### Componentes React

- TestimoniosTable
- FormularioCasoClinico
- GaleriaMultimediaCaso
- SelectorEtiquetasTratamiento
- ModalConfirmacionPublicacion

## 🔌 APIs Backend

Se requiere un conjunto de endpoints RESTful para realizar operaciones CRUD (Crear, Leer, Actualizar, Borrar) sobre los testimonios y casos clínicos. También se necesitan endpoints específicos para manejar la subida de archivos multimedia y para cambiar el estado de publicación.

### `GET` `/api/marketing/testimonios`

Obtiene una lista paginada y filtrable de todos los testimonios y casos clínicos.

**Parámetros:** page (number): Número de página, limit (number): Elementos por página, sortBy (string): Campo de ordenación, filterByTratamiento (string): ID o nombre del tratamiento, search (string): Término de búsqueda por título

**Respuesta:** Un objeto con un array de testimonios/casos y metadatos de paginación.

### `GET` `/api/marketing/testimonios/:id`

Obtiene los detalles completos de un testimonio o caso clínico específico.

**Parámetros:** id (string): ID del testimonio/caso

**Respuesta:** Un objeto con los datos del testimonio/caso.

### `POST` `/api/marketing/testimonios`

Crea un nuevo testimonio o caso clínico.

**Parámetros:** Body (JSON): Objeto con los datos del nuevo testimonio (titulo, descripcion, pacienteId, tipo, etc.)

**Respuesta:** El objeto del testimonio/caso recién creado.

### `PUT` `/api/marketing/testimonios/:id`

Actualiza la información de un testimonio o caso clínico existente.

**Parámetros:** id (string): ID del testimonio/caso a actualizar, Body (JSON): Objeto con los campos a modificar

**Respuesta:** El objeto del testimonio/caso actualizado.

### `DELETE` `/api/marketing/testimonios/:id`

Elimina un testimonio o caso clínico.

**Parámetros:** id (string): ID del testimonio/caso a eliminar

**Respuesta:** Un mensaje de confirmación.

### `POST` `/api/marketing/testimonios/:id/media`

Sube archivos multimedia (imágenes, vídeos) para un caso clínico específico. Usa 'multipart/form-data'.

**Parámetros:** id (string): ID del caso clínico, files (multipart/form-data): Archivos a subir, tag (string): Etiqueta para el archivo, ej: 'antes', 'despues', 'radiografia'

**Respuesta:** El objeto del caso clínico actualizado con las nuevas URLs de los medios.

## 🗂️ Estructura Backend (MERN)

El backend sigue la arquitectura MERN. Un modelo 'Testimonio' en MongoDB define la estructura de los datos. El 'TestimonioController' contiene toda la lógica de negocio para gestionar estos datos. Las rutas de Express en 'testimonioRoutes' exponen las funciones del controlador como endpoints de la API REST.

### Models

#### Testimonio

{
  titulo: String,
  descripcion: String,
  tipo: { type: String, enum: ['Testimonio', 'Caso Clínico'] },
  paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' },
  tratamientos: [{ type: Schema.Types.ObjectId, ref: 'Tratamiento' }],
  media: [{
    url: String,
    tipo: { type: String, enum: ['Imagen', 'Video'] },
    etiqueta: String // e.g., 'antes', 'despues', 'intraoral'
  }],
  consentimientoFirmado: { type: Boolean, default: false },
  estado: { type: String, enum: ['Borrador', 'Pendiente de Revisión', 'Publicado', 'Archivado'], default: 'Borrador' },
  fechaPublicacion: Date,
  creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}

### Controllers

#### TestimonioController

- getAllTestimonios
- getTestimonioById
- createTestimonio
- updateTestimonio
- deleteTestimonio
- uploadMediaForTestimonio
- updateTestimonioStatus

### Routes

#### `/api/marketing/testimonios`

- GET /
- GET /:id
- POST /
- PUT /:id
- DELETE /:id
- POST /:id/media

## 🔄 Flujos

1. Flujo de Creación: El usuario de Marketing hace clic en 'Añadir Nuevo Caso Clínico'. Rellena el formulario con título, descripción y selecciona los tratamientos asociados. Vincula al paciente (para control interno del consentimiento) y sube las fotos de 'antes' y 'después'. Guarda el caso como 'Borrador'.
2. Flujo de Publicación: El responsable de Marketing revisa un caso en estado 'Borrador' o 'Pendiente de Revisión'. Verifica que el campo 'consentimientoFirmado' esté activo. Realiza las correcciones necesarias y cambia el estado a 'Publicado'. A partir de este momento, el caso es visible para la API pública de la web.
3. Flujo de Búsqueda: Un miembro del equipo necesita encontrar un caso de 'carillas de porcelana' para una presentación. Accede al gestor, utiliza el filtro 'Tratamientos' para seleccionar 'Carillas', y el sistema muestra instantáneamente todos los casos clínicos etiquetados con ese tratamiento.

## 📝 User Stories

- Como miembro del equipo de Marketing, quiero crear, editar y gestionar casos clínicos con fotos de antes y después, para poder mostrar la calidad de nuestro trabajo en la web y redes sociales.
- Como recepcionista, quiero poder registrar de forma sencilla un testimonio positivo de un paciente y marcar que se ha obtenido su consentimiento verbal o escrito, para pasarlo al equipo de marketing para su revisión.
- Como responsable de Marketing, quiero poder filtrar todos los casos por tratamiento y por estado (Borrador, Publicado), para organizar el contenido y planificar las publicaciones en el blog y redes sociales.
- Como administrador de la clínica, quiero tener un repositorio centralizado de todos los testimonios y casos de éxito, para poder evaluar el impacto de nuestros tratamientos y usarlos como material de formación interna.

## ⚙️ Notas Técnicas

- Gestión de Multimedia: Es imperativo utilizar un servicio de almacenamiento de objetos en la nube (como AWS S3 o Cloudinary) para alojar las imágenes y vídeos. El backend gestionará la subida segura y almacenará únicamente las URLs en la base de datos de MongoDB para no sobrecargarla.
- Consentimiento y LOPD/GDPR: La vinculación con el paciente es solo para referencia interna y para verificar el consentimiento. Se debe implementar una lógica estricta para que ningún dato personal identificable del paciente sea expuesto a través de la API pública. El flag `consentimientoFirmado` es un campo de seguridad crítico.
- Optimización de Medios: El backend debería procesar las imágenes subidas para crear diferentes tamaños (thumbnails, versión web optimizada) y así mejorar drásticamente los tiempos de carga en la página web pública. Implementar 'lazy loading' en el frontend es igualmente crucial.
- API Pública Segura: Se recomienda crear un endpoint específico y público (ej: `/api/public/casos-exito`) que solo devuelva los casos con estado 'Publicado' y filtre cualquier campo interno, exponiendo únicamente la información necesaria para mostrar en la web.
- Integración con Tratamientos: El campo `tratamientos` en el modelo `Testimonio` debe referenciar al modelo `Tratamiento` principal del ERP para asegurar la consistencia de los datos y permitir un filtrado preciso.

