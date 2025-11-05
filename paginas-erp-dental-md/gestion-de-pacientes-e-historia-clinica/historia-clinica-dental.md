# Historia Clínica Dental

**Categoría:** Gestión Clínica | **Módulo:** Gestión de Pacientes e Historia Clínica

La página de 'Historia Clínica Dental' es el núcleo central de la información clínica de cada paciente dentro del ERP. Esta funcionalidad consolida en una única interfaz toda la información relevante sobre la salud bucodental de un paciente, sirviendo como el registro médico-legal principal. Su propósito es proporcionar a los profesionales de la clínica (odontólogos, higienistas, etc.) una visión completa, organizada y cronológica del estado del paciente, los diagnósticos realizados, los planes de tratamiento propuestos y ejecutados, y la evolución a lo largo del tiempo. Dentro del módulo padre 'Gestión de Pacientes e Historia Clínica', esta página es la contraparte clínica de la ficha de datos demográficos y administrativos del paciente. Mientras la ficha del paciente gestiona información de contacto y facturación, la historia clínica se enfoca exclusivamente en la salud. Funciona como un dashboard interactivo que se compone de varias secciones clave: anamnesis (historial médico general y dental, alergias, medicación), odontograma interactivo (un mapa visual de la dentición), periodontograma, planes de tratamiento, notas de evolución (SOAP), y un repositorio de documentos (radiografías, fotos, consentimientos). Esta centralización es vital para la toma de decisiones clínicas informadas, la continuidad de la atención y el cumplimiento normativo (LOPD/RGPD).

## 👥 Roles de Acceso

- Odontólogo
- Higienista
- Auxiliar / Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-pacientes-historia-clinica/`

La funcionalidad de la Historia Clínica Dental se encuentra dentro de la feature 'gestion-pacientes-historia-clinica'. La subcarpeta '/pages/' contiene la ruta principal, probablemente una ruta dinámica como '/pacientes/[pacienteId]/historia-clinica', que renderiza el componente principal de la historia. La subcarpeta '/components/' alberga todos los sub-componentes especializados que conforman la historia clínica, como el odontograma, el formulario de anamnesis, la tabla de tratamientos, etc. Esto permite una alta reutilización y mantenimiento. Finalmente, la subcarpeta '/apis/' contiene un archivo dedicado (ej: historiaClinicaApi.ts) que exporta funciones para realizar todas las llamadas a los endpoints del backend relacionados con la obtención y actualización de los datos de la historia clínica.

### Archivos Frontend

- `/features/gestion-pacientes-historia-clinica/pages/pacientes/[pacienteId]/historia-clinica/index.tsx`
- `/features/gestion-pacientes-historia-clinica/components/historia-clinica/LayoutHistoriaClinica.tsx`
- `/features/gestion-pacientes-historia-clinica/components/historia-clinica/OdontogramaInteractivo.tsx`
- `/features/gestion-pacientes-historia-clinica/components/historia-clinica/PeriodontogramaGrafico.tsx`
- `/features/gestion-pacientes-historia-clinica/components/historia-clinica/FormularioAnamnesis.tsx`
- `/features/gestion-pacientes-historia-clinica/components/historia-clinica/TablaPlanesTratamiento.tsx`
- `/features/gestion-pacientes-historia-clinica/components/historia-clinica/SeccionNotasEvolucion.tsx`
- `/features/gestion-pacientes-historia-clinica/components/historia-clinica/VisorDocumentosClinicos.tsx`
- `/features/gestion-pacientes-historia-clinica/apis/historiaClinicaApi.ts`

### Componentes React

- LayoutHistoriaClinica
- OdontogramaInteractivo
- PeriodontogramaGrafico
- FormularioAnamnesis
- TablaPlanesTratamiento
- SeccionNotasEvolucion
- VisorDocumentosClinicos
- EditorNotaSOAP

## 🔌 APIs Backend

Las APIs para la Historia Clínica están diseñadas para gestionar de forma granular cada sección de la historia de un paciente específico, permitiendo obtener el registro completo o actualizar partes individuales para mayor eficiencia. Todas las rutas están anidadas bajo el ID del paciente para seguir los principios RESTful.

### `GET` `/api/pacientes/:pacienteId/historia-clinica`

Obtiene el objeto completo de la historia clínica de un paciente, incluyendo anamnesis, odontograma, notas, etc.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Objeto JSON con la historia clínica completa del paciente.

### `PUT` `/api/pacientes/:pacienteId/historia-clinica/anamnesis`

Actualiza la sección de anamnesis de la historia clínica del paciente.

**Parámetros:** pacienteId (en la URL), Body: Objeto JSON con los datos de la anamnesis.

**Respuesta:** Objeto JSON con la sección de anamnesis actualizada.

### `PUT` `/api/pacientes/:pacienteId/historia-clinica/odontograma`

Guarda o actualiza el estado completo del odontograma del paciente.

**Parámetros:** pacienteId (en la URL), Body: Objeto JSON o Array de objetos que representa el estado de cada diente/superficie.

**Respuesta:** Objeto JSON con el estado del odontograma actualizado.

### `POST` `/api/pacientes/:pacienteId/historia-clinica/notas-evolucion`

Añade una nueva nota de evolución (formato SOAP) a la historia clínica.

**Parámetros:** pacienteId (en la URL), Body: Objeto JSON con el contenido de la nueva nota (fecha, profesional, texto S-O-A-P).

**Respuesta:** Objeto JSON con la nota de evolución recién creada.

### `GET` `/api/pacientes/:pacienteId/historia-clinica/documentos`

Obtiene la lista de documentos (radiografías, consentimientos) asociados a la historia del paciente.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Array de objetos, cada uno representando un documento con su metadata y URL de acceso.

### `POST` `/api/pacientes/:pacienteId/historia-clinica/documentos`

Sube un nuevo documento clínico asociado al paciente. La carga del archivo se manejaría con multipart/form-data.

**Parámetros:** pacienteId (en la URL), Body: FormData con el archivo y su metadata (tipo, descripción).

**Respuesta:** Objeto JSON con la metadata del documento recién subido.

## 🗂️ Estructura Backend (MERN)

En el backend, se define un modelo 'HistoriaClinica' en MongoDB que contiene todos los datos clínicos y está vinculado mediante una referencia al modelo 'Paciente'. Un controlador específico, 'HistoriaClinicaController', contiene la lógica de negocio para cada operación (obtener, actualizar, añadir). Las rutas se definen en un archivo separado, siguiendo una estructura RESTful anidada bajo la ruta de pacientes para una organización clara y lógica.

### Models

#### HistoriaClinica

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true, unique: true }, anamnesis: { antecedentesMedicos: String, alergias: [String], medicacionActual: String }, odontograma: { type: Object }, periodontograma: { type: Object }, notasEvolucion: [{ fecha: Date, profesional: { type: Schema.Types.ObjectId, ref: 'Usuario' }, subjetivo: String, objetivo: String, analisis: String, plan: String }], documentos: [{ nombreArchivo: String, url: String, tipo: String, fechaSubida: Date }]

#### Paciente

nombre: String, apellidos: String, fechaNacimiento: Date, genero: String, historiaClinica: { type: Schema.Types.ObjectId, ref: 'HistoriaClinica' }

### Controllers

#### HistoriaClinicaController

- getHistoriaClinicaByPacienteId
- updateAnamnesis
- updateOdontograma
- addNotaEvolucion
- uploadDocumento
- getDocumentos

### Routes

#### `/api/pacientes/:pacienteId/historia-clinica`

- GET /
- PUT /anamnesis
- PUT /odontograma
- POST /notas-evolucion
- GET /documentos
- POST /documentos

## 🔄 Flujos

1. El profesional de la salud accede a la ficha de un paciente y hace clic en la pestaña 'Historia Clínica'.
2. El frontend realiza una llamada GET a /api/pacientes/{id}/historia-clinica para cargar todos los datos clínicos.
3. El profesional actualiza los antecedentes en el formulario de anamnesis. Al guardar, se realiza una llamada PUT a /api/pacientes/{id}/historia-clinica/anamnesis.
4. Durante la exploración, el odontólogo hace clic en un diente en el Odontograma Interactivo y selecciona un hallazgo (ej: caries). El estado del componente se actualiza y al guardar se envía todo el objeto del odontograma vía PUT a /api/pacientes/{id}/historia-clinica/odontograma.
5. Al finalizar la cita, el profesional abre la sección de 'Notas de Evolución', redacta una nueva nota en formato SOAP y la guarda, lo que desencadena una llamada POST a /api/pacientes/{id}/historia-clinica/notas-evolucion.

## 📝 User Stories

- Como odontólogo, quiero ver el odontograma de un paciente de forma clara e interactiva para poder diagnosticar rápidamente el estado de cada pieza dental y planificar tratamientos.
- Como higienista, quiero registrar de forma sencilla las mediciones de sondaje en el periodontograma para monitorear la enfermedad periodontal de un paciente a lo largo del tiempo.
- Como auxiliar, quiero acceder rápidamente a la sección de anamnesis para verificar las alergias de un paciente antes de prepararle para un procedimiento.
- Como odontólogo, quiero añadir notas de evolución detalladas después de cada visita para mantener un registro médico-legal preciso y asegurar la continuidad de la atención.
- Como odontólogo, quiero poder subir y visualizar radiografías directamente en la historia clínica del paciente para tenerlas disponibles durante la consulta sin cambiar de sistema.

## ⚙️ Notas Técnicas

- Seguridad y Cumplimiento: La transmisión de datos clínicos debe ser siempre bajo HTTPS. La base de datos debe estar encriptada en reposo. Se deben implementar logs de auditoría para registrar quién accede y modifica cada historia clínica, en cumplimiento con normativas como LOPD/RGPD.
- Componente Odontograma: Para el odontograma interactivo, se recomienda el uso de una librería de gráficos vectoriales (SVG) como D3.js, Konva.js o Fabric.js integrada en un componente React. Esto permitirá una interacción fluida (clics, selecciones) y una representación visual personalizable.
- Almacenamiento de Archivos: Las radiografías y otros documentos no deben almacenarse como Blobs en MongoDB. Se debe utilizar un servicio de almacenamiento de objetos como AWS S3, Google Cloud Storage o similar. En la base de datos solo se guardará la URL y metadata del archivo.
- Rendimiento: Para historias clínicas con muchas notas de evolución o documentos, implementar paginación en el backend y carga infinita (infinite scrolling) o paginación en el frontend para mejorar los tiempos de carga inicial.
- Estado Global: Considerar el uso de una librería de gestión de estado como Redux Toolkit o Zustand para manejar los datos de la historia clínica en el frontend, facilitando la consistencia de los datos entre los diferentes sub-componentes.
- Actualizaciones Atómicas: Las actualizaciones de sub-documentos complejos como el odontograma deben ser atómicas para evitar inconsistencias. Las operaciones de actualización de MongoDB son generalmente atómicas a nivel de documento, lo cual es adecuado para este esquema.

