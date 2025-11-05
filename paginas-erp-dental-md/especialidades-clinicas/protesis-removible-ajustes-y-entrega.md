# Prótesis Removible: Ajustes y Entrega

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

Esta funcionalidad es un componente crucial dentro del módulo de 'Especialidades Clínicas', diseñada para gestionar y documentar las fases finales del tratamiento con prótesis removibles: las pruebas, los ajustes y la entrega final al paciente. Su propósito es proporcionar una interfaz centralizada y detallada donde el odontólogo puede registrar meticulosamente cada sesión de ajuste, especificando las áreas modificadas, los materiales utilizados y el feedback del paciente. Funciona como un nexo digital entre el trabajo clínico en el consultorio y la información técnica del laboratorio, permitiendo al protésico consultar los ajustes realizados para futuras referencias o correcciones. La página muestra un historial cronológico de todas las intervenciones post-fabricación, desde la primera prueba en boca hasta la conformidad final. Al integrarse con el plan de tratamiento del paciente, esta funcionalidad asegura que cada paso esté documentado, mejorando la trazabilidad, el control de calidad y la comunicación interdepartamental. Finalmente, permite registrar formalmente la entrega de la prótesis, un hito que puede desencadenar procesos administrativos y de facturación, cerrando así el ciclo del tratamiento protésico de manera eficiente y ordenada dentro del ERP dental.

## 👥 Roles de Acceso

- Odontólogo
- Protésico / Laboratorio

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

La feature 'Especialidades Clínicas' se organiza en su propia carpeta `/features/especialidades-clinicas/`. Dentro, la subcarpeta `/pages/` contiene el componente de página principal para esta funcionalidad. Los componentes reutilizables específicos, como el formulario de ajuste o el historial, residen en `/components/`. Las llamadas al backend están encapsuladas en un archivo dentro de `/apis/` para mantener la lógica de comunicación separada.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/ProtesisRemovibleAjusteEntregaPage.tsx`
- `/features/especialidades-clinicas/components/FormularioRegistroAjuste.tsx`
- `/features/especialidades-clinicas/components/HistorialAjustesProtesis.tsx`
- `/features/especialidades-clinicas/components/PanelControlEntrega.tsx`
- `/features/especialidades-clinicas/apis/protesisRemovibleApi.ts`

### Componentes React

- FormularioRegistroAjuste
- HistorialAjustesProtesis
- PanelControlEntrega
- ModalConfirmacionEntrega
- VisorDetallesOrdenLaboratorio

## 🔌 APIs Backend

Conjunto de APIs RESTful para gestionar el ciclo de vida de los ajustes y la entrega de una prótesis removible, asociando cada acción a un tratamiento específico del paciente.

### `GET` `/api/protesis/ajustes/tratamiento/:tratamientoId`

Obtiene el historial completo de ajustes para una prótesis asociada a un ID de tratamiento.

**Parámetros:** tratamientoId (param)

**Respuesta:** Array de objetos de ajuste.

### `POST` `/api/protesis/ajustes`

Registra una nueva sesión de ajuste para una prótesis. El body debe contener los detalles del ajuste.

**Parámetros:** body: { tratamientoId, fecha, descripcion, zonasAjustadas, odontologoId }

**Respuesta:** El objeto del nuevo ajuste creado.

### `PUT` `/api/protesis/entrega/:tratamientoId`

Marca la prótesis como entregada al paciente, actualizando el estado del tratamiento.

**Parámetros:** tratamientoId (param), body: { fechaEntregaReal, notasFinales }

**Respuesta:** El objeto del tratamiento actualizado.

### `GET` `/api/tratamientos/:tratamientoId/detallesProtesis`

Obtiene los detalles generales de la prótesis y su estado actual (ej: 'En prueba', 'Entregado').

**Parámetros:** tratamientoId (param)

**Respuesta:** Objeto con detalles del tratamiento y estado de la prótesis.

## 🗂️ Estructura Backend (MERN)

La lógica de negocio se gestiona en un controlador específico para prótesis. Se utiliza un modelo para los ajustes, que se relaciona con el modelo principal de Tratamiento. Las rutas exponen las funcionalidades del controlador.

### Models

#### AjusteProtesis

tratamientoId: ObjectId (ref: 'Tratamiento'), odontologoId: ObjectId (ref: 'Usuario'), fecha: Date, descripcionAjuste: String, zonasAjustadas: [String], feedbackPaciente: String, createdAt: Date

#### Tratamiento

Se añade/utiliza: pacienteId: ObjectId, tipo: String ('Protesis Removible'), estadoProtesis: String ('En Laboratorio', 'En Prueba', 'Ajustes', 'Entregado'), fechaEntregaReal: Date, notasEntrega: String, ordenLaboratorioId: ObjectId

### Controllers

#### ProtesisController

- obtenerHistorialAjustes
- crearRegistroAjuste
- confirmarEntregaProtesis

### Routes

#### `/api/protesis`

- GET /ajustes/tratamiento/:tratamientoId
- POST /ajustes
- PUT /entrega/:tratamientoId

## 🔄 Flujos

1. El odontólogo accede a la ficha del paciente, selecciona el plan de tratamiento activo y navega a la gestión de la 'Prótesis Removible'.
2. La página carga el estado actual de la prótesis y muestra el historial de ajustes previos.
3. Tras una cita con el paciente, el odontólogo usa el 'Formulario de Registro de Ajuste' para documentar las modificaciones realizadas.
4. El nuevo registro se añade al historial, visible para el odontólogo y, en modo lectura, para el laboratorio.
5. Este ciclo se repite para cada cita de ajuste necesaria.
6. Cuando la prótesis es aceptada por el paciente, el odontólogo utiliza el 'Panel de Control de Entrega' para cambiar el estado a 'Entregado', registrando la fecha y notas finales.
7. El sistema actualiza el estado del tratamiento, lo que puede notificar a otros módulos como facturación.

## 📝 User Stories

- Como odontólogo, quiero registrar cada ajuste realizado a una prótesis removible, incluyendo la zona y la descripción, para mantener un historial clínico preciso y auditable.
- Como odontólogo, quiero cambiar el estado de una prótesis a 'Entregada' con un solo clic para finalizar formalmente el tratamiento en el sistema.
- Como protésico de laboratorio, quiero consultar el historial de ajustes de una prótesis devuelta para entender los problemas clínicos y mejorar la fabricación.
- Como odontólogo, quiero ver rápidamente cuántas sesiones de ajuste ha requerido una prótesis para evaluar la complejidad del caso y la adaptación del paciente.

## ⚙️ Notas Técnicas

- Seguridad: Implementar RBAC estricto para que solo el odontólogo asignado al caso pueda registrar ajustes y la entrega. El rol 'Protésico / Laboratorio' debe tener acceso de solo lectura al historial de ajustes.
- Integración con Agenda: Considerar una funcionalidad para agendar la siguiente cita de ajuste directamente desde esta interfaz, pre-llenando los datos del paciente y el motivo de la cita.
- Integración con Facturación: El cambio de estado a 'Entregado' debe ser un evento que pueda ser capturado por el módulo de facturación para generar el cobro final del tratamiento.
- Usabilidad: Explorar la posibilidad de incluir un odontograma interactivo en el formulario de ajuste, permitiendo al profesional marcar visualmente las zonas ajustadas en la prótesis.
- Auditoría: Todas las acciones (creación de ajuste, cambio de estado) deben registrarse en un log de auditoría con el ID del usuario y la marca de tiempo para garantizar la trazabilidad.

