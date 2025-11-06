import { useState, useEffect } from 'react';
import { ArrowLeft, Video, Loader2 } from 'lucide-react';
import VisorCompartidoContainer from '../components/VisorCompartido/VisorCompartidoContainer';
import { obtenerTeleconsultaPorId } from '../api/teleconsultasApi';
import { DocumentoPaciente } from '../api/sesionTeleconsultaApi';
import type { Teleconsulta } from '../api/teleconsultasApi';

interface SesionTeleconsultaPageProps {
  sesionId: string;
  onVolver?: () => void;
}

export default function SesionTeleconsultaPage({ sesionId, onVolver }: SesionTeleconsultaPageProps) {
  const [teleconsulta, setTeleconsulta] = useState<Teleconsulta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarVisor, setMostrarVisor] = useState(false);
  const [documentoInicial, setDocumentoInicial] = useState<DocumentoPaciente | undefined>();

  useEffect(() => {
    if (sesionId) {
      cargarTeleconsulta();
    }
  }, [sesionId]);

  const cargarTeleconsulta = async () => {
    if (!sesionId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTeleconsultaPorId(sesionId);
      setTeleconsulta(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la sesión de teleconsulta');
      console.error('Error al cargar teleconsulta:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirVisor = () => {
    setMostrarVisor(true);
  };

  const handleCerrarVisor = () => {
    setMostrarVisor(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando sesión de teleconsulta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
          <button
            onClick={onVolver}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!teleconsulta) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
            Sesión no encontrada
          </div>
          <button
            onClick={onVolver}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Sesión de Teleconsulta
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {teleconsulta.paciente?.nombre} {teleconsulta.paciente?.apellidos} - 
                  {teleconsulta.odontologo?.nombre} {teleconsulta.odontologo?.apellidos}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                teleconsulta.estado === 'En Curso'
                  ? 'bg-green-100 text-green-800'
                  : teleconsulta.estado === 'Completada'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {teleconsulta.estado}
              </span>
              
              <button
                onClick={handleAbrirVisor}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Video className="w-4 h-4" />
                Compartir Imagen/Documento
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de la Sesión</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Paciente</h3>
              <p className="text-gray-900">
                {teleconsulta.paciente?.nombre} {teleconsulta.paciente?.apellidos}
              </p>
              {teleconsulta.paciente?.telefono && (
                <p className="text-sm text-gray-600 mt-1">{teleconsulta.paciente.telefono}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Odontólogo</h3>
              <p className="text-gray-900">
                {teleconsulta.odontologo?.nombre} {teleconsulta.odontologo?.apellidos}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Fecha y Hora</h3>
              <p className="text-gray-900">
                {new Date(teleconsulta.fechaHoraInicio).toLocaleString('es-ES', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </p>
            </div>
            
            {teleconsulta.motivoConsulta && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Motivo de Consulta</h3>
                <p className="text-gray-900">{teleconsulta.motivoConsulta}</p>
              </div>
            )}
          </div>

          {teleconsulta.notasPrevias && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notas Previas</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{teleconsulta.notasPrevias}</p>
            </div>
          )}

          {teleconsulta.enlaceVideollamada && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href={teleconsulta.enlaceVideollamada}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Video className="w-4 h-4" />
                Abrir Videollamada
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Visor compartido */}
      {mostrarVisor && sesionId && teleconsulta.pacienteId && (
        <VisorCompartidoContainer
          sesionId={sesionId}
          pacienteId={teleconsulta.pacienteId}
          documentoInicial={documentoInicial}
          isOpen={mostrarVisor}
          onClose={handleCerrarVisor}
        />
      )}
    </div>
  );
}

