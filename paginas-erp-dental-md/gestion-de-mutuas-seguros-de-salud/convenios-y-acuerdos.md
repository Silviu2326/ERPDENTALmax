# Convenios y Acuerdos

**Categoría:** Gestión Financiera | **Módulo:** Gestión de Mutuas/Seguros de Salud

La funcionalidad 'Convenios y Acuerdos' es el núcleo central del módulo de 'Gestión de Mutuas/Seguros de Salud'. Esta página permite a los administradores y al personal financiero de la clínica dental definir, gestionar y consultar de manera centralizada todos los acuerdos comerciales establecidos con las diferentes compañías de seguros, mutuas y colectivos. No se trata de una simple lista, sino de una herramienta de configuración detallada donde se especifican las condiciones económicas de cada convenio. Aquí se registran las tarifas especiales por tratamiento, los porcentajes de cobertura, los copagos fijos, las exclusiones y las fechas de vigencia de cada acuerdo. Su principal propósito es automatizar y estandarizar el cálculo de presupuestos y facturas para pacientes asegurados, eliminando errores manuales y garantizando la aplicación correcta de las tarifas pactadas. Cuando un miembro del personal de recepción o un doctor crea un plan de tratamiento para un paciente con seguro, el ERP consulta en tiempo real los datos configurados en esta sección para determinar qué parte cubre la aseguradora y cuál es el coste para el paciente. Por tanto, esta funcionalidad es crítica para la transparencia financiera con el paciente, la correcta facturación a las aseguradoras y la generación de informes precisos sobre la rentabilidad de cada convenio.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-mutuas-seguros/`

Esta funcionalidad se encuentra dentro de la feature 'gestion-mutuas-seguros'. La página principal, '/pages/ConveniosAcuerdosPage.tsx', renderiza la interfaz principal para listar y gestionar los convenios. Utiliza componentes de '/components/' como 'ConveniosDataTable' para mostrar la lista, 'ConvenioFormModal' para la creación/edición, y 'CoberturaTratamientoInput' para definir las reglas de cada tratamiento dentro del formulario. Las interacciones con el backend se gestionan a través de funciones definidas en '/apis/conveniosApi.ts', que realizan las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/gestion-mutuas-seguros/pages/ConveniosAcuerdosPage.tsx`
- `/features/gestion-mutuas-seguros/components/ConveniosDataTable.tsx`
- `/features/gestion-mutuas-seguros/components/ConvenioFormModal.tsx`
- `/features/gestion-mutuas-seguros/components/FiltrosConvenios.tsx`
- `/features/gestion-mutuas-seguros/components/DetalleCoberturaConvenio.tsx`
- `/features/gestion-mutuas-seguros/apis/conveniosApi.ts`

### Componentes React

- ConveniosDataTable
- ConvenioFormModal
- FiltrosConvenios
- DetalleCoberturaConvenio
- SelectorTratamientos

## 🔌 APIs Backend

Las APIs para 'Convenios y Acuerdos' proporcionan una interfaz RESTful para realizar operaciones CRUD completas sobre los convenios y sus complejas reglas de cobertura. Permiten listar convenios con filtros, crear nuevos acuerdos, obtener los detalles de uno específico (incluyendo todas sus tarifas por tratamiento) y actualizarlo o desactivarlo.

### `GET` `/api/convenios`

Obtiene una lista paginada y filtrada de todos los convenios. Permite filtrar por mutua, estado (activo/inactivo) y buscar por nombre.

**Parámetros:** page (number), limit (number), mutuaId (string), estado (string), search (string)

**Respuesta:** Un objeto con una lista de convenios y metadatos de paginación.

### `POST` `/api/convenios`

Crea un nuevo convenio. El body debe incluir los datos generales y un array con las coberturas específicas por tratamiento.

**Parámetros:** Body (JSON con datos del convenio)

**Respuesta:** El objeto del convenio recién creado.

### `GET` `/api/convenios/:id`

Obtiene los detalles completos de un convenio específico, incluyendo todas sus coberturas y tarifas especiales.

**Parámetros:** id (string, ID del convenio)

**Respuesta:** El objeto completo del convenio solicitado.

### `PUT` `/api/convenios/:id`

Actualiza un convenio existente. Permite modificar datos generales y añadir, editar o eliminar coberturas de tratamientos.

**Parámetros:** id (string, ID del convenio), Body (JSON con los datos a actualizar)

**Respuesta:** El objeto del convenio actualizado.

### `DELETE` `/api/convenios/:id`

Realiza un borrado lógico (soft delete) del convenio, cambiándolo a estado 'inactivo' para mantener la integridad histórica de los datos.

**Parámetros:** id (string, ID del convenio)

**Respuesta:** Un mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con el modelo 'Convenio', que es el más importante. Este modelo tiene una referencia al modelo 'Mutua' y contiene un array de subdocumentos para las 'coberturas'. El 'ConvenioController' contiene la lógica de negocio para gestionar estos acuerdos, y las rutas se definen en el archivo de rutas correspondiente.

### Models

#### Convenio

mutua: { type: ObjectId, ref: 'Mutua' }, nombre: String, codigo: String, fechaInicio: Date, fechaFin: Date, estado: { type: String, enum: ['activo', 'inactivo', 'borrador'] }, notas: String, coberturas: [{ tratamiento: { type: ObjectId, ref: 'Tratamiento' }, tipo: { type: String, enum: ['porcentaje', 'copago_fijo', 'tarifa_especial'] }, valor: Number, notas_cobertura: String }]

#### Mutua

nombre: String, cif: String, personaContacto: String, email: String, telefono: String, direccion: String

### Controllers

#### ConvenioController

- getAllConvenios
- createConvenio
- getConvenioById
- updateConvenio
- deleteConvenio

### Routes

#### `/api/convenios`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id

## 🔄 Flujos

1. El Contable accede a la página, ve la lista de convenios existentes y utiliza los filtros para encontrar rápidamente el de una mutua específica.
2. El Director crea un nuevo convenio: hace clic en 'Nuevo Convenio', selecciona la mutua de una lista, define el nombre y las fechas de vigencia.
3. Dentro del formulario del nuevo convenio, el Director añade líneas de cobertura. Para cada línea, busca y selecciona un tratamiento del catálogo de la clínica (ej: 'Endodoncia'), elige el tipo de cobertura ('porcentaje') e introduce el valor (ej: '80').
4. Un miembro del equipo financiero edita un convenio existente para reflejar una nueva negociación anual, actualizando las tarifas de varios implantes y extendiendo la fecha de fin del acuerdo.
5. Al finalizar un contrato, el Admin busca el convenio correspondiente y lo cambia de estado 'activo' a 'inactivo' para que no se pueda seleccionar en nuevos presupuestos, pero se mantenga para consultas históricas.

## 📝 User Stories

- Como Contable, quiero crear, ver, editar y desactivar convenios con aseguradoras para mantener actualizada la base de datos de precios y coberturas.
- Como Director General, quiero tener una visión general de todos los convenios y sus fechas de vigencia para tomar decisiones estratégicas sobre las relaciones con las aseguradoras.
- Como Contable, quiero poder definir para cada tratamiento dentro de un convenio si la cobertura es un porcentaje, un copago fijo o una tarifa especial, para reflejar con precisión los acuerdos.
- Como Director General, quiero poder buscar y filtrar convenios por nombre de la mutua o estado (activo/inactivo) para encontrar información rápidamente.
- Como Contable, quiero que al crear un presupuesto para un paciente, el sistema consulte automáticamente el convenio de su mutua para aplicar los precios correctos sin intervención manual.

## ⚙️ Notas Técnicas

- Seguridad: El acceso a la creación y edición de convenios debe estar estrictamente limitado a los roles financieros y de dirección. Implementar un log de auditoría para registrar quién crea o modifica un convenio y cuándo.
- Rendimiento: La lista de tratamientos para añadir a un convenio puede ser muy larga. Usar un componente de búsqueda con 'lazy loading' o paginación para una mejor experiencia de usuario.
- Integridad de Datos: Es crucial utilizar borrado lógico (soft delete) en lugar de borrado físico. Un convenio inactivo debe permanecer en la base de datos para garantizar la consistencia de facturas y presupuestos históricos.
- Validación: El backend debe validar que la 'fechaFin' no sea anterior a la 'fechaInicio' y que los valores de cobertura sean numéricos y lógicos. También debe asegurar que no se pueda asociar el mismo tratamiento dos veces al mismo convenio.
- Atomicidad: Las operaciones de actualización que modifican el array de coberturas deben ser atómicas para evitar estados inconsistentes en la base de datos.

