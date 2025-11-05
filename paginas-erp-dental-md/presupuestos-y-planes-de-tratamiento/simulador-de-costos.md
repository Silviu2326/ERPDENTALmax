# Simulador de Costos

**Categoría:** Gestión Clínica | **Módulo:** Presupuestos y Planes de Tratamiento

El Simulador de Costos es una herramienta interactiva y dinámica diseñada para crear escenarios financieros hipotéticos para los planes de tratamiento de los pacientes. A diferencia de un presupuesto formal, que es un documento estático, el simulador permite al personal clínico y administrativo (odontólogos, personal de finanzas, administradores) construir, modificar y comparar diferentes versiones de un plan de tratamiento en tiempo real. Su propósito principal es ofrecer transparencia y flexibilidad al paciente, permitiéndole entender el impacto financiero de cada decisión, como la inclusión de tratamientos opcionales, la elección de materiales de mayor o menor costo, o la aplicación de diferentes coberturas de seguro y planes de financiación. Funciona como un 'lienzo en blanco' dentro del módulo de 'Presupuestos y Planes de Tratamiento'. Aquí, el profesional puede agregar o quitar procedimientos de una lista completa de servicios de la clínica, aplicar descuentos porcentuales o fijos, seleccionar el plan de seguro específico del paciente para ver la cobertura estimada y explorar opciones de financiación para calcular cuotas mensuales. El resultado es un desglose detallado que se actualiza instantáneamente, facilitando una conversación clara y efectiva con el paciente sobre sus opciones, lo que aumenta significativamente la tasa de aceptación de los tratamientos propuestos antes de generar un presupuesto formal y vinculante.

## 👥 Roles de Acceso

- Odontólogo
- Contable / Finanzas
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/presupuestos-planes-tratamiento/`

Esta funcionalidad se aloja dentro del módulo 'presupuestos-planes-tratamiento'. La página principal, 'SimuladorCostosPage.tsx', se encuentra en la subcarpeta '/pages' y actúa como el contenedor principal. Esta página importa y organiza múltiples componentes especializados de la carpeta '/components', como el panel de selección de tratamientos y el resumen de costos. Las interacciones con el backend se gestionan a través de funciones centralizadas en '/apis/simuladorApi.ts', que encapsulan las llamadas a los endpoints REST.

### Archivos Frontend

- `/features/presupuestos-planes-tratamiento/pages/SimuladorCostosPage.tsx`
- `/features/presupuestos-planes-tratamiento/components/PanelSeleccionTratamientos.tsx`
- `/features/presupuestos-planes-tratamiento/components/ResumenCostosDinamico.tsx`
- `/features/presupuestos-planes-tratamiento/components/ConfiguradorFinanciero.tsx`
- `/features/presupuestos-planes-tratamiento/components/TratamientoSimuladoItem.tsx`
- `/features/presupuestos-planes-tratamiento/apis/simuladorApi.ts`
- `/features/presupuestos-planes-tratamiento/hooks/useSimuladorState.ts`

### Componentes React

- SimuladorCostosPage
- PanelSeleccionTratamientos
- ListaTratamientosActivos
- ResumenCostosDinamico
- ConfiguradorFinanciero
- ModalGenerarPresupuesto

## 🔌 APIs Backend

Las APIs para el simulador deben proporcionar los datos maestros (tratamientos, planes de seguro, opciones de financiación) y, fundamentalmente, un endpoint que realice el cálculo complejo en el servidor para garantizar la integridad y seguridad de la lógica de negocio.

### `GET` `/api/tratamientos`

Obtiene la lista completa de tratamientos disponibles en la clínica, incluyendo su código, nombre y precio base. Se puede filtrar por clínica si es multisede.

**Parámetros:** query: ?sedeId=[id]

**Respuesta:** Array de objetos de Tratamiento.

### `GET` `/api/aseguradoras/planes`

Obtiene todos los planes de aseguradoras configurados en el sistema, con sus detalles de cobertura por tratamiento.

**Parámetros:** query: ?sedeId=[id]

**Respuesta:** Array de objetos de Planes de Aseguradora.

### `GET` `/api/opciones-financieras`

Obtiene las opciones de financiación disponibles (ej: 6, 12, 18 meses sin intereses).

**Parámetros:** query: ?sedeId=[id]

**Respuesta:** Array de objetos de Opciones Financieras.

### `POST` `/api/presupuestos/simular`

Endpoint clave que recibe el estado actual de la simulación (lista de tratamientos, descuentos, seguro, etc.) y devuelve el cálculo detallado de costos. Toda la lógica de cálculo reside aquí.

**Parámetros:** body: { tratamientos: [ { tratamientoId: string, cantidad: number } ], aseguradoraPlanId: string, descuentoPorcentaje: number, descuentoFijo: number, sedeId: string }

**Respuesta:** Objeto JSON con el desglose: { subtotal: number, totalDescuentos: number, montoCubiertoAseguradora: number, totalPaciente: number, detalleCoberturas: [...] }

## 🗂️ Estructura Backend (MERN)

El backend soporta el simulador con modelos para las entidades financieras y de tratamiento. Un controlador específico ('PresupuestoController') contiene la lógica de negocio para el cálculo de costos, asegurando que las reglas de precios y coberturas se apliquen de forma centralizada y segura.

### Models

#### Tratamiento

nombre: String, codigo: String, descripcion: String, precio_base: Number, sedes_disponibles: [ObjectId], categoria: String

#### AseguradoraPlan

nombre_aseguradora: String, nombre_plan: String, coberturas: [ { tratamientoId: ObjectId, porcentaje_cobertura: Number, monto_maximo: Number } ], deducible: Number

#### OpcionFinanciera

nombre: String, entidad: String, plazos_meses: [Number], tasa_interes: Number, comision_apertura: Number

### Controllers

#### TratamientoController

- getAllTratamientos

#### ConfiguracionFinancieraController

- getAllAseguradoraPlanes
- getAllOpcionesFinancieras

#### PresupuestoController

- simularCostosTratamiento

### Routes

#### `/api/tratamientos`

- GET /

#### `/api/aseguradoras`

- GET /planes

#### `/api/opciones-financieras`

- GET /

#### `/api/presupuestos`

- POST /simular

## 🔄 Flujos

1. El usuario (odontólogo/admin) selecciona un paciente y accede a la página 'Simulador de Costos'.
2. La interfaz carga la lista de todos los tratamientos disponibles desde el backend.
3. El usuario busca y añade tratamientos al plan actual. Por cada adición, el 'Resumen de Costos' se actualiza en tiempo real mostrando el subtotal.
4. El usuario selecciona el plan de seguro del paciente en un menú desplegable. Se realiza una llamada a la API '/api/presupuestos/simular' y la interfaz muestra el monto estimado de cobertura y el nuevo total para el paciente.
5. El usuario aplica un descuento (ej. 10% por pronto pago). La UI recalcula y muestra el total final actualizado.
6. El usuario explora opciones de financiación, y el sistema muestra una estimación de las cuotas mensuales.
7. Una vez satisfecho con un escenario, el usuario hace clic en 'Generar Presupuesto', lo que congela la simulación y la pasa al siguiente paso para crear un documento formal.

## 📝 User Stories

- Como Odontólogo, quiero añadir o quitar tratamientos rápidamente en una simulación para mostrarle al paciente diferentes alternativas (ej. implante vs. puente) y su impacto en el costo total, para ayudarle a tomar una decisión informada.
- Como personal de Contabilidad / Finanzas, quiero seleccionar el plan de seguro exacto de un paciente y ver el desglose detallado de la cobertura para cada tratamiento en la simulación, para darle una estimación precisa de sus gastos de bolsillo.
- Como Director de clínica, quiero poder aplicar descuentos discrecionales en el simulador para ofrecer incentivos a los pacientes y mejorar la tasa de aceptación de planes de tratamiento de alto valor.
- Como Odontólogo, quiero poder guardar múltiples simulaciones para un mismo plan de tratamiento (Escenario A, Escenario B) y poder recuperarlas en futuras consultas con el paciente.

## ⚙️ Notas Técnicas

- La lógica de cálculo de precios, descuentos y coberturas debe residir exclusivamente en el backend (endpoint POST /api/presupuestos/simular) para garantizar la coherencia, seguridad y evitar manipulaciones desde el cliente.
- Para una experiencia de usuario fluida y reactiva, es crucial utilizar un gestor de estado en el frontend (como Zustand o Redux Toolkit) para manejar el complejo estado de la simulación (lista de tratamientos, seguro seleccionado, descuentos, etc.).
- Implementar debouncing en el campo de búsqueda de tratamientos para evitar llamadas excesivas a la API mientras el usuario escribe.
- La información de precios y coberturas es sensible. El acceso a los endpoints debe estar protegido por middleware de autenticación y autorización basado en roles.
- Para entornos multisede, todos los endpoints de obtención de datos (tratamientos, seguros) y el endpoint de simulación deben aceptar un parámetro 'sedeId' para devolver la información relevante a esa ubicación específica.

