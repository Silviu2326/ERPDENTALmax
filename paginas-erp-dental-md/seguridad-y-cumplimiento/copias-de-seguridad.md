# Copias de Seguridad

**Categoría:** Sistema | **Módulo:** Seguridad y Cumplimiento

La funcionalidad de 'Copias de Seguridad' es un componente crítico dentro del módulo de 'Seguridad y Cumplimiento' del ERP dental. Su propósito principal es garantizar la integridad, disponibilidad y resiliencia de todos los datos de la clínica, incluyendo historiales de pacientes, citas, tratamientos, facturación e información financiera. Esta herramienta permite a los administradores del sistema programar copias de seguridad automáticas y realizar copias manuales bajo demanda. Funciona creando una instantánea completa de la base de datos de MongoDB en un momento específico. Estas copias se almacenan de forma segura, preferiblemente en una ubicación externa y cifrada (como un bucket de AWS S3 o Google Cloud Storage) para protegerlas contra fallos de hardware local, ciberataques (como ransomware) o desastres físicos. La interfaz proporciona un historial detallado de todas las copias realizadas, su estado (éxito/fallo), fecha, tamaño y tipo (automática/manual). Además, ofrece la capacidad de restaurar el sistema a un punto anterior a partir de una copia de seguridad seleccionada, un proceso vital para la recuperación ante desastres. Esta funcionalidad no solo es una mejor práctica técnica, sino un requisito fundamental para el cumplimiento de normativas de protección de datos como HIPAA o GDPR, que exigen planes de contingencia y recuperación de datos para la información sensible de los pacientes.

## 👥 Roles de Acceso

- IT
- Integraciones
- Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/seguridad-cumplimiento/`

La funcionalidad se encuentra dentro de la carpeta 'seguridad-cumplimiento'. La página principal, definida en /pages/, muestra la interfaz de gestión de backups. Los /components/ contienen elementos reutilizables como la tabla del historial de backups, el modal de configuración de programación y el diálogo de confirmación de restauración. La lógica de comunicación con el backend se encapsula en /apis/, con funciones específicas para listar, crear, descargar y restaurar copias de seguridad.

### Archivos Frontend

- `/features/seguridad-cumplimiento/pages/CopiasSeguridadPage.tsx`
- `/features/seguridad-cumplimiento/components/BackupHistoryTable.tsx`
- `/features/seguridad-cumplimiento/components/BackupScheduleSettings.tsx`
- `/features/seguridad-cumplimiento/components/RestoreBackupModal.tsx`
- `/features/seguridad-cumplimiento/apis/backupApi.ts`

### Componentes React

- CopiasSeguridadPage
- BackupHistoryTable
- BackupScheduleSettings
- RestoreBackupModal
- ConfirmActionDialog

## 🔌 APIs Backend

Las APIs gestionan el ciclo de vida completo de las copias de seguridad, desde la creación y programación hasta la restauración y eliminación. Se comunican con servicios de almacenamiento en la nube y registran cada operación en la base de datos.

### `GET` `/api/backups`

Obtiene una lista paginada del historial de copias de seguridad realizadas, con metadatos como fecha, estado, tamaño y tipo.

**Parámetros:** page: number (opcional), limit: number (opcional), status: string (opcional, ej: 'completed', 'failed')

**Respuesta:** Un objeto con la lista de backups y metadatos de paginación.

### `POST` `/api/backups/manual`

Inicia la creación de una copia de seguridad manual de forma asíncrona. Devuelve inmediatamente un identificador del trabajo.

**Parámetros:** description: string (opcional, una nota sobre por qué se hizo el backup)

**Respuesta:** Un objeto con el job ID para rastrear el progreso del backup.

### `GET` `/api/backups/:id/download`

Genera una URL segura y temporal para descargar el archivo de una copia de seguridad específica.

**Parámetros:** id: string (ID del registro de backup)

**Respuesta:** Un objeto con una URL de descarga firmada y con tiempo de expiración.

### `POST` `/api/backups/:id/restore`

Inicia el proceso de restauración a partir de una copia de seguridad específica. Es una operación crítica y destructiva.

**Parámetros:** id: string (ID del registro de backup), confirmationToken: string (token de confirmación de segundo factor)

**Respuesta:** Un objeto confirmando el inicio del proceso de restauración.

### `GET` `/api/backups/settings`

Obtiene la configuración actual de las copias de seguridad automáticas (frecuencia, hora, política de retención).

**Respuesta:** Un objeto con la configuración actual.

### `PUT` `/api/backups/settings`

Actualiza la configuración de las copias de seguridad automáticas.

**Parámetros:** schedule: string (expresión cron, ej: '0 2 * * *'), retentionDays: number

**Respuesta:** Un objeto con la configuración actualizada.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo 'BackupLog' para registrar cada operación. El 'BackupController' contiene la lógica para interactuar con herramientas como `mongodump` y servicios de almacenamiento en la nube (ej. AWS S3 SDK). Las rutas exponen esta lógica de forma segura y controlada.

### Models

#### BackupLog

timestamp: Date, type: String ('manual'/'auto'), status: String ('pending'/'completed'/'failed'), storagePath: String, size: Number, createdBy: ObjectId (ref: 'User'), durationMs: Number, errorMessage: String

#### SystemSetting

key: String (ej: 'backupSchedule', 'backupRetentionDays'), value: any

### Controllers

#### BackupController

- listBackups
- createManualBackup
- triggerAutomatedBackups
- getBackupDownloadUrl
- initiateRestore
- getBackupSettings
- updateBackupSettings

### Routes

#### `/api/backups`

- GET /
- POST /manual
- GET /:id/download
- POST /:id/restore
- GET /settings
- PUT /settings

## 🔄 Flujos

1. El administrador de TI accede a la página de 'Copias de Seguridad' y visualiza una tabla con el historial de backups.
2. Para prepararse para una actualización del sistema, el administrador hace clic en 'Crear Copia Manual', añade una descripción y confirma. El sistema inicia el proceso en segundo plano y la nueva copia aparece como 'pendiente'.
3. El administrador navega a la pestaña de 'Configuración', establece que los backups automáticos se ejecuten todos los días a las 3:00 AM y que se retengan durante 30 días.
4. En un escenario de recuperación de desastres, el administrador selecciona un backup 'completado' de la lista, hace clic en 'Restaurar', y debe pasar por un modal de confirmación de alta seguridad (ej. escribir 'RESTAURAR SISTEMA' y proporcionar un código 2FA) para iniciar el proceso, que pondrá el sistema en modo de mantenimiento temporalmente.

## 📝 User Stories

- Como administrador de TI, quiero ver un historial completo de todas las copias de seguridad para verificar que el plan de respaldo se está ejecutando correctamente.
- Como oficial de seguridad, quiero poder crear una copia de seguridad manual instantánea antes de realizar cambios importantes en el sistema para tener un punto de restauración seguro.
- Como administrador de TI, quiero configurar un horario para las copias de seguridad automáticas para garantizar la protección de datos sin intervención manual diaria.
- Como administrador de TI, quiero poder restaurar el sistema desde una copia de seguridad específica en caso de una falla crítica o corrupción de datos, para minimizar el tiempo de inactividad.
- Como oficial de seguridad, quiero poder descargar un archivo de copia de seguridad para almacenarlo en una ubicación segura y aislada (off-site) como parte de nuestro plan de recuperación ante desastres.

## ⚙️ Notas Técnicas

- Seguridad: Las copias de seguridad contienen Información de Salud Protegida (PHI), por lo que deben ser cifradas tanto en tránsito (TLS) como en reposo (ej. SSE-S3 en AWS). El acceso a la funcionalidad de restauración debe estar protegido por autenticación multifactor (MFA).
- Almacenamiento: Se recomienda encarecidamente utilizar un servicio de almacenamiento en la nube (AWS S3, Google Cloud Storage, Azure Blob Storage) en lugar de almacenamiento local para mayor durabilidad y para proteger contra fallos locales.
- Proceso Asíncrono: La creación y restauración de backups son operaciones largas. La API debe iniciar el trabajo y devolver una respuesta inmediata. El frontend debe usar polling o WebSockets para actualizar el estado del trabajo en la UI.
- Herramientas: El backend utilizará las herramientas de línea de comandos de MongoDB (`mongodump` para crear y `mongorestore` para restaurar) ejecutadas a través de un proceso hijo de Node.js (`child_process`).
- Consistencia de Datos: El `mongodump` debe ejecutarse con la opción `--oplog` en un conjunto de réplicas para garantizar una instantánea consistente en el tiempo (point-in-time snapshot) sin bloquear las operaciones de escritura.
- Modo Mantenimiento: El proceso de restauración requiere que la aplicación se ponga en modo de mantenimiento para evitar inconsistencias de datos. La API de restauración debe activar una bandera global de 'modo mantenimiento' antes de comenzar.

