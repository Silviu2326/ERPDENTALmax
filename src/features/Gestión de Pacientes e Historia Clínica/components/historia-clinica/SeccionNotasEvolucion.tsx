import { useState } from 'react';
import { FileText, Plus, Clock, User, TrendingUp, Calendar } from 'lucide-react';
import { NotaEvolucion, agregarNotaEvolucion } from '../../api/historiaClinicaApi';
import EditorNotaSOAP from './EditorNotaSOAP';

interface SeccionNotasEvolucionProps {
  pacienteId: string;
  notas: NotaEvolucion[];
  onNotaAgregada: (nota: NotaEvolucion) => void;
}

export default function SeccionNotasEvolucion({
  pacienteId,
  notas,
  onNotaAgregada,
}: SeccionNotasEvolucionProps) {
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(
    null
  );

  const handleSaveNota = async (notaData: {
    subjetivo: string;
    objetivo: string;
    analisis: string;
    plan: string;
  }) => {
    setGuardando(true);
    setMensaje(null);
    try {
      const nota = await agregarNotaEvolucion(pacienteId, {
        fecha: new Date().toISOString(),
        subjetivo: notaData.subjetivo,
        objetivo: notaData.objetivo,
        analisis: notaData.analisis,
        plan: notaData.plan,
      });
      onNotaAgregada(nota);
      setMostrarEditor(false);
      setMensaje({ tipo: 'success', texto: 'Nota de evolución agregada correctamente' });
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err instanceof Error ? err.message : 'Error al guardar la nota de evolución',
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Notas de Evolución (SOAP)
        </h3>
        {!mostrarEditor && (
          <button
            onClick={() => setMostrarEditor(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Nota
          </button>
        )}
      </div>

      {mensaje && (
        <div
          className={`px-4 py-3 rounded-lg ${
            mensaje.tipo === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Estadísticas de notas */}
      {notas.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notas</p>
                <p className="text-2xl font-bold text-blue-600">{notas.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold text-green-600">
                  {notas.filter(n => {
                    const fecha = new Date(n.fecha);
                    const ahora = new Date();
                    return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profesionales</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(notas.map(n => n.profesional?._id)).size}
                </p>
              </div>
              <User className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Última Nota</p>
                <p className="text-sm font-bold text-orange-600">
                  {notas.length > 0
                    ? new Date(notas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0].fecha).toLocaleDateString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notas.length > 0
                    ? `${Math.floor((new Date().getTime() - new Date(notas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0].fecha).getTime()) / (1000 * 60 * 60 * 24))} días`
                    : ''}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {mostrarEditor && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <EditorNotaSOAP
            onSave={handleSaveNota}
            onCancel={() => setMostrarEditor(false)}
          />
        </div>
      )}

      {notas.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay notas de evolución registradas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notas
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .map((nota) => (
              <div
                key={nota._id || nota.fecha}
                className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {nota.profesional?.nombre} {nota.profesional?.apellidos}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        {new Date(nota.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  {nota.subjetivo && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-900 mb-2">
                        <span className="text-blue-600">S</span> - Subjetivo
                      </h5>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {nota.subjetivo}
                      </p>
                    </div>
                  )}
                  {nota.objetivo && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-900 mb-2">
                        <span className="text-green-600">O</span> - Objetivo
                      </h5>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {nota.objetivo}
                      </p>
                    </div>
                  )}
                  {nota.analisis && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h5 className="font-semibold text-yellow-900 mb-2">
                        <span className="text-yellow-600">A</span> - Análisis
                      </h5>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {nota.analisis}
                      </p>
                    </div>
                  )}
                  {nota.plan && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-900 mb-2">
                        <span className="text-purple-600">P</span> - Plan
                      </h5>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{nota.plan}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}


