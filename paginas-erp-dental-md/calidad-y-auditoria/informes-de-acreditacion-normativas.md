# Informes de Acreditación/Normativas

**Categoría:** Calidad y Auditoría | **Módulo:** Calidad y Auditoría

La funcionalidad 'Informes de Acreditación/Normativas' es un componente crítico dentro del módulo 'Calidad y Auditoría' del ERP dental. Su propósito principal es centralizar, automatizar y simplificar la generación de toda la documentación y evidencia requerida para procesos de acreditación, certificaciones (como ISO 9001) y el cumplimiento de normativas sanitarias locales, nacionales e internacionales (ej. GDPR, LOPD, normativas de esterilización). Esta herramienta permite a los directores y administradores transformar datos operativos complejos, dispersos por todo el ERP, en informes estructurados, legibles y listos para ser presentados ante entidades reguladoras. Funciona agregando datos en tiempo real de múltiples módulos como 'Esterilización' (registros de ciclos, mantenimiento de autoclaves), 'Gestión de Pacientes' (consentimientos informados firmados), 'Equipamiento' (calendarios de mantenimiento y calibración) y 'Facturación' (registros para auditorías fiscales). En lugar de recopilar manualmente hojas de cálculo y documentos, el usuario puede seleccionar un tipo de informe preconfigurado, aplicar filtros como rangos de fechas o sedes, y generar un documento PDF o CSV consolidado con un solo clic. Esto no solo ahorra cientos de horas de trabajo administrativo, sino que también minimiza el riesgo de errores humanos, garantizando que la clínica esté siempre preparada para una inspección o auditoría sorpresa.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/calidad-auditoria/`

Esta funcionalidad reside dentro de la feature 'calidad-auditoria'. La subcarpeta '/pages/' contiene el componente principal 'InformesAcreditacionPage.tsx', que actúa como el dashboard para la selección y generación de informes. En '/components/', se encuentran los elementos reutilizables como 'SelectorDeInformes.tsx' para elegir la plantilla, 'FormularioFiltrosInforme.tsx' para definir los parámetros (fechas, clínica), y 'TablaHistorialInformes.tsx' para mostrar los informes generados previamente. La lógica de comunicación con el backend se encapsula en '/apis/informesAcreditacionApi.ts', que exporta funciones asíncronas para solicitar la generación y descarga de informes.

### Archivos Frontend

- `/features/calidad-auditoria/pages/InformesAcreditacionPage.tsx`
- `/features/calidad-auditoria/components/SelectorDeInformes.tsx`
- `/features/calidad-auditoria/components/FormularioFiltrosInforme.tsx`
- `/features/calidad-auditoria/components/TablaHistorialInformes.tsx`
- `/features/calidad-auditoria/apis/informesAcreditacionApi.ts`

### Componentes React

- SelectorDeInformes
- FormularioFiltrosInforme
- TablaHistorialInformes
- ItemInformeGenerado
- ModalVisualizacionPDF

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en la generación y gestión de informes. Un endpoint clave permite iniciar un proceso de generación asíncrono, dado que la recopilación de datos puede ser intensiva. Otros endpoints permiten verificar el estado de un informe en proceso, listar los ya completados y obtener una URL segura para su descarga.

### `GET` `/api/calidad/informes/plantillas`

Obtiene la lista de todas las plantillas de informes disponibles en el sistema (ej: Trazabilidad Esterilización, Cumplimiento Consentimientos).

**Respuesta:** Array de objetos: [{ id: 'string', nombre: 'string', descripcion: 'string', filtrosDisponibles: ['fecha', 'clinica', 'equipo'] }]

### `POST` `/api/calidad/informes/generar`

Inicia la generación asíncrona de un informe. Devuelve un ID de trabajo para poder consultar su estado posteriormente.

**Parámetros:** Body: { plantillaId: 'string', filtros: { fechaInicio: 'Date', fechaFin: 'Date', clinicaId: 'ObjectId' } }

**Respuesta:** Objeto: { jobId: 'string', mensaje: 'La generación del informe ha comenzado.' }

### `GET` `/api/calidad/informes/generados/:jobId/estado`

Consulta el estado de un trabajo de generación de informe específico.

**Parámetros:** URL Param: jobId

**Respuesta:** Objeto: { jobId: 'string', estado: 'procesando' | 'completado' | 'error', progreso: number, urlDescarga: 'string' | null }

### `GET` `/api/calidad/informes/generados`

Obtiene una lista paginada del historial de informes generados por el usuario o en su clínica.

**Parámetros:** Query: ?page=1&limit=10&sortBy=fechaGeneracion

**Respuesta:** Array de objetos: [{ id: 'string', nombreInforme: 'string', fechaGeneracion: 'Date', estado: 'string', urlDescarga: 'string' }]

## 🗂️ Estructura Backend (MERN)

El backend utiliza un modelo 'InformeGenerado' para rastrear cada solicitud de informe. El 'InformeAcreditacionController' contiene la lógica compleja de negocio, que implica la utilización del Aggregation Framework de MongoDB para consultar y consolidar datos de múltiples colecciones (EsterilizacionCiclo, Consentimiento, MantenimientoEquipo) sin modificar los datos originales. Las rutas exponen esta lógica de forma segura y controlada.

### Models

#### InformeGenerado

nombre: String, plantillaId: String, fechaGeneracion: Date, estado: String (enum: ['procesando', 'completado', 'error']), parametros: Object, urlArchivo: String, generadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }, clinica: { type: Schema.Types.ObjectId, ref: 'Clinica' }

#### Modelos Relacionados (solo lectura)

Esta funcionalidad leerá datos de modelos como: EsterilizacionCiclo, Consentimiento, MantenimientoEquipo, Paciente, HistorialClinico.

### Controllers

#### InformeAcreditacionController

- listarPlantillasDisponibles
- solicitarGeneracionInforme
- consultarEstadoInforme
- listarInformesGenerados

### Routes

#### `/api/calidad/informes`

- GET /plantillas
- POST /generar
- GET /generados/:jobId/estado
- GET /generados

## 🔄 Flujos

1. El Director de la clínica accede al módulo 'Calidad y Auditoría' y selecciona la opción 'Informes de Acreditación'.
2. La interfaz muestra una lista de informes predefinidos, como 'Informe de Trazabilidad de Esterilización' o 'Informe de Consentimientos Informados'.
3. El usuario elige un informe, introduce un rango de fechas y selecciona la clínica (si es multisede).
4. Al hacer clic en 'Generar', el sistema inicia un trabajo en segundo plano y muestra el informe en una tabla de 'Historial' con el estado 'Procesando'.
5. Una vez finalizado el proceso, el estado cambia a 'Completado' y se habilita un botón de 'Descargar (PDF)'.
6. El usuario descarga el informe, que contiene tablas, gráficos y resúmenes de cumplimiento, listo para ser archivado o presentado.

## 📝 User Stories

- Como Director de clínica, quiero generar con un solo clic un informe completo de todos los ciclos de esterilización del último trimestre para pasar una inspección sanitaria.
- Como Admin general multisede, quiero generar un informe de cumplimiento de la LOPD que liste todos los pacientes que han firmado el consentimiento de protección de datos, filtrado por clínica, para realizar una auditoría interna.
- Como responsable de IT, quiero poder acceder al historial de informes generados para asegurar que los procesos de backup y almacenamiento de documentos sensibles funcionan correctamente.
- Como Director, quiero que el informe PDF generado incluya automáticamente el logo y los datos de mi clínica en la cabecera para darle un aspecto profesional y oficial.

## ⚙️ Notas Técnicas

- Generación Asíncrona: Es imperativo usar una cola de trabajos (ej. BullMQ, Agenda.js) para procesar la generación de informes en segundo plano. Esto evita timeouts en las peticiones HTTP y no bloquea el servidor principal.
- Seguridad y Acceso: El acceso a los informes generados debe ser estrictamente controlado. Los archivos deben almacenarse en un bucket privado (ej. AWS S3, Google Cloud Storage) y ser servidos a través de URLs firmadas con un tiempo de expiración corto.
- Rendimiento de Base de Datos: Las consultas para agregar datos de múltiples colecciones deben estar altamente optimizadas. Utilizar el Aggregation Pipeline de MongoDB y asegurar la existencia de índices compuestos en los campos de filtrado (ej. fecha, clinicaId) es crucial.
- Generación de PDF: Utilizar una librería robusta en el backend como Puppeteer (headless Chrome) para renderizar plantillas HTML/CSS complejas a PDF, permitiendo una personalización total del diseño del informe (logos, cabeceras, pies de página).
- Audit Trail: Cada acción (generación, visualización, descarga de informe) debe ser registrada en un log de auditoría inmutable para cumplir con los estándares de trazabilidad y seguridad de la información.

