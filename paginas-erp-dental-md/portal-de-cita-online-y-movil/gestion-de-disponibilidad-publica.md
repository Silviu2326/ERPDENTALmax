# Gestión de Disponibilidad Pública

**Categoría:** Plataforma Digital | **Módulo:** Portal de Cita Online y Móvil

La 'Gestión de Disponibilidad Pública' es una funcionalidad crítica dentro del ERP dental que actúa como el puente de control entre la agenda interna de la clínica y lo que los pacientes pueden ver y reservar a través del Portal de Cita Online. Su propósito fundamental es permitir que el personal administrativo (Recepción, Directores) defina con precisión qué franjas horarias, para qué profesionales y para qué tratamientos específicos se ofrecerán al público. Esto es mucho más que simplemente mostrar los huecos libres; es una herramienta estratégica. Permite a la clínica promocionar ciertos servicios, llenar horas de baja demanda, controlar el tipo de primeras visitas que llegan a través del canal online y gestionar la carga de trabajo de cada odontólogo. Por ejemplo, la clínica puede decidir que online solo se puedan reservar citas para 'Limpiezas' y 'Revisiones' con doctores junior, mientras que los tratamientos complejos como 'Implantes' o 'Endodoncias' requieran una llamada telefónica. El sistema funciona creando un conjunto de 'reglas de disponibilidad' que se superponen a la agenda real. Un hueco solo se mostrará al paciente si cumple con el horario del doctor, no está ocupado por otra cita, y además, coincide con una regla de disponibilidad pública activa. Esta capa de abstracción garantiza que la clínica mantenga el control total sobre su agenda y su flujo de pacientes, evitando reservas no deseadas y optimizando la ocupación de los gabinetes.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-cita-online-movil/`

Esta funcionalidad reside dentro del módulo 'portal-cita-online-movil'. La página principal para la configuración se encuentra en '/pages/GestionDisponibilidadPublicaPage.tsx'. Esta página utiliza componentes de '/components/' como calendarios, selectores y modales para construir la interfaz. Las interacciones con el backend para guardar o recuperar reglas de disponibilidad se manejan a través de funciones definidas en '/apis/publicAvailabilityApi.ts', que encapsulan las llamadas a los endpoints del servidor.

### Archivos Frontend

- `/features/portal-cita-online-movil/pages/GestionDisponibilidadPublicaPage.tsx`
- `/features/portal-cita-online-movil/components/DisponibilidadReglasForm.tsx`
- `/features/portal-cita-online-movil/components/DisponibilidadReglasLista.tsx`
- `/features/portal-cita-online-movil/components/DisponibilidadCalendarioVista.tsx`
- `/features/portal-cita-online-movil/apis/publicAvailabilityApi.ts`

### Componentes React

- GestionDisponibilidadPublicaPage
- DisponibilidadReglasForm
- DisponibilidadReglasLista
- DisponibilidadCalendarioVista
- SelectorDoctorTratamiento
- ModalConfirmacionRegla

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan las reglas que definen la visibilidad de los horarios en el portal público. Permiten crear, leer, actualizar y eliminar estas reglas, que son la base para calcular los slots disponibles para los pacientes.

### `GET` `/api/public-availability/rules`

Obtiene todas las reglas de disponibilidad pública, permitiendo filtrar por sede o doctor para la gestión administrativa.

**Parámetros:** query.sedeId (opcional): ID de la sede para filtrar las reglas., query.doctorId (opcional): ID del doctor para filtrar las reglas.

**Respuesta:** Un array de objetos, donde cada objeto es una regla de disponibilidad.

### `POST` `/api/public-availability/rules`

Crea una nueva regla de disponibilidad pública para un doctor, tratamientos y horarios específicos.

**Parámetros:** body.sedeId: ID de la sede., body.doctorId: ID del profesional., body.tratamientoIds: Array de IDs de tratamientos aplicables., body.diasSemana: Array de números (0=Domingo, 1=Lunes...)., body.horaInicio: String 'HH:mm'., body.horaFin: String 'HH:mm'., body.fechaInicioVigencia: Fecha de inicio de la regla., body.fechaFinVigencia: Fecha de fin de la regla (opcional).

**Respuesta:** El objeto de la nueva regla creada.

### `PUT` `/api/public-availability/rules/:ruleId`

Actualiza una regla de disponibilidad pública existente.

**Parámetros:** params.ruleId: ID de la regla a actualizar., body: Objeto con los campos a modificar.

**Respuesta:** El objeto de la regla actualizada.

### `DELETE` `/api/public-availability/rules/:ruleId`

Elimina una regla de disponibilidad pública.

**Parámetros:** params.ruleId: ID de la regla a eliminar.

**Respuesta:** Mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo específico para las reglas de disponibilidad. Un controlador gestiona la lógica de negocio (CRUD) y las rutas de Express exponen esta lógica a través de una API RESTful.

### Models

#### PublicAvailabilityRule

sede: { type: Schema.Types.ObjectId, ref: 'Sede', required: true }, doctor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }, tratamientos: [{ type: Schema.Types.ObjectId, ref: 'Tratamiento' }], diasSemana: [{ type: Number, min: 0, max: 6 }], horaInicio: { type: String, required: true }, horaFin: { type: String, required: true }, fechaInicioVigencia: { type: Date, required: true }, fechaFinVigencia: { type: Date }, activa: { type: Boolean, default: true }, createdAt: { type: Date, default: Date.now }

### Controllers

#### PublicAvailabilityController

- createRule
- getRulesByClinic
- updateRule
- deleteRule

### Routes

#### `/api/public-availability`

- router.get('/rules', getRulesByClinic)
- router.post('/rules', createRule)
- router.put('/rules/:ruleId', updateRule)
- router.delete('/rules/:ruleId', deleteRule)

## 🔄 Flujos

1. El usuario de recepción accede a la sección 'Gestión de Disponibilidad Pública'.
2. El sistema muestra un listado de las reglas existentes y un formulario para crear una nueva.
3. El recepcionista selecciona una sede, un doctor y uno o varios tratamientos del formulario (ej: 'Dr. Pérez', 'Limpieza Dental').
4. A continuación, marca los días de la semana (ej: Lunes, Miércoles) y establece un rango horario (ej: de 16:00 a 19:00) en el que esas citas estarán disponibles online.
5. Define un rango de fechas para la validez de la regla (ej: todo el próximo mes).
6. Al guardar, la regla se añade al listado. A partir de ese momento, el portal de citas online comenzará a ofrecer esos huecos a los pacientes, siempre y cuando no estén ya ocupados en la agenda interna.
7. El recepcionista puede editar o desactivar temporalmente una regla en cualquier momento si las necesidades de la clínica cambian.

## 📝 User Stories

- Como Recepcionista, quiero crear reglas de disponibilidad por doctor y tratamiento para que solo se puedan reservar online las citas que nos interesa potenciar.
- Como Director de clínica, quiero ver y gestionar todas las reglas de disponibilidad pública de mi sede para tener una visión estratégica de nuestra oferta online.
- Como Admin general (multisede), quiero poder filtrar y gestionar las reglas por sede para asegurar que las políticas de citas online se aplican correctamente en cada ubicación.
- Como Recepcionista, quiero poder desactivar rápidamente una regla de disponibilidad si un doctor se pone enfermo, sin tener que eliminar la regla permanentemente.

## ⚙️ Notas Técnicas

- Seguridad: Es crucial que los endpoints de esta funcionalidad estén protegidos y solo sean accesibles para los roles autorizados (Recepción, Director).
- Lógica de cálculo: El endpoint público que calcula los slots finales para el paciente (no descrito aquí, pero dependiente de esta gestión) debe ser altamente eficiente. Debe cruzar en tiempo real el horario laboral del doctor, las citas ya existentes, los festivos y las reglas de disponibilidad pública. Se recomienda el uso de caché (ej: Redis) para las peticiones más comunes.
- Manejo de Zonas Horarias: Todas las fechas y horas deben ser almacenadas en UTC en la base de datos (MongoDB) y convertidas a la zona horaria de la clínica en el backend antes de realizar los cálculos de disponibilidad. Esto es vital para clínicas en diferentes zonas horarias o con pacientes internacionales.
- Validación: Implementar validaciones robustas en el backend para evitar la creación de reglas con horarios conflictivos o datos inconsistentes (ej: hora de fin anterior a la hora de inicio).

