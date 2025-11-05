# Dashboard Principal

**Categoría:** Análisis y Reportes | **Módulo:** Cuadro de Mandos e Informes

El Dashboard Principal es la página de inicio y el centro neurálgico para los roles de alta dirección dentro del ERP dental. Funciona como un panel de control visual e interactivo que consolida y presenta los Indicadores Clave de Rendimiento (KPIs) más importantes de la clínica o del conjunto de clínicas. Su propósito fundamental es ofrecer una visión panorámica, clara y en tiempo real del estado del negocio, permitiendo a los propietarios, gerentes y directores tomar decisiones estratégicas informadas de manera rápida y eficiente. Este dashboard agrega y sintetiza datos de múltiples módulos del sistema, como Agenda (citas programadas, canceladas, asistencias), Facturación (ingresos, pagos pendientes), Pacientes (nuevos registros, demografía) y Tratamientos (procedimientos más realizados o rentables). A través de gráficos, medidores y tarjetas de KPIs, los usuarios pueden monitorizar la salud financiera, la eficiencia operativa, la captación de pacientes y la productividad del personal. Como parte integral del módulo 'Cuadro de Mandos e Informes', el Dashboard Principal actúa como el punto de partida para análisis más profundos; cada métrica presentada puede ser un enlace a informes más detallados dentro del mismo módulo, permitiendo un desglose granular de la información.

## 👥 Roles de Acceso

- Propietario / Gerente
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/cuadro-mandos-informes/`

Toda la lógica de esta funcionalidad reside en la carpeta '/features/cuadro-mandos-informes/'. La página principal, 'DashboardPrincipalPage.tsx', se encuentra en la subcarpeta '/pages' y actúa como el contenedor principal. Esta página importa y organiza múltiples componentes reutilizables desde '/components/', como 'KPIWidget', 'RevenueChart', 'AppointmentStatusPieChart', etc. La obtención de datos se gestiona a través de hooks personalizados que utilizan funciones definidas en '/apis/dashboardAPI.ts', las cuales se encargan de realizar las llamadas al backend para obtener la información consolidada.

### Archivos Frontend

- `/features/cuadro-mandos-informes/pages/DashboardPrincipalPage.tsx`
- `/features/cuadro-mandos-informes/components/KPIWidget.tsx`
- `/features/cuadro-mandos-informes/components/DateRangePicker.tsx`
- `/features/cuadro-mandos-informes/components/ClinicSelector.tsx`
- `/features/cuadro-mandos-informes/components/RevenueChart.tsx`
- `/features/cuadro-mandos-informes/components/AppointmentStatusPieChart.tsx`
- `/features/cuadro-mandos-informes/components/TopTreatmentsList.tsx`
- `/features/cuadro-mandos-informes/apis/dashboardAPI.ts`

### Componentes React

- DashboardPrincipalPage
- KPIWidget
- DateRangePicker
- ClinicSelector
- RevenueChart
- AppointmentStatusPieChart
- TopTreatmentsList
- OccupancyRateIndicator

## 🔌 APIs Backend

El backend expone un endpoint principal y optimizado para el dashboard. Este endpoint utiliza el Aggregation Framework de MongoDB para recopilar, procesar y resumir datos de múltiples colecciones (citas, pagos, pacientes) en una única respuesta, evitando así múltiples llamadas desde el frontend y mejorando el rendimiento de la carga inicial.

### `GET` `/api/dashboard/summary`

Obtiene todos los datos agregados necesarios para el Dashboard Principal para un rango de fechas y una clínica específica (o todas). Consolida KPIs, datos para gráficos y listas en una única llamada.

**Parámetros:** startDate: string (Formato ISO 8601, ej: '2023-10-26T00:00:00.000Z'), endDate: string (Formato ISO 8601, ej: '2023-11-25T23:59:59.999Z'), clinicId: string (Opcional. Si no se proporciona, se agregan los datos de todas las clínicas a las que el usuario tiene acceso)

**Respuesta:** Un objeto JSON que contiene los datos pre-procesados para el dashboard, ej: { kpis: { totalRevenue, newPatients, completedAppointments, showRate }, chartsData: { revenueTimeline: [...], appointmentStatus: [...] }, lists: { topPerformingTreatments: [...], topProfessionals: [...] } }

## 🗂️ Estructura Backend (MERN)

La lógica del backend para el dashboard se concentra en un 'DashboardController' que no tiene un modelo propio, sino que orquesta la lectura de datos de otros modelos como Cita, Pago, Paciente y Tratamiento. Utiliza consultas de agregación complejas para generar los resúmenes requeridos por el frontend.

### Models

#### Cita

Campos relevantes: fecha, estado ('completada', 'cancelada', 'no_asistio'), profesionalId, pacienteId, tratamientoId, clinicId, duracionMinutos

#### Pago

Campos relevantes: monto, fecha, pacienteId, tratamientoId, clinicId

#### Paciente

Campos relevantes: fechaRegistro, clinicId

#### Tratamiento

Campos relevantes: nombre, precio

### Controllers

#### DashboardController

- getDashboardSummary(req, res)

### Routes

#### `/api/dashboard`

- GET /summary

## 🔄 Flujos

1. 1. El Gerente/Director inicia sesión y es dirigido al Dashboard Principal.
2. 2. El frontend realiza una llamada a `GET /api/dashboard/summary` con el rango de fechas por defecto (ej. 'Últimos 30 días').
3. 3. El `DashboardController` en el backend ejecuta una pipeline de agregación en MongoDB, cruzando datos de Citas, Pagos y Pacientes para calcular KPIs y datos para los gráficos.
4. 4. El backend responde con un único objeto JSON consolidado.
5. 5. El frontend recibe los datos y los distribuye a los componentes correspondientes (`KPIWidget`, `RevenueChart`, etc.) para su visualización.
6. 6. El usuario interactúa con el `DateRangePicker` o `ClinicSelector`, lo que dispara una nueva llamada a la API con los nuevos parámetros, repitiendo el ciclo para actualizar la vista.

## 📝 User Stories

- Como Propietario / Gerente, quiero ver los ingresos totales del mes actual de un vistazo al entrar al sistema para saber si estamos cumpliendo los objetivos financieros.
- Como Director / Admin general (multisede), quiero poder cambiar entre la vista agregada de todas las clínicas y la vista de una clínica individual para comparar su rendimiento.
- Como Propietario / Gerente, quiero ver un gráfico circular con el desglose de estados de citas (completadas, canceladas, no asistidas) para identificar problemas con la tasa de asistencia de pacientes.
- Como Director / Admin general (multisede), quiero ver una lista de los 5 tratamientos más rentables en el último trimestre para planificar campañas de marketing y formación.
- Como Propietario / Gerente, quiero ver el número de pacientes nuevos registrados en el mes para evaluar la efectividad de nuestras estrategias de captación.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial que el endpoint `/api/dashboard/summary` esté altamente optimizado. Se debe usar el Aggregation Framework de MongoDB para delegar la mayor parte del cómputo a la base de datos. Crear índices en los campos de fecha y `clinicId` en las colecciones relevantes es mandatorio.
- Seguridad: El middleware de autenticación y autorización debe proteger el endpoint. Debe verificar que el usuario tenga el rol adecuado y, en el caso de ser un admin multisede, filtrar los datos para que solo pueda acceder a las clínicas asignadas a su perfil.
- Caching: Se recomienda implementar una capa de caché (ej. Redis) para la respuesta de la API. Los datos del dashboard no necesitan ser en tiempo real al segundo, por lo que un caché de 5-10 minutos puede reducir drásticamente la carga de la base de datos.
- Frontend: Utilizar una librería de gráficos como 'Recharts' o 'Chart.js' para crear visualizaciones interactivas y responsivas. Implementar estados de carga (skeletons) para mejorar la experiencia del usuario mientras se obtienen los datos.
- Manejo de Fechas: Asegurar un manejo consistente de las zonas horarias entre el cliente (navegador), el servidor (Node.js) y la base de datos (MongoDB). Todas las fechas deben almacenarse en UTC y convertirse a la zona horaria local de la clínica solo para su visualización.

