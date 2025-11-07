# Producción por Profesional (Box)

**Categoría:** Análisis y Reportes | **Módulo:** Analítica Avanzada & Data

La funcionalidad de 'Producción por Profesional (Box)' es una herramienta de inteligencia de negocio avanzada dentro del módulo de 'Analítica Avanzada & Data'. Su objetivo principal es proporcionar a los directivos y gerentes una visión detallada y analítica de la producción (ingresos generados) de cada profesional dental, desglosada por box o consultorio asignado. Esta funcionalidad va más allá de un simple reporte de facturación: permite analizar la eficiencia del uso de recursos físicos (boxes), identificar patrones de productividad, comparar el rendimiento entre profesionales y boxes, y tomar decisiones estratégicas sobre la asignación de recursos y la optimización de la capacidad operativa de la clínica. A través de un dashboard interactivo, los usuarios pueden visualizar métricas clave como la producción total por profesional, la producción por box, la utilización de boxes, comparativas entre profesionales y análisis de tendencias temporales. Permite filtrar los datos por rangos de fechas, sedes, boxes específicos, profesionales o especialidades. El sistema presenta esta información mediante gráficos comparativos, tablas detalladas, mapas de calor de utilización de boxes y análisis de correlación entre producción y utilización de recursos. Esta herramienta es fundamental para la gestión estratégica de la clínica, ayudando a identificar oportunidades de optimización, planificar la asignación de boxes y profesionales, y evaluar el retorno de inversión de cada recurso físico.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Propietario / Gerente
- RR. HH.

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/analitica-avanzada-data/`

Esta funcionalidad se encuentra dentro de la feature 'analitica-avanzada-data'. La página principal, 'ProduccionPorProfesionalBoxPage.tsx', reside en la subcarpeta '/pages/'. Esta página importa y organiza diversos componentes React reutilizables desde la subcarpeta '/components/', como filtros, gráficos comparativos, tablas de datos y visualizaciones de utilización de boxes. La lógica para obtener los datos del backend se encapsula en funciones dentro de la subcarpeta '/apis/', que se encargan de realizar las llamadas a los endpoints de la API RESTful correspondientes.

### Archivos Frontend

- `/features/analitica-avanzada-data/pages/ProduccionPorProfesionalBoxPage.tsx`
- `/features/analitica-avanzada-data/components/FiltrosProduccionBox.tsx`
- `/features/analitica-avanzada-data/components/IndicadoresProduccionBox.tsx`
- `/features/analitica-avanzada-data/components/GraficoComparativoProfesionales.tsx`
- `/features/analitica-avanzada-data/components/GraficoProduccionPorBox.tsx`
- `/features/analitica-avanzada-data/components/TablaDetalleProduccionBox.tsx`
- `/features/analitica-avanzada-data/components/MapaCalorUtilizacionBox.tsx`
- `/features/analitica-avanzada-data/apis/analiticaApi.ts`

### Componentes React

- ProduccionPorProfesionalBoxPage
- FiltrosProduccionBox
- IndicadoresProduccionBox
- GraficoComparativoProfesionales
- GraficoProduccionPorBox
- TablaDetalleProduccionBox
- MapaCalorUtilizacionBox
- SelectorBox
- SelectorProfesional

## 🔌 APIs Backend

El backend provee una serie de endpoints RESTful diseñados para entregar datos agregados y pre-procesados, optimizados para el análisis de producción por profesional y box. Estos endpoints utilizan el pipeline de agregación de MongoDB para realizar cálculos complejos en la base de datos y devolver solo la información necesaria para los componentes del frontend.

### `GET` `/api/analitica/produccion-box/kpis`

Obtiene los indicadores de rendimiento clave (KPIs) sobre la producción por profesional y box, como la producción total, producción promedio por profesional, utilización de boxes y producción por box, para un periodo y filtros determinados.

**Parámetros:** query.fechaInicio: string (ISO Date), query.fechaFin: string (ISO Date), query.sedeId: string (Opcional), query.profesionalId: string (Opcional), query.boxId: string (Opcional)

**Respuesta:** JSON con KPIs: { produccionTotal: number, produccionPromedioProfesional: number, utilizacionBoxes: number, produccionPorBox: number, totalProfesionales: number, totalBoxes: number }

### `GET` `/api/analitica/produccion-box/profesionales`

Obtiene los datos de producción agregados por profesional, incluyendo la producción total, número de citas, horas trabajadas y producción por box asignado.

**Parámetros:** query.fechaInicio: string (ISO Date), query.fechaFin: string (ISO Date), query.sedeId: string (Opcional), query.boxId: string (Opcional), query.especialidad: string (Opcional)

**Respuesta:** Array de objetos: [{ profesionalId: string, nombreCompleto: string, especialidad: string, produccionTotal: number, numeroCitas: number, horasTrabajadas: number, boxesAsignados: [string], produccionPorBox: { boxId: string, boxNombre: string, produccion: number }[] }]

### `GET` `/api/analitica/produccion-box/boxes`

Obtiene los datos de producción agregados por box, incluyendo la producción total, utilización, profesionales asignados y producción promedio por profesional.

**Parámetros:** query.fechaInicio: string (ISO Date), query.fechaFin: string (ISO Date), query.sedeId: string (Opcional), query.boxId: string (Opcional)

**Respuesta:** Array de objetos: [{ boxId: string, boxNombre: string, sedeId: string, produccionTotal: number, utilizacionPorcentaje: number, horasDisponibles: number, horasUtilizadas: number, profesionalesAsignados: [string], produccionPromedioProfesional: number }]

### `GET` `/api/analitica/produccion-box/comparativa`

Obtiene datos comparativos entre profesionales o boxes para visualización en gráficos comparativos.

**Parámetros:** query.fechaInicio: string (ISO Date), query.fechaFin: string (ISO Date), query.sedeId: string (Opcional), query.tipoComparacion: string ('profesionales' | 'boxes'), query.limit: number (default 10)

**Respuesta:** Array de objetos ordenados por producción: [{ id: string, nombre: string, produccion: number, porcentaje: number }]

### `GET` `/api/analitica/produccion-box/evolucion`

Devuelve una serie temporal de datos para visualizar la evolución de la producción por profesional o box en un gráfico.

**Parámetros:** query.fechaInicio: string (ISO Date), query.fechaFin: string (ISO Date), query.sedeId: string (Opcional), query.profesionalId: string (Opcional), query.boxId: string (Opcional), query.agrupacion: string ('dia' | 'semana' | 'mes')

**Respuesta:** Array de objetos: [{ fecha: string, produccion: number, profesionalId?: string, boxId?: string }]

### `GET` `/api/analitica/produccion-box/utilizacion-calor`

Obtiene datos de utilización de boxes organizados para visualización en un mapa de calor, mostrando la utilización por día de la semana y franja horaria.

**Parámetros:** query.fechaInicio: string (ISO Date), query.fechaFin: string (ISO Date), query.sedeId: string (Opcional), query.boxId: string (Opcional)

**Respuesta:** Array de objetos: [{ diaSemana: number, franjaHoraria: string, utilizacionPorcentaje: number, produccion: number }]

## 🗂️ Estructura Backend (MERN)

La lógica del backend para esta funcionalidad reside en un controlador específico ('AnaliticaController') que contiene los métodos para procesar las peticiones. Estos métodos construyen y ejecutan consultas de agregación complejas sobre los modelos 'Cita', 'Box', 'Usuario' y 'Tratamiento' de MongoDB. Las rutas se definen en un archivo de rutas dedicado bajo el prefijo '/api/analitica/produccion-box'.

### Models

#### Cita

Contiene los campos clave para el análisis: { paciente: ObjectId, profesional: ObjectId, box: ObjectId, sede: ObjectId, fechaHoraInicio: Date, fechaHoraFin: Date, estado: String ('Realizada', 'Cancelada', 'No Asistió'), tratamientos: [ObjectId], duracionMinutos: Number, produccion: Number }

#### Box

Modelo para los boxes/consultorios: { nombre: String, numero: String, sedeId: ObjectId, activo: Boolean, tipo: String }

#### Usuario

Información del profesional: { nombre: String, apellido: String, rol: String, especialidad: String, sedeId: ObjectId, boxesAsignados: [ObjectId] }

#### Tratamiento

Se referencia desde el modelo Cita para calcular la producción: { nombre: String, precio: Number, areaClinica: String }

### Controllers

#### AnaliticaController

- getProduccionBoxKPIs
- getProduccionBoxProfesionales
- getProduccionBoxBoxes
- getProduccionBoxComparativa
- getProduccionBoxEvolucion
- getProduccionBoxUtilizacionCalor

### Routes

#### `/api/analitica/produccion-box`

- GET /kpis
- GET /profesionales
- GET /boxes
- GET /comparativa
- GET /evolucion
- GET /utilizacion-calor

## 🔄 Flujos

1. El Director accede a la sección 'Producción por Profesional (Box)' desde el menú de 'Analítica Avanzada & Data'.
2. Por defecto, la página carga los datos del último mes para todas las sedes y boxes.
3. El frontend realiza llamadas a los endpoints '/kpis', '/profesionales', '/boxes' y '/comparativa' para poblar los componentes del dashboard.
4. El Director utiliza el componente de filtros para acotar el análisis a una sede específica, un rango de fechas del último trimestre y un box específico.
5. Al cambiar los filtros, se disparan nuevas llamadas a la API con los nuevos parámetros y los gráficos y tablas se actualizan dinámicamente.
6. El Director visualiza el mapa de calor de utilización de boxes para identificar patrones de uso y oportunidades de optimización.
7. El Gerente exporta un reporte detallado de producción por profesional para una reunión de evaluación de desempeño.

## 📝 User Stories

- Como Director, quiero visualizar un dashboard con la producción total por profesional y por box para poder comparar el rendimiento y tomar decisiones sobre asignación de recursos.
- Como Propietario / Gerente, quiero identificar qué boxes tienen mayor utilización y producción para optimizar la asignación de profesionales y recursos.
- Como Director multisede, quiero comparar la producción por box entre diferentes sedes para estandarizar procesos y replicar mejores prácticas.
- Como responsable de RR. HH., quiero generar reportes de producción por profesional en un período específico para evaluaciones de desempeño y decisiones sobre compensaciones.
- Como Gerente, quiero visualizar la evolución temporal de la producción por box para identificar tendencias y planificar mejoras operativas.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial que los campos 'fechaHoraInicio', 'fechaHoraFin', 'box', 'profesional', 'sede' y 'estado' en el modelo 'Cita' estén indexados en MongoDB para acelerar las consultas de agregación. También se recomiendan índices compuestos para consultas que combinen múltiples campos.
- Cálculo de Producción: La producción se calcula sumando el valor de los tratamientos realizados en citas con estado 'Realizada'. Esto requiere una operación `$lookup` en el pipeline de agregación para unir las colecciones 'citas' y 'tratamientos'.
- Cálculo de Utilización: La utilización de boxes se calcula como el porcentaje de horas utilizadas sobre horas disponibles en el período seleccionado. Las horas disponibles se basan en la configuración de horarios de cada box.
- Seguridad: La API debe implementar un middleware de autorización que verifique el rol del usuario. Además, para los roles que no sean 'Director / Admin general', los datos deben ser filtrados automáticamente por la(s) sede(s) a la(s) que el usuario tiene acceso.
- Visualización de Datos: Se recomienda el uso de librerías como Recharts o Chart.js para renderizar los gráficos en el frontend, garantizando una experiencia de usuario interactiva y legible. Para mapas de calor, considerar librerías especializadas como react-heatmap-grid.
- Cache: Considerar implementar una capa de caché (ej. con Redis) para los endpoints de analítica, ya que los datos no cambian en tiempo real y las consultas pueden ser costosas. El caché se podría invalidar cada pocas horas o una vez al día.
- Exportación: Implementar funcionalidad de exportación a CSV y PDF para permitir a los usuarios generar reportes personalizados para reuniones y análisis externos.



