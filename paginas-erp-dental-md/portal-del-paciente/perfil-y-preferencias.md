# Perfil y Preferencias

**Categoría:** Portal del Paciente | **Módulo:** Portal del Paciente

La funcionalidad 'Perfil y Preferencias' es una sección central dentro del 'Portal del Paciente' del ERP dental. Está diseñada para empoderar al paciente, dándole control directo sobre su información personal, de contacto y sus preferencias de comunicación con la clínica. Esta página sirve como el centro de datos personal del paciente, donde puede visualizar y actualizar detalles cruciales como su dirección, número de teléfono, correo electrónico, contacto de emergencia e información de su seguro dental. Al permitir que los pacientes gestionen su propia información, se reduce significativamente la carga administrativa del personal de recepción, se minimizan los errores de transcripción y se asegura que los registros de la clínica estén siempre actualizados. Además de los datos básicos, la sección de preferencias permite al paciente personalizar su experiencia, eligiendo cómo desea recibir las comunicaciones importantes, como recordatorios de citas (vía SMS, email o notificaciones push), boletines informativos o promociones. Esta personalización mejora la satisfacción del paciente y la efectividad de la comunicación. Desde una perspectiva del sistema, esta funcionalidad es vital para mantener la integridad de los datos en todo el ERP, afectando módulos como Facturación (con la información del seguro) y Agenda de Citas (con los datos de contacto para recordatorios).

## 👥 Roles de Acceso

- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-paciente/`

Esta funcionalidad reside completamente dentro de la feature 'portal-paciente'. La carpeta '/pages/' contiene el componente principal 'PerfilPreferenciasPage.tsx' que renderiza la interfaz completa. La carpeta '/components/' alberga componentes reutilizables y especializados para cada sección del perfil, como 'FormularioDatosPersonales.tsx' o 'ConfiguracionNotificaciones.tsx', promoviendo la modularidad y la facilidad de mantenimiento. La lógica de comunicación con el backend está encapsulada en la carpeta '/apis/', con funciones específicas como 'getMiPerfil' y 'updateMiPerfil' que realizan las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/portal-paciente/pages/PerfilPreferenciasPage.tsx`
- `/features/portal-paciente/components/perfil/FormularioDatosPersonales.tsx`
- `/features/portal-paciente/components/perfil/FormularioContactoEmergencia.tsx`
- `/features/portal-paciente/components/perfil/GestionSeguroDental.tsx`
- `/features/portal-paciente/components/perfil/ConfiguracionNotificaciones.tsx`
- `/features/portal-paciente/components/perfil/SeccionSeguridad.tsx`
- `/features/portal-paciente/apis/perfilApi.ts`

### Componentes React

- PerfilPreferenciasPage
- FormularioDatosPersonales
- FormularioContactoEmergencia
- GestionSeguroDental
- ConfiguracionNotificaciones
- SeccionSeguridad

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en obtener y actualizar la información del perfil del paciente autenticado. Se requiere un conjunto de endpoints seguros y específicos que permitan la modificación granular de los datos.

### `GET` `/api/pacientes/perfil/me`

Obtiene todos los datos del perfil del paciente actualmente autenticado, incluyendo información personal, de contacto, emergencia, seguro y preferencias.

**Parámetros:** Token de autenticación (JWT) en la cabecera.

**Respuesta:** Un objeto JSON con los datos completos del perfil del paciente.

### `PUT` `/api/pacientes/perfil/me/datos-personales`

Actualiza la información personal y de contacto del paciente autenticado (nombre, dirección, teléfono, etc.).

**Parámetros:** Token de autenticación (JWT) en la cabecera., Body: Objeto JSON con los campos a actualizar.

**Respuesta:** Un objeto JSON con el perfil actualizado del paciente.

### `PUT` `/api/pacientes/perfil/me/seguro`

Actualiza la información del seguro dental del paciente autenticado.

**Parámetros:** Token de autenticación (JWT) en la cabecera., Body: Objeto JSON con los datos del seguro.

**Respuesta:** Un objeto JSON con el perfil actualizado del paciente.

### `PUT` `/api/pacientes/perfil/me/preferencias`

Actualiza las preferencias de comunicación (notificaciones por SMS, email, etc.) del paciente autenticado.

**Parámetros:** Token de autenticación (JWT) en la cabecera., Body: Objeto JSON con las preferencias.

**Respuesta:** Un objeto JSON con el perfil actualizado del paciente.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad a través del modelo 'Paciente', que está vinculado a un modelo 'User' para la autenticación. Un controlador 'PacienteController' gestiona la lógica de negocio para acceder y modificar los datos del perfil, asegurando que un usuario solo pueda operar sobre su propia información. Las rutas están definidas en 'pacienteRoutes.js' y protegidas por middleware de autenticación.

### Models

#### Paciente

Contiene campos como: 'usuarioId' (referencia a User), 'nombres', 'apellidos', 'fechaNacimiento', 'genero', 'documentoIdentidad', 'direccion' (subdocumento con calle, ciudad, etc.), 'telefono', 'contactoEmergencia' (subdocumento con nombre y teléfono), 'informacionSeguro' (subdocumento con nombre de aseguradora, número de póliza), 'preferenciasComunicacion' (subdocumento con flags booleanos como 'recordatorioEmail', 'recordatorioSms').

#### User

Contiene los campos de autenticación: 'email', 'password' (hash), 'rol' (con valor 'paciente'), 'pacienteId' (referencia a Paciente).

### Controllers

#### PacienteController

- obtenerMiPerfil
- actualizarDatosPersonales
- actualizarInformacionSeguro
- actualizarPreferenciasComunicacion

### Routes

#### `/api/pacientes`

- GET /perfil/me
- PUT /perfil/me/datos-personales
- PUT /perfil/me/seguro
- PUT /perfil/me/preferencias

## 🔄 Flujos

1. El paciente inicia sesión en el portal y navega a la sección 'Mi Perfil'.
2. El frontend realiza una llamada GET a '/api/pacientes/perfil/me' para cargar y mostrar los datos actuales del paciente en los formularios correspondientes.
3. El paciente modifica su número de teléfono en el formulario de datos personales y hace clic en 'Guardar'.
4. El frontend envía una petición PUT a '/api/pacientes/perfil/me/datos-personales' con la información actualizada.
5. El backend valida los datos, actualiza el documento del paciente en MongoDB y devuelve el perfil actualizado.
6. El frontend muestra un mensaje de confirmación y refresca la información en la UI.
7. El paciente activa la opción de 'Recordatorios por SMS' en la sección de preferencias y guarda los cambios, disparando un flujo similar hacia el endpoint de preferencias.

## 📝 User Stories

- Como paciente, quiero ver toda mi información personal y de contacto en un solo lugar para asegurarme de que la clínica tenga mis datos correctos.
- Como paciente, quiero poder actualizar mi dirección o número de teléfono yo mismo a través del portal para no tener que llamar a la clínica o hacerlo en persona.
- Como paciente, quiero gestionar mis preferencias de notificación para elegir si prefiero recibir recordatorios de citas por email o por SMS.
- Como paciente, quiero poder actualizar la información de mi seguro dental cuando cambie de proveedor para asegurar que la facturación sea correcta y evitar problemas.
- Como paciente, quiero tener una sección para cambiar mi contraseña de forma segura para proteger la privacidad de mi información médica y personal.

## ⚙️ Notas Técnicas

- Seguridad: Todos los endpoints de perfil deben estar protegidos con un middleware que verifique el token JWT y asegure que el paciente solo puede acceder y modificar su propia información (ej. comparando el ID del token con el ID del recurso solicitado).
- Validación de Datos: Implementar validación robusta tanto en el frontend (para feedback inmediato al usuario) como en el backend (para seguridad e integridad de datos) usando librerías como Zod o Joi.
- Manejo de Estado en Frontend: Utilizar una librería de gestión de estado (como Redux Toolkit, Zustand o Context API de React) para manejar los datos del perfil, estados de carga y errores de forma centralizada y eficiente.
- UI/UX: Dividir la página en secciones claras y manejables (ej. Pestañas o Acordeones para 'Datos Personales', 'Seguro', 'Preferencias') para no abrumar al usuario. Proporcionar feedback visual claro (spinners, toasts de éxito/error) durante las operaciones de guardado.
- Auditoría: Considerar registrar los cambios importantes en el perfil del paciente (ej. cambio de dirección o seguro) en un log de auditoría para trazabilidad.

