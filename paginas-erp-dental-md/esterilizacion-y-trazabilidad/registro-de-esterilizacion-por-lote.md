# Registro de Esterilización por Lote

**Categoría:** Calidad y Seguridad | **Módulo:** Esterilización y Trazabilidad

La página 'Registro de Esterilización por Lote' es una funcionalidad crítica dentro del módulo de 'Esterilización y Trazabilidad', diseñada para digitalizar y automatizar el control de calidad de los procesos de desinfección y esterilización en la clínica dental. Su propósito fundamental es garantizar la seguridad del paciente y el cumplimiento de las normativas sanitarias vigentes (como las de la AEMPS, FDA, etc.), reemplazando los vulnerables registros manuales en papel por un sistema centralizado, seguro y auditable. En esta sección, el personal auxiliar registra cada ciclo de esterilización (lote) realizado en los autoclaves de la clínica. El sistema captura información detallada: el equipo utilizado (autoclave), el operador responsable, la fecha y hora de inicio y fin del ciclo, los parámetros físicos del ciclo (temperatura, presión, tiempo) y los resultados de los indicadores químicos y biológicos que validan la efectividad del proceso. Cada lote agrupa múltiples paquetes de instrumental, a los que se les asigna un identificador único. Esta funcionalidad es la piedra angular de la trazabilidad, ya que crea el registro de origen de cada instrumento estéril. Posteriormente, cuando un paquete se utiliza en un tratamiento, su identificador puede ser escaneado y asociado al registro del paciente, cerrando así el círculo de trazabilidad y permitiendo una rápida localización de todos los instrumentos de un lote en caso de detectarse un fallo de esterilización.

## 👥 Roles de Acceso

- Auxiliar / Asistente
- Director / Admin general (multisede)
- IT / Integraciones / Seguridad

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/esterilizacion-trazabilidad/`

La funcionalidad se encapsula dentro de la carpeta '/features/esterilizacion-trazabilidad/'. La subcarpeta '/pages/' contiene el componente principal 'RegistroLotesPage.tsx', que renderiza la interfaz completa. La lógica de la interfaz se descompone en componentes reutilizables ubicados en '/components/', como 'FormularioLoteEsterilizacion.tsx' para la creación y edición de lotes, y 'TablaLotesEsterilizacion.tsx' para listar y filtrar los registros. Las interacciones con el backend se gestionan a través de funciones definidas en '/apis/esterilizacionApi.ts', que abstraen las llamadas a la API REST.

### Archivos Frontend

- `/features/esterilizacion-trazabilidad/pages/RegistroLotesPage.tsx`
- `/features/esterilizacion-trazabilidad/components/FormularioLoteEsterilizacion.tsx`
- `/features/esterilizacion-trazabilidad/components/TablaLotesEsterilizacion.tsx`
- `/features/esterilizacion-trazabilidad/components/ModalDetalleLote.tsx`
- `/features/esterilizacion-trazabilidad/components/SelectorAutoclave.tsx`
- `/features/esterilizacion-trazabilidad/apis/esterilizacionApi.ts`

### Componentes React

- RegistroLotesPage
- FormularioLoteEsterilizacion
- TablaLotesEsterilizacion
- ModalDetalleLote
- SelectorAutoclave
- InputIndicadorBiologico

## 🔌 APIs Backend

La API RESTful para esta funcionalidad gestiona las operaciones CRUD para los lotes de esterilización. Permite la creación de nuevos registros de ciclo, la consulta de lotes existentes con filtros avanzados, la visualización de detalles de un lote específico y la actualización de su estado (por ejemplo, al registrar los resultados de los indicadores).

### `POST` `/api/esterilizacion/lotes`

Crea un nuevo registro de lote de esterilización. Se invoca al iniciar un nuevo ciclo en el autoclave.

**Parámetros:** autoclaveId: string (ID del autoclave), operadorId: string (ID del usuario que realiza la operación), sedeId: string (ID de la clínica), paquetes: array (Lista de paquetes de instrumental incluidos en el lote)

**Respuesta:** JSON con el objeto del nuevo lote creado, incluyendo su ID único.

### `GET` `/api/esterilizacion/lotes`

Obtiene una lista paginada y filtrada de los lotes de esterilización. Permite realizar búsquedas por rango de fechas, autoclave, estado, etc.

**Parámetros:** fechaDesde?: string, fechaHasta?: string, autoclaveId?: string, estado?: string ('en_proceso', 'validado', 'fallido'), page?: number, limit?: number

**Respuesta:** JSON con un array de objetos de lote y metadatos de paginación.

### `GET` `/api/esterilizacion/lotes/:id`

Obtiene los detalles completos de un lote de esterilización específico por su ID.

**Parámetros:** id: string (ID del lote)

**Respuesta:** JSON con el objeto completo del lote, incluyendo datos populados del autoclave y operador.

### `PUT` `/api/esterilizacion/lotes/:id`

Actualiza un lote existente. Se usa principalmente para registrar los resultados de los indicadores y cambiar el estado del lote a 'validado' o 'fallido'.

**Parámetros:** id: string (ID del lote), fechaFin: Date, parametrosCiclo: object, resultadoIndicadorQuimico: string, resultadoIndicadorBiologico: string, estado: string, notas: string

**Respuesta:** JSON con el objeto del lote actualizado.

## 🗂️ Estructura Backend (MERN)

El backend sigue una arquitectura MVC. El modelo 'LoteEsterilizacion' define el esquema de datos en MongoDB. El 'EsterilizacionController' contiene la lógica de negocio para gestionar los lotes. Las rutas, definidas en el router de Express, mapean los endpoints de la API a las funciones del controlador.

### Models

#### LoteEsterilizacion

loteId: String (único, legible), autoclave: ObjectId (ref a 'Autoclave'), operador: ObjectId (ref a 'Usuario'), sede: ObjectId (ref a 'Sede'), fechaInicio: Date, fechaFin: Date, estado: String ('en_proceso', 'validado', 'fallido'), parametrosCiclo: { temperatura: Number, presion: Number, tiempo: Number }, indicadorQuimico: { tipo: String, resultado: String ('correcto', 'incorrecto') }, indicadorBiologico: { tipo: String, resultado: String ('positivo', 'negativo'), fechaLectura: Date }, paquetes: [{ paqueteId: String, contenido: String, utilizado: Boolean, paciente: ObjectId (ref a 'Paciente') }], notas: String, createdAt: Date, updatedAt: Date

### Controllers

#### EsterilizacionController

- crearLote
- obtenerLotes
- obtenerLotePorId
- actualizarLote
- eliminarLote

### Routes

#### `/api/esterilizacion/lotes`

- POST /
- GET /
- GET /:id
- PUT /:id

## 🔄 Flujos

1. El auxiliar inicia un nuevo ciclo: accede a la página, pulsa 'Nuevo Lote', selecciona el autoclave, añade los paquetes de instrumental (escaneando o manualmente) y guarda para registrar el inicio del lote.
2. El auxiliar finaliza y valida un ciclo: busca el lote 'en proceso', edita el registro, introduce los parámetros finales del ciclo (si no son automáticos), anota el resultado de los indicadores químico y biológico, y cambia el estado a 'Validado' o 'Fallido'.
3. El director realiza una auditoría: accede a la página, utiliza los filtros para buscar todos los lotes 'fallidos' del último mes o para revisar todos los ciclos de un autoclave específico, y exporta el informe.

## 📝 User Stories

- Como Auxiliar de clínica, quiero registrar un nuevo lote de esterilización de forma rápida, seleccionando el autoclave y añadiendo los paquetes de instrumental, para asegurar que cada ciclo quede documentado correctamente desde su inicio.
- Como Asistente, quiero poder actualizar un lote de esterilización una vez finalizado el ciclo para introducir los resultados de los test de indicadores y marcarlo como válido para su uso, garantizando así que solo el material correctamente esterilizado entre en circulación.
- Como Director de clínica, quiero consultar un historial completo y filtrable de todos los lotes de esterilización para poder realizar auditorías de calidad, verificar el cumplimiento de los protocolos y generar informes para inspecciones sanitarias.
- Como responsable de seguridad, quiero que cada lote y cada paquete tengan un identificador único que pueda ser rastreado, para que en caso de un fallo en un lote, pueda identificar rápidamente qué pacientes han sido tratados con material de ese lote.

## ⚙️ Notas Técnicas

- Generación de IDs: El sistema debe generar un identificador único y legible para cada lote (ej: 'SEDE1-AUTOC2-20231027-001') y un ID único para cada paquete (idealmente para ser impreso en etiquetas con código de barras/QR).
- Integración con Autoclaves: Considerar la posibilidad de integración con autoclaves modernos a través de API o puertos de datos para capturar automáticamente los parámetros del ciclo (temperatura, presión, tiempo), minimizando errores de entrada manual.
- Seguridad y Auditoría: Todas las creaciones y modificaciones de los lotes de esterilización deben registrarse en un log de auditoría inmutable. El cambio de estado de un lote, especialmente a 'validado', es una acción crítica que debe quedar registrada con el usuario y la fecha.
- Rendimiento: La colección 'LoteEsterilizacion' puede crecer rápidamente. Es crucial utilizar índices en la base de datos MongoDB sobre los campos de búsqueda comunes (sede, fechaInicio, autoclave, estado) para garantizar consultas rápidas.
- Validación de datos: Implementar validaciones robustas en el backend para asegurar que un lote no pueda ser marcado como 'validado' si falta información crítica como el resultado de los indicadores biológicos.

