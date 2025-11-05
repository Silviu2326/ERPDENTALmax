# Ortodoncia: Retención y Contención

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La página 'Ortodoncia: Retención y Contención' es una funcionalidad especializada dentro del módulo 'Especialidades Clínicas' del ERP dental. Su propósito principal es gestionar y documentar de manera exhaustiva la fase final y más crítica del tratamiento de ortodoncia: la retención. Una vez que se retiran los brackets, es fundamental asegurar que los resultados obtenidos se mantengan a largo plazo, previniendo la recidiva (el movimiento de los dientes a su posición original). Esta funcionalidad proporciona al odontólogo especialista (ortodoncista) las herramientas necesarias para diseñar, implementar y supervisar planes de retención personalizados para cada paciente. Permite registrar detalladamente los tipos de retenedores utilizados (fijos, removibles como Hawley o Essix), las fechas de colocación, las instrucciones de uso para el paciente y el cronograma de citas de seguimiento. Dentro del ERP, esta página se integra directamente con la historia clínica del paciente y el módulo de tratamiento de ortodoncia, creando un flujo de trabajo continuo desde la fase activa hasta la de contención. El sistema centraliza toda la información relevante, incluyendo notas clínicas, evolución, estado de los aparatos y un registro fotográfico comparativo, facilitando una toma de decisiones informada y mejorando la comunicación y el cumplimiento del paciente.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad reside dentro de la feature 'especialidades-clinicas'. La subcarpeta '/pages' contiene el componente principal de la página, 'OrtodonciaRetencionPage.tsx', que ensambla la interfaz. La carpeta '/components' alberga componentes reutilizables como formularios, tablas y modales específicos para la gestión de la retención. La lógica de comunicación con el backend se encapsula en funciones dentro de la carpeta '/apis', que son llamadas desde la página para obtener y enviar datos del plan de retención.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/OrtodonciaRetencionPage.tsx`
- `/features/especialidades-clinicas/components/FormularioPlanRetencion.tsx`
- `/features/especialidades-clinicas/components/TablaSeguimientoRetencion.tsx`
- `/features/especialidades-clinicas/components/ModalDetalleRetenedor.tsx`
- `/features/especialidades-clinicas/apis/retencionApi.ts`

### Componentes React

- FormularioPlanRetencion
- TablaSeguimientoRetencion
- ModalDetalleRetenedor
- VisorFotosRetencion
- PanelIndicadoresRetencion

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de un plan de retención de ortodoncia. Permiten crear, leer, actualizar y eliminar planes asociados a un paciente específico, así como gestionar los detalles de los retenedores y las citas de seguimiento vinculadas a dicho plan.

### `GET` `/api/pacientes/:pacienteId/ortodoncia/retencion`

Obtiene el plan de retención activo o el historial de planes para un paciente específico.

**Parámetros:** pacienteId (param)

**Respuesta:** Un objeto con los detalles del plan de retención, incluyendo retenedores y seguimientos.

### `POST` `/api/pacientes/:pacienteId/ortodoncia/retencion`

Crea un nuevo plan de retención para un paciente al finalizar su tratamiento activo de ortodoncia.

**Parámetros:** pacienteId (param), tratamientoId (body), fechaInicio (body), retenedores (body)

**Respuesta:** El objeto del nuevo plan de retención creado.

### `PUT` `/api/ortodoncia/retencion/:planId`

Actualiza la información general de un plan de retención existente (ej: estado, notas generales).

**Parámetros:** planId (param), datos a actualizar (body)

**Respuesta:** El objeto del plan de retención actualizado.

### `POST` `/api/ortodoncia/retencion/:planId/seguimientos`

Añade una nueva cita de seguimiento al plan de retención.

**Parámetros:** planId (param), fechaCita (body), observaciones (body)

**Respuesta:** El plan de retención actualizado con el nuevo seguimiento.

### `PUT` `/api/ortodoncia/seguimientos/:seguimientoId`

Actualiza los detalles de una cita de seguimiento específica (ej: registrar asistencia, añadir notas, subir fotos).

**Parámetros:** seguimientoId (param), datos del seguimiento (body)

**Respuesta:** El objeto del seguimiento actualizado.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se centra en el modelo 'PlanRetencion', que almacena toda la información de esta fase. El 'RetencionController' contiene la lógica para manejar las solicitudes HTTP, interactuando con el modelo para realizar operaciones CRUD. Las rutas, definidas en 'retencionRoutes.js', mapean los endpoints de la API a las funciones correspondientes del controlador.

### Models

#### PlanRetencion

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, tratamientoOrtodoncia: { type: Schema.Types.ObjectId, ref: 'Tratamiento' }, fechaInicio: Date, estado: String ('Activo', 'Finalizado'), retenedores: [{ tipo: String, arcada: String, material: String, fechaColocacion: Date, instrucciones: String }], seguimientos: [{ fechaCita: Date, estado: String ('Programada', 'Realizada', 'Cancelada'), observaciones: String, fotos: [String] }], notasGenerales: String

### Controllers

#### RetencionController

- getPlanRetencionByPaciente
- createPlanRetencion
- updatePlanRetencion
- addSeguimiento
- updateSeguimiento

### Routes

#### `/api/ortodoncia`

- GET /pacientes/:pacienteId/ortodoncia/retencion
- POST /pacientes/:pacienteId/ortodoncia/retencion
- PUT /retencion/:planId
- POST /retencion/:planId/seguimientos
- PUT /seguimientos/:seguimientoId

## 🔄 Flujos

1. El odontólogo finaliza un tratamiento de ortodoncia y accede a la ficha del paciente, navegando a la sección 'Especialidades Clínicas' -> 'Ortodoncia: Retención y Contención'.
2. El sistema presenta una opción para 'Iniciar Nuevo Plan de Retención'.
3. El odontólogo completa el formulario, especificando la fecha de inicio, los tipos de retenedores para cada arcada y las instrucciones para el paciente.
4. Al guardar, el sistema crea el plan y sugiere un calendario de citas de seguimiento (ej: 1, 3, 6, 12 meses), que pueden ser confirmadas e integradas en la agenda general.
5. En cada cita de seguimiento, el odontólogo abre el plan del paciente, registra notas sobre la estabilidad, el estado del retenedor, y puede subir fotos para el registro comparativo.
6. El estado del plan y de cada cita se actualiza visualmente en la interfaz para un seguimiento rápido.

## 📝 User Stories

- Como odontólogo, quiero crear un plan de retención detallado para cada paciente que termina ortodoncia, para formalizar y registrar el protocolo de seguimiento.
- Como odontólogo, quiero visualizar en una sola pantalla todo el historial de la fase de retención de un paciente, incluyendo todos los controles y fotos, para evaluar la evolución a largo plazo.
- Como odontólogo, quiero registrar de forma rápida las observaciones de una cita de control de retención, para mantener la historia clínica actualizada eficientemente durante la consulta.
- Como odontólogo, quiero tener un listado de pacientes en fase de retención con sus próximas fechas de control, para poder planificar y enviar recordatorios.
- Como odontólogo, quiero documentar cualquier incidencia con los retenedores (rotura, pérdida), para tener un registro claro y justificar posibles reposiciones o reparaciones.

## ⚙️ Notas Técnicas

- Seguridad: Implementar autenticación vía JWT y autorización basada en roles (RBAC) para asegurar que solo los odontólogos autorizados puedan acceder y modificar los planes de retención. Todos los datos deben ser encriptados en tránsito (HTTPS) y en reposo.
- Integración con Agenda: Las citas de seguimiento generadas en este módulo deben crearse automáticamente en el módulo principal de 'Agenda de Citas', vinculando al paciente y al profesional correspondiente.
- Almacenamiento de Imágenes: Las fotografías de seguimiento deben almacenarse en un servicio de almacenamiento de objetos como AWS S3 o Google Cloud Storage para no sobrecargar la base de datos y mejorar el rendimiento de la carga. Se deben generar thumbnails para las vistas previas.
- Notificaciones: Considerar la implementación de un sistema de notificaciones para alertar a los odontólogos sobre próximas citas de control de retención o pacientes que no han acudido a su seguimiento.
- Atomicidad de Operaciones: Las operaciones en la base de datos, especialmente al crear un plan que puede implicar múltiples escrituras (plan, citas), deben gestionarse mediante transacciones de MongoDB para garantizar la consistencia de los datos.

