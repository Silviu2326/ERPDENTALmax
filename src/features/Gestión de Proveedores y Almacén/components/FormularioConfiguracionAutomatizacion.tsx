import { useState, useEffect } from 'react';
import { ConfiguracionRecordatorio, RecordatorioPlantilla } from '../api/recordatoriosApi';
import { Plus, Trash2, Save, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

interface FormularioConfiguracionAutomatizacionProps {
  configuracion: ConfiguracionRecordatorio;
  plantillas: RecordatorioPlantilla[];
  onGuardar: (configuracion: Partial<ConfiguracionRecordatorio>) => Promise<void>;
  loading?: boolean;
}

export default function FormularioConfiguracionAutomatizacion({
  configuracion,
  plantillas,
  onGuardar,
  loading = false,
}: FormularioConfiguracionAutomatizacionProps) {
  const [activado, setActivado] = useState(configuracion.activado);
  const [reglasEnvio, setReglasEnvio] = useState(configuracion.reglas_envio || []);
  const [canalesActivos, setCanalesActivos] = useState<string[]>(
    configuracion.canales_activos || []
  );
  const [plantillaDefectoId, setPlantillaDefectoId] = useState(
    configuracion.plantilla_defecto_id || ''
  );

  useEffect(() => {
    setActivado(configuracion.activado);
    setReglasEnvio(configuracion.reglas_envio || []);
    setCanalesActivos(configuracion.canales_activos || []);
    setPlantillaDefectoId(configuracion.plantilla_defecto_id || '');
  }, [configuracion]);

  const handleAgregarRegla = () => {
    setReglasEnvio([
      ...reglasEnvio,
      {
        tiempo_antes: 24,
        unidad: 'horas' as const,
        plantillaId: plantillas[0]?._id || '',
      },
    ]);
  };

  const handleEliminarRegla = (index: number) => {
    setReglasEnvio(reglasEnvio.filter((_, i) => i !== index));
  };

  const handleActualizarRegla = (
    index: number,
    campo: 'tiempo_antes' | 'unidad' | 'plantillaId',
    valor: any
  ) => {
    const nuevasReglas = [...reglasEnvio];
    nuevasReglas[index] = { ...nuevasReglas[index], [campo]: valor };
    setReglasEnvio(nuevasReglas);
  };

  const handleToggleCanal = (canal: string) => {
    if (canalesActivos.includes(canal)) {
      setCanalesActivos(canalesActivos.filter((c) => c !== canal));
    } else {
      setCanalesActivos([...canalesActivos, canal]);
    }
  };

  const handleGuardar = async () => {
    await onGuardar({
      activado,
      reglas_envio: reglasEnvio,
      canales_activos: canalesActivos,
      plantilla_defecto_id: plantillaDefectoId || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Activación del sistema */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sistema de Recordatorios</h3>
            <p className="text-sm text-gray-600 mt-1">
              Activa o desactiva el envío automático de recordatorios
            </p>
          </div>
          <button
            onClick={() => setActivado(!activado)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              activado ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                activado ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Canales activos */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Canales de Comunicación</h3>
        <div className="space-y-3">
          {['SMS', 'Email', 'WhatsApp'].map((canal) => (
            <label
              key={canal}
              className="flex items-center justify-between p-3 rounded-xl bg-white ring-1 ring-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <span className="font-medium text-gray-900">{canal}</span>
              <input
                type="checkbox"
                checked={canalesActivos.includes(canal)}
                onChange={() => handleToggleCanal(canal)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Reglas de envío */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Reglas de Envío</h3>
            <p className="text-sm text-gray-600 mt-1">
              Define cuándo y qué plantillas enviar antes de cada cita
            </p>
          </div>
          <button
            onClick={handleAgregarRegla}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={20} />
            Agregar Regla
          </button>
        </div>

        <div className="space-y-4">
          {reglasEnvio.map((regla, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-xl bg-slate-50 ring-1 ring-slate-200"
            >
              <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
                <Clock className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Enviar</span>
                <input
                  type="number"
                  value={regla.tiempo_antes}
                  onChange={(e) =>
                    handleActualizarRegla(index, 'tiempo_antes', parseInt(e.target.value))
                  }
                  className="w-20 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1.5 text-sm"
                  min="1"
                />
                <select
                  value={regla.unidad}
                  onChange={(e) =>
                    handleActualizarRegla(index, 'unidad', e.target.value as 'horas' | 'dias')
                  }
                  className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1.5 text-sm"
                >
                  <option value="horas">horas</option>
                  <option value="dias">días</option>
                </select>
                <span className="text-sm text-slate-700">antes de la cita</span>
              </div>
              <select
                value={regla.plantillaId}
                onChange={(e) => handleActualizarRegla(index, 'plantillaId', e.target.value)}
                className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm flex-1 w-full md:w-auto"
              >
                <option value="">Seleccionar plantilla</option>
                {plantillas
                  .filter((p) => p.activo)
                  .map((plantilla) => (
                    <option key={plantilla._id} value={plantilla._id}>
                      {plantilla.nombre} ({plantilla.tipo})
                    </option>
                  ))}
              </select>
              <button
                onClick={() => handleEliminarRegla(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Eliminar regla"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {reglasEnvio.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No hay reglas configuradas. Agrega una regla para comenzar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Plantilla por defecto */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plantilla por Defecto</h3>
        <select
          value={plantillaDefectoId}
          onChange={(e) => setPlantillaDefectoId(e.target.value)}
          className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 text-sm"
        >
          <option value="">Seleccionar plantilla por defecto</option>
          {plantillas
            .filter((p) => p.activo)
            .map((plantilla) => (
              <option key={plantilla._id} value={plantilla._id}>
                {plantilla.nombre} ({plantilla.tipo})
              </option>
            ))}
        </select>
        <p className="text-sm text-gray-600 mt-2">
          Esta plantilla se usará cuando no se especifique otra en las reglas de envío
        </p>
      </div>

      {/* Botón guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleGuardar}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          <Save size={20} />
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
}



