# Proyecciones y Forecasting

**Categoría:** Análisis y Reportes | **Módulo:** Analítica Avanzada & Data

La funcionalidad de 'Proyecciones y Forecasting' es una herramienta de inteligencia de negocio avanzada dentro del módulo de 'Analítica Avanzada & Data'. Su objetivo principal es proporcionar a los directivos y gerentes de la clínica dental capacidades predictivas basadas en datos históricos para anticipar tendencias futuras en ingresos, citas, pacientes nuevos y otros indicadores clave de rendimiento (KPIs). Esta funcionalidad utiliza algoritmos de análisis temporal y modelos predictivos para generar proyecciones precisas que ayudan en la planificación estratégica, la toma de decisiones informadas y la optimización de recursos. A través de un dashboard interactivo, los usuarios pueden visualizar proyecciones de ingresos, estimaciones de crecimiento de pacientes, predicciones de demanda de citas, y análisis de tendencias estacionales. Permite filtrar los datos por rangos de fechas históricos, sedes, especialidades o profesionales. El sistema presenta esta información mediante gráficos de líneas que comparan datos históricos con proyecciones, intervalos de confianza, escenarios optimistas y pesimistas, y alertas sobre desviaciones significativas. Esta herramienta es fundamental para la planificación financiera, la gestión de recursos humanos, la optimización de la programación de citas y la evaluación de estrategias de crecimiento.

## 👥 Roles de Acceso

- Director / Admin general (multisede)
- Propietario / Gerente
- Contable / Finanzas

## 📁 Estructura de Feature

### Nombre de Carpeta

`/features/analitica-avanzada-data/`

Esta funcionalidad se encuentra dentro de la feature 'analitica-avanzada-data'. La página principal, 'ProyeccionesYForecastingPage.tsx', reside en la subcarpeta '/pages/'. Esta página importa y organiza diversos componentes React reutilizables desde la subcarpeta '/components/', como filtros, gráficos de proyección, selectores de métricas y visualizaciones de escenarios. La lógica para obtener los datos del backend se encapsula en funciones dentro de la subcarpeta '/apis/', que se encargan de realizar las llamadas a los endpoints de la API RESTful correspondientes.

### Archivos Frontend

- `/features/analitica-avanzada-data/pages/ProyeccionesYForecastingPage.tsx`
- `/features/analitica-avanzada-data/components/FiltrosProyecciones.tsx`
- `/features/analitica-avanzada-data/components/SelectorMetrica.tsx`
- `/features/analitica-avanzada-data/components/GraficoProyeccion.tsx`
- `/features/analitica-avanzada-data/components/IndicadoresProyeccion.tsx`
- `/features/analitica-avanzada-data/components/TablaComparativaEscenarios.tsx`
- `/features/analitica-avanzada-data/components/AlertasDesviaciones.tsx`
- `/features/analitica-avanzada-data/apis/forecastingApi.ts`

### Componentes React

- ProyeccionesYForecastingPage
- FiltrosProyecciones
- SelectorMetrica
- GraficoProyeccion
- IndicadoresProyeccion
- TablaComparativaEscenarios
- AlertasDesviaciones
- IntervaloConfianza
- SelectorHorizonteTemporal

## 🔌 APIs Backend

El backend provee una serie de endpoints RESTful diseñados para entregar datos históricos y proyecciones calculadas mediante modelos predictivos. Estos endpoints utilizan algoritmos de análisis temporal (como ARIMA, regresión lineal, o modelos de machine learning) para generar proyecciones precisas basadas en patrones históricos.

### `GET` `/api/analitica/forecasting/proyeccion`

Obtiene las proyecciones para una métrica específica en un horizonte temporal determinado, basándose en datos históricos y modelos predictivos.

**Parámetros:** query.metrica: string ('ingresos' | 'citas' | 'pacientes-nuevos' | 'tasa-ocupacion'), query.fechaInicio: string (ISO Date, inicio del período histórico), query.fechaFin: string (ISO Date, fin del período histórico), query.horizonte: number (días a proyectar, ej: 30, 90, 180), query.sedeId: string (Opcional), query.profesionalId: string (Opcional), query.especialidad: string (Opcional)

**Respuesta:** JSON con datos históricos y proyecciones: { historico: [{ fecha: string, valor: number }], proyeccion: [{ fecha: string, valor: number, intervaloConfianza: { inferior: number, superior: number } }], metrica: string, precision: number }

### `GET` `/api/analitica/forecasting/escenarios`

Obtiene proyecciones para múltiples escenarios (optimista, realista, pesimista) basándose en diferentes supuestos y variaciones de parámetros.

**Parámetros:** query.metrica: string, query.fechaInicio: string, query.fechaFin: string, query.horizonte: number, query.sedeId: string (Opcional)

**Respuesta:** JSON con escenarios: { optimista: [{ fecha: string, valor: number }], realista: [{ fecha: string, valor: number }], pesimista: [{ fecha: string, valor: number }], metrica: string }

### `GET` `/api/analitica/forecasting/tendencias-estacionales`

Identifica y analiza patrones estacionales en los datos históricos para mejorar la precisión de las proyecciones.

**Parámetros:** query.metrica: string, query.fechaInicio: string, query.fechaFin: string, query.sedeId: string (Opcional)

**Respuesta:** JSON con análisis estacional: { patrones: [{ mes: number, promedio: number, desviacion: number }], estacionalidad: number, tendencia: 'creciente' | 'decreciente' | 'estable' }

### `GET` `/api/analitica/forecasting/precision-modelo`

Obtiene métricas de precisión del modelo predictivo utilizado, incluyendo error medio absoluto (MAE) y error cuadrático medio (RMSE).

**Parámetros:** query.metrica: string, query.fechaInicio: string, query.fechaFin: string

**Respuesta:** JSON con métricas: { mae: number, rmse: number, r2: number, metrica: string }

## 🗂️ Estructura Backend (MERN)

El backend utiliza modelos de machine learning y análisis temporal para generar proyecciones. Un controlador dedicado 'ForecastingController' contiene la lógica de negocio para procesar datos históricos y aplicar algoritmos predictivos. Los modelos 'Factura', 'Cita' y 'Paciente' son las fuentes de datos primarias.

### Models

#### Factura
_id: ObjectId, fecha: Date, total: Number, estado: String, sedeId: ObjectId, profesionalId: ObjectId

#### Cita
_id: ObjectId, fecha: Date, estado: String, pacienteId: ObjectId, tratamientoId: ObjectId, sedeId: ObjectId

#### Paciente
_id: ObjectId, fechaRegistro: Date, sedeId: ObjectId

### Controllers

#### ForecastingController
- generarProyeccion
- generarEscenarios
- analizarTendenciasEstacionales
- calcularPrecisionModelo

### Routes

#### `/api/analitica/forecasting`
- GET /proyeccion
- GET /escenarios
- GET /tendencias-estacionales
- GET /precision-modelo

## 🔄 Flujos

1. El usuario (Director/Gerente) accede a la sección 'Proyecciones y Forecasting' desde el menú de 'Analítica Avanzada & Data'.
2. La página carga por defecto proyecciones de ingresos para los próximos 90 días basadas en los últimos 12 meses de datos históricos.
3. El frontend realiza una petición GET a '/api/analitica/forecasting/proyeccion' con los parámetros por defecto.
4. El backend procesa la solicitud, analiza los datos históricos, aplica el modelo predictivo y devuelve las proyecciones con intervalos de confianza.
5. El componente 'GraficoProyeccion' renderiza un gráfico de líneas que muestra datos históricos y proyecciones futuras con bandas de confianza.
6. El usuario utiliza el componente 'SelectorMetrica' para cambiar entre diferentes métricas (ingresos, citas, pacientes nuevos, etc.).
7. El usuario ajusta el horizonte temporal (30, 90, 180 días) y los filtros (sede, profesional, especialidad).
8. Cada cambio dispara una nueva petición a la API, y el gráfico se actualiza con las nuevas proyecciones.
9. El componente 'TablaComparativaEscenarios' muestra comparaciones entre escenarios optimista, realista y pesimista.
10. El componente 'AlertasDesviaciones' muestra alertas cuando las proyecciones difieren significativamente de los valores reales observados.

## 📝 User Stories

- Como Director de clínica, quiero ver proyecciones de ingresos para los próximos 3 meses para planificar el presupuesto y tomar decisiones estratégicas sobre inversiones y contrataciones.
- Como Gerente, quiero comparar diferentes escenarios (optimista, realista, pesimista) de crecimiento de pacientes para evaluar el impacto de diferentes estrategias de marketing.
- Como Contable, quiero visualizar proyecciones de facturación mensual para preparar informes financieros y gestionar el flujo de caja.
- Como Director de operaciones, quiero ver proyecciones de demanda de citas por especialidad para optimizar la programación y asignación de recursos.
- Como responsable de Marketing, quiero analizar tendencias estacionales para planificar campañas en los períodos de mayor demanda esperada.

## ⚙️ Notas Técnicas

- Modelos Predictivos: El backend debe implementar modelos de análisis temporal robustos. Se recomienda comenzar con modelos simples (promedio móvil, regresión lineal) y evolucionar hacia modelos más sofisticados (ARIMA, Prophet, LSTM) según la disponibilidad de datos históricos.
- Precisión: La precisión de las proyecciones depende de la cantidad y calidad de los datos históricos. Se recomienda un mínimo de 12 meses de datos para proyecciones confiables.
- Intervalos de Confianza: Los intervalos de confianza deben calcularse utilizando métodos estadísticos apropiados (ej. bootstrap, intervalos de predicción basados en errores estándar).
- Rendimiento: Las consultas de agregación y los cálculos de modelos predictivos pueden ser intensivos. Considerar la implementación de caché para resultados de proyecciones y procesamiento asíncrono para cálculos complejos.
- Actualización: Las proyecciones deben actualizarse periódicamente (ej. diariamente) para incorporar nuevos datos históricos y mejorar la precisión.
- Visualización: La librería de gráficos debe soportar visualización de intervalos de confianza, múltiples series de datos y comparación de escenarios.
- Seguridad: El endpoint de la API debe estar protegido por un middleware que verifique el rol del usuario. En un entorno multisede, se debe validar que el 'sedeId' solicitado corresponda a una sede a la que el usuario tiene acceso.



