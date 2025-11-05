# Auditoría Administrativa (Caja/Facturas)

**Categoría:** Calidad y Auditoría | **Módulo:** Calidad y Auditoría

La página de Auditoría Administrativa es una herramienta de control y supervisión financiera fundamental dentro del módulo de 'Calidad y Auditoría'. Su propósito principal es proporcionar a los roles directivos y financieros una visión clara y detallada de todas las operaciones de caja y facturación, permitiendo detectar inconsistencias, errores, o posibles fraudes. Funciona como un panel de control avanzado donde se pueden analizar transacciones financieras, cierres de caja, facturas anuladas o modificadas, y descuentos aplicados. La funcionalidad permite cruzar información del sistema (lo que debería haber en caja según las facturas y pagos registrados) con los cierres de caja realizados por el personal de recepción, destacando cualquier discrepancia. Además, ofrece un registro inmutable de cambios (log de auditoría) para cada transacción sensible, mostrando quién modificó un pago, cuándo se eliminó una factura o quién aplicó un descuento fuera de lo común. Esta herramienta es vital para garantizar la integridad financiera de la clínica, mejorar la transparencia operativa y disuadir prácticas indebidas. Al centralizar esta información, se reduce drásticamente el tiempo necesario para realizar auditorías manuales, permitiendo a la administración tomar decisiones informadas y proactivas para proteger los activos de la empresa y asegurar el cumplimiento de las políticas internas.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/calidad-auditoria/`

Esta funcionalidad se encuentra dentro de la feature 'calidad-auditoria'. La página principal, 'AuditoriaAdministrativaPage.tsx', reside en la subcarpeta '/pages' y actúa como el contenedor principal. Los componentes reutilizables, como la tabla de transacciones, los filtros de búsqueda avanzada y los modales para ver detalles, se ubican en '/components'. Las llamadas al backend para obtener los datos de auditoría se gestionan a través de funciones definidas en '/apis/auditoriaApi.ts', manteniendo la lógica de fetching separada de la UI.

### Archivos Frontend

- `/features/calidad-auditoria/pages/AuditoriaAdministrativaPage.tsx`
- `/features/calidad-auditoria/components/FiltrosAuditoria.tsx`
- `/features/calidad-auditoria/components/TablaTransaccionesAuditables.tsx`
- `/features/calidad-auditoria/components/ResumenCierresCaja.tsx`
- `/features/calidad-auditoria/components/ModalHistorialCambios.tsx`
- `/features/calidad-auditoria/apis/auditoriaApi.ts`

### Componentes React

- AuditoriaAdministrativaPage
- FiltrosAuditoria
- TablaTransaccionesAuditables
- ResumenCierresCaja
- ModalHistorialCambios

## 🔌 APIs Backend

Las APIs para esta sección deben ser seguras y potentes, capaces de realizar consultas complejas y agregaciones sobre colecciones de facturas, pagos y logs. Deben permitir un filtrado exhaustivo para que los auditores puedan acotar su búsqueda a periodos, clínicas o acciones específicas.

### `GET` `/api/auditoria/transacciones`

Obtiene una lista de transacciones (facturas, pagos) que cumplen con ciertos criterios de auditoría, como haber sido modificadas, eliminadas o tener descuentos inusuales.

**Parámetros:** query.fechaInicio: string (ISO), query.fechaFin: string (ISO), query.sedeId: string, query.usuarioId: string, query.tipoAccion: string ('DELETE', 'UPDATE', 'DISCOUNT')

**Respuesta:** Un array de objetos de transacción, cada uno con su historial de cambios relevante.

### `GET` `/api/auditoria/cierres-caja`

Recupera los cierres de caja de un periodo, comparando el total registrado en el sistema con el total declarado por el personal, destacando las diferencias.

**Parámetros:** query.fechaInicio: string (ISO), query.fechaFin: string (ISO), query.sedeId: string

**Respuesta:** Un array de objetos de cierre de caja con los campos 'totalSistema', 'totalDeclarado' y 'diferencia'.

### `GET` `/api/auditoria/historial/:entidad/:id`

Obtiene el log de auditoría completo para una entidad específica (factura o pago) por su ID.

**Parámetros:** params.entidad: string ('factura' o 'pago'), params.id: string

**Respuesta:** Un array de objetos de LogAuditoria ordenados cronológicamente.

### `POST` `/api/auditoria/reportes`

Genera un reporte en formato PDF con los hallazgos de la auditoría según los filtros seleccionados.

**Parámetros:** body.filtros: object (con fechaInicio, fechaFin, sedeId, etc.)

**Respuesta:** Un objeto JSON con la URL para descargar el reporte generado.

## 🗂️ Estructura Backend (MERN)

El backend se apoya en modelos que registran cada operación financiera. Es crucial el modelo 'LogAuditoria', que actúa como un registro inmutable de cada cambio relevante. Los controladores agrupan la lógica para consultar y agregar estos datos, exponiéndolos a través de rutas seguras y bien definidas.

### Models

#### Factura

paciente: ObjectId, sede: ObjectId, tratamientos: [ObjectId], total: number, descuentos: [{motivo: string, monto: number}], estado: string ('pendiente', 'pagada', 'anulada'), creadaPor: ObjectId, fechaCreacion: Date, historial: [ObjectId(ref: 'LogAuditoria')]

#### Pago

factura: ObjectId, sede: ObjectId, monto: number, metodoPago: string, fecha: Date, registradoPor: ObjectId, estado: string ('completado', 'reembolsado'), historial: [ObjectId(ref: 'LogAuditoria')]

#### CierreCaja

sede: ObjectId, usuario: ObjectId, fecha: Date, totalSistema: number, totalDeclarado: number, diferencia: number, notas: string

#### LogAuditoria

usuario: ObjectId, entidad: string ('Factura', 'Pago'), entidadId: ObjectId, accion: string ('CREATE', 'UPDATE', 'DELETE'), detalles: [{campo: string, valorAnterior: any, valorNuevo: any}], timestamp: Date

### Controllers

#### AuditoriaController

- getTransaccionesAuditables
- getResumenCierresCaja
- getHistorialCompletoEntidad
- generarReporteAuditoria

### Routes

#### `/api/auditoria`

- GET /transacciones
- GET /cierres-caja
- GET /historial/:entidad/:id
- POST /reportes

## 🔄 Flujos

1. El Director o Contable accede a la página de 'Auditoría Administrativa'.
2. Utiliza los filtros para seleccionar un rango de fechas, una o varias sedes y, opcionalmente, un tipo de acción a investigar (ej. 'Facturas anuladas').
3. El sistema muestra una tabla con las transacciones que coinciden con los filtros, resaltando las que son potencialmente sospechosas.
4. El usuario hace clic en una transacción para abrir un modal que muestra el historial completo de cambios: quién la creó, quién la modificó, qué campos cambiaron, y cuándo ocurrió cada acción.
5. Paralelamente, puede revisar la sección de 'Cierres de Caja' para comparar los montos calculados por el sistema versus los declarados, identificando rápidamente descuadres de efectivo.
6. Finalmente, puede generar un reporte PDF con los datos filtrados para su archivo o para discutirlo con el equipo.

## 📝 User Stories

- Como Director, quiero ver un listado de todas las facturas anuladas en el último mes en todas las sedes para asegurar que hay una justificación válida para cada anulación.
- Como Contable, quiero filtrar todos los pagos que han sido modificados después de su creación para verificar la legitimidad de los cambios.
- Como Director, quiero comparar los totales de los cierres de caja diarios con los ingresos registrados en el sistema para detectar cualquier faltante de efectivo.
- Como Contable, quiero acceder al historial detallado de un pago para saber exactamente qué usuario cambió el método de pago y en qué fecha.
- Como Director, quiero generar un informe consolidado de auditoría del trimestre para presentarlo en la reunión de junta directiva.

## ⚙️ Notas Técnicas

- Seguridad: Es imperativo que los endpoints de esta funcionalidad estén protegidos por un middleware de autenticación y autorización estricto para asegurar que solo los roles permitidos puedan acceder a esta información financiera sensible.
- Inmutabilidad del Log: El modelo 'LogAuditoria' debe ser tratado como inmutable. Una vez que se crea un registro de log, no debe haber ninguna API que permita su modificación o eliminación.
- Rendimiento: Las consultas de auditoría pueden ser pesadas. Es crucial tener índices en la base de datos MongoDB en los campos frecuentemente filtrados como `fecha`, `sede`, `usuario` y `entidadId` en todas las colecciones relevantes.
- Manejo de Datos Históricos: Para evitar la modificación de registros pasados, en lugar de actualizar un campo en un documento 'Factura', el sistema debe registrar el cambio en 'LogAuditoria' y, si es necesario, crear una nueva versión o estado del documento.
- Generación de Reportes: La generación de PDFs en el backend debe ser manejada de forma asíncrona (ej. a través de una cola de trabajos) para no bloquear el hilo principal de Node.js, especialmente si los reportes son grandes.
- Integridad de Datos: Usar transacciones de MongoDB para operaciones que involucren múltiples documentos (ej. crear una factura y su primer log de auditoría) para garantizar la consistencia atómica.

