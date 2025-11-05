# Endodoncia: Registro de Conductos

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La página 'Endodoncia: Registro de Conductos' es una funcionalidad especializada dentro del módulo 'Especialidades Clínicas' del ERP dental. Su propósito fundamental es proporcionar una interfaz detallada y estructurada para que los odontólogos y sus asistentes documenten con precisión todos los parámetros clínicos de un tratamiento de conductos (endodoncia). A diferencia de un odontograma general que solo marca un tratamiento como realizado, esta herramienta permite registrar la anatomía específica de cada conducto radicular tratado en una pieza dental. Esto incluye datos críticos como la longitud de trabajo, el diámetro de la preparación apical (última lima), el cono de gutapercha maestro utilizado, la técnica de obturación (ej. condensación lateral, vertical caliente), el cemento sellador empleado y cualquier observación relevante (conductos calcificados, curvaturas pronunciadas, perforaciones, etc.). Esta funcionalidad es vital para la calidad de la atención, ya que un registro endodóntico meticuloso es crucial para el seguimiento a largo plazo del tratamiento, la toma de decisiones en caso de requerir un retratamiento y como un documento médico-legal robusto que respalda la praxis del profesional. Dentro del ERP, se integra directamente con el plan de tratamiento del paciente; al seleccionar un procedimiento de endodoncia planificado, el clínico accede a esta interfaz para completar la documentación post-operatoria.

## 👥 Roles de Acceso

- Odontólogo
- Auxiliar / Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

La funcionalidad se encuentra dentro de la feature 'especialidades-clinicas'. La carpeta /pages/ contiene el archivo principal de la página, por ejemplo, 'EndodonciaRegistroPage.tsx'. Los componentes reutilizables como el formulario para un conducto individual, el selector de pieza dental o el diagrama radicular, se ubican en /components/. La lógica para comunicarse con el backend (obtener, guardar y actualizar registros endodónticos) está encapsulada en funciones dentro de la carpeta /apis/.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/EndodonciaRegistroPage.tsx`
- `/features/especialidades-clinicas/components/EndodonciaForm.tsx`
- `/features/especialidades-clinicas/components/ConductoRadicularInput.tsx`
- `/features/especialidades-clinicas/components/DiagramaRadicular.tsx`
- `/features/especialidades-clinicas/apis/endodonciaApi.ts`

### Componentes React

- EndodonciaRegistroPage
- EndodonciaForm
- ConductoRadicularInput
- DiagramaRadicular

## 🔌 APIs Backend

Se necesitan APIs RESTful para gestionar los registros de endodoncia. Estos registros están vinculados a un paciente y a un tratamiento específico. Las operaciones incluyen crear un nuevo registro, obtener un registro existente para su visualización o edición, y actualizarlo. Se incluye un endpoint de utilidad para obtener información anatómica estándar de una pieza dental.

### `GET` `/api/endodoncia/tratamiento/:tratamientoId`

Obtiene el registro de endodoncia asociado a un ID de tratamiento específico. Se usa para cargar datos existentes al abrir la página.

**Parámetros:** tratamientoId (param)

**Respuesta:** Objeto JSON con los detalles del registro de endodoncia.

### `POST` `/api/endodoncia`

Crea un nuevo registro de endodoncia. Se utiliza al guardar por primera vez la información del tratamiento de conductos.

**Parámetros:** Body: { tratamientoId, pacienteId, odontologoId, numeroDiente, conductos: [...], observaciones }

**Respuesta:** Objeto JSON del nuevo registro creado, incluyendo su ID.

### `PUT` `/api/endodoncia/:registroId`

Actualiza un registro de endodoncia existente. Se usa cuando se edita y guarda la información.

**Parámetros:** registroId (param), Body: { conductos: [...], observaciones }

**Respuesta:** Objeto JSON del registro actualizado.

### `GET` `/api/dientes/anatomia/:numeroDiente`

Endpoint de utilidad para obtener la anatomía radicular más común (número de conductos y nombres típicos) de una pieza dental específica. Ayuda a pre-rellenar el formulario.

**Parámetros:** numeroDiente (param)

**Respuesta:** JSON con la anatomía dental estándar, ej: { conductosSugeridos: ['Mesiobucal', 'Distobucal', 'Palatino'] }.

## 🗂️ Estructura Backend (MERN)

Para soportar esta funcionalidad, el backend MERN requiere un modelo MongoDB 'RegistroEndodoncia' para persistir los datos. Un 'EndodonciaController' contendrá la lógica de negocio para manejar las operaciones CRUD sobre estos registros. Finalmente, un archivo en 'routes' definirá los endpoints de la API expuestos por Express.

### Models

#### RegistroEndodoncia

{
  tratamientoId: { type: Schema.Types.ObjectId, ref: 'Tratamiento', required: true },
  pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true },
  odontologoId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  numeroDiente: { type: Number, required: true },
  conductos: [
    {
      nombreConducto: { type: String, required: true, enum: ['Mesiobucal', 'Distobucal', 'Palatino', 'Vestibular', 'Lingual', 'Mesial', 'Distal', 'MV', 'ML', 'DV', 'DL', 'Otro'] },
      longitudTrabajo: { type: Number, required: true },
      instrumentoApical: { type: String, required: true },
      conoMaestro: { type: String, required: true },
      tecnicaObturacion: { type: String },
      sellador: { type: String },
      observacionesConducto: { type: String }
    }
  ],
  observacionesGenerales: { type: String },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date }
}

### Controllers

#### EndodonciaController

- crearRegistroEndodoncia
- obtenerRegistroPorTratamientoId
- actualizarRegistroEndodoncia

#### DienteController

- obtenerAnatomiaEstandar

### Routes

#### `/api/endodoncia`

- GET /tratamiento/:tratamientoId
- POST /
- PUT /:registroId

## 🔄 Flujos

1. El odontólogo selecciona un tratamiento de endodoncia desde el plan de tratamiento del paciente y hace clic en 'Registrar Detalles Clínicos'.
2. El sistema abre la página 'Registro de Conductos', precargando el número de la pieza dental y, opcionalmente, el número y nombre de los conductos más comunes para esa pieza.
3. El profesional o su asistente ingresa los datos específicos para cada conducto: longitud de trabajo, lima apical, cono maestro, etc.
4. Si la anatomía es atípica, el usuario puede añadir o eliminar campos de conductos dinámicamente en el formulario.
5. Una vez completada la información, el usuario guarda el registro. El sistema valida los datos y los persiste en la base de datos.
6. El registro queda permanentemente asociado al historial clínico del paciente y al tratamiento específico, pudiendo ser consultado en cualquier momento.

## 📝 User Stories

- Como Odontólogo, quiero registrar de forma estructurada los detalles de cada conducto tratado en una endodoncia para mantener un historial clínico preciso y completo.
- Como Auxiliar Dental, quiero una interfaz clara y rápida para introducir los datos que el odontólogo me dicta durante el procedimiento, para optimizar el tiempo en la clínica.
- Como Odontólogo, quiero poder consultar un registro de endodoncia previo antes de realizar un retratamiento para entender la anatomía y los materiales utilizados anteriormente.
- Como Odontólogo, quiero que el sistema me sugiera la configuración de conductos más habitual para un diente específico para agilizar la creación de un nuevo registro.

## ⚙️ Notas Técnicas

- Seguridad: Implementar validación a nivel de API para asegurar que el usuario autenticado tiene permiso para acceder y modificar registros del paciente en cuestión. Utilizar middlewares de autorización por rol.
- Validación de Datos: Es crucial aplicar una validación estricta tanto en el frontend (para feedback inmediato al usuario) como en el backend (para garantizar la integridad de los datos). Campos como 'longitudTrabajo' deben ser numéricos y estar dentro de un rango lógico.
- Usabilidad: El formulario debe manejar dinámicamente la adición y eliminación de conductos. El uso de librerías como 'react-hook-form' con 'useFieldArray' es altamente recomendable para gestionar la complejidad del estado del formulario.
- Integración: El guardado exitoso de este registro debe poder actualizar el estado del 'Tratamiento' en el módulo de Plan de Tratamiento (ej. de 'En progreso' a 'Realizado').
- Consistencia de datos: Utilizar listas desplegables (selects) para campos como 'Técnica de Obturación' o 'Sellador', poblados desde una colección de configuración general del sistema para mantener la consistencia terminológica.

