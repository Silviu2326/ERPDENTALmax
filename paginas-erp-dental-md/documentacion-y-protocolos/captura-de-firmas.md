# Captura de Firmas

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad de 'Captura de Firmas' es un componente crítico dentro del módulo de 'Documentación y Protocolos' del ERP dental. Su propósito principal es digitalizar y validar el proceso de consentimiento y acuerdo entre la clínica y el paciente, eliminando la necesidad de papel y agilizando los flujos de trabajo administrativos. Esta herramienta permite a los pacientes y al personal de la clínica firmar electrónicamente una variedad de documentos, como consentimientos informados para tratamientos, aceptación de presupuestos, políticas de privacidad (LOPD/GDPR), y autorizaciones para la liberación de información. El funcionamiento se basa en una interfaz intuitiva, accesible desde dispositivos táctiles como tablets en la recepción, o a través del portal del paciente en cualquier dispositivo. Cuando un documento requiere una firma, el sistema presenta una vista del documento en formato PDF o HTML y habilita un lienzo digital donde el usuario puede dibujar su firma con el dedo, un stylus o el ratón. Una vez capturada, la firma se guarda como una imagen (generalmente PNG con fondo transparente), se incrusta en el documento y se almacena de forma segura, vinculada al registro del paciente y al documento específico. Se genera un registro de auditoría con la fecha, hora, y metadatos del dispositivo para garantizar la validez legal. Esta funcionalidad no solo moderniza la clínica, sino que también mejora la seguridad, la trazabilidad y la organización de la documentación legalmente vinculante, asegurando que todos los consentimientos estén correctamente archivados y sean fácilmente accesibles.

## 👥 Roles de Acceso

- Recepción / Secretaría
- Odontólogo
- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Esta funcionalidad se integra dentro de la feature 'documentacion-protocolos'. La lógica de la interfaz de usuario reside en la subcarpeta '/pages', con una página específica para el proceso de firma. Los componentes reutilizables, como el lienzo de firma ('SignaturePad') y el modal que lo contiene ('ModalFirmaDocumento'), se ubican en '/components'. Las llamadas al backend para obtener el documento y enviar la firma se abstraen en un archivo dentro de la carpeta '/apis'.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/ProcesoFirmaDocumentoPage.tsx`
- `/features/documentacion-protocolos/components/SignaturePad.tsx`
- `/features/documentacion-protocolos/components/ModalFirmaDocumento.tsx`
- `/features/documentacion-protocolos/components/VisorDocumentoPDF.tsx`
- `/features/documentacion-protocolos/apis/documentosApi.ts`

### Componentes React

- ProcesoFirmaDocumentoPage
- SignaturePad
- ModalFirmaDocumento
- VisorDocumentoPDF

## 🔌 APIs Backend

Las APIs son responsables de obtener el documento que necesita ser firmado y de recibir y procesar la firma digital una vez capturada, asociándola de forma segura al documento y al firmante correspondiente.

### `GET` `/api/documentos/:documentoId/contenido-para-firma`

Obtiene los datos y el contenido de un documento específico que está pendiente de firma. Devuelve la URL del documento (PDF) y metadatos necesarios.

**Parámetros:** documentoId (param)

**Respuesta:** JSON con los detalles del documento: { id, titulo, paciente, urlContenido, estado }

### `POST` `/api/documentos/:documentoId/firmas`

Recibe la firma capturada en formato base64. El backend la procesa, la guarda en un almacenamiento de archivos (como S3), actualiza el documento con la referencia a la firma y cambia su estado a 'firmado'.

**Parámetros:** documentoId (param), Body: { signatureData: 'string (base64)', firmanteId: 'string', firmanteRol: 'Paciente' | 'Odontologo', metadatos: { ip: 'string', userAgent: 'string' } }

**Respuesta:** JSON con el estado actualizado del documento: { id, estado: 'firmado', firmas: [...] }

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo 'Documento' en MongoDB para gestionar todos los documentos de la clínica. Este modelo incluye un array para almacenar las firmas asociadas, permitiendo múltiples firmantes. Un controlador específico maneja la lógica de negocio para la firma de documentos.

### Models

#### Documento

pacienteId: ObjectId, tipo: String ('Consentimiento', 'Presupuesto', 'LOPD'), titulo: String, urlContenido: String, estado: String ('pendiente_firma', 'firmado', 'rechazado'), fechaCreacion: Date, firmas: [{ firmanteId: ObjectId, firmanteRol: String, urlFirma: String, fechaFirma: Date, metadatos: { ip: String, userAgent: String } }]

### Controllers

#### DocumentoController

- obtenerDocumentoParaFirma
- agregarFirmaADocumento

### Routes

#### `/api/documentos`

- GET /:documentoId/contenido-para-firma
- POST /:documentoId/firmas

## 🔄 Flujos

1. Flujo en Clínica: La recepcionista selecciona un documento pendiente para un paciente en el sistema. Le entrega una tablet al paciente, donde se muestra el documento. El paciente lee, acepta y firma en el área designada. El sistema guarda la firma, actualiza el estado del documento y lo archiva automáticamente en el historial del paciente.
2. Flujo en Portal del Paciente: El paciente recibe una notificación por email o en su portal sobre un documento pendiente. Accede al portal, visualiza el documento (presupuesto, plan de tratamiento), y si está de acuerdo, procede a firmarlo usando el ratón o la pantalla táctil de su dispositivo. La clínica recibe una notificación de que el documento ha sido firmado.
3. Flujo de Consentimiento: El odontólogo, antes de un procedimiento, abre el consentimiento informado correspondiente en la tablet del box. Explica el procedimiento al paciente, quien luego firma directamente. La firma queda registrada y vinculada al acto clínico del día.

## 📝 User Stories

- Como Recepcionista, quiero presentar al paciente los formularios de nuevo ingreso en una tablet para que los firme digitalmente y así eliminar el papeleo y acelerar el proceso de alta.
- Como Odontólogo, quiero que el paciente pueda firmar la aceptación de un presupuesto directamente desde su portal online para poder programar las citas del tratamiento aprobado sin demoras.
- Como Paciente, quiero poder revisar y firmar los consentimientos informados de forma digital desde mi casa antes de la cita para ahorrar tiempo en la clínica.
- Como Gerente de la Clínica, quiero tener un repositorio centralizado y seguro de todos los documentos firmados, con un registro de auditoría claro, para cumplir con la normativa y tener respaldo legal.

## ⚙️ Notas Técnicas

- Librería Frontend: Se recomienda el uso de la librería 'react-signature-canvas' o similar para una implementación robusta y sencilla del lienzo de firma.
- Almacenamiento de Firmas: Las imágenes de las firmas no deben almacenarse directamente en MongoDB. Deben subirse a un servicio de almacenamiento de objetos como AWS S3, Google Cloud Storage o Azure Blob Storage. En MongoDB se guardará únicamente la URL al archivo de imagen.
- Seguridad y Validez Legal: Es crucial capturar y almacenar metadatos junto con la firma (timestamp, IP de origen, User-Agent del navegador) para fortalecer su valor como prueba en un contexto legal (auditoría).
- Integridad del Documento: Para garantizar que el documento no ha sido alterado después de la firma, se puede almacenar un hash (ej. SHA-256) del contenido del documento en el momento de la firma. Este hash se guarda junto a los datos de la firma.
- Experiencia de Usuario (UX): La interfaz de firma debe ser clara, permitiendo al usuario ver el documento completo fácilmente. Debe incluir botones para 'Limpiar' la firma y volver a intentarlo, y un checkbox de 'He leído y acepto los términos' antes de habilitar el botón de guardar.
- Optimización: La firma capturada en base64 puede ser pesada. Se debe optimizar su tamaño en el frontend antes de enviarla al backend para reducir la latencia de la red.

