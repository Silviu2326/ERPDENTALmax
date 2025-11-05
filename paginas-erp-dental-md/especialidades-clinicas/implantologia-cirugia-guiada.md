# Implantología: Cirugía Guiada

**Categoría:** Especialidades Clínicas | **Módulo:** Especialidades Clínicas

La funcionalidad 'Implantología: Cirugía Guiada' es una herramienta especializada dentro del módulo 'Especialidades Clínicas' del ERP dental. Está diseñada para digitalizar y gestionar de forma integral el flujo de trabajo de la colocación de implantes dentales mediante guías quirúrgicas personalizadas. Este proceso, que combina imágenes de Tomografía Computarizada (DICOM) con escaneos intraorales (STL), permite una planificación virtual extremadamente precisa de la posición, ángulo y profundidad del implante. La página centraliza toda la información y los archivos de cada caso, desde la recopilación de datos iniciales hasta el informe postoperatorio. Su propósito principal es mejorar la precisión quirúrgica, reducir el tiempo de la intervención, minimizar la morbilidad para el paciente y asegurar resultados predecibles y óptimos. Dentro del ERP, esta funcionalidad se integra directamente con la ficha del paciente, su odontograma y sus planes de tratamiento. Permite al odontólogo crear un caso, subir los archivos necesarios, colaborar con laboratorios dentales externos, seguir el estado de la fabricación de la guía y documentar todo el procedimiento. De este modo, se convierte en un registro clínico-legal completo y una herramienta de gestión de calidad indispensable para clínicas que ofrecen tratamientos de implantología avanzada.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/especialidades-clinicas/`

Esta funcionalidad reside dentro de la feature 'especialidades-clinicas'. La carpeta '/pages' contiene el componente principal 'CirugiaGuiadaImplantologiaPage.tsx', que actúa como el dashboard para listar y gestionar todos los casos. La subcarpeta '/components' alberga los elementos de UI reutilizables como 'FormularioNuevoCasoGuiado', 'VisorArchivos3D' para la visualización de modelos, y 'TimelineProgresoCaso' para el seguimiento de estados. Las llamadas a la API del backend se encapsulan en funciones dentro de la carpeta '/apis', por ejemplo, en un archivo 'casosCirugiaGuiadaApi.ts', que se encarga de la comunicación con los endpoints correspondientes para crear, leer, actualizar y gestionar los casos y sus archivos.

### Archivos Frontend

- `/features/especialidades-clinicas/pages/CirugiaGuiadaImplantologiaPage.tsx`
- `/features/especialidades-clinicas/pages/DetalleCasoCirugiaGuiadaPage.tsx`
- `/features/especialidades-clinicas/components/DashboardCasosCirugiaGuiada.tsx`
- `/features/especialidades-clinicas/components/FormularioPlanificacionCirugiaGuiada.tsx`
- `/features/especialidades-clinicas/components/TimelineEstadoCirugia.tsx`
- `/features/especialidades-clinicas/components/GestionArchivosCaso.tsx`
- `/features/especialidades-clinicas/apis/casosCirugiaGuiadaApi.ts`

### Componentes React

- DashboardCasosCirugiaGuiada
- FormularioPlanificacionCirugiaGuiada
- TimelineEstadoCirugia
- GestionArchivosCaso
- ModalDetalleCasoGuiado
- VisorArchivos3D

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida completo de un caso de cirugía guiada. Permiten la creación, recuperación, actualización y eliminación de casos, así como la gestión de archivos de gran tamaño (DICOM, STL) asociados, y el registro de comunicaciones y notas.

### `POST` `/api/casos-cirugia-guiada`

Crea un nuevo caso de cirugía guiada, asociándolo a un paciente y un odontólogo.

**Parámetros:** Body: { pacienteId: string, odontologoId: string, dientesImplicados: number[], tipoImplante: string, notasIniciales: string }

**Respuesta:** JSON con el objeto del nuevo caso creado.

### `GET` `/api/casos-cirugia-guiada`

Obtiene un listado paginado de todos los casos de cirugía guiada, con filtros por estado o por odontólogo.

**Parámetros:** Query: ?page=1&limit=10&estado=planificacion&odontologoId=...

**Respuesta:** JSON con un array de casos y metadatos de paginación.

### `GET` `/api/casos-cirugia-guiada/:casoId`

Obtiene los detalles completos de un caso específico, incluyendo sus archivos y notas.

**Parámetros:** Path: casoId

**Respuesta:** JSON con el objeto completo del caso.

### `PUT` `/api/casos-cirugia-guiada/:casoId`

Actualiza la información de un caso, principalmente para cambiar su estado (ej: de 'Planificación' a 'Diseño Férula').

**Parámetros:** Path: casoId, Body: { estado: string, notas: string, ... }

**Respuesta:** JSON con el objeto del caso actualizado.

### `POST` `/api/casos-cirugia-guiada/:casoId/archivos`

Sube un archivo (DICOM, STL, PDF de planificación) y lo asocia a un caso. Requiere 'multipart/form-data'.

**Parámetros:** Path: casoId, FormData: { file: (binary), tipoArchivo: 'DICOM' | 'STL' | 'PLANIFICACION' }

**Respuesta:** JSON con la información del archivo subido (URL, ID, etc.).

### `GET` `/api/casos-cirugia-guiada/:casoId/archivos/:archivoId`

Genera una URL segura y temporal para descargar un archivo específico asociado al caso.

**Parámetros:** Path: casoId, archivoId

**Respuesta:** JSON con { downloadUrl: 'string' }.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se centra en el modelo 'CasoCirugiaGuiada', que almacena toda la información del caso. El 'CasoCirugiaGuiadaController' contiene la lógica de negocio para gestionar estos casos y sus archivos, interactuando con servicios de almacenamiento en la nube. Las rutas se definen en un archivo dedicado que mapea los endpoints HTTP a las funciones del controlador.

### Models

#### CasoCirugiaGuiada

paciente: { type: ObjectId, ref: 'Paciente' }, odontologo: { type: ObjectId, ref: 'Usuario' }, fechaCreacion: Date, estado: { type: String, enum: ['Planificación', 'Diseño Férula', 'Impresión Férula', 'Cirugía Planificada', 'Completado', 'Cancelado'] }, dientesImplicados: [Number], tipoImplante: String, sistemaGuiado: String, laboratorio: { type: ObjectId, ref: 'Laboratorio' }, notas: [{ autor: String, contenido: String, fecha: Date }], archivos: [{ nombreOriginal: String, urlAlmacenamiento: String, tipoArchivo: String, fechaSubida: Date }]

### Controllers

#### CasoCirugiaGuiadaController

- crearCaso
- obtenerCasos
- obtenerCasoPorId
- actualizarEstadoCaso
- subirArchivoACaso
- obtenerUrlDescargaArchivo
- eliminarArchivoDeCaso

### Routes

#### `/api/casos-cirugia-guiada`

- POST /
- GET /
- GET /:casoId
- PUT /:casoId
- POST /:casoId/archivos
- GET /:casoId/archivos/:archivoId

## 🔄 Flujos

1. El odontólogo, desde la ficha de un paciente, inicia un nuevo caso de cirugía guiada.
2. Rellena el formulario inicial con los detalles del tratamiento y sube los archivos DICOM y STL.
3. El sistema crea el caso con estado 'Planificación' y lo muestra en el dashboard del odontólogo.
4. El odontólogo actualiza el estado a 'Diseño Férula' cuando envía el caso al laboratorio.
5. El laboratorio (o el odontólogo) sube el archivo de planificación y el diseño de la guía quirúrgica.
6. El odontólogo recibe la guía física y actualiza el estado a 'Cirugía Planificada'.
7. Tras la intervención, el odontólogo marca el caso como 'Completado' y puede añadir notas o informes postoperatorios.
8. Todo el historial del caso, incluyendo archivos y cambios de estado, queda registrado y accesible en la ficha del paciente.

## 📝 User Stories

- Como odontólogo, quiero crear un nuevo caso de cirugía guiada para un paciente, adjuntando sus escaneos DICOM y STL, para iniciar el proceso de planificación digital.
- Como odontólogo, quiero ver un listado de todos mis casos de cirugía guiada con su estado actual (planificación, diseño, etc.) para gestionar mi flujo de trabajo de forma eficiente.
- Como odontólogo, quiero actualizar el estado de un caso de cirugía guiada a medida que avanza, desde la planificación hasta la finalización, para tener un registro preciso del progreso.
- Como odontólogo, quiero descargar la guía quirúrgica final en formato STL y el informe de planificación para prepararme para la cirugía.
- Como odontólogo, quiero añadir notas y comunicarme con el laboratorio dental directamente desde la ficha del caso para asegurar una colaboración fluida y documentada.

## ⚙️ Notas Técnicas

- Gestión de archivos: Implementar la subida de archivos grandes directamente a un servicio de almacenamiento en la nube (como AWS S3 o Google Cloud Storage) para no sobrecargar el servidor de la aplicación. El backend debe generar URLs firmadas (presigned URLs) para autorizar las subidas y descargas seguras desde el cliente.
- Seguridad y Cumplimiento: Los datos del paciente, especialmente los archivos DICOM, son información médica sensible. Es imperativo cumplir con normativas como GDPR o HIPAA, asegurando el cifrado de datos en reposo y en tránsito, y un estricto control de acceso basado en roles.
- Visualización 3D: La integración de un visor web para archivos STL y DICOM (usando librerías como Three.js con loaders específicos o servicios de terceros) mejorará significativamente la experiencia de usuario, permitiendo una previsualización rápida sin necesidad de software externo.
- Rendimiento: La lista de casos debe ser paginada en el backend para evitar la carga de grandes volúmenes de datos en el frontend. Optimizar las consultas a la base de datos, especialmente al filtrar o buscar casos.
- Integración con Laboratorios: Considerar a futuro una API o portal para que los laboratorios dentales puedan interactuar directamente con el caso, subiendo archivos y actualizando estados, lo que automatizaría aún más el flujo de trabajo.

