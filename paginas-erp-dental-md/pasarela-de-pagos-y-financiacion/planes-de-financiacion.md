# Planes de Financiación

**Categoría:** Gestión Financiera | **Módulo:** Pasarela de Pagos y Financiación

La funcionalidad de 'Planes de Financiación' es un componente crítico dentro del módulo 'Pasarela de Pagos y Financiación'. Su propósito principal es permitir a la clínica dental crear, gestionar y ofrecer diversas opciones de pago a plazos a sus pacientes para tratamientos de alto coste. Esto incrementa significativamente la tasa de aceptación de presupuestos, mejorando tanto la salud bucodental del paciente como el flujo de ingresos de la clínica. El sistema permite al personal financiero o administrativo configurar plantillas de financiación con parámetros específicos como tasa de interés (TAE), número de cuotas, importe mínimo y máximo a financiar, y la necesidad de un pago inicial o entrada. Una vez configurados, estos planes pueden ser asignados por el personal de recepción o administración a un presupuesto aceptado por un paciente. Al asignar un plan, el sistema calcula automáticamente una tabla de amortización detallada, especificando el capital, los intereses y el total de cada cuota. Para el paciente, esta funcionalidad se integra con su portal personal, donde puede consultar en cualquier momento el estado de su financiación, las cuotas pagadas, el calendario de pagos futuros y el capital pendiente. Esta transparencia genera confianza y facilita la gestión de sus pagos. A nivel interno, proporciona a la dirección y al departamento contable una visión clara y centralizada de todos los créditos concedidos, los flujos de caja futuros provenientes de las cuotas y alertas sobre posibles impagos, facilitando un control financiero riguroso.

## 👥 Roles de Acceso

- Contable / Finanzas
- Director / Admin general (multisede)
- Recepción / Secretaría
- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/pasarela-pagos-financiacion/`

Esta funcionalidad reside dentro de la feature 'pasarela-pagos-financiacion'. La carpeta '/pages' contendrá las diferentes vistas: una para la gestión de plantillas de planes (Admin/Finanzas), otra para la asignación de un plan a un paciente, y una vista en el portal del paciente. La carpeta '/components' albergará componentes reutilizables como el formulario de creación/edición de planes, la tabla de visualización de planes y la tabla de amortización. La carpeta '/apis' manejará todas las llamadas a la API REST del backend para las operaciones CRUD de los planes y la gestión de las financiaciones de los pacientes.

### Archivos Frontend

- `/features/pasarela-pagos-financiacion/pages/GestionPlanesFinanciacionPage.tsx`
- `/features/pasarela-pagos-financiacion/pages/AsignarPlanFinanciacionPacientePage.tsx`
- `/features/pasarela-pagos-financiacion/pages/portal/MiFinanciacionDetallePage.tsx`

### Componentes React

- FormularioPlanFinanciacion
- TablaGestionPlanes
- ModalAsignarPlan
- TablaAmortizacionDetallada
- CardResumenFinanciacionPaciente
- SelectorDePlan

## 🔌 APIs Backend

Las APIs gestionan las plantillas de planes de financiación (CRUD) y las instancias de financiación asignadas a cada paciente, incluyendo el cálculo de la amortización.

### `POST` `/api/financiacion/plantillas`

Crea una nueva plantilla de plan de financiación.

**Parámetros:** body: { nombre, tasaInteresAnual, numeroCuotasMax, montoMinimo, requiereEntrada, porcentajeEntrada }

**Respuesta:** El objeto de la plantilla de plan creada.

### `GET` `/api/financiacion/plantillas`

Obtiene una lista de todas las plantillas de planes de financiación disponibles y activas.

**Parámetros:** query: { estado: 'activo' }

**Respuesta:** Un array de objetos de plantillas de planes.

### `PUT` `/api/financiacion/plantillas/:id`

Actualiza una plantilla de plan de financiación existente.

**Parámetros:** params: id, body: { ...campos a actualizar }

**Respuesta:** El objeto de la plantilla de plan actualizada.

### `POST` `/api/financiacion/asignar`

Asigna un plan a un paciente y a su presupuesto, generando la financiación concreta con su tabla de amortización.

**Parámetros:** body: { plantillaId, pacienteId, presupuestoId, montoAFinanciar, numeroCuotas, montoEntrada }

**Respuesta:** El objeto de la financiación del paciente creado, incluyendo la tabla de amortización.

### `GET` `/api/financiacion/paciente/:pacienteId`

Obtiene el historial y estado de todas las financiaciones de un paciente específico.

**Parámetros:** params: pacienteId

**Respuesta:** Un array con las financiaciones del paciente.

### `GET` `/api/financiacion/:financiacionId`

Obtiene el detalle completo de una financiación específica, incluyendo su tabla de amortización actualizada.

**Parámetros:** params: financiacionId

**Respuesta:** El objeto completo de la financiación del paciente.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se basa en dos modelos principales: 'PlanFinanciacion' para las plantillas y 'FinanciacionPaciente' para las instancias aplicadas. Los controladores separan la lógica de negocio para cada modelo, y las rutas exponen los endpoints de manera organizada y segura.

### Models

#### PlanFinanciacion

nombre: String, descripcion: String, tasaInteresAnual: Number, numeroCuotasMin: Number, numeroCuotasMax: Number, montoMinimo: Number, montoMaximo: Number, requiereEntrada: Boolean, porcentajeEntrada: Number, estado: { type: String, enum: ['activo', 'inactivo'] }, clinicaId: { type: Schema.Types.ObjectId, ref: 'Clinica' }

#### FinanciacionPaciente

pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente' }, planFinanciacionId: { type: Schema.Types.ObjectId, ref: 'PlanFinanciacion' }, presupuestoId: { type: Schema.Types.ObjectId, ref: 'Presupuesto' }, montoTotalFinanciado: Number, montoEntrada: Number, numeroCuotas: Number, montoCuota: Number, tasaInteresAplicada: Number, fechaInicio: Date, estado: { type: String, enum: ['activo', 'pagado', 'mora'] }, tablaAmortizacion: [{ numeroCuota: Number, fechaVencimiento: Date, capital: Number, interes: Number, totalCuota: Number, capitalPendiente: Number, estadoPago: String, pagoId: { type: Schema.Types.ObjectId, ref: 'Pago' } }]

### Controllers

#### PlanFinanciacionController

- crearPlan
- obtenerPlanes
- obtenerPlanPorId
- actualizarPlan
- cambiarEstadoPlan

#### FinanciacionPacienteController

- asignarPlanAPaciente
- obtenerFinanciacionesPorPaciente
- obtenerDetalleFinanciacion
- registrarPagoCuota

### Routes

#### `/api/financiacion/plantillas`

- POST /
- GET /
- GET /:id
- PUT /:id

#### `/api/financiacion`

- POST /asignar
- GET /paciente/:pacienteId
- GET /:financiacionId

## 🔄 Flujos

1. Flujo de Creación de Plan: El rol Contable/Finanzas accede a la sección de configuración financiera, crea una nueva plantilla de plan de financiación, define sus condiciones (intereses, plazos, etc.) y la guarda como 'activa'.
2. Flujo de Asignación de Plan: El rol de Recepción, al confirmar un presupuesto con un paciente, accede a la opción 'Financiar'. Selecciona una plantilla de plan activa, introduce el monto final a financiar y el número de cuotas. El sistema muestra la simulación de la tabla de amortización. Al confirmar, se genera la financiación para el paciente.
3. Flujo de Consulta de Paciente: El Paciente inicia sesión en su portal, va a la sección 'Mis Pagos' o 'Mi Financiación', y puede ver un resumen de su financiación activa. Al hacer clic, accede al detalle completo con la tabla de amortización, viendo qué cuotas ha pagado y cuáles están pendientes.
4. Flujo de Seguimiento Financiero: El rol Contable/Finanzas revisa un dashboard con todas las financiaciones activas, filtrando por estado (al día, en mora) para gestionar los cobros y la previsión de tesorería.

## 📝 User Stories

- Como Contable, quiero crear y modificar plantillas de financiación con diferentes tasas de interés y plazos para poder ofrecer opciones competitivas y rentables a los pacientes.
- Como Recepcionista, quiero seleccionar un plan de financiación para un paciente y ver una simulación instantánea de las cuotas para poder cerrar la aceptación del tratamiento de forma rápida y transparente.
- Como Paciente, quiero acceder a mi portal y ver claramente mi calendario de pagos de la financiación, el importe de cada cuota y las que ya he abonado, para tener un control total sobre mis compromisos de pago.
- Como Director de clínica, quiero un informe de los ingresos pendientes por financiaciones para poder realizar una previsión de tesorería precisa para los próximos meses.

## ⚙️ Notas Técnicas

- Seguridad: Es crucial que todos los endpoints relacionados con finanzas estén protegidos por autenticación y autorización basada en roles (RBAC). Los datos financieros sensibles deben estar encriptados en la base de datos.
- Lógica de Cálculo: La función que genera la tabla de amortización (preferiblemente método francés) debe residir exclusivamente en el backend para asegurar la integridad y consistencia de los cálculos. Debe ser una función pura y estar cubierta por tests unitarios exhaustivos.
- Integración con Pagos: La funcionalidad debe estar preparada para una integración futura con la pasarela de pagos para automatizar el cobro de las cuotas mediante domiciliación bancaria (SEPA) o tarjeta de crédito recurrente.
- Notificaciones: Implementar un sistema de notificaciones automáticas (email/SMS) para recordar a los pacientes las fechas de vencimiento de sus cuotas, reduciendo la tasa de morosidad.
- Manejo de Errores: El backend debe validar rigurosamente todas las entradas para evitar cálculos incorrectos, como financiar un monto fuera de los límites del plan o aplicar un número de cuotas no permitido.

