/**
 * Pruebas unitarias para MiniCalendarPanel
 * 
 * Para ejecutar estas pruebas, instala las dependencias necesarias:
 * npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
 * 
 * Luego ejecuta: npm run test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MiniCalendarPanel from '../MiniCalendarPanel';

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('MiniCalendarPanel', () => {
  const mockOnDatePicked = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el componente correctamente', () => {
    render(
      <MiniCalendarPanel
        fechaActual={new Date(2024, 0, 15)}
        onDatePicked={mockOnDatePicked}
        onClose={mockOnClose}
      />
    );

    // Verificar que el mes y año se muestran
    expect(screen.getByText(/Enero 2024/i)).toBeInTheDocument();
    
    // Verificar que hay un botón de cerrar
    const closeButton = screen.getByTitle('Cerrar calendario');
    expect(closeButton).toBeInTheDocument();
  });

  it('debe emitir onDatePicked cuando se selecciona una fecha', () => {
    const fechaSeleccionada = new Date(2024, 0, 15);
    render(
      <MiniCalendarPanel
        fechaActual={fechaSeleccionada}
        onDatePicked={mockOnDatePicked}
        onClose={mockOnClose}
      />
    );

    // Buscar y hacer clic en el día 20
    const dia20 = screen.getByText('20');
    fireEvent.click(dia20);

    // Verificar que onDatePicked fue llamado
    expect(mockOnDatePicked).toHaveBeenCalledTimes(1);
    
    // Verificar que se pasó una fecha
    const fechaLlamada = mockOnDatePicked.mock.calls[0][0];
    expect(fechaLlamada).toBeInstanceOf(Date);
    expect(fechaLlamada.getDate()).toBe(20);
  });

  it('debe registrar métricas de uso en localStorage cuando se selecciona una fecha', () => {
    const fechaSeleccionada = new Date(2024, 0, 15);
    render(
      <MiniCalendarPanel
        fechaActual={fechaSeleccionada}
        onDatePicked={mockOnDatePicked}
        onClose={mockOnClose}
      />
    );

    // Seleccionar una fecha
    const dia20 = screen.getByText('20');
    fireEvent.click(dia20);

    // Verificar que se guardó la métrica en localStorage
    const metrics = JSON.parse(localStorageMock.getItem('agenda_metrics') || '[]');
    expect(metrics.length).toBeGreaterThan(0);
    
    const ultimaMetrica = metrics[metrics.length - 1];
    expect(ultimaMetrica.event).toBe('mini_calendar_date_picked');
    expect(ultimaMetrica.fecha).toBeDefined();
    expect(ultimaMetrica.timestamp).toBeDefined();
  });

  it('debe cerrar el panel cuando se hace clic en el botón de cerrar', () => {
    render(
      <MiniCalendarPanel
        fechaActual={new Date(2024, 0, 15)}
        onDatePicked={mockOnDatePicked}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByTitle('Cerrar calendario');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('debe navegar al mes anterior cuando se hace clic en el botón anterior', () => {
    render(
      <MiniCalendarPanel
        fechaActual={new Date(2024, 1, 15)} // Febrero 2024
        onDatePicked={mockOnDatePicked}
        onClose={mockOnClose}
      />
    );

    // Verificar que muestra Febrero
    expect(screen.getByText(/Febrero 2024/i)).toBeInTheDocument();

    // Hacer clic en el botón anterior
    const botonAnterior = screen.getByTitle('Mes anterior');
    fireEvent.click(botonAnterior);

    // Verificar que ahora muestra Enero
    expect(screen.getByText(/Enero 2024/i)).toBeInTheDocument();
  });

  it('debe navegar al mes siguiente cuando se hace clic en el botón siguiente', () => {
    render(
      <MiniCalendarPanel
        fechaActual={new Date(2024, 0, 15)} // Enero 2024
        onDatePicked={mockOnDatePicked}
        onClose={mockOnClose}
      />
    );

    // Verificar que muestra Enero
    expect(screen.getByText(/Enero 2024/i)).toBeInTheDocument();

    // Hacer clic en el botón siguiente
    const botonSiguiente = screen.getByTitle('Mes siguiente');
    fireEvent.click(botonSiguiente);

    // Verificar que ahora muestra Febrero
    expect(screen.getByText(/Febrero 2024/i)).toBeInTheDocument();
  });

  it('debe ir a hoy cuando se hace clic en el botón "Hoy"', () => {
    const hoy = new Date();
    render(
      <MiniCalendarPanel
        fechaActual={new Date(2024, 5, 15)} // Junio 2024
        onDatePicked={mockOnDatePicked}
        onClose={mockOnClose}
      />
    );

    // Hacer clic en el botón "Hoy"
    const botonHoy = screen.getByText('Hoy');
    fireEvent.click(botonHoy);

    // Verificar que onDatePicked fue llamado con la fecha de hoy
    expect(mockOnDatePicked).toHaveBeenCalledTimes(1);
    const fechaLlamada = mockOnDatePicked.mock.calls[0][0];
    expect(fechaLlamada.toDateString()).toBe(hoy.toDateString());
  });

  it('debe resaltar el día actual', () => {
    const hoy = new Date();
    render(
      <MiniCalendarPanel
        fechaActual={hoy}
        onDatePicked={mockOnDatePicked}
        onClose={mockOnClose}
      />
    );

    // El día de hoy debe tener una clase especial
    const diaHoy = screen.getByText(hoy.getDate().toString());
    expect(diaHoy).toHaveClass('bg-blue-100');
  });

  it('debe resaltar la fecha seleccionada', () => {
    const fechaSeleccionada = new Date(2024, 0, 15);
    render(
      <MiniCalendarPanel
        fechaActual={fechaSeleccionada}
        onDatePicked={mockOnDatePicked}
        onClose={mockOnClose}
      />
    );

    // El día seleccionado debe tener una clase especial
    const diaSeleccionado = screen.getByText('15');
    expect(diaSeleccionado).toHaveClass('bg-blue-600');
  });

  it('debe mantener solo las últimas 100 métricas en localStorage', () => {
    // Llenar localStorage con más de 100 métricas
    const metrics = Array.from({ length: 150 }, (_, i) => ({
      event: 'mini_calendar_date_picked',
      fecha: new Date(2024, 0, i + 1).toISOString(),
      timestamp: new Date().toISOString(),
    }));
    localStorageMock.setItem('agenda_metrics', JSON.stringify(metrics));

    render(
      <MiniCalendarPanel
        fechaActual={new Date(2024, 0, 15)}
        onDatePicked={mockOnDatePicked}
        onClose={mockOnClose}
      />
    );

    // Seleccionar una fecha
    const dia20 = screen.getByText('20');
    fireEvent.click(dia20);

    // Verificar que solo hay 100 métricas
    const metricsFinales = JSON.parse(localStorageMock.getItem('agenda_metrics') || '[]');
    expect(metricsFinales.length).toBeLessThanOrEqual(100);
  });
});

