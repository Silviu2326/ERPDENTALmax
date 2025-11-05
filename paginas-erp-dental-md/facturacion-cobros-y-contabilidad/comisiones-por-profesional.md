# Comisiones por Profesional

**Categoría:** Gestión Financiera | **Módulo:** Facturación, Cobros y Contabilidad

La funcionalidad 'Comisiones por Profesional' es una herramienta analítica y de gestión financiera crucial dentro del ERP dental. Su propósito principal es calcular, visualizar y gestionar las comisiones generadas por los odontólogos y otros profesionales de la clínica en función de los tratamientos realizados y los cobros efectuados. Este módulo permite a la administración obtener una visión clara y precisa de la productividad de cada miembro del equipo y asegurar una compensación justa y transparente, lo cual es vital para la motivación y retención del talento. Funciona integrando datos de varias áreas del sistema: toma los tratamientos completados del módulo de 'Historia Clínica y Odontograma', los vincula con los 'Pagos' registrados en el módulo de 'Facturación y Cobros', y aplica las reglas de comisión predefinidas para cada profesional. Estas reglas pueden ser altamente configurables, soportando modelos como porcentaje sobre el valor del tratamiento, porcentaje sobre el importe cobrado, una cantidad fija por procedimiento, o esquemas escalonados. El sistema permite filtrar por rangos de fechas, profesional, sede y tipo de tratamiento, generando informes detallados que desglosan cada concepto comisionable. Además, incluye un flujo para 'liquidar' o marcar comisiones como pagadas, creando un histórico y evitando pagos duplicados.

## 👥 Roles de Acceso

- Contable / Finanzas
- Director / Admin general (multisede)
- Propietario / Gerente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/facturacion-cobros-contabilidad/`

Esta funcionalidad se aloja dentro de la feature 'facturacion-cobros-contabilidad'. La página principal se define en '/pages/ComisionesProfesionalPage.tsx'. Esta página utiliza componentes reutilizables de '/components/' como 'FiltrosComisiones' para la selección de fechas y profesionales, y 'TablaReporteComisiones' para mostrar los resultados. Las llamadas a la API del backend se gestionan a través de funciones encapsuladas en '/apis/comisionesApi.ts' para mantener el código organizado y desacoplado.

### Archivos Frontend

- `/features/facturacion-cobros-contabilidad/pages/ComisionesProfesionalPage.tsx`
- `/features/facturacion-cobros-contabilidad/components/FiltrosComisiones.tsx`
- `/features/facturacion-cobros-contabilidad/components/TablaReporteComisiones.tsx`
- `/features/facturacion-cobros-contabilidad/components/ModalDetalleComision.tsx`
- `/features/facturacion-cobros-contabilidad/apis/comisionesApi.ts`

### Componentes React

- ComisionesProfesionalPage
- FiltrosComisiones
- TablaReporteComisiones
- ModalDetalleComision
- GraficoComisionesProfesional

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en el cálculo y la gestión de las comisiones. El endpoint principal es responsable de ejecutar una consulta de agregación compleja en la base de datos para recopilar tratamientos, pagos y reglas de comisión, devolviendo un informe consolidado. Otros endpoints gestionan la liquidación y la configuración de las reglas.

### `GET` `/api/comisiones/reporte`

Genera y devuelve el reporte de comisiones basado en los filtros proporcionados. Es el endpoint principal de la página.

**Parámetros:** query.fechaInicio: string (ISO Date), query.fechaFin: string (ISO Date), query.profesionalId: string (opcional), query.sedeId: string (opcional), query.estadoLiquidacion: string ('pendiente', 'liquidado') (opcional)

**Respuesta:** JSON con un array de objetos, donde cada objeto representa un profesional y contiene su total de comisiones y un desglose de los tratamientos/pagos que las generan.

### `GET` `/api/comisiones/reporte/:profesionalId/detalle`

Obtiene un desglose detallado de todos los tratamientos y pagos que componen la comisión de un profesional específico en un período de tiempo.

**Parámetros:** params.profesionalId: string, query.fechaInicio: string (ISO Date), query.fechaFin: string (ISO Date)

**Respuesta:** JSON con un array de objetos, cada uno representando un tratamiento/pago comisionable con detalles del paciente, fecha y montos.

### `POST` `/api/comisiones/liquidar`

Marca un conjunto de comisiones como 'liquidadas' o pagadas para un profesional en un período específico, creando un registro histórico.

**Parámetros:** body.profesionalId: string, body.fechaInicio: string, body.fechaFin: string, body.montoLiquidado: number, body.idsComisionables: array[string]

**Respuesta:** JSON con el registro de la liquidación creada.

## 🗂️ Estructura Backend (MERN)

El backend utiliza el modelo Profesional para obtener las reglas de comisión, y cruza datos de los modelos TratamientoRealizado y Pago para realizar los cálculos. El ComisionController contiene la lógica de negocio pesada, utilizando el framework de agregación de MongoDB para procesar los datos de manera eficiente. Las rutas se definen en un archivo dedicado para las comisiones.

### Models

#### Profesional

nombre: string, especialidad: string, sede: ObjectId, configuracionComision: { tipo: string ('porcentaje_cobrado', 'porcentaje_tratamiento', 'fijo_por_tratamiento'), valor: number, aplicaSobre: [{ tratamientoId: ObjectId, valorEspecifico: number }] }

#### TratamientoRealizado

pacienteId: ObjectId, profesionalId: ObjectId, tratamientoId: ObjectId (ref a catálogo de tratamientos), precio: number, descuento: number, fechaRealizacion: Date, estado: string

#### Pago

pacienteId: ObjectId, monto: number, fechaPago: Date, metodoPago: string, tratamientosAsociados: [{ tratamientoRealizadoId: ObjectId, montoAplicado: number }]

#### ComisionLiquidada

profesionalId: ObjectId, periodoInicio: Date, periodoFin: Date, montoTotal: number, fechaLiquidacion: Date, detallePagosIds: [ObjectId]

### Controllers

#### ComisionController

- generarReporteComisiones
- obtenerDetalleComision
- liquidarPeriodoComision

### Routes

#### `/api/comisiones`

- GET /reporte
- GET /reporte/:profesionalId/detalle
- POST /liquidar

## 🔄 Flujos

1. El Gerente o Contable accede a la página 'Comisiones por Profesional'.
2. Por defecto, el sistema muestra el reporte del mes en curso, calculando las comisiones pendientes de liquidar.
3. El usuario utiliza los filtros para acotar la búsqueda por un rango de fechas específico, un profesional o una sede.
4. Al aplicar los filtros, el frontend realiza una llamada a `GET /api/comisiones/reporte`.
5. El backend procesa la solicitud, agrega los datos de pagos y tratamientos, aplica las reglas de comisión de cada profesional y devuelve el informe.
6. El usuario revisa la tabla de resumen y puede hacer clic en 'Ver Detalle' para un profesional, lo que abre un modal con la información de `GET /api/comisiones/reporte/:profesionalId/detalle`.
7. Una vez verificado el informe, el usuario selecciona el periodo y profesional y presiona 'Liquidar Comisiones', lo que invoca a `POST /api/comisiones/liquidar` para registrar el pago.

## 📝 User Stories

- Como Propietario de la clínica, quiero ver un informe de comisiones por profesional y por sede para evaluar la rentabilidad y tomar decisiones estratégicas.
- Como Contable, quiero generar un reporte detallado de comisiones para un período específico para poder procesar la nómina de los profesionales con precisión.
- Como Gerente, quiero poder filtrar las comisiones por estado (pendientes o liquidadas) para saber qué pagos están pendientes y mantener un control financiero.
- Como Director General (multisede), quiero comparar el total de comisiones generadas entre diferentes sedes para analizar el rendimiento de cada una.

## ⚙️ Notas Técnicas

- Rendimiento: El cálculo de comisiones puede ser intensivo en recursos. Es fundamental utilizar el framework de agregación de MongoDB ($lookup, $group, $project) en el backend para realizar los cálculos de manera eficiente en la base de datos y minimizar la carga en el servidor de Node.js.
- Precisión: La lógica de negocio para aplicar la comisión debe ser robusta y manejar diferentes escenarios (descuentos, pagos parciales, devoluciones). Considerar el uso de tipos de datos de alta precisión como Decimal128 en MongoDB para cálculos monetarios.
- Configurabilidad: Las reglas de comisión deben ser flexibles. El esquema del modelo 'Profesional' debe permitir definir reglas complejas, como comisiones diferentes para distintos tipos de tratamiento.
- Seguridad: El acceso a esta funcionalidad debe estar estrictamente protegido por un middleware de autenticación y autorización (RBAC) que verifique el rol del usuario en cada solicitud a la API.
- Historial y Auditoría: Al liquidar una comisión, es vital crear un registro inmutable en la colección 'ComisionLiquidada'. Esto asegura que haya un historial claro de todos los pagos realizados y previene que los mismos pagos o tratamientos se comisionen dos veces.

