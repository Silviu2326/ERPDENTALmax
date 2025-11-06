import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Calendar, DollarSign, Users, TrendingUp, Building2, Target } from 'lucide-react';
import { obtenerCampanaPorId, Campana } from '../api/campanasApi';
import GraficoRendimientoCampana from '../components/GraficoRendimientoCampana';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando detalles de la campaña...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!campana) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No se encontró la campaña</p>
            <button
              onClick={onVolver}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          {onEditar && (
            <button
              onClick={() => onEditar(campana)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-5 h-5" />
              Editar
            </button>
          )}
        </div>

        {/* Información Principal */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{campana.nombre}</h1>
              {campana.descripcion && (
                <p className="text-gray-600">{campana.descripcion}</p>
              )}
            </div>
            <span className={`px-4 py-2 text-sm font-medium rounded-full ${estadosColor[campana.estado]}`}>
              {campana.estado}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Periodo</p>
                <p className="font-semibold text-gray-900">
                  {formatearFecha(campana.fechaInicio)} - {formatearFecha(campana.fechaFin)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Presupuesto</p>
                <p className="font-semibold text-gray-900">{formatearMoneda(campana.presupuesto)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Canal</p>
                <p className="font-semibold text-gray-900">{campana.canal}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pacientes Asociados</p>
                <p className="font-semibold text-gray-900">{pacientesCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">CPA</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatearMoneda(cpa)}</p>
            <p className="text-sm text-gray-600 mt-1">Costo por Adquisición</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className={`w-6 h-6 ${roi > 0 ? 'text-green-600' : 'text-red-600'}`} />
              <h3 className="text-lg font-semibold text-gray-900">ROI</h3>
            </div>
            <p className={`text-3xl font-bold ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {roi.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Retorno de Inversión</p>
          </div>

          {campana.costoReal && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Costo Real</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatearMoneda(campana.costoReal)}</p>
              <p className="text-sm text-gray-600 mt-1">Gasto efectivo</p>
            </div>
          )}
        </div>

        {/* Gráfico de Rendimiento */}
        {campana && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rendimiento</h2>
            <GraficoRendimientoCampana 
              campanas={[campana as any]} 
              tipo="roi" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

