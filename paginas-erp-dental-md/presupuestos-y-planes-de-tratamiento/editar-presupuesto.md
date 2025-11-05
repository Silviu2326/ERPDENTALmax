# Editar Presupuesto

**Categoría:** Gestión Clínica | **Módulo:** Presupuestos y Planes de Tratamiento

La funcionalidad 'Editar Presupuesto' es una herramienta esencial dentro del módulo de 'Presupuestos y Planes de Tratamiento'. Permite a los usuarios autorizados, como odontólogos y personal de recepción, modificar un presupuesto ya creado antes de que sea aceptado formalmente por el paciente. Esta página es crucial para mantener la flexibilidad en la planificación clínica y financiera, ya que los diagnósticos pueden evolucionar o las circunstancias del paciente pueden cambiar. El proceso de edición permite ajustar detalles clave como los tratamientos incluidos, las piezas dentales asociadas, las cantidades, los precios unitarios, y aplicar descuentos tanto a nivel de ítem individual como al total del presupuesto. Además, se pueden modificar las notas clínicas, la fecha de validez y otros datos generales del encabezado. Su propósito principal es asegurar que el plan de tratamiento propuesto y su coste asociado sean precisos y estén actualizados con la última evaluación clínica antes de su aprobación. Dentro del ERP, esta función se integra directamente con el listado de presupuestos del paciente y con el catálogo de tratamientos de la clínica. Un presupuesto en estado 'Borrador' o 'Presentado' es típicamente editable, mientras que uno 'Aceptado' podría tener restricciones, posiblemente generando una nueva versión para mantener un historial de cambios, lo cual es vital para la auditoría y el seguimiento del paciente.

## 👥 Roles de Acceso

- Odontólogo
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/presupuestos-planes-tratamiento/`

La funcionalidad de edición de presupuestos reside dentro de la feature 'presupuestos-planes-tratamiento'. La página principal, 'EditarPresupuestoPage.tsx', se encuentra en la subcarpeta '/pages' y se encarga de orquestar los componentes y la lógica de estado. La subcarpeta '/components' contiene los elementos reutilizables de la interfaz, como el formulario de datos generales, la tabla interactiva de tratamientos y el modal de búsqueda para añadir nuevos procedimientos. La lógica para interactuar con el backend está encapsulada en funciones dentro de la subcarpeta '/apis', que se encargan de obtener los datos del presupuesto a editar y enviar las actualizaciones.

### Archivos Frontend

- `/features/presupuestos-planes-tratamiento/pages/EditarPresupuestoPage.tsx`
- `/features/presupuestos-planes-tratamiento/components/FormularioEdicionPresupuesto.tsx`
- `/features/presupuestos-planes-tratamiento/components/TablaTratamientosEditable.tsx`
- `/features/presupuestos-planes-tratamiento/components/ModalBusquedaTratamientos.tsx`
- `/features/presupuestos-planes-tratamiento/apis/presupuestosApi.ts`

### Componentes React

- EditarPresupuestoPage
- FormularioEdicionPresupuesto
- TablaTratamientosEditable
- FilaTratamientoEditable
- ModalBusquedaTratamientos
- ResumenFinancieroEditable

## 🔌 APIs Backend

Se requieren APIs para obtener los datos del presupuesto específico, para actualizarlo una vez modificados los cambios, y una API auxiliar para buscar y añadir nuevos tratamientos desde el catálogo de la clínica.

### `GET` `/api/presupuestos/:id`

Obtiene todos los detalles de un presupuesto específico para poblar el formulario de edición.

**Parámetros:** id: string (ID del presupuesto en la URL)

**Respuesta:** Un objeto JSON con los datos completos del presupuesto, incluyendo la información del paciente y el detalle de los ítems de tratamiento.

### `PUT` `/api/presupuestos/:id`

Actualiza un presupuesto existente con la nueva información proporcionada en el cuerpo de la solicitud.

**Parámetros:** id: string (ID del presupuesto en la URL), Body: Objeto JSON con los campos actualizados del presupuesto (estado, fechaVencimiento, items, descuentos, notas, etc.)

**Respuesta:** El objeto JSON del presupuesto actualizado.

### `GET` `/api/tratamientos`

Busca tratamientos en el catálogo de la clínica para ser añadidos al presupuesto. Permite filtros por nombre o código.

**Parámetros:** query: string (opcional, para buscar por nombre o código)

**Respuesta:** Un array de objetos JSON, cada uno representando un tratamiento disponible.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se basa en el patrón MVC. El modelo 'Presupuesto' define el esquema de datos en MongoDB. El 'PresupuestoController' contiene la lógica de negocio para buscar y actualizar presupuestos. Las rutas de Express en 'presupuestoRoutes' exponen los endpoints necesarios para que el frontend interactúe con el controlador.

### Models

#### Presupuesto

paciente: ObjectId, odontologo: ObjectId, fechaCreacion: Date, fechaVencimiento: Date, estado: String ('Borrador', 'Presentado', 'Aceptado', 'Rechazado', 'Vencido'), items: [{tratamiento: ObjectId, descripcion: String, piezaDental: String, caraDental: String, cantidad: Number, precioUnitario: Number, descuentoItem: Number, totalItem: Number}], subtotal: Number, descuentoTotal: Number, total: Number, notas: String, historialVersiones: [ObjectId]

#### Tratamiento

codigo: String, nombre: String, descripcion: String, precioBase: Number, especialidad: String

### Controllers

#### PresupuestoController

- getPresupuestoById
- updatePresupuesto

#### TratamientoController

- getAllTratamientos

### Routes

#### `/api/presupuestos`

- GET /:id
- PUT /:id

#### `/api/tratamientos`

- GET /

## 🔄 Flujos

1. El usuario (Odontólogo o Recepción) localiza un presupuesto en estado 'Borrador' o 'Presentado' desde la ficha del paciente o el listado general de presupuestos y hace clic en 'Editar'.
2. El sistema carga la página 'Editar Presupuesto', realizando una llamada GET a /api/presupuestos/:id para obtener y mostrar los datos actuales.
3. El usuario modifica los campos necesarios: añade o elimina tratamientos de la tabla, ajusta cantidades, precios o descuentos, y edita las notas o la fecha de vencimiento.
4. Para añadir un tratamiento, el usuario abre un modal de búsqueda que consume el endpoint GET /api/tratamientos para encontrar y seleccionar el procedimiento deseado.
5. El frontend recalcula automáticamente el subtotal, los descuentos y el total final a medida que se realizan cambios.
6. Una vez finalizada la edición, el usuario hace clic en 'Guardar Cambios'.
7. El frontend envía el objeto de presupuesto completo y actualizado mediante una petición PUT a /api/presupuestos/:id.
8. El backend valida los datos, actualiza el documento en MongoDB y devuelve una confirmación de éxito. El usuario es redirigido a la vista de detalle del presupuesto actualizado.

## 📝 User Stories

- Como Odontólogo, quiero poder añadir o quitar tratamientos de un presupuesto existente para reflejar un cambio en el plan de tratamiento del paciente.
- Como personal de Recepción, quiero modificar el descuento global de un presupuesto para adaptarme a una promoción o a un acuerdo específico con el paciente.
- Como Odontólogo, quiero poder cambiar la pieza dental o la cara asociada a un tratamiento dentro del presupuesto para corregir un error o reflejar un hallazgo nuevo.
- Como personal de Recepción, quiero extender la fecha de validez de un presupuesto para darle al paciente más tiempo para considerar su aceptación.
- Como Odontólogo, quiero editar las notas de un presupuesto para añadir detalles clínicos relevantes para que el paciente o el personal administrativo los entiendan.

## ⚙️ Notas Técnicas

- Seguridad: Implementar middleware de autorización para asegurar que solo los roles permitidos (Odontólogo, Recepción) puedan acceder a los endpoints GET y PUT. Validar que el usuario pertenece a la misma clínica que el presupuesto que intenta editar.
- Control de Estado: La lógica del backend en el endpoint PUT debe verificar el estado actual del presupuesto. Si el estado es 'Aceptado', la edición podría estar prohibida o debería generar una nueva versión del presupuesto en lugar de sobrescribir el original, manteniendo la integridad del historial.
- Cálculos Financieros: Para evitar errores de punto flotante en los cálculos de precios y descuentos, es recomendable manejar los valores monetarios como enteros (en céntimos) en el backend y convertirlos de nuevo a decimales solo para la visualización en el frontend.
- Experiencia de Usuario (UX): Utilizar un guardado automático en borrador (local storage) para evitar la pérdida de datos si el usuario cierra accidentalmente la pestaña. La tabla de tratamientos debe ser altamente interactiva, permitiendo la edición en línea de campos para agilizar el flujo de trabajo.
- Atomicidad: La operación de actualización en el backend (PUT /api/presupuestos/:id) debe ser atómica. Si se actualizan varios documentos relacionados (ej. historial), se debe considerar el uso de transacciones de MongoDB para garantizar la consistencia de los datos.

