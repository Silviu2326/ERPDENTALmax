# Nuevo Proveedor

**Categoría:** Gestión de Recursos | **Módulo:** Gestión de Proveedores y Almacén

La funcionalidad 'Nuevo Proveedor' es un componente esencial dentro del módulo de 'Gestión de Proveedores y Almacén'. Su propósito principal es permitir a los usuarios autorizados, como el personal de compras o los administradores, registrar de manera sistemática y centralizada a todos los proveedores con los que la clínica dental trabaja o planea trabajar. Esta página consiste en un formulario detallado diseñado para capturar toda la información relevante de un proveedor, desde datos básicos como el nombre comercial y la razón social, hasta información fiscal crítica como el CIF/NIF y la dirección fiscal. Además, permite registrar múltiples puntos de contacto, detalles bancarios para la gestión de pagos (IBAN), y asociar al proveedor con categorías específicas de productos (ej. 'Implantes', 'Consumibles de Ortodoncia', 'Equipamiento de Rayos X'). Al centralizar esta información, la clínica garantiza la coherencia y precisión de los datos, lo que es fundamental para el proceso de adquisiciones. Un registro completo y correcto facilita la creación de órdenes de compra, el seguimiento de entregas, la gestión de facturas y la optimización del inventario. Esta funcionalidad es la base para un ciclo de aprovisionamiento eficiente, asegurando que la clínica tenga acceso rápido y fiable a los materiales y equipos necesarios para su operación diaria, manteniendo al mismo tiempo un control financiero y administrativo riguroso.

## 👥 Roles de Acceso

- Compras
- Inventario
- Administrador

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/gestion-proveedores-almacen/`

Esta funcionalidad se encuentra dentro de la feature 'gestion-proveedores-almacen'. La página principal, 'NuevoProveedorPage.tsx', reside en la subcarpeta '/pages'. Esta página utiliza un componente principal, 'ProveedorForm.tsx', ubicado en '/components', que a su vez se compone de sub-componentes más pequeños para cada sección del formulario (ej. 'InformacionGeneralSection.tsx', 'DatosContactoSection.tsx'). La lógica para enviar los datos al backend está encapsulada en la subcarpeta '/apis' a través de funciones como 'createProveedorApi', que manejan las llamadas a los endpoints correspondientes.

### Archivos Frontend

- `/features/gestion-proveedores-almacen/pages/NuevoProveedorPage.tsx`
- `/features/gestion-proveedores-almacen/components/ProveedorForm.tsx`
- `/features/gestion-proveedores-almacen/components/InformacionGeneralSection.tsx`
- `/features/gestion-proveedores-almacen/components/DatosContactoSection.tsx`
- `/features/gestion-proveedores-almacen/components/InformacionFiscalBancariaSection.tsx`
- `/features/gestion-proveedores-almacen/apis/proveedoresApi.ts`

### Componentes React

- ProveedorForm
- InformacionGeneralSection
- DatosContactoSection
- InformacionFiscalBancariaSection
- CategoriasProveedorInput

## 🔌 APIs Backend

Se necesitan dos endpoints principales para esta funcionalidad: uno para crear el nuevo proveedor en la base de datos y otro opcional pero recomendado para verificar en tiempo real si ya existe un proveedor con el mismo identificador fiscal y así evitar duplicados.

### `POST` `/api/proveedores`

Crea un nuevo registro de proveedor con la información proporcionada en el cuerpo de la solicitud.

**Parámetros:** body: { nombreComercial, razonSocial, cifnif, direccion, contactoPrincipal, informacionBancaria, categorias, notas }

**Respuesta:** JSON con el objeto del proveedor recién creado, incluyendo su _id.

### `GET` `/api/proveedores/verificar-cif`

Verifica si un CIF/NIF ya está registrado en la base de datos para prevenir duplicados.

**Parámetros:** query: ?cif=B12345678

**Respuesta:** JSON con un booleano: { existe: true } o { existe: false }.

## 🗂️ Estructura Backend (MERN)

El backend soporta esta funcionalidad con un modelo 'Proveedor' para definir el esquema de datos en MongoDB, un 'ProveedorController' que contiene la lógica para crear y validar proveedores, y un archivo de rutas que expone los endpoints necesarios bajo la ruta base '/api/proveedores'.

### Models

#### Proveedor

nombreComercial: String, razonSocial: String, cifnif: String (único), direccion: { calle: String, ciudad: String, codigoPostal: String, pais: String }, contactoPrincipal: { nombre: String, email: String, telefono: String }, contactosAdicionales: [Object], informacionBancaria: { banco: String, iban: String }, categorias: [String], notas: String, activo: { type: Boolean, default: true }, clinicaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinica' }

### Controllers

#### ProveedorController

- crearProveedor
- verificarCifExistente

### Routes

#### `/api/proveedores`

- POST /
- GET /verificar-cif

## 🔄 Flujos

1. El usuario con rol de 'Compras' o 'Administrador' navega a la sección 'Gestión de Proveedores' y hace clic en 'Añadir Nuevo Proveedor'.
2. Se muestra el formulario de creación de proveedor, dividido en secciones: Información General, Contacto, Información Fiscal y Bancaria, y Categorías.
3. El usuario completa los campos obligatorios, como el nombre comercial y el CIF/NIF.
4. A medida que el usuario introduce el CIF/NIF, el sistema puede realizar una llamada asíncrona al backend para verificar si ya existe y mostrar una advertencia si es el caso.
5. Una vez completado el formulario, el usuario hace clic en el botón 'Guardar Proveedor'.
6. El frontend realiza validaciones de formato (email, IBAN, etc.) antes de enviar la solicitud POST a '/api/proveedores'.
7. El backend valida los datos recibidos, crea el nuevo documento en la colección de Proveedores y devuelve una respuesta 201 (Created) con los datos del nuevo proveedor.
8. El frontend muestra un mensaje de éxito y redirige al usuario al listado de proveedores o a la ficha de detalle del proveedor recién creado.

## 📝 User Stories

- Como responsable de compras, quiero registrar un nuevo proveedor con todos sus datos de contacto, fiscales y bancarios para poder gestionar órdenes de compra y pagos de forma centralizada.
- Como administrador, quiero que el sistema me avise si intento crear un proveedor con un CIF/NIF que ya existe para mantener la base de datos limpia y sin duplicados.
- Como encargado de almacén, quiero poder asignar categorías (ej. 'endodoncia', 'prótesis') a un nuevo proveedor para saber rápidamente qué tipo de productos suministra cada uno.

## ⚙️ Notas Técnicas

- Validación de Datos: Implementar validación estricta tanto en el frontend (con bibliotecas como Zod o Yup) como en el backend para campos críticos como CIF/NIF e IBAN, asegurando que cumplan con los formatos estándar.
- Seguridad: Proteger los endpoints con middleware de autenticación (JWT) y autorización basado en roles para garantizar que solo usuarios autorizados puedan crear proveedores.
- Optimización de Base de Datos: Crear un índice único en el campo 'cifnif' del modelo 'Proveedor' en MongoDB para optimizar las búsquedas de duplicados y garantizar la unicidad a nivel de base de datos.
- Experiencia de Usuario (UX): El formulario debe ser intuitivo y estar dividido en secciones lógicas (p. ej., utilizando un componente de Acordeón o Pestañas). Considerar la integración con APIs externas para autocompletar direcciones y mejorar la precisión.
- Multi-tenancy: El esquema del Proveedor debe incluir un campo 'clinicaId' para asociar cada proveedor con la clínica correspondiente, asegurando el aislamiento de datos en un entorno multi-clínica.

