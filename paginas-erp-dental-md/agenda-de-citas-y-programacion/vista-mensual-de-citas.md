# Vista Mensual de Citas

**Categoría:** Gestión de Citas | **Módulo:** Agenda de Citas y Programación

La 'Vista Mensual de Citas' es una interfaz visual clave dentro del módulo 'Agenda de Citas y Programación'. Su propósito principal es ofrecer una perspectiva panorámica de todas las citas programadas a lo largo de un mes completo. A diferencia de las vistas diaria o semanal, que se enfocan en el detalle operativo, la vista mensual está diseñada para la planificación estratégica y la identificación rápida de patrones de ocupación. Permite a los roles administrativos, como gerentes y recepcionistas, visualizar la carga de trabajo de la clínica de un solo vistazo, identificando días de alta o baja demanda, y la distribución de citas entre los diferentes profesionales. Funciona como un 'mapa de calor' de la actividad clínica, utilizando indicadores visuales (como colores o contadores) en cada celda del día para representar la cantidad y el estado de las citas. Los usuarios pueden navegar fácilmente entre meses y años, y aplicar filtros avanzados por profesional, consultorio/gabinete o sede (en el caso de clínicas multisede). Esta funcionalidad es crucial para la gestión eficiente de recursos, la planificación de campañas, la asignación de vacaciones del personal y para ofrecer a los pacientes una visión rápida de la disponibilidad general al momento de agendar nuevas citas.

## 👥 Roles de Acceso

- Propietario / Gerente
- Director / Admin general (multisede)
- Recepción / Secretaría
- Call Center

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/agenda-citas-programacion/`

Esta funcionalidad reside dentro de la feature 'agenda-citas-programacion'. La página principal estará en '/pages/VistaMensualPage.tsx', la cual importará y utilizará componentes específicos de '/components/' como 'CalendarioMensualGrid.tsx' (la grilla principal del calendario) y 'FiltrosVistaMensual.tsx'. Las interacciones con el backend para obtener los datos de las citas se gestionarán a través de funciones definidas en '/apis/citasApi.ts', que encapsulan las llamadas a la API REST.

### Archivos Frontend

- `/features/agenda-citas-programacion/pages/VistaMensualPage.tsx`
- `/features/agenda-citas-programacion/components/CalendarioMensualGrid.tsx`
- `/features/agenda-citas-programacion/components/CeldaDiaCalendario.tsx`
- `/features/agenda-citas-programacion/components/PopoverResumenDia.tsx`
- `/features/agenda-citas-programacion/components/FiltrosVistaMensual.tsx`
- `/features/agenda-citas-programacion/apis/citasApi.ts`

### Componentes React

- VistaMensualPage
- CalendarioMensualGrid
- CeldaDiaCalendario
- PopoverResumenDia
- FiltrosVistaMensual

## 🔌 APIs Backend

La API principal para esta vista debe ser capaz de agregar y resumir la información de las citas para un mes determinado de manera eficiente, evitando enviar datos detallados de cada cita para no sobrecargar el frontend. Debe soportar filtrado por múltiples criterios.

### `GET` `/api/citas/resumen-mensual`

Obtiene un resumen agregado de las citas por día para un mes y año específicos. Devuelve el total de citas y un desglose por estado para cada día del mes.

**Parámetros:** query: mes (number, 1-12), query: anio (number, YYYY), query: sedeId (string, Opcional, requerido para roles multisede), query: profesionalId (string, Opcional), query: estado (string, Opcional, ej: 'confirmada,pendiente')

**Respuesta:** Un objeto JSON donde las claves son los días del mes y los valores son objetos con el resumen de citas. Ej: { '1': { total: 8, estados: { confirmada: 5, pendiente: 2, cancelada: 1 } }, '2': { total: 5, ... } }

## 🗂️ Estructura Backend (MERN)

El backend utilizará el modelo 'Cita' de MongoDB para realizar consultas de agregación. Un 'CitaController' contendrá la lógica para procesar los filtros y agrupar los datos por día. La ruta será definida en el enrutador de citas para exponer el endpoint al frontend.

### Models

#### Cita

Contiene campos clave para esta vista como: `fechaHoraInicio` (Date, indexado), `profesional` (ObjectId, ref: 'Profesional'), `sede` (ObjectId, ref: 'Sede'), `estado` (String, ej: 'programada', 'confirmada', 'cancelada', 'atendida', indexado), `paciente` (ObjectId, ref: 'Paciente').

### Controllers

#### CitaController

- getResumenMensualCitas: Función asíncrona que construye y ejecuta un pipeline de agregación en MongoDB. Utiliza $match para filtrar por mes, año y otros parámetros, y $group para agrupar por día y contar citas por estado.

### Routes

#### `/api/citas`

- GET /resumen-mensual

## 🔄 Flujos

1. El usuario accede a la Agenda y selecciona la 'Vista Mensual'.
2. El frontend realiza una petición a `GET /api/citas/resumen-mensual` con el mes y año actuales.
3. El backend agrega los datos y devuelve un resumen de citas por día.
4. La interfaz renderiza la grilla del calendario, mostrando en cada día un contador o indicador visual de la cantidad de citas.
5. El usuario aplica un filtro (ej. por un profesional específico). Se realiza una nueva petición a la API con el filtro `profesionalId` y la vista se actualiza.
6. Al pasar el cursor sobre un día, un popover muestra un desglose de citas por estado (ej: 5 Confirmadas, 2 Pendientes).
7. Al hacer clic en un día específico, el sistema navega a la 'Vista Diaria' para esa fecha, mostrando el detalle completo de las citas.

## 📝 User Stories

- Como Gerente de la clínica, quiero ver la ocupación mensual general para identificar tendencias y planificar promociones en los períodos de menor actividad.
- Como Recepcionista, quiero visualizar el calendario mensual para encontrar rápidamente días con poca carga de trabajo y poder ofrecerlos a pacientes que necesitan una cita pronto.
- Como Director General (multisede), quiero poder filtrar la vista mensual por sede para comparar la productividad y ocupación entre las diferentes sucursales.
- Como personal de Call Center, quiero ver la disponibilidad general de un mes para agendar citas a pacientes nuevos con flexibilidad limitada, sin tener que revisar día por día.

## ⚙️ Notas Técnicas

- Rendimiento: Es crítico que el endpoint `GET /api/citas/resumen-mensual` utilice un pipeline de agregación eficiente en MongoDB. La consulta debe estar respaldada por índices en los campos `fechaHoraInicio`, `sede`, `profesional` y `estado` para garantizar tiempos de respuesta rápidos.
- UI/UX: Implementar un 'skeleton loader' para la grilla del calendario mientras se cargan los datos. Usar colores o íconos sutiles en cada celda para representar la densidad de citas, mejorando la legibilidad. La transición al hacer clic en un día para ir a la vista diaria debe ser fluida.
- Seguridad: El backend debe validar que el `sedeId` proporcionado en la consulta corresponda a una sede a la que el usuario autenticado tiene acceso. Esto previene que un recepcionista de una sede pueda ver datos de otra.
- Gestión de Estado Frontend: Usar un hook personalizado (ej. `useMonthlyCalendar`) que encapsule la lógica de fetching de datos, manejo de estado de carga, errores, y la gestión de los filtros y la fecha actual (mes/año).
- Internacionalización: La visualización del calendario (nombres de días, meses, primer día de la semana) debe ser configurable para adaptarse a diferentes regiones.

