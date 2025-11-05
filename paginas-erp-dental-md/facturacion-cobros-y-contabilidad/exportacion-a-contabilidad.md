# Exportación a Contabilidad

**Categoría:** Gestión Financiera | **Módulo:** Facturación, Cobros y Contabilidad

La funcionalidad de 'Exportación a Contabilidad' es una herramienta crítica dentro del módulo de 'Facturación, Cobros y Contabilidad', diseñada para actuar como puente entre la gestión operativa de la clínica dental y los sistemas de contabilidad externos. Su propósito principal es permitir al personal financiero o contable extraer de manera masiva y estructurada toda la información financiera relevante generada en el ERP (facturas emitidas, cobros registrados, gastos incurridos, etc.) en un formato compatible con software de contabilidad estándar del mercado como A3, Sage, ContaSOL, o en formatos genéricos como Excel y CSV. Esta capacidad es fundamental para la correcta gestión fiscal y financiera de la clínica, ya que automatiza el proceso de traspaso de datos, eliminando la necesidad de introducir asientos contables manualmente, lo cual reduce drásticamente el riesgo de errores humanos y ahorra una cantidad significativa de tiempo. El usuario puede definir un rango de fechas, seleccionar el tipo de información a exportar y elegir el formato de salida. El sistema entonces recopila, consolida y formatea los datos, generando un fichero listo para ser importado directamente en el software contable, facilitando así las declaraciones de impuestos, la elaboración de balances y la auditoría financiera.

## 👥 Roles de Acceso

- Contable / Finanzas
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/facturacion-cobros-contabilidad/`

Esta funcionalidad reside dentro del módulo padre 'facturacion-cobros-contabilidad'. La página principal se define en '/pages/ExportacionContabilidadPage.tsx'. Esta página utiliza componentes reutilizables de '/components/' como selectores de fechas y formatos. Las llamadas al backend para generar y descargar los ficheros se gestionan a través de funciones definidas en '/apis/contabilidadApi.ts', que se encargan de la comunicación con los endpoints del servidor.

### Archivos Frontend

- `/features/facturacion-cobros-contabilidad/pages/ExportacionContabilidadPage.tsx`
- `/features/facturacion-cobros-contabilidad/components/FormularioExportacion.tsx`
- `/features/facturacion-cobros-contabilidad/components/PrevisualizacionDatosExportar.tsx`
- `/features/facturacion-cobros-contabilidad/apis/contabilidadApi.ts`

### Componentes React

- FormularioExportacion
- RangoFechasSelector
- SelectorFormatoExportacion
- TablaPrevisualizacionDatos
- BotonGenerarExportacion
- IndicadorProgresoExportacion

## 🔌 APIs Backend

Se requiere una API principal para gestionar la generación de los archivos de exportación. Este endpoint recibe los criterios de filtrado (fechas, formato) y desencadena un proceso en el backend para recopilar los datos, formatearlos y devolver el archivo resultante para su descarga.

### `POST` `/api/contabilidad/exportar`

Genera un archivo de exportación contable (CSV, XLSX, etc.) basado en los filtros proporcionados. El proceso puede ser síncrono para exportaciones pequeñas o asíncrono para grandes volúmenes de datos, devolviendo una URL para la descarga.

**Parámetros:** body: { fechaInicio: 'YYYY-MM-DD', fechaFin: 'YYYY-MM-DD', formato: 'CSV_A3' | 'XLSX_GENERICO' | 'JSON', tiposDatos: Array<'facturas' | 'cobros' | 'gastos'> }

**Respuesta:** Un objeto JSON con la URL del archivo generado para su descarga, o directamente el archivo como un blob con las cabeceras `Content-Disposition` adecuadas para iniciar la descarga en el navegador.

### `GET` `/api/contabilidad/exportar/formatos`

Obtiene la lista de formatos de exportación disponibles y configurados en el sistema.

**Respuesta:** Un array de objetos, cada uno representando un formato disponible. Ej: [{ id: 'CSV_A3', nombre: 'CSV para A3 CONTA' }, { id: 'XLSX_GENERICO', nombre: 'Excel Genérico' }]

## 🗂️ Estructura Backend (MERN)

El backend utiliza modelos de MongoDB para almacenar los datos financieros. Un controlador específico ('ContabilidadExportController') contiene la lógica para consultar estos modelos según los filtros, procesar los datos y utilizar librerías de generación de archivos para crear el fichero en el formato solicitado. Las rutas exponen esta funcionalidad de forma segura.

### Models

#### Factura

numeroFactura: String, pacienteId: ObjectId, fechaEmision: Date, baseImponible: Number, iva: Number, total: Number, estado: String, lineas: Array, cobros: Array<ObjectId>

#### Cobro

facturaId: ObjectId, pacienteId: ObjectId, fechaCobro: Date, importe: Number, metodoPago: String

#### Gasto

proveedor: String, concepto: String, fecha: Date, baseImponible: Number, iva: Number, total: Number, categoria: String

### Controllers

#### ContabilidadExportController

- generarExportacion
- obtenerFormatosDisponibles

### Routes

#### `/api/contabilidad`

- POST /exportar
- GET /exportar/formatos

## 🔄 Flujos

1. El usuario con rol 'Contable / Finanzas' accede a la página 'Exportación a Contabilidad' desde el menú de 'Facturación'.
2. En la interfaz, selecciona un rango de fechas utilizando un selector de calendario.
3. Elige el formato de exportación deseado de una lista desplegable (ej. 'CSV para Sage').
4. Selecciona mediante checkboxes los tipos de registros a incluir: Facturas emitidas, Cobros realizados, Gastos.
5. Hace clic en el botón 'Generar Exportación'.
6. El sistema muestra un indicador de carga mientras el backend procesa la solicitud.
7. Una vez finalizado, el navegador inicia automáticamente la descarga del archivo generado (ej. 'export_contable_2023-T4.csv').

## 📝 User Stories

- Como Contable de la clínica, quiero exportar todos los movimientos financieros de un trimestre a un formato compatible con A3 para poder realizar la presentación del IVA sin tener que introducir los datos manualmente.
- Como Gerente, quiero generar un informe mensual en formato Excel con todas las facturas y gastos para analizar la rentabilidad y el flujo de caja de la clínica.
- Como consultor de IT, quiero tener la capacidad de configurar nuevos formatos de exportación para adaptar el ERP a cualquier cambio de software contable que la clínica pueda realizar en el futuro.

## ⚙️ Notas Técnicas

- Rendimiento: Para exportaciones de grandes volúmenes de datos (ej. un año completo), el proceso en el backend debe ser asíncrono. Utilizar una cola de trabajos (como BullMQ con Redis) para procesar la solicitud en segundo plano. El frontend puede sondear el estado del trabajo o recibir una notificación (vía WebSockets) cuando el archivo esté listo para descargar.
- Seguridad: El endpoint de exportación debe estar protegido y ser accesible únicamente por los roles autorizados. Los archivos generados en el servidor deben tener nombres aleatorios y no predecibles, almacenarse en una ubicación segura y ser eliminados automáticamente tras un corto período de tiempo (ej. 24 horas) para evitar la exposición de datos sensibles.
- Modularidad de Formatos: Implementar un patrón de diseño 'Strategy' o 'Adapter' en el backend para manejar los diferentes formatos de exportación. Cada formato (CSV_A3, XLSX_GENERICO) será una clase que implementa una interfaz común `IExportFormatter`. Esto facilita la adición de nuevos formatos en el futuro sin alterar la lógica principal del controlador.
- Librerías recomendadas: Para la generación de archivos en Node.js, se pueden utilizar librerías como `exceljs` para archivos XLSX y `json2csv` para archivos CSV, que ofrecen un control granular sobre la estructura y el formato del contenido.

