# Odontograma Interactivo

**Categoría:** Gestión Clínica | **Módulo:** Gestión de Pacientes e Historia Clínica

El Odontograma Interactivo es una herramienta visual y dinámica fundamental dentro del módulo de Gestión de Pacientes. Representa gráficamente la dentadura completa del paciente, permitiendo a los profesionales de la salud dental registrar, visualizar y gestionar el estado de cada pieza dental y sus superficies de manera intuitiva. A diferencia de un odontograma estático, esta funcionalidad permite la interacción directa: el odontólogo puede hacer clic en un diente o en una superficie específica para registrar hallazgos (caries, fracturas, ausencias), planificar tratamientos (endodoncias, restauraciones, extracciones) y marcar procedimientos como realizados. Cada acción actualiza visualmente el odontograma en tiempo real, utilizando una codificación de colores y símbolos estandarizada para una fácil interpretación. Sirve como un mapa centralizado de la salud bucal del paciente, facilitando el diagnóstico preciso, la creación de planes de tratamiento detallados y el seguimiento evolutivo a lo largo del tiempo. Se integra directamente con la historia clínica, el plan de tratamiento y, potencialmente, con el módulo de facturación, ya que los tratamientos marcados como 'realizados' pueden generar cargos automáticamente. Es una pieza clave para la comunicación con el paciente, permitiendo explicar de forma clara su estado y los tratamientos propuestos.

## 👥 Roles de Acceso

- Odontólogo
- Auxiliar / Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-pacientes-historia-clinica/`

Esta funcionalidad reside dentro de la feature 'gestion-pacientes-historia-clinica'. La página principal, probablemente una pestaña dentro de la ficha del paciente, se encuentra en '/pages/'. Esta página renderiza el componente principal 'OdontogramaInteractivo', que a su vez se compone de sub-componentes como 'DienteComponent' (para cada pieza dental) y 'PanelTratamientos'. Las interacciones del usuario (clics, selecciones) desencadenan llamadas a la API, definidas en el directorio '/apis/', para obtener y actualizar el estado del odontograma en la base de datos.

### Archivos Frontend

- `/features/gestion-pacientes-historia-clinica/pages/FichaPacientePage.tsx`
- `/features/gestion-pacientes-historia-clinica/components/Odontograma/OdontogramaInteractivo.tsx`
- `/features/gestion-pacientes-historia-clinica/components/Odontograma/DienteComponent.tsx`
- `/features/gestion-pacientes-historia-clinica/components/Odontograma/ModalAgregarTratamiento.tsx`
- `/features/gestion-pacientes-historia-clinica/apis/odontogramaApi.ts`

### Componentes React

- OdontogramaInteractivo
- DienteSVG
- PanelLeyenda
- SelectorTratamientos
- ModalHistorialDiente
- BotoneraEstadoTratamiento

## 🔌 APIs Backend

Las APIs son responsables de persistir y recuperar el estado completo del odontograma de un paciente, incluyendo todos los hallazgos y tratamientos asociados a cada pieza dental.

### `GET` `/api/pacientes/:pacienteId/odontograma`

Obtiene el estado completo y actual del odontograma de un paciente específico, incluyendo todos los tratamientos y hallazgos registrados.

**Parámetros:** pacienteId (en la URL)

**Respuesta:** Un objeto JSON que representa el odontograma, con un array de dientes y sus respectivos tratamientos/hallazgos.

### `POST` `/api/pacientes/:pacienteId/odontograma/hallazgos`

Agrega un nuevo hallazgo, diagnóstico o tratamiento planificado a una o más piezas dentales y/o superficies.

**Parámetros:** pacienteId (en la URL), Body: { dienteId: number, superficies: string[], codigoTratamiento: string, estado: 'diagnostico'|'planificado', nota: string }

**Respuesta:** El objeto del hallazgo/tratamiento recién creado con su ID.

### `PUT` `/api/pacientes/:pacienteId/odontograma/hallazgos/:hallazgoId`

Actualiza el estado de un hallazgo o tratamiento existente (ej. de 'planificado' a 'realizado').

**Parámetros:** pacienteId (en la URL), hallazgoId (en la URL), Body: { estado: 'realizado'|'en_progreso'|'descartado', fechaRealizacion: Date, profesionalId: string, nota: string }

**Respuesta:** El objeto del hallazgo/tratamiento actualizado.

### `DELETE` `/api/pacientes/:pacienteId/odontograma/hallazgos/:hallazgoId`

Elimina un hallazgo o tratamiento registrado por error. Requiere permisos especiales.

**Parámetros:** pacienteId (en la URL), hallazgoId (en la URL)

**Respuesta:** Mensaje de confirmación de eliminación.

## 🗂️ Estructura Backend (MERN)

El backend gestiona la lógica de negocio y la persistencia de los datos del odontograma. El modelo de datos es clave, probablemente como un subdocumento dentro del modelo Paciente para facilitar la recuperación de datos.

### Models

#### Paciente

Contiene un campo 'odontograma: [OdontogramaSchema]' que almacena el historial de estados del odontograma.

#### Odontograma

No es un modelo de nivel superior, sino un esquema (Schema) anidado. Campos: fechaCreacion: Date, profesionalId: ObjectId, hallazgos: [HallazgoSchema].

#### Hallazgo

Esquema anidado. Campos: _id: ObjectId, dienteId: Number, superficies: [String], codigoTratamiento: String, estado: String (enum: ['diagnostico', 'planificado', 'realizado', 'ausente']), nota: String, fechaRegistro: Date, fechaActualizacion: Date.

### Controllers

#### OdontogramaController

- getOdontogramaByPaciente
- addHallazgo
- updateHallazgo
- deleteHallazgo

### Routes

#### `/api/pacientes/:pacienteId/odontograma`

- GET /
- POST /hallazgos
- PUT /hallazgos/:hallazgoId
- DELETE /hallazgos/:hallazgoId

## 🔄 Flujos

1. El odontólogo selecciona un paciente y navega a la sección de 'Historia Clínica', donde se carga el componente 'OdontogramaInteractivo'.
2. El frontend realiza una llamada GET a '/api/pacientes/:pacienteId/odontograma' para obtener los datos y renderizar el estado dental actual.
3. Para registrar una caries, el odontólogo hace clic en la superficie oclusal del diente 36. Se abre un modal 'ModalAgregarTratamiento'.
4. En el modal, selecciona 'Diagnóstico', busca 'Caries', la selecciona y guarda. Se realiza una llamada POST a '/api/pacientes/:pacienteId/odontograma/hallazgos'.
5. La API guarda el nuevo hallazgo y el odontograma en el frontend se actualiza visualmente en tiempo real, mostrando la superficie oclusal del diente 36 con el símbolo de caries.
6. Semanas después, se realiza el tratamiento. El asistente busca el hallazgo de caries, lo selecciona y cambia su estado a 'realizado', desencadenando una llamada PUT a '/api/pacientes/.../hallazgos/:hallazgoId'. El color o símbolo en el odontograma cambia para reflejar el tratamiento completado.

## 📝 User Stories

- Como odontólogo, quiero visualizar un odontograma gráfico e interactivo del paciente para tener una comprensión rápida y clara de su estado bucal actual.
- Como odontólogo, quiero poder hacer clic en un diente o superficie y registrar un diagnóstico o plan de tratamiento de una lista predefinida para agilizar la documentación.
- Como asistente dental, quiero marcar los tratamientos planificados como 'realizados' durante o después del procedimiento para mantener la historia clínica actualizada en tiempo real.
- Como odontólogo, quiero que el odontograma diferencie visualmente entre dientes ausentes, sanos, con caries, con restauraciones y tratamientos planificados para una fácil interpretación.
- Como odontólogo, quiero ver un historial cronológico de todos los procedimientos realizados en un diente específico para entender su evolución y tomar mejores decisiones clínicas.

## ⚙️ Notas Técnicas

- Frontend: Se recomienda usar una librería de SVG como 'react-inlinesvg' o manejar el SVG directamente en JSX para un control total. Cada diente y superficie debe ser un componente individual con su propio estado y manejadores de eventos (onClick, onHover).
- Estado Global: Utilizar un gestor de estado como Zustand, Redux Toolkit o React Context para manejar el estado del odontograma. Esto asegura que las actualizaciones se propaguen de manera eficiente por toda la UI sin necesidad de recargar la página.
- Optimización: El SVG del odontograma puede ser complejo. Asegurarse de que esté optimizado y que el re-renderizado sea eficiente, utilizando técnicas como la memoización de componentes (React.memo).
- Modelo de Datos (Backend): La decisión de anidar los hallazgos del odontograma dentro del documento del paciente en MongoDB es buena para el rendimiento de lectura, pero puede llevar a documentos muy grandes. Se debe establecer un límite o considerar un modelo de referencia si el historial de un paciente es extremadamente extenso.
- Seguridad: Validar en el backend que el usuario que realiza la modificación (odontólogo/asistente) tiene los permisos adecuados y está asociado a la clínica del paciente. Registrar qué usuario realiza cada cambio para una auditoría completa.
- Integración: Diseñar webhooks o eventos que se disparen cuando un tratamiento se marca como 'realizado'. Esto puede notificar al módulo de facturación para generar un cargo o al módulo de inventario para descontar materiales.

