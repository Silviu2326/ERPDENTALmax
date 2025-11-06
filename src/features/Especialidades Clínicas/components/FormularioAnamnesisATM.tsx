import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { AtmEvaluacion, calcularIndiceFonseca, interpretarIndiceFonseca } from '../api/atmApi';
import DiagramaMuscularInteractivo from './DiagramaMuscularInteractivo';
import ModalRegistroMovimientoMandibular from './ModalRegistroMovimientoMandibular';

interface FormularioAnamnesisATMProps {
  pacienteId: string;
  evaluacionExistente?: AtmEvaluacion;
  onGuardar: (evaluacion: Partial<AtmEvaluacion>) => void;
  onCancelar: () => void;
}

export default function FormularioAnamnesisATM({
  pacienteId,
  evaluacionExistente,
  onGuardar,
  onCancelar,
}: FormularioAnamnesisATMProps) {
  const [pasoActual, setPasoActual] = useState(1);
  const [motivoConsulta, setMotivoConsulta] = useState(evaluacionExistente?.motivoConsulta || '');
  const [respuestasFonseca, setRespuestasFonseca] = useState<{ [key: string]: number }>({});
  const [detallesAnamnesis, setDetallesAnamnesis] = useState(evaluacionExistente?.anamnesis?.detalles || '');
  const [palpaciones, setPalpaciones] = useState(evaluacionExistente?.examenClinico?.palpacionMuscular || []);
  const [ruidosArticulares, setRuidosArticulares] = useState(evaluacionExistente?.examenClinico?.ruidosArticulares || []);
  const [rangosMovimiento, setRangosMovimiento] = useState(evaluacionExistente?.examenClinico?.rangosMovimiento || {
    aperturaSinDolor: 0,
    aperturaMaxima: 0,
    lateralidadDerecha: 0,
    lateralidadIzquierda: 0,
    protrusion: 0,
  });
  const [mapaDolor, setMapaDolor] = useState(evaluacionExistente?.examenClinico?.mapaDolor || {});
  const [diagnostico, setDiagnostico] = useState(evaluacionExistente?.diagnostico || []);
  const [planTratamiento, setPlanTratamiento] = useState(evaluacionExistente?.planTratamiento || '');
  const [mostrarModalMovimiento, setMostrarModalMovimiento] = useState(false);

  const preguntasFonseca = [
    { id: '1', pregunta: '¿Siente dificultad para abrir la boca?' },
    { id: '2', pregunta: '¿Siente dificultad para mover la mandíbula hacia los lados?' },
    { id: '3', pregunta: '¿Siente fatiga o cansancio en los músculos de la cara?' },
    { id: '4', pregunta: '¿Tiene dolor de cabeza con frecuencia?' },
    { id: '5', pregunta: '¿Tiene dolor de oído o alrededor de los oídos?' },
    { id: '6', pregunta: '¿Tiene ruidos en las articulaciones al masticar o abrir la boca?' },
    { id: '7', pregunta: '¿Tiene dolor en la mandíbula al masticar?' },
    { id: '8', pregunta: '¿Tiene bloqueos o dificultad para abrir la boca?' },
    { id: '9', pregunta: '¿Siente tensión en los músculos de la cara?' },
    { id: '10', pregunta: '¿Tiene dolor en la mandíbula al despertar?' },
  ];

  const handleCambiarPaso = (paso: number) => {
    if (paso >= 1 && paso <= 5) {
      setPasoActual(paso);
    }
  };

  const handleGuardar = () => {
    const indiceFonseca = Object.keys(respuestasFonseca).length === 10
      ? calcularIndiceFonseca(respuestasFonseca)
      : undefined;

    const evaluacion: Partial<AtmEvaluacion> = {
      motivoConsulta,
      anamnesis: {
        indiceFonseca,
        detalles: detallesAnamnesis,
      },
      examenClinico: {
        palpacionMuscular: palpaciones,
        ruidosArticulares,
        rangosMovimiento,
        mapaDolor,
      },
      diagnostico,
      planTratamiento,
    };

    onGuardar(evaluacion);
  };

  const indiceFonseca = Object.keys(respuestasFonseca).length === 10
    ? calcularIndiceFonseca(respuestasFonseca)
    : null;
  const interpretacion = indiceFonseca !== null ? interpretarIndiceFonseca(indiceFonseca) : null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nueva Evaluación de ATM</h2>
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((paso) => (
            <button
              key={paso}
              onClick={() => handleCambiarPaso(paso)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                pasoActual === paso
                  ? 'bg-blue-600 text-white'
                  : paso < pasoActual
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {paso === 1 && 'Anamnesis'}
              {paso === 2 && 'Examen Clínico'}
              {paso === 3 && 'Diagnóstico'}
              {paso === 4 && 'Plan de Tratamiento'}
              {paso === 5 && 'Revisión'}
            </button>
          ))}
        </div>
      </div>

      {/* Paso 1: Anamnesis */}
      {pasoActual === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de Consulta
            </label>
            <textarea
              value={motivoConsulta}
              onChange={(e) => setMotivoConsulta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Describa el motivo principal de la consulta..."
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cuestionario de Fonseca</h3>
            <div className="space-y-4">
              {preguntasFonseca.map((pregunta) => (
                <div key={pregunta.id} className="border-b border-gray-200 pb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">{pregunta.pregunta}</p>
                  <div className="flex gap-4">
                    {['Nunca', 'Rara vez', 'A veces', 'Frecuentemente', 'Siempre'].map((opcion, index) => (
                      <label key={index} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`fonseca-${pregunta.id}`}
                          value={index}
                          checked={respuestasFonseca[pregunta.id] === index}
                          onChange={() => setRespuestasFonseca({ ...respuestasFonseca, [pregunta.id]: index })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-600">{opcion}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {interpretacion && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Índice de Fonseca: {indiceFonseca!.toFixed(1)}% - {interpretacion.descripcion}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detalles Adicionales de la Anamnesis
            </label>
            <textarea
              value={detallesAnamnesis}
              onChange={(e) => setDetallesAnamnesis(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Información adicional relevante..."
            />
          </div>
        </div>
      )}

      {/* Paso 2: Examen Clínico */}
      {pasoActual === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mapa de Dolor y Palpación Muscular</h3>
            <DiagramaMuscularInteractivo
              mapaDolor={mapaDolor}
              palpaciones={palpaciones}
              onMapaDolorChange={setMapaDolor}
              onPalpacionesChange={setPalpaciones}
              modoLectura={false}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ruidos Articulares</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ruidosArticulares.some((r) => r.tipo === 'clic' && r.lado === 'derecho')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRuidosArticulares([...ruidosArticulares, { tipo: 'clic', lado: 'derecho' }]);
                    } else {
                      setRuidosArticulares(ruidosArticulares.filter((r) => !(r.tipo === 'clic' && r.lado === 'derecho')));
                    }
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Clic - Lado Derecho</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ruidosArticulares.some((r) => r.tipo === 'clic' && r.lado === 'izquierdo')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRuidosArticulares([...ruidosArticulares, { tipo: 'clic', lado: 'izquierdo' }]);
                    } else {
                      setRuidosArticulares(ruidosArticulares.filter((r) => !(r.tipo === 'clic' && r.lado === 'izquierdo')));
                    }
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Clic - Lado Izquierdo</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ruidosArticulares.some((r) => r.tipo === 'crepito' && r.lado === 'derecho')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRuidosArticulares([...ruidosArticulares, { tipo: 'crepito', lado: 'derecho' }]);
                    } else {
                      setRuidosArticulares(ruidosArticulares.filter((r) => !(r.tipo === 'crepito' && r.lado === 'derecho')));
                    }
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Crepito - Lado Derecho</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ruidosArticulares.some((r) => r.tipo === 'crepito' && r.lado === 'izquierdo')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRuidosArticulares([...ruidosArticulares, { tipo: 'crepito', lado: 'izquierdo' }]);
                    } else {
                      setRuidosArticulares(ruidosArticulares.filter((r) => !(r.tipo === 'crepito' && r.lado === 'izquierdo')));
                    }
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Crepito - Lado Izquierdo</span>
              </label>
            </div>
          </div>

          <div>
            <button
              onClick={() => setMostrarModalMovimiento(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrar Rangos de Movimiento Mandibular
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Diagnóstico */}
      {pasoActual === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Diagnóstico (DC/TMD)</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Código (ej: Ia, Ib, IIa...)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      const codigo = target.value.trim();
                      if (codigo) {
                        setDiagnostico([...diagnostico, { codigo, descripcion: '' }]);
                        target.value = '';
                      }
                    }
                  }}
                />
              </div>
              {diagnostico.map((diag, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={diag.codigo}
                    onChange={(e) => {
                      const nuevosDiagnosticos = [...diagnostico];
                      nuevosDiagnosticos[index].codigo = e.target.value;
                      setDiagnostico(nuevosDiagnosticos);
                    }}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Código"
                  />
                  <input
                    type="text"
                    value={diag.descripcion}
                    onChange={(e) => {
                      const nuevosDiagnosticos = [...diagnostico];
                      nuevosDiagnosticos[index].descripcion = e.target.value;
                      setDiagnostico(nuevosDiagnosticos);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descripción"
                  />
                  <button
                    onClick={() => setDiagnostico(diagnostico.filter((_, i) => i !== index))}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Paso 4: Plan de Tratamiento */}
      {pasoActual === 4 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan de Tratamiento
          </label>
          <textarea
            value={planTratamiento}
            onChange={(e) => setPlanTratamiento(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={8}
            placeholder="Describa el plan de tratamiento propuesto..."
          />
        </div>
      )}

      {/* Paso 5: Revisión */}
      {pasoActual === 5 && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Resumen de la Evaluación</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p><strong>Motivo:</strong> {motivoConsulta || 'No especificado'}</p>
              {interpretacion && (
                <p><strong>Índice Fonseca:</strong> {indiceFonseca!.toFixed(1)}% - {interpretacion.descripcion}</p>
              )}
              <p><strong>Diagnósticos:</strong> {diagnostico.length} registrado(s)</p>
              <p><strong>Plan de Tratamiento:</strong> {planTratamiento ? 'Definido' : 'Pendiente'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botones de navegación */}
      <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={onCancelar}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
          Cancelar
        </button>
        <div className="flex gap-3">
          {pasoActual > 1 && (
            <button
              onClick={() => setPasoActual(pasoActual - 1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Anterior
            </button>
          )}
          {pasoActual < 5 ? (
            <button
              onClick={() => setPasoActual(pasoActual + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleGuardar}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Guardar Evaluación
            </button>
          )}
        </div>
      </div>

      {mostrarModalMovimiento && (
        <ModalRegistroMovimientoMandibular
          rangosMovimiento={rangosMovimiento}
          onGuardar={setRangosMovimiento}
          onCerrar={() => setMostrarModalMovimiento(false)}
          modoLectura={false}
        />
      )}
    </div>
  );
}


