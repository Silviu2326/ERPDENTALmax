# Periodoncia: Cirugía Periodontal

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'Cirugía Periodontal' es un componente esencial dentro del módulo padre 'Especialidades Clínicas' del ERP dental. Está diseñada para que los odontólogos, especialmente los periodoncistas, puedan planificar, documentar y realizar el seguimiento de intervenciones quirúrgicas periodontales de manera exhaustiva y digital. Esta página permite registrar desde el diagnóstico inicial y la planificación del procedimiento, hasta los detalles intraoperatorios y el seguimiento postoperatorio. El sistema soporta una variedad de cirugías como gingivectomías, gingivoplastias, alargamientos de corona, injertos de tejido blando (conectivo o gingival libre), injertos óseos y procedimientos de regeneración tisular guiada. Su propósito principal es centralizar toda la información crítica de la cirugía, eliminando la dependencia de registros en papel y mejorando la precisión, seguridad y accesibilidad de los datos clínicos. Dentro del ERP, esta funcionalidad se integra directamente con la ficha del paciente, el odontograma (permitiendo una selección visual de las piezas dentales a tratar), el módulo de facturación para asociar los costos del procedimiento, y el gestor de consentimientos informados. El odontólogo puede documentar el tipo de anestesia, las suturas utilizadas, la medicación prescrita y las indicaciones postoperatorias, generando un informe completo que puede ser consultado en cualquier momento para evaluar la evolución del paciente y garantizar la continuidad del cuidado.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad reside dentro de la feature 'especialidades-clinicas'. La carpeta `/pages` contiene el componente principal de la página `CirugiaPeriodontalPage.tsx`. Los componentes reutilizables específicos, como el formulario de la cirugía, el visor de historial y el modal de seguimiento, se encuentran en `/components`. Las llamadas a la API del backend para gestionar los datos de las cirugías se centralizan en la carpeta `/apis` a través de funciones específicas como `crearCirugiaPeriodontal`, `obtenerCirugiaPorId`, etc.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/CirugiaPeriodontalPage.tsx`
- `/features/especialidades-clinicas/components/FormularioCirugiaPeriodontal.tsx`
- `/features/especialidades-clinicas/components/HistorialCirugiasPeriodontales.tsx`
- `/features/especialidades-clinicas/components/DetalleCirugiaPeriodontal.tsx`
- `/features/especialidades-clinicas/components/ModalSeguimientoPostoperatorio.tsx`
- `/features/especialidades-clinicas/apis/cirugiaPeriodontalApi.ts`

### Componentes React

- CirugiaPeriodontalPage
- FormularioCirugiaPeriodontal
- HistorialCirugiasPeriodontales
- DetalleCirugiaPeriodontal
- ModalSeguimientoPostoperatorio
- SelectorPiezasDentalesPeriodoncia

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de un registro de cirugía periodontal. Permiten la creación de nuevos registros asociados a un paciente, la consulta de cirugías específicas o del historial de un paciente, la actualización para añadir notas de evolución y el borrado (lógico o físico) del registro.

### `POST` `/api/especialidades/periodoncia/cirugias`

Crea un nuevo registro de cirugía periodontal para un paciente.

**Parámetros:** Body: { pacienteId, odontologoId, fechaCirugia, diagnosticoPreoperatorio, tipoCirugia, procedimientoDetallado, piezasDentalesAfectadas, anestesiaUtilizada, suturas, medicacionPostoperatoria, consentimientoFirmadoId }

**Respuesta:** El objeto de la cirugía periodontal recién creada.

### `GET` `/api/pacientes/:pacienteId/cirugias-periodontales`

Obtiene todos los registros de cirugías periodontales de un paciente específico.

**Parámetros:** URL Param: pacienteId

**Respuesta:** Un array de objetos de cirugías periodontales.

### `GET` `/api/especialidades/periodoncia/cirugias/:cirugiaId`

Obtiene los detalles completos de una cirugía periodontal específica.

**Parámetros:** URL Param: cirugiaId

**Respuesta:** Un único objeto de cirugía periodontal con todos sus detalles y notas de evolución.

### `PUT` `/api/especialidades/periodoncia/cirugias/:cirugiaId`

Actualiza un registro de cirugía periodontal existente. Se usa principalmente para añadir notas de seguimiento en la evolución postoperatoria.

**Parámetros:** URL Param: cirugiaId, Body: { ...campos a actualizar, ej: notasEvolucion: [{ fecha, nota, odontologoId }] }

**Respuesta:** El objeto de la cirugía periodontal actualizado.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con un modelo específico 'CirugiaPeriodontal' en MongoDB. Un controlador 'CirugiaPeriodontalController' contiene la lógica para manejar las operaciones CRUD, y las rutas se exponen a través de Express en un archivo de rutas dedicado, siguiendo los principios RESTful.

### Models

#### CirugiaPeriodontal

pacienteId: ObjectId (ref: 'Paciente'), odontologoId: ObjectId (ref: 'Usuario'), fechaCirugia: Date, diagnosticoPreoperatorio: String, tipoCirugia: String (Enum: ['Gingivectomía', 'Injerto de tejido blando', 'Alargamiento de corona', ...]), procedimientoDetallado: String, piezasDentalesAfectadas: [Number], anestesiaUtilizada: String, suturas: String, medicacionPostoperatoria: [{ farmaco: String, dosis: String, duracion: String }], consentimientoFirmadoId: ObjectId (ref: 'Documento'), notasEvolucion: [{ fecha: Date, nota: String, odontologoId: ObjectId }], createdAt: Date, updatedAt: Date

### Controllers

#### CirugiaPeriodontalController

- crearCirugiaPeriodontal
- obtenerCirugiasPorPaciente
- obtenerCirugiaPorId
- agregarNotaEvolucion
- actualizarCirugiaPeriodontal

### Routes

#### `/api/especialidades/periodoncia/cirugias`

- POST /
- GET /:cirugiaId
- PUT /:cirugiaId

#### `/api/pacientes`

- GET /:pacienteId/cirugias-periodontales

## 🔄 Flujos

1. El odontólogo selecciona un paciente y navega a la sección 'Especialidades Clínicas' -> 'Periodoncia'.
2. Hace clic en 'Nueva Cirugía Periodontal' para abrir el formulario de registro.
3. Completa los campos preoperatorios, selecciona el tipo de cirugía, marca las piezas dentales afectadas en un odontograma interactivo y detalla el plan de tratamiento.
4. El sistema genera un consentimiento informado que se puede firmar digitalmente y se asocia al registro.
5. Tras la intervención, el odontólogo accede al registro guardado y completa los detalles intraoperatorios y postoperatorios (suturas, medicación, etc.).
6. En las citas de seguimiento, el odontólogo añade nuevas 'Notas de Evolución' al registro existente para documentar el progreso de la recuperación.

## 📝 User Stories

- Como odontólogo, quiero registrar una nueva cirugía periodontal con todos sus detalles clínicos para asegurar la trazabilidad y la calidad del historial del paciente.
- Como odontólogo, quiero poder seleccionar visualmente las piezas dentales afectadas en un odontograma para evitar errores y agilizar el registro.
- Como odontólogo, quiero adjuntar el consentimiento informado firmado digitalmente al registro de la cirugía para cumplir con la normativa y tener un respaldo legal.
- Como odontólogo, quiero añadir notas de seguimiento en las visitas postoperatorias para monitorizar la cicatrización y la recuperación del paciente de forma cronológica.
- Como odontólogo, quiero acceder rápidamente al historial completo de cirugías periodontales de un paciente para planificar tratamientos futuros.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un estricto control de acceso basado en roles (RBAC) para garantizar que solo los odontólogos autorizados puedan ver o modificar registros quirúrgicos. Todos los datos sensibles del paciente (PHI) deben ser encriptados en tránsito (TLS/SSL) y en reposo (MongoDB encryption at rest).
- Integración con Odontograma: El componente para seleccionar piezas dentales debe ser interactivo y estar sincronizado con el odontograma general del paciente.
- Integración con Facturación: Al guardar el procedimiento, se debe poder generar automáticamente el cargo correspondiente en el módulo de facturación del paciente.
- Gestión de Documentos: La integración con un sistema de gestión documental es crucial para manejar los consentimientos informados y otros archivos adjuntos de forma segura.
- Rendimiento: Optimizar las consultas a la base de datos, especialmente al cargar el historial completo de un paciente, utilizando índices en los campos `pacienteId` y `fechaCirugia` en el modelo `CirugiaPeriodontal`.

