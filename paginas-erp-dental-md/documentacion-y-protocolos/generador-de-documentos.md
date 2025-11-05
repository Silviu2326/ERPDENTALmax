# Generador de Documentos

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

El 'Generador de Documentos' es una funcionalidad clave dentro del módulo de 'Documentación y Protocolos' del ERP dental. Su propósito principal es automatizar y estandarizar la creación de toda la documentación clínica y administrativa, eliminando la necesidad de procesos manuales, reduciendo errores y garantizando la consistencia y el cumplimiento normativo. Esta herramienta permite a los usuarios autorizados (administradores, odontólogos y personal de recepción) generar documentos personalizados para cada paciente a partir de plantillas predefinidas. Funciona mediante un sistema de plantillas (creadas por administradores) que contienen texto estándar y variables dinámicas (placeholders como `[NOMBRE_PACIENTE]`, `[TRATAMIENTO_A_REALIZAR]`, `[PRESUPUESTO_TOTAL]`). Al seleccionar un paciente y una plantilla, el sistema se conecta con otras áreas del ERP (Ficha del Paciente, Plan de Tratamiento, Agenda) para obtener los datos correspondientes y rellenar automáticamente las variables. El resultado es un documento listo para ser impreso, guardado como PDF, enviado por correo electrónico o preparado para firma digital. Esta funcionalidad es esencial para generar consentimientos informados, presupuestos detallados, informes post-operatorios, recetas médicas y justificantes de asistencia, asegurando que todos los documentos sigan el formato y el lenguaje aprobado por la clínica, mejorando la eficiencia operativa y la seguridad jurídica.

## 👥 Roles de Acceso

- Odontólogo
- Recepción / Secretaría
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Toda la lógica de frontend para la gestión de documentos y plantillas reside en la carpeta '/features/documentacion-protocolos/'. La página principal, 'GeneradorDocumentosPage.tsx' en la subcarpeta '/pages', orquesta la interfaz. Esta página utiliza componentes reutilizables de la carpeta '/components' como 'SelectorPlantillas', 'BuscadorPacientes' y 'VistaPreviaDocumento'. La gestión de plantillas, accesible solo para administradores, tiene su propia página, 'GestionPlantillasPage.tsx'. Las interacciones con el backend, como obtener plantillas o generar un documento, se manejan a través de funciones definidas en '/apis/documentosApi.ts'.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/GeneradorDocumentosPage.tsx`
- `/features/documentacion-protocolos/pages/GestionPlantillasPage.tsx`
- `/features/documentacion-protocolos/components/SelectorPlantillas.tsx`
- `/features/documentacion-protocolos/components/BuscadorPacientes.tsx`
- `/features/documentacion-protocolos/components/VistaPreviaDocumento.tsx`
- `/features/documentacion-protocolos/components/EditorPlantillasWYSIWYG.tsx`
- `/features/documentacion-protocolos/apis/documentosApi.ts`

### Componentes React

- SelectorPlantillas
- BuscadorPacientes
- VistaPreviaDocumento
- EditorPlantillasWYSIWYG
- FormularioVariablesDinamicas
- ModalExportarDocumento

## 🔌 APIs Backend

El backend expone una API RESTful para gestionar las plantillas (CRUD) y para el proceso de generación y almacenamiento de documentos. Se requieren endpoints para obtener las plantillas, crear nuevas, y el endpoint principal que recibe el ID de una plantilla y de un paciente para fusionar los datos y devolver el documento final.

### `GET` `/api/documentos/plantillas`

Obtiene una lista de todas las plantillas de documentos disponibles para la clínica.

**Parámetros:** query: tipo (opcional, para filtrar por tipo de documento)

**Respuesta:** Array de objetos de plantilla con { id, nombre, tipo }.

### `POST` `/api/documentos/plantillas`

Crea una nueva plantilla de documento. (Acceso restringido a Director / Admin).

**Parámetros:** body: { nombre: string, contenido: string, tipo: string, variables: array }

**Respuesta:** Objeto de la nueva plantilla creada.

### `PUT` `/api/documentos/plantillas/:id`

Actualiza una plantilla de documento existente. (Acceso restringido a Director / Admin).

**Parámetros:** params: id (ID de la plantilla), body: { nombre, contenido, tipo, variables }

**Respuesta:** Objeto de la plantilla actualizada.

### `POST` `/api/documentos/generar`

Genera el contenido de un documento a partir de una plantilla y los datos de un paciente. Este es el núcleo de la funcionalidad.

**Parámetros:** body: { plantillaId: string, pacienteId: string, datosAdicionales: object }

**Respuesta:** Objeto con el contenido HTML del documento generado: { contenidoHtml: string }.

### `POST` `/api/documentos/guardar`

Guarda un documento generado en el historial del paciente.

**Parámetros:** body: { pacienteId: string, plantillaId: string, contenidoFinal: string, formato: 'PDF' }

**Respuesta:** Objeto del documento guardado con su ID.

### `GET` `/api/pacientes/:pacienteId/documentos`

Obtiene el historial de documentos generados para un paciente específico.

**Parámetros:** params: pacienteId

**Respuesta:** Array de objetos de documentos generados.

## 🗂️ Estructura Backend (MERN)

El backend se apoya en dos modelos de MongoDB: 'PlantillaDocumento' para almacenar las plantillas reutilizables y 'DocumentoGenerado' para guardar cada documento creado para un paciente. El 'DocumentoController' contiene la lógica para manejar el CRUD de plantillas y, más importante, la función para fusionar los datos del paciente con el contenido de la plantilla.

### Models

#### PlantillaDocumento

nombre: String, contenido: String (HTML con placeholders como [NOMBRE_PACIENTE]), tipo: Enum['Consentimiento', 'Presupuesto', 'Informe', 'Receta', 'Otro'], variables: [String], clinicaId: ObjectId (ref a 'Clinica'), activo: Boolean

#### DocumentoGenerado

pacienteId: ObjectId (ref a 'Paciente'), plantillaUsada: ObjectId (ref a 'PlantillaDocumento'), contenidoFinal: String (HTML o referencia a archivo S3/blob), fechaCreacion: Date, creadoPor: ObjectId (ref a 'Usuario'), estado: Enum['Generado', 'Firmado', 'Enviado'], urlArchivo: String

### Controllers

#### DocumentoController

- crearPlantilla
- obtenerTodasPlantillas
- actualizarPlantilla
- eliminarPlantilla
- generarDocumentoDesdePlantilla
- guardarDocumentoGenerado
- obtenerDocumentosPorPaciente

### Routes

#### `/api/documentos`

- GET /plantillas
- POST /plantillas
- PUT /plantillas/:id
- POST /generar
- POST /guardar

## 🔄 Flujos

1. Flujo de Creación de Plantilla (Admin): El admin navega a 'Gestión de Plantillas'. Hace clic en 'Nueva Plantilla'. Rellena el nombre, selecciona el tipo y utiliza el editor WYSIWYG para escribir el contenido, insertando placeholders de una lista predefinida. Guarda la plantilla.
2. Flujo de Generación de Documento (Recepción/Odontólogo): El usuario accede al 'Generador de Documentos'. Utiliza el buscador para seleccionar un paciente. Escoge una plantilla de la lista desplegable. El sistema muestra una vista previa con los datos del paciente ya rellenados. Si hay variables manuales, aparece un pequeño formulario para completarlas. El usuario hace clic en 'Generar PDF' o 'Imprimir'.
3. Flujo de Consulta: El usuario abre la ficha de un paciente, va a la pestaña 'Documentos' y ve una lista de todos los documentos generados, con opciones para ver, descargar o reimprimir cada uno.

## 📝 User Stories

- Como Director de clínica, quiero crear plantillas de consentimiento informado estandarizadas para asegurar que cumplimos con la normativa legal y que el texto es el mismo en todas nuestras sedes.
- Como Recepcionista, quiero generar un presupuesto para un paciente en menos de un minuto seleccionando su plan de tratamiento y una plantilla, para no hacerle esperar.
- Como Odontólogo, quiero generar un informe post-operatorio con los datos del paciente y de la intervención ya cargados para entregárselo al paciente al finalizar la cita.
- Como Director de clínica, quiero poder auditar todos los documentos firmados por un paciente específico para resolver cualquier disputa o consulta legal.

## ⚙️ Notas Técnicas

- Implementación de Placeholders: Se debe diseñar un parser en el backend que identifique y reemplace de forma segura los placeholders (ej. `[PACIENTE.NOMBRE_COMPLETO]`, `[TRATAMIENTO.DESCRIPCION]`) con los datos extraídos de MongoDB.
- Generación de PDF: Para la conversión de HTML a PDF en el backend, se recomienda el uso de librerías como Puppeteer, que utiliza un headless Chrome para renderizar el HTML con alta fidelidad, respetando estilos CSS.
- Editor de Plantillas: El componente de frontend 'EditorPlantillasWYSIWYG' debería basarse en una librería robusta como 'TipTap' o 'Quill.js' para ofrecer una buena experiencia de edición al administrador.
- Seguridad y Almacenamiento: Los documentos generados, especialmente en formato PDF, contienen datos personales sensibles (RGPD/LOPD). Deben almacenarse en un bucket privado (ej. AWS S3) con URLs de acceso pre-firmadas y de corta duración para garantizar la seguridad. El acceso a los documentos debe estar rigurosamente controlado por el sistema de roles y permisos.

