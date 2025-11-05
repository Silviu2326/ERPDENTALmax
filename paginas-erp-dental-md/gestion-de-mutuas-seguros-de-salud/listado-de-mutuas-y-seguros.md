# Listado de Mutuas y Seguros

**Categoría:** Gestión Financiera | **Módulo:** Gestión de Mutuas/Seguros de Salud

La funcionalidad 'Listado de Mutuas y Seguros' es el repositorio centralizado donde se gestiona toda la información relativa a las compañías de seguros de salud y mutuas con las que la clínica dental tiene acuerdos. Esta página permite al personal autorizado crear, consultar, modificar y desactivar los perfiles de cada aseguradora. Su propósito principal es estandarizar y agilizar los procesos administrativos y financieros vinculados a pacientes con cobertura. Aquí se almacenan datos cruciales como el nombre comercial, la razón social, el CIF, datos de contacto (teléfono, email, persona de contacto), y las condiciones específicas del acuerdo, como los porcentajes de cobertura por tipo de tratamiento o los topes anuales. Dentro del ERP, esta funcionalidad es fundamental para el módulo padre 'Gestión de Mutuas/Seguros de Salud', ya que provee los datos maestros que se utilizarán en otras áreas. Por ejemplo, al registrar un nuevo paciente, el personal de recepción podrá seleccionar su mutua desde este listado. Asimismo, al generar un presupuesto o una factura, el sistema consultará las condiciones de cobertura de la mutua del paciente para calcular automáticamente la parte que cubre el seguro y la que debe abonar el paciente. Esto reduce errores manuales, mejora la transparencia con el paciente y optimiza el proceso de reclamación y cobro a las aseguradoras.

## 👥 Roles de Acceso

- Contable / Finanzas
- Recepción / Secretaría
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-mutuas-seguros/`

Esta funcionalidad se encuentra dentro de la carpeta 'gestion-mutuas-seguros'. La página principal, 'ListadoMutuasPage.tsx', reside en la subcarpeta '/pages' y se encarga de orquestar los demás componentes. La subcarpeta '/components' contiene los elementos reutilizables de la interfaz: 'MutuasTable.tsx' para mostrar los datos en una tabla interactiva con búsqueda, paginación y ordenación; 'FormularioMutua.tsx', un componente modal o de página para crear y editar los datos de una mutua; y 'BarraBusquedaFiltros.tsx' para filtrar el listado. Las llamadas al backend están encapsuladas en '/apis/mutuasApi.ts', que exporta funciones asíncronas para cada operación CRUD.

### Archivos Frontend

- `/features/gestion-mutuas-seguros/pages/ListadoMutuasPage.tsx`
- `/features/gestion-mutuas-seguros/components/MutuasTable.tsx`
- `/features/gestion-mutuas-seguros/components/FormularioMutua.tsx`
- `/features/gestion-mutuas-seguros/components/BarraBusquedaFiltros.tsx`
- `/features/gestion-mutuas-seguros/apis/mutuasApi.ts`

### Componentes React

- MutuasTable
- FormularioMutua
- BarraBusquedaFiltros
- ModalConfirmacionDesactivar

## 🔌 APIs Backend

Se requiere un conjunto de APIs RESTful para gestionar las operaciones CRUD sobre las mutuas. Estas APIs deben soportar la obtención de listados con paginación y filtros, la creación, la actualización y la desactivación (soft delete) de registros.

### `GET` `/api/mutuas`

Obtiene un listado paginado y filtrado de todas las mutuas. Permite buscar por nombre o CIF y filtrar por estado (activas/inactivas).

**Parámetros:** page (number): Número de página, limit (number): Resultados por página, search (string): Término de búsqueda, estado (string): 'activo' o 'inactivo'

**Respuesta:** Un objeto con la lista de mutuas y metadatos de paginación (total de páginas, total de resultados).

### `GET` `/api/mutuas/:id`

Obtiene los detalles completos de una mutua específica por su ID.

**Parámetros:** id (string): ID de la mutua

**Respuesta:** Un objeto JSON con los datos de la mutua.

### `POST` `/api/mutuas`

Crea una nueva mutua en el sistema.

**Parámetros:** Body (JSON): Objeto con los datos de la nueva mutua (nombre, CIF, contacto, etc.).

**Respuesta:** El objeto de la mutua recién creada, incluyendo su ID.

### `PUT` `/api/mutuas/:id`

Actualiza la información de una mutua existente.

**Parámetros:** id (string): ID de la mutua a actualizar, Body (JSON): Objeto con los campos a modificar.

**Respuesta:** El objeto de la mutua con los datos actualizados.

### `DELETE` `/api/mutuas/:id`

Desactiva una mutua (soft delete). Cambia su estado a 'inactivo' pero no la elimina de la base de datos para mantener la integridad referencial con registros históricos.

**Parámetros:** id (string): ID de la mutua a desactivar

**Respuesta:** Un mensaje de confirmación.

## 🗂️ Estructura Backend (MERN)

El backend utiliza la estructura MERN. El modelo 'Mutua.js' define el esquema en MongoDB. El 'mutuaController.js' contiene la lógica de negocio para cada endpoint (obtener, crear, actualizar, eliminar). El archivo 'mutuaRoutes.js' define las rutas de la API y las asocia a las funciones correspondientes del controlador, aplicando middleware para autenticación y autorización.

### Models

#### Mutua

nombreComercial (String, required), razonSocial (String), cif (String, required, unique), direccion (Object), contacto (Object con telefono y email), condicionesGenerales (String), activo (Boolean, default: true), clinicaId (ObjectId, ref: 'Clinica', required para multisede).

### Controllers

#### mutuaController

- getAllMutuas
- getMutuaById
- createMutua
- updateMutua
- deleteMutua

### Routes

#### `/api/mutuas`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id

## 🔄 Flujos

1. El usuario de finanzas accede al listado, busca una mutua por su nombre, hace clic en 'editar', actualiza el número de teléfono de contacto y guarda los cambios.
2. El personal de recepción recibe a un paciente nuevo, busca su seguro en el listado para confirmar que la clínica trabaja con él y verifica las condiciones generales.
3. Un administrador general añade una nueva compañía de seguros con la que se acaba de firmar un convenio, rellenando todos sus datos en el formulario de creación.
4. Un contable desactiva una mutua con la que ya no se colabora. La mutua desaparece de las opciones para nuevos pacientes, pero los informes financieros históricos siguen mostrando su nombre.

## 📝 User Stories

- Como recepcionista, quiero buscar y visualizar rápidamente los datos de contacto de una mutua para poder llamar y verificar la cobertura de un paciente.
- Como contable, quiero añadir una nueva mutua al sistema con todos sus datos fiscales y de contacto para poder empezar a facturarle correctamente.
- Como director de clínica, quiero ver un listado de todas las mutuas activas e inactivas para tener una visión general de nuestros partners de seguros.
- Como responsable de finanzas, quiero poder editar las condiciones y datos de una mutua existente cuando nos notifican un cambio, para asegurar que la información del sistema esté siempre actualizada.
- Como administrador, quiero desactivar (en lugar de borrar) una mutua para que no se puedan crear nuevos presupuestos asociados a ella, pero sin perder el histórico de facturación.

## ⚙️ Notas Técnicas

- Implementar 'soft delete' mediante un campo 'activo' (booleano) en el modelo Mutua para preservar la integridad de los datos históricos de pacientes y facturas.
- La API GET /api/mutuas debe usar paginación en el lado del servidor para garantizar un buen rendimiento incluso con un gran número de registros.
- Es crucial implementar validación de datos en el backend (ej. con Zod o Joi) para campos como el CIF, asegurando su formato y unicidad.
- Proteger los endpoints de creación, modificación y eliminación (POST, PUT, DELETE) con un middleware de control de acceso basado en roles (RBAC) para que solo el personal autorizado pueda realizar cambios.
- Para sistemas multisede, el modelo Mutua debe incluir una referencia 'clinicaId' para asociar convenios específicos a clínicas concretas, o tener un modelo de 'Acuerdo' intermedio si las condiciones varían por sede.
- El frontend debe gestionar el estado global de las mutuas (ej. con React Context o Redux Toolkit) para evitar llamadas repetidas a la API y mejorar la experiencia de usuario.

