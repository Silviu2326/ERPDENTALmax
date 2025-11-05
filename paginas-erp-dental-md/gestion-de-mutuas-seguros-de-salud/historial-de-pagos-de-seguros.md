# Historial de Pagos de Seguros

**Categoría:** Gestión Financiera | **Módulo:** Gestión de Mutuas/Seguros de Salud

La página 'Historial de Pagos de Seguros' es una herramienta financiera crítica dentro del ERP dental, diseñada para proporcionar un control exhaustivo y una visión clara de todos los ingresos provenientes de las aseguradoras. Su función principal es registrar, visualizar y gestionar los pagos que las mutuas de salud realizan a la clínica por los tratamientos cubiertos a sus asegurados. Esta funcionalidad permite al personal financiero conciliar las cuentas, rastrear el estado de las reclamaciones enviadas y asegurar que la clínica recibe la compensación correcta y a tiempo. Funciona como un libro de contabilidad digital especializado en seguros, mostrando una lista detallada de cada transacción, incluyendo la aseguradora, el monto total del pago, la fecha de recepción, y una referencia. Más importante aún, cada pago se puede desglosar para ver qué reclamaciones específicas de pacientes han sido cubiertas, permitiendo una conciliación precisa a nivel de tratamiento individual. Al integrarse con los módulos de Pacientes y Tratamientos, esta página ayuda a identificar rápidamente reclamaciones impagadas, pagadas parcialmente o rechazadas, facilitando el seguimiento proactivo y reduciendo la pérdida de ingresos. Para un director o administrador, ofrece una visión macro del flujo de caja proveniente de las mutuas, esencial para la toma de decisiones estratégicas y la evaluación de la rentabilidad de los convenios con diferentes aseguradoras.

## 👥 Roles de Acceso

- Contable / Finanzas
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-mutuas-seguros/`

Esta funcionalidad reside dentro de la feature 'gestion-mutuas-seguros'. La página principal se define en '/pages/HistorialPagosSeguroPage.tsx', que actúa como el contenedor principal. Esta página utiliza componentes reutilizables de la carpeta '/components/', como 'TablaPagosSeguro' para mostrar los datos y 'FiltrosHistorialPagos' para la búsqueda y filtrado. Todas las interacciones con el backend se gestionan a través de funciones definidas en '/apis/pagosSeguroApi.ts', que encapsulan las llamadas a los endpoints correspondientes, manteniendo la lógica de la vista separada de la comunicación con el servidor.

### Archivos Frontend

- `/features/gestion-mutuas-seguros/pages/HistorialPagosSeguroPage.tsx`
- `/features/gestion-mutuas-seguros/components/TablaPagosSeguro.tsx`
- `/features/gestion-mutuas-seguros/components/FiltrosHistorialPagos.tsx`
- `/features/gestion-mutuas-seguros/components/ModalDetallePagoSeguro.tsx`
- `/features/gestion-mutuas-seguros/apis/pagosSeguroApi.ts`

### Componentes React

- HistorialPagosSeguroPage
- TablaPagosSeguro
- FiltrosHistorialPagos
- ModalDetallePagoSeguro
- FilaPagoSeguro

## 🔌 APIs Backend

Las APIs para esta página se centran en la gestión de registros de pagos de seguros. Se necesita un endpoint principal para obtener una lista paginada y filtrable de todos los pagos, un endpoint para obtener los detalles de un pago específico (incluyendo las reclamaciones asociadas), y endpoints para registrar, actualizar y anular pagos, asegurando la integridad de los datos financieros.

### `GET` `/api/seguros-pagos`

Obtiene una lista paginada y filtrada de los pagos recibidos de las aseguradoras.

**Parámetros:** query.page: number (página actual), query.limit: number (elementos por página), query.fechaInicio: string (formato YYYY-MM-DD), query.fechaFin: string (formato YYYY-MM-DD), query.idAseguradora: string (ID de la aseguradora), query.estado: string ('conciliado', 'parcial', 'pendiente'), query.sortBy: string (campo de ordenación)

**Respuesta:** Un objeto con la lista de pagos y metadatos de paginación: { data: [PagoSeguro], totalPages, currentPage, totalCount }

### `GET` `/api/seguros-pagos/{id}`

Obtiene los detalles completos de un pago específico, incluyendo las reclamaciones individuales que cubre.

**Parámetros:** params.id: string (ID del pago)

**Respuesta:** Un objeto JSON con los datos del pago y un array populado de las reclamaciones asociadas.

### `POST` `/api/seguros-pagos`

Registra un nuevo pago recibido de una aseguradora. Actualiza el estado de las reclamaciones asociadas.

**Parámetros:** body.idAseguradora: string, body.montoTotal: number, body.fechaPago: string (date), body.metodoPago: string ('transferencia', 'cheque', 'otro'), body.referencia: string, body.reclamacionesCubiertas: [{ idReclamacion: string, montoAplicado: number }]

**Respuesta:** El objeto del nuevo pago creado.

### `PUT` `/api/seguros-pagos/{id}`

Actualiza la información de un pago existente. Usado para correcciones.

**Parámetros:** params.id: string, body: { ... campos a actualizar ... }

**Respuesta:** El objeto del pago actualizado.

## 🗂️ Estructura Backend (MERN)

El backend utiliza el patrón MVC. Las rutas en '/routes/pagoSeguroRoutes.js' definen los endpoints. Cada ruta invoca una función en '/controllers/pagoSeguroController.js', que contiene la lógica de negocio (validaciones, interacción con la base de datos). La estructura de los datos se define en el modelo '/models/PagoSeguro.js', que utiliza Mongoose para interactuar con la colección 'pagosseguros' en MongoDB. Este modelo tiene referencias a otros modelos como 'Aseguradora' y 'Reclamacion' para mantener la integridad relacional de los datos.

### Models

#### PagoSeguro

idAseguradora: ObjectId (ref: 'Aseguradora'), montoTotal: Number, fechaPago: Date, metodoPago: String, referencia: String, estado: String ('conciliado', 'pendiente'), reclamacionesCubiertas: [{ idReclamacion: ObjectId (ref: 'Reclamacion'), montoAplicado: Number }], clinica: ObjectId (ref: 'Clinica'), creadoPor: ObjectId (ref: 'Usuario')

#### Reclamacion

Referenciado por PagoSeguro. Campos relevantes: idPaciente, idTratamiento, montoReclamado, montoPagado, estado: String ('enviada', 'pagada', 'rechazada', 'pagada_parcialmente')

#### Aseguradora

Referenciado por PagoSeguro. Campos relevantes: nombreComercial, cif, datosContacto

### Controllers

#### pagoSeguroController

- getAllPagos
- getPagoById
- createPago
- updatePago

### Routes

#### `/api/seguros-pagos`

- GET /
- GET /:id
- POST /
- PUT /:id

## 🔄 Flujos

1. El contable accede a la página 'Historial de Pagos de Seguros' y ve una lista de los pagos más recientes ordenados por fecha.
2. Utiliza los filtros para buscar todos los pagos de una aseguradora específica en el último trimestre.
3. El sistema realiza una llamada a `GET /api/seguros-pagos` con los parámetros de filtro y actualiza la tabla con los resultados.
4. El contable hace clic en un pago para abrir un modal con los detalles, verificando qué reclamaciones de pacientes fueron cubiertas y los montos aplicados a cada una.
5. Al recibir una nueva transferencia de una aseguradora, el contable hace clic en 'Registrar Nuevo Pago', completa el formulario asociando el pago a las reclamaciones pendientes y guarda el registro.
6. El sistema ejecuta `POST /api/seguros-pagos`, crea el nuevo registro de pago y actualiza el estado de las reclamaciones a 'pagada' o 'pagada_parcialmente'.

## 📝 User Stories

- Como Contable, quiero ver un listado de todos los pagos recibidos de las aseguradoras para poder conciliar nuestras cuentas bancarias.
- Como Contable, quiero filtrar los pagos por aseguradora y rango de fechas para generar informes de ingresos por mutua.
- Como Director, quiero ver un resumen de los pagos de seguros para evaluar qué aseguradoras son más rentables y puntuales en sus pagos.
- Como Contable, quiero registrar un nuevo pago de una aseguradora y asociarlo a múltiples reclamaciones de pacientes para mantener actualizado el estado de las cuentas por cobrar.
- Como Contable, quiero hacer clic en un pago y ver un desglose detallado de las reclamaciones cubiertas para verificar que los montos coinciden con lo facturado.

## ⚙️ Notas Técnicas

- Seguridad: Implementar RBAC (Role-Based Access Control) a nivel de API para asegurar que solo los roles 'Contable / Finanzas' y 'Director / Admin general' puedan acceder a esta información financiera sensible. Todas las operaciones de escritura (POST, PUT) deben ser auditadas.
- Rendimiento: Utilizar paginación server-side y crear índices en la base de datos MongoDB sobre los campos `fechaPago`, `idAseguradora` y `clinica` en la colección `PagoSeguro` para optimizar las consultas de filtrado.
- Integridad de Datos: Al registrar un nuevo pago (POST), utilizar transacciones de MongoDB para garantizar que la creación del documento 'PagoSeguro' y la actualización de los documentos 'Reclamacion' asociados se realicen de forma atómica.
- UX: La interfaz debe permitir la exportación de la vista filtrada a formatos CSV y PDF para facilitar la creación de informes externos.
- Multisede: El sistema debe filtrar automáticamente los pagos por la clínica a la que pertenece el usuario, a menos que el rol sea 'Director / Admin general (multisede)', que podrá filtrar por clínica o ver los datos consolidados.

