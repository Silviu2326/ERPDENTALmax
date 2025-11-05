# Procesamiento de Pagos

**Categoría:** Gestión Financiera | **Módulo:** Pasarela de Pagos y Financiación

La funcionalidad de 'Procesamiento de Pagos' es el núcleo operativo del módulo 'Pasarela de Pagos y Financiación' dentro del ERP dental. Esta página centraliza todas las transacciones financieras directas, permitiendo al personal de la clínica registrar y procesar los pagos de los pacientes por los tratamientos recibidos. Su propósito principal es asegurar un flujo de caja preciso, mantener actualizados los saldos de los pacientes y proporcionar una experiencia de pago fluida y segura. Funciona como un TPV (Terminal Punto de Venta) digital integrado. Desde aquí, el personal de recepción o finanzas puede seleccionar un paciente, visualizar su plan de tratamiento con los saldos pendientes, y aplicar pagos utilizando diversos métodos como tarjeta de crédito/débito, efectivo, transferencia bancaria o vincularlo a un plan de financiación aprobado. La integración con pasarelas de pago externas (como Stripe, Redsys, etc.) es fundamental, ya que permite el procesamiento seguro de tarjetas sin que el ERP necesite almacenar datos sensibles, garantizando el cumplimiento de la normativa PCI DSS. Además, esta funcionalidad genera automáticamente los recibos o facturas correspondientes, actualiza el estado financiero del tratamiento y del paciente en tiempo real, y registra cada transacción en el historial para futuras consultas y conciliaciones contables. Para el paciente, a través de su portal, esta funcionalidad ofrece una versión simplificada para visualizar y pagar sus facturas pendientes online.

## 👥 Roles de Acceso

- Contable / Finanzas
- Recepción / Secretaría
- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/pasarela-pagos-financiacion/`

Esta funcionalidad reside dentro de la feature 'pasarela-pagos-financiacion'. La lógica de la interfaz se encuentra en '/pages/ProcesamientoPagosPage.tsx', que orquesta varios componentes reutilizables de la carpeta '/components/'. Estos componentes gestionan la selección del paciente, la visualización de deudas, el formulario de pago y la integración con la pasarela. Las llamadas al backend para procesar pagos y obtener datos se abstraen en un hook personalizado dentro de '/apis/pagoApi.ts' para mantener el código limpio y organizado.

### Archivos Frontend

- `/features/pasarela-pagos-financiacion/pages/ProcesamientoPagosPage.tsx`
- `/features/pasarela-pagos-financiacion/pages/PortalPacientePagosPage.tsx`
- `/features/pasarela-pagos-financiacion/components/FormularioProcesarPago.tsx`
- `/features/pasarela-pagos-financiacion/components/SelectorMetodoPago.tsx`
- `/features/pasarela-pagos-financiacion/components/ResumenDeudaPaciente.tsx`
- `/features/pasarela-pagos-financiacion/components/HistorialPagosMiniatura.tsx`
- `/features/pasarela-pagos-financiacion/components/integrations/StripePaymentElement.tsx`
- `/features/pasarela-pagos-financiacion/apis/pagoApi.ts`

### Componentes React

- FormularioProcesarPago
- SelectorMetodoPago
- ResumenDeudaPaciente
- HistorialPagosMiniatura
- StripePaymentElement
- ModalConfirmacionPago
- GeneradorReciboPDF

## 🔌 APIs Backend

Las APIs para el procesamiento de pagos se encargan de la comunicación segura con las pasarelas de pago, la creación y actualización de registros de transacciones en la base de datos, y la consulta del historial financiero de los pacientes.

### `POST` `/api/pagos/procesar`

Procesa un nuevo pago. Recibe los detalles del pago, interactúa con la pasarela si es necesario (para pagos que no son en efectivo), y crea el registro del pago en la base de datos, actualizando el saldo del paciente y los tratamientos asociados.

**Parámetros:** pacienteId: string, monto: number, metodoPago: string ('Tarjeta', 'Efectivo', 'Transferencia'), tratamientosIds: string[], paymentMethodId: string (token de la pasarela, solo para pagos con tarjeta)

**Respuesta:** Objeto del pago creado con su estado (ej: { pagoId: '...', estado: 'Completado' }).

### `GET` `/api/pagos/paciente/:pacienteId`

Obtiene el historial completo de pagos de un paciente específico, ordenado por fecha.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Array de objetos de pago.

### `GET` `/api/pagos/:pagoId`

Obtiene los detalles de un pago específico, incluyendo los tratamientos asociados, para generar un recibo o factura.

**Parámetros:** pagoId (en la URL)

**Respuesta:** Objeto detallado del pago.

### `POST` `/api/pagos/gateway/create-intent`

Endpoint seguro que se comunica con la pasarela de pago (ej. Stripe) para crear una 'intención de pago'. Devuelve un 'client_secret' que el frontend utiliza para confirmar el pago de forma segura sin exponer claves secretas.

**Parámetros:** monto: number, moneda: string (ej: 'EUR')

**Respuesta:** Objeto con el 'client_secret' de la pasarela (ej: { clientSecret: 'pi_...' }).

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con un modelo 'Pago' para persistir cada transacción. El 'PagoController' contiene la lógica de negocio, incluyendo la interacción con servicios de pasarelas de pago externas. Las rutas exponen de forma segura estas funcionalidades al frontend.

### Models

#### Pago

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, tratamientos: [{ type: Schema.Types.ObjectId, ref: 'Tratamiento' }], monto: Number, moneda: String, metodoPago: { type: String, enum: ['Tarjeta', 'Efectivo', 'Transferencia', 'Financiacion'] }, fecha: { type: Date, default: Date.now }, estado: { type: String, enum: ['Completado', 'Pendiente', 'Fallido'] }, transaccionIdExterno: String, notas: String, creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }

#### Tratamiento

Se referencia este modelo para actualizar su campo 'saldoPendiente: Number' tras un pago exitoso.

### Controllers

#### PagoController

- procesarPago
- obtenerPagosPorPaciente
- obtenerDetallePago
- createPaymentIntent

### Routes

#### `/api/pagos`

- POST /procesar
- GET /paciente/:pacienteId
- GET /:pagoId
- POST /gateway/create-intent

## 🔄 Flujos

1. Flujo Recepción (Pago con Tarjeta): El recepcionista busca y selecciona al paciente. El sistema muestra los tratamientos con saldo pendiente. El recepcionista selecciona los tratamientos a pagar y el método 'Tarjeta'. El sistema solicita la creación de un 'Payment Intent' al backend. El frontend renderiza el elemento de la pasarela de pago (ej. Stripe Elements). Se procesa la tarjeta, y si es exitoso, el backend registra el pago, actualiza los saldos y devuelve una confirmación. El sistema ofrece la opción de imprimir o enviar el recibo por email.
2. Flujo Recepción (Pago en Efectivo): El recepcionista selecciona al paciente y los tratamientos. Elige el método 'Efectivo' e introduce el monto recibido. El sistema valida el monto, registra el pago directamente sin pasar por una pasarela, actualiza los saldos y genera el recibo.
3. Flujo Paciente (Portal Online): El paciente inicia sesión en su portal y navega a la sección de 'Pagos Pendientes'. Selecciona una o varias facturas/tratamientos a pagar. Es dirigido a una página de pago segura donde introduce los datos de su tarjeta. Tras la confirmación de la pasarela, su portal se actualiza mostrando el pago realizado y puede descargar el recibo.

## 📝 User Stories

- Como recepcionista, quiero procesar un pago con tarjeta de crédito de forma rápida y segura para cobrar al paciente al finalizar su visita y mantener sus cuentas al día.
- Como gerente de la clínica, quiero acceder a un registro de todas las transacciones de pago para poder realizar un seguimiento de los ingresos diarios y semanales.
- Como contable, quiero que cada pago esté asociado a uno o más tratamientos específicos para facilitar la conciliación contable y el seguimiento de la rentabilidad por tratamiento.
- Como paciente, quiero poder pagar mis facturas pendientes desde mi casa a través del portal web para ahorrar tiempo y gestionar mis finanzas cómodamente.
- Como recepcionista, quiero registrar un pago en efectivo y que el sistema calcule el cambio si es necesario, para agilizar el proceso de cobro en persona.

## ⚙️ Notas Técnicas

- Seguridad (PCI DSS): Es imperativo no almacenar nunca datos sensibles de tarjetas de crédito/débito en nuestra base de datos. Utilizar soluciones como Stripe Elements o equivalentes que tokenizan la información en el cliente, de modo que a nuestro backend solo llega un token no sensible.
- Transacciones Atómicas: El proceso de registrar un pago y actualizar los saldos de los tratamientos asociados debe ser una operación atómica. Utilizar transacciones de MongoDB para garantizar que si una parte de la operación falla (ej. la actualización del saldo), toda la transacción se revierta para evitar inconsistencias de datos.
- Integración de Pasarela: Las claves secretas de la API de la pasarela de pago (Stripe, etc.) deben ser almacenadas de forma segura en variables de entorno en el servidor backend y nunca deben ser expuestas en el código del frontend.
- Webhooks: Implementar un endpoint de webhook en el backend para recibir notificaciones asíncronas de la pasarela de pago. Esto es crucial para manejar eventos como pagos confirmados de transferencias bancarias, disputas (chargebacks) o pagos fallidos que ocurren fuera del flujo principal.
- Idempotencia: Las peticiones para crear pagos deben ser idempotentes para prevenir cobros duplicados en caso de reintentos por fallos de red. Esto se puede lograr utilizando una clave de idempotencia única por cada intento de transacción.

