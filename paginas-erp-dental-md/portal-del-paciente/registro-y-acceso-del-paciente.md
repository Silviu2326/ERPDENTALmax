# Registro y Acceso del Paciente

**Categoría:** Portal del Paciente | **Módulo:** Portal del Paciente

El módulo de 'Registro y Acceso del Paciente' es el punto de entrada fundamental al Portal del Paciente dentro del ERP dental. Esta funcionalidad está diseñada para proporcionar a los pacientes un método seguro y autónomo para crear su propia cuenta y acceder a su información personal y clínica. Sirve como la puerta de enlace digital a la clínica, permitiendo a los pacientes interactuar con sus datos de salud, gestionar citas, ver historiales de tratamiento, acceder a planes de pago y comunicarse de forma segura con el personal de la clínica. El proceso de registro captura información esencial y la vincula con su ficha de paciente existente o crea una nueva, tras una validación. El sistema de acceso utiliza credenciales seguras (email y contraseña), implementando las mejores prácticas de seguridad como el hashing de contraseñas y la autenticación basada en tokens (JWT). Además, incluye flujos críticos como la verificación de correo electrónico para activar la cuenta y un mecanismo para la recuperación de contraseña, asegurando que los pacientes puedan recuperar el acceso a su cuenta de manera segura si olvidan sus credenciales. Esta funcionalidad no solo mejora la experiencia del paciente ofreciendo conveniencia y autonomía, sino que también reduce la carga administrativa del personal de recepción al automatizar la gestión de cuentas de usuario.

## 👥 Roles de Acceso

- Paciente (Portal)
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-paciente/`

Esta funcionalidad reside dentro de la feature 'portal-paciente'. Las páginas principales como la de inicio de sesión, registro y recuperación de contraseña se encuentran en la subcarpeta '/pages'. Los componentes reutilizables que conforman estas páginas, como los formularios de login ('LoginForm'), registro ('RegistrationForm') y el layout general de autenticación ('AuthLayout'), están ubicados en '/components'. Las llamadas al backend para registrar, autenticar y gestionar la cuenta del usuario se definen y exportan desde la subcarpeta '/apis', manteniendo una clara separación de responsabilidades.

### Archivos Frontend

- `/features/portal-paciente/pages/LoginPage.tsx`
- `/features/portal-paciente/pages/RegisterPage.tsx`
- `/features/portal-paciente/pages/ForgotPasswordPage.tsx`
- `/features/portal-paciente/pages/ResetPasswordPage.tsx`
- `/features/portal-paciente/pages/VerifyEmailPage.tsx`

### Componentes React

- AuthLayout
- LoginForm
- RegistrationForm
- ForgotPasswordForm
- ResetPasswordForm

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan todo el ciclo de vida de la autenticación del paciente. Esto incluye la creación de una nueva cuenta, la validación de credenciales para el inicio de sesión, la generación y gestión de tokens de sesión (JWT), y los flujos seguros para la recuperación de contraseña y verificación de correo electrónico.

### `POST` `/api/auth/register`

Registra un nuevo paciente en el sistema. Valida los datos, crea el usuario con una contraseña hasheada y envía un correo de verificación.

**Parámetros:** nombre: string, apellidos: string, email: string, password: string, fechaNacimiento: date, telefono: string

**Respuesta:** Objeto de usuario recién creado (sin datos sensibles) y un mensaje de éxito.

### `POST` `/api/auth/login`

Autentica a un paciente existente. Compara la contraseña proporcionada con el hash almacenado y, si es correcta, devuelve un token JWT.

**Parámetros:** email: string, password: string

**Respuesta:** Token JWT para la autenticación en subsecuentes peticiones y datos básicos del usuario.

### `POST` `/api/auth/forgot-password`

Inicia el proceso de recuperación de contraseña. Genera un token de reseteo único y lo envía al correo electrónico del paciente.

**Parámetros:** email: string

**Respuesta:** Mensaje de confirmación indicando que se ha enviado el correo si el usuario existe.

### `POST` `/api/auth/reset-password/:token`

Establece una nueva contraseña utilizando el token de reseteo. Valida el token y actualiza la contraseña del paciente.

**Parámetros:** password: string

**Respuesta:** Mensaje de éxito confirmando la actualización de la contraseña.

### `GET` `/api/auth/verify-email/:token`

Verifica la dirección de correo electrónico del usuario a través de un token enviado durante el registro.

**Respuesta:** Redirección a la página de login con un mensaje de éxito o una página de error si el token no es válido.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con un modelo 'User' dedicado a la autenticación, un controlador 'AuthController' que contiene toda la lógica de negocio, y un enrutador 'authRoutes' que expone los endpoints necesarios de forma segura y organizada.

### Models

#### User

Representa la cuenta de un usuario con acceso al portal. Este modelo se vincula al modelo 'Paciente' a través de una referencia. Campos clave: `email: { type: String, unique: true, required: true }`, `password: { type: String, required: true, select: false }`, `pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' }`, `isEmailVerified: { type: Boolean, default: false }`, `passwordResetToken: String`, `passwordResetExpires: Date`, `emailVerificationToken: String`.

#### Paciente

Contiene toda la información demográfica y clínica del paciente. Campos relevantes para el registro: `nombre: String`, `apellidos: String`, `fechaNacimiento: Date`, `telefono: String`, `email: String`. Se vincula al modelo 'User' para la autenticación.

### Controllers

#### AuthController

- register
- login
- forgotPassword
- resetPassword
- verifyEmail
- protect

### Routes

#### `/api/auth`

- POST /register
- POST /login
- POST /forgot-password
- POST /reset-password/:token
- GET /verify-email/:token

## 🔄 Flujos

1. Flujo de Registro: El nuevo paciente completa el formulario de registro -> El sistema valida los datos y la unicidad del email -> Se crea un nuevo registro en los modelos 'User' y 'Paciente' -> Se genera un token de verificación y se envía un email al paciente -> El paciente hace clic en el enlace del email, el sistema verifica el token y activa la cuenta.
2. Flujo de Acceso: El paciente introduce su email y contraseña en el formulario de login -> El sistema verifica las credenciales contra la base de datos -> Si son correctas, se genera un token JWT que se almacena de forma segura en el cliente -> El paciente es redirigido al dashboard principal del Portal del Paciente.
3. Flujo de Recuperación de Contraseña: El paciente hace clic en '¿Olvidaste tu contraseña?' e introduce su email -> El sistema verifica si el email existe, genera un token de reseteo con tiempo de expiración y lo envía por email -> El paciente sigue el enlace, llega a una página para introducir y confirmar su nueva contraseña -> El sistema valida el token y actualiza la contraseña en la base de datos.

## 📝 User Stories

- Como un nuevo paciente, quiero poder registrarme en el portal de la clínica usando mi correo electrónico para poder gestionar mis citas y ver mi historial.
- Como un paciente registrado, quiero poder iniciar sesión de forma segura para acceder a mi información personal y de tratamientos.
- Como un paciente que ha olvidado su contraseña, quiero solicitar un enlace para restablecerla por correo electrónico y así poder recuperar el acceso a mi cuenta.
- Como paciente, quiero recibir un correo de confirmación después de registrarme para asegurarme de que mi cuenta está correctamente creada y es segura.
- Como administrador de IT, quiero que todas las contraseñas de los pacientes se almacenen de forma segura (hasheadas) para cumplir con las normativas de protección de datos.

## ⚙️ Notas Técnicas

- Seguridad de Contraseñas: Utilizar 'bcrypt' para hashear las contraseñas antes de almacenarlas en MongoDB. Implementar políticas de contraseñas seguras en el frontend (longitud mínima, combinación de caracteres).
- Autenticación con JWT: Usar JSON Web Tokens (JWT) para gestionar las sesiones. El token debe ser firmado con un secreto fuerte almacenado en variables de entorno y debe tener un tiempo de expiración.
- Protección de Endpoints: Implementar middleware en Express (ej: 'protect') para verificar el JWT en rutas protegidas, asegurando que solo los pacientes autenticados puedan acceder a su información.
- Validación de Datos: Utilizar librerías como 'Joi' o 'Zod' en el backend para validar y sanear todos los datos de entrada provenientes de los formularios y prevenir ataques como inyección NoSQL.
- Servicio de Email: Integrar un servicio de correo transaccional (como SendGrid, Mailgun o Nodemailer con un proveedor SMTP) para el envío fiable de correos de verificación y recuperación de contraseña.
- Seguridad Adicional: Implementar rate limiting en los endpoints de login y recuperación de contraseña para prevenir ataques de fuerza bruta. Utilizar HTTPS en todo el sitio para encriptar la comunicación.
- Experiencia de Usuario: Proporcionar feedback claro e inmediato en los formularios, como mensajes de error específicos ('El correo ya está en uso') y estados de carga durante las peticiones a la API.

