# Indicadores de Facturación

**Categoría:** Análisis y Reportes | **Módulo:** Cuadro de Mandos e Informes

La página de 'Indicadores de Facturación' es un dashboard financiero interactivo diseñado para proporcionar una visión consolidada y en tiempo real de la salud económica de la clínica o red de clínicas. Su propósito principal es transformar los datos transaccionales brutos, como facturas y pagos, en métricas de rendimiento clave (KPIs) y visualizaciones gráficas que faciliten la toma de decisiones estratégicas. Dentro del módulo padre 'Cuadro de Mandos e Informes', esta funcionalidad actúa como el epicentro del análisis financiero, ofreciendo una vista de alto nivel que permite a directores y personal de finanzas monitorear tendencias, comparar periodos, evaluar el rendimiento por sede, profesional o tipo de tratamiento y detectar anomalías o áreas de mejora sin necesidad de bucear en reportes tabulares extensos. Funciona agregando datos de los módulos de Facturación, Pacientes y Tratamientos. El sistema recoge todas las facturas emitidas, los pagos registrados y los vincula a los profesionales que realizaron los tratamientos y a las sedes correspondientes. Mediante potentes agregaciones en el backend, calcula en tiempo real KPIs como el total facturado, el total cobrado, el saldo pendiente, el ticket medio por paciente y la facturación por hora clínica, presentando esta información de forma clara y accesible a través de gráficos de evolución, diagramas de tarta y tablas comparativas.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/cuadro-mandos-informes/`

Esta funcionalidad se encuentra dentro de la feature 'cuadro-mandos-informes'. La subcarpeta '/pages' contiene el componente principal 'IndicadoresFacturacionPage.tsx' que renderiza el dashboard. La subcarpeta '/components/indicadores-facturacion/' agrupa todos los componentes reutilizables específicos para este dashboard, como tarjetas para KPIs, gráficos de evolución, tablas de rendimiento, etc. Finalmente, la subcarpeta '/apis' contiene la lógica para realizar las llamadas a los endpoints del backend que proveen los datos agregados.

### Archivos Frontend

- `/features/cuadro-mandos-informes/pages/IndicadoresFacturacionPage.tsx`
- `/features/cuadro-mandos-informes/components/indicadores-facturacion/KPIFacturacionCard.tsx`
- `/features/cuadro-mandos-informes/components/indicadores-facturacion/GraficoFacturacionEvolutivo.tsx`
- `/features/cuadro-mandos-informes/components/indicadores-facturacion/GraficoFacturacionPorCategoria.tsx`
- `/features/cuadro-mandos-informes/components/indicadores-facturacion/TablaRendimientoProfesional.tsx`
- `/features/cuadro-mandos-informes/components/FiltroPeriodoSede.tsx`
- `/features/cuadro-mandos-informes/apis/informesFacturacionApi.ts`

### Componentes React

- IndicadoresFacturacionPage
- KPIFacturacionCard
- GraficoFacturacionEvolutivo
- GraficoFacturacionPorCategoria
- TablaRendimientoProfesional
- FiltroPeriodoSede

## 🔌 APIs Backend

Las APIs para esta página están diseñadas para ser altamente eficientes, devolviendo datos pre-agregados y calculados en la base de datos mediante el framework de agregación de MongoDB. Esto minimiza la carga en el cliente y el servidor, permitiendo una experiencia de usuario fluida y rápida al interactuar con los filtros.

### `GET` `/api/informes/facturacion/kpis-generales`

Obtiene los KPIs principales (Total Facturado, Pagos Recibidos, Saldo Pendiente, Ticket Medio) para un periodo y sedes seleccionadas.

**Parámetros:** fechaInicio (query string), fechaFin (query string), sedeIds (query string, array de IDs separados por coma)

**Respuesta:** Un objeto JSON con los KPIs calculados. ej: `{ totalFacturado: 150000, totalCobrado: 120000, saldoPendiente: 30000, ticketMedio: 250 }`

### `GET` `/api/informes/facturacion/evolutivo`

Devuelve la evolución de la facturación y los cobros agrupados por día, mes o año para el periodo y sedes seleccionadas.

**Parámetros:** fechaInicio (query string), fechaFin (query string), sedeIds (query string), agrupacion ('dia', 'mes', 'año')

**Respuesta:** Un array de objetos, cada uno representando un periodo. ej: `[{ periodo: '2023-01', facturado: 20000, cobrado: 18000 }, ...]`

### `GET` `/api/informes/facturacion/por-categoria-tratamiento`

Agrega la facturación por categoría de tratamiento en el periodo y sedes seleccionadas.

**Parámetros:** fechaInicio (query string), fechaFin (query string), sedeIds (query string)

**Respuesta:** Un array de objetos con el nombre de la categoría y el total facturado. ej: `[{ categoria: 'Implantología', total: 50000, porcentaje: 33.3 }, ...]`

### `GET` `/api/informes/facturacion/por-profesional`

Calcula el rendimiento de facturación (total facturado y número de tratamientos) por cada profesional.

**Parámetros:** fechaInicio (query string), fechaFin (query string), sedeIds (query string)

**Respuesta:** Un array de objetos con el nombre del profesional y su total facturado. ej: `[{ profesionalId: '...', nombre: 'Dr. Juan Pérez', totalFacturado: 60000 }, ...]`

## 🗂️ Estructura Backend (MERN)

El backend se apoya en los modelos Factura y Pago como fuentes primarias de datos. Se crea un controlador específico, 'InformeFacturacionController', que contiene la lógica de negocio para construir y ejecutar las complejas queries de agregación de MongoDB. Las rutas se agrupan bajo '/api/informes/facturacion' para mantener una estructura RESTful y organizada.

### Models

#### Factura

paciente (ObjectId, ref: 'Paciente'), sede (ObjectId, ref: 'Sede'), fechaEmision (Date), lineas ([{ tratamiento (ObjectId, ref: 'Tratamiento'), profesional (ObjectId, ref: 'Profesional'), descripcion (String), precio (Number), cantidad (Number), total (Number) }]), total (Number), estado (String: 'pendiente', 'pagada', 'anulada')

#### Pago

factura (ObjectId, ref: 'Factura'), paciente (ObjectId, ref: 'Paciente'), sede (ObjectId, ref: 'Sede'), fechaPago (Date), monto (Number), metodoPago (String)

### Controllers

#### InformeFacturacionController

- getKPIsGenerales
- getEvolutivoFacturacion
- getFacturacionPorCategoria
- getFacturacionPorProfesional

### Routes

#### `/api/informes/facturacion`

- GET /kpis-generales
- GET /evolutivo
- GET /por-categoria-tratamiento
- GET /por-profesional

## 🔄 Flujos

1. El Director o Contable accede al 'Cuadro de Mandos' y selecciona la opción 'Indicadores de Facturación'.
2. La página se carga con los datos por defecto (mes actual y todas las sedes asignadas al usuario). El frontend realiza múltiples llamadas asíncronas a los endpoints de la API para poblar cada componente (KPIs, gráficos, tablas).
3. El usuario interactúa con el componente de filtro 'FiltroPeriodoSede' para seleccionar un rango de fechas personalizado (ej. 'Último trimestre') y/o filtrar por una o varias sedes.
4. Al aplicar los filtros, el estado global de la aplicación (o del componente padre) se actualiza, lo que provoca que se realicen nuevas llamadas a la API con los nuevos parámetros de fecha y sedes.
5. Los componentes de visualización reciben las nuevas 'props' con los datos actualizados y se renderizan de nuevo, mostrando la información correspondiente a la nueva selección sin necesidad de recargar la página.

## 📝 User Stories

- Como Director, quiero ver los KPIs de facturación más importantes (total facturado, cobrado, pendiente) en la parte superior de la página para tener un pulso rápido del negocio.
- Como Contable, quiero ver un gráfico de la evolución de la facturación mensual a lo largo del último año para identificar patrones estacionales.
- Como Admin general multisede, quiero poder comparar la facturación total entre diferentes sedes en un periodo determinado para evaluar el rendimiento de cada una.
- Como Director, quiero visualizar un gráfico de tarta que muestre qué porcentaje de los ingresos proviene de cada categoría de tratamiento para orientar las inversiones y campañas de marketing.
- Como Contable, quiero acceder a una tabla con el total facturado por cada profesional para poder calcular las comisiones de forma eficiente.

## ⚙️ Notas Técnicas

- **Rendimiento del Backend:** Es crítico el uso intensivo de MongoDB Aggregation Pipeline. Las operaciones como `$match`, `$group`, `$lookup` y `$project` deben ejecutarse en la base de datos para minimizar la latencia y el consumo de memoria en el servidor Node.js.
- **Visualización de Datos:** Se recomienda el uso de librerías como 'Recharts' o 'Chart.js' (con 'react-chartjs-2') por su facilidad de integración con React, su buen rendimiento y sus capacidades de personalización para crear gráficos interactivos y visualmente atractivos.
- **Seguridad y Autorización:** Todos los endpoints de `/api/informes` deben estar protegidos por un middleware que verifique la autenticación del usuario y su rol. Las consultas a la base de datos deben incluir siempre un filtro por las sedes a las que el usuario tiene acceso para evitar la fuga de datos entre clínicas.
- **Estado del Frontend:** Utilizar un gestor de estado como Redux Toolkit, Zustand o incluso React Context API para manejar los filtros (fecha, sedes) de forma centralizada. Esto permite que todos los componentes del dashboard reaccionen consistentemente a los cambios del usuario.
- **Optimización de Carga:** Para mejorar la percepción de velocidad, se pueden cargar los componentes del dashboard de forma progresiva. Por ejemplo, mostrar primero los KPIs (que suelen ser más rápidos de calcular) y luego los gráficos más complejos, utilizando indicadores de carga ('skeletons' o 'spinners') en cada componente.

