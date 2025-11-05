# Editar Factura

**Categoría:** Gestión Financiera | **Módulo:** Facturación, Cobros y Contabilidad

La funcionalidad 'Editar Factura' es un componente crítico dentro del módulo de 'Facturación, Cobros y Contabilidad' del ERP dental. Su propósito principal es permitir a usuarios autorizados, como el personal de contabilidad o recepción, modificar facturas existentes antes de que sean cerradas o pagadas. Esta capacidad es esencial para corregir errores humanos, como la asignación incorrecta de un tratamiento, precios equivocados, cantidades inexactas, o para aplicar descuentos y ajustes post-generación. La página presenta un formulario pre-rellenado con todos los datos de la factura seleccionada: información del paciente, fecha de emisión, número de factura, y una lista detallada de los ítems (tratamientos y productos) con su descripción, cantidad, precio unitario, descuentos e impuestos. El usuario puede modificar la mayoría de estos campos. A medida que se realizan cambios, como añadir un nuevo tratamiento o ajustar la cantidad de uno existente, el sistema recalcula automáticamente los subtotales, impuestos y el total general en tiempo real, proporcionando una experiencia de usuario fluida e inmediata. La importancia de esta funcionalidad radica en su capacidad para mantener la precisión financiera, evitando la necesidad de anular y rehacer facturas por errores menores, lo que agiliza el flujo de trabajo administrativo. Para garantizar la integridad y la trazabilidad, cada modificación guardada se registra en un historial de auditoría asociado a la factura, documentando quién hizo el cambio, cuándo y qué se modificó. Esto es fundamental para la transparencia contable y la resolución de posibles discrepancias futuras.

## 👥 Roles de Acceso

- Contable / Finanzas
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/facturacion-cobros-contabilidad/`

Esta funcionalidad se encuentra dentro de la feature 'facturacion-cobros-contabilidad'. La página principal para la edición se define en la subcarpeta '/pages'. Esta página utiliza múltiples componentes reutilizables de la carpeta '/components' para construir la interfaz, como un formulario para la cabecera, una tabla editable para los ítems y un panel de resumen de totales. Las llamadas al backend para obtener los datos de la factura y para guardar las actualizaciones se gestionan a través de funciones definidas en la carpeta '/apis'.

### Archivos Frontend

- `/features/facturacion-cobros-contabilidad/pages/EditarFacturaPage.tsx`

### Componentes React

- FormularioEdicionFactura
- CabeceraFacturaEditable
- ListaItemsFacturaEditable
- FilaItemFacturaEditable
- ModalBusquedaTratamientos
- ResumenTotalesFactura
- HistorialCambiosFactura

## 🔌 APIs Backend

Se necesitan varios endpoints para soportar la edición de facturas. El principal es para obtener los datos completos de una factura específica para poblar el formulario. El segundo, y más crucial, es el endpoint PUT para enviar los datos actualizados al servidor. Adicionalmente, se requieren endpoints de búsqueda para que el usuario pueda añadir nuevos tratamientos o productos a la factura de forma interactiva.

### `GET` `/api/facturas/:id`

Obtiene los detalles completos de una factura específica, incluyendo los datos del paciente y la descripción de los tratamientos.

**Parámetros:** id (string): ID de la factura a obtener.

**Respuesta:** Un objeto JSON con los datos completos de la factura.

### `PUT` `/api/facturas/:id`

Actualiza una factura existente con los nuevos datos proporcionados. El backend debe validar los datos, recalcular los totales y registrar la modificación en el historial de auditoría.

**Parámetros:** id (string): ID de la factura a actualizar., Body (JSON): Objeto con los campos de la factura que se han modificado.

**Respuesta:** El objeto JSON de la factura actualizada.

### `GET` `/api/tratamientos/buscar`

Busca tratamientos o productos por nombre o código para añadirlos a la factura.

**Parámetros:** query (string): Término de búsqueda.

**Respuesta:** Un array de objetos de tratamiento que coinciden con la búsqueda.

## 🗂️ Estructura Backend (MERN)

La lógica del backend se centra en el modelo 'Factura', que contiene toda la información financiera y un historial de cambios. El 'FacturaController' maneja la lógica de negocio para obtener y actualizar las facturas, asegurando que se apliquen las reglas de negocio (p. ej., no editar facturas pagadas) y que se mantenga la integridad de los datos. Las rutas se definen en el archivo de rutas de facturas para exponer los endpoints de la API.

### Models

#### Factura

paciente: ObjectId (ref: 'Paciente'), numeroFactura: String, fechaEmision: Date, items: [{ tratamiento: ObjectId (ref: 'Tratamiento'), descripcion: String, cantidad: Number, precioUnitario: Number, descuento: Number, impuesto: Number, totalItem: Number }], subtotal: Number, totalImpuestos: Number, totalDescuentos: Number, total: Number, estado: String ('borrador', 'emitida', 'pagada', 'anulada'), historialCambios: [{ usuario: ObjectId (ref: 'Usuario'), fecha: Date, campo: String, valorAnterior: String, valorNuevo: String }]

### Controllers

#### FacturaController

- obtenerFacturaPorId
- actualizarFactura

### Routes

#### `/api/facturas`

- GET /:id
- PUT /:id

## 🔄 Flujos

1. El usuario (Contable o Recepcionista) localiza una factura en estado 'borrador' o 'emitida' y selecciona la opción 'Editar'.
2. El sistema carga la página 'Editar Factura', realizando una llamada GET a '/api/facturas/:id' para obtener y mostrar los datos actuales.
3. El usuario modifica los campos necesarios: cambia la cantidad de un tratamiento, añade un nuevo ítem buscándolo a través del 'ModalBusquedaTratamientos', o aplica un descuento.
4. La interfaz recalcula y actualiza los totales en tiempo real con cada cambio.
5. Una vez finalizadas las modificaciones, el usuario hace clic en 'Guardar Cambios'.
6. El frontend envía una petición PUT a '/api/facturas/:id' con el objeto de factura completo y actualizado.
7. El backend valida los datos, verifica los permisos del usuario y el estado de la factura, recalcula los totales para garantizar la consistencia, guarda los cambios en la base de datos y añade una entrada al 'historialCambios'.
8. El sistema muestra una notificación de éxito y redirige al usuario a la vista de detalle de la factura actualizada.

## 📝 User Stories

- Como recepcionista, quiero poder corregir la cantidad de un tratamiento en una factura emitida pero no pagada para rectificar un error de entrada de datos.
- Como contable, quiero añadir un descuento a un ítem específico de una factura para reflejar un acuerdo con el paciente antes de que realice el pago.
- Como personal de finanzas, quiero poder modificar la fecha de vencimiento de una factura para ofrecer flexibilidad de pago a un paciente.
- Como recepcionista, quiero añadir un producto (ej. un cepillo de dientes especial) a una factura ya creada que contiene tratamientos dentales, para unificar el cobro.
- Como contable, quiero que cada cambio que realice en una factura quede registrado para poder realizar auditorías y mantener la transparencia financiera de la clínica.

## ⚙️ Notas Técnicas

- Seguridad y Auditoría: Es imperativo que el endpoint PUT '/api/facturas/:id' registre cada cambio en un subdocumento o colección de auditoría. Debe guardarse el ID del usuario, la fecha, el campo modificado, el valor anterior y el valor nuevo.
- Control de Estado: La lógica del backend debe implementar una máquina de estados para las facturas. Por ejemplo, una factura con estado 'pagada' o 'anulada' no debería ser editable, o solo por un rol con privilegios de administrador, generando alertas especiales.
- Cálculos Server-Side: Aunque el frontend realice cálculos de totales para mejorar la UX, el backend DEBE recalcular todos los montos (subtotal, impuestos, total) antes de guardar para prevenir la manipulación de datos desde el cliente y asegurar la integridad financiera.
- Transacciones Atómicas: La actualización de una factura y la creación de su correspondiente registro de auditoría deberían estar envueltas en una transacción de MongoDB para garantizar la atomicidad. Si una operación falla, ambas se revierten.
- Manejo de Concurrencia: Implementar un mecanismo de bloqueo optimista (ej. usando un campo de versión `__v` en el esquema de Mongoose) para evitar que dos usuarios editen la misma factura simultáneamente y uno sobrescriba los cambios del otro.
- Validación de Datos: Utilizar librerías como Joi o express-validator en el backend para validar rigurosamente los datos entrantes en la petición PUT, asegurando que los tipos de datos y los formatos sean correctos.

