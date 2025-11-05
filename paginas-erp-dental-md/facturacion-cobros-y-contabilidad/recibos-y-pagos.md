# Recibos y Pagos

**Categoría:** Gestión Financiera | **Módulo:** Facturación, Cobros y Contabilidad

La funcionalidad 'Recibos y Pagos' es un componente central del módulo de 'Facturación, Cobros y Contabilidad', diseñada para gestionar de manera eficiente todo el ciclo de vida de los cobros a pacientes. Esta página permite al personal de recepción y finanzas registrar, rastrear y conciliar todos los pagos recibidos en la clínica, ya sea por tratamientos finalizados, abonos a planes de tratamiento o pagos de facturas pendientes. Funciona como el punto de caja digital de la clínica, ofreciendo una visión clara y en tiempo real de los ingresos. Al registrar un pago, el sistema lo asocia automáticamente a un paciente y a una o varias facturas, actualizando de inmediato el saldo pendiente de dicha factura y cambiando su estado (de 'Pendiente' a 'Pagada Parcialmente' o 'Pagada'). Esto es crucial para mantener un control riguroso de las cuentas por cobrar. Además, la funcionalidad genera recibos de pago personalizables, que pueden ser impresos al instante o enviados digitalmente al paciente, mejorando la profesionalidad y la transparencia. Para el área contable, esta herramienta es fundamental para realizar cierres de caja diarios, auditorías y conciliaciones bancarias, ya que permite filtrar y exportar informes de pagos por fecha, método de pago, profesional o sucursal.

## 👥 Roles de Acceso

- Contable / Finanzas
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/facturacion-cobros-contabilidad/`

Toda la lógica de frontend para esta funcionalidad se encuentra dentro de la carpeta 'facturacion-cobros-contabilidad'. La página principal, 'RecibosPagosPage.tsx', reside en la subcarpeta '/pages' y orquesta los diferentes componentes. Los componentes reutilizables como la tabla de pagos, el modal para registrar un nuevo pago y el visor de recibos están en '/components'. Las llamadas al backend se abstraen en un archivo dentro de '/apis', facilitando el mantenimiento y la gestión de los endpoints.

### Archivos Frontend

- `/features/facturacion-cobros-contabilidad/pages/RecibosPagosPage.tsx`
- `/features/facturacion-cobros-contabilidad/components/TablaPagos.tsx`
- `/features/facturacion-cobros-contabilidad/components/ModalRegistroPago.tsx`
- `/features/facturacion-cobros-contabilidad/components/VisorRecibo.tsx`
- `/features/facturacion-cobros-contabilidad/components/FiltrosPagos.tsx`
- `/features/facturacion-cobros-contabilidad/apis/pagosApi.ts`

### Componentes React

- TablaPagos
- ModalRegistroPago
- VisorRecibo
- FiltrosPagos

## 🔌 APIs Backend

Las APIs para 'Recibos y Pagos' gestionan las operaciones CRUD de los pagos, asegurando que cada pago se vincule correctamente a un paciente y una factura, y actualizando los saldos correspondientes. Proveen endpoints para listar y filtrar pagos, registrar nuevos cobros y anular registros erróneos.

### `GET` `/api/pagos`

Obtiene una lista paginada de todos los pagos, con capacidad de filtrado por rango de fechas, paciente, método de pago o estado.

**Parámetros:** page (number), limit (number), fechaInicio (string), fechaFin (string), pacienteId (string), metodoPago (string)

**Respuesta:** Un objeto con la lista de pagos y metadatos de paginación.

### `POST` `/api/pagos`

Registra un nuevo pago en el sistema. Esta operación es transaccional: crea el registro del pago y actualiza el saldo de la factura asociada.

**Parámetros:** Body: { pacienteId: string, facturaId: string, monto: number, metodoPago: string, fechaPago: date, notas: string }

**Respuesta:** El objeto del nuevo pago creado.

### `GET` `/api/pagos/{id}`

Obtiene los detalles completos de un pago específico, incluyendo información del paciente y la factura asociada.

**Parámetros:** id (string) - ID del pago

**Respuesta:** El objeto del pago solicitado.

### `GET` `/api/pagos/{id}/recibo`

Obtiene los datos necesarios para generar un recibo de un pago específico.

**Parámetros:** id (string) - ID del pago

**Respuesta:** Un objeto JSON con los datos del recibo (datos de la clínica, paciente, detalles del pago, etc.).

### `DELETE` `/api/pagos/{id}`

Anula un pago. Realiza un 'soft delete' cambiando el estado del pago a 'Anulado' y revierte el monto en el saldo de la factura asociada. Requiere permisos especiales.

**Parámetros:** id (string) - ID del pago

**Respuesta:** Un mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

El backend utiliza el modelo 'Pago' para persistir la información en MongoDB. El 'PagoController' contiene la lógica de negocio, como el manejo de transacciones para asegurar la consistencia entre pagos y facturas. Las rutas se definen en 'pagoRoutes.js' y mapean los endpoints HTTP a las funciones del controlador.

### Models

#### Pago

numeroRecibo: String (único, autoincremental), paciente: ObjectId (ref: 'Paciente'), factura: ObjectId (ref: 'Factura'), monto: Number, metodoPago: String (enum: ['Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Transferencia', 'Cheque', 'Otro']), fechaPago: Date, responsableRegistro: ObjectId (ref: 'User'), notas: String, estado: String (enum: ['Completado', 'Anulado'])

#### Factura

Campos relevantes: total: Number, saldoPendiente: Number, estado: String (enum: ['Pendiente', 'Pagada Parcialmente', 'Pagada'])

### Controllers

#### PagoController

- crearPago
- obtenerPagos
- obtenerPagoPorId
- anularPago
- generarDatosRecibo

### Routes

#### `/api/pagos`

- GET /
- POST /
- GET /:id
- DELETE /:id
- GET /:id/recibo

## 🔄 Flujos

1. El recepcionista busca una factura pendiente de un paciente, hace clic en 'Registrar Pago'.
2. Se abre un modal ('ModalRegistroPago') donde el recepcionista introduce el monto, selecciona el método de pago y añade notas.
3. Al guardar, el sistema valida los datos, crea el registro del pago, actualiza el saldo de la factura y cierra el modal.
4. El sistema muestra una notificación de éxito y ofrece la opción de ver o imprimir el recibo usando el componente 'VisorRecibo'.
5. El contable accede a la página, utiliza los 'FiltrosPagos' para ver todos los pagos con 'Tarjeta de Crédito' de la semana actual para conciliación.
6. Si un pago se registró por error, un usuario con permisos puede buscarlo en la 'TablaPagos' y anularlo, lo que revierte la transacción a nivel de datos.

## 📝 User Stories

- Como recepcionista, quiero registrar un pago de forma rápida y sencilla para no hacer esperar al paciente en el mostrador.
- Como contable, quiero generar un informe de todos los pagos recibidos en el último mes, desglosado por método de pago, para preparar mis reportes financieros.
- Como recepcionista, quiero imprimir un recibo de pago inmediatamente después de registrarlo para entregárselo en mano al paciente como comprobante.
- Como gerente de la clínica, quiero ver el total de ingresos diarios en tiempo real para tener un pulso del rendimiento financiero de la clínica.
- Como personal de finanzas, quiero poder anular un pago que se registró con un monto incorrecto para poder registrar el pago correcto y mantener la contabilidad precisa.

## ⚙️ Notas Técnicas

- Seguridad: El endpoint de anulación (DELETE /api/pagos/{id}) debe estar protegido por un middleware de autorización que verifique si el rol del usuario es 'Contable / Finanzas' o 'Administrador'.
- Transacciones Atómicas: La operación de crear un pago y actualizar la factura asociada debe implementarse utilizando transacciones de MongoDB para garantizar la integridad de los datos. Si una parte de la operación falla, toda la transacción debe revertirse.
- Rendimiento: La colección 'pagos' debe tener índices en los campos 'paciente', 'factura' y 'fechaPago' para optimizar las consultas y filtros.
- Generación de Recibos: Para la impresión, el frontend puede utilizar la librería `react-to-print`. Para la generación de PDFs en el backend (para enviar por correo), se puede usar `pdfkit` por su ligereza y eficiencia.
- Numeración de Recibos: El campo 'numeroRecibo' debe ser único y secuencial. Esto se puede lograr con un modelo contador separado en MongoDB que se actualiza atómicamente.

