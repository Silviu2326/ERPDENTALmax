# Cumplimiento RGPD y LOPD

**Categoría:** Sistema | **Módulo:** Seguridad y Cumplimiento

La funcionalidad de 'Cumplimiento RGPD y LOPD' es un componente crítico dentro del módulo de 'Seguridad y Cumplimiento' del ERP dental. Su propósito principal es proporcionar a la clínica las herramientas necesarias para gestionar, documentar y demostrar el cumplimiento con el Reglamento General de Protección de Datos (RGPD) de la UE y la Ley Orgánica de Protección de Datos (LOPD) de España. Dada la naturaleza sensible de los datos de salud que maneja una clínica dental, esta funcionalidad es fundamental no solo para evitar sanciones legales, sino también para generar confianza en los pacientes. La página actúa como un panel de control centralizado desde donde los administradores pueden configurar las políticas de privacidad, gestionar los consentimientos informados de los pacientes, atender las solicitudes de derechos (ARCO-POL: Acceso, Rectificación, Cancelación, Oposición, Portabilidad, Olvido y Limitación), y auditar el acceso a la información personal. Se integra directamente con el módulo de Pacientes, registrando cada consentimiento y solicitud de derechos en la ficha del paciente correspondiente. Además, implementa un sistema de registro de auditoría (logs) que rastrea todas las acciones significativas sobre datos sensibles, proveyendo una trazabilidad completa que es esencial en caso de una auditoría de seguridad o una brecha de datos.

## 👥 Roles de Acceso

- IT / Integraciones / Seguridad
- Director / Admin general (multisede)
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/seguridad-cumplimiento/`

Esta funcionalidad se encuentra dentro de la feature 'seguridad-cumplimiento'. La página principal, ubicada en '/pages/GestionRGPDPage.tsx', sirve como el dashboard central. Esta página utiliza múltiples componentes React de la carpeta '/components/' para segmentar la interfaz, como 'PanelConfiguracionPoliticas', 'TablaSolicitudesDerechos', y 'VisorLogsAcceso'. Las interacciones con el backend se gestionan a través de funciones específicas en la carpeta '/apis/rgpdApi.ts', que encapsulan las llamadas a los endpoints de la API RESTful del backend.

### Archivos Frontend

- `/features/seguridad-cumplimiento/pages/GestionRGPDPage.tsx`
- `/features/seguridad-cumplimiento/components/PanelConfiguracionPoliticas.tsx`
- `/features/seguridad-cumplimiento/components/TablaConsentimientosPaciente.tsx`
- `/features/seguridad-cumplimiento/components/FormularioNuevaSolicitudDerechos.tsx`
- `/features/seguridad-cumplimiento/components/VisorLogsAcceso.tsx`
- `/features/seguridad-cumplimiento/apis/rgpdApi.ts`

### Componentes React

- GestionRGPDPage
- PanelConfiguracionPoliticas
- TablaSolicitudesDerechos
- ModalDetalleSolicitud
- VisorLogsAcceso
- FiltrosLogs

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en la gestión de la configuración de cumplimiento, el registro y consulta de consentimientos, la administración de solicitudes de derechos de los interesados y la auditoría de accesos.

### `GET` `/api/compliance/rgpd/config`

Obtiene la configuración actual de RGPD/LOPD, como textos de consentimiento y políticas de retención de datos.

**Respuesta:** JSON con el objeto de configuración.

### `PUT` `/api/compliance/rgpd/config`

Actualiza la configuración de RGPD/LOPD.

**Parámetros:** body: Objeto de configuración

**Respuesta:** JSON con el objeto de configuración actualizado.

### `GET` `/api/compliance/rgpd/requests`

Obtiene un listado paginado y filtrable de todas las solicitudes de derechos de los pacientes.

**Parámetros:** query: page, limit, status, type

**Respuesta:** Array de objetos de SolicitudDerechos.

### `POST` `/api/compliance/rgpd/requests`

Registra una nueva solicitud de derechos para un paciente.

**Parámetros:** body: { pacienteId, tipoDerecho, detalle }

**Respuesta:** JSON con la nueva solicitud creada.

### `PUT` `/api/compliance/rgpd/requests/:requestId`

Actualiza el estado o añade notas a una solicitud de derechos existente.

**Parámetros:** body: { estado, notasResolucion }

**Respuesta:** JSON con la solicitud actualizada.

### `GET` `/api/compliance/rgpd/logs`

Recupera los logs de auditoría con filtros por usuario, acción, entidad y rango de fechas.

**Parámetros:** query: usuarioId, accion, entidadId, fechaInicio, fechaFin

**Respuesta:** Array de objetos de AuditLog.

### `POST` `/api/compliance/rgpd/anonymize-patient/:pacienteId`

Ejecuta el proceso de anonimización para un paciente específico, cumpliendo con el derecho al olvido. Esta acción es irreversible.

**Parámetros:** params: pacienteId

**Respuesta:** JSON con mensaje de confirmación.

### `GET` `/api/compliance/rgpd/export-patient-data/:pacienteId`

Genera y devuelve un archivo (JSON/CSV) con todos los datos personales de un paciente, para cumplir con el derecho a la portabilidad.

**Parámetros:** params: pacienteId, query: format ('json' o 'csv')

**Respuesta:** Archivo descargable (JSON/CSV).

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con modelos específicos para el cumplimiento, un controlador que encapsula toda la lógica de negocio relacionada con RGPD, y rutas dedicadas bajo un prefijo de API para la seguridad y el cumplimiento.

### Models

#### Consentimiento

pacienteId (ObjectId, ref: 'Paciente'), tipoConsentimiento (String, enum: ['TRATAMIENTO_DATOS', 'COMUNICACIONES_COMERCIALES', 'CESION_TERCEROS']), fecha (Date), estado (String, enum: ['OTORGADO', 'REVOCADO']), metodo (String, enum: ['FIRMA_DIGITAL', 'CHECKBOX_WEB', 'DOCUMENTO_FISICO']), ipRegistro (String), documentoAdjunto (String)

#### SolicitudDerechos

pacienteId (ObjectId, ref: 'Paciente'), tipoDerecho (String, enum: ['ACCESO', 'RECTIFICACION', 'SUPRESION', 'LIMITACION', 'PORTABILIDAD', 'OPOSICION']), fechaSolicitud (Date), estado (String, enum: ['PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'RECHAZADA']), detalleSolicitud (String), notasResolucion (String), fechaResolucion (Date)

#### AuditLog

usuarioId (ObjectId, ref: 'Usuario'), accion (String), entidad (String, ej: 'Paciente'), entidadId (ObjectId), timestamp (Date, default: Date.now), detalles (Object)

#### ConfiguracionRGPD

textoConsentimientoGeneral (String), periodoRetencionDatos (Number, en meses), responsableTratamientoInfo (String), dpoInfo (String)

### Controllers

#### RgpdController

- getConfiguracion
- updateConfiguracion
- getSolicitudes
- createSolicitud
- updateSolicitud
- getAuditLogs
- anonymizePatientData
- exportPatientData

### Routes

#### `/api/compliance/rgpd`

- GET /config
- PUT /config
- GET /requests
- POST /requests
- PUT /requests/:requestId
- GET /logs
- POST /anonymize-patient/:pacienteId
- GET /export-patient-data/:pacienteId

## 🔄 Flujos

1. El Director configura los textos legales y las políticas de retención de datos en el panel de configuración.
2. Un paciente solicita el acceso a sus datos. El administrador registra la solicitud en el sistema, la cual queda en estado 'PENDIENTE'.
3. El administrador utiliza la función de exportación de datos para generar un informe completo del paciente.
4. Una vez entregado el informe al paciente, el administrador actualiza el estado de la solicitud a 'COMPLETADA', añadiendo notas sobre cómo se resolvió.
5. Un responsable de seguridad necesita investigar un posible acceso indebido. Utiliza el visor de logs, filtrando por el ID de un paciente y un rango de fechas, para ver qué usuarios han accedido a su ficha.
6. Un antiguo paciente ejerce su derecho al olvido. El administrador, tras verificar que no hay obligaciones legales para retener los datos, inicia el proceso de anonimización desde el panel, que disocia la información personal de los registros clínicos.

## 📝 User Stories

- Como Director / Admin general, quiero poder configurar y actualizar fácilmente los textos de las políticas de privacidad y los consentimientos para asegurar que la clínica siempre cumpla con la última versión de la ley.
- Como responsable de IT / Seguridad, quiero tener un registro de auditoría inmutable de todos los accesos a los datos de los pacientes para poder realizar investigaciones de seguridad y responder a incidentes.
- Como Admin general, quiero gestionar todas las solicitudes de derechos de los pacientes (como acceso o supresión) desde un único panel para asegurar que se responden a tiempo y queda un registro de cada acción.
- Como Director, quiero poder generar un informe de portabilidad de datos para un paciente en un formato estándar y legible por máquina cuando este lo solicite.
- Como responsable de IT, quiero tener una herramienta para anonimizar los datos de un paciente de forma segura y controlada cuando se ejerza el derecho al olvido, garantizando que no se pueda revertir la acción.

## ⚙️ Notas Técnicas

- Seguridad de Datos: Es imperativo que todos los datos sensibles (PII y PHI) sean cifrados tanto en tránsito (usando TLS 1.2 o superior) como en reposo (usando las capacidades de cifrado de MongoDB a nivel de campo o de base de datos).
- Proceso de Anonimización: El proceso de anonimización debe ser cuidadosamente diseñado. No es un simple borrado (DELETE). Debe reemplazar datos como nombre, DNI, teléfono, etc., por valores aleatorios o hashes no reversibles, preservando la integridad referencial de los registros médicos no identificativos para fines estadísticos e históricos.
- Inmutabilidad de los Logs: La colección `AuditLog` debe ser tratada como append-only. Se pueden implementar reglas a nivel de base de datos o de aplicación para prevenir la modificación o eliminación de registros de log existentes.
- Control de Acceso (RBAC): El acceso a esta funcionalidad debe estar estrictamente limitado a los roles definidos. Las operaciones críticas como la anonimización deben requerir una confirmación adicional o incluso una autorización de doble factor.
- Exportación de Datos: La funcionalidad de exportación debe ser robusta, asegurando que se exportan todos los datos personales del paciente, incluyendo citas, tratamientos, facturas, documentos adjuntos, y consentimientos, en un formato estructurado como JSON.

