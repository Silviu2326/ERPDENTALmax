import { useState } from 'react';
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from 'lucide-react';
import { ProtocoloCargaInmediata, EstadoProtocolo } from '../api/cargaInmediataApi';
import FaseDiagnosticoForm from './FaseDiagnosticoForm';
import FaseQuirurgicaForm from './FaseQuirurgicaForm';
import FaseProtesicaTimeline from './FaseProtesicaTimeline';
import VisorArchivosClinicos from './VisorArchivosClinicos';

interface CargaInmediataWizardProps {
  protocolo: ProtocoloCargaInmediata;
  onGuardar: (protocolo: Partial<ProtocoloCargaInmediata>) => void;
  onAvanzarFase: (nuevaFase: EstadoProtocolo) => void;
  onCancelar?: () => void;
}

const FASES: { estado: EstadoProtocolo; label: string; descripcion: string }[] = [
  { estado: 'Diagnóstico', label: 'Diagnóstico', descripcion: 'Registro inicial y evaluación' },
  { estado: 'Planificación', label: 'Planificación', descripcion: 'Planificación digital y diseño' },
  { estado: 'Cirugía', label: 'Cirugía', descripcion: 'Procedimiento quirúrgico' },
  { estado: 'Protésico', label: 'Fase Protésica', descripcion: 'Colocación de prótesis' },
  { estado: 'Finalizado', label: 'Finalizado', descripcion: 'Protocolo completado' },
];

export default function CargaInmediataWizard({
  protocolo,
  onGuardar,
  onAvanzarFase,
  onCancelar,
}: CargaInmediataWizardProps) {
  const [faseActual, setFaseActual] = useState<EstadoProtocolo>(protocolo.estado);

  const getFaseIndex = (fase: EstadoProtocolo) => {
    return FASES.findIndex(f => f.estado === fase);
  };

  const getFasesDisponibles = () => {
    const indiceActual = getFaseIndex(faseActual);
    return FASES.map((fase, index) => ({
      ...fase,
      completada: index < indiceActual,
      activa: index === indiceActual,
      disponible: index <= indiceActual + 1,
    }));
  };

  const handleGuardarDiagnostico = (diagnostico: any) => {
    onGuardar({
      diagnostico,
      estado: faseActual,
    });
  };

  const handleGuardarPlanificacion = (planificacion: any) => {
    onGuardar({
      planificacion,
      estado: faseActual,
    });
  };

  const handleGuardarCirugia = (cirugia: any) => {
    onGuardar({
      cirugia,
      estado: faseActual,
    });
  };

  const handleGuardarFaseProtesica = (faseProtesica: any) => {
    onGuardar({
      faseProtesica,
      estado: faseActual,
    });
  };

  const handleAvanzarFase = () => {
    const indiceActual = getFaseIndex(faseActual);
    if (indiceActual < FASES.length - 1) {
      const nuevaFase = FASES[indiceActual + 1].estado;
      setFaseActual(nuevaFase);
      onAvanzarFase(nuevaFase);
    }
  };

  const handleRetrocederFase = () => {
    const indiceActual = getFaseIndex(faseActual);
    if (indiceActual > 0) {
      const nuevaFase = FASES[indiceActual - 1].estado;
      setFaseActual(nuevaFase);
    }
  };

  const fasesDisponibles = getFasesDisponibles();

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          {fasesDisponibles.map((fase, index) => (
            <div key={fase.estado} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    fase.activa
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : fase.completada
                      ? 'bg-green-500 border-green-500 text-white'
                      : fase.disponible
                      ? 'bg-gray-200 border-gray-300 text-gray-500'
                      : 'bg-gray-100 border-gray-200 text-gray-400'
                  }`}
                >
                  {fase.completada ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-xs font-medium ${
                      fase.activa ? 'text-blue-600' : fase.completada ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {fase.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{fase.descripcion}</p>
                </div>
              </div>
              {index < fasesDisponibles.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    fase.completada ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido de la fase actual */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {faseActual === 'Diagnóstico' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Fase de Diagnóstico</h2>
              <p className="text-gray-600">
                Registre la información inicial del caso, incluyendo evaluación clínica y estudios
                complementarios.
              </p>
            </div>
            <FaseDiagnosticoForm
              diagnostico={protocolo.diagnostico}
              onGuardar={handleGuardarDiagnostico}
            />
            {protocolo.diagnostico?.archivos && protocolo.diagnostico.archivos.length > 0 && (
              <VisorArchivosClinicos archivos={protocolo.diagnostico.archivos} />
            )}
          </div>
        )}

        {faseActual === 'Planificación' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Fase de Planificación</h2>
              <p className="text-gray-600">
                Documente el software utilizado, tipo de guía quirúrgica y especificaciones de los
                implantes planificados.
              </p>
            </div>
            <PlanificacionForm
              planificacion={protocolo.planificacion}
              onGuardar={handleGuardarPlanificacion}
            />
          </div>
        )}

        {faseActual === 'Cirugía' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Fase Quirúrgica</h2>
              <p className="text-gray-600">
                Registre los detalles del procedimiento quirúrgico, torque de inserción de cada
                implante y materiales utilizados.
              </p>
            </div>
            <FaseQuirurgicaForm
              cirugia={protocolo.cirugia}
              implantesPlanificados={protocolo.planificacion?.implantes}
              onGuardar={handleGuardarCirugia}
            />
          </div>
        )}

        {faseActual === 'Protésico' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Fase Protésica</h2>
              <p className="text-gray-600">
                Documente la colocación de la prótesis, materiales utilizados y ajustes realizados.
              </p>
            </div>
            <FaseProtesicaTimeline
              faseProtesica={protocolo.faseProtesica}
              historial={protocolo.historial}
              onGuardar={handleGuardarFaseProtesica}
            />
          </div>
        )}

        {faseActual === 'Finalizado' && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Protocolo Finalizado</h2>
            <p className="text-gray-600">
              El protocolo de carga inmediata ha sido completado exitosamente.
            </p>
          </div>
        )}

        {/* Navegación */}
        {faseActual !== 'Finalizado' && (
          <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
            <div>
              {getFaseIndex(faseActual) > 0 && (
                <button
                  onClick={handleRetrocederFase}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Fase Anterior
                </button>
              )}
            </div>
            <div className="flex gap-3">
              {onCancelar && (
                <button
                  onClick={onCancelar}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              )}
              {getFaseIndex(faseActual) < FASES.length - 2 && (
                <button
                  onClick={handleAvanzarFase}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Siguiente Fase
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente auxiliar para la fase de planificación
function PlanificacionForm({ planificacion, onGuardar }: any) {
  const [software, setSoftware] = useState(planificacion?.software || '');
  const [guiaQuirurgica, setGuiaQuirurgica] = useState(planificacion?.guiaQuirurgica || '');
  const [implantes, setImplantes] = useState(planificacion?.implantes || []);

  const handleAgregarImplante = () => {
    setImplantes([
      ...implantes,
      {
        posicion: '',
        marca: '',
        diametro: 0,
        longitud: 0,
      },
    ]);
  };

  const handleEliminarImplante = (index: number) => {
    setImplantes(implantes.filter((_: any, i: number) => i !== index));
  };

  const handleActualizarImplante = (index: number, campo: string, valor: string | number) => {
    const nuevosImplantes = [...implantes];
    nuevosImplantes[index] = {
      ...nuevosImplantes[index],
      [campo]: valor,
    };
    setImplantes(nuevosImplantes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({
      software,
      guiaQuirurgica,
      implantes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="software" className="block text-sm font-medium text-gray-700 mb-2">
            Software Utilizado
          </label>
          <input
            type="text"
            id="software"
            value={software}
            onChange={(e) => setSoftware(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: BlueSky Bio, 3Shape, Implant Studio..."
          />
        </div>
        <div>
          <label htmlFor="guiaQuirurgica" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Guía Quirúrgica
          </label>
          <select
            id="guiaQuirurgica"
            value={guiaQuirurgica}
            onChange={(e) => setGuiaQuirurgica(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione...</option>
            <option value="Fija">Fija</option>
            <option value="Pilot">Pilot</option>
            <option value="Semiguía">Semiguía</option>
            <option value="Sin guía">Sin guía</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Implantes Planificados
          </label>
          <button
            type="button"
            onClick={handleAgregarImplante}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            + Agregar Implante
          </button>
        </div>

        <div className="space-y-3">
          {implantes.map((implante: any, index: number) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Posición"
                  value={implante.posicion}
                  onChange={(e) => handleActualizarImplante(index, 'posicion', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Marca"
                  value={implante.marca}
                  onChange={(e) => handleActualizarImplante(index, 'marca', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Diámetro (mm)"
                  value={implante.diametro || ''}
                  onChange={(e) =>
                    handleActualizarImplante(index, 'diametro', parseFloat(e.target.value) || 0)
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Longitud (mm)"
                    value={implante.longitud || ''}
                    onChange={(e) =>
                      handleActualizarImplante(index, 'longitud', parseFloat(e.target.value) || 0)
                    }
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleEliminarImplante(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Guardar Planificación
        </button>
      </div>
    </form>
  );
}


