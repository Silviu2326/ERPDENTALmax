import { useState, useCallback } from 'react';
import { Tratamiento, AseguradoraPlan, OpcionFinanciera, ResultadoSimulacion } from '../api/simuladorApi';

export interface TratamientoSimulado {
  tratamiento: Tratamiento;
  cantidad: number;
}

export interface EstadoSimulador {
  tratamientosSeleccionados: TratamientoSimulado[];
  planAseguradoraSeleccionado: AseguradoraPlan | null;
  opcionFinancieraSeleccionada: OpcionFinanciera | null;
  plazoMesesSeleccionado: number | null;
  descuentoPorcentaje: number;
  descuentoFijo: number;
  sedeId: string | null;
  resultadoSimulacion: ResultadoSimulacion | null;
  pacienteId: string | null;
}

const initialState: EstadoSimulador = {
  tratamientosSeleccionados: [],
  planAseguradoraSeleccionado: null,
  opcionFinancieraSeleccionada: null,
  plazoMesesSeleccionado: null,
  descuentoPorcentaje: 0,
  descuentoFijo: 0,
  sedeId: null,
  resultadoSimulacion: null,
  pacienteId: null,
};

export function useSimuladorState() {
  const [estado, setEstado] = useState<EstadoSimulador>(initialState);

  const agregarTratamiento = useCallback((tratamiento: Tratamiento, cantidad: number = 1) => {
    setEstado((prev) => {
      const existe = prev.tratamientosSeleccionados.find(
        (t) => t.tratamiento._id === tratamiento._id
      );
      if (existe) {
        return {
          ...prev,
          tratamientosSeleccionados: prev.tratamientosSeleccionados.map((t) =>
            t.tratamiento._id === tratamiento._id
              ? { ...t, cantidad: t.cantidad + cantidad }
              : t
          ),
        };
      }
      return {
        ...prev,
        tratamientosSeleccionados: [...prev.tratamientosSeleccionados, { tratamiento, cantidad }],
      };
    });
  }, []);

  const eliminarTratamiento = useCallback((tratamientoId: string) => {
    setEstado((prev) => ({
      ...prev,
      tratamientosSeleccionados: prev.tratamientosSeleccionados.filter(
        (t) => t.tratamiento._id !== tratamientoId
      ),
    }));
  }, []);

  const actualizarCantidadTratamiento = useCallback((tratamientoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarTratamiento(tratamientoId);
      return;
    }
    setEstado((prev) => ({
      ...prev,
      tratamientosSeleccionados: prev.tratamientosSeleccionados.map((t) =>
        t.tratamiento._id === tratamientoId ? { ...t, cantidad } : t
      ),
    }));
  }, [eliminarTratamiento]);

  const establecerPlanAseguradora = useCallback((plan: AseguradoraPlan | null) => {
    setEstado((prev) => ({
      ...prev,
      planAseguradoraSeleccionado: plan,
    }));
  }, []);

  const establecerOpcionFinanciera = useCallback((opcion: OpcionFinanciera | null) => {
    setEstado((prev) => ({
      ...prev,
      opcionFinancieraSeleccionada: opcion,
      plazoMesesSeleccionado: opcion?.plazos_meses[0] || null,
    }));
  }, []);

  const establecerPlazoMeses = useCallback((plazo: number | null) => {
    setEstado((prev) => ({
      ...prev,
      plazoMesesSeleccionado: plazo,
    }));
  }, []);

  const establecerDescuentoPorcentaje = useCallback((descuento: number) => {
    setEstado((prev) => ({
      ...prev,
      descuentoPorcentaje: Math.max(0, Math.min(100, descuento)),
    }));
  }, []);

  const establecerDescuentoFijo = useCallback((descuento: number) => {
    setEstado((prev) => ({
      ...prev,
      descuentoFijo: Math.max(0, descuento),
    }));
  }, []);

  const establecerSedeId = useCallback((sedeId: string | null) => {
    setEstado((prev) => ({
      ...prev,
      sedeId,
    }));
  }, []);

  const establecerPacienteId = useCallback((pacienteId: string | null) => {
    setEstado((prev) => ({
      ...prev,
      pacienteId,
    }));
  }, []);

  const establecerResultadoSimulacion = useCallback((resultado: ResultadoSimulacion | null) => {
    setEstado((prev) => ({
      ...prev,
      resultadoSimulacion: resultado,
    }));
  }, []);

  const limpiarSimulacion = useCallback(() => {
    setEstado(initialState);
  }, []);

  return {
    estado,
    agregarTratamiento,
    eliminarTratamiento,
    actualizarCantidadTratamiento,
    establecerPlanAseguradora,
    establecerOpcionFinanciera,
    establecerPlazoMeses,
    establecerDescuentoPorcentaje,
    establecerDescuentoFijo,
    establecerSedeId,
    establecerPacienteId,
    establecerResultadoSimulacion,
    limpiarSimulacion,
  };
}


