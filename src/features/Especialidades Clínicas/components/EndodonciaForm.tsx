import { useState, useEffect } from 'react';
import { Plus, Save, AlertCircle } from 'lucide-react';
import { ConductoRadicular, RegistroEndodoncia, obtenerAnatomiaDental } from '../api/endodonciaApi';
import ConductoRadicularInput from './ConductoRadicularInput';
import DiagramaRadicular from './DiagramaRadicular';

interface EndodonciaFormProps {
  tratamientoId: string;
  pacienteId: string;
  odontologoId: string;
  numeroDiente: number;
  registroExistente?: RegistroEndodoncia;
  onSave: (registro: RegistroEndodoncia) => void;
  onError?: (error: string) => void;
}

export default function EndodonciaForm({
  tratamientoId,
  pacienteId,
  odontologoId,
  numeroDiente,
  registroExistente,
  onSave,
  onError,
}: EndodonciaFormProps) {
  const [conductos, setConductos] = useState<ConductoRadicular[]>([]);
  const [observacionesGenerales, setObservacionesGenerales] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargandoAnatomia, setCargandoAnatomia] = useState(false);

  // Cargar datos existentes o anatomía sugerida
  useEffect(() => {
    if (registroExistente) {
      setConductos(registroExistente.conductos || []);
      setObservacionesGenerales(registroExistente.observacionesGenerales || '');
    } else {
      // Cargar anatomía sugerida
      cargarAnatomiaSugerida();
    }
  }, [registroExistente, numeroDiente]);

  const cargarAnatomiaSugerida = async () => {
    setCargandoAnatomia(true);
    try {
      const anatomía = await obtenerAnatomiaDental(numeroDiente);
      // Crear conductos iniciales basados en la anatomía sugerida
      const conductosIniciales: ConductoRadicular[] = anatomía.conductosSugeridos.map((nombre) => ({
        nombreConducto: nombre as ConductoRadicular['nombreConducto'],
        longitudTrabajo: 0,
        instrumentoApical: '',
        conoMaestro: '',
      }));
      setConductos(conductosIniciales);
    } catch (err) {
      console.error('Error al cargar anatomía:', err);
      // Iniciar con un conducto vacío por defecto
      setConductos([{
        nombreConducto: 'Vestibular',
        longitudTrabajo: 0,
        instrumentoApical: '',
        conoMaestro: '',
      }]);
    } finally {
      setCargandoAnatomia(false);
    }
  };

  const handleAddConducto = () => {
    setConductos([
      ...conductos,
      {
        nombreConducto: 'Vestibular',
        longitudTrabajo: 0,
        instrumentoApical: '',
        conoMaestro: '',
      },
    ]);
  };

  const handleConductoChange = (index: number, conducto: ConductoRadicular) => {
    const updated = [...conductos];
    updated[index] = conducto;
    setConductos(updated);
  };

  const handleRemoveConducto = (index: number) => {
    if (conductos.length > 1) {
      const updated = conductos.filter((_, i) => i !== index);
      setConductos(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validación
    if (conductos.length === 0) {
      setError('Debe agregar al menos un conducto');
      setLoading(false);
      return;
    }

    for (const conducto of conductos) {
      if (!conducto.longitudTrabajo || conducto.longitudTrabajo <= 0) {
        setError('Todos los conductos deben tener una longitud de trabajo válida');
        setLoading(false);
        return;
      }
      if (!conducto.instrumentoApical || !conducto.conoMaestro) {
        setError('Todos los conductos deben tener instrumento apical y cono maestro');
        setLoading(false);
        return;
      }
    }

    try {
      const registro: RegistroEndodoncia = {
        tratamientoId,
        pacienteId,
        odontologoId,
        numeroDiente,
        conductos,
        observacionesGenerales,
      };

      if (registroExistente?._id) {
        registro._id = registroExistente._id;
      }

      onSave(registro);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al guardar el registro';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <div className="bg-white shadow-sm rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información del Tratamiento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Número de Diente
            </label>
            <div className="px-3 py-2.5 bg-slate-50 ring-1 ring-slate-200 rounded-xl text-gray-900 font-semibold">
              {numeroDiente}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ID Tratamiento
            </label>
            <div className="px-3 py-2.5 bg-slate-50 ring-1 ring-slate-200 rounded-xl text-slate-600 text-sm">
              {tratamientoId}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ID Paciente
            </label>
            <div className="px-3 py-2.5 bg-slate-50 ring-1 ring-slate-200 rounded-xl text-slate-600 text-sm">
              {pacienteId}
            </div>
          </div>
        </div>
      </div>

      {/* Diagrama radicular */}
      <DiagramaRadicular numeroDiente={numeroDiente} conductos={conductos} />

      {/* Conductos */}
      <div className="bg-white shadow-sm rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Conductos Radiculares
          </h3>
          <button
            type="button"
            onClick={handleAddConducto}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus size={20} />
            Agregar Conducto
          </button>
        </div>

        {cargandoAnatomia ? (
          <div className="text-center py-8 text-gray-600">
            Cargando anatomía sugerida...
          </div>
        ) : conductos.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No hay conductos registrados. Haga clic en "Agregar Conducto" para comenzar.
          </div>
        ) : (
          <div className="space-y-4">
            {conductos.map((conducto, index) => (
              <ConductoRadicularInput
                key={index}
                conducto={conducto}
                index={index}
                onChange={handleConductoChange}
                onRemove={handleRemoveConducto}
                canRemove={conductos.length > 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Observaciones generales */}
      <div className="bg-white shadow-sm rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Observaciones Generales
        </h3>
        <textarea
          value={observacionesGenerales}
          onChange={(e) => setObservacionesGenerales(e.target.value)}
          placeholder="Ingrese observaciones generales sobre el tratamiento (complicaciones, hallazgos especiales, etc.)"
          rows={4}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 ring-1 ring-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || cargandoAnatomia}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          {loading ? 'Guardando...' : 'Guardar Registro'}
        </button>
      </div>
    </form>
  );
}



