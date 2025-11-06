import { Trash2, Edit2 } from 'lucide-react';
import { Cobertura, Tratamiento } from '../api/conveniosApi';

interface DetalleCoberturaConvenioProps {
  cobertura: Cobertura;
  tratamiento?: Tratamiento;
  onEditar?: (cobertura: Cobertura) => void;
  onEliminar?: (coberturaId: string) => void;
  soloLectura?: boolean;
}

export default function DetalleCoberturaConvenio({
  cobertura,
  tratamiento,
  onEditar,
  onEliminar,
  soloLectura = false,
}: DetalleCoberturaConvenioProps) {
  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'porcentaje':
        return 'Porcentaje';
      case 'copago_fijo':
        return 'Copago Fijo';
      case 'tarifa_especial':
        return 'Tarifa Especial';
      default:
        return tipo;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'porcentaje':
        return '%';
      case 'copago_fijo':
        return '€';
      case 'tarifa_especial':
        return '€';
      default:
        return '';
    }
  };

  const formatearValor = (tipo: string, valor: number) => {
    if (tipo === 'porcentaje') {
      return `${valor}%`;
    }
    return `${valor.toFixed(2)} €`;
  };

  const nombreTratamiento =
    typeof cobertura.tratamiento === 'object' && cobertura.tratamiento !== null
      ? cobertura.tratamiento.nombre
      : tratamiento?.nombre || 'Tratamiento desconocido';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-gray-900">{nombreTratamiento}</h4>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <span className="font-bold">{getTipoIcon(cobertura.tipo)}</span>
              {getTipoLabel(cobertura.tipo)}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div className="text-lg font-bold text-gray-900">
              {formatearValor(cobertura.tipo, cobertura.valor)}
            </div>
          </div>

          {cobertura.notas_cobertura && (
            <p className="text-sm text-gray-600 mt-2 italic">
              "{cobertura.notas_cobertura}"
            </p>
          )}
        </div>

        {!soloLectura && (
          <div className="flex items-center gap-2 ml-4">
            {onEditar && (
              <button
                onClick={() => onEditar(cobertura)}
                className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Editar cobertura"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onEliminar && cobertura._id && (
              <button
                onClick={() => onEliminar(cobertura._id!)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar cobertura"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


