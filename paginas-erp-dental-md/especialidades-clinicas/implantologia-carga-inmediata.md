# Implantología: Carga Inmediata

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'Implantología: Carga Inmediata' es una herramienta especializada dentro del módulo 'Especialidades Clínicas', diseñada para que los odontólogos gestionen de manera integral y digitalizada los complejos protocolos de tratamiento con implantes de carga inmediata. Esta técnica avanzada permite colocar una prótesis provisional o definitiva sobre los implantes recién colocados en un plazo muy corto (24-48 horas), lo que requiere una planificación y ejecución extremadamente precisas. Este módulo del ERP dental sirve como un centro de mando para cada caso, guiando al profesional a través de las distintas fases críticas del proceso: diagnóstico, planificación digital, cirugía y fase protésica. Permite registrar detalladamente la información de diagnóstico, incluyendo la carga de archivos de imagenología como CBCT y escaneos intraorales. La fase de planificación se beneficia de campos específicos para anotar el software utilizado, el tipo de guía quirúrgica y las especificaciones de los implantes seleccionados. Durante la fase quirúrgica, el odontólogo puede registrar datos vitales como el torque de inserción de cada implante, lotes de materiales utilizados y cualquier incidencia. Finalmente, en la fase protésica, se documenta el tipo de restauración, materiales y ajustes. El sistema organiza toda esta información en una línea de tiempo cronológica, ofreciendo una trazabilidad completa del tratamiento, mejorando la comunicación con el laboratorio, aumentando la seguridad del paciente y optimizando los resultados clínicos.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad se aloja dentro de la feature 'especialidades-clinicas'. La carpeta '/pages' contiene el componente principal 'CargaInmediataProtocoloPage.tsx', que renderiza la interfaz completa del protocolo. La carpeta '/components' alberga los componentes reutilizables y específicos como 'CargaInmediataWizard' para la guía paso a paso, 'PlanificacionDigitalViewer' para visualizar estudios, y formularios para cada fase del protocolo. Las llamadas al backend se gestionan a través de funciones centralizadas en '/apis/cargaInmediataApi.ts'.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/CargaInmediataProtocoloPage.tsx`
- `/features/especialidades-clinicas/components/CargaInmediataWizard.tsx`
- `/features/especialidades-clinicas/components/FaseDiagnosticoForm.tsx`
- `/features/especialidades-clinicas/components/FaseQuirurgicaForm.tsx`
- `/features/especialidades-clinicas/components/FaseProtesicaTimeline.tsx`
- `/features/especialidades-clinicas/components/VisorArchivosClinicos.tsx`
- `/features/especialidades-clinicas/apis/cargaInmediataApi.ts`

### Componentes React

- CargaInmediataWizard
- FaseDiagnosticoForm
- FaseQuirurgicaForm
- FaseProtesicaTimeline
- VisorArchivosClinicos
- SelectorImplantes

## 🔌 APIs Backend

APIs RESTful para la gestión completa del ciclo de vida de un protocolo de carga inmediata, desde su creación asociada a un paciente hasta la actualización de cada una de sus fases y la gestión de archivos adjuntos.

### `POST` `/api/protocolos/carga-inmediata`

Crea un nuevo protocolo de carga inmediata para un paciente específico.

**Parámetros:** Body: { pacienteId: string, odontologoId: string, datosIniciales: object }

**Respuesta:** JSON con el objeto del nuevo protocolo creado.

### `GET` `/api/protocolos/carga-inmediata/paciente/{pacienteId}`

Obtiene todos los protocolos de carga inmediata asociados a un paciente.

**Parámetros:** URL Param: pacienteId

**Respuesta:** Array de objetos de protocolo.

### `GET` `/api/protocolos/carga-inmediata/{protocoloId}`

Obtiene los detalles completos de un protocolo específico.

**Parámetros:** URL Param: protocoloId

**Respuesta:** JSON con el objeto completo del protocolo.

### `PUT` `/api/protocolos/carga-inmediata/{protocoloId}`

Actualiza la información de un protocolo existente, como avanzar de fase o añadir notas.

**Parámetros:** URL Param: protocoloId, Body: { fase: string, datosFase: object }

**Respuesta:** JSON con el objeto del protocolo actualizado.

### `POST` `/api/protocolos/carga-inmediata/{protocoloId}/archivos`

Sube y asocia archivos clínicos (CBCT, STL, imágenes) a un protocolo específico.

**Parámetros:** URL Param: protocoloId, Body: FormData con el archivo

**Respuesta:** JSON con la información del archivo subido y el protocolo actualizado.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se centra en el modelo 'ProtocoloCargaInmediata' que almacena toda la información del caso. El 'CargaInmediataController' contiene la lógica para manejar las operaciones CRUD y de negocio, y las rutas se exponen a través de Express para ser consumidas por el frontend.

### Models

#### ProtocoloCargaInmediata

paciente: ObjectId, odontologo: ObjectId, fechaCreacion: Date, estado: String ('Diagnóstico', 'Planificación', 'Cirugía', 'Protésico', 'Finalizado'), diagnostico: { notas: String, archivos: [ObjectId] }, planificacion: { software: String, guiaQuirurgica: String, implantes: [{ posicion: String, marca: String, diametro: Number, longitud: Number }] }, cirugia: { fecha: Date, notas: String, implantes: [{ posicion: String, torqueInsercion: Number, lote: String }], biomateriales: [String] }, faseProtesica: { fechaColocacion: Date, tipoProtesis: String, material: String, notas: String, archivos: [ObjectId] }, historial: [{ fecha: Date, accion: String, usuario: ObjectId }]

### Controllers

#### CargaInmediataController

- crearProtocolo
- obtenerProtocolosPorPaciente
- obtenerProtocoloPorId
- actualizarFaseProtocolo
- agregarArchivoAProtocolo

### Routes

#### `/api/protocolos/carga-inmediata`

- POST /
- GET /paciente/:pacienteId
- GET /:protocoloId
- PUT /:protocoloId
- POST /:protocoloId/archivos

## 🔄 Flujos

1. El odontólogo selecciona un paciente de la lista y navega a 'Especialidades Clínicas' > 'Implantología: Carga Inmediata'.
2. El sistema muestra los protocolos existentes para ese paciente o la opción de crear uno nuevo.
3. Al crear un nuevo protocolo, se presenta un wizard que guía al odontólogo a través de la fase de 'Diagnóstico y Planificación', permitiendo subir archivos CBCT/STL.
4. Una vez planificado, el odontólogo avanza el protocolo a la fase 'Cirugía', donde registra detalles como el torque de inserción de cada implante y los lotes de material.
5. Posteriormente, se avanza a la 'Fase Protésica', documentando la entrega de la prótesis provisional/definitiva.
6. En cualquier momento, el odontólogo puede visualizar el protocolo completo en una línea de tiempo, revisar archivos y añadir notas generales.

## 📝 User Stories

- Como odontólogo, quiero crear un nuevo protocolo de carga inmediata para un paciente para centralizar toda la información clínica del caso en un solo lugar.
- Como odontólogo, quiero registrar el torque de inserción de cada implante durante la cirugía para asegurar que se cumplen los criterios de estabilidad primaria necesarios para la carga inmediata.
- Como odontólogo, quiero adjuntar el archivo CBCT y el escaneo intraoral a la fase de planificación para tener una referencia visual directa dentro del ERP.
- Como odontólogo, quiero ver una línea de tiempo del protocolo para revisar rápidamente el historial y estado actual de un tratamiento complejo de carga inmediata.

## ⚙️ Notas Técnicas

- Es crucial implementar un sistema de almacenamiento de archivos robusto y seguro (ej. AWS S3 con políticas de acceso restringido) que cumpla con normativas de protección de datos de salud como LOPD/GDPR/HIPAA.
- Considerar la integración con una librería de visualización de archivos DICOM/STL (ej. Cornerstone.js, VTK.js) para permitir la previsualización de estudios directamente en el navegador sin necesidad de software externo.
- El estado del protocolo debe gestionarse mediante una máquina de estados finitos para asegurar transiciones lógicas y prevenir saltos inválidos entre fases (ej. no se puede pasar a 'Cirugía' sin completar 'Planificación').
- Implementar un sistema de logs de auditoría para registrar cada cambio significativo en el protocolo, guardando qué usuario lo hizo y cuándo.
- Optimizar la subida de archivos grandes (CBCT) mediante carga en chunks y procesamiento en segundo plano para no bloquear la interfaz de usuario.
- La interfaz debe ser altamente intuitiva, preferiblemente un 'wizard' o 'stepper', para minimizar la curva de aprendizaje y reducir errores en la entrada de datos críticos.

