# Registro de Accesos

**Categoría:** Sistema | **Módulo:** Seguridad y Cumplimiento

El 'Registro de Accesos' es una funcionalidad crítica dentro del módulo de 'Seguridad y Cumplimiento' del ERP dental. Actúa como una bitácora de auditoría inmutable que registra de manera sistemática y cronológica todas las acciones significativas realizadas por los usuarios dentro del sistema. Su propósito principal es proporcionar una trazabilidad completa de las actividades, lo cual es fundamental para garantizar la seguridad de los datos, cumplir con normativas de protección de datos como HIPAA o GDPR, y facilitar la investigación de incidentes. Esta página permite a los administradores con privilegios elevados (IT, Seguridad, Directores) visualizar, filtrar y analizar quién ha accedido al sistema, qué acciones ha realizado, cuándo y desde dónde. Los eventos registrados incluyen, entre otros: inicios y cierres de sesión, visualización de historias clínicas, creación, modificación o eliminación de pacientes, citas, tratamientos, y facturas. Funciona como un mecanismo de control y disuasión, aumentando la responsabilidad del personal y protegiendo la información sensible de los pacientes. Al centralizar esta información, la clínica puede responder eficientemente a auditorías, detectar patrones de acceso anómalos o no autorizados, y resolver disputas sobre acciones realizadas en el sistema, fortaleciendo la postura de seguridad y la integridad operativa de la organización.

## 👥 Roles de Acceso

- IT / Integraciones / Seguridad
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/seguridad-cumplimiento/`

Toda la lógica de frontend para esta funcionalidad se encuentra en '/features/seguridad-cumplimiento/'. La página principal se define en '/pages/RegistroAccesosPage.tsx', que ensambla los componentes reutilizables. Estos componentes, como la tabla de logs ('TablaRegistroAccesos.tsx') y los controles de filtrado ('FiltrosRegistroAccesos.tsx'), residen en la carpeta '/components/'. Las llamadas a la API del backend para obtener los datos de los logs se gestionan a través de funciones definidas en '/apis/accesosApi.ts', manteniendo la lógica de comunicación separada de la UI.

### Archivos Frontend

- `/features/seguridad-cumplimiento/pages/RegistroAccesosPage.tsx`
- `/features/seguridad-cumplimiento/components/TablaRegistroAccesos.tsx`
- `/features/seguridad-cumplimiento/components/FiltrosRegistroAccesos.tsx`
- `/features/seguridad-cumplimiento/components/ModalDetalleAcceso.tsx`
- `/features/seguridad-cumplimiento/apis/accesosApi.ts`

### Componentes React

- TablaRegistroAccesos
- FiltrosRegistroAccesos
- ModalDetalleAcceso
- PaginacionLogs

## 🔌 APIs Backend

La API principal para esta página es un endpoint seguro que permite consultar la colección de logs de acceso. Debe soportar paginación, ordenamiento y múltiples parámetros de filtrado para manejar eficientemente grandes volúmenes de datos y permitir a los administradores realizar búsquedas precisas.

### `GET` `/api/seguridad/accesos`

Obtiene una lista paginada y filtrada de todos los registros de acceso al sistema. Es la fuente de datos principal para la página de Registro de Accesos.

**Parámetros:** page (number): Número de la página a obtener., limit (number): Cantidad de registros por página., usuarioId (string): Filtra los logs por un ID de usuario específico., tipoAccion (string): Filtra por el tipo de acción (ej: LOGIN_SUCCESS, VIEW_PATIENT, DELETE_CITA)., fechaInicio (string): Fecha de inicio del rango de búsqueda (formato ISO)., fechaFin (string): Fecha de fin del rango de búsqueda (formato ISO)., sortBy (string): Campo por el cual ordenar (ej: 'timestamp')., sortOrder (string): Orden de clasificación ('asc' o 'desc').

**Respuesta:** Un objeto JSON que contiene un array 'logs' con los registros de acceso y un objeto 'pagination' con información como 'totalItems', 'totalPages', 'currentPage'.

## 🗂️ Estructura Backend (MERN)

La implementación en el backend se basa en un modelo de MongoDB 'AccesoLog' que almacena cada evento. Un 'AccesoLogController' contiene la lógica para consultar estos registros, aplicando los filtros y la paginación solicitados. Finalmente, una ruta en '/routes/seguridadRoutes.js' expone el endpoint '/api/seguridad/accesos' y lo conecta con el controlador correspondiente.

### Models

#### AccesoLog

usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true }, nombreUsuario: { type: String, required: true }, rolUsuario: { type: String }, tipoAccion: { type: String, required: true, index: true }, timestamp: { type: Date, default: Date.now, index: true }, ipAddress: { type: String }, userAgent: { type: String }, recursoAfectado: { type: String }, recursoId: { type: Schema.Types.ObjectId }, detalles: { type: Object }, sedeId: { type: Schema.Types.ObjectId, ref: 'Sede', index: true }

### Controllers

#### AccesoLogController

- obtenerRegistrosDeAcceso

### Routes

#### `/api/seguridad`

- GET /accesos

## 🔄 Flujos

1. El administrador accede a la página 'Registro de Accesos' desde el menú de 'Seguridad y Cumplimiento'.
2. La interfaz realiza una llamada inicial a la API para cargar la primera página de los registros más recientes.
3. Los registros se muestran en una tabla paginada, mostrando información clave como usuario, acción, fecha y hora.
4. El administrador utiliza los controles de filtro para acotar la búsqueda por rango de fechas, usuario específico o tipo de acción.
5. Al aplicar los filtros, se realiza una nueva llamada a la API con los parámetros correspondientes y la tabla se actualiza con los nuevos resultados.
6. El administrador puede hacer clic en un registro específico para abrir un modal con detalles adicionales, como la dirección IP, el agente de usuario y cualquier dato relevante guardado en el campo 'detalles'.

## 📝 User Stories

- Como Director General, quiero visualizar un registro de todos los inicios de sesión fallidos en la última semana para identificar posibles intentos de acceso no autorizado.
- Como responsable de Seguridad, quiero filtrar todas las acciones realizadas por un ex-empleado en su último día de trabajo para asegurar que no hubo actividad maliciosa.
- Como responsable de IT, quiero buscar en el log de accesos por la IP de un dispositivo para rastrear todas las acciones originadas desde ese equipo.
- Como Admin general, quiero poder ver quién modificó la ficha de un paciente VIP y cuándo se realizó el cambio para mantener un control estricto sobre los datos sensibles.

## ⚙️ Notas Técnicas

- Rendimiento: La colección 'AccesoLog' puede crecer exponencialmente. Es fundamental tener índices en MongoDB en los campos 'timestamp', 'usuarioId', 'tipoAccion' y 'sedeId' para garantizar consultas rápidas.
- Seguridad: El endpoint '/api/seguridad/accesos' debe estar protegido por un middleware de autenticación y autorización que verifique que el usuario solicitante tiene uno de los roles permitidos. El registro de logs debe ser un proceso automatizado del backend, no modificable desde el frontend.
- Almacenamiento: Considerar una estrategia de archivado de logs. Por ejemplo, mover registros con más de 2 años de antigüedad a una base de datos de 'almacenamiento en frío' (cold storage) para reducir costos y mantener el rendimiento de la base de datos principal.
- Implementación de Logging: El mecanismo de creación de logs debe ser un servicio o middleware centralizado en el backend. Cada endpoint crítico (ej: actualizar paciente, eliminar cita) debe invocar este servicio después de realizar su acción para registrar el evento de forma consistente.
- Inmutabilidad: Aunque no es estrictamente inmutable en MongoDB, se deben implementar medidas a nivel de aplicación para que los logs no puedan ser modificados ni eliminados a través de la API, excepto por procesos de archivado controlados.

