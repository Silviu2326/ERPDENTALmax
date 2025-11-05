# Indicadores de Citas

**Categoría:** Análisis y Reportes | **Módulo:** Cuadro de Mandos e Informes

La página 'Indicadores de Citas' es un dashboard analítico fundamental dentro del módulo 'Cuadro de Mandos e Informes'. Su propósito principal es proporcionar una visión clara, concisa y visual de las métricas de rendimiento clave (KPIs) relacionadas con la gestión de citas en la clínica o red de clínicas. A través de gráficos interactivos, tarjetas de resumen y tablas de datos, los usuarios autorizados pueden evaluar la eficiencia operativa, identificar tendencias y tomar decisiones informadas. Los indicadores presentados incluyen la tasa de ocupación de los gabinetes/profesionales, la tasa de inasistencia ('no-show'), el porcentaje de citas confirmadas, el desglose de citas por origen (web, teléfono, presencial), la distribución de citas por tipo (primera visita, revisión, tratamiento específico) y el tiempo promedio de duración de las citas. Esta herramienta es vital para la dirección, ya que permite analizar la efectividad de las campañas de marketing, optimizar la asignación de recursos y personal, y detectar cuellos de botella en la agenda. Para el personal de recepción y call center, facilita el seguimiento de objetivos, como la reducción de inasistencias o el aumento de citas generadas por un canal específico. Funciona como un centro neurálgico de inteligencia de negocio, transformando datos brutos de la agenda en información estratégica para la gestión.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Recepción / Secretaría
- Call Center

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/cuadro-de-mandos-e-informes/`

Esta funcionalidad se encuentra dentro de la feature 'cuadro-de-mandos-e-informes'. La página principal se define en '/pages/IndicadoresCitasPage.tsx'. Esta página importa y organiza varios componentes reutilizables desde '/components/', como gráficos (ej. GraficoTasaOcupacion) y tarjetas de datos (ej. IndicadorCard). Las llamadas al backend para obtener los datos de los indicadores se gestionan a través de funciones definidas en '/apis/indicadoresApi.ts', que se encargan de comunicarse con los endpoints específicos del backend.

### Archivos Frontend

- `/features/cuadro-de-mandos-e-informes/pages/IndicadoresCitasPage.tsx`
- `/features/cuadro-de-mandos-e-informes/components/IndicadorCard.tsx`
- `/features/cuadro-de-mandos-e-informes/components/GraficoTasaOcupacion.tsx`
- `/features/cuadro-de-mandos-e-informes/components/GraficoOrigenCitas.tsx`
- `/features/cuadro-de-mandos-e-informes/components/FiltrosIndicadoresPanel.tsx`
- `/features/cuadro-de-mandos-e-informes/apis/indicadoresApi.ts`

### Componentes React

- IndicadoresCitasPage
- IndicadorCard
- GraficoTasaOcupacion
- GraficoOrigenCitas
- FiltrosIndicadoresPanel
- TablaDetalleInasistencias

## 🔌 APIs Backend

El backend debe proveer una serie de endpoints que realicen cálculos y agregaciones complejas sobre la colección de Citas para generar los KPIs. Estos endpoints deben ser eficientes y permitir un filtrado flexible por rango de fechas, sede(s) y profesional(es) para adaptarse a las necesidades de los distintos roles.

### `GET` `/api/indicadores/citas/resumen`

Obtiene las tarjetas de resumen principales: total de citas, tasa de ocupación, tasa de 'no-show' y porcentaje de citas confirmadas.

**Parámetros:** query.fechaInicio: string (ISO 8601), query.fechaFin: string (ISO 8601), query.sedeId: string (opcional, para filtrar por sede)

**Respuesta:** JSON con los valores de los KPIs: { totalCitas, tasaOcupacion, tasaNoShow, tasaConfirmadas }

### `GET` `/api/indicadores/citas/por-origen`

Devuelve la distribución de citas según su canal de origen para alimentar un gráfico de tarta.

**Parámetros:** query.fechaInicio: string (ISO 8601), query.fechaFin: string (ISO 8601), query.sedeId: string (opcional)

**Respuesta:** Array de objetos: [{ origen: 'web', cantidad: 150 }, { origen: 'telefono', cantidad: 200 }]

### `GET` `/api/indicadores/citas/por-tipo`

Devuelve la distribución de citas según el tipo de cita (primera visita, revisión, etc.).

**Parámetros:** query.fechaInicio: string (ISO 8601), query.fechaFin: string (ISO 8601), query.sedeId: string (opcional)

**Respuesta:** Array de objetos: [{ tipo: 'Primera Visita', cantidad: 120 }, { tipo: 'Revisión', cantidad: 300 }]

### `GET` `/api/indicadores/citas/evolucion-ocupacion`

Proporciona datos de series temporales sobre la tasa de ocupación para un gráfico de líneas.

**Parámetros:** query.fechaInicio: string (ISO 8601), query.fechaFin: string (ISO 8601), query.sedeId: string (opcional), query.intervalo: string ('diario', 'semanal', 'mensual')

**Respuesta:** Array de objetos: [{ fecha: '2023-10-01', tasaOcupacion: 85.5 }, { fecha: '2023-10-02', tasaOcupacion: 92.0 }]

## 🗂️ Estructura Backend (MERN)

La lógica del backend para esta funcionalidad residirá en un controlador dedicado 'IndicadoresController' que utilizará el modelo 'Cita' para realizar consultas de agregación. Las rutas estarán agrupadas bajo '/api/indicadores' para mantener la organización.

### Models

#### Cita

Contiene campos clave para los indicadores: fechaHoraInicio (Date), estado (String: 'programada', 'confirmada', 'realizada', 'cancelada', 'no-show'), sedeId (ObjectId, ref: 'Sede'), profesionalId (ObjectId, ref: 'Usuario'), tipoCita (String), origen (String: 'web', 'telefono', 'presencial', 'referido').

#### Sede

Campos relevantes: _id (ObjectId), nombre (String). Utilizado para filtrar y agrupar indicadores por clínica.

### Controllers

#### IndicadoresController

- getResumenCitas
- getCitasPorOrigen
- getCitasPorTipo
- getEvolucionOcupacion

### Routes

#### `/api/indicadores`

- GET /citas/resumen
- GET /citas/por-origen
- GET /citas/por-tipo
- GET /citas/evolucion-ocupacion

## 🔄 Flujos

1. El Director General accede a la página, selecciona un rango de fechas trimestral y visualiza la tasa de ocupación comparativa entre todas las sedes para evaluar el rendimiento.
2. El responsable de Recepción revisa diariamente el indicador de 'no-show' de la semana anterior para identificar patrones y proponer mejoras en el protocolo de confirmación de citas.
3. Un miembro del Call Center filtra los indicadores por el origen 'campaña-navidad-2023' para generar un informe sobre el ROI de dicha campaña.
4. El usuario interactúa con los filtros (fecha, sede) y los componentes de la página se actualizan en tiempo real para reflejar la nueva selección de datos.

## 📝 User Stories

- Como Director, quiero ver un panel con los indicadores clave de citas (ocupación, no-show, origen) para tomar decisiones estratégicas sobre marketing y gestión de recursos.
- Como jefa de Recepción, quiero poder ver rápidamente la tasa de citas confirmadas de ayer para asegurar que mi equipo está cumpliendo los protocolos de llamada.
- Como agente de Call Center, quiero filtrar las citas por origen para medir cuántas citas se generan a través de nuestras campañas telefónicas.
- Como Director multisede, quiero comparar la tasa de ocupación y de inasistencias entre diferentes clínicas para identificar las de mejor y peor rendimiento.

## ⚙️ Notas Técnicas

- Rendimiento: Es crucial utilizar el Aggregation Pipeline de MongoDB para todos los cálculos. Esto asegura que el procesamiento intensivo de datos se realiza en la base de datos, no en el servidor de aplicaciones, minimizando la latencia. Se deben crear índices compuestos en la colección de Citas, por ejemplo en (sedeId, fechaHoraInicio, estado).
- Seguridad: La API debe implementar una validación de roles estricta. Un Director puede ver datos de todas las sedes, mientras que un recepcionista solo debe poder consultar los datos de su sede asignada. El backend debe verificar que el 'sedeId' proporcionado en la consulta corresponde a las sedes permitidas para el usuario autenticado.
- Caching: Para cuadros de mando que consultan rangos de fechas largos y ya cerrados (ej. el trimestre anterior), se puede implementar una estrategia de caché (ej. con Redis) para almacenar los resultados agregados y servir respuestas instantáneas en consultas posteriores.
- Visualización de Datos: Se recomienda el uso de una librería de gráficos como 'Recharts' o 'Chart.js' en el frontend para crear visualizaciones interactivas y responsivas que funcionen bien en diferentes dispositivos.
- Flexibilidad de Filtros: El panel de filtros debe ser un componente central y robusto, permitiendo la selección de rangos de fechas predefinidos (hoy, ayer, últimos 7 días, mes actual) y personalizados, así como la selección múltiple de sedes para roles de Director.

