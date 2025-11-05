# Etiquetado y Trazabilidad de Instrumental

**Categoría:** Calidad y Seguridad | **Módulo:** Esterilización y Trazabilidad

La funcionalidad de 'Etiquetado y Trazabilidad de Instrumental' es un pilar fundamental dentro del módulo de 'Esterilización y Trazabilidad', diseñada para digitalizar, automatizar y asegurar el ciclo de vida completo del instrumental dental. Su propósito principal es eliminar los registros manuales, propensos a errores, y establecer un sistema de seguimiento electrónico infalible desde que el material es utilizado hasta que está listo para su próximo uso. El proceso comienza con la generación de una etiqueta única, típicamente un código QR o de barras, para cada kit o instrumento individual. Esta etiqueta se convierte en su 'pasaporte digital'. A medida que el kit avanza por las distintas fases del ciclo de esterilización (limpieza, desinfección, empaquetado, autoclave, almacenamiento), el personal auxiliar escanea la etiqueta en cada punto de control. El sistema ERP registra automáticamente la fecha, hora, el operario responsable y el estado actualizado. La funcionalidad culmina al asociar el uso de ese kit específico a un paciente y a un tratamiento concreto en el sillón dental. Esto crea un vínculo inquebrantable que es crucial para la seguridad del paciente, permitiendo una trazabilidad inversa completa. En caso de una alerta sanitaria o un control de calidad, es posible identificar instantáneamente qué instrumental se utilizó con qué paciente, en qué fecha y cuál fue su ciclo de esterilización completo, garantizando el cumplimiento de las normativas más exigentes y elevando los estándares de bioseguridad de la clínica.

## 👥 Roles de Acceso

- Auxiliar / Asistente
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/esterilizacion-trazabilidad/`

Toda la lógica de frontend para esta funcionalidad reside dentro de la carpeta '/features/esterilizacion-trazabilidad/'. La subcarpeta '/pages/' contiene el componente principal de la página 'EtiquetadoTrazabilidadPage.tsx', que actúa como el dashboard central. Los componentes reutilizables como el escáner QR, la tabla de historial y los modales se encuentran en '/components/'. Las llamadas al backend están encapsuladas en funciones dentro de la subcarpeta '/apis/', lo que mantiene el código limpio y organizado.

### Archivos Frontend

- `/features/esterilizacion-trazabilidad/pages/EtiquetadoTrazabilidadPage.tsx`
- `/features/esterilizacion-trazabilidad/pages/DetalleCicloInstrumentalPage.tsx`
- `/features/esterilizacion-trazabilidad/components/PanelControlTrazabilidad.tsx`
- `/features/esterilizacion-trazabilidad/components/GeneradorEtiquetasQR.tsx`
- `/features/esterilizacion-trazabilidad/components/ScannerComponent.tsx`
- `/features/esterilizacion-trazabilidad/components/TablaHistorialCiclos.tsx`
- `/features/esterilizacion-trazabilidad/components/ModalAsociarPacienteTratamiento.tsx`
- `/features/esterilizacion-trazabilidad/apis/instrumentalCicloApi.ts`

### Componentes React

- PanelControlTrazabilidad
- GeneradorEtiquetasQR
- ScannerComponent
- TablaHistorialCiclos
- ModalAsociarPacienteTratamiento
- TimelineEstadoCiclo

## 🔌 APIs Backend

Las APIs gestionan el ciclo de vida completo de cada kit de instrumental. Permiten la creación de un nuevo ciclo con una etiqueta única, la actualización de su estado en cada etapa del proceso y la asociación final con un paciente. También proporcionan endpoints para consultar el historial detallado de cualquier kit.

### `POST` `/api/instrumental/ciclos`

Inicia un nuevo ciclo de esterilización para un kit de instrumental, generando un identificador único y devolviendo los datos para la etiqueta.

**Parámetros:** body: { kitId: string, usuarioId: string }

**Respuesta:** JSON con el objeto del nuevo ciclo creado, incluyendo el 'cicloUnicoId' para el QR.

### `PUT` `/api/instrumental/ciclos/:cicloId/estado`

Actualiza el estado de un ciclo de instrumental después de escanear su etiqueta en un punto de control.

**Parámetros:** path: cicloId, body: { nuevoEstado: string, usuarioId: string, autoclaveId?: string, lote?: string }

**Respuesta:** JSON con el objeto del ciclo actualizado.

### `GET` `/api/instrumental/ciclos`

Obtiene una lista de todos los ciclos de instrumental, con posibilidad de filtrar por estado, fecha o kit.

**Parámetros:** query: ?estado=almacenado, query: ?fechaDesde=YYYY-MM-DD

**Respuesta:** Array de objetos de ciclos de instrumental.

### `GET` `/api/instrumental/ciclos/:cicloId`

Obtiene la información y el historial completo de un ciclo de instrumental específico.

**Parámetros:** path: cicloId

**Respuesta:** JSON con el objeto del ciclo y su historial detallado.

### `PUT` `/api/instrumental/ciclos/:cicloId/asociar-paciente`

Asocia un ciclo de instrumental a un paciente y a un tratamiento específico.

**Parámetros:** path: cicloId, body: { pacienteId: string, tratamientoId: string, usuarioId: string }

**Respuesta:** JSON con el objeto del ciclo actualizado con la información del paciente.

## 🗂️ Estructura Backend (MERN)

El backend sigue una arquitectura MERN estándar. El modelo 'InstrumentalCiclo' en MongoDB almacena todos los datos de trazabilidad. El 'InstrumentalCicloController' contiene la lógica de negocio para cada operación, y las rutas de Express en '/routes/' exponen estos controladores como endpoints RESTful.

### Models

#### InstrumentalCiclo

cicloUnicoId: String (único, indexado), kitId: ObjectId (ref a 'InstrumentalKit'), estado: String (enum: ['Sucio', 'Lavado', 'Empaquetado', 'Esterilizado', 'Almacenado', 'EnUso', 'Finalizado']), historialEventos: Array<{ estado: String, fecha: Date, usuarioId: ObjectId }>, pacienteId: ObjectId (ref a 'Paciente'), tratamientoId: ObjectId (ref a 'Tratamiento'), fechaEsterilizacion: Date, fechaCaducidad: Date, createdAt: Date, updatedAt: Date

#### InstrumentalKit

nombre: String, descripcion: String, instrumentos: [String], activo: Boolean

### Controllers

#### InstrumentalCicloController

- crearNuevoCiclo
- actualizarEstado
- obtenerCicloPorId
- listarCiclos
- asociarAPaciente

### Routes

#### `/api/instrumental/ciclos`

- POST /
- GET /
- GET /:cicloId
- PUT /:cicloId/estado
- PUT /:cicloId/asociar-paciente

## 🔄 Flujos

1. El auxiliar selecciona 'Iniciar Nuevo Ciclo', elige el tipo de kit (ej: 'Kit de Cirugía'). El sistema genera un QR que el auxiliar imprime y adhiere al paquete.
2. Tras limpiar el instrumental, el auxiliar escanea el QR. El sistema presenta una pantalla para confirmar el cambio de estado a 'Lavado'. El proceso se repite para 'Empaquetado', 'Esterilizado' y 'Almacenado'.
3. Durante una cita, el personal escanea el QR del kit a utilizar. El sistema muestra un modal para confirmar la asociación con el paciente y tratamiento activos en esa sesión.
4. El personal de calidad o un administrador puede buscar por ID de paciente o ID de ciclo para visualizar el historial completo de un kit, incluyendo cada cambio de estado, las fechas y los usuarios responsables.

## 📝 User Stories

- Como Auxiliar de esterilización, quiero generar e imprimir una etiqueta QR única para cada kit de instrumental para poder iniciar su seguimiento digital de forma inequívoca.
- Como Asistente, quiero escanear el QR de un kit en cada etapa del proceso de esterilización para actualizar su estado en el sistema en tiempo real con un solo clic.
- Como Auxiliar, quiero poder asociar un kit de instrumental esterilizado a un paciente específico durante su tratamiento para garantizar una trazabilidad completa y cumplir con la normativa.
- Como responsable de Calidad, quiero buscar el historial completo de un kit de instrumental por su ID o por el paciente con el que se usó, para poder realizar auditorías y responder a incidentes de seguridad.

## ⚙️ Notas Técnicas

- Se utilizará la librería 'qrcode.react' en el frontend para generar los códigos QR de forma dinámica.
- Para el escaneo, se implementará un componente que utilice la API 'getUserMedia' del navegador para acceder a la cámara del dispositivo (PC, tablet o móvil), usando librerías como 'react-qr-reader'.
- Los endpoints de la API deben estar protegidos, requiriendo autenticación y autorización basada en roles. Cada cambio de estado debe ser registrado en el 'historialEventos' como un evento inmutable.
- La base de datos MongoDB debe tener índices en 'cicloUnicoId', 'estado' y 'pacienteId' en la colección 'InstrumentalCiclo' para optimizar las consultas.
- Se debe asegurar la integración con los módulos de Pacientes y Tratamientos para que la asociación sea fluida y se pueda acceder a la información de trazabilidad desde la ficha del paciente.

