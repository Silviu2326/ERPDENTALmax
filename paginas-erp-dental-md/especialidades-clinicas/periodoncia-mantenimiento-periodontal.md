# Periodoncia: Mantenimiento Periodontal

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'Mantenimiento Periodontal' es una herramienta clínica especializada, diseñada para el seguimiento y control a largo plazo de pacientes que han completado un tratamiento periodontal inicial. Su propósito es prevenir la recurrencia de la enfermedad periodontal, monitorizar la estabilidad de los tejidos de soporte y garantizar la salud bucal del paciente a largo plazo. Dentro del ERP, esta página se sitúa en el módulo padre 'Especialidades Clínicas', ya que representa un flujo de trabajo específico y detallado que va más allá de una consulta general. A diferencia de un registro de cita estándar, esta interfaz permite al Odontólogo o Higienista registrar métricas periodontales clave de forma sistemática en cada visita de mantenimiento. Esto incluye profundidad de sondaje, nivel de inserción, sangrado al sondaje (BOP), índice de placa, movilidad dental y recesión gingival. El sistema almacena estos datos de forma estructurada para cada sesión, permitiendo la visualización de la evolución del paciente a lo largo del tiempo a través de gráficos y tablas comparativas. Esta capacidad de análisis histórico es fundamental para tomar decisiones clínicas informadas, ajustar la frecuencia de las visitas y motivar al paciente mostrándole su progreso. La funcionalidad se integra con el odontograma del paciente, la agenda para programar futuras citas de mantenimiento y el módulo de facturación para generar los cargos correspondientes al tratamiento.

## 👥 Roles de Acceso

- Odontólogo
- Higienista

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad se encuentra dentro de la feature 'especialidades-clinicas'. La página principal, 'MantenimientoPeriodontalPage.tsx', reside en la subcarpeta '/pages' y se encarga de orquestar la interfaz. Utiliza componentes reutilizables y específicos de la subcarpeta '/components', como 'TablaRegistroPeriodontal' para la entrada de datos y 'GraficoEvolucionPeriodontal' para la visualización. Todas las interacciones con el backend se gestionan a través de funciones definidas en '/apis/periodonciaApi.ts', que encapsulan las llamadas a la API RESTful.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/MantenimientoPeriodontalPage.tsx`
- `/features/especialidades-clinicas/components/TablaRegistroPeriodontal.tsx`
- `/features/especialidades-clinicas/components/GraficoEvolucionPeriodontal.tsx`
- `/features/especialidades-clinicas/components/HistorialSesionesPeriodoncia.tsx`
- `/features/especialidades-clinicas/apis/periodonciaApi.ts`

### Componentes React

- MantenimientoPeriodontalHeader
- TablaRegistroPeriodontal
- GraficoEvolucionPeriodontal
- HistorialSesionesPeriodoncia
- ModalConfirmarGuardadoSesion

## 🔌 APIs Backend

Las APIs gestionan los registros de las sesiones de mantenimiento periodontal para cada paciente, permitiendo crear, consultar, actualizar y eliminar dichas sesiones.

### `GET` `/api/pacientes/:pacienteId/periodoncia/mantenimiento`

Obtiene el historial completo de sesiones de mantenimiento periodontal para un paciente específico.

**Parámetros:** pacienteId (string, en la URL)

**Respuesta:** Un array de objetos, donde cada objeto representa una sesión de mantenimiento periodontal.

### `POST` `/api/pacientes/:pacienteId/periodoncia/mantenimiento`

Crea un nuevo registro de sesión de mantenimiento periodontal para un paciente.

**Parámetros:** pacienteId (string, en la URL), Body: { fechaSesion, profesionalId, mediciones, observaciones, ... }

**Respuesta:** El objeto de la nueva sesión de mantenimiento creada.

### `GET` `/api/periodoncia/mantenimiento/:sesionId`

Obtiene los detalles completos de una sesión de mantenimiento específica por su ID.

**Parámetros:** sesionId (string, en la URL)

**Respuesta:** Un objeto con los datos de la sesión de mantenimiento solicitada.

### `PUT` `/api/periodoncia/mantenimiento/:sesionId`

Actualiza los datos de una sesión de mantenimiento existente. Útil para corregir errores.

**Parámetros:** sesionId (string, en la URL), Body: { campos a actualizar }

**Respuesta:** El objeto de la sesión de mantenimiento actualizado.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se apoya en un modelo MongoDB específico ('MantenimientoPeriodontal') que se relaciona con el modelo 'Paciente'. Un controlador ('MantenimientoPeriodontalController') contiene la lógica de negocio, y las rutas ('periodonciaRoutes') exponen los endpoints necesarios para que el frontend interactúe con los datos.

### Models

#### MantenimientoPeriodontal

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, profesional: { type: Schema.Types.ObjectId, ref: 'Usuario' }, fechaSesion: { type: Date, default: Date.now }, indicePlacaGeneral: Number, indiceSangradoGeneral: Number, observaciones: String, mediciones: [{ diente: Number, profundidadSondaje: [Number], sangradoAlSondaje: [Boolean], supuracion: [Boolean], placaVisible: [Boolean], nivelInsercion: [Number], movilidad: Number, afectacionFurca: String }]

### Controllers

#### MantenimientoPeriodontalController

- crearSesionMantenimiento
- obtenerSesionesPorPaciente
- obtenerDetalleSesion
- actualizarSesionMantenimiento

### Routes

#### `/api/periodoncia/mantenimiento`

- GET /paciente/:pacienteId -> (alias de /api/pacientes/:pacienteId/periodoncia/mantenimiento)
- POST /paciente/:pacienteId -> (alias de /api/pacientes/:pacienteId/periodoncia/mantenimiento)
- GET /:sesionId
- PUT /:sesionId

## 🔄 Flujos

1. El profesional (Odontólogo/Higienista) accede a la ficha del paciente y selecciona la opción 'Mantenimiento Periodontal'.
2. El sistema carga la página, mostrando automáticamente el historial de sesiones previas y los gráficos de evolución de los principales índices (BOP, Placa).
3. El usuario hace clic en 'Nueva Sesión'. El sistema pre-carga la fecha actual.
4. El profesional utiliza la tabla o un diagrama dental interactivo para registrar las mediciones de cada diente (profundidad de sondaje, sangrado, etc.).
5. El sistema calcula y muestra en tiempo real los índices generales (ej. % de sitios con sangrado).
6. El usuario añade observaciones generales y un plan para la siguiente visita.
7. Al guardar, el sistema valida los datos, los almacena en la base de datos y actualiza los gráficos históricos y la lista de sesiones.
8. Opcionalmente, el sistema pregunta si desea agendar la próxima cita de mantenimiento, pre-llenando el tipo de cita y el intervalo recomendado (e.g., 6 meses).

## 📝 User Stories

- Como Odontólogo, quiero registrar de forma rápida y visual las mediciones periodontales de un paciente en una tabla que simule la boca para agilizar el proceso durante la consulta.
- Como Higienista, quiero ver un gráfico que compare la profundidad de sondaje de la sesión actual con la sesión anterior para identificar al instante zonas que han empeorado.
- Como Odontólogo, quiero que el sistema calcule automáticamente el porcentaje de sitios con sangrado y placa para tener un indicador objetivo del estado del paciente.
- Como Higienista, quiero añadir notas específicas a una sesión de mantenimiento para recordar detalles importantes en la próxima visita, como áreas de difícil acceso para el paciente.
- Como Odontólogo, quiero generar un informe en PDF de la evolución periodontal del paciente para poder compartirlo con él o con otro especialista.

## ⚙️ Notas Técnicas

- Seguridad: El acceso a esta funcionalidad debe estar estrictamente controlado por roles. Los datos periodontales son información médica sensible (PHI) y deben ser encriptados en tránsito (SSL/TLS) y en reposo.
- Rendimiento: La carga de datos históricos para pacientes con muchos años de seguimiento debe ser optimizada. Considerar la paginación en la lista de sesiones y la carga bajo demanda de los datos para los gráficos.
- Integración: Es crucial una integración bidireccional con el módulo de Agenda. Al crear una cita de 'Mantenimiento Periodontal' en la agenda, se debería poder acceder directamente a esta página. Al finalizar la sesión aquí, se debe poder crear la siguiente cita.
- UX/UI: La tabla de registro de datos es el componente más crítico. Debe permitir una entrada de datos muy rápida mediante teclado (navegación con tabulador y flechas) y ofrecer feedback visual inmediato (e.g., colorear celdas de sangrado en rojo).
- Validación de Datos: Implementar validaciones tanto en el frontend como en el backend para asegurar que los datos introducidos (ej. profundidad de sondaje) estén dentro de rangos lógicos.

