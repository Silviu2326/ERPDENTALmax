# Pixel/Conversiones y UTM Tracking

**Categoría:** Marketing y Web | **Módulo:** Marketing Avanzado y Web

La funcionalidad 'Pixel/Conversiones y UTM Tracking' es una herramienta estratégica dentro del módulo 'Marketing Avanzado y Web' del ERP dental. Su propósito principal es cerrar el ciclo entre las inversiones en marketing digital y los resultados reales en la clínica, como la captación de nuevos pacientes y la reserva de citas. Permite a los responsables de marketing configurar, gestionar y desplegar píxeles de seguimiento de las principales plataformas publicitarias (como Meta Ads, Google Ads, TikTok Ads) directamente desde el ERP. Además, facilita la creación y el seguimiento de parámetros UTM (Urchin Tracking Module) para analizar el rendimiento de campañas específicas. El sistema centraliza la configuración de estos scripts de seguimiento y genera un único snippet de código para ser insertado en el sitio web público de la clínica. Cuando un paciente potencial interactúa con una campaña (por ejemplo, un anuncio en Instagram) y agenda una cita a través del widget web del ERP, el sistema captura automáticamente los datos de la campaña (fuente, medio, nombre de la campaña) y los asocia al registro del nuevo paciente o lead. Esto proporciona una trazabilidad completa, permitiendo a la clínica no solo saber cuántos clics generó una campaña, sino cuántos de esos clics se convirtieron en pacientes reales y qué valor económico generaron a largo plazo, optimizando así el retorno de la inversión (ROI) publicitaria.

## 👥 Roles de Acceso

- Marketing / CRM
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/marketing-avanzado-web/`

Esta funcionalidad se encuentra dentro de la feature 'marketing-avanzado-web'. La subcarpeta '/pages' contiene el componente de página principal 'TrackingConfigPage.tsx' donde los usuarios gestionan las configuraciones. En '/components' se alojan los elementos de la interfaz, como formularios para agregar píxeles ('PixelConfigForm'), tablas para listar eventos de conversión ('ConversionEventsTable') y un componente para mostrar el snippet de código a implementar ('TrackingSnippetDisplay'). La carpeta '/apis' contiene las funciones que se comunican con el backend para guardar y recuperar estas configuraciones de seguimiento.

### Archivos Frontend

- `/features/marketing-avanzado-web/pages/TrackingConfigPage.tsx`
- `/features/marketing-avanzado-web/components/PixelConfigForm.tsx`
- `/features/marketing-avanzado-web/components/ConversionEventsTable.tsx`
- `/features/marketing-avanzado-web/components/TrackingSnippetDisplay.tsx`
- `/features/marketing-avanzado-web/apis/trackingApi.ts`

### Componentes React

- TrackingConfigPage
- PixelConfigForm
- ConversionEventsTable
- TrackingSnippetDisplay
- PlatformSelector

## 🔌 APIs Backend

Las APIs gestionan la configuración de los píxeles y eventos de conversión por clínica. También existe un endpoint clave en la creación de leads/pacientes que captura y almacena los datos UTM provenientes de los formularios web.

### `GET` `/api/tracking/configurations`

Obtiene todas las configuraciones de píxeles y seguimiento para la clínica autenticada.

**Respuesta:** Un array de objetos de configuración de seguimiento.

### `POST` `/api/tracking/configurations`

Crea una nueva configuración de píxel para una plataforma específica (ej. Meta, Google Ads).

**Parámetros:** body: { platform: string, pixelId: string, isEnabled: boolean, conversionEvents: [...] }

**Respuesta:** El objeto de la nueva configuración creada.

### `PUT` `/api/tracking/configurations/:id`

Actualiza una configuración de seguimiento existente (ej. para activarla/desactivarla o cambiar el ID).

**Parámetros:** path: id (ID de la configuración), body: { pixelId?: string, isEnabled?: boolean, conversionEvents?: [...] }

**Respuesta:** El objeto de la configuración actualizada.

### `DELETE` `/api/tracking/configurations/:id`

Elimina una configuración de seguimiento.

**Parámetros:** path: id (ID de la configuración)

**Respuesta:** Un mensaje de confirmación.

### `POST` `/api/leads/public`

Endpoint público para crear un nuevo lead desde el formulario web de la clínica, capturando datos del paciente y parámetros UTM.

**Parámetros:** body: { name: string, email: string, phone: string, utm_source?: string, utm_medium?: string, utm_campaign?: string, utm_term?: string, utm_content?: string }

**Respuesta:** El objeto del nuevo lead creado en el sistema.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con dos modelos principales: 'TrackingConfig' para almacenar los ajustes de los píxeles, y el modelo 'Lead' (o 'Paciente') que se ha extendido para incluir campos UTM. Un controlador específico ('TrackingController') maneja el CRUD de las configuraciones, mientras que el 'LeadController' se encarga de la lógica de creación de leads incluyendo la información de marketing.

### Models

#### TrackingConfig

clinicId: ObjectId, platform: String (enum: ['Meta', 'GoogleAds', 'TikTok']), pixelId: String, isEnabled: Boolean, conversionEvents: [{ eventName: String, eventCode: String }], createdAt: Date, updatedAt: Date

#### Lead

name: String, email: String, phone: String, status: String, clinicId: ObjectId, utm_source: String, utm_medium: String, utm_campaign: String, utm_term: String, utm_content: String, firstInteractionDate: Date

### Controllers

#### TrackingController

- getConfigurations
- createConfiguration
- updateConfiguration
- deleteConfiguration

#### LeadController

- createPublicLead

### Routes

#### `/api/tracking`

- GET /configurations
- POST /configurations
- PUT /configurations/:id
- DELETE /configurations/:id

#### `/api/leads`

- POST /public

## 🔄 Flujos

1. El usuario de marketing accede a 'Marketing Avanzado > Pixel/Conversiones'.
2. El sistema muestra la lista de configuraciones de píxeles existentes.
3. El usuario hace clic en 'Añadir Nuevo Píxel', selecciona 'Meta', introduce su Pixel ID y lo activa.
4. El sistema genera y muestra un snippet de JavaScript que el administrador web debe insertar en el `<head>` del sitio web de la clínica.
5. Un paciente potencial ve un anuncio en Facebook, hace clic, y llega al sitio de la clínica con los parámetros UTM en la URL.
6. El paciente rellena el formulario de contacto/cita. El script del sitio captura los UTM.
7. Al enviar el formulario, se realiza una llamada a `POST /api/leads/public` incluyendo los datos del paciente y los UTM capturados.
8. El backend crea un nuevo registro 'Lead' con toda la información, asociándolo a la campaña correcta.
9. El usuario de marketing puede ahora generar informes que conectan el gasto en la campaña de Facebook con los leads generados.

## 📝 User Stories

- Como gerente de marketing, quiero configurar el Pixel de Meta y el tag de Google Ads desde una única interfaz en el ERP para simplificar la gestión del seguimiento de conversiones.
- Como gerente de marketing, quiero que cada nuevo paciente registrado a través de la web tenga asociada la información UTM de la campaña que lo trajo, para poder medir el ROI de cada canal.
- Como administrador de la clínica, quiero ver qué campañas de marketing están generando los pacientes que contratan los tratamientos de mayor valor.
- Como desarrollador web de la clínica, quiero recibir un único script de seguimiento del ERP que contenga todas las configuraciones de píxeles activas, para facilitar la implementación y el mantenimiento del sitio web.

## ⚙️ Notas Técnicas

- Seguridad: Es crucial validar y sanitizar todos los IDs de píxeles y otros campos de configuración para prevenir ataques XSS. El endpoint público de creación de leads debe tener rate limiting para evitar spam.
- Privacidad (GDPR/LOPD): El script generado por el ERP debe ser compatible con las plataformas de gestión de consentimiento (Consent Management Platforms). Los píxeles no deben activarse hasta que el usuario haya dado su consentimiento explícito a través del banner de cookies del sitio web.
- Rendimiento: El snippet de JavaScript generado debe cargarse de forma asíncrona (`async defer`) para no bloquear el renderizado del sitio web de la clínica.
- Integración: Considerar la creación de un SDK de JavaScript ligero o un paquete NPM para facilitar la integración en sitios web construidos con diferentes tecnologías (Wordpress, Webflow, etc.), que manejaría la captura de UTMs y la comunicación con la API del ERP.
- Atribución: El modelo de atribución inicial será de 'último clic', pero se debe diseñar la base de datos para poder implementar modelos más avanzados en el futuro (ej. lineal, basado en el tiempo).

