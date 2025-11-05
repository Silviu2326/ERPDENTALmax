# Productividad por Profesional

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La página 'Productividad por Profesional' es un panel de análisis avanzado diseñado para medir y evaluar el rendimiento de cada profesional dental (odontólogos, higienistas, especialistas) dentro de la clínica o red de clínicas. Su propósito principal es proporcionar a la dirección y al personal de RR.HH. una visión clara y basada en datos del desempeño individual y colectivo, utilizando métricas clave (KPIs). Aunque se encuentra dentro del módulo 'Gestión de Proveedores y Almacén', su funcionalidad es transversal y crucial para la gestión de recursos humanos y financieros. La conexión con su módulo padre radica en una de sus métricas más importantes: la rentabilidad. No solo mide los ingresos generados por cada profesional, sino que también cruza esta información con el coste de los materiales y productos consumidos del almacén en sus tratamientos. Esto permite calcular un margen de beneficio real por profesional, identificando no solo a los que más facturan, sino a los más eficientes en el uso de recursos. La funcionalidad agrega datos de citas, tratamientos completados, tiempos de sillón y consumo de inventario para generar informes visuales (gráficos) y tabulares. Sirve como una herramienta estratégica para la toma de decisiones sobre bonificaciones, planes de formación, asignación de pacientes y optimización de costes de material.

## 👥 Roles de Acceso

- RR. HH.
- Director / Admin general (multisede)
- Propietario / Gerente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Esta funcionalidad se aloja dentro de la feature 'gestion-proveedores-almacen'. La página principal se encuentra en '/pages', renderizando el dashboard de productividad. Los componentes reutilizables como gráficos, tablas de datos, selectores de fecha y filtros de profesionales residen en '/components'. La lógica para realizar las llamadas al backend y obtener los datos de productividad está encapsulada en funciones dentro de la carpeta '/apis'.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/ProductividadProfesionalPage.tsx`
- `/features/gestion-proveedores-almacen/components/ProductividadDataTable.tsx`
- `/features/gestion-proveedores-almacen/components/ProductividadChartContainer.tsx`
- `/features/gestion-proveedores-almacen/components/FiltroProductividad.tsx`
- `/features/gestion-proveedores-almacen/components/KPIResumenCard.tsx`
- `/features/gestion-proveedores-almacen/apis/reportesProductividadApi.ts`

### Componentes React

- ProductividadDataTable
- ProductividadChartContainer
- FiltroProductividad
- KPIResumenCard

## 🔌 APIs Backend

La API principal para esta página es responsable de realizar agregaciones complejas en la base de datos para calcular las métricas de productividad. Debe poder filtrar por rango de fechas, profesional específico, y sede (para roles multisede), consolidando información de múltiples colecciones.

### `GET` `/api/reportes/productividad/profesional`

Obtiene los datos agregados de productividad por profesional para un período y filtros determinados. Calcula ingresos, tratamientos, horas, coste de material y rentabilidad.

**Parámetros:** fechaInicio (query, string, YYYY-MM-DD), fechaFin (query, string, YYYY-MM-DD), profesionalId (query, string, opcional), sedeId (query, string, opcional, para roles multisede)

**Respuesta:** Un array de objetos, donde cada objeto representa un profesional y sus KPIs: { profesionalId, nombreCompleto, ingresosTotales, numeroTratamientos, horasSillon, costeMateriales, rentabilidad, productividadPorHora }

## 🗂️ Estructura Backend (MERN)

El backend utiliza un controlador específico para los reportes de productividad. Este controlador contiene la lógica para construir y ejecutar pipelines de agregación de MongoDB que unen información de las colecciones Usuario, Cita, Tratamiento y ProductoAlmacen. Las rutas exponen estos cálculos a través de endpoints RESTful seguros y eficientes.

### Models

#### Usuario

nombre, apellido, rol ('profesional', 'admin', etc.), especialidad, sedeId (ref a Sede)

#### Cita

profesionalId (ref a Usuario), fechaHoraInicio, fechaHoraFin, estado ('completada', 'cancelada'), tratamientosRealizados (array de ref a Tratamiento)

#### Tratamiento

nombre, precio, estado ('finalizado'), materialesUtilizados: [{ productoId: (ref a ProductoAlmacen), cantidad: Number }]

#### ProductoAlmacen

nombre, costeUnitario

### Controllers

#### ReporteProductividadController

- getReporteProductividadProfesional

### Routes

#### `/api/reportes/productividad`

- GET /profesional

## 🔄 Flujos

1. El Gerente o Director accede a la página 'Productividad por Profesional' desde el menú de navegación.
2. El sistema carga por defecto los datos del último mes para todos los profesionales de la(s) sede(s) a las que tiene acceso.
3. El usuario visualiza un resumen con KPIs generales, un gráfico comparativo de ingresos y una tabla detallada por profesional.
4. El usuario utiliza el componente de filtros para seleccionar un rango de fechas personalizado y/o un profesional específico.
5. Al aplicar los filtros, el frontend realiza una nueva llamada a la API y la interfaz se actualiza dinámicamente con los nuevos datos.
6. El usuario puede ordenar la tabla por cualquier columna (ej. por 'rentabilidad') para identificar a los profesionales con mejor desempeño.
7. El usuario puede exportar la vista actual de la tabla a un archivo CSV o PDF.

## 📝 User Stories

- Como Propietario / Gerente, quiero visualizar un dashboard con los ingresos generados y el coste de material por cada profesional para evaluar la rentabilidad individual y tomar decisiones sobre compensaciones.
- Como Director / Admin general (multisede), quiero filtrar la productividad por sede para comparar el rendimiento entre clínicas e identificar oportunidades de mejora a nivel global.
- Como responsable de RR. HH., quiero generar reportes de productividad de un profesional específico en un trimestre para adjuntarlos a su evaluación de desempeño.
- Como Propietario / Gerente, quiero identificar rápidamente a los profesionales que consumen más material de alto coste en relación a los ingresos que generan para optimizar el uso del inventario.

## ⚙️ Notas Técnicas

- Rendimiento: Es crítico optimizar el pipeline de agregación en MongoDB. Se deben crear índices en los campos de fecha de las citas y tratamientos, así como en los campos de referencia (profesionalId, sedeId, etc.).
- Seguridad: Implementar un middleware de autorización que verifique el rol del usuario y filtre automáticamente los datos por sede. Un gerente de la Sede A no debe poder ver datos de la Sede B.
- Precisión de Datos: La fiabilidad del reporte depende de la correcta y consistente entrada de datos en otros módulos: las citas deben ser marcadas como 'completadas', los tratamientos como 'finalizados' y el consumo de material debe registrarse con precisión.
- Visualización de Datos: Utilizar librerías como Recharts o Chart.js para los gráficos, asegurando que sean interactivos y responsivos. Para la tabla, considerar una librería como TanStack Table para manejar eficientemente la ordenación, paginación y exportación de datos.
- Caching: Se puede implementar una estrategia de caching (ej. con Redis) para las consultas más comunes (ej. reporte del mes en curso) para reducir la carga en la base de datos y mejorar la velocidad de respuesta de la API.

