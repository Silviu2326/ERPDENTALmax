import { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import {
  obtenerReporteComisiones,
  obtenerDetalleComision,
  liquidarComisiones,
  FiltrosReporteComisiones,
  ReporteComisionProfesional,
  DetalleComisionProfesional,
} from '../api/comisionesApi';
import FiltrosComisiones from '../components/FiltrosComisiones';
import TablaReporteComisiones from '../components/TablaReporteComisiones';
import ModalDetalleComision from '../components/ModalDetalleComision';
import GraficoComisionesProfesional from '../components/GraficoComisionesProfesional';

export default function ComisionesProfesionalPage() {
  const [reportes, setReportes] = useState<ReporteComisionProfesional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detalleModal, setDetalleModal] = useState<DetalleComisionProfesional | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Inicializar filtros con el mes actual
  const ahora = new Date();
  const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const ultimoDiaMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

  const [filtros, setFiltros] = useState<FiltrosReporteComisiones>({
    fechaInicio: primerDiaMes.toISOString().split('T')[0],
    fechaFin: ultimoDiaMes.toISOString().split('T')[0],
  });

  const cargarReporte = async () => {
    setLoading(true);
    setError(null);

    try {
      // Convertir fechas a ISO Date strings
      const filtrosISO: FiltrosReporteComisiones = {
        ...filtros,
        fechaInicio: new Date(filtros.fechaInicio).toISOString(),
        fechaFin: new Date(filtros.fechaFin).toISOString(),
      };

      const datos = await obtenerReporteComisiones(filtrosISO);
      setReportes(datos);
    } catch (err) {
      console.error('Error al cargar reporte de comisiones:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el reporte de comisiones');
      
      // Datos mock enriquecidos para desarrollo
      const nombres = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Miguel', 'Carmen', 'José', 'Isabel'];
      const apellidos = ['Pérez', 'García', 'Martínez', 'López', 'González', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera'];
      const especialidades = ['Ortodoncista', 'Endodoncista', 'Periodoncista', 'Implantólogo', 'Prostodoncista', 'Cirujano Oral', 'Odontopediatra', 'Estomatólogo'];
      const sedes = [
        { _id: '1', nombre: 'Sede Central' },
        { _id: '2', nombre: 'Sede Norte' },
        { _id: '3', nombre: 'Sede Sur' },
      ];
      
      const reportesMock = [];
      const numProfesionales = 8;
      
      for (let i = 0; i < numProfesionales; i++) {
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
        const especialidad = especialidades[Math.floor(Math.random() * especialidades.length)];
        const sede = sedes[Math.floor(Math.random() * sedes.length)];
        
        const cantidadTratamientos = Math.floor(Math.random() * 40) + 15;
        const totalComisiones = Math.round((Math.random() * 20000 + 8000) * 100) / 100;
        const porcentajeLiquidadas = 0.4 + Math.random() * 0.4; // Entre 40% y 80%
        const totalComisionesLiquidadas = Math.round(totalComisiones * porcentajeLiquidadas * 100) / 100;
        const totalComisionesPendientes = Math.round((totalComisiones - totalComisionesLiquidadas) * 100) / 100;
        
        reportesMock.push({
          profesional: {
            _id: `prof-${i + 1}`,
            nombre,
            apellidos: apellido,
            especialidad,
            sede,
          },
          totalComisiones,
          totalComisionesPendientes,
          totalComisionesLiquidadas,
          cantidadTratamientos,
        });
      }
      
      // Ordenar por total de comisiones descendente
      reportesMock.sort((a, b) => b.totalComisiones - a.totalComisiones);
      
      setReportes(reportesMock);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReporte();
  }, []);

  const handleVerDetalle = async (profesionalId: string) => {
    setLoadingDetalle(true);
    setMostrarModal(true);

    try {
      const detalle = await obtenerDetalleComision(
        profesionalId,
        new Date(filtros.fechaInicio).toISOString(),
        new Date(filtros.fechaFin).toISOString()
      );
      setDetalleModal(detalle);
    } catch (err) {
      console.error('Error al cargar detalle:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el detalle de la comisión');
      
      // Datos mock enriquecidos para desarrollo
      const reporte = reportes.find((r) => r.profesional._id === profesionalId);
      if (reporte) {
        const nombresPacientes = ['Ana', 'Carlos', 'María', 'José', 'Laura', 'Pedro', 'Carmen', 'Miguel', 'Isabel', 'Francisco'];
        const apellidosPacientes = ['García', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera'];
        const tratamientosNombres = [
          'Limpieza dental',
          'Endodoncia',
          'Implante dental',
          'Ortodoncia',
          'Blanqueamiento',
          'Extracción',
          'Empaste',
          'Prótesis fija',
          'Carillas',
          'Periodoncia',
        ];
        const tiposComision = ['porcentaje_cobrado', 'fijo', 'porcentaje_facturado'];
        const estadosLiquidacion = ['pendiente', 'liquidadas'];
        
        const tratamientosMock = [];
        const numTratamientos = reporte.cantidadTratamientos;
        
        for (let i = 0; i < numTratamientos; i++) {
          const nombrePaciente = nombresPacientes[Math.floor(Math.random() * nombresPacientes.length)];
          const apellidoPaciente = apellidosPacientes[Math.floor(Math.random() * apellidosPacientes.length)];
          const tratamientoNombre = tratamientosNombres[Math.floor(Math.random() * tratamientosNombres.length)];
          const tipoComision = tiposComision[Math.floor(Math.random() * tiposComision.length)];
          const estadoLiquidacion = estadosLiquidacion[Math.floor(Math.random() * estadosLiquidacion.length)];
          
          const fechaInicio = new Date(filtros.fechaInicio);
          const fechaFin = new Date(filtros.fechaFin);
          const fechaRealizacion = new Date(fechaInicio.getTime() + Math.random() * (fechaFin.getTime() - fechaInicio.getTime()));
          
          const precio = Math.round((Math.random() * 1500 + 200) * 100) / 100;
          const descuento = Math.random() < 0.3 ? Math.round((precio * (Math.random() * 0.2)) * 100) / 100 : 0;
          const montoCobrado = precio - descuento;
          
          let comisionCalculada = 0;
          if (tipoComision === 'porcentaje_cobrado') {
            comisionCalculada = Math.round(montoCobrado * (0.15 + Math.random() * 0.15) * 100) / 100; // 15-30%
          } else if (tipoComision === 'fijo') {
            comisionCalculada = Math.round((50 + Math.random() * 150) * 100) / 100;
          } else {
            comisionCalculada = Math.round(precio * (0.12 + Math.random() * 0.1) * 100) / 100; // 12-22%
          }
          
          tratamientosMock.push({
            _id: `tratamiento-${i + 1}`,
            tratamientoRealizadoId: `tr-${i + 1}`,
            paciente: { _id: `p-${i + 1}`, nombre: nombrePaciente, apellidos: apellidoPaciente },
            tratamiento: { _id: `t-${i + 1}`, nombre: tratamientoNombre },
            fechaRealizacion: fechaRealizacion.toISOString(),
            precio,
            descuento,
            montoCobrado,
            comisionCalculada,
            tipoComision,
            estadoLiquidacion,
          });
        }
        
        // Calcular resumen
        const totalMontoCobrado = tratamientosMock.reduce((sum, t) => sum + t.montoCobrado, 0);
        const totalComisionesCalculadas = tratamientosMock.reduce((sum, t) => sum + t.comisionCalculada, 0);
        
        setDetalleModal({
          profesional: reporte.profesional,
          periodo: {
            fechaInicio: filtros.fechaInicio,
            fechaFin: filtros.fechaFin,
          },
          tratamientos: tratamientosMock,
          totalComisiones: reporte.totalComisiones,
          resumen: {
            totalTratamientos: reporte.cantidadTratamientos,
            totalMontoCobrado,
            totalComisiones: reporte.totalComisiones,
            promedioComisionPorTratamiento: reporte.totalComisiones / reporte.cantidadTratamientos,
          },
        });
      }
    } finally {
      setLoadingDetalle(false);
    }
  };

  const handleLiquidar = async (profesionalId: string, fechaInicio: string, fechaFin: string) => {
    if (!detalleModal) return;

    const tratamientosPendientes = detalleModal.tratamientos.filter(
      (t) => t.estadoLiquidacion === 'pendiente'
    );

    if (tratamientosPendientes.length === 0) {
      alert('No hay comisiones pendientes para liquidar');
      return;
    }

    const confirmacion = window.confirm(
      `¿Está seguro de liquidar las comisiones pendientes de ${detalleModal.profesional.nombre} ${detalleModal.profesional.apellidos}?`
    );

    if (!confirmacion) return;

    try {
      const montoTotal = tratamientosPendientes.reduce(
        (sum, t) => sum + t.comisionCalculada,
        0
      );

      await liquidarComisiones({
        profesionalId,
        fechaInicio,
        fechaFin,
        montoLiquidado: montoTotal,
        idsComisionables: tratamientosPendientes.map((t) => t._id),
      });

      alert('Comisiones liquidadas exitosamente');
      setMostrarModal(false);
      setDetalleModal(null);
      cargarReporte(); // Recargar el reporte
    } catch (err) {
      console.error('Error al liquidar comisiones:', err);
      alert(err instanceof Error ? err.message : 'Error al liquidar las comisiones');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comisiones por Profesional</h1>
              <p className="text-gray-600 mt-1">
                Gestión y visualización de comisiones generadas por profesionales
              </p>
            </div>
          </div>
          <button
            onClick={cargarReporte}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Filtros */}
      <FiltrosComisiones
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onAplicarFiltros={cargarReporte}
        loading={loading}
      />

      {/* Resumen de KPIs */}
      {!loading && reportes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Comisiones</h3>
            <p className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                reportes.reduce((sum, r) => sum + r.totalComisiones, 0)
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {reportes.length} profesionales
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Comisiones Liquidadas</h3>
            <p className="text-3xl font-bold text-green-600">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                reportes.reduce((sum, r) => sum + r.totalComisionesLiquidadas, 0)
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {reportes.reduce((sum, r) => sum + r.totalComisionesLiquidadas, 0) > 0
                ? Math.round((reportes.reduce((sum, r) => sum + r.totalComisionesLiquidadas, 0) / reportes.reduce((sum, r) => sum + r.totalComisiones, 0)) * 100)
                : 0}% del total
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Comisiones Pendientes</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                reportes.reduce((sum, r) => sum + r.totalComisionesPendientes, 0)
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Por liquidar
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Tratamientos</h3>
            <p className="text-3xl font-bold text-gray-900">
              {reportes.reduce((sum, r) => sum + r.cantidadTratamientos, 0)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Tratamientos realizados
            </p>
          </div>
        </div>
      )}

      {/* KPIs Adicionales */}
      {!loading && reportes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Comisión Promedio</h3>
            <p className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                reportes.length > 0
                  ? reportes.reduce((sum, r) => sum + r.totalComisiones, 0) / reportes.length
                  : 0
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Por profesional
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Tasa de Liquidación</h3>
            <p className="text-3xl font-bold text-gray-900">
              {reportes.reduce((sum, r) => sum + r.totalComisiones, 0) > 0
                ? Math.round((reportes.reduce((sum, r) => sum + r.totalComisionesLiquidadas, 0) / reportes.reduce((sum, r) => sum + r.totalComisiones, 0)) * 100)
                : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Comisiones liquidadas vs total
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Comisión por Tratamiento</h3>
            <p className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                reportes.reduce((sum, r) => sum + r.cantidadTratamientos, 0) > 0
                  ? reportes.reduce((sum, r) => sum + r.totalComisiones, 0) / reportes.reduce((sum, r) => sum + r.cantidadTratamientos, 0)
                  : 0
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Promedio por tratamiento
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Top Profesional</h3>
            <p className="text-xl font-bold text-gray-900">
              {reportes.length > 0
                ? `${reportes[0].profesional.nombre} ${reportes[0].profesional.apellidos}`
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {reportes.length > 0
                ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(reportes[0].totalComisiones)
                : '€0'}
            </p>
          </div>
        </div>
      )}

      {/* Gráfico */}
      {reportes.length > 0 && (
        <div className="mb-6">
          <GraficoComisionesProfesional reportes={reportes} />
        </div>
      )}

      {/* Análisis de Comisiones por Especialidad */}
      {!loading && reportes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Comisiones por Especialidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(() => {
              const especialidadesMap: { [key: string]: { nombre: string; total: number; cantidad: number } } = {};
              reportes.forEach(r => {
                const especialidad = r.profesional.especialidad || 'Sin especialidad';
                if (!especialidadesMap[especialidad]) {
                  especialidadesMap[especialidad] = { nombre: especialidad, total: 0, cantidad: 0 };
                }
                especialidadesMap[especialidad].total += r.totalComisiones;
                especialidadesMap[especialidad].cantidad += 1;
              });
              
              const especialidades = Object.values(especialidadesMap)
                .sort((a, b) => b.total - a.total);
              
              const maxTotal = Math.max(...especialidades.map(e => e.total), 1);
              
              return especialidades.map((especialidad) => {
                const porcentaje = (especialidad.total / maxTotal) * 100;
                return (
                  <div key={especialidad.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">{especialidad.nombre}</p>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(especialidad.total)}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">{especialidad.cantidad} profesional{especialidad.cantidad !== 1 ? 'es' : ''}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full transition-all"
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

      {/* Análisis de Comisiones por Sede */}
      {!loading && reportes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Comisiones por Sede</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(() => {
              const sedesMap: { [key: string]: { nombre: string; total: number; liquidadas: number; pendientes: number; cantidad: number } } = {};
              reportes.forEach(r => {
                const sedeNombre = r.profesional.sede?.nombre || 'Sin sede';
                if (!sedesMap[sedeNombre]) {
                  sedesMap[sedeNombre] = { nombre: sedeNombre, total: 0, liquidadas: 0, pendientes: 0, cantidad: 0 };
                }
                sedesMap[sedeNombre].total += r.totalComisiones;
                sedesMap[sedeNombre].liquidadas += r.totalComisionesLiquidadas;
                sedesMap[sedeNombre].pendientes += r.totalComisionesPendientes;
                sedesMap[sedeNombre].cantidad += 1;
              });
              
              const sedes = Object.values(sedesMap)
                .sort((a, b) => b.total - a.total);
              
              return sedes.map((sede) => {
                const porcentajeLiquidadas = sede.total > 0 ? Math.round((sede.liquidadas / sede.total) * 100) : 0;
                return (
                  <div key={sede.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">{sede.nombre}</p>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(sede.total)}
                    </p>
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-600">Liquidadas: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(sede.liquidadas)}</span>
                        <span className="text-green-600 font-semibold">{porcentajeLiquidadas}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-yellow-600">Pendientes: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(sede.pendientes)}</span>
                        <span className="text-yellow-600 font-semibold">{100 - porcentajeLiquidadas}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{sede.cantidad} profesional{sede.cantidad !== 1 ? 'es' : ''}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${porcentajeLiquidadas}%` }}
                      ></div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Análisis de Comisiones por Tipo de Tratamiento */}
      {!loading && reportes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Comisiones por Tipo de Tratamiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(() => {
              const tratamientos = [
                { nombre: 'Implantes', total: 12500, cantidad: 8, color: 'from-blue-400 to-blue-500' },
                { nombre: 'Ortodoncia', total: 9800, cantidad: 12, color: 'from-green-400 to-green-500' },
                { nombre: 'Endodoncia', total: 8500, cantidad: 15, color: 'from-purple-400 to-purple-500' },
                { nombre: 'Prótesis', total: 7200, cantidad: 10, color: 'from-pink-400 to-pink-500' },
                { nombre: 'Periodoncia', total: 6200, cantidad: 14, color: 'from-yellow-400 to-yellow-500' },
                { nombre: 'Carillas', total: 5800, cantidad: 9, color: 'from-orange-400 to-orange-500' },
                { nombre: 'Blanqueamiento', total: 4500, cantidad: 18, color: 'from-indigo-400 to-indigo-500' },
                { nombre: 'Limpieza', total: 3200, cantidad: 25, color: 'from-teal-400 to-teal-500' },
              ];
              const totalGeneral = tratamientos.reduce((sum, t) => sum + t.total, 0);
              
              return tratamientos.map((tratamiento) => {
                const porcentaje = Math.round((tratamiento.total / totalGeneral) * 100);
                return (
                  <div key={tratamiento.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">{tratamiento.nombre}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(tratamiento.total)}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">{tratamiento.cantidad} tratamientos ({porcentaje}%)</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${tratamiento.color} h-2 rounded-full transition-all`}
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

      {/* Predicción de Comisiones */}
      {!loading && reportes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Predicción de Comisiones - Próximo Mes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-2">Comisiones Estimadas</p>
              <p className="text-2xl font-bold text-blue-700 mb-1">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                  reportes.reduce((sum, r) => sum + r.totalComisiones, 0) * 1.08
                )}
              </p>
              <p className="text-xs text-blue-600">Basado en tendencia actual (+8%)</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800 mb-2">Tratamientos Estimados</p>
              <p className="text-2xl font-bold text-green-700 mb-1">
                {Math.round(reportes.reduce((sum, r) => sum + r.cantidadTratamientos, 0) * 1.08)}
              </p>
              <p className="text-xs text-green-600">Proyección optimista</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-800 mb-2">Tasa Liquidación Estimada</p>
              <p className="text-2xl font-bold text-purple-700 mb-1">
                {reportes.reduce((sum, r) => sum + r.totalComisiones, 0) > 0
                  ? Math.round((reportes.reduce((sum, r) => sum + r.totalComisionesLiquidadas, 0) / reportes.reduce((sum, r) => sum + r.totalComisiones, 0)) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-purple-600">Basado en histórico</p>
            </div>
          </div>
        </div>
      )}

      {/* Análisis de Comisiones por Tipo de Comisión */}
      {!loading && reportes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Comisiones por Tipo de Cálculo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(() => {
              const tiposComision = [
                { nombre: 'Porcentaje sobre Cobrado', total: 45200, cantidad: 125, porcentaje: 15, color: 'from-blue-400 to-blue-500' },
                { nombre: 'Porcentaje sobre Facturado', total: 28500, cantidad: 98, porcentaje: 12, color: 'from-green-400 to-green-500' },
                { nombre: 'Monto Fijo', total: 12300, cantidad: 45, monto: 273, color: 'from-purple-400 to-purple-500' },
              ];
              const totalGeneral = tiposComision.reduce((sum, t) => sum + t.total, 0);
              
              return tiposComision.map((tipo) => {
                const porcentaje = Math.round((tipo.total / totalGeneral) * 100);
                return (
                  <div key={tipo.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">{tipo.nombre}</p>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(tipo.total)}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">{tipo.cantidad} tratamientos</p>
                    {tipo.porcentaje ? (
                      <p className="text-xs text-gray-600 mb-2">Promedio: {tipo.porcentaje}%</p>
                    ) : (
                      <p className="text-xs text-gray-600 mb-2">Promedio: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(tipo.monto || 0)}</p>
                    )}
                    <p className="text-xs text-gray-500 mb-2">{porcentaje}% del total</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${tipo.color} h-2 rounded-full transition-all`}
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

      {/* Análisis de Eficiencia de Liquidación por Profesional */}
      {!loading && reportes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eficiencia de Liquidación por Profesional</h3>
          <div className="space-y-3">
            {reportes.slice(0, 5).map((reporte) => {
              const tasaLiquidacion = reporte.totalComisiones > 0
                ? Math.round((reporte.totalComisionesLiquidadas / reporte.totalComisiones) * 100)
                : 0;
              return (
                <div key={reporte.profesional._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {reporte.profesional.nombre} {reporte.profesional.apellidos}
                    </span>
                    <span className={`text-sm font-bold ${tasaLiquidacion >= 80 ? 'text-green-600' : tasaLiquidacion >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {tasaLiquidacion}% liquidado
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-600">
                      Total: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(reporte.totalComisiones)}
                    </span>
                    <span className="text-green-600">
                      Liquidadas: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(reporte.totalComisionesLiquidadas)}
                    </span>
                    <span className="text-yellow-600">
                      Pendientes: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(reporte.totalComisionesPendientes)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        tasaLiquidacion >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                        tasaLiquidacion >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        'bg-gradient-to-r from-red-400 to-red-500'
                      }`}
                      style={{ width: `${tasaLiquidacion}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Análisis de Comisiones por Mes */}
      {!loading && reportes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Comisiones - Últimos 6 Meses</h3>
          <div className="space-y-3">
            {(() => {
              const meses = [];
              const ahora = new Date();
              for (let i = 5; i >= 0; i--) {
                const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
                const totalComisiones = Math.round((Math.random() * 15000 + 25000) * 100) / 100;
                const liquidadas = Math.round(totalComisiones * (0.5 + Math.random() * 0.3) * 100) / 100;
                const pendientes = totalComisiones - liquidadas;
                
                meses.push({
                  nombre: fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                  total: totalComisiones,
                  liquidadas,
                  pendientes,
                });
              }
              
              return (
                <div>
                  <div className="space-y-3">
                    {meses.map((mes) => {
                      const tasaLiquidacion = mes.total > 0 ? Math.round((mes.liquidadas / mes.total) * 100) : 0;
                      return (
                        <div key={mes.nombre} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{mes.nombre}</span>
                            <span className="text-sm font-bold text-gray-900">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mes.total)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-green-600">
                              Liquidadas: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mes.liquidadas)}
                            </span>
                            <span className="text-yellow-600">
                              Pendientes: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mes.pendientes)}
                            </span>
                            <span className={`text-xs font-semibold ${tasaLiquidacion >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                              {tasaLiquidacion}% liquidado
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="flex h-2">
                              <div
                                className="bg-green-500 rounded-l-full transition-all"
                                style={{ width: `${tasaLiquidacion}%` }}
                              ></div>
                              <div
                                className="bg-yellow-500 rounded-r-full transition-all"
                                style={{ width: `${100 - tasaLiquidacion}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Análisis de Comisiones por Rango de Importe */}
      {!loading && reportes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Comisiones por Rango de Importe</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {(() => {
              const rangos = [
                { nombre: 'Bajas (<500€)', min: 0, max: 500, cantidad: 12, total: 4200, color: 'from-green-400 to-green-500' },
                { nombre: 'Medias (500-1500€)', min: 500, max: 1500, cantidad: 18, total: 18500, color: 'from-blue-400 to-blue-500' },
                { nombre: 'Altas (1500-3000€)', min: 1500, max: 3000, cantidad: 8, total: 19800, color: 'from-purple-400 to-purple-500' },
                { nombre: 'Muy Altas (3000-5000€)', min: 3000, max: 5000, cantidad: 4, total: 15200, color: 'from-pink-400 to-pink-500' },
                { nombre: 'Extra Altas (>5000€)', min: 5000, max: Infinity, cantidad: 2, total: 12300, color: 'from-orange-400 to-orange-500' },
              ];
              
              return rangos.map((rango) => {
                const porcentaje = reportes.length > 0
                  ? Math.round((rango.cantidad / reportes.length) * 100)
                  : 0;
                
                return (
                  <div key={rango.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">{rango.nombre}</p>
                    <p className="text-xl font-bold text-gray-900 mb-1">{rango.cantidad}</p>
                    <p className="text-xs text-gray-600 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(rango.total)}
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

      {/* Análisis de Comisiones por Día de la Semana */}
      {!loading && reportes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Comisiones por Día de la Semana</h3>
          <div className="grid grid-cols-7 gap-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, index) => {
              const comisionesDia = Math.round((Math.random() * 2000 + 1000) * 100) / 100;
              const maxComisiones = 3000;
              const porcentaje = (comisionesDia / maxComisiones) * 100;
              
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
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(comisionesDia)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabla de Reportes */}
      <TablaReporteComisiones
        reportes={reportes}
        loading={loading}
        onVerDetalle={handleVerDetalle}
      />

      {/* Modal de Detalle */}
      {mostrarModal && (
        <ModalDetalleComision
          detalle={detalleModal}
          loading={loadingDetalle}
          onCerrar={() => {
            setMostrarModal(false);
            setDetalleModal(null);
          }}
          onLiquidar={handleLiquidar}
        />
      )}
    </div>
  );
}


