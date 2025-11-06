import { Calendar, User, FileText, CheckCircle, AlertCircle, HelpCircle, XCircle } from 'lucide-react';
import { ControlEndodontico } from '../api/controlesEndodonciaApi';

interface CardDetalleControlEndoProps {
  control: ControlEndodontico;
  onEditar?: () => void;
  onEliminar?: () => void;
}

export default function CardDetalleControlEndo({
  control,
  onEditar,
  onEliminar,
}: CardDetalleControlEndoProps) {
  const getDiagnosticoIcon = () => {
    switch (control.diagnosticoEvolutivo) {
      case 'Éxito (curación)':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'En progreso':
        return <HelpCircle className="w-5 h-5 text-blue-600" />;
      case 'Dudoso':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'Fracaso':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDiagnosticoColor = () => {
    switch (control.diagnosticoEvolutivo) {
      case 'Éxito (curación)':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'En progreso':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Dudoso':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Fracaso':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const fechaControl = new Date(control.fechaControl).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Control del {fechaControl}</h3>
            <p className="text-sm text-gray-500">
              {new Date(control.fechaControl).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getDiagnosticoColor()}`}>
          {getDiagnosticoIcon()}
          <span className="text-sm font-medium">{control.diagnosticoEvolutivo}</span>
        </div>
      </div>

      {/* Información clínica */}
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Sintomatología</p>
            <p className="text-sm font-medium text-gray-800">{control.sintomatologia}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Signos Clínicos</p>
            <p className="text-sm font-medium text-gray-800">{control.signosClinicos}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Hallazgos Radiográficos</p>
          <p className="text-sm text-gray-800">{control.hallazgosRadiograficos}</p>
        </div>

        {control.observaciones && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Observaciones</p>
            <p className="text-sm text-gray-800">{control.observaciones}</p>
          </div>
        )}
      </div>

      {/* Radiografías */}
      {control.adjuntos && control.adjuntos.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Radiografías ({control.adjuntos.length})</p>
          <div className="grid grid-cols-3 gap-2">
            {control.adjuntos.slice(0, 3).map((adjunto, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  src={adjunto.url}
                  alt={adjunto.nombreArchivo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.png';
                  }}
                />
              </div>
            ))}
            {control.adjuntos.length > 3 && (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <span className="text-sm text-gray-600">+{control.adjuntos.length - 3}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Acciones */}
      {(onEditar || onEliminar) && (
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
          {onEditar && (
            <button
              onClick={onEditar}
              className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Editar
            </button>
          )}
          {onEliminar && (
            <button
              onClick={onEliminar}
              className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}


