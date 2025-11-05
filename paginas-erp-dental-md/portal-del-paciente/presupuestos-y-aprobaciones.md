# Presupuestos y Aprobaciones

**Categoría:** Portal del Paciente | **Módulo:** Portal del Paciente

La funcionalidad de 'Presupuestos y Aprobaciones' es un componente esencial del Portal del Paciente dentro del ERP dental. Su propósito principal es ofrecer total transparencia y control al paciente sobre los planes de tratamiento propuestos y sus costos asociados. En lugar de depender de documentos en papel o comunicaciones verbales, esta página digitaliza el proceso completo. Aquí, el paciente puede acceder en cualquier momento y desde cualquier dispositivo a una lista detallada de todos los presupuestos que la clínica ha preparado para él. Cada presupuesto se presenta de forma clara, desglosando cada tratamiento recomendado, su coste individual, los descuentos aplicables y el total final. Esto no solo empodera al paciente para tomar decisiones informadas sobre su salud bucal, sino que también agiliza significativamente los procesos administrativos de la clínica. El paciente puede revisar con calma la propuesta, compararla con planes de seguro y, finalmente, aprobarla o rechazarla con un solo clic. Esta acción se registra instantáneamente en el ERP, notificando al personal de la clínica y actualizando el estado del paciente. Una aprobación puede desbloquear automáticamente la posibilidad de agendar las citas para el tratamiento, mientras que un rechazo puede iniciar un flujo de comunicación para que un coordinador de tratamiento se ponga en contacto con el paciente y resuelva sus dudas.

## 👥 Roles de Acceso

- Paciente (Portal)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/portal-paciente/`

Toda la lógica de frontend para el Portal del Paciente reside en la carpeta '/features/portal-paciente/'. Esta página específica se implementa dentro de esa estructura: las rutas se definen en la subcarpeta '/pages/', los componentes reutilizables en '/components/', y la lógica para comunicarse con el backend en '/apis/'. Esta modularidad asegura que todo el código relacionado con la experiencia del paciente esté autocontenido y sea fácil de mantener.

### Archivos Frontend

- `/features/portal-paciente/pages/MisPresupuestosPage.tsx`
- `/features/portal-paciente/pages/DetallePresupuestoPage.tsx`

### Componentes React

- PresupuestoList
- PresupuestoListItem
- PresupuestoDetailView
- TratamientoRow
- PresupuestoStatusBadge
- ApproveRejectActions
- ConfirmationModal

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en permitir que el paciente autenticado consulte sus presupuestos y actualice su estado. La seguridad es primordial, asegurando que un paciente solo pueda acceder a su propia información.

### `GET` `/api/portal/presupuestos`

Obtiene una lista de todos los presupuestos (resumen) asociados al paciente autenticado.

**Parámetros:** Autenticación JWT del paciente en la cabecera.

**Respuesta:** Un array de objetos de presupuesto con campos como: id, fechaCreacion, totalFinal, estado.

### `GET` `/api/portal/presupuestos/:id`

Obtiene el detalle completo de un presupuesto específico. Valida que el presupuesto pertenezca al paciente autenticado.

**Parámetros:** id: El ID del presupuesto (parámetro de ruta), Autenticación JWT del paciente en la cabecera.

**Respuesta:** Un objeto de presupuesto completo con el desglose de tratamientos, precios, descuentos y notas.

### `PUT` `/api/portal/presupuestos/:id/aprobar`

Permite al paciente aprobar un presupuesto. Cambia el estado del presupuesto a 'Aprobado'.

**Parámetros:** id: El ID del presupuesto (parámetro de ruta), Autenticación JWT del paciente en la cabecera.

**Respuesta:** El objeto del presupuesto actualizado con el nuevo estado.

### `PUT` `/api/portal/presupuestos/:id/rechazar`

Permite al paciente rechazar un presupuesto. Cambia el estado a 'Rechazado' y puede incluir una nota del paciente.

**Parámetros:** id: El ID del presupuesto (parámetro de ruta), Body: { notasPaciente: 'string' } (opcional), Autenticación JWT del paciente en la cabecera.

**Respuesta:** El objeto del presupuesto actualizado con el nuevo estado y las notas.

## 🗂️ Estructura Backend (MERN)

El backend utiliza la arquitectura MERN. El modelo 'Presupuesto' en MongoDB define la estructura de los datos. El 'PortalPresupuestoController' contiene la lógica de negocio para gestionar las solicitudes del paciente, asegurando la validación de permisos. Las rutas en Express exponen estos controladores como endpoints RESTful.

### Models

#### Presupuesto

paciente: ObjectId (ref a 'Paciente'), dentista: ObjectId (ref a 'Usuario'), fechaCreacion: Date, fechaExpiracion: Date, estado: String (Enum: 'Pendiente', 'Aprobado', 'Rechazado', 'Expirado'), items: [{ tratamiento: ObjectId (ref a 'Tratamiento'), descripcion: String, precioUnitario: Number, cantidad: Number, descuento: Number, subtotal: Number }], totalNeto: Number, totalDescuento: Number, totalFinal: Number, notasClinica: String, notasPaciente: String, fechaDecision: Date

#### Paciente

Relacionado a través de 'paciente'. Contiene la información del paciente.

#### Tratamiento

Relacionado a través de 'items.tratamiento'. Contiene el catálogo de tratamientos de la clínica.

### Controllers

#### PortalPresupuestoController

- getPresupuestosByPaciente
- getPresupuestoDetail
- aprobarPresupuestoByPaciente
- rechazarPresupuestoByPaciente

### Routes

#### `/api/portal/presupuestos`

- GET /
- GET /:id
- PUT /:id/aprobar
- PUT /:id/rechazar

## 🔄 Flujos

1. El paciente inicia sesión en el portal y navega a la sección 'Mis Presupuestos'.
2. El frontend realiza una llamada GET a '/api/portal/presupuestos' para cargar la lista de presupuestos.
3. El paciente hace clic en 'Ver Detalle' en un presupuesto con estado 'Pendiente'.
4. El frontend navega a la página de detalle y realiza una llamada GET a '/api/portal/presupuestos/:id'.
5. La página muestra el desglose completo del presupuesto, con los tratamientos, precios y totales.
6. El paciente evalúa la información y decide hacer clic en el botón 'Aprobar'.
7. Aparece un modal de confirmación. Al confirmar, el frontend envía una solicitud PUT a '/api/portal/presupuestos/:id/aprobar'.
8. El backend valida que el presupuesto pertenece al paciente, actualiza su estado a 'Aprobado' y devuelve el objeto actualizado.
9. El frontend actualiza la UI para reflejar el nuevo estado y muestra un mensaje de éxito.
10. El sistema genera una notificación interna para el personal de la clínica sobre la aprobación del presupuesto.

## 📝 User Stories

- Como paciente, quiero ver una lista de todos los presupuestos que la clínica me ha enviado, con su estado actual (Pendiente, Aprobado, etc.), para tener un seguimiento claro.
- Como paciente, quiero abrir un presupuesto y ver un desglose detallado de cada procedimiento, su costo y el total, para entender completamente el plan de tratamiento.
- Como paciente, quiero tener la opción de aprobar digitalmente un presupuesto desde mi portal, para poder iniciar mi tratamiento más rápidamente y sin necesidad de una llamada o visita.
- Como paciente, quiero poder rechazar un presupuesto si no estoy de acuerdo, para que la clínica sepa mi decisión y pueda contactarme para discutir alternativas.
- Como paciente, quiero poder descargar una copia en PDF de mis presupuestos (tanto pendientes como aprobados) para mis propios registros o para trámites con mi seguro.

## ⚙️ Notas Técnicas

- Seguridad: Es imperativo que todos los endpoints del backend estén protegidos por un middleware de autenticación (JWT) que extraiga el ID del paciente del token y lo utilice en todas las consultas a la base de datos para evitar que un paciente vea los datos de otro.
- Validez Legal: La acción de 'Aprobar' debe registrar información clave como la fecha, la hora y la dirección IP del paciente para dar mayor validez a la aceptación digital del tratamiento y sus costos.
- Gestión de Estados: Utilizar un enum para el campo 'estado' en el modelo de MongoDB para garantizar la integridad de los datos. La lógica de negocio en el controller debe manejar las transiciones de estado permitidas (ej: no se puede aprobar un presupuesto ya expirado).
- Rendimiento: Para la lista de presupuestos, la API solo debe devolver los campos necesarios (proyección en MongoDB) para reducir el tamaño de la respuesta y mejorar la velocidad de carga.
- Notificaciones en Tiempo Real: Considerar el uso de WebSockets (ej: Socket.IO) o un servicio de notificaciones push para informar al personal de la clínica instantáneamente cuando un paciente toma una decisión sobre un presupuesto.

