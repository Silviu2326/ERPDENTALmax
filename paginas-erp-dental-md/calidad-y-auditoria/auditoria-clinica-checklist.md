# Auditoría Clínica (Checklist)

**Categoría:** Calidad y Auditoría | **Módulo:** Calidad y Auditoría

La funcionalidad de Auditoría Clínica (Checklist) es una herramienta digital diseñada para estandarizar y monitorizar la calidad de los procedimientos clínicos dentro del ERP dental. No se trata de una auditoría financiera, sino de una auditoría de procesos y cumplimiento de protocolos. Su propósito principal es garantizar que todos los odontólogos sigan los mismos estándares de calidad y seguridad en la atención al paciente, minimizando errores y mejorando los resultados clínicos. Dentro del módulo 'Calidad y Auditoría', esta funcionalidad es la piedra angular, ya que proporciona los datos brutos sobre el cumplimiento de los procedimientos establecidos. Funciona mediante un sistema de plantillas de checklists personalizables. El rol de Director o Administrador puede crear, modificar y archivar diferentes plantillas para diversos procedimientos (ej: 'Checklist de Primera Visita', 'Protocolo de Cirugía de Implante', 'Checklist de Bioseguridad del Gabinete'). Cada plantilla se compone de una serie de ítems que pueden ser de diferentes tipos (casilla de verificación, campo de texto, selección múltiple, carga de archivos). Posteriormente, el odontólogo, durante la atención a un paciente, puede iniciar una auditoría seleccionando la plantilla correspondiente. El sistema le presenta un formulario interactivo que guía al profesional paso a paso, asegurando que se cumplan todos los puntos críticos. Una vez completado, el checklist se guarda como un registro inmutable en el historial del paciente, proporcionando una trazabilidad completa y una prueba documental del procedimiento realizado. Esto no solo mejora la calidad, sino que también ofrece una valiosa protección legal y facilita la formación de nuevo personal y la identificación de áreas de mejora a nivel de clínica o multisede.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/calidad-auditoria/`

Esta funcionalidad reside dentro de la carpeta de la feature 'calidad-auditoria'. La subcarpeta '/pages' contendrá las vistas principales: una página para la gestión de plantillas de auditoría (accesible por roles de Director/Admin) y otra para la ejecución del checklist por parte del odontólogo, que probablemente se integre en la vista del paciente. La carpeta '/components' albergará componentes reutilizables como el constructor de plantillas ('ChecklistTemplateBuilder'), el formulario interactivo para rellenar el checklist ('ChecklistRunnerForm'), y cada ítem individual del checklist ('ChecklistItem'). La carpeta '/apis' gestionará todas las llamadas al backend para crear/leer/actualizar/eliminar plantillas y para guardar y recuperar las auditorías completadas.

### Archivos Frontend

- `/features/calidad-auditoria/pages/GestionTemplatesAuditoriaPage.tsx`
- `/features/calidad-auditoria/pages/EjecucionAuditoriaClinicaPage.tsx`
- `/features/calidad-auditoria/pages/HistorialAuditoriasPacientePage.tsx`

### Componentes React

- ChecklistTemplateBuilder
- ChecklistRunnerForm
- ChecklistItem
- AuditTemplateCard
- AuditHistoryList

## 🔌 APIs Backend

Se necesitan APIs RESTful para dos entidades principales: las Plantillas de Auditoría (AuditTemplate) y las Instancias de Auditoría (AuditInstance). Las APIs de plantillas permitirán operaciones CRUD completas para los administradores. Las APIs de instancias permitirán a los odontólogos crear una nueva auditoría a partir de una plantilla, guardarla (parcial o completamente) y recuperar el historial de auditorías de un paciente.

### `GET` `/api/audit-templates`

Obtiene todas las plantillas de auditoría clínica disponibles para la clínica.

**Parámetros:** query: clinicId

**Respuesta:** Array de objetos AuditTemplate.

### `POST` `/api/audit-templates`

Crea una nueva plantilla de checklist para auditoría clínica. (Rol: Director/Admin)

**Parámetros:** body: { name: string, description: string, items: [object] }

**Respuesta:** El objeto AuditTemplate recién creado.

### `PUT` `/api/audit-templates/:templateId`

Actualiza una plantilla de auditoría existente. (Rol: Director/Admin)

**Parámetros:** params: templateId, body: { name: string, description: string, items: [object] }

**Respuesta:** El objeto AuditTemplate actualizado.

### `GET` `/api/audits/patient/:patientId`

Obtiene el historial de todas las auditorías completadas para un paciente específico.

**Parámetros:** params: patientId

**Respuesta:** Array de objetos AuditInstance.

### `POST` `/api/audits`

Inicia una nueva auditoría para un paciente, creando una instancia basada en una plantilla.

**Parámetros:** body: { templateId: string, patientId: string, odontologistId: string }

**Respuesta:** El objeto AuditInstance recién creado con estado 'in-progress'.

### `PUT` `/api/audits/:auditId`

Guarda el progreso o finaliza una auditoría en curso, actualizando las respuestas.

**Parámetros:** params: auditId, body: { answers: [object], status: 'completed' | 'in-progress' }

**Respuesta:** El objeto AuditInstance actualizado.

## 🗂️ Estructura Backend (MERN)

El backend requiere dos modelos principales en MongoDB: 'AuditTemplate' para definir la estructura de los checklists y 'AuditInstance' para almacenar los resultados de cada auditoría realizada. Los controladores correspondientes gestionarán la lógica de negocio, como la validación de datos y el control de permisos por rol. Las rutas expondrán estos servicios de forma segura y organizada.

### Models

#### AuditTemplate

name: String, description: String, clinicId: ObjectId (ref: 'Clinic'), createdBy: ObjectId (ref: 'User'), isActive: Boolean, items: [{ type: String ('checkbox', 'text', 'select', 'file'), label: String, options: [String], isRequired: Boolean }]

#### AuditInstance

templateId: ObjectId (ref: 'AuditTemplate'), patientId: ObjectId (ref: 'Patient'), odontologistId: ObjectId (ref: 'User'), clinicId: ObjectId (ref: 'Clinic'), status: String ('in-progress', 'completed'), answers: [{ itemId: String, value: any, notes: String }], completionDate: Date, createdAt: Date

### Controllers

#### AuditTemplateController

- createTemplate
- getAllTemplates
- getTemplateById
- updateTemplate
- deactivateTemplate

#### AuditInstanceController

- createAuditInstance
- getAuditInstanceById
- getAuditsByPatient
- updateAuditInstance

### Routes

#### `/api/audit-templates`

- GET /
- POST /
- GET /:templateId
- PUT /:templateId

#### `/api/audits`

- POST /
- GET /:auditId
- PUT /:auditId
- GET /patient/:patientId

## 🔄 Flujos

1. Flujo de Creación de Plantilla: El Director accede al módulo 'Calidad y Auditoría' -> Selecciona 'Gestión de Plantillas' -> Hace clic en 'Nueva Plantilla' -> Nombra y describe la plantilla -> Utiliza el constructor visual para arrastrar y configurar ítems (checkboxes, textos) -> Guarda la plantilla, que queda disponible para todos los odontólogos de la clínica.
2. Flujo de Ejecución de Auditoría: El Odontólogo está en la ficha de un paciente -> Accede a la sección 'Auditoría Clínica' -> Selecciona una plantilla de la lista (ej. 'Protocolo Pre-quirúrgico') -> El sistema muestra el checklist interactivo -> El odontólogo marca las casillas y rellena los campos a medida que realiza el procedimiento -> Al finalizar, hace clic en 'Completar Auditoría' -> El registro se guarda en el historial del paciente y se vuelve de solo lectura.

## 📝 User Stories

- Como Director de clínica, quiero crear y gestionar plantillas de checklists de auditoría para estandarizar los procedimientos clínicos en todas las sedes.
- Como Director, quiero ver los resultados de las auditorías completadas para evaluar el cumplimiento de los protocolos e identificar áreas de mejora o necesidades de formación.
- Como Odontólogo, quiero acceder a una lista de checklists relevantes para el procedimiento que estoy realizando con un paciente para asegurar que no omito ningún paso crítico.
- Como Odontólogo, quiero poder rellenar un checklist de forma rápida y sencilla durante la atención al paciente, preferiblemente desde una tablet, para que no interrumpa mi flujo de trabajo.
- Como Odontólogo, quiero que el checklist completado se adjunte automáticamente al historial del paciente como prueba documental del procedimiento realizado.

## ⚙️ Notas Técnicas

- Seguridad: Es fundamental implementar un control de acceso basado en roles (RBAC). Solo los Directores/Admins pueden gestionar plantillas. Las instancias de auditoría completadas deben ser inmutables para garantizar la integridad de los datos.
- UI/UX: El constructor de plantillas debe ser intuitivo, idealmente con funcionalidad de arrastrar y soltar (drag-and-drop), usando librerías como 'react-beautiful-dnd'. El formulario de ejecución para el odontólogo debe tener un diseño limpio, ser rápido y totalmente responsive para su uso en tablets.
- Integración: Una auditoría completada debería aparecer como un evento significativo en la línea de tiempo de la Historia Clínica del paciente. Se podría explorar la posibilidad de que un ítem fallido en un checklist genere automáticamente una tarea en el módulo de 'Tareas' (ej. 'Revisar esterilización de material').
- Almacenamiento de Archivos: Si se permite la carga de archivos (ej. fotos, radiografías), se debe usar un servicio de almacenamiento de objetos como AWS S3 o Google Cloud Storage. MongoDB solo almacenará la URL del archivo, no el binario.
- Rendimiento: Para el historial de auditorías de un paciente, se debe implementar paginación en la API para manejar pacientes con un largo historial de forma eficiente.

