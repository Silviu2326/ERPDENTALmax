# Panel Global de Centros

**Categoría:** Multi-sede | **Módulo:** Multi-sede y Franquicias

El 'Panel Global de Centros' es el centro neurálgico para la gestión de múltiples clínicas dentales dentro del ERP. Diseñado específicamente para roles directivos y propietarios, esta funcionalidad proporciona una vista consolidada y de alto nivel del rendimiento de toda la red de centros o franquicias. Su propósito principal es transformar datos operativos dispares de cada clínica en información estratégica y accionable. En lugar de tener que acceder individualmente a cada sede para evaluar su estado, los directivos pueden, desde una única pantalla, visualizar indicadores clave de rendimiento (KPIs) agregados, como la facturación total, el número de pacientes nuevos, la tasa de ocupación de los sillones, y la rentabilidad general. El panel funciona mediante la agregación de datos en tiempo real de todas las bases de datos de las clínicas asociadas, presentando la información a través de gráficos interactivos, tablas comparativas y tarjetas de resumen. Esto permite identificar rápidamente las clínicas con mejor y peor rendimiento, detectar tendencias a nivel de grupo, asignar recursos de manera más eficiente y tomar decisiones estratégicas informadas sobre marketing, operaciones y expansión. Dentro del módulo 'Multi-sede y Franquicias', este panel es el punto de partida para cualquier análisis a nivel corporativo, actuando como un puente hacia informes más detallados de cada centro individual.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Propietario / Gerente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/multi-sede-franquicias/`

Esta funcionalidad se encuentra dentro de la carpeta '/features/multi-sede-franquicias/'. La página principal es 'GlobalCentersDashboardPage.tsx' en la subcarpeta '/pages'. Esta página importa y utiliza varios componentes reutilizables de '/components/', como 'CenterSummaryCard' y 'GlobalKPIGrid', para construir la interfaz. Las llamadas a la API para obtener los datos agregados del dashboard se gestionan a través de funciones definidas en '/apis/dashboardAPI.ts', que se encargan de la comunicación con el backend.

### Archivos Frontend

- `/features/multi-sede-franquicias/pages/GlobalCentersDashboardPage.tsx`
- `/features/multi-sede-franquicias/components/GlobalDashboardHeader.tsx`
- `/features/multi-sede-franquicias/components/CenterSummaryCard.tsx`
- `/features/multi-sede-franquicias/components/GlobalKPIGrid.tsx`
- `/features/multi-sede-franquicias/components/PerformanceRankingList.tsx`
- `/features/multi-sede-franquicias/components/RevenueComparisonChart.tsx`
- `/features/multi-sede-franquicias/apis/dashboardAPI.ts`

### Componentes React

- GlobalCentersDashboardPage
- GlobalDashboardHeader
- CenterSummaryCard
- GlobalKPIGrid
- PerformanceRankingList
- RevenueComparisonChart
- DateRangePicker

## 🔌 APIs Backend

Las APIs para este panel deben ser capaces de agregar y procesar grandes volúmenes de datos de múltiples centros de manera eficiente para proporcionar resúmenes y KPIs globales. El endpoint principal devolverá un objeto completo con todos los datos necesarios para renderizar el dashboard, aceptando filtros de fecha.

### `GET` `/api/multi-sede/dashboard/summary`

Obtiene un resumen agregado de los KPIs y datos financieros de todos los centros gestionados por el usuario para un rango de fechas específico.

**Parámetros:** query.startDate: string (YYYY-MM-DD), query.endDate: string (YYYY-MM-DD)

**Respuesta:** Un objeto JSON que contiene: totalRevenue, totalNewPatients, averageOccupancyRate, y un array 'centersData' con un resumen individual por cada centro (id, nombre, facturación, pacientes nuevos).

### `GET` `/api/multi-sede/dashboard/ranking`

Devuelve una lista de centros clasificados según una métrica específica (ej. facturación, pacientes nuevos) en orden ascendente o descendente.

**Parámetros:** query.metric: string ('revenue', 'newPatients', 'occupancy'), query.order: string ('asc', 'desc'), query.limit: number (opcional)

**Respuesta:** Un array de objetos, donde cada objeto representa un centro y su valor para la métrica solicitada, ordenado según los parámetros.

## 🗂️ Estructura Backend (MERN)

El backend utiliza el Aggregation Framework de MongoDB para realizar cálculos complejos a través de múltiples colecciones (Facturas, Citas, Pacientes) y agrupar los resultados por centro. El controlador 'MultiSedeDashboardController' orquesta esta lógica, asegurando que solo se incluyan los datos de los centros a los que el usuario tiene acceso.

### Models

#### Center

nombre: String, direccion: Object, estado: String ('activo', 'inactivo'), configuracion: Object

#### Factura

centroId: ObjectId (ref: 'Center'), pacienteId: ObjectId, fecha: Date, total: Number, estado: String ('pagada', 'pendiente')

#### Cita

centroId: ObjectId (ref: 'Center'), profesionalId: ObjectId, fecha: Date, esPrimeraVisita: Boolean, estado: String ('confirmada', 'asistio', 'cancelada')

#### Usuario

nombre: String, email: String, rol: String, centrosPermitidos: [ObjectId (ref: 'Center')]

### Controllers

#### MultiSedeDashboardController

- getDashboardSummary
- getPerformanceRanking

### Routes

#### `/api/multi-sede/dashboard`

- GET /summary
- GET /ranking

## 🔄 Flujos

1. El Director/Propietario inicia sesión y accede al 'Panel Global de Centros'.
2. El sistema realiza una llamada a la API 'GET /api/multi-sede/dashboard/summary' con el rango de fechas por defecto (ej. últimos 30 días).
3. El backend agrega los datos de todas las clínicas permitidas para ese usuario y devuelve los KPIs consolidados.
4. El frontend renderiza las tarjetas de resumen, los gráficos y la lista de centros con sus datos individuales.
5. El usuario puede utilizar un selector de fechas para cambiar el período de análisis, lo que desencadena una nueva llamada a la API.
6. El usuario puede hacer clic en un encabezado de la tabla de rendimiento para ordenarla por una métrica diferente, activando una llamada a 'GET /api/multi-sede/dashboard/ranking'.
7. Al hacer clic en el nombre de un centro específico, el usuario es redirigido al panel detallado de esa clínica individual.

## 📝 User Stories

- Como Director General, quiero ver la facturación total de todas mis clínicas en un solo panel para evaluar rápidamente la salud financiera del grupo.
- Como Propietario de una franquicia, quiero comparar el número de pacientes nuevos entre mis diferentes sedes para identificar qué estrategias de marketing están funcionando mejor.
- Como Admin General, quiero ver una lista clasificada de clínicas por tasa de ocupación para poder enfocar mis esfuerzos de gestión en las que tienen menor rendimiento.
- Como Director, quiero filtrar la vista del panel por trimestres para alinear el análisis de datos con nuestros informes financieros trimestrales.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial optimizar las consultas de agregación en MongoDB. Utilizar índices en los campos 'centroId' y 'fecha' en las colecciones de Facturas y Citas es mandatorio. Considerar implementar un sistema de caché (ej. con Redis) para los resultados de rangos de fechas comunes para reducir la carga de la base de datos.
- Seguridad: La lógica del backend debe garantizar rigurosamente que cada consulta filtre los resultados basándose en el array 'centrosPermitidos' del documento del usuario autenticado. Nunca se deben exponer datos de un centro a un usuario no autorizado.
- Escalabilidad: La lógica de agregación debe ser diseñada para escalar a cientos de clínicas. Evitar operaciones que carguen grandes volúmenes de documentos en memoria. El pipeline de agregación debe procesar los datos en el servidor de la base de datos tanto como sea posible.
- Visualización de Datos: Utilizar una librería de gráficos robusta en el frontend (como Chart.js, Recharts o D3.js) para presentar los datos de forma clara e interactiva.
- Consistencia de Datos: Asegurar que los KPIs se calculan de manera consistente en todos los centros (ej. la definición de 'paciente nuevo' o 'cita asistida' debe ser la misma).

