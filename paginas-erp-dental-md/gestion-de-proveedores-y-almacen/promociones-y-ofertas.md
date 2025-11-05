# Promociones y Ofertas

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad de 'Promociones y Ofertas' es una herramienta estratégica diseñada para que las clínicas dentales impulsen sus servicios, aumenten la captación de nuevos pacientes y fomenten la lealtad de los existentes. Aunque su principal objetivo es de marketing y ventas, su integración dentro del módulo 'Gestión de Proveedores y Almacén' es deliberada y potente. Permite a la clínica crear ofertas vinculadas directamente a los recursos del almacén, como kits de blanqueamiento de una marca específica, implantes de un proveedor con el que se ha conseguido un buen acuerdo, o cualquier otro material consumible. De esta forma, no solo se gestionan las campañas de marketing, sino que también se optimiza la rotación de inventario, se da salida a productos con fechas de caducidad próximas o se aprovechan las compras por volumen a proveedores. El sistema permite definir promociones de diversos tipos: descuentos porcentuales, montos fijos, 2x1 en servicios, o paquetes de tratamientos. Cada promoción puede ser configurada con condiciones específicas, como aplicabilidad solo para nuevos pacientes, validez en un rango de fechas concreto, un número máximo de usos o la necesidad de un código promocional. Para los roles de Marketing, es el centro de control de campañas; para Recepción, es una herramienta clave en el punto de cobro para aplicar descuentos de forma controlada y precisa, mejorando la experiencia del paciente y asegurando que la facturación refleje correctamente las ofertas vigentes.

## 👥 Roles de Acceso

- Marketing / CRM
- Recepción / Secretaría

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Esta funcionalidad reside dentro de la carpeta del módulo padre 'gestion-proveedores-almacen'. La subcarpeta '/pages/' contiene el componente principal 'PromocionesOfertasPage.tsx' que renderiza la interfaz de gestión. Los componentes reutilizables como el formulario de creación/edición ('FormularioPromocion.tsx') o la lista de promociones ('ListaPromociones.tsx') se ubican en '/components/'. La lógica para comunicarse con el backend se encapsula en funciones dentro de la carpeta '/apis/', por ejemplo, en un archivo 'promocionesApi.ts', que se encarga de realizar las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/PromocionesOfertasPage.tsx`
- `/features/gestion-proveedores-almacen/components/ListaPromociones.tsx`
- `/features/gestion-proveedores-almacen/components/FormularioPromocion.tsx`
- `/features/gestion-proveedores-almacen/components/TarjetaDetallePromocion.tsx`
- `/features/gestion-proveedores-almacen/components/ModalConfirmacionEliminar.tsx`
- `/features/gestion-proveedores-almacen/apis/promocionesApi.ts`

### Componentes React

- PromocionesOfertasPage
- ListaPromociones
- FormularioPromocion
- TarjetaDetallePromocion
- SelectorTratamientosProductos
- FiltrosPromociones

## 🔌 APIs Backend

La API RESTful para 'Promociones y Ofertas' gestiona el ciclo de vida completo de las promociones, desde su creación hasta su aplicación en la facturación.

### `GET` `/api/promociones`

Obtiene una lista de todas las promociones, permitiendo filtrar por estado (activas, inactivas, expiradas) o tipo.

**Parámetros:** query.estado: string (opcional), query.tipo: string (opcional)

**Respuesta:** Array de objetos de Promoción.

### `POST` `/api/promociones`

Crea una nueva promoción en el sistema.

**Parámetros:** body: Objeto con los datos de la nueva promoción.

**Respuesta:** El objeto de la Promoción recién creada.

### `GET` `/api/promociones/:id`

Obtiene los detalles de una promoción específica por su ID.

**Parámetros:** params.id: string (ID de la promoción)

**Respuesta:** Un único objeto de Promoción.

### `PUT` `/api/promociones/:id`

Actualiza una promoción existente.

**Parámetros:** params.id: string (ID de la promoción), body: Objeto con los campos a actualizar.

**Respuesta:** El objeto de la Promoción actualizada.

### `DELETE` `/api/promociones/:id`

Elimina una promoción (o la marca como inactiva/archivada).

**Parámetros:** params.id: string (ID de la promoción)

**Respuesta:** Mensaje de confirmación.

### `GET` `/api/promociones/aplicables`

Busca promociones activas que se pueden aplicar a un conjunto de tratamientos o productos para una factura.

**Parámetros:** query.tratamientos: Array de IDs de tratamientos, query.productos: Array de IDs de productos

**Respuesta:** Array de objetos de Promoción aplicables.

## 🗂️ Estructura Backend (MERN)

El backend utiliza el modelo 'Promocion' para la persistencia en MongoDB. El 'PromocionController' contiene toda la lógica de negocio, y las rutas de Express en 'promocionRoutes' exponen esta lógica a través de la API RESTful.

### Models

#### Promocion

nombre: String, descripcion: String, tipo: Enum['porcentaje', 'fijo'], valor: Number, fechaInicio: Date, fechaFin: Date, codigo: String (opcional, único), condiciones: String, tratamientosAplicables: [ObjectId (ref: 'Tratamiento')], productosAplicables: [ObjectId (ref: 'ProductoAlmacen')], estado: Enum['activa', 'inactiva', 'expirada'], usosMaximos: Number, usosActuales: Number (default: 0)

### Controllers

#### PromocionController

- crearPromocion
- obtenerTodasPromociones
- obtenerPromocionPorId
- actualizarPromocion
- eliminarPromocion
- buscarPromocionesAplicables

### Routes

#### `/api/promociones`

- GET /
- POST /
- GET /aplicables
- GET /:id
- PUT /:id
- DELETE /:id

## 🔄 Flujos

1. El usuario de Marketing accede a la página de 'Promociones y Ofertas', hace clic en 'Crear Nueva', completa el formulario especificando nombre, tipo de descuento (ej: 15%), los tratamientos de 'Odontología General' a los que aplica, establece un rango de fechas y la activa. La nueva promoción aparece en la lista de promociones activas.
2. Un recepcionista está generando la factura para un paciente que se ha hecho una limpieza dental. El sistema detecta que la limpieza está incluida en una promoción activa y sugiere automáticamente aplicarla. El recepcionista confirma, y el descuento se refleja en el total a pagar.
3. El usuario de Marketing revisa el rendimiento de una campaña. Filtra las promociones para ver las 'expiradas' y consulta el campo 'usosActuales' de una promoción específica para saber cuántos pacientes la aprovecharon.

## 📝 User Stories

- Como usuario de Marketing, quiero crear una promoción de un monto fijo de descuento en 'Implantes Dentales' para incentivar este tratamiento de alto valor.
- Como usuario de Marketing, quiero poder desactivar temporalmente una promoción sin tener que borrarla, para poder reactivarla en el futuro.
- Como recepcionista, al momento de cobrar a un paciente, quiero que el sistema me muestre automáticamente las ofertas aplicables a su tratamiento para evitar errores y mejorar el servicio.
- Como recepcionista, quiero poder introducir un código promocional que un paciente me proporciona para aplicar un descuento específico rápidamente.
- Como gerente de la clínica, quiero ver un listado de todas las promociones y su número de usos para evaluar la efectividad de nuestras campañas de marketing.

## ⚙️ Notas Técnicas

- Seguridad: Implementar validación de roles a nivel de API para asegurar que solo los usuarios de 'Marketing / CRM' puedan crear/editar/eliminar promociones, mientras que 'Recepción' solo pueda consultarlas y aplicarlas.
- Integración Crítica: Esta funcionalidad debe estar estrechamente integrada con el módulo de 'Facturación y Cobros' para aplicar los descuentos y con los módulos de 'Gestión de Tratamientos' y 'Gestión de Almacén' para vincular las promociones a items específicos.
- Automatización: Se recomienda un 'cron job' diario en el backend para verificar las promociones cuya 'fechaFin' ha pasado y cambiar su 'estado' a 'expirada' automáticamente.
- Rendimiento: La consulta para buscar promociones aplicables (`/api/promociones/aplicables`) debe estar optimizada con índices en la base de datos en los campos 'estado', 'fechaInicio', 'fechaFin', 'tratamientosAplicables' y 'productosAplicables' para garantizar una respuesta rápida en el punto de cobro.
- Validación de Datos: El backend debe validar rigurosamente todos los datos entrantes, como asegurar que 'fechaFin' sea posterior a 'fechaInicio', que el 'valor' sea numérico y positivo, y que los códigos promocionales sean únicos si se definen.

