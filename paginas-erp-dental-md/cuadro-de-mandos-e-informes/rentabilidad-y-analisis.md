# Rentabilidad y Análisis

**Categoría:** Análisis y Reportes | **Módulo:** Cuadro de Mandos e Informes

La funcionalidad de 'Rentabilidad y Análisis' es el cerebro financiero del ERP dental, diseñada para proporcionar a los roles directivos y financieros una visión profunda y clara sobre la salud económica de la clínica. No se trata simplemente de un generador de informes estáticos, sino de un dashboard interactivo y dinámico que transforma los datos operativos diarios en inteligencia de negocio accionable. Este módulo agrega y procesa información de múltiples áreas del sistema: tratamientos realizados, pagos recibidos, gastos operativos (fijos y variables), comisiones de profesionales y adquisición de nuevos pacientes. A través de una interfaz visualmente intuitiva con gráficos, tablas dinámicas y Key Performance Indicators (KPIs), permite a los propietarios y gerentes identificar qué tratamientos son los más rentables, qué profesionales son los más productivos, cómo evolucionan los ingresos frente a los costos a lo largo del tiempo, y cuál es el costo de adquisición por paciente. Dentro de su módulo padre, 'Cuadro de Mandos e Informes', esta página representa el nivel más alto de análisis estratégico, permitiendo tomar decisiones informadas sobre precios, inversiones, estrategias de marketing y gestión de personal para maximizar la rentabilidad y asegurar el crecimiento sostenible del negocio dental.

## 👥 Roles de Acceso

- Propietario / Gerente
- Director / Admin general (multisede)
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/cuadro-de-mandos-informes/`

Esta funcionalidad reside dentro de la feature 'cuadro-de-mandos-informes'. La subcarpeta '/pages' contiene el archivo principal 'RentabilidadAnalisisPage.tsx' que renderiza la interfaz completa. La carpeta '/components' alberga todos los componentes reutilizables de esta página, como tarjetas de KPI, gráficos de barras y líneas, tablas de datos y filtros de fecha/sede. Finalmente, '/apis' contiene las funciones que encapsulan las llamadas a los endpoints del backend para obtener los datos analíticos, manteniendo la lógica de obtención de datos separada de la presentación.

### Archivos Frontend

- `/features/cuadro-de-mandos-informes/pages/RentabilidadAnalisisPage.tsx`

### Componentes React

- RentabilidadDashboard
- KpiCard
- GraficoRentabilidadTratamientos
- GraficoEvolucionIngresosCostos
- TablaRentabilidadProfesionales
- FiltroPeriodoTiempo
- SelectorSede

## 🔌 APIs Backend

Las APIs para esta sección están diseñadas para realizar cálculos y agregaciones complejas en el servidor, entregando al frontend datos ya procesados y listos para visualizar. Esto optimiza el rendimiento y minimiza la lógica en el cliente.

### `GET` `/api/analisis/rentabilidad/kpis`

Obtiene los principales Key Performance Indicators (KPIs) financieros para un período y sede determinados.

**Parámetros:** query.fechaInicio: string (YYYY-MM-DD), query.fechaFin: string (YYYY-MM-DD), query.sedeId: string (opcional)

**Respuesta:** JSON object con KPIs calculados: { ingresosTotales, costosTotales, margenBruto, ebitda, numeroPacientesNuevos, ticketPromedio }

### `GET` `/api/analisis/rentabilidad/por-tratamiento`

Devuelve un desglose de la rentabilidad por cada tipo de tratamiento.

**Parámetros:** query.fechaInicio: string (YYYY-MM-DD), query.fechaFin: string (YYYY-MM-DD), query.sedeId: string (opcional)

**Respuesta:** Array de objetos: [{ tratamientoNombre, ingresos, costosDirectos, margen, cantidadRealizados }]

### `GET` `/api/analisis/rentabilidad/por-profesional`

Analiza la facturación y rentabilidad generada por cada profesional.

**Parámetros:** query.fechaInicio: string (YYYY-MM-DD), query.fechaFin: string (YYYY-MM-DD), query.sedeId: string (opcional)

**Respuesta:** Array de objetos: [{ profesionalNombre, profesionalId, facturacionTotal, horasTrabajadas, facturacionPorHora }]

### `GET` `/api/analisis/rentabilidad/evolucion`

Proporciona datos para un gráfico de evolución de ingresos vs costos a lo largo del tiempo.

**Parámetros:** query.fechaInicio: string (YYYY-MM-DD), query.fechaFin: string (YYYY-MM-DD), query.sedeId: string (opcional), query.groupBy: string ('day', 'week', 'month')

**Respuesta:** Array de objetos: [{ periodo, ingresos, costos }]

## 🗂️ Estructura Backend (MERN)

El backend utiliza el patrón MVC. Las rutas definen los endpoints. Los controladores contienen la lógica de negocio, realizando consultas complejas a la base de datos a través de los modelos. Se hace un uso intensivo del 'Aggregation Pipeline' de MongoDB para procesar y agregar datos de diferentes colecciones de forma eficiente.

### Models

#### Pago

monto: Number, fecha: Date, tratamientoId: ObjectId, pacienteId: ObjectId, sedeId: ObjectId, metodoPago: String

#### Gasto

descripcion: String, monto: Number, categoria: String, fecha: Date, sedeId: ObjectId

#### Tratamiento

nombre: String, precioVenta: Number, costoMateriales: Number, costoLaboratorio: Number

#### Cita

fecha: Date, profesionalId: ObjectId, tratamientosRealizados: [ObjectId], estado: String ('Completada')

### Controllers

#### RentabilidadController

- getKpis
- getRentabilidadPorTratamiento
- getRentabilidadPorProfesional
- getEvolucionFinanciera

### Routes

#### `/api/analisis/rentabilidad`

- GET /kpis
- GET /por-tratamiento
- GET /por-profesional
- GET /evolucion

## 🔄 Flujos

1. El Gerente inicia sesión y navega a 'Cuadro de Mandos' -> 'Rentabilidad y Análisis'.
2. La página carga por defecto los datos del mes en curso, mostrando los KPIs principales y los gráficos poblados.
3. El usuario utiliza el selector de período para cambiar el rango de fechas a 'Último trimestre'. El frontend realiza nuevas llamadas a todas las APIs con las nuevas fechas y todos los componentes se actualizan dinámicamente.
4. El Director multisede usa el filtro de 'Sede' para aislar los datos de una clínica específica y comparar su rendimiento con el consolidado.
5. Al revisar la tabla de rentabilidad por tratamiento, el gerente identifica un tratamiento con bajo margen y decide analizar su estructura de costos o ajustar el precio de venta.

## 📝 User Stories

- Como Propietario de la clínica, quiero ver un dashboard con los KPIs más importantes (ingresos, gastos, beneficio) para entender la salud financiera de mi negocio de un solo vistazo.
- Como Gerente, quiero analizar qué tratamientos son los más rentables para enfocar las campañas de marketing y la formación del personal en esas áreas.
- Como Director multisede, quiero poder filtrar todos los datos de rentabilidad por clínica para comparar su desempeño e identificar mejores prácticas o áreas de mejora.
- Como Contable, quiero visualizar la evolución mensual de ingresos y gastos para realizar proyecciones financieras y detectar desviaciones presupuestarias.
- Como Propietario, quiero ver un ranking de facturación por profesional para evaluar su rendimiento y establecer políticas de incentivos justas y motivadoras.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial crear índices compuestos en la base de datos (MongoDB) sobre los campos 'fecha' y 'sedeId' en las colecciones de 'Pagos' y 'Gastos' para acelerar las consultas de agregación, que son la base de este módulo.
- Seguridad: Implementar una validación a nivel de API para asegurar que los usuarios solo puedan consultar datos de las sedes a las que tienen permiso. Un administrador general puede ver todo, pero un gerente de una sede específica solo puede ver los datos de su sede.
- Cache: Para dashboards que se consultan con frecuencia, considerar una estrategia de caché (ej. con Redis) para los endpoints. Los datos del 'mes pasado' o 'año en curso' pueden ser cacheados por varias horas para reducir la carga en la base de datos.
- Visualización de Datos: Utilizar una librería de gráficos como 'Recharts' o 'Chart.js' para React, que ofrecen buena interactividad (tooltips, leyendas dinámicas) y son performantes con datasets de tamaño moderado.
- Cálculos: Todos los cálculos complejos de rentabilidad (ej. EBITDA, márgenes) deben realizarse en el backend para garantizar la consistencia de los datos y no sobrecargar el navegador del cliente.

