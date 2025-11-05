# Garantías y Contratos de Servicio

**Categoría:** Gestión de Recursos | **Módulo:** Mantenimiento y Equipamiento

La funcionalidad 'Garantías y Contratos de Servicio' es una herramienta esencial dentro del módulo 'Mantenimiento y Equipamiento' del ERP dental. Su propósito principal es centralizar, gestionar y monitorizar todos los documentos y acuerdos relacionados con la cobertura de garantías de los equipos dentales y los contratos de mantenimiento preventivo o correctivo con proveedores externos. En una clínica dental, donde la inversión en equipamiento de alta tecnología es significativa (sillones dentales, equipos de rayos X, autoclaves, etc.), tener un control exhaustivo sobre las garantías y el servicio técnico es crucial para asegurar la continuidad operativa y optimizar los costos. Esta página permite al personal autorizado registrar cada garantía asociada a un activo, especificando fechas de inicio y fin, cobertura, y adjuntando la documentación digital. Del mismo modo, gestiona los contratos de servicio, detallando la frecuencia de las visitas de mantenimiento, los costos asociados, los datos de contacto del proveedor y las condiciones del servicio. El sistema automatiza las alertas de vencimiento, notificando a los administradores con antelación para que puedan planificar renovaciones, negociar nuevos términos o preparar la sustitución del equipo, evitando así periodos de inactividad por fallos inesperados y costosas reparaciones fuera de cobertura.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Compras / Inventario
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/mantenimiento-equipamiento/`

Esta funcionalidad reside dentro de la feature 'mantenimiento-equipamiento'. La lógica de la interfaz se encuentra en '/pages/GarantiasContratosPage.tsx', que utiliza componentes reutilizables de '/components/' como la tabla de datos y el formulario. Las llamadas al backend se gestionan a través de funciones definidas en '/apis/garantiasContratosApi.ts', que centralizan la comunicación con los endpoints del servidor.

### Archivos Frontend

- `/features/mantenimiento-equipamiento/pages/GarantiasContratosPage.tsx`
- `/features/mantenimiento-equipamiento/components/TablaGarantiasContratos.tsx`
- `/features/mantenimiento-equipamiento/components/FormularioGarantiaContrato.tsx`
- `/features/mantenimiento-equipamiento/components/ModalDetalleGarantia.tsx`
- `/features/mantenimiento-equipamiento/components/FiltrosGarantias.tsx`
- `/features/mantenimiento-equipamiento/apis/garantiasContratosApi.ts`

### Componentes React

- GarantiasContratosPage
- TablaGarantiasContratos
- FormularioGarantiaContrato
- ModalDetalleGarantia
- FiltrosGarantias
- AlertaVencimiento

## 🔌 APIs Backend

Las APIs para esta funcionalidad permiten realizar operaciones CRUD completas sobre los registros de garantías y contratos. Incluye endpoints para listar, crear, actualizar y eliminar registros, así como uno específico para obtener aquellos próximos a vencer y facilitar la gestión proactiva.

### `GET` `/api/garantias-contratos`

Obtiene una lista paginada y filtrada de todas las garantías y contratos de servicio. Permite filtrar por tipo, estado, proveedor o equipo asociado.

**Parámetros:** page (number), limit (number), tipo (string: 'garantia' | 'contrato'), equipoId (string), proveedorId (string), sortBy (string: 'fechaFin')

**Respuesta:** Un objeto con la lista de garantías/contratos y metadatos de paginación.

### `POST` `/api/garantias-contratos`

Crea un nuevo registro de garantía o contrato de servicio. Requiere validación de datos y la subida de un documento adjunto.

**Parámetros:** Body (JSON con datos del nuevo registro, ej: equipoId, proveedorId, fechaInicio, fechaFin, tipo, documentoUrl)

**Respuesta:** El objeto de la garantía/contrato recién creado.

### `GET` `/api/garantias-contratos/:id`

Obtiene los detalles completos de una garantía o contrato específico por su ID.

**Parámetros:** id (string)

**Respuesta:** El objeto de la garantía/contrato solicitado.

### `PUT` `/api/garantias-contratos/:id`

Actualiza la información de una garantía o contrato existente.

**Parámetros:** id (string), Body (JSON con los campos a actualizar)

**Respuesta:** El objeto de la garantía/contrato actualizado.

### `DELETE` `/api/garantias-contratos/:id`

Elimina un registro de garantía o contrato. (Se recomienda un borrado lógico).

**Parámetros:** id (string)

**Respuesta:** Un mensaje de confirmación.

### `GET` `/api/garantias-contratos/alertas/vencimiento`

Obtiene una lista de todas las garantías y contratos que vencen en un periodo de tiempo determinado (ej. próximos 90 días).

**Parámetros:** dias (number, default: 90)

**Respuesta:** Una lista de garantías/contratos próximos a vencer.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo MongoDB 'GarantiaContrato' para almacenar la información. Un controlador 'GarantiaContratoController' gestiona la lógica de negocio, interactuando con el modelo. Las rutas, definidas en 'garantiaContratoRoutes.js', exponen los endpoints de la API y los asocian a las funciones del controlador.

### Models

#### GarantiaContrato

tipo: String ('garantia', 'contrato'), equipo: { type: ObjectId, ref: 'Equipo' }, proveedor: { type: ObjectId, ref: 'Proveedor' }, fechaInicio: Date, fechaFin: Date, descripcionCobertura: String, costo: Number, frecuenciaPago: String (para contratos), contactoSoporte: { nombre: String, telefono: String, email: String }, documentosAdjuntos: [{ nombre: String, url: String }], clinicaId: { type: ObjectId, ref: 'Clinica' }, estado: String ('activo', 'vencido', 'cancelado')

### Controllers

#### GarantiaContratoController

- crearGarantiaContrato
- obtenerTodasGarantiasContratos
- obtenerGarantiaContratoPorId
- actualizarGarantiaContrato
- eliminarGarantiaContrato
- obtenerAlertasVencimiento

### Routes

#### `/api/garantias-contratos`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id
- GET /alertas/vencimiento

## 🔄 Flujos

1. El usuario de 'Compras' registra un nuevo equipo en el inventario. El sistema le sugiere crear una garantía asociada.
2. El usuario accede a la página 'Garantías y Contratos', hace clic en 'Añadir Nuevo', selecciona el tipo (garantía o contrato), asocia el equipo y el proveedor, define las fechas, y sube una copia digital del documento.
3. Un 'Director' accede a la página y utiliza los filtros para ver todos los contratos que vencen en el próximo trimestre para planificar el presupuesto y las negociaciones.
4. El sistema ejecuta una tarea programada (cron job) diaria que verifica las fechas de vencimiento. Si un contrato o garantía está a 90, 60 o 30 días de vencer, se genera una notificación en el dashboard del sistema y se envía un email a los roles 'Director' y 'Compras'.
5. El usuario de 'Contabilidad' busca un contrato de servicio específico para verificar el costo y la frecuencia de pago antes de procesar una factura del proveedor.

## 📝 User Stories

- Como responsable de Compras, quiero registrar digitalmente todas las garantías de los equipos nuevos para tener un control centralizado y no depender de documentos físicos.
- Como Director de clínica, quiero recibir alertas automáticas 3 meses antes de que expire un contrato de mantenimiento para tener tiempo de renegociar o buscar alternativas.
- Como Contable, quiero poder consultar fácilmente los detalles económicos de un contrato de servicio para verificar la exactitud de las facturas del proveedor.
- Como Admin general multisede, quiero filtrar las garantías y contratos por clínica para poder gestionar los activos de cada ubicación de forma independiente.
- Como responsable de Inventario, quiero asociar cada garantía o contrato a un ítem específico del inventario para poder ver su cobertura directamente desde la ficha del equipo.

## ⚙️ Notas Técnicas

- Implementar un sistema de subida de archivos seguro a un servicio de almacenamiento en la nube como Amazon S3 o Google Cloud Storage para los documentos adjuntos.
- Configurar un 'cron job' en el servidor backend para ejecutar la lógica de verificación de vencimientos y envío de notificaciones de forma periódica.
- La base de datos MongoDB debe tener índices en los campos 'fechaFin', 'equipo', 'proveedor' y 'clinicaId' para optimizar las consultas y los filtros.
- Es crucial implementar un robusto sistema de control de acceso basado en roles (RBAC) para asegurar que solo los usuarios autorizados puedan crear, modificar o eliminar registros sensibles.
- La integración con el módulo de 'Inventario de Equipos' es fundamental. El modelo 'GarantiaContrato' debe tener una referencia (ObjectId) al modelo 'Equipo'.

