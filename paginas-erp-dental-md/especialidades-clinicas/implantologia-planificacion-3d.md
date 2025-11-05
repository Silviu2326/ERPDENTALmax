# Implantología: Planificación 3D

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'Implantología: Planificación 3D' es una herramienta avanzada y esencial dentro del módulo 'Especialidades Clínicas' del ERP dental. Su propósito principal es proporcionar a los odontólogos las capacidades para realizar una planificación de implantes dentales de alta precisión utilizando datos de Tomografía Computarizada de Haz Cónico (CBCT). Esta página permite la importación de archivos en formato DICOM, los cuales son procesados para generar una reconstrucción 3D interactiva de la anatomía maxilofacial del paciente. Sobre este modelo virtual, el profesional puede simular la colocación de implantes, eligiendo de una biblioteca digital el tamaño, tipo y marca más adecuados. Las herramientas integradas permiten realizar mediciones exactas, trazar estructuras anatómicas críticas como el nervio dentario inferior o el seno maxilar para evitar su lesión, y evaluar la calidad y cantidad de hueso disponible. Esta planificación digital no solo aumenta drásticamente la seguridad y predictibilidad del procedimiento quirúrgico, sino que también sirve como una potente herramienta de comunicación visual para que el paciente comprenda el tratamiento propuesto. Para el técnico de radiología, esta funcionalidad es el punto de entrada para cargar y validar los estudios de imagen, asegurando que los datos correctos estén asociados al paciente correcto. En resumen, esta página transforma datos radiográficos complejos en un plan de tratamiento tangible y seguro, integrando la implantología digital directamente en el flujo de trabajo clínico del ERP.

## 👥 Roles de Acceso

- Odontólogo
- Técnico de Radiología

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad se encuentra dentro del módulo padre 'especialidades-clinicas'. La lógica de la interfaz reside en '/pages/PlanificacionImplantologia3DPage.tsx', que orquesta varios componentes complejos desde '/components/'. Estos componentes incluyen el visor 3D, los paneles de herramientas y las librerías de implantes. Todas las interacciones con el backend, como la subida de archivos DICOM y el guardado de la planificación, se gestionan a través de funciones definidas en '/apis/planificacion3DApi.ts'.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/PlanificacionImplantologia3DPage.tsx`
- `/features/especialidades-clinicas/components/VisorDicom3D.tsx`
- `/features/especialidades-clinicas/components/PanelHerramientasPlanificacion.tsx`
- `/features/especialidades-clinicas/components/SelectorImplantesVirtuales.tsx`
- `/features/especialidades-clinicas/components/GestorCapasVisualizacion.tsx`
- `/features/especialidades-clinicas/apis/planificacion3DApi.ts`

### Componentes React

- VisorDicom3D
- PanelHerramientasPlanificacion
- SelectorImplantesVirtuales
- GestorCapasVisualizacion
- FormularioInformePlanificacion

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en el manejo de archivos DICOM, la gestión de sesiones de planificación 3D asociadas a un paciente y el acceso a una biblioteca de implantes virtuales. Requieren endpoints capaces de manejar subidas de archivos de gran tamaño y de persistir datos complejos de planificación (coordenadas, rotaciones, etc.).

### `POST` `/api/pacientes/:pacienteId/planificaciones-3d`

Inicia una nueva sesión de planificación y sube el conjunto de archivos DICOM asociados. Debe manejar 'multipart/form-data'.

**Parámetros:** pacienteId (en la URL), archivosDicom (en el body, como archivos), descripcion (en el body)

**Respuesta:** El objeto de la nueva planificación creada, incluyendo su ID y el estado del procesamiento de los archivos.

### `GET` `/api/pacientes/:pacienteId/planificaciones-3d`

Obtiene una lista de todas las sesiones de planificación 3D para un paciente específico.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Un array de objetos de planificación 3D.

### `GET` `/api/planificaciones-3d/:planId`

Obtiene los detalles completos de una sesión de planificación específica, incluyendo los datos guardados (implantes, mediciones) y las rutas a los modelos 3D procesados.

**Parámetros:** planId (en la URL)

**Respuesta:** Un objeto detallado de la planificación 3D.

### `PUT` `/api/planificaciones-3d/:planId`

Guarda o actualiza el estado de una planificación 3D, incluyendo la posición de los implantes, mediciones, notas y trazado de nervios.

**Parámetros:** planId (en la URL), datosPlanificacion (en el body, objeto JSON con toda la información de la planificación)

**Respuesta:** El objeto de la planificación actualizado.

### `GET` `/api/biblioteca/implantes-virtuales`

Obtiene la lista de implantes virtuales disponibles en la biblioteca del sistema.

**Parámetros:** marca (opcional, query param), diametro (opcional, query param)

**Respuesta:** Un array de objetos de implantes virtuales.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con modelos específicos para las planificaciones 3D y la biblioteca de implantes. Los controladores gestionan la lógica de negocio, incluyendo el procesamiento de archivos DICOM (que puede ser una tarea pesada delegada a un servicio en segundo plano) y la manipulación de los datos de planificación. Las rutas exponen estos servicios de forma segura y RESTful.

### Models

#### PlanificacionImplantologia3D

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }, fechaCreacion: { type: Date, default: Date.now }, descripcion: String, estadoProcesamiento: { type: String, enum: ['pendiente', 'procesando', 'completado', 'error'] }, archivosDicomPaths: [String], modeloProcesadoPath: String, datosPlanificacion: { implantes: [{ implanteVirtualId: Schema.Types.ObjectId, posicion: {x,y,z}, rotacion: {x,y,z} }], mediciones: [Object], trazadoNervios: [Object], notas: String }

#### ImplanteVirtual

marca: String, sistema: String, modelo: String, longitud: Number, diametro: Number, tipoConexion: String, archivoModelo3DPath: String

### Controllers

#### Planificacion3DController

- crearPlanificacion
- obtenerPlanificacionesPorPaciente
- obtenerPlanificacionPorId
- actualizarPlanificacion

#### BibliotecaImplantesController

- obtenerTodosLosImplantes

### Routes

#### `/api`

- POST /pacientes/:pacienteId/planificaciones-3d
- GET /pacientes/:pacienteId/planificaciones-3d
- GET /planificaciones-3d/:planId
- PUT /planificaciones-3d/:planId
- GET /biblioteca/implantes-virtuales

## 🔄 Flujos

1. El Técnico de Radiología accede a la ficha del paciente, va a la sección 'Planificación 3D' y crea una nueva planificación, subiendo los archivos DICOM del último CBCT.
2. El sistema procesa los archivos en segundo plano. Una vez completado, notifica al Odontólogo.
3. El Odontólogo abre la planificación, que carga el modelo 3D del paciente en el visor.
4. El Odontólogo utiliza las herramientas para medir el hueso, trazar el nervio dentario y explorar la anatomía.
5. Abre la biblioteca de implantes, filtra por marca y tamaño, y selecciona el implante adecuado.
6. Coloca el implante virtual en la posición deseada, ajustando su angulación y profundidad con precisión milimétrica.
7. Añade notas y guarda el progreso de la planificación.
8. Finalmente, presenta el plan al paciente usando el visor 3D para una mejor comprensión y aceptación del tratamiento.

## 📝 User Stories

- Como Odontólogo, quiero subir un estudio CBCT de un paciente para generar un modelo 3D y planificar la colocación de implantes de forma segura y predecible.
- Como Odontólogo, quiero acceder a una biblioteca digital de implantes para seleccionar el más adecuado y simular su colocación en el hueso del paciente.
- Como Odontólogo, quiero trazar el recorrido del nervio dentario inferior en el modelo 3D para asegurar que los implantes se coloquen a una distancia segura.
- Como Odontólogo, quiero guardar mi planificación digital, incluyendo la posición exacta de los implantes y mis anotaciones, para consultarla durante la cirugía o para encargar una guía quirúrgica.
- Como Técnico de Radiología, quiero una interfaz clara para subir los archivos DICOM de un paciente y asociarlos correctamente a su historial clínico en el ERP.

## ⚙️ Notas Técnicas

- **Integración de Visor 3D:** Se debe integrar una librería de renderizado 3D especializada en datos médicos, como VTK.js o una solución comercial (ej. OHIF, Cornerstone3D), que soporte la reconstrucción volumétrica a partir de series DICOM.
- **Procesamiento Backend:** El procesamiento de DICOM para generar mallas 3D (ej. usando algoritmos como Marching Cubes) es computacionalmente intensivo. Se debe implementar en un servicio de worker o una función serverless para no bloquear la API principal. Se recomienda el uso de librerías como ITK.js o Python con SimpleITK en el backend.
- **Almacenamiento de Archivos:** Los archivos DICOM y los modelos 3D resultantes son grandes. Se debe utilizar un servicio de almacenamiento de objetos como AWS S3, Google Cloud Storage o Azure Blob Storage, en lugar del sistema de archivos del servidor.
- **Seguridad y Cumplimiento (HIPAA/GDPR):** Los datos DICOM son información médica protegida. Todo el almacenamiento y la transmisión deben estar cifrados. El acceso a los datos debe estar estrictamente controlado por roles y auditado.
- **Rendimiento en el Cliente:** La interactividad del visor 3D requiere una GPU en el cliente. El rendimiento debe ser optimizado mediante técnicas de renderizado eficientes y la posible simplificación de mallas para una navegación fluida.

