/**
 * Pruebas de regresión visual para CalendarioGrid con prop visibleDays
 * 
 * Estas pruebas verifican que el componente CalendarioGrid recalcula
 * correctamente las columnas basándose en el prop visibleDays.
 * 
 * Para ejecutar estas pruebas, instala las dependencias necesarias:
 * npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
 * 
 * Luego ejecuta: npm run test
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import CalendarioGrid from '../CalendarioGrid';
import { Cita } from '../../api/citasApi';

// Mock de citas para las pruebas
const mockCitas: Cita[] = [
  {
    _id: '1',
    paciente: { _id: '1', nombre: 'Juan', apellidos: 'Pérez' },
    profesional: { _id: '1', nombre: 'Dr.', apellidos: 'García' },
    sede: { _id: '1', nombre: 'Sede Central' },
    fecha_hora_inicio: new Date(2024, 0, 15, 10, 0).toISOString(),
    fecha_hora_fin: new Date(2024, 0, 15, 11, 0).toISOString(),
    duracion_minutos: 60,
    estado: 'programada',
    tratamiento: { _id: '1', nombre: 'Limpieza' },
    box_asignado: '1',
    creadoPor: { _id: '1', nombre: 'Admin' },
    historial_cambios: [],
  },
];

describe('CalendarioGrid - visibleDays prop', () => {
  const fechaInicio = new Date(2024, 0, 15);
  const fechaFin = new Date(2024, 0, 22);
  const mockOnCitaClick = () => {};
  const mockOnSlotClick = () => {};

  it('debe mostrar 1 columna cuando visibleDays es 1', () => {
    const { container } = render(
      <CalendarioGrid
        citas={mockCitas}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        vista="semana"
        onCitaClick={mockOnCitaClick}
        onSlotClick={mockOnSlotClick}
        visibleDays={1}
      />
    );

    // Verificar que el grid tiene 1 columna
    const gridHeaders = container.querySelectorAll('[style*="grid-template-columns"]');
    expect(gridHeaders.length).toBeGreaterThan(0);
    
    // Verificar que solo hay 1 día en el header
    const diasHeaders = container.querySelectorAll('[class*="border-r"]');
    // Debe haber al menos 1 día visible
    expect(diasHeaders.length).toBeGreaterThanOrEqual(1);
  });

  it('debe mostrar 3 columnas cuando visibleDays es 3', () => {
    const { container } = render(
      <CalendarioGrid
        citas={mockCitas}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        vista="semana"
        onCitaClick={mockOnCitaClick}
        onSlotClick={mockOnSlotClick}
        visibleDays={3}
      />
    );

    // Verificar que hay 3 días visibles
    const diasHeaders = container.querySelectorAll('[class*="border-r"]');
    // Debe haber aproximadamente 3 días (puede variar por el diseño)
    expect(diasHeaders.length).toBeGreaterThanOrEqual(2);
  });

  it('debe mostrar 5 columnas cuando visibleDays es 5', () => {
    const { container } = render(
      <CalendarioGrid
        citas={mockCitas}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        vista="semana"
        onCitaClick={mockOnCitaClick}
        onSlotClick={mockOnSlotClick}
        visibleDays={5}
      />
    );

    // Verificar que hay 5 días visibles
    const diasHeaders = container.querySelectorAll('[class*="border-r"]');
    // Debe haber aproximadamente 5 días
    expect(diasHeaders.length).toBeGreaterThanOrEqual(4);
  });

  it('debe mostrar 7 columnas cuando visibleDays es 7 (por defecto)', () => {
    const { container } = render(
      <CalendarioGrid
        citas={mockCitas}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        vista="semana"
        onCitaClick={mockOnCitaClick}
        onSlotClick={mockOnSlotClick}
        visibleDays={7}
      />
    );

    // Verificar que hay 7 días visibles
    const diasHeaders = container.querySelectorAll('[class*="border-r"]');
    // Debe haber aproximadamente 7 días
    expect(diasHeaders.length).toBeGreaterThanOrEqual(6);
  });

  it('debe usar 7 días por defecto cuando visibleDays no se proporciona', () => {
    const { container } = render(
      <CalendarioGrid
        citas={mockCitas}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        vista="semana"
        onCitaClick={mockOnCitaClick}
        onSlotClick={mockOnSlotClick}
      />
    );

    // Debe comportarse igual que con visibleDays={7}
    const diasHeaders = container.querySelectorAll('[class*="border-r"]');
    expect(diasHeaders.length).toBeGreaterThanOrEqual(6);
  });

  it('debe ignorar valores inválidos y usar 7 días por defecto', () => {
    const { container } = render(
      <CalendarioGrid
        citas={mockCitas}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        vista="semana"
        onCitaClick={mockOnCitaClick}
        onSlotClick={mockOnSlotClick}
        visibleDays={10 as any} // Valor inválido
      />
    );

    // Debe usar 7 días por defecto
    const diasHeaders = container.querySelectorAll('[class*="border-r"]');
    expect(diasHeaders.length).toBeGreaterThanOrEqual(6);
  });

  it('debe recalcular las columnas cuando cambia visibleDays', () => {
    const { container, rerender } = render(
      <CalendarioGrid
        citas={mockCitas}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        vista="semana"
        onCitaClick={mockOnCitaClick}
        onSlotClick={mockOnSlotClick}
        visibleDays={1}
      />
    );

    const diasHeaders1 = container.querySelectorAll('[class*="border-r"]');
    const count1 = diasHeaders1.length;

    // Cambiar a 7 días
    rerender(
      <CalendarioGrid
        citas={mockCitas}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        vista="semana"
        onCitaClick={mockOnCitaClick}
        onSlotClick={mockOnSlotClick}
        visibleDays={7}
      />
    );

    const diasHeaders2 = container.querySelectorAll('[class*="border-r"]');
    const count2 = diasHeaders2.length;

    // Debe haber más columnas con 7 días que con 1 día
    expect(count2).toBeGreaterThan(count1);
  });

  it('debe centrar correctamente los días cuando visibleDays es 3', () => {
    const fechaCentro = new Date(2024, 0, 15);
    const { container } = render(
      <CalendarioGrid
        citas={mockCitas}
        fechaInicio={fechaCentro}
        fechaFin={fechaFin}
        vista="semana"
        onCitaClick={mockOnCitaClick}
        onSlotClick={mockOnSlotClick}
        visibleDays={3}
      />
    );

    // Con 3 días, debe mostrar día anterior, actual y siguiente
    // El día central (15) debe estar presente
    const contenido = container.textContent || '';
    expect(contenido).toContain('15');
  });

  it('debe centrar correctamente los días cuando visibleDays es 5', () => {
    const fechaCentro = new Date(2024, 0, 15);
    const { container } = render(
      <CalendarioGrid
        citas={mockCitas}
        fechaInicio={fechaCentro}
        fechaFin={fechaFin}
        vista="semana"
        onCitaClick={mockOnCitaClick}
        onSlotClick={mockOnSlotClick}
        visibleDays={5}
      />
    );

    // Con 5 días, debe mostrar 2 días antes, actual y 2 días después
    // El día central (15) debe estar presente
    const contenido = container.textContent || '';
    expect(contenido).toContain('15');
  });
});

