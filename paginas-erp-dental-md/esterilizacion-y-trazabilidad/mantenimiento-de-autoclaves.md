# Mantenimiento de Autoclaves

**Categoría:** Calidad y Seguridad | **Módulo:** Esterilización y Trazabilidad

La funcionalidad de Mantenimiento de Autoclaves es un componente crítico dentro del módulo de Esterilización y Trazabilidad. Su propósito principal es gestionar el ciclo de vida, el estado y el historial de mantenimiento de los equipos de esterilización (autoclaves) de la clínica dental. Este sistema no solo actúa como un registro digital, sino que es una herramienta proactiva para garantizar la seguridad del paciente, el cumplimiento de normativas sanitarias (como COFEPRIS, NOM, etc.) y la operatividad continua de los equipos. Permite registrar cada autoclave de la clínica con sus datos específicos (marca, modelo, número de serie, fecha de instalación). Para cada equipo, se gestiona un calendario de mantenimientos preventivos y se registran todos los servicios correctivos, incluyendo detalles como la fecha, el tipo de servicio, el técnico responsable, los costos asociados y la posibilidad de adjuntar documentos cruciales como informes técnicos, facturas y certificados de calibración. Dentro del ERP, esta funcionalidad se integra directamente con la trazabilidad de los ciclos de esterilización. Si un autoclave tiene un mantenimiento vencido o está marcado como 'en reparación', el sistema puede bloquear o advertir al usuario que intente registrar un nuevo ciclo de esterilización con ese equipo, cerrando así el círculo de calidad y evitando el uso de instrumental potencialmente no estéril. Las alertas y notificaciones automáticas para los próximos mantenimientos aseguran que la gestión sea proactiva, minimizando el riesgo de fallos en los equipos y garantizando que la clínica esté siempre preparada para auditorías internas o externas.

## 👥 Roles de Acceso

- Auxiliar / Asistente
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/esterilizacion-trazabilidad/`

Toda la lógica de frontend para esta funcionalidad reside dentro de la carpeta 'features/esterilizacion-trazabilidad'. La página principal, '/pages/MantenimientoAutoclavesPage.tsx', actúa como el contenedor principal que renderiza y coordina los componentes específicos. En la subcarpeta '/components/', se encuentran los elementos de UI reutilizables como 'TablaAutoclaves' para listar los equipos y 'FormularioRegistroMantenimiento' para añadir nuevas entradas. Las interacciones con el backend se manejan a través de funciones encapsuladas en '/apis/mantenimientoAutoclaveApi.ts', que realizan las llamadas a los endpoints RESTful correspondientes.

### Archivos Frontend

- `/features/esterilizacion-trazabilidad/pages/MantenimientoAutoclavesPage.tsx`
- `/features/esterilizacion-trazabilidad/components/TablaAutoclaves.tsx`
- `/features/esterilizacion-trazabilidad/components/ModalDetalleAutoclave.tsx`
- `/features/esterilizacion-trazabilidad/components/FormularioRegistroMantenimiento.tsx`
- `/features/esterilizacion-trazabilidad/components/HistorialMantenimiento.tsx`
- `/features/esterilizacion-trazabilidad/apis/mantenimientoAutoclaveApi.ts`

### Componentes React

- TablaAutoclaves
- ModalDetalleAutoclave
- FormularioRegistroMantenimiento
- HistorialMantenimiento
- AlertaProximoMantenimiento

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de los autoclaves y sus registros de mantenimiento. Incluyen operaciones CRUD para los equipos, así como para sus historiales de servicio, y soportan la subida de archivos para la documentación asociada.

### `GET` `/api/esterilizacion/autoclaves`

Obtiene un listado de todos los autoclaves registrados en la clínica, con información clave como su estado y próxima fecha de mantenimiento.

**Parámetros:** query: estado (opcional, para filtrar por 'activo', 'inactivo', 'en_reparacion')

**Respuesta:** Array de objetos Autoclave

### `POST` `/api/esterilizacion/autoclaves`

Registra un nuevo autoclave en el sistema. Reservado para roles de IT o administradores.

**Parámetros:** body: { nombre, marca, modelo, numeroSerie, fechaInstalacion, proximoMantenimiento, ubicacion }

**Respuesta:** Objeto del nuevo Autoclave creado

### `GET` `/api/esterilizacion/autoclaves/:id/mantenimientos`

Obtiene el historial completo de mantenimientos para un autoclave específico.

**Parámetros:** path: id (ID del autoclave)

**Respuesta:** Array de objetos MantenimientoAutoclave

### `POST` `/api/esterilizacion/autoclaves/:id/mantenimientos`

Añade un nuevo registro de mantenimiento a un autoclave. Puede incluir la subida de archivos.

**Parámetros:** path: id (ID del autoclave), body: { fecha, tipoMantenimiento, descripcion, tecnicoResponsable, costo, documentosAdjuntos (opcional) }, formData: archivo (opcional)

**Respuesta:** Objeto del nuevo MantenimientoAutoclave creado

### `PUT` `/api/esterilizacion/autoclaves/:id`

Actualiza la información de un autoclave, como su estado (ej: de 'activo' a 'en_reparacion') o su ubicación.

**Parámetros:** path: id (ID del autoclave), body: { campos a actualizar }

**Respuesta:** Objeto del Autoclave actualizado

## 🗂️ Estructura Backend (MERN)

La estructura del backend se basa en el patrón MVC. El modelo 'Autoclave' y 'MantenimientoAutoclave' definen la estructura de datos en MongoDB. El 'MantenimientoController' contiene toda la lógica de negocio para gestionar los autoclaves y sus mantenimientos. Las rutas, definidas en 'esterilizacionRoutes.js', mapean los endpoints HTTP a las funciones correspondientes del controlador, asegurando una API RESTful organizada.

### Models

#### Autoclave

nombre: String, marca: String, modelo: String, numeroSerie: String (único), fechaInstalacion: Date, ubicacion: String, proximoMantenimiento: Date, estado: String (enum: ['activo', 'inactivo', 'en_reparacion']), clinicaId: ObjectId (ref: 'Clinica')

#### MantenimientoAutoclave

autoclaveId: ObjectId (ref: 'Autoclave'), fecha: Date, tipoMantenimiento: String (enum: ['preventivo', 'correctivo']), descripcion: String, tecnicoResponsable: String, costo: Number, documentosAdjuntos: [{ nombre: String, url: String }], realizadoPorUsuarioId: ObjectId (ref: 'User')

### Controllers

#### MantenimientoController

- getAllAutoclaves
- createAutoclave
- updateAutoclave
- getMantenimientoHistoryForAutoclave
- addMantenimientoRecord

### Routes

#### `/api/esterilizacion`

- GET /autoclaves
- POST /autoclaves
- PUT /autoclaves/:id
- GET /autoclaves/:id/mantenimientos
- POST /autoclaves/:id/mantenimientos

## 🔄 Flujos

1. El usuario (Auxiliar) accede a la página de 'Mantenimiento de Autoclaves', donde visualiza una tabla con todos los equipos, su estado actual y la fecha del próximo mantenimiento.
2. Para registrar un servicio, el auxiliar selecciona un autoclave de la lista, navega a la sección de historial y hace clic en 'Registrar Mantenimiento'.
3. El usuario completa el formulario con los detalles del servicio (fecha, tipo, descripción), adjunta el informe del técnico en formato PDF y guarda el registro.
4. El sistema actualiza automáticamente la fecha del próximo mantenimiento preventivo basándose en la configuración del equipo y genera una notificación si la fecha está próxima.
5. Un usuario de IT da de alta un nuevo autoclave en el sistema, introduciendo su número de serie, marca, modelo y fecha de instalación para iniciar su ciclo de vida y trazabilidad en el ERP.

## 📝 User Stories

- Como Auxiliar de clínica, quiero registrar cada mantenimiento realizado a un autoclave, adjuntando el informe del técnico, para mantener un historial completo y auditable de su estado.
- Como Asistente, quiero ver un listado de todos los autoclaves y su fecha de próximo mantenimiento de un vistazo para poder programar las visitas técnicas con antelación y sin interrumpir la operatividad de la clínica.
- Como responsable de IT, quiero dar de alta un nuevo autoclave en el sistema con su número de serie, marca y modelo para que pueda ser gestionado y trazado desde el ERP desde el primer día.
- Como gerente de la clínica, quiero recibir alertas automáticas cuando un mantenimiento esté por vencer para asegurar el cumplimiento normativo y la seguridad del paciente.
- Como Auxiliar, quiero que el sistema me impida seleccionar un autoclave que esté 'en reparación' al momento de registrar un nuevo ciclo de esterilización para prevenir fallos de calidad.

## ⚙️ Notas Técnicas

- Implementar un sistema de subida de archivos seguro a un servicio de almacenamiento en la nube (ej. AWS S3, Google Cloud Storage) para los documentos adjuntos. La base de datos solo almacenará las URLs de acceso a dichos archivos.
- La eliminación de registros de mantenimiento debe ser lógica (soft delete) para preservar la integridad del historial a efectos de auditoría y trazabilidad.
- Configurar un trabajo programado (cron job) en el backend (ej. con 'node-cron') para que se ejecute diariamente, revise las fechas de 'proximoMantenimiento' y dispare notificaciones dentro de la aplicación y por correo electrónico.
- La API debe estar protegida y el acceso a los endpoints restringido por roles para asegurar que solo personal autorizado pueda modificar la información de los equipos.
- Crear índices en la colección de MongoDB sobre 'numeroSerie' en el modelo 'Autoclave' y sobre 'autoclaveId' en 'MantenimientoAutoclave' para acelerar las consultas.

