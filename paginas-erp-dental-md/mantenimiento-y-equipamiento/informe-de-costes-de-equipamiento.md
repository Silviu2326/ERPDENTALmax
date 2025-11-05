# Informe de Costes de Equipamiento

**Categoría:** Gestión de Recursos | **Módulo:** Mantenimiento y Equipamiento

El 'Informe de Costes de Equipamiento' es una funcionalidad analítica crítica dentro del módulo 'Mantenimiento y Equipamiento', diseñada para proporcionar una visión financiera detallada y agregada de todos los activos físicos de la clínica dental. Su propósito principal es permitir a los roles directivos y financieros rastrear, analizar y controlar los gastos asociados al ciclo de vida completo del equipamiento, desde su compra hasta su baja. La página consolida información vital como el coste de adquisición, los gastos acumulados en mantenimientos preventivos y correctivos, reparaciones y el valor de depreciación. Esto es fundamental para la toma de decisiones estratégicas, como la planificación de nuevas inversiones, la decisión de reparar o reemplazar un equipo obsoleto, y la optimización de los presupuestos operativos. Dentro del ERP, esta funcionalidad se nutre de los datos registrados en el inventario de equipos y en los registros de mantenimiento. Por ejemplo, cuando se da de alta un nuevo sillón dental, su coste de adquisición se registra. Posteriormente, cada vez que se realiza un mantenimiento o una reparación y se asocia un coste, este dato se vincula al equipo. El informe agrega todos estos costes en un panel interactivo, permitiendo a los usuarios filtrar por rangos de fechas, por sede (en un entorno multiclínica), por categoría de equipo (radiología, esterilización, etc.) o incluso por equipo individual. El resultado es una herramienta poderosa para la gestión financiera, el control de activos y la planificación a largo plazo, transformando datos operativos en inteligencia de negocio accionable.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/mantenimiento-equipamiento/`

La funcionalidad completa del módulo 'Mantenimiento y Equipamiento' se encuentra en la carpeta '/features/mantenimiento-equipamiento/'. Esta página específica se construye utilizando componentes de la subcarpeta '/components/', como filtros de fecha, tablas de datos y gráficos. La lógica de la página principal reside en '/pages/'. Las llamadas al backend para obtener los datos del informe se gestionan a través de funciones definidas en '/apis/'.

### Archivos Frontend

- `/features/mantenimiento-equipamiento/pages/InformeCostesEquipamientoPage.tsx`
- `/features/mantenimiento-equipamiento/components/FiltrosInformeCostes.tsx`
- `/features/mantenimiento-equipamiento/components/TablaCostesEquipamiento.tsx`
- `/features/mantenimiento-equipamiento/components/GraficoCostesPorCategoria.tsx`
- `/features/mantenimiento-equipamiento/apis/informesEquipamientoApi.ts`

### Componentes React

- InformeCostesEquipamientoPage
- FiltrosInformeCostes
- TablaCostesEquipamiento
- GraficoCostesPorCategoria
- ResumenTotalCostes
- BotonExportarInforme

## 🔌 APIs Backend

La API principal para esta página es un endpoint que realiza una consulta de agregación compleja en la base de datos para recopilar y procesar todos los costes relacionados con el equipamiento según los filtros proporcionados por el usuario.

### `GET` `/api/equipamiento/informes/costes`

Obtiene los datos agregados para el informe de costes de equipamiento, permitiendo filtrar por rango de fechas, sede(s) y categoría de equipo.

**Parámetros:** fechaInicio (query, string, formato YYYY-MM-DD), fechaFin (query, string, formato YYYY-MM-DD), sedes (query, string, IDs de sedes separadas por comas), categoria (query, string, ID de la categoría de equipo)

**Respuesta:** Un objeto JSON con dos claves principales: 'resumen' (con totales de adquisición, mantenimiento y coste general) y 'desglose' (un array de objetos, donde cada objeto representa un equipo con sus costes desglosados).

## 🗂️ Estructura Backend (MERN)

La estructura del backend para esta funcionalidad se centra en un controlador específico para informes que contiene la lógica de negocio para las agregaciones. Este controlador utiliza los modelos 'Equipo' y 'Mantenimiento' para consultar la base de datos. La ruta está definida en el archivo de rutas de equipamiento y está protegida para asegurar que solo los roles autorizados puedan acceder.

### Models

#### Equipo

nombre: String, categoria: ObjectId, sede: ObjectId, fechaAdquisicion: Date, costoAdquisicion: Number, proveedor: String, estado: String, fechaBaja: Date, valorResidual: Number

#### Mantenimiento

equipo: ObjectId, tipo: String ('preventivo', 'correctivo'), fecha: Date, descripcion: String, costo: Number, proveedorServicio: String

### Controllers

#### InformeEquipamientoController

- generarInformeCostes

### Routes

#### `/api/equipamiento/informes`

- GET /costes

## 🔄 Flujos

1. El usuario (Director/Contable) navega al módulo 'Mantenimiento y Equipamiento' y selecciona 'Informe de Costes'.
2. La página carga, realiza una llamada inicial a la API para obtener los datos del último mes por defecto y muestra un resumen general, un gráfico de distribución de costes y una tabla detallada.
3. El usuario utiliza el componente de filtros para seleccionar un rango de fechas personalizado y/o filtrar por una o varias sedes.
4. Al hacer clic en 'Aplicar Filtros', se ejecuta una nueva llamada a la API con los nuevos parámetros.
5. El frontend recibe los nuevos datos y actualiza dinámicamente el resumen, el gráfico y la tabla sin necesidad de recargar la página.
6. El usuario revisa los datos y puede hacer clic en el botón 'Exportar' para descargar el informe actual en formato PDF o CSV.

## 📝 User Stories

- Como Director, quiero generar un informe de costes de equipamiento por sede y por período para evaluar la rentabilidad de mis inversiones y planificar futuras compras.
- Como Contable, quiero ver un desglose detallado de los costes de adquisición versus los costes de mantenimiento para calcular la depreciación de los activos y preparar los informes financieros.
- Como Admin general (multisede), quiero comparar los costes de equipamiento entre diferentes clínicas para identificar patrones, optimizar compras y estandarizar políticas de mantenimiento.
- Como Director, quiero poder exportar el informe de costes en formato PDF para presentarlo en las reuniones de dirección y compartirlo con los stakeholders.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial crear índices en MongoDB sobre los campos 'fechaAdquisicion' y 'sede' en el modelo 'Equipo', y sobre 'fecha' y 'equipo' en el modelo 'Mantenimiento' para acelerar las consultas de agregación, especialmente con grandes volúmenes de datos.
- Seguridad: El endpoint de la API debe estar protegido por un middleware que verifique la autenticación del usuario y su rol. Además, debe implementar una lógica de autorización para asegurar que un usuario solo pueda solicitar datos de las sedes a las que tiene acceso asignado.
- Exportación de Datos: La generación de archivos (PDF/CSV) debe realizarse en el backend para manejar de forma eficiente grandes conjuntos de datos y no sobrecargar el navegador del cliente. Librerías como 'pdfkit' y 'fast-csv' en Node.js son recomendables.
- Visualización de Datos: Utilizar una librería como 'react-chartjs-2' para los gráficos. Asegurarse de que los gráficos sean responsivos y ofrezcan tooltips interactivos para una mejor experiencia de usuario.
- Manejo de Moneda: Almacenar todos los valores monetarios como enteros en la unidad más pequeña (ej. céntimos) para evitar errores de precisión de punto flotante. La conversión y el formato de la moneda deben manejarse en el frontend al mostrar los datos.

