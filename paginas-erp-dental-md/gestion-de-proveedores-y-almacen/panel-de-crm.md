# Panel de CRM

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

El Panel de CRM, dentro del módulo de 'Gestión de Proveedores y Almacén', es una herramienta estratégica diseñada para centralizar, analizar y optimizar las relaciones con los socios comerciales de la clínica dental, tales como proveedores de materiales, laboratorios protésicos, servicios de mantenimiento y otros vendedores. A diferencia de un CRM de pacientes, este panel se enfoca en el ciclo de vida de la relación con el proveedor (Supplier Relationship Management - SRM). Su propósito principal es ofrecer una visión de 360 grados sobre el rendimiento, la comunicación y el valor que cada proveedor aporta a la clínica. Permite a los gerentes y directores tomar decisiones informadas para negociar mejores contratos, asegurar la calidad de los suministros, reducir costos y mitigar riesgos en la cadena de suministro. El panel funciona como un dashboard interactivo que consolida métricas clave (KPIs) como el gasto por proveedor, la calificación de servicio, la puntualidad en las entregas y el historial de incidencias. Además, centraliza el registro de todas las interacciones (emails, llamadas, reuniones) y gestiona los documentos contractuales, alertando sobre fechas de vencimiento importantes. Esta funcionalidad es vital para la gestión de recursos, ya que transforma la gestión de compras de una tarea transaccional a una ventaja estratégica, garantizando que la clínica opere con los mejores recursos y en las condiciones más favorables.

## 👥 Roles de Acceso

- Marketing / CRM
- Director / Admin general (multisede)
- Propietario / Gerente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Toda la lógica de esta funcionalidad reside en la carpeta 'gestion-proveedores-almacen'. La página principal, 'CrmDashboardPage.tsx', se encuentra en la subcarpeta '/pages' y actúa como el contenedor principal. Esta página importa y organiza múltiples componentes reutilizables desde '/components/Crm/', como 'ProveedorKPIsWidget' para las métricas clave, 'HistorialComunicacionList' para el seguimiento de interacciones y 'ContratosActivosTable' para la gestión de contratos. La comunicación con el backend se abstrae en el archivo '/apis/crmApi.ts', que contiene funciones asíncronas para realizar las llamadas a los endpoints de la API REST.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/CrmDashboardPage.tsx`
- `/features/gestion-proveedores-almacen/components/Crm/ProveedorKPIsWidget.tsx`
- `/features/gestion-proveedores-almacen/components/Crm/HistorialComunicacionList.tsx`
- `/features/gestion-proveedores-almacen/components/Crm/ContratosActivosTable.tsx`
- `/features/gestion-proveedores-almacen/components/Crm/GraficoRendimientoProveedor.tsx`
- `/features/gestion-proveedores-almacen/components/Crm/FiltrosCrmDashboard.tsx`
- `/features/gestion-proveedores-almacen/apis/crmApi.ts`

### Componentes React

- CrmDashboardPage
- ProveedorKPIsWidget
- HistorialComunicacionList
- ContratosActivosTable
- GraficoRendimientoProveedor
- FiltrosCrmDashboard
- ModalRegistroComunicacion

## 🔌 APIs Backend

Las APIs para el Panel de CRM están diseñadas para agregar y servir datos complejos sobre proveedores de manera eficiente. Proporcionan endpoints para obtener KPIs generales, historiales de comunicación, estados de contratos y datos de rendimiento para visualizaciones.

### `GET` `/api/proveedores/crm/kpis`

Obtiene los indicadores clave de rendimiento (KPIs) para el dashboard principal, como número total de proveedores, contratos activos, gasto promedio y calificación media.

**Parámetros:** sedeId (opcional, para multisede)

**Respuesta:** Un objeto JSON con los KPIs calculados. ej: { totalProveedores: 50, contratosActivos: 35, gastoUltimoMes: 15000 }

### `GET` `/api/proveedores/crm/comunicaciones`

Recupera una lista paginada de las comunicaciones recientes con los proveedores, con opción de filtrado por proveedor, fecha o tipo.

**Parámetros:** proveedorId (opcional), fechaInicio (opcional), fechaFin (opcional), page (opcional), limit (opcional)

**Respuesta:** Un array de objetos de comunicación.

### `POST` `/api/proveedores/crm/comunicaciones`

Registra una nueva interacción (llamada, email, reunión) con un proveedor.

**Parámetros:** Body: { proveedorId, fecha, tipo, resumen, usuarioId }

**Respuesta:** El objeto de la comunicación recién creada.

### `GET` `/api/proveedores/crm/contratos/por-vencer`

Obtiene una lista de contratos que están próximos a su fecha de vencimiento (ej. en los próximos 60 días).

**Parámetros:** diasLimite (default: 60)

**Respuesta:** Un array de objetos de contrato.

### `GET` `/api/proveedores/crm/rendimiento-anual`

Devuelve datos agregados mensualmente para un proveedor específico, ideal para gráficos (ej. gasto vs. calificación).

**Parámetros:** proveedorId, anio

**Respuesta:** Un array de objetos, cada uno representando un mes con sus métricas. ej: [{ mes: 1, gasto: 1200, calificacion: 4.5 }]

## 🗂️ Estructura Backend (MERN)

El backend soporta el Panel de CRM utilizando modelos existentes como 'Proveedor' y añadiendo un nuevo modelo 'Comunicacion' para el seguimiento de interacciones. Un controlador específico, 'CrmProveedorController', contiene la lógica de negocio para las agregaciones de datos complejas requeridas por el dashboard, optimizando las consultas a MongoDB.

### Models

#### Proveedor

nombre: String, contacto: {nombre: String, email: String, telefono: String}, categoria: String, direccion: String, historialPedidos: [ObjectId], contratos: [ObjectId], calificaciones: [{valor: Number, comentario: String, fecha: Date}]

#### Comunicacion

proveedorId: { type: ObjectId, ref: 'Proveedor' }, usuarioId: { type: ObjectId, ref: 'Usuario' }, fecha: Date, tipo: String ('Email', 'Llamada', 'Reunión'), resumen: String, adjuntos: [String]

#### Contrato

proveedorId: { type: ObjectId, ref: 'Proveedor' }, fechaInicio: Date, fechaFin: Date, terminos: String, documentoUrl: String, estado: String ('Activo', 'Vencido', 'Cancelado')

### Controllers

#### CrmProveedorController

- getDashboardKPIs
- getComunicaciones
- createComunicacion
- getContratosPorVencer
- getRendimientoAnualProveedor

### Routes

#### `/api/proveedores/crm`

- GET /kpis
- GET /comunicaciones
- POST /comunicaciones
- GET /contratos/por-vencer
- GET /rendimiento-anual

## 🔄 Flujos

1. El Gerente inicia sesión, navega a 'Gestión de Proveedores' y accede al 'Panel de CRM'. El dashboard carga automáticamente los KPIs generales.
2. El usuario visualiza la tabla de 'Contratos por vencer' y hace clic en un contrato para ver sus detalles y planificar una renegociación.
3. Después de una llamada con un laboratorio, el responsable de CRM hace clic en 'Registrar Comunicación', selecciona el proveedor, rellena los detalles de la llamada y guarda el registro.
4. El Director selecciona un proveedor clave de la lista y el sistema muestra un gráfico con la evolución de su gasto y calificación de servicio durante el último año.
5. El sistema envía una notificación automática al Propietario cuando un contrato de un proveedor crítico está a 30 días de expirar.

## 📝 User Stories

- Como Gerente, quiero ver un panel de control con métricas clave de mis proveedores para tener una visión general rápida y tomar decisiones estratégicas.
- Como responsable de CRM, quiero registrar todas las interacciones con los proveedores en un solo lugar para mantener un historial completo y accesible para todo el equipo directivo.
- Como Director multisede, quiero comparar el rendimiento de proveedores similares que sirven a diferentes sedes para estandarizar las compras con los mejores.
- Como Propietario, quiero ser notificado automáticamente sobre los contratos que están a punto de vencer para poder renegociar las condiciones con tiempo suficiente.

## ⚙️ Notas Técnicas

- Implementar un pipeline de agregación en MongoDB para el endpoint de KPIs para asegurar un cálculo eficiente y rápido sin sobrecargar el servidor.
- Utilizar una librería de visualización de datos como 'Recharts' o 'Chart.js' en el frontend para crear los gráficos de rendimiento interactivos.
- Asegurar la protección de los endpoints de la API con middleware de autenticación y autorización basado en roles para que solo el personal autorizado pueda acceder a la información financiera y contractual.
- Considerar una integración futura con la API de Google Calendar o Microsoft Outlook para sincronizar las reuniones agendadas con proveedores directamente en el historial de comunicaciones.
- Implementar paginación en el backend y 'virtual scrolling' o 'infinite loading' en el frontend para la lista de comunicaciones, evitando cargar miles de registros a la vez y mejorando la performance.

