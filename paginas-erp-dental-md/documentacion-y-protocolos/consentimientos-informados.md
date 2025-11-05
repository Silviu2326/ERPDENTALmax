# Consentimientos Informados

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad de 'Consentimientos Informados' es un componente crítico dentro del módulo 'Documentación y Protocolos' del ERP dental. Su propósito principal es gestionar de manera centralizada, digital y segura todo el ciclo de vida de los consentimientos informados, un requisito legal y ético indispensable en la práctica odontológica. Este sistema permite a la clínica crear, personalizar y almacenar plantillas de consentimiento para diversos tratamientos (endodoncia, implantes, ortodoncia, etc.), eliminando la dependencia del papel y los errores manuales. Al generar un consentimiento para un paciente específico, el sistema fusiona automáticamente los datos del paciente y del tratamiento con la plantilla seleccionada, creando un documento listo para ser revisado y firmado. La firma se captura digitalmente, a través de una tablet o un dispositivo de firma, garantizando validez legal y un almacenamiento inmutable. Todos los consentimientos firmados se asocian directamente al historial del paciente, permitiendo una consulta rápida y sencilla por parte del personal autorizado. Esta funcionalidad no solo agiliza los procesos administrativos en recepción, sino que también refuerza la seguridad jurídica de la clínica, asegura el cumplimiento normativo (LOPD, GDPR) y mejora la comunicación y transparencia con el paciente, proporcionando un registro claro y accesible de los acuerdos tomados antes de cualquier procedimiento.

## 👥 Roles de Acceso

- Odontólogo
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Esta funcionalidad se encuentra dentro de la feature 'documentacion-protocolos'. La subcarpeta '/pages' contiene el componente principal 'ConsentimientosInformadosPage.tsx', que renderiza la interfaz principal de gestión. En '/components' residen los elementos reutilizables como 'TablaConsentimientos', para listar los documentos; 'EditorPlantillasConsentimiento', un editor de texto enriquecido para crear/modificar plantillas; y 'ModalFirmaDigital' para la captura de la firma del paciente. La carpeta '/apis' contiene las funciones, como 'consentimientosApi.ts', que realizan las llamadas a los endpoints del backend para obtener, crear y actualizar plantillas y consentimientos de pacientes.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/ConsentimientosInformadosPage.tsx`
- `/features/documentacion-protocolos/components/TablaConsentimientos.tsx`
- `/features/documentacion-protocolos/components/EditorPlantillasConsentimiento.tsx`
- `/features/documentacion-protocolos/components/ModalFirmaDigital.tsx`
- `/features/documentacion-protocolos/components/VisorConsentimientoPDF.tsx`
- `/features/documentacion-protocolos/apis/consentimientosApi.ts`

### Componentes React

- ConsentimientosInformadosPage
- TablaConsentimientos
- EditorPlantillasConsentimiento
- ModalFirmaDigital
- VisorConsentimientoPDF
- BuscadorPacientesConsentimientos

## 🔌 APIs Backend

Las APIs gestionan dos entidades principales: las plantillas de consentimiento (reutilizables) y los consentimientos específicos de cada paciente. Se requieren operaciones CRUD completas para las plantillas y operaciones para generar, firmar y consultar los consentimientos de los pacientes.

### `GET` `/api/consentimientos/plantillas`

Obtiene una lista de todas las plantillas de consentimiento disponibles en la clínica.

**Respuesta:** Array de objetos de ConsentimientoPlantilla.

### `POST` `/api/consentimientos/plantillas`

Crea una nueva plantilla de consentimiento informado.

**Parámetros:** body: { nombre: string, contenido: string (HTML/Markdown) }

**Respuesta:** El objeto de la nueva ConsentimientoPlantilla creada.

### `PUT` `/api/consentimientos/plantillas/:id`

Actualiza una plantilla de consentimiento existente.

**Parámetros:** params: { id: string }, body: { nombre: string, contenido: string }

**Respuesta:** El objeto de la ConsentimientoPlantilla actualizada.

### `GET` `/api/consentimientos/paciente/:pacienteId`

Obtiene todos los consentimientos (pendientes y firmados) de un paciente específico.

**Parámetros:** params: { pacienteId: string }

**Respuesta:** Array de objetos de ConsentimientoPaciente.

### `POST` `/api/consentimientos/generar`

Genera un nuevo documento de consentimiento para un paciente a partir de una plantilla, reemplazando las variables.

**Parámetros:** body: { pacienteId: string, plantillaId: string, tratamientoId: string (opcional) }

**Respuesta:** El objeto del nuevo ConsentimientoPaciente creado con estado 'pendiente'.

### `PUT` `/api/consentimientos/:id/firmar`

Registra la firma digital en un consentimiento existente y cambia su estado a 'firmado'.

**Parámetros:** params: { id: string }, body: { firmaDigital: string (Base64) }

**Respuesta:** El objeto del ConsentimientoPaciente actualizado.

### `GET` `/api/consentimientos/:id`

Obtiene los detalles y el contenido de un consentimiento específico para su visualización o descarga.

**Parámetros:** params: { id: string }

**Respuesta:** El objeto completo del ConsentimientoPaciente.

## 🗂️ Estructura Backend (MERN)

El backend utiliza dos modelos principales en MongoDB: 'ConsentimientoPlantilla' para las plantillas maestras y 'ConsentimientoPaciente' para los documentos individuales generados. Un 'ConsentimientoController' maneja toda la lógica de negocio, desde la creación de plantillas hasta la generación y firma de documentos. Las rutas se exponen a través de Express bajo el prefijo '/api/consentimientos'.

### Models

#### ConsentimientoPlantilla

nombre: String, descripcion: String, contenido: String (almacena el texto con variables como {{nombre_paciente}}), campos_variables: [String], activo: Boolean, fecha_creacion: Date

#### ConsentimientoPaciente

paciente: ObjectId (ref: 'Paciente'), odontologo: ObjectId (ref: 'Usuario'), plantilla_origen: ObjectId (ref: 'ConsentimientoPlantilla'), tratamiento: ObjectId (ref: 'Tratamiento', opcional), contenido_final: String (HTML/texto con datos rellenados), estado: String ('pendiente', 'firmado', 'revocado'), fecha_generacion: Date, fecha_firma: Date, firma_digital_url: String (URL al archivo en S3/GCS), hash_documento: String

### Controllers

#### ConsentimientoController

- crearPlantilla
- obtenerPlantillas
- actualizarPlantilla
- eliminarPlantilla
- generarConsentimiento
- firmarConsentimiento
- obtenerConsentimientoPorId
- obtenerConsentimientosPorPaciente

### Routes

#### `/api/consentimientos`

- GET /plantillas
- POST /plantillas
- PUT /plantillas/:id
- GET /paciente/:pacienteId
- POST /generar
- PUT /:id/firmar
- GET /:id

## 🔄 Flujos

1. Gestión de Plantillas: El odontólogo accede a la sección de plantillas, crea un nuevo consentimiento usando un editor de texto enriquecido, inserta variables (ej: {{paciente_nombre}}, {{tratamiento_descripcion}}), y lo guarda para uso futuro.
2. Generación de Consentimiento: El personal de recepción selecciona un paciente y un tratamiento programado. Elige la plantilla de consentimiento adecuada. El sistema genera un documento PDF o una vista previa con los datos del paciente y tratamiento ya cumplimentados.
3. Proceso de Firma: Se presenta el documento al paciente en una tablet. El paciente lee, aclara dudas y firma en el área designada. La firma se guarda digitalmente, el documento se sella con fecha y hora, y se almacena como un PDF inalterable en el historial del paciente.
4. Consulta y Auditoría: El odontólogo o la recepcionista buscan el historial de un paciente y pueden ver una lista de todos sus consentimientos firmados, con la opción de abrirlos o descargarlos en cualquier momento.

## 📝 User Stories

- Como odontólogo, quiero crear y editar plantillas de consentimientos informados para estandarizar la documentación y asegurar que se incluye toda la información legalmente requerida.
- Como personal de recepción, quiero generar rápidamente un consentimiento para un paciente a partir de una plantilla para que pueda firmarlo antes de pasar a la consulta.
- Como odontólogo, quiero que el paciente firme el consentimiento en una tablet para eliminar el papel, agilizar el proceso y almacenar el documento de forma segura y accesible.
- Como personal de recepción, quiero poder buscar y verificar fácilmente que un paciente ha firmado el consentimiento necesario para su tratamiento del día.
- Como odontólogo, quiero tener un registro histórico de todos los consentimientos firmados por un paciente para poder consultarlos en caso de cualquier auditoría o discrepancia.

## ⚙️ Notas Técnicas

- Seguridad y Validez Legal: La firma digital debe capturarse junto con metadatos como la fecha, hora y dirección IP. El documento PDF final debe ser sellado (hashing) para garantizar su integridad y no alteración. El almacenamiento debe ser encriptado (ej: AWS S3 con SSE).
- Firma Digital: Utilizar una librería como 'react-signature-canvas' en el frontend para capturar la firma como una imagen (Base64).
- Generación de PDF: Se recomienda la generación de PDF en el backend (usando librerías como 'Puppeteer' o 'pdfkit' en Node.js) para un mayor control sobre el formato y para incrustar la firma de forma segura, en lugar de hacerlo en el cliente.
- Editor de Plantillas: Implementar un editor de texto enriquecido (WYSIWYG) como 'TinyMCE' o 'Quill.js' para que la creación de plantillas sea intuitiva para el personal no técnico.
- Almacenamiento de Documentos: Los PDFs generados no deben almacenarse directamente en MongoDB. Es una mejor práctica subirlos a un servicio de almacenamiento de objetos (como AWS S3, Google Cloud Storage) y guardar solo la URL de acceso en el modelo 'ConsentimientoPaciente'.
- Auditoría: Implementar un registro de auditoría (logs) que rastree quién generó, quién firmó, cuándo y desde dónde se accedió a cada consentimiento para un cumplimiento normativo completo.

