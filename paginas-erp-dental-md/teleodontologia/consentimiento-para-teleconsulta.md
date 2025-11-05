# Consentimiento para Teleconsulta

**Categoría:** Telemedicina | **Módulo:** Teleodontología

La funcionalidad 'Consentimiento para Teleconsulta' es un componente legal y operativo crucial dentro del módulo de Teleodontología del ERP dental. Su propósito principal es presentar al paciente un documento de consentimiento informado específico para la atención a distancia y recabar su firma o aceptación electrónica antes de que se realice la teleconsulta. Este proceso es fundamental para cumplir con las normativas de protección de datos y responsabilidad médica, protegiendo tanto al paciente como a la clínica. El documento detalla la naturaleza de la teleodontología, sus beneficios (accesibilidad, conveniencia), sus limitaciones (imposibilidad de realizar exámenes físicos completos o procedimientos), los posibles riesgos de seguridad de la información, y las políticas de privacidad y manejo de los datos del paciente. Operativamente, esta página actúa como una barrera de acceso a la sala de espera virtual. Cuando un paciente accede al enlace de su teleconsulta programada a través del Portal del Paciente, el sistema verifica primero si el consentimiento ya ha sido firmado para esa cita. Si no es así, se le redirige automáticamente a esta página. El paciente debe leer el texto, que es gestionado por los administradores de la clínica, y manifestar su acuerdo, ya sea mediante una firma digital en un panel táctil o marcando una casilla de verificación con validez legal. Una vez firmado, el sistema registra la aceptación, la fecha, la hora, y datos de auditoría como la dirección IP, y finalmente le permite al paciente acceder a la teleconsulta. Para el personal de recepción, esta funcionalidad ofrece una vista clara del estado del consentimiento de cada paciente en la agenda, permitiéndoles realizar un seguimiento proactivo y asegurar que toda la documentación esté en orden antes de la hora de la cita.

## 👥 Roles de Acceso

- Paciente (Portal)
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/teleodontologia/`

Esta funcionalidad se encuentra dentro de la feature 'teleodontologia'. La carpeta /pages/ contendrá el componente principal 'ConsentimientoTeleconsultaPage.tsx', que es la ruta a la que el paciente es dirigido. La carpeta /components/ alojará elementos reutilizables como 'FormularioConsentimiento.tsx' para mostrar el texto legal y 'PanelFirmaDigital.tsx' para la captura de la firma. Las interacciones con el backend se manejarán a través de funciones definidas en /apis/consentimientoApi.ts, que encapsulan las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/teleodontologia/pages/ConsentimientoTeleconsultaPage.tsx`
- `/features/teleodontologia/components/FormularioConsentimiento.tsx`
- `/features/teleodontologia/components/PanelFirmaDigital.tsx`
- `/features/teleodontologia/components/EstadoConsentimientoBadge.tsx`
- `/features/teleodontologia/apis/consentimientoApi.ts`

### Componentes React

- ConsentimientoTeleconsultaPage
- FormularioConsentimiento
- PanelFirmaDigital
- EstadoConsentimientoBadge

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan la obtención de plantillas de consentimiento, el registro de la firma del paciente y la consulta del estado de un consentimiento para una cita específica.

### `GET` `/api/teleodontologia/consentimiento/plantilla`

Obtiene la versión activa y más reciente de la plantilla de texto para el consentimiento informado de teleconsulta, que será mostrada al paciente.

**Respuesta:** JSON con el contenido de la plantilla (ej: { version: 1.2, titulo: '...', contenido: '...' })

### `POST` `/api/teleodontologia/consentimiento/firmar`

Permite al paciente enviar su consentimiento firmado. Guarda la firma, los datos de auditoría y actualiza el estado del consentimiento para la consulta asociada.

**Parámetros:** idConsulta: string (ID de la consulta de teleodontología), firmaData: string (Data URL de la imagen de la firma o un valor booleano si es checkbox), ipAddress: string, userAgent: string

**Respuesta:** JSON con el estado de la operación y el registro del consentimiento guardado.

### `GET` `/api/teleodontologia/consentimiento/consulta/:idConsulta`

Recupera el estado y los detalles del consentimiento asociado a una consulta específica. Usado por el personal de la clínica y para verificar el acceso del paciente.

**Parámetros:** idConsulta: string (ID de la consulta en la URL)

**Respuesta:** JSON con los detalles del consentimiento (estado, fechaFirma, firmaData, etc.) o un error 404 si no existe.

## 🗂️ Estructura Backend (MERN)

El backend soportará esta funcionalidad con un modelo específico para almacenar los consentimientos, un controlador para la lógica de negocio y rutas para exponer los endpoints a través de la API.

### Models

#### ConsentimientoTeleconsulta

idConsulta: { type: Schema.Types.ObjectId, ref: 'Cita', required: true, unique: true }, idPaciente: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true }, contenidoPlantilla: { type: String, required: true }, versionPlantilla: { type: String, required: true }, estado: { type: String, enum: ['Pendiente', 'Firmado', 'Rechazado'], default: 'Pendiente' }, fechaFirma: { type: Date }, firmaData: { type: String }, ipAddress: { type: String }, userAgent: { type: String }, createdAt: { type: Date, default: Date.now }

#### PlantillaConsentimiento

titulo: { type: String, required: true }, contenido: { type: String, required: true }, version: { type: String, required: true, unique: true }, activa: { type: Boolean, default: true }, createdAt: { type: Date, default: Date.now }

### Controllers

#### ConsentimientoController

- obtenerPlantillaActiva
- registrarFirmaConsentimiento
- obtenerConsentimientoPorConsulta

### Routes

#### `/api/teleodontologia/consentimiento`

- GET /plantilla
- POST /firmar
- GET /consulta/:idConsulta

## 🔄 Flujos

1. Flujo del Paciente: 1. El paciente accede al enlace de su teleconsulta. 2. El sistema comprueba si el consentimiento está firmado. 3. Si no lo está, redirige a la página de Consentimiento. 4. El paciente lee el texto cargado desde la plantilla activa. 5. El paciente firma en el panel digital o marca la casilla de aceptación. 6. El paciente pulsa 'Aceptar y Enviar'. 7. El sistema valida y guarda la firma, asociándola a la cita. 8. El paciente es redirigido a la sala de espera virtual.
2. Flujo de Recepción: 1. El recepcionista visualiza la agenda del día. 2. Junto a cada teleconsulta, ve un indicador (badge) del estado del consentimiento ('Pendiente', 'Firmado'). 3. Puede hacer clic en el indicador para ver detalles como la fecha y hora de la firma, o para reenviar el enlace al paciente si está pendiente.

## 📝 User Stories

- Como paciente, quiero leer claramente y firmar de forma segura el consentimiento para mi teleconsulta antes de la cita, para poder proceder con mi atención médica de manera informada.
- Como recepcionista, quiero ver de un vistazo en la agenda qué pacientes han firmado el consentimiento de teleconsulta, para poder recordarles a los que no lo han hecho y asegurar que todo esté en regla.
- Como administrador de la clínica, quiero poder gestionar y actualizar el texto de la plantilla del consentimiento informado para adaptarlo a cambios en la normativa, garantizando que la clínica siempre cumpla con la ley.

## ⚙️ Notas Técnicas

- Seguridad: Es imperativo que la transmisión de los datos del consentimiento se realice sobre HTTPS. Los datos de auditoría (IP, User Agent) deben ser almacenados para dar validez a la firma electrónica. El documento de consentimiento firmado (potencialmente un PDF generado) debe almacenarse de forma segura y encriptada, cumpliendo con normativas como HIPAA o RGPD.
- Firma Digital: Se puede utilizar una librería como 'react-signature-canvas' para capturar un trazado de firma. La salida (Data URL en base64) se almacena en el campo 'firmaData'. Alternativamente, un checkbox con un texto legal explícito es una opción más simple pero legalmente válida en muchas jurisdicciones.
- Auditoría y Versionado: El modelo 'ConsentimientoTeleconsulta' debe guardar una copia del texto ('contenidoPlantilla') y la versión que el paciente firmó. Esto es crucial por si la plantilla cambia en el futuro, manteniendo un registro histórico exacto de lo que se aceptó.
- Integración: El estado del consentimiento debe ser un campo clave en el modelo 'Cita' o estar directamente enlazado. El módulo de Videoconferencia debe consultar este estado antes de permitir la entrada del paciente a la llamada.
- Rendimiento: La plantilla de consentimiento no cambia con frecuencia, por lo que puede ser cacheada en el backend para reducir las consultas a la base de datos.

