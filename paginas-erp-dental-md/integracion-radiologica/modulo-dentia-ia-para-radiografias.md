# Módulo DentIA (IA para Radiografías)

**Categoría:** Integraciones | **Módulo:** Integración Radiológica

El Módulo DentIA es una funcionalidad avanzada de soporte al diagnóstico clínico, integrada dentro del módulo padre de 'Integración Radiológica'. Su propósito fundamental es aplicar algoritmos de inteligencia artificial y visión por computadora para analizar automáticamente radiografías dentales (periapicales, de aleta de mordida, panorámicas y CBCT) y detectar posibles patologías. Al subir una imagen radiográfica al sistema, el profesional puede activar el análisis de DentIA, que procesa la imagen para identificar y resaltar áreas de interés como caries incipientes, lesiones periapicales, pérdida ósea alveolar asociada a enfermedad periodontal, cálculos dentales, y otras anomalías estructurales. El sistema no busca reemplazar el juicio clínico del odontólogo, sino actuar como una herramienta de apoyo, una 'segunda opinión' digital que aumenta la precisión diagnóstica y la eficiencia. Los resultados se presentan visualmente sobre la misma radiografía, utilizando cajas delimitadoras, segmentación de colores y etiquetas, acompañados de un informe detallado con el nivel de confianza de cada hallazgo. Esta información se almacena de forma estructurada y se vincula permanentemente al registro del paciente y a la imagen original, facilitando el seguimiento a lo largo del tiempo y mejorando la comunicación con el paciente al poder mostrarle de forma clara y visual las conclusiones del análisis.

## 👥 Roles de Acceso

- Odontólogo
- Técnico de Radiología
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/integracion-radiologica/`

Toda la lógica para la gestión de imágenes radiológicas y el análisis con IA reside en la carpeta '/features/integracion-radiologica/'. Las páginas específicas, como el visor de análisis de IA, se encuentran en '/pages/'. Los componentes reutilizables, como el propio visor de radiografías con capacidad para superponer anotaciones de IA ('RadiographViewerWithIA') o el panel de resultados ('AnalysisResultsPanel'), están en '/components/'. Las llamadas al backend para solicitar análisis y obtener resultados se abstraen en funciones dentro de '/apis/dentiaApi.ts', manteniendo la lógica de la interfaz separada de la comunicación de red.

### Archivos Frontend

- `/features/integracion-radiologica/pages/DentiaAnalysisPage.tsx`
- `/features/integracion-radiologica/components/RadiographViewerWithIA.tsx`
- `/features/integracion-radiologica/components/AnalysisResultsPanel.tsx`
- `/features/integracion-radiologica/components/SubmitToIAButton.tsx`
- `/features/integracion-radiologica/apis/dentiaApi.ts`

### Componentes React

- RadiographViewerWithIA
- AnalysisResultsPanel
- SubmitToIAButton
- AnalysisFindingItem
- AnalysisConfidenceIndicator

## 🔌 APIs Backend

Las APIs para DentIA gestionan el ciclo de vida del análisis de IA: inician la solicitud de análisis para una radiografía específica, permiten consultar el estado del proceso (ya que puede ser asíncrono) y, una vez completado, entregan los resultados estructurados que incluyen los hallazgos detectados, sus coordenadas y la confianza del modelo.

### `POST` `/api/radiologia/ia/analizar`

Inicia un nuevo proceso de análisis de IA para una radiografía existente en el sistema. Agrega la tarea a una cola de procesamiento y devuelve un ID de análisis para seguimiento.

**Parámetros:** body: { radiografiaId: string, pacienteId: string }

**Respuesta:** JSON object con el ID del nuevo análisis y su estado inicial. ej: { "analisisId": "60f8f1b9f4b3c1a3e4b5e6d7", "status": "en_cola" }

### `GET` `/api/radiologia/ia/analisis/:analisisId`

Obtiene el estado y los resultados de un análisis de IA específico. El frontend puede usar este endpoint para hacer polling y saber cuándo el análisis ha finalizado.

**Parámetros:** analisisId (URL param)

**Respuesta:** JSON object con el análisis completo. Si está 'completado', incluye un array de hallazgos. ej: { ..., "status": "completado", "hallazgos": [{ "tipo": "caries_interproximal", "coordenadas": [120, 340, 50, 80], "confianza": 0.95, "diente": "1.5" }] }

### `GET` `/api/radiologia/ia/paciente/:pacienteId`

Recupera un historial de todos los análisis de IA realizados para un paciente específico, vinculado a sus respectivas radiografías.

**Parámetros:** pacienteId (URL param)

**Respuesta:** Array de objetos de análisis, cada uno con información resumida (ID, fecha, radiografía asociada, número de hallazgos).

## 🗂️ Estructura Backend (MERN)

El backend soporta el módulo DentIA con un modelo específico 'AnalisisRadiograficoIA' para persistir los resultados de cada análisis. Un controlador 'RadiografiaIAController' orquesta la lógica, comunicándose con servicios de IA externos y gestionando el estado en la base de datos. Las rutas en '/routes/radiografiaIARoutes.js' exponen esta funcionalidad de forma segura al frontend.

### Models

#### AnalisisRadiograficoIA

_id: ObjectId, radiografiaId: { type: Schema.Types.ObjectId, ref: 'Radiografia' }, pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente' }, solicitadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }, status: { type: String, enum: ['en_cola', 'procesando', 'completado', 'error'], default: 'en_cola' }, hallazgos: [{ tipo: String, coordenadas: { x: Number, y: Number, w: Number, h: Number }, confianza: Number, descripcion: String, dienteAfectado: String }], rawResponse: Object, createdAt: Date, completedAt: Date

#### Radiografia

(Modelo existente) _id: ObjectId, pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente' }, tipo: String, urlArchivo: String, fechaCaptura: Date, notas: String, analisisIA: [{ type: Schema.Types.ObjectId, ref: 'AnalisisRadiograficoIA' }]

### Controllers

#### RadiografiaIAController

- solicitarAnalisis
- obtenerEstadoYResultados
- listarAnalisisPorPaciente

### Routes

#### `/api/radiologia/ia`

- POST /analizar
- GET /analisis/:analisisId
- GET /paciente/:pacienteId

## 🔄 Flujos

1. El odontólogo o técnico accede a la ficha del paciente y abre el visor de radiografías.
2. Selecciona una radiografía y hace clic en el botón 'Analizar con DentIA'.
3. El sistema envía la solicitud al backend, que la encola para ser procesada por el servicio de IA. La interfaz muestra un indicador de 'Análisis en progreso'.
4. Una vez el análisis se completa, el sistema puede enviar una notificación al usuario. Al recargar el visor, la radiografía ahora muestra las superposiciones de los hallazgos.
5. Un panel lateral lista cada hallazgo detectado (ej: 'Caries en diente 2.6', 'Pérdida ósea moderada').
6. El odontólogo revisa los hallazgos, puede hacer clic en cada uno para centrar la vista en la imagen, y decide si los añade al odontograma o al plan de tratamiento del paciente.

## 📝 User Stories

- Como Odontólogo, quiero analizar una radiografía con IA para detectar caries interproximales que son difíciles de ver a simple vista y así mejorar la precisión de mis diagnósticos.
- Como Odontólogo, quiero ver una lista clara y concisa de todos los hallazgos de la IA, con su nivel de confianza, para poder revisar y validar rápidamente los resultados.
- Como Técnico de Radiología, quiero poder activar el análisis de IA inmediatamente después de tomar una radiografía, para que el informe esté listo cuando el odontólogo revise el caso.
- Como administrador de TI, quiero poder configurar de forma segura la clave de API del proveedor de IA y ver un registro de auditoría de todas las solicitudes de análisis realizadas en la clínica.

## ⚙️ Notas Técnicas

- Integración de terceros: La funcionalidad depende de una API de un proveedor de IA para radiografías dentales (ej. Videa, Overjet). Se debe gestionar de forma segura la clave de la API a través de variables de entorno en el backend.
- Procesamiento asíncrono: Dado que el análisis de IA puede no ser instantáneo, el backend debe usar una cola de trabajos (ej. BullMQ, RabbitMQ) para procesar las solicitudes. El frontend debe implementar un mecanismo de sondeo (polling) o WebSockets para recibir la actualización del estado del análisis en tiempo real.
- Cumplimiento y Seguridad (HIPAA/RGPD): Es crucial asegurar que el proveedor de IA cumpla con las normativas de protección de datos de salud. Se debe firmar un Acuerdo de Asociación Comercial (BAA). Todos los datos en tránsito deben estar encriptados (HTTPS).
- Gestión de datos DICOM: Si las radiografías se almacenan en formato DICOM, el frontend necesitará una librería especializada como Cornerstone.js o DWV (DICOM Web Viewer) para renderizar las imágenes y superponer las anotaciones de la IA de forma precisa.
- Control de Costos: Las APIs de IA suelen tener un costo por análisis. El sistema debe registrar cada llamada en el modelo 'AnalisisRadiograficoIA' para permitir la auditoría y el control de gastos asociados a esta funcionalidad.

