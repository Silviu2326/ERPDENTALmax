# Cuadro de Mandos por Sede

**Categoría:** Multi-sede | **Módulo:** Multi-sede y Franquicias

El 'Cuadro de Mandos por Sede' es una herramienta de visualización de datos y Business Intelligence diseñada específicamente para la alta dirección de una red de clínicas dentales. Su propósito principal es ofrecer una vista panorámica, comparativa y consolidada del rendimiento de todas las sedes o franquicias desde una única interfaz. A diferencia de los dashboards operativos de una clínica individual, que se centran en el día a día, este cuadro de mandos se enfoca en métricas clave (KPIs) a nivel estratégico. Permite a los directores, propietarios y gerentes generales evaluar la salud financiera, la eficiencia operativa y el crecimiento de cada ubicación, facilitando la identificación de tendencias, oportunidades de mejora y clínicas de alto o bajo rendimiento. Funciona agregando datos transaccionales de todos los demás módulos del ERP (Facturación, Agenda, Pacientes, Tratamientos) y los presenta agrupados por sede. De esta manera, se pueden comparar directamente métricas como ingresos totales, número de nuevos pacientes, tasa de ocupación de gabinetes, ticket promedio por paciente y rentabilidad por tratamiento entre las diferentes clínicas de la organización, todo ello filtrable por periodos de tiempo personalizables. Es el centro neurálgico para la toma de decisiones estratégicas en el módulo 'Multi-sede y Franquicias'.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Propietario / Gerente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/multi-sede-franquicias/`

Esta funcionalidad se aloja dentro de la feature 'multi-sede-franquicias'. La subcarpeta '/pages' contiene el componente principal 'DashboardSedesPage.tsx' que renderiza la vista completa. La carpeta '/components' alberga los elementos reutilizables de la UI, como tarjetas de KPIs, gráficos comparativos y selectores de fecha/sede. Finalmente, '/apis' define la función que realiza la llamada al backend para obtener los datos agregados de todas las sedes.

### Archivos Frontend

- `/features/multi-sede-franquicias/pages/DashboardSedesPage.tsx`
- `/features/multi-sede-franquicias/components/SelectorSedesPeriodo.tsx`
- `/features/multi-sede-franquicias/components/KPICardSede.tsx`
- `/features/multi-sede-franquicias/components/ComparativaSedesChart.tsx`
- `/features/multi-sede-franquicias/components/TablaRendimientoSedes.tsx`
- `/features/multi-sede-franquicias/apis/dashboardSedesApi.ts`

### Componentes React

- DashboardSedesPage
- SelectorSedesPeriodo
- KPICardSede
- ComparativaSedesChart
- TablaRendimientoSedes

## 🔌 APIs Backend

Las APIs para esta página deben ser capaces de realizar agregaciones complejas de datos a través de múltiples colecciones (Facturas, Citas, Pacientes), agrupar los resultados por sede y devolver un resumen consolidado. Deben soportar filtrado por rango de fechas y por sedes específicas.

### `GET` `/api/dashboard/sedes/summary`

Obtiene los KPIs y datos agregados para una o varias sedes en un rango de fechas. Es el endpoint principal que alimenta todo el cuadro de mandos.

**Parámetros:** startDate: string (query, formato YYYY-MM-DD), endDate: string (query, formato YYYY-MM-DD), sedeIds: string (query, opcional, IDs de sedes separadas por coma)

**Respuesta:** Un array de objetos, donde cada objeto representa una sede y contiene sus KPIs calculados. Ejemplo: [{ sedeId: '...', nombreSede: '...', totalIngresos: 50000, nuevosPacientes: 45, citasAtendidas: 250, tasaOcupacion: 0.85 }]

### `GET` `/api/sedes`

Obtiene una lista de todas las sedes disponibles en el sistema para poblar los filtros de selección.

**Respuesta:** Un array de objetos de sedes. Ejemplo: [{ _id: '...', nombre: 'Sede Central' }]

## 🗂️ Estructura Backend (MERN)

El backend no requiere modelos nuevos para esta funcionalidad, sino que consulta modelos existentes. La lógica principal reside en el 'DashboardSedeController', que utiliza el framework de agregación de MongoDB para procesar eficientemente los datos de las colecciones 'Factura', 'Paciente' y 'Cita', agrupándolos por el campo 'sedeId'.

### Models

#### Sede

_id: ObjectId, nombre: String, direccion: Object, activa: Boolean

#### Factura

_id: ObjectId, sedeId: { type: ObjectId, ref: 'Sede' }, pacienteId: ObjectId, total: Number, fechaCreacion: Date, estado: String

#### Paciente

_id: ObjectId, sedeId: { type: ObjectId, ref: 'Sede' }, nombre: String, fechaRegistro: Date

#### Cita

_id: ObjectId, sedeId: { type: ObjectId, ref: 'Sede' }, fechaHoraInicio: Date, duracionMinutos: Number, estado: String ('atendida', 'cancelada', etc.)

### Controllers

#### DashboardSedeController

- getSedesSummary

#### SedeController

- getAllSedes

### Routes

#### `/api/dashboard/sedes`

- GET /summary

#### `/api/sedes`

- GET /

## 🔄 Flujos

1. El Director accede al módulo 'Multi-sede y Franquicias' y selecciona 'Cuadro de Mandos por Sede'.
2. La página carga por defecto con los datos consolidados de todas las sedes para el mes en curso.
3. El sistema realiza una llamada a la API GET /api/dashboard/sedes/summary con el rango de fechas actual.
4. El usuario utiliza el componente 'SelectorSedesPeriodo' para filtrar por 'Último trimestre' y selecciona dos sedes específicas para comparar.
5. La interfaz actualiza los componentes de gráficos y tablas realizando una nueva llamada a la API con los parámetros de fecha y sedes seleccionadas.
6. El usuario puede pasar el cursor sobre un gráfico para ver detalles específicos de una métrica para una sede en particular.

## 📝 User Stories

- Como Director General, quiero ver un gráfico de barras que compare los ingresos totales de cada sede en el último semestre para tomar decisiones sobre inversiones y presupuestos.
- Como Propietario de la franquicia, quiero una tabla que muestre el número de nuevos pacientes, el ticket promedio y la tasa de cancelación de citas por sede, para evaluar el desempeño de los gerentes de cada clínica.
- Como Gerente de expansión, quiero ver la tasa de ocupación de las agendas de los doctores en las sedes más nuevas para determinar si es necesario contratar más personal.
- Como Director, quiero poder filtrar rápidamente los datos por cualquier rango de fechas para generar informes de rendimiento para las reuniones de la junta directiva.

## ⚙️ Notas Técnicas

- Rendimiento: Las consultas de agregación pueden ser intensivas. Es crucial tener índices en los campos `sedeId` y los campos de fecha (`fechaCreacion`, `fechaHoraInicio`, `fechaRegistro`) en las colecciones correspondientes para optimizar la velocidad.
- Caching: Se recomienda implementar una estrategia de caché (ej. con Redis) en el backend para los resultados de la API `/api/dashboard/sedes/summary`. Los datos de periodos cerrados (como 'mes pasado' o 'año pasado') no cambian, por lo que son candidatos perfectos para el caché, reduciendo drásticamente la carga sobre MongoDB.
- Seguridad: La API debe estar protegida por un middleware que verifique el rol del usuario. Además, debe filtrar los resultados para mostrar únicamente las sedes a las que el usuario autenticado tiene permiso de acceso, evitando fugas de información entre franquiciados.
- Visualización de Datos: Utilizar librerías como Chart.js, Recharts o D3.js en el frontend para crear visualizaciones interactivas y fáciles de entender. Asegurar que los gráficos sean responsive y legibles en diferentes tamaños de pantalla.
- Real-time: Para una experiencia más dinámica, se podría explorar el uso de WebSockets para actualizar ciertos KPIs en tiempo real, aunque para un cuadro de mandos estratégico, la actualización bajo demanda suele ser suficiente.

