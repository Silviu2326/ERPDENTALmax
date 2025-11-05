# Endodoncia: Control Postoperatorio

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'Endodoncia: Control Postoperatorio' es una herramienta especializada dentro del módulo 'Especialidades Clínicas', diseñada para el seguimiento y la evaluación a largo plazo de los tratamientos de conductos radiculares. Su propósito fundamental es permitir a los odontólogos y especialistas registrar, visualizar y comparar la evolución de un paciente después de una endodoncia, garantizando así la calidad del tratamiento y la salud bucal del paciente. Esta página centraliza toda la información crítica post-tratamiento, incluyendo la sintomatología reportada por el paciente (dolor, sensibilidad), los signos clínicos observados (presencia de fístulas, movilidad dental, respuesta a la percusión) y, de manera crucial, los hallazgos radiográficos que evidencian la cicatrización ósea periapical. El sistema presenta esta información de forma cronológica, a menudo como una línea de tiempo interactiva, permitiendo al profesional comparar radiografías y datos clínicos de diferentes fechas (ej. control a los 6 meses, 1 año, 2 años). Esto no solo facilita la detección temprana de posibles fracasos del tratamiento, sino que también proporciona una base de datos sólida para la toma de decisiones clínicas y constituye un registro médico-legal detallado. Dentro del ERP, esta funcionalidad se integra directamente con la ficha del paciente y el módulo de tratamientos, vinculando cada control a un tratamiento de endodoncia específico realizado en una pieza dental concreta.

## 👥 Roles de Acceso

- Odontólogo
- Auxiliar / Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

La funcionalidad reside dentro de la carpeta 'especialidades-clinicas'. La subcarpeta '/pages' contiene el archivo principal 'EndodonciaControlPostoperatorioPage.tsx', que renderiza la interfaz completa. La carpeta '/components' alberga los componentes reutilizables como el formulario para añadir un nuevo control, la línea de tiempo que muestra los controles históricos y el visor de imágenes para las radiografías. Finalmente, la carpeta '/apis' contiene las funciones que encapsulan las llamadas a los endpoints del backend para obtener, crear y actualizar los datos de los controles postoperatorios.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/EndodonciaControlPostoperatorioPage.tsx`
- `/features/especialidades-clinicas/components/TimelineControlesEndo.tsx`
- `/features/especialidades-clinicas/components/FormularioNuevoControlEndo.tsx`
- `/features/especialidades-clinicas/components/VisorRadiografiasComparativo.tsx`
- `/features/especialidades-clinicas/apis/controlesEndodonciaApi.ts`

### Componentes React

- EndodonciaControlPostoperatorioPage
- TimelineControlesEndo
- FormularioNuevoControlEndo
- VisorRadiografiasComparativo
- CardDetalleControlEndo
- ModalAdjuntarRadiografia

## 🔌 APIs Backend

Las APIs gestionan toda la información relacionada con los controles postoperatorios de endodoncia. Permiten obtener el historial completo de controles para un tratamiento específico, registrar un nuevo control con sus datos clínicos y radiografías, y modificar o eliminar registros existentes.

### `GET` `/api/especialidades-clinicas/endodoncia/tratamientos/{tratamientoId}/controles`

Obtiene una lista cronológica de todos los controles postoperatorios asociados a un ID de tratamiento de endodoncia específico.

**Parámetros:** tratamientoId (en la URL)

**Respuesta:** Un array de objetos, donde cada objeto representa un control postoperatorio con todos sus datos.

### `POST` `/api/especialidades-clinicas/endodoncia/controles`

Crea un nuevo registro de control postoperatorio. El body debe incluir el ID del tratamiento asociado, la fecha, y todos los datos clínicos y observaciones. Puede incluir la gestión de subida de archivos adjuntos (radiografías).

**Parámetros:** Body: { tratamientoId, fechaControl, sintomatologia, signosClinicos, hallazgosRadiograficos, observaciones, adjuntos: [...] }

**Respuesta:** El objeto del nuevo control postoperatorio creado, incluyendo su ID único.

### `PUT` `/api/especialidades-clinicas/endodoncia/controles/{controlId}`

Actualiza la información de un control postoperatorio existente. Se utiliza para corregir errores o añadir información complementaria.

**Parámetros:** controlId (en la URL), Body: { ...campos a actualizar... }

**Respuesta:** El objeto del control postoperatorio actualizado.

### `DELETE` `/api/especialidades-clinicas/endodoncia/controles/{controlId}`

Elimina un registro de control postoperatorio. Se recomienda implementar un borrado lógico (soft delete).

**Parámetros:** controlId (en la URL)

**Respuesta:** Un mensaje de confirmación de la eliminación.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo MongoDB 'ControlEndodontico' para almacenar los datos de cada seguimiento. Un controlador 'EndodonciaController' gestiona la lógica de negocio (crear, leer, actualizar, borrar) y las rutas en Express exponen esta lógica a través de una API RESTful.

### Models

#### ControlEndodontico

{
  tratamientoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tratamiento', required: true },
  pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  profesionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fechaControl: { type: Date, default: Date.now },
  sintomatologia: { type: String, enum: ['Asintomático', 'Dolor espontáneo', 'Sensibilidad a la percusión', 'Sensibilidad a la palpación'] },
  signosClinicos: { type: String, enum: ['Ninguno', 'Fístula', 'Edema', 'Movilidad aumentada'] },
  hallazgosRadiograficos: { type: String, required: true },
  diagnosticoEvolutivo: { type: String, enum: ['Éxito (curación)', 'En progreso', 'Dudoso', 'Fracaso'] },
  observaciones: { type: String },
  adjuntos: [{ url: String, nombreArchivo: String, fechaSubida: Date }],
  createdAt: { type: Date, default: Date.now }
}

### Controllers

#### EndodonciaController

- getControlesPorTratamiento
- createControlEndodontico
- updateControlEndodontico
- deleteControlEndodontico

### Routes

#### `/api/especialidades-clinicas/endodoncia`

- GET /tratamientos/:tratamientoId/controles
- POST /controles
- PUT /controles/:controlId
- DELETE /controles/:controlId

## 🔄 Flujos

1. El odontólogo selecciona un paciente y navega a su historial de tratamientos.
2. Dentro de un tratamiento de endodoncia finalizado, accede a la pestaña 'Control Postoperatorio'.
3. El sistema realiza una llamada GET para cargar y mostrar en una línea de tiempo todos los controles previos para ese tratamiento.
4. El usuario hace clic en 'Añadir Control'. Se abre un modal o formulario.
5. El odontólogo o auxiliar completa los campos del formulario: sintomatología, signos, hallazgos radiográficos y observaciones.
6. Se adjuntan las nuevas radiografías del control, que se suben al servidor de archivos.
7. Al guardar, se realiza una llamada POST al backend. El nuevo control se añade a la base de datos y la línea de tiempo en la interfaz se actualiza automáticamente.

## 📝 User Stories

- Como odontólogo, quiero registrar los hallazgos clínicos y radiográficos de cada control post-endodoncia para monitorizar la curación periapical y asegurar el éxito del tratamiento.
- Como especialista en endodoncia, quiero visualizar una línea de tiempo comparativa de las radiografías de un mismo tratamiento para evaluar objetivamente la reducción de una lesión periapical a lo largo de los meses.
- Como auxiliar dental, quiero adjuntar fácilmente las radiografías tomadas durante la cita de control al registro correspondiente para mantener la historia clínica completa y organizada.
- Como odontólogo, quiero filtrar y ver rápidamente todos los tratamientos de endodoncia con un diagnóstico evolutivo 'Dudoso' o 'Fracaso' para planificar retratamientos o intervenciones adicionales.

## ⚙️ Notas Técnicas

- Seguridad: Implementar RBAC (Control de Acceso Basado en Roles) estricto para asegurar que solo el personal clínico autorizado pueda acceder y modificar estos registros. Toda la información del paciente debe ser encriptada en tránsito (TLS/SSL) y en reposo.
- Gestión de Archivos: Se debe utilizar un servicio de almacenamiento de objetos como Amazon S3 o Google Cloud Storage para las radiografías. El backend gestionará la subida segura y almacenará únicamente la URL del archivo en la base de datos MongoDB para no sobrecargarla.
- Integración: Es crucial una fuerte vinculación con el Odontograma y el módulo de Tratamientos. Cada control debe estar inseparablemente ligado al `tratamientoId` y `piezaDental` correctos.
- Rendimiento: La colección 'ControlEndodontico' en MongoDB debe tener índices en `tratamientoId` y `pacienteId` para acelerar las consultas de historial.
- UI/UX: El componente de visualización de radiografías debe permitir hacer zoom, ajustar contraste/brillo y comparar dos imágenes lado a lado para facilitar el diagnóstico.

