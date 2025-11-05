# Anticipos y Señales

**Categoría:** Gestión Financiera | **Módulo:** Facturación, Cobros y Contabilidad

La funcionalidad de 'Anticipos y Señales' es una herramienta financiera clave dentro del ERP dental, diseñada para gestionar los pagos por adelantado que los pacientes realizan antes de iniciar o durante el transcurso de tratamientos costosos o de larga duración, como ortodoncias, implantes o rehabilitaciones completas. Su propósito principal es asegurar el compromiso del paciente, garantizar un flujo de caja positivo para la clínica y reducir el riesgo de impago. Este módulo permite al personal de recepción y finanzas registrar de forma segura y sencilla cualquier cantidad de dinero recibida como señal o anticipo, asociándola directamente al expediente del paciente y, opcionalmente, a un plan de tratamiento específico. El sistema mantiene un registro detallado de cada anticipo, incluyendo el monto, la fecha, el método de pago y el estado actual (por ejemplo, 'Disponible', 'Aplicado', 'Devuelto'). Cuando se genera una factura por los servicios prestados, el sistema notifica al usuario si el paciente tiene un saldo a favor disponible por anticipos, permitiendo aplicarlo total o parcialmente para saldar la factura. Esto automatiza la conciliación, evita errores manuales y proporciona una visión clara y actualizada del estado de cuenta de cada paciente. Dentro del módulo padre 'Facturación, Cobros y Contabilidad', esta funcionalidad actúa como un puente entre la planificación del tratamiento y la facturación final, asegurando que todos los movimientos financieros se rastreen de manera coherente y centralizada.

## 👥 Roles de Acceso

- Contable / Finanzas
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/facturacion-cobros-contabilidad/`

Esta funcionalidad se integra dentro de la feature 'facturacion-cobros-contabilidad'. La página principal, 'AnticiposPage.tsx', reside en la subcarpeta '/pages' y sirve como el centro de control para visualizar y gestionar todos los anticipos. Esta página utiliza componentes reutilizables de la carpeta '/components', como 'TablaAnticipos' para listar los registros y 'ModalRegistrarAnticipo' para la creación de nuevos anticipos. Todas las interacciones con el backend se canalizan a través de funciones específicas definidas en la carpeta '/apis', como 'anticiposApi.ts', que encapsulan las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/facturacion-cobros-contabilidad/pages/AnticiposPage.tsx`
- `/features/facturacion-cobros-contabilidad/components/TablaAnticipos.tsx`
- `/features/facturacion-cobros-contabilidad/components/ModalRegistrarAnticipo.tsx`
- `/features/facturacion-cobros-contabilidad/components/FiltrosBusquedaAnticipos.tsx`
- `/features/facturacion-cobros-contabilidad/apis/anticiposApi.ts`

### Componentes React

- TablaAnticipos
- ModalRegistrarAnticipo
- FiltrosBusquedaAnticipos
- SelectorPacienteAnticipo
- DetalleAnticipoPanel

## 🔌 APIs Backend

Las APIs para 'Anticipos y Señales' gestionan el ciclo de vida completo de un pago por adelantado. Permiten la creación, consulta, aplicación y anulación de anticipos, asegurando la integridad de los datos financieros del paciente y la clínica.

### `POST` `/api/anticipos`

Registra un nuevo anticipo para un paciente. Requiere el ID del paciente, el monto y el método de pago.

**Parámetros:** body: { pacienteId: string, monto: number, metodoPago: string, observacion: string, planTratamientoId?: string }

**Respuesta:** El objeto del anticipo recién creado.

### `GET` `/api/anticipos`

Obtiene una lista paginada de todos los anticipos. Permite filtrar por paciente, rango de fechas y estado ('disponible', 'aplicado', 'devuelto').

**Parámetros:** query: { page: number, limit: number, pacienteId?: string, fechaInicio?: string, fechaFin?: string, estado?: string }

**Respuesta:** Un objeto con la lista de anticipos y metadatos de paginación.

### `GET` `/api/anticipos/:id`

Obtiene los detalles completos de un anticipo específico, incluyendo el paciente y la factura a la que fue aplicado, si corresponde.

**Parámetros:** params: { id: string }

**Respuesta:** El objeto completo del anticipo.

### `PUT` `/api/anticipos/:id/aplicar`

Marca un anticipo como 'aplicado' y lo asocia a una factura específica. Esta acción es transaccional.

**Parámetros:** params: { id: string }, body: { facturaId: string, montoAplicado: number }

**Respuesta:** El objeto del anticipo actualizado con el estado 'aplicado'.

### `DELETE` `/api/anticipos/:id`

Anula un anticipo que no ha sido aplicado. Requiere permisos especiales y registra la acción en la auditoría.

**Parámetros:** params: { id: string }

**Respuesta:** Un mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

La lógica del backend se centra en el modelo 'Anticipo'. El 'AnticipoController' contiene las funciones para manejar las operaciones CRUD y la lógica de negocio, como la aplicación a facturas. Las rutas en 'anticipoRoutes.js' exponen estas funcionalidades a través de endpoints RESTful seguros y validados.

### Models

#### Anticipo

paciente: { type: ObjectId, ref: 'Paciente', required: true }, monto: { type: Number, required: true }, fecha: { type: Date, default: Date.now }, metodoPago: { type: String, enum: ['Efectivo', 'Tarjeta', 'Transferencia'], required: true }, estado: { type: String, enum: ['disponible', 'aplicado', 'devuelto'], default: 'disponible' }, facturaAplicada: { type: ObjectId, ref: 'Factura' }, planTratamiento: { type: ObjectId, ref: 'PlanTratamiento' }, creadoPor: { type: ObjectId, ref: 'Usuario' }, observacion: { type: String }

#### Factura

...otros campos de factura, anticiposAplicados: [{ anticipoId: { type: ObjectId, ref: 'Anticipo' }, monto: Number }]

#### Paciente

...otros campos de paciente, saldoAFavor: { type: Number, default: 0 }

### Controllers

#### AnticipoController

- crearAnticipo
- listarAnticipos
- obtenerAnticipoPorId
- aplicarAnticipoAFactura
- anularAnticipo

### Routes

#### `/api/anticipos`

- POST /
- GET /
- GET /:id
- PUT /:id/aplicar
- DELETE /:id

## 🔄 Flujos

1. 1. Registro de Anticipo: El personal de recepción busca al paciente, hace clic en 'Registrar Anticipo', rellena el formulario (monto, método de pago, observación) en el 'ModalRegistrarAnticipo', y confirma. El sistema genera el registro y un recibo imprimible.
2. 2. Consulta de Saldo: Al acceder a la ficha del paciente o al módulo de facturación, el sistema muestra de forma visible si el paciente tiene un saldo a favor por anticipos disponibles.
3. 3. Aplicación a Factura: Durante la creación de una factura, si el paciente tiene anticipos disponibles, el sistema ofrece la opción de aplicarlos. El usuario selecciona el anticipo y el monto a aplicar, y el total a pagar de la factura se recalcula automáticamente.
4. 4. Auditoría y Reportes: El personal de finanzas accede a la 'TablaAnticipos', utiliza los 'FiltrosBusquedaAnticipos' para ver todos los anticipos en un periodo, filtrando por estado para conciliar los saldos disponibles con la contabilidad.

## 📝 User Stories

- Como Recepcionista, quiero registrar rápidamente un anticipo de un paciente que va a iniciar un tratamiento de implantes, para asegurar su cita y registrar el ingreso de dinero correctamente.
- Como Contable, quiero generar un listado de todos los anticipos en estado 'disponible' al final del mes, para conocer el monto total que la clínica adeuda a los pacientes en servicios no prestados.
- Como Recepcionista, quiero que al momento de generar una factura para un paciente, el sistema me alerte si tiene un saldo a favor y me permita aplicarlo con un solo clic, para agilizar el proceso de cobro.
- Como Gerente de la clínica, quiero ver un reporte de los anticipos asociados a planes de tratamiento específicos para evaluar qué servicios están generando mayor compromiso financiero por parte de los pacientes.

## ⚙️ Notas Técnicas

- Atomicidad: La operación de aplicar un anticipo a una factura debe ser una transacción atómica en MongoDB. Es crucial que la actualización del estado del anticipo y la actualización del saldo de la factura ocurran juntas o no ocurran en absoluto, para evitar inconsistencias de datos.
- Seguridad y Auditoría: Todas las operaciones de creación, aplicación y anulación de anticipos deben ser registradas en un log de auditoría, guardando qué usuario realizó la acción y cuándo. El acceso a la anulación debe estar restringido a roles con permisos elevados.
- Integración con Caja: La creación de un anticipo debe generar un movimiento de ingreso en el módulo de 'Caja y Arqueo' para reflejar la entrada de dinero real en la clínica.
- Performance: Para clínicas con un alto volumen de transacciones, la consulta de anticipos (GET /api/anticipos) debe estar optimizada con índices en la base de datos sobre los campos 'paciente', 'fecha' y 'estado'.

