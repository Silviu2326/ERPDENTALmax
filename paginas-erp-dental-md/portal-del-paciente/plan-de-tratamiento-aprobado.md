# Plan de Tratamiento Aprobado

**Categoría:** Portal del Paciente | **Módulo:** Portal del Paciente

La página 'Plan de Tratamiento Aprobado' es una funcionalidad clave dentro del Portal del Paciente del ERP dental. Su propósito fundamental es ofrecer al paciente una visión completa, transparente y accesible del plan de tratamiento que ha sido diagnosticado por el odontólogo y aceptado por él. Esta sección actúa como un centro de información centralizado donde el paciente puede consultar en cualquier momento los detalles de su tratamiento. Se presenta un desglose exhaustivo, incluyendo las diferentes fases o etapas (por ejemplo, 'Fase 1: Saneamiento', 'Fase 2: Ortodoncia'), los procedimientos específicos dentro de cada fase (como 'Endodoncia Molar', 'Colocación de Brackets'), los costos asociados a cada procedimiento y el costo total. Además, la página visualiza el progreso del tratamiento, marcando claramente qué procedimientos ya han sido completados, cuáles están en curso y cuáles están pendientes. Se integra directamente con el módulo de 'Agenda de Citas' para mostrar las citas programadas asociadas a cada procedimiento, permitiendo al paciente tener una perspectiva clara del cronograma. Esta funcionalidad empodera al paciente, mejora la comunicación y la confianza con la clínica, reduce la incertidumbre y fomenta un mayor compromiso con el tratamiento al proporcionar una hoja de ruta clara y detallada.

## 👥 Roles de Acceso

- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-paciente/`

Esta funcionalidad reside dentro de la feature 'portal-paciente'. La carpeta '/pages/' contiene el componente principal de la página. Los componentes reutilizables específicos, como el timeline de fases o la tarjeta de resumen financiero, se encuentran en '/components/'. Las llamadas al backend para obtener los datos del plan de tratamiento se definen y gestionan en la carpeta '/apis/'.

### Archivos Frontend

- `/features/portal-paciente/pages/PlanTratamientoAprobadoPage.tsx`
- `/features/portal-paciente/components/ResumenPlanCard.tsx`
- `/features/portal-paciente/components/FasesTratamientoTimeline.tsx`
- `/features/portal-paciente/components/ProcedimientoItem.tsx`
- `/features/portal-paciente/components/CostosDesgloseWidget.tsx`
- `/features/portal-paciente/apis/tratamientoApi.ts`

### Componentes React

- PlanTratamientoAprobadoPage
- ResumenPlanCard
- FasesTratamientoTimeline
- ProcedimientoItem
- CostosDesgloseWidget
- CitasAsociadasList

## 🔌 APIs Backend

Se requiere una API principal para obtener todos los detalles del plan de tratamiento activo y aprobado del paciente que ha iniciado sesión. La autenticación se manejará a través de un token JWT para garantizar que cada paciente solo pueda acceder a su propia información.

### `GET` `/api/portal/pacientes/mi-plan-tratamiento`

Obtiene el plan de tratamiento activo y aprobado para el paciente autenticado. Devuelve el plan completo, incluyendo fases, procedimientos, estados, costos y citas asociadas.

**Parámetros:** Authorization: Bearer <token> (en la cabecera)

**Respuesta:** Un objeto JSON que contiene los detalles del plan de tratamiento, con un array de fases, y dentro de cada fase, un array de procedimientos. Incluye información del paciente, estado general, costos y fechas.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad a través de un modelo 'Tratamiento' que está vinculado a un 'Paciente'. Un controlador específico para el portal del paciente maneja la lógica de negocio para recuperar de forma segura los datos del paciente autenticado, y una ruta protegida expone este endpoint.

### Models

#### Tratamiento

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, odontologo: { type: Schema.Types.ObjectId, ref: 'Usuario' }, estado: { type: String, enum: ['Propuesto', 'Aprobado', 'En Progreso', 'Completado', 'Rechazado'] }, fechaAprobacion: Date, costoTotalEstimado: Number, costoTotalReal: Number, fases: [{ nombre: String, descripcion: String, estado: String, orden: Number, procedimientos: [{ procedimiento: { type: Schema.Types.ObjectId, ref: 'Procedimiento' }, estado: { type: String, enum: ['Pendiente', 'Completado'] }, costo: Number, cita: { type: Schema.Types.ObjectId, ref: 'Cita' } }] }]

#### Paciente

usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }, historialClinico: String, ... (otros campos del paciente)

### Controllers

#### PortalPacienteController

- getMiPlanTratamiento

### Routes

#### `/api/portal/pacientes`

- GET /mi-plan-tratamiento

## 🔄 Flujos

1. El paciente inicia sesión en el portal.
2. El paciente navega a la sección 'Mi Plan de Tratamiento' desde el menú principal.
3. El frontend realiza una llamada GET a '/api/portal/pacientes/mi-plan-tratamiento' enviando el token de autenticación.
4. El backend verifica el token, identifica al paciente y busca en la base de datos su plan de tratamiento con estado 'Aprobado' o 'En Progreso'.
5. La API devuelve los datos del plan, que son renderizados en la página, mostrando un resumen general, un desglose por fases en formato de línea de tiempo y un detalle de los costos.
6. El paciente puede expandir cada fase para ver los procedimientos específicos, su estado (completado/pendiente) y la fecha de la cita asociada, si existe.

## 📝 User Stories

- Como paciente, quiero ver mi plan de tratamiento aprobado en el portal para entender claramente todos los procedimientos que se me realizarán, su orden y su propósito.
- Como paciente, quiero consultar el desglose de costos de mi tratamiento para tener transparencia financiera y poder planificar mis pagos.
- Como paciente, quiero visualizar el progreso de mi tratamiento, viendo qué procedimientos ya se han completado, para sentirme informado y motivado.
- Como paciente, quiero ver las próximas citas asociadas a mi plan de tratamiento para poder organizar mi agenda personal.

## ⚙️ Notas Técnicas

- Seguridad: El endpoint debe estar protegido por un middleware de autenticación (ej: JWT) que extraiga el ID del paciente del token. Nunca se debe confiar en un ID enviado desde el cliente.
- Rendimiento: Utilizar el método `.populate()` de Mongoose en el backend para cargar eficientemente los datos relacionados (procedimientos, citas) en una sola consulta a la base de datos y evitar el problema N+1.
- UI/UX: Implementar una visualización de línea de tiempo (timeline) o un componente 'stepper' vertical para representar las fases del tratamiento de una manera intuitiva y fácil de seguir.
- Integración: Los datos de costos deben reflejar los pagos ya realizados por el paciente. Esto requiere una integración con el módulo de Facturación para mostrar saldos pendientes.
- Estado Consistente: La actualización del estado de un procedimiento (de 'Pendiente' a 'Completado') debe ser una operación atómica, preferiblemente gestionada desde el módulo de Odontograma o Historia Clínica por el profesional, y reflejada automáticamente en el portal del paciente.

