# Cirugía Oral: Intraoperatorio

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La página 'Cirugía Oral: Intraoperatorio' es un componente crítico y altamente especializado dentro del módulo de 'Especialidades Clínicas'. Su propósito fundamental es servir como un centro de mando digital y un registro en tiempo real durante la ejecución de procedimientos quirúrgicos orales. Esta funcionalidad transforma la sala de operaciones, reemplazando los formularios en papel y los registros manuales por una interfaz interactiva, segura y centralizada. Funciona como el nexo entre la planificación preoperatoria y el seguimiento postoperatorio, asegurando una continuidad de la atención impecable. En esta pantalla, el equipo quirúrgico (odontólogo y asistente) puede visualizar de forma consolidada la información vital del paciente, el plan quirúrgico detallado, las imágenes de diagnóstico relevantes (radiografías, TACs) y las alertas médicas. Permite el registro meticuloso de cada evento de la cirugía, desde la administración de la anestesia hasta la sutura final, con marcas de tiempo automáticas. Facilita el seguimiento de los signos vitales, ya sea mediante introducción manual o por integración con monitores, y gestiona el consumo de materiales en tiempo real, lo que impacta directamente en el control de inventario y la facturación. Al finalizar el procedimiento, se genera un informe intraoperatorio completo y preciso que se adjunta automáticamente al historial clínico electrónico del paciente, mejorando la calidad de la documentación, la seguridad del paciente y la eficiencia operativa de la clínica.

## 👥 Roles de Acceso

- Odontólogo
- Auxiliar / Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

La funcionalidad se encuentra dentro de la feature 'especialidades-clinicas'. La página principal que renderiza la interfaz intraoperatoria reside en la subcarpeta '/pages'. Los componentes reutilizables y específicos de esta vista, como el monitor de signos vitales, el checklist quirúrgico y el cronómetro de fases, se ubican en '/components'. Todas las interacciones con el backend para guardar y recuperar datos de la cirugía se gestionan a través de funciones definidas en '/apis', que centralizan las llamadas a la API REST.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/CirugiaIntraoperatorioPage.tsx`
- `/features/especialidades-clinicas/components/intraoperatorio/VitalSignsMonitor.tsx`
- `/features/especialidades-clinicas/components/intraoperatorio/SurgicalPhaseTimer.tsx`
- `/features/especialidades-clinicas/components/intraoperatorio/IntraopNoteTaker.tsx`
- `/features/especialidades-clinicas/components/intraoperatorio/MaterialConsumptionLog.tsx`
- `/features/especialidades-clinicas/components/intraoperatorio/SurgicalSafetyChecklist.tsx`
- `/features/especialidades-clinicas/apis/cirugiaApi.ts`

### Componentes React

- CirugiaIntraoperatorioPage
- PatientInfoHeader
- VitalSignsMonitor
- SurgicalPhaseTimer
- IntraopNoteTaker
- MaterialConsumptionLog
- SurgicalSafetyChecklist
- ProcedureTimelineView

## 🔌 APIs Backend

Las APIs para esta página son cruciales para la persistencia y recuperación de datos en tiempo real. Se necesita un endpoint para obtener los datos preoperatorios, uno para iniciar el registro intraoperatorio, y endpoints para actualizar continuamente el estado de la cirugía (notas, eventos, signos vitales, materiales).

### `GET` `/api/cirugias/:id/preoperatorio`

Obtiene toda la información de planificación para una cirugía específica (plan de tratamiento, alergias del paciente, etc.) para mostrarla al inicio.

**Parámetros:** id (param): ID de la cirugía programada

**Respuesta:** JSON con el objeto del plan quirúrgico y datos del paciente.

### `POST` `/api/cirugias/:id/intraoperatorio/iniciar`

Inicia el registro intraoperatorio para una cirugía. Marca el estado de la cirugía como 'en-curso' y registra la hora de inicio.

**Parámetros:** id (param): ID de la cirugía

**Respuesta:** JSON con el nuevo objeto de registro intraoperatorio creado.

### `PUT` `/api/cirugias/:id/intraoperatorio`

Endpoint principal para guardar el estado del registro intraoperatorio. Se usa para autoguardado de notas, signos vitales y checklist.

**Parámetros:** id (param): ID de la cirugía, body (JSON): Objeto completo o parcial del registro intraoperatorio a actualizar (notas, signosVitales, etc.)

**Respuesta:** JSON con el objeto de registro intraoperatorio actualizado.

### `POST` `/api/cirugias/:id/intraoperatorio/eventos`

Registra un evento discreto con marca de tiempo en el historial de la cirugía (ej: 'Inicia incisión', 'Colocación de implante').

**Parámetros:** id (param): ID de la cirugía, body (JSON): { descripcion: 'string' }

**Respuesta:** JSON con el array de eventos actualizado.

### `POST` `/api/cirugias/:id/intraoperatorio/materiales`

Añade un material consumido al registro. Esta acción puede desencadenar una actualización en el módulo de inventario.

**Parámetros:** id (param): ID de la cirugía, body (JSON): { productoId: 'string', cantidad: 'number' }

**Respuesta:** JSON con el array de materiales utilizados actualizado.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con un modelo principal 'Cirugia' que se vincula a un subdocumento o colección 'RegistroIntraoperatorio'. El controlador 'CirugiaController' gestiona toda la lógica de negocio, desde iniciar la cirugía hasta registrar cada detalle, y las rutas exponen estos métodos de forma segura y estructurada.

### Models

#### Cirugia

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, odontologo: { type: Schema.Types.ObjectId, ref: 'Usuario' }, fechaProgramada: Date, planQuirurgico: String, estado: { type: String, enum: ['Planificada', 'En Curso', 'Finalizada', 'Cancelada'] }, registroIntraoperatorio: { type: Schema.Types.ObjectId, ref: 'RegistroIntraoperatorio' }

#### RegistroIntraoperatorio

cirugia: { type: Schema.Types.ObjectId, ref: 'Cirugia' }, horaInicio: Date, horaFin: Date, notas: String, signosVitales: [{ hora: Date, presionArterial: String, frecuenciaCardiaca: Number, spo2: Number }], eventos: [{ hora: Date, descripcion: String }], materialesUtilizados: [{ producto: { type: Schema.Types.ObjectId, ref: 'Producto' }, cantidad: Number }]

### Controllers

#### CirugiaController

- getDatosPreoperatorios
- iniciarRegistroIntraoperatorio
- actualizarRegistroIntraoperatorio
- agregarEvento
- agregarMaterialUtilizado

### Routes

#### `/api/cirugias`

- GET /:id/preoperatorio
- POST /:id/intraoperatorio/iniciar
- PUT /:id/intraoperatorio
- POST /:id/intraoperatorio/eventos
- POST /:id/intraoperatorio/materiales

## 🔄 Flujos

1. El odontólogo o asistente selecciona la cirugía programada para el día desde el panel de control o la agenda.
2. El sistema carga la página 'Cirugía Oral: Intraoperatorio', mostrando los datos del paciente y el plan quirúrgico.
3. El usuario presiona 'Iniciar Cirugía'. El sistema registra la hora de inicio y activa la interfaz de registro.
4. Durante el procedimiento, el asistente introduce periódicamente los signos vitales, que se añaden a una gráfica y un registro con marca de tiempo.
5. El odontólogo dicta notas o el asistente las teclea. El sistema guarda automáticamente el progreso cada 30 segundos.
6. Al usar un material (ej. un implante, una sutura), el asistente lo busca y lo añade a la lista de consumo. El stock en el inventario se descuenta.
7. Se marcan hitos clave (inicio anestesia, incisión, fin sutura) en el cronómetro de fases.
8. Al finalizar, el usuario presiona 'Finalizar Cirugía'. El sistema registra la hora de fin y consolida el informe, cambiando el estado de la cirugía a 'Finalizada'.
9. El informe completo queda permanentemente guardado y accesible desde el historial clínico del paciente.

## 📝 User Stories

- Como Odontólogo, quiero acceder a una pantalla única con toda la información relevante de la cirugía (plan, paciente, radiografías) para tomar decisiones informadas sin distracciones.
- Como Auxiliar, quiero registrar los materiales utilizados de forma rápida y precisa para asegurar que el inventario y la facturación sean correctos.
- Como Odontólogo, quiero un registro con marcas de tiempo automáticas para cada fase y evento importante de la cirugía para tener una documentación legal y clínica robusta.
- Como Auxiliar, quiero poder introducir los signos vitales del paciente fácilmente en una tablet para mantener un monitoreo constante y visible para todo el equipo.
- Como Odontólogo, quiero que todo el registro se guarde de forma automática y segura, para no perder información crítica en caso de un fallo de red o del sistema.

## ⚙️ Notas Técnicas

- Seguridad: Es imperativo cumplir con normativas de protección de datos de salud como HIPAA o GDPR. Implementar cifrado de datos en reposo (MongoDB) y en tránsito (SSL/TLS). El acceso debe estar estrictamente controlado por roles (RBAC).
- Rendimiento: Utilizar WebSockets (ej. Socket.IO) para la actualización en tiempo real de datos como signos vitales, si se integra con monitores externos. Para el autoguardado de notas, implementar 'debouncing' para evitar una sobrecarga de llamadas a la API.
- Integración: Diseñar la API para integrarse con el módulo de Inventario (para descontar stock) y el módulo de Facturación (para añadir costes de materiales).
- UI/UX: La interfaz debe ser de alto contraste, con tipografía legible y controles grandes (botones, campos de entrada) para ser usada fácilmente en una tablet, posiblemente con guantes.
- Resiliencia: Implementar un mecanismo de guardado local usando Service Workers e IndexedDB. Si la conexión a internet falla durante la cirugía, los datos se almacenan localmente y se sincronizan con el servidor en cuanto se restablece la conexión.

