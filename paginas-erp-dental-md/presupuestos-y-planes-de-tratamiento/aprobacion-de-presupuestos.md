# Aprobación de Presupuestos

**Categoría:** Gestión Clínica | **Módulo:** Presupuestos y Planes de Tratamiento

La funcionalidad de 'Aprobación de Presupuestos' es un componente crítico dentro del módulo 'Presupuestos y Planes de Tratamiento' del ERP dental. Sirve como el puente formal entre la planificación clínica y el compromiso financiero del paciente. Una vez que el odontólogo ha diagnosticado y creado un plan de tratamiento con sus respectivos costes, este se presenta al paciente como un presupuesto. Esta página específica gestiona el momento crucial de la aceptación. Su propósito principal es documentar y registrar de manera fehaciente el consentimiento informado y la aceptación económica del paciente sobre el tratamiento propuesto. El flujo de trabajo implica cargar un presupuesto en estado 'Presentado', mostrarlo de forma clara y detallada al paciente (incluyendo tratamientos, precios unitarios, descuentos y total), ofrecer distintas modalidades de pago preconfiguradas en el sistema, y capturar la firma del paciente, ya sea de forma digital en un dispositivo táctil (tablet, monitor) o mediante la subida de un documento escaneado. Al confirmar la aprobación, el sistema cambia el estado del presupuesto a 'Aprobado', sella la fecha y hora, y almacena la firma. Esto desbloquea los siguientes pasos en el flujo de la clínica: los tratamientos aprobados ahora pueden ser agendados en el módulo de citas y se generan los correspondientes planes de pago o cargos en el módulo de facturación. Es una herramienta esencial para la seguridad jurídica de la clínica y la transparencia con el paciente.

## 👥 Roles de Acceso

- Odontólogo
- Recepción / Secretaría
- Director / Admin general (multisede)

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/presupuestos-planes-tratamiento/`

Esta funcionalidad se encuentra dentro de la feature 'presupuestos-planes-tratamiento'. La página principal, 'AprobacionPresupuestoPage.tsx', reside en la subcarpeta '/pages' y se accede a ella típicamente a través de una ruta dinámica como '/presupuestos/:id/aprobar'. Los componentes reutilizables específicos para esta vista, como el visor de detalles del presupuesto, el lienzo para la firma digital y el selector de planes de pago, están en '/components'. La lógica para comunicarse con el backend, como obtener los detalles del presupuesto y enviar la aprobación, se abstrae en funciones dentro de un archivo en '/apis/presupuestosApi.ts'.

### Archivos Frontend

- `/features/presupuestos-planes-tratamiento/pages/AprobacionPresupuestoPage.tsx`
- `/features/presupuestos-planes-tratamiento/components/DetallePresupuestoLectura.tsx`
- `/features/presupuestos-planes-tratamiento/components/CanvasFirmaDigital.tsx`
- `/features/presupuestos-planes-tratamiento/components/SelectorPlanPago.tsx`
- `/features/presupuestos-planes-tratamiento/components/ModalConfirmarAprobacion.tsx`
- `/features/presupuestos-planes-tratamiento/apis/presupuestosApi.ts`

### Componentes React

- AprobacionPresupuestoPage
- DetallePresupuestoLectura
- CanvasFirmaDigital
- SelectorPlanPago
- ModalConfirmarAprobacion

## 🔌 APIs Backend

Las APIs para esta funcionalidad se centran en obtener la información completa de un presupuesto específico y en actualizar su estado a 'Aprobado', almacenando la información de la aprobación como la firma y el plan de pago seleccionado.

### `GET` `/api/presupuestos/:id`

Obtiene todos los detalles de un presupuesto específico por su ID, incluyendo los datos del paciente, los tratamientos desglosados y su estado actual.

**Parámetros:** id (string): ID del presupuesto a obtener.

**Respuesta:** Un objeto JSON con la información completa del presupuesto.

### `PUT` `/api/presupuestos/:id/aprobar`

Marca un presupuesto como aprobado. Actualiza su estado, guarda la firma del paciente, la fecha de aprobación y el plan de pago seleccionado.

**Parámetros:** id (string): ID del presupuesto a aprobar., Body (JSON): { firmaPaciente: string (Base64), planPagoId: string, notas: string (opcional) }

**Respuesta:** El objeto JSON del presupuesto actualizado.

### `GET` `/api/planes-pago`

Obtiene una lista de todos los planes de pago disponibles y activos en la clínica para ser ofrecidos al paciente.

**Respuesta:** Un array de objetos JSON, cada uno representando un plan de pago.

## 🗂️ Estructura Backend (MERN)

El backend soporta la lógica de negocio de la aprobación de presupuestos. El modelo 'Presupuesto' en MongoDB contiene un campo de estado y campos para almacenar la firma y la fecha de aprobación. El 'PresupuestoController' contiene la función 'aprobarPresupuesto' que maneja la validación y la actualización atómica del documento. Las rutas en Express exponen estos controladores a través de endpoints RESTful.

### Models

#### Presupuesto

paciente: ObjectId (ref: 'Paciente'), odontologo: ObjectId (ref: 'Usuario'), clinica: ObjectId (ref: 'Clinica'), tratamientos: [{ tratamiento: ObjectId (ref: 'TratamientoCatalogo'), pieza: String, cara: String, precio: Number, descuento: Number }], total: Number, totalFinal: Number, estado: String (enum: ['Borrador', 'Presentado', 'Aprobado', 'Rechazado', 'Finalizado']), fechaCreacion: Date, fechaAprobacion: Date, firmaPaciente: String, planPago: ObjectId (ref: 'PlanPago'), notasAprobacion: String

#### PlanPago

nombre: String, descripcion: String, numeroCuotas: Number, interes: Number, activo: Boolean

### Controllers

#### PresupuestoController

- obtenerPresupuestoPorId
- aprobarPresupuesto

#### PlanPagoController

- listarPlanesPagoActivos

### Routes

#### `/api/presupuestos`

- GET /:id
- PUT /:id/aprobar

#### `/api/planes-pago`

- GET /

## 🔄 Flujos

1. El usuario (recepcionista u odontólogo) localiza al paciente y accede a su lista de presupuestos pendientes.
2. Se selecciona un presupuesto con estado 'Presentado' y se navega a la página de aprobación.
3. El sistema carga y muestra los detalles completos del presupuesto, junto con los planes de pago disponibles.
4. El usuario presenta el presupuesto al paciente en pantalla. El paciente da su conformidad.
5. Se selecciona el plan de pago acordado en la interfaz.
6. El paciente firma en el área designada en la pantalla (usando un canvas HTML) o se adjunta una imagen de la firma.
7. El usuario presiona el botón 'Aprobar Presupuesto'. El sistema muestra un modal de confirmación.
8. Al confirmar, el frontend envía la firma (en formato Base64) y el ID del plan de pago al backend.
9. El backend valida los datos, actualiza el estado del presupuesto a 'Aprobado', guarda la firma, la fecha actual y la referencia al plan de pago.
10. El sistema actualiza la vista, mostrando el presupuesto como 'Aprobado' y ofrece opciones para imprimir o enviar por correo el documento firmado.

## 📝 User Stories

- Como Recepcionista, quiero presentar un presupuesto en una tablet a un paciente, capturar su firma digital y marcarlo como aprobado para formalizar el acuerdo y poder comenzar a agendar sus citas.
- Como Odontólogo, quiero poder finalizar la presentación de un plan de tratamiento registrando la aceptación del paciente directamente en el sistema para asegurar que hay un consentimiento formal antes de iniciar cualquier procedimiento clínico.
- Como Director de clínica, quiero que todos los presupuestos aprobados tengan un registro digital de la firma y la fecha de aceptación para tener un respaldo legal y financiero de los tratamientos acordados.
- Como Paciente (usuario indirecto), quiero ver claramente el tratamiento que estoy aceptando y su coste, y poder firmar digitalmente para mi comodidad y tener una copia inmediata del acuerdo.

## ⚙️ Notas Técnicas

- Seguridad: La firma del paciente, almacenada como una cadena Base64, debe ser tratada como información sensible. El endpoint de aprobación debe estar protegido y solo accesible para roles autorizados. Considerar el cifrado de datos sensibles en reposo.
- Atomicidad: La operación de aprobar un presupuesto debe ser atómica. Utilizar transacciones de MongoDB para asegurar que la actualización del estado, el guardado de la firma y la vinculación del plan de pago se realicen como una única operación exitosa o fallen en conjunto, evitando estados inconsistentes.
- Firma Digital: Implementar el componente de firma usando una librería como 'react-signature-canvas'. Asegurarse de manejar la optimización de la imagen generada (Base64) para no enviar payloads excesivamente grandes al backend.
- Integración: Una vez aprobado, el sistema debería emitir eventos o webhooks para que otros módulos reaccionen. Por ejemplo, el módulo de 'Facturación' podría generar automáticamente el primer cargo o plan de pagos, y el de 'Agenda' podría habilitar la programación de los tratamientos incluidos en el presupuesto.
- Generación de PDF: Implementar una función para generar un documento PDF del presupuesto aprobado, incluyendo la imagen de la firma. Esto puede hacerse en el backend (con librerías como `pdfkit`) o en el frontend (con `jspdf`), siendo el backend preferible para consistencia y control.

