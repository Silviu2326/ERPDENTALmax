# Odontopediatría: Fluorizaciones y Selladores

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

Esta funcionalidad es un componente esencial dentro del módulo 'Especialidades Clínicas', diseñada específicamente para el registro y seguimiento de tratamientos preventivos en odontopediatría: las fluorizaciones y la aplicación de selladores de fosas y fisuras. Su objetivo principal es proporcionar a odontólogos e higienistas una herramienta digital, precisa y centralizada para documentar cada procedimiento, reemplazando los registros en papel y mejorando la calidad del seguimiento clínico. La página permite registrar detalles cruciales como la fecha de aplicación, el tipo de tratamiento (flúor tópico, barniz, sellador), el producto específico utilizado, y, fundamentalmente, las piezas dentales exactas que han sido tratadas, a menudo mediante una interfaz gráfica interactiva del odontograma infantil. Esta información se integra directamente en la historia clínica digital del paciente, asegurando que cualquier profesional que lo atienda en el futuro tenga acceso a un historial preventivo completo. Además de ser un registro clínico, la funcionalidad sirve para programar y recordar las futuras citas de seguimiento, ayudando a mantener el protocolo preventivo recomendado para cada niño y mejorando la adherencia al tratamiento. Se integra con otros módulos del ERP, como facturación (para generar los cargos correspondientes) y agenda (para proponer y agendar la siguiente visita).

## 👥 Roles de Acceso

- Odontólogo
- Higienista

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad se encuentra dentro de la feature 'especialidades-clinicas'. La página principal, 'OdontopediatriaFluorSelladoresPage.tsx', reside en la subcarpeta '/pages' y actúa como el contenedor principal. Esta página utiliza componentes reutilizables de la carpeta '/components', como 'FormularioAplicacionFluorSellador' para el registro de nuevos tratamientos y 'HistorialAplicacionesTable' para visualizar los registros anteriores del paciente. Las interacciones con el backend se gestionan a través de funciones definidas en un archivo dentro de la carpeta '/apis', como 'odontopediatriaApi.ts', que centraliza todas las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/OdontopediatriaFluorSelladoresPage.tsx`
- `/features/especialidades-clinicas/components/FormularioAplicacionFluorSellador.tsx`
- `/features/especialidades-clinicas/components/HistorialAplicacionesTable.tsx`
- `/features/especialidades-clinicas/components/SelectorDientesInfantil.tsx`
- `/features/especialidades-clinicas/apis/odontopediatriaApi.ts`

### Componentes React

- OdontopediatriaFluorSelladoresPage
- FormularioAplicacionFluorSellador
- HistorialAplicacionesTable
- SelectorDientesInfantil
- ModalConfirmarGuardadoAplicacion

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de los registros de aplicaciones preventivas (flúor y selladores) asociadas a un paciente específico. Permiten crear, leer, actualizar y eliminar dichos registros, asegurando la integridad de la historia clínica del paciente.

### `GET` `/api/pacientes/:pacienteId/odontopediatria/aplicaciones`

Obtiene el historial completo de aplicaciones de flúor y selladores para un paciente específico.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Un array de objetos de AplicacionPreventiva.

### `POST` `/api/pacientes/:pacienteId/odontopediatria/aplicaciones`

Crea un nuevo registro de aplicación de flúor o sellador para un paciente.

**Parámetros:** pacienteId (en la URL), Body: { fechaAplicacion, tipoAplicacion, productoUtilizado, dientesTratados, notas, profesionalId }

**Respuesta:** El objeto de la nueva AplicacionPreventiva creada.

### `PUT` `/api/pacientes/:pacienteId/odontopediatria/aplicaciones/:aplicacionId`

Actualiza un registro de aplicación existente. Útil para corregir errores o añadir notas posteriores.

**Parámetros:** pacienteId (en la URL), aplicacionId (en la URL), Body: { ...campos a actualizar... }

**Respuesta:** El objeto de la AplicacionPreventiva actualizada.

### `DELETE` `/api/pacientes/:pacienteId/odontopediatria/aplicaciones/:aplicacionId`

Elimina un registro de aplicación. Requiere permisos especiales y debería ser una acción registrada en la auditoría del sistema.

**Parámetros:** pacienteId (en la URL), aplicacionId (en la URL)

**Respuesta:** Un mensaje de confirmación de éxito.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se basa en el patrón MVC. El modelo 'AplicacionPreventiva' define el esquema de datos en MongoDB. El 'OdontopediatriaController' contiene la lógica de negocio para manejar las peticiones (crear, leer, etc.). Las rutas, definidas en 'odontopediatriaRoutes.ts', mapean los endpoints HTTP a las funciones correspondientes del controlador, asegurando una arquitectura organizada y escalable.

### Models

#### AplicacionPreventiva

paciente: { type: ObjectId, ref: 'Paciente' }, profesional: { type: ObjectId, ref: 'Usuario' }, fechaAplicacion: Date, tipoAplicacion: { type: String, enum: ['Fluor', 'Sellador'] }, productoUtilizado: String, dientesTratados: [{ diente: Number, superficie: String }], notas: String, createdAt: Date, updatedAt: Date

### Controllers

#### OdontopediatriaController

- obtenerAplicacionesPorPaciente
- crearNuevaAplicacion
- actualizarAplicacionExistente
- eliminarAplicacion

### Routes

#### `/api/pacientes/:pacienteId/odontopediatria`

- GET /aplicaciones
- POST /aplicaciones
- PUT /aplicaciones/:aplicacionId
- DELETE /aplicaciones/:aplicacionId

## 🔄 Flujos

1. El odontólogo o higienista accede a la ficha de un paciente pediátrico y navega a la sección 'Odontopediatría: Fluorizaciones y Selladores'.
2. La interfaz carga y muestra una tabla con el historial de aplicaciones previas, ordenadas por fecha.
3. El profesional hace clic en 'Nueva Aplicación', lo que despliega un formulario.
4. Rellena los campos: fecha, tipo (flúor/sellador), producto y selecciona los dientes tratados en un odontograma infantil interactivo.
5. Al guardar, el sistema valida los datos y envía una petición POST al backend.
6. El nuevo registro se almacena en la base de datos y la tabla del historial en el frontend se actualiza automáticamente para reflejar el cambio.
7. Opcionalmente, el sistema puede generar un borrador de cobro en el módulo de facturación y crear un recordatorio para la próxima visita preventiva.

## 📝 User Stories

- Como Odontólogo, quiero registrar cada aplicación de flúor y selladores especificando los dientes tratados para mantener un historial clínico preciso y auditable.
- Como Higienista, quiero ver rápidamente la fecha de la última fluorización de un paciente para decidir si es el momento adecuado para una nueva aplicación según el protocolo.
- Como Odontólogo, quiero poder añadir notas a cada aplicación para registrar observaciones importantes, como la colaboración del niño o cualquier incidencia.
- Como Higienista, quiero que el sistema me permita filtrar el historial por tipo de aplicación (Flúor o Sellador) para evaluar la cobertura de cada tratamiento preventivo a lo largo del tiempo.

## ⚙️ Notas Técnicas

- Implementar validación de datos tanto en el frontend (con bibliotecas como Formik/Yup) como en el backend (con Joi o Express-validator) para garantizar la consistencia y calidad de los datos.
- El componente 'SelectorDientesInfantil' debe ser una representación SVG interactiva del odontograma de dentición temporal y mixta, manejando su estado a través de React para una experiencia de usuario fluida.
- Las API deben estar protegidas mediante middleware de autenticación (JWT) y autorización basada en roles para asegurar que solo Odontólogos e Higienistas puedan modificar los registros.
- La operación de borrado (DELETE) debe ser un 'soft delete' (marcado como borrado en lugar de eliminación física) para mantener la integridad del historial clínico y permitir la recuperación de datos si es necesario.
- Considerar la integración con un sistema de codificación de tratamientos estandarizado (ej. códigos de la aseguradora) para facilitar la posterior facturación automática.
- Optimizar la consulta a la base de datos para obtener el historial creando un índice en el campo `pacienteId` y `fechaAplicacion` en la colección `AplicacionPreventiva` de MongoDB.

