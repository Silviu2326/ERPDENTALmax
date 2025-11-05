# Sala de Videoconsulta

**Categoría:** Telemedicina | **Módulo:** Teleodontología

La 'Sala de Videoconsulta' es una funcionalidad central dentro del módulo de 'Teleodontología' del ERP dental. Permite a odontólogos y pacientes conectarse en tiempo real a través de una videollamada segura y de alta calidad, directamente desde el sistema. Su propósito principal es eliminar las barreras geográficas, ofreciendo una alternativa viable para consultas de seguimiento, revisiones postoperatorias, evaluación de urgencias menores, segundas opiniones o consultas iniciales de ortodoncia y estética. Dentro del ERP, esta funcionalidad se integra directamente con el módulo de 'Agenda de Citas'. Una cita marcada como 'Teleconsulta' generará automáticamente un enlace único y seguro para la sala virtual. Al llegar la hora de la cita, tanto el odontólogo (desde su panel principal) como el paciente (desde su portal) recibirán una notificación para unirse a la sala. La plataforma gestiona la autenticación para asegurar que solo las partes involucradas puedan acceder. Durante la consulta, la interfaz ofrece herramientas como chat de texto, compartición de pantalla para mostrar radiografías o planes de tratamiento, y controles para gestionar audio y video. Al finalizar, el sistema registra la duración, y permite al odontólogo añadir notas clínicas directamente a la historia del paciente, manteniendo toda la información centralizada y coherente.

## 👥 Roles de Acceso

- Odontólogo
- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/teleodontologia/`

Esta funcionalidad reside dentro de la feature 'teleodontologia'. La carpeta `/pages` contiene el componente principal de la página, `SalaVideoconsultaPage.tsx`, que actúa como el contenedor de la experiencia. La carpeta `/components` aloja los elementos de la interfaz de usuario, como `VideoStreamVentana`, `ControlesLlamadaPanel` y `ChatLateralComponente`, que son ensamblados en la página principal. La lógica de comunicación con el backend, como la obtención de tokens de acceso a la sala y el envío de eventos, se maneja a través de funciones definidas en la carpeta `/apis`.

### Archivos Frontend

- `/features/teleodontologia/pages/SalaVideoconsultaPage.tsx`
- `/features/teleodontologia/components/PreLlamadaCheck.tsx`
- `/features/teleodontologia/components/VideoStreamVentana.tsx`
- `/features/teleodontologia/components/ControlesLlamadaPanel.tsx`
- `/features/teleodontologia/components/ChatLateralComponente.tsx`
- `/features/teleodontologia/apis/videoconsultaApi.ts`

### Componentes React

- SalaVideoconsultaPage
- PreLlamadaCheck
- VideoStreamVentana
- ControlesLlamadaPanel
- ChatLateralComponente
- InfoConsultaHeader
- GrabacionConsentimientoModal

## 🔌 APIs Backend

Las APIs son responsables de gestionar el ciclo de vida de una sesión de videoconsulta. Esto incluye validar que un usuario (paciente u odontólogo) tiene permiso para unirse a una sala específica en un momento determinado, generar un token de acceso temporal y seguro para conectarse al servicio de video de terceros, y registrar eventos clave de la sesión.

### `GET` `/api/teleodontologia/consultas/:id/detalles`

Obtiene los detalles de una teleconsulta programada, incluyendo el estado y el ID de la sesión de video asociada. Se usa para preparar la interfaz antes de unirse.

**Parámetros:** id: string (ID de la cita/teleconsulta)

**Respuesta:** JSON con los detalles de la teleconsulta (paciente, odontólogo, fecha, estado, videoSessionId).

### `POST` `/api/teleodontologia/consultas/:id/unirse`

Valida la autorización del usuario y genera un token de acceso único y de corta duración para que el cliente (frontend) se conecte a la sala de video. Es el paso clave de seguridad.

**Parámetros:** id: string (ID de la cita/teleconsulta), rol: string ('odontologo' o 'paciente') en el body

**Respuesta:** JSON con un `accessToken` para el servicio de WebRTC y el `roomId`.

### `POST` `/api/teleodontologia/consultas/:id/eventos`

Registra eventos importantes de la sesión en la base de datos para auditoría y seguimiento (ej: 'usuario_unido', 'usuario_salido', 'grabacion_iniciada', 'consulta_finalizada').

**Parámetros:** id: string (ID de la cita/teleconsulta), evento: string, timestamp: Date, metadata: object

**Respuesta:** JSON con un estado de confirmación `status: 'ok'`.

### `PUT` `/api/teleodontologia/consultas/:id/finalizar`

Marca la consulta como 'Finalizada' y registra la duración total de la sesión.

**Parámetros:** id: string (ID de la cita/teleconsulta), duracionSegundos: number

**Respuesta:** JSON con el objeto de la teleconsulta actualizado.

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo `Teleconsulta` para almacenar la información de cada sesión. Un `TeleconsultaController` contiene la lógica para gestionar el acceso y el estado de las consultas, interactuando con un servicio de video externo (vía SDK) para generar los tokens. Las rutas se definen en un archivo específico para la teleodontología, asegurando una organización limpia y RESTful.

### Models

#### Teleconsulta

citaId: ObjectId (ref: 'Cita'), pacienteId: ObjectId (ref: 'Paciente'), odontologoId: ObjectId (ref: 'Profesional'), fechaHora: Date, estado: String ('Programada', 'En Curso', 'Finalizada', 'Cancelada'), videoSessionId: String (ID único de la sala/sesión), duracionMinutos: Number, grabacionUrl: String, logEventos: Array

### Controllers

#### TeleconsultaController

- obtenerDetallesConsulta
- generarTokenAcceso
- registrarEvento
- finalizarConsulta

### Routes

#### `/api/teleodontologia/consultas`

- GET /:id/detalles
- POST /:id/unirse
- POST /:id/eventos
- PUT /:id/finalizar

## 🔄 Flujos

1. 1. El Paciente, desde su portal, ve su cita de teleconsulta y hace clic en 'Unirse a la sala'.
2. 2. El sistema muestra una pantalla de 'Pre-llamada' donde el paciente verifica su cámara y micrófono y otorga los permisos necesarios al navegador.
3. 3. Al confirmar, el frontend llama al endpoint `POST /api/teleodontologia/consultas/:id/unirse`.
4. 4. El backend valida que es el paciente correcto y que la cita está próxima a comenzar. Si todo es correcto, genera un token de acceso y lo devuelve.
5. 5. El frontend usa este token para conectarse al servicio de video y entra en una sala de espera virtual.
6. 6. El Odontólogo sigue un flujo similar desde su agenda en el ERP.
7. 7. Cuando ambas partes están conectadas, la consulta comienza. El sistema registra el evento 'En Curso'.
8. 8. Al finalizar, cualquiera de las partes puede colgar. El sistema detecta la desconexión, llama al endpoint `PUT /:id/finalizar` para actualizar el estado y registrar la duración.

## 📝 User Stories

- Como Odontólogo, quiero acceder a una sala de videoconsulta con un solo clic desde la agenda para iniciar la atención remota de mi paciente puntualmente.
- Como Paciente, quiero unirme a mi videoconsulta desde mi portal de forma sencilla y segura para recibir atención sin desplazarme.
- Como Odontólogo, quiero poder compartir mi pantalla durante la videoconsulta para mostrar al paciente sus radiografías o un plan de tratamiento visual.
- Como Paciente, quiero tener un chat de texto disponible durante la llamada para poder compartir enlaces o escribir información si mi audio falla.
- Como Administrador de la clínica, quiero que las teleconsultas finalizadas queden registradas en la historia del paciente para propósitos de auditoría y facturación.

## ⚙️ Notas Técnicas

- Integración Externa: Es fundamental integrar un servicio PaaS de WebRTC como Twilio Video, Vonage Video API o Daily.co. El backend utilizará el SDK de este proveedor para la creación de salas y la generación de tokens de acceso.
- Seguridad: Todo el tráfico de video y audio debe ser encriptado de extremo a extremo (E2EE). La generación de tokens de acceso debe estar fuertemente ligada a la sesión del usuario autenticado en el ERP y tener una vida útil corta (ej: 5 minutos) para prevenir el re-uso.
- Cumplimiento Normativo: Si el sistema se utiliza en regiones con normativas estrictas de salud (como HIPAA en EE.UU.), el proveedor de WebRTC seleccionado debe ser compatible y firmar un BAA (Business Associate Agreement).
- Experiencia de Usuario (UX): Implementar una comprobación de dispositivos (cámara/micrófono) y de conectividad antes de unirse a la llamada es crucial para minimizar problemas técnicos y frustración.
- Gestión de Estado: Utilizar una librería de gestión de estado en el frontend (como Redux Toolkit o Zustand) para manejar el estado complejo de la llamada (conectado, desconectado, silenciado, compartiendo pantalla, etc.).
- Grabación: Si se implementa la grabación de sesiones, se debe obtener consentimiento explícito del paciente (mediante un modal antes de iniciar) y almacenar los archivos de forma segura y encriptada, asociándolos al historial clínico del paciente.

