# Plan de Tratamiento Completo

**Categoría:** Gestión Clínica | **Módulo:** Presupuestos y Planes de Tratamiento

La página de 'Plan de Tratamiento Completo' es una funcionalidad central dentro del módulo 'Presupuestos y Planes de Tratamiento'. Está diseñada para que los odontólogos puedan crear, gestionar y presentar planes de tratamiento integrales y detallados para sus pacientes. Un plan de tratamiento es más que un simple presupuesto; es una hoja de ruta clínica que desglosa todos los procedimientos necesarios para restaurar o mejorar la salud bucodental del paciente. Esta funcionalidad permite organizar los tratamientos en fases lógicas y secuenciales (p. ej., Fase de Saneamiento, Fase de Rehabilitación, Fase de Estética), lo que facilita la comprensión del paciente y la planificación por parte del clínico. Dentro del ERP, esta página funciona como un constructor interactivo donde el odontólogo, a menudo utilizando un odontograma visual, selecciona los servicios del catálogo de la clínica, los asigna a piezas dentales específicas y los agrupa. El sistema calcula automáticamente los costes, permitiendo aplicar descuentos y generando un resumen financiero claro. Su propósito es triple: mejorar la comunicación y la confianza con el paciente al presentar una propuesta clara y profesional; aumentar la tasa de aceptación de tratamientos; y servir como una guía maestra para la ejecución clínica, vinculando los procedimientos planificados con la agenda de citas y el historial clínico del paciente.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/presupuestos-planes-tratamiento/`

La funcionalidad del Plan de Tratamiento se encuentra dentro de la feature 'presupuestos-planes-tratamiento'. La página principal, 'PlanTratamientoBuilderPage.tsx', reside en la carpeta '/pages' y es la interfaz principal para la creación y edición. Esta página ensambla múltiples componentes reutilizables de la carpeta '/components', como 'OdontogramaInteractivoPlan', 'ConstructorFasesTratamiento', y 'ResumenFinancieroPlan'. Todas las interacciones con el backend se gestionan a través de funciones definidas en '/apis/planesTratamientoApi.ts', que encapsulan las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/presupuestos-planes-tratamiento/pages/PlanTratamientoBuilderPage.tsx`
- `/features/presupuestos-planes-tratamiento/pages/ListaPlanesPacientePage.tsx`
- `/features/presupuestos-planes-tratamiento/components/PlanTratamientoBuilder.tsx`
- `/features/presupuestos-planes-tratamiento/components/FaseTratamientoCard.tsx`
- `/features/presupuestos-planes-tratamiento/components/SelectorTratamientos.tsx`
- `/features/presupuestos-planes-tratamiento/components/ResumenFinancieroPlan.tsx`
- `/features/presupuestos-planes-tratamiento/components/OdontogramaInteractivoPlan.tsx`
- `/features/presupuestos-planes-tratamiento/apis/planesTratamientoApi.ts`

### Componentes React

- PlanTratamientoBuilder
- FaseTratamientoCard
- SelectorTratamientos
- ResumenFinancieroPlan
- OdontogramaInteractivoPlan
- ModalImprimirPlan

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de un plan de tratamiento. Se requieren endpoints para crear un nuevo plan asociado a un paciente, obtener todos los planes de un paciente, recuperar los detalles de un plan específico para su visualización o edición, actualizarlo (p. ej., cambiar su estado o modificar procedimientos) y, finalmente, eliminarlo. También es crucial un endpoint para obtener el catálogo completo de tratamientos que la clínica ofrece, para poder añadirlos al plan.

### `POST` `/api/planes-tratamiento`

Crea un nuevo plan de tratamiento para un paciente.

**Parámetros:** Body: { pacienteId: string, odontologoId: string, fases: array, total: number, descuento: number, notas: string }

**Respuesta:** El objeto del plan de tratamiento recién creado.

### `GET` `/api/planes-tratamiento/paciente/:pacienteId`

Obtiene una lista de todos los planes de tratamiento de un paciente específico.

**Parámetros:** URL Param: pacienteId

**Respuesta:** Un array de objetos de planes de tratamiento.

### `GET` `/api/planes-tratamiento/:id`

Obtiene los detalles completos de un plan de tratamiento específico por su ID.

**Parámetros:** URL Param: id (del plan)

**Respuesta:** El objeto completo del plan de tratamiento.

### `PUT` `/api/planes-tratamiento/:id`

Actualiza un plan de tratamiento existente (p. ej., para cambiar su estado a 'Aceptado' o modificar sus fases y procedimientos).

**Parámetros:** URL Param: id (del plan), Body: { ...campos a actualizar }

**Respuesta:** El objeto del plan de tratamiento actualizado.

### `GET` `/api/tratamientos`

Obtiene la lista completa de tratamientos (catálogo de servicios) disponibles en la clínica para añadirlos al plan.

**Respuesta:** Un array de objetos de tratamiento.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se apoya en el modelo 'PlanTratamiento' que contiene toda la información del plan, incluyendo un array anidado de fases y procedimientos. El 'PlanTratamientoController' contiene la lógica de negocio para gestionar las operaciones CRUD. Las rutas se definen en un archivo dedicado que mapea los endpoints HTTP a las funciones del controlador, siguiendo las convenciones RESTful.

### Models

#### PlanTratamiento

paciente: { type: ObjectId, ref: 'Paciente' }, odontologo: { type: ObjectId, ref: 'Usuario' }, fechaCreacion: Date, estado: { type: String, enum: ['Propuesto', 'Aceptado', 'En Curso', 'Finalizado', 'Rechazado'] }, totalBruto: Number, descuento: Number, totalNeto: Number, notas: String, fases: [{ nombre: String, descripcion: String, procedimientos: [{ tratamiento: { type: ObjectId, ref: 'Tratamiento' }, piezaDental: String, cara: String, precio: Number, estadoProcedimiento: { type: String, enum: ['Pendiente', 'En Curso', 'Realizado'] } }] }]

#### Tratamiento

codigo: String, nombre: String, descripcion: String, precioBase: Number, categoria: String

### Controllers

#### PlanTratamientoController

- crearPlanTratamiento
- obtenerPlanesPorPaciente
- obtenerPlanPorId
- actualizarPlanTratamiento
- eliminarPlanTratamiento

#### TratamientoController

- obtenerTodosLosTratamientos

### Routes

#### `/api/planes-tratamiento`

- POST /
- GET /paciente/:pacienteId
- GET /:id
- PUT /:id

## 🔄 Flujos

1. El odontólogo accede a la ficha de un paciente y navega a la sección de 'Planes de Tratamiento'.
2. El sistema muestra una lista de los planes existentes para ese paciente.
3. El odontólogo hace clic en 'Crear Nuevo Plan', abriendo la interfaz del constructor.
4. En el constructor, el odontólogo crea la primera fase (p.ej., 'Diagnóstico y Saneamiento').
5. Usando el 'Selector de Tratamientos' (con búsqueda y filtro), añade 'Limpieza Dental' y 'Radiografía Panorámica' a la fase.
6. Si un tratamiento es específico de una pieza, lo asocia usando el 'Odontograma Interactivo'.
7. El sistema actualiza en tiempo real el 'Resumen Financiero' con el coste total.
8. El odontólogo añade una segunda fase 'Rehabilitación' y agrega un 'Implante' para la pieza 2.4.
9. Una vez completado, guarda el plan, que queda en estado 'Propuesto'.
10. Posteriormente, puede imprimir el plan en un formato PDF profesional o cambiar su estado a 'Aceptado' si el paciente da su consentimiento.

## 📝 User Stories

- Como odontólogo, quiero crear un plan de tratamiento estructurado por fases para poder organizar el proceso clínico de forma lógica y escalonada.
- Como odontólogo, quiero buscar y añadir tratamientos del catálogo de la clínica a un plan para asegurar consistencia en los servicios y precios.
- Como odontólogo, quiero asociar tratamientos a piezas dentales específicas en un odontograma visual para tener un registro claro y preciso de las intervenciones.
- Como odontólogo, quiero que el sistema calcule automáticamente el coste total del plan, incluyendo subtotales por fase, para facilitar la discusión financiera con el paciente.
- Como odontólogo, quiero poder guardar un plan en estado 'Propuesto' y luego cambiarlo a 'Aceptado' para gestionar el ciclo de aprobación del tratamiento.
- Como odontólogo, quiero poder imprimir o exportar a PDF un plan de tratamiento con un diseño profesional para entregárselo al paciente.

## ⚙️ Notas Técnicas

- Seguridad: Implementar RBAC (Role-Based Access Control) para asegurar que solo los odontólogos puedan crear, modificar o eliminar planes de tratamiento. Toda la información del paciente debe cumplir con normativas de protección de datos como HIPAA o GDPR.
- Rendimiento: La carga del catálogo de tratamientos debe ser eficiente, utilizando paginación o búsqueda 'on-the-fly' si la lista es muy extensa. El odontograma debe ser renderizado eficientemente (p.ej., usando SVG) para no ralentizar la interfaz.
- Integración con Agenda: Una vez que un plan es 'Aceptado', los procedimientos listados deben poder ser agendados directamente desde la vista del plan, creando un flujo de trabajo sin fisuras hacia la programación de citas.
- Integración con Facturación: A medida que los procedimientos de un plan se marcan como 'Realizado', deben poder generar automáticamente los correspondientes cargos en el módulo de facturación del paciente.
- Atomicidad de las operaciones: Las operaciones de creación y actualización de planes complejos deben ser atómicas en la base de datos (usando transacciones de MongoDB) para evitar estados inconsistentes.
- UI/UX: Considerar funcionalidades avanzadas como drag-and-drop para reordenar fases o procedimientos, y plantillas de planes para casos comunes (p.ej., 'Plan de Ortodoncia Básico').

