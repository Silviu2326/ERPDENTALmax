# Listado de Pacientes

**Categoría:** Gestión Clínica | **Módulo:** Gestión de Pacientes e Historia Clínica

El 'Listado de Pacientes' es una funcionalidad central y fundamental dentro del módulo de 'Gestión de Pacientes e Historia Clínica'. Actúa como el punto de entrada principal para acceder y gestionar toda la información relacionada con los pacientes de la clínica. No es simplemente una lista estática, sino una herramienta interactiva y potente diseñada para optimizar los flujos de trabajo diarios de diversos roles dentro de la clínica. Permite a los usuarios buscar, filtrar y ordenar la base de datos completa de pacientes de manera eficiente y rápida. Los usuarios pueden localizar a un paciente específico utilizando múltiples criterios como nombre, apellidos, número de DNI, número de historia clínica o teléfono. Además, ofrece filtros avanzados para segmentar la lista por estado (ej. activos, inactivos), o para buscar pacientes sin citas próximas. Desde este listado, se pueden realizar acciones rápidas contextuales, como acceder directamente a la ficha completa del paciente (historia clínica, odontograma, plan de tratamiento), crear una nueva cita, registrar un pago o generar un presupuesto, integrándose así con otros módulos del ERP como Agenda y Facturación. Su propósito es centralizar el acceso a la información del paciente, garantizando que el personal, desde recepción hasta los odontólogos, tenga una vista unificada y actualizada, mejorando la coordinación, la eficiencia administrativa y la calidad de la atención al paciente.

## 👥 Roles de Acceso

- Odontólogo
- Higienista
- Recepción / Secretaría
- Call Center

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-pacientes-historia-clinica/`

Esta funcionalidad se encuentra dentro de la carpeta de la feature 'gestion-pacientes-historia-clinica'. La subcarpeta '/pages' contiene el componente principal 'ListadoPacientesPage.tsx' que renderiza la página completa. La carpeta '/components' alberga los componentes reutilizables que conforman la página, como 'TablaListadoPacientes.tsx' para mostrar los datos, 'FiltrosBusquedaPacientes.tsx' para la barra de búsqueda y filtros, y 'PaginacionListado.tsx' para la navegación entre páginas. Finalmente, la carpeta '/apis' contiene el archivo 'pacientesApi.ts' que encapsula las llamadas a la API del backend utilizando, por ejemplo, Axios o Fetch para obtener, crear o modificar datos de pacientes.

### Archivos Frontend

- `/features/gestion-pacientes-historia-clinica/pages/ListadoPacientesPage.tsx`
- `/features/gestion-pacientes-historia-clinica/components/TablaListadoPacientes.tsx`
- `/features/gestion-pacientes-historia-clinica/components/FiltrosBusquedaPacientes.tsx`
- `/features/gestion-pacientes-historia-clinica/components/PaginacionListado.tsx`
- `/features/gestion-pacientes-historia-clinica/apis/pacientesApi.ts`

### Componentes React

- TablaListadoPacientes
- FiltrosBusquedaPacientes
- PaginacionListado
- BotonNuevoPaciente
- FilaPaciente
- MenuAccionesRapidasPaciente

## 🔌 APIs Backend

Las APIs para el listado de pacientes deben soportar búsqueda compleja, filtrado, ordenación y paginación para manejar eficientemente grandes volúmenes de datos. El endpoint principal debe ser flexible para aceptar múltiples parámetros de consulta.

### `GET` `/api/pacientes`

Obtiene una lista paginada y filtrada de pacientes. Es el endpoint principal que alimenta la tabla del listado. Permite buscar por un término general y filtrar por campos específicos.

**Parámetros:** page: number (Número de página, por defecto 1), limit: number (Resultados por página, por defecto 20), search: string (Término de búsqueda para nombre, apellidos, DNI, teléfono), status: string (Filtra por estado, ej: 'activo', 'inactivo'), sortBy: string (Campo por el que ordenar, ej: 'apellidos'), sortOrder: string ('asc' o 'desc')

**Respuesta:** Un objeto JSON con: { data: [array de objetos paciente], pagination: { total: number, page: number, limit: number, totalPages: number } }

### `GET` `/api/pacientes/:id`

Obtiene los datos completos de un único paciente. Se utiliza al navegar desde el listado a la ficha detallada del paciente.

**Parámetros:** id: string (El ID del paciente en MongoDB)

**Respuesta:** Un objeto JSON con los datos completos del paciente solicitado.

## 🗂️ Estructura Backend (MERN)

El backend sigue una estructura MVC. El modelo 'Paciente' define el esquema de datos en MongoDB. El 'PacienteController' contiene la lógica de negocio para gestionar las peticiones, incluyendo la construcción de consultas complejas a la base de datos para el filtrado y paginación. Las rutas en 'pacientesRoutes' exponen los endpoints del controlador al cliente.

### Models

#### Paciente

{ nombre: String, apellidos: String, fechaNacimiento: Date, DNI: { type: String, unique: true }, numeroHistoriaClinica: { type: String, unique: true }, telefonos: [String], email: String, direccion: Object, genero: String, status: { type: String, enum: ['activo', 'inactivo', 'archivado'], default: 'activo' }, fechaAlta: { type: Date, default: Date.now }, ultimaVisita: Date, saldoPendiente: Number, notasAdministrativas: String, clinicaId: { type: Schema.Types.ObjectId, ref: 'Clinica' } }

### Controllers

#### PacienteController

- getAllPacientes
- getPacienteById

### Routes

#### `/api/pacientes`

- router.get('/', authMiddleware, checkRole(['...']), PacienteController.getAllPacientes);
- router.get('/:id', authMiddleware, checkRole(['...']), PacienteController.getPacienteById);

## 🔄 Flujos

1. El usuario (Recepción) accede a la página 'Listado de Pacientes'. El frontend realiza una llamada a `GET /api/pacientes` para cargar la primera página de pacientes activos, ordenados por fecha de alta.
2. El usuario escribe 'García' en el campo de búsqueda. Con cada pulsación (con debouncing), se envía una petición `GET /api/pacientes?search=García` y la tabla se actualiza con los resultados.
3. El usuario hace clic en el encabezado de la columna 'Saldo Pendiente' para ordenar de mayor a menor. Se ejecuta una llamada a `GET /api/pacientes?sortBy=saldoPendiente&sortOrder=desc`.
4. El usuario necesita ver los pacientes inactivos. Selecciona el filtro 'Estado' y elige 'Inactivo', lo que dispara una llamada a `GET /api/pacientes?status=inactivo`.
5. Al encontrar al paciente deseado, el usuario hace clic en su nombre en la tabla. El sistema utiliza el ID del paciente para navegar a la ruta de su ficha detallada (ej. `/gestion-pacientes/ficha/60d21b4667d0d8992e610c85`).

## 📝 User Stories

- Como personal de Recepción, quiero buscar a un paciente por su DNI o teléfono de forma instantánea para poder confirmar su cita cuando llega a la clínica.
- Como Odontólogo, quiero acceder rápidamente al listado de pacientes y filtrar por los que tienen cita hoy para revisar sus historias clínicas antes de que entren a consulta.
- Como Higienista, quiero poder buscar un paciente por su nombre y apellidos para acceder directamente a su odontograma y registrar el tratamiento de higiene realizado.
- Como personal de Call Center, quiero tener una vista rápida de los datos de contacto y el saldo pendiente de un paciente mientras hablo con él por teléfono para resolver sus dudas administrativas.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial implementar la paginación y el filtrado del lado del servidor. El frontend nunca debe recibir la lista completa de pacientes. La consulta a MongoDB debe ser eficiente, utilizando índices en los campos de búsqueda principales (DNI, apellidos, numeroHistoriaClinica, telefono).
- UX (Experiencia de Usuario): Implementar 'debouncing' en la barra de búsqueda para evitar llamadas excesivas a la API mientras el usuario escribe. Mostrar un esqueleto de carga (skeleton loader) en la tabla mientras se esperan los datos del servidor.
- Seguridad: Proteger todos los endpoints de la API con middleware de autenticación y autorización. Asegurarse de que un usuario solo pueda ver pacientes de la clínica o clínicas a las que tiene acceso asignado (en un entorno multi-clínica).
- Gestión de Estado: Utilizar una librería de gestión de estado como React Query o SWR es altamente recomendable. Esto simplifica el manejo del fetching de datos, cacheo, paginación y actualizaciones en tiempo real, reduciendo la cantidad de código manual y mejorando la robustez de la aplicación.
- Virtualización de Listas: Para clínicas con decenas de miles de pacientes, considerar implementar virtualización en la tabla (ej. usando `react-virtualized` o `tanstack-virtual`) para renderizar solo las filas visibles en la pantalla, mejorando drásticamente el rendimiento del renderizado en el navegador.

