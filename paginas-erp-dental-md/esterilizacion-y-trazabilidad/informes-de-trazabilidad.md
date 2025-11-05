# Informes de Trazabilidad

**Categoría:** Calidad y Seguridad | **Módulo:** Esterilización y Trazabilidad

La página de 'Informes de Trazabilidad' es una herramienta de auditoría y control de calidad crítica dentro del ERP dental. Su propósito fundamental es proporcionar una visión completa y documentada del ciclo de vida del instrumental dental, desde su empaquetado y esterilización hasta su uso en un paciente específico y su posterior retorno al ciclo de limpieza. Esta funcionalidad permite a los directores de clínica y administradores rastrear cada kit de instrumental o incluso piezas individuales a través de cada etapa. En caso de un incidente de seguridad, como una posible infección cruzada o un fallo en un ciclo de esterilización, esta herramienta es indispensable para identificar rápidamente todos los pacientes potencialmente afectados, los procedimientos involucrados y el personal responsable. Funciona mediante la agregación de datos de diferentes módulos: correlaciona los registros de los ciclos de esterilización (qué se esterilizó, cuándo, con qué parámetros), los datos del instrumental (códigos de kit, historial de uso) y la ficha del paciente (qué tratamientos recibió y qué instrumental se utilizó). Para los roles de alto nivel, ofrece una capa de supervisión que garantiza el cumplimiento de las normativas sanitarias y los protocolos internos, fortaleciendo la seguridad del paciente y protegiendo a la clínica desde una perspectiva legal y de reputación.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/esterilizacion-trazabilidad/`

Esta funcionalidad reside dentro de la carpeta 'esterilizacion-trazabilidad'. La página principal es '/pages/InformesDeTrazabilidadPage.tsx', que actúa como contenedor. Esta página utiliza varios componentes de la carpeta '/components/', como 'TraceabilityReportFilter.tsx' para los filtros de búsqueda y 'TraceabilityResultsTable.tsx' para mostrar los datos. Todas las interacciones con el backend se gestionan a través de funciones definidas en '/apis/traceabilityApi.ts', que se encargan de realizar las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/esterilizacion-trazabilidad/pages/InformesDeTrazabilidadPage.tsx`
- `/features/esterilizacion-trazabilidad/components/TraceabilityReportFilter.tsx`
- `/features/esterilizacion-trazabilidad/components/TraceabilityResultsTable.tsx`
- `/features/esterilizacion-trazabilidad/components/TraceabilityTimelineView.tsx`
- `/features/esterilizacion-trazabilidad/components/ExportReportButton.tsx`
- `/features/esterilizacion-trazabilidad/apis/traceabilityApi.ts`

### Componentes React

- TraceabilityReportFilter
- TraceabilityResultsTable
- TraceabilityTimelineView
- ExportReportButton

## 🔌 APIs Backend

Las APIs para los informes de trazabilidad deben soportar consultas complejas y filtrado avanzado para cruzar información entre ciclos de esterilización, instrumental, tratamientos y pacientes.

### `GET` `/api/traceability/reports`

Obtiene un informe de trazabilidad completo basado en diversos filtros. Es el endpoint principal para poblar la tabla de resultados.

**Parámetros:** patientId: string (opcional), instrumentKitId: string (opcional), sterilizationCycleId: string (opcional), startDate: string (ISO date, opcional), endDate: string (ISO date, opcional), clinicId: string (requerido para rol multisede), page: number, limit: number

**Respuesta:** Un objeto JSON con los resultados paginados: { data: [TraceabilityEvent], total: number, page: number, pages: number }

### `GET` `/api/traceability/reports/export`

Genera y devuelve un informe de trazabilidad en formato PDF o CSV para su descarga, utilizando los mismos filtros que el endpoint principal.

**Parámetros:** format: string ('pdf' o 'csv'), patientId: string (opcional), instrumentKitId: string (opcional), sterilizationCycleId: string (opcional), startDate: string (opcional), endDate: string (opcional), clinicId: string (opcional)

**Respuesta:** Un stream de archivo (file stream) con el informe en el formato solicitado.

### `GET` `/api/traceability/timeline/:kitId`

Obtiene el historial completo y cronológico de un kit de instrumental específico para visualizarlo en una línea de tiempo.

**Parámetros:** kitId: string (ID del kit de instrumental)

**Respuesta:** Un array de eventos ordenados por fecha, detallando cada paso en el ciclo de vida del kit.

## 🗂️ Estructura Backend (MERN)

El backend requiere modelos interconectados para permitir las consultas de trazabilidad. El controlador utilizará el framework de agregación de MongoDB para realizar las búsquedas complejas a través de las colecciones.

### Models

#### SterilizationCycle

cycleNumber: String, sterilizerId: ObjectId, startDate: Date, endDate: Date, operatorId: ObjectId, status: String ('passed', 'failed'), parameters: Object, instrumentKits: [{ type: ObjectId, ref: 'InstrumentKit' }], clinicId: ObjectId

#### InstrumentKit

kitCode: String, description: String, instruments: [String], currentStatus: String ('sterilized', 'in_use', 'dirty'), lastCycleId: { type: ObjectId, ref: 'SterilizationCycle' }, usageHistory: [{ treatmentId: ObjectId, patientId: ObjectId, dateUsed: Date }]

#### Treatment

patientId: { type: ObjectId, ref: 'Patient' }, procedure: String, date: Date, dentistId: ObjectId, usedInstrumentKits: [{ type: ObjectId, ref: 'InstrumentKit' }], clinicId: ObjectId, notes: String

### Controllers

#### TraceabilityReportController

- generateTraceabilityReport
- exportTraceabilityReport
- getInstrumentKitTimeline

### Routes

#### `/api/traceability`

- GET /reports
- GET /reports/export
- GET /timeline/:kitId

## 🔄 Flujos

1. El Director o Admin accede a la página 'Informes de Trazabilidad' desde el menú de Calidad y Seguridad.
2. Utiliza el panel de filtros para buscar por el DNI de un paciente, el código de un kit de instrumental, el ID de un ciclo o un rango de fechas.
3. Al aplicar los filtros, el frontend realiza una llamada a `GET /api/traceability/reports`.
4. El backend ejecuta una consulta de agregación en MongoDB, utilizando `$lookup` para cruzar datos de las colecciones Treatments, InstrumentKits y SterilizationCycles.
5. Los resultados se muestran en una tabla paginada. Cada fila representa un evento de uso de un kit.
6. El usuario puede hacer clic en un kit específico para abrir un modal con el componente `TraceabilityTimelineView`, que llama a `GET /api/traceability/timeline/:kitId` para mostrar su historial completo.
7. El usuario puede hacer clic en el botón 'Exportar', que llama a `GET /api/traceability/reports/export` con los filtros actuales para descargar el informe en PDF o CSV.

## 📝 User Stories

- Como Director de clínica, quiero generar un informe de trazabilidad para un paciente específico para poder verificar qué instrumental se usó en su tratamiento en caso de una investigación de incidente de seguridad.
- Como Admin general multisede, quiero filtrar los informes de trazabilidad por clínica y rango de fechas para poder realizar auditorías de calidad y cumplimiento de protocolos de esterilización de forma periódica.
- Como responsable de IT, quiero poder exportar los datos de trazabilidad en un formato estándar (CSV) para poder integrarlos con sistemas externos de business intelligence o para realizar backups de seguridad.
- Como Director de calidad, quiero buscar por el ID de un ciclo de esterilización que falló una prueba biológica para identificar rápidamente todos los kits de instrumental involucrados y en qué pacientes se utilizaron, para poder tomar acciones correctivas inmediatas.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial crear índices compuestos en MongoDB sobre los campos utilizados para filtrar en las colecciones `Treatment`, `InstrumentKit` y `SterilizationCycle` (ej: `clinicId` y `date` en `Treatment`). Las consultas de agregación deben estar optimizadas para evitar escaneos completos de la colección.
- Seguridad: El acceso a estos endpoints debe estar protegido por un middleware que verifique el rol del usuario ('Director' o 'Admin'). Para roles multisede, las consultas deben estar obligatoriamente filtradas por el `clinicId` correspondiente a sus permisos.
- Integridad de Datos: Utilizar transacciones de MongoDB al registrar el uso de un kit en un tratamiento para garantizar que tanto el documento `Treatment` como el `InstrumentKit` (actualizando su estado e historial) se actualicen de forma atómica.
- Exportación Asíncrona: Para informes muy grandes que podrían exceder el tiempo de espera del request, se debe considerar un sistema de trabajos en segundo plano (background jobs). El API podría responder inmediatamente con un `jobId` y el frontend podría consultar el estado del trabajo hasta que el informe esté listo para descargar.
- Logging de Auditoría: Cada vez que se genere o exporte un informe, se debe registrar un evento de auditoría indicando qué usuario lo hizo, cuándo y con qué filtros, dada la alta sensibilidad de la información accedida.

