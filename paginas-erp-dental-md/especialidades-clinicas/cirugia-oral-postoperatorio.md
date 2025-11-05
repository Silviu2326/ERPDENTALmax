# Cirugía Oral: Postoperatorio

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La página de 'Cirugía Oral: Postoperatorio' es una funcionalidad crítica dentro del módulo de 'Especialidades Clínicas' del ERP dental. Su propósito fundamental es gestionar, documentar y estandarizar el cuidado del paciente después de una intervención de cirugía oral. Esta herramienta permite al equipo clínico, desde el cirujano hasta el asistente, seguir un protocolo estructurado para la recuperación del paciente, minimizando riesgos y asegurando los mejores resultados. Funciona como un expediente digital específico para el postoperatorio, vinculado directamente al tratamiento quirúrgico realizado. Al acceder a esta sección, el profesional puede registrar detalladamente las indicaciones proporcionadas al paciente (dieta, higiene, medicación), prescribir fármacos con su posología, y programar las citas de seguimiento necesarias. Además, en cada visita de control, se pueden añadir notas de evolución, registrar signos vitales, y adjuntar archivos multimedia como fotografías intraorales para documentar visualmente el proceso de cicatrización. Esta centralización de la información postquirúrgica no solo mejora la calidad de la atención al paciente, sino que también optimiza la comunicación interna del equipo clínico y proporciona un respaldo legal y clínico robusto del proceso de recuperación. La integración con otros módulos, como la agenda para las citas de control y el historial del paciente, crea un flujo de trabajo cohesivo y eficiente.

## 👥 Roles de Acceso

- Odontólogo
- Auxiliar / Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

La funcionalidad se encuentra dentro de la feature 'especialidades-clinicas'. La carpeta '/pages' contiene el componente principal de la página 'CirugiaOralPostoperatorioPage.tsx'. En '/components' se ubican los componentes reutilizables específicos para esta funcionalidad, como el formulario de indicaciones, la lista de medicamentos y el historial de seguimiento. La carpeta '/apis' contiene las funciones que encapsulan las llamadas a los endpoints del backend para gestionar los datos postoperatorios.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/CirugiaOralPostoperatorioPage.tsx`
- `/features/especialidades-clinicas/components/PanelResumenCirugia.tsx`
- `/features/especialidades-clinicas/components/FormularioIndicacionesPostoperatorias.tsx`
- `/features/especialidades-clinicas/components/ListaMedicacionPrescrita.tsx`
- `/features/especialidades-clinicas/components/HistorialSeguimientoPostoperatorio.tsx`
- `/features/especialidades-clinicas/components/ModalNuevoSeguimiento.tsx`
- `/features/especialidades-clinicas/apis/postoperatorioApi.ts`

### Componentes React

- CirugiaOralPostoperatorioPage
- PanelResumenCirugia
- FormularioIndicacionesPostoperatorias
- ListaMedicacionPrescrita
- HistorialSeguimientoPostoperatorio
- ModalNuevoSeguimiento

## 🔌 APIs Backend

Las APIs gestionan toda la información relacionada con el seguimiento postoperatorio de una cirugía. Permiten crear un nuevo registro postoperatorio, obtener los detalles existentes, y añadir nuevas entradas de seguimiento o modificar la medicación a lo largo del tiempo.

### `GET` `/api/postoperatorios/tratamiento/:tratamientoId`

Obtiene el registro postoperatorio completo asociado a un tratamiento quirúrgico específico.

**Parámetros:** tratamientoId (param)

**Respuesta:** Objeto JSON con los detalles del postoperatorio, incluyendo indicaciones, medicación y historial de seguimiento.

### `POST` `/api/postoperatorios`

Crea un nuevo registro de seguimiento postoperatorio para un paciente y un tratamiento.

**Parámetros:** Body: { pacienteId, tratamientoId, indicacionesGenerales, medicacionPrescrita, notasIniciales }

**Respuesta:** Objeto JSON del nuevo registro postoperatorio creado.

### `PUT` `/api/postoperatorios/:id/seguimiento`

Añade una nueva entrada al historial de seguimiento de un registro postoperatorio existente.

**Parámetros:** id (param), Body: { fecha, notasEvolucion, profesionalId, adjuntos: [url] }

**Respuesta:** Objeto JSON del registro postoperatorio actualizado con la nueva entrada de seguimiento.

### `PUT` `/api/postoperatorios/:id/indicaciones`

Actualiza las indicaciones generales y la medicación prescrita en un registro postoperatorio.

**Parámetros:** id (param), Body: { indicacionesGenerales, medicacionPrescrita }

**Respuesta:** Objeto JSON del registro postoperatorio actualizado.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo MongoDB 'Postoperatorio' para almacenar toda la información. Un 'PostoperatorioController' maneja la lógica de negocio, como la creación y actualización de registros. Las rutas se definen en un archivo dedicado que mapea los endpoints HTTP a las funciones del controlador.

### Models

#### Postoperatorio

paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' }, tratamiento: { type: Schema.Types.ObjectId, ref: 'Tratamiento' }, fechaInicio: Date, indicacionesGenerales: String, medicacionPrescrita: [{ nombre: String, dosis: String, frecuencia: String, duracion: String }], seguimientos: [{ fecha: Date, notasEvolucion: String, profesional: { type: Schema.Types.ObjectId, ref: 'Usuario' }, adjuntos: [String] }], estado: { type: String, enum: ['Activo', 'Finalizado'], default: 'Activo' }

### Controllers

#### PostoperatorioController

- crearRegistroPostoperatorio
- obtenerPostoperatorioPorTratamiento
- agregarEntradaSeguimiento
- actualizarIndicaciones

### Routes

#### `/api/postoperatorios`

- GET /tratamiento/:tratamientoId
- POST /
- PUT /:id/seguimiento
- PUT /:id/indicaciones

## 🔄 Flujos

1. El odontólogo finaliza una cirugía, accede al historial del paciente, selecciona el tratamiento y hace clic en 'Iniciar Postoperatorio'.
2. El sistema muestra la página de postoperatorio, donde el odontólogo o asistente introduce las indicaciones iniciales y la medicación prescrita, guardando el registro.
3. En una cita de seguimiento, el profesional abre el registro postoperatorio existente del paciente.
4. Se añade una nueva entrada de 'seguimiento', anotando la evolución, el estado de la cicatrización y, opcionalmente, adjuntando una foto.
5. El profesional puede ajustar la medicación o las indicaciones si es necesario.
6. Una vez que el paciente está de alta, el profesional marca el estado del postoperatorio como 'Finalizado'.

## 📝 User Stories

- Como odontólogo, quiero crear un plan postoperatorio detallado para cada cirugía oral, especificando dieta, higiene y medicación, para garantizar la correcta recuperación del paciente.
- Como auxiliar, quiero consultar rápidamente las indicaciones postoperatorias de un paciente para poder resolver sus dudas por teléfono de manera precisa.
- Como odontólogo, quiero registrar la evolución del paciente en cada cita de seguimiento, adjuntando fotos de la zona intervenida, para tener un historial visual y clínico completo.
- Como odontólogo, quiero utilizar plantillas predefinidas de indicaciones para cirugías comunes (ej. extracción de terceros molares) para agilizar la creación de planes postoperatorios y mantener la consistencia clínica.
- Como asistente, quiero ver la fecha de la próxima cita de control postoperatorio directamente en esta pantalla para coordinar la agenda del paciente eficientemente.

## ⚙️ Notas Técnicas

- Seguridad y Privacidad: Implementar un control de acceso basado en roles (RBAC) estricto para asegurar que solo el personal clínico autorizado pueda ver o modificar estos datos. Todos los datos deben cumplir con las normativas de protección de datos de salud (ej. HIPAA, LOPD).
- Integración de Módulos: La funcionalidad debe estar integrada con el módulo de Pacientes (para datos demográficos), Tratamientos (para vincular la cirugía) y Agenda (para programar y visualizar citas de seguimiento).
- Almacenamiento de Archivos: Para las fotos adjuntas en el seguimiento, se debe utilizar un servicio de almacenamiento de objetos como AWS S3 o Google Cloud Storage para no sobrecargar la base de datos y optimizar la entrega de contenido.
- Rendimiento: En casos de seguimientos largos, la lista de entradas de evolución puede crecer. Implementar paginación o 'scroll infinito' en el historial de seguimiento para mantener la interfaz ágil.
- Notificaciones: Considerar la implementación de notificaciones automáticas para recordar al personal sobre las próximas citas de control postoperatorio.

