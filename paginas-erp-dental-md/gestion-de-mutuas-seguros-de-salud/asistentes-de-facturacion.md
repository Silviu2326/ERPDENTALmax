# Asistentes de Facturación

**Categoría:** Gestión Financiera | **Módulo:** Gestión de Mutuas/Seguros de Salud

La funcionalidad 'Asistentes de Facturación' es una herramienta interactiva y guiada diseñada para simplificar y automatizar el complejo proceso de facturación a mutuas y compañías de seguros de salud. Dentro del módulo padre 'Gestión de Mutuas/Seguros de Salud', este asistente actúa como un copiloto para el personal administrativo, guiándolos paso a paso desde la selección del paciente y los tratamientos realizados hasta la generación y envío de una factura compatible con los requisitos de la aseguradora. Su propósito principal es reducir drásticamente los errores humanos, minimizar los rechazos de facturas por parte de las mutuas y acelerar el ciclo de cobro. El asistente funciona consolidando información de diferentes módulos del ERP: extrae los datos del paciente y su póliza del módulo de Pacientes, los tratamientos realizados del historial clínico y los precios y códigos específicos de la mutua del módulo de Tarifas. A través de una interfaz de tipo 'wizard' (asistente por pasos), valida la cobertura, calcula los copagos, aplica las tarifas correctas y genera un borrador de factura para su revisión final. Esto asegura que cada factura sea precisa, completa y cumpla con las normativas de cada aseguradora, mejorando la eficiencia operativa y la salud financiera de la clínica dental.

## 👥 Roles de Acceso

- Contable / Finanzas
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-mutuas-seguros/`

La funcionalidad se encuentra dentro de la feature 'gestion-mutuas-seguros'. La carpeta '/pages/' contiene el componente principal de la página 'AsistenteFacturacionPage.tsx' que renderiza la interfaz. La carpeta '/components/' alberga los componentes reutilizables que conforman el asistente, como el wizard principal 'AsistenteFacturacionWizard.tsx' y cada uno de sus pasos ('PasoSeleccionPaciente.tsx', 'PasoVerificacionCobertura.tsx', etc.). Finalmente, la carpeta '/apis/' contiene el archivo 'facturacionMutuaApi.ts' que define las funciones para realizar las llamadas al backend, manteniendo la lógica de comunicación separada de la UI.

### Archivos Frontend

- `/features/gestion-mutuas-seguros/pages/AsistenteFacturacionPage.tsx`
- `/features/gestion-mutuas-seguros/components/AsistenteFacturacion/AsistenteFacturacionWizard.tsx`
- `/features/gestion-mutuas-seguros/components/AsistenteFacturacion/PasoSeleccionPaciente.tsx`
- `/features/gestion-mutuas-seguros/components/AsistenteFacturacion/PasoVerificacionCobertura.tsx`
- `/features/gestion-mutuas-seguros/components/AsistenteFacturacion/PasoGeneracionPrefactura.tsx`
- `/features/gestion-mutuas-seguros/components/AsistenteFacturacion/PasoResumenYEnvio.tsx`
- `/features/gestion-mutuas-seguros/components/AsistenteFacturacion/ListaTratamientosFacturables.tsx`
- `/features/gestion-mutuas-seguros/apis/facturacionMutuaApi.ts`

### Componentes React

- AsistenteFacturacionPage
- AsistenteFacturacionWizard
- PasoSeleccionPaciente
- PasoVerificacionCobertura
- PasoGeneracionPrefactura
- PasoResumenYEnvio
- ListaTratamientosFacturables
- VisorPrefacturaMutua

## 🔌 APIs Backend

Las APIs para el asistente de facturación están diseñadas para proporcionar los datos necesarios en cada paso del proceso, desde la búsqueda de pacientes con seguros hasta la validación de coberturas y la generación final de la factura.

### `GET` `/api/mutuas/asistente/pacientes-con-seguro`

Busca y devuelve una lista de pacientes que tienen una póliza de seguro activa. Permite filtrar por nombre, apellidos o DNI.

**Parámetros:** query: search (string)

**Respuesta:** Array de objetos de pacientes con información básica y de su póliza.

### `GET` `/api/mutuas/asistente/tratamientos-pendientes/:pacienteId`

Obtiene la lista de tratamientos realizados a un paciente que aún no han sido facturados a su mutua.

**Parámetros:** path: pacienteId (string)

**Respuesta:** Array de objetos de tratamientos con detalles y precios.

### `POST` `/api/mutuas/asistente/verificar-cobertura`

Verifica la cobertura de una lista de tratamientos para un paciente específico según su póliza, devolviendo el importe cubierto, el copago y cualquier limitación.

**Parámetros:** body: { pacienteId: string, mutuaId: string, tratamientosIds: string[] }

**Respuesta:** Objeto con los detalles de cobertura para cada tratamiento.

### `POST` `/api/mutuas/asistente/generar-prefactura`

Genera un borrador de la factura (prefactura) con todos los cálculos realizados (total, cubierto por mutua, copago paciente) para su revisión final.

**Parámetros:** body: { pacienteId: string, mutuaId: string, tratamientos: object[] }

**Respuesta:** Objeto JSON representando la prefactura detallada.

### `POST` `/api/mutuas/asistente/confirmar-y-enviar`

Confirma el borrador de la factura, la guarda en la base de datos con estado 'enviada' y realiza las acciones pertinentes (ej. generar PDF, marcar tratamientos como facturados).

**Parámetros:** body: { prefacturaId: string }

**Respuesta:** Objeto de la factura final creada con su nuevo estado.

## 🗂️ Estructura Backend (MERN)

El backend soporta el asistente de facturación con modelos específicos para las facturas de mutuas, controladores que encapsulan la lógica de negocio de cada paso del asistente y rutas dedicadas para exponer esta funcionalidad de forma segura y eficiente.

### Models

#### FacturaMutua

paciente: ObjectId, mutua: ObjectId, tratamientos: [{ tratamiento: ObjectId, codigoMutua: String, descripcion: String, precio: Number, importeCubierto: Number, copago: Number }], total: Number, totalCubierto: Number, totalCopago: Number, estado: String ('borrador', 'enviada', 'pagada', 'rechazada', 'pagada_parcialmente'), fechaEmision: Date, fechaEnvio: Date, notas: String

#### Paciente

nombre: String, apellidos: String, polizas: [{ mutua: ObjectId, numeroPoliza: String, fechaValidez: Date, condicionesEspeciales: String }]

#### Mutua

nombreComercial: String, razonSocial: String, cif: String, datosContacto: Object, baremos: [{ codigoInterno: String, codigoMutua: String, descripcion: String, tarifa: Number }]

### Controllers

#### AsistenteFacturacionController

- buscarPacientesConSeguro
- obtenerTratamientosPendientes
- verificarCobertura
- generarPrefacturaMutua
- confirmarFacturaMutua

### Routes

#### `/api/mutuas/asistente`

- GET /pacientes-con-seguro
- GET /tratamientos-pendientes/:pacienteId
- POST /verificar-cobertura
- POST /generar-prefactura
- POST /confirmar-y-enviar

## 🔄 Flujos

1. El usuario (Recepción/Contable) inicia el 'Asistente de Facturación'.
2. Paso 1: El usuario busca y selecciona al paciente. El sistema muestra los detalles de su póliza activa.
3. Paso 2: El sistema carga automáticamente los tratamientos del paciente pendientes de facturar a la mutua. El usuario selecciona los que desea incluir en la factura actual.
4. Paso 3: El sistema se comunica con el backend para verificar la cobertura de cada tratamiento seleccionado, mostrando en pantalla el desglose de lo que cubre la mutua y el copago del paciente.
5. Paso 4: El sistema genera una prefactura con todos los datos y cálculos. El usuario revisa el resumen para asegurar que todo es correcto.
6. Paso 5: El usuario confirma la factura. El sistema la guarda, marca los tratamientos como facturados y la deja lista para su exportación o envío.

## 📝 User Stories

- Como personal de recepción, quiero un asistente guiado para crear facturas a mutuas, para asegurar que no olvido ningún dato y reducir los errores.
- Como contable, quiero que el sistema verifique automáticamente la cobertura de los tratamientos según la póliza del paciente, para generar importes exactos y evitar rechazos.
- Como personal de recepción, quiero que el asistente me muestre claramente el importe que debe abonar el paciente (copago) y el que cubrirá la mutua, para poder informar al paciente de forma precisa.
- Como contable, quiero poder revisar un borrador completo de la factura antes de enviarla formalmente a la aseguradora, para poder hacer una última validación.

## ⚙️ Notas Técnicas

- Seguridad: Implementar RBAC (Role-Based Access Control) estricto para que solo los roles autorizados puedan acceder y gestionar la facturación. Todos los datos financieros y de pacientes deben ser encriptados en tránsito (HTTPS/TLS) y en reposo.
- Rendimiento: Optimizar las consultas a la base de datos para la búsqueda de pacientes y la verificación de coberturas, utilizando índices en MongoDB sobre campos como `pacienteId`, `mutuaId` y `estado` de la factura.
- Gestión de Estado Frontend: Utilizar una librería de gestión de estado como Redux Toolkit o Zustand para manejar la información a través de los diferentes pasos del wizard del asistente, manteniendo una única fuente de verdad para los datos de la factura en proceso.
- Validación: Implementar validaciones tanto en el frontend (para una experiencia de usuario fluida) como en el backend (para garantizar la integridad de los datos) en cada paso del asistente.
- Atomicidad: Las operaciones de confirmación de factura deben ser atómicas. Utilizar transacciones de MongoDB para asegurar que la creación de la factura y la actualización del estado de los tratamientos se completen con éxito o no se realice ninguna acción.

