# Órdenes a Laboratorio

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad 'Órdenes a Laboratorio' es un componente esencial dentro del ERP dental, diseñado para digitalizar, centralizar y optimizar la comunicación y el flujo de trabajo entre la clínica dental y los laboratorios protésicos externos. Este sistema reemplaza los formularios de prescripción en papel, las llamadas telefónicas y los correos electrónicos dispersos, consolidando toda la información en una única plataforma integrada. Su propósito principal es asegurar la trazabilidad completa de cada trabajo protésico, desde la solicitud inicial por parte del odontólogo hasta la recepción del trabajo finalizado en la clínica. Dentro del módulo padre 'Documentación y Protocolos', esta funcionalidad actúa como el repositorio central de toda la documentación legal y técnica asociada a trabajos de laboratorio, como prescripciones, modelos digitales (scans intraorales), fotografías, especificaciones de materiales, fechas de entrega y facturas. El sistema permite a los odontólogos y asistentes crear órdenes detalladas, adjuntar archivos relevantes, seleccionar laboratorios específicos, y realizar un seguimiento en tiempo real del estado del trabajo (ej. 'Enviada', 'En Proceso', 'Completada'). Esto reduce drásticamente los errores de comunicación, minimiza los retrasos, mejora el control de calidad y proporciona un registro histórico auditable para cada paciente, lo cual es fundamental tanto para la gestión clínica como para el cumplimiento normativo.

## 👥 Roles de Acceso

- Odontólogo
- Auxiliar / Asistente
- Protésico / Laboratorio

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Toda la lógica de frontend para esta funcionalidad reside dentro de la carpeta '/features/documentacion-protocolos/'. La subcarpeta '/pages/' contiene los componentes de página principales, como 'OrdenesLaboratorioPage.tsx', que actúa como el dashboard central para visualizar y gestionar todas las órdenes. La carpeta '/components/' alberga componentes reutilizables específicos de esta funcionalidad, como 'FormularioOrdenLaboratorio' para la creación y edición, 'ListaOrdenesLaboratorio' para mostrar los datos en una tabla interactiva, y 'TimelineEstadoOrden' para visualizar el historial de estados. Finalmente, la carpeta '/apis/' contiene las funciones que encapsulan las llamadas a la API del backend, como 'crearOrdenAPI', 'obtenerOrdenesAPI', etc., manteniendo la lógica de comunicación separada de la UI.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/OrdenesLaboratorioPage.tsx`
- `/features/documentacion-protocolos/pages/DetalleOrdenLaboratorioPage.tsx`
- `/features/documentacion-protocolos/pages/CrearOrdenLaboratorioPage.tsx`

### Componentes React

- ListaOrdenesLaboratorio
- FiltrosBusquedaOrdenes
- FormularioOrdenLaboratorio
- ModalDetalleOrden
- TimelineEstadoOrden
- UploaderArchivosAdjuntos
- SelectorLaboratorio

## 🔌 APIs Backend

Las APIs RESTful son el núcleo para la gestión del ciclo de vida de las órdenes de laboratorio. Proporcionan endpoints para crear, leer, actualizar y eliminar órdenes, así como para gestionar sus estados y archivos adjuntos. Se incluyen endpoints auxiliares para obtener listas de pacientes y laboratorios necesarios para los formularios.

### `POST` `/api/ordenes-laboratorio`

Crea una nueva orden de laboratorio. Se asocia a un paciente, odontólogo y laboratorio.

**Parámetros:** body: { pacienteId, laboratorioId, odontologoId, tipoTrabajo, instrucciones, fechaEntregaPrevista, color, materiales, etc. }

**Respuesta:** JSON con el objeto de la nueva orden creada.

### `GET` `/api/ordenes-laboratorio`

Obtiene una lista paginada y filtrada de todas las órdenes de laboratorio.

**Parámetros:** query: ?page=1&limit=10&estado=Enviada&pacienteId=...&laboratorioId=...

**Respuesta:** JSON con un array de órdenes y metadatos de paginación.

### `GET` `/api/ordenes-laboratorio/:id`

Obtiene los detalles completos de una orden de laboratorio específica, incluyendo su historial de estados y archivos adjuntos.

**Parámetros:** path: id (ID de la orden)

**Respuesta:** JSON con el objeto de la orden solicitada.

### `PUT` `/api/ordenes-laboratorio/:id/estado`

Actualiza únicamente el estado de una orden. Registra el cambio en el historial de la orden.

**Parámetros:** path: id (ID de la orden), body: { nuevoEstado, notas }

**Respuesta:** JSON con el objeto de la orden actualizada.

### `POST` `/api/ordenes-laboratorio/:id/adjuntos`

Sube uno o más archivos y los asocia a una orden de laboratorio existente.

**Parámetros:** path: id (ID de la orden), body: FormData con los archivos

**Respuesta:** JSON con el array actualizado de archivos adjuntos de la orden.

### `GET` `/api/laboratorios`

Obtiene una lista de todos los laboratorios disponibles para ser seleccionados en el formulario de la orden.

**Respuesta:** JSON con un array de objetos de laboratorios.

## 🗂️ Estructura Backend (MERN)

El backend utiliza una arquitectura MERN. El modelo 'OrdenLaboratorio' en MongoDB define la estructura de datos. El 'OrdenLaboratorioController' contiene la lógica de negocio para cada operación (CRUD, cambio de estado). Las rutas en Express exponen estos controladores como endpoints RESTful.

### Models

#### OrdenLaboratorio

paciente: ObjectId (ref: 'Paciente'), odontologo: ObjectId (ref: 'Usuario'), laboratorio: ObjectId (ref: 'Laboratorio'), tratamientoAsociado: ObjectId (ref: 'Tratamiento'), fechaCreacion: Date, fechaEnvio: Date, fechaEntregaPrevista: Date, fechaEntregaReal: Date, estado: String (enum: ['Borrador', 'Enviada', 'Recibida', 'En Proceso', 'Control Calidad', 'Enviada a Clínica', 'Recibida en Clínica', 'Completada']), tipoTrabajo: String, materiales: String, color: String, instrucciones: String, adjuntos: [{ nombreArchivo: String, url: String, fechaSubida: Date }], historialEstados: [{ estado: String, fecha: Date, usuario: ObjectId, notas: String }]

#### Laboratorio

nombre: String, cif: String, direccion: String, personaContacto: String, email: String, telefono: String, activo: Boolean

### Controllers

#### OrdenLaboratorioController

- crearOrden
- obtenerTodasLasOrdenes
- obtenerOrdenPorId
- actualizarOrden
- actualizarEstadoOrden
- eliminarOrden
- agregarAdjuntoAOrden

#### LaboratorioController

- obtenerLaboratorios

### Routes

#### `/api/ordenes-laboratorio`

- POST /
- GET /
- GET /:id
- PUT /:id/estado
- POST /:id/adjuntos
- DELETE /:id

## 🔄 Flujos

1. 1. Creación de Orden: El odontólogo, desde la ficha de un paciente, inicia una nueva orden. Completa el formulario con detalles del trabajo, selecciona un laboratorio de la lista, y adjunta archivos (ej. scan intraoral). La orden se guarda como 'Borrador' o se envía directamente, cambiando su estado a 'Enviada'.
2. 2. Seguimiento por la Clínica: El personal de la clínica accede al listado de órdenes, donde puede filtrar por estado (ej. 'En Proceso') o por paciente. Al seleccionar una orden, ven su estado actual y un historial detallado de todos los cambios de estado.
3. 3. Gestión por el Laboratorio: El usuario del laboratorio (rol 'Protésico') recibe una notificación. Accede a su portal, ve la nueva orden, descarga los adjuntos y actualiza el estado a 'Recibida' y luego a 'En Proceso' a medida que avanza.
4. 4. Finalización y Recepción: El laboratorio finaliza el trabajo, actualiza el estado a 'Enviada a Clínica' y opcionalmente adjunta la factura. Cuando el paquete llega a la clínica, un asistente busca la orden en el ERP y actualiza su estado a 'Recibida en Clínica', notificando al odontólogo responsable.

## 📝 User Stories

- Como odontólogo, quiero crear una orden de laboratorio digital directamente desde la ficha del paciente para adjuntar scans 3D y especificaciones precisas, asegurando que el laboratorio reciba toda la información correctamente.
- Como auxiliar / asistente, quiero ver un dashboard con todas las órdenes de laboratorio y sus fechas de entrega previstas para poder organizar la agenda de citas de los pacientes para la colocación de las prótesis.
- Como protésico, quiero recibir las órdenes de trabajo en un portal online con todos los archivos e instrucciones claras para poder empezar a trabajar sin demoras ni necesidad de llamadas de aclaración.
- Como odontólogo, quiero consultar el historial de una orden para saber exactamente cuándo fue recibida por el laboratorio y cuándo fue enviada de vuelta a la clínica, garantizando la trazabilidad.
- Como auxiliar / asistente, quiero poder filtrar las órdenes por 'Recibida en Clínica' para saber qué trabajos están listos para ser probados o cementados y gestionar el inventario.

## ⚙️ Notas Técnicas

- Seguridad y Acceso: Es crítico que el rol 'Protésico / Laboratorio' tenga un acceso fuertemente segregado (multi-tenancy a nivel de laboratorio), visualizando únicamente las órdenes destinadas a su laboratorio y sin acceso a información clínica no pertinente del paciente.
- Gestión de Archivos Grandes: Para los adjuntos como scans 3D (archivos STL, PLY) o series de fotos en alta resolución, se debe implementar la subida directa a un servicio de almacenamiento en la nube (ej. AWS S3, Google Cloud Storage) para evitar sobrecargar el servidor de la aplicación y la base de datos. El backend gestionará las URLs seguras y de acceso temporal.
- Sistema de Notificaciones: Implementar notificaciones en tiempo real (vía WebSockets o similar) y por correo electrónico para alertar a los roles implicados de cambios de estado críticos, como 'Nueva orden recibida' para el laboratorio o 'Trabajo enviado' para la clínica.
- Rendimiento: La consulta del listado de órdenes debe estar optimizada con índices en la base de datos MongoDB sobre los campos de filtrado más comunes: 'estado', 'pacienteId', 'laboratorioId' y 'fechaCreacion'. Se debe implementar paginación en el backend para manejar un gran volumen de órdenes históricas.
- Integración: Considerar la posibilidad de integrarse con software de diseño CAD/CAM para que los archivos generados se puedan adjuntar a la orden con un solo clic.

