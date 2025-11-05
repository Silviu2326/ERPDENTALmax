# Plan de Calidad (Indicadores)

**Categoría:** Calidad y Auditoría | **Módulo:** Calidad y Auditoría

El Plan de Calidad (Indicadores) es un dashboard ejecutivo y de gestión diseñado para proporcionar una visión clara, concisa y en tiempo real del rendimiento de la clínica o del grupo de clínicas. Esta funcionalidad sirve como el centro neurálgico del módulo de Calidad y Auditoría, permitiendo a los directores, propietarios y gerentes monitorizar los Indicadores Clave de Rendimiento (KPIs) que son vitales para la salud operativa, financiera y clínica del negocio. Su propósito fundamental es transformar los datos brutos generados diariamente en el ERP (citas, tratamientos, facturación, satisfacción del paciente) en información accionable para la toma de decisiones estratégicas. A través de gráficos interactivos, tarjetas de métricas y comparativas temporales, los usuarios pueden identificar rápidamente áreas de éxito y oportunidades de mejora, evaluar el impacto de nuevas estrategias, y asegurar que la calidad del servicio se mantiene en los estándares definidos. Dentro del ERP, esta página se nutre de datos de prácticamente todos los demás módulos (Agenda, Pacientes, Facturación, Tratamientos) para calcular y presentar indicadores como la tasa de ocupación de sillones, el ingreso promedio por paciente, la tasa de cancelación de citas, el porcentaje de aceptación de planes de tratamiento, y la puntuación de satisfacción del paciente (NPS). Funciona como un sistema de alerta temprana y una herramienta de validación estratégica.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Propietario / Gerente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/calidad-auditoria/`

La funcionalidad reside dentro de la carpeta '/features/calidad-auditoria/'. La página principal, 'PlanCalidadIndicadoresPage.tsx', se encuentra en la subcarpeta '/pages/' y actúa como el contenedor principal del dashboard. La subcarpeta '/components/' alberga los elementos visuales reutilizables como 'IndicadorCard.tsx' (para mostrar un KPI individual), 'DashboardGraficoTendencia.tsx' (para gráficos de línea o barra), y 'FiltroGlobalIndicadores.tsx' (para seleccionar rangos de fechas y sedes). La lógica para comunicarse con el backend está encapsulada en la subcarpeta '/apis/', con un archivo como 'indicadoresApi.ts' que exporta funciones asíncronas para obtener los datos de los KPIs.

### Archivos Frontend

- `/features/calidad-auditoria/pages/PlanCalidadIndicadoresPage.tsx`
- `/features/calidad-auditoria/components/IndicadorCard.tsx`
- `/features/calidad-auditoria/components/DashboardGraficoTendencia.tsx`
- `/features/calidad-auditoria/components/FiltroGlobalIndicadores.tsx`
- `/features/calidad-auditoria/apis/indicadoresApi.ts`

### Componentes React

- PlanCalidadIndicadoresPage
- IndicadorCard
- DashboardGraficoTendencia
- FiltroGlobalIndicadores
- TablaDetalleIndicador

## 🔌 APIs Backend

Las APIs para esta página están diseñadas para ser eficientes, devolviendo datos agregados y pre-calculados para evitar la sobrecarga en el cliente. Soportan filtrado por rango de fechas y por sede (para entornos multiclínica), lo cual es crucial para el análisis de gestión.

### `GET` `/api/calidad/indicadores`

Obtiene los valores agregados de todos los KPIs configurados para el dashboard principal, calculados para el período especificado.

**Parámetros:** fechaInicio (string, YYYY-MM-DD), fechaFin (string, YYYY-MM-DD), sedeId (string, opcional, para filtrar por una clínica específica)

**Respuesta:** Un objeto que contiene un array de indicadores, cada uno con su nombre, valor actual, valor del período anterior, meta y tendencia. Ej: { indicadores: [ { id: '...', nombre: 'Tasa de Ocupación', valor: 85, unidad: '%', meta: 90, tendencia: 'positiva' } ] }

### `GET` `/api/calidad/indicadores/:id/historico`

Obtiene los datos históricos de un indicador específico para renderizar un gráfico de tendencia.

**Parámetros:** id (string, ID del indicador), fechaInicio (string, YYYY-MM-DD), fechaFin (string, YYYY-MM-DD), agrupacion (string, 'diaria', 'semanal', 'mensual'), sedeId (string, opcional)

**Respuesta:** Un array de puntos de datos con fecha y valor. Ej: [ { fecha: '2023-01-01', valor: 82 }, { fecha: '2023-02-01', valor: 85 } ]

### `GET` `/api/calidad/configuracion/indicadores`

Devuelve la lista de todos los indicadores disponibles que el usuario puede visualizar, junto con su configuración (metas, umbrales).

**Respuesta:** Un array de objetos de configuración de indicadores. Ej: [ { id: '...', nombre: 'Tasa de Ocupación', descripcion: '...', meta: 90 } ]

## 🗂️ Estructura Backend (MERN)

El backend utiliza MongoDB Aggregation Framework para realizar los complejos cálculos de los KPIs. Para optimizar el rendimiento, se implementa un sistema de caché o una colección de resultados pre-agregados ('ResultadoIndicador') que se actualiza periódicamente (ej. cada noche) mediante un cron job.

### Models

#### IndicadorCalidad

Define la configuración de un KPI. Campos: nombre (string), descripcion (string), unidadMedida (string, ej: '%', '€', '#'), formulaCalculo (string, descripción textual), meta (number), umbrales (object, ej: { bajo: 30, medio: 60 }), fuenteDatos (array de strings, ej: ['Cita', 'Factura'])

#### ResultadoIndicador

Almacena los valores calculados de los indicadores para evitar recálculos costosos. Campos: indicadorId (ObjectId, ref: 'IndicadorCalidad'), valor (number), periodo (Date), sedeId (ObjectId, ref: 'Sede'), fechaCalculo (Date)

### Controllers

#### IndicadorCalidadController

- getIndicadoresDashboard
- getHistoricoIndicador
- getConfiguracionIndicadores
- calcularYGuardarIndicadores

### Routes

#### `/api/calidad`

- GET /indicadores
- GET /indicadores/:id/historico
- GET /configuracion/indicadores

## 🔄 Flujos

1. 1. El Gerente/Director inicia sesión y navega a 'Calidad y Auditoría' -> 'Plan de Calidad'.
2. 2. El frontend realiza una llamada a GET /api/calidad/indicadores con el rango de fechas por defecto (ej. último mes).
3. 3. El backend calcula (o recupera de la colección de resultados) los valores de los KPIs y los devuelve.
4. 4. La página renderiza una serie de 'IndicadorCard' con los valores, comparativas y códigos de color (rojo/verde) según si se alcanza la meta.
5. 5. El usuario utiliza el 'FiltroGlobalIndicadores' para seleccionar un trimestre anterior y una sede específica.
6. 6. Se dispara una nueva llamada a la API con los nuevos parámetros y el dashboard se actualiza dinámicamente.
7. 7. El usuario hace clic en el gráfico de un indicador para ver su evolución. Se realiza una llamada a GET /api/calidad/indicadores/:id/historico y se muestra un modal con el gráfico de tendencia.

## 📝 User Stories

- Como Director General (multisede), quiero ver un dashboard comparativo de los KPIs más importantes por sede para identificar las clínicas con mejor y peor rendimiento.
- Como Propietario de clínica, quiero visualizar la evolución mensual del ingreso promedio por tratamiento para ajustar nuestra estrategia de precios y promociones.
- Como Gerente, quiero monitorizar la tasa de no asistencia (no-show) en tiempo real para poder tomar acciones correctivas inmediatas, como implementar recordatorios de citas más efectivos.
- Como Director, quiero establecer metas para cada indicador y ver visualmente (con colores o iconos) si estamos cumpliendo, por debajo o por encima de los objetivos.

## ⚙️ Notas Técnicas

- Rendimiento: Es crítico utilizar un sistema de agregación nocturna (cron job) que calcule los indicadores del día anterior y los almacene en la colección 'ResultadoIndicador'. Las consultas en tiempo real solo deben realizarse para el día en curso.
- Visualización de Datos: Se recomienda el uso de una librería de gráficos robusta como 'Recharts' o 'Chart.js' por su flexibilidad, rendimiento y compatibilidad con React.
- Seguridad: La API debe estar protegida por un middleware de autenticación y autorización que verifique el rol del usuario. Un Director General podrá ver los datos de todas las sedes, mientras que un Gerente de una sede específica solo podrá ver los datos de su propia clínica.
- Flexibilidad: La definición de los indicadores (modelo 'IndicadorCalidad') debe ser configurable desde un panel de administración, permitiendo a la clínica añadir, editar o eliminar KPIs sin necesidad de modificar el código fuente.

