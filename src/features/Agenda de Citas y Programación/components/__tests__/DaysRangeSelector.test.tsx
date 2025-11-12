/**
 * Pruebas unitarias para DaysRangeSelector
 * 
 * Para ejecutar estas pruebas, instala las dependencias necesarias:
 * npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
 * 
 * Luego ejecuta: npm run test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DaysRangeSelector from '../DaysRangeSelector';

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

describe('DaysRangeSelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el componente correctamente', () => {
    render(<DaysRangeSelector onChange={mockOnChange} />);

    // Verificar que se muestran las opciones de días
    expect(screen.getByText('Días visibles:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('debe usar el valor por defecto de 7 días si no hay valor inicial ni en localStorage', () => {
    render(<DaysRangeSelector onChange={mockOnChange} />);

    // Verificar que el botón de 7 días está seleccionado
    const boton7 = screen.getByText('7').closest('button');
    expect(boton7).toHaveClass('bg-blue-600');
    
    // Verificar que onChange fue llamado con 7
    expect(mockOnChange).toHaveBeenCalledWith(7);
  });

  it('debe usar el valor inicial si se proporciona', () => {
    render(<DaysRangeSelector valorInicial={3} onChange={mockOnChange} />);

    // Verificar que el botón de 3 días está seleccionado
    const boton3 = screen.getByText('3').closest('button');
    expect(boton3).toHaveClass('bg-blue-600');
    
    // Verificar que onChange fue llamado con 3
    expect(mockOnChange).toHaveBeenCalledWith(3);
  });

  it('debe cargar el valor desde localStorage si existe', () => {
    localStorageMock.setItem('agenda_visible_days', '5');
    
    render(<DaysRangeSelector onChange={mockOnChange} />);

    // Verificar que el botón de 5 días está seleccionado
    const boton5 = screen.getByText('5').closest('button');
    expect(boton5).toHaveClass('bg-blue-600');
    
    // Verificar que onChange fue llamado con 5
    expect(mockOnChange).toHaveBeenCalledWith(5);
  });

  it('debe priorizar el valor inicial sobre localStorage', () => {
    localStorageMock.setItem('agenda_visible_days', '7');
    
    render(<DaysRangeSelector valorInicial={1} onChange={mockOnChange} />);

    // Verificar que el botón de 1 día está seleccionado (no el de 7)
    const boton1 = screen.getByText('1').closest('button');
    expect(boton1).toHaveClass('bg-blue-600');
    
    const boton7 = screen.getByText('7').closest('button');
    expect(boton7).not.toHaveClass('bg-blue-600');
  });

  it('debe cambiar el valor cuando se hace clic en un botón diferente', () => {
    render(<DaysRangeSelector valorInicial={7} onChange={mockOnChange} />);

    // Hacer clic en el botón de 3 días
    const boton3 = screen.getByText('3').closest('button');
    fireEvent.click(boton3!);

    // Verificar que el botón de 3 días está seleccionado
    expect(boton3).toHaveClass('bg-blue-600');
    
    // Verificar que onChange fue llamado con 3
    expect(mockOnChange).toHaveBeenCalledWith(3);
  });

  it('debe persistir el valor en localStorage cuando cambia', () => {
    render(<DaysRangeSelector onChange={mockOnChange} />);

    // Cambiar a 5 días
    const boton5 = screen.getByText('5').closest('button');
    fireEvent.click(boton5!);

    // Verificar que se guardó en localStorage
    expect(localStorageMock.getItem('agenda_visible_days')).toBe('5');
  });

  it('debe ignorar valores inválidos en localStorage y usar el valor por defecto', () => {
    localStorageMock.setItem('agenda_visible_days', '10'); // Valor inválido
    
    render(<DaysRangeSelector onChange={mockOnChange} />);

    // Debe usar el valor por defecto (7)
    const boton7 = screen.getByText('7').closest('button');
    expect(boton7).toHaveClass('bg-blue-600');
  });

  it('debe ignorar valores no numéricos en localStorage y usar el valor por defecto', () => {
    localStorageMock.setItem('agenda_visible_days', 'invalid');
    
    render(<DaysRangeSelector onChange={mockOnChange} />);

    // Debe usar el valor por defecto (7)
    const boton7 = screen.getByText('7').closest('button');
    expect(boton7).toHaveClass('bg-blue-600');
  });

  it('debe mostrar tooltips informativos en cada botón', () => {
    render(<DaysRangeSelector onChange={mockOnChange} />);

    // Verificar que cada botón tiene un title
    const boton1 = screen.getByText('1').closest('button');
    expect(boton1).toHaveAttribute('title', 'Mostrar 1 día');
    
    const boton3 = screen.getByText('3').closest('button');
    expect(boton3).toHaveAttribute('title', 'Mostrar 3 días');
    
    const boton5 = screen.getByText('5').closest('button');
    expect(boton5).toHaveAttribute('title', 'Mostrar 5 días');
    
    const boton7 = screen.getByText('7').closest('button');
    expect(boton7).toHaveAttribute('title', 'Mostrar 7 días');
  });

  it('debe manejar errores de localStorage sin fallar', () => {
    // Simular un error al acceder a localStorage
    const originalGetItem = localStorageMock.getItem;
    localStorageMock.getItem = vi.fn(() => {
      throw new Error('localStorage error');
    });

    // El componente debe renderizar sin errores
    expect(() => {
      render(<DaysRangeSelector onChange={mockOnChange} />);
    }).not.toThrow();

    // Restaurar
    localStorageMock.getItem = originalGetItem;
  });

  it('debe manejar errores al guardar en localStorage sin fallar', () => {
    // Simular un error al guardar en localStorage
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = vi.fn(() => {
      throw new Error('localStorage error');
    });

    // El componente debe renderizar sin errores
    expect(() => {
      render(<DaysRangeSelector onChange={mockOnChange} />);
    }).not.toThrow();

    // Restaurar
    localStorageMock.setItem = originalSetItem;
  });
});

