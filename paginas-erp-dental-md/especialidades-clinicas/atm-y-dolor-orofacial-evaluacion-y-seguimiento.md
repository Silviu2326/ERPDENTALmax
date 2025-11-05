# ATM y Dolor Orofacial: Evaluación y Seguimiento

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'ATM y Dolor Orofacial: Evaluación y Seguimiento' es un componente especializado y crucial dentro del módulo de 'Especialidades Clínicas' del ERP dental. Está diseñada para proporcionar a los odontólogos una herramienta digital, estructurada y completa para el diagnóstico, tratamiento y monitoreo de los trastornos temporomandibulares (TTM) y otras condiciones de dolor orofacial. Este módulo reemplaza los formularios en papel y las notas dispersas con un registro clínico electrónico centralizado, estandarizado y dinámico. Su propósito principal es facilitar un enfoque metódico en la evaluación de casos complejos, guiando al profesional a través de secciones clave como la anamnesis (utilizando índices validados como el de Fonseca), un examen clínico detallado con diagramas interactivos para el mapeo del dolor muscular y articular, la medición de rangos de movimiento mandibular, y el registro de ruidos articulares. El sistema permite registrar diagnósticos basados en clasificaciones estándar (como el DC/TMD), formular planes de tratamiento personalizados y, fundamentalmente, realizar un seguimiento longitudinal de la evolución del paciente. A través de gráficos y tablas comparativas, el odontólogo puede visualizar la eficacia de las terapias aplicadas, ajustando el plan de tratamiento de manera informada y mejorando los resultados clínicos y la calidad de vida del paciente.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad se encuentra dentro de la carpeta del módulo padre '/features/especialidades-clinicas/'. La página principal, '/pages/AtmDolorOrofacialPage.tsx', actúa como el contenedor que gestiona el estado y la lógica para visualizar el historial y crear nuevas evaluaciones. Los componentes reutilizables, como formularios específicos ('/components/FormularioAnamnesisATM.tsx'), elementos interactivos ('/components/DiagramaMuscularInteractivo.tsx') y herramientas de visualización ('/components/GraficoEvolucionDolor.tsx'), se localizan en la subcarpeta '/components/'. Las llamadas a la API del backend para gestionar los datos de las evaluaciones se abstraen en un archivo específico dentro de '/apis/', como '/apis/atmApi.ts', promoviendo un código limpio y mantenible.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/AtmDolorOrofacialPage.tsx`
- `/features/especialidades-clinicas/components/FormularioAnamnesisATM.tsx`
- `/features/especialidades-clinicas/components/DiagramaMuscularInteractivo.tsx`
- `/features/especialidades-clinicas/components/TablaSeguimientoATM.tsx`
- `/features/especialidades-clinicas/components/GraficoEvolucionDolor.tsx`
- `/features/especialidades-clinicas/components/ModalRegistroMovimientoMandibular.tsx`
- `/features/especialidades-clinicas/apis/atmApi.ts`

### Componentes React

- FormularioAnamnesisATM
- DiagramaMuscularInteractivo
- TablaSeguimientoATM
- GraficoEvolucionDolor
- ModalRegistroMovimientoMandibular

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para los registros de evaluación de ATM y dolor orofacial, siempre asociadas a un paciente específico para mantener la integridad del historial clínico.

### `POST` `/api/pacientes/:pacienteId/atm-evaluaciones`

Crea un nuevo registro de evaluación de ATM y dolor orofacial para un paciente específico.

**Parámetros:** pacienteId (en URL), body (JSON con los datos de la evaluación)

**Respuesta:** El objeto de la nueva evaluación creada.

### `GET` `/api/pacientes/:pacienteId/atm-evaluaciones`

Obtiene todos los registros de evaluación de ATM para un paciente, ordenados por fecha.

**Parámetros:** pacienteId (en URL)

**Respuesta:** Un array de objetos de evaluación.

### `GET` `/api/atm-evaluaciones/:evaluacionId`

Obtiene los detalles completos de un registro de evaluación específico.

**Parámetros:** evaluacionId (en URL)

**Respuesta:** El objeto de la evaluación solicitada.

### `PUT` `/api/atm-evaluaciones/:evaluacionId`

Actualiza un registro de evaluación existente.

**Parámetros:** evaluacionId (en URL), body (JSON con los campos a actualizar)

**Respuesta:** El objeto de la evaluación actualizado.

## 🗂️ Estructura Backend (MERN)

La estructura del backend sigue el patrón MVC. El modelo 'AtmEvaluacion' define el esquema de datos en MongoDB. El 'AtmEvaluacionController' contiene la lógica de negocio para interactuar con la base de datos y procesar las solicitudes. Las rutas, definidas en un archivo dedicado, mapean los endpoints de la API a las funciones correspondientes en el controlador, asegurando una organización clara y escalable.

### Models

#### AtmEvaluacion

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true }, odontologo: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }, fechaEvaluacion: { type: Date, default: Date.now }, motivoConsulta: String, anamnesis: { indiceFonseca: Number, detalles: String }, examenClinico: { palpacionMuscular: [{ musculo: String, lado: String, dolor: Number }], ruidosArticulares: [{ tipo: String, lado: String }], rangosMovimiento: { aperturaSinDolor: Number, aperturaMaxima: Number, lateralidadDerecha: Number, lateralidadIzquierda: Number, protrusion: Number }, mapaDolor: { type: Object } }, diagnostico: [{ codigo: String, descripcion: String }], planTratamiento: String, notasSeguimiento: [{ fecha: Date, nota: String }]

### Controllers

#### AtmEvaluacionController

- crearEvaluacion
- obtenerEvaluacionesPorPaciente
- obtenerEvaluacionPorId
- actualizarEvaluacion

### Routes

#### `/api/atm-evaluaciones`

- GET /:evaluacionId
- PUT /:evaluacionId

#### `/api/pacientes/:pacienteId/atm-evaluaciones`

- POST /
- GET /

## 🔄 Flujos

1. El odontólogo accede al perfil de un paciente y navega a la sección 'Especialidades Clínicas'.
2. Selecciona la opción 'ATM y Dolor Orofacial', donde se muestra un listado de evaluaciones previas.
3. El odontólogo hace clic en 'Nueva Evaluación' para abrir el formulario digital.
4. Rellena las distintas secciones del formulario: anamnesis, examen clínico (marcando puntos en el diagrama muscular interactivo), diagnóstico y plan de tratamiento.
5. Al guardar, el sistema valida los datos y crea un nuevo registro en el historial del paciente.
6. Posteriormente, en la vista de seguimiento, el odontólogo puede comparar los datos de múltiples evaluaciones en una tabla o visualizar la evolución del nivel de dolor del paciente en un gráfico lineal.

## 📝 User Stories

- Como odontólogo, quiero registrar una evaluación completa de ATM y dolor orofacial para un paciente utilizando un formulario estandarizado, para asegurar un diagnóstico preciso y un registro completo.
- Como odontólogo, quiero visualizar el historial de evaluaciones de ATM de un paciente en una línea de tiempo o gráfico para monitorear la progresión de su condición y la efectividad del tratamiento.
- Como odontólogo, quiero utilizar un diagrama muscular y articular interactivo para marcar puntos gatillo y zonas de dolor, para tener un registro visual claro y preciso del examen clínico.
- Como odontólogo, quiero añadir notas de seguimiento en cada visita para documentar la evolución del paciente y los ajustes en el tratamiento.
- Como odontólogo, quiero generar un informe en PDF de la evaluación y seguimiento de ATM para compartirlo con otros especialistas o con el propio paciente.

## ⚙️ Notas Técnicas

- Seguridad y Cumplimiento: La información de esta funcionalidad es extremadamente sensible. Se debe garantizar el cumplimiento de normativas como HIPAA o LOPD, implementando cifrado de datos en reposo y en tránsito, y un robusto sistema de control de acceso basado en roles (RBAC).
- Rendimiento: Para el diagrama muscular interactivo, se puede utilizar una librería como D3.js o Fabric.js sobre un elemento SVG o Canvas para asegurar una buena performance y experiencia de usuario. Las consultas para obtener el historial deben estar indexadas por paciente y fecha.
- Interoperabilidad: Este módulo debe integrarse con el módulo de Imagenología para permitir la vinculación de radiografías, resonancias magnéticas o CBCT a una evaluación específica.
- Usabilidad: El formulario de evaluación debe ser diseñado en pestañas o pasos para no abrumar al usuario. Implementar autoguardado para evitar la pérdida de datos en sesiones largas.

