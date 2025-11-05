# Créditos al Paciente

**Categoría:** Gestión Financiera | **Módulo:** Pasarela de Pagos y Financiación

La funcionalidad de 'Créditos al Paciente' es un sistema de monedero o saldo a favor digital integrado dentro del ERP dental. Su propósito principal es gestionar los saldos positivos que un paciente puede tener con la clínica, evitando la necesidad de devoluciones en efectivo y fomentando la recurrencia. Este crédito puede originarse por diversas razones: sobrepagos en facturas, reembolsos por tratamientos cancelados o modificados, compra de paquetes de tratamientos prepagados, o como parte de campañas de fidelización y marketing (ej. 'Te regalamos 10€ de crédito por tu próxima limpieza').

Dentro del módulo padre 'Pasarela de Pagos y Financiación', esta funcionalidad actúa como un método de pago interno. Cuando se genera una nueva factura para un paciente con saldo a favor, el sistema permite aplicar dicho crédito total o parcialmente, reduciendo el importe a pagar mediante otros métodos (tarjeta, efectivo, etc.). Esto simplifica la contabilidad, reduce las transacciones de reembolso y mejora la experiencia del paciente, al ofrecerle una forma flexible y transparente de usar su saldo. Para el personal financiero y de recepción, proporciona una herramienta centralizada para consultar, añadir, y aplicar estos créditos, manteniendo un historial detallado de cada movimiento para una auditoría completa y transparente.

## 👥 Roles de Acceso

- Contable / Finanzas
- Recepción / Secretaría
- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/pasarela-pagos-financiacion/`

Esta funcionalidad reside dentro de la feature 'pasarela-pagos-financiacion'. La lógica de la interfaz se encuentra en '/pages/CreditosPacientePage.tsx', que utiliza componentes reutilizables de '/components/' como tablas e historiales. Las interacciones con el backend se gestionan a través de funciones definidas en '/apis/creditosApi.ts', que encapsulan las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/pasarela-pagos-financiacion/pages/CreditosPacientePage.tsx`
- `/features/pasarela-pagos-financiacion/pages/PortalCreditosPacientePage.tsx`

### Componentes React

- CreditosPacienteTable
- ModalGestionCredito
- HistorialCreditoList
- FormularioAnadirCredito
- BotonAplicarCreditoFactura
- CreditoSummaryCardPortal

## 🔌 APIs Backend

Las APIs gestionan el ciclo de vida completo de los créditos de los pacientes, desde su creación y consulta hasta su aplicación en facturas. Se requiere un control estricto para asegurar la integridad de los datos financieros.

### `GET` `/api/creditos/paciente/:pacienteId`

Obtiene el saldo de crédito actual y el historial de transacciones para un paciente específico.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Objeto JSON con { saldoActual: number, historial: [CreditoTransaccion] }

### `POST` `/api/creditos/paciente/:pacienteId/anadir`

Añade una cantidad de crédito al saldo de un paciente. Requiere autorización y un motivo.

**Parámetros:** pacienteId (en la URL), Body: { monto: number, descripcion: string, usuarioId: string }

**Respuesta:** Objeto JSON con el nuevo saldo y la transacción creada.

### `POST` `/api/creditos/paciente/:pacienteId/aplicar`

Aplica el crédito del paciente a una factura específica, reduciendo el saldo del paciente y el importe pendiente de la factura.

**Parámetros:** pacienteId (en la URL), Body: { monto: number, facturaId: string, usuarioId: string }

**Respuesta:** Objeto JSON con el estado de la operación y los saldos actualizados.

### `GET` `/api/creditos/resumen`

Obtiene una lista paginada de todos los pacientes con saldo de crédito positivo, para la vista del personal financiero.

**Parámetros:** query: ?page=1&limit=20

**Respuesta:** Array de objetos con información del paciente y su saldo de crédito.

## 🗂️ Estructura Backend (MERN)

La lógica de negocio se centraliza en el `CreditoController`. El modelo `CreditoTransaccion` es clave para la auditoría, registrando cada movimiento. El modelo `Paciente` se actualiza con el saldo actual para optimizar las consultas.

### Models

#### CreditoTransaccion

{ paciente: ObjectId, tipo: Enum['adicion', 'aplicacion'], monto: Number, descripcion: String, facturaAplicada: ObjectId (opcional), usuarioResponsable: ObjectId, fecha: Date }

#### Paciente

Se añade un campo: { saldoCredito: { type: Number, default: 0 } } para almacenar el balance actual y evitar cálculos costosos.

#### Factura

Se añade un campo: { creditoAplicado: { type: Number, default: 0 } } para registrar cuánto crédito se ha usado en esta factura.

### Controllers

#### CreditoController

- getCreditoByPaciente
- addCreditoToPaciente
- applyCreditoToFactura
- getCreditosSummary

### Routes

#### `/api/creditos`

- GET /paciente/:pacienteId
- POST /paciente/:pacienteId/anadir
- POST /paciente/:pacienteId/aplicar
- GET /resumen

## 🔄 Flujos

1. Flujo de adición de crédito: El personal de recepción procesa un reembolso. En lugar de devolver dinero, accede a la ficha del paciente, va a la sección 'Créditos', hace clic en 'Añadir Crédito', introduce el monto y el motivo (ej. 'Reembolso por cancelación de cita'). El sistema actualiza el saldo del paciente y crea un registro de la transacción.
2. Flujo de aplicación de crédito: Un paciente con 50€ de crédito debe pagar una factura de 80€. En la pantalla de pago, el sistema muestra el saldo disponible. El recepcionista selecciona 'Aplicar Crédito', el sistema deduce los 50€, y el importe pendiente de la factura se actualiza a 30€, que el paciente paga con tarjeta. Se generan dos transacciones: una de aplicación de crédito y otra de pago con tarjeta.
3. Flujo de consulta del paciente: El paciente inicia sesión en su portal, navega a la sección 'Mis Pagos' o 'Mi Saldo' y ve una tarjeta que muestra 'Tu crédito disponible: 50€'. Al hacer clic, puede ver una lista detallada de todas las transacciones que componen ese saldo.

## 📝 User Stories

- Como Contable, quiero ver un listado de todos los pacientes con crédito a favor y el total acumulado para tener un control preciso de las deudas de la clínica con los pacientes.
- Como Recepcionista, quiero poder añadir crédito a la cuenta de un paciente de forma sencilla cuando realiza un pago por adelantado para un plan de tratamiento.
- Como Recepcionista, quiero que al generar una factura para un paciente, el sistema me notifique si tiene crédito disponible y me permita aplicarlo con un solo clic para agilizar el cobro.
- Como Paciente, quiero ver mi saldo de crédito actual en mi portal personal para saber de cuánto dispongo para futuros tratamientos.
- Como Paciente, quiero consultar el historial de mis movimientos de crédito para entender cómo he ganado y gastado mi saldo.

## ⚙️ Notas Técnicas

- Transaccionalidad: Las operaciones que modifican múltiples colecciones (ej. aplicar crédito a factura, que afecta a Paciente, Factura y crea una CreditoTransaccion) deben usar transacciones de MongoDB para garantizar la consistencia de los datos (atomicidad).
- Seguridad y Auditoría: Todas las operaciones de modificación de crédito deben estar protegidas por roles y registrar qué usuario realizó la acción y cuándo. No se debe permitir la eliminación de transacciones de crédito, solo la creación de transacciones de ajuste para corregir errores.
- Rendimiento: El campo `saldoCredito` en el modelo `Paciente` es una denormalización para mejorar la velocidad de lectura. Debe implementarse un mecanismo robusto (ej. a través de middleware o hooks de Mongoose) para asegurar que este campo se mantenga siempre sincronizado con la suma de las `CreditoTransaccion`.
- Integración con Facturación: La lógica para aplicar crédito debe estar profundamente integrada en el flujo de pago de facturas. El sistema debe verificar el crédito disponible antes de procesar otros métodos de pago.

