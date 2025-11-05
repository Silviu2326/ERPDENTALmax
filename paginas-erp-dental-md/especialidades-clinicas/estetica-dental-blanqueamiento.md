# Estética Dental: Blanqueamiento

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'Estética Dental: Blanqueamiento' es una herramienta clínica especializada dentro del módulo 'Especialidades Clínicas' del ERP. Está diseñada para que odontólogos e higienistas puedan planificar, ejecutar y documentar de manera exhaustiva los tratamientos de blanqueamiento dental. Su propósito es centralizar toda la información relevante a este procedimiento, desde la evaluación inicial hasta el seguimiento post-tratamiento, garantizando un registro clínico preciso y auditable. El módulo permite registrar el estado inicial del paciente, incluyendo el tono de color de los dientes medido con una guía estándar (ej. VITA). A partir de ahí, el profesional puede crear un plan de tratamiento detallado, especificando el tipo de blanqueamiento (en clínica, en casa o combinado), los productos y concentraciones a utilizar, y el número de sesiones previstas. Una de sus características clave es el seguimiento por sesiones, donde se puede documentar cada visita, anotando la fecha, duración, productos aplicados y cualquier efecto adverso como la sensibilidad dental. Además, integra una galería de imágenes para subir y comparar fotografías de 'antes' y 'después', ofreciendo una evidencia visual clara del progreso y resultado final. Este módulo se integra directamente con la ficha del paciente, su odontograma y el plan de tratamiento general, asegurando que el blanqueamiento se considere parte de la salud bucodental integral del paciente y no un procedimiento aislado. También se conecta con el módulo de facturación para generar los cargos correspondientes.

## 👥 Roles de Acceso

- Odontólogo
- Higienista

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad reside dentro de la feature 'especialidades-clinicas'. La carpeta principal '/features/especialidades-clinicas/' contiene las subcarpetas estándar: '/apis/' para las definiciones de llamadas al backend, '/components/' para los componentes reutilizables de esta y otras especialidades, y '/pages/' donde se ubica la interfaz principal de esta funcionalidad. La página específica del blanqueamiento se integrará como una ruta dentro de este módulo, accediéndose típicamente desde la ficha del paciente.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/BlanqueamientoDentalPacientePage.tsx`
- `/features/especialidades-clinicas/components/FormularioNuevoBlanqueamiento.tsx`
- `/features/especialidades-clinicas/components/HistorialBlanqueamientos.tsx`
- `/features/especialidades-clinicas/components/DetalleTratamientoBlanqueamiento.tsx`
- `/features/especialidades-clinicas/apis/blanqueamientoApi.ts`

### Componentes React

- HistorialBlanqueamientosPaciente
- FormularioNuevoBlanqueamiento
- DetalleTratamientoBlanqueamiento
- SeguimientoSesionesBlanqueamiento
- GaleriaFotosAntesDespues
- SelectorTonalidadVita

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de un tratamiento de blanqueamiento. Permiten crear un nuevo registro de tratamiento asociado a un paciente, obtener todos los tratamientos de un paciente, ver los detalles de uno específico, y actualizarlo añadiendo sesiones, fotos o firmando el consentimiento.

### `GET` `/api/blanqueamientos/paciente/:pacienteId`

Obtiene el historial de todos los tratamientos de blanqueamiento para un paciente específico.

**Parámetros:** pacienteId (URL param)

**Respuesta:** Array de objetos de tratamiento de blanqueamiento.

### `POST` `/api/blanqueamientos`

Crea un nuevo registro de tratamiento de blanqueamiento para un paciente.

**Parámetros:** Body: { pacienteId, odontologoId, fechaInicio, tipoBlanqueamiento, productoUtilizado, tonoInicial, ... }

**Respuesta:** Objeto del nuevo tratamiento de blanqueamiento creado.

### `GET` `/api/blanqueamientos/:tratamientoId`

Obtiene los detalles completos de un tratamiento de blanqueamiento específico, incluyendo sesiones y fotos.

**Parámetros:** tratamientoId (URL param)

**Respuesta:** Objeto único del tratamiento de blanqueamiento.

### `PUT` `/api/blanqueamientos/:tratamientoId/sesion`

Añade una nueva sesión de seguimiento a un tratamiento de blanqueamiento existente.

**Parámetros:** tratamientoId (URL param), Body: { fecha, duracionMinutos, notasSesion, sensibilidadReportada }

**Respuesta:** Objeto del tratamiento de blanqueamiento actualizado.

### `POST` `/api/blanqueamientos/:tratamientoId/fotos`

Sube una o más fotos (antes/después) para un tratamiento. Típicamente gestionado con multipart/form-data.

**Parámetros:** tratamientoId (URL param), Body: FormData con los archivos de imagen y metadatos (ej. tipo: 'Antes').

**Respuesta:** Objeto del tratamiento con la lista de fotos actualizada.

### `PUT` `/api/blanqueamientos/:tratamientoId`

Actualiza datos generales del tratamiento, como el tono final o el estado del consentimiento.

**Parámetros:** tratamientoId (URL param), Body: { tonoFinal, consentimientoFirmado, notasGenerales }

**Respuesta:** Objeto del tratamiento de blanqueamiento actualizado.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con un modelo MongoDB 'Blanqueamiento' que almacena toda la información del tratamiento. Un 'BlanqueamientoController' contiene la lógica de negocio para manipular estos registros, y las rutas de Express exponen esta lógica a través de una API RESTful.

### Models

#### Blanqueamiento

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, profesional: { type: Schema.Types.ObjectId, ref: 'Usuario' }, fechaInicio: Date, tipoBlanqueamiento: String, productoUtilizado: String, concentracion: String, tonoInicial: String, tonoFinal: String, consentimientoFirmado: { type: Boolean, default: false }, notasGenerales: String, sesiones: [{ fecha: Date, duracionMinutos: Number, notasSesion: String, sensibilidadReportada: Boolean }], fotos: [{ url: String, tipo: String, fechaSubida: Date, default: Date.now }]

### Controllers

#### BlanqueamientoController

- crearTratamiento
- obtenerTratamientosPorPaciente
- obtenerTratamientoPorId
- agregarNuevaSesion
- agregarFotos
- actualizarTratamiento

### Routes

#### `/api/blanqueamientos`

- GET /paciente/:pacienteId
- POST /
- GET /:tratamientoId
- PUT /:tratamientoId
- PUT /:tratamientoId/sesion
- POST /:tratamientoId/fotos

## 🔄 Flujos

1. El profesional accede a la ficha de un paciente, va a la pestaña 'Especialidades' y selecciona 'Blanqueamiento'.
2. El sistema muestra el historial de blanqueamientos del paciente. El profesional hace clic en 'Nuevo Tratamiento'.
3. Se abre un formulario donde se registra el tipo de tratamiento, producto, tono inicial y se adjunta el consentimiento para la firma digital.
4. Durante una cita, el profesional abre el tratamiento en curso, añade una 'Nueva Sesión', y documenta los detalles.
5. Al inicio y al final del tratamiento, el profesional sube las fotos correspondientes en la galería 'Antes y Después'.
6. Una vez finalizado, se registra el tono final, se marcan las notas de conclusión y el tratamiento se marca como 'Completado'.

## 📝 User Stories

- Como odontólogo, quiero registrar un nuevo tratamiento de blanqueamiento para un paciente, especificando el producto y el tono inicial, para tener un punto de partida claro y documentado.
- Como higienista, quiero añadir los detalles de cada sesión de blanqueamiento en clínica, incluyendo la sensibilidad reportada por el paciente, para monitorear el progreso y la seguridad del tratamiento.
- Como odontólogo, quiero subir y comparar fotos del 'antes' y 'después' directamente en la ficha del tratamiento para evaluar los resultados objetivamente y compartirlos con el paciente.
- Como profesional dental, quiero acceder rápidamente al historial completo de blanqueamientos de un paciente para entender qué funcionó en el pasado y tomar decisiones informadas.
- Como odontólogo, quiero que el sistema me permita registrar la firma del consentimiento informado de forma digital para asegurar el cumplimiento normativo y legal.

## ⚙️ Notas Técnicas

- Seguridad: Proteger todos los endpoints con autenticación basada en JWT y autorización por roles ('Odontólogo', 'Higienista').
- Almacenamiento de archivos: Las fotos deben subirse a un servicio de almacenamiento de objetos como AWS S3 o Google Cloud Storage. La base de datos MongoDB solo almacenará las URLs de acceso a dichas imágenes.
- Optimización: Implementar compresión de imágenes en el lado del cliente antes de la subida para reducir el tamaño de los archivos y mejorar el rendimiento.
- Integridad de datos: Utilizar Mongoose para definir esquemas estrictos y validaciones a nivel de base de datos. Complementar con validación en los controllers de Express.
- Frontend: Usar una biblioteca de gestión de estado como Redux Toolkit o Zustand para manejar eficientemente los datos del tratamiento en la interfaz de usuario.
- Cumplimiento Normativo: Asegurar que el almacenamiento y manejo de fotos de pacientes cumpla con las leyes de protección de datos aplicables (ej. LOPD, GDPR).

