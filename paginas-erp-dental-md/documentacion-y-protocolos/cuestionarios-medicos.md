# Cuestionarios Médicos

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad de 'Cuestionarios Médicos' es un componente esencial dentro del módulo 'Documentación y Protocolos' del ERP dental. Su propósito principal es digitalizar y estandarizar la recopilación de información clínica vital del paciente, como su historial médico, alergias, medicaciones actuales, y condiciones preexistentes. Esta herramienta permite a la clínica crear plantillas de cuestionarios personalizadas (anamnesis) que pueden ser asignadas a los pacientes para que las completen de forma digital, ya sea en la propia clínica a través de una tablet o de forma remota a través de un portal del paciente. Al centralizar esta información, se mejora drásticamente la seguridad del paciente, ya que el odontólogo tiene acceso inmediato a datos críticos que pueden influir en la planificación y ejecución de los tratamientos. Funciona como el primer filtro de seguridad clínica, identificando posibles contraindicaciones o riesgos. Dentro de su módulo padre, este sistema se integra con la ficha del paciente, adjuntando cada cuestionario completado a su historial documental. Además, automatiza la generación de alertas médicas visibles en otras partes del sistema (como la agenda o la ficha clínica) basadas en las respuestas del paciente, asegurando que todo el personal clínico esté al tanto de las condiciones importantes del paciente en todo momento. Esta digitalización elimina el papeleo, reduce errores de transcripción y garantiza el cumplimiento de normativas de protección de datos como LOPD o HIPAA.

## 👥 Roles de Acceso

- Odontólogo
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Esta funcionalidad se encuentra dentro de la carpeta de feature 'documentacion-protocolos'. La subcarpeta '/pages' contiene las vistas principales: una para la gestión de plantillas de cuestionarios ('EditorPlantillaCuestionarioPage.tsx') y otra para la visualización y asignación de cuestionarios a pacientes ('CuestionariosMedicosPage.tsx'). En '/components' se alojan los componentes reutilizables como el constructor de formularios ('ConstructorPreguntasForm'), la lista de plantillas ('ListaPlantillasCuestionario'), el visor de respuestas ('VisorCuestionarioCompletado') y el modal de asignación ('ModalAsignarCuestionario'). Finalmente, la carpeta '/apis' contiene las funciones que encapsulan las llamadas a la API del backend para gestionar plantillas y respuestas de pacientes.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/CuestionariosMedicosPage.tsx`
- `/features/documentacion-protocolos/pages/EditorPlantillaCuestionarioPage.tsx`
- `/features/documentacion-protocolos/pages/RellenarCuestionarioPacientePage.tsx`

### Componentes React

- ListaPlantillasCuestionario
- ConstructorPreguntasForm
- VisorCuestionarioCompletado
- ModalAsignarCuestionario
- FormularioCuestionarioPaciente
- AlertaMedicaBadge

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan dos recursos principales: las plantillas de cuestionarios (CuestionarioPlantilla) y los cuestionarios asignados y respondidos por los pacientes (CuestionarioPaciente). Proporcionan operaciones CRUD completas para las plantillas y endpoints específicos para asignar, rellenar y consultar los cuestionarios de cada paciente.

### `GET` `/api/cuestionarios/plantillas`

Obtiene una lista de todas las plantillas de cuestionarios médicos disponibles en la clínica.

**Respuesta:** Un array de objetos CuestionarioPlantilla.

### `POST` `/api/cuestionarios/plantillas`

Crea una nueva plantilla de cuestionario médico.

**Parámetros:** body: { nombre: string, descripcion: string, preguntas: array }

**Respuesta:** El objeto CuestionarioPlantilla recién creado.

### `PUT` `/api/cuestionarios/plantillas/:plantillaId`

Actualiza una plantilla de cuestionario existente.

**Parámetros:** path: plantillaId, body: { ... campos a actualizar ... }

**Respuesta:** El objeto CuestionarioPlantilla actualizado.

### `GET` `/api/cuestionarios/paciente/:pacienteId`

Obtiene todos los cuestionarios (pendientes y completados) de un paciente específico.

**Parámetros:** path: pacienteId

**Respuesta:** Un array de objetos CuestionarioPaciente.

### `POST` `/api/cuestionarios/asignar`

Asigna una plantilla de cuestionario a un paciente, creando una nueva instancia de CuestionarioPaciente para ser rellenada.

**Parámetros:** body: { pacienteId: string, plantillaId: string }

**Respuesta:** El nuevo objeto CuestionarioPaciente creado con estado 'pendiente'.

### `PUT` `/api/cuestionarios/respuestas/:cuestionarioPacienteId`

Guarda o actualiza las respuestas de un paciente a un cuestionario asignado.

**Parámetros:** path: cuestionarioPacienteId, body: { respuestas: array, estado: 'completado' }

**Respuesta:** El objeto CuestionarioPaciente actualizado con las respuestas.

## 🗂️ Estructura Backend (MERN)

El backend utiliza dos modelos de MongoDB: 'CuestionarioPlantilla' para definir la estructura de los cuestionarios y 'CuestionarioPaciente' para almacenar las respuestas de cada paciente. Los controladores ('CuestionarioPlantillaController', 'CuestionarioPacienteController') contienen la lógica de negocio para gestionar estos modelos. Las rutas, definidas en archivos separados, exponen los endpoints de la API de manera organizada y RESTful.

### Models

#### CuestionarioPlantilla

nombre: String, descripcion: String, preguntas: [{ texto: String, tipo: String ('texto_corto', 'opcion_unica', 'opcion_multiple', 'si_no'), opciones: [String], es_alerta: Boolean, requerido: Boolean }]

#### CuestionarioPaciente

paciente: ObjectId (ref: 'Paciente'), plantilla: ObjectId (ref: 'CuestionarioPlantilla'), estado: String ('pendiente', 'completado'), fechaAsignacion: Date, fechaCompletado: Date, respuestas: [{ preguntaId: ObjectId, valor: String }], firmaProfesional: String

### Controllers

#### CuestionarioPlantillaController

- crearPlantilla
- obtenerTodasLasPlantillas
- obtenerPlantillaPorId
- actualizarPlantilla
- eliminarPlantilla

#### CuestionarioPacienteController

- asignarCuestionarioAPaciente
- obtenerCuestionariosPorPaciente
- guardarRespuestasDePaciente
- obtenerCuestionarioPacientePorId

### Routes

#### `/api/cuestionarios/plantillas`

- GET /
- POST /
- GET /:plantillaId
- PUT /:plantillaId
- DELETE /:plantillaId

#### `/api/cuestionarios`

- GET /paciente/:pacienteId
- POST /asignar
- PUT /respuestas/:cuestionarioPacienteId
- GET /respuestas/:cuestionarioPacienteId

## 🔄 Flujos

1. Creación de Plantilla: El odontólogo accede a la gestión de cuestionarios, crea una nueva plantilla, añade preguntas de diversos tipos (texto, sí/no, opción múltiple) y marca cuáles generan alertas médicas, y guarda la plantilla.
2. Asignación de Cuestionario: El personal de recepción, al dar de alta a un nuevo paciente o antes de una cita, selecciona al paciente, elige una plantilla de cuestionario médico y se la asigna. El sistema genera un cuestionario pendiente para ese paciente.
3. Cumplimentación por el Paciente: El paciente recibe un enlace o se le proporciona una tablet en la clínica. Accede a su cuestionario pendiente, responde a todas las preguntas y envía el formulario.
4. Revisión y Alertas: El odontólogo recibe una notificación o ve en la ficha del paciente que el cuestionario ha sido completado. Lo revisa y el sistema resalta automáticamente las respuestas que fueron marcadas como alertas (ej. alergia a la penicilina). Esta alerta se hace visible en el perfil del paciente.

## 📝 User Stories

- Como odontólogo, quiero crear y modificar plantillas de cuestionarios médicos para poder recopilar la información clínica más relevante según los tipos de tratamiento que ofrezco.
- Como odontólogo, quiero revisar de forma rápida y clara las respuestas de un paciente a su cuestionario médico antes de una intervención para identificar cualquier riesgo o condición preexistente.
- Como personal de recepción, quiero asignar fácilmente un cuestionario de salud a un paciente nuevo durante su registro para agilizar el proceso de primera visita.
- Como personal de recepción, quiero poder ver si un paciente tiene cuestionarios pendientes de completar para recordárselo al momento del check-in en su cita.
- Como odontólogo, quiero que el sistema me alerte visualmente en la ficha del paciente si ha respondido afirmativamente a preguntas críticas (ej. problemas cardíacos, alergias) para garantizar su seguridad.

## ⚙️ Notas Técnicas

- Seguridad (LOPD/HIPAA): Los datos de los cuestionarios son información médica sensible. Es imperativo encriptar los datos tanto en tránsito (HTTPS) como en reposo (encriptación a nivel de base de datos en MongoDB Atlas). El acceso a esta información debe estar estrictamente controlado por roles.
- Constructor de Formularios: Para la creación de plantillas, se recomienda usar una librería de React como 'react-dnd' (para drag and drop de preguntas) junto con 'react-hook-form' para gestionar la lógica del formulario de manera eficiente.
- Versioning de Plantillas: Es crucial implementar un sistema de versionado. Cuando se asigna un cuestionario a un paciente, se debe guardar una 'copia' o referencia a la versión específica de la plantilla en ese momento para evitar que futuras ediciones de la plantilla alteren los cuestionarios ya completados.
- Generación de PDF: Implementar una funcionalidad para exportar el cuestionario completado a un formato PDF. Librerías como 'jspdf' y 'html2canvas' en el frontend, o 'puppeteer' en el backend, pueden ser utilizadas para este fin.
- Firma Digital: Considerar la integración de una librería de firma digital simple (ej. 'react-signature-canvas') para que tanto el paciente como el profesional puedan firmar el documento, añadiendo validez legal al registro.

