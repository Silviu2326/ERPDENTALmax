# Asignación de Bandejas a Pacientes

**Categoría:** Calidad y Seguridad | **Módulo:** Esterilización y Trazabilidad

La funcionalidad de 'Asignación de Bandejas a Pacientes' es un componente crítico dentro del módulo de 'Esterilización y Trazabilidad'. Su propósito fundamental es crear un vínculo digital e inequívoco entre un set de instrumental esterilizado (comúnmente llamado 'bandeja') y el paciente que lo recibe durante una cita o procedimiento dental. Este proceso se realiza típicamente en el momento previo al tratamiento. El auxiliar o el odontólogo utiliza un dispositivo (como una tablet o un ordenador con webcam) para escanear un identificador único, generalmente un código QR adherido al empaque de la bandeja esterilizada. A continuación, selecciona al paciente correspondiente, que suele estar ya 'registrado' o 'en consulta' según el flujo de la agenda. El sistema valida que la bandeja esté apta para su uso (verificando su estado de esterilización y fecha de caducidad) y, tras la confirmación del usuario, registra la asignación. Esta acción es crucial para la trazabilidad completa del ciclo de vida del instrumental. En caso de una infección cruzada, una falla en un lote de esterilización o cualquier otra incidencia de seguridad, la clínica puede rastrear de forma inmediata y precisa qué instrumental se usó, en qué paciente, en qué fecha y por quién fue asignado, cumpliendo con las más estrictas normativas de bioseguridad y calidad. Esta funcionalidad transforma un proceso manual y propenso a errores en un registro digital, auditable y seguro, fortaleciendo la confianza del paciente y protegiendo a la clínica ante responsabilidades legales.

## 👥 Roles de Acceso

- Auxiliar / Asistente
- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/esterilizacion-trazabilidad/`

Esta funcionalidad se encuentra dentro de la carpeta 'features/esterilizacion-trazabilidad'. La página principal, 'AsignacionBandejaPacientePage.tsx', reside en la subcarpeta '/pages' y orquesta la interfaz de usuario. Utiliza componentes especializados de la carpeta '/components', como 'EscanerQRBandeja' para la captura del código y 'SelectorPacienteActivo' para elegir al paciente. Todas las interacciones con el backend se gestionan a través de funciones definidas en '/apis/trazabilidadApi.ts', que encapsulan las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/esterilizacion-trazabilidad/pages/AsignacionBandejaPacientePage.tsx`
- `/features/esterilizacion-trazabilidad/components/EscanerQRBandeja.tsx`
- `/features/esterilizacion-trazabilidad/components/SelectorPacienteActivo.tsx`
- `/features/esterilizacion-trazabilidad/components/DetalleBandejaScaneada.tsx`
- `/features/esterilizacion-trazabilidad/components/ModalConfirmarAsignacion.tsx`
- `/features/esterilizacion-trazabilidad/apis/trazabilidadApi.ts`

### Componentes React

- EscanerQRBandeja
- SelectorPacienteActivo
- DetalleBandejaScaneada
- ModalConfirmarAsignacion
- ListaAsignacionesRecientes

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en obtener la información necesaria (pacientes activos, detalles de la bandeja) y en registrar la nueva asignación de forma segura, actualizando los estados correspondientes en la base de datos.

### `GET` `/api/pacientes/activos`

Obtiene una lista de pacientes que tienen una cita 'En curso' o 'En sala de espera' para facilitar la selección del paciente correcto.

**Parámetros:** query:?estado=en-curso,en-espera

**Respuesta:** Un array de objetos de pacientes simplificados (id, nombre completo).

### `GET` `/api/esterilizacion/bandejas/codigo/:codigoUnico`

Busca una bandeja por su código único (obtenido del QR). Valida su estado ('Disponible') y fechas de esterilización/vencimiento.

**Parámetros:** path:codigoUnico (string)

**Respuesta:** Un objeto con los detalles de la bandeja si es encontrada y válida, o un error 404/409 si no existe o su estado no es el adecuado.

### `POST` `/api/trazabilidad/asignaciones`

Crea el registro de asignación. Vincula una bandeja a un paciente, una cita y el usuario que realiza la operación. Cambia el estado de la bandeja a 'En uso'.

**Parámetros:** body:{ pacienteId: string, bandejaId: string, citaId: string }

**Respuesta:** El objeto de la nueva asignación creada.

### `GET` `/api/trazabilidad/asignaciones/recientes`

Obtiene un listado de las últimas asignaciones realizadas en la clínica para un rápido control visual.

**Parámetros:** query:?limit=10

**Respuesta:** Un array con los últimos 10 registros de asignación, incluyendo detalles del paciente y la bandeja.

## 🗂️ Estructura Backend (MERN)

La estructura backend se apoya en tres modelos principales: 'BandejaEsteril' para el inventario de instrumental, 'Paciente' para los datos del paciente, y 'AsignacionBandeja' como el modelo de enlace que une toda la información. Los controladores gestionan la lógica de negocio y las validaciones, mientras que las rutas exponen estos servicios de forma segura y estructurada.

### Models

#### AsignacionBandeja

{ pacienteId: ObjectId (ref: 'Paciente'), bandejaId: ObjectId (ref: 'BandejaEsteril'), citaId: ObjectId (ref: 'Cita'), usuarioAsignaId: ObjectId (ref: 'Usuario'), fechaAsignacion: Date, createdAt: Date }

#### BandejaEsteril

{ codigoUnico: String (unique, indexed), nombre: String, cicloEsterilizacionId: ObjectId, fechaEsterilizacion: Date, fechaVencimiento: Date, estado: String (enum: ['Disponible', 'En uso', 'Contaminada', 'En proceso']) }

### Controllers

#### AsignacionController

- crearAsignacion
- obtenerAsignacionesRecientes

#### BandejaEsterilController

- buscarPorCodigoUnico

#### PacienteController

- obtenerPacientesActivos

### Routes

#### `/api/trazabilidad`

- POST /asignaciones
- GET /asignaciones/recientes

#### `/api/esterilizacion`

- GET /bandejas/codigo/:codigoUnico

## 🔄 Flujos

1. El usuario (auxiliar u odontólogo) inicia sesión y navega a 'Esterilización y Trazabilidad' -> 'Asignar Bandeja a Paciente'.
2. La interfaz muestra automáticamente una lista de pacientes activos o un buscador.
3. El usuario selecciona el paciente correcto para la atención.
4. Se activa la cámara del dispositivo para escanear el QR de la bandeja.
5. Una vez escaneado, el sistema busca la bandeja en la base de datos y muestra sus detalles (nombre, fecha de caducidad) para verificación visual.
6. Si la bandeja es válida (estado 'Disponible'), se habilita un botón de 'Confirmar Asignación'.
7. Al confirmar, el sistema crea el registro en la colección 'AsignacionBandeja' y actualiza el estado de la 'BandejaEsteril' a 'En uso'.
8. Se muestra un mensaje de éxito y la asignación aparece en la lista de 'Asignaciones Recientes'.

## 📝 User Stories

- Como Auxiliar, quiero escanear el código QR de una bandeja y asignarla a un paciente en la sala de espera para garantizar que cada paso de la trazabilidad quede registrado digitalmente.
- Como Odontólogo, quiero que el sistema me impida asignar una bandeja cuya esterilización haya caducado para proteger la salud de mis pacientes.
- Como Asistente, quiero ver una lista de los pacientes que están actualmente en la clínica para poder seleccionar rápidamente a quién asignarle el instrumental.
- Como gerente de la clínica, quiero poder auditar qué usuario asignó una bandeja específica a un paciente en una fecha determinada para mantener un control de calidad riguroso.

## ⚙️ Notas Técnicas

- La implementación del escáner QR en el frontend puede realizarse con librerías como 'react-qr-reader' o 'html5-qrcode', asegurando la compatibilidad con diversos dispositivos.
- El campo 'codigoUnico' en el modelo 'BandejaEsteril' debe tener un índice único en MongoDB para evitar duplicados y garantizar la integridad de los datos.
- La operación de crear la asignación y actualizar el estado de la bandeja debe ser atómica. Se recomienda el uso de transacciones de MongoDB para prevenir estados inconsistentes si una de las operaciones falla.
- La API de búsqueda de bandeja por código debe ser altamente optimizada para una respuesta casi instantánea, ya que es un paso crítico en el flujo de trabajo clínico.
- Es crucial registrar el 'usuarioAsignaId' en cada asignación para una auditoría completa. Este dato debe obtenerse del token de autenticación del usuario logueado.
- Implementar notificaciones o alertas visuales claras para el usuario en caso de que una bandeja escaneada no sea válida (caducada, ya en uso, no encontrada).

