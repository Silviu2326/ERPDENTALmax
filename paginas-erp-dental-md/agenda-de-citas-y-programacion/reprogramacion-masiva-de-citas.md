# Reprogramación Masiva de Citas

**Categoría:** Gestión de Citas | **Módulo:** Agenda de Citas y Programación

La funcionalidad de 'Reprogramación Masiva de Citas' es una herramienta administrativa crítica dentro del módulo 'Agenda de Citas y Programación'. Su propósito principal es permitir a los usuarios autorizados mover, en bloque, un conjunto de citas que cumplen con ciertos criterios, minimizando el esfuerzo manual y el riesgo de errores. Esta herramienta es indispensable en escenarios imprevistos que afectan la operatividad de la clínica, como la ausencia inesperada de un profesional por enfermedad, el mantenimiento no planificado de un equipo dental, el cierre temporal de una sede por festivos o emergencias, o la necesidad de reestructurar la agenda de un especialista. El proceso comienza con la selección de citas a través de un potente sistema de filtros que permite segmentar por profesional, rango de fechas, sede, estado de la cita, o incluso tipo de tratamiento. Una vez identificadas las citas, el sistema ofrece opciones flexibles para la reprogramación, como moverlas a una fecha específica manteniendo la misma hora, o distribuirlas en los próximos espacios disponibles del profesional correspondiente. La funcionalidad se integra directamente con el calendario principal, actualizando en tiempo real la disponibilidad y reflejando los cambios. Además, es fundamental que se conecte con el módulo de comunicaciones para enviar notificaciones automáticas (SMS/Email/WhatsApp) a los pacientes afectados, informándoles del cambio y reduciendo la carga de trabajo del personal de recepción o call center.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Recepción / Secretaría
- Call Center

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/agenda-citas-programacion/`

Esta funcionalidad reside dentro de la feature 'agenda-citas-programacion'. La lógica de la interfaz se encuentra en '/pages/ReprogramacionMasivaPage.tsx', que utiliza componentes reutilizables y específicos de '/components/'. Las llamadas a la API del backend se gestionan a través de funciones definidas en '/apis/citasApi.ts', que se encargan de la comunicación con los endpoints de reprogramación. Esta estructura modular permite un desarrollo y mantenimiento aislados y eficientes.

### Archivos Frontend

- `/features/agenda-citas-programacion/pages/ReprogramacionMasivaPage.tsx`
- `/features/agenda-citas-programacion/components/FiltroCitasReprogramar.tsx`
- `/features/agenda-citas-programacion/components/TablaResultadosCitas.tsx`
- `/features/agenda-citas-programacion/components/ModalConfirmacionReprogramacion.tsx`
- `/features/agenda-citas-programacion/apis/citasApi.ts`

### Componentes React

- ReprogramacionMasivaPage
- FiltroCitasReprogramar
- TablaResultadosCitas
- SelectorDeAccionMasiva
- ModalConfirmacionReprogramacion
- ResumenCambiosReprogramacion

## 🔌 APIs Backend

Se necesitan dos endpoints principales. El primero para buscar y filtrar las citas que serán objeto de la reprogramación masiva. El segundo, y más crítico, para ejecutar la acción de reprogramación en bloque, recibiendo los IDs de las citas y los nuevos parámetros de fecha/hora.

### `GET` `/api/citas/filtrar`

Obtiene una lista de citas basada en múltiples criterios de filtrado como profesional, sede, rango de fechas y estado. Es el paso inicial para que el usuario seleccione qué citas desea reprogramar.

**Parámetros:** profesionalId (opcional), sedeId (opcional), fechaInicio (requerido), fechaFin (requerido), estado (opcional, ej: 'programada')

**Respuesta:** Un array de objetos de Cita que coinciden con los criterios de búsqueda.

### `POST` `/api/citas/reprogramar-masivo`

Procesa la reprogramación de un conjunto de citas. Recibe un array de IDs de citas y la lógica de reprogramación (ej. mover X días, nueva fecha fija). Devuelve un resumen de la operación.

**Parámetros:** body: { citasIds: [string], modoReprogramacion: 'mover_dias' | 'fecha_fija', valor: number | string, notificarPacientes: boolean, motivo: string }

**Respuesta:** Un objeto con el resultado de la operación, ej: { success: true, actualizadas: 25, errores: 0, detallesErrores: [] }.

## 🗂️ Estructura Backend (MERN)

La lógica del backend se apoya en el modelo 'Cita' de MongoDB. Un controlador 'CitaController' contiene la lógica de negocio para filtrar y actualizar citas en bloque, y las rutas de Express exponen esta funcionalidad de forma segura.

### Models

#### Cita

Campos clave: _id, paciente (ObjectId), profesional (ObjectId), sede (ObjectId), fechaHoraInicio (Date), fechaHoraFin (Date), estado (String: 'programada', 'confirmada', 'cancelada', 'reprogramada'), tratamientos ([ObjectId]), notas (String), historialCambios ([{ fecha: Date, usuario: ObjectId, accion: String, detalles: Object }])

### Controllers

#### CitaController

- getCitasByFilter(req, res)
- reprogramarCitasMasivo(req, res)

### Routes

#### `/api/citas`

- GET /filtrar
- POST /reprogramar-masivo

## 🔄 Flujos

1. 1. El usuario (Recepción/Admin) accede a la página 'Reprogramación Masiva de Citas' desde el menú de Agenda.
2. 2. Utiliza el componente de filtros para seleccionar las citas a reprogramar (ej: todas las citas del Dr. Pérez para mañana en la sede central).
3. 3. El sistema ejecuta una llamada GET a '/api/citas/filtrar' y muestra los resultados en una tabla.
4. 4. El usuario selecciona todas o algunas de las citas listadas y hace clic en el botón 'Reprogramar Seleccionadas'.
5. 5. Se abre un modal donde el usuario define la nueva fecha/hora (ej: 'Mover todas 7 días hacia adelante') y un motivo para el cambio.
6. 6. Al confirmar, el frontend envía una petición POST a '/api/citas/reprogramar-masivo' con los IDs de las citas y la nueva información.
7. 7. El backend procesa la solicitud dentro de una transacción de base de datos, actualiza cada cita y registra el cambio en su historial.
8. 8. Si se marcó la opción, se encolan trabajos asíncronos para notificar a cada paciente.
9. 9. La API responde con un resumen del éxito de la operación, que se muestra al usuario en la interfaz.

## 📝 User Stories

- Como Recepcionista, quiero seleccionar todas las citas de un doctor para un día específico y moverlas a la misma hora una semana después, para gestionar eficientemente su ausencia imprevista por enfermedad.
- Como Director de clínica, quiero reprogramar todas las citas de una sede que debe cerrar por una emergencia, para asegurar la continuidad de la atención y minimizar el impacto en los pacientes.
- Como agente de Call Center, quiero buscar citas por un rango de fechas y profesional para poder moverlas en bloque según las instrucciones recibidas, agilizando la gestión de cambios en la agenda.

## ⚙️ Notas Técnicas

- Transacciones en MongoDB: La operación de reprogramación masiva en el backend debe estar envuelta en una transacción para garantizar la atomicidad. Si falla la actualización de una sola cita, toda la operación debe revertirse (rollback).
- Rendimiento y Optimización: La consulta de filtrado debe estar optimizada con índices compuestos en la colección de Citas (ej: sobre `sede`, `profesional`, `fechaHoraInicio`). La actualización masiva debe usar `bulkWrite` de MongoDB para un rendimiento óptimo.
- Notificaciones Asíncronas: El envío de notificaciones a pacientes (SMS, Email) debe ser gestionado por un sistema de colas de trabajos (ej: BullMQ, RabbitMQ) para no bloquear la respuesta de la API y mejorar la resiliencia del sistema de comunicación.
- Auditoría y Trazabilidad: Cada cita reprogramada masivamente debe tener una entrada detallada en su campo 'historialCambios', registrando quién realizó la acción, cuándo, el motivo, y los valores antiguos/nuevos.
- Manejo de Conflictos: El backend debe validar que los nuevos horarios propuestos no generen conflictos con citas ya existentes para el profesional o el box/gabinete. Los conflictos deben ser reportados en la respuesta de la API.
- Seguridad: El acceso a este endpoint debe estar estrictamente controlado por roles. Solo los roles definidos ('Director / Admin general', 'Recepción / Secretaría', 'Call Center') pueden ejecutar esta acción.

