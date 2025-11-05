# Informe de Teleconsulta

**Categoría:** Telemedicina | **Módulo:** Teleodontología

El Informe de Teleconsulta es una funcionalidad crítica dentro del módulo de Teleodontología, diseñada para que el odontólogo documente formalmente los hallazgos, diagnósticos y recomendaciones derivados de una consulta a distancia. Esta página actúa como el cierre clínico de una sesión de teleodontología, transformando la interacción virtual en un registro médico tangible y legalmente válido. Su propósito principal es asegurar la continuidad de la atención, la precisión del historial clínico del paciente y la comunicación clara de los pasos a seguir. Al finalizar una videoconsulta, el sistema redirige automáticamente al profesional a esta interfaz, que viene pre-poblada con los datos del paciente y de la cita. Aquí, el odontólogo puede detallar sus observaciones, formular un diagnóstico presuntivo, describir el plan de tratamiento recomendado, generar prescripciones electrónicas y adjuntar archivos relevantes (como capturas de pantalla o radiografías enviadas por el paciente). Una vez completado y firmado digitalmente, el informe se integra de forma permanente en la Ficha Clínica Electrónica del paciente, quedando accesible para futuras consultas y sirviendo como base para la facturación y seguimiento. Esta funcionalidad no solo moderniza la práctica dental, sino que también refuerza la seguridad y la calidad del cuidado al paciente en un entorno digital.

## 👥 Roles de Acceso

- Odontólogo

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/teleodontologia/`

La funcionalidad se encuentra dentro de la carpeta 'teleodontologia'. La subcarpeta '/pages' contiene el componente principal 'InformeTeleconsultaPage.tsx', que renderiza la interfaz completa. Los componentes reutilizables como el formulario principal ('InformeTeleconsultaForm.tsx'), la cabecera con datos del paciente ('ResumenPacienteHeader.tsx') y secciones específicas ('SeccionDiagnostico.tsx', 'SeccionRecomendaciones.tsx') se ubican en '/components'. Las llamadas al backend para obtener datos de la consulta y guardar el informe se gestionan en '/apis/teleconsultaApi.ts'.

### Archivos Frontend

- `/features/teleodontologia/pages/InformeTeleconsultaPage.tsx`
- `/features/teleodontologia/components/InformeTeleconsultaForm.tsx`
- `/features/teleodontologia/components/ResumenPacienteTeleconsultaHeader.tsx`
- `/features/teleodontologia/components/SeccionDiagnosticoPresuntivo.tsx`
- `/features/teleodontologia/components/SeccionPlanRecomendado.tsx`
- `/features/teleodontologia/components/ModalAdjuntarArchivosTeleconsulta.tsx`
- `/features/teleodontologia/components/FirmaDigitalOdontologo.tsx`
- `/features/teleodontologia/apis/informeTeleconsultaApi.ts`

### Componentes React

- InformeTeleconsultaPage
- InformeTeleconsultaForm
- ResumenPacienteTeleconsultaHeader
- SeccionDiagnosticoPresuntivo
- SeccionPlanRecomendado
- ModalAdjuntarArchivosTeleconsulta
- FirmaDigitalOdontologo

## 🔌 APIs Backend

Se requieren APIs para obtener los detalles de la teleconsulta a documentar, para guardar el informe una vez completado, y para actualizarlo si se guarda como borrador. También se necesita un endpoint para asociar archivos adjuntos al informe.

### `GET` `/api/teleconsultas/:id`

Obtiene los detalles completos de una teleconsulta específica, incluyendo los datos del paciente asociado, para pre-rellenar el formulario del informe.

**Parámetros:** id (string): ID de la teleconsulta.

**Respuesta:** Objeto JSON con los detalles de la teleconsulta y el paciente.

### `POST` `/api/teleconsultas/:id/informe`

Crea y guarda el informe final para una teleconsulta. Cambia el estado de la teleconsulta a 'Completada'.

**Parámetros:** id (string): ID de la teleconsulta., Body (JSON): { diagnosticoPresuntivo, observaciones, planTratamientoRecomendado, prescripciones: [...], firmaDigital, ... }

**Respuesta:** Objeto JSON del informe creado.

### `PUT` `/api/teleconsultas/:id/informe`

Actualiza un informe que fue guardado previamente como borrador.

**Parámetros:** id (string): ID de la teleconsulta., Body (JSON): { ...campos del informe a actualizar... }

**Respuesta:** Objeto JSON del informe actualizado.

### `POST` `/api/teleconsultas/:id/informe/adjuntos`

Sube y asocia uno o más archivos (imágenes, PDFs) al informe de la teleconsulta.

**Parámetros:** id (string): ID de la teleconsulta., Body (multipart/form-data): Archivos a subir.

**Respuesta:** Array de URLs o identificadores de los archivos subidos.

## 🗂️ Estructura Backend (MERN)

La estructura del backend se centra en el modelo 'Teleconsulta', que contendrá un subdocumento para el informe. El 'TeleconsultaController' manejará la lógica de negocio para crear, leer y actualizar estos informes, y las rutas se expondrán a través de 'teleconsultaRoutes.js' siguiendo una convención RESTful.

### Models

#### Teleconsulta

ref: 'Paciente', ref: 'Odontologo', fecha: Date, estado: String ('programada', 'finalizada', 'informe_pendiente', 'completada'), motivoConsulta: String, enlaceVideo: String, informe: { diagnosticoPresuntivo: String, observaciones: String, planTratamientoRecomendado: String, prescripciones: [{...}], archivosAdjuntos: [{ nombre: String, url: String }], fechaCreacion: Date, firmaDigital: String }

### Controllers

#### TeleconsultaController

- getTeleconsultaById
- createOrUpdateInforme
- addAdjuntoToInforme

### Routes

#### `/api/teleconsultas`

- GET /:id
- POST /:id/informe
- PUT /:id/informe
- POST /:id/informe/adjuntos

## 🔄 Flujos

1. El odontólogo finaliza la videollamada y es redirigido a la página 'Informe de Teleconsulta' con el ID de la sesión.
2. La página realiza una llamada GET para obtener los datos del paciente y la consulta, mostrando esta información en una cabecera.
3. El odontólogo completa los campos del formulario: observaciones, diagnóstico presuntivo, plan recomendado, etc.
4. Si es necesario, el odontólogo adjunta archivos (ej. imágenes) y genera una prescripción electrónica.
5. El sistema guarda un borrador del informe automáticamente cada cierto intervalo para evitar pérdida de datos.
6. Al finalizar, el odontólogo aplica su firma digital y presiona 'Finalizar y Guardar'.
7. Se realiza una llamada POST/PUT al backend para guardar el informe final, el cual se asocia permanentemente a la ficha del paciente y actualiza el estado de la teleconsulta.

## 📝 User Stories

- Como odontólogo, quiero que al terminar una teleconsulta, el sistema me lleve directamente a un formulario para crear el informe, para documentar los detalles mientras los tengo frescos en mi memoria.
- Como odontólogo, quiero ver los datos del paciente y el motivo de la consulta ya cargados en el informe para ahorrar tiempo y reducir errores de transcripción.
- Como odontólogo, quiero disponer de campos de texto enriquecido para detallar el diagnóstico y el plan de tratamiento, permitiéndome usar negritas, listas y otros formatos para mayor claridad.
- Como odontólogo, quiero poder adjuntar imágenes que el paciente me ha enviado durante la consulta directamente al informe para tener un registro visual completo.
- Como odontólogo, quiero firmar digitalmente el informe con un solo clic para validarlo legalmente y cerrar el caso de forma segura.
- Como odontólogo, quiero que una vez guardado, el informe de teleconsulta aparezca cronológicamente en el historial clínico del paciente para una fácil referencia futura.

## ⚙️ Notas Técnicas

- Seguridad: Es imperativo cumplir con normativas de protección de datos de salud (como HIPAA o RGPD). Toda la comunicación debe ser sobre HTTPS. Los datos en la base de datos (MongoDB) deben estar encriptados en reposo. La firma digital debe implementarse usando un método criptográficamente seguro.
- Editor de Texto: Implementar un editor de texto enriquecido (WYSIWYG) como Tiptap o Quill.js para los campos de observaciones y diagnóstico, para mejorar la experiencia del odontólogo.
- Auto-guardado: Implementar una función de auto-guardado (debounce) en el frontend para guardar borradores del informe en el estado local o enviando peticiones PUT al backend periódicamente, previniendo la pérdida de información.
- Integración: El informe finalizado debe disparar eventos o webhooks para notificar a otros módulos, como el de facturación (para generar el cobro por la consulta) o el de citas (para agendar la próxima cita recomendada).
- Gestión de Archivos: La subida de archivos adjuntos debe gestionarse a través de un servicio de almacenamiento de objetos (como AWS S3, Google Cloud Storage) para no sobrecargar la base de datos y mejorar el rendimiento.

