# Historial de Visitas

**Categoría:** Gestión Clínica | **Módulo:** Gestión de Pacientes e Historia Clínica

El Historial de Visitas es una funcionalidad central dentro del módulo de 'Gestión de Pacientes e Historia Clínica'. Su propósito es ofrecer una vista cronológica, completa y detallada de todas las interacciones que un paciente ha tenido con la clínica. Funciona como un registro inmutable y consolidado que va más allá de una simple lista de citas; cada entrada en el historial representa una 'visita' (una cita que ya ha sido completada) o una cita futura, mostrando información crucial como la fecha, el profesional que atendió, los tratamientos realizados, el estado de las piezas dentales en ese momento (a través de un snapshot del odontograma), notas clínicas detalladas, documentos adjuntos (radiografías, consentimientos informados) y la información económica asociada (pagos realizados, saldo pendiente). Esta herramienta es fundamental para garantizar la continuidad asistencial, permitiendo a cualquier profesional de la clínica entender rápidamente la trayectoria de salud bucal del paciente, revisar diagnósticos pasados, y planificar futuros tratamientos con todo el contexto necesario. Para el personal administrativo, facilita la gestión de cobros y la resolución de dudas sobre servicios prestados, mientras que para la dirección, sirve como una herramienta de auditoría y control de calidad.

## 👥 Roles de Acceso

- Odontólogo
- Higienista
- Recepción / Secretaría
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-pacientes-historia-clinica/`

Esta funcionalidad reside dentro de la feature 'gestion-pacientes-historia-clinica'. La página principal, 'HistorialVisitasPage.tsx', se encuentra en la subcarpeta '/pages' y se renderiza cuando el usuario accede a la pestaña correspondiente dentro de la ficha del paciente. Esta página orquesta la presentación de los datos, utilizando componentes reutilizables de la carpeta '/components' como 'VisitasTimeline' para la visualización cronológica y 'DetalleVisitaCard' para mostrar los detalles de cada visita. Las llamadas al backend para obtener los datos del historial se gestionan a través de funciones definidas en '/apis/historialVisitasApi.ts', manteniendo la lógica de comunicación separada de la UI.

### Archivos Frontend

- `/features/gestion-pacientes-historia-clinica/pages/HistorialVisitasPage.tsx`
- `/features/gestion-pacientes-historia-clinica/components/VisitasTimeline.tsx`
- `/features/gestion-pacientes-historia-clinica/components/DetalleVisitaCard.tsx`
- `/features/gestion-pacientes-historia-clinica/components/FiltrosHistorialVisitas.tsx`
- `/features/gestion-pacientes-historia-clinica/components/VisorOdontogramaHistorico.tsx`
- `/features/gestion-pacientes-historia-clinica/apis/historialVisitasApi.ts`

### Componentes React

- HistorialVisitasPage
- VisitasTimeline
- DetalleVisitaCard
- FiltrosHistorialVisitas
- ModalAdjuntarDocumentoVisita
- VisorOdontogramaHistorico

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en obtener de forma eficiente el historial completo de un paciente, permitiendo paginación y filtrado para manejar grandes volúmenes de datos. También se necesitan endpoints para obtener detalles específicos de una visita y para gestionar recursos asociados como documentos.

### `GET` `/api/pacientes/:pacienteId/visitas`

Obtiene un listado paginado de todas las visitas (citas completadas y futuras) de un paciente específico. Permite filtrar por rango de fechas, profesional o tipo de tratamiento.

**Parámetros:** pacienteId (URL param), page (query param), limit (query param), sort (query param, ej: 'fecha:desc'), fechaDesde (query param), fechaHasta (query param), profesionalId (query param)

**Respuesta:** Un objeto JSON con un array de objetos de visita y metadatos de paginación (totalDocs, totalPages, page, limit).

### `GET` `/api/visitas/:visitaId`

Obtiene los detalles completos de una única visita, incluyendo tratamientos, notas clínicas, odontograma asociado, documentos y pagos.

**Parámetros:** visitaId (URL param)

**Respuesta:** Un objeto JSON con la información detallada de la visita, poblando las referencias a tratamientos, profesional, documentos, etc.

### `POST` `/api/visitas/:visitaId/documentos`

Sube y asocia un nuevo documento (ej. radiografía, consentimiento) a una visita específica.

**Parámetros:** visitaId (URL param), file (multipart/form-data), tipoDocumento (form-data), descripcion (form-data)

**Respuesta:** Un objeto JSON con los datos del documento recién creado y asociado a la visita.

## 🗂️ Estructura Backend (MERN)

El backend utiliza el modelo 'Cita' como la entidad principal para representar una visita. Un controlador específico, 'HistorialVisitasController', contiene la lógica para agregar y consultar los datos del historial de un paciente, optimizando las consultas a MongoDB para un rendimiento eficiente. Las rutas exponen estos controladores de forma segura y siguiendo los principios RESTful.

### Models

#### Cita

Contiene campos clave: paciente (ObjectId ref 'Paciente'), profesional (ObjectId ref 'Profesional'), fechaHoraInicio (Date), fechaHoraFin (Date), estado (String: 'programada', 'completada', 'cancelada'), tratamientosRealizados (Array de objetos: {tratamiento: ObjectId ref 'Tratamiento', pieza: String, notas: String}), notasClinicas (String), odontogramaSnapshot (ObjectId ref 'Odontograma'), documentosAdjuntos (Array de ObjectId ref 'Documento'), pagosAsociados (Array de ObjectId ref 'Pago').

#### Documento

Campos: nombreArchivo (String), url (String), mimeType (String), fechaSubida (Date), paciente (ObjectId ref 'Paciente'), visitaAsociada (ObjectId ref 'Cita').

#### Odontograma

Campos: paciente (ObjectId ref 'Paciente'), fechaCreacion (Date), estadoPiezas (Objeto/Mapa con el estado de cada pieza dental), esSnapshot (Boolean).

### Controllers

#### HistorialVisitasController

- getVisitasByPacienteId
- getVisitaDetailsById

#### DocumentoController

- uploadDocumentoForVisita

### Routes

#### `/api/pacientes`

- GET /:pacienteId/visitas -> HistorialVisitasController.getVisitasByPacienteId

#### `/api/visitas`

- GET /:visitaId -> HistorialVisitasController.getVisitaDetailsById
- POST /:visitaId/documentos -> DocumentoController.uploadDocumentoForVisita

## 🔄 Flujos

1. El usuario (odontólogo, recepcionista) busca a un paciente y accede a su ficha personal. Navega a la pestaña 'Historial de Visitas'.
2. El sistema realiza una llamada a la API GET /api/pacientes/:pacienteId/visitas para cargar la primera página del historial, mostrando las visitas más recientes primero en una línea de tiempo.
3. El usuario puede utilizar los filtros para acotar la búsqueda por rango de fechas o por profesional, lo que dispara una nueva llamada a la API con los parámetros de consulta correspondientes.
4. Al hacer clic en una visita de la línea de tiempo, se expande una tarjeta ('DetalleVisitaCard') con un resumen: tratamientos principales, notas breves y estado del pago.
5. El usuario hace clic en 'Ver detalles completos', lo que realiza una llamada a GET /api/visitas/:visitaId y abre un modal o una nueva vista con toda la información, incluyendo el visor del odontograma de esa fecha.

## 📝 User Stories

- Como odontólogo, quiero ver un historial cronológico completo de las visitas de un paciente para entender la evolución de su salud bucal y tomar decisiones informadas sobre nuevos tratamientos.
- Como higienista, quiero acceder rápidamente a los detalles de la última visita de profilaxis de un paciente para revisar el índice de placa y las recomendaciones dadas.
- Como recepcionista, quiero consultar el historial de visitas para verificar los tratamientos realizados en una fecha específica y confirmar si el pago correspondiente fue procesado.
- Como director de clínica, quiero poder revisar el historial de un paciente, incluyendo las notas clínicas de diferentes doctores, para realizar una auditoría de calidad del tratamiento.
- Como odontólogo, quiero poder comparar el odontograma de una visita actual con el de visitas anteriores para visualizar la progresión de una patología o el resultado de un tratamiento.

## ⚙️ Notas Técnicas

- Seguridad: Implementar control de acceso basado en roles (RBAC) a nivel de API. Por ejemplo, el rol 'Recepción' podría no tener acceso a las 'notasClinicas' detalladas, que solo serían visibles para roles clínicos.
- Rendimiento: La consulta para obtener el historial de visitas debe estar optimizada en MongoDB, utilizando índices en los campos 'paciente', 'fechaHoraInicio' y 'profesional'. La paginación es obligatoria para evitar la sobrecarga de datos en el cliente.
- Integridad de Datos: Al marcar una cita como 'completada', el sistema debe crear una copia inmutable (snapshot) del odontograma del paciente en ese momento y asociarla a la visita. Esto es crucial para el seguimiento clínico y legal.
- Integración con Módulos: La información de pagos debe obtenerse del módulo de 'Facturación y Pagos', vinculando los pagos a través de 'pagosAsociados'. De forma similar, los documentos se gestionan a través del módulo de 'Gestión Documental'.
- UI/UX: Utilizar una visualización de línea de tiempo (timeline) para mejorar la legibilidad y la experiencia de usuario. Implementar 'lazy loading' o 'infinite scroll' para cargar más visitas a medida que el usuario se desplaza, mejorando la percepción de velocidad.

