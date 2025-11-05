# Liquidación de Mutuas/Seguros

**Categoría:** Gestión Financiera | **Módulo:** Facturación, Cobros y Contabilidad

La funcionalidad de 'Liquidación de Mutuas/Seguros' es un componente crítico dentro del módulo de 'Facturación, Cobros y Contabilidad'. Su propósito principal es automatizar y simplificar el proceso de facturación y cobro a las compañías de seguros y mutuas con las que la clínica dental tiene convenios. Esta herramienta permite al personal administrativo y financiero agrupar todos los tratamientos cubiertos por una aseguradora específica dentro de un período determinado, generando un documento de liquidación formal. Este documento detalla cada prestación realizada, el paciente atendido, la fecha y el importe que la mutua debe abonar. El sistema calcula automáticamente los totales, minimizando errores humanos y ahorrando una cantidad significativa de tiempo. Una vez generada la liquidación, el sistema mantiene un registro del estado de la misma (pendiente, enviada, pagada, pagada parcialmente), facilitando el seguimiento de los cobros pendientes. Cuando la aseguradora realiza el pago, el personal puede conciliarlo en el sistema, marcando los tratamientos como pagados y cerrando el ciclo de cobro. Esta funcionalidad proporciona una visión clara y actualizada de los ingresos pendientes de las aseguradoras, mejorando el flujo de caja y el control financiero de la clínica. Es el puente esencial entre los servicios clínicos prestados y la efectiva recepción de ingresos por parte de terceros pagadores.

## 👥 Roles de Acceso

- Contable / Finanzas
- Recepción / Secretaría
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/facturacion-cobros-contabilidad/`

Esta funcionalidad se encuentra dentro de la feature 'facturacion-cobros-contabilidad'. La página principal estará en '/pages/LiquidacionMutuasPage.tsx', que actuará como el contenedor principal. Esta página utilizará componentes reutilizables de la carpeta '/components/' como 'FiltroLiquidacion' para la selección de mutua y fechas, 'TablaTratamientosPendientes' para mostrar los tratamientos a liquidar, y 'HistorialLiquidaciones' para ver liquidaciones pasadas. Las llamadas a la API del backend se gestionarán a través de funciones definidas en la carpeta '/apis/liquidacionesApi.ts'.

### Archivos Frontend

- `/features/facturacion-cobros-contabilidad/pages/LiquidacionMutuasPage.tsx`
- `/features/facturacion-cobros-contabilidad/components/FiltroLiquidacion.tsx`
- `/features/facturacion-cobros-contabilidad/components/TablaTratamientosPendientes.tsx`
- `/features/facturacion-cobros-contabilidad/components/ResumenLiquidacion.tsx`
- `/features/facturacion-cobros-contabilidad/components/HistorialLiquidaciones.tsx`
- `/features/facturacion-cobros-contabilidad/components/ModalConciliarPago.tsx`
- `/features/facturacion-cobros-contabilidad/apis/liquidacionesApi.ts`

### Componentes React

- FiltroLiquidacion
- TablaTratamientosPendientes
- ResumenLiquidacion
- HistorialLiquidaciones
- ModalConciliarPago
- BotonGenerarPDFLiquidacion

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan la obtención de datos para generar liquidaciones, la creación de estas, su seguimiento y su conciliación final. Se centran en agregar tratamientos no liquidados y actualizar su estado de forma transaccional.

### `GET` `/api/liquidaciones/tratamientos-pendientes`

Obtiene una lista de todos los tratamientos cubiertos por una mutua específica en un rango de fechas que aún no han sido incluidos en ninguna liquidación.

**Parámetros:** query.mutuaId: string (ID de la mutua), query.fechaDesde: string (ISO Date), query.fechaHasta: string (ISO Date)

**Respuesta:** Array de objetos de Tratamiento con detalles del paciente y la prestación.

### `POST` `/api/liquidaciones`

Crea un nuevo registro de liquidación. Recibe una lista de IDs de tratamientos y genera el documento de liquidación, actualizando el estado de dichos tratamientos.

**Parámetros:** body.mutuaId: string, body.fechaDesde: string, body.fechaHasta: string, body.tratamientoIds: [string]

**Respuesta:** Objeto de la nueva Liquidacion creada.

### `GET` `/api/liquidaciones`

Obtiene un historial paginado de todas las liquidaciones generadas, permitiendo filtrar por mutua o estado.

**Parámetros:** query.page: number, query.limit: number, query.mutuaId: string (opcional), query.estado: string (opcional: 'pendiente', 'enviada', 'conciliada')

**Respuesta:** Objeto con un array de Liquidaciones y metadatos de paginación.

### `GET` `/api/liquidaciones/:id`

Obtiene los detalles completos de una liquidación específica, incluyendo la lista de tratamientos asociados.

**Parámetros:** params.id: string (ID de la liquidación)

**Respuesta:** Objeto de la Liquidacion con los tratamientos populados.

### `PUT` `/api/liquidaciones/:id/conciliar`

Marca una liquidación como conciliada (pagada). Registra la fecha del pago, el importe recibido y la referencia. Actualiza el estado de la liquidación.

**Parámetros:** params.id: string (ID de la liquidación), body.fechaPago: string (ISO Date), body.importePagado: number, body.referencia: string (opcional), body.notas: string (opcional)

**Respuesta:** Objeto de la Liquidacion actualizada.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo principal 'Liquidacion' que agrupa referencias a múltiples 'Tratamiento'. El 'LiquidacionController' contiene la lógica para agregar, crear y actualizar estas liquidaciones, interactuando con los modelos 'Tratamiento' y 'Mutua'. Las rutas se definen en un archivo dedicado para mantener el código organizado y seguir las convenciones RESTful.

### Models

#### Liquidacion

mutua: ObjectId (ref: 'Mutua'), codigo: String (autogenerado, ej: LIQ-2024-001), fechaCreacion: Date, fechaDesde: Date, fechaHasta: Date, tratamientos: [ObjectId (ref: 'Tratamiento')], importeTotal: Number, importePagado: Number, fechaPago: Date, estado: String ('pendiente', 'enviada', 'conciliada', 'parcial'), notas: String

#### Tratamiento

paciente: ObjectId (ref: 'Paciente'), fecha: Date, prestacion: ObjectId (ref: 'Prestacion'), mutua: ObjectId (ref: 'Mutua'), importeTotal: Number, importePaciente: Number, importeMutua: Number, estadoLiquidacion: String ('pendiente', 'liquidado'), liquidacionId: ObjectId (ref: 'Liquidacion', opcional)

#### Mutua

nombre: String, cif: String, direccion: Object, datosContacto: Object, baremos: [Object]

### Controllers

#### LiquidacionController

- getTratamientosPendientes
- createLiquidacion
- getAllLiquidaciones
- getLiquidacionById
- conciliarLiquidacion

### Routes

#### `/api/liquidaciones`

- GET /tratamientos-pendientes
- POST /
- GET /
- GET /:id
- PUT /:id/conciliar

## 🔄 Flujos

1. El usuario (Contable) navega a la sección de 'Liquidación de Mutuas'.
2. Utiliza los filtros para seleccionar una mutua (ej: 'Adeslas') y un rango de fechas (ej: '01/01/2024' al '31/01/2024').
3. El sistema realiza una llamada a la API para buscar todos los tratamientos de esa mutua en ese rango de fechas con estado de liquidación 'pendiente'.
4. La interfaz muestra una tabla con los tratamientos encontrados y un resumen con el número de tratamientos y el importe total a liquidar.
5. El usuario selecciona los tratamientos que desea incluir (por defecto, todos) y hace clic en 'Generar Liquidación'.
6. El sistema crea un nuevo documento 'Liquidacion', asocia los tratamientos seleccionados y actualiza su estado a 'liquidado'.
7. Se ofrece la opción de descargar un PDF o Excel con el detalle de la liquidación para enviar a la mutua.
8. Semanas después, al recibir el pago, el usuario busca la liquidación en el historial, la abre y hace clic en 'Conciliar Pago'.
9. Introduce la fecha e importe del pago y confirma. El sistema actualiza el estado de la liquidación a 'conciliada'.

## 📝 User Stories

- Como Contable, quiero filtrar tratamientos por mutua y rango de fechas para poder agruparlos y generar una única liquidación.
- Como personal de Finanzas, quiero generar un documento PDF detallado de la liquidación para enviarlo a la compañía de seguros y solicitar el pago.
- Como Director de clínica, quiero ver un historial de todas las liquidaciones y su estado (pendiente, conciliada) para tener una visión clara de los cobros pendientes de las aseguradoras.
- Como Recepcionista, quiero poder verificar rápidamente si un tratamiento específico de un paciente ya ha sido incluido en una liquidación para no facturárselo por error al paciente.
- Como Contable, quiero poder conciliar un pago recibido de una mutua con una liquidación existente para mantener la contabilidad al día y cerrar el ciclo de cobro.

## ⚙️ Notas Técnicas

- Seguridad: Implementar RBAC (Role-Based Access Control) a nivel de API para asegurar que solo los roles autorizados puedan crear o modificar liquidaciones.
- Rendimiento: La consulta para obtener tratamientos pendientes puede ser intensiva. Asegurar que los campos 'mutua', 'fecha' y 'estadoLiquidacion' en el modelo 'Tratamiento' estén correctamente indexados en MongoDB.
- Transaccionalidad: La creación de una liquidación debe ser una operación atómica. Utilizar transacciones de MongoDB para garantizar que la creación del documento 'Liquidacion' y la actualización de los múltiples documentos 'Tratamiento' se completen con éxito o fallen juntas, evitando inconsistencias en los datos.
- Generación de Documentos: La generación de PDFs o Excel debe realizarse preferiblemente en el backend para no sobrecargar el cliente y para tener plantillas estandarizadas. Librerías como 'pdfkit' para PDF y 'exceljs' para Excel en Node.js son opciones recomendadas.
- Concurrencia: Se debe implementar un mecanismo para prevenir que dos usuarios generen una liquidación con los mismos tratamientos simultáneamente. Esto se puede lograr verificando el 'estadoLiquidacion' de cada tratamiento dentro de la transacción.

