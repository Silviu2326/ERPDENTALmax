# ABM (Account-Based Marketing) para Empresas

**Categoría:** Marketing y Web | **Módulo:** Marketing Avanzado y Web

El módulo de Account-Based Marketing (ABM) para Empresas es una funcionalidad estratégica diseñada para que las clínicas dentales, especialmente aquellas con múltiples sedes o un enfoque en el crecimiento, puedan dirigirse a clientes corporativos de alto valor. A diferencia del marketing tradicional que se dirige a un público masivo, el ABM concentra los recursos de marketing y ventas en un conjunto definido de 'cuentas' o empresas objetivo. Para una clínica dental, esto se traduce en la capacidad de crear y gestionar convenios corporativos, ofreciendo planes dentales y beneficios exclusivos a los empleados de dichas empresas. Esta funcionalidad permite al equipo de marketing o al director de la clínica identificar empresas potenciales (por ejemplo, grandes oficinas en la zona, startups en crecimiento), crear perfiles detallados de cada una, y gestionar todo el ciclo de vida de la relación, desde el primer contacto hasta la firma del convenio y el seguimiento posterior. El sistema permite registrar contactos clave dentro de cada empresa, planificar y ejecutar campañas personalizadas (emailing, llamadas, eventos) y medir la eficacia de cada acción. Integrado en el módulo padre 'Marketing Avanzado y Web', el ABM se posiciona como una herramienta proactiva de captación B2B, complementando las estrategias B2C y permitiendo a la clínica asegurar flujos de pacientes recurrentes y de alto valor.

## 👥 Roles de Acceso

- Marketing / CRM
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/marketing-avanzado-web/`

Esta funcionalidad se encuentra dentro de la feature 'marketing-avanzado-web'. La carpeta '/pages' contiene las vistas principales, como el dashboard de ABM y la página de detalle de cada empresa. La carpeta '/components' alberga los elementos de UI reutilizables, como la lista de empresas, el formulario de campañas, el gestor de contactos y los gráficos de analíticas. Finalmente, la carpeta '/apis' gestiona todas las llamadas al backend para obtener, crear, actualizar y eliminar datos relacionados con las empresas objetivo, sus contactos y campañas.

### Archivos Frontend

- `/features/marketing-avanzado-web/pages/AbmDashboardPage.tsx`
- `/features/marketing-avanzado-web/pages/AbmEmpresaDetailPage.tsx`
- `/features/marketing-avanzado-web/pages/AbmCampaignCreatePage.tsx`

### Componentes React

- AbmEmpresaList
- AbmEmpresaProfileCard
- AbmCampaignForm
- AbmContactManager
- AbmInteractionLog
- AbmAnalyticsWidget

## 🔌 APIs Backend

Las APIs para ABM gestionan las entidades principales: Empresas Objetivo, Contactos y Campañas. Permiten realizar operaciones CRUD completas sobre cada una, además de registrar interacciones y obtener analíticas de rendimiento.

### `GET` `/api/abm/empresas`

Obtiene una lista paginada de todas las empresas objetivo, con opción de filtrado por estado, sector o nombre.

**Parámetros:** page (number), limit (number), status (string), query (string)

**Respuesta:** Array de objetos de EmpresaObjetivo y metadatos de paginación.

### `POST` `/api/abm/empresas`

Crea una nueva empresa objetivo en el sistema.

**Parámetros:** Body: { nombre, sector, tamano, sitioWeb, direccion }

**Respuesta:** El objeto de la EmpresaObjetivo recién creada.

### `GET` `/api/abm/empresas/:empresaId`

Obtiene los detalles completos de una empresa objetivo específica, incluyendo sus contactos, campañas e historial de interacciones.

**Parámetros:** empresaId (string)

**Respuesta:** Un objeto detallado de EmpresaObjetivo.

### `PUT` `/api/abm/empresas/:empresaId`

Actualiza la información de una empresa objetivo.

**Parámetros:** empresaId (string), Body: { campos a actualizar }

**Respuesta:** El objeto de la EmpresaObjetivo actualizado.

### `POST` `/api/abm/empresas/:empresaId/contactos`

Añade un nuevo contacto a una empresa objetivo.

**Parámetros:** empresaId (string), Body: { nombre, cargo, email, telefono }

**Respuesta:** El objeto del ContactoEmpresa recién creado.

### `POST` `/api/abm/empresas/:empresaId/campanas`

Crea y asocia una nueva campaña de marketing a una empresa objetivo.

**Parámetros:** empresaId (string), Body: { nombre, tipo, fechaInicio, contenido }

**Respuesta:** El objeto de la CampanaABM recién creada.

### `POST` `/api/abm/empresas/:empresaId/interacciones`

Registra una nueva interacción (llamada, email, reunión) con una empresa objetivo.

**Parámetros:** empresaId (string), Body: { tipo, fecha, notas, contactoId }

**Respuesta:** El objeto de la Interaccion recién creada.

## 🗂️ Estructura Backend (MERN)

El backend soporta la funcionalidad ABM con tres modelos MongoDB principales: EmpresaObjetivo, ContactoEmpresa y CampanaABM. Un controlador, AbmController, encapsula toda la lógica de negocio, y las rutas se exponen bajo el prefijo /api/abm para una organización clara y RESTful.

### Models

#### EmpresaObjetivo

nombre (String), sector (String), tamano (String), sitioWeb (String), estado (Enum: 'Identificada', 'Contactada', 'Negociando', 'Cliente', 'Descartada'), contactos (Array de ObjectId ref a 'ContactoEmpresa'), campañasAsociadas (Array de ObjectId ref a 'CampanaABM'), historialInteracciones (Array de objetos), clinicaId (ObjectId)

#### ContactoEmpresa

nombre (String), cargo (String), email (String), telefono (String), empresa (ObjectId ref a 'EmpresaObjetivo'), esDecisionMaker (Boolean)

#### CampanaABM

nombre (String), tipo (Enum: 'Email', 'Llamada', 'Evento', 'Publicidad Digital'), estado (Enum: 'Planificada', 'Activa', 'Finalizada'), empresaObjetivo (ObjectId ref a 'EmpresaObjetivo'), fechaInicio (Date), fechaFin (Date), metricas (Object con campos como 'aperturas', 'clics', 'respuestas')

### Controllers

#### AbmController

- getAllEmpresas
- createEmpresa
- getEmpresaById
- updateEmpresa
- deleteEmpresa
- addContactoToEmpresa
- createCampanaForEmpresa
- logInteraction

### Routes

#### `/api/abm`

- GET /empresas
- POST /empresas
- GET /empresas/:empresaId
- PUT /empresas/:empresaId
- POST /empresas/:empresaId/contactos
- POST /empresas/:empresaId/campanas
- POST /empresas/:empresaId/interacciones

## 🔄 Flujos

1. El usuario de Marketing accede al 'Dashboard ABM', donde ve una lista de empresas objetivo y su estado actual en el pipeline.
2. El usuario hace clic en 'Añadir Empresa' e introduce los datos de una nueva compañía potencial.
3. Una vez creada, el usuario accede al perfil de la empresa y añade contactos clave (ej: Gerente de RRHH).
4. Desde el perfil de la empresa, el usuario crea una 'Nueva Campaña', seleccionando el tipo (ej: Email), redactando el contenido y programando el envío.
5. El usuario registra una llamada de seguimiento como una 'Interacción', añadiendo notas sobre la conversación.
6. Cuando la negociación avanza, el usuario actualiza el 'Estado' de la empresa de 'Contactada' a 'Negociando'.
7. El Director General revisa el dashboard para ver el valor potencial total de las empresas en estado 'Negociando'.

## 📝 User Stories

- Como Gerente de Marketing, quiero añadir y perfilar empresas locales para crear una lista de cuentas objetivo para nuestros planes corporativos.
- Como Director de clínica, quiero ver un embudo de ventas de las cuentas empresariales para prever futuros ingresos por convenios.
- Como miembro del equipo de CRM, quiero registrar cada email y llamada con los contactos de una empresa para que todo el equipo tenga visibilidad del historial de comunicación.
- Como Gerente de Marketing, quiero lanzar campañas de email personalizadas a los responsables de RRHH de las empresas objetivo para presentarles nuestros beneficios.
- Como Director de clínica multisede, quiero filtrar las empresas objetivo por la clínica más cercana para asignar la gestión de la cuenta al equipo local.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un control de acceso estricto para que los datos de ABM de una clínica no sean visibles para otra, a menos que el rol sea 'Director / Admin general (multisede)'.
- Integración: Considerar la integración con APIs de proveedores de datos B2B (ej: Clearbit, ZoomInfo) para enriquecer automáticamente los perfiles de las empresas con información actualizada.
- Automatización: Planificar la integración con servicios de envío de correo electrónico (ej: SendGrid, Mailgun) para automatizar el envío de campañas directamente desde el ERP.
- Rendimiento: La base de datos debe tener índices en los campos de búsqueda comunes de 'EmpresaObjetivo' (nombre, estado, clinicaId) para garantizar que los dashboards y las listas se carguen rápidamente.
- Analíticas: Utilizar el framework de agregación de MongoDB para generar KPIs complejos, como el 'Coste de Adquisición de Cuenta' o el 'Ciclo de Venta Promedio', que se mostrarán en el dashboard.

