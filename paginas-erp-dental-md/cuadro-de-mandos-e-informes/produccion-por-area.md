# Producción por Área

**Categoría:** Análisis y Reportes | **Módulo:** Cuadro de Mandos e Informes

La página 'Producción por Área' es una herramienta de análisis financiero y de gestión fundamental dentro del Cuadro de Mandos e Informes. Su principal objetivo es proporcionar a los directores y gerentes una visión clara y desglosada de los ingresos generados (producción) por cada especialidad o área clínica, como Ortodoncia, Endodoncia, Cirugía, Odontología General, etc. Este informe no solo muestra cifras totales, sino que las contextualiza, permitiendo comparar el rendimiento entre diferentes áreas y periodos de tiempo. Funciona agregando el valor de todos los tratamientos completados en un rango de fechas seleccionado y agrupándolos por su área clínica asociada. Esta funcionalidad es vital para la toma de decisiones estratégicas: ayuda a identificar las áreas más rentables que pueden ser potenciadas, así como aquellas con bajo rendimiento que podrían requerir acciones correctivas, como campañas de marketing específicas, formación para el personal o ajustes en la lista de precios. Para roles multisede, permite comparar el desempeño de las mismas áreas entre diferentes clínicas, facilitando la estandarización de procesos y la identificación de mejores prácticas. En resumen, transforma datos transaccionales brutos en inteligencia de negocio procesable, siendo un pilar para la gestión eficiente y el crecimiento de la clínica dental.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Propietario / Gerente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/cuadro-mandos-informes/`

Esta funcionalidad se encuentra dentro de la feature 'cuadro-mandos-informes'. La página principal es 'ProduccionPorAreaPage.tsx', ubicada en la subcarpeta '/pages'. Esta página importa y utiliza componentes reutilizables y específicos de la subcarpeta '/components', como 'FiltrosReporte' para la selección de fechas y clínicas, y 'GraficoTorta' o 'TablaDatos' para visualizar los datos. Las llamadas al backend para obtener los datos del informe se gestionan a través de funciones definidas en un archivo dentro de '/apis', como 'informesApi.ts', que se encarga de la comunicación con los endpoints del servidor.

### Archivos Frontend

- `/features/cuadro-mandos-informes/pages/ProduccionPorAreaPage.tsx`
- `/features/cuadro-mandos-informes/components/FiltrosReporteProduccion.tsx`
- `/features/cuadro-mandos-informes/components/GraficoProduccionArea.tsx`
- `/features/cuadro-mandos-informes/components/TablaDetalleProduccionArea.tsx`
- `/features/cuadro-mandos-informes/apis/informesApi.ts`

### Componentes React

- ProduccionPorAreaPage
- FiltrosReporteProduccion
- GraficoProduccionArea
- TablaDetalleProduccionArea
- BotonExportarCSV

## 🔌 APIs Backend

Se necesita un único endpoint principal que sea capaz de agregar y calcular la producción total, agrupada por área clínica, basándose en filtros dinámicos como el rango de fechas y las clínicas seleccionadas. Este endpoint debe ser eficiente para manejar grandes volúmenes de datos de tratamientos.

### `GET` `/api/informes/produccion-por-area`

Obtiene los datos agregados de producción, agrupados por área clínica, para un período y clínicas específicas. Los cálculos se realizan sobre tratamientos con estado 'Completado'.

**Parámetros:** query.fechaInicio: string (formato YYYY-MM-DD), query.fechaFin: string (formato YYYY-MM-DD), query.clinicaIds: string (IDs de clínicas separadas por comas, ej: 'id1,id2,id3')

**Respuesta:** Un objeto JSON con los resultados, ej: { resumen: [{ area: 'Ortodoncia', totalProducido: 75200.50, cantidadTratamientos: 45 }, { area: 'Endodoncia', totalProducido: 43100.00, cantidadTratamientos: 30 }], totalGeneral: 118300.50 }

## 🗂️ Estructura Backend (MERN)

La lógica del backend reside en el 'InformeController', que utiliza el framework de agregación de MongoDB para procesar los datos del modelo 'Tratamiento'. Se requiere un modelo 'AreaClinica' para estandarizar las áreas y 'Tratamiento' para registrar los procedimientos realizados y su valor.

### Models

#### Tratamiento

contiene campos como 'precio', 'fechaRealizacion', 'estado' (ej: 'Completado', 'En curso'), 'areaClinicaId' (ObjectId referenciando a AreaClinica), y 'clinicaId' (ObjectId referenciando a Clinica).

#### AreaClinica

Modelo para estandarizar las áreas. Campos: 'nombre' (ej: 'Ortodoncia', 'Implantología'), 'descripcion'.

#### Clinica

Modelo para el soporte multisede. Campos: 'nombre', 'direccion', etc.

### Controllers

#### InformeController

- getProduccionPorArea

### Routes

#### `/api/informes`

- GET /produccion-por-area

## 🔄 Flujos

1. El Gerente o Director accede a la sección 'Cuadro de Mandos' y selecciona el informe 'Producción por Área'.
2. La página se carga por defecto con los filtros del mes actual y todas las clínicas a las que el usuario tiene acceso.
3. El frontend realiza una petición GET a '/api/informes/produccion-por-area' con los filtros por defecto.
4. El backend procesa la petición, ejecuta una pipeline de agregación en MongoDB sobre la colección de tratamientos y devuelve los datos agrupados.
5. La interfaz muestra un gráfico de tarta y una tabla detallada con la producción de cada área.
6. El usuario modifica el rango de fechas o selecciona una clínica específica, lo que dispara una nueva petición a la API y la actualización de los datos en pantalla.
7. El usuario hace clic en 'Exportar a CSV' para descargar un archivo con los datos de la tabla actual.

## 📝 User Stories

- Como Propietario de la clínica, quiero ver un desglose porcentual de la producción por área en el último año para entender qué especialidades son el motor económico de mi negocio.
- Como Director multisede, quiero filtrar la producción por área para una clínica específica y compararla con el promedio de todas las sedes para detectar desviaciones de rendimiento.
- Como Gerente, quiero identificar las tres áreas clínicas con menor producción en el mes en curso para diseñar acciones de marketing y promoción dirigidas a esos servicios.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial crear índices compuestos en la colección 'Tratamiento' de MongoDB sobre los campos 'fechaRealizacion', 'clinicaId', 'estado' y 'areaClinicaId' para acelerar las consultas de agregación.
- Seguridad: El endpoint del backend debe validar que el usuario autenticado tiene los permisos necesarios para acceder a la información de las 'clinicaIds' solicitadas en los parámetros de la query.
- Consistencia de datos: El campo 'areaClinicaId' en el modelo 'Tratamiento' debe ser una referencia obligatoria (ObjectId) al modelo 'AreaClinica' para garantizar la integridad y evitar la fragmentación de datos por errores tipográficos.
- Visualización: Utilizar una librería de gráficos como Recharts o Chart.js en el frontend para crear visualizaciones interactivas (ej. tooltips con detalles al pasar el ratón sobre una porción del gráfico).
- Exportación: La funcionalidad de exportación a CSV puede implementarse eficientemente en el lado del cliente para evitar carga innecesaria en el servidor.

