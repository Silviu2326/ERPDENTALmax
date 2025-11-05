# Firma de Consentimientos

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad de 'Firma de Consentimientos' es un componente crítico dentro del módulo de 'Documentación y Protocolos', diseñado para digitalizar y automatizar por completo el proceso de obtención del consentimiento informado del paciente. Este sistema reemplaza los formularios en papel, agilizando los flujos de trabajo en la clínica, reduciendo costos y errores, y creando un registro digital seguro y auditable. Su propósito principal es garantizar que la clínica cumpla con todas las normativas legales y éticas, asegurando que los pacientes comprendan y autoricen los tratamientos propuestos. El funcionamiento se basa en plantillas de consentimiento predefinidas por la clínica (ej: consentimiento para exodoncia, para implantes, para blanqueamiento, etc.). El personal de recepción o el odontólogo selecciona la plantilla adecuada, la asocia a la cita o plan de tratamiento del paciente y se la presenta para su firma. El paciente puede firmar directamente en un dispositivo táctil (tablet) en la clínica o a través de su portal de paciente personal. Una vez firmado, el sistema genera un documento final (preferiblemente PDF), que incluye el texto del consentimiento, los datos del paciente y la firma digitalizada, junto con metadatos cruciales como la fecha, hora y la dirección IP. Este documento se almacena de forma segura y se vincula permanentemente a la historia clínica digital del paciente, siendo fácilmente accesible para consulta por parte del personal autorizado.

## 👥 Roles de Acceso

- Recepción / Secretaría
- Odontólogo
- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Toda la lógica de frontend para la gestión de consentimientos reside en la carpeta '/features/documentacion-protocolos/'. La subcarpeta '/pages/' contiene las vistas principales, como la página para gestionar los consentimientos de un paciente ('GestionConsentimientosPacientePage.tsx') y la interfaz de firma ('FirmaConsentimientoPage.tsx'). La carpeta '/components/' alberga los componentes reutilizables específicos, como el visor de documentos ('VisorDocumentoConsentimiento.tsx') y el panel de firma digital ('PanelFirmaDigital.tsx'). Finalmente, la carpeta '/apis/' define las funciones para interactuar con el backend, como obtener plantillas, enviar la firma y recuperar documentos firmados.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/GestionConsentimientosPacientePage.tsx`
- `/features/documentacion-protocolos/pages/FirmaConsentimientoPage.tsx`
- `/features/documentacion-protocolos/pages/portal/MisConsentimientosPage.tsx`

### Componentes React

- ListaConsentimientosPaciente
- VisorDocumentoConsentimiento
- PanelFirmaDigital
- ModalSeleccionarPlantillaConsentimiento
- EstadoConsentimientoBadge

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de un consentimiento informado, desde la obtención de plantillas hasta el almacenamiento seguro del documento firmado.

### `GET` `/api/consentimientos/plantillas`

Obtiene una lista de todas las plantillas de consentimiento disponibles en la clínica.

**Respuesta:** Array de objetos de plantillas, cada uno con { id, nombre, descripcion }.

### `GET` `/api/consentimientos/paciente/:pacienteId`

Recupera todos los documentos de consentimiento (pendientes y firmados) asociados a un paciente específico.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Array de objetos de consentimiento, cada uno con { id, nombrePlantilla, estado, fechaCreacion, fechaFirma }.

### `POST` `/api/consentimientos`

Crea una nueva instancia de un consentimiento para un paciente a partir de una plantilla, asignándole un estado 'pendiente'.

**Parámetros:** body: { pacienteId, plantillaId, tratamientoId? }

**Respuesta:** Objeto del nuevo consentimiento creado con su ID y estado 'pendiente'.

### `GET` `/api/consentimientos/:consentimientoId`

Obtiene el contenido completo y los detalles de un consentimiento específico para ser mostrado antes de la firma.

**Parámetros:** consentimientoId (en la URL)

**Respuesta:** Objeto de consentimiento con { id, contenidoHtml, datosPaciente, estado }.

### `PUT` `/api/consentimientos/:consentimientoId/firmar`

Recibe los datos de la firma, actualiza el estado del consentimiento a 'firmado', guarda la firma y genera el documento final.

**Parámetros:** consentimientoId (en la URL), body: { firmaData: 'base64_string_de_la_imagen', metadatos: { ip, userAgent } }

**Respuesta:** Objeto del consentimiento actualizado con su estado 'firmado' y la URL al documento PDF final.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se apoya en dos modelos principales: uno para las plantillas y otro para las instancias de consentimiento. Un controlador gestiona toda la lógica de negocio, y las rutas exponen esta lógica de forma segura y RESTful.

### Models

#### ConsentimientoPlantilla

nombre: String, contenido: String (en HTML o Markdown para ser parseado), camposVariables: [String] (ej: ['nombre_tratamiento', 'diente_numero']), activo: Boolean

#### Consentimiento

paciente: ObjectId (ref: 'Paciente'), plantilla: ObjectId (ref: 'ConsentimientoPlantilla'), odontologo: ObjectId (ref: 'Usuario'), estado: String ('pendiente', 'firmado', 'revocado'), contenidoGenerado: String, firmaData: String (Base64), fechaFirma: Date, metadatosFirma: { ip: String, userAgent: String }, urlDocumentoFirmado: String

### Controllers

#### ConsentimientoController

- listarPlantillas
- listarConsentimientosPorPaciente
- crearConsentimientoDesdePlantilla
- obtenerDetalleConsentimiento
- firmarConsentimiento

### Routes

#### `/api/consentimientos`

- GET /plantillas
- GET /paciente/:pacienteId
- POST /
- GET /:consentimientoId
- PUT /:consentimientoId/firmar

## 🔄 Flujos

1. Flujo de Creación (Recepción): El recepcionista accede a la ficha del paciente, va a la sección 'Documentos', pulsa 'Asignar Consentimiento', selecciona la plantilla (ej: 'Consentimiento de Ortodoncia'), confirma y el sistema genera un documento pendiente de firma.
2. Flujo de Firma en Clínica (Paciente/Odontólogo): El odontólogo o su asistente abre el consentimiento pendiente en una tablet. El paciente lee el documento, resuelve dudas y firma en el área designada. Al confirmar, el sistema sella el documento, lo guarda como PDF y actualiza su estado a 'firmado'.
3. Flujo de Firma Remota (Paciente): El paciente recibe una notificación en su Portal de Paciente. Accede al portal, abre el documento pendiente, lo lee y lo firma digitalmente. El resultado es idéntico al flujo en clínica.
4. Flujo de Consulta (Odontólogo): Durante la consulta, el odontólogo accede a la historia clínica del paciente, navega a la pestaña de documentos y puede visualizar todos los consentimientos firmados, incluyendo la firma y la fecha, para verificar el cumplimiento antes de proceder.

## 📝 User Stories

- Como recepcionista, quiero asignar un consentimiento informado a un paciente desde su ficha para que lo firme antes de su tratamiento, asegurando el cumplimiento legal.
- Como odontólogo, quiero verificar rápidamente que el paciente ha firmado todos los consentimientos necesarios para su procedimiento antes de comenzar, para garantizar la seguridad y el cumplimiento normativo.
- Como paciente, quiero poder leer y firmar mis consentimientos de forma digital en una tablet o en mi portal personal para agilizar el proceso en la clínica y tener una copia accesible.
- Como administrador de la clínica, quiero tener un registro digital, seguro y auditable de todos los consentimientos firmados para proteger a la clínica legalmente y facilitar las auditorías.

## ⚙️ Notas Técnicas

- Firma Digital: Utilizar una librería como 'react-signature-canvas' en el frontend para capturar la firma como una imagen base64.
- Generación de PDF: En el backend, tras recibir la firma, se debe generar un documento PDF inmutable. Librerías como 'Puppeteer' (renderizando una vista HTML con los datos y la firma) o 'pdf-lib' son adecuadas para esta tarea.
- Seguridad y Validez Legal: Es crucial almacenar metadatos junto a la firma (timestamp, IP de origen, User-Agent del navegador) para reforzar la validez legal del documento electrónico.
- Almacenamiento: Los PDFs generados deben almacenarse en un lugar seguro, como un bucket S3 privado o similar, en lugar de directamente en la base de datos para optimizar el rendimiento. La base de datos solo guardaría la URL de acceso al archivo.
- Inmutabilidad: Una vez firmado un consentimiento, no debe ser modificable. Cualquier corrección debe implicar la revocación del antiguo y la firma de uno nuevo, manteniendo el historial.

