# Ortodoncia: Controles Mensuales

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'Ortodoncia: Controles Mensuales' es una herramienta especializada dentro del módulo padre 'Especialidades Clínicas', diseñada para el seguimiento y la documentación exhaustiva de los tratamientos de ortodoncia. Su propósito principal es permitir a los odontólogos, específicamente a los ortodoncistas, registrar de manera sistemática y detallada cada una de las visitas de control que un paciente realiza a lo largo de su tratamiento. Esto incluye la documentación de los procedimientos efectuados, como cambios de arcos, ligaduras, activación de aparatos, y la prescripción de elementos auxiliares como elásticos intermaxilares. Dentro del ERP dental, esta funcionalidad se integra directamente con la ficha clínica del paciente y su plan de tratamiento de ortodoncia activo. Funciona como un historial clínico cronológico y visual, mostrando una línea de tiempo con todos los controles realizados desde el inicio del tratamiento. Cada entrada de control permite adjuntar fotografías de progreso (intraorales y extraorales), lo que es crucial para la evaluación objetiva de la evolución del caso. Además, se conecta con otros módulos del sistema: puede generar la próxima cita en el módulo de 'Agenda', y los procedimientos registrados pueden ser enviados al módulo de 'Facturación' para generar los cargos correspondientes al control mensual. Es una pieza clave para garantizar la calidad del tratamiento, la comunicación con el paciente y la defensa médico-legal.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

La funcionalidad se encuentra dentro de la feature 'especialidades-clinicas'. La subcarpeta '/pages' contiene el componente principal de la página que orquesta la visualización del historial y la creación de nuevos controles. La carpeta '/components' alberga los componentes reutilizables específicos de ortodoncia, como el formulario de control, la galería de fotos y la línea de tiempo del tratamiento. La carpeta '/apis' gestiona las funciones que interactúan con el backend para obtener, crear y actualizar los datos de los controles de ortodoncia.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/OrtodonciaTratamientoDetailPage.tsx`
- `/features/especialidades-clinicas/components/ortodoncia/HistorialControlesTimeline.tsx`
- `/features/especialidades-clinicas/components/ortodoncia/ControlMensualForm.tsx`
- `/features/especialidades-clinicas/components/ortodoncia/GaleriaProgresoControl.tsx`
- `/features/especialidades-clinicas/apis/ortodonciaApi.ts`

### Componentes React

- OrtodonciaTratamientoDetailPage
- HistorialControlesTimeline
- ControlMensualCard
- ModalNuevoControl
- ControlMensualForm
- GaleriaProgresoControl
- UploaderFotosProgreso

## 🔌 APIs Backend

Las APIs gestionan todas las operaciones CRUD para los controles de ortodoncia, asociándolos a un tratamiento y paciente específico. Incluyen endpoints para listar el historial, crear nuevos registros, actualizar existentes y manejar la carga de imágenes de progreso.

### `GET` `/api/ortodoncia/tratamientos/:tratamientoId/controles`

Obtiene la lista completa de controles mensuales para un tratamiento de ortodoncia específico, ordenados por fecha.

**Parámetros:** tratamientoId (param)

**Respuesta:** Array de objetos de ControlOrtodoncia.

### `POST` `/api/ortodoncia/tratamientos/:tratamientoId/controles`

Crea un nuevo registro de control mensual para un tratamiento de ortodoncia.

**Parámetros:** tratamientoId (param), Body: { fechaControl, descripcionProcedimiento, cambioArcoSuperior, cambioArcoInferior, usoElasticos, observaciones, proximaCita, odontologoId }

**Respuesta:** Objeto del nuevo ControlOrtodoncia creado.

### `PUT` `/api/ortodoncia/controles/:controlId`

Actualiza la información de un control mensual existente.

**Parámetros:** controlId (param), Body: { ...campos a actualizar... }

**Respuesta:** Objeto del ControlOrtodoncia actualizado.

### `POST` `/api/ortodoncia/controles/:controlId/fotos`

Sube una o más fotos de progreso y las asocia a un control específico.

**Parámetros:** controlId (param), Body: FormData con los archivos de imagen.

**Respuesta:** Array de URLs de las imágenes subidas.

### `DELETE` `/api/ortodoncia/controles/:controlId`

Elimina un registro de control mensual (se recomienda borrado lógico).

**Parámetros:** controlId (param)

**Respuesta:** Mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

El backend utiliza modelos de MongoDB para representar los tratamientos y los controles. Los controladores contienen la lógica de negocio para gestionar estos datos, y las rutas exponen esta lógica a través de una API RESTful.

### Models

#### ControlOrtodoncia

{
  tratamientoId: { type: Schema.Types.ObjectId, ref: 'TratamientoOrtodoncia', required: true },
  odontologoId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fechaControl: { type: Date, default: Date.now },
  descripcionProcedimiento: String,
  cambioArcoSuperior: String,
  cambioArcoInferior: String,
  usoElasticos: String,
  observaciones: String,
  fotosProgreso: [String], // Array de URLs de las imágenes
  proximaCita: Date
}

#### TratamientoOrtodoncia

{
  pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true },
  fechaInicio: Date,
  diagnostico: String,
  planTratamiento: String,
  estado: { type: String, enum: ['Activo', 'Finalizado', 'Pausado'], default: 'Activo' },
  controles: [{ type: Schema.Types.ObjectId, ref: 'ControlOrtodoncia' }]
}

### Controllers

#### OrtodonciaController

- obtenerControlesPorTratamiento
- crearControl
- actualizarControl
- eliminarControl
- agregarFotosAControl

### Routes

#### `/api/ortodoncia`

- GET /tratamientos/:tratamientoId/controles
- POST /tratamientos/:tratamientoId/controles
- PUT /controles/:controlId
- DELETE /controles/:controlId
- POST /controles/:controlId/fotos

## 🔄 Flujos

1. El odontólogo selecciona un paciente y accede a su plan de tratamiento de ortodoncia activo.
2. Dentro del plan, navega a la sección 'Controles' donde visualiza una línea de tiempo con los registros anteriores.
3. Hace clic en 'Añadir Nuevo Control' para abrir un modal con el formulario de registro.
4. Completa los campos del formulario: procedimiento realizado, cambios de arcos/ligaduras, indicaciones de elásticos y observaciones generales.
5. Utiliza el componente de carga de archivos para subir las fotos de progreso del día (frontal, perfiles, intraorales).
6. Al guardar, el sistema crea el nuevo registro, lo añade a la línea de tiempo del paciente y actualiza la referencia en el modelo de TratamientoOrtodoncia.
7. Opcionalmente, el sistema puede presentar una interfaz para agendar la próxima cita de control, integrándose con el módulo de Agenda.

## 📝 User Stories

- Como odontólogo, quiero registrar los detalles de cada control mensual de ortodoncia para mantener un historial clínico preciso y auditable del progreso del paciente.
- Como odontólogo, quiero subir y comparar fotos de progreso en cada control para evaluar visualmente la evolución del tratamiento y mostrársela al paciente.
- Como odontólogo, quiero ver un timeline de todos los controles de un paciente para tener una visión rápida y cronológica de las acciones tomadas a lo largo del tratamiento.
- Como odontólogo, quiero poder anotar las indicaciones dadas al paciente (ej. horas de uso de elásticos) para verificar su cumplimiento en la siguiente cita y reforzar la importancia de su colaboración.
- Como odontólogo, quiero que los procedimientos registrados en el control se puedan vincular fácilmente a la facturación para agilizar el proceso administrativo.

## ⚙️ Notas Técnicas

- Seguridad: Implementar RBAC (Role-Based Access Control) para asegurar que solo los odontólogos asignados a un paciente o con permisos generales puedan ver y modificar los controles. Validar en el backend que el 'tratamientoId' pertenece al paciente correcto.
- Almacenamiento de Imágenes: Utilizar un servicio de almacenamiento en la nube (como AWS S3, Google Cloud Storage, o Cloudinary) para las fotos de progreso. Guardar únicamente las URLs en la base de datos de MongoDB para no sobrecargarla y mejorar el rendimiento.
- Rendimiento: En el frontend, implementar 'lazy loading' para la galería de imágenes y paginación en el historial de controles si el tratamiento es muy largo (más de 24-36 meses).
- Optimización de Imágenes: Antes de subir las fotos al servicio de almacenamiento, procesarlas en el cliente (frontend) para redimensionarlas y comprimirlas, reduciendo así los tiempos de carga y los costos de almacenamiento.
- Integración con Agenda: La fecha de la 'próxima cita' debería poder interactuar directamente con la API del módulo de Agenda para verificar disponibilidad y crear el evento.
- Atomicidad: Al crear un nuevo control, la operación en el backend debe ser atómica, asegurando que se cree el documento 'ControlOrtodoncia' y se añada su ID al array 'controles' del documento 'TratamientoOrtodoncia' de forma consistente.

