# Firma de Presupuestos

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad 'Firma de Presupuestos' es un componente crítico dentro del módulo 'Documentación y Protocolos', diseñado para digitalizar y formalizar el proceso de aceptación de planes de tratamiento por parte de los pacientes. Este sistema permite a la clínica generar un documento digital a partir de un presupuesto previamente creado, presentarlo al paciente y capturar su firma de manera electrónica, ya sea en persona (en una tablet en la clínica) o de forma remota a través del portal del paciente. Su propósito principal es conferir validez legal y contractual al acuerdo entre la clínica y el paciente, detallando los tratamientos a realizar y sus costos asociados. Al firmar, el presupuesto cambia su estado de 'Presentado' a 'Aceptado', lo que sirve como un disparador para otros procesos dentro del ERP, como la programación de las citas correspondientes en el módulo de Agenda o la generación de la primera factura en el módulo de Facturación. Esta funcionalidad elimina la necesidad de papel, reduce los tiempos administrativos, minimiza el riesgo de pérdida de documentos y proporciona un registro seguro y auditable de todos los acuerdos. El documento firmado, típicamente un PDF, se almacena de forma segura en el expediente digital del paciente, accesible en cualquier momento por el personal autorizado y por el propio paciente a través de su portal.

## 👥 Roles de Acceso

- Recepción / Secretaría
- Odontólogo
- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Esta funcionalidad se encuentra dentro de la feature 'documentacion-protocolos'. La lógica de la interfaz de usuario reside en '/pages/FirmaPresupuestoPage.tsx', que utiliza componentes reutilizables de '/components/' como el visor de documentos y el panel de firma. Las llamadas al backend para obtener el presupuesto y enviar la firma se gestionan en '/apis/presupuestosApi.ts'.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/FirmaPresupuestoPage.tsx`
- `/features/documentacion-protocolos/components/VisorPresupuestoPDF.tsx`
- `/features/documentacion-protocolos/components/PanelFirmaDigital.tsx`
- `/features/documentacion-protocolos/components/ModalConfirmacionFirma.tsx`
- `/features/documentacion-protocolos/apis/presupuestosApi.ts`

### Componentes React

- VisorPresupuestoPDF
- PanelFirmaDigital
- ModalConfirmacionFirma
- EstadoPresupuestoBadge
- InformacionPacientePresupuesto

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en obtener los detalles del presupuesto para su visualización y en procesar y almacenar la firma digital del paciente, actualizando el estado del documento.

### `GET` `/api/presupuestos/:id/documento-para-firma`

Obtiene los datos de un presupuesto específico, formateado para ser presentado al paciente para su firma. Incluye detalles del paciente, tratamientos, costos y términos y condiciones.

**Parámetros:** id (param): ID del presupuesto.

**Respuesta:** JSON con los datos del presupuesto y el paciente.

### `POST` `/api/presupuestos/:id/firmar`

Recibe la firma digital (en formato Base64), la asocia al presupuesto, genera el PDF final firmado, lo almacena y actualiza el estado del presupuesto a 'Aceptado'.

**Parámetros:** id (param): ID del presupuesto., firmaData (body): String en Base64 de la imagen de la firma., metadatos (body): Objeto con IP, user agent, etc., para auditoría.

**Respuesta:** JSON con el estado actualizado del presupuesto y la URL del documento firmado.

### `GET` `/api/pacientes/:pacienteId/presupuestos-pendientes`

Obtiene una lista de presupuestos pendientes de firma para un paciente específico. Usado principalmente en el portal del paciente.

**Parámetros:** pacienteId (param): ID del paciente.

**Respuesta:** Array de objetos de presupuesto simplificados.

## 🗂️ Estructura Backend (MERN)

La lógica del backend se apoya en el modelo 'Presupuesto', que incluye campos para gestionar el estado de la firma. El 'PresupuestoController' maneja la lógica de negocio para generar el documento, procesar la firma y actualizar la base de datos.

### Models

#### Presupuesto

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, tratamientos: [{...}], total: Number, estado: { type: String, enum: ['Borrador', 'Presentado', 'Aceptado', 'Rechazado', 'Expirado'], default: 'Borrador' }, documentoFirmadoURL: String, firma: { fecha: Date, ipAddress: String, userAgent: String, firmaBase64: String }

### Controllers

#### PresupuestoController

- obtenerDocumentoParaFirma
- registrarFirmaPresupuesto
- listarPresupuestosPendientesPorPaciente

### Routes

#### `/api/presupuestos`

- GET /:id/documento-para-firma
- POST /:id/firmar

## 🔄 Flujos

1. Flujo en clínica: El recepcionista abre el presupuesto en una tablet desde el ERP. El paciente revisa el documento en pantalla, utiliza el componente de firma para firmar con un lápiz táctil o el dedo y presiona 'Aceptar'. El sistema procesa la firma, guarda el PDF firmado y actualiza el estado.
2. Flujo remoto (Portal del Paciente): La clínica envía una notificación al paciente. El paciente inicia sesión en su portal, navega a la sección de 'Mis Documentos', abre el presupuesto pendiente, lo revisa y lo firma digitalmente. El resultado es el mismo que en el flujo en clínica.
3. Flujo de verificación: El personal de la clínica (recepción u odontólogo) puede acceder al historial del paciente y ver el presupuesto con el estado 'Aceptado', con la opción de descargar o visualizar el PDF firmado en cualquier momento.

## 📝 User Stories

- Como Recepcionista, quiero presentar un presupuesto en una tablet al paciente para que lo firme digitalmente en la clínica y así agilizar el proceso de aceptación del tratamiento.
- Como Odontólogo, quiero que los presupuestos aceptados y firmados se almacenen automáticamente en el expediente del paciente para tener un registro legal y claro del consentimiento.
- Como Paciente, quiero recibir un enlace a mi portal para poder revisar y firmar mi plan de tratamiento desde la comodidad de mi casa, de forma segura y sin necesidad de imprimir papel.
- Como administrador de la clínica, quiero que el estado de un presupuesto cambie automáticamente a 'Aceptado' tras la firma para que el equipo de facturación pueda proceder con el cobro inicial.

## ⚙️ Notas Técnicas

- Seguridad: La transmisión de la firma y los documentos debe ser a través de HTTPS. Los documentos firmados deben almacenarse en un bucket privado (ej. AWS S3, Google Cloud Storage) con URLs de acceso pre-firmadas y de corta duración para garantizar la confidencialidad.
- Validez Legal: Es crucial registrar metadatos junto con la firma, como la fecha y hora exactas (timestamp), la dirección IP y el user-agent del dispositivo desde el que se firmó, para reforzar la validez legal del documento electrónico.
- Librerías recomendadas: Para el frontend, 'react-signature-canvas' es una excelente opción para capturar la firma. Para el backend (Node.js), librerías como 'pdf-lib' pueden ser utilizadas para incrustar la imagen de la firma en el documento PDF existente.
- Integración: Una vez firmado el presupuesto, se deben disparar webhooks o eventos internos para notificar a otros módulos. Por ejemplo, notificar al módulo de agenda que el paciente ha aceptado el tratamiento y está listo para programar citas.

