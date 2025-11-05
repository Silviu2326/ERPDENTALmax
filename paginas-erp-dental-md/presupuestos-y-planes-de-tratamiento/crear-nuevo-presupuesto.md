# Crear Nuevo Presupuesto

**Categoría:** Gestión Clínica | **Módulo:** Presupuestos y Planes de Tratamiento

La funcionalidad 'Crear Nuevo Presupuesto' es un componente central dentro del módulo de 'Presupuestos y Planes de Tratamiento' del ERP dental. Su propósito principal es permitir a los odontólogos y al personal de recepción la creación de propuestas económicas detalladas para los tratamientos que requiere un paciente. Esta página actúa como el puente entre el diagnóstico clínico y la gestión administrativa-financiera de la clínica. El proceso comienza seleccionando un paciente del sistema. A continuación, el usuario puede añadir los diferentes tratamientos necesarios, ya sea buscándolos en una lista de servicios preconfigurados o seleccionándolos de manera interactiva a través de un odontograma visual que representa la dentadura del paciente. Para cada tratamiento añadido, el sistema carga un precio base que puede ser ajustado manualmente, permitiendo la aplicación de descuentos específicos por línea o un descuento general sobre el total. La interfaz calcula automáticamente los subtotales, descuentos y el total final en tiempo real, proporcionando una visión clara y transparente de los costos. Finalmente, el presupuesto generado se almacena en el historial del paciente, con un estado inicial (ej. 'Pendiente de Aprobación') y una fecha de validez. Este documento digital puede ser impreso, enviado por correo electrónico al paciente, y posteriormente, si es aceptado, convertido en un plan de tratamiento activo, enlazándose directamente con los módulos de agendamiento y facturación para programar las citas y gestionar los pagos correspondientes.

## 👥 Roles de Acceso

- Odontólogo
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/presupuestos-planes-tratamiento/`

Esta funcionalidad se encuentra dentro de la feature 'presupuestos-planes-tratamiento'. La carpeta `/pages` contiene el componente principal de la página, 'CrearNuevoPresupuestoPage.tsx'. La carpeta `/components` alberga componentes reutilizables específicos para esta funcionalidad, como el selector de pacientes, la tabla de tratamientos, y el odontograma interactivo. Finalmente, la carpeta `/apis` contiene las funciones que realizan las llamadas al backend para buscar pacientes, obtener la lista de tratamientos y guardar el nuevo presupuesto.

### Archivos Frontend

- `/features/presupuestos-planes-tratamiento/pages/CrearNuevoPresupuestoPage.tsx`
- `/features/presupuestos-planes-tratamiento/components/FormularioPresupuesto.tsx`
- `/features/presupuestos-planes-tratamiento/components/SelectorPacientePresupuesto.tsx`
- `/features/presupuestos-planes-tratamiento/components/TablaItemsPresupuesto.tsx`
- `/features/presupuestos-planes-tratamiento/components/ModalBusquedaTratamientos.tsx`
- `/features/presupuestos-planes-tratamiento/components/ResumenTotalesPresupuesto.tsx`
- `/features/presupuestos-planes-tratamiento/apis/presupuestosApi.ts`

### Componentes React

- CrearNuevoPresupuestoPage
- FormularioPresupuesto
- SelectorPacientePresupuesto
- TablaItemsPresupuesto
- ModalBusquedaTratamientos
- ResumenTotalesPresupuesto
- OdontogramaInteractivoPresupuesto

## 🔌 APIs Backend

Se requieren varias APIs para soportar la creación de presupuestos. Es necesario poder buscar y seleccionar pacientes, obtener la lista completa de tratamientos disponibles con sus precios, y finalmente, un endpoint para persistir el nuevo presupuesto en la base de datos.

### `GET` `/api/pacientes/buscar`

Busca pacientes por nombre, apellido o DNI para asociarlos al presupuesto.

**Parámetros:** query: q (string de búsqueda)

**Respuesta:** Array de objetos de paciente simplificados (id, nombreCompleto, dni).

### `GET` `/api/tratamientos`

Obtiene la lista completa de tratamientos configurados en la clínica con sus precios base.

**Respuesta:** Array de objetos de tratamiento (id, codigo, nombre, precioBase, area).

### `POST` `/api/presupuestos`

Crea un nuevo presupuesto en el sistema con la información del paciente y los tratamientos seleccionados.

**Parámetros:** body: { pacienteId, odontologoId, items: [{ tratamientoId, cantidad, precioUnitario, descuento, piezaDental }], notas, fechaVencimiento }

**Respuesta:** Objeto del presupuesto recién creado.

### `GET` `/api/pacientes/:id`

Obtiene los detalles completos de un paciente seleccionado para mostrar información adicional en la cabecera del presupuesto.

**Parámetros:** path: id (ID del paciente)

**Respuesta:** Objeto completo del paciente.

## 🗂️ Estructura Backend (MERN)

El backend sigue una arquitectura MERN. El modelo 'Presupuesto' en MongoDB define la estructura de los datos. El 'PresupuestoController' contiene la lógica para crear y gestionar presupuestos, interactuando con otros controladores como 'PacienteController' y 'TratamientoController'. Las rutas en Express exponen estos controladores como endpoints RESTful.

### Models

#### Presupuesto

paciente: { type: ObjectId, ref: 'Paciente' }, odontologo: { type: ObjectId, ref: 'Usuario' }, numeroPresupuesto: String, fechaCreacion: Date, fechaVencimiento: Date, estado: { type: String, enum: ['Pendiente', 'Aceptado', 'Rechazado', 'Vencido'] }, items: [{ tratamiento: { type: ObjectId, ref: 'Tratamiento' }, descripcion: String, piezaDental: String, cantidad: Number, precioUnitario: Number, descuento: Number, total: Number }], subtotal: Number, descuentoTotal: Number, total: Number, notas: String

#### Tratamiento

codigo: String, nombre: String, precioBase: Number, especialidad: String

#### Paciente

nombre: String, apellidos: String, dni: String, fechaNacimiento: Date, historialMedico: ObjectId

### Controllers

#### PresupuestoController

- crearPresupuesto
- obtenerPresupuestoPorId

#### PacienteController

- buscarPacientes
- obtenerPacientePorId

#### TratamientoController

- obtenerTratamientos

### Routes

#### `/api/presupuestos`

- POST /

#### `/api/pacientes`

- GET /buscar
- GET /:id

#### `/api/tratamientos`

- GET /

## 🔄 Flujos

1. El usuario (odontólogo/recepción) navega a la página 'Crear Nuevo Presupuesto'.
2. El sistema presenta un campo para buscar y seleccionar un paciente existente.
3. Una vez seleccionado el paciente, se carga su información básica.
4. El usuario añade tratamientos al presupuesto buscándolos en una lista o seleccionando piezas en un odontograma interactivo.
5. Por cada tratamiento añadido, el usuario puede modificar la cantidad, el precio unitario y aplicar descuentos específicos.
6. El sistema recalcula los subtotales y el total general en tiempo real con cada cambio.
7. El usuario puede añadir notas generales al presupuesto.
8. Finalmente, el usuario guarda el presupuesto. El sistema lo registra, le asigna un número único y lo asocia al historial del paciente con estado 'Pendiente'.

## 📝 User Stories

- Como odontólogo, quiero buscar rápidamente a un paciente por su nombre para crearle un nuevo presupuesto sin salir de su ficha clínica.
- Como personal de recepción, quiero acceder a una lista predefinida de tratamientos con sus precios para añadirlos fácilmente al presupuesto de un paciente.
- Como odontólogo, quiero poder ajustar el precio de un tratamiento específico dentro de un presupuesto para ofrecer un precio especial a un paciente.
- Como personal de recepción, quiero que el sistema calcule automáticamente el total del presupuesto, incluyendo descuentos, para evitar errores manuales y dar información precisa al paciente.
- Como odontólogo, quiero visualizar un odontograma para seleccionar las piezas dentales a tratar y asociar los procedimientos de forma visual y clara.

## ⚙️ Notas Técnicas

- Seguridad: Implementar RBAC (Role-Based Access Control) para asegurar que solo los roles autorizados puedan crear o modificar presupuestos. Validar todos los datos de entrada en el backend para prevenir inyecciones (ej. NoSQL injection) y XSS.
- Rendimiento: Utilizar 'debouncing' en los campos de búsqueda de pacientes y tratamientos para evitar llamadas excesivas a la API mientras el usuario escribe. Considerar la virtualización de la lista de tratamientos si es muy extensa.
- Estado de la Aplicación: Se recomienda el uso de una librería de gestión de estado como Redux Toolkit o Zustand para manejar el estado complejo del formulario del presupuesto (datos del paciente, lista de ítems, cálculos de totales).
- Integración: El presupuesto creado debe generar una entrada en el historial del paciente. Al ser aceptado, debe poder convertirse en un 'Plan de Tratamiento' que se integre con los módulos de Citas (para agendar los procedimientos) y Facturación (para generar los cargos correspondientes).
- Generación de Documentos: Integrar una librería como `jsPDF` o `pdf-lib` en el frontend para generar una versión imprimible o exportable en PDF del presupuesto para entregar al paciente.

