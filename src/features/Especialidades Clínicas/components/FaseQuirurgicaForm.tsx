import { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { Cirugia, Implante } from '../api/cargaInmediataApi';

interface FaseQuirurgicaFormProps {
  cirugia?: Cirugia;
  implantesPlanificados?: Implante[];
  onGuardar: (cirugia: Cirugia) => void;
  onCancelar?: () => void;
}

export default function FaseQuirurgicaForm({
  cirugia,
  implantesPlanificados = [],
  onGuardar,
  onCancelar,
}: FaseQuirurgicaFormProps) {
  const [fecha, setFecha] = useState(cirugia?.fecha || new Date().toISOString().split('T')[0]);
  const [notas, setNotas] = useState(cirugia?.notas || '');
  const [implantes, setImplantes] = useState<Implante[]>(
    cirugia?.implantes || implantesPlanificados.map(imp => ({
      ...imp,
      torqueInsercion: undefined,
      lote: undefined,
    }))
  );
  const [biomateriales, setBiomateriales] = useState<string[]>(cirugia?.biomateriales || []);

  const handleAgregarImplante = () => {
    setImplantes([
      ...implantes,
      {
        posicion: '',
        marca: '',
        diametro: 0,
        longitud: 0,
        torqueInsercion: undefined,
        lote: undefined,
      },
    ]);
  };

  const handleEliminarImplante = (index: number) => {
    setImplantes(implantes.filter((_, i) => i !== index));
  };

  const handleActualizarImplante = (index: number, campo: keyof Implante, valor: string | number) => {
    const nuevosImplantes = [...implantes];
    nuevosImplantes[index] = {
      ...nuevosImplantes[index],
      [campo]: valor,
    };
    setImplantes(nuevosImplantes);
  };

  const handleAgregarBiomaterial = () => {
    setBiomateriales([...biomateriales, '']);
  };

  const handleEliminarBiomaterial = (index: number) => {
    setBiomateriales(biomateriales.filter((_, i) => i !== index));
  };

  const handleActualizarBiomaterial = (index: number, valor: string) => {
    const nuevosBiomateriales = [...biomateriales];
    nuevosBiomateriales[index] = valor;
    setBiomateriales(nuevosBiomateriales);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({
      fecha,
      notas,
      implantes,
      biomateriales: biomateriales.filter(b => b.trim() !== ''),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Cirugía
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-2">
          Notas Quirúrgicas
        </label>
        <textarea
          id="notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Registre detalles del procedimiento, incidencias, observaciones intraoperatorias..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Implantes Colocados
          </label>
          <button
            type="button"
            onClick={handleAgregarImplante}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Implante
          </button>
        </div>

        <div className="space-y-4">
          {implantes.map((implante, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700">Implante {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleEliminarImplante(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Posición</label>
                  <input
                    type="text"
                    value={implante.posicion}
                    onChange={(e) => handleActualizarImplante(index, 'posicion', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 16, 17"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Marca</label>
                  <input
                    type="text"
                    value={implante.marca}
                    onChange={(e) => handleActualizarImplante(index, 'marca', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Diámetro (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={implante.diametro || ''}
                    onChange={(e) => handleActualizarImplante(index, 'diametro', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Longitud (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={implante.longitud || ''}
                    onChange={(e) => handleActualizarImplante(index, 'longitud', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Torque (Ncm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={implante.torqueInsercion || ''}
                    onChange={(e) => handleActualizarImplante(index, 'torqueInsercion', parseFloat(e.target.value) || undefined)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 35"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Lote</label>
                  <input
                    type="text"
                    value={implante.lote || ''}
                    onChange={(e) => handleActualizarImplante(index, 'lote', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Número de lote"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Biomateriales Utilizados
          </label>
          <button
            type="button"
            onClick={handleAgregarBiomaterial}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>

        <div className="space-y-2">
          {biomateriales.map((biomaterial, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={biomaterial}
                onChange={(e) => handleActualizarBiomaterial(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Injerto óseo, membrana..."
              />
              <button
                type="button"
                onClick={() => handleEliminarBiomaterial(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Guardar Fase Quirúrgica
        </button>
      </div>
    </form>
  );
}


