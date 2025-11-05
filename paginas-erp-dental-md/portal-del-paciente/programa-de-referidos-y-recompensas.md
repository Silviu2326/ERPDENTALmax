# Programa de Referidos y Recompensas

**Categoría:** Portal del Paciente | **Módulo:** Portal del Paciente

El Programa de Referidos y Recompensas es una funcionalidad estratégica diseñada para fomentar el crecimiento orgánico de la clínica y aumentar la lealtad de los pacientes existentes. Integrado directamente en el Portal del Paciente, este módulo transforma a los pacientes satisfechos en embajadores de la marca, incentivándolos a recomendar la clínica a sus amigos, familiares y colegas. Al acceder a esta sección, cada paciente encontrará un código de referido único y personal, junto con herramientas sencillas para compartirlo a través de redes sociales, correo electrónico o mensajería directa. El sistema realiza un seguimiento automatizado de cada referido, desde que el nuevo paciente se registra usando el código hasta que completa su primer tratamiento y realiza el pago correspondiente. Una vez que se cumple la condición preestablecida (por ejemplo, primer tratamiento pagado), el paciente que refirió recibe una cantidad de puntos de recompensa en su cuenta. Estos puntos se acumulan y pueden ser canjeados por un catálogo de premios definidos por la clínica, como descuentos en futuros tratamientos, limpiezas dentales gratuitas, productos de higiene bucal, entre otros. Para el equipo de Marketing y CRM, este módulo ofrece una visión clara del rendimiento del programa, identificando a los pacientes más influyentes y midiendo el retorno de inversión de la estrategia de referidos.

## 👥 Roles de Acceso

- Paciente (Portal)
- Marketing / CRM

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-paciente/`

La funcionalidad del Programa de Referidos se encuentra dentro de la feature 'portal-paciente'. La carpeta '/pages/' contiene el componente principal 'ProgramaReferidosPage.tsx' que renderiza la interfaz completa. Esta página importa y utiliza componentes específicos de la carpeta '/components/', como 'ReferralCodeDisplay', 'ReferredFriendsList' y 'RewardsCatalog'. Todas las interacciones con el backend, como obtener el código de referido o consultar el catálogo de recompensas, se gestionan a través de funciones definidas en la carpeta '/apis/'.

### Archivos Frontend

- `/features/portal-paciente/pages/ProgramaReferidosPage.tsx`

### Componentes React

- ReferralCodeDisplay
- ShareButtons
- ReferredFriendsList
- RewardsPointsBalance
- RewardsCatalog
- HowItWorksGuide
- RedeemRewardModal

## 🔌 APIs Backend

Las APIs para este módulo gestionan la lógica de generación de códigos, seguimiento de referidos, acumulación de puntos y canje de recompensas. Se centran en proporcionar al paciente autenticado su información personal del programa y en permitirle interactuar con el sistema de recompensas.

### `GET` `/api/patients/me/referral-data`

Obtiene toda la información del programa de referidos para el paciente actualmente autenticado, incluyendo su código, puntos actuales y el historial de sus referidos.

**Parámetros:** Autenticación JWT en cabecera

**Respuesta:** JSON con el código de referido, el total de puntos y un array de objetos de referidos con su estado.

### `GET` `/api/rewards`

Obtiene el catálogo completo de recompensas activas que la clínica ofrece y que los pacientes pueden canjear.

**Respuesta:** Un array de objetos, donde cada objeto representa una recompensa con su nombre, descripción, puntos necesarios y tipo.

### `POST` `/api/rewards/redeem/:rewardId`

Permite a un paciente autenticado canjear sus puntos por una recompensa específica. El backend valida si el paciente tiene suficientes puntos.

**Parámetros:** Autenticación JWT en cabecera, rewardId (en URL)

**Respuesta:** JSON con un mensaje de confirmación y el nuevo saldo de puntos del paciente.

## 🗂️ Estructura Backend (MERN)

El backend soporta el programa de referidos mediante modelos específicos para Referidos y Recompensas, y ampliando el modelo de Paciente. Un controlador dedicado gestiona toda la lógica de negocio, y las rutas exponen los endpoints necesarios de forma segura.

### Models

#### Paciente

Se añaden los campos: `referralCode: { type: String, unique: true, sparse: true }`, `referralPoints: { type: Number, default: 0 }`, `referredBy: { type: Schema.Types.ObjectId, ref: 'Paciente', default: null }`.

#### Referral

Campos: `referringPatient: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true }`, `referredPatient: { type: Schema.Types.ObjectId, ref: 'Paciente' }`, `status: { type: String, enum: ['invitado', 'registrado', 'tratamiento_completado', 'recompensado'], default: 'invitado' }`, `createdAt: Date`, `rewardedAt: Date`.

#### Reward

Campos: `name: String`, `description: String`, `pointsRequired: Number`, `type: { type: String, enum: ['descuento_fijo', 'descuento_porcentaje', 'servicio_gratuito'] }`, `isActive: { type: Boolean, default: true }`.

### Controllers

#### ReferralController

- getReferralDataForPatient
- listActiveRewards
- redeemReward
- generateUniqueReferralCode

### Routes

#### `/api/patients`

- GET /me/referral-data

#### `/api/rewards`

- GET /
- POST /redeem/:rewardId

## 🔄 Flujos

1. El paciente accede a la sección 'Programa de Referidos' en su portal.
2. El sistema muestra su código único, su saldo de puntos actual y botones para compartir.
3. El paciente comparte su código con un amigo.
4. El amigo se registra en la clínica (online o en persona) y proporciona el código de referido.
5. El sistema crea una entrada en el modelo 'Referral' vinculando a ambos pacientes.
6. Cuando el paciente referido completa y paga su primer tratamiento, un trigger del sistema de facturación actualiza el estado del referido a 'tratamiento_completado'.
7. Automáticamente, el sistema acredita los puntos correspondientes al paciente que refirió y actualiza el estado a 'recompensado'.
8. El paciente que refirió ve su saldo de puntos actualizado y puede navegar por el catálogo de recompensas para canjearlos.

## 📝 User Stories

- Como paciente, quiero encontrar fácilmente mi código de referido y compartirlo en un clic para poder ganar recompensas.
- Como paciente, quiero ver una lista de mis amigos referidos y su estado (ej. cita completada) para saber cuándo recibiré mis puntos.
- Como paciente, quiero ver mi saldo de puntos y un catálogo claro de recompensas para poder decidir cómo usar mis puntos.
- Como gerente de marketing, quiero poder configurar las recompensas (p. ej. nombre, puntos necesarios) desde el panel de administración para mantener el programa atractivo.
- Como gerente de CRM, quiero generar un informe de los pacientes con más referidos exitosos para poder identificarlos y ofrecerles incentivos adicionales.

## ⚙️ Notas Técnicas

- Seguridad: Implementar medidas para prevenir el auto-referido (p. ej., misma IP, datos de contacto similares). El canje de recompensas debe ser una transacción atómica para evitar dobles gastos de puntos.
- Generación de Códigos: El código de referido debe ser único, relativamente corto y fácil de leer/escribir. Se puede usar una librería como 'nanoid' para generar cadenas seguras y únicas.
- Integración: Es crucial una integración robusta con el módulo de 'Facturación y Pagos'. La adjudicación de puntos debe ser un proceso automatizado que se dispare con un evento de 'primer_pago_completado' del nuevo paciente.
- Notificaciones: Considerar la implementación de notificaciones (email o dentro del portal) para informar al paciente cuando un referido se registra con éxito y cuando se le acreditan los puntos.
- Escalabilidad: El modelo 'Referral' está diseñado para escalar, ya que evita almacenar un array de referidos que podría crecer indefinidamente dentro del documento del Paciente.

