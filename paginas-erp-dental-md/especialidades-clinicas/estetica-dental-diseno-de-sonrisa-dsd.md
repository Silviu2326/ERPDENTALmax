# Estética Dental: Diseño de Sonrisa (DSD)

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

El módulo de Diseño de Sonrisa (DSD - Digital Smile Design) es una herramienta visual de planificación y comunicación dentro del ERP dental, específicamente bajo el módulo padre 'Especialidades Clínicas'. Está diseñado para que los odontólogos puedan crear simulaciones estéticas digitales de los resultados de tratamientos dentales. Esta funcionalidad permite al profesional subir fotografías faciales e intraorales del paciente a un lienzo digital interactivo. Sobre estas imágenes, puede realizar mediciones precisas, trazar líneas de referencia facial y dental (línea bipupilar, línea media, etc.), y superponer plantillas de dientes de una biblioteca digital para diseñar la sonrisa ideal en términos de forma, tamaño, color y posición, en armonía con las características faciales del paciente. El propósito principal es mejorar la comunicación con el paciente, permitiéndole visualizar el resultado potencial antes de iniciar cualquier tratamiento, lo que aumenta significativamente la aceptación de los planes de tratamiento estético. Además, sirve como una guía precisa para el odontólogo y el laboratorio dental durante la ejecución del tratamiento. El módulo se integra directamente con la ficha clínica del paciente, guardando cada proyecto de DSD como parte de su historial y permitiendo vincular el diseño aprobado a un plan de tratamiento específico (ej. carillas, coronas, ortodoncia).

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad reside dentro de la feature 'especialidades-clinicas'. La carpeta /pages contendrá la página principal de la herramienta DSD. La carpeta /components albergará todos los componentes reutilizables y específicos del DSD, como el lienzo de diseño, la galería de fotos, el panel de herramientas y la biblioteca de plantillas. La carpeta /apis gestionará las llamadas a los endpoints del backend para guardar, cargar y manipular los datos de los proyectos de diseño de sonrisa.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/DisenoSonrisaPage.tsx`
- `/features/especialidades-clinicas/pages/ProyectoDisenoSonrisaPage.tsx`

### Componentes React

- DisenoSonrisaCanvas
- GaleriaFotosDSD
- PanelHerramientasDSD
- LibreriaPlantillasSonrisa
- ComparadorAntesDespuesDSD
- ModalGenerarReporteDSD
- FormularioAnalisisFacial

## 🔌 APIs Backend

Las APIs para el Diseño de Sonrisa gestionan los proyectos de DSD asociados a cada paciente, incluyendo la creación, actualización, recuperación de datos del lienzo, gestión de imágenes y generación de reportes.

### `GET` `/api/pacientes/:pacienteId/dsd`

Obtiene una lista de todos los proyectos de Diseño de Sonrisa asociados a un paciente.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Array de objetos DisenoSonrisa (versión resumida).

### `POST` `/api/pacientes/:pacienteId/dsd`

Crea un nuevo proyecto de Diseño de Sonrisa para un paciente específico.

**Parámetros:** pacienteId (en la URL), nombreProyecto (en el body)

**Respuesta:** Objeto del nuevo DisenoSonrisa creado.

### `GET` `/api/dsd/:proyectoId`

Obtiene los detalles completos de un proyecto de Diseño de Sonrisa, incluyendo el estado del lienzo, fotos y análisis.

**Parámetros:** proyectoId (en la URL)

**Respuesta:** Objeto completo de DisenoSonrisa.

### `PUT` `/api/dsd/:proyectoId`

Actualiza un proyecto de Diseño de Sonrisa. Se usa para guardar el progreso, las notas, los datos del lienzo y el análisis facial.

**Parámetros:** proyectoId (en la URL), datosSimulacion, analisisFacial, notas (en el body)

**Respuesta:** Objeto DisenoSonrisa actualizado.

### `POST` `/api/dsd/:proyectoId/fotos`

Sube una o más fotos (multipart/form-data) a un proyecto de DSD.

**Parámetros:** proyectoId (en la URL), archivos de imagen (en el body)

**Respuesta:** Objeto DisenoSonrisa actualizado con las nuevas URLs de las fotos.

### `DELETE` `/api/dsd/:proyectoId/fotos/:fotoId`

Elimina una foto específica de un proyecto de DSD.

**Parámetros:** proyectoId (en la URL), fotoId (en la URL)

**Respuesta:** Mensaje de confirmación.

### `POST` `/api/dsd/:proyectoId/reporte`

Genera y devuelve un reporte en PDF del proyecto de DSD, mostrando el antes y el después.

**Parámetros:** proyectoId (en la URL)

**Respuesta:** URL al archivo PDF generado o el archivo directamente.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se centra en el modelo 'DisenoSonrisa' que almacena toda la información del proyecto. Un controlador dedicado maneja la lógica de negocio, y las rutas RESTful exponen esta funcionalidad de forma segura.

### Models

#### DisenoSonrisa

paciente: { type: ObjectId, ref: 'Paciente' }, odontologo: { type: ObjectId, ref: 'Usuario' }, fechaCreacion: Date, nombre: String, estado: String, fotos: [{ url: String, tipo: String, esPrincipal: Boolean }], analisisFacial: Object, datosSimulacion: Object, notas: String, planTratamientoAsociado: { type: ObjectId, ref: 'PlanTratamiento' }

### Controllers

#### DisenoSonrisaController

- crearProyectoDSD
- obtenerProyectosPorPaciente
- obtenerProyectoPorId
- actualizarProyectoDSD
- eliminarProyectoDSD
- agregarFotosAProyecto
- eliminarFotoDeProyecto
- generarReportePDF

### Routes

#### `/api/dsd`

- GET /:proyectoId
- PUT /:proyectoId
- POST /:proyectoId/fotos
- DELETE /:proyectoId/fotos/:fotoId
- POST /:proyectoId/reporte

#### `/api/pacientes/:pacienteId/dsd`

- GET /
- POST /

## 🔄 Flujos

1. El odontólogo accede a la ficha de un paciente y navega a la sección 'Diseño de Sonrisa'.
2. El sistema muestra los proyectos de DSD existentes para ese paciente o la opción de crear uno nuevo.
3. Al crear un nuevo proyecto, el odontólogo sube las fotografías iniciales del paciente (rostro completo, sonrisa, perfil, intraorales).
4. El odontólogo selecciona una foto principal para abrir el lienzo de diseño.
5. Dentro del lienzo, utiliza las herramientas para calibrar la imagen, trazar líneas de referencia y realizar un análisis estético.
6. Navega por la biblioteca de plantillas dentales, las superpone sobre la foto del paciente, ajustando tamaño, posición, rotación y forma.
7. El progreso se guarda periódicamente mediante una llamada a la API PUT.
8. El odontólogo utiliza la herramienta de comparación 'antes y después' para presentar la simulación al paciente.
9. Una vez aprobado el diseño, genera un reporte en PDF para el paciente y puede crear o vincular un plan de tratamiento en el ERP.

## 📝 User Stories

- Como odontólogo, quiero crear un proyecto de Diseño de Sonrisa para un paciente para poder planificar y visualizar tratamientos estéticos.
- Como odontólogo, quiero subir un set completo de fotos del paciente para tener una base precisa para el diseño digital.
- Como odontólogo, quiero disponer de herramientas digitales de medición y dibujo sobre la foto para analizar las proporciones faciales y dentales.
- Como odontólogo, quiero acceder a una librería de formas dentales para simular diferentes opciones de sonrisa y encontrar la más armónica.
- Como odontólogo, quiero guardar mi trabajo en el lienzo digital para poder continuar en otra sesión o realizar ajustes.
- Como odontólogo, quiero generar un informe profesional en PDF con la comparativa del 'antes' y el 'después' para aumentar la comprensión y aceptación del tratamiento por parte del paciente.
- Como odontólogo, quiero poder vincular un proyecto de DSD aprobado a un plan de tratamiento oficial dentro del ERP para asegurar la trazabilidad.

## ⚙️ Notas Técnicas

- Canvas Library: Se recomienda usar una librería de canvas como 'Fabric.js' o 'Konva.js' en el frontend para manejar la interactividad, objetos, capas y la serialización/deserialización del estado del lienzo (que se guardará como JSON en MongoDB).
- Almacenamiento de Imágenes: Las imágenes de alta resolución deben ser gestionadas a través de un servicio de almacenamiento en la nube (ej. AWS S3, Cloudinary). La base de datos solo almacenará las URLs y metadatos para optimizar el rendimiento y el almacenamiento de la base de datos.
- Generación de PDF: El backend puede utilizar librerías como 'Puppeteer' para renderizar un componente React/HTML a PDF, permitiendo un diseño de reporte altamente personalizable y consistente con la marca de la clínica.
- Seguridad y Permisos: Las rutas de la API deben estar protegidas, verificando que el usuario autenticado (odontólogo) tenga los permisos necesarios para acceder o modificar los datos del paciente y sus proyectos de DSD.
- Optimización de Rendimiento: Implementar carga diferida (lazy loading) para la galería de imágenes y la librería de plantillas. El guardado del estado del lienzo debe ser eficiente para no bloquear la interfaz de usuario, posiblemente usando web workers si los cálculos son intensivos.

