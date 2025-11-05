# Revisión por la Dirección

**Categoría:** Calidad y Auditoría | **Módulo:** Calidad y Auditoría

La funcionalidad 'Revisión por la Dirección' es un dashboard analítico de alto nivel, diseñado específicamente para la toma de decisiones estratégicas por parte de la gerencia y propietarios de la clínica o red de clínicas. Este panel centraliza y visualiza los Indicadores Clave de Rendimiento (KPIs) más importantes, extrayendo datos de todos los módulos del ERP: finanzas, agenda, gestión de pacientes, tratamientos clínicos, marketing y satisfacción del cliente. Su propósito principal es ofrecer una visión integral y consolidada de la salud y el rendimiento del negocio en tiempo real. A través de gráficos interactivos, tablas comparativas y métricas clave, los directivos pueden evaluar el desempeño frente a los objetivos establecidos, identificar tendencias, detectar desviaciones y analizar las causas raíz de los problemas. Forma parte del módulo 'Calidad y Auditoría' porque es la herramienta fundamental para el ciclo de mejora continua (PDCA - Plan-Do-Check-Act), permitiendo a la dirección revisar sistemáticamente la eficacia del sistema de gestión de calidad, los resultados de auditorías internas, el feedback de los pacientes y el rendimiento operativo para tomar acciones correctivas y preventivas. Facilita la creación de planes de acción, la asignación de responsabilidades y el seguimiento de las mejoras, asegurando el cumplimiento de los estándares de calidad y la sostenibilidad del negocio.

## 👥 Roles de Acceso

- Propietario / Gerente
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/calidad-auditoria/`

Esta funcionalidad se encuentra dentro de la carpeta de la feature 'calidad-auditoria'. La subcarpeta '/pages' contiene el componente principal 'RevisionDireccionPage.tsx' que renderiza el dashboard. La carpeta '/components' alberga los elementos de UI reutilizables y especializados como 'KPICard.tsx' para mostrar métricas individuales, 'GraficoTendencias.tsx' para visualizaciones de datos históricos, y 'TablaDesempeno.tsx' para desgloses detallados. Finalmente, la carpeta '/apis' contiene el archivo 'revisionDireccionApi.ts' que encapsula todas las llamadas a los endpoints del backend necesarios para obtener los datos agregados y gestionar los planes de acción.

### Archivos Frontend

- `/features/calidad-auditoria/pages/RevisionDireccionPage.tsx`
- `/features/calidad-auditoria/components/DashboardFiltros.tsx`
- `/features/calidad-auditoria/components/KPICard.tsx`
- `/features/calidad-auditoria/components/GraficoTendenciasFinancieras.tsx`
- `/features/calidad-auditoria/components/GraficoRendimientoClinico.tsx`
- `/features/calidad-auditoria/components/TablaPlanesDeAccion.tsx`
- `/features/calidad-auditoria/components/ModalCrearPlanDeAccion.tsx`
- `/features/calidad-auditoria/apis/revisionDireccionApi.ts`

### Componentes React

- RevisionDireccionDashboard
- DashboardFiltros
- KPICard
- GraficoTendenciasFinancieras
- GraficoRendimientoClinico
- TablaPlanesDeAccion
- ModalCrearPlanDeAccion

## 🔌 APIs Backend

Las APIs para esta página se centran en la agregación y resumen de datos de múltiples colecciones. Son endpoints de solo lectura para la visualización de KPIs, y endpoints de escritura para la gestión de los planes de acción derivados de la revisión. Requieren optimización para manejar consultas complejas sobre grandes volúmenes de datos.

### `GET` `/api/revision-direccion/kpis`

Obtiene los KPIs principales (ingresos, pacientes nuevos, ocupación, satisfacción) para un período y sede específicos.

**Parámetros:** query: startDate (string ISO date), query: endDate (string ISO date), query: clinicId (string, opcional para admin multisede)

**Respuesta:** JSON object con métricas clave: { totalRevenue, newPatients, appointmentOccupancy, averageSatisfactionScore }

### `GET` `/api/revision-direccion/tendencias-financieras`

Obtiene datos agregados para graficar tendencias de ingresos, gastos y beneficios a lo largo del tiempo.

**Parámetros:** query: startDate (string ISO date), query: endDate (string ISO date), query: clinicId (string, opcional), query: groupBy (string: 'day', 'week', 'month')

**Respuesta:** Array de objetos: [{ date, revenue, expenses, profit }]

### `GET` `/api/revision-direccion/rendimiento-profesionales`

Obtiene un resumen del rendimiento por profesional (odontólogo).

**Parámetros:** query: startDate (string ISO date), query: endDate (string ISO date), query: clinicId (string, opcional)

**Respuesta:** Array de objetos: [{ professionalId, professionalName, revenueGenerated, proceduresCount, patientRating }]

### `GET` `/api/revision-direccion/planes-accion`

Recupera todos los planes de acción creados durante las revisiones.

**Parámetros:** query: clinicId (string, opcional), query: status (string, opcional: 'Pendiente', 'En Progreso', 'Completado')

**Respuesta:** Array de objetos de Plan de Acción.

### `POST` `/api/revision-direccion/planes-accion`

Crea un nuevo plan de acción como resultado de la revisión.

**Parámetros:** body: { title, description, responsibleUserId, dueDate, clinicId }

**Respuesta:** El objeto del Plan de Acción recién creado.

### `PUT` `/api/revision-direccion/planes-accion/:id`

Actualiza el estado o añade notas a un plan de acción existente.

**Parámetros:** path: id (string), body: { status, notes }

**Respuesta:** El objeto del Plan de Acción actualizado.

## 🗂️ Estructura Backend (MERN)

El backend para esta funcionalidad no se basa en un único modelo principal, sino que su controlador ('RevisionDireccionController') realiza consultas de agregación complejas sobre múltiples modelos existentes como 'Factura', 'Paciente', 'Cita' y 'Tratamiento'. Sin embargo, introduce un nuevo modelo, 'PlanDeAccion', para registrar y dar seguimiento a las tareas que surgen de la revisión.

### Models

#### PlanDeAccion

title: String, description: String, responsible: { type: Schema.Types.ObjectId, ref: 'User' }, dueDate: Date, status: { type: String, enum: ['Pendiente', 'En Progreso', 'Completado'] }, clinic: { type: Schema.Types.ObjectId, ref: 'Sede' }, createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, notes: [{ note: String, author: { type: Schema.Types.ObjectId, ref: 'User' }, date: Date }]

#### RegistroRevision

reviewDate: Date, attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }], kpiSnapshot: Object, discussionPoints: String, decisionsMade: String, actionPlans: [{ type: Schema.Types.ObjectId, ref: 'PlanDeAccion' }], clinic: { type: Schema.Types.ObjectId, ref: 'Sede' }

### Controllers

#### RevisionDireccionController

- getKPIs
- getFinancialTrends
- getProfessionalPerformance
- getAllActionPlans
- createActionPlan
- updateActionPlan

### Routes

#### `/api/revision-direccion`

- /kpis
- /tendencias-financieras
- /rendimiento-profesionales
- /planes-accion
- /planes-accion/:id

## 🔄 Flujos

1. El Director accede a la página 'Revisión por la Dirección'. El sistema carga por defecto los KPIs del último trimestre.
2. El usuario utiliza los filtros de fecha y sede (si aplica) para acotar el período de análisis.
3. El dashboard se actualiza dinámicamente mostrando los KPIs, gráficos de tendencias y tablas de rendimiento para el período seleccionado.
4. Al identificar una métrica por debajo del objetivo (ej. baja satisfacción en 'tiempo de espera'), el Director analiza los datos relacionados.
5. Desde el dashboard, el Director crea un 'Nuevo Plan de Acción', describe el problema, asigna la tarea al Gerente de la clínica y establece una fecha límite.
6. El plan de acción aparece en una tabla dentro del mismo dashboard, permitiendo su seguimiento en futuras revisiones.

## 📝 User Stories

- Como Propietario, quiero ver un panel consolidado con los ingresos totales, pacientes nuevos y rentabilidad de todas mis clínicas para evaluar la salud general del negocio.
- Como Director General, quiero comparar el rendimiento financiero y operativo entre diferentes sedes para identificar oportunidades de mejora y replicar las mejores prácticas.
- Como Gerente de clínica, quiero analizar las tendencias de los tipos de tratamiento más realizados y rentables para optimizar la oferta de servicios y las campañas de marketing.
- Como Director, quiero crear y asignar planes de acción directamente desde el análisis de datos para asegurar que cada hallazgo se traduce en una mejora tangible y medible.
- Como Propietario, quiero tener un registro histórico de las revisiones y los planes de acción para cumplir con las normativas de calidad y demostrar un ciclo de mejora continua.

## ⚙️ Notas Técnicas

- Rendimiento: Las consultas de agregación pueden ser intensivas. Es crucial usar el Aggregation Framework de MongoDB y asegurar que los campos utilizados en los filtros ($match) y agrupaciones ($group), como las fechas y los IDs de sede/profesional, estén correctamente indexados.
- Seguridad: El acceso a este módulo debe estar estrictamente protegido por un middleware de control de acceso basado en roles (RBAC). Las API deben validar que el usuario solicitante tiene el rol adecuado y filtrar los datos por 'clinicId' para evitar la fuga de información entre sedes.
- Caching: Considerar implementar una estrategia de caché (ej. con Redis) para los resultados de las consultas de agregación, especialmente para rangos de fechas comunes (mes actual, último trimestre), para reducir la carga en la base de datos y mejorar la velocidad de respuesta del dashboard.
- Visualización de Datos: Utilizar una librería de gráficos robusta en el frontend como Chart.js o Recharts para renderizar los datos de forma clara, interactiva y responsive.
- Multisede: Toda la lógica de negocio y las consultas a la base de datos deben estar preparadas para un entorno multisede, utilizando siempre el 'clinicId' como filtro principal para garantizar el aislamiento de los datos.

