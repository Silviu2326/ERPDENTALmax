# Cohortes de Pacientes (Retención)

**Categoría:** Análisis y Reportes | **Módulo:** Analítica Avanzada & Data

El análisis de cohortes de retención es una herramienta de inteligencia de negocio fundamental para cualquier clínica dental que busque un crecimiento sostenible. Esta funcionalidad permite agrupar a los pacientes en 'cohortes' basadas en la fecha de su primera visita (por ejemplo, todos los pacientes nuevos de enero de 2023 forman una cohorte). Luego, se rastrea el comportamiento de cada cohorte a lo largo del tiempo para ver qué porcentaje de ellos regresa a la clínica en los meses o trimestres subsiguientes. Dentro del módulo 'Analítica Avanzada & Data', esta página se posiciona como una de las visualizaciones más estratégicas, pasando de los datos brutos a insights accionables sobre la lealtad del paciente. Sirve para responder preguntas críticas: ¿Estamos mejorando en la retención de nuevos pacientes? ¿Las campañas de marketing de un trimestre específico atrajeron pacientes más leales? ¿En qué punto del ciclo de vida del paciente solemos perderlo? Los resultados se presentan típicamente en una tabla de tipo 'heatmap', donde los colores indican la 'salud' de la retención, facilitando una rápida interpretación visual. Para un Director o responsable de Marketing, esta herramienta es invaluable para medir el ROI de las iniciativas de fidelización, identificar problemas operativos que afectan la experiencia del paciente y predecir ingresos futuros basándose en patrones de comportamiento históricos.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Marketing / CRM

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/analitica-avanzada-data/`

Esta funcionalidad reside dentro de la carpeta del feature 'analitica-avanzada-data'. La página principal se define en '/pages/AnalisisCohortesRetencionPage.tsx'. Esta página importa y utiliza componentes específicos de '/components/', como 'CohorteRetencionTable' para la visualización de la matriz y 'FiltrosCohortes' para la selección de parámetros. Las llamadas a la API del backend se gestionan a través de funciones definidas en '/apis/analiticaApi.ts', que se encarga de comunicarse con los endpoints de analítica.

### Archivos Frontend

- `/features/analitica-avanzada-data/pages/AnalisisCohortesRetencionPage.tsx`
- `/features/analitica-avanzada-data/components/CohorteRetencionTable.tsx`
- `/features/analitica-avanzada-data/components/FiltrosCohortes.tsx`
- `/features/analitica-avanzada-data/apis/analiticaApi.ts`

### Componentes React

- CohorteRetencionTable
- FiltrosCohortes
- GraficoEvolucionRetencion
- TooltipDetalleCohorte

## 🔌 APIs Backend

La API para esta funcionalidad es crítica y debe ser altamente optimizada. Su propósito principal es ejecutar una consulta de agregación compleja en la base de datos para procesar datos de pacientes y citas, agruparlos por cohortes y calcular las tasas de retención a lo largo del tiempo. Debe ser capaz de manejar filtros por rango de fechas y por sedes (para clínicas multisede).

### `GET` `/api/analytics/cohorts/retention`

Obtiene los datos procesados para el análisis de cohortes de retención de pacientes. Agrupa a los pacientes por su mes/trimestre de primera visita y calcula el porcentaje de retención en los períodos subsiguientes.

**Parámetros:** startDate: string (YYYY-MM-DD, fecha de inicio del período de análisis), endDate: string (YYYY-MM-DD, fecha de fin del período de análisis), groupBy: string ('monthly' o 'quarterly', para definir el tamaño de la cohorte), clinicId?: string (ID de la sede, opcional, para filtrar en entornos multisede)

**Respuesta:** Un objeto JSON con una matriz de cohortes, ej: { cohorts: [ { cohortDate: '2023-01', totalPatients: 150, retention: [100, 45, 32, 25, ...] }, ... ] }

## 🗂️ Estructura Backend (MERN)

El backend utiliza el framework de agregación de MongoDB para procesar eficientemente los datos. Un controlador dedicado 'AnaliticaController' contiene la lógica de negocio para construir y ejecutar esta consulta. Los modelos 'Paciente' y 'Cita' son las fuentes de datos primarias. La ruta está protegida y solo accesible para los roles autorizados.

### Models

#### Paciente

_id: ObjectId, nombre: String, fechaRegistro: Date, primeraCita: { fecha: Date, _id: ObjectId }, sedeId: ObjectId

#### Cita

_id: ObjectId, pacienteId: ObjectId, fecha: Date, estado: String ('Completada', 'Cancelada', etc.), sedeId: ObjectId

### Controllers

#### AnaliticaController

- generarReporteCohortesRetencion

### Routes

#### `/api/analytics`

- GET /cohorts/retention

## 🔄 Flujos

1. El usuario (Director/Marketing) accede a la sección 'Análisis de Cohortes' desde el menú de 'Analítica Avanzada'.
2. La página carga por defecto el análisis de los últimos 12 meses con cohortes mensuales.
3. El frontend realiza una petición GET a '/api/analytics/cohorts/retention' con los parámetros por defecto.
4. El backend procesa la solicitud, ejecuta la agregación en MongoDB y devuelve los datos de las cohortes.
5. El componente 'CohorteRetencionTable' renderiza la matriz con un heatmap de colores para facilitar la lectura.
6. El usuario utiliza el componente 'FiltrosCohortes' para cambiar el rango de fechas o agrupar por trimestres.
7. Cada cambio en los filtros dispara una nueva petición a la API, y la tabla se actualiza con los nuevos datos.
8. Al pasar el ratón sobre una celda, un tooltip muestra el número absoluto de pacientes retenidos y el total de la cohorte.

## 📝 User Stories

- Como Director de clínica, quiero ver un análisis de cohortes de retención para entender la lealtad de nuestros pacientes a lo largo del tiempo y tomar decisiones estratégicas para mejorarla.
- Como responsable de Marketing, quiero filtrar el análisis de cohortes por fecha para medir el impacto en la retención de las campañas lanzadas en períodos específicos.
- Como Admin general de un grupo multisede, quiero comparar el rendimiento de retención entre diferentes sedes para identificar las mejores prácticas y las áreas de mejora.
- Como responsable de CRM, quiero identificar en qué mes (después de la primera visita) es más probable que perdamos a un paciente, para poder lanzar acciones de reactivación proactivas.

## ⚙️ Notas Técnicas

- Rendimiento: La consulta de agregación en MongoDB puede ser intensiva. Es crucial tener índices en 'Paciente.primeraCita.fecha', 'Cita.pacienteId' y 'Cita.fecha' para optimizar la búsqueda.
- Caching: Considerar la implementación de un sistema de caché (ej. Redis) para los resultados de la API, especialmente para rangos de fecha comunes, para reducir la carga en la base de datos.
- Precisión de Datos: La lógica para determinar la 'primera visita completada' de un paciente debe ser robusta y consistente. Este es el pilar del análisis.
- Seguridad: El endpoint de la API debe estar protegido por un middleware que verifique el rol del usuario. En un entorno multisede, se debe validar que el 'clinicId' solicitado corresponda a una sede a la que el usuario tiene acceso.
- Visualización: La librería de gráficos (ej. D3.js, Chart.js o similar) debe ser elegida cuidadosamente para renderizar la tabla/heatmap de forma eficiente y visualmente atractiva.

