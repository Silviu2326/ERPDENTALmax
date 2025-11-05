# Acciones Correctivas y Preventivas (CAPA)

**Categoría:** Calidad y Auditoría | **Módulo:** Calidad y Auditoría

La funcionalidad de Acciones Correctivas y Preventivas (CAPA) es un componente esencial del módulo de 'Calidad y Auditoría'. Está diseñada para proporcionar un sistema estructurado y documentado que permita a la dirección de la clínica o del grupo de clínicas gestionar de manera sistemática las no conformidades, incidentes, quejas de pacientes o desviaciones de los protocolos establecidos. Su propósito principal es ir más allá de la simple corrección de un problema; se enfoca en investigar la causa raíz para implementar acciones que no solo solucionen el incidente actual (acción correctiva), sino que también eviten su recurrencia en el futuro (acción preventiva). Dentro del ERP dental, este módulo actúa como el brazo ejecutor del sistema de gestión de calidad. Mientras que las auditorías (otro componente del módulo padre) pueden identificar áreas de mejora o fallos, el sistema CAPA es la herramienta donde estos hallazgos se registran, se asignan a responsables, se investigan y se resuelven formalmente. El flujo de trabajo típico implica la creación de un registro CAPA, la asignación de un investigador, el análisis de la causa raíz, la definición y ejecución de un plan de acción, y finalmente, la verificación de la eficacia de las medidas tomadas antes de su cierre. Esto crea un ciclo de mejora continua y proporciona una trazabilidad completa, crucial para certificaciones de calidad (como ISO 9001) y para demostrar el cumplimiento normativo ante las autoridades sanitarias.

## 👥 Roles de Acceso

- Director
- Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/calidad-y-auditoria/`

Esta funcionalidad reside dentro de la carpeta 'calidad-y-auditoria'. La página principal para la gestión de CAPAs se encontrará en '/pages', los componentes reutilizables como la tabla de CAPAs, el formulario de creación/edición y el visor de historial estarán en '/components', y las funciones para interactuar con el backend se ubicarán en '/apis'. Esta estructura mantiene el código de la funcionalidad CAPA organizado y cohesionado dentro de su módulo padre.

### Archivos Frontend

- `/features/calidad-y-auditoria/pages/GestionCapasPage.tsx`
- `/features/calidad-y-auditoria/pages/DetalleCapaPage.tsx`
- `/features/calidad-y-auditoria/pages/CrearCapaPage.tsx`

### Componentes React

- TablaCapas
- FiltrosCapas
- FormularioCapa
- SeccionAnalisisCausaRaiz
- PlanDeAccionComponent
- HistorialCapaTimeline
- UploaderDocumentosCapa

## 🔌 APIs Backend

Las APIs para CAPA deben soportar operaciones CRUD completas, así como la gestión de su ciclo de vida, como asignaciones, actualizaciones de estado y adjuntar evidencia.

### `GET` `/api/capas`

Obtiene una lista paginada y filtrada de todos los registros CAPA. Permite filtrar por clínica, estado, responsable o rango de fechas.

**Parámetros:** page (number), limit (number), estado (string), id_clinica (string), sortBy (string)

**Respuesta:** Un objeto con un array de registros CAPA y metadatos de paginación.

### `POST` `/api/capas`

Crea un nuevo registro CAPA con la información inicial del incidente o no conformidad.

**Parámetros:** Body: { titulo, descripcion_incidente, fecha_deteccion, fuente, id_clinica }

**Respuesta:** El objeto del nuevo registro CAPA creado.

### `GET` `/api/capas/:id`

Obtiene los detalles completos de un registro CAPA específico por su ID.

**Parámetros:** id (string) en la URL

**Respuesta:** El objeto completo del registro CAPA.

### `PUT` `/api/capas/:id`

Actualiza un registro CAPA existente. Se utiliza para añadir el análisis de causa raíz, definir planes de acción, cambiar el estado, etc.

**Parámetros:** id (string) en la URL, Body: { campos a actualizar }

**Respuesta:** El objeto del registro CAPA actualizado.

### `DELETE` `/api/capas/:id`

Realiza un borrado lógico (soft delete) de un registro CAPA. Solo para administradores y en casos excepcionales.

**Parámetros:** id (string) en la URL

**Respuesta:** Un mensaje de confirmación.

### `POST` `/api/capas/:id/adjuntos`

Sube y asocia uno o más archivos a un registro CAPA específico.

**Parámetros:** id (string) en la URL, FormData con los archivos

**Respuesta:** Un array con las URLs de los archivos subidos.

## 🗂️ Estructura Backend (MERN)

En el backend, se definirá un modelo 'AccionCorrectiva' en MongoDB. Un 'capaController' contendrá la lógica de negocio para gestionar el ciclo de vida de las CAPAs, y un archivo de rutas 'capaRoutes' expondrá los endpoints RESTful correspondientes.

### Models

#### AccionCorrectiva

id_capa (String, único), titulo (String), descripcion_incidente (String), fecha_deteccion (Date), fuente (Enum: ['Auditoría Interna', 'Queja de Paciente', 'Revisión de Equipo', 'Otro']), id_clinica (ObjectId, ref: 'Clinica'), id_responsable_investigacion (ObjectId, ref: 'Usuario'), analisis_causa_raiz (String), accion_correctiva (Object: {descripcion, id_responsable, fecha_limite, fecha_completado}), accion_preventiva (Object: {descripcion, id_responsable, fecha_limite, fecha_completado}), verificacion_efectividad (Object: {descripcion, id_verificador, fecha, resultado}), estado (Enum: ['Abierta', 'En Investigación', 'Acciones Definidas', 'En Implementación', 'Pendiente de Verificación', 'Cerrada']), historial (Array), documentos_adjuntos (Array de Strings), deleted (Boolean, default: false)

### Controllers

#### capaController

- crearCapa
- obtenerTodasLasCapas
- obtenerCapaPorId
- actualizarCapa
- eliminarCapaLogicamente
- agregarAdjuntoCapa

### Routes

#### `/api/capas`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id
- POST /:id/adjuntos

## 🔄 Flujos

1. El Director detecta una no conformidad durante una auditoría y accede a la página 'Gestión CAPAs'.
2. Hace clic en 'Nueva CAPA', completa el formulario inicial con la descripción del problema y lo guarda, creando un registro con estado 'Abierta'.
3. El sistema muestra el nuevo registro en la tabla. El Director abre el detalle de la CAPA y asigna un responsable para la investigación.
4. El responsable recibe una notificación, investiga la causa raíz, la documenta en el sistema y define las acciones correctivas y preventivas, asignando responsables y fechas límite.
5. Los responsables de las acciones las ejecutan y marcan como completadas en el sistema. El estado de la CAPA avanza a 'Pendiente de Verificación'.
6. Finalmente, el Director o un verificador designado revisa la efectividad de las acciones, añade sus comentarios y, si todo es correcto, cierra la CAPA. Todo el proceso queda registrado en el historial.

## 📝 User Stories

- Como Director, quiero crear un nuevo registro CAPA para documentar formalmente una no conformidad detectada.
- Como Admin General, quiero ver un dashboard con el número de CAPAs por estado (abiertas, en proceso, cerradas) para tener una visión rápida de la salud del sistema de calidad.
- Como Director, quiero asignar la investigación y las acciones de una CAPA a miembros específicos del equipo y que estos sean notificados automáticamente.
- Como Admin General, quiero poder filtrar la lista de CAPAs por clínica, estado o fecha de vencimiento para gestionar eficientemente las acciones en un entorno multisede.
- Como Director, quiero adjuntar informes de auditoría o fotografías como evidencia a un registro CAPA.
- Como Director, quiero poder cerrar una CAPA solo después de haber documentado la verificación de su efectividad, para asegurar que el problema ha sido resuelto permanentemente.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un control de acceso basado en roles (RBAC) estricto. Solo los roles definidos pueden crear, modificar o cerrar CAPAs. La modificación de un registro cerrado debe estar prohibida o requerir permisos especiales.
- Auditoría: El campo 'historial' del modelo MongoDB debe ser de solo adición (append-only) a través de la lógica del backend para garantizar una traza de auditoría inmutable de todos los cambios en un registro CAPA.
- Notificaciones: Integrar un sistema de notificaciones (in-app y por correo electrónico) para alertar a los usuarios sobre asignaciones de tareas, fechas de vencimiento próximas y cambios de estado.
- Integración: El sistema debería permitir la creación de CAPAs a partir de otros módulos, como una 'queja' del módulo de Pacientes o un 'fallo de equipo' del módulo de Inventario.
- Almacenamiento de Archivos: Utilizar un servicio de almacenamiento en la nube (ej. AWS S3, Google Cloud Storage) para los documentos adjuntos, almacenando únicamente las URLs en la base de datos para no sobrecargar MongoDB y mejorar el rendimiento.
- Rendimiento: La colección 'AccionCorrectiva' debe tener índices en campos clave como 'id_clinica', 'estado' y 'fecha_deteccion' para optimizar las consultas de filtrado y ordenación.

