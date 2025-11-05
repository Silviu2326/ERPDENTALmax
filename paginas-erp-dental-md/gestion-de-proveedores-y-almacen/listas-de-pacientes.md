# Listas de Pacientes

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad 'Listas de Pacientes' es una herramienta de segmentación y CRM avanzada, diseñada para crear, gestionar y utilizar listas dinámicas de pacientes basadas en una multitud de criterios. Aunque su nombre sugiere una función puramente de gestión de pacientes, su ubicación en el módulo 'Gestión de Proveedores y Almacén' revela su propósito estratégico principal: vincular el comportamiento del paciente con los recursos de la clínica. Permite a los roles autorizados generar listas no solo por datos demográficos o historial clínico, sino también por el consumo de productos específicos del almacén (ej. kits de blanqueamiento, cepillos especiales) o por tratamientos que han requerido materiales de proveedores concretos (ej. implantes de una marca específica). Esta conexión es vital para campañas de marketing dirigidas, gestión de la lealtad, seguimiento de garantías de productos/materiales y optimización del inventario. Por ejemplo, el equipo de marketing puede crear una lista de todos los pacientes que compraron un 'Kit de Blanqueamiento X' en los últimos 6 meses para enviarles una oferta de recarga. Un director puede analizar qué pacientes están asociados a un lote de implantes de un proveedor específico en caso de una alerta de calidad. En esencia, transforma la base de datos de pacientes en un recurso de inteligencia de negocio, conectando directamente la gestión clínica y de pacientes con la gestión de la cadena de suministro y el inventario de la clínica.

## 👥 Roles de Acceso

- Marketing / CRM
- Recepción / Secretaría
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Esta funcionalidad reside dentro del módulo padre 'gestion-proveedores-almacen'. La página principal, 'ListasPacientesPage.tsx', se encuentra en la subcarpeta '/pages'. Esta página ensambla varios componentes reutilizables de la carpeta '/components', como el panel de filtros complejos ('FiltrosAvanzadosPacientes'), la tabla de resultados paginada ('TablaResultadosPacientes') y los modales para acciones ('ModalAccionesLista'). Todas las interacciones con el backend se encapsulan en funciones dentro de '/apis/listasPacientesApi.ts', que gestionan las llamadas a los endpoints de la API RESTful.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/ListasPacientesPage.tsx`
- `/features/gestion-proveedores-almacen/components/FiltrosAvanzadosPacientes.tsx`
- `/features/gestion-proveedores-almacen/components/TablaResultadosPacientes.tsx`
- `/features/gestion-proveedores-almacen/components/ModalExportarLista.tsx`
- `/features/gestion-proveedores-almacen/components/PanelListasGuardadas.tsx`
- `/features/gestion-proveedores-almacen/apis/listasPacientesApi.ts`

### Componentes React

- ListasPacientesPage
- FiltrosAvanzadosPacientes
- TablaResultadosPacientes
- PaginacionTabla
- ModalExportarLista
- PanelListasGuardadas
- FormularioGuardarLista

## 🔌 APIs Backend

La API para esta funcionalidad debe ser robusta y flexible, permitiendo consultas complejas y paginadas sobre la colección de pacientes. Se utiliza un endpoint POST para el filtrado principal para poder manejar un cuerpo de solicitud JSON con múltiples criterios, lo cual es más limpio y potente que los parámetros de consulta GET.

### `POST` `/api/pacientes/listas/filtrar`

Obtiene una lista paginada de pacientes aplicando un conjunto complejo de filtros. Es el endpoint principal de la funcionalidad.

**Parámetros:** body: { filtros: { demograficos, historialClinico, comprasProducto, fechasVisita, etc. }, paginacion: { pagina, limite }, orden: { campo, direccion } }

**Respuesta:** JSON: { data: [lista de pacientes], total: number, paginaActual: number, totalPaginas: number }

### `GET` `/api/pacientes/listas/guardadas`

Recupera todas las listas de filtros previamente guardadas por los usuarios de la clínica.

**Respuesta:** JSON: [ { id, nombre, filtros, creadoPor, fechaCreacion }, ... ]

### `POST` `/api/pacientes/listas/guardadas`

Guarda un nuevo conjunto de filtros como una lista reutilizable para uso futuro.

**Parámetros:** body: { nombre: string, filtros: object }

**Respuesta:** JSON del objeto de la lista guardada recién creada.

### `DELETE` `/api/pacientes/listas/guardadas/:id`

Elimina una lista de filtros guardada.

**Parámetros:** params: { id: string (ObjectId de la lista) }

**Respuesta:** JSON: { message: 'Lista eliminada correctamente' }

## 🗂️ Estructura Backend (MERN)

El backend utiliza el modelo 'Paciente' como fuente principal de datos. Para soportar los filtros complejos, este modelo debe estar bien estructurado con referencias a otras colecciones como 'Tratamiento' y 'Producto'. Se crea un nuevo modelo 'ListaGuardada' para persistir los filtros. Un controlador específico, 'ListaPacientesController', contiene la lógica para construir las consultas a MongoDB (posiblemente usando el Aggregation Framework) y manejar las listas guardadas.

### Models

#### Paciente

Contiene campos clave para el filtrado: nombre, apellidos, fechaNacimiento, email, telefono, genero, fechaPrimeraVisita, ultimaVisita, saldo, historialTratamientos: [{ tratamientoId: ObjectId, fecha: Date, doctorId: ObjectId }], comprasProductos: [{ productoId: ObjectId, fecha: Date, cantidad: Number, precio: Number }]

#### ListaGuardada

nombre: String, filtros: Mixed (Object), creadoPor: { type: ObjectId, ref: 'User' }, idSede: { type: ObjectId, ref: 'Sede' }, createdAt: Date

#### Producto

nombre: String, descripcion: String, proveedorId: { type: ObjectId, ref: 'Proveedor' }, stock: Number

### Controllers

#### ListaPacientesController

- filtrarPacientes
- obtenerListasGuardadas
- crearListaGuardada
- eliminarListaGuardada

### Routes

#### `/api/pacientes/listas`

- POST /filtrar
- GET /guardadas
- POST /guardadas
- DELETE /guardadas/:id

## 🔄 Flujos

1. El usuario de Marketing accede a la página 'Listas de Pacientes', abre el panel de filtros y selecciona: 'Tratamiento realizado: Blanqueamiento Dental' y 'Producto comprado: Kit Blanqueamiento Domicilio'.
2. El sistema envía la solicitud al backend, que busca en la base de datos los pacientes que cumplen ambos criterios y devuelve una lista paginada.
3. El usuario visualiza la lista de 50 pacientes, selecciona todos y elige la acción 'Añadir a campaña de email'.
4. Posteriormente, el usuario decide guardar esta búsqueda. Hace clic en 'Guardar lista', le asigna el nombre 'Pacientes Blanqueamiento + Kit' y la guarda para reutilizarla en el futuro.
5. Un recepcionista utiliza una lista guardada llamada 'Pacientes con cita mañana' para generar rápidamente la lista y realizar llamadas de confirmación.

## 📝 User Stories

- Como responsable de Marketing, quiero filtrar pacientes por los productos que han comprado en la clínica para enviarles campañas de marketing de productos relacionados o de reposición.
- Como Director de clínica, quiero generar una lista de pacientes que han sido tratados con implantes de un proveedor específico en un rango de fechas para realizar un seguimiento de calidad.
- Como Secretaria, quiero crear una lista de todos los pacientes con saldo deudor superior a 100€ que no tienen cita programada para contactarles y gestionar el cobro.
- Como gestor de CRM, quiero guardar conjuntos de filtros complejos como 'Pacientes VIP' o 'Pacientes Inactivos' para no tener que reconfigurarlos cada vez que necesite acceder a ellos.
- Como Admin multisede, quiero poder filtrar las listas de pacientes por sede para analizar los datos y realizar acciones de marketing localizadas.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial crear índices compuestos en la colección de Pacientes en MongoDB sobre los campos más utilizados para filtrar (ej. 'ultimaVisita', 'historialTratamientos.tratamientoId', 'comprasProductos.productoId'). El uso del Aggregation Framework de MongoDB será necesario para las consultas complejas que involucren joins y filtrados anidados.
- Seguridad y Privacidad: El acceso a esta funcionalidad debe estar estrictamente controlado por roles. La exportación de datos debe ser registrada y auditada. Cumplimiento con LOPD/GDPR es mandatorio, asegurando que los datos personales no se expongan indebidamente.
- Paginación: La paginación debe ser implementada en el backend para evitar sobrecargar el frontend y la red con conjuntos de datos masivos. Nunca se debe enviar la base de datos completa de pacientes al cliente.
- Gestión de Estado Frontend: Se recomienda el uso de una librería de gestión de estado como Redux Toolkit o Zustand para manejar el estado complejo de los filtros, los resultados de la tabla y la paginación.
- Exportación de Datos: Para listas muy grandes, la funcionalidad de exportación (CSV/PDF) debe ser procesada como una tarea en segundo plano (background job) en el servidor para no bloquear la interfaz del usuario, notificando al usuario cuando el archivo esté listo para descargar.

