# Cirugía Oral: Preoperatorio

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La página de 'Cirugía Oral: Preoperatorio' es una funcionalidad crítica dentro del módulo padre 'Especialidades Clínicas'. Su propósito fundamental es centralizar, estandarizar y gestionar toda la información y los preparativos necesarios antes de realizar un procedimiento de cirugía oral. Actúa como un dashboard interactivo y una checklist digital para el odontólogo especialista, garantizando que todos los protocolos de seguridad y requisitos clínicos se cumplan rigurosamente. Esta herramienta va más allá de un simple formulario; integra datos de múltiples áreas del ERP. Por ejemplo, extrae automáticamente información relevante de la historia clínica general del paciente, como alergias, medicación crónica y patologías sistémicas, presentándola de forma destacada para una rápida evaluación de riesgos. Permite la carga y visualización de estudios complementarios indispensables como radiografías, tomografías computarizadas (TAC/CBCT) y análisis de sangre. Además, gestiona la documentación legal, como el consentimiento informado, permitiendo subir el documento firmado y registrar la fecha. El odontólogo puede seguir una checklist personalizable para cada tipo de cirugía (implantes, extracciones de terceros molares, etc.), asegurando que no se omita ningún paso vital. Finalmente, facilita la comunicación con el paciente al permitir la redacción y entrega de indicaciones preoperatorias claras. Su integración en el ERP asegura que el estado preoperatorio ('Pendiente', 'Completo') sea visible en otras áreas, como la agenda de citas, alertando al personal si un paciente programado para cirugía no ha completado su preparación.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad reside dentro de la feature 'especialidades-clinicas'. La carpeta /pages contendrá el componente principal 'CirugiaOralPreoperatorioPage.tsx' que se renderiza en la ruta correspondiente. La carpeta /components albergará componentes reutilizables y específicos para esta página, como la checklist interactiva, el visor de documentos o el uploader de archivos. La carpeta /apis contendrá las funciones que realizan las llamadas a los endpoints del backend para obtener, crear y actualizar los datos preoperatorios.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/CirugiaOralPreoperatorioPage.tsx`
- `/features/especialidades-clinicas/components/PreoperatorioChecklist.tsx`
- `/features/especialidades-clinicas/components/ConsentimientoInformadoViewer.tsx`
- `/features/especialidades-clinicas/components/EstudiosComplementariosUploader.tsx`
- `/features/especialidades-clinicas/components/ResumenAnamnesisPreop.tsx`
- `/features/especialidades-clinicas/apis/cirugiaPreoperatorioApi.ts`

### Componentes React

- CirugiaOralPreoperatorioPage
- PreoperatorioChecklist
- ConsentimientoInformadoViewer
- EstudiosComplementariosUploader
- ResumenAnamnesisPreop
- IndicacionesPreoperatoriasEditor

## 🔌 APIs Backend

Las APIs para esta página se encargan de gestionar toda la data preoperatoria asociada a un tratamiento quirúrgico específico de un paciente. Permiten obtener el estado actual, actualizar la información, marcar ítems de la checklist como completados y subir archivos relevantes.

### `GET` `/api/especialidades/cirugia/preoperatorio/:tratamientoId`

Obtiene todos los datos del registro preoperatorio asociado a un ID de tratamiento específico.

**Parámetros:** tratamientoId (en la URL): ID del tratamiento quirúrgico planificado.

**Respuesta:** Un objeto JSON con toda la información del preoperatorio.

### `POST` `/api/especialidades/cirugia/preoperatorio`

Crea un nuevo registro preoperatorio para un tratamiento. Se invoca generalmente cuando se planifica la cirugía.

**Parámetros:** Body: { tratamientoId: string, pacienteId: string, plantillaChecklistId?: string }

**Respuesta:** El objeto JSON del nuevo registro preoperatorio creado.

### `PUT` `/api/especialidades/cirugia/preoperatorio/:preoperatorioId`

Actualiza la información general del registro preoperatorio, como las notas, el estado de la checklist o las indicaciones para el paciente.

**Parámetros:** preoperatorioId (en la URL): ID del registro preoperatorio a actualizar., Body: JSON con los campos a modificar (ej: checklistPreoperatorio, indicacionesPreoperatorias, estado).

**Respuesta:** El objeto JSON del registro preoperatorio actualizado.

### `POST` `/api/especialidades/cirugia/preoperatorio/:preoperatorioId/archivo`

Sube un archivo (analítica, imagen, consentimiento) y lo asocia al registro preoperatorio. Usa multipart/form-data.

**Parámetros:** preoperatorioId (en la URL): ID del registro preoperatorio., Body (FormData): { archivo: file, tipo: 'analitica' | 'imagen' | 'consentimiento' }

**Respuesta:** El objeto JSON del registro preoperatorio actualizado con la referencia al nuevo archivo.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se basa en un modelo 'CirugiaPreoperatorio' que almacena toda la información. Un controlador gestiona la lógica de negocio y las rutas de Express exponen esta lógica a través de una API RESTful.

### Models

#### CirugiaPreoperatorio

{
  tratamientoId: { type: Schema.Types.ObjectId, ref: 'Tratamiento', required: true, unique: true },
  pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true },
  historiaClinicaRelevante: String,
  analiticas: [{ nombre: String, urlArchivo: String, fechaCarga: Date }],
  estudiosImagen: [{ tipo: String, descripcion: String, urlArchivo: String, fechaCarga: Date }],
  consentimientoInformado: { firmado: Boolean, urlArchivo: String, fechaFirma: Date },
  checklist: [{ item: String, completado: Boolean, notas: String, fechaCompletado: Date }],
  indicacionesPreoperatorias: String,
  estado: { type: String, enum: ['Pendiente', 'En Progreso', 'Completo'], default: 'Pendiente' },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: Date
}

### Controllers

#### CirugiaPreoperatorioController

- getPreoperatorioByTratamientoId
- createPreoperatorio
- updatePreoperatorio
- uploadFileToPreoperatorio

### Routes

#### `/api/especialidades/cirugia/preoperatorio`

- GET /:tratamientoId
- POST /
- PUT /:preoperatorioId
- POST /:preoperatorioId/archivo

## 🔄 Flujos

1. El odontólogo planifica un tratamiento quirúrgico en el plan de tratamiento del paciente. El sistema crea automáticamente un registro 'CirugiaPreoperatorio' asociado.
2. Desde el plan de tratamiento o la cita en la agenda, el odontólogo accede a la página 'Cirugía Oral: Preoperatorio'.
3. La página carga los datos preoperatorios existentes, mostrando un resumen de la anamnesis del paciente y la checklist de tareas pendientes.
4. El odontólogo sube los estudios de imagen (ej. CBCT) y los resultados de las analíticas requeridas a través del componente 'EstudiosComplementariosUploader'.
5. El odontólogo revisa cada ítem de la checklist, marcándolo como completado. Puede añadir notas a cada punto.
6. Una vez que el paciente entrega el consentimiento informado firmado, el odontólogo lo escanea, lo sube y marca el ítem correspondiente.
7. Finalmente, redacta las indicaciones específicas para el paciente (ayuno, medicación preoperatoria) en el editor de texto enriquecido.
8. Cuando todos los ítems críticos de la checklist están completados, el estado del preoperatorio cambia a 'Completo', lo que se refleja con un indicador visual en la agenda.

## 📝 User Stories

- Como odontólogo, quiero ver un dashboard consolidado con toda la información preoperatoria para evaluar rápidamente la preparación de un paciente antes de una cirugía.
- Como odontólogo, quiero poder subir y asociar archivos de imagen y laboratorio directamente al registro preoperatorio para tener toda la documentación centralizada y accesible.
- Como odontólogo, quiero usar una checklist digital para seguir sistemáticamente todos los pasos pre-quirúrgicos y asegurar que no se omita nada importante.
- Como odontólogo, quiero confirmar digitalmente la recepción del consentimiento informado firmado para mantener un registro legal seguro y auditable.
- Como odontólogo, quiero redactar y guardar instrucciones preoperatorias personalizadas para el paciente, para poder imprimirlas o enviárselas digitalmente.

## ⚙️ Notas Técnicas

- Seguridad y Cumplimiento: La gestión de documentos (consentimientos, analíticas) debe cumplir con normativas de protección de datos como LOPD/GDPR/HIPAA. Los archivos deben almacenarse en un bucket seguro (ej. AWS S3 con encriptación) y el acceso debe ser estrictamente controlado.
- Integración de Módulos: Es crucial una fuerte integración con el módulo de 'Historia Clínica' para la sincronización de datos de anamnesis y con el de 'Agenda' para visualizar el estado de preparación preoperatoria directamente en la cita del paciente.
- Almacenamiento de Archivos: Implementar una estrategia robusta para el manejo de archivos. Utilizar un servicio de almacenamiento en la nube es preferible a almacenar blobs en MongoDB. Las rutas a los archivos se guardan en la base de datos.
- Rendimiento: Las imágenes y PDFs pueden ser pesados. Implementar carga diferida (lazy loading) y vistas previas en miniatura para no ralentizar la carga inicial de la página. Las subidas de archivos deben ser asíncronas con barras de progreso.
- Plantillas: Para mejorar la eficiencia, el sistema debería permitir la creación de plantillas de checklist preoperatorias para diferentes tipos de cirugías (implantes, cordales, etc.) que el odontólogo pueda seleccionar al crear un nuevo registro.

