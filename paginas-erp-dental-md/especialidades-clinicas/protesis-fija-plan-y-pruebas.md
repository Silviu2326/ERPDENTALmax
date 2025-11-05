# Prótesis Fija: Plan y Pruebas

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'Prótesis Fija: Plan y Pruebas' es un componente esencial dentro del módulo de 'Especialidades Clínicas' del ERP dental. Está diseñada para gestionar de manera integral y digital todo el ciclo de vida de la fabricación y colocación de prótesis fijas (coronas, puentes, incrustaciones, etc.). Su propósito principal es estandarizar y centralizar la comunicación y el seguimiento entre el odontólogo y el laboratorio protésico, eliminando ambigüedades, reduciendo errores y optimizando los tiempos de entrega. Dentro del ERP, esta página actúa como un nexo digital que conecta la planificación clínica, realizada en el historial del paciente, con la ejecución técnica en el laboratorio. Permite al odontólogo crear una orden de trabajo detallada, especificando las piezas dentales involucradas (usando un odontograma interactivo), el tipo de prótesis, el material (zirconio, metal-porcelana, etc.), el color (guía VITA), y adjuntar archivos críticos como escaneos intraorales (STL), fotografías y radiografías. A su vez, el laboratorio recibe esta orden en tiempo real en su propio portal, con toda la información necesaria para iniciar la fabricación. La funcionalidad clave es el seguimiento por fases ('pruebas'), que permite registrar cada hito del proceso (prueba de metal, prueba de bizcocho, glaseado) con fechas, observaciones y feedback, creando un historial trazable y transparente que mejora la calidad del resultado final y la colaboración entre clínica y laboratorio.

## 👥 Roles de Acceso

- Odontólogo
- Protésico / Laboratorio

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad se encuentra dentro de la feature 'especialidades-clinicas'. La subcarpeta '/pages' contiene el componente principal de la página. La lógica de comunicación con el backend se encapsula en '/apis', que exporta funciones para crear, leer y actualizar los planes de prótesis. Los componentes reutilizables y específicos de esta página, como el formulario de planificación, el timeline de pruebas o el selector de dientes, se alojan en '/components' para mantener el código modular y organizado.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/ProtesisFijaPlanPruebasPage.tsx`
- `/features/especialidades-clinicas/components/FormularioPlanProtesis.tsx`
- `/features/especialidades-clinicas/components/TimelinePruebasProtesis.tsx`
- `/features/especialidades-clinicas/components/SelectorPiezasDentales.tsx`
- `/features/especialidades-clinicas/components/PanelComunicacionLaboratorio.tsx`
- `/features/especialidades-clinicas/apis/protesisFijaApi.ts`

### Componentes React

- ProtesisFijaPlanPruebasPage
- FormularioPlanProtesis
- TimelinePruebasProtesis
- SelectorPiezasDentales
- PanelComunicacionLaboratorio
- VisorArchivosAdjuntosProtesis

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan la creación, consulta y actualización de los planes de prótesis fija. Permiten un flujo de trabajo colaborativo entre el odontólogo y el laboratorio, manejando los estados de las pruebas, la comunicación y los archivos adjuntos.

### `POST` `/api/protesis-fija`

Crea un nuevo plan de prótesis fija para un paciente, asociándolo a un odontólogo y un laboratorio.

**Parámetros:** Body: { pacienteId, odontologoId, laboratorioId, tipoProtesis, material, color, piezasDentales, notasIniciales, archivosAdjuntos }

**Respuesta:** Objeto JSON con los datos del nuevo plan de prótesis creado.

### `GET` `/api/protesis-fija/paciente/:pacienteId`

Obtiene todos los planes de prótesis fija de un paciente específico.

**Parámetros:** URL Param: pacienteId

**Respuesta:** Array de objetos JSON, cada uno representando un plan de prótesis.

### `GET` `/api/protesis-fija/:id`

Obtiene los detalles completos de un plan de prótesis específico, incluyendo todas sus pruebas y comunicaciones.

**Parámetros:** URL Param: id (del plan de prótesis)

**Respuesta:** Objeto JSON con los detalles del plan de prótesis.

### `PUT` `/api/protesis-fija/:id/prueba`

Añade o actualiza una etapa de prueba (ej: 'Prueba de metal completada') en el plan de prótesis.

**Parámetros:** URL Param: id (del plan), Body: { tipoPrueba, fecha, resultado, observaciones, archivosAdjuntos }

**Respuesta:** Objeto JSON del plan de prótesis actualizado.

### `POST` `/api/protesis-fija/:id/comentarios`

Añade un mensaje o comentario en el hilo de comunicación entre la clínica y el laboratorio.

**Parámetros:** URL Param: id (del plan), Body: { autorId, rolAutor, mensaje, archivosAdjuntos }

**Respuesta:** Objeto JSON del plan de prótesis actualizado con el nuevo comentario.

### `GET` `/api/protesis-fija/laboratorio/:laboratorioId`

Obtiene todos los trabajos de prótesis asignados a un laboratorio, con opción de filtrar por estado.

**Parámetros:** URL Param: laboratorioId, Query Param: estado (opcional)

**Respuesta:** Array de objetos JSON con los trabajos del laboratorio.

## 🗂️ Estructura Backend (MERN)

En el backend, se define un modelo 'ProtesisFija' en MongoDB para almacenar toda la información del plan. Un 'ProtesisFijaController' contiene la lógica para manejar las operaciones CRUD y los flujos de trabajo específicos (actualizar pruebas, añadir comentarios). Las rutas se definen en un archivo dedicado que mapea los endpoints HTTP a las funciones del controlador, siguiendo los principios RESTful.

### Models

#### ProtesisFija

pacienteId (ObjectId), odontologoId (ObjectId), laboratorioId (ObjectId), fechaCreacion (Date), fechaEntregaPrevista (Date), tipoProtesis (String), material (String), color (String), piezasDentales (Array<Number>), estado (String: 'Planificación', 'En Laboratorio', 'Prueba Metal', 'Prueba Bizcocho', 'Completado', 'Cancelado'), pruebas (Array<Object>: { tipoPrueba, fecha, resultado, observaciones, archivos: [String] }), comunicacion (Array<Object>: { autorId, rol, mensaje, fecha, archivos: [String] }), archivosGenerales (Array<String>)

### Controllers

#### ProtesisFijaController

- crearPlanProtesis
- obtenerPlanesPorPaciente
- obtenerPlanPorId
- agregarOActualizarPrueba
- agregarComentario
- obtenerTrabajosPorLaboratorio

### Routes

#### `/api/protesis-fija`

- POST /
- GET /paciente/:pacienteId
- GET /laboratorio/:laboratorioId
- GET /:id
- PUT /:id/prueba
- POST /:id/comentarios

## 🔄 Flujos

1. El odontólogo, desde la ficha del paciente, inicia un nuevo plan de 'Prótesis Fija'.
2. Rellena el formulario especificando piezas dentales, material, color, laboratorio y adjunta archivos (escaneos, fotos).
3. El sistema crea el registro y notifica al laboratorio asignado sobre el nuevo trabajo.
4. El protésico accede a su panel, ve el nuevo trabajo, revisa los detalles y cambia el estado a 'En Laboratorio'.
5. Una vez lista la primera fase (ej. estructura metálica), el laboratorio la envía a la clínica y actualiza el estado a 'Prueba Metal'.
6. El odontólogo realiza la prueba en el paciente, y registra el resultado, comentarios y fotos en la sección 'Pruebas' del plan.
7. El laboratorio recibe una notificación con el feedback y procede con los ajustes o la siguiente fase.
8. Este ciclo se repite para todas las pruebas necesarias (bizcocho, etc.) hasta que el odontólogo marca la prótesis como 'Completado'.

## 📝 User Stories

- Como odontólogo, quiero crear un plan de prótesis fija detallado, incluyendo piezas, material, color y archivos adjuntos, para asegurar que el laboratorio tenga toda la información necesaria de una sola vez.
- Como odontólogo, quiero visualizar un timeline con el estado de cada prueba de la prótesis (metal, bizcocho) para saber en qué fase se encuentra el trabajo y planificar las citas del paciente.
- Como odontólogo, quiero registrar el resultado de cada prueba con notas y fotos directamente en el sistema para proporcionar un feedback claro y documentado al laboratorio.
- Como protésico, quiero recibir una notificación instantánea de nuevos trabajos de prótesis fija con todos los detalles y archivos para poder organizar mi producción eficientemente.
- Como protésico, quiero tener un panel donde pueda ver todos mis trabajos pendientes, en progreso y finalizados para gestionar mi carga de trabajo.
- Como protésico, quiero recibir el feedback de las pruebas realizadas por el odontólogo de forma estructurada para poder realizar los ajustes precisos y continuar con la siguiente fase de fabricación.

## ⚙️ Notas Técnicas

- Seguridad (RBAC): Es imperativo implementar un control de acceso basado en roles. El odontólogo solo debe acceder a los planes de sus pacientes. El protésico/laboratorio solo debe poder ver los trabajos que le han sido asignados, sin acceder a otros datos clínicos del paciente.
- Gestión de Archivos: Utilizar un servicio de almacenamiento en la nube (como AWS S3, Google Cloud Storage) para los archivos pesados (STL, imágenes de alta resolución). El modelo en MongoDB solo guardará las URLs o identificadores de estos archivos.
- Notificaciones en Tiempo Real: Implementar WebSockets (ej. Socket.io) para notificar en tiempo real al laboratorio de un nuevo trabajo o al odontólogo del resultado de una prueba. Esto es crucial para la comunicación fluida.
- Integración con Odontograma: El 'SelectorPiezasDentales' debe ser un componente interactivo que se integre con el odontograma general del paciente para una selección visual e intuitiva.
- Rendimiento: Para los laboratorios con un alto volumen de trabajo, la consulta de trabajos debe estar paginada e indexada por `laboratorioId` y `estado` en la base de datos para garantizar tiempos de carga rápidos.
- Visualizador 3D: Considerar la integración de una librería como 'three.js' o similar para permitir la visualización interactiva de archivos STL directamente en el navegador, mejorando la experiencia del protésico.

