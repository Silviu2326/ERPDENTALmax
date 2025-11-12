# Componentes Nuevos - Agenda de Citas y Programación

## MiniCalendarPanel

### Descripción
Componente de mini calendario mensual anclado que permite a los recepcionistas saltar rápidamente a cualquier día en la agenda. Al seleccionar una fecha, ajusta automáticamente los filtros, enfoca la semana elegida y registra métricas de uso.

### Ubicación
`/src/features/Agenda de Citas y Programación/components/MiniCalendarPanel.tsx`

### Props
- `fechaActual?: Date` - Fecha actualmente seleccionada (opcional, por defecto: hoy)
- `onDatePicked: (fecha: Date) => void` - Callback que se ejecuta cuando se selecciona una fecha
- `onClose: () => void` - Callback para cerrar el panel

### Características
- Calendario mensual interactivo
- Navegación entre meses (anterior/siguiente)
- Botón "Hoy" para volver rápidamente a la fecha actual
- Resalta el día actual y la fecha seleccionada
- Registra métricas de uso en `localStorage` bajo la clave `agenda_metrics`
- Se cierra automáticamente al hacer clic fuera del panel
- Posicionamiento fijo en la esquina superior derecha

### Uso
```tsx
import MiniCalendarPanel from '../components/MiniCalendarPanel';

const [mostrarMiniCalendario, setMostrarMiniCalendario] = useState(false);

{mostrarMiniCalendario && (
  <MiniCalendarPanel
    fechaActual={fechaInicio}
    onDatePicked={handleDatePicked}
    onClose={() => setMostrarMiniCalendario(false)}
  />
)}
```

### Métricas
El componente registra automáticamente cada selección de fecha en `localStorage` con la siguiente estructura:
```json
{
  "event": "mini_calendar_date_picked",
  "fecha": "2024-01-15T00:00:00.000Z",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "mes": 1,
  "anio": 2024
}
```

Las métricas se mantienen limitadas a las últimas 100 entradas para evitar sobrecargar el almacenamiento local.

### Pruebas
Las pruebas unitarias se encuentran en:
`/src/features/Agenda de Citas y Programación/components/__tests__/MiniCalendarPanel.test.tsx`

---

## DaysRangeSelector

### Descripción
Selector de número de días visibles (1, 3, 5 o 7) incrustado en la toolbar que permite a los coordinadores adaptar la pantalla según sus necesidades. La preferencia se persiste en `localStorage`.

### Ubicación
`/src/features/Agenda de Citas y Programación/components/DaysRangeSelector.tsx`

### Props
- `valorInicial?: number` - Valor inicial de días visibles (opcional)
- `onChange: (dias: number) => void` - Callback que se ejecuta cuando cambia el número de días

### Características
- Opciones: 1, 3, 5 o 7 días
- Persistencia automática en `localStorage` bajo la clave `agenda_visible_days`
- Valor por defecto: 7 días (semana completa)
- Interfaz visual con botones para cada opción
- Tooltips informativos en cada botón

### Uso
```tsx
import DaysRangeSelector from '../components/DaysRangeSelector';

const [diasVisibles, setDiasVisibles] = useState<number>(7);

<DaysRangeSelector
  valorInicial={diasVisibles}
  onChange={handleDiasVisiblesChange}
/>
```

### Persistencia
La preferencia se guarda automáticamente en `localStorage` con la clave `agenda_visible_days`. Si no hay valor guardado, se usa 7 días por defecto.

### Pruebas
Las pruebas unitarias se encuentran en:
`/src/features/Agenda de Citas y Programación/components/__tests__/DaysRangeSelector.test.tsx`

---

## Modificaciones en CalendarioGrid

### Nuevo Prop: `visibleDays`
El componente `CalendarioGrid` ahora acepta un prop opcional `visibleDays` que controla cuántos días se muestran en la vista.

### Valores Aceptados
- `1`: Muestra solo el día actual
- `3`: Muestra día anterior, actual y siguiente (centrado)
- `5`: Muestra 2 días antes, actual y 2 días después (centrado)
- `7`: Muestra la semana completa desde el lunes (por defecto)

### Comportamiento
- Cuando `visibleDays` es 1, 3 o 5, los días se centran alrededor de la fecha actual
- Cuando `visibleDays` es 7, se muestra la semana completa desde el lunes
- El grid recalcula automáticamente las columnas basándose en el número de días
- Valores inválidos se ignoran y se usa 7 días por defecto

### Uso
```tsx
<CalendarioGrid
  citas={citas}
  fechaInicio={fechaInicio}
  fechaFin={fechaFin}
  vista={vista}
  onCitaClick={handleCitaClick}
  onSlotClick={handleSlotClick}
  visibleDays={diasVisibles} // Nuevo prop
/>
```

### Pruebas
Las pruebas de regresión visual se encuentran en:
`/src/features/Agenda de Citas y Programación/components/__tests__/CalendarioGrid.visibleDays.test.tsx`

---

## Integración en Agenda de Citas y ProgramaciónPage

### Cambios Realizados
1. **Estado nuevo**: `mostrarMiniCalendario` y `diasVisibles`
2. **Handler `handleDatePicked`**: Ajusta filtros y enfoca la semana elegida
3. **Handler `handleDiasVisiblesChange`**: Actualiza el número de días visibles y ajusta el rango de fechas
4. **Toolbar actualizada**: Incluye `DaysRangeSelector` y botón para abrir `MiniCalendarPanel`
5. **Prop `visibleDays`**: Pasado a `CalendarioGrid`

### Flujo de Uso

#### Mini Calendario
1. El usuario hace clic en el botón "Calendario" en la toolbar
2. Se abre el `MiniCalendarPanel` en la esquina superior derecha
3. El usuario selecciona una fecha
4. Se ejecuta `handleDatePicked`:
   - Ajusta los filtros para enfocar la semana elegida
   - Cierra el panel
   - Cambia a vista semana si estaba en vista mensual
   - Registra la métrica de uso

#### Selector de Días
1. El usuario selecciona el número de días (1, 3, 5 o 7) en el `DaysRangeSelector`
2. Se ejecuta `handleDiasVisiblesChange`:
   - Actualiza el estado `diasVisibles`
   - Ajusta el rango de fechas basado en los días seleccionados
   - Persiste la preferencia en `localStorage`
3. `CalendarioGrid` recibe el nuevo valor de `visibleDays` y recalcula las columnas

---

## Ejecutar Pruebas

Para ejecutar las pruebas unitarias, primero instala las dependencias necesarias:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Luego, agrega el script de test a `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

Finalmente, ejecuta las pruebas:

```bash
npm run test
```

---

## Notas de Implementación

- El `MiniCalendarPanel` usa posicionamiento fijo (`fixed`) y se cierra automáticamente al hacer clic fuera
- Las métricas se almacenan en `localStorage` y están limitadas a 100 entradas
- El `DaysRangeSelector` valida que solo se acepten valores válidos (1, 3, 5, 7)
- `CalendarioGrid` maneja valores inválidos de `visibleDays` usando 7 días por defecto
- Todos los componentes son completamente tipados con TypeScript

