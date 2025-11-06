import { useState } from 'react';
import { Plus, X, Save, AlertCircle } from 'lucide-react';
import { NuevoLoteEsterilizacion, Autoclave } from '../api/esterilizacionApi';
import SelectorAutoclave from './SelectorAutoclave';

interface FormularioLoteEsterilizacionProps {
  onGuardar: (lote: NuevoLoteEsterilizacion) => void;
  onCancelar: () => void;
  sedeId?: string;
  operadorId?: string;
  modoEdicion?: boolean;
  loteInicial?: {
    autoclaveId: string;
    paquetes: Array<{ contenido: string }>;
    notas?: string;
  };
}

export default function FormularioLoteEsterilizacion({
  onGuardar,
  onCancelar,
  sedeId,
  operadorId,
  modoEdicion = false,
  loteInicial,
}: FormularioLoteEsterilizacionProps) {
  const [autoclave, setAutoclave] = useState<Autoclave | null>(null);
  const [paquetes, setPaquetes] = useState<Array<{ contenido: string }>>(
    loteInicial?.paquetes || [{ contenido: '' }]
  );
  const [notas, setNotas] = useState(loteInicial?.notas || '');
  const [error, setError] = useState<string | null>(null);

  const handleAgregarPaquete = () => {
    setPaquetes([...paquetes, { contenido: '' }]);
  };

  const handleEliminarPaquete = (index: number) => {
    if (paquetes.length > 1) {
      setPaquetes(paquetes.filter((_, i) => i !== index));
    }
  };

  const handleContenidoPaqueteChange = (index: number, contenido: string) => {
    const nuevosPaquetes = [...paquetes];
    nuevosPaquetes[index].contenido = contenido;
    setPaquetes(nuevosPaquetes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!autoclave) {
      setError('Debe seleccionar un autoclave');
      return;
    }

    if (!sedeId) {
      setError('No se ha especificado la sede');
      return;
    }

    if (!operadorId) {
      setError('No se ha especificado el operador');
      return;
    }

    const paquetesValidos = paquetes.filter((p) => p.contenido.trim() !== '');
    if (paquetesValidos.length === 0) {
      setError('Debe agregar al menos un paquete de instrumental');
      return;
    }

    const lote: NuevoLoteEsterilizacion = {
      autoclaveId: autoclave._id,
      operadorId,
      sedeId,
      paquetes: paquetesValidos,
      notas: notas.trim() || undefined,
    };

    onGuardar(lote);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {modoEdicion ? 'Editar Lote de Esterilización' : 'Nuevo Lote de Esterilización'}
        </h3>

        <div className="space-y-4">
          <SelectorAutoclave
            autoclaveSeleccionado={autoclave}
            onAutoclaveSeleccionado={setAutoclave}
            disabled={modoEdicion}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paquetes de Instrumental
            </label>
            <div className="space-y-2">
              {paquetes.map((paquete, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={paquete.contenido}
                    onChange={(e) => handleContenidoPaqueteChange(index, e.target.value)}
                    placeholder={`Paquete ${index + 1} - Descripción del contenido`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {paquetes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleEliminarPaquete(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAgregarPaquete}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar Paquete</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Observaciones o notas adicionales sobre el lote..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancelar}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>{modoEdicion ? 'Actualizar' : 'Crear'} Lote</span>
        </button>
      </div>
    </form>
  );
}


