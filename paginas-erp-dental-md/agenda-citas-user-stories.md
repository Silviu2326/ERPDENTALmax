# User Stories Pendientes — Agenda de Citas y Programación

Este backlog recoge únicamente historias **no implementadas aún** que afectan directamente a la página `Agenda de Citas y ProgramaciónPage.tsx`. Se basan en las brechas detectadas entre la implementación actual (mock data, vistas día/semana/mes, filtros básicos y estadísticas) y las mejoras deseadas descritas en `gestiondecitas.md`.

## Convenciones

- Identificador `US-X.XX`.
- Roles centrados en uso de la agenda (`Recepcionista`, `Coordinador/a`, `Profesional`, `Administrador/a`).
- Acceptance Criteria (`AC`) en formato breve Gherkin.
- Solo se incluyen funcionalidades nuevas a desarrollar dentro de esta página (sin abarcar otros módulos).

---

## Épica 1 · Navegación Dinámica y Configuración de Vista

**Objetivo:** Extender la flexibilidad de visualización del calendario más allá de las vistas actuales.

- **US-1.01 · Mini calendario lateral**
  - Como `Recepcionista` quiero un mini calendario mensual en la misma página para saltar a cualquier semana con un clic.
  - AC:
    1. Dado que estoy en la agenda, cuando despliego el mini calendario, entonces puedo seleccionar un día.
    2. Cuando selecciono una fecha, entonces los filtros principales se actualizan al rango correspondiente y la vista cambia automáticamente a semana o día según configuración.

- **US-1.02 · Selección de número de días visibles**
  - Como `Coordinador/a` quiero elegir cuántos días se muestran simultáneamente (1, 3, 5, 7) sin abandonar la página.
  - AC:
    1. Dado que abro el selector “Días visibles”, cuando elijo `3`, entonces la cuadrícula muestra tres columnas consecutivas.
    2. Dado que selecciono `1`, cuando aplico, entonces se activa modo de vista diaria con la misma interfaz principal.

- **US-1.03 · Agrupación por profesional o por box**
  - Como `Coordinador/a` quiero alternar la agrupación de columnas entre profesionales y salas/box para equilibrar recursos.
  - AC:
    1. Dado que selecciono la opción “Profesional”, cuando se renderiza la vista, entonces cada columna representa un profesional con su color.
    2. Dado que selecciono “Box/Sala”, cuando se actualiza, entonces cada columna representa un box con disponibilidad.

- **US-1.04 · Ajuste de escala temporal**
  - Como `Recepcionista` quiero ajustar el intervalo de tiempo (10, 15, 30 minutos) y el rango horario visible (ej. 07:00-15:00) desde la propia agenda.
  - AC:
    1. Dado que selecciono intervalo 15 minutos, cuando se recalcula, entonces los slots de la cuadrícula adoptan ese paso.
    2. Dado que configuro un rango horario limitado, cuando aplico, entonces las horas fuera de rango se ocultan sin romper la cuadrícula.

---

## Épica 2 · Gestión Visual de Citas

**Objetivo:** Permitir reprogramaciones y ajustes directos en la cuadrícula sin pasar siempre por formularios.

- **US-2.01 · Drag & drop intra-profesional**
  - Como `Recepcionista` quiero arrastrar una cita a otro horario del mismo profesional dentro de la vista para reprogramarla rápidamente.
  - AC:
    1. Dado que arrastro una cita, cuando la suelto en un slot libre del mismo profesional, entonces la cita actualiza su hora inicio/fin y el backend guarda el cambio.
    2. Dado que el slot está ocupado o solapa parcialmente, cuando intento soltar, entonces se bloquea la acción y aparece un mensaje.

- **US-2.02 · Drag & drop entre profesionales o boxes**
  - Como `Coordinador/a` quiero arrastrar citas entre columnas de profesionales o boxes autorizados para cubrir ausencias o liberar salas.
  - AC:
    1. Dado que arrastro una cita, cuando la suelto en otro profesional compatible, entonces se reasigna manteniendo historial.
    2. Dado que el profesional destino no admite el tratamiento, cuando suelto, entonces el sistema impide el cambio con mensaje contextual.

- **US-2.03 · Redimensionar duración visualmente**
  - Como `Recepcionista` quiero ajustar la duración de la cita arrastrando el borde inferior del bloque.
  - AC:
    1. Dado que tomo el borde de una cita, cuando lo arrastro hacia abajo, entonces la duración aumenta siguiendo el intervalo configurado.
    2. Dado que intento reducir por debajo de la duración mínima del tratamiento, cuando suelto, entonces se mantiene la duración original y aparece aviso.

---

## Épica 3 · Listas Auxiliares y Bandejas de Trabajo

**Objetivo:** Gestionar flujos especiales (urgencias, lista de espera, solicitudes online) directamente desde la página.

- **US-3.01 · Panel de citas sin hora**
  - Como `Recepcionista` quiero ver un panel lateral con citas pendientes de asignar para arrastrarlas al calendario principal.
  - AC:
    1. Dado que abro la agenda, cuando hay registros sin horario, entonces aparecen listados en el panel.
    2. Cuando arrastro uno de esos ítems a un slot libre, entonces la cita se programa y desaparece del panel.

- **US-3.02 · Bandeja de urgencias**
  - Como `Recepcionista` quiero un apartado visible de citas urgentes para priorizarlas.
  - AC:
    1. Dado que existe una cita marcada como urgente (flag en datos), cuando cargo la agenda, entonces se muestra en la bandeja y aparece resaltada en la cuadrícula.
    2. Dado que marco una cita como urgente desde el modal, cuando guardo, entonces se mueve automáticamente a la bandeja.

- **US-3.03 · Lista de espera inteligente**
  - Como `Recepcionista` quiero gestionar pacientes en lista de espera y recibir sugerencias cuando se libera un hueco.
  - AC:
    1. Dado que hay pacientes en lista, cuando una cita se cancela, entonces el sistema sugiere huecos compatibles para reasignarlos.
    2. Dado que acepto la sugerencia, cuando confirmo, entonces la cita se programa y se registra como proveniente de lista de espera.

- **US-3.04 · Bandeja de solicitudes online**
  - Como `Recepcionista` quiero revisar y aprobar citas solicitadas online sin salir de la agenda.
  - AC:
    1. Dado que llega una solicitud, cuando la reviso en la bandeja, entonces puedo aceptarla, proponer otro horario o rechazarla con comentarios.
    2. Dado que la acepto, cuando confirmo, entonces la cita aparece en el calendario con estado `confirmada pendiente de paciente`.

---

## Épica 4 · Automatizaciones y Comunicación (Foco en la Agenda)

**Objetivo:** Integrar notificaciones y recordatorios accionados desde la propia página de agenda.

- **US-4.01 · Recordatorios automáticos configurables**
  - Como `Coordinador/a` quiero programar recordatorios (SMS/Email) desde la agenda para reducir ausencias.
  - AC:
    1. Dado que abro el panel de configuración, cuando activo recordatorios y defino 24h antes, entonces se agenda el envío automático.
    2. Dado que una cita ya recibió recordatorio, cuando consulto detalles, entonces visualizo el estado del envío.

- **US-4.02 · Confirmación bidireccional del paciente**
  - Como `Recepcionista` quiero que la agenda marque automáticamente si el paciente confirma o cancela desde los recordatorios.
  - AC:
    1. Dado que el paciente responde “Confirmo”, cuando se procesa la respuesta, entonces la cita cambia a `confirmada` y se registra en el historial.
    2. Dado que responde “Cancelar”, cuando se recibe, entonces la cita pasa a `cancelada` y aparece hueco disponible en la cuadrícula.

- **US-4.03 · Notificaciones internas en tiempo real**
  - Como `Profesional` quiero recibir alerta en la agenda cuando se asigna, reprograma o cancela una cita mía.
  - AC:
    1. Dado que se modifica una cita, cuando es para mi usuario, entonces aparece badge o toast en la misma página.
    2. Dado que abro la alerta, cuando hago clic, entonces se resalta la cita pertinente en la cuadrícula.

---

## Épica 5 · Enriquecimiento de Datos y Auditoría dentro de la Agenda

**Objetivo:** Mejorar la información operativa disponible directamente en la página.

- **US-5.01 · Indicadores visuales de perfil del paciente**
  - Como `Recepcionista` quiero ver badges en los bloques de cita para distinguir VIP, ansiedad, movilidad reducida, etc.
  - AC:
    1. Dado que una cita contiene tags específicos, cuando se renderiza, entonces aparecen íconos o etiquetas visibles en el bloque.

- **US-5.02 · Adjuntos rápidos vinculados a la cita**
  - Como `Profesional` quiero adjuntar o consultar documentos relevantes desde la agenda.
  - AC:
    1. Dado que abro el modal de la cita, cuando subo un archivo, entonces se guarda y se muestra un enlace para abrirlo.
    2. Dado que un archivo supera tamaño permitido, cuando intento subirlo, entonces aparece error sin cerrar el modal.

- **US-5.03 · Historial enriquecido y filtrable**
  - Como `Administrador/a` quiero filtrar el historial de cambios de una cita desde la agenda (por tipo de evento).
  - AC:
    1. Dado que abro “Ver historial”, cuando selecciono filtro “Reprogramaciones”, entonces solo veo eventos de cambio de fecha/hora.
    2. Dado que exporto historial, cuando confirmo, entonces obtengo archivo con detalles (fecha, usuario, acción, origen).

---

## Épica 6 · Analítica Operativa In Situ

**Objetivo:** Ampliar métricas dentro de la propia página sin depender de otros módulos.

- **US-6.01 · Heatmap por hora y día**
  - Como `Coordinador/a` quiero visualizar un heatmap que resuma intensidad de citas por hora y día dentro del rango actual.
  - AC:
    1. Dado que cargo la página, cuando activo el panel “Heatmap”, entonces veo matriz coloreada según volumen.
    2. Dado que modifico filtros de profesional/sede, cuando se aplican, entonces el heatmap se actualiza en tiempo real.

- **US-6.02 · KPIs configurables**
  - Como `Administrador/a` quiero elegir qué KPIs se muestran en el panel superior (ej. tasa cancelación, duración media por especialidad).
  - AC:
    1. Dado que abro configuración de KPIs, cuando activo/desactivo métricas, entonces el panel refleja la selección sin recargar la página.

- **US-6.03 · Exportar rango filtrado**
  - Como `Coordinador/a` quiero exportar las citas visibles (con filtros aplicados) directamente desde la agenda.
  - AC:
    1. Dado que pulso “Exportar”, cuando confirmo, entonces descargo CSV/Excel con columnas adaptadas a los filtros actuales.

---

## Épica 7 · Rendimiento y Operatividad

**Objetivo:** Garantizar que la página maneje grandes volúmenes y continúe operativa ante incidencias.

- **US-7.01 · Virtualización de slots y citas**
  - Como `Administrador/a` quiero que la agenda siga siendo fluida con cientos de citas simultáneas mediante virtualización o paginación vertical.
  - AC:
    1. Dado que hay más de 200 citas en el rango, cuando hago scroll, entonces los slots se cargan bajo demanda sin cortes visuales.

- **US-7.02 · Indicador de sincronización**
  - Como `Recepcionista` quiero saber si la lista de citas está sincronizada con el backend, especialmente después de ediciones.
  - AC:
    1. Dado que se envía un cambio, cuando aún no se confirma, entonces aparece badge “Sincronizando...”.
    2. Dado que hay error de sincronización, cuando ocurre, entonces aparece aviso y opción de reintentar desde la misma página.

- **US-7.03 · Modo lectura offline**
  - Como `Recepcionista` quiero seguir consultando la agenda si pierdo conexión momentánea.
  - AC:
    1. Dado que la conexión cae, cuando la agenda detecta offline, entonces permite consultar el rango cacheado con indicador visible.
    2. Dado que regresa la conexión, cuando se restablece, entonces los datos se refrescan automáticamente y se cierra el aviso.

---

## Próximos pasos sugeridos

1. Priorizar las épicas con los equipos de recepción y coordinación (impacto operativo vs. esfuerzo).
2. Definir dependencias técnicas (p.ej. API para drag & drop, colas de notificaciones).
3. Vincular cada historia con criterios de prueba y tareas de diseño/UX específicas.
4. Estimar esfuerzo y planificar releases incrementales concentrados solo en la página `Agenda de Citas y ProgramaciónPage.tsx`.


