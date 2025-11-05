# Pagos con Tarjeta

**Categoría:** Gestión Financiera | **Módulo:** Pasarela de Pagos y Financiación

La funcionalidad 'Pagos con Tarjeta' es un componente crítico dentro del módulo 'Pasarela de Pagos y Financiación'. Su objetivo principal es permitir a la clínica dental procesar pagos de manera segura, rápida y eficiente utilizando tarjetas de crédito o débito, tanto en el mostrador como a través del portal del paciente. Esta funcionalidad se integra directamente con los módulos de 'Gestión de Pacientes' y 'Planes de Tratamiento', permitiendo asociar cada transacción a un paciente y a los tratamientos específicos que se están abonando. El sistema utiliza una pasarela de pago externa de primer nivel (como Stripe, Adyen o similar) para garantizar el cumplimiento de la normativa PCI DSS, lo que significa que los datos sensibles de las tarjetas nunca se almacenan en los servidores de la clínica, sino que se manejan a través de tokens seguros. Para el personal de recepción y finanzas, esta página ofrece una interfaz clara para seleccionar las deudas pendientes de un paciente, introducir el monto a pagar, y procesar la transacción en tiempo real. Para el paciente, a través de su portal, proporciona una forma cómoda y autónoma de liquidar sus facturas, mejorando la experiencia del cliente y acelerando el ciclo de cobro de la clínica. La integración con el resto del ERP asegura que, una vez aprobado el pago, el estado de la factura se actualiza automáticamente, el saldo del paciente se ajusta y se genera el recibo correspondiente, manteniendo la contabilidad siempre al día.

## 👥 Roles de Acceso

- Contable / Finanzas
- Recepción / Secretaría
- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/pasarela-pagos-financiacion/`

Toda la lógica de frontend para esta funcionalidad reside dentro de la carpeta '/features/pasarela-pagos-financiacion/'. La subcarpeta '/pages/' contiene los componentes de página principales, como la interfaz para que el personal procese un pago ('ProcesarPagoTarjetaPage.tsx') y la vista del historial para el paciente. La subcarpeta '/components/' alberga componentes reutilizables, como el formulario de tarjeta de crédito ('FormularioPagoTarjeta.tsx'), que se integra con el SDK de la pasarela de pago. Finalmente, la subcarpeta '/apis/' centraliza todas las llamadas al backend relacionadas con los pagos en un archivo como 'pagosApi.ts'.

### Archivos Frontend

- `/features/pasarela-pagos-financiacion/pages/ProcesarPagoTarjetaPage.tsx`
- `/features/pasarela-pagos-financiacion/pages/PortalPacientePagosPage.tsx`
- `/features/pasarela-pagos-financiacion/components/FormularioPagoTarjeta.tsx`
- `/features/pasarela-pagos-financiacion/components/ModalPagoRapidoTratamiento.tsx`
- `/features/pasarela-pagos-financiacion/components/HistorialPagosList.tsx`
- `/features/pasarela-pagos-financiacion/apis/pagosApi.ts`

### Componentes React

- FormularioPagoTarjeta
- SelectorFacturasPendientes
- ResumenPagoDetallado
- ConfirmacionPagoExitoso
- AlertaPagoFallido
- ModalPagoRapidoTratamiento
- HistorialPagosList

## 🔌 APIs Backend

Las APIs para esta funcionalidad están diseñadas para interactuar de forma segura con la pasarela de pagos. El flujo principal implica la creación de un 'intento de pago' en el backend, que devuelve un 'client secret' al frontend. El frontend utiliza este secreto para confirmar el pago directamente con la pasarela. Una vez confirmado, el frontend notifica al backend para que este verifique el estado final y actualice los registros correspondientes en la base de datos.

### `POST` `/api/pagos/crear-intento-pago`

Crea una intención de pago en la pasarela (ej. Stripe). No procesa el pago, solo lo prepara y devuelve un 'client secret' para que el frontend pueda completarlo de forma segura.

**Parámetros:** monto: number, moneda: string, pacienteId: string, facturaIds: [string]

**Respuesta:** { clientSecret: string, pagoId: string }

### `POST` `/api/pagos/confirmar`

Endpoint que el frontend llama después de que la pasarela confirma el pago. El backend verifica el estado del pago con la pasarela usando el ID y, si es exitoso, actualiza el estado del pago, las facturas y el saldo del paciente en la base de datos.

**Parámetros:** pagoId: string, gatewayTransactionId: string

**Respuesta:** { status: 'success', pago: object }

### `GET` `/api/pagos/paciente/:pacienteId`

Obtiene el historial de todos los pagos realizados por un paciente específico.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** [{...pago}, {...pago}]

### `GET` `/api/pagos/:pagoId`

Obtiene los detalles de un pago específico.

**Parámetros:** pagoId (en la URL)

**Respuesta:** {...pago}

## 🗂️ Estructura Backend (MERN)

La estructura del backend se centra en el modelo 'Pago', que registra cada transacción. El 'PagoController' contiene la lógica de negocio para interactuar con la API de la pasarela de pagos y actualizar los modelos de la base de datos. Las rutas en Express exponen esta funcionalidad de manera segura y RESTful.

### Models

#### Pago

paciente: ObjectId, facturas: [ObjectId], monto: Number, moneda: String, metodo: String ('tarjeta_credito', 'tarjeta_debito'), estado: String ('pendiente', 'completado', 'fallido', 'reembolsado'), gateway: String ('stripe', 'adyen'), gatewayTransactionId: String, fecha: Date, notas: String

#### Factura

paciente: ObjectId, tratamientos: [ObjectId], montoTotal: Number, montoPagado: Number, estado: String ('pendiente', 'pagada', 'parcialmente_pagada'), pagos: [ObjectId]

### Controllers

#### PagoController

- crearIntentoDePago
- confirmarPago
- obtenerPagosPorPaciente
- obtenerPagoPorId
- gestionarWebhookPagos

### Routes

#### `/api/pagos`

- POST /crear-intento-pago
- POST /confirmar
- GET /paciente/:pacienteId
- GET /:pagoId

## 🔄 Flujos

1. Flujo de pago en recepción: El recepcionista busca al paciente, visualiza sus facturas pendientes, selecciona las que se van a pagar, introduce el monto, y utiliza el TPV virtual (componente 'FormularioPagoTarjeta') para que el paciente introduzca sus datos. Tras la confirmación, el sistema actualiza la factura y emite un recibo.
2. Flujo de pago en portal del paciente: El paciente inicia sesión en su portal, navega a la sección de 'Facturación y Pagos', ve una lista de sus facturas pendientes, selecciona una o varias para pagar, es dirigido a un formulario de pago seguro, completa la transacción y ve su historial de pagos actualizado inmediatamente.
3. Flujo de consulta de pagos: El personal de finanzas accede al historial de pagos de un paciente para verificar una transacción, ver los detalles (como el ID de la pasarela) y realizar conciliaciones contables.

## 📝 User Stories

- Como recepcionista, quiero procesar un pago con tarjeta de forma rápida y segura desde el perfil del paciente para cobrar tratamientos en el momento y evitar demoras en la clínica.
- Como contable, quiero tener un registro detallado de cada transacción con tarjeta, incluyendo el ID de la pasarela de pago, para poder conciliar los ingresos de la clínica con los extractos bancarios de forma precisa.
- Como paciente, quiero poder pagar mis facturas pendientes online con mi tarjeta de crédito a través del portal de la clínica para gestionar mis finanzas de manera cómoda y en cualquier momento.
- Como administrador de la clínica, quiero que los datos de las tarjetas de los pacientes nunca se almacenen en nuestro sistema para garantizar la máxima seguridad y cumplir con la normativa PCI DSS.

## ⚙️ Notas Técnicas

- Seguridad (PCI DSS): Es imperativo no almacenar, procesar ni transmitir datos completos de tarjetas de crédito en el backend. Se debe utilizar una integración que emplee tokenización, como Stripe Elements o Adyen Drop-in, donde los datos sensibles se envían directamente desde el cliente a la pasarela de pago y el backend solo maneja tokens no sensibles.
- Integración de SDK: El frontend requerirá el SDK de JavaScript de la pasarela de pago elegida (ej. '@stripe/react-stripe-js'). El backend necesitará el SDK de Node.js correspondiente (ej. 'stripe') para crear intentos de pago y verificar transacciones.
- Webhooks: Es altamente recomendable configurar webhooks desde la pasarela de pago hacia un endpoint seguro en el backend. Esto permite manejar eventos asíncronos como confirmaciones de pago, disputas (chargebacks) o reembolsos, asegurando que el estado en el ERP siempre refleje la realidad, incluso si la comunicación con el cliente se interrumpe.
- Manejo de errores: Implementar un sistema robusto para manejar respuestas de la pasarela, como tarjetas declinadas, fondos insuficientes o errores de validación, proporcionando feedback claro al usuario.
- Idempotencia: Las solicitudes de creación de pagos deben ser idempotentes para prevenir cobros duplicados en caso de reintentos por fallos de red. Esto se puede lograr utilizando una clave de idempotencia única por transacción.

