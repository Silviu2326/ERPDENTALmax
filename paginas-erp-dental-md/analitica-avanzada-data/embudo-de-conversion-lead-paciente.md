# Embudo de Conversión (Lead → Paciente)

**Categoría:** Análisis y Reportes | **Módulo:** Analítica Avanzada & Data

La funcionalidad 'Embudo de Conversión (Lead → Paciente)' es una herramienta visual y analítica clave dentro del módulo de 'Analítica Avanzada & Data'. Su propósito fundamental es ofrecer una representación gráfica y cuantitativa del viaje que realiza un prospecto desde que es un simple contacto (lead) hasta que se convierte en un paciente activo de la clínica. Este embudo permite a los directores y al equipo de marketing identificar puntos de fricción, medir la efectividad de sus estrategias de captación y optimizar los procesos para mejorar la tasa de conversión final. Funciona mediante el seguimiento de leads a través de etapas predefinidas, como 'Nuevo Lead', 'Contactado', 'Cita Agendada', 'Asistió a Primera Cita' y 'Paciente Activo'. Para cada etapa, el sistema muestra no solo el número absoluto de leads, sino también la tasa de conversión desde la etapa anterior. Esto revela cuellos de botella críticos; por ejemplo, una baja conversión de 'Cita Agendada' a 'Asistió a Primera Cita' podría indicar problemas en el proceso de recordatorio de citas. Al integrarse con el CRM del ERP, el embudo se alimenta de datos en tiempo real provenientes de diversas fuentes (formularios web, campañas de redes sociales, llamadas, referidos), permitiendo un análisis segmentado por canal de adquisición para evaluar el retorno de la inversión (ROI) de cada uno.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Marketing / CRM

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/analitica-avanzada-data/`

Esta funcionalidad se encuentra dentro de la carpeta del feature 'analitica-avanzada-data'. La página principal estará en '/pages/EmbudoConversionPage.tsx'. Los componentes visuales reutilizables, como el gráfico del embudo ('FunnelChart.tsx'), las tarjetas de métricas ('FunnelStageCard.tsx') y los filtros, residirán en la subcarpeta '/components/'. La lógica para comunicarse con el backend y obtener los datos del embudo se encapsulará en un archivo dentro de '/apis/funnelApi.ts', manteniendo el código limpio y organizado.

### Archivos Frontend

- `/features/analitica-avanzada-data/pages/EmbudoConversionPage.tsx`
- `/features/analitica-avanzada-data/components/FunnelChart.tsx`
- `/features/analitica-avanzada-data/components/FunnelStageCard.tsx`
- `/features/analitica-avanzada-data/components/LeadSourceBreakdownChart.tsx`
- `/features/analitica-avanzada-data/components/FunnelFilters.tsx`
- `/features/analitica-avanzada-data/apis/funnelApi.ts`

### Componentes React

- EmbudoConversionPage
- FunnelChart
- FunnelStageCard
- LeadSourceBreakdownChart
- FunnelFilters
- DateRangePicker
- ClinicSelector

## 🔌 APIs Backend

Se necesita una API principal que pueda agregar y calcular los datos del embudo de conversión. Esta API debe ser flexible para permitir filtrado por rangos de fechas, clínicas específicas y los diferentes orígenes de los leads, soportando así todas las necesidades de análisis de la interfaz.

### `GET` `/api/analytics/conversion-funnel`

Obtiene los datos agregados para construir el embudo de conversión. Calcula el número de leads en cada etapa y las tasas de conversión entre ellas. Permite el filtrado por fecha, clínica y origen del lead.

**Parámetros:** startDate: string (ISO date format, ej: '2023-01-01'), endDate: string (ISO date format, ej: '2023-03-31'), clinicId: string (opcional, ObjectId de la clínica para filtrar, requerido para roles no-admin), source: string (opcional, ej: 'Facebook Ads', 'Google Organic')

**Respuesta:** Un objeto JSON que contiene un array 'stages' con los datos de cada etapa (nombre, conteo, tasa de conversión) y un array 'sourceBreakdown' con el conteo de leads por origen. Ej: { stages: [ { name: 'Nuevos Leads', count: 500 }, { name: 'Cita Agendada', count: 250, conversionRate: 50.0 } ], sourceBreakdown: [ { source: 'Google', count: 300 }, { source: 'Facebook', count: 200 } ] }

## 🗂️ Estructura Backend (MERN)

El backend utilizará el modelo 'Lead' como fuente principal de datos. Un controlador específico, 'AnalyticsController', contendrá la lógica de negocio para procesar estos datos utilizando el potente Aggregation Framework de MongoDB para realizar los cálculos de forma eficiente directamente en la base de datos. Las rutas se definirán bajo el prefijo '/api/analytics'.

### Models

#### Lead

Campos relevantes: `nombreCompleto: string`, `email: string`, `telefono: string`, `origen: string` (ej: 'Web', 'Facebook', 'Referido'), `estado: string` (enum: ['Nuevo', 'Contactado', 'Cita Agendada', 'Descartado']), `fechaCreacion: Date`, `clinicId: ObjectId` (ref: 'Clinica'), `pacienteId: ObjectId` (ref: 'Paciente', nulo si no se ha convertido).

#### Cita

Campos relevantes: `pacienteId: ObjectId` (ref: 'Paciente'), `leadId: ObjectId` (ref: 'Lead'), `fechaHora: Date`, `primeraCita: boolean`, `estado: string` (enum: ['Programada', 'Confirmada', 'Asistió', 'Canceló', 'No Asistió']).

### Controllers

#### AnalyticsController

- getConversionFunnelData

### Routes

#### `/api/analytics`

- GET /conversion-funnel

## 🔄 Flujos

1. El Director o responsable de Marketing navega al módulo 'Analítica Avanzada' y selecciona 'Embudo de Conversión'.
2. La página carga y realiza una petición a la API para obtener los datos del embudo del último mes por defecto.
3. Se renderiza un gráfico del embudo mostrando las etapas clave y los porcentajes de conversión entre ellas.
4. El usuario utiliza el componente de filtros para seleccionar un rango de fechas personalizado (ej. último trimestre) y/o una clínica específica (si es rol multisede).
5. Al aplicar los filtros, se dispara una nueva llamada a la API con los nuevos parámetros y el gráfico se actualiza dinámicamente para reflejar la nueva selección de datos.
6. El usuario analiza el desglose por origen del lead para comparar el rendimiento de los canales de marketing.

## 📝 User Stories

- Como Director General, quiero ver el embudo de conversión de lead a paciente para identificar en qué fase del proceso comercial perdemos más oportunidades y poder tomar acciones correctivas.
- Como responsable de Marketing, quiero filtrar el embudo por 'origen del lead' para evaluar qué campañas (ej. Google Ads, Instagram) están generando los leads de mayor calidad y con mejor tasa de conversión.
- Como Admin General (multisede), quiero comparar los embudos de conversión de diferentes clínicas para identificar las mejores prácticas de la sede con mejor rendimiento y replicarlas en las demás.
- Como responsable de CRM, quiero visualizar la evolución de la tasa de conversión a lo largo del tiempo (ej. mes a mes) para medir el impacto de las nuevas iniciativas de seguimiento de leads.

## ⚙️ Notas Técnicas

- Rendimiento: La consulta para generar el embudo debe estar altamente optimizada usando el Aggregation Pipeline de MongoDB para evitar sobrecargar el servidor Node.js. Es imprescindible crear índices en los campos de filtrado (`fechaCreacion`, `clinicId`, `origen`, `estado`) del modelo 'Lead'.
- Visualización de Datos: Se recomienda utilizar una librería de gráficos como 'Recharts' o 'D3.js' en el frontend para crear una visualización del embudo interactiva y estéticamente agradable.
- Precisión de los Datos: La fiabilidad del embudo depende de la correcta y consistente atribución del `origen` y la actualización del `estado` de cada lead. Es vital asegurar que las integraciones con formularios web y otras fuentes de leads funcionen correctamente.
- Seguridad y Permisos: La API debe validar el rol del usuario que realiza la petición. Un usuario con rol de director de una sola sede no debe poder solicitar datos de otras clínicas, aplicando un filtro forzoso por su `clinicId` a nivel de backend.

