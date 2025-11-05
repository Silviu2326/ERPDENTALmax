# Calendario Editorial y Redes Sociales

**Categoría:** Marketing y Web | **Módulo:** Marketing Avanzado y Web

El Calendario Editorial y Redes Sociales es una herramienta estratégica diseñada para que el equipo de marketing de la clínica dental pueda planificar, crear, programar y analizar todo el contenido destinado a sus plataformas digitales. Esta funcionalidad centraliza la gestión de la presencia online de la clínica, permitiendo una comunicación coherente y profesional con pacientes actuales y potenciales. Integrado dentro del módulo 'Marketing Avanzado y Web', este calendario no es solo un simple programador, sino un centro de comando para la estrategia de contenido digital. Permite al usuario visualizar de forma clara y organizada todas las publicaciones pasadas, presentes y futuras en una vista de mes, semana o día. Desde aquí, se pueden crear borradores, solicitar aprobaciones, programar publicaciones para fechas y horas específicas en múltiples redes sociales (como Facebook, Instagram, LinkedIn, etc.), y posteriormente, monitorizar el rendimiento básico de las mismas. Su principal objetivo es optimizar el flujo de trabajo del marketing, ahorrar tiempo al evitar el cambio constante entre diferentes plataformas y asegurar que la clínica mantenga una cadencia de publicación constante y de alta calidad, lo cual es fundamental para el engagement de la comunidad y la captación de nuevos pacientes a través de canales digitales.

## 👥 Roles de Acceso

- Marketing / CRM

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/marketing-avanzado-web/`

Esta funcionalidad reside dentro de la carpeta del módulo padre '/features/marketing-avanzado-web/'. La página principal, 'CalendarioEditorialPage.tsx', se encuentra en la subcarpeta '/pages' y actúa como el contenedor principal. Los componentes reutilizables como la grilla del calendario ('CalendarioEditorialGrid'), el modal para crear/editar posts ('ModalGestionPublicacion'), y el panel de previsualización ('VistaPreviaPublicacion') están en '/components'. Las llamadas a la API del backend se abstraen en un archivo dentro de '/apis', como 'publicacionesSocialesApi.ts', para mantener la lógica de comunicación separada de la UI.

### Archivos Frontend

- `/features/marketing-avanzado-web/pages/CalendarioEditorialPage.tsx`
- `/features/marketing-avanzado-web/components/CalendarioEditorialGrid.tsx`
- `/features/marketing-avanzado-web/components/ModalGestionPublicacion.tsx`
- `/features/marketing-avanzado-web/components/FiltrosCalendarioEditorial.tsx`
- `/features/marketing-avanzado-web/components/VistaPreviaPublicacion.tsx`
- `/features/marketing-avanzado-web/components/PanelIdeasContenido.tsx`
- `/features/marketing-avanzado-web/apis/publicacionesSocialesApi.ts`

### Componentes React

- CalendarioEditorialPage
- CalendarioEditorialGrid
- ModalGestionPublicacion
- FiltrosCalendarioEditorial
- VistaPreviaPublicacion
- PanelIdeasContenido

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de las publicaciones en redes sociales, desde su creación como borrador hasta su programación y análisis posterior. Esto incluye operaciones CRUD para las publicaciones y las ideas de contenido.

### `GET` `/api/marketing/publicaciones`

Obtiene todas las publicaciones para un rango de fechas determinado, permitiendo filtrar por estado o plataforma social.

**Parámetros:** query.fechaInicio: string (ISO Date), query.fechaFin: string (ISO Date), query.estado: string ('borrador', 'programado', 'publicado'), query.plataforma: string

**Respuesta:** Array de objetos de PublicacionSocial.

### `POST` `/api/marketing/publicaciones`

Crea una nueva publicación social. Puede guardarse como borrador o programarse para una fecha futura.

**Parámetros:** body.contenido: string, body.mediaUrls: array[string], body.plataformas: array[string], body.estado: string, body.fechaProgramacion: string (ISO Date)

**Respuesta:** El objeto de la PublicacionSocial creada.

### `PUT` `/api/marketing/publicaciones/:id`

Actualiza una publicación existente. Se usa para editar contenido, cambiar el estado o reprogramar.

**Parámetros:** params.id: string (ObjectID), body: (campos a actualizar)

**Respuesta:** El objeto de la PublicacionSocial actualizada.

### `DELETE` `/api/marketing/publicaciones/:id`

Elimina una publicación social, ya sea un borrador o una publicación programada.

**Parámetros:** params.id: string (ObjectID)

**Respuesta:** Mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con un modelo 'PublicacionSocial' para almacenar los datos de cada post. Un controlador 'PublicacionSocialController' contiene la lógica de negocio (crear, leer, actualizar, eliminar), y las rutas en 'marketingRoutes.js' exponen estos servicios de forma segura y RESTful.

### Models

#### PublicacionSocial

contenido: String, mediaUrls: [String], plataformas: [String], estado: { type: String, enum: ['borrador', 'programado', 'publicado', 'error', 'archivado'] }, fechaProgramacion: Date, fechaPublicacionReal: Date, creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }, metricas: { likes: Number, comentarios: Number, compartidos: Number }, idPublicacionPlataforma: Map<String, String> 

### Controllers

#### PublicacionSocialController

- obtenerPublicaciones
- crearPublicacion
- actualizarPublicacion
- eliminarPublicacion
- obtenerPublicacionPorId

### Routes

#### `/api/marketing/publicaciones`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id

## 🔄 Flujos

1. El usuario de marketing accede al 'Calendario Editorial' y ve las publicaciones del mes actual.
2. El usuario hace clic en el botón 'Crear Publicación', lo que abre el 'ModalGestionPublicacion'.
3. Dentro del modal, el usuario redacta el texto, adjunta una imagen, selecciona las redes sociales (ej. Facebook, Instagram) y elige 'Programar'.
4. Selecciona la fecha y hora de programación y guarda. El sistema crea un nuevo registro 'PublicacionSocial' con estado 'programado'.
5. La nueva publicación aparece en el calendario en la fecha seleccionada, con un color o ícono que indica su estado 'programado'.
6. El usuario puede arrastrar y soltar la publicación a otro día en el calendario para reprogramarla fácilmente. Esto dispara una llamada a la API PUT para actualizar la 'fechaProgramacion'.

## 📝 User Stories

- Como responsable de marketing, quiero visualizar todo mi contenido planificado en una vista de calendario para poder identificar huecos en mi estrategia de publicación.
- Como responsable de marketing, quiero redactar y previsualizar una publicación para ver cómo se verá en Instagram y Facebook antes de programarla.
- Como responsable de marketing, quiero programar una misma pieza de contenido para que se publique en múltiples redes sociales a la vez para ser más eficiente.
- Como responsable de marketing, quiero guardar publicaciones como borradores para poder terminarlas y obtener aprobación más tarde.
- Como responsable de marketing, quiero filtrar el calendario por red social para enfocarme en la estrategia de una plataforma específica.

## ⚙️ Notas Técnicas

- La integración con las APIs de las redes sociales (ej. Facebook Graph API) es crítica y debe manejarse en el backend para proteger las claves de API y los tokens de acceso.
- Se debe implementar un servicio de 'cron job' o planificador de tareas en el backend (ej. usando 'node-cron' o BullMQ) que se ejecute periódicamente para verificar y publicar los posts que hayan alcanzado su 'fechaProgramacion'.
- Para el manejo de imágenes y videos, se recomienda utilizar un servicio de almacenamiento en la nube como AWS S3 o Google Cloud Storage para desacoplar los archivos del servidor de la aplicación y mejorar el rendimiento.
- Los tokens de acceso de las redes sociales tienen una vida útil limitada y deben ser renovados. Se debe implementar un mecanismo para gestionar este ciclo de vida de los tokens de forma automática.
- La interfaz del calendario debe ser muy reactiva, soportando drag-and-drop para reprogramar. Librerías como 'FullCalendar' o 'react-big-calendar' combinadas con 'dnd-kit' pueden ser una buena solución.

