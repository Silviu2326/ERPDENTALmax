import { useState, useEffect } from 'react';
import { FileText, Download, RefreshCw, CheckCircle2, Eye, History, Plus } from 'lucide-react';
import {
  Tratamiento,
  Liquidacion,
  obtenerTratamientosPendientes,
  crearLiquidacion,
  obtenerDetalleLiquidacion,
  conciliarPagoLiquidacion,
  generarPDFLiquidacion,
  generarExcelLiquidacion,
  FiltrosTratamientosPendientes,
  ConciliarPagoData,
} from '../api/liquidacionesApi';
import FiltroLiquidacion, { FiltrosLiquidacion, Mutua } from '../components/FiltroLiquidacion';
import TablaTratamientosPendientes from '../components/TablaTratamientosPendientes';
import ResumenLiquidacion from '../components/ResumenLiquidacion';
import HistorialLiquidaciones from '../components/HistorialLiquidaciones';
import ModalConciliarPago from '../components/ModalConciliarPago';

export default function LiquidacionMutuasPage() {
  const [vista, setVista] = useState<'nueva' | 'historial'>('nueva');
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [tratamientosSeleccionados, setTratamientosSeleccionados] = useState<Tratamiento[]>([]);
  const [tratamientosSeleccionadosIds, setTratamientosSeleccionadosIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosLiquidacion | null>(null);
  const [mostrarModalConciliar, setMostrarModalConciliar] = useState(false);
  const [liquidacionConciliar, setLiquidacionConciliar] = useState<Liquidacion | null>(null);

  // Datos mock para mutuas (en producción vendrían de una API)
  const [mutuas] = useState<Mutua[]>([
    { _id: '1', nombre: 'Adeslas', cif: 'A12345678' },
    { _id: '2', nombre: 'Sanitas', cif: 'B87654321' },
    { _id: '3', nombre: 'DKV Seguros', cif: 'C11223344' },
    { _id: '4', nombre: 'Asisa', cif: 'D55667788' },
  ]);

  const cargarTratamientos = async (filtrosData: FiltrosLiquidacion) => {
    setLoading(true);
    setError(null);
    setTratamientosSeleccionadosIds([]);
    setTratamientosSeleccionados([]);

    try {
      const filtrosApi: FiltrosTratamientosPendientes = {
        mutuaId: filtrosData.mutuaId,
        fechaDesde: filtrosData.fechaDesde,
        fechaHasta: filtrosData.fechaHasta,
      };

      const datos = await obtenerTratamientosPendientes(filtrosApi).catch(() => {
        // Datos mock enriquecidos para desarrollo
        const nombres = ['Ana', 'Carlos', 'María', 'José', 'Laura', 'Pedro', 'Carmen', 'Miguel', 'Isabel', 'Francisco', 'Elena', 'Roberto', 'Patricia', 'Antonio', 'Sofía'];
        const apellidos = ['García', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Morales', 'Jiménez', 'Ruiz', 'Díaz', 'Moreno'];
        const prestaciones = [
          { nombre: 'Limpieza dental', codigo: 'LIMP001' },
          { nombre: 'Endodoncia', codigo: 'ENDO002' },
          { nombre: 'Implante dental', codigo: 'IMPL003' },
          { nombre: 'Ortodoncia', codigo: 'ORTO004' },
          { nombre: 'Blanqueamiento', codigo: 'BLAN005' },
          { nombre: 'Extracción', codigo: 'EXTR006' },
          { nombre: 'Empaste', codigo: 'EMPA007' },
          { nombre: 'Prótesis fija', codigo: 'PROT008' },
          { nombre: 'Carillas', codigo: 'CARI009' },
          { nombre: 'Periodoncia', codigo: 'PERI010' },
        ];
        
        const tratamientosMock: Tratamiento[] = [];
        const numTratamientos = Math.floor(Math.random() * 20) + 10;
        const fechaDesde = new Date(filtrosData.fechaDesde);
        const fechaHasta = new Date(filtrosData.fechaHasta);
        
        for (let i = 0; i < numTratamientos; i++) {
          const nombre = nombres[Math.floor(Math.random() * nombres.length)];
          const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
          const prestacion = prestaciones[Math.floor(Math.random() * prestaciones.length)];
          
          const fecha = new Date(fechaDesde.getTime() + Math.random() * (fechaHasta.getTime() - fechaDesde.getTime()));
          
          const importeTotal = Math.round((Math.random() * 1500 + 200) * 100) / 100;
          // La mutua paga entre 60% y 90% del total
          const porcentajeMutua = 0.6 + Math.random() * 0.3;
          const importeMutua = Math.round(importeTotal * porcentajeMutua * 100) / 100;
          const importePaciente = Math.round((importeTotal - importeMutua) * 100) / 100;
          
          tratamientosMock.push({
            _id: `tratamiento-${i + 1}`,
            paciente: {
              _id: `paciente-${i + 1}`,
              nombre,
              apellidos: apellido,
              dni: `${Math.floor(Math.random() * 90000000) + 10000000}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
            },
            fecha: fecha.toISOString(),
            prestacion: {
              _id: `prestacion-${i + 1}`,
              nombre: prestacion.nombre,
              codigo: prestacion.codigo,
            },
            mutua: {
              _id: filtrosData.mutuaId,
              nombre: mutuas.find(m => m._id === filtrosData.mutuaId)?.nombre || 'Mutua',
            },
            importeTotal,
            importePaciente,
            importeMutua,
            estadoLiquidacion: 'pendiente',
          });
        }
        
        return tratamientosMock;
      });
      setTratamientos(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los tratamientos');
      console.error('Error al cargar tratamientos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrosChange = (nuevosFiltros: FiltrosLiquidacion) => {
    setFiltros(nuevosFiltros);
    cargarTratamientos(nuevosFiltros);
  };

  const handleToggleTratamiento = (tratamientoId: string) => {
    setTratamientosSeleccionadosIds((prev) => {
      if (prev.includes(tratamientoId)) {
        const nuevos = prev.filter((id) => id !== tratamientoId);
        setTratamientosSeleccionados(
          tratamientos.filter((t) => nuevos.includes(t._id))
        );
        return nuevos;
      } else {
        const nuevos = [...prev, tratamientoId];
        setTratamientosSeleccionados(
          tratamientos.filter((t) => nuevos.includes(t._id))
        );
        return nuevos;
      }
    });
  };

  const handleToggleTodos = () => {
    if (tratamientosSeleccionadosIds.length === tratamientos.length) {
      setTratamientosSeleccionadosIds([]);
      setTratamientosSeleccionados([]);
    } else {
      const todosIds = tratamientos.map((t) => t._id);
      setTratamientosSeleccionadosIds(todosIds);
      setTratamientosSeleccionados(tratamientos);
    }
  };

  const handleGenerarLiquidacion = async () => {
    if (!filtros || tratamientosSeleccionadosIds.length === 0) {
      setError('Debe seleccionar al menos un tratamiento y configurar los filtros');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nuevaLiquidacion = await crearLiquidacion({
        mutuaId: filtros.mutuaId,
        fechaDesde: filtros.fechaDesde,
        fechaHasta: filtros.fechaHasta,
        tratamientoIds: tratamientosSeleccionadosIds,
      });

      // Resetear estado
      setTratamientosSeleccionadosIds([]);
      setTratamientosSeleccionados([]);
      setTratamientos([]);
      setFiltros(null);

      // Mostrar mensaje de éxito y cambiar a historial
      alert(`Liquidación ${nuevaLiquidacion.codigo} generada correctamente`);
      setVista('historial');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la liquidación');
      console.error('Error al generar liquidación:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = async (liquidacionId: string) => {
    try {
      const liquidacion = await obtenerDetalleLiquidacion(liquidacionId);
      // Aquí podrías abrir un modal o navegar a otra página
      alert(`Liquidación ${liquidacion.codigo}\nTratamientos: ${liquidacion.tratamientos.length}\nImporte: ${liquidacion.importeTotal}€`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el detalle');
    }
  };

  const handleAbrirConciliarPago = async (liquidacionId: string) => {
    try {
      const liquidacion = await obtenerDetalleLiquidacion(liquidacionId);
      setLiquidacionConciliar(liquidacion);
      setMostrarModalConciliar(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la liquidación');
    }
  };

  const handleConciliarPago = async (datos: ConciliarPagoData) => {
    if (!liquidacionConciliar) return;

    try {
      await conciliarPagoLiquidacion(liquidacionConciliar._id, datos);
      setMostrarModalConciliar(false);
      setLiquidacionConciliar(null);
      alert('Pago conciliado correctamente');
    } catch (err) {
      throw err; // El modal manejará el error
    }
  };

  const handleGenerarPDF = async (liquidacionId: string) => {
    try {
      const blob = await generarPDFLiquidacion(liquidacionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `liquidacion-${liquidacionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el PDF');
    }
  };

  const handleGenerarExcel = async (liquidacionId: string) => {
    try {
      const blob = await generarExcelLiquidacion(liquidacionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `liquidacion-${liquidacionId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el Excel');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Liquidación de Mutuas/Seguros
                </h1>
                <p className="text-gray-600">
                  Gestión de liquidaciones y cobros a compañías de seguros
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Sistema de Tabs */}
          <div className="bg-white shadow-sm rounded-lg p-0">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                <button
                  onClick={() => setVista('nueva')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    vista === 'nueva'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Plus size={18} className={vista === 'nueva' ? 'opacity-100' : 'opacity-70'} />
                  <span>Nueva Liquidación</span>
                </button>
                <button
                  onClick={() => setVista('historial')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    vista === 'historial'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <History size={18} className={vista === 'historial' ? 'opacity-100' : 'opacity-70'} />
                  <span>Historial</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {vista === 'nueva' ? (
            <>
              {/* Filtros */}
              <FiltroLiquidacion
                filtros={filtros || { mutuaId: '', fechaDesde: '', fechaHasta: '' }}
                onFiltrosChange={handleFiltrosChange}
                mutuas={mutuas}
                loading={loading}
              />

              {/* Resumen de KPIs */}
              {!loading && tratamientos.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText size={20} className="text-blue-600" />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Total Tratamientos</h3>
                      <p className="text-3xl font-bold text-gray-900">{tratamientos.length}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Tratamientos pendientes
                      </p>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText size={20} className="text-green-600" />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Importe Total</h3>
                      <p className="text-3xl font-bold text-gray-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                          tratamientos.reduce((sum, t) => sum + t.importeTotal, 0)
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Suma de todos los tratamientos
                      </p>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FileText size={20} className="text-purple-600" />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Importe Mutua</h3>
                      <p className="text-3xl font-bold text-gray-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                          tratamientos.reduce((sum, t) => sum + t.importeMutua, 0)
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        A cobrar a la mutua
                      </p>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <FileText size={20} className="text-yellow-600" />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Importe Paciente</h3>
                      <p className="text-3xl font-bold text-gray-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                          tratamientos.reduce((sum, t) => sum + t.importePaciente, 0)
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        A cobrar al paciente
                      </p>
                    </div>
                  </div>

                  {/* KPIs Adicionales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <FileText size={20} className="text-indigo-600" />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Ticket Medio</h3>
                      <p className="text-3xl font-bold text-gray-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                          tratamientos.length > 0
                            ? tratamientos.reduce((sum, t) => sum + t.importeTotal, 0) / tratamientos.length
                            : 0
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Por tratamiento
                      </p>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <FileText size={20} className="text-pink-600" />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">% Cobertura Mutua</h3>
                      <p className="text-3xl font-bold text-gray-900">
                        {tratamientos.reduce((sum, t) => sum + t.importeTotal, 0) > 0
                          ? Math.round((tratamientos.reduce((sum, t) => sum + t.importeMutua, 0) / tratamientos.reduce((sum, t) => sum + t.importeTotal, 0)) * 100)
                          : 0}%
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Cobertura promedio
                      </p>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <FileText size={20} className="text-teal-600" />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Tratamientos Seleccionados</h3>
                      <p className="text-3xl font-bold text-gray-900">
                        {tratamientosSeleccionados.length}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {tratamientos.length > 0
                          ? Math.round((tratamientosSeleccionados.length / tratamientos.length) * 100)
                          : 0}% del total
                      </p>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-cyan-100 rounded-lg">
                          <FileText size={20} className="text-cyan-600" />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Importe Seleccionado</h3>
                      <p className="text-3xl font-bold text-gray-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                          tratamientosSeleccionados.reduce((sum, t) => sum + t.importeMutua, 0)
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        A liquidar
                      </p>
                    </div>
                  </div>

                  {/* Análisis por Tipo de Prestación */}
                  {tratamientos.length > 0 && (
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Tipo de Prestación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(() => {
                        const prestaciones: { [key: string]: { count: number; total: number; mutua: number } } = {};
                        tratamientos.forEach(t => {
                          const nombre = t.prestacion.nombre;
                          if (!prestaciones[nombre]) {
                            prestaciones[nombre] = { count: 0, total: 0, mutua: 0 };
                          }
                          prestaciones[nombre].count++;
                          prestaciones[nombre].total += t.importeTotal;
                          prestaciones[nombre].mutua += t.importeMutua;
                        });
                        
                        return Object.entries(prestaciones)
                          .sort((a, b) => b[1].total - a[1].total)
                          .slice(0, 6)
                          .map(([nombre, datos]) => {
                            const porcentaje = tratamientos.reduce((sum, t) => sum + t.importeTotal, 0) > 0
                              ? Math.round((datos.total / tratamientos.reduce((sum, t) => sum + t.importeTotal, 0)) * 100)
                              : 0;
                            
                            return (
                              <div key={nombre} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">{nombre}</p>
                                <p className="text-lg font-bold text-gray-900 mb-1">
                                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(datos.total)}
                                </p>
                                <p className="text-xs text-gray-600 mb-2">
                                  {datos.count} tratamientos • {porcentaje}%
                                </p>
                                <p className="text-xs text-purple-600 font-medium">
                                  Mutua: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(datos.mutua)}
                                </p>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-purple-600 h-2 rounded-full transition-all"
                                    style={{ width: `${porcentaje}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          });
                      })()}
                    </div>
                  </div>
                )}

                  {/* Top 10 Pacientes por Importe Mutua */}
                  {tratamientos.length > 0 && (
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Pacientes por Importe a Cobrar a Mutua</h3>
                <div className="space-y-2">
                  {(() => {
                    const pacientesMap: { [key: string]: { nombre: string; total: number; cantidad: number } } = {};
                    tratamientos.forEach(t => {
                      const key = `${t.paciente.nombre} ${t.paciente.apellidos}`;
                      if (!pacientesMap[key]) {
                        pacientesMap[key] = { nombre: key, total: 0, cantidad: 0 };
                      }
                      pacientesMap[key].total += t.importeMutua;
                      pacientesMap[key].cantidad += 1;
                    });
                    
                    const topPacientes = Object.values(pacientesMap)
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 10);
                    
                    const maxTotal = Math.max(...topPacientes.map(p => p.total), 1);
                    
                    return topPacientes.map((paciente, index) => {
                      const porcentaje = (paciente.total / maxTotal) * 100;
                      return (
                        <div key={paciente.nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{paciente.nombre}</p>
                              <p className="text-xs text-gray-500">{paciente.cantidad} tratamiento{paciente.cantidad !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all"
                                style={{ width: `${porcentaje}%` }}
                              ></div>
                            </div>
                            <p className="text-sm font-bold text-gray-900 w-24 text-right">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(paciente.total)}
                            </p>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

                  {/* Análisis de Cobertura por Prestación */}
                  {tratamientos.length > 0 && (
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Cobertura por Tipo de Prestación</h3>
                <div className="space-y-3">
                  {(() => {
                    const prestacionesMap: { [key: string]: { nombre: string; total: number; mutua: number; paciente: number; cantidad: number } } = {};
                    tratamientos.forEach(t => {
                      const nombre = t.prestacion.nombre;
                      if (!prestacionesMap[nombre]) {
                        prestacionesMap[nombre] = { nombre, total: 0, mutua: 0, paciente: 0, cantidad: 0 };
                      }
                      prestacionesMap[nombre].total += t.importeTotal;
                      prestacionesMap[nombre].mutua += t.importeMutua;
                      prestacionesMap[nombre].paciente += t.importePaciente;
                      prestacionesMap[nombre].cantidad += 1;
                    });
                    
                    const prestaciones = Object.values(prestacionesMap)
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 8);
                    
                    return prestaciones.map((prestacion) => {
                      const porcentajeCobertura = prestacion.total > 0 ? Math.round((prestacion.mutua / prestacion.total) * 100) : 0;
                      return (
                        <div key={prestacion.nombre} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{prestacion.nombre}</span>
                            <span className="text-sm font-bold text-gray-900">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(prestacion.total)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-purple-600">
                              Mutua: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(prestacion.mutua)} ({porcentajeCobertura}%)
                            </span>
                            <span className="text-yellow-600">
                              Paciente: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(prestacion.paciente)} ({100 - porcentajeCobertura}%)
                            </span>
                            <span className="text-gray-600">{prestacion.cantidad} tratamientos</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="flex h-2">
                              <div
                                className="bg-purple-500 rounded-l-full transition-all"
                                style={{ width: `${porcentajeCobertura}%` }}
                              ></div>
                              <div
                                className="bg-yellow-500 rounded-r-full transition-all"
                                style={{ width: `${100 - porcentajeCobertura}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

                  {/* Análisis de Tratamientos por Rango de Cobertura */}
                  {tratamientos.length > 0 && (
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Tratamientos por Rango de Cobertura</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const rangosCobertura = [
                      { nombre: 'Alta (80-100%)', min: 0.8, max: 1.0, color: 'from-green-400 to-green-500' },
                      { nombre: 'Media (60-79%)', min: 0.6, max: 0.8, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Baja (40-59%)', min: 0.4, max: 0.6, color: 'from-yellow-400 to-yellow-500' },
                      { nombre: 'Muy Baja (<40%)', min: 0, max: 0.4, color: 'from-red-400 to-red-500' },
                    ];
                    
                    return rangosCobertura.map(rango => {
                      const tratamientosRango = tratamientos.filter(t => {
                        const cobertura = t.importeTotal > 0 ? t.importeMutua / t.importeTotal : 0;
                        return cobertura >= rango.min && cobertura < rango.max;
                      });
                      const total = tratamientosRango.reduce((sum, t) => sum + t.importeMutua, 0);
                      const porcentaje = tratamientos.length > 0
                        ? Math.round((tratamientosRango.length / tratamientos.length) * 100)
                        : 0;
                      
                      return (
                        <div key={rango.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{rango.nombre}</p>
                          <p className="text-2xl font-bold text-gray-900 mb-1">{tratamientosRango.length}</p>
                          <p className="text-xs text-gray-600 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(total)}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">{porcentaje}% del total</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${rango.color} h-2 rounded-full transition-all`}
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

                  {/* Análisis de Tratamientos por Día de la Semana */}
                  {tratamientos.length > 0 && (
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Tratamientos por Día de la Semana</h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, index) => {
                    const tratamientosDia = tratamientos.filter(t => {
                      const fecha = new Date(t.fecha);
                      return fecha.getDay() === (index === 0 ? 1 : index === 6 ? 0 : index + 1);
                    });
                    const totalDia = tratamientosDia.reduce((sum, t) => sum + t.importeMutua, 0);
                    const maxTotal = Math.max(...['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((_, idx) => {
                      const tratamientosD = tratamientos.filter(t => {
                        const fecha = new Date(t.fecha);
                        return fecha.getDay() === (idx === 0 ? 1 : idx === 6 ? 0 : idx + 1);
                      });
                      return tratamientosD.reduce((sum, t) => sum + t.importeMutua, 0);
                    }), 1);
                    const porcentaje = (totalDia / maxTotal) * 100;
                    
                    return (
                      <div key={dia} className="text-center">
                        <div className="mb-2">
                          <div className="w-full bg-gray-200 rounded-full h-32 flex items-end justify-center">
                            <div 
                              className="w-full bg-gradient-to-t from-purple-500 to-indigo-600 rounded-full transition-all"
                              style={{ height: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs font-medium text-gray-700">{dia}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalDia)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{tratamientosDia.length} trat.</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

                  {/* Análisis de Tratamientos por Mes */}
                  {tratamientos.length > 0 && (
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Tratamientos - Últimos 6 Meses</h3>
                <div className="space-y-3">
                  {(() => {
                    const meses = [];
                    const ahora = new Date();
                    for (let i = 5; i >= 0; i--) {
                      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
                      const tratamientosMes = tratamientos.filter(t => {
                        const fechaTratamiento = new Date(t.fecha);
                        return fechaTratamiento.getMonth() === fecha.getMonth() && 
                               fechaTratamiento.getFullYear() === fecha.getFullYear();
                      });
                      const totalMutua = tratamientosMes.reduce((sum, t) => sum + t.importeMutua, 0);
                      const totalPaciente = tratamientosMes.reduce((sum, t) => sum + t.importePaciente, 0);
                      
                      meses.push({
                        nombre: fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                        cantidad: tratamientosMes.length,
                        totalMutua,
                        totalPaciente,
                        total: totalMutua + totalPaciente,
                      });
                    }
                    
                    const maxTotal = Math.max(...meses.map(m => m.total), 1);
                    
                    return (
                      <div>
                        <div className="flex items-end justify-between h-48 gap-2 mb-4">
                          {meses.map((mes) => {
                            const alturaMutua = (mes.totalMutua / maxTotal) * 100;
                            const alturaPaciente = (mes.totalPaciente / maxTotal) * 100;
                            return (
                              <div key={mes.nombre} className="flex-1 flex flex-col items-center">
                                <div className="w-full flex items-end justify-center gap-1 mb-2" style={{ height: '180px' }}>
                                  <div 
                                    className="flex-1 bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-lg transition-all hover:opacity-80"
                                    style={{ height: `${alturaMutua}%` }}
                                    title={`Mutua: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(mes.totalMutua)}`}
                                  ></div>
                                  <div 
                                    className="flex-1 bg-gradient-to-t from-yellow-500 to-yellow-600 rounded-t-lg transition-all hover:opacity-80"
                                    style={{ height: `${alturaPaciente}%` }}
                                    title={`Paciente: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(mes.totalPaciente)}`}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-600 font-medium text-center">{mes.nombre}</p>
                                <p className="text-xs text-gray-500">{mes.cantidad} trat.</p>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-500 rounded"></div>
                            <span className="text-xs text-gray-600">Mutua</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                            <span className="text-xs text-gray-600">Paciente</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
              </>
            )}

              {/* Tabla de tratamientos y Resumen */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TablaTratamientosPendientes
                    tratamientos={tratamientos}
                    tratamientosSeleccionados={tratamientosSeleccionadosIds}
                    onToggleTratamiento={handleToggleTratamiento}
                    onToggleTodos={handleToggleTodos}
                    loading={loading}
                  />
                </div>
                <div>
                  <ResumenLiquidacion
                    tratamientosSeleccionados={tratamientosSeleccionados}
                    loading={loading}
                  />
                </div>
              </div>

              {/* Botón Generar Liquidación */}
              {tratamientosSeleccionadosIds.length > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={handleGenerarLiquidacion}
                    disabled={loading || !filtros}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm font-semibold flex items-center space-x-2"
                  >
                    <CheckCircle2 size={20} className="mr-2" />
                    <span>Generar Liquidación</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <HistorialLiquidaciones
              onVerDetalle={handleVerDetalle}
              onConciliarPago={handleAbrirConciliarPago}
            />
          )}

          {/* Modal Conciliar Pago */}
          {mostrarModalConciliar && liquidacionConciliar && (
            <ModalConciliarPago
              isOpen={mostrarModalConciliar}
              onClose={() => {
                setMostrarModalConciliar(false);
                setLiquidacionConciliar(null);
              }}
              onConfirmar={handleConciliarPago}
              importeTotal={liquidacionConciliar.importeTotal}
              liquidacionCodigo={liquidacionConciliar.codigo}
            />
          )}
        </div>
      </div>
    </div>
  );
}


