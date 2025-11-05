# Pagos y Financiación

**Categoría:** Portal del Paciente | **Módulo:** Portal del Paciente

La funcionalidad 'Pagos y Financiación' es un componente esencial del Portal del Paciente, diseñado para ofrecer una experiencia financiera transparente, segura y conveniente tanto para los pacientes como para el personal administrativo de la clínica. Para el paciente, esta sección centraliza toda su información financiera, permitiéndole consultar de forma clara y detallada su historial de transacciones, ver los saldos pendientes de sus tratamientos, descargar facturas y recibos, y realizar pagos en línea de manera segura a través de una pasarela de pago integrada. Además, proporciona acceso a información sobre planes de financiación ofrecidos por la clínica o a través de socios financieros, permitiendo a los pacientes solicitar y gestionar la financiación de tratamientos de mayor coste directamente desde el portal. Para el personal de Contabilidad y Finanzas, esta página actúa como un panel de control para la gestión de cobros. Pueden visualizar el estado financiero de cada paciente, confirmar la recepción de pagos realizados en línea, gestionar planes de financiación y conciliar cuentas de forma más eficiente. Al automatizar el proceso de pago y registro, se reduce significativamente la carga administrativa, se minimizan los errores humanos y se mejora el flujo de caja de la clínica. Esta funcionalidad fortalece la relación clínica-paciente al ofrecer autonomía y claridad, convirtiendo un proceso a menudo complejo en una experiencia sencilla y digital.

## 👥 Roles de Acceso

- Paciente (Portal)
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-paciente/`

Esta funcionalidad reside dentro de la feature 'portal-paciente'. La página principal se define en '/pages/PagosFinanciacionPage.tsx', que actúa como el contenedor principal. Esta página utiliza componentes reutilizables de la carpeta '/components/' como 'HistorialPagosTable' para listar transacciones y 'FormularioPagoOnline' para procesar pagos. Las interacciones con el backend se gestionan a través de funciones definidas en '/apis/finanzasApi.ts', que encapsulan las llamadas a los endpoints del servidor para obtener datos financieros y procesar transacciones.

### Archivos Frontend

- `/features/portal-paciente/pages/PagosFinanciacionPage.tsx`
- `/features/portal-paciente/components/HistorialPagosTable.tsx`
- `/features/portal-paciente/components/ResumenSaldoCard.tsx`
- `/features/portal-paciente/components/FormularioPagoOnline.tsx`
- `/features/portal-paciente/components/ListadoFacturas.tsx`
- `/features/portal-paciente/components/OpcionesFinanciacion.tsx`
- `/features/portal-paciente/apis/finanzasApi.ts`

### Componentes React

- PagosFinanciacionPage
- HistorialPagosTable
- ResumenSaldoCard
- FormularioPagoOnline
- ListadoFacturas
- OpcionesFinanciacion
- DetalleFacturaModal

## 🔌 APIs Backend

Las APIs para esta sección deben permitir la consulta segura de datos financieros del paciente, el procesamiento de pagos a través de una pasarela externa y la gestión de planes de financiación.

### `GET` `/api/pacientes/:pacienteId/finanzas/resumen`

Obtiene un resumen financiero completo para un paciente específico, incluyendo saldo total, pagos realizados y facturas pendientes.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Objeto JSON con { saldoTotal, totalPagado, facturasPendientes: [...] }

### `GET` `/api/pacientes/:pacienteId/pagos`

Obtiene el historial de todos los pagos realizados por un paciente, con paginación.

**Parámetros:** pacienteId (en la URL), page (query param), limit (query param)

**Respuesta:** Array de objetos de pago.

### `GET` `/api/pacientes/:pacienteId/facturas`

Obtiene una lista de todas las facturas (pagadas y pendientes) de un paciente.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Array de objetos de factura.

### `POST` `/api/pagos/procesar`

Procesa un pago en línea. Se integra con una pasarela de pago (ej. Stripe). Recibe un token de pago, no los datos de la tarjeta directamente.

**Parámetros:** Body: { pacienteId, facturaId, monto, paymentMethodToken }

**Respuesta:** Objeto JSON con el estado de la transacción { success: true, transaccionId, mensaje }

### `GET` `/api/financiacion/opciones`

Obtiene los planes de financiación disponibles que ofrece la clínica.

**Respuesta:** Array de objetos con las opciones de financiación.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con modelos para Pagos, Facturas y Planes de Financiación. Los controladores gestionan la lógica de negocio, como procesar un pago con una pasarela externa o calcular el saldo de un paciente, y las rutas exponen estos servicios de forma segura.

### Models

#### Pago

paciente: ObjectId, tratamiento: ObjectId, factura: ObjectId, monto: Number, fecha: Date, metodoPago: String ('tarjeta', 'transferencia'), estado: String ('completado', 'pendiente', 'fallido'), idTransaccionGateway: String, reciboUrl: String

#### Factura

paciente: ObjectId, numeroFactura: String, fechaEmision: Date, fechaVencimiento: Date, items: [{ descripcion: String, cantidad: Number, precioUnitario: Number }], total: Number, estado: String ('pagada', 'pendiente', 'vencida')

#### PlanFinanciacion

paciente: ObjectId, tratamiento: ObjectId, montoTotal: Number, numeroCuotas: Number, estado: String ('activo', 'completado'), cuotas: [{ fechaVencimiento: Date, monto: Number, estado: String ('pagada', 'pendiente') }]

### Controllers

#### FinanzasController

- getResumenFinanciero
- getHistorialPagos
- getListadoFacturas

#### PagoController

- procesarPagoConGateway
- confirmarPago

#### FinanciacionController

- getOpcionesFinanciacionDisponibles

### Routes

#### `/api/pacientes/:pacienteId/finanzas`

- GET /resumen
- GET /pagos
- GET /facturas

#### `/api/pagos`

- POST /procesar

#### `/api/financiacion`

- GET /opciones

## 🔄 Flujos

1. El paciente inicia sesión en el portal y navega a la sección 'Pagos y Financiación'.
2. La página realiza una llamada a la API para obtener el resumen financiero, el listado de facturas y el historial de pagos.
3. El paciente visualiza su saldo pendiente y la lista de facturas. Selecciona una o varias facturas para pagar.
4. Se muestra un formulario de pago seguro. El paciente introduce los datos de su tarjeta, que son tokenizados en el frontend por la pasarela de pago.
5. El token de pago, junto con el monto y los detalles de la factura, se envía al backend.
6. El backend procesa el pago a través de la API de la pasarela. Al recibir la confirmación, actualiza el estado de la factura a 'pagada', registra un nuevo 'Pago' en la base de datos y recalcula el saldo del paciente.
7. El frontend recibe una respuesta de éxito y muestra un mensaje de confirmación al paciente, ofreciendo la opción de descargar el recibo.
8. El personal de finanzas puede ver el pago registrado en tiempo real en el perfil del paciente dentro del ERP.

## 📝 User Stories

- Como Paciente, quiero ver un resumen claro de mi saldo pendiente para saber cuánto debo a la clínica.
- Como Paciente, quiero poder pagar mis facturas en línea con tarjeta de crédito para no tener que llamar o ir a la clínica.
- Como Paciente, quiero acceder a mi historial de pagos y descargar mis facturas para mis registros personales.
- Como Paciente, quiero explorar las opciones de financiación para tratamientos costosos para poder planificar mi presupuesto.
- Como Contable, quiero ver una lista de todas las facturas pendientes de un paciente para facilitar el seguimiento de cobros.
- Como Contable, quiero que los pagos realizados a través del portal se registren automáticamente en el sistema para reducir el trabajo manual y los errores.

## ⚙️ Notas Técnicas

- Seguridad: Es crucial la integración con una pasarela de pago que cumpla con el estándar PCI-DSS (ej. Stripe, Adyen, PayPal). Nunca se deben almacenar datos sensibles de tarjetas de crédito en la base de datos del ERP. Utilizar tokens de pago de un solo uso.
- Autenticación y Autorización: Todos los endpoints de la API deben estar protegidos. Un paciente solo puede acceder a su propia información financiera. El rol 'Contable / Finanzas' puede acceder a la información de cualquier paciente.
- Generación de Documentos: Implementar una librería en el backend (ej. pdf-lib o puppeteer) para generar facturas y recibos en formato PDF bajo demanda.
- Experiencia de Usuario: El proceso de pago debe ser fluido e intuitivo. Proporcionar feedback claro durante cada paso, especialmente en caso de errores en la transacción.
- Atomicidad: Las operaciones de base de datos relacionadas con un pago (actualizar factura, crear registro de pago) deben ser atómicas (usar transacciones de MongoDB) para garantizar la consistencia de los datos en caso de fallo.
- Notificaciones: Considerar el envío de notificaciones automáticas (email o SMS) al paciente tras un pago exitoso y al personal de la clínica.

