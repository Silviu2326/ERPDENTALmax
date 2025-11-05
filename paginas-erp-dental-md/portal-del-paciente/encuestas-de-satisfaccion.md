# Encuestas de Satisfacción

**Categoría:** Portal del Paciente | **Módulo:** Portal del Paciente

La funcionalidad 'Encuestas de Satisfacción' es una herramienta estratégica dentro del ERP dental, diseñada para medir y analizar la experiencia del paciente. Integrada directamente en el 'Portal del Paciente', permite a la clínica recopilar feedback valioso de forma automatizada y estructurada después de una cita. Para el paciente, se manifiesta como una notificación o una sección en su portal personal, invitándolo a calificar su visita reciente, el trato del personal, la claridad de las explicaciones del odontólogo, la limpieza de las instalaciones, y otros aspectos personalizables. El proceso es rápido y accesible, fomentando una alta tasa de participación. Para la clínica, específicamente para los roles de Marketing y CRM, esta funcionalidad es un centro de control completo. Permite la creación de plantillas de encuestas dinámicas con diferentes tipos de preguntas (calificación por estrellas, opción múltiple, respuestas abiertas). Más importante aún, ofrece un dashboard de análisis de resultados, donde los datos agregados se presentan en gráficos interactivos, nubes de palabras y métricas clave. Esto transforma las opiniones subjetivas en datos cuantitativos y cualitativos, permitiendo a la gerencia identificar tendencias, detectar áreas de mejora, reconocer al personal con mejor desempeño y, en última instancia, tomar decisiones basadas en datos para mejorar la calidad del servicio y la lealtad del paciente. Su integración en el portal asegura que el feedback se solicite en el momento oportuno, maximizando la relevancia y la precisión de las respuestas.

## 👥 Roles de Acceso

- Paciente (Portal)
- Marketing / CRM

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-paciente/`

Esta funcionalidad reside dentro del módulo 'portal-paciente'. La subcarpeta /pages contiene las vistas principales: una para que el paciente responda la encuesta (ResponderEncuestaPage.tsx), y otras para la administración (GestionEncuestasPage.tsx, ResultadosEncuestaPage.tsx). La carpeta /components alberga elementos reutilizables como los distintos tipos de preguntas (PreguntaTipoEstrellas, PreguntaTipoAbierta), el formulario general de la encuesta (EncuestaForm), y los componentes de visualización de datos para el dashboard (GraficoResultados, ListaRespuestas). Finalmente, la carpeta /apis gestiona las llamadas al backend para obtener encuestas pendientes, enviar respuestas y solicitar datos analíticos.

### Archivos Frontend

- `/features/portal-paciente/pages/ResponderEncuestaPage.tsx`
- `/features/portal-paciente/pages/GestionEncuestasPage.tsx`
- `/features/portal-paciente/pages/ResultadosEncuestaPage.tsx`
- `/features/portal-paciente/components/EncuestaForm.tsx`
- `/features/portal-paciente/components/PreguntaTipoEstrellas.tsx`
- `/features/portal-paciente/components/PreguntaTipoAbierta.tsx`
- `/features/portal-paciente/components/DashboardResultadosEncuesta.tsx`
- `/features/portal-paciente/apis/encuestasApi.ts`

### Componentes React

- EncuestaForm
- PreguntaTipoEstrellas
- PreguntaTipoMultipleChoice
- PreguntaTipoAbierta
- ModalConfirmacionEnvio
- ListaEncuestas
- CreadorEncuestasForm
- DashboardResultadosEncuesta
- GraficoBarrasRespuestas
- NubePalabrasComentarios

## 🔌 APIs Backend

Las APIs gestionan el ciclo de vida completo de las encuestas, desde la creación de plantillas por parte del personal de la clínica, la asignación de encuestas a pacientes, la recepción de sus respuestas, y la agregación de datos para la visualización de resultados.

### `GET` `/api/encuestas/pendientes`

Obtiene la lista de encuestas pendientes de responder para el paciente autenticado.

**Parámetros:** Autenticación (JWT en header)

**Respuesta:** Array de objetos de encuestas pendientes, cada uno con su ID y título.

### `GET` `/api/encuestas/plantilla/:plantillaId`

Obtiene la estructura (preguntas) de una plantilla de encuesta específica para ser renderizada en el frontend del paciente.

**Parámetros:** plantillaId (URL param)

**Respuesta:** Objeto JSON con el título, descripción y un array de preguntas de la plantilla.

### `POST` `/api/encuestas/responder/:respuestaId`

Permite a un paciente enviar sus respuestas a una encuesta pendiente. El estado de la encuesta cambia a 'completada'.

**Parámetros:** respuestaId (URL param), Body: { respuestas: [{ preguntaId: string, valor: any }] }

**Respuesta:** Objeto con mensaje de confirmación.

### `GET` `/api/encuestas/plantillas`

Obtiene todas las plantillas de encuestas creadas por la clínica (acceso para rol Marketing/CRM).

**Parámetros:** Autenticación y autorización de rol

**Respuesta:** Array de objetos de plantillas de encuestas.

### `POST` `/api/encuestas/plantillas`

Crea una nueva plantilla de encuesta (acceso para rol Marketing/CRM).

**Parámetros:** Autenticación y autorización de rol, Body: { titulo: string, descripcion: string, preguntas: [...] }

**Respuesta:** El objeto de la nueva plantilla creada.

### `GET` `/api/encuestas/resultados/:plantillaId`

Obtiene los resultados agregados para una plantilla de encuesta específica (acceso para rol Marketing/CRM).

**Parámetros:** plantillaId (URL param), Query params opcionales para filtrar: fechaInicio, fechaFin, profesionalId

**Respuesta:** Objeto JSON con estadísticas, promedios, y respuestas agrupadas.

## 🗂️ Estructura Backend (MERN)

El backend utiliza dos modelos principales en MongoDB: 'EncuestaPlantilla' para definir la estructura de cada encuesta, y 'EncuestaRespuesta' para almacenar las respuestas individuales de los pacientes. Un 'EncuestaController' contiene la lógica de negocio, y las rutas de Express exponen los endpoints necesarios de forma segura y organizada.

### Models

#### EncuestaPlantilla

{ titulo: String, descripcion: String, activa: Boolean, preguntas: [{ texto: String, tipo: String ('estrellas', 'multiple', 'abierta'), opciones: [String] }], creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' } }

#### EncuestaRespuesta

{ plantilla: { type: Schema.Types.ObjectId, ref: 'EncuestaPlantilla' }, paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, cita: { type: Schema.Types.ObjectId, ref: 'Cita' }, estado: String ('pendiente', 'completada'), respuestas: [{ preguntaTexto: String, respuestaValor: Schema.Types.Mixed }], fechaCompletada: Date }

### Controllers

#### EncuestaController

- crearPlantilla
- obtenerPlantillas
- obtenerPlantillaPorId
- actualizarPlantilla
- eliminarPlantilla
- obtenerEncuestasPendientes
- registrarRespuesta
- obtenerResultadosAgregados

### Routes

#### `/api/encuestas`

- GET /pendientes
- GET /plantilla/:plantillaId
- POST /responder/:respuestaId
- GET /plantillas
- POST /plantillas
- GET /resultados/:plantillaId

## 🔄 Flujos

1. Flujo del Paciente: El paciente finaliza su cita. Al día siguiente, recibe una notificación en el portal. Accede, ve la encuesta, responde a las preguntas (p. ej., califica con 5 estrellas al doctor, selecciona 'muy limpio' para la clínica y escribe un comentario). Envía la encuesta y ve un mensaje de agradecimiento.
2. Flujo de Creación de Encuesta (Marketing/CRM): El manager de CRM accede al módulo de encuestas. Crea una nueva plantilla llamada 'Post-Limpieza Dental'. Añade una pregunta de estrellas para 'satisfacción general', una de opción múltiple para 'tiempo de espera' y una abierta para 'comentarios'. Guarda la plantilla y la activa.
3. Flujo de Análisis de Resultados (Marketing/CRM): El manager de marketing revisa los resultados de la encuesta 'Post-Limpieza Dental'. Observa en el dashboard que la calificación promedio es de 4.8/5, pero el 'tiempo de espera' tiene muchas respuestas 'largo'. Lee los comentarios en la nube de palabras, donde 'recepción' y 'espera' son términos frecuentes, lo que sugiere un área de mejora operativa.

## 📝 User Stories

- Como paciente, quiero recibir una encuesta corta y fácil de responder en mi portal después de mi cita para poder compartir mi experiencia de forma privada y rápida.
- Como responsable de Marketing, quiero crear y gestionar diferentes plantillas de encuestas para medir la satisfacción en distintos puntos del viaje del paciente (primera visita, tratamiento específico, etc.).
- Como gerente de la clínica, quiero visualizar un resumen de los resultados de las encuestas con gráficos y métricas clave para identificar rápidamente nuestras fortalezas y debilidades.
- Como recepcionista, quiero que el sistema envíe automáticamente las encuestas para no tener que hacerlo manualmente y poder enfocarme en la atención al paciente en la clínica.

## ⚙️ Notas Técnicas

- Automatización: Se debe implementar un job programado (ej. usando node-cron o un servicio externo) que se ejecute diariamente para escanear las citas completadas del día anterior y generar las instancias de 'EncuestaRespuesta' con estado 'pendiente' para los pacientes correspondientes.
- Seguridad: Los endpoints deben estar protegidos con middleware de autenticación (JWT). Un paciente solo puede acceder a sus propias encuestas pendientes y enviar respuestas para ellas. Los roles de Marketing/CRM deben tener permisos específicos para acceder a la gestión de plantillas y resultados.
- Agregación de Datos: Para la API de resultados, es fundamental usar el 'Aggregation Framework' de MongoDB en el backend. Esto permite al servidor realizar cálculos complejos (promedios, conteos, agrupaciones) de manera eficiente y devolver solo los datos agregados, evitando transferir miles de respuestas individuales al frontend y mejorando drásticamente el rendimiento del dashboard.
- Experiencia de Usuario (UX): La interfaz de la encuesta para el paciente debe ser extremadamente simple, mobile-first y visualmente atractiva para maximizar la tasa de respuesta. Evitar encuestas demasiado largas.

