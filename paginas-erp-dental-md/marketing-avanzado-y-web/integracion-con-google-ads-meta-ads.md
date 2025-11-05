# Integración con Google Ads/Meta Ads

**Categoría:** Marketing y Web | **Módulo:** Marketing Avanzado y Web

La funcionalidad de 'Integración con Google Ads/Meta Ads' es una herramienta estratégica dentro del módulo de 'Marketing Avanzado y Web' del ERP dental. Su propósito principal es cerrar el ciclo entre la inversión en publicidad digital y los resultados reales obtenidos en la clínica, como la captación de nuevos pacientes, la programación de citas y el valor de los tratamientos iniciados. Permite a los responsables de marketing y a la dirección de la clínica conectar de forma segura sus cuentas publicitarias de Google y Meta (Facebook/Instagram) directamente al ERP. Una vez conectadas, el sistema puede importar automáticamente datos de rendimiento de las campañas, como impresiones, clics y costes. Lo más importante es que esta integración habilita el 'seguimiento de conversiones offline', enviando eventos clave desde el ERP (por ejemplo, cuando un paciente captado por un anuncio asiste a su primera cita o acepta un plan de tratamiento) de vuelta a las plataformas publicitarias. Esto permite a los algoritmos de Google y Meta optimizar las campañas para atraer a pacientes de mayor valor, no solo a personas que rellenan un formulario. En esencia, transforma el ERP en la fuente de la verdad sobre el retorno de la inversión (ROI) publicitaria, proporcionando dashboards que correlacionan el gasto en una campaña específica con el número de pacientes reales y los ingresos generados por ellos, ofreciendo una visión clara y precisa del rendimiento del marketing digital.

## 👥 Roles de Acceso

- Marketing / CRM
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/marketing-avanzado-web/`

Esta funcionalidad reside dentro de la carpeta 'marketing-avanzado-web'. La subcarpeta '/pages' contiene el componente principal de la página de configuración y visualización de la integración. La carpeta '/components' alberga los elementos de la interfaz de usuario, como tarjetas para cada plataforma publicitaria, tablas para mostrar el rendimiento de las campañas y formularios para configurar el seguimiento de conversiones. La lógica de comunicación con el backend se encapsula en la carpeta '/apis', que contiene funciones para manejar la autenticación OAuth y el intercambio de datos con el servidor.

### Archivos Frontend

- `/features/marketing-avanzado-web/pages/AdsIntegrationDashboardPage.tsx`
- `/features/marketing-avanzado-web/pages/AdsIntegrationSetupPage.tsx`
- `/features/marketing-avanzado-web/apis/adsIntegrationApi.ts`
- `/features/marketing-avanzado-web/components/AdPlatformConnectionCard.tsx`
- `/features/marketing-avanzado-web/components/CampaignPerformanceTable.tsx`
- `/features/marketing-avanzado-web/components/ConversionEventSetupForm.tsx`

### Componentes React

- AdPlatformConnectionCard
- CampaignPerformanceTable
- ConversionEventSetupForm
- ROISummaryChart
- PlatformAuthButton

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan la autenticación segura (OAuth 2.0) con las plataformas de Google y Meta, el almacenamiento de tokens, la sincronización periódica de datos de campañas y el envío de eventos de conversión offline. También proporcionan endpoints para que el frontend pueda recuperar datos de rendimiento y configuraciones guardadas.

### `POST` `/api/marketing/ads/connect/:platform`

Inicia el flujo de autenticación OAuth 2.0 para una plataforma específica (google/meta) y devuelve la URL de autorización.

**Parámetros:** platform: 'google' | 'meta'

**Respuesta:** JSON con la URL de redirección para la autorización del usuario: { redirectUrl: '...' }

### `GET` `/api/marketing/ads/callback/:platform`

Endpoint de callback para que las plataformas redirijan después de la autorización. Procesa el código de autorización, obtiene los tokens de acceso/actualización y los guarda de forma segura.

**Parámetros:** code: string (código de autorización de la plataforma)

**Respuesta:** Redirección al frontend con un estado de éxito o error.

### `GET` `/api/marketing/ads/connections`

Obtiene el estado actual de las integraciones (qué plataformas están conectadas).

**Respuesta:** Array de objetos con el estado de cada plataforma: [{ platform: 'google', connected: true, accountName: '...' }]

### `GET` `/api/marketing/ads/performance`

Recupera los datos de rendimiento de las campañas sincronizadas desde las plataformas publicitarias.

**Parámetros:** dateRange: string (ej: 'last_30_days')

**Respuesta:** JSON con datos agregados de las campañas: { campaigns: [...], summary: {...} }

### `POST` `/api/marketing/ads/conversion-events`

Endpoint interno (no llamado directamente por el frontend) para registrar y enviar un evento de conversión a la plataforma publicitaria correspondiente cuando ocurre una acción clave en el ERP (ej: primera cita asistida).

**Parámetros:** eventName: string, patientId: string, clickId: string (gclid/fbclid), eventTime: timestamp, value: number

**Respuesta:** JSON con el estado del envío: { success: true, message: 'Conversion sent' }

### `PUT` `/api/marketing/ads/settings`

Guarda la configuración de la integración, como qué eventos del ERP se deben enviar como conversiones.

**Parámetros:** conversionEvents: [{ erpEvent: '...', platformEvent: '...', platform: '...' }]

**Respuesta:** JSON con la configuración actualizada: { settings: {...} }

## 🗂️ Estructura Backend (MERN)

El backend utiliza modelos para persistir las credenciales y configuraciones de la integración de forma segura. Los controladores contienen la lógica para interactuar con las APIs de Google/Meta, manejar el flujo OAuth y procesar los datos. Las rutas exponen estos servicios de forma segura al frontend.

### Models

#### MarketingIntegration

platform: String (ej: 'google_ads', 'meta_ads'), accountId: String, accessToken: String (cifrado), refreshToken: String (cifrado), scopes: [String], expiresAt: Date, clinicId: ObjectId

#### PatientConversionLead

patientId: ObjectId, sourcePlatform: String, clickId: String (ej: gclid, fbclid), campaignId: String, adGroupId: String, keyword: String, landingPageUrl: String, createdAt: Date

### Controllers

#### AdsIntegrationController

- initiateOAuth
- handleOAuthCallback
- getConnectionsStatus
- getCampaignPerformance
- saveIntegrationSettings
- sendOfflineConversion

### Routes

#### `/api/marketing/ads`

- POST /connect/:platform
- GET /callback/:platform
- GET /connections
- GET /performance
- PUT /settings

## 🔄 Flujos

1. El usuario de Marketing accede a la página de 'Integración con Ads' y ve las opciones para conectar Google Ads y Meta Ads.
2. Hace clic en 'Conectar' para Google Ads, es redirigido a la página de consentimiento de Google, autoriza el acceso y es devuelto al ERP.
3. El sistema guarda de forma segura los tokens de acceso y muestra la cuenta como 'Conectada'.
4. El usuario configura qué eventos del ERP (ej. 'Cita Completada') deben enviarse como conversiones a Google Ads.
5. Un nuevo paciente potencial llega a la web de la clínica desde un anuncio, y su `gclid` se captura en el formulario de contacto/cita.
6. Cuando el paciente se registra en el ERP, el `gclid` se almacena en su ficha (modelo PatientConversionLead).
7. Cuando ese paciente completa su primera cita, un proceso en el backend detecta el evento, recupera el `gclid` y envía una 'conversión offline' a la API de Google Ads.
8. El usuario de Marketing puede ver en el dashboard del ERP una tabla que muestra 'Campaña X', su coste, y el número de 'Citas Completadas' y 'Pacientes Nuevos' que ha generado, calculando el ROI.

## 📝 User Stories

- Como Responsable de Marketing, quiero conectar nuestras cuentas de Google Ads y Meta Ads al ERP para poder medir el ROI real de mis campañas sin tener que cruzar datos manualmente.
- Como Responsable de Marketing, quiero configurar qué acciones de los pacientes dentro del ERP (como iniciar un tratamiento) se cuentan como conversiones para que los algoritmos de las plataformas publicitarias optimicen mis anuncios para atraer a los pacientes más valiosos.
- Como Administrador de IT, quiero asegurarme de que la conexión con las APIs de Google y Meta sea segura y que las credenciales (tokens) se almacenen de forma cifrada para proteger los datos de la clínica.
- Como Director de la Clínica, quiero ver un informe que me muestre cuánto hemos gastado en cada campaña publicitaria y cuántos ingresos han generado los pacientes captados por ella para tomar decisiones estratégicas de inversión.

## ⚙️ Notas Técnicas

- Seguridad: Es imperativo cifrar los tokens de acceso y actualización en la base de datos (cifrado en reposo). Utilizar variables de entorno para almacenar los Client ID y Client Secret de las aplicaciones OAuth.
- OAuth 2.0: Implementar el flujo de 'Authorization Code' con PKCE si es posible, ya que es el más seguro para aplicaciones web.
- Sincronización de datos: Utilizar un planificador de tareas (como node-cron o BullMQ) en el backend para sincronizar periódicamente los datos de rendimiento de las campañas (ej. una vez al día) para no depender de llamadas en tiempo real que pueden ser lentas.
- API Rate Limiting: Implementar una gestión cuidadosa de las llamadas a las APIs de Google y Meta para no exceder sus límites de peticiones, utilizando estrategias de backoff exponencial en caso de error.
- Atribución: El sistema debe ser capaz de capturar y almacenar correctamente los identificadores de clic (gclid para Google, fbclid para Meta) desde los formularios web de la clínica. Esto requiere una integración entre la web y el ERP.
- Privacidad de datos: Al enviar conversiones, asegurarse de cumplir con las normativas de privacidad (RGPD, HIPAA). Enviar datos de forma anónima o con hash siempre que sea posible y evitar enviar información personal identificable (PHI) sensible, utilizando identificadores únicos no personales.

