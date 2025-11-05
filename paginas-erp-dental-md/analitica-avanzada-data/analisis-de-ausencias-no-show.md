# Análisis de Ausencias (No-show)

**Categoría:** Análisis y Reportes | **Módulo:** Analítica Avanzada & Data

La funcionalidad de 'Análisis de Ausencias' es una herramienta de inteligencia de negocio fundamental dentro del módulo de 'Analítica Avanzada & Data'. Su objetivo principal es proporcionar a los directivos y al personal administrativo de la clínica una visión clara y cuantificable del impacto que tienen las inasistencias de los pacientes (conocidas como 'no-shows'). Las ausencias no notificadas representan una de las mayores fuentes de pérdida de ingresos y eficiencia en una clínica dental, ya que un box queda vacío, el tiempo del profesional se desperdicia y se pierde la oportunidad de atender a otro paciente. Esta página transforma los datos brutos de las citas en insights accionables. A través de un dashboard interactivo, los usuarios pueden visualizar métricas clave como la tasa de ausentismo general, el número total de citas perdidas, y una estimación de la pérdida económica que esto representa. Permite filtrar los datos por rangos de fechas, sedes (en caso de ser una red de clínicas), profesionales específicos o incluso por tipo de tratamiento. El sistema presenta esta información mediante gráficos de evolución temporal, tablas que identifican a los pacientes con mayor número de ausencias, y mapas de calor que señalan los días y horas con mayor incidencia, ayudando a la clínica a identificar patrones y tomar decisiones estratégicas para mitigar este problema, como implementar políticas de confirmación más rigurosas, solicitar depósitos para ciertos pacientes o ajustar la programación.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Recepción / Secretaría
- Call Center

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/analitica-avanzada-data/`

Esta funcionalidad se encuentra dentro de la feature 'analitica-avanzada-data'. La página principal, 'AnalisisAusenciasPage.tsx', reside en la subcarpeta '/pages/'. Esta página importa y organiza diversos componentes React reutilizables desde la subcarpeta '/components/', como filtros, gráficos y tablas de datos. La lógica para obtener los datos del backend se encapsula en funciones dentro de la subcarpeta '/apis/', que se encargan de realizar las llamadas a los endpoints de la API RESTful correspondientes.

### Archivos Frontend

- `/features/analitica-avanzada-data/pages/AnalisisAusenciasPage.tsx`
- `/features/analitica-avanzada-data/components/FiltrosAnalisisAusencias.tsx`
- `/features/analitica-avanzada-data/components/IndicadoresClaveAusencias.tsx`
- `/features/analitica-avanzada-data/components/GraficoTasaAusencias.tsx`
- `/features/analitica-avanzada-data/components/TablaPacientesReincidentes.tsx`
- `/features/analitica-avanzada-data/apis/analiticaApi.ts`

### Componentes React

- AnalisisAusenciasPage
- FiltrosAnalisisAusencias
- IndicadoresClaveAusencias
- GraficoTasaAusencias
- TablaPacientesReincidentes
- MapaCalorHorariosAusencia

## 🔌 APIs Backend

El backend provee una serie de endpoints RESTful diseñados para entregar datos agregados y pre-procesados, optimizados para el análisis de ausencias. Estos endpoints utilizan el pipeline de agregación de MongoDB para realizar cálculos complejos en la base de datos y devolver solo la información necesaria para los componentes del frontend.

### `GET` `/api/analitica/ausencias/kpis`

Obtiene los indicadores de rendimiento clave (KPIs) sobre las ausencias, como el número total de 'no-shows', la tasa de ausentismo y la pérdida económica estimada, para un periodo y filtros determinados.

**Parámetros:** query.fechaInicio: string (ISO Date), query.fechaFin: string (ISO Date), query.sedeId: string (Opcional), query.profesionalId: string (Opcional)

**Respuesta:** JSON con KPIs: { totalAusencias: number, tasaAusentismo: number, perdidaEstimada: number }

### `GET` `/api/analitica/ausencias/evolucion`

Devuelve una serie temporal de datos para visualizar la evolución de la tasa de ausentismo en un gráfico. Los datos se agrupan por día, semana o mes.

**Parámetros:** query.fechaInicio: string (ISO Date), query.fechaFin: string (ISO Date), query.sedeId: string (Opcional), query.profesionalId: string (Opcional), query.agrupacion: string ('dia', 'semana', 'mes')

**Respuesta:** Array de objetos: [{ fecha: string, tasa: number, total: number }]

### `GET` `/api/analitica/ausencias/pacientes-reincidentes`

Obtiene un listado paginado de los pacientes con el mayor número de ausencias registradas, para que el personal pueda identificarlos y tomar medidas.

**Parámetros:** query.fechaInicio: string (ISO Date), query.fechaFin: string (ISO Date), query.sedeId: string (Opcional), query.limit: number (default 10), query.page: number (default 1)

**Respuesta:** Array de objetos: [{ pacienteId: string, nombreCompleto: string, numeroAusencias: number, ultimaAusencia: Date }]

## 🗂️ Estructura Backend (MERN)

La lógica del backend para esta funcionalidad reside en un controlador específico ('AnaliticaController') que contiene los métodos para procesar las peticiones. Estos métodos construyen y ejecutan consultas de agregación complejas sobre el modelo 'Cita' de MongoDB. Las rutas se definen en un archivo de rutas dedicado bajo el prefijo '/api/analitica/ausencias'.

### Models

#### Cita

Contiene los campos clave para el análisis: { paciente: ObjectId, profesional: ObjectId, sede: ObjectId, fechaHoraInicio: Date, estado: String ('Programada', 'Confirmada', 'Cancelada', 'No Asistió', 'Realizada'), tratamientos: [ObjectId], duracionMinutos: Number }

#### Tratamiento

Se referencia desde el modelo Cita para calcular la pérdida económica: { nombre: String, precio: Number }

### Controllers

#### AnaliticaController

- getAusenciasKPIs
- getAusenciasEvolucion
- getPacientesReincidentes

### Routes

#### `/api/analitica/ausencias`

- GET /kpis
- GET /evolucion
- GET /pacientes-reincidentes

## 🔄 Flujos

1. El Director accede a la sección 'Análisis de Ausencias' desde el menú de 'Analítica Avanzada'.
2. Por defecto, la página carga los datos del último mes para todas las sedes.
3. El frontend realiza llamadas a los endpoints '/kpis', '/evolucion' y '/pacientes-reincidentes' para poblar los componentes del dashboard.
4. El Director utiliza el componente de filtros para acotar el análisis a una sede específica y un rango de fechas del último trimestre.
5. Al cambiar los filtros, se disparan nuevas llamadas a la API con los nuevos parámetros y los gráficos y tablas se actualizan dinámicamente.
6. La recepcionista revisa la 'Tabla de Pacientes Reincidentes' para identificar a los 3 pacientes con más ausencias y añade una nota en sus fichas para requerir un pago por adelantado en su próxima cita.

## 📝 User Stories

- Como Director, quiero visualizar un dashboard con la tasa de ausentismo y la pérdida económica estimada por sede para poder comparar el rendimiento y establecer objetivos de reducción.
- Como Recepcionista, quiero acceder a una lista de pacientes con múltiples ausencias para poder aplicar una política de confirmación de citas más estricta con ellos.
- Como agente de Call Center, quiero identificar los días de la semana y las franjas horarias con mayor índice de 'no-shows' para enfocar mis llamadas de recordatorio en esos periodos críticos.
- Como Admin General, quiero poder filtrar el análisis por un odontólogo específico para evaluar si existe algún patrón de ausencias con él y discutirlo en su evaluación de desempeño.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial que los campos 'estado', 'fechaHoraInicio', 'sede' y 'profesional' en el modelo 'Cita' estén indexados en MongoDB para acelerar las consultas de agregación.
- Cálculo de Pérdidas: La estimación de la pérdida económica se calcula sumando el precio de los tratamientos asociados a cada cita con estado 'No Asistió'. Esto requiere una operación `$lookup` en el pipeline de agregación para unir las colecciones 'citas' y 'tratamientos'.
- Seguridad: La API debe implementar un middleware de autorización que verifique el rol del usuario. Además, para los roles que no sean 'Director / Admin general', los datos deben ser filtrados automáticamente por la(s) sede(s) a la(s) que el usuario tiene acceso.
- Visualización de Datos: Se recomienda el uso de librerías como Recharts o Chart.js para renderizar los gráficos en el frontend, garantizando una experiencia de usuario interactiva y legible.
- Cache: Considerar implementar una capa de caché (ej. con Redis) para los endpoints de analítica, ya que los datos no cambian en tiempo real y las consultas pueden ser costosas. El caché se podría invalidar cada pocas horas o una vez al día.

