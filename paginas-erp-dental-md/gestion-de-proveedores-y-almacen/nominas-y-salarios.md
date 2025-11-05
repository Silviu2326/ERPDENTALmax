# Nóminas y Salarios

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad de 'Nóminas y Salarios' es un componente crítico dentro del ERP dental, diseñado para automatizar y gestionar todo el ciclo de vida de la remuneración de los empleados de la clínica. Aunque se ubica organizativamente bajo el módulo 'Gestión de Proveedores y Almacén', su función principal pertenece al ámbito de los Recursos Humanos y la Contabilidad. Esta ubicación se justifica al considerar a los empleados como 'proveedores internos' de servicios, cuya gestión de pagos es fundamental para la operación. El sistema permite configurar de manera flexible los esquemas salariales para cada tipo de empleado, desde el personal administrativo con sueldo fijo hasta los odontólogos especialistas que pueden tener un modelo mixto de salario base más comisiones por tratamientos realizados. La plataforma calcula automáticamente las percepciones (salario base, comisiones, bonos, horas extra) y deducciones (impuestos, seguridad social, anticipos), generando recibos de nómina (payslips) detallados y precisos. Su propósito es reducir drásticamente el tiempo y los errores asociados con el cálculo manual de nóminas, asegurar el cumplimiento de las obligaciones fiscales y laborales, y proporcionar a la gerencia una visión clara y en tiempo real de uno de los mayores costos operativos de la clínica. Se integra directamente con los módulos de Tratamientos y Facturación para obtener los datos necesarios para el cálculo de comisiones, garantizando que los pagos variables se basen en información precisa y actualizada.

## 👥 Roles de Acceso

- RR. HH.
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Esta funcionalidad reside dentro de la feature 'gestion-proveedores-almacen'. La página principal, 'NominasSalariosPage.tsx', se encuentra en la subcarpeta '/pages'. Esta página utiliza múltiples componentes React reutilizables ubicados en '/components/nominas/', como 'TablaNominas' para listar los cálculos y 'ModalDetalleNomina' para visualizar los desgloses. Todas las interacciones con el backend se gestionan a través de funciones centralizadas en el archivo '/apis/nominasApi.ts', que se encarga de realizar las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/NominasSalariosPage.tsx`
- `/features/gestion-proveedores-almacen/components/nominas/TablaNominas.tsx`
- `/features/gestion-proveedores-almacen/components/nominas/ModalDetalleNomina.tsx`
- `/features/gestion-proveedores-almacen/components/nominas/PanelControlNominas.tsx`
- `/features/gestion-proveedores-almacen/components/nominas/FormularioConfiguracionSalarial.tsx`
- `/features/gestion-proveedores-almacen/apis/nominasApi.ts`

### Componentes React

- TablaNominas
- ModalDetalleNomina
- PanelControlNominas
- FiltroPeriodoNomina
- FormularioConfiguracionSalarial

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan la configuración salarial de los empleados, el cálculo de las nóminas por período, y la consulta de registros históricos. El endpoint principal es el de cálculo, que es una operación compleja que agrega datos de múltiples fuentes.

### `POST` `/api/nominas/calcular`

Inicia el proceso de cálculo de nóminas para un período específico (mes y año). Es una operación asíncrona que procesa a todos los empleados activos.

**Parámetros:** body: { mes: number, anio: number }

**Respuesta:** Un objeto con el estado del trabajo iniciado. ej: { jobId: 'string', status: 'iniciado' }

### `GET` `/api/nominas`

Obtiene una lista paginada de los registros de nómina generados. Permite filtrar por período (mes, año) y por empleado.

**Parámetros:** query: ?mes=7&anio=2024&empleadoId=...&page=1&limit=20

**Respuesta:** Un array de objetos de nómina con información resumida.

### `GET` `/api/nominas/:id`

Obtiene el detalle completo de un registro de nómina específico, incluyendo el desglose de comisiones y deducciones.

**Parámetros:** path: id (ID del registro de nómina)

**Respuesta:** Un objeto completo del registro de nómina.

### `PUT` `/api/nominas/:id/estado`

Actualiza el estado de un registro de nómina (ej. de 'Calculada' a 'Pagada').

**Parámetros:** path: id (ID del registro de nómina), body: { estado: 'Pagada' }

**Respuesta:** El registro de nómina actualizado.

### `GET` `/api/empleados/:empleadoId/configuracion-salarial`

Obtiene la configuración salarial de un empleado específico.

**Parámetros:** path: empleadoId (ID del empleado)

**Respuesta:** Un objeto con la configuración salarial del empleado.

### `PUT` `/api/empleados/:empleadoId/configuracion-salarial`

Crea o actualiza la configuración salarial de un empleado.

**Parámetros:** path: empleadoId (ID del empleado), body: { tipoContrato, salarioBase, porcentajeComision, datosBancarios, retencionesFiscales, ... }

**Respuesta:** La configuración salarial actualizada.

## 🗂️ Estructura Backend (MERN)

El backend utiliza el modelo 'Nomina' para almacenar los resultados de cada cálculo. El modelo 'Empleado' se extiende para incluir un subdocumento con la configuración salarial. El 'NominaController' contiene la lógica de negocio principal, incluyendo la compleja función de cálculo que se comunica con el servicio de tratamientos. Las rutas se definen en 'nomina.routes.js' y 'empleado.routes.js'.

### Models

#### Nomina

empleadoId: ObjectId, periodo: {mes: Number, anio: Number}, fechaCalculo: Date, salarioBase: Number, totalComisiones: Number, totalPercepciones: Number, totalDeducciones: Number, netoAPagar: Number, estado: String ('Calculada', 'Aprobada', 'Pagada'), desgloseComisiones: [{tratamientoId: ObjectId, paciente: String, montoTratamiento: Number, porcentajeComision: Number, montoComision: Number}], desgloseDeducciones: [{concepto: String, monto: Number}]

#### Empleado

(Campos existentes del empleado...) + configuracionSalarial: { tipoContrato: String ('Fijo', 'Comision', 'Mixto'), salarioBase: Number, porcentajeComision: Number, cuentaBancaria: String, rfc: String, configuracionFiscal: Object }

### Controllers

#### NominaController

- calcularNominasPeriodo
- getNominas
- getNominaById
- updateEstadoNomina

#### EmpleadoController

- getConfiguracionSalarial
- updateConfiguracionSalarial

### Routes

#### `/api/nominas`

- POST /calcular
- GET /
- GET /:id
- PUT /:id/estado

#### `/api/empleados`

- GET /:empleadoId/configuracion-salarial
- PUT /:empleadoId/configuracion-salarial

## 🔄 Flujos

1. El usuario de RR.HH. configura el perfil salarial de un nuevo empleado, definiendo su salario base, tipo de contrato y porcentaje de comisión si aplica.
2. Al final del mes, el Contable navega a la página de 'Nóminas y Salarios', selecciona el período a procesar (ej. Julio 2024) y ejecuta la acción de 'Calcular Nómina'.
3. El sistema inicia un proceso en segundo plano que, para cada empleado, recupera su salario base, consulta los tratamientos finalizados y facturados en ese período, calcula las comisiones, aplica deducciones preconfiguradas y genera un registro de nómina en estado 'Calculada'.
4. El contable revisa la tabla de nóminas calculadas, puede hacer clic en cada una para ver el detalle completo, incluyendo el listado de tratamientos que generaron comisión.
5. Una vez verificada la exactitud de los cálculos, el contable selecciona las nóminas y las marca como 'Pagadas', actualizando su estado y bloqueándolas para futuras ediciones.

## 📝 User Stories

- Como Contable, quiero calcular la nómina de todos los empleados para un mes específico con un solo clic, para agilizar el proceso de cierre mensual.
- Como gerente de RR. HH., quiero establecer y modificar fácilmente el esquema salarial de cada empleado para asegurar que los pagos se realicen conforme a su contrato.
- Como Contable, quiero ver un desglose detallado de las comisiones de un odontólogo por cada tratamiento realizado para poder verificar la exactitud del pago variable.
- Como gerente de la clínica, quiero generar un reporte del costo total de la nómina por mes para analizar la rentabilidad y gestionar el presupuesto.
- Como Contable, quiero poder exportar un recibo de nómina individual en formato PDF para entregárselo al empleado como comprobante de pago.

## ⚙️ Notas Técnicas

- Seguridad: El acceso a esta funcionalidad y sus APIs debe estar protegido por un middleware de autenticación y autorización que verifique estrictamente los roles 'RR. HH.' y 'Contable / Finanzas'. Los datos salariales y bancarios deben ser encriptados.
- Integración: Es crucial una integración robusta con el módulo de 'Tratamientos y Facturación'. El sistema de nóminas debe consultar los tratamientos marcados como 'Completados' y 'Pagados' dentro del período de cálculo para obtener la base de las comisiones.
- Rendimiento: El cálculo masivo de nóminas debe ser una tarea asíncrona para no bloquear la UI. Se puede usar un sistema de colas (como BullMQ) para gestionar estos trabajos en el backend y notificar al frontend cuando el proceso haya finalizado.
- Consistencia de Datos: Una vez que una nómina se marca como 'Pagada', el registro debería volverse inmutable. Cualquier corrección debe realizarse a través de un ajuste en un período de nómina posterior para mantener un historial financiero auditable.
- Generación de Documentos: La funcionalidad para descargar recibos en PDF debe implementarse en el backend (usando librerías como `pdfkit` o `puppeteer`) para asegurar un formato estandarizado y aliviar la carga del cliente.

