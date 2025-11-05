# Transferencia de Pacientes entre Sedes

**Categoría:** Multi-sede | **Módulo:** Multi-sede y Franquicias

La funcionalidad de 'Transferencia de Pacientes entre Sedes' es una herramienta administrativa crítica dentro del módulo 'Multi-sede y Franquicias'. Su propósito principal es gestionar el traslado oficial del expediente de un paciente de una clínica (sede origen) a otra (sede destino) dentro del mismo grupo empresarial o franquicia. Este proceso es fundamental para garantizar la continuidad de la atención al paciente cuando este se muda, es referido para un tratamiento especializado disponible en otra ubicación, o simplemente prefiere cambiar de sede. La funcionalidad no solo cambia la afiliación principal del paciente, sino que transfiere de manera lógica todo su historial clínico, incluyendo tratamientos realizados y en curso, historial de citas, planes de tratamiento, radiografías, documentos y estado de cuenta financiero. Al centralizar esta operación, el ERP asegura la integridad de los datos, evitando la duplicación de pacientes en el sistema y manteniendo un único 'source of truth'. Para la gestión, esto permite un seguimiento preciso del ciclo de vida del paciente a través de la red de clínicas, facilitando la atribución correcta de ingresos y la elaboración de informes consolidados. La transferencia es un proceso controlado, auditable y restringido a roles con los permisos adecuados, garantizando que se realice de forma segura y documentada.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/multi-sede-franquicias/`

Esta funcionalidad reside dentro de la feature 'multi-sede-franquicias'. La interfaz de usuario se define en '/pages/TransferenciaPacientesPage.tsx', que actúa como el contenedor principal. Esta página utiliza componentes reutilizables de '/components/', como 'BuscadorPacientesGlobal' para encontrar al paciente en toda la red, 'SelectorSedeDestino' para elegir la clínica de destino y 'ModalConfirmacionTransferencia' para el paso final. Las interacciones con el backend se gestionan a través de funciones definidas en '/apis/transferenciaApi.ts', que encapsulan las llamadas a los endpoints RESTful para buscar pacientes y ejecutar la transferencia.

### Archivos Frontend

- `/features/multi-sede-franquicias/pages/TransferenciaPacientesPage.tsx`
- `/features/multi-sede-franquicias/components/BuscadorPacientesGlobal.tsx`
- `/features/multi-sede-franquicias/components/SelectorSedeDestino.tsx`
- `/features/multi-sede-franquicias/components/ResumenTransferencia.tsx`
- `/features/multi-sede-franquicias/components/ModalConfirmacionTransferencia.tsx`
- `/features/multi-sede-franquicias/apis/transferenciaApi.ts`

### Componentes React

- TransferenciaPacientesPage
- BuscadorPacientesGlobal
- SelectorSedeDestino
- ResumenTransferencia
- ModalConfirmacionTransferencia

## 🔌 APIs Backend

Las APIs para esta funcionalidad permiten buscar pacientes en toda la red de sedes, obtener una lista de las sedes disponibles para la transferencia y ejecutar la operación de transferencia de forma segura y atómica.

### `GET` `/api/pacientes/buscar-global`

Busca pacientes en todas las sedes por término de búsqueda (nombre, DNI, ID). Esencial para el primer paso del flujo de transferencia.

**Parámetros:** query.termino (string): El nombre, DNI o ID del paciente a buscar.

**Respuesta:** Un array de objetos de paciente que coinciden con el término de búsqueda, incluyendo su sede actual.

### `GET` `/api/sedes`

Obtiene una lista de todas las sedes activas en el sistema para poblar el selector de la sede de destino.

**Respuesta:** Un array de objetos de sede, cada uno con su _id y nombre.

### `POST` `/api/pacientes/:pacienteId/transferir`

Ejecuta la transferencia del paciente a una nueva sede. Esta es la operación principal y debe ser transaccional.

**Parámetros:** pacienteId (path param), body.sede_destino_id (string): El ID de la sede a la que se transferirá el paciente., body.motivo (string): Un campo opcional para registrar la razón de la transferencia.

**Respuesta:** El objeto del paciente actualizado con la nueva sede_actual_id y el historial de transferencia actualizado.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se centra en el modelo 'Paciente', que debe estar diseñado para soportar un entorno multi-sede. Un controlador específico gestionará la lógica de transferencia, asegurando que se actualicen los registros correspondientes y se cree una traza de auditoría.

### Models

#### Paciente

Contiene campos clave como: `nombre`, `apellido`, `dni`, `sede_actual_id: { type: ObjectId, ref: 'Sede' }` (referencia a su clínica principal), `historial_sedes: [{ sede_id: ObjectId, fecha_transferencia: Date, motivo: String }]` (un log de sus transferencias).

#### Sede

Representa una clínica individual. Campos: `nombre`, `direccion`, `telefono`, `estado: ('activa', 'inactiva')`.

#### LogTransferencia

Un modelo dedicado para auditoría. Campos: `paciente_id`, `sede_origen_id`, `sede_destino_id`, `usuario_responsable_id`, `fecha`, `motivo`.

### Controllers

#### PacienteTransferenciaController

- buscarPacienteGlobal
- transferirPacienteASede

#### SedeController

- obtenerSedesActivas

### Routes

#### `/api/pacientes`

- GET /buscar-global
- POST /:pacienteId/transferir

#### `/api/sedes`

- GET /

## 🔄 Flujos

1. El usuario (Recepción/Admin) accede a la página 'Transferencia de Pacientes'.
2. Utiliza el componente 'BuscadorPacientesGlobal' para encontrar al paciente deseado introduciendo su nombre o DNI.
3. El sistema muestra una lista de coincidencias; el usuario selecciona al paciente correcto.
4. La interfaz carga los detalles del paciente, incluyendo su sede actual.
5. El usuario selecciona la sede de destino de un listado desplegable.
6. Se muestra un resumen de la transferencia ('Transferir a [Paciente] de [Sede Origen] a [Sede Destino]') para confirmación final.
7. Al confirmar, se realiza la llamada a la API. El backend actualiza el campo 'sede_actual_id' del paciente, añade una entrada a su 'historial_sedes' y crea un registro en la colección 'LogTransferencia'.
8. El frontend recibe la confirmación y muestra un mensaje de éxito.

## 📝 User Stories

- Como recepcionista, quiero buscar a un paciente por su DNI en toda la red de clínicas para iniciar su proceso de transferencia a mi sede sin tener que crear un duplicado.
- Como director general, quiero poder transferir el historial completo de un paciente a una nueva sede para asegurar que el equipo de la nueva clínica tenga todo el contexto clínico y financiero.
- Como secretaria de la sede de destino, quiero que cuando un paciente sea transferido, su ficha aparezca automáticamente en la lista de pacientes de mi sede para poder agendarle citas.
- Como administrador del sistema, quiero que cada transferencia de paciente quede registrada en un log de auditoría para saber quién la realizó, cuándo y por qué motivo.

## ⚙️ Notas Técnicas

- Transaccionalidad: La operación de transferencia en el backend debe ser atómica. Usar transacciones de MongoDB para asegurar que la actualización del paciente y la creación del log de auditoría se completen exitosamente o fallen juntas, evitando estados inconsistentes.
- Seguridad y Autorización: El endpoint de transferencia debe estar protegido y verificar que el rol del usuario tiene los permisos necesarios para realizar esta acción a nivel multi-sede.
- Integridad de Datos Relacionados: Es crucial definir qué sucede con las citas futuras y los saldos pendientes del paciente en la sede origen. El sistema podría requerir que todas las citas futuras sean canceladas/reagendadas y que los saldos financieros sean liquidados o transferidos contablemente antes de permitir la transferencia.
- Rendimiento: La búsqueda global de pacientes debe estar optimizada con índices en la base de datos (ej. sobre los campos `dni` y `nombre` en la colección `Paciente`) para garantizar una respuesta rápida incluso con un gran volumen de datos.
- Notificaciones: Considerar la implementación de un sistema de notificaciones para alertar a los administradores de la sede de origen y de destino sobre la transferencia realizada.

