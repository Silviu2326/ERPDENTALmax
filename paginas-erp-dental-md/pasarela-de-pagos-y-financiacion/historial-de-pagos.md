# Historial de Pagos

**Categoría:** Gestión Financiera | **Módulo:** Pasarela de Pagos y Financiación

La página de 'Historial de Pagos' es un componente crucial dentro del módulo de 'Pasarela de Pagos y Financiación'. Su función principal es proporcionar una vista centralizada, detallada y cronológica de todas las transacciones financieras asociadas a los pacientes de la clínica. Sirve como un registro auditable y transparente que consolida pagos realizados por diversos métodos (tarjeta de crédito/débito online, transferencia, efectivo en clínica) y los vincula directamente con los tratamientos y planes financieros correspondientes. Para el personal administrativo (Contabilidad, Recepción), esta herramienta es fundamental para la gestión diaria: permite verificar pagos, resolver discrepancias, realizar conciliaciones bancarias y ofrecer un servicio de atención al cliente informado y eficiente. Para los pacientes, a través de su portal personal, esta funcionalidad ofrece autonomía y claridad sobre sus finanzas, permitiéndoles consultar sus pagos, descargar recibos para declaraciones de impuestos o reembolsos de seguros, y mantener un control total sobre su historial económico con la clínica. Funcionalmente, la página agrega datos del modelo de Pagos, enriqueciéndolos con información de los modelos de Pacientes y Tratamientos, para presentar una vista comprensible y útil que facilita la toma de decisiones financieras y fortalece la confianza del paciente en la gestión de la clínica.

## 👥 Roles de Acceso

- Contable / Finanzas
- Recepción / Secretaría
- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/pasarela-pagos-financiacion/`

Toda la lógica de frontend para esta funcionalidad se encuentra dentro de la carpeta 'features/pasarela-pagos-financiacion'. La subcarpeta '/pages' contiene el componente principal 'HistorialPagosPage.tsx', que renderiza la vista completa. La subcarpeta '/components' alberga los elementos de UI reutilizables como 'HistorialPagosTable.tsx' (la tabla de datos), 'FiltrosHistorialPagos.tsx' (controles de filtrado por fecha, estado, etc.) y 'ModalDetallePago.tsx' (para mostrar los detalles de una transacción). Finalmente, la subcarpeta '/apis' contiene las funciones, como 'pagosApi.ts', que realizan las llamadas al backend para obtener, filtrar y gestionar los datos de los pagos.

### Archivos Frontend

- `/features/pasarela-pagos-financiacion/pages/HistorialPagosPage.tsx`
- `/features/pasarela-pagos-financiacion/components/HistorialPagosTable.tsx`
- `/features/pasarela-pagos-financiacion/components/FiltrosHistorialPagos.tsx`
- `/features/pasarela-pagos-financiacion/components/ModalDetallePago.tsx`
- `/features/pasarela-pagos-financiacion/apis/pagosApi.ts`

### Componentes React

- HistorialPagosTable
- FiltrosHistorialPagos
- ModalDetallePago
- GeneradorReciboPDF
- PaginationControls

## 🔌 APIs Backend

Las APIs para el historial de pagos están diseñadas para proporcionar los datos necesarios de forma segura y eficiente según el rol del usuario. Permiten la recuperación de listas de pagos (ya sea para un paciente específico o de forma global), la obtención de detalles de una transacción individual y la generación de documentos como recibos.

### `GET` `/api/pagos/paciente/:pacienteId`

Obtiene la lista paginada y filtrada de todos los pagos realizados por un paciente específico. Es la API principal para la vista de recepción y del portal del paciente.

**Parámetros:** pacienteId (param), page (query), limit (query), fechaInicio (query), fechaFin (query), metodoPago (query), estado (query)

**Respuesta:** Un objeto con la lista de pagos y metadatos de paginación: { data: [Pago], total: number, page: number, limit: number }

### `GET` `/api/pagos/:pagoId`

Obtiene los detalles completos de un pago específico, incluyendo información del tratamiento y paciente asociados.

**Parámetros:** pagoId (param)

**Respuesta:** Un objeto JSON con los datos del Pago.

### `GET` `/api/pagos`

Endpoint para roles administrativos (Contable/Finanzas). Obtiene una lista global de todos los pagos de la clínica, con capacidades avanzadas de filtrado y paginación.

**Parámetros:** page (query), limit (query), fechaInicio (query), fechaFin (query), metodoPago (query), profesionalId (query)

**Respuesta:** Un objeto con la lista de pagos y metadatos de paginación: { data: [Pago], total: number, page: number, limit: number }

### `POST` `/api/pagos/:pagoId/recibo`

Genera y devuelve un recibo en formato PDF para un pago específico.

**Parámetros:** pagoId (param)

**Respuesta:** Un archivo PDF (stream de datos binarios) con el recibo del pago.

## 🗂️ Estructura Backend (MERN)

El backend sigue la estructura MERN. El modelo 'Pago' en MongoDB define la estructura de los datos de las transacciones. El 'PagoController' contiene la lógica de negocio para consultar, filtrar y gestionar estos pagos. Las rutas, definidas en 'pagoRoutes.js', exponen los endpoints de la API de forma segura, aplicando middleware de autenticación y autorización para proteger el acceso a los datos financieros.

### Models

#### Pago

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, tratamientos: [{ type: Schema.Types.ObjectId, ref: 'Tratamiento' }], monto: Number, fechaPago: Date, metodoPago: String ('Tarjeta', 'Transferencia', 'Efectivo', 'Financiación'), estado: String ('Completado', 'Pendiente', 'Reembolsado', 'Fallido'), transaccionId: String, notas: String, reciboUrl: String

#### Paciente

Campos relevantes: nombre, apellidos, email, telefono. (Referenciado en Pago)

#### Tratamiento

Campos relevantes: nombre, descripcion, coste. (Referenciado en Pago)

### Controllers

#### PagoController

- obtenerPagosPorPaciente
- obtenerDetallePago
- obtenerTodosLosPagos
- generarReciboPago

### Routes

#### `/api/pagos`

- GET /paciente/:pacienteId
- GET /:pagoId
- GET /
- POST /:pagoId/recibo

## 🔄 Flujos

1. Flujo de Recepción: El personal de recepción busca a un paciente, navega a su perfil financiero y accede al 'Historial de Pagos'. Filtra por el último mes para confirmar un pago reciente del que el paciente tiene dudas. Hace clic en el pago, revisa los detalles y genera un recibo en PDF que envía al paciente por correo electrónico.
2. Flujo del Paciente: El paciente inicia sesión en el portal, va a la sección 'Mis Pagos' y ve una lista de todas sus transacciones. Descarga el recibo de su último tratamiento de ortodoncia para presentarlo a su compañía de seguros.
3. Flujo de Contabilidad: El responsable financiero accede al listado global de pagos. Filtra por 'mes anterior' y 'método: Tarjeta' para conciliar los ingresos con el extracto del proveedor de la pasarela de pagos. Exporta los resultados a un archivo CSV para su software contable.

## 📝 User Stories

- Como Contable, quiero ver una lista completa y filtrable de todos los pagos recibidos en la clínica para poder realizar la conciliación bancaria mensual de manera eficiente.
- Como personal de Recepción, quiero acceder rápidamente al historial de pagos de un paciente durante una llamada para confirmar si un pago se ha procesado correctamente y resolver sus dudas al instante.
- Como Paciente, quiero ver un historial claro y detallado de mis pagos en mi portal personal para poder llevar un control de mis gastos en tratamientos dentales y descargar los recibos cuando los necesite.
- Como Contable, quiero poder exportar el historial de pagos a formato CSV para poder importarlo en nuestro sistema de contabilidad y facilitar el cierre fiscal.

## ⚙️ Notas Técnicas

- Seguridad (RBAC): Es imperativo implementar un control de acceso basado en roles estricto. Un paciente SOLO debe poder acceder a sus propios datos de pago. Las llamadas a la API '/api/pagos/paciente/:pacienteId' deben verificar que el ID del paciente coincide con el del usuario autenticado (si es un paciente) o que el usuario tiene permisos de Recepción/Finanzas.
- Rendimiento: La colección de 'pagos' puede crecer considerablemente. Es esencial crear índices en la base de datos MongoDB sobre los campos 'paciente' y 'fechaPago' para optimizar las consultas y filtros.
- Paginación: Todas las APIs que devuelven listas de pagos deben implementar paginación del lado del servidor para evitar la carga de grandes volúmenes de datos y mejorar la experiencia de usuario.
- Generación de PDF: Para la función de 'generar recibo', se puede usar una librería como 'pdf-lib' o 'Puppeteer' en el backend para generar los PDFs de forma dinámica y segura.
- Manejo de estados: La interfaz de usuario debe representar visualmente los diferentes estados de un pago (e.g., con etiquetas de colores: verde para 'Completado', amarillo para 'Pendiente', rojo para 'Fallido') para una fácil identificación.

