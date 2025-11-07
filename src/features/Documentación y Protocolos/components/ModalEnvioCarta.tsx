import { useState } from 'react';
import { X, Mail, Printer, AlertCircle } from 'lucide-react';
import { enviarCarta, DatosEnvioCarta } from '../api/cartasApi';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
}

interface ModalEnvioCartaProps {
  plantillaId: string;
  paciente: Paciente;
  onEnviado: () => void;
  onCancelar: () => void;
}

export default function ModalEnvioCarta({
  plantillaId,
  paciente,
  onEnviado,
  onCancelar,
}: ModalEnvioCartaProps) {
  const [metodo, setMetodo] = useState<'email' | 'impreso'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnviar = async () => {
    if (metodo === 'email' && !paciente.email) {
      setError('El paciente no tiene un email registrado. Por favor, selecciona "Imprimir" en su lugar.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const datos: DatosEnvioCarta = {
        plantillaId,
        pacienteId: paciente._id,
        metodo,
      };

      await enviarCarta(datos);
      onEnviado();
    } catch (err) {
      setError('Error al enviar la carta. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Enviar Carta</h2>
            <button
              onClick={onCancelar}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Información del paciente */}
          <div className="bg-gray-50 rounded-xl p-4 ring-1 ring-gray-200/70">
            <p className="text-sm text-slate-600 mb-1">Paciente:</p>
            <p className="font-semibold text-gray-900">
              {paciente.nombre} {paciente.apellidos}
            </p>
            {paciente.email && (
              <p className="text-sm text-slate-600 mt-1">Email: {paciente.email}</p>
            )}
            {paciente.telefono && (
              <p className="text-sm text-slate-600">Teléfono: {paciente.telefono}</p>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Selector de método */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Método de Envío
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setMetodo('email')}
                disabled={loading || !paciente.email}
                className={`w-full p-4 border-2 rounded-xl transition-all flex items-center gap-3 ${
                  metodo === 'email'
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                    : 'border-gray-300 hover:border-gray-400'
                } ${!paciente.email ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Mail size={20} className="text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Enviar por Email</p>
                  <p className="text-sm text-slate-600">
                    {paciente.email ? `Se enviará a ${paciente.email}` : 'Email no disponible'}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMetodo('impreso')}
                disabled={loading}
                className={`w-full p-4 border-2 rounded-xl transition-all flex items-center gap-3 ${
                  metodo === 'impreso'
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Printer size={20} className="text-slate-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Imprimir</p>
                  <p className="text-sm text-slate-600">Generar PDF para impresión</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            onClick={onCancelar}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviar}
            disabled={loading || (metodo === 'email' && !paciente.email)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                {metodo === 'email' ? <Mail size={20} /> : <Printer size={20} />}
                <span>{metodo === 'email' ? 'Enviar Email' : 'Generar PDF'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



