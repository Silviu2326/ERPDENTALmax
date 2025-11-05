# Recetas Médicas

**Categoría:** Gestión Documental | **Módulo:** Documentación y Protocolos

La funcionalidad de 'Recetas Médicas' es un componente esencial del módulo 'Documentación y Protocolos', diseñado para digitalizar, estandarizar y centralizar el proceso de prescripción de medicamentos dentro de la clínica dental. Este sistema permite a los odontólogos generar recetas de manera rápida, segura y legible, eliminando los errores comunes asociados a la escritura manual y mejorando significativamente la seguridad del paciente. Integrado directamente con el expediente clínico de cada paciente, el módulo asegura que todas las prescripciones queden registradas automáticamente, formando un historial farmacológico completo y de fácil acceso. Esto es crucial para la toma de decisiones clínicas, permitiendo al profesional consultar tratamientos previos, evitar interacciones medicamentosas adversas y asegurar la continuidad del cuidado. La herramienta funciona mediante un formulario inteligente que se conecta a una base de datos de medicamentos (Vademecum), sugiriendo nombres, dosis y presentaciones estandarizadas para agilizar el proceso y reducir errores. Una vez completada, la receta puede ser impresa en un formato profesional con los datos de la clínica y del profesional, o enviada digitalmente al paciente. Su propósito principal es optimizar el flujo de trabajo del odontólogo, garantizar el cumplimiento normativo en la prescripción y fortalecer la trazabilidad y la calidad de la atención al paciente dentro del ecosistema del ERP dental.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/documentacion-protocolos/`

La funcionalidad de Recetas Médicas reside dentro de la feature 'documentacion-protocolos'. La carpeta '/pages/' contiene el componente principal 'RecetasMedicasPage.tsx', que renderiza la interfaz para buscar pacientes, ver su historial de recetas y crear nuevas. La carpeta '/components/' alberga componentes reutilizables como 'FormularioCrearReceta.tsx', 'ListaHistorialRecetas.tsx', 'BuscadorMedicamentos.tsx' y 'ModalVistaPreviaPDF.tsx', que manejan la lógica de la UI de forma aislada. Finalmente, la carpeta '/apis/' contiene el archivo 'recetasApi.ts', que exporta funciones asíncronas para comunicarse con el backend, encapsulando todas las llamadas HTTP (crear, leer, actualizar, eliminar recetas) y manteniendo el código de la UI limpio.

### Archivos Frontend

- `/features/documentacion-protocolos/pages/RecetasMedicasPage.tsx`
- `/features/documentacion-protocolos/components/FormularioCrearReceta.tsx`
- `/features/documentacion-protocolos/components/ListaHistorialRecetas.tsx`
- `/features/documentacion-protocolos/components/BuscadorMedicamentos.tsx`
- `/features/documentacion-protocolos/components/ModalVistaPreviaPDF.tsx`
- `/features/documentacion-protocolos/apis/recetasApi.ts`

### Componentes React

- RecetasMedicasPage
- FormularioCrearReceta
- ListaHistorialRecetas
- BuscadorMedicamentos
- ModalVistaPreviaPDF
- ItemMedicamentoReceta

## 🔌 APIs Backend

Las APIs para este módulo gestionan el ciclo de vida completo de una receta médica. Permiten la creación, recuperación (individual y por paciente), y eliminación lógica de recetas. Incluyen un endpoint específico para buscar medicamentos en un catálogo centralizado, facilitando la prescripción precisa y estandarizada.

### `POST` `/api/recetas`

Crea una nueva receta médica asociada a un paciente y a un odontólogo. Recibe los detalles de la prescripción en el cuerpo de la solicitud.

**Parámetros:** Body: { pacienteId: string, odontologoId: string, medicamentos: [{ nombre: string, dosis: string, frecuencia: string, duracion: string }], indicaciones_generales: string }

**Respuesta:** El objeto de la receta recién creada, incluyendo su ID y folio.

### `GET` `/api/recetas/paciente/:pacienteId`

Obtiene el historial completo de recetas médicas para un paciente específico.

**Parámetros:** URL Param: pacienteId (ID del paciente)

**Respuesta:** Un array de objetos de receta para el paciente solicitado.

### `GET` `/api/recetas/:recetaId`

Obtiene los detalles de una receta médica específica por su ID, para visualización o impresión.

**Parámetros:** URL Param: recetaId (ID de la receta)

**Respuesta:** El objeto completo de la receta solicitada.

### `DELETE` `/api/recetas/:recetaId`

Realiza una eliminación lógica (soft delete) de una receta, marcándola como anulada. Esto es crucial para mantener la integridad del historial clínico.

**Parámetros:** URL Param: recetaId (ID de la receta)

**Respuesta:** Un mensaje de confirmación.

### `GET` `/api/medicamentos/buscar`

Busca medicamentos en la base de datos (Vademecum) para autocompletar en el formulario de recetas.

**Parámetros:** Query Param: q (término de búsqueda)

**Respuesta:** Un array de objetos de medicamento que coinciden con la búsqueda.

## 🗂️ Estructura Backend (MERN)

El backend para esta funcionalidad se basa en el patrón MVC. El modelo 'Receta' define la estructura de los datos en MongoDB. El 'RecetaController' contiene la lógica de negocio para gestionar las recetas (crear, buscar, etc.), interactuando con el modelo. Las rutas, definidas en 'recetas.routes.js', exponen los endpoints de la API, vinculando las peticiones HTTP a las funciones correspondientes del controlador.

### Models

#### Receta

paciente: { type: ObjectId, ref: 'Paciente' }, odontologo: { type: ObjectId, ref: 'Usuario' }, clinica: { type: ObjectId, ref: 'Clinica' }, fecha: { type: Date, default: Date.now }, folio: { type: String, unique: true }, medicamentos: [{ nombre: String, dosis: String, frecuencia: String, duracion: String, indicaciones_especificas: String }], indicaciones_generales: String, estado: { type: String, enum: ['Activa', 'Anulada'], default: 'Activa' }

#### Medicamento

nombre_generico: String, nombre_comercial: String, presentacion: String, concentracion: String

### Controllers

#### RecetaController

- crearReceta
- obtenerRecetasPorPaciente
- obtenerRecetaPorId
- anularReceta

#### MedicamentoController

- buscarMedicamentos

### Routes

#### `/api/recetas`

- POST /
- GET /paciente/:pacienteId
- GET /:recetaId
- DELETE /:recetaId

#### `/api/medicamentos`

- GET /buscar

## 🔄 Flujos

1. El odontólogo selecciona un paciente desde su panel principal o el módulo de pacientes.
2. Navega a la sección 'Documentación' del paciente y selecciona 'Recetas Médicas'.
3. El sistema muestra el historial de recetas del paciente.
4. El odontólogo hace clic en 'Crear Nueva Receta'.
5. Se abre un formulario donde el odontólogo comienza a escribir el nombre de un medicamento; el sistema sugiere coincidencias desde la base de datos.
6. Selecciona un medicamento y completa los campos de dosis, frecuencia y duración.
7. Repite el proceso para todos los medicamentos necesarios y añade indicaciones generales.
8. El odontólogo previsualiza la receta en formato PDF, que incluye los datos de la clínica, del profesional y del paciente.
9. Al guardar, el sistema genera un folio único, guarda la receta en la base de datos vinculada al paciente y permite la impresión del PDF.

## 📝 User Stories

- Como odontólogo, quiero crear una nueva receta médica para un paciente buscando medicamentos en un catálogo precargado para asegurar la precisión y reducir errores de transcripción.
- Como odontólogo, quiero acceder al historial de recetas de un paciente con un solo clic desde su expediente para revisar tratamientos farmacológicos previos antes de prescribir uno nuevo.
- Como odontólogo, quiero que el sistema genere automáticamente un PDF profesional de la receta con todos los datos legales y de la clínica para poder imprimirla y entregarla al paciente.
- Como odontólogo, quiero que cada receta se guarde automáticamente en el expediente digital del paciente para mantener un registro completo, centralizado y auditable.
- Como odontólogo, quiero poder anular una receta emitida por error, manteniendo el registro de la anulación para fines de trazabilidad.

## ⚙️ Notas Técnicas

- Seguridad: Implementar un control de acceso estricto basado en roles (RBAC) para garantizar que solo los odontólogos autorizados puedan crear y gestionar recetas. Todos los datos de salud deben estar encriptados en tránsito (TLS/SSL) y en reposo (MongoDB encryption).
- Cumplimiento Normativo: El formato de la receta generada debe cumplir con la normativa local de prescripción médica (datos del profesional, paciente, fecha, firma, etc.).
- Generación de PDF: Utilizar una librería robusta en el backend como 'pdf-lib' o 'Puppeteer' para generar los PDFs. Esto asegura consistencia y descarga la carga del cliente. El frontend puede solicitar el PDF a través de un endpoint específico.
- Integración Vademecum: Considerar la integración con una API externa de Vademecum para mantener la base de datos de medicamentos actualizada con información sobre interacciones, alertas y nuevas drogas.
- Auditoría: Implementar un sistema de logs que registre todas las acciones críticas sobre las recetas (creación, visualización, anulación) junto con el usuario y la marca de tiempo, para cumplir con los estándares de auditoría y seguridad.

