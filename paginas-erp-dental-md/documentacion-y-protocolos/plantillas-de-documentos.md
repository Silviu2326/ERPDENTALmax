# Plantillas de Documentos

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad 'Plantillas de Documentos' es un componente central del módulo 'Documentación y Protocolos'. Permite a los administradores y directores de la clínica crear, gestionar y estandarizar todos los documentos que se utilizan en el día a día. Esto incluye consentimientos informados, presupuestos, informes post-operatorios, justificantes de asistencia, prescripciones médicas y cualquier otro tipo de comunicación escrita. El sistema funciona mediante un potente editor de texto enriquecido donde se puede diseñar el contenido del documento, aplicar formato y, lo más importante, insertar 'placeholders' o variables dinámicas (ej: {{paciente.nombreCompleto}}, {{tratamiento.nombre}}, {{doctor.nombre}}). Cuando un miembro del personal genera un documento para un paciente específico a partir de una plantilla, el ERP reemplaza automáticamente estos placeholders con la información real extraída de la base de datos. Esto no solo ahorra una cantidad inmensa de tiempo y reduce el riesgo de errores humanos, sino que también garantiza la consistencia, el cumplimiento normativo (LOPD/GDPR) y una imagen de marca profesional y unificada en todas las comunicaciones. Para un entorno multisede, permite crear plantillas globales o específicas por cada clínica, ofreciendo flexibilidad y control centralizado.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

La funcionalidad reside dentro de la carpeta /features/documentacion-protocolos/. La página principal para la gestión de plantillas se encuentra en la subcarpeta /pages/. Los componentes reutilizables como la tabla de plantillas, el editor de texto y el formulario de creación/edición están en /components/. Las llamadas a la API del backend se gestionan a través de funciones definidas en archivos dentro de la carpeta /apis/.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/GestionPlantillasPage.tsx`
- `/features/documentacion-protocolos/pages/EditorPlantillaPage.tsx`

### Componentes React

- TablaPlantillasDocumentos
- FormularioDetallePlantilla
- EditorTextoEnriquecidoConPlaceholders
- SelectorDePlaceholders
- ModalConfirmacionBorradoPlantilla

## 🔌 APIs Backend

Se requiere una API RESTful para realizar operaciones CRUD completas sobre las plantillas de documentos. Además, se necesita un endpoint específico para consultar la lista de placeholders disponibles en el sistema.

### `GET` `/api/documentacion/plantillas`

Obtiene una lista paginada de todas las plantillas de documentos, permitiendo filtrar por tipo o por sede.

**Parámetros:** page (number, opcional), limit (number, opcional), tipo (string, opcional), sedeId (string, opcional)

**Respuesta:** Un objeto con la lista de plantillas y metadatos de paginación.

### `POST` `/api/documentacion/plantillas`

Crea una nueva plantilla de documento.

**Parámetros:** Body: { nombre: string, tipo: string, contenidoHTML: string, sedeId: string (opcional) }

**Respuesta:** El objeto de la plantilla recién creada.

### `GET` `/api/documentacion/plantillas/:id`

Obtiene los detalles completos de una plantilla específica por su ID.

**Parámetros:** id (string, en la URL)

**Respuesta:** El objeto completo de la plantilla solicitada.

### `PUT` `/api/documentacion/plantillas/:id`

Actualiza una plantilla de documento existente.

**Parámetros:** id (string, en la URL), Body: { nombre: string, tipo: string, contenidoHTML: string }

**Respuesta:** El objeto de la plantilla actualizada.

### `DELETE` `/api/documentacion/plantillas/:id`

Elimina una plantilla de documento. Se recomienda un borrado lógico (marcar como inactiva).

**Parámetros:** id (string, en la URL)

**Respuesta:** Un mensaje de confirmación.

### `GET` `/api/documentacion/placeholders`

Devuelve una lista estructurada de todos los placeholders disponibles en el sistema (ej: datos del paciente, cita, tratamiento, clínica).

**Respuesta:** Un objeto JSON con categorías de placeholders y su descripción. ej: { paciente: [{ key: '{{paciente.nombre}}', desc: 'Nombre del paciente' }, ...], ... }

## 🗂️ Estructura Backend (MERN)

El backend utiliza el patrón MVC. El modelo 'DocumentoPlantilla' define la estructura en MongoDB. El 'DocumentoPlantillaController' contiene la lógica para manejar las peticiones HTTP (crear, leer, actualizar, eliminar). Las rutas en Express conectan los endpoints de la API con las funciones correspondientes del controlador.

### Models

#### DocumentoPlantilla

{
  nombre: { type: String, required: true, trim: true },
  tipo: { type: String, required: true, enum: ['consentimiento', 'prescripcion', 'informe', 'justificante', 'presupuesto', 'otro'] },
  contenidoHTML: { type: String, required: true },
  sedeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sede', default: null }, // Null para plantillas globales
  activa: { type: Boolean, default: true },
  version: { type: Number, default: 1 }
  // Timestamps automáticos (createdAt, updatedAt)
}

### Controllers

#### DocumentoPlantillaController

- crearPlantilla
- obtenerTodasPlantillas
- obtenerPlantillaPorId
- actualizarPlantilla
- eliminarPlantilla
- obtenerPlaceholdersDisponibles

### Routes

#### `/api/documentacion`

- router.use('/plantillas', plantillaRoutes)
- router.get('/placeholders', DocumentoPlantillaController.obtenerPlaceholdersDisponibles)

## 🔄 Flujos

1. El Admin General accede a 'Documentación y Protocolos' -> 'Plantillas de Documentos'.
2. El sistema muestra una tabla con todas las plantillas existentes, con opciones para filtrar, editar o eliminar.
3. El usuario hace clic en 'Crear Nueva Plantilla', lo que le lleva a la página del editor.
4. En el editor, el usuario introduce un nombre para la plantilla, selecciona su tipo (ej: 'Consentimiento Informado').
5. Utiliza el editor de texto enriquecido para redactar el contenido, aplicando formatos como negrita, listas o tablas.
6. El usuario consulta la lista de 'placeholders' disponibles y los inserta en el texto en las posiciones deseadas (ej: 'Yo, {{paciente.nombreCompleto}} con DNI {{paciente.dni}}, ...').
7. Al guardar, el sistema valida los datos y almacena la nueva plantilla en la base de datos.
8. Posteriormente, desde la ficha de un paciente, un odontólogo puede generar un documento basado en esta plantilla, y el sistema rellenará automáticamente los datos del paciente.

## 📝 User Stories

- Como Director de clínica, quiero crear plantillas para los consentimientos informados de cada tratamiento para asegurar que cumplimos con la normativa legal y que todos los pacientes firman el mismo documento estandarizado.
- Como Admin general, quiero poder editar una plantilla de presupuesto para añadir una nueva cláusula sobre métodos de pago que aplique a todos los presupuestos futuros.
- Como IT, quiero tener un endpoint de API claro que me devuelva todos los placeholders posibles para poder mostrarlos de forma intuitiva en la interfaz del editor de plantillas.
- Como Director multisede, quiero crear un conjunto de plantillas 'maestras' a nivel global, pero también permitir que cada sede cree sus propias plantillas para comunicaciones locales.

## ⚙️ Notas Técnicas

- Editor de Texto: Es crucial seleccionar una librería de editor de texto enriquecido (WYSIWYG) robusta para React, como TinyMCE, CKEditor 5 o Slate.js. Debe permitir una fácil personalización para añadir el botón y la lógica de inserción de placeholders.
- Seguridad (XSS): El contenido HTML generado por el editor debe ser sanitizado en el backend antes de guardarlo en MongoDB para prevenir ataques de Cross-Site Scripting (XSS). Librerías como 'DOMPurify' en el backend son obligatorias.
- Lógica de Placeholders: La sustitución de placeholders al generar el documento final debe realizarse en el backend para garantizar la seguridad y consistencia. Se puede utilizar un motor de plantillas como Handlebars o Mustache.js para un reemplazo seguro y eficiente.
- Versionado: Implementar un campo 'version' en el modelo de MongoDB. Al editar una plantilla, en lugar de sobreescribirla, se podría crear una nueva versión y archivar la antigua. Esto es vital para mantener la integridad de los documentos ya generados con versiones anteriores.
- Internacionalización (i18n): Si el ERP debe soportar múltiples idiomas, las plantillas deberían poder asociarse a un idioma específico.

