# Exportación de Datos

**Categoría:** Análisis y Reportes | **Módulo:** Cuadro de Mandos e Informes

La funcionalidad de 'Exportación de Datos' es una herramienta crítica dentro del módulo 'Cuadro de Mandos e Informes'. Su propósito principal es permitir a los usuarios con permisos elevados extraer información masiva y detallada del ERP en formatos estándar y portables como CSV, Excel (XLSX) y JSON. A diferencia de los informes predefinidos que ofrecen vistas agregadas y visualizaciones, la exportación de datos proporciona acceso a los datos en bruto, lo que posibilita análisis más profundos, auditorías externas, conciliaciones contables, migraciones de datos o la integración con software de terceros (como sistemas de contabilidad, BI o marketing). Para un director de clínica, permite generar listas de pacientes para campañas de marketing. Para el departamento financiero, es indispensable para exportar transacciones, facturas y pagos para el cierre contable o auditorías. Para el personal de IT, es una herramienta fundamental para realizar copias de seguridad lógicas o para migrar datos a nuevos sistemas. El proceso está diseñado para ser asíncrono, permitiendo que el usuario solicite una exportación de gran volumen sin tener que esperar en la pantalla. El sistema procesa la solicitud en segundo plano y notifica al usuario cuando el archivo está listo para ser descargado, garantizando que el rendimiento de la aplicación no se vea afectado.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Contable / Finanzas
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/cuadro-mandos-informes/`

Esta funcionalidad reside dentro de la feature 'cuadro-mandos-informes'. La lógica de la interfaz de usuario se encuentra en '/pages/ExportacionDatosPage.tsx', que orquesta varios componentes reutilizables de '/components/' para construir el formulario de solicitud y la tabla de historial. Las llamadas al backend para solicitar, verificar el estado y descargar las exportaciones se gestionan a través de funciones definidas en '/apis/exportacionApi.ts'.

### Archivos Frontend

- `/features/cuadro-mandos-informes/pages/ExportacionDatosPage.tsx`
- `/features/cuadro-mandos-informes/components/FormularioSolicitudExportacion.tsx`
- `/features/cuadro-mandos-informes/components/TablaHistorialExportaciones.tsx`
- `/features/cuadro-mandos-informes/apis/exportacionApi.ts`

### Componentes React

- ExportacionDatosPage
- FormularioSolicitudExportacion
- SelectorEntidadExportar
- SelectorRangoFechas
- SelectorFormatoArchivo
- TablaHistorialExportaciones
- IndicadorProgresoJob

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan un proceso asíncrono. Primero, un endpoint recibe la solicitud de exportación y la encola, devolviendo un ID de trabajo. Otro endpoint permite consultar el estado de ese trabajo. Finalmente, un endpoint seguro permite la descarga del archivo una vez que el proceso ha concluido. También se necesita un endpoint para listar el historial de exportaciones del usuario.

### `POST` `/api/export/request`

Inicia una nueva solicitud de exportación de datos. Añade el trabajo a una cola de procesamiento y devuelve inmediatamente un ID de trabajo.

**Parámetros:** entidad: string (ej: 'pacientes', 'facturas', 'citas', 'tratamientos'), formato: string ('csv', 'xlsx', 'json'), filtros: object (ej: { fechaInicio: 'YYYY-MM-DD', fechaFin: 'YYYY-MM-DD', clinicaId: 'string' })

**Respuesta:** JSON con el ID del trabajo creado. { jobId: 'string' }

### `GET` `/api/export/status/:jobId`

Consulta el estado de un trabajo de exportación específico.

**Parámetros:** jobId: string (parámetro de ruta)

**Respuesta:** JSON con el estado del trabajo. { status: 'pending' | 'processing' | 'completed' | 'failed', downloadUrl?: 'string', error?: 'string' }

### `GET` `/api/export/download/:fileId`

Descarga el archivo generado por un trabajo de exportación completado. Requiere autenticación y autorización.

**Parámetros:** fileId: string (identificador único y seguro del archivo)

**Respuesta:** El archivo físico (CSV, XLSX, JSON) con las cabeceras HTTP apropiadas para iniciar la descarga en el navegador.

### `GET` `/api/export/history`

Obtiene la lista de los trabajos de exportación solicitados por el usuario o la clínica.

**Parámetros:** limit: number (opcional), page: number (opcional)

**Respuesta:** Array de objetos de trabajos de exportación. [{ jobId, entidad, formato, status, createdAt, downloadUrl? }]

## 🗂️ Estructura Backend (MERN)

El backend requiere un nuevo modelo `ExportJob` para rastrear el estado de cada solicitud. Un `ExportController` gestionará la lógica de negocio: crear el trabajo, invocar un servicio en segundo plano para procesar los datos (consultando modelos como `Paciente`, `Factura`, etc.), actualizar el estado del trabajo y servir el archivo final de forma segura. Las rutas se definirán en un archivo dedicado para la exportación.

### Models

#### ExportJob

jobId: string, usuarioId: ObjectId, clinicaId: ObjectId, entidad: string, formato: string, filtros: object, status: string ('pending', 'processing', 'completed', 'failed'), filePath: string, fileId: string, error: string, createdAt: Date, completedAt: Date

#### Paciente

(Leído) Datos demográficos, de contacto, historial médico, etc.

#### Factura

(Leído) Número de factura, pacienteId, importes, impuestos, estado, fecha, etc.

#### Cita

(Leído) Fecha, hora, pacienteId, profesionalId, estado, tratamiento, etc.

### Controllers

#### ExportController

- requestExport(req, res)
- getExportStatus(req, res)
- downloadExportFile(req, res)
- getExportHistory(req, res)

### Routes

#### `/api/export`

- POST /request
- GET /status/:jobId
- GET /download/:fileId
- GET /history

## 🔄 Flujos

1. El usuario accede a la página 'Exportación de Datos' desde el Cuadro de Mandos.
2. El usuario selecciona la entidad a exportar (ej: 'Facturas'), un rango de fechas y el formato deseado (ej: 'Excel').
3. El usuario hace clic en 'Generar Exportación'. El frontend envía una solicitud POST a '/api/export/request'.
4. El backend crea un registro en el modelo 'ExportJob' con estado 'pending' y lo añade a una cola de procesamiento, devolviendo el 'jobId' al frontend.
5. El frontend añade la nueva tarea a la 'Tabla de Historial de Exportaciones' y comienza a sondear periódicamente el endpoint '/api/export/status/:jobId' para obtener actualizaciones.
6. Un worker en segundo plano procesa el trabajo: consulta la base de datos (MongoDB), genera el archivo Excel, lo almacena (ej: en S3) y actualiza el registro 'ExportJob' a 'completed' con la URL de descarga.
7. En la siguiente consulta de estado, el frontend recibe el estado 'completed' y la 'downloadUrl', habilitando el botón de descarga en la tabla.
8. El usuario hace clic en 'Descargar' y el navegador inicia la descarga del archivo.

## 📝 User Stories

- Como Contable, quiero exportar todas las facturas y pagos de un mes específico en formato CSV para importarlos en mi software de contabilidad y realizar la conciliación bancaria.
- Como Director General, quiero exportar la lista completa de pacientes activos con su email y teléfono para cargarla en nuestra plataforma de email marketing y enviar una newsletter.
- Como administrador de IT, quiero poder generar una exportación completa de todas las tablas principales en formato JSON como parte de un procedimiento de backup manual antes de una actualización del sistema.
- Como Director de una clínica multisede, quiero exportar un informe de citas (atendidas, canceladas, no presentadas) por cada sede en un rango de fechas, en formato Excel, para analizar el rendimiento de los profesionales en cada ubicación.

## ⚙️ Notas Técnicas

- Procesamiento Asíncrono: Es imperativo usar una cola de trabajos (ej: BullMQ con Redis) para procesar las exportaciones en segundo plano. Esto evita el bloqueo del hilo principal de Node.js y previene timeouts en las solicitudes HTTP para exportaciones grandes.
- Seguridad de Datos: El acceso a esta funcionalidad debe estar estrictamente limitado por roles. Todos los endpoints deben estar protegidos. Las URLs de descarga deben ser seguras y de corta duración (ej: URLs prefirmadas de S3) para evitar el acceso no autorizado a los archivos.
- Rendimiento y Memoria: Para exportar grandes volúmenes de datos desde MongoDB, se deben utilizar streams (`cursor.stream()`) para leer los datos y procesarlos sin cargar todo el dataset en la memoria del servidor. Esto es crucial para mantener la estabilidad del sistema.
- Almacenamiento de Archivos: Utilizar un servicio de almacenamiento en la nube como AWS S3 o Google Cloud Storage es la solución recomendada. Permite desacoplar el almacenamiento de archivos del servidor de la aplicación, mejora la escalabilidad y facilita la gestión de políticas de retención y seguridad de los archivos generados.
- Prevención de Abuso: Implementar límites en la frecuencia y el tamaño de las exportaciones por usuario para prevenir el abuso de la funcionalidad que podría impactar el rendimiento general del sistema.
- Auditoría: Cada solicitud de exportación (exitosa o fallida) debe ser registrada en un log de auditoría, incluyendo qué usuario la solicitó, cuándo, y qué datos se exportaron.

