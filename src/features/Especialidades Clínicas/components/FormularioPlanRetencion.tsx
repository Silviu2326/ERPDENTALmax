import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { Retenedor } from '../api/retencionApi';

interface FormularioPlanRetencionProps {
  onSubmit: (datos: {
    fechaInicio: string;
    retenedores: Retenedor[];
    notasGenerales?: string;
  }) => void;
  onCancel?: () => void;
  initialData?: {
    fechaInicio?: string;
    retenedores?: Retenedor[];
    notasGenerales?: string;
  };
  loading?: boolean;
}

export default function FormularioPlanRetencion({
  onSubmit,
  onCancel,
  initialData,
  loading = false,
}: FormularioPlanRetencionProps) {
  const [fechaInicio, setFechaInicio] = useState(
    initialData?.fechaInicio || new Date().toISOString().split('T')[0]
  );
  const [retenedores, setRetenedores] = useState<Retenedor[]>(
    initialData?.retenedores || []
  );
  const [notasGenerales, setNotasGenerales] = useState(
    initialData?.notasGenerales || ''
  );

  const tiposRetenedores = ['Fijo', 'Hawley', 'Essix', 'Otro'];
  const arcadas = ['Superior', 'Inferior', 'Ambas'];

  const agregarRetenedor = () => {
    setRetenedores([
      ...retenedores,
      {
        tipo: 'Fijo',
        arcada: 'Superior',
        material: '',
        fechaColocacion: new Date().toISOString().split('T')[0],
        instrucciones: '',
      },
    ]);
  };

  const eliminarRetenedor = (index: number) => {
    setRetenedores(retenedores.filter((_, i) => i !== index));
  };

  const actualizarRetenedor = (index: number, campo: keyof Retenedor, valor: string) => {
    const nuevosRetenedores = [...retenedores];
    nuevosRetenedores[index] = {
      ...nuevosRetenedores[index],
      [campo]: valor,
    };
    setRetenedores(nuevosRetenedores);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (retenedores.length === 0) {
      alert('Debe agregar al menos un retenedor');
      return;
    }
    onSubmit({
      fechaInicio,
      retenedores,
      notasGenerales: notasGenerales || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fecha de inicio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fecha de Inicio del Plan de Retención *
        </label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Retenedores */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Retenedores *
          </label>
          <button
            type="button"
            onClick={agregarRetenedor}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Retenedor
          </button>
        </div>

        {retenedores.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
            No hay retenedores agregados. Haga clic en "Agregar Retenedor" para comenzar.
          </div>
        ) : (
          <div className="space-y-4">
            {retenedores.map((retenedor, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-lg bg-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">
                    Retenedor {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => eliminarRetenedor(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      value={retenedor.tipo}
                      onChange={(e) =>
                        actualizarRetenedor(index, 'tipo', e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {tiposRetenedores.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arcada *
                    </label>
                    <select
                      value={retenedor.arcada}
                      onChange={(e) =>
                        actualizarRetenedor(index, 'arcada', e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {arcadas.map((arcada) => (
                        <option key={arcada} value={arcada}>
                          {arcada}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material *
                    </label>
                    <input
                      type="text"
                      value={retenedor.material}
                      onChange={(e) =>
                        actualizarRetenedor(index, 'material', e.target.value)
                      }
                      placeholder="Ej: Alambre, Acrílico, etc."
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Colocación *
                    </label>
                    <input
                      type="date"
                      value={retenedor.fechaColocacion}
                      onChange={(e) =>
                        actualizarRetenedor(index, 'fechaColocacion', e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instrucciones para el Paciente *
                    </label>
                    <textarea
                      value={retenedor.instrucciones}
                      onChange={(e) =>
                        actualizarRetenedor(index, 'instrucciones', e.target.value)
                      }
                      placeholder="Ej: Usar 12 horas al día, mantener limpio, etc."
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notas generales */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas Generales
        </label>
        <textarea
          value={notasGenerales}
          onChange={(e) => setNotasGenerales(e.target.value)}
          placeholder="Observaciones adicionales sobre el plan de retención..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading || retenedores.length === 0}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Guardando...' : 'Guardar Plan de Retención'}
        </button>
      </div>
    </form>
  );
}


