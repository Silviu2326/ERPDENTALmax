# Endodoncia: Planificación

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'Endodoncia: Planificación' es una herramienta especializada dentro del ERP dental, diseñada para que los odontólogos puedan planificar de manera metódica y precisa los tratamientos de conducto radicular. Esta página se integra en el módulo 'Especialidades Clínicas', actuando como un subcomponente que se activa cuando se agrega un tratamiento de endodoncia al plan general del paciente. Su propósito principal es estandarizar el proceso de planificación, minimizando errores y creando un registro clínico y legal robusto. El sistema permite al profesional seleccionar el diente a tratar, visualizar radiografías asociadas, y registrar detalles cruciales como el diagnóstico pulpar y periapical, el número de conductos, la conductometría (longitud tentativa, instrumento apical maestro, longitud real de trabajo para cada conducto), la técnica de instrumentación (manual, rotatoria, reciprocante) y la técnica de obturación (condensación lateral, vertical, etc.). Esta planificación detallada no solo sirve como guía durante el procedimiento clínico, sino que también se almacena permanentemente en el historial del paciente, facilitando consultas futuras, interconsultas con otros especialistas y auditorías. Al centralizar esta información, el ERP mejora la calidad de la atención, la comunicación del equipo y la gestión de la documentación clínica.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

La feature se encuentra en la carpeta '/features/especialidades-clinicas/'. Esta carpeta agrupa todas las funcionalidades de especialidades. La página de 'Endodoncia: Planificación' se define en '/pages/'. Sus componentes reutilizables, como el selector de diente o el formulario de conductometría, residen en '/components/'. Las llamadas a la API para guardar o recuperar planes endodónticos se gestionan desde '/apis/'.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/PlanificacionEndodonciaPage.tsx`
- `/features/especialidades-clinicas/components/EndoPlanForm.tsx`
- `/features/especialidades-clinicas/components/DienteEndoSelector.tsx`
- `/features/especialidades-clinicas/components/ConductometriaInputGroup.tsx`
- `/features/especialidades-clinicas/apis/planEndodonciaApi.ts`

### Componentes React

- PlanificacionEndodonciaPage
- EndoPlanForm
- DienteEndoSelector
- ConductometriaInputGroup
- RadiografiaViewerModal
- HistorialPlanesEndoPaciente

## 🔌 APIs Backend

Las APIs gestionan el ciclo de vida de los planes de endodoncia. Permiten crear un nuevo plan asociado a un paciente y a un tratamiento específico, obtener todos los planes de un paciente, recuperar los detalles de un plan concreto para su visualización o edición, y actualizarlo.

### `POST` `/api/especialidades/endodoncia/planes`

Crea un nuevo plan de endodoncia para un paciente.

**Parámetros:** Body: { pacienteId, odontologoId, tratamientoId, diente, diagnostico, conductometria: [{...}], tecnicaInstrumentacion, tecnicaObturacion, notas }

**Respuesta:** JSON con el objeto del nuevo plan de endodoncia creado.

### `GET` `/api/especialidades/endodoncia/planes/paciente/:pacienteId`

Obtiene el historial de todos los planes de endodoncia para un paciente específico.

**Parámetros:** URL Param: pacienteId

**Respuesta:** JSON con un array de objetos de planes de endodoncia.

### `GET` `/api/especialidades/endodoncia/planes/:planId`

Obtiene los detalles de un plan de endodoncia específico por su ID.

**Parámetros:** URL Param: planId

**Respuesta:** JSON con el objeto del plan de endodoncia solicitado.

### `PUT` `/api/especialidades/endodoncia/planes/:planId`

Actualiza un plan de endodoncia existente.

**Parámetros:** URL Param: planId, Body: { ... campos a actualizar ... }

**Respuesta:** JSON con el objeto del plan de endodoncia actualizado.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se basa en el patrón MVC. El modelo 'PlanEndodoncia' define el esquema de datos en MongoDB. El 'PlanEndodonciaController' contiene la lógica para manejar las solicitudes (crear, leer, actualizar). Las rutas en Express conectan los endpoints HTTP con las funciones del controlador.

### Models

#### PlanEndodoncia

pacienteId: ObjectId, odontologoId: ObjectId, tratamientoId: ObjectId, fechaCreacion: Date, diente: Number, diagnosticoPulpar: String, diagnosticoPeriapical: String, conductometria: [{ nombreCanal: String, longitudTentativa: Number, limaReferencia: Number, longitudRealTrabajo: Number, instrumentoApicalMaestro: Number }], tecnicaInstrumentacion: String, tecnicaObturacion: String, medicacionIntraconducto: String, notas: String, estado: String ('Planificado', 'En Progreso', 'Finalizado')

### Controllers

#### PlanEndodonciaController

- crearPlanEndodoncia
- obtenerPlanesPorPaciente
- obtenerPlanPorId
- actualizarPlanEndodoncia

### Routes

#### `/api/especialidades/endodoncia/planes`

- POST /
- GET /paciente/:pacienteId
- GET /:planId
- PUT /:planId

## 🔄 Flujos

1. El odontólogo accede a la ficha del paciente y, desde su plan de tratamiento, hace clic en un procedimiento de endodoncia.
2. El sistema redirige a la página 'Endodoncia: Planificación', precargando el ID del paciente y el número del diente.
3. El odontólogo introduce el diagnóstico pulpar y periapical.
4. Para cada conducto, el odontólogo introduce su nombre (ej: MV, P), la longitud de trabajo estimada, el instrumento apical maestro y otros datos relevantes.
5. El odontólogo selecciona las técnicas de instrumentación y obturación de listas desplegables.
6. Añade notas clínicas si es necesario y guarda el plan. El sistema lo vincula al historial clínico del paciente.
7. El plan guardado puede ser consultado o editado en visitas posteriores a través del historial del paciente.

## 📝 User Stories

- Como odontólogo, quiero crear un plan de endodoncia digital para registrar con precisión la conductometría de cada conducto y tener una guía clara durante el tratamiento.
- Como odontólogo, quiero acceder al historial de planes de endodoncia de un paciente para revisar tratamientos anteriores y evaluar su evolución a largo plazo.
- Como odontólogo, quiero que la información de la planificación de endodoncia se guarde automáticamente en la ficha del paciente para mantener un registro clínico completo y centralizado.
- Como odontólogo, quiero poder modificar un plan de endodoncia existente si durante el tratamiento encuentro variaciones anatómicas no previstas en la radiografía inicial.

## ⚙️ Notas Técnicas

- Integración Crítica: Es fundamental una integración fluida con el módulo de Imagenología para permitir la visualización de radiografías digitales (DICOM/JPEG/PNG) directamente en la pantalla de planificación. Considerar el uso de librerías como 'Cornerstone.js' o similar para visores de imágenes médicas en el navegador.
- Seguridad de Datos: La información del plan es considerada Información de Salud Protegida (PHI). Se debe garantizar el cifrado de datos en tránsito (TLS/SSL) y en reposo. El acceso a esta funcionalidad debe estar estrictamente limitado mediante el sistema de roles y permisos.
- Usabilidad (UX/UI): La interfaz debe ser altamente visual. Un diagrama interactivo del diente seleccionado donde se puedan anotar los conductos mejoraría significativamente la experiencia de usuario. Usar autocompletado y valores por defecto para campos como 'técnica' o 'materiales' agilizará el proceso.
- Validación de Datos: Implementar validaciones tanto en el frontend como en el backend para asegurar que los datos numéricos (longitudes, calibres de instrumentos) estén dentro de rangos lógicos y evitar errores de ingreso.
- Estado del Plan: El campo 'estado' en el modelo es clave para el seguimiento del tratamiento. Permite filtrar y gestionar los planes que están pendientes, en ejecución o ya finalizados, lo cual es útil para reportes y gestión clínica.

