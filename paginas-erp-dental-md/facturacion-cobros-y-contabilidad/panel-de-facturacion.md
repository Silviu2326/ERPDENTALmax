# Panel de Facturación

**Categoría:** Gestión Financiera | **Módulo:** Facturación, Cobros y Contabilidad

El Panel de Facturación es el centro neurálgico del módulo de 'Facturación, Cobros y Contabilidad' dentro del ERP dental. Funciona como un dashboard ejecutivo y operativo que proporciona una visión panorámica y en tiempo real de la salud financiera de la clínica. Su propósito principal es consolidar y presentar de manera visual e intuitiva los indicadores clave de rendimiento (KPIs) financieros más relevantes. Esto incluye el total facturado, el total cobrado, el saldo pendiente de cobro, y el número de facturas por estado (pagadas, pendientes, vencidas). Este panel no es solo un reporte estático; es una herramienta interactiva que permite a los usuarios filtrar la información por rangos de fecha y, en el caso de clínicas con múltiples ubicaciones, por sede. Para un gerente o propietario, este panel es fundamental para la toma de decisiones estratégicas, permitiendo identificar rápidamente tendencias de ingresos y problemas en el ciclo de cobros. Para el personal contable y de recepción, facilita el seguimiento diario, la conciliación de pagos y la gestión proactiva de la cobranza. Centraliza la información generada desde otros módulos, como los tratamientos realizados en la ficha del paciente y las citas en la agenda, transformando datos operativos en inteligencia financiera accionable a través de gráficos y tablas resumidas.

## 👥 Roles de Acceso

- Contable / Finanzas
- Director / Admin general (multisede)
- Propietario / Gerente
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/facturacion-cobros-contabilidad/`

Toda la lógica de frontend para el módulo padre 'Facturación, Cobros y Contabilidad' se encuentra en la carpeta '/features/facturacion-cobros-contabilidad/'. La página principal de este panel se define en '/pages/FacturacionDashboardPage.tsx'. Esta página ensambla varios componentes reutilizables ubicados en la carpeta '/components/', como tarjetas para KPIs (DashboardKpiCard), gráficos de barras/líneas para ingresos (IngresosPorPeriodoChart), gráficos circulares para el estado de las facturas (EstadoFacturasPieChart) y tablas de datos (FacturasRecientesTable). Las llamadas a la API del backend se gestionan a través de funciones centralizadas en el archivo '/apis/facturacionApi.ts', manteniendo la lógica de fetching separada de los componentes de la UI.

### Archivos Frontend

- `/features/facturacion-cobros-contabilidad/pages/FacturacionDashboardPage.tsx`
- `/features/facturacion-cobros-contabilidad/components/DashboardKpiCard.tsx`
- `/features/facturacion-cobros-contabilidad/components/FacturasRecientesTable.tsx`
- `/features/facturacion-cobros-contabilidad/components/IngresosPorPeriodoChart.tsx`
- `/features/facturacion-cobros-contabilidad/components/EstadoFacturasPieChart.tsx`
- `/features/facturacion-cobros-contabilidad/components/FiltroFechaDashboard.tsx`
- `/features/facturacion-cobros-contabilidad/apis/facturacionApi.ts`

### Componentes React

- FacturacionDashboardPage
- DashboardKpiCard
- FacturasRecientesTable
- IngresosPorPeriodoChart
- EstadoFacturasPieChart
- FiltroFechaDashboard

## 🔌 APIs Backend

Las APIs para el Panel de Facturación deben ser altamente eficientes, ya que agregarán datos financieros que pueden abarcar grandes volúmenes de documentos. Se basarán en el framework de agregación de MongoDB para calcular KPIs y datos para gráficos directamente en la base de datos, minimizando la carga en el servidor de aplicaciones. Todos los endpoints deben soportar filtrado por rango de fechas y por sede (`sedeId`) para adaptarse a los diferentes roles y necesidades de análisis.

### `GET` `/api/facturacion/dashboard/kpis`

Obtiene los indicadores clave de rendimiento (KPIs) financieros para el panel, como total facturado, total cobrado y saldo pendiente.

**Parámetros:** query.fechaInicio (string, formato YYYY-MM-DD), query.fechaFin (string, formato YYYY-MM-DD), query.sedeId (string, opcional)

**Respuesta:** JSON con los valores de los KPIs: { totalFacturado: number, totalCobrado: number, saldoPendiente: number, facturasPendientes: number }

### `GET` `/api/facturacion/dashboard/ingresos-periodo`

Devuelve datos agregados de ingresos para el gráfico de líneas/barras, agrupados por día, semana o mes.

**Parámetros:** query.fechaInicio (string, formato YYYY-MM-DD), query.fechaFin (string, formato YYYY-MM-DD), query.agrupacion ('dia' | 'semana' | 'mes'), query.sedeId (string, opcional)

**Respuesta:** Array de objetos: [{ periodo: string, ingresos: number, cobros: number }, ...]

### `GET` `/api/facturacion/dashboard/estado-facturas`

Proporciona un resumen del número de facturas por estado (Pagada, Pendiente, Vencida, Anulada) para el gráfico circular.

**Parámetros:** query.fechaInicio (string, formato YYYY-MM-DD), query.fechaFin (string, formato YYYY-MM-DD), query.sedeId (string, opcional)

**Respuesta:** JSON con el recuento por estado: { pagada: number, pendiente: number, vencida: number, anulada: number }

### `GET` `/api/facturacion/recientes`

Obtiene una lista paginada de las facturas más recientes para mostrar en la tabla del panel.

**Parámetros:** query.limit (number, default 10), query.page (number, default 1), query.sedeId (string, opcional)

**Respuesta:** Objeto con paginación y un array de documentos de Factura: { data: [Factura], total: number, page: number, limit: number }

## 🗂️ Estructura Backend (MERN)

El backend utilizará modelos de Mongoose para 'Factura' y 'Pago'. La lógica de negocio se concentrará en un 'FacturacionDashboardController' que contendrá funciones específicas para las agregaciones complejas requeridas por el panel. Estas funciones utilizarán el pipeline de agregación de MongoDB para un rendimiento óptimo. Las rutas estarán definidas en un archivo dedicado bajo '/api/facturacion' para mantener la organización.

### Models

#### Factura

numeroFactura: String, paciente: ObjectId (ref: Paciente), sede: ObjectId (ref: Sede), fechaEmision: Date, fechaVencimiento: Date, items: [{ descripcion: String, cantidad: Number, precioUnitario: Number, total: Number }], total: Number, estado: String ('Pagada', 'Pendiente', 'Vencida', 'Anulada'), pagos: [ObjectId (ref: Pago)], totalPagado: Number

#### Pago

factura: ObjectId (ref: Factura), fechaPago: Date, monto: Number, metodoPago: String, sede: ObjectId (ref: Sede)

### Controllers

#### FacturacionDashboardController

- getDashboardKpis
- getIngresosPorPeriodo
- getEstadoFacturasSummary

#### FacturaController

- getFacturasRecientes

### Routes

#### `/api/facturacion`

- GET /dashboard/kpis
- GET /dashboard/ingresos-periodo
- GET /dashboard/estado-facturas
- GET /recientes

## 🔄 Flujos

1. El usuario (ej. Gerente) accede al Panel de Facturación. El frontend realiza llamadas iniciales a los endpoints del dashboard con el rango de fechas por defecto (ej. último mes).
2. Los componentes del panel (KPIs, gráficos, tabla) se renderizan con la información recibida.
3. El usuario interactúa con el componente de filtro de fechas para seleccionar un trimestre. El frontend actualiza su estado y vuelve a ejecutar las llamadas a la API con las nuevas fechas.
4. El panel se actualiza dinámicamente sin recargar la página, mostrando los datos correspondientes al trimestre seleccionado.
5. Un Administrador multisede utiliza un selector desplegable para filtrar por una clínica específica. Las llamadas a la API incluyen ahora el parámetro `sedeId` y el panel refleja exclusivamente las finanzas de esa ubicación.
6. Desde la tabla de 'Facturas Recientes', el usuario hace clic en el número de una factura, lo que le redirige a la página de detalle de esa factura para ver más información o registrar un pago.

## 📝 User Stories

- Como Propietario de la clínica, quiero ver en el panel principal el total facturado vs. el total cobrado del último mes para evaluar rápidamente la eficiencia de mi ciclo de ingresos.
- Como Contable, quiero visualizar un gráfico de barras con los ingresos diarios de la última semana para preparar el informe de cierre de caja.
- Como personal de Recepción, quiero tener una tabla con las 10 últimas facturas emitidas y su estado para poder informar a los pacientes sobre sus saldos pendientes cuando llaman o acuden a la clínica.
- Como Director multisede, quiero poder cambiar de sede en el panel de facturación para comparar el rendimiento financiero y los ratios de cobranza entre mis diferentes clínicas.
- Como Gerente, quiero ver un gráfico circular que me muestre el porcentaje de facturas pagadas, pendientes y vencidas para poder priorizar las acciones de cobranza sobre las deudas más antiguas.

## ⚙️ Notas Técnicas

- **Rendimiento del Backend:** Es crucial el uso intensivo del Aggregation Framework de MongoDB. Las operaciones de suma y conteo para los KPIs y gráficos deben realizarse en la base de datos para minimizar la latencia y el consumo de memoria del servidor Node.js.
- **Seguridad de Acceso:** Implementar un middleware en las rutas del backend para verificar el rol del usuario y su acceso a las sedes. Un gerente de una sede no debe poder consultar datos de otra sede, incluso si manipula el `sedeId` en la petición.
- **Visualización de Datos:** Utilizar la librería 'Recharts' o 'Chart.js' en React para crear los gráficos. Asegurarse de que sean responsivos y ofrezcan tooltips interactivos para una mejor experiencia de usuario.
- **Gestión de Estado Frontend:** Emplear una librería como React Query o SWR para gestionar el estado del servidor. Esto simplificará el fetching de datos, el manejo de estados de carga/error y el cacheo, mejorando la UX al cambiar los filtros de fecha/sede.
- **Optimización de Índices:** Asegurar que los campos utilizados para filtrar y agregar en las consultas del panel (ej. `fechaEmision`, `sede`, `estado` en la colección de Facturas) tengan los índices adecuados en MongoDB para garantizar consultas rápidas.

