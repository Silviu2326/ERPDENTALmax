# Nueva Ficha de Paciente

**Categoría:** Gestión Clínica | **Módulo:** Gestión de Pacientes e Historia Clínica

La funcionalidad 'Nueva Ficha de Paciente' es el punto de entrada fundamental para cualquier individuo que vaya a ser atendido en la clínica. Constituye la piedra angular del módulo 'Gestión de Pacientes e Historia Clínica', ya que aquí se origina el registro digital que acompañará al paciente durante toda su relación con la clínica. Su propósito principal es recopilar de manera estructurada, precisa y completa toda la información demográfica, de contacto, médica y administrativa inicial. Esto incluye desde datos básicos como nombre y DNI hasta información crítica para el tratamiento como alergias, enfermedades preexistentes y medicación actual (anamnesis), así como los detalles del seguro dental para la gestión de cobros. Esta página está diseñada para ser utilizada por el personal de primera línea, como recepción y call center, que necesita una herramienta ágil y a la vez exhaustiva para minimizar tiempos de espera y errores en la captura de datos. Dentro del ERP, la creación de una ficha de paciente es un prerequisito indispensable para poder realizar cualquier otra acción asociada a él, como agendar una cita, generar un presupuesto, registrar un tratamiento o emitir una factura. La calidad de los datos introducidos en esta pantalla impacta directamente en la eficiencia de todos los demás módulos.

## 👥 Roles de Acceso

- Recepción / Secretaría
- Call Center

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-pacientes-historia-clinica/`

La funcionalidad se encuentra dentro de la feature 'gestion-pacientes-historia-clinica'. La página principal, 'NuevaFichaPacientePage.tsx', reside en la subcarpeta '/pages' y actúa como contenedor. Esta página renderiza un componente principal, 'FormularioCreacionPaciente', que a su vez se compone de varios subcomponentes más pequeños y reutilizables ubicados en '/components', como 'SeccionDatosPersonales', 'SeccionAnamnesis' y 'SeccionDatosSeguro'. Las llamadas a la API para crear el paciente y verificar duplicados se encapsulan en funciones dentro de la carpeta '/apis', manteniendo la lógica de comunicación separada de la UI.

### Archivos Frontend

- `/features/gestion-pacientes-historia-clinica/pages/NuevaFichaPacientePage.tsx`
- `/features/gestion-pacientes-historia-clinica/components/FormularioCreacionPaciente.tsx`
- `/features/gestion-pacientes-historia-clinica/components/BuscadorPacientesDuplicados.tsx`
- `/features/gestion-pacientes-historia-clinica/components/SeccionDatosPersonales.tsx`
- `/features/gestion-pacientes-historia-clinica/components/SeccionAnamnesis.tsx`
- `/features/gestion-pacientes-historia-clinica/components/SeccionDatosSeguro.tsx`
- `/features/gestion-pacientes-historia-clinica/apis/pacientesApi.ts`

### Componentes React

- FormularioCreacionPaciente
- BuscadorPacientesDuplicados
- SeccionDatosPersonales
- SeccionContactoEmergencia
- SeccionAnamnesis
- SeccionDatosSeguro
- InputControlado
- SelectorFecha

## 🔌 APIs Backend

Se requieren dos endpoints principales: uno para crear el nuevo paciente (POST) y otro para buscar posibles duplicados en tiempo real mientras el usuario rellena el formulario (GET), evitando así la creación de registros redundantes.

### `POST` `/api/pacientes`

Crea un nuevo registro de paciente en la base de datos con toda la información recopilada en el formulario.

**Parámetros:** Body: Objeto JSON con la estructura completa de datos del paciente.

**Respuesta:** Objeto JSON con los datos del paciente recién creado, incluyendo su _id asignado por MongoDB.

### `GET` `/api/pacientes/buscar`

Busca pacientes existentes que coincidan con ciertos criterios (DNI, nombre, email) para prevenir la creación de duplicados.

**Parámetros:** Query: ?dni=string, Query: ?nombre=string&apellidos=string, Query: ?email=string

**Respuesta:** Array de objetos de pacientes que coinciden con la búsqueda. Devuelve un array vacío si no hay coincidencias.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo 'Paciente' de Mongoose para definir el esquema de datos. Un 'PacienteController' gestiona la lógica de negocio, como la validación de datos y la interacción con la base de datos. Las rutas son definidas en 'pacienteRoutes.js' y exponen los endpoints de la API RESTful para ser consumidos por el frontend.

### Models

#### Paciente

datosPersonales: { nombre, apellidos, dni, fechaNacimiento, genero }, contacto: { email, telefono, direccion: { calle, ciudad, codigoPostal } }, historiaMedica: { alergias: [string], enfermedadesCronicas: [string], medicacionActual: [string], notas: string }, datosSeguro: { aseguradora, numeroPoliza, tipoPlan }, administrativo: { fechaRegistro, clinicaAsociada: ObjectId, estado: ('Activo', 'Inactivo') }

### Controllers

#### PacienteController

- crearPaciente
- buscarPacientesPorCriterio

### Routes

#### `/api/pacientes`

- POST /
- GET /buscar

## 🔄 Flujos

1. El usuario (Recepción/Call Center) accede a la página 'Nueva Ficha de Paciente' desde el menú principal o un acceso directo.
2. Mientras el usuario introduce el DNI del paciente, el sistema realiza una llamada en segundo plano a la API de búsqueda para detectar posibles duplicados y muestra una alerta si encuentra coincidencias.
3. El usuario completa los campos del formulario, organizados en secciones: Datos Personales, Contacto, Historia Médica (Anamnesis) y Seguro Dental.
4. El sistema realiza validaciones en tiempo real en el frontend (ej: formato de email, DNI, campos obligatorios).
5. Al hacer clic en 'Guardar Paciente', se envía un objeto JSON con toda la información al endpoint POST /api/pacientes.
6. El backend realiza una segunda validación de los datos. Si es correcta, crea el nuevo documento en la colección 'pacientes' de MongoDB.
7. Tras la creación exitosa, el sistema muestra un mensaje de confirmación y redirige al usuario a la ficha completa del paciente recién creado para que pueda continuar con otras gestiones (ej: agendar primera cita).

## 📝 User Stories

- Como recepcionista, quiero crear una nueva ficha de paciente de forma rápida y estructurada para registrar a una persona que acude a la clínica por primera vez sin hacerle esperar.
- Como agente de Call Center, quiero que el sistema me avise si un paciente ya existe al introducir su DNI para evitar crear registros duplicados cuando me llaman para pedir cita.
- Como recepcionista, quiero poder introducir los datos del seguro del paciente en el momento de su registro para agilizar los trámites de facturación posteriores.
- Como personal administrativo, quiero que el formulario tenga campos obligatorios como nombre, apellidos y teléfono, para garantizar que siempre tengamos la información mínima de contacto.

## ⚙️ Notas Técnicas

- Validación de Datos: Implementar validación tanto en el frontend (con librerías como Zod o Yup integradas con React Hook Form) como en el backend (usando middleware de Express y validadores de Mongoose) para asegurar la integridad de los datos.
- Seguridad: Todo el tráfico de datos debe ser bajo HTTPS. Se debe cumplir con la normativa de protección de datos (LOPD/GDPR) para el almacenamiento y tratamiento de datos médicos sensibles.
- Experiencia de Usuario (UX): Utilizar un diseño de formulario multi-paso o con secciones colapsables (accordion) para no abrumar al usuario. Implementar un mecanismo de 'debounce' en la búsqueda de duplicados para optimizar las llamadas a la API mientras el usuario escribe.
- Atomicidad: La creación del paciente en la base de datos es una operación atómica por defecto en MongoDB al tratarse de la inserción de un único documento.
- Integración Multi-Clínica: El campo 'clinicaAsociada' en el modelo Paciente es esencial para sistemas que gestionan múltiples sedes, asegurando que cada paciente esté vinculado a su clínica de origen.

