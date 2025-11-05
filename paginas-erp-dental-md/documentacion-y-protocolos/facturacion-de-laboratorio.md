# Facturación de Laboratorio

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad de 'Facturación de Laboratorio' es un componente esencial dentro del ERP dental, diseñada para gestionar de manera integral el ciclo financiero con los laboratorios protésicos externos. Su propósito principal es registrar, controlar y procesar las facturas emitidas por estos proveedores, asegurando un seguimiento exhaustivo de los costes asociados a los trabajos protésicos. Esta página permite al personal financiero y administrativo de la clínica llevar un registro meticuloso de cada factura recibida, asociando cada línea de factura con un trabajo de laboratorio específico, y a su vez, con un paciente y un tratamiento concreto. Esto no solo facilita la gestión de pagos y el control de la tesorería, sino que también es fundamental para calcular la rentabilidad real de los tratamientos que requieren componentes externos. Dentro del módulo padre 'Documentación y Protocolos', esta funcionalidad establece el protocolo financiero y documental para la relación con proveedores clave. El sistema permite digitalizar y centralizar facturas, vincularlas a las órdenes de trabajo previamente generadas en el sistema, verificar la correspondencia entre los trabajos solicitados y los facturados, y gestionar los estados de pago (pendiente, pagada, vencida). Proporciona una visión clara y en tiempo real de la deuda con los laboratorios, las fechas de vencimiento y el historial de pagos, convirtiéndose en una herramienta vital para la planificación financiera y la auditoría interna de la clínica.

## 👥 Roles de Acceso

- Contable / Finanzas
- Protésico / Laboratorio
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Esta funcionalidad se encuentra dentro de la feature 'documentacion-protocolos'. La subcarpeta '/pages/' contiene el componente principal 'FacturacionLaboratorioPage.tsx' que renderiza la interfaz principal. La carpeta '/components/' alberga componentes reutilizables como 'TablaFacturasLaboratorio' para listar las facturas, 'FormularioFacturaLaboratorio' para su creación/edición, y 'ModalDetalleFactura' para visualizar información completa. La lógica de comunicación con el backend se encapsula en funciones dentro de la carpeta '/apis/', que realizan las llamadas a los endpoints RESTful definidos para gestionar las facturas de laboratorio.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/FacturacionLaboratorioPage.tsx`
- `/features/documentacion-protocolos/components/TablaFacturasLaboratorio.tsx`
- `/features/documentacion-protocolos/components/FormularioFacturaLaboratorio.tsx`
- `/features/documentacion-protocolos/components/ModalDetalleFactura.tsx`
- `/features/documentacion-protocolos/components/BuscadorTrabajosLaboratorio.tsx`
- `/features/documentacion-protocolos/components/PanelResumenFacturacionLab.tsx`
- `/features/documentacion-protocolos/apis/facturacionLaboratorioApi.ts`

### Componentes React

- FacturacionLaboratorioPage
- TablaFacturasLaboratorio
- FormularioFacturaLaboratorio
- ModalDetalleFactura
- BuscadorTrabajosLaboratorio
- PanelResumenFacturacionLab
- SelectorEstadoPago

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de las facturas de laboratorio. Permiten realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) y proporcionan endpoints para búsquedas específicas, como la de trabajos de laboratorio aún no facturados, para facilitar su asociación.

### `GET` `/api/lab-invoices`

Obtiene un listado paginado de todas las facturas de laboratorio, con capacidad de filtrado por laboratorio, estado de pago, y rango de fechas.

**Parámetros:** page (number), limit (number), laboratorioId (string, opcional), estado (string, opcional: 'Pendiente', 'Pagada', 'Vencida'), fechaDesde (string, opcional), fechaHasta (string, opcional)

**Respuesta:** Un objeto con un array de facturas y metadatos de paginación.

### `POST` `/api/lab-invoices`

Crea una nueva factura de laboratorio en el sistema.

**Parámetros:** Body (JSON): Objeto con los datos de la factura (numeroFactura, laboratorioId, fechaEmision, fechaVencimiento, items, etc.).

**Respuesta:** El objeto de la factura recién creada.

### `GET` `/api/lab-invoices/:id`

Recupera los detalles completos de una factura de laboratorio específica, incluyendo los trabajos asociados.

**Parámetros:** id (string): ID de la factura.

**Respuesta:** El objeto completo de la factura solicitada.

### `PUT` `/api/lab-invoices/:id`

Actualiza los datos de una factura de laboratorio, comúnmente usado para cambiar el estado de pago, añadir notas o corregir datos.

**Parámetros:** id (string): ID de la factura., Body (JSON): Campos a actualizar.

**Respuesta:** El objeto de la factura actualizada.

### `DELETE` `/api/lab-invoices/:id`

Elimina una factura de laboratorio (preferiblemente un borrado lógico o 'soft delete').

**Parámetros:** id (string): ID de la factura.

**Respuesta:** Mensaje de confirmación de borrado.

### `GET` `/api/lab-jobs/unbilled`

Busca y devuelve trabajos de laboratorio que han sido completados pero aún no están asociados a ninguna factura.

**Parámetros:** laboratorioId (string)

**Respuesta:** Un array de objetos de trabajos de laboratorio sin facturar.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con un modelo MongoDB 'FacturaLaboratorio' que se relaciona con los modelos 'Laboratorio' y 'TrabajoLaboratorio'. Un controlador 'FacturaLaboratorioController' contiene la lógica de negocio, y las rutas definidas en Express exponen esta lógica a través de una API RESTful.

### Models

#### FacturaLaboratorio

numeroFactura: String, laboratorio: { type: Schema.Types.ObjectId, ref: 'Laboratorio' }, clinica: { type: Schema.Types.ObjectId, ref: 'Clinica' }, fechaEmision: Date, fechaVencimiento: Date, items: [{ descripcion: String, trabajo: { type: Schema.Types.ObjectId, ref: 'TrabajoLaboratorio' }, precioUnitario: Number, cantidad: Number }], subtotal: Number, impuestos: Number, total: Number, estado: { type: String, enum: ['Pendiente', 'Pagada', 'Vencida', 'Cancelada'] }, fechaPago: Date, metodoPago: String, notas: String, archivoUrl: String

#### TrabajoLaboratorio

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, tratamiento: { type: Schema.Types.ObjectId, ref: 'Tratamiento' }, laboratorio: { type: Schema.Types.ObjectId, ref: 'Laboratorio' }, coste: Number, fechaCreacion: Date, estado: String

#### Laboratorio

nombre: String, cif: String, direccion: String, contacto: { nombre: String, email: String, telefono: String }

### Controllers

#### FacturaLaboratorioController

- crearFacturaLaboratorio
- obtenerTodasLasFacturas
- obtenerFacturaPorId
- actualizarFactura
- eliminarFactura

#### TrabajoLaboratorioController

- obtenerTrabajosNoFacturadosPorLaboratorio

### Routes

#### `/api/lab-invoices`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id

#### `/api/lab-jobs`

- GET /unbilled

## 🔄 Flujos

1. El usuario Contable accede a la página 'Facturación de Laboratorio' y ve una tabla con las facturas existentes.
2. Para registrar una nueva factura, hace clic en 'Añadir Factura'.
3. En el formulario, selecciona el laboratorio, introduce el número de factura y las fechas clave.
4. Utiliza el buscador de trabajos para encontrar y añadir los trabajos de laboratorio correspondientes a la factura, lo que autocompleta las líneas de detalle y los importes.
5. El sistema calcula automáticamente el subtotal, impuestos y total. El usuario guarda la factura, que se crea con estado 'Pendiente'.
6. Cuando se realiza el pago, el Contable localiza la factura en la tabla, la edita para cambiar su estado a 'Pagada' y registra la fecha y método de pago.
7. El Director de la clínica puede usar los filtros para revisar las facturas pendientes de pago y planificar la tesorería, o generar informes de gastos por laboratorio.

## 📝 User Stories

- Como Contable, quiero registrar fácilmente las facturas de los laboratorios externos asociando los trabajos protésicos específicos para mantener un control de costes preciso.
- Como Director de clínica, quiero visualizar un dashboard con el total de deuda a laboratorios y un listado de facturas vencidas para gestionar eficientemente los pagos.
- Como Protésico, quiero poder consultar si un trabajo que he gestionado ya ha sido incluido en una factura por parte del laboratorio para evitar duplicidades o errores.
- Como Contable, quiero poder filtrar las facturas por laboratorio, estado de pago o rango de fechas para facilitar las conciliaciones bancarias y la contabilidad mensual.
- Como Admin general (multisede), quiero generar un informe de costes por laboratorio para todas las sedes, para poder negociar mejores tarifas basadas en el volumen de trabajo.
- Como Contable, quiero adjuntar el archivo PDF de la factura original al registro en el sistema para tener toda la documentación centralizada y accesible.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un control de acceso basado en roles (RBAC) para asegurar que solo los usuarios autorizados (Contable, Director) puedan crear, modificar o eliminar facturas.
- Rendimiento: La tabla de facturas debe usar paginación del lado del servidor para manejar un gran volumen de datos sin degradar el rendimiento del frontend.
- Atomicidad: Al crear una factura y vincular trabajos, se debe asegurar la consistencia de los datos. Marcar los 'TrabajoLaboratorio' como facturados debe ser parte de la misma transacción de creación de la 'FacturaLaboratorio' usando transacciones de MongoDB.
- Integración: Prever la posibilidad de exportar los datos de facturación en formato CSV o Excel para su importación en software de contabilidad externo.
- Validación de Datos: Aplicar validaciones estrictas tanto en el frontend con librerías como Formik/Yup, como en el backend a nivel de controlador y esquema de Mongoose para garantizar la integridad de los datos financieros.
- Cálculos Monetarios: Utilizar librerías como 'Decimal.js' o manejar los importes en céntimos (enteros) para evitar problemas de precisión con los números de punto flotante en JavaScript.

