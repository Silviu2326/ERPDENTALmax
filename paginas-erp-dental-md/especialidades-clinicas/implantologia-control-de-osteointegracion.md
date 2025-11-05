# Implantología: Control de Osteointegración

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

El módulo de 'Control de Osteointegración' es una funcionalidad crítica dentro del módulo padre 'Especialidades Clínicas', diseñado específicamente para el seguimiento riguroso del proceso biológico por el cual un implante dental se fusiona con el hueso maxilar o mandibular. Esta herramienta es fundamental para el éxito a largo plazo de los tratamientos de implantología. Su propósito principal es proporcionar al odontólogo un panel de control centralizado y detallado para cada implante colocado en un paciente. Desde este panel, el profesional puede registrar la fecha de colocación del implante, sus características (marca, modelo, dimensiones), y lo más importante, documentar y visualizar la evolución de su estabilidad a lo largo del tiempo. Funciona mediante el registro sistemático de mediciones clave, como el Cociente de Estabilidad del Implante (ISQ) obtenido con dispositivos como Osstell, o pruebas de percusión. El sistema permite registrar estas mediciones en fechas específicas, generando un historial cronológico y gráficos de tendencia que ayudan al clínico a tomar decisiones basadas en datos objetivos. Esta visualización permite determinar con precisión el momento óptimo para cargar el implante con la prótesis definitiva, minimizando el riesgo de fracaso prematuro. Dentro del ERP, esta funcionalidad se integra directamente con la ficha del paciente, el odontograma y el plan de tratamiento, asegurando que la información esté contextualizada y accesible, y permitiendo que el cambio de estado de un implante (ej. de 'En progreso' a 'Osteointegrado') actualice automáticamente las fases subsiguientes del tratamiento planificado.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad reside dentro de la feature 'especialidades-clinicas'. La lógica de la interfaz se encuentra en '/pages/ControlOsteointegracionPage.tsx', que actúa como el contenedor principal. Esta página utiliza componentes reutilizables y específicos de '/components/', como 'TablaImplantesPaciente' para listar los implantes y su estado, 'ModalRegistroMedicion' para la entrada de datos de estabilidad, y 'GraficoEvolucionISQ' para la visualización de datos históricos. Las interacciones con el backend se gestionan a través de funciones definidas en '/apis/implantesApi.ts', que encapsulan las llamadas a los endpoints RESTful correspondientes, manteniendo la lógica de la vista separada de la lógica de datos.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/ControlOsteointegracionPage.tsx`
- `/features/especialidades-clinicas/components/TablaImplantesPaciente.tsx`
- `/features/especialidades-clinicas/components/ModalRegistroMedicion.tsx`
- `/features/especialidades-clinicas/components/GraficoEvolucionISQ.tsx`
- `/features/especialidades-clinicas/components/TimelineOsteointegracion.tsx`
- `/features/especialidades-clinicas/apis/implantesApi.ts`

### Componentes React

- ControlOsteointegracionPage
- TablaImplantesPaciente
- ModalRegistroMedicion
- GraficoEvolucionISQ
- TimelineOsteointegracion
- IndicadorEstadoImplante

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan toda la información relacionada con los implantes dentales y su proceso de osteointegración. Permiten obtener los implantes de un paciente, registrar nuevas mediciones de estabilidad y actualizar el estado del proceso.

### `GET` `/api/pacientes/:pacienteId/implantes`

Obtiene una lista de todos los implantes registrados para un paciente específico, incluyendo su estado actual de osteointegración y un resumen de la última medición.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Un array de objetos Implante con información detallada.

### `GET` `/api/implantes/:implanteId/mediciones`

Recupera el historial completo de mediciones de osteointegración para un implante específico, ordenadas por fecha.

**Parámetros:** implanteId (en la URL)

**Respuesta:** Un array de objetos MedicionOsteointegracion.

### `POST` `/api/implantes/:implanteId/mediciones`

Registra una nueva medición de estabilidad (ej. ISQ) para un implante. El body debe contener los detalles de la medición.

**Parámetros:** implanteId (en la URL), Body: { fecha: Date, tipo: 'ISQ' | 'Periotest', valor: Number, observaciones: String }

**Respuesta:** El objeto del implante actualizado con la nueva medición añadida.

### `PUT` `/api/implantes/:implanteId/estado`

Actualiza el estado general del proceso de osteointegración de un implante (ej. de 'En Progreso' a 'Osteointegrado').

**Parámetros:** implanteId (en la URL), Body: { estado: 'En Espera' | 'En Progreso' | 'Osteointegrado' | 'Fallido' }

**Respuesta:** El objeto del implante con su estado actualizado.

## 🗂️ Estructura Backend (MERN)

El backend utiliza modelos de MongoDB para persistir los datos de implantes y sus mediciones. Los controladores contienen la lógica para manipular estos datos, y las rutas exponen esta lógica a través de una API RESTful segura y bien definida.

### Models

#### Implante

Se integra dentro del modelo 'HistoriaClinica' o 'Tratamiento' del paciente. Campos relevantes: { pacienteId: ObjectId, odontologoId: ObjectId, fechaColocacion: Date, piezaDental: Number, marca: String, modelo: String, longitud: Number, diametro: Number, estadoOsteointegracion: { type: String, enum: ['En Espera', 'En Progreso', 'Osteointegrado', 'Fallido'], default: 'En Espera' }, mediciones: [MedicionOsteointegracionSchema] }

#### MedicionOsteointegracion

Este es un sub-documento dentro del modelo Implante. Campos: { fecha: Date, tipoMedicion: { type: String, enum: ['ISQ', 'Periotest', 'Clinica'] }, valor: String, observaciones: String, registradoPor: ObjectId }

### Controllers

#### ImplanteController

- getImplantesByPaciente
- getMedicionesByImplante
- addMedicionToImplante
- updateEstadoImplante

### Routes

#### `/api/implantes`

- GET /:implanteId/mediciones
- POST /:implanteId/mediciones
- PUT /:implanteId/estado

#### `/api/pacientes`

- GET /:pacienteId/implantes

## 🔄 Flujos

1. El odontólogo selecciona a un paciente y accede a la sección 'Implantología' de su historia clínica.
2. El sistema muestra una tabla o un odontograma con todos los implantes del paciente y su estado actual (identificado por color/texto).
3. Al hacer clic en un implante, se abre una vista detallada con su información, una línea de tiempo y un gráfico que muestra la evolución de las mediciones de estabilidad.
4. Durante una cita de control, el odontólogo pulsa el botón 'Añadir Medición', lo que abre un modal.
5. En el modal, introduce la fecha, el tipo de medición (ej. ISQ), el valor y cualquier observación relevante, y guarda los datos.
6. El sistema actualiza el gráfico y la tabla de mediciones en tiempo real. Si los criterios se cumplen, el odontólogo puede cambiar el estado del implante a 'Osteointegrado'.
7. El cambio de estado a 'Osteointegrado' puede desbloquear la siguiente fase en el plan de tratamiento del paciente, notificando al personal pertinente.

## 📝 User Stories

- Como odontólogo, quiero ver un resumen visual del estado de todos los implantes de mi paciente en una sola pantalla para evaluar rápidamente su progreso general.
- Como odontólogo, quiero registrar un nuevo valor de ISQ para un implante específico de forma rápida durante la consulta para mantener el historial actualizado sin demoras.
- Como odontólogo, quiero analizar un gráfico con la tendencia de las mediciones de estabilidad a lo largo del tiempo para tomar una decisión informada sobre cuándo proceder con la carga protésica.
- Como odontólogo, quiero marcar un implante como 'Fallido' y registrar la causa para mantener un registro clínico preciso y planificar un tratamiento alternativo.
- Como odontólogo, quiero que el sistema me alerte o me sugiera cuándo un implante podría estar listo para la siguiente fase basándose en el tiempo transcurrido y las mediciones registradas.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un estricto control de acceso basado en roles (RBAC) para asegurar que solo el odontólogo tratante o personal autorizado pueda modificar los datos clínicos de osteointegración.
- Visualización de Datos: Utilizar una librería de gráficos como 'Recharts' o 'Chart.js' en el frontend para renderizar la evolución de las mediciones de forma clara e interactiva.
- Integración: El estado 'Osteointegrado' debe ser un disparador (trigger) que se comunique con el módulo de 'Planes de Tratamiento' para actualizar el estado del plan general del paciente.
- Auditoría: Es crucial registrar un log de auditoría para cada medición y cambio de estado, guardando qué usuario realizó el cambio y cuándo, garantizando la trazabilidad de la información clínica.
- Usabilidad: El formulario de registro de mediciones debe ser simple y estar optimizado para dispositivos táctiles (tablets), ya que es común su uso en el gabinete dental.

