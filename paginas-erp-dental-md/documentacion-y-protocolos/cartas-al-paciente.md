# Cartas al Paciente

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad 'Cartas al Paciente' es una herramienta estratégica dentro del módulo 'Documentación y Protocolos' del ERP dental. Su objetivo principal es centralizar, estandarizar y automatizar la comunicación escrita con los pacientes. Permite al personal de recepción y marketing crear, gestionar y enviar correspondencia personalizada utilizando plantillas predefinidas. Estas plantillas pueden ser para diversos fines, como cartas de bienvenida a nuevos pacientes, recordatorios de citas, instrucciones pre y post-operatorias, agradecimientos, campañas de fidelización, felicitaciones de cumpleaños o comunicaciones sobre promociones especiales. El sistema funciona mediante un editor de texto enriquecido donde se crean las plantillas, utilizando marcadores de posición dinámicos (placeholders) como `{{nombre_paciente}}`, `{{fecha_proxima_cita}}`, `{{tratamiento_realizado}}`, etc. Al momento de generar una carta, el usuario selecciona una plantilla y un paciente (o un grupo de pacientes), y el sistema reemplaza automáticamente estos marcadores con los datos reales extraídos de la base de datos. La carta generada puede ser previsualizada, impresa para correo postal o enviada directamente por correo electrónico. Cada comunicación enviada queda registrada en el historial del paciente, proporcionando una trazabilidad completa y mejorando la calidad del servicio y la relación clínica-paciente.

## 👥 Roles de Acceso

- Recepción / Secretaría
- Marketing / CRM

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

Esta funcionalidad se aloja dentro de la feature 'documentacion-protocolos'. La subcarpeta '/pages/' contiene el componente principal de la página, '/components/' alberga los elementos reutilizables como el editor de plantillas, la lista de plantillas y el modal de envío. La carpeta '/apis/' gestiona las llamadas al backend para obtener, crear, actualizar y enviar las cartas y plantillas.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/CartasPacientePage.tsx`
- `/features/documentacion-protocolos/components/GestionPlantillasCartas.tsx`
- `/features/documentacion-protocolos/components/EditorPlantillaCarta.tsx`
- `/features/documentacion-protocolos/components/ModalEnvioCarta.tsx`
- `/features/documentacion-protocolos/components/PrevisualizacionCarta.tsx`
- `/features/documentacion-protocolos/apis/plantillasCartaApi.ts`
- `/features/documentacion-protocolos/apis/cartasApi.ts`

### Componentes React

- GestionPlantillasCartas
- ListaPlantillasItem
- EditorPlantillaCarta
- ModalEnvioCarta
- PrevisualizacionCarta
- SelectorPacienteInput

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en dos recursos principales: las plantillas de cartas (PlantillaCarta) y las cartas generadas/enviadas (Carta). Se necesita un CRUD completo para las plantillas, y endpoints específicos para generar previsualizaciones y para procesar el envío de cartas a pacientes.

### `GET` `/api/plantillas-carta`

Obtiene una lista de todas las plantillas de cartas disponibles en la clínica.

**Parámetros:** query: tipo (opcional, para filtrar por tipo de plantilla, ej: 'bienvenida', 'marketing')

**Respuesta:** Array de objetos de PlantillaCarta.

### `POST` `/api/plantillas-carta`

Crea una nueva plantilla de carta.

**Parámetros:** body: { nombre: string, asunto: string, cuerpoHTML: string, tipo: string }

**Respuesta:** El objeto de la PlantillaCarta recién creada.

### `PUT` `/api/plantillas-carta/:id`

Actualiza una plantilla de carta existente.

**Parámetros:** params: id (ID de la plantilla), body: { nombre: string, asunto: string, cuerpoHTML: string, tipo: string }

**Respuesta:** El objeto de la PlantillaCarta actualizada.

### `DELETE` `/api/plantillas-carta/:id`

Elimina una plantilla de carta.

**Parámetros:** params: id (ID de la plantilla)

**Respuesta:** Mensaje de confirmación.

### `POST` `/api/cartas/previsualizar`

Genera una previsualización de una carta para un paciente específico usando una plantilla, reemplazando los placeholders.

**Parámetros:** body: { plantillaId: string, pacienteId: string }

**Respuesta:** Objeto con el contenido HTML/texto de la carta ya procesado: { asunto: string, cuerpoHTML: string }.

### `POST` `/api/cartas/enviar`

Envía una carta a un paciente (por email) y registra el envío en el historial.

**Parámetros:** body: { plantillaId: string, pacienteId: string, metodo: 'email' | 'impreso' }

**Respuesta:** Objeto de CartaEnviada confirmando el envío y registro.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con dos modelos principales: 'PlantillaCarta' para almacenar las plantillas reutilizables y 'CartaEnviada' para registrar cada comunicación. Los controladores gestionan la lógica de negocio del CRUD de plantillas y el proceso de generación y envío de cartas, interactuando con el modelo 'Paciente' para obtener los datos necesarios.

### Models

#### PlantillaCarta

nombre: String, asunto: String, cuerpoHTML: String, tipo: String, placeholdersDisponibles: [String], createdAt: Date, updatedAt: Date

#### CartaEnviada

pacienteId: ObjectId (ref: 'Paciente'), plantillaId: ObjectId (ref: 'PlantillaCarta'), fechaEnvio: Date, metodo: String ('email', 'impreso'), asunto: String, cuerpoEnviado: String, estado: String ('enviado', 'fallido')

### Controllers

#### PlantillaCartaController

- crearPlantilla
- obtenerTodasLasPlantillas
- obtenerPlantillaPorId
- actualizarPlantilla
- eliminarPlantilla

#### CartaController

- generarPrevisualizacionCarta
- enviarCartaYRegistrar

### Routes

#### `/api/plantillas-carta`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id

#### `/api/cartas`

- POST /previsualizar
- POST /enviar

## 🔄 Flujos

1. El usuario de recepción accede a 'Cartas al Paciente' desde el menú de 'Documentación y Protocolos'.
2. El sistema muestra la lista de plantillas existentes. El usuario puede crear una nueva, editar o eliminar una existente.
3. Para crear/editar una plantilla, el usuario utiliza un editor de texto enriquecido, insertando placeholders de una lista predefinida (ej: `{{nombre_paciente}}`).
4. Para enviar una carta, el usuario selecciona una plantilla y busca a un paciente por nombre o DNI.
5. El sistema carga una previsualización de la carta, con los datos del paciente ya insertados en los placeholders.
6. El usuario elige el método de envío (Email o Imprimir). Si es Email, se envía a la dirección registrada del paciente. Si es Imprimir, se genera un PDF.
7. Una vez enviada/impresa, se crea un registro en el historial de comunicaciones del paciente.

## 📝 User Stories

- Como personal de recepción, quiero crear plantillas para cartas de bienvenida para enviarlas a nuevos pacientes y estandarizar el proceso de alta.
- Como personal de secretaría, quiero seleccionar un paciente y una plantilla de 'instrucciones post-operatorias' para enviársela por email inmediatamente después de su tratamiento.
- Como responsable de marketing, quiero diseñar una plantilla de felicitación de cumpleaños y configurar un sistema (futura mejora) para que se envíe automáticamente.
- Como personal de recepción, quiero poder imprimir una carta con el resumen de las próximas citas de un paciente cuando éste lo solicite en el mostrador.
- Como responsable de CRM, quiero acceder al historial de un paciente y ver todas las cartas que se le han enviado para entender mejor la comunicación mantenida.

## ⚙️ Notas Técnicas

- Frontend: Implementar un editor de texto enriquecido (WYSIWYG) como TipTap o TinyMCE para la creación de plantillas en `EditorPlantillaCarta.tsx`.
- Backend: Utilizar una librería como Handlebars.js o Mustache.js en el backend para procesar los placeholders (`{{...}}`) en el cuerpo de la plantilla de forma segura.
- Integración Email: Configurar la integración con un servicio de email transaccional (ej: SendGrid, AWS SES) para garantizar la entregabilidad de los correos.
- Generación de PDF: Para la opción de 'Imprimir', el backend debe usar una librería como Puppeteer o `pdf-lib` para convertir el HTML de la carta generada a un documento PDF.
- Seguridad: Es crucial sanitizar todo el contenido HTML proveniente del editor de plantillas antes de guardarlo en la base de datos y antes de renderizarlo, para prevenir ataques XSS. Usar librerías como DOMPurify en el frontend.
- Rendimiento: La búsqueda de pacientes debe ser asíncrona y con 'debouncing' para no sobrecargar el servidor mientras el usuario escribe.

