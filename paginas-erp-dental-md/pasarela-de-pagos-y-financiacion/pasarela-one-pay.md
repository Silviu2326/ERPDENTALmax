# Pasarela One Pay

**Categoría:** Gestión Financiera | **Módulo:** Pasarela de Pagos y Financiación

La funcionalidad 'Pasarela One Pay' representa la integración directa del sistema ERP dental con el servicio de pago digital One Pay de Transbank. Esta integración está diseñada para modernizar y agilizar el proceso de cobro en la clínica, ofreciendo a los pacientes una forma de pago rápida, segura y sin contacto a través de sus dispositivos móviles. Su propósito principal es automatizar la recepción de pagos, eliminar la necesidad de terminales de punto de venta (POS) físicos para esta modalidad y reducir drásticamente los errores de digitación y conciliación manual. Dentro del módulo padre 'Pasarela de Pagos y Financiación', One Pay actúa como una de las opciones de pago configurables. El funcionamiento es sencillo: al momento de realizar un cobro, el personal de la clínica selecciona 'Pagar con One Pay', ingresa el monto, y el sistema genera un código QR único para esa transacción. El paciente escanea este código con la aplicación One Pay en su smartphone, autoriza el pago, y la confirmación se refleja en tiempo real en el ERP. Automáticamente, el sistema actualiza el estado de la cuenta del paciente, asocia el pago al tratamiento correspondiente y genera el comprobante, centralizando toda la información financiera y operativa en un único lugar.

## 👥 Roles de Acceso

- Contable / Finanzas
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/pasarela-pagos-financiacion/`

Esta funcionalidad se aloja dentro de la carpeta del módulo padre '/features/pasarela-pagos-financiacion/'. La subcarpeta '/pages/' contiene las pantallas principales, como la página de configuración de One Pay y el historial de transacciones. La carpeta '/components/' alberga los componentes reutilizables específicos, como el formulario de configuración, el modal para generar el código QR de pago y la tabla de transacciones. Finalmente, la carpeta '/apis/' contiene las funciones que encapsulan las llamadas a los endpoints del backend para gestionar la configuración, crear transacciones y verificar estados.

### Archivos Frontend

- `/features/pasarela-pagos-financiacion/pages/OnePayConfiguracionPage.tsx`
- `/features/pasarela-pagos-financiacion/pages/OnePayTransaccionesPage.tsx`
- `/features/pasarela-pagos-financiacion/components/OnePayConfiguracionForm.tsx`
- `/features/pasarela-pagos-financiacion/components/ModalGenerarPagoOnePay.tsx`
- `/features/pasarela-pagos-financiacion/components/TablaTransaccionesOnePay.tsx`

### Componentes React

- OnePayConfiguracionForm
- ModalGenerarPagoOnePay
- TablaTransaccionesOnePay
- IndicadorEstadoPagoOnePay

## 🔌 APIs Backend

Las APIs del backend actúan como un intermediario seguro entre el frontend del ERP y los servicios de Transbank One Pay. Se encargan de gestionar las credenciales de forma segura, iniciar solicitudes de pago, consultar el estado de las transacciones y procesar las notificaciones (webhooks) de confirmación de pago enviadas por One Pay.

### `POST` `/api/pagos/onepay/crear-transaccion`

Crea una nueva transacción de pago en One Pay. Recibe los detalles del cobro y devuelve los datos necesarios para generar el código QR en el frontend.

**Parámetros:** monto: number, ordenCompra: string (ID interno único del cobro), descripcion: string, pacienteId: string

**Respuesta:** JSON con { qrCodeAsBase64, ott, externalUniqueNumber, issuedAt }

### `GET` `/api/pagos/onepay/estado-transaccion/:ordenCompra`

Consulta el estado de una transacción específica utilizando el ID interno de la orden de compra. Usado para el polling desde el frontend.

**Parámetros:** ordenCompra: string (parámetro de ruta)

**Respuesta:** JSON con { estado: 'PAGADO', 'RECHAZADO', 'PENDIENTE', 'ANULADO' }

### `POST` `/api/pagos/onepay/callback`

Endpoint de Webhook para recibir la confirmación final de la transacción desde los servidores de One Pay. Actualiza el estado del pago en la base de datos del ERP.

**Parámetros:** Cuerpo de la petición enviado por Transbank con el resultado de la transacción.

**Respuesta:** Respuesta HTTP 200 OK para confirmar la recepción a Transbank.

### `POST` `/api/pagos/onepay/configuracion`

Guarda o actualiza las credenciales (API Key, Shared Secret) de la integración con One Pay de forma segura.

**Parámetros:** apiKey: string, sharedSecret: string, entorno: 'integracion' | 'produccion'

**Respuesta:** JSON con { success: true, message: 'Configuración guardada' }

### `GET` `/api/pagos/onepay/configuracion`

Obtiene la configuración actual de One Pay, usualmente con las claves ofuscadas por seguridad.

**Respuesta:** JSON con { apiKey: '****', entorno: 'produccion' }

## 🗂️ Estructura Backend (MERN)

La estructura del backend soporta la integración con One Pay a través de un modelo para persistir cada transacción, un controlador que contiene la lógica de negocio y la comunicación con el SDK de Transbank, y un archivo de rutas para exponer los endpoints necesarios.

### Models

#### OnePayTransaccion

pacienteId: ObjectId, tratamientoId: ObjectId, monto: Number, estado: String ('PENDIENTE', 'PAGADO', 'RECHAZADO', 'ANULADO'), ordenCompra: String (ID único interno), externalUniqueNumber: String (ID de Transbank), qrCodeData: String, fechaCreacion: Date, fechaActualizacion: Date

#### ConfiguracionPasarela

nombre: String ('OnePay'), credenciales: Object (cifrado), entorno: String ('produccion', 'integracion'), activa: Boolean

### Controllers

#### OnePayController

- crearTransaccionOnePay
- consultarEstadoTransaccion
- procesarCallbackOnePay
- guardarConfiguracionOnePay
- obtenerConfiguracionOnePay

### Routes

#### `/api/pagos/onepay`

- POST /crear-transaccion
- GET /estado-transaccion/:ordenCompra
- POST /callback
- GET /configuracion
- POST /configuracion

## 🔄 Flujos

1. Flujo de Configuración: El rol de IT accede a la página de 'Configuración de Pasarelas', selecciona One Pay, introduce la API Key y el Shared Secret proporcionados por Transbank, elige el entorno (producción/integración) y guarda la configuración.
2. Flujo de Generación de Pago: El recepcionista finaliza un cobro a un paciente, selecciona 'One Pay' como método de pago. El sistema muestra un modal, se hace una llamada al backend para crear la transacción y se recibe y muestra un código QR en pantalla.
3. Flujo de Pago del Paciente: El paciente abre la app One Pay en su móvil, escanea el código QR de la pantalla, verifica el monto y la clínica, y autoriza el pago con su PIN o huella digital.
4. Flujo de Confirmación y Cierre: El modal en el ERP detecta el cambio de estado (vía polling o WebSocket) y muestra 'Pago Aprobado'. Automáticamente, el sistema registra el pago, lo asocia a la cuenta del paciente y emite el comprobante digital.

## 📝 User Stories

- Como personal de TI, quiero configurar de forma segura las credenciales de la pasarela One Pay para activar la opción de pago en el sistema.
- Como recepcionista, quiero generar un código QR de One Pay para que el paciente pueda pagar su tratamiento de forma rápida y sin contacto desde su móvil.
- Como paciente, quiero escanear un código QR con mi app de One Pay para pagar mi consulta de forma segura y recibir mi comprobante al instante.
- Como contable, quiero ver un listado de todas las transacciones realizadas a través de One Pay con su estado (aprobada, rechazada) para conciliar los pagos fácilmente con los registros de la clínica.
- Como contable, quiero que cuando un pago sea aprobado a través de One Pay, el estado de la cuenta del paciente se actualice automáticamente en el ERP para evitar el registro manual.

## ⚙️ Notas Técnicas

- Seguridad: Las credenciales (API Key, Shared Secret) deben ser almacenadas de forma cifrada en la base de datos y gestionadas a través de variables de entorno para el acceso inicial. El endpoint de callback debe validar la autenticidad de la petición de Transbank.
- Integración SDK: Es mandatorio utilizar el SDK oficial de `transbank-sdk` para Node.js para asegurar la compatibilidad y seguir las mejores prácticas de integración recomendadas por Transbank.
- Actualización en Tiempo Real: Para una mejor experiencia de usuario, se recomienda implementar WebSockets o Server-Sent Events (SSE) para notificar al frontend del cambio de estado del pago, en lugar de depender exclusivamente del polling HTTP.
- Manejo de Errores: Se debe implementar un manejo robusto de errores para escenarios como timeouts en la comunicación con Transbank, transacciones expiradas, o credenciales inválidas, proveyendo feedback claro al usuario.
- Consistencia de Datos: Implementar un mecanismo de re-verificación (ej. un cron job nocturno) para consultar el estado de transacciones que queden en estado 'PENDIENTE' por un tiempo prolongado y que no hayan recibido un callback, para evitar inconsistencias.

