import { CampanaConMetricas } from '../api/campanasApi';

interface GraficoRendimientoCampanaProps {
  campanas: CampanaConMetricas[];
  tipo: 'cpa' | 'roi' | 'pacientes' | 'ingresos';
}

export default function GraficoRendimientoCampana({ campanas, tipo }: GraficoRendimientoCampanaProps) {
  const datosGrafico = campanas.map((campana) => ({
    nombre: campana.nombre.length > 20 ? campana.nombre.substring(0, 20) + '...' : campana.nombre,
    valor: tipo === 'cpa' ? campana.cpa || 0 :
           tipo === 'roi' ? campana.roi || 0 :
           tipo === 'pacientes' ? (campana.pacientesAsociadosCount || campana.pacientesAsociados?.length || 0) :
           campana.ingresosGenerados || 0,
    canal: campana.canal,
  }));

  const configuracion = {
    cpa: {
      titulo: 'Costo por Adquisición (CPA)',
      color: '#3b82f6',
      unidad: '€',
      tipoGrafico: 'bar' as const,
    },
    roi: {
      titulo: 'Retorno de Inversión (ROI)',
      color: '#10b981',
      unidad: '%',
      tipoGrafico: 'line' as const,
    },
    pacientes: {
      titulo: 'Pacientes Captados',
      color: '#8b5cf6',
      unidad: '',
      tipoGrafico: 'bar' as const,
    },
    ingresos: {
      titulo: 'Ingresos Generados',
      color: '#f59e0b',
      unidad: '€',
      tipoGrafico: 'bar' as const,
    },
  };

  const config = configuracion[tipo];
  const maxValor = Math.max(...datosGrafico.map(d => d.valor), 1);

  const formatearValor = (valor: number) => {
    if (config.unidad === '€') {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(valor);
    }
    return `${valor.toFixed(1)}${config.unidad}`;
  };

  if (datosGrafico.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-sm text-slate-600">No hay datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="space-y-4">
      {config.tipoGrafico === 'bar' ? (
        // Gráfico de barras
        <div className="space-y-3">
          {datosGrafico.map((dato, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{dato.nombre}</span>
                <span className="font-semibold text-gray-900">{formatearValor(dato.valor)}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(dato.valor / maxValor) * 100}%`,
                    backgroundColor: config.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Gráfico de líneas simplificado
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between">
            {datosGrafico.map((dato, index) => {
              const altura = (dato.valor / maxValor) * 100;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1"
                  style={{ height: '100%' }}
                >
                  <div className="flex-1 flex items-end w-full">
                    <div
                      className="w-full rounded-t transition-all duration-500"
                      style={{
                        height: `${altura}%`,
                        backgroundColor: config.color,
                        minHeight: '2px',
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-600 text-center px-1 transform -rotate-45 origin-top-left">
                    {dato.nombre}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-300" />
          <div className="absolute top-0 left-0 right-0 border-b border-slate-300" />
        </div>
      )}
      </div>
    </div>
  );
}

