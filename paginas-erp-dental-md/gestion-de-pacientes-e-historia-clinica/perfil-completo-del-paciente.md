# Perfil Completo del Paciente

**Categoría:** Gestión Clínica | **Módulo:** Gestión de Pacientes e Historia Clínica

La página de 'Perfil Completo del Paciente' es el núcleo centralizado de toda la información relativa a un paciente dentro del ERP dental. Funciona como un dashboard integral que consolida datos clínicos, administrativos, financieros y de comunicación, ofreciendo una visión 360 grados indispensable para la toma de decisiones y la gestión diaria. Dentro del módulo padre 'Gestión de Pacientes e Historia Clínica', esta funcionalidad es la culminación de la recopilación de datos, presentándola de forma organizada y accesible. Sirve para que cualquier miembro autorizado del equipo clínico o administrativo pueda, de un vistazo, entender el estado actual del paciente, su historial médico-dental, los tratamientos en curso y finalizados, su situación financiera con la clínica y su historial de citas. Su diseño se basa en la usabilidad, empleando una interfaz de pestañas o secciones para navegar fácilmente entre la información personal, la anamnesis, el odontograma interactivo, los planes de tratamiento, la evolución clínica detallada, los documentos adjuntos (radiografías, consentimientos), el historial de citas y los movimientos económicos. Esta centralización elimina la necesidad de consultar múltiples sistemas o archivos físicos, optimizando drásticamente el tiempo, reduciendo errores y mejorando la calidad de la atención al paciente.

## 👥 Roles de Acceso

- Odontólogo
- Higienista
- Auxiliar / Asistente
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-pacientes-historia-clinica/`

La funcionalidad se encuentra dentro de la feature 'gestion-pacientes-historia-clinica'. La carpeta '/pages/' contiene el archivo principal 'PacientePerfilPage.tsx' que renderiza el perfil completo. La carpeta '/components/' alberga todos los sub-componentes reutilizables que conforman el perfil, como el odontograma, el historial de citas, etc. La carpeta '/apis/' contiene las funciones que realizan las llamadas a los endpoints del backend para obtener y actualizar los datos del paciente.

### Archivos Frontend

- `/features/gestion-pacientes-historia-clinica/pages/PacientePerfilPage.tsx`
- `/features/gestion-pacientes-historia-clinica/components/PacienteHeader.tsx`
- `/features/gestion-pacientes-historia-clinica/components/PacienteInfoGeneralTab.tsx`
- `/features/gestion-pacientes-historia-clinica/components/PacienteHistoriaClinicaTab.tsx`
- `/features/gestion-pacientes-historia-clinica/components/PacienteOdontogramaTab.tsx`
- `/features/gestion-pacientes-historia-clinica/components/PacientePlanesTratamientoTab.tsx`
- `/features/gestion-pacientes-historia-clinica/components/PacienteCitasTab.tsx`
- `/features/gestion-pacientes-historia-clinica/components/PacienteFinancieroTab.tsx`
- `/features/gestion-pacientes-historia-clinica/components/PacienteDocumentosTab.tsx`
- `/features/gestion-pacientes-historia-clinica/apis/pacienteApi.ts`

### Componentes React

- PacientePerfilPage
- PacienteHeader
- InfoGeneralCard
- AnamnesisForm
- HistoriaClinicaTimeline
- OdontogramaInteractivo
- ListaPlanesTratamiento
- TablaCitasPaciente
- ResumenFinancieroPaciente
- GaleriaDocumentos

## 🔌 APIs Backend

Se necesita un conjunto de APIs RESTful para obtener los datos agregados del paciente desde diferentes colecciones de la base de datos (información personal, citas, tratamientos, pagos, etc.) y para actualizar su información.

### `GET` `/api/pacientes/:id/perfil-completo`

Obtiene todos los datos consolidados de un paciente específico, incluyendo información personal, alertas, y resúmenes de otras áreas.

**Parámetros:** id (param): ID del paciente

**Respuesta:** Objeto JSON con los datos completos del paciente, incluyendo objetos anidados para historia clínica, citas, planes de tratamiento, etc.

### `PUT` `/api/pacientes/:id/informacion-general`

Actualiza la información personal, de contacto y de anamnesis del paciente.

**Parámetros:** id (param): ID del paciente, body (json): Objeto con los campos a actualizar.

**Respuesta:** Objeto JSON con los datos actualizados del paciente.

### `GET` `/api/pacientes/:id/evoluciones`

Obtiene la lista paginada de evoluciones de la historia clínica del paciente.

**Parámetros:** id (param): ID del paciente, page (query): Número de página, limit (query): Elementos por página

**Respuesta:** Array de objetos de evolución clínica.

### `GET` `/api/pacientes/:id/documentos`

Obtiene la lista de documentos asociados al paciente.

**Parámetros:** id (param): ID del paciente

**Respuesta:** Array de objetos de documento (con metadatos como nombre, fecha, tipo y URL).

### `POST` `/api/pacientes/:id/documentos`

Sube un nuevo documento para el paciente.

**Parámetros:** id (param): ID del paciente, body (multipart/form-data): Archivo a subir.

**Respuesta:** Objeto JSON con los metadatos del documento subido.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo principal 'Paciente' que se relaciona con otros modelos como 'Cita', 'Tratamiento', 'Pago', etc. El 'PacienteController' contiene la lógica para agregar y servir los datos de manera eficiente, usando 'populate' de Mongoose para resolver las referencias.

### Models

#### Paciente

nombre: String, apellidos: String, fechaNacimiento: Date, genero: String, dni: String, datosContacto: { email: String, telefono: String, direccion: String }, historialMedico: { alergias: [String], enfermedades: [String], medicacionActual: [String] }, alertasMedicas: [String], fechaAlta: Date, notasAdministrativas: String, historiaClinica: [ObjectId(ref: 'EvolucionClinica')], planesTratamiento: [ObjectId(ref: 'PlanTratamiento')], citas: [ObjectId(ref: 'Cita')], documentos: [ObjectId(ref: 'Documento')], saldo: Number

#### EvolucionClinica

paciente: ObjectId(ref: 'Paciente'), profesional: ObjectId(ref: 'Usuario'), fecha: Date, descripcion: String, tipo: String

#### Documento

paciente: ObjectId(ref: 'Paciente'), nombreArchivo: String, url: String, tipo: String, fechaSubida: Date

### Controllers

#### PacienteController

- getPerfilCompletoPaciente
- updateInformacionGeneral
- getEvolucionesPaciente
- getDocumentosPaciente
- uploadDocumentoPaciente

### Routes

#### `/api/pacientes`

- GET /:id/perfil-completo
- PUT /:id/informacion-general
- GET /:id/evoluciones
- GET /:id/documentos
- POST /:id/documentos

## 🔄 Flujos

1. El recepcionista busca un paciente por nombre o DNI. Al seleccionarlo, navega al Perfil Completo para verificar sus datos de contacto y próxima cita.
2. El odontólogo, antes de que el paciente entre a consulta, abre su perfil, revisa las alertas médicas, la última evolución clínica y el odontograma para prepararse.
3. Durante la visita, el higienista accede a la pestaña de 'Historia Clínica' y añade una nueva entrada de 'Evolución' con los detalles del procedimiento de limpieza realizado.
4. El auxiliar de clínica escanea una nueva ortopantomografía, accede al perfil del paciente, va a la pestaña 'Documentos' y sube el archivo, clasificándolo como 'Radiografía'.

## 📝 User Stories

- Como odontólogo, quiero ver el odontograma interactivo, el historial de tratamientos y las radiografías del paciente en una sola pantalla para poder realizar un diagnóstico preciso y proponer un nuevo plan de tratamiento.
- Como recepcionista, quiero acceder rápidamente a la información de contacto del paciente y a su historial de citas para poder gestionar eficientemente las reprogramaciones y confirmaciones.
- Como higienista, quiero un acceso sencillo para registrar mis notas de evolución en la historia clínica del paciente inmediatamente después de cada visita.
- Como auxiliar, quiero poder subir y categorizar fácilmente documentos como consentimientos informados y radiografías en el perfil del paciente para mantener el expediente digital completo y ordenado.
- Como odontólogo, quiero ver las alertas médicas importantes del paciente de forma prominente al abrir su perfil para garantizar su seguridad durante el tratamiento.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un control de acceso basado en roles (RBAC) a nivel de API. Por ejemplo, el rol 'Recepción' no debería poder ver ni editar la sección de 'Historia Clínica'. Toda la información sensible (datos de salud) debe estar encriptada en tránsito (HTTPS) y en reposo (cifrado de base de datos MongoDB). Cumplimiento de normativas de protección de datos (LOPD/RGPD, HIPAA) es mandatorio.
- Rendimiento: La API principal `GET /api/pacientes/:id/perfil-completo` puede ser pesada. Utilizar proyecciones en las consultas de MongoDB para devolver solo los campos necesarios para la vista inicial. Implementar carga diferida (lazy loading) para las pestañas; los datos de una pestaña no se solicitan hasta que el usuario hace clic en ella.
- Gestión de Estado Frontend: Se recomienda usar una librería de gestión de estado como Redux Toolkit o Zustand para manejar los datos del paciente en el cliente, evitando llamadas redundantes a la API al cambiar de pestaña.
- Integraciones: El componente de 'Documentos' debería ser capaz de integrarse con visores DICOM para las imágenes radiográficas. El odontograma debe ser un componente SVG interactivo, guardando su estado como un objeto JSON en la base de datos.

