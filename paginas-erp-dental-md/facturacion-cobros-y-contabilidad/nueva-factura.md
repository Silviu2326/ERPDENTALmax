# Nueva Factura

**Categoría:** Gestión Financiera | **Módulo:** Facturación, Cobros y Contabilidad

La página 'Nueva Factura' es un componente central del módulo de 'Facturación, Cobros y Contabilidad', diseñada para permitir la creación, gestión y emisión de facturas a pacientes por los servicios y tratamientos dentales recibidos. Su principal objetivo es convertir los actos clínicos registrados en el historial del paciente en un documento contable oficial. Esta funcionalidad es vital para la salud financiera de la clínica, ya que formaliza el proceso de cobro, asegura el seguimiento de los ingresos y garantiza el cumplimiento fiscal. El proceso se inicia seleccionando un paciente, tras lo cual el sistema puede cargar automáticamente los tratamientos realizados que aún no han sido facturados, minimizando errores manuales y agilizando el trabajo del personal administrativo. El usuario puede revisar, añadir, modificar o eliminar conceptos de la factura, aplicar descuentos, gestionar diferentes tipos de impuestos (IVA) y añadir notas aclaratorias. Una vez completada, la factura se genera con un número secuencial único, se guarda en el sistema vinculada al paciente y queda lista para ser impresa, enviada por correo electrónico o marcada como pagada. Esta página se integra directamente con los módulos de 'Gestión de Pacientes' y 'Plan de Tratamiento', obteniendo datos de ambos para construir un documento preciso y completo, sirviendo como puente entre la operación clínica y la gestión administrativa-financiera.

## 👥 Roles de Acceso

- Recepción / Secretaría
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/facturacion-cobros-contabilidad/`

La funcionalidad 'Nueva Factura' se encuentra dentro del módulo 'facturacion-cobros-contabilidad'. La página principal, 'NuevaFacturaPage.tsx', reside en la subcarpeta '/pages'. Esta página ensambla varios componentes reutilizables desde '/components/', como 'FormularioNuevaFactura.tsx' que contiene toda la lógica del formulario, 'SelectorPacienteFactura.tsx' para la búsqueda y selección de pacientes, y 'TablaConceptosFactura.tsx' para gestionar los ítems de la factura. Las llamadas al backend se abstraen en un archivo dentro de '/apis/', como 'facturacionApi.ts', que exporta funciones como 'crearFactura' o 'buscarPaciente'.

### Archivos Frontend

- `/features/facturacion-cobros-contabilidad/pages/NuevaFacturaPage.tsx`
- `/features/facturacion-cobros-contabilidad/components/FormularioNuevaFactura.tsx`
- `/features/facturacion-cobros-contabilidad/components/SelectorPacienteFactura.tsx`
- `/features/facturacion-cobros-contabilidad/components/TablaConceptosFactura.tsx`
- `/features/facturacion-cobros-contabilidad/components/ResumenTotalesFactura.tsx`
- `/features/facturacion-cobros-contabilidad/apis/facturacionApi.ts`

### Componentes React

- FormularioNuevaFactura
- SelectorPacienteFactura
- TablaConceptosFactura
- ResumenTotalesFactura
- ModalConfirmacionEmision

## 🔌 APIs Backend

Se necesitan varios endpoints para soportar la creación de una factura. Primero, un endpoint para buscar pacientes. Segundo, uno para obtener los tratamientos de un paciente que están pendientes de facturación. Un tercero para obtener la configuración fiscal de la clínica (ej. tipos de IVA). Finalmente, el endpoint principal para recibir los datos de la nueva factura y crearla en la base de datos.

### `GET` `/api/pacientes/buscar`

Busca pacientes por nombre, apellidos o DNI para asociarlos a la factura. Utiliza debounce en el frontend para optimizar.

**Parámetros:** query: q (string)

**Respuesta:** Array de objetos de pacientes simplificados [{ id, nombreCompleto, dni }]

### `GET` `/api/tratamientos/pendientes/:pacienteId`

Obtiene la lista de tratamientos completados para un paciente específico que aún no han sido facturados.

**Parámetros:** path: pacienteId (string)

**Respuesta:** Array de objetos de tratamientos [{ id, descripcion, precio, fechaRealizacion }]

### `GET` `/api/configuracion/fiscal`

Recupera la configuración fiscal de la clínica, como los tipos de IVA aplicables, para el cálculo automático de impuestos.

**Respuesta:** Objeto de configuración { tiposIva: [...], datosClinica: {...} }

### `POST` `/api/facturas`

Crea una nueva factura en el sistema. Asigna un número de factura secuencial, actualiza el estado de los tratamientos a 'Facturado' y guarda el registro.

**Parámetros:** body: { pacienteId, fechaEmision, conceptos: [...], subtotal, impuestos, total, notas }

**Respuesta:** Objeto de la factura recién creada.

## 🗂️ Estructura Backend (MERN)

El backend utiliza el modelo 'Factura' para almacenar todos los datos del documento. El 'FacturaController' contiene la lógica de negocio, incluyendo la validación de datos, la obtención de un número de factura único mediante un modelo 'Contador', y la actualización de los modelos 'Tratamiento' relacionados. Las rutas se definen en un archivo de rutas específico para la facturación.

### Models

#### Factura

numeroFactura: String (único, indexado), paciente: ObjectId (ref: 'Paciente'), fechaEmision: Date, fechaVencimiento: Date, conceptos: [{ descripcion: String, cantidad: Number, precioUnitario: Number, tipoImpuesto: String, total: Number }], subtotal: Number, impuestos: Number, total: Number, estado: String ('Borrador', 'Emitida', 'Pagada', 'Anulada'), notas: String, serieFactura: String

#### Contador

_id: String (ej: 'factura_serie_A'), secuencia: Number. Usado para generar números de factura secuenciales de forma atómica.

#### Tratamiento

paciente: ObjectId, descripcion: String, precio: Number, estadoFacturacion: String ('Pendiente', 'Facturado')

### Controllers

#### FacturaController

- crearFactura
- obtenerSiguienteNumeroFactura
- validarDatosFactura

#### PacienteController

- buscarPacientes

#### TratamientoController

- obtenerTratamientosPendientesPorPaciente

### Routes

#### `/api/facturas`

- POST /

#### `/api/pacientes`

- GET /buscar

#### `/api/tratamientos`

- GET /pendientes/:pacienteId

## 🔄 Flujos

1. El usuario de recepción accede a 'Nueva Factura' desde el menú de Facturación.
2. En el formulario, utiliza el campo de búsqueda para encontrar al paciente. El sistema muestra sugerencias en tiempo real.
3. Al seleccionar un paciente, el sistema carga sus datos fiscales y busca automáticamente tratamientos completados pendientes de facturar.
4. El usuario selecciona los tratamientos a incluir en la factura. Los conceptos se añaden a la tabla de la factura con sus precios.
5. El usuario puede añadir conceptos manuales (ej. venta de un producto) o aplicar un descuento global o por línea.
6. El sistema recalcula en tiempo real el subtotal, los impuestos y el total a medida que se realizan cambios.
7. Una vez revisada, el usuario pulsa 'Emitir Factura'. El sistema valida los datos, asigna un número de factura único y la guarda.
8. El sistema confirma la creación y ofrece opciones como imprimir en PDF, enviar por email al paciente o registrar un pago.

## 📝 User Stories

- Como personal de recepción, quiero crear una factura rápidamente buscando a un paciente y seleccionando los tratamientos que se le acaban de realizar, para poder cobrarle antes de que se vaya de la clínica.
- Como contable, quiero que el sistema calcule automáticamente los impuestos correctos según la configuración fiscal de la clínica para garantizar el cumplimiento de la normativa tributaria.
- Como personal de secretaría, quiero poder añadir un descuento a una factura para un paciente específico según lo acordado con el doctor.
- Como recepcionista, quiero que al generar una factura, los tratamientos incluidos se marquen como 'Facturado' para evitar que se cobren dos veces por error.
- Como contable, quiero que todas las facturas tengan un número correlativo y único para mantener un registro contable ordenado y auditable.

## ⚙️ Notas Técnicas

- Seguridad: Implementar RBAC (Role-Based Access Control) para que solo los roles autorizados puedan crear o modificar facturas. Validar todos los datos en el backend para prevenir manipulaciones.
- Atomicidad: La creación de una factura y la actualización del estado de los tratamientos asociados debe realizarse dentro de una transacción de MongoDB para garantizar la consistencia de los datos.
- Numeración de facturas: Utilizar un modelo 'Contador' y la operación 'findOneAndUpdate' con la opción 'upsert' y 'new' para garantizar la generación de números de factura únicos y secuenciales, incluso con peticiones concurrentes.
- PDF y Email: Integrar una librería como 'pdf-lib' en el backend para generar el archivo PDF de la factura. Utilizar un servicio de email transaccional como SendGrid o Mailgun para el envío de facturas a pacientes.
- Rendimiento del Frontend: Utilizar librerías de gestión de estado como Redux Toolkit o Zustand para manejar el estado complejo del formulario de factura. Implementar memoización en componentes de la tabla de conceptos para evitar re-renderizados innecesarios.

