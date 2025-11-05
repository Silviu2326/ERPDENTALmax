# Estados de Fabricación

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad 'Estados de Fabricación' es un componente crítico dentro del módulo de 'Documentación y Protocolos' del ERP dental. Su propósito principal es digitalizar, centralizar y transparentar el flujo de trabajo entre la clínica dental y el laboratorio protésico. Esta herramienta permite un seguimiento en tiempo real del ciclo de vida completo de cualquier trabajo protésico, como coronas, puentes, implantes, carillas o prótesis removibles. Desde el momento en que el odontólogo prescribe el trabajo y envía las especificaciones (impresiones digitales, color, material), el sistema crea una orden de fabricación única vinculada al paciente y a su plan de tratamiento. A partir de ahí, tanto el odontólogo como el técnico de laboratorio pueden visualizar y actualizar el estado de la orden a través de una serie de etapas predefinidas y personalizables (ej: 'Recibido en laboratorio', 'Diseño CAD', 'Fresado/Impresión', 'Acabado y Pulido', 'Control de Calidad', 'Enviado a clínica'). Esta trazabilidad elimina la necesidad de constantes llamadas telefónicas y correos electrónicos, reduciendo errores de comunicación y optimizando los tiempos. Además, funciona como un registro documental auditable, almacenando quién actualizó cada estado, cuándo lo hizo, y cualquier nota o archivo adjunto (fotos, diseños CAD) relevante, garantizando el cumplimiento de los protocolos de calidad y la correcta documentación del caso clínico.

## 👥 Roles de Acceso

- Protésico / Laboratorio
- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Esta funcionalidad se encuentra dentro de la feature 'documentacion-protocolos'. La subcarpeta '/pages' contiene el componente principal 'EstadosFabricacionPage.tsx', que renderiza la interfaz para listar y gestionar las órdenes. La carpeta '/components' alberga los elementos de UI reutilizables como 'TablaOrdenesFabricacion' para mostrar los datos, 'TimelineEstadoFabricacion' para la visualización del progreso y 'ModalActualizarEstado' para las interacciones del usuario. La lógica de comunicación con el backend se encapsula en la subcarpeta '/apis' con funciones específicas para gestionar las órdenes de fabricación.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/EstadosFabricacionPage.tsx`
- `/features/documentacion-protocolos/pages/DetalleOrdenFabricacionPage.tsx`

### Componentes React

- TablaOrdenesFabricacion
- TimelineEstadoFabricacion
- ModalActualizarEstado
- FichaDetalleFabricacion
- FiltrosBusquedaFabricacion

## 🔌 APIs Backend

Conjunto de APIs RESTful para gestionar el ciclo de vida de las órdenes de fabricación. Permiten la creación, consulta, actualización y listado de todas las órdenes, sirviendo como puente entre la base de datos y la interfaz de usuario.

### `GET` `/api/fabricacion`

Obtiene una lista paginada y filtrada de todas las órdenes de fabricación. Permite filtrar por estado, paciente, laboratorio o rango de fechas.

**Parámetros:** query.page (number), query.limit (number), query.estado (string), query.pacienteId (string), query.laboratorioId (string)

**Respuesta:** Un objeto con un array de órdenes de fabricación y metadatos de paginación.

### `POST` `/api/fabricacion`

Crea una nueva orden de fabricación. Debe estar asociada a un paciente y un tratamiento existente.

**Parámetros:** body.pacienteId, body.tratamientoId, body.odontologoId, body.laboratorioId, body.especificaciones (objeto con material, color, etc.)

**Respuesta:** El objeto de la nueva orden de fabricación creada.

### `GET` `/api/fabricacion/:id`

Obtiene los detalles completos de una orden de fabricación específica, incluyendo su historial de estados.

**Parámetros:** params.id (string)

**Respuesta:** El objeto completo de la orden de fabricación solicitada.

### `PUT` `/api/fabricacion/:id/estado`

Actualiza el estado de una orden de fabricación. Esta es la acción principal del laboratorio. Añade una nueva entrada al historial de estados.

**Parámetros:** params.id (string), body.nuevoEstado (string), body.notas (string, opcional), body.usuarioId (string, id del usuario que realiza el cambio)

**Respuesta:** El objeto de la orden de fabricación actualizada.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se basa en el patrón MVC. El modelo 'OrdenFabricacion' define el esquema de datos en MongoDB. El 'FabricacionController' contiene toda la lógica de negocio para manipular estos datos. Las 'FabricacionRoutes' exponen los endpoints de la API para ser consumidos por el frontend.

### Models

#### OrdenFabricacion

pacienteId: ObjectId (ref: 'Paciente'), odontologoId: ObjectId (ref: 'Usuario'), laboratorioId: ObjectId (ref: 'Usuario'), tratamientoId: ObjectId (ref: 'Tratamiento'), fechaCreacion: Date, fechaEntregaEstimada: Date, especificaciones: { tipoProtesis: String, material: String, color: String, notasAdicionales: String }, estadoActual: String, historialEstados: [{ estado: String, fecha: Date, usuarioId: ObjectId, notas: String }], archivosAdjuntos: [{ nombre: String, url: String }]

### Controllers

#### FabricacionController

- crearOrdenFabricacion
- obtenerTodasLasOrdenes
- obtenerOrdenPorId
- actualizarEstadoDeOrden

### Routes

#### `/api/fabricacion`

- GET /
- POST /
- GET /:id
- PUT /:id/estado

## 🔄 Flujos

1. El odontólogo, desde la ficha de un paciente, inicia una nueva orden de fabricación asociada a un tratamiento, completando las especificaciones requeridas.
2. El usuario del laboratorio visualiza la nueva orden en su panel de 'Estados de Fabricación' con el estado inicial 'Pendiente de Aceptación'.
3. El laboratorio acepta el trabajo, cambiando el estado a 'En Proceso' y comienza la fabricación.
4. A medida que el trabajo avanza por las diferentes fases (diseño, impresión, etc.), el laboratorio actualiza el estado correspondiente en el sistema, pudiendo añadir notas o fotos.
5. El odontólogo consulta el estado de sus trabajos en tiempo real para hacer seguimiento y planificar las citas de los pacientes.
6. Al finalizar, el laboratorio marca la orden como 'Lista para Entrega', lo que puede desencadenar una notificación automática al odontólogo.
7. La clínica recibe el trabajo, y el estado final se actualiza a 'Recibido en Clínica'.

## 📝 User Stories

- Como Odontólogo, quiero crear una orden de fabricación adjuntando archivos de escaneo intraoral para que el laboratorio tenga toda la información digital necesaria desde el principio.
- Como Protésico / Laboratorio, quiero tener un dashboard que me muestre un resumen de las órdenes por estado (Nuevas, En Proceso, Urgentes) para organizar eficientemente la carga de trabajo.
- Como Odontólogo, quiero poder filtrar todas mis órdenes de fabricación por paciente o por estado para encontrar rápidamente la información que necesito.
- Como Protésico / Laboratorio, quiero poder añadir notas y adjuntar imágenes en cada cambio de estado para documentar el proceso y comunicar detalles importantes al odontólogo.
- Como Odontólogo, quiero recibir una notificación en el sistema cuando un trabajo protésico ha sido enviado desde el laboratorio para coordinar la logística de recepción y la cita del paciente.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un estricto control de acceso basado en roles (RBAC). Un odontólogo solo debería ver las órdenes asociadas a su clínica, y un laboratorio solo las órdenes que le han sido asignadas.
- Notificaciones en Tiempo Real: Utilizar WebSockets (ej. Socket.IO) para notificar instantáneamente a los usuarios relevantes sobre los cambios de estado, mejorando la comunicación y la reactividad.
- Integración de Almacenamiento: Para los archivos adjuntos (escaneos, fotos, CAD), integrar con un servicio de almacenamiento en la nube como AWS S3 o Google Cloud Storage para no sobrecargar la base de datos y gestionar los archivos de forma escalable y segura.
- Estados Configurables: El modelo de datos debe permitir que los estados de fabricación sean configurables por un administrador del sistema, en lugar de estar codificados en la aplicación. Esto proporciona flexibilidad para adaptarse a diferentes flujos de trabajo de laboratorio.
- Rendimiento: En la vista principal de la tabla de órdenes, implementar paginación del lado del servidor y una búsqueda/filtrado eficiente con índices en la base de datos MongoDB sobre los campos clave (estado, pacienteId, laboratorioId, fechaCreacion).

