# Protocolos de Limpieza y Desinfección

**Categoría:** Calidad y Seguridad | **Módulo:** Esterilización y Trazabilidad

La funcionalidad 'Protocolos de Limpieza y Desinfección' es un componente crítico dentro del módulo de 'Esterilización y Trazabilidad'. Su propósito principal es servir como un repositorio digital centralizado y un sistema de gestión para todos los procedimientos estandarizados de higiene, limpieza y desinfección de la clínica o red de clínicas. Este sistema permite a la administración crear, actualizar, versionar y distribuir protocolos detallados para una amplia gama de tareas, como la desinfección de superficies, la esterilización de instrumental, la limpieza de gabinetes y la gestión de residuos biológicos. Para los auxiliares y asistentes, es una fuente de verdad única y de fácil acceso que garantiza que siempre sigan los procedimientos más recientes y aprobados, eliminando la ambigüedad y el riesgo de errores. Dentro del ERP dental, esta funcionalidad establece la base normativa para el resto del módulo de trazabilidad. Los ciclos de esterilización y el seguimiento de instrumental se rigen por las directrices establecidas en estos protocolos. Al digitalizar y gestionar estos documentos, la clínica no solo mejora la seguridad del paciente y del personal, sino que también crea un registro auditable indispensable para cumplir con normativas sanitarias, certificaciones de calidad y para facilitar la formación continua del equipo.

## 👥 Roles de Acceso

- Auxiliar / Asistente
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/esterilizacion-trazabilidad/`

Esta funcionalidad reside dentro de la carpeta '/features/esterilizacion-trazabilidad/'. La subcarpeta '/pages/' contiene el componente principal 'ProtocolosLimpiezaPage.tsx' que renderiza la interfaz. Los componentes reutilizables como la lista de protocolos, el visor de detalles y el modal de edición se encuentran en '/components/'. Todas las interacciones con el backend se gestionan a través de funciones definidas en '/apis/protocolosApi.ts', que se encargan de realizar las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/esterilizacion-trazabilidad/pages/ProtocolosLimpiezaPage.tsx`
- `/features/esterilizacion-trazabilidad/components/ListaProtocolosComponent.tsx`
- `/features/esterilizacion-trazabilidad/components/VisorProtocoloDetalleComponent.tsx`
- `/features/esterilizacion-trazabilidad/components/ModalGestionProtocolo.tsx`
- `/features/esterilizacion-trazabilidad/components/HistorialVersionesProtocolo.tsx`
- `/features/esterilizacion-trazabilidad/apis/protocolosApi.ts`

### Componentes React

- ListaProtocolosComponent
- VisorProtocoloDetalleComponent
- ModalGestionProtocolo
- HistorialVersionesProtocolo
- BotonConfirmarLectura

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de los protocolos, incluyendo su creación, consulta, actualización (versionado) y el registro de confirmaciones de lectura por parte del personal.

### `GET` `/api/esterilizacion/protocolos`

Obtiene una lista de todos los protocolos disponibles, permitiendo filtrar por categoría, sede o estado de lectura del usuario actual.

**Parámetros:** query.categoria: string, query.sedeId: string, query.noLeidos: boolean

**Respuesta:** Array de objetos de Protocolo (versión más reciente de cada uno).

### `GET` `/api/esterilizacion/protocolos/:id`

Obtiene los detalles completos de un protocolo específico, incluyendo su contenido, metadatos y el historial de versiones.

**Parámetros:** path.id: string (ID del Protocolo)

**Respuesta:** Objeto de Protocolo con el historial de versiones populado.

### `POST` `/api/esterilizacion/protocolos`

Crea un nuevo protocolo. Solo accesible para roles de Director/Admin.

**Parámetros:** body.titulo: string, body.categoria: string, body.contenido: string (HTML/Markdown), body.sedesAsignadas: Array<string>

**Respuesta:** El objeto del nuevo Protocolo creado.

### `PUT` `/api/esterilizacion/protocolos/:id`

Actualiza un protocolo existente. Esta acción crea una nueva versión del protocolo, archivando la anterior en el historial. Solo accesible para roles de Director/Admin.

**Parámetros:** path.id: string (ID del Protocolo), body.titulo: string, body.contenido: string

**Respuesta:** El objeto del Protocolo con la nueva versión actualizada.

### `POST` `/api/esterilizacion/protocolos/:id/confirmar-lectura`

Permite a un usuario (Auxiliar/Asistente) registrar que ha leído y comprendido una versión específica del protocolo.

**Parámetros:** path.id: string (ID del Protocolo), body.version: number

**Respuesta:** { success: true, message: 'Lectura confirmada correctamente' }

### `DELETE` `/api/esterilizacion/protocolos/:id`

Archiva un protocolo, haciéndolo no visible para los auxiliares pero conservándolo en la base de datos para registros históricos. Solo accesible para roles de Director/Admin.

**Parámetros:** path.id: string (ID del Protocolo)

**Respuesta:** { success: true, message: 'Protocolo archivado' }

## 🗂️ Estructura Backend (MERN)

En el backend, se utiliza un modelo 'Protocolo' en MongoDB para almacenar toda la información. Un 'ProtocoloController' contiene la lógica para manejar las solicitudes, como el versionado y la gestión de lecturas. Las rutas se definen en un archivo específico para la esterilización, agrupando todos los endpoints relacionados.

### Models

#### Protocolo

titulo: String, categoria: String, versionActual: Number, activo: Boolean, sedes: [ObjectId (ref: 'Sede')], autor: ObjectId (ref: 'Usuario'), versiones: [{ version: Number, contenido: String, fecha: Date, autor: ObjectId (ref: 'Usuario') }], lecturasConfirmadas: [{ usuario: ObjectId (ref: 'Usuario'), version: Number, fecha: Date }]

### Controllers

#### ProtocoloController

- listarProtocolos
- obtenerProtocoloPorId
- crearProtocolo
- actualizarProtocolo
- archivarProtocolo
- confirmarLectura

### Routes

#### `/api/esterilizacion/protocolos`

- GET /
- GET /:id
- POST /
- PUT /:id
- DELETE /:id
- POST /:id/confirmar-lectura

## 🔄 Flujos

1. Flujo de Creación (Admin): El Director/Admin accede a la sección, pulsa 'Nuevo Protocolo', rellena el título, categoría y contenido usando un editor de texto enriquecido, asigna las sedes pertinentes y guarda. El sistema crea la versión 1 del protocolo.
2. Flujo de Consulta y Confirmación (Auxiliar): El Auxiliar/Asistente entra a la sección y ve una lista de protocolos, con indicadores visuales para los que son nuevos o han sido actualizados. Abre un protocolo, lee su contenido y pulsa el botón 'He leído y comprendido este protocolo'. El sistema registra su confirmación con la fecha y versión.
3. Flujo de Actualización (Admin): El Director/Admin selecciona un protocolo existente y lo edita. Al guardar, el sistema crea una nueva versión (ej. v2), mantiene la v1 en el historial y resetea las confirmaciones de lectura, notificando a los usuarios afectados sobre la actualización.
4. Flujo de Auditoría (Admin): El Director/Admin puede ver un protocolo y acceder a una vista que muestra qué usuarios han confirmado la lectura de la versión actual y quiénes están pendientes.

## 📝 User Stories

- Como Director / Admin general, quiero crear, editar y archivar protocolos de limpieza para mantener toda la documentación de procedimientos centralizada y actualizada.
- Como Auxiliar / Asistente, quiero acceder de forma rápida y sencilla a la última versión de todos los protocolos de desinfección para asegurar que estoy realizando mi trabajo correctamente.
- Como Director / Admin general, quiero ver un listado de qué empleados han confirmado la lectura de cada protocolo para realizar un seguimiento del cumplimiento y la formación.
- Como Auxiliar / Asistente, quiero recibir una notificación o ver un indicador claro cuando un protocolo que me aplica ha sido actualizado para poder revisar los cambios.
- Como Director / Admin general, quiero poder consultar versiones anteriores de un protocolo para tener un historial completo de los procedimientos en caso de una auditoría.

## ⚙️ Notas Técnicas

- Implementar un editor de texto enriquecido (WYSIWYG) en el frontend, como Tiptap o React-Quill, para facilitar la creación de protocolos con formato, imágenes y tablas.
- El versionado en el backend es crucial. Al actualizar (PUT), no se debe sobrescribir el documento. Se debe añadir una nueva entrada al array 'versiones' e incrementar el campo 'versionActual'.
- La seguridad de los endpoints es prioritaria. Utilizar middleware para verificar roles en las rutas POST, PUT y DELETE, asegurando que solo los administradores puedan modificar protocolos.
- Para la confirmación de lectura, el sistema debe registrar el 'userId', el 'protocoloId' y el 'numero de version' leído para evitar ambigüedades si el protocolo se actualiza posteriormente.
- Optimizar la carga de la lista de protocolos en el frontend para no traer el contenido completo de cada uno, solo los metadatos (título, categoría, versión). El contenido se cargará bajo demanda al seleccionar un protocolo.
- Considerar un sistema de notificaciones push o dentro de la aplicación para alertar activamente al personal sobre actualizaciones importantes en los protocolos.

