# Mis Citas (Próximas y Pasadas)

**Categoría:** Portal del Paciente | **Módulo:** Portal del Paciente

La funcionalidad 'Mis Citas' es un componente esencial del Portal del Paciente dentro del ERP dental. Esta página está diseñada para empoderar al paciente, brindándole acceso autónomo y transparente a su historial de citas y su programación futura. Su objetivo principal es mejorar la comunicación y la relación clínica-paciente, al tiempo que se reduce la carga administrativa del personal de recepción. Desde esta interfaz, el paciente puede consultar de manera clara y organizada todas sus citas programadas, incluyendo detalles como la fecha, hora, el profesional asignado, el tratamiento a realizar y la sucursal de la clínica. Adicionalmente, ofrece una vista de su historial completo de citas pasadas, lo cual es útil para llevar un registro personal de su salud dental. La página no solo es informativa; también es interactiva. Permite al paciente realizar acciones clave como solicitar la cancelación o reprogramación de una cita próxima (sujeto a las políticas de la clínica), eliminando la necesidad de una llamada telefónica. Esta capacidad de autogestión aumenta la satisfacción del paciente y optimiza los procesos internos, ya que las cancelaciones se reflejan en tiempo real en la agenda principal del sistema, liberando espacios que pueden ser ocupados por otros pacientes. En resumen, 'Mis Citas' es una herramienta estratégica que fomenta la participación activa del paciente en su propio cuidado, mejora la eficiencia operativa y fortalece la lealtad hacia la clínica.

## 👥 Roles de Acceso

- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-paciente/`

Toda la lógica del Portal del Paciente reside en la carpeta 'portal-paciente'. Esta página se implementa dentro de la subcarpeta '/pages'. Utiliza componentes reutilizables de '/components' para renderizar las listas de citas y tarjetas de detalle. Las llamadas al backend para obtener los datos de las citas se gestionan a través de funciones definidas en '/apis', que se comunican con los endpoints específicos del portal.

### Archivos Frontend

- `/features/portal-paciente/pages/MisCitasPage.tsx`
- `/features/portal-paciente/components/CitasTabs.tsx`
- `/features/portal-paciente/components/CitasProximasList.tsx`
- `/features/portal-paciente/components/CitasPasadasList.tsx`
- `/features/portal-paciente/components/CitaCard.tsx`
- `/features/portal-paciente/components/ModalConfirmarCancelacion.tsx`
- `/features/portal-paciente/apis/citasApi.ts`

### Componentes React

- MisCitasPage
- CitasTabs
- CitasProximasList
- CitasPasadasList
- CitaCard
- ModalConfirmarCancelacion
- SpinnerCarga

## 🔌 APIs Backend

Las APIs para esta sección están diseñadas para ser seguras y eficientes, asegurando que un paciente autenticado solo pueda acceder a su propia información. Las rutas están agrupadas bajo un prefijo '/api/portal' para distinguirlas de las APIs de gestión interna.

### `GET` `/api/portal/citas/proximas`

Obtiene una lista de todas las citas futuras (programadas y confirmadas) del paciente actualmente autenticado.

**Parámetros:** Authorization: Bearer <token> (en header)

**Respuesta:** Un array de objetos de cita con detalles como id, fechaHoraInicio, fechaHoraFin, estado, nombre del tratamiento, nombre del profesional y nombre de la clínica.

### `GET` `/api/portal/citas/pasadas`

Obtiene una lista paginada del historial de citas (completadas, canceladas) del paciente autenticado.

**Parámetros:** Authorization: Bearer <token> (en header), page: number (query param, ej: ?page=1), limit: number (query param, ej: ?limit=10)

**Respuesta:** Un objeto con los datos de las citas y la información de paginación (total de páginas, página actual).

### `PUT` `/api/portal/citas/:id/cancelar`

Permite al paciente solicitar la cancelación de una de sus citas próximas. El backend valida que la cita pertenezca al paciente y que cumpla con las políticas de cancelación de la clínica (ej. con más de 24h de antelación).

**Parámetros:** Authorization: Bearer <token> (en header), id: string (ID de la cita en la URL)

**Respuesta:** Un objeto de la cita actualizada con el estado 'cancelada'.

## 🗂️ Estructura Backend (MERN)

El backend utiliza una arquitectura modular. Un middleware de autenticación protege las rutas del portal, extrayendo el ID del paciente del token JWT. El CitaController contiene la lógica específica para consultar y manipular citas desde la perspectiva del paciente, asegurando que todas las operaciones estén autorizadas para el usuario en sesión.

### Models

#### Cita

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, profesional: { type: Schema.Types.ObjectId, ref: 'Usuario' }, tratamiento: { type: Schema.Types.ObjectId, ref: 'Tratamiento' }, clinica: { type: Schema.Types.ObjectId, ref: 'Clinica' }, fechaHoraInicio: Date, fechaHoraFin: Date, estado: { type: String, enum: ['programada', 'confirmada', 'cancelada', 'completada', 'ausente'] }, notasPaciente: String, creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }

#### Paciente

usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }, nombre: String, apellido: String, historialClinico: [...]

### Controllers

#### PortalCitasController

- obtenerCitasProximas
- obtenerCitasPasadas
- solicitarCancelacionCita

### Routes

#### `/api/portal/citas`

- GET /proximas (protegida)
- GET /pasadas (protegida)
- PUT /:id/cancelar (protegida)

## 🔄 Flujos

1. El paciente inicia sesión en el portal y navega a la sección 'Mis Citas'.
2. Por defecto, se muestra la pestaña 'Próximas Citas'. El frontend realiza una llamada a `GET /api/portal/citas/proximas`.
3. El backend verifica el token, obtiene el ID del paciente y busca en la base de datos las citas futuras asociadas a ese ID.
4. La lista de citas se muestra en el frontend, cada una en una 'CitaCard' con detalles clave y botones de acción ('Cancelar').
5. Si el paciente hace clic en 'Cancelar', se abre un modal de confirmación.
6. Al confirmar, el frontend envía una petición a `PUT /api/portal/citas/:id/cancelar`.
7. El backend valida la solicitud, actualiza el estado de la cita y devuelve la cita modificada. El frontend actualiza la UI para reflejar el cambio.
8. El paciente puede cambiar a la pestaña 'Citas Pasadas', lo que dispara una llamada a `GET /api/portal/citas/pasadas`. La lista se muestra con paginación.

## 📝 User Stories

- Como paciente, quiero ver una lista clara de mis próximas citas para poder organizar mi agenda.
- Como paciente, quiero ver los detalles de una cita futura, como el dentista que me atenderá y el tratamiento, para estar preparado.
- Como paciente, quiero tener la opción de cancelar una cita desde el portal si me surge un imprevisto, para no tener que llamar por teléfono.
- Como paciente, quiero poder consultar mi historial de citas pasadas para recordar cuándo fue mi última limpieza o qué tratamientos me han realizado.
- Como paciente, quiero recibir una confirmación visual inmediata en la página después de cancelar una cita.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un middleware de autenticación (JWT) y autorización en todas las rutas del backend para asegurar que un paciente solo pueda ver o modificar sus propias citas.
- Rendimiento: Utilizar paginación en el endpoint de 'citas pasadas' para evitar sobrecargar el servidor y el cliente con un historial potencialmente largo. Considerar índices en la base de datos MongoDB sobre los campos `paciente` y `fechaHoraInicio` en la colección de Citas.
- Experiencia de Usuario (UX): El estado de las citas (programada, confirmada, cancelada) debe ser visualmente distintivo (ej. con etiquetas de colores). Las acciones como cancelar deben usar modales de confirmación para prevenir errores.
- Reglas de Negocio: La lógica para permitir la cancelación de citas (ej. no permitir cancelaciones con menos de 24 horas de antelación) debe ser implementada y forzada en el backend (en el `PortalCitasController`), no solo en el frontend.
- Notificaciones: Considerar la integración con un servicio de notificaciones para que, al cancelar una cita, se envíe automáticamente un email de confirmación al paciente y una alerta al personal de la clínica.

