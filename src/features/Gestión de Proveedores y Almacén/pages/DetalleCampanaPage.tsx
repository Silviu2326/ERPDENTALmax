import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Calendar, DollarSign, Users, Building2, Target, Loader2, AlertCircle } from 'lucide-react';
import { obtenerCampanaPorId, Campana } from '../api/campanasApi';
import GraficoRendimientoCampana from '../components/GraficoRendimientoCampana';
import MetricCards from '../components/MetricCards';

interface DetalleCampanaPageProps {
  campanaId: string;
  onVolver: () => void;
  onEditar?: (campana: Campana) => void;
}

export default function DetalleCampanaPage({ campanaId, onVolver, onEditar }: DetalleCampanaPageProps) {
  const [campana, setCampana] = useState<Campana | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarCampana();
  }, [campanaId]);

  const cargarCampana = async () => {
    setIsLoading(true);
    try {
      const data = await obtenerCampanaPorId(campanaId);
      setCampana(data);
    } catch (error) {
      console.error('Error al cargar campaña:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando detalles de la campaña...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!campana) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontró la campaña</h3>
            <p className="text-gray-600 mb-4">La campaña solicitada no existe o ha sido eliminada</p>
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pacientesCount = campana.pacientesAsociados?.length || 0;
  const cpa = campana.presupuesto && pacientesCount > 0 ? campana.presupuesto / pacientesCount : 0;
  const roi = campana.presupuesto && campana.costoReal ? 
    ((campana.costoReal - campana.presupuesto) / campana.presupuesto) * 100 : 0;

  const estadosColor = {
    Planificada: 'bg-blue-100 text-blue-800',
    Activa: 'bg-green-100 text-green-800',
    Finalizada: 'bg-gray-100 text-gray-800',
    Archivada: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Target size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Detalle de Campaña
                  </h1>
                  <p className="text-gray-600">
                    {campana.nombre}
                  </p>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onVolver}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <ArrowLeft size={20} />
                  Volver
                </button>
                {onEditar && (
                  <button
                    onClick={() => onEditar(campana)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
                  >
                    <Edit size={20} />
                    Editar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Información Principal */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                {campana.descripcion && (
                  <p className="text-gray-600 mb-4">{campana.descripcion}</p>
                )}
              </div>
              <span className={`px-4 py-2 text-sm font-medium rounded-full ${estadosColor[campana.estado]}`}>
                {campana.estado}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Periodo</p>
                  <p className="font-semibold text-gray-900">
                    {formatearFecha(campana.fechaInicio)} - {formatearFecha(campana.fechaFin)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl ring-1 ring-green-200/70">
                  <DollarSign size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Presupuesto</p>
                  <p className="font-semibold text-gray-900">{formatearMoneda(campana.presupuesto)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl ring-1 ring-purple-200/70">
                  <Building2 size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Canal</p>
                  <p className="font-semibold text-gray-900">{campana.canal}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-xl ring-1 ring-orange-200/70">
                  <Users size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Pacientes Asociados</p>
                  <p className="font-semibold text-gray-900">{pacientesCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas */}
          <MetricCards
            data={[
              {
                id: 'cpa',
                title: 'Costo por Adquisición (CPA)',
                value: formatearMoneda(cpa),
                color: 'info',
              },
              {
                id: 'roi',
                title: 'Retorno de Inversión (ROI)',
                value: `${roi > 0 ? '+' : ''}${roi.toFixed(1)}%`,
                color: roi > 0 ? 'success' : 'danger',
              },
              ...(campana.costoReal
                ? [
                    {
                      id: 'costo-real',
                      title: 'Costo Real',
                      value: formatearMoneda(campana.costoReal),
                      color: 'warning' as const,
                    },
                  ]
                : []),
            ]}
          />

          {/* Gráfico de Rendimiento */}
          {campana && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Rendimiento</h2>
              <GraficoRendimientoCampana 
                campanas={[campana as any]} 
                tipo="roi" 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

