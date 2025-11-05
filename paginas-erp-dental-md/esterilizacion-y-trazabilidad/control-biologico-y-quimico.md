# Control Biológico y Químico

**Categoría:** Calidad y Seguridad | **Módulo:** Esterilización y Trazabilidad

La página 'Control Biológico y Químico' es una funcionalidad crítica dentro del módulo de 'Esterilización y Trazabilidad', diseñada para registrar, gestionar y auditar las pruebas de validación de los ciclos de esterilización en la clínica dental. Los controles biológicos (con esporas) y químicos (indicadores) son el estándar de oro para asegurar que los autoclaves y otros equipos de esterilización están funcionando correctamente y eliminando todos los microorganismos. Esta funcionalidad permite al personal auxiliar registrar cada prueba realizada, asociándola a un equipo específico, un ciclo de esterilización (si aplica) y un lote de indicador. Se puede registrar la fecha, el tipo de control, el resultado (p. ej., 'pendiente', 'positivo', 'negativo'), el lote del indicador y las observaciones pertinentes. Para los controles biológicos, que requieren un período de incubación, el sistema permite registrar el inicio de la prueba y actualizar el resultado final días después. La importancia de esta página radica en su capacidad para proporcionar una trazabilidad completa y una prueba documental irrefutable del cumplimiento de las normativas de bioseguridad. Sirve como un registro centralizado y digital que reemplaza los libros de registro manuales, minimizando errores, facilitando las auditorías internas y externas, y permitiendo la generación de alertas automáticas en caso de un resultado fallido (positivo), lo que desencadena protocolos de seguridad inmediatos.

## 👥 Roles de Acceso

- Auxiliar
- Asistente

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/esterilizacion-trazabilidad/`

Esta funcionalidad se encuentra dentro de la carpeta 'features/esterilizacion-trazabilidad'. La página principal, ControlBiologicoQuimicoPage.tsx, se ubica en la subcarpeta '/pages'. Esta página utiliza componentes específicos de la subcarpeta '/components', como 'FormularioRegistroControl' para la entrada de datos y 'TablaHistorialControles' para mostrar los registros. Las interacciones con el backend se gestionan a través de funciones definidas en '/apis/controlesApi.ts', que se encargan de las llamadas a los endpoints de la API REST.

### Archivos Frontend

- `/features/esterilizacion-trazabilidad/pages/ControlBiologicoQuimicoPage.tsx`
- `/features/esterilizacion-trazabilidad/components/FormularioRegistroControl.tsx`
- `/features/esterilizacion-trazabilidad/components/TablaHistorialControles.tsx`
- `/features/esterilizacion-trazabilidad/components/ModalDetalleControl.tsx`
- `/features/esterilizacion-trazabilidad/apis/controlesApi.ts`

### Componentes React

- ControlBiologicoQuimicoPage
- FormularioRegistroControl
- TablaHistorialControles
- ModalDetalleControl
- FiltrosBusquedaControles

## 🔌 APIs Backend

Las APIs para esta funcionalidad gestionan el ciclo de vida de los registros de control de esterilización. Permiten crear nuevos registros, obtener un historial filtrable, ver detalles de un control específico y actualizar su estado (especialmente importante para los controles biológicos).

### `POST` `/api/controles-esterilizacion`

Registra un nuevo control biológico o químico en el sistema.

**Parámetros:** Body: { tipoControl: 'biologico'|'quimico', fechaRegistro: Date, resultado: 'pendiente'|'positivo'|'negativo', loteIndicador: string, fechaVencimientoIndicador: Date, idEsterilizador: ObjectId, idUsuario: ObjectId, observaciones?: string }

**Respuesta:** El objeto del control recién creado.

### `GET` `/api/controles-esterilizacion`

Obtiene una lista de todos los controles registrados, con opciones de filtrado.

**Parámetros:** Query: ?fechaInicio=YYYY-MM-DD, Query: ?fechaFin=YYYY-MM-DD, Query: ?tipoControl=biologico|quimico, Query: ?resultado=pendiente|positivo|negativo, Query: ?idEsterilizador=ObjectId

**Respuesta:** Un array de objetos de control que coinciden con los filtros.

### `GET` `/api/controles-esterilizacion/:id`

Obtiene los detalles de un registro de control específico por su ID.

**Parámetros:** Path: id (el ID del control)

**Respuesta:** El objeto completo del control solicitado.

### `PUT` `/api/controles-esterilizacion/:id`

Actualiza un registro de control existente, típicamente para cambiar el resultado de 'pendiente' a 'positivo' o 'negativo'.

**Parámetros:** Path: id (el ID del control), Body: { resultado: 'positivo'|'negativo', fechaResultado: Date, observaciones?: string }

**Respuesta:** El objeto del control actualizado.

## 🗂️ Estructura Backend (MERN)

La lógica del backend se apoya en un modelo 'ControlEsterilizacion' para la persistencia en MongoDB. Un 'ControlEsterilizacionController' contiene la lógica de negocio para manejar las operaciones CRUD, y las rutas se exponen a través de Express en un archivo de rutas dedicado.

### Models

#### ControlEsterilizacion

tipoControl: Enum['biologico', 'quimico'], fechaRegistro: Date, resultado: Enum['pendiente', 'positivo', 'negativo', 'fallido'], loteIndicador: String, fechaVencimientoIndicador: Date, fechaResultado: Date, idCicloEsterilizacion: { type: Schema.Types.ObjectId, ref: 'CicloEsterilizacion' }, idEsterilizador: { type: Schema.Types.ObjectId, ref: 'Equipo' }, idUsuarioRegistro: { type: Schema.Types.ObjectId, ref: 'Usuario' }, idUsuarioResultado: { type: Schema.Types.ObjectId, ref: 'Usuario' }, observaciones: String, timestamps: true

### Controllers

#### ControlEsterilizacionController

- registrarControl
- obtenerTodosLosControles
- obtenerControlPorId
- actualizarResultadoControl

### Routes

#### `/api/controles-esterilizacion`

- POST /
- GET /
- GET /:id
- PUT /:id

## 🔄 Flujos

1. El auxiliar realiza una prueba de control en un autoclave.
2. Accede a la página 'Control Biológico y Químico' y hace clic en 'Registrar Nuevo Control'.
3. Rellena el formulario: selecciona el autoclave, el tipo de control, introduce el lote y la fecha de caducidad del indicador, y establece el resultado inicial (ej. 'pendiente' para biológico, o 'negativo' si el químico pasó).
4. El sistema guarda el registro y lo muestra en la tabla de historial con estado 'Pendiente'.
5. Tras el período de incubación, el auxiliar busca el control biológico pendiente en la tabla.
6. Edita el registro y actualiza el campo 'resultado' a 'positivo' o 'negativo' y añade observaciones si es necesario.
7. El sistema actualiza el registro, que ahora se muestra con su resultado final, y dispara una alerta si el resultado es 'positivo'.

## 📝 User Stories

- Como auxiliar de esterilización, quiero registrar el resultado de un control químico diario para cada autoclave, para cumplir con los protocolos de seguridad y tener un registro auditable.
- Como asistente dental, quiero registrar el inicio de una prueba de control biológico, incluyendo el lote del indicador y la fecha, para poder rastrear su estado pendiente.
- Como auxiliar, quiero poder actualizar fácilmente el estado de un control biológico a 'positivo' o 'negativo' después del período de incubación, para validar la eficacia del ciclo de esterilización.
- Como responsable de calidad, quiero filtrar y ver el historial de todos los controles por fecha y por equipo, para preparar informes de auditoría y detectar patrones o fallos recurrentes en los esterilizadores.

## ⚙️ Notas Técnicas

- Seguridad: Es crucial registrar qué usuario ('idUsuario') realiza cada acción (registro y actualización) para mantener una cadena de responsabilidad.
- Alertas: Implementar un sistema de notificaciones (en la app, por email o SMS) que se active automáticamente cuando un control biológico resulte 'positivo', alertando al personal responsable de la clínica.
- Validación de Datos: Validar en frontend y backend que los lotes no estén vacíos y que las fechas de vencimiento de los indicadores no hayan pasado.
- Inmutabilidad del Registro: Considerar que los registros no se puedan eliminar (soft-delete como máximo) para mantener la integridad de los datos de auditoría. Cualquier corrección debe registrarse como una nueva entrada que referencia a la original.
- Integración: El campo 'idEsterilizador' debe ser una referencia a la colección de 'Equipos' del ERP. El campo 'idCicloEsterilizacion' debe enlazar con el registro del ciclo específico que se está validando.

