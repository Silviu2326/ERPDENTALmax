# Informes Configurables

**Categoría:** Análisis y Reportes | **Módulo:** Cuadro de Mandos e Informes

La funcionalidad de 'Informes Configurables' es una herramienta de Business Intelligence (BI) de autoservicio diseñada para permitir a los usuarios autorizados crear, guardar y ejecutar informes personalizados sin necesidad de intervención técnica. A diferencia de los informes estáticos predefinidos, este módulo ofrece una flexibilidad total para que los directores, contables, y responsables de marketing o inventario puedan explorar los datos de la clínica y obtener respuestas a preguntas de negocio específicas. Funciona como el complemento analítico profundo del 'Cuadro de Mandos', que ofrece una vista general y visual del estado de la clínica. Mientras el cuadro de mandos muestra KPIs clave (ej: facturación del mes), los informes configurables permiten desglosar esos KPIs (ej: facturación del mes por tratamiento, por aseguradora y por sede, para pacientes de entre 30 y 45 años). El usuario es guiado a través de un asistente intuitivo donde selecciona una fuente de datos principal (Pacientes, Citas, Facturas, etc.), elige las columnas que desea ver, aplica filtros complejos (ej: fecha mayor que, estado igual a, contiene texto), define agrupaciones y cálculos (ej: sumar importes, contar pacientes), y finalmente, elige cómo visualizar los resultados, ya sea en una tabla detallada, un gráfico de barras, un gráfico circular o una línea de tiempo. Esta capacidad transforma los datos brutos del ERP en información accionable, potenciando la toma de decisiones estratégicas en todas las áreas de la gestión de la clínica.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Contable / Finanzas
- Compras / Inventario
- Marketing / CRM

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/cuadro-mandos-informes/`

Esta funcionalidad se encuentra dentro de la feature 'cuadro-mandos-informes'. La carpeta '/pages' contiene el punto de entrada principal 'InformesConfigurablesPage.tsx', que alberga el constructor de informes y la lista de informes guardados. La carpeta '/components' es crucial y contiene todos los bloques de construcción de la interfaz del constructor de informes, como selectores de datos, constructores de filtros dinámicos, selectores de visualización y componentes para renderizar las tablas y gráficos resultantes. La carpeta '/apis' gestiona las llamadas al backend para obtener metadatos de los modelos, generar los informes y gestionar las configuraciones de informes guardados.

### Archivos Frontend

- `/features/cuadro-mandos-informes/pages/InformesConfigurablesPage.tsx`
- `/features/cuadro-mandos-informes/pages/VerInformeGuardadoPage.tsx`

### Componentes React

- ReportBuilderWizard
- DataSourceSelector
- ColumnPicker
- FilterBuilderUI
- GroupingAndAggregationControls
- VisualizationSelector
- ReportDataTable
- ReportChartRenderer
- SavedReportsList

## 🔌 APIs Backend

Las APIs para esta funcionalidad deben ser muy dinámicas y seguras. Se necesita un endpoint para obtener los 'metadatos' de los modelos (qué campos están disponibles para reportar), un endpoint central para procesar la definición del informe y generar los datos, y un conjunto de endpoints CRUD para guardar y gestionar las configuraciones de los informes.

### `GET` `/api/reports/metadata`

Obtiene una lista de todas las fuentes de datos (modelos) disponibles para la creación de informes, junto con sus campos, tipos de datos y relaciones.

**Respuesta:** JSON con un array de objetos, donde cada objeto representa un modelo reportable y contiene sus campos (ej: { dataSource: 'Paciente', fields: [{ name: 'nombre', type: 'string' }, ...] }).

### `POST` `/api/reports/generate`

Recibe una configuración de informe en formato JSON y la procesa para construir una consulta a la base de datos y devolver los resultados. Es el motor principal de la funcionalidad.

**Parámetros:** Body: JSON con la definición del informe { dataSource, columns, filters, grouping, aggregation, sort, limit, page }

**Respuesta:** JSON con los datos del informe { data: [...], totalRecords: number }.

### `GET` `/api/reports/saved`

Obtiene la lista de todas las configuraciones de informes guardadas por el usuario o la clínica.

**Respuesta:** Array de objetos con las configuraciones de informes guardados (id, nombre, descripcion, fechaCreacion).

### `POST` `/api/reports/saved`

Guarda una nueva configuración de informe en la base de datos.

**Parámetros:** Body: JSON con la definición completa del informe a guardar { nombre, descripcion, configuracion: { dataSource, columns, ... } }

**Respuesta:** JSON con el objeto del informe guardado, incluyendo su nuevo ID.

### `GET` `/api/reports/saved/:id`

Obtiene los detalles de una configuración de informe guardado específica.

**Parámetros:** Path: id (el ID de la configuración del informe)

**Respuesta:** JSON con el objeto completo de la configuración del informe.

### `PUT` `/api/reports/saved/:id`

Actualiza una configuración de informe guardado existente.

**Parámetros:** Path: id, Body: JSON con los campos a actualizar.

**Respuesta:** JSON con el objeto del informe actualizado.

### `DELETE` `/api/reports/saved/:id`

Elimina una configuración de informe guardado.

**Parámetros:** Path: id

**Respuesta:** Mensaje de confirmación de éxito.

## 🗂️ Estructura Backend (MERN)

El backend requiere un nuevo modelo `ReportConfiguration` para almacenar las definiciones de los informes. El `ReportController` contendrá la lógica compleja para interpretar las peticiones del frontend y construir dinámicamente queries de agregación de MongoDB seguras, interactuando con múltiples modelos existentes como Paciente, Cita, Factura, etc.

### Models

#### ReportConfiguration

nombre: String, descripcion: String, propietario: ObjectId (ref: 'Usuario'), configuracion: { dataSource: String, columns: [String], filters: Object, grouping: Object, aggregation: Object, visualizationType: String }, fechaCreacion: Date, fechaModificacion: Date

#### Cita, Paciente, Factura, Tratamiento, InventarioItem

Estos modelos existentes son las fuentes de datos. El sistema leerá sus esquemas para alimentar los metadatos. Campos relevantes incluyen fechas, estados (confirmada, cancelada), IDs de referencia (pacienteId, odontologoId), importes numéricos y campos de texto.

### Controllers

#### ReportController

- getReportMetadata
- generateReport
- listSavedReports
- createSavedReport
- getSavedReportById
- updateSavedReport
- deleteSavedReport

### Routes

#### `/api/reports`

- GET /metadata
- POST /generate
- GET /saved
- POST /saved
- GET /saved/:id
- PUT /saved/:id
- DELETE /saved/:id

## 🔄 Flujos

1. Creación de un nuevo informe: El usuario navega a la sección de Informes Configurables. Hace clic en 'Nuevo Informe'. El sistema le presenta un asistente. Paso 1: Selecciona la fuente de datos (ej: 'Facturas'). Paso 2: Selecciona las columnas (ej: 'Fecha', 'Paciente.Nombre', 'Total Facturado'). Paso 3: Añade filtros (ej: 'Fecha' está entre '01/01/2023' y '31/12/2023' Y 'Estado' es 'Pagada'). Paso 4: Elige una visualización (ej: 'Gráfico de Barras') y agrupa los datos (ej: por 'Mes'). El sistema ejecuta la consulta y muestra el gráfico. El usuario puede guardar la configuración con un nombre para uso futuro.
2. Ejecución de un informe guardado: El usuario accede a la lista de informes guardados. Hace clic en 'Informe de Ingresos Mensuales'. El sistema carga la configuración guardada, ejecuta la consulta con los datos más recientes y muestra el informe tal como se configuró.

## 📝 User Stories

- Como Director de clínica, quiero crear un informe que compare los ingresos generados por cada odontólogo en el último trimestre para evaluar el rendimiento individual y planificar incentivos.
- Como Contable, quiero generar un listado de todas las facturas emitidas a una aseguradora específica que aún están pendientes de pago para agilizar el proceso de cobro.
- Como responsable de Marketing, quiero crear un informe del número de 'primeras citas' por mes, agrupadas por canal de captación (ej: 'Recomendación', 'Web', 'Redes Sociales'), para medir el ROI de mis campañas.
- Como responsable de Compras, quiero un informe de los productos de inventario cuyo stock actual está por debajo del mínimo establecido para poder generar las órdenes de compra necesarias a tiempo.

## ⚙️ Notas Técnicas

- Seguridad: El endpoint '/api/reports/generate' es crítico y debe ser protegido contra ataques de inyección NoSQL. Nunca se deben construir fragmentos de query concatenando strings. Se debe utilizar un constructor de pipeline de agregación que valide cada parte de la configuración del informe (nombres de campos, operadores, etc.) contra una lista blanca derivada de los metadatos de los modelos.
- Rendimiento: La generación de informes puede ser intensiva. Es fundamental tener índices en la base de datos MongoDB sobre los campos que se usarán frecuentemente para filtrar, ordenar y agrupar. Para informes muy grandes, se debe implementar paginación en la API y en el frontend. Considerar la posibilidad de un mecanismo de caché para informes solicitados con frecuencia o un sistema de ejecución en segundo plano para informes extremadamente complejos.
- Mapeo de Datos (Lookups): El backend debe ser capaz de construir pipelines con `$lookup` para cruzar datos entre colecciones. Por ejemplo, al reportar sobre 'Citas', poder incluir campos del 'Paciente' o del 'Odontólogo' relacionado.
- Librerías Frontend: Se recomienda usar librerías especializadas como 'Recharts' o 'Chart.js' para las visualizaciones gráficas y 'AG Grid' o 'React Table' para las tablas de datos, ya que ofrecen funcionalidades avanzadas como ordenación, filtrado y exportación a CSV/Excel.
- Gestión de Metadatos: El endpoint `/api/reports/metadata` debe generar la información dinámicamente a partir de los esquemas de Mongoose, permitiendo que nuevos campos añadidos al backend estén disponibles en el constructor de informes sin necesidad de actualizar el código del frontend.

