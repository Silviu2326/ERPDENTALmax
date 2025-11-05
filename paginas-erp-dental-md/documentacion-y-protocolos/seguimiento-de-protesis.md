# Seguimiento de Prótesis

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

El módulo de 'Seguimiento de Prótesis' es una herramienta integral diseñada para gestionar y monitorizar el ciclo de vida completo de las prótesis dentales, desde la prescripción por parte del odontólogo hasta la instalación final en el paciente. Este sistema centraliza la comunicación entre la clínica dental y los laboratorios protésicos, eliminando la necesidad de llamadas telefónicas, correos electrónicos dispersos y registros en papel. Su principal objetivo es optimizar el flujo de trabajo, reducir errores de comunicación, garantizar la trazabilidad de cada caso y mejorar la calidad del servicio al paciente. Dentro del ERP, esta funcionalidad se integra directamente con el plan de tratamiento del paciente. Cuando un odontólogo prescribe un tratamiento que requiere una prótesis (corona, puente, implante, etc.), se genera automáticamente una 'Orden de Prótesis' en este módulo. La orden contiene toda la información crítica: especificaciones técnicas (material, color), archivos adjuntos (escaneos 3D, fotografías, radiografías), fechas clave y el laboratorio asignado. Como parte del módulo padre 'Documentación y Protocolos', esta funcionalidad estandariza el proceso de solicitud y seguimiento, creando un protocolo digital y auditable para cada prótesis, asegurando que toda la documentación relevante esté archivada y accesible en un único lugar, vinculada al historial clínico del paciente.

## 👥 Roles de Acceso

- Odontólogo
- Protésico / Laboratorio
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Esta funcionalidad reside dentro de la feature 'documentacion-protocolos'. La lógica de la interfaz de usuario se organiza en subcarpetas: '/pages' contiene los componentes de página principal como el listado y el detalle de las prótesis; '/components' aloja componentes reutilizables como la tabla de seguimiento, el timeline de estados o el formulario de nueva orden; y '/apis' gestiona las funciones que interactúan con el backend para obtener, crear y actualizar los datos de las prótesis.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/SeguimientoProtesisDashboardPage.tsx`
- `/features/documentacion-protocolos/pages/DetalleOrdenProtesisPage.tsx`
- `/features/documentacion-protocolos/pages/CrearOrdenProtesisPage.tsx`

### Componentes React

- TablaSeguimientoProtesis
- FiltrosProtesisPanel
- TimelineEstadoProtesis
- FormularioOrdenProtesis
- VisorArchivosAdjuntosProtesis
- ModalActualizarEstadoProtesis
- ChatNotasProtesis

## 🔌 APIs Backend

Las APIs para este módulo gestionan las operaciones CRUD para las órdenes de prótesis, el cambio de sus estados, la gestión de archivos adjuntos y la comunicación entre clínica y laboratorio.

### `GET` `/api/protesis`

Obtiene una lista paginada de todas las órdenes de prótesis, permitiendo filtros por paciente, estado, laboratorio o rango de fechas.

**Parámetros:** query.page (number), query.limit (number), query.pacienteId (string), query.estado (string), query.laboratorioId (string)

**Respuesta:** Un objeto con un array de órdenes de prótesis y datos de paginación.

### `POST` `/api/protesis`

Crea una nueva orden de prótesis. Se asocia a un paciente y a un plan de tratamiento.

**Parámetros:** body.pacienteId, body.tratamientoId, body.laboratorioId, body.especificaciones (object)

**Respuesta:** El objeto de la nueva orden de prótesis creada.

### `GET` `/api/protesis/:id`

Obtiene los detalles completos de una orden de prótesis específica, incluyendo su historial de estados y archivos adjuntos.

**Parámetros:** params.id (string)

**Respuesta:** El objeto completo de la orden de prótesis.

### `PUT` `/api/protesis/:id/estado`

Actualiza el estado de una orden de prótesis (ej. de 'Prescrita' a 'Enviada a Laboratorio'). Registra el cambio en el historial.

**Parámetros:** params.id (string), body.nuevoEstado (string), body.nota (string, optional)

**Respuesta:** El objeto de la orden de prótesis actualizado.

### `POST` `/api/protesis/:id/archivos`

Sube uno o más archivos (imágenes, STL, PDFs) y los asocia a una orden de prótesis específica.

**Parámetros:** params.id (string), formData (file)

**Respuesta:** El objeto de la orden de prótesis actualizado con las nuevas referencias de archivos.

## 🗂️ Estructura Backend (MERN)

El backend para esta funcionalidad se apoya en un modelo 'Protesis' en MongoDB para persistir los datos. Un 'ProtesisController' contiene la lógica de negocio para manipular estos datos, y las rutas de Express exponen esta lógica a través de una API RESTful.

### Models

#### Protesis

paciente: ObjectId, odontologo: ObjectId, laboratorio: ObjectId, tratamiento: ObjectId, tipoProtesis: String, material: String, color: String, estado: { type: String, enum: ['Prescrita', 'Enviada a Laboratorio', 'Recibida de Laboratorio', 'Prueba en Paciente', 'Ajustes en Laboratorio', 'Instalada', 'Cancelada'] }, fechaCreacion: Date, fechaEnvioLab: Date, fechaPrevistaEntrega: Date, fechaRecepcionClinica: Date, notasClinica: String, notasLaboratorio: String, archivosAdjuntos: [{ nombreArchivo: String, url: String, subidoPor: ObjectId, fechaSubida: Date }], historialEstados: [{ estado: String, fecha: Date, usuario: ObjectId, nota: String }]

### Controllers

#### ProtesisController

- crearOrdenProtesis
- obtenerTodasLasProtesis
- obtenerProtesisPorId
- actualizarEstadoProtesis
- subirArchivoProtesis

### Routes

#### `/api/protesis`

- GET /
- POST /
- GET /:id
- PUT /:id/estado
- POST /:id/archivos

## 🔄 Flujos

1. El odontólogo, desde el plan de tratamiento del paciente, inicia una nueva orden de prótesis, completa los detalles técnicos y adjunta archivos iniciales. El estado inicial es 'Prescrita'.
2. El personal de recepción cambia el estado a 'Enviada a Laboratorio' y el sistema notifica al laboratorio.
3. El protésico accede al sistema, ve la nueva orden en su panel, la acepta y actualiza el estado (ej. 'En producción'). Puede añadir notas o solicitar más información a través del sistema.
4. Una vez finalizado, el laboratorio actualiza el estado a 'Enviada a Clínica'. La clínica recibe una notificación.
5. Recepción registra la llegada física de la prótesis cambiando el estado a 'Recibida de Laboratorio'.
6. Tras la cita con el paciente, el odontólogo actualiza el estado final a 'Instalada' o 'Ajustes en Laboratorio', cerrando el ciclo o iniciando uno nuevo de revisión.

## 📝 User Stories

- Como odontólogo, quiero crear una orden de prótesis digitalmente con todos los detalles y archivos adjuntos para asegurar que el laboratorio recibe la información exacta y sin ambigüedades.
- Como protésico, quiero tener un portal donde pueda ver todas mis órdenes de trabajo pendientes, con acceso directo a los archivos 3D y especificaciones, para organizar mi producción eficientemente.
- Como recepcionista, quiero consultar un listado de todas las prótesis en curso y sus fechas de entrega estimadas para poder agendar las citas de instalación de los pacientes con anticipación.
- Como odontólogo, quiero ver un historial cronológico de todos los cambios de estado y comunicaciones de una prótesis para tener una trazabilidad completa del caso si surge cualquier incidencia.
- Como protésico, quiero poder añadir notas y marcar un trabajo como finalizado para notificar a la clínica de forma automática y en tiempo real.

## ⚙️ Notas Técnicas

- Seguridad y Cumplimiento: Implementar un control de acceso basado en roles (RBAC) estricto. El rol 'Protésico / Laboratorio' solo debe poder ver las órdenes asignadas a su laboratorio. Todos los datos de pacientes deben ser tratados según las normativas de protección de datos (LOPD/GDPR/HIPAA).
- Gestión de Archivos: Los archivos adjuntos (especialmente los pesados como los escaneos 3D en formato .STL) no deben almacenarse en el servidor de la aplicación. Utilizar un servicio de almacenamiento de objetos como Amazon S3 o Google Cloud Storage para mayor escalabilidad y seguridad.
- Notificaciones en Tiempo Real: Integrar WebSockets (usando Socket.IO) para proporcionar notificaciones instantáneas a los usuarios cuando el estado de una prótesis cambia o se añade una nueva nota, mejorando la comunicación reactiva.
- Base de Datos: El campo 'estado' en el modelo 'Protesis' debe ser un tipo 'String' con una lista de valores predefinidos (enum) para mantener la consistencia de los datos y facilitar los filtros y reportes.
- Optimización: La lista principal de prótesis debe implementar paginación en el backend para manejar un gran volumen de órdenes sin degradar el rendimiento del frontend.

