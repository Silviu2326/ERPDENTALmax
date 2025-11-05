# Compartir Imágenes/Documentos en Vivo

**Categoría:** Telemedicina | **Módulo:** Teleodontología

La funcionalidad 'Compartir Imágenes/Documentos en Vivo' es un componente esencial del módulo de Teleodontología, diseñada para enriquecer la experiencia de la consulta a distancia entre odontólogos, pacientes y otros especialistas. Permite a los participantes de una videoconsulta compartir, visualizar y anotar colaborativamente documentos clínicos, como radiografías (periapicales, panorámicas), tomografías computarizadas (CBCT), fotografías intraorales y extraorales, y planes de tratamiento en formato PDF, todo en tiempo real. Su propósito principal es eliminar la barrera de la comunicación visual en las consultas remotas, permitiendo al odontólogo explicar diagnósticos de manera clara y precisa, señalando áreas de interés directamente en la imagen, tal como lo haría en una consulta presencial. Para el paciente, esto se traduce en una mayor comprensión de su estado de salud bucal y del tratamiento propuesto. Funciona como una capa interactiva sobre la videollamada; al activarse, se abre un visor sincronizado para todos los participantes. Cualquier acción realizada por el usuario con control (zoom, desplazamiento, dibujo, señalamiento) se replica instantáneamente en las pantallas de los demás, gracias a una comunicación de baja latencia a través de WebSockets. Esta herramienta no solo mejora la relación médico-paciente, sino que también facilita la interconsulta entre especialistas, permitiendo a un odontólogo general discutir un caso complejo con un endodoncista o un cirujano maxilofacial en tiempo real, mejorando la calidad del diagnóstico y la planificación del tratamiento.

## 👥 Roles de Acceso

- Odontólogo
- Paciente
- Técnico de Radiología

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/teleodontologia/`

Esta funcionalidad reside dentro de la carpeta '/features/teleodontologia/'. La lógica de la interfaz se encapsula en componentes React reutilizables ubicados en '/components/VisorCompartido/'. La página principal de la videoconsulta, '/pages/SesionTeleconsultaPage.tsx', integra estos componentes para ofrecer la experiencia completa. Las llamadas al backend para gestionar sesiones y documentos se centralizan en '/apis/sesionTeleconsultaApi.ts'.

### Archivos Frontend

- `/features/teleodontologia/pages/SesionTeleconsultaPage.tsx`
- `/features/teleodontologia/components/VisorCompartido/VisorCompartidoContainer.tsx`
- `/features/teleodontologia/components/VisorCompartido/LienzoAnotacion.tsx`
- `/features/teleodontologia/components/VisorCompartido/BarraHerramientasAnotacion.tsx`
- `/features/teleodontologia/components/VisorCompartido/SelectorArchivosTeleconsulta.tsx`
- `/features/teleodontologia/apis/sesionTeleconsultaApi.ts`

### Componentes React

- VisorCompartidoContainer
- LienzoAnotacion
- BarraHerramientasAnotacion
- SelectorArchivosTeleconsulta

## 🔌 APIs Backend

Se requiere una combinación de endpoints RESTful para la gestión de sesiones y documentos, y un servidor WebSocket para la comunicación de eventos en tiempo real (anotaciones, zoom, etc.).

### `GET` `/api/teleodontologia/sesiones/:sesionId/documentos-paciente`

Obtiene la lista de documentos clínicos (imágenes, PDFs) asociados al paciente de la sesión para mostrarlos en el selector de archivos.

**Parámetros:** sesionId (en la URL)

**Respuesta:** Un array de objetos de documento, cada uno con { id, nombreArchivo, urlMiniatura, tipo }.

### `POST` `/api/teleodontologia/sesiones/:sesionId/seleccionar-documento`

Notifica al backend qué documento ha sido seleccionado para compartir. El backend emite un evento WebSocket a todos los participantes.

**Parámetros:** sesionId (en la URL), documentoId (en el body)

**Respuesta:** Objeto con el estado de la sesión: { exito: true, documentoActivo: '...' }.

### `POST` `/api/teleodontologia/sesiones/:sesionId/subir-documento`

Permite subir un nuevo archivo durante la sesión (multipart/form-data). Una vez subido, se puede seleccionar para compartir.

**Parámetros:** sesionId (en la URL), archivo (form-data)

**Respuesta:** Objeto del nuevo documento creado: { id, nombreArchivo, url, tipo }.

### `WebSocket` `ws://tu-dominio.com/ws/teleconsulta/:sesionId`

Canal de comunicación en tiempo real. Maneja eventos como 'evento-anotacion' (datos del dibujo), 'evento-viewport' (zoom/pan), y 'cambio-documento'. El servidor recibe eventos de un cliente y los retransmite a los demás en la misma sesión.

**Parámetros:** sesionId (en la URL de conexión), tokenAutenticacion (en los headers de conexión)

**Respuesta:** Flujo continuo de mensajes JSON representando los eventos de la sesión.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se basa en modelos para las entidades de Teleconsulta y Documentos, controladores para la lógica de negocio y rutas para exponer los endpoints.

### Models

#### Teleconsulta

Contiene referencias al paciente, odontólogo, participantes, estado de la sesión, y un objeto para el estado de la compartición en vivo: { documentoActivo: { type: ObjectId, ref: 'DocumentoPaciente' }, estadoComparticion: String }.

#### DocumentoPaciente

Almacena información sobre los archivos clínicos del paciente. Campos principales: { paciente: ObjectId, nombreArchivo: String, urlAlmacenamiento: String, tipoDocumento: String ('radiografia', 'foto', 'pdf'), fechaCarga: Date }.

### Controllers

#### TeleconsultaController

- obtenerDocumentosParaSesion
- seleccionarDocumentoParaCompartir
- subirDocumentoEnSesion

#### TeleconsultaSocketController

- manejarConexion
- manejarDesconexion
- retransmitirEventoAnotacion
- retransmitirEventoViewport

### Routes

#### `/api/teleodontologia/sesiones/:sesionId`

- /documentos-paciente
- /seleccionar-documento
- /subir-documento

## 🔄 Flujos

1. 1. El odontólogo inicia una videoconsulta con un paciente a través del módulo de Teleodontología.
2. 2. Durante la llamada, el odontólogo hace clic en el botón 'Compartir Imagen/Documento'.
3. 3. Se abre una interfaz que muestra los documentos existentes del paciente y una opción para subir uno nuevo.
4. 4. El odontólogo selecciona una radiografía panorámica. El sistema notifica al backend y este a su vez emite un evento WebSocket a todos los clientes de la sesión.
5. 5. La radiografía aparece en la pantalla de todos los participantes, reemplazando el video principal o en un panel dedicado.
6. 6. El odontólogo activa la herramienta 'Lápiz' y dibuja un círculo sobre un diente afectado. Las coordenadas del dibujo se envían en tiempo real vía WebSocket y el círculo aparece en la pantalla del paciente.
7. 7. El odontólogo utiliza la herramienta 'Zoom' para ampliar la zona. Los nuevos parámetros de la vista (zoom, posición) se transmiten y sincronizan en todas las pantallas.
8. 8. Al finalizar la explicación, el odontólogo cierra el visor de imágenes, y la vista vuelve al modo de videollamada estándar.

## 📝 User Stories

- Como odontólogo, quiero compartir una radiografía en tiempo real durante una videoconsulta para poder explicarle visualmente al paciente su diagnóstico y plan de tratamiento.
- Como paciente, quiero ver en mi pantalla la misma imagen que el odontólogo está viendo y sus anotaciones para entender mejor mi condición dental y por qué necesito un tratamiento.
- Como especialista (ej. endodoncista), quiero unirme a una sesión en vivo con un odontólogo general para revisar una tomografía compleja y dar mi opinión profesional de forma interactiva.
- Como odontólogo, quiero poder subir una foto desde mi ordenador durante la consulta para discutirla inmediatamente con el paciente sin tener que añadirla previamente a su ficha.

## ⚙️ Notas Técnicas

- WebSockets: El uso de una librería como Socket.IO o ws en el backend Node.js es crucial para la comunicación en tiempo real. Se debe gestionar el ciclo de vida de la conexión y la autenticación de los sockets.
- Seguridad y Cumplimiento (HIPAA): Toda la comunicación, incluyendo la de WebSockets (usando WSS), debe estar encriptada. El acceso a los documentos debe estar estrictamente controlado por roles y pertenencia a la sesión. Las URLs de los archivos en el almacenamiento (ej. AWS S3) deben ser pre-firmadas y con una vida útil corta.
- Optimización de Rendimiento: Las imágenes diagnósticas pueden ser pesadas. Se deben implementar técnicas de 'lazy loading', compresión de imágenes y el uso de un CDN. El renderizado en el canvas de React (usando librerías como Konva.js o una implementación propia) debe ser eficiente para evitar lag durante las anotaciones.
- Gestión de Estado Frontend: Se recomienda usar un gestor de estado global (como Zustand o Redux Toolkit) en el frontend para manejar el estado de la sesión de compartición (documento actual, herramientas, estado del viewport), facilitando la sincronización entre componentes.
- Persistencia de Anotaciones: Considerar la opción de guardar el estado final del lienzo (imagen + anotaciones) como un nuevo documento en la ficha del paciente, sirviendo como registro visual de la explicación dada durante la teleconsulta.

