# Periodoncia: Periodontograma Avanzado

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

El Periodontograma Avanzado es una herramienta digital interactiva fundamental dentro del módulo de 'Especialidades Clínicas', diseñada para el diagnóstico, seguimiento y planificación del tratamiento de enfermedades periodontales como la gingivitis y la periodontitis. Esta funcionalidad reemplaza los tradicionales diagramas en papel por una interfaz gráfica dinámica y precisa que representa la dentición completa del paciente. Permite al odontólogo o higienista registrar de manera sistemática y visual una serie de mediciones críticas para cada diente y sus seis superficies (mesiovestibular, vestibular, distovestibular, mesiolingual/palatino, lingual/palatino, distolingual/palatino). Los datos clave que se registran incluyen la profundidad de sondaje, el nivel de inserción clínica, la recesión gingival, el sangrado al sondaje, la supuración, la movilidad dental, la afectación de furca y la presencia de placa bacteriana. El carácter 'avanzado' de la herramienta se manifiesta en su capacidad para calcular automáticamente índices periodontales (ej. porcentaje de sitios con sangrado), comparar periodontogramas históricos del mismo paciente para evaluar la evolución de la enfermedad o la eficacia del tratamiento, y generar informes profesionales en PDF. Esta funcionalidad está intrínsecamente ligada a la historia clínica del paciente, proporcionando una visión longitudinal y detallada de su salud periodontal, lo que facilita la toma de decisiones clínicas y la comunicación con el paciente.

## 👥 Roles de Acceso

- Odontólogo
- Higienista

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad se encuentra dentro de la feature 'especialidades-clinicas'. La página principal, 'PeriodontogramaPage.tsx', reside en la subcarpeta '/pages' y actúa como el contenedor principal. Los elementos interactivos complejos, como el diagrama dental ('PeriodontogramaGrafico.tsx') y los paneles de entrada de datos ('PanelDatosDiente.tsx'), se desarrollan como componentes reutilizables en la subcarpeta '/components'. La comunicación con el backend para guardar y recuperar los datos del periodontograma se gestiona a través de funciones definidas en la subcarpeta '/apis'.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/PeriodontogramaPage.tsx`
- `/features/especialidades-clinicas/components/PeriodontogramaGrafico.tsx`
- `/features/especialidades-clinicas/components/PanelDatosDiente.tsx`
- `/features/especialidades-clinicas/components/SelectorHistorialPeriodontograma.tsx`
- `/features/especialidades-clinicas/components/ResumenIndicesPeriodontales.tsx`
- `/features/especialidades-clinicas/apis/periodontogramaApi.ts`

### Componentes React

- PeriodontogramaGrafico
- PanelDatosDiente
- SelectorHistorialPeriodontograma
- ResumenIndicesPeriodontales
- BotonGenerarInformePDF

## 🔌 APIs Backend

Las APIs son esenciales para la persistencia de los datos del periodontograma. Se necesita un conjunto de endpoints RESTful para crear un nuevo registro para un paciente, obtener todos los registros históricos de ese paciente y recuperar los detalles completos de un periodontograma específico para su visualización o comparación.

### `POST` `/api/pacientes/:pacienteId/periodontogramas`

Crea un nuevo registro de periodontograma para un paciente específico. El cuerpo de la petición contiene todos los datos clínicos recopilados.

**Parámetros:** pacienteId (en la URL), Body: { fecha, odontologoId, observaciones, datosDientes: {...} }

**Respuesta:** El objeto del periodontograma recién creado, incluyendo su nuevo _id.

### `GET` `/api/pacientes/:pacienteId/periodontogramas`

Obtiene una lista resumida de todos los periodontogramas históricos de un paciente, ordenados por fecha.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Un array de objetos, cada uno con el _id, la fecha y un resumen de los índices del periodontograma.

### `GET` `/api/periodontogramas/:id`

Obtiene los datos completos y detallados de un único periodontograma por su ID.

**Parámetros:** id (en la URL)

**Respuesta:** El objeto completo del periodontograma con todos los datos de cada diente.

### `PUT` `/api/periodontogramas/:id`

Actualiza un periodontograma existente. Útil para corregir errores de entrada de datos poco después de su creación.

**Parámetros:** id (en la URL), Body: { campos a actualizar }

**Respuesta:** El objeto del periodontograma actualizado.

## 🗂️ Estructura Backend (MERN)

El backend utiliza MongoDB para almacenar la estructura de datos compleja y anidada del periodontograma. Un modelo 'Periodontograma' define este esquema. El 'PeriodontogramaController' contiene la lógica para manejar las operaciones CRUD, que son expuestas a través de rutas de Express siguiendo principios RESTful.

### Models

#### Periodontograma

pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true }, profesionalId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }, fecha: { type: Date, default: Date.now }, observaciones: String, datosDientes: { type: Map, of: { profundidadSondaje: [Number], nivelInsercion: [Number], sangrado: [Boolean], supuracion: [Boolean], movilidad: Number, afectacionFurca: Number, placa: [Boolean], recesion: [Number] } }

### Controllers

#### PeriodontogramaController

- crearPeriodontograma
- obtenerPeriodontogramasPorPaciente
- obtenerPeriodontogramaPorId
- actualizarPeriodontograma

### Routes

#### `/api/periodontogramas`

- GET /:id
- PUT /:id

#### `/api/pacientes`

- POST /:pacienteId/periodontogramas
- GET /:pacienteId/periodontogramas

## 🔄 Flujos

1. El odontólogo selecciona un paciente y accede a la sección de Periodoncia desde el módulo de Especialidades Clínicas.
2. El sistema muestra un listado de periodontogramas anteriores y un botón para 'Crear Nuevo'.
3. Al crear uno nuevo, se presenta un diagrama dental interactivo vacío. El profesional selecciona un diente o una superficie específica.
4. Se abre un panel de entrada de datos donde el usuario introduce las mediciones (profundidad, sangrado, etc.) para las 6 superficies del diente, usando el teclado numérico para agilizar.
5. A medida que se introducen los datos, el diagrama se actualiza visualmente en tiempo real (ej. puntos rojos para sangrado, números para profundidades).
6. El profesional repite el proceso para todos los dientes. Un panel de resumen calcula y muestra los índices periodontales globales.
7. Al finalizar, el usuario guarda el periodontograma, que se almacena en la base de datos asociado al paciente.
8. El usuario puede seleccionar dos periodontogramas de fechas diferentes para superponerlos y visualizar gráficamente la evolución del estado periodontal del paciente.

## 📝 User Stories

- Como Odontólogo, quiero registrar de forma gráfica e interactiva las mediciones periodontales de un paciente para tener un diagnóstico preciso de su estado de salud gingival.
- Como Higienista, quiero una interfaz rápida y eficiente para introducir los datos de sondaje y sangrado mientras el odontólogo los dicta, optimizando el tiempo en consulta.
- Como Odontólogo, quiero comparar el periodontograma actual con los históricos para evaluar la progresión de la enfermedad periodontal y la efectividad del tratamiento aplicado.
- Como Odontólogo, quiero generar un informe en PDF del periodontograma para explicarle visualmente al paciente su condición y entregárselo como parte de su historial.
- Como Odontólogo, quiero que el sistema calcule automáticamente los índices de placa y sangrado para tener una métrica objetiva y rápida del estado general del paciente.

## ⚙️ Notas Técnicas

- Rendimiento del Frontend: El componente del diagrama dental interactivo debe ser altamente optimizado para evitar re-renderizados innecesarios. Se recomienda el uso de SVG para el renderizado y técnicas de memoización (React.memo) para los componentes hijos.
- Librerías recomendadas: Se puede considerar el uso de una librería como D3.js para la manipulación compleja del SVG y la visualización de datos, aunque se puede lograr con React puro. Para la generación de PDF, se pueden usar librerías como `jspdf` y `html2canvas` o `@react-pdf/renderer`.
- Seguridad: Todos los endpoints del backend deben estar protegidos por middleware de autenticación y autorización, asegurando que solo los roles 'Odontólogo' e 'Higienista' puedan acceder y modificar datos clínicos. Es crucial implementar validación de datos en el backend para garantizar la integridad del esquema complejo del periodontograma.
- Usabilidad (UX/UI): El diseño debe permitir una entrada de datos extremadamente rápida, priorizando el uso del teclado (navegación con flechas, atajos para marcar sangrado/supuración) para minimizar el uso del ratón y agilizar el flujo de trabajo clínico.
- Integración de datos: La estructura de `datosDientes` en MongoDB se define como un `Map` para permitir un acceso fácil y eficiente a los datos de un diente específico usando su numeración (ej. '18', '46') como clave.

