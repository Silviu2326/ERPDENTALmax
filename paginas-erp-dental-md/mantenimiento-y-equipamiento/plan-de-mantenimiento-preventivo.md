# Plan de Mantenimiento Preventivo

**Categoría:** Gestión de Recursos | **Módulo:** Mantenimiento y Equipamiento

El Plan de Mantenimiento Preventivo es una funcionalidad crítica dentro del módulo de Mantenimiento y Equipamiento, diseñada para que las clínicas dentales gestionen proactivamente la conservación de sus activos. Su objetivo principal es sistematizar y automatizar la programación de revisiones, calibraciones, limpiezas y reparaciones menores de todo el equipamiento dental (sillones, unidades de rayos X, autoclaves, compresores, etc.). Esto previene fallos inesperados que pueden interrumpir las operaciones de la clínica, causar cancelaciones de citas y generar costos de reparación urgentes y elevados. Dentro del ERP, esta funcionalidad permite a los administradores y responsables de inventario crear planes detallados para cada equipo, especificando la frecuencia (diaria, semanal, mensual, anual), las tareas específicas a realizar (ej. 'lubricar turbina', 'verificar presión de compresor'), y asignar responsables. El sistema utiliza esta configuración para generar automáticamente un calendario de tareas y enviar notificaciones a los usuarios asignados cuando una fecha de mantenimiento se aproxima. Además, mantiene un historial o bitácora digital de cada intervención, registrando quién la realizó, la fecha, los costos asociados y cualquier observación relevante. Esta trazabilidad es fundamental no solo para la gestión interna, sino también para cumplir con normativas sanitarias y para tomar decisiones informadas sobre la renovación o reemplazo de equipos basadas en su historial de mantenimiento y costos.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Compras / Inventario

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/mantenimiento-equipamiento/`

La funcionalidad se encapsula dentro de la carpeta del módulo padre '/features/mantenimiento-equipamiento/'. La subcarpeta '/pages/' contendrá el componente principal 'PreventiveMaintenancePlanPage.tsx', que actúa como el dashboard de la funcionalidad. En '/components/', se alojarán componentes reutilizables como 'MaintenancePlanList', 'MaintenancePlanForm' y 'MaintenanceTaskCalendar'. Las llamadas al backend se gestionarán desde '/apis/maintenanceApi.ts', que exportará funciones para interactuar con los endpoints del servidor.

### Archivos Frontend

- `/features/mantenimiento-equipamiento/pages/PreventiveMaintenancePlanPage.tsx`
- `/features/mantenimiento-equipamiento/pages/CreateEditMaintenancePlanPage.tsx`
- `/features/mantenimiento-equipamiento/pages/MaintenancePlanDetailPage.tsx`
- `/features/mantenimiento-equipamiento/components/MaintenancePlanList.tsx`
- `/features/mantenimiento-equipamiento/components/MaintenancePlanForm.tsx`
- `/features/mantenimiento-equipamiento/components/MaintenanceTaskCalendar.tsx`
- `/features/mantenimiento-equipamiento/components/MaintenanceLogTable.tsx`
- `/features/mantenimiento-equipamiento/apis/maintenanceApi.ts`

### Componentes React

- MaintenancePlanList
- MaintenancePlanForm
- MaintenanceTaskCalendar
- MaintenanceLogTable
- UpcomingTasksWidget
- EquipmentSelector

## 🔌 APIs Backend

Las APIs deben soportar la gestión completa (CRUD) de los planes de mantenimiento, el registro de tareas completadas (logs) y la consulta de datos para calendarios e informes. Se conectarán con los modelos de Equipamiento y Usuarios para las referencias.

### `GET` `/api/maintenance-plans`

Obtiene una lista de todos los planes de mantenimiento, con opción de filtrado por equipo, estado o sede.

**Parámetros:** query: equipmentId, query: status ('active', 'inactive'), query: clinicId

**Respuesta:** Array de objetos de MaintenancePlan.

### `POST` `/api/maintenance-plans`

Crea un nuevo plan de mantenimiento preventivo.

**Parámetros:** body: { name, description, equipment, frequencyType, frequencyValue, tasks, assignedTo }

**Respuesta:** El objeto del nuevo MaintenancePlan creado.

### `GET` `/api/maintenance-plans/:id`

Obtiene los detalles de un plan de mantenimiento específico.

**Parámetros:** path: id (del plan)

**Respuesta:** Un objeto de MaintenancePlan.

### `PUT` `/api/maintenance-plans/:id`

Actualiza la información de un plan de mantenimiento existente.

**Parámetros:** path: id (del plan), body: { ...campos a actualizar }

**Respuesta:** El objeto del MaintenancePlan actualizado.

### `DELETE` `/api/maintenance-plans/:id`

Elimina un plan de mantenimiento (o lo marca como inactivo).

**Parámetros:** path: id (del plan)

**Respuesta:** Mensaje de confirmación.

### `GET` `/api/maintenance-plans/:id/logs`

Obtiene el historial de mantenimientos realizados para un plan específico.

**Parámetros:** path: id (del plan)

**Respuesta:** Array de objetos de MaintenanceLog.

### `POST` `/api/maintenance-logs`

Registra la finalización de una tarea de mantenimiento, creando una nueva entrada en la bitácora.

**Parámetros:** body: { maintenancePlan, completionDate, performedBy, notes, cost }

**Respuesta:** El objeto del nuevo MaintenanceLog creado.

## 🗂️ Estructura Backend (MERN)

El backend seguirá la estructura MERN estándar. Se definirán dos modelos principales en MongoDB: 'MaintenancePlan' y 'MaintenanceLog'. Un 'MaintenancePlanController' manejará la lógica de negocio, y las rutas se definirán en un archivo dedicado para exponer los endpoints de la API RESTful.

### Models

#### MaintenancePlan

name: String, description: String, equipment: { type: ObjectId, ref: 'Equipment' }, frequencyType: { type: String, enum: ['DIARIO', 'SEMANAL', 'MENSUAL', 'TRIMESTRAL', 'ANUAL'] }, frequencyValue: Number, nextDueDate: Date, tasks: [String], assignedTo: { type: ObjectId, ref: 'User' }, clinic: { type: ObjectId, ref: 'Clinic' }, isActive: { type: Boolean, default: true }

#### MaintenanceLog

maintenancePlan: { type: ObjectId, ref: 'MaintenancePlan' }, equipment: { type: ObjectId, ref: 'Equipment' }, completionDate: { type: Date, default: Date.now }, performedBy: { type: ObjectId, ref: 'User' }, notes: String, cost: Number

#### Equipment

(Modelo existente en el mismo módulo) name: String, brand: String, model: String, serialNumber: String, purchaseDate: Date, clinic: { type: ObjectId, ref: 'Clinic' }

### Controllers

#### MaintenancePlanController

- getAllPlans
- createPlan
- getPlanById
- updatePlan
- deletePlan
- getPlanLogs

#### MaintenanceLogController

- createLog

### Routes

#### `/api/maintenance-plans`

- GET /
- POST /
- GET /:id
- PUT /:id
- DELETE /:id
- GET /:id/logs

#### `/api/maintenance-logs`

- POST /

## 🔄 Flujos

1. El usuario (Admin/Compras) navega a la sección 'Plan de Mantenimiento Preventivo' y ve un dashboard con los próximos mantenimientos y una lista de todos los planes activos.
2. El usuario hace clic en 'Nuevo Plan', se abre un formulario donde selecciona un equipo del inventario, define la frecuencia, detalla las tareas y asigna un responsable.
3. Al guardar, el sistema calcula la 'próxima fecha de mantenimiento' (nextDueDate) y la guarda en el plan.
4. El sistema, a través de una tarea programada (cron job), revisa diariamente las tareas próximas a vencer y envía notificaciones al responsable.
5. Una vez realizado el mantenimiento, el responsable accede al plan, hace clic en 'Registrar Mantenimiento', completa los detalles (costos, notas) y guarda el registro.
6. Al registrar el mantenimiento, el sistema crea una entrada en 'MaintenanceLog' y recalcula automáticamente la siguiente 'nextDueDate' para el plan, manteniendo el ciclo.
7. El director puede acceder al detalle de un equipo o plan para ver su historial completo de mantenimientos y los costos acumulados para análisis.

## 📝 User Stories

- Como Director, quiero ver un calendario con todas las tareas de mantenimiento programadas para tener una visión general de la carga de trabajo y la disponibilidad de los equipos.
- Como responsable de Compras / Inventario, quiero crear un plan de mantenimiento preventivo para cada equipo crítico, especificando la frecuencia y las tareas recomendadas por el fabricante para asegurar su longevidad y cumplimiento de garantía.
- Como responsable de Compras / Inventario, quiero recibir alertas por correo electrónico o en la app una semana antes de que venza una tarea de mantenimiento para poder coordinarla sin prisas.
- Como Director, quiero generar un informe anual de costos de mantenimiento por equipo para ayudar en la elaboración de presupuestos y en la toma de decisiones sobre la sustitución de equipos antiguos.
- Como responsable de Compras / Inventario, quiero poder adjuntar documentos (facturas, informes técnicos) a cada registro de mantenimiento para tener toda la documentación centralizada.

## ⚙️ Notas Técnicas

- Implementar un sistema de notificaciones en el backend usando un programador de tareas como 'node-cron' para verificar diariamente las fechas de vencimiento y enviar alertas.
- La funcionalidad debe estar fuertemente acoplada con el inventario de equipamiento. El selector de equipos debe obtener los datos en tiempo real de dicho módulo.
- Asegurar la validación de datos en el backend (ej. la frecuencia debe ser un valor lógico, el equipo debe existir).
- Para el rendimiento, la lista principal de planes de mantenimiento debe implementar paginación y filtros del lado del servidor para no sobrecargar el frontend en clínicas con mucho equipamiento.
- Considerar la posibilidad de crear plantillas de planes de mantenimiento para tipos de equipos comunes (ej. 'Plan Estándar para Sillón Dental'), agilizando la creación de nuevos planes.
- El cálculo de la 'nextDueDate' debe ser robusto, manejando correctamente meses de diferentes longitudes y años bisiestos.

