# Odontopediatría: Fichas Pediátricas

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'Fichas Pediátricas' es una herramienta especializada dentro del módulo 'Especialidades Clínicas', diseñada para el registro y seguimiento exhaustivo de pacientes infantiles. A diferencia de la ficha de un adulto, la ficha pediátrica se centra en las particularidades del desarrollo y crecimiento del niño, ofreciendo herramientas específicas para el odontopediatra. Su propósito principal es centralizar toda la información relevante del paciente infantil en un único expediente digital, facilitando un diagnóstico preciso, un plan de tratamiento adecuado y una comunicación efectiva con los padres o tutores. Dentro del ERP, esta funcionalidad permite registrar datos cruciales como la anamnesis pediátrica (historial de embarazo y nacimiento, tipo de lactancia, historial médico infantil), hábitos bucales (succión digital, uso de chupete/biberón, bruxismo), y llevar un control del desarrollo craneofacial y la erupción dental. Incluye un odontograma interactivo adaptado para dentición temporal y mixta, permitiendo al profesional marcar el estado de cada diente (erupcionado, ausente, con caries, sellado, etc.) de una forma visual e intuitiva. Además, integra secciones para la evaluación del riesgo de caries, registro de traumatismos dentales y planificación de tratamientos preventivos y correctivos. Esta ficha es fundamental para la práctica odontopediátrica moderna, ya que no solo documenta el estado clínico, sino que también sirve como una herramienta de seguimiento a largo plazo, permitiendo visualizar la evolución del paciente a lo largo de los años.

## 👥 Roles de Acceso

- Odontólogo
- Higienista

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad se ubica dentro de la feature 'especialidades-clinicas'. La carpeta /pages contendrá el componente principal 'FichaPediatricaPage.tsx', que se renderiza cuando se accede a la ficha de un paciente pediátrico. La carpeta /components albergará todos los componentes reutilizables que conforman la ficha, como 'OdontogramaMixto.tsx' para la visualización dental, 'FormularioAnamnesisPediatrica.tsx' para la recogida de datos iniciales, y 'SeccionHabitosYControl.tsx' para registrar hábitos y seguimiento. La carpeta /apis contendrá el archivo 'fichasPediatricasAPI.ts' con las funciones para interactuar con el backend, como obtener, crear y actualizar la información de la ficha pediátrica.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/FichaPediatricaPage.tsx`
- `/features/especialidades-clinicas/components/OdontogramaMixto.tsx`
- `/features/especialidades-clinicas/components/FormularioAnamnesisPediatrica.tsx`
- `/features/especialidades-clinicas/components/SeccionHabitosYControl.tsx`
- `/features/especialidades-clinicas/components/EvaluacionRiesgoCaries.tsx`
- `/features/especialidades-clinicas/components/RegistroEvolucionPediatrica.tsx`
- `/features/especialidades-clinicas/apis/fichasPediatricasAPI.ts`

### Componentes React

- FichaPediatricaLayout
- SeccionAnamnesisPediatrica
- OdontogramaMixto
- RegistroHabitos
- EvaluacionRiesgoCaries
- GraficoCrecimientoDesarrollo
- ModalRegistroTraumatismo

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan todos los datos relacionados con la ficha clínica pediátrica. Permiten la creación de una nueva ficha para un paciente, la recuperación de todos sus datos para su visualización y la actualización de secciones específicas como el odontograma, la anamnesis, los hábitos o las notas de evolución.

### `GET` `/api/fichas-pediatricas/paciente/:pacienteId`

Obtiene la ficha pediátrica completa de un paciente específico.

**Parámetros:** pacienteId (param de la URL)

**Respuesta:** Objeto JSON con todos los datos de la FichaPediatrica.

### `POST` `/api/fichas-pediatricas`

Crea una nueva ficha pediátrica para un paciente que aún no la tiene.

**Parámetros:** Body: { pacienteId: string, anamnesisInicial: object, ... }

**Respuesta:** Objeto JSON de la nueva FichaPediatrica creada.

### `PUT` `/api/fichas-pediatricas/:fichaId`

Actualiza la información general o secciones completas de una ficha pediátrica existente.

**Parámetros:** fichaId (param de la URL), Body: { anamnesisPediatrica: object, examenClinico: object, ... }

**Respuesta:** Objeto JSON de la FichaPediatrica actualizada.

### `PUT` `/api/fichas-pediatricas/:fichaId/odontograma`

Actualiza específicamente el estado del odontograma pediátrico.

**Parámetros:** fichaId (param de la URL), Body: { dientes: array }

**Respuesta:** Objeto JSON con el estado del odontograma actualizado.

### `POST` `/api/fichas-pediatricas/:fichaId/evolucion`

Añade una nueva nota de evolución o seguimiento a la ficha del paciente.

**Parámetros:** fichaId (param de la URL), Body: { fecha: date, nota: string, profesionalId: string }

**Respuesta:** Array actualizado de notas de evolución.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se centra en el modelo 'FichaPediatrica', que está vinculado al modelo 'Paciente'. Un controlador específico, 'FichaPediatricaController', manejará toda la lógica de negocio, y las rutas se expondrán bajo el prefijo '/api/fichas-pediatricas' para una gestión modular y coherente.

### Models

#### FichaPediatrica

pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true, unique: true }, anamnesisPediatrica: { historiaNacimiento: String, alimentacion: String, historialMedico: String }, habitos: [{ nombre: String, activo: Boolean, observaciones: String }], odontograma: { dientes: [{ numero: Number, tipo: String, estado: String, observaciones: String }] }, riesgoCaries: { nivel: String, fechaEvaluacion: Date }, traumatismos: [{ fecha: Date, diente: Number, descripcion: String }], evolucion: [{ fecha: Date, nota: String, profesionalId: { type: Schema.Types.ObjectId, ref: 'Usuario' } }]

### Controllers

#### FichaPediatricaController

- crearFichaPediatrica
- obtenerFichaPorPacienteId
- actualizarFichaCompleta
- actualizarOdontograma
- agregarNotaEvolucion

### Routes

#### `/api/fichas-pediatricas`

- POST /
- GET /paciente/:pacienteId
- PUT /:fichaId
- PUT /:fichaId/odontograma
- POST /:fichaId/evolucion

## 🔄 Flujos

1. El odontólogo abre la ficha de un paciente infantil. Si no existe una Ficha Pediátrica, el sistema le ofrece crear una.
2. Al crearla, el profesional rellena la anamnesis pediátrica inicial con la información proporcionada por los padres.
3. Durante la consulta, el odontólogo o higienista accede a la ficha, visualiza el odontograma mixto y actualiza el estado de los dientes según la exploración (p. ej., marca un nuevo diente erupcionado o una caries).
4. El profesional registra o actualiza la información sobre hábitos del niño (ej. 'ha dejado el chupete') en la sección correspondiente.
5. Al final de la visita, se añade una nueva entrada en la sección de 'Evolución' resumiendo los hallazgos, el tratamiento realizado y las recomendaciones dadas a los padres.
6. Se realiza una evaluación del riesgo de caries y se registra en la ficha para programar las siguientes revisiones preventivas.

## 📝 User Stories

- Como odontólogo, quiero crear una ficha pediátrica completa para un nuevo paciente infantil, para registrar toda su información específica desde el inicio, incluyendo historial de nacimiento y hábitos.
- Como odontólogo, quiero visualizar y actualizar un odontograma de dentición mixta para registrar con precisión qué dientes son temporales, cuáles permanentes, y su estado (sano, con caries, extraído, sellado).
- Como higienista, quiero acceder a la sección de hábitos del paciente (chupete, succión digital) para poder realizar una correcta educación en higiene y prevención con los padres.
- Como odontólogo, quiero registrar la evaluación de riesgo de caries del niño para definir un plan de prevención personalizado y citas de seguimiento adecuadas.
- Como odontólogo, quiero añadir notas de evolución en cada visita para tener un historial cronológico claro del desarrollo y tratamiento del paciente.
- Como odontólogo, quiero poder registrar un traumatismo dental de forma rápida y detallada, asociándolo al diente afectado y a la fecha del suceso.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un control de acceso basado en roles (RBAC) estricto para asegurar que solo el personal clínico autorizado pueda acceder y modificar las fichas pediátricas. Todos los datos deben estar encriptados en reposo y en tránsito (SSL/TLS).
- Rendimiento: El componente del odontograma debe ser optimizado para un renderizado rápido, preferiblemente usando SVG y manejando su estado localmente para evitar re-renders innecesarios de toda la página. Considerar la paginación o carga bajo demanda para el historial de evolución si este llega a ser muy extenso.
- Integración: La ficha pediátrica debe estar vinculada de forma inequívoca al registro principal del paciente. Debe integrarse con el módulo de 'Planes de Tratamiento' para que los tratamientos propuestos se reflejen en la ficha y viceversa.
- Usabilidad (UI/UX): El diseño debe ser claro y visualmente atractivo, utilizando iconos y colores para diferenciar estados en el odontograma. Debe ser fácil distinguir entre dientes temporales y permanentes. La navegación entre las distintas secciones de la ficha (anamnesis, odontograma, hábitos) debe ser fluida y rápida.
- Validación de Datos: Implementar validaciones robustas tanto en el frontend como en el backend para asegurar la integridad de los datos, por ejemplo, en fechas, tipos de datos y campos obligatorios.

