# Historial de Firmas

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

El 'Historial de Firmas' es una funcionalidad crítica dentro del módulo de 'Documentación y Protocolos', diseñada para actuar como un registro de auditoría centralizado, inmutable y de fácil acceso para todas las firmas electrónicas recogidas en la clínica dental. Su propósito fundamental es proporcionar una trazabilidad completa y seguridad jurídica sobre documentos clave que requieren el consentimiento o acuerdo explícito del paciente, como consentimientos informados para tratamientos, aceptación de presupuestos, políticas de protección de datos (LOPD/GDPR), y autorizaciones diversas. Esta página permite a los roles autorizados, como la dirección o el personal de recepción, buscar, filtrar y visualizar un listado cronológico de cada evento de firma. Cada entrada en el historial detalla quién firmó (paciente o tutor legal), qué documento específico se firmó, la fecha y hora exactas, y metadatos relevantes como la dirección IP desde la que se realizó la firma. Funciona como el repositorio final de la evidencia digital, consolidando las firmas generadas desde distintos módulos del ERP (ej. un presupuesto firmado desde el módulo de Finanzas, un consentimiento desde la Ficha del Paciente). Su existencia es vital para resolver disputas, realizar auditorías internas, cumplir con la normativa vigente y garantizar que la clínica mantiene un archivo digital seguro, organizado y legalmente robusto, eliminando la dependencia del papel.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Esta funcionalidad se encapsula dentro de la feature 'documentacion-protocolos'. La página principal, 'HistorialFirmasPage.tsx', reside en la subcarpeta '/pages'. Esta página importa y utiliza componentes reutilizables de la carpeta '/components', como 'TablaHistorialFirmas' para mostrar los datos en una grilla, 'FiltrosHistorialFirmas' para la búsqueda y filtrado, y 'ModalDetalleFirma' para ver los detalles. Toda la comunicación con el backend para obtener los datos del historial se gestiona a través de funciones definidas en '/apis/firmasApi.ts', manteniendo la lógica de fetching separada de la UI.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/HistorialFirmasPage.tsx`
- `/features/documentacion-protocolos/components/TablaHistorialFirmas.tsx`
- `/features/documentacion-protocolos/components/FiltrosHistorialFirmas.tsx`
- `/features/documentacion-protocolos/components/ModalDetalleFirma.tsx`
- `/features/documentacion-protocolos/components/PaginacionHistorial.tsx`
- `/features/documentacion-protocolos/apis/firmasApi.ts`

### Componentes React

- HistorialFirmasPage
- TablaHistorialFirmas
- FiltrosHistorialFirmas
- ModalDetalleFirma
- PaginacionHistorial

## 🔌 APIs Backend

Las APIs para esta funcionalidad deben permitir la consulta eficiente y segura de los registros de firma, soportando filtrado complejo y paginación para manejar grandes volúmenes de datos.

### `GET` `/api/firmas/historial`

Obtiene una lista paginada y filtrada de todos los registros de firma. Permite buscar por paciente, rango de fechas, tipo de documento y sede.

**Parámetros:** page (number): Número de página, limit (number): Registros por página, fechaInicio (string: ISO 8601), fechaFin (string: ISO 8601), pacienteId (string: ObjectId), tipoDocumento (string), sedeId (string: ObjectId, solo para roles admin), query (string): Búsqueda de texto libre por nombre de paciente o documento

**Respuesta:** Un objeto JSON con { data: [lista de firmas], pagination: { total, totalPages, currentPage } }

### `GET` `/api/firmas/historial/:id`

Obtiene los detalles completos de un registro de firma específico, incluyendo metadatos como IP, user agent y un enlace seguro y temporal al documento PDF firmado.

**Parámetros:** id (string): El ObjectId del registro de la firma

**Respuesta:** Un objeto JSON con los detalles completos del registro de la firma, incluyendo los datos del paciente y del documento asociado.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se centra en el modelo 'FirmaDigital' que almacena toda la información de cada firma. El 'FirmaController' contiene la lógica para consultar estos registros, aplicando filtros y paginación. Las rutas se definen en 'firma.routes.js' y se exponen bajo el prefijo '/api/firmas'.

### Models

#### FirmaDigital

documentoId: ObjectId (ref: 'Documento'), pacienteId: ObjectId (ref: 'Paciente'), sedeId: ObjectId (ref: 'Sede'), tipoDocumento: String (ej: 'Consentimiento Informado', 'Presupuesto', 'LOPD'), fechaFirma: Date, hashDocumento: String, datosFirma: Object (incluye la representación de la firma, ej: dataURL), metadatos: { ip: String, userAgent: String, timestamp: Number }, urlDocumentoFirmado: String (URL al PDF en S3/Cloud Storage), estado: String (ej: 'Completada')

### Controllers

#### FirmaController

- getHistorialFirmas
- getDetalleFirma

### Routes

#### `/api/firmas`

- GET /historial
- GET /historial/:id

## 🔄 Flujos

1. El usuario (Recepción/Director) accede a 'Historial de Firmas' desde el menú de navegación.
2. La página carga y muestra automáticamente las firmas de los últimos 30 días para la sede actual del usuario.
3. El usuario utiliza el componente de filtros para buscar un documento firmado por un paciente específico, introduciendo parte de su nombre en el campo de búsqueda.
4. El usuario filtra todos los 'Consentimientos Informados' firmados en el último trimestre seleccionando el tipo de documento y el rango de fechas.
5. Al hacer clic en un registro de la tabla, se abre un modal que muestra información detallada de la firma, incluyendo la fecha/hora exacta, la IP y un botón para visualizar el PDF firmado.
6. Un Director General (multisede) utiliza el filtro de sedes para comparar el volumen de presupuestos firmados entre diferentes clínicas del grupo.

## 📝 User Stories

- Como recepcionista, quiero buscar rápidamente el historial de firmas de un paciente para confirmar que ha firmado todos los consentimientos necesarios antes de su cita.
- Como director de clínica, quiero generar un listado de todos los presupuestos firmados en un periodo concreto para analizar la tasa de aceptación de tratamientos.
- Como administrador general (multisede), quiero filtrar y auditar el historial de firmas por clínica para asegurar el cumplimiento de los protocolos de documentación en toda la organización.
- Como personal de secretaría, quiero poder verificar la fecha y hora exactas en que se firmó un plan de tratamiento para resolver cualquier discrepancia con el paciente sobre cuándo se dio el consentimiento.

## ⚙️ Notas Técnicas

- Seguridad de Almacenamiento: Los PDFs firmados no deben guardarse en la base de datos. Deben almacenarse en un servicio de almacenamiento de objetos como AWS S3 o Google Cloud Storage. El acceso a ellos desde el frontend se debe realizar mediante URLs pre-firmadas con un tiempo de vida corto, generadas por el backend al solicitar el detalle de una firma.
- Integridad del Documento: Al momento de la firma, se debe generar un hash criptográfico (ej. SHA-256) del contenido del documento. Este hash se almacena en el modelo 'FirmaDigital' para poder verificar en cualquier momento que el documento visualizado no ha sido alterado desde su firma.
- Rendimiento y Escalabilidad: La colección 'firmadigitals' en MongoDB debe tener índices en los campos frecuentemente consultados: `fechaFirma`, `pacienteId`, `sedeId` y `tipoDocumento` para garantizar que las búsquedas y filtros sean rápidos incluso con millones de registros.
- Validez Legal: La recopilación de metadatos como la dirección IP, el User-Agent y un timestamp preciso (obtenido de un servidor de tiempo confiable si es posible) refuerza la validez probatoria de la firma electrónica simple.
- Paginación: Es obligatorio implementar paginación server-side para no sobrecargar ni el servidor ni el cliente. La API `/api/firmas/historial` debe aceptar parámetros de página y límite.

