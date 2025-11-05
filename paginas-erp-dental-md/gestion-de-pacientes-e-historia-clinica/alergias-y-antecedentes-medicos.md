# Alergias y Antecedentes Médicos

**Categoría:** Gestión Clínica | **Módulo:** Gestión de Pacientes e Historia Clínica

La funcionalidad 'Alergias y Antecedentes Médicos' es un componente crítico dentro del módulo de 'Gestión de Pacientes e Historia Clínica'. Su objetivo principal es centralizar toda la información médica relevante de un paciente que pueda impactar en su tratamiento dental. Esto incluye, pero no se limita a, alergias a medicamentos (como antibióticos o anestésicos), alergias a materiales (látex, metales), condiciones médicas preexistentes (cardiopatías, diabetes, hipertensión), medicación actual, y antecedentes quirúrgicos. Esta sección funciona como una ficha de anamnesis digital, accesible y actualizable en tiempo real por el personal clínico autorizado. Su importancia radica en la seguridad del paciente; permite al odontólogo tomar decisiones informadas, evitando reacciones adversas, interacciones medicamentosas peligrosas y adaptando los procedimientos a las necesidades específicas de cada individuo. Dentro del ERP, esta información se muestra de forma prominente en la ficha del paciente y puede generar alertas automáticas en otros módulos, como al crear un plan de tratamiento o al generar una prescripción médica, garantizando así una atención integral y segura. La interfaz debe ser clara, permitiendo un registro rápido y preciso, y destacando visualmente la información más crítica para una consulta inmediata.

## 👥 Roles de Acceso

- Odontólogo
- Higienista
- Auxiliar / Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-pacientes-historia-clinica/`

Esta funcionalidad se encuentra dentro de la feature 'gestion-pacientes-historia-clinica'. La página principal, probablemente una pestaña o sección dentro del perfil del paciente, se define en '/pages'. Los componentes reutilizables como el formulario de antecedentes, las listas de alergias y las tarjetas de alerta se ubican en '/components'. La lógica para comunicarse con el backend (obtener y actualizar los datos médicos) está encapsulada en los archivos de '/apis'.

### Archivos Frontend

- `/features/gestion-pacientes-historia-clinica/pages/AntecedentesMedicosPacientePage.tsx`
- `/features/gestion-pacientes-historia-clinica/components/FormularioAntecedentesMedicos.tsx`
- `/features/gestion-pacientes-historia-clinica/components/ListaAlergiasPaciente.tsx`
- `/features/gestion-pacientes-historia-clinica/components/BannerAlertaMedica.tsx`
- `/features/gestion-pacientes-historia-clinica/apis/historiaClinicaApi.ts`

### Componentes React

- FormularioAntecedentesMedicos
- ListaAlergiasPaciente
- ListaCondicionesMedicas
- BannerAlertaMedica
- InputAutocompletarCondicion

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en obtener y actualizar la sección de historia médica de un paciente específico. Las operaciones son atómicas para garantizar la consistencia de los datos.

### `GET` `/api/pacientes/:pacienteId/historia-medica`

Obtiene el historial médico completo (alergias, antecedentes, medicación) de un paciente específico.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Un objeto JSON que contiene los detalles de la historia médica del paciente.

### `PUT` `/api/pacientes/:pacienteId/historia-medica`

Actualiza o sobrescribe el historial médico completo de un paciente. Se envía el objeto completo para asegurar la integridad de los datos.

**Parámetros:** pacienteId (en la URL), Body (JSON con la estructura del historial médico: alergias, antecedentes, etc.)

**Respuesta:** El objeto JSON del historial médico actualizado.

## 🗂️ Estructura Backend (MERN)

En el backend, la información de alergias y antecedentes se almacena como un documento embebido dentro del modelo 'Paciente' en MongoDB. Esto optimiza las consultas, ya que esta información casi siempre se necesita junto con los datos del paciente. Un controlador específico gestiona la lógica de negocio.

### Models

#### Paciente

Dentro del esquema Paciente, existe un campo 'historiaMedica' de tipo Object, que contiene: { alergias: [{ nombre: String, tipo: String, reaccion: String, critica: Boolean }], antecedentes: [{ nombre: String, diagnostico: String, notas: String, critica: Boolean }], medicacionActual: [{ nombre: String, dosis: String }], notasGenerales: String }

### Controllers

#### HistoriaClinicaController

- getHistoriaMedicaByPacienteId
- updateHistoriaMedica

### Routes

#### `/api/pacientes/:pacienteId/historia-medica`

- GET /
- PUT /

## 🔄 Flujos

1. El odontólogo accede a la ficha de un paciente y navega a la sección 'Historia Clínica' -> 'Alergias y Antecedentes'.
2. El sistema realiza una petición GET para cargar los datos médicos existentes del paciente.
3. Si existen condiciones o alergias marcadas como 'críticas', se muestra un banner de alerta prominente en la parte superior de la página.
4. El usuario (odontólogo, higienista o auxiliar) puede añadir, editar o eliminar entradas en las listas de alergias, antecedentes y medicación.
5. Al hacer clic en 'Guardar', el frontend envía una petición PUT al backend con el objeto completo y actualizado de la historia médica.
6. El backend valida los datos y actualiza el documento del paciente en la base de datos.
7. La interfaz de usuario muestra una confirmación de guardado y refleja los cambios inmediatamente.

## 📝 User Stories

- Como odontólogo, quiero ver un resumen claro y destacado de las alergias y condiciones médicas críticas de un paciente al abrir su ficha, para tomar precauciones inmediatas.
- Como higienista, quiero poder consultar rápidamente la lista de alergias a materiales antes de preparar el gabinete, para evitar el uso de productos como el látex si el paciente es alérgico.
- Como auxiliar, quiero poder registrar de forma sencilla los datos que el paciente me proporciona en el cuestionario de salud inicial, para que el odontólogo tenga la información completa antes de la consulta.
- Como odontólogo, quiero que el sistema me alerte si intento prescribir un medicamento al que el paciente es alérgico, para prevenir errores médicos graves.

## ⚙️ Notas Técnicas

- Seguridad: La información médica es extremadamente sensible. Es mandatorio cumplir con normativas de protección de datos como GDPR o HIPAA. Todos los datos deben estar encriptados en tránsito (HTTPS) y en reposo. El acceso a esta funcionalidad debe ser auditado y restringido estrictamente por roles.
- Rendimiento: Dado que esta información es crítica, debe cargarse muy rápidamente al acceder a la ficha del paciente. Embeber el documento 'historiaMedica' en el modelo 'Paciente' es una buena estrategia para ello.
- UI/UX: Utilizar componentes de UI que diferencien visualmente la severidad de las condiciones (ej. códigos de color, iconos). Implementar campos de autocompletado con bases de datos de medicamentos y condiciones comunes (ej. CIE-10) puede agilizar la entrada de datos y estandarizar la terminología.
- Integración: Esta funcionalidad debe integrarse estrechamente con el módulo de 'Prescripciones' y 'Planes de Tratamiento' para proporcionar alertas contextuales en tiempo real.
- Validación: Implementar validación de datos tanto en el frontend (para una experiencia de usuario fluida) como en el backend (para garantizar la integridad de los datos).

