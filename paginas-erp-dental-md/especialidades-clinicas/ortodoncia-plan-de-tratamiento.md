# Ortodoncia: Plan de Tratamiento

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'Ortodoncia: Plan de Tratamiento' es una herramienta especializada dentro del módulo 'Especialidades Clínicas' del ERP dental. Está diseñada para que los ortodoncistas y odontólogos puedan documentar, planificar y gestionar de manera integral los tratamientos de ortodoncia de sus pacientes. A diferencia de un plan de tratamiento general, esta sección ofrece campos y herramientas específicas para la ortodoncia, como el análisis cefalométrico, el estudio fotográfico, la planificación por fases y la selección de aparatología específica (brackets, alineadores, etc.). Su propósito principal es centralizar toda la información diagnóstica y de planificación en un único registro digital, facilitando la toma de decisiones clínicas, la comunicación con el paciente y el seguimiento del progreso a lo largo del tiempo. Funciona como el núcleo estratégico para cualquier caso de ortodoncia, permitiendo al profesional establecer un diagnóstico preciso (esquelético, dental y facial), definir objetivos claros, secuenciar las etapas del tratamiento con duraciones estimadas y asociar un presupuesto. Esta funcionalidad se integra directamente con la ficha del paciente, el módulo de presupuestos y la agenda, creando un flujo de trabajo cohesivo desde el diagnóstico hasta la finalización del tratamiento.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

La feature se encuentra en la carpeta '/features/especialidades-clinicas/', que agrupa todas las funcionalidades de especialidades. La página 'Ortodoncia: Plan de Tratamiento' se define en '/pages'. Esta página utiliza componentes reutilizables y específicos de '/components/' (formularios de diagnóstico, visores de imágenes, planificadores de fases). Las interacciones con el backend se gestionan a través de funciones definidas en '/apis/', que encapsulan las llamadas a la API RESTful.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/PlanTratamientoOrtodonciaPage.tsx`
- `/features/especialidades-clinicas/pages/DetallePlanTratamientoOrtodonciaPage.tsx/[planId]`

### Componentes React

- FormularioDiagnosticoOrtodoncico
- VisorEstudiosCefalometricos
- GaleriaEstudioFotografico
- PlanificadorFasesTratamiento
- SelectorAparatologiaOrtodoncica
- ResumenFinancieroPlanOrto
- TimelineProgresoTratamiento

## 🔌 APIs Backend

Las APIs gestionan la creación, lectura, actualización y eliminación (CRUD) de los planes de tratamiento de ortodoncia. Incluyen endpoints para manejar el plan en su totalidad, así como para gestionar los archivos de diagnóstico asociados (radiografías, fotos).

### `POST` `/api/ortodoncia/planes-tratamiento`

Crea un nuevo plan de tratamiento de ortodoncia para un paciente.

**Parámetros:** Body: { pacienteId: string, odontologoId: string, diagnostico: object, objetivos: string[], fases: object[] }

**Respuesta:** JSON con el objeto del nuevo plan de tratamiento creado.

### `GET` `/api/ortodoncia/planes-tratamiento/paciente/:pacienteId`

Obtiene todos los planes de tratamiento de ortodoncia de un paciente específico.

**Parámetros:** URL Param: pacienteId

**Respuesta:** JSON con un array de objetos de planes de tratamiento.

### `GET` `/api/ortodoncia/planes-tratamiento/:planId`

Obtiene los detalles completos de un plan de tratamiento específico.

**Parámetros:** URL Param: planId

**Respuesta:** JSON con el objeto del plan de tratamiento solicitado.

### `PUT` `/api/ortodoncia/planes-tratamiento/:planId`

Actualiza un plan de tratamiento de ortodoncia existente.

**Parámetros:** URL Param: planId, Body: { ...campos a actualizar... }

**Respuesta:** JSON con el objeto del plan de tratamiento actualizado.

### `POST` `/api/ortodoncia/planes-tratamiento/:planId/archivos`

Sube archivos de diagnóstico (fotos, radiografías) y los asocia a un plan.

**Parámetros:** URL Param: planId, Body: FormData con los archivos

**Respuesta:** JSON con las URLs de los archivos subidos y el plan actualizado.

## 🗂️ Estructura Backend (MERN)

La estructura del backend para esta funcionalidad se basa en un modelo MongoDB para almacenar los datos del plan, un controlador para la lógica de negocio y rutas Express para exponer los endpoints de la API.

### Models

#### PlanTratamientoOrtodoncia

paciente: { type: ObjectId, ref: 'Paciente' }, odontologo: { type: ObjectId, ref: 'Usuario' }, fechaCreacion: { type: Date, default: Date.now }, estado: { type: String, enum: ['Propuesto', 'Aceptado', 'En Progreso', 'Finalizado', 'Rechazado'] }, diagnostico: { claseEsqueletal: String, patronFacial: String, analisisDental: String, resumen: String }, objetivosTratamiento: [String], fases: [{ nombre: String, descripcion: String, aparatologia: String, duracionEstimadaMeses: Number, citasRequeridas: Number }], estudios: { fotos: [{ url: String, descripcion: String }], radiografias: [{ url: String, tipo: String }], cefalometria: [{ medida: String, valor: String, norma: String }] }, presupuestoId: { type: ObjectId, ref: 'Presupuesto' }, notas: String

### Controllers

#### PlanTratamientoOrtodonciaController

- crearPlanTratamiento
- obtenerPlanesPorPaciente
- obtenerPlanPorId
- actualizarPlanTratamiento
- eliminarPlanTratamiento
- adjuntarArchivosDiagnostico

### Routes

#### `/api/ortodoncia/planes-tratamiento`

- POST /
- GET /paciente/:pacienteId
- GET /:planId
- PUT /:planId
- POST /:planId/archivos

## 🔄 Flujos

1. El odontólogo accede a la ficha de un paciente y navega a la sección 'Especialidades Clínicas > Ortodoncia'.
2. El sistema muestra una lista de planes de tratamiento existentes o la opción para crear uno nuevo.
3. Al crear un nuevo plan, el odontólogo completa el formulario de diagnóstico, carga las imágenes de los estudios (fotos, radiografías) y define los objetivos.
4. El profesional estructura el tratamiento en fases, especificando la aparatología, duración y citas para cada una.
5. El sistema guarda el plan en estado 'Propuesto' y lo vincula con el módulo de presupuestos para la aprobación del paciente.
6. Una vez aprobado por el paciente, el odontólogo cambia el estado del plan a 'Aceptado' y puede comenzar a programar las citas correspondientes a la primera fase.
7. Durante el tratamiento, el odontólogo actualiza el plan con notas de progreso y nuevas imágenes.

## 📝 User Stories

- Como odontólogo, quiero crear un plan de tratamiento de ortodoncia detallado, incluyendo diagnóstico, objetivos y fases, para tener una hoja de ruta clara para cada caso.
- Como odontólogo, quiero subir y visualizar fácilmente las fotografías intraorales, extraorales y radiografías cefalométricas directamente en el plan de tratamiento para un análisis completo.
- Como odontólogo, quiero definir múltiples fases de tratamiento con su aparatología y duración estimada para poder explicar al paciente el proceso completo y su cronograma.
- Como odontólogo, quiero poder modificar un plan de tratamiento en curso para adaptarlo a la evolución clínica del paciente.
- Como odontólogo, quiero ver un historial de todos los planes de tratamiento de un paciente para consultar casos anteriores o comparar propuestas.

## ⚙️ Notas Técnicas

- Seguridad: Implementar control de acceso estricto basado en roles para asegurar que solo los odontólogos autorizados puedan crear o modificar planes. Los datos del paciente deben ser encriptados en tránsito y en reposo.
- Rendimiento: Optimizar la carga de imágenes utilizando formatos de imagen modernos (ej. WebP) y carga diferida (lazy loading). La subida de archivos grandes debe manejarse de forma asíncrona para no bloquear la interfaz de usuario.
- Integraciones: Es fundamental una integración bidireccional con el módulo de 'Presupuestos' para generar y vincular la propuesta económica. También debe integrarse con 'Agenda' para facilitar la programación de las citas definidas en las fases del plan.
- Almacenamiento de Archivos: Utilizar un servicio de almacenamiento de objetos en la nube como AWS S3 o Google Cloud Storage para gestionar los archivos de diagnóstico de forma segura y escalable, en lugar de almacenarlos en la base de datos.
- UI/UX: Considerar un componente de visualización de línea de tiempo (timeline) para mostrar las fases del tratamiento de una manera gráfica e intuitiva tanto para el profesional como para el paciente.

