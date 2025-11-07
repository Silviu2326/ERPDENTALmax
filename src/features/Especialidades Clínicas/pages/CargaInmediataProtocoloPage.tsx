import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, Calendar, Activity, Loader2, AlertCircle, Package } from 'lucide-react';
import {
  ProtocoloCargaInmediata,
  crearProtocoloCargaInmediata,
  obtenerProtocolosPorPaciente,
  obtenerProtocoloPorId,
  actualizarFaseProtocolo,
  agregarArchivoAProtocolo,
  EstadoProtocolo,
} from '../api/cargaInmediataApi';
import CargaInmediataWizard from '../components/CargaInmediataWizard';
import { useAuth } from '../../../contexts/AuthContext';

interface CargaInmediataProtocoloPageProps {
  pacienteId?: string;
  protocoloId?: string;
  onVolver?: () => void;
}

export default function CargaInmediataProtocoloPage({
  pacienteId: pacienteIdProp,
  protocoloId: protocoloIdProp,
  onVolver,
}: CargaInmediataProtocoloPageProps) {
  const { user } = useAuth();
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [protocoloId, setProtocoloId] = useState<string>(protocoloIdProp || '');
  const [protocolo, setProtocolo] = useState<ProtocoloCargaInmediata | null>(null);
  const [protocolos, setProtocolos] = useState<ProtocoloCargaInmediata[]>([]);
  const [mostrarLista, setMostrarLista] = useState(!protocoloIdProp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (protocoloIdProp) {
      cargarProtocolo(protocoloIdProp);
    } else if (pacienteId) {
      cargarProtocolos();
    }
  }, [protocoloIdProp, pacienteId]);

  const cargarProtocolo = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerProtocoloPorId(id);
      setProtocolo(data);
      setProtocoloId(data._id || '');
      setPacienteId(data.pacienteId);
      setMostrarLista(false);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el protocolo');
    } finally {
      setLoading(false);
    }
  };

  const cargarProtocolos = async () => {
    if (!pacienteId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerProtocolosPorPaciente(pacienteId);
      setProtocolos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los protocolos');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearProtocolo = async () => {
    if (!pacienteId || !user?._id) {
      setError('Se requiere un paciente y un odontólogo');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const nuevoProtocolo = await crearProtocoloCargaInmediata(pacienteId, user._id);
      setProtocolo(nuevoProtocolo);
      setProtocoloId(nuevoProtocolo._id || '');
      setMostrarLista(false);
      await cargarProtocolos();
    } catch (err: any) {
      setError(err.message || 'Error al crear el protocolo');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async (datosActualizacion: Partial<ProtocoloCargaInmediata>) => {
    if (!protocoloId || !protocolo) return;

    setLoading(true);
    setError(null);
    try {
      const protocoloActualizado = await actualizarFaseProtocolo(
        protocoloId,
        datosActualizacion.estado || protocolo.estado,
        datosActualizacion
      );
      setProtocolo(protocoloActualizado);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el protocolo');
    } finally {
      setLoading(false);
    }
  };

  const handleAvanzarFase = async (nuevaFase: EstadoProtocolo) => {
    if (!protocoloId || !protocolo) return;

    setLoading(true);
    setError(null);
    try {
      const protocoloActualizado = await actualizarFaseProtocolo(protocoloId, nuevaFase, {
        estado: nuevaFase,
      });
      setProtocolo(protocoloActualizado);
    } catch (err: any) {
      setError(err.message || 'Error al avanzar de fase');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadgeColor = (estado: EstadoProtocolo) => {
    const colores: Record<EstadoProtocolo, string> = {
      Diagnóstico: 'bg-blue-100 text-blue-800',
      Planificación: 'bg-purple-100 text-purple-800',
      Cirugía: 'bg-red-100 text-red-800',
      Protésico: 'bg-green-100 text-green-800',
      Finalizado: 'bg-gray-100 text-gray-800',
    };
    return colores[estado];
  };

  if (loading && !protocolo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando protocolo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (protocolo && !mostrarLista) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {onVolver && (
                    <button
                      onClick={() => {
                        if (pacienteId && !protocoloIdProp) {
                          setMostrarLista(true);
                        } else {
                          onVolver();
                        }
                      }}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors mr-4"
                    >
                      <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                  )}
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <Activity size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Implantología: Carga Inmediata
                    </h1>
                    <p className="text-gray-600">
                      Protocolo de tratamiento - {protocolo.estado}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadgeColor(
                    protocolo.estado
                  )}`}
                >
                  {protocolo.estado}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          {error && (
            <div className="mb-6 bg-white shadow-sm rounded-xl p-4 border border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700">Error</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <CargaInmediataWizard
            protocolo={protocolo}
            onGuardar={handleGuardar}
            onAvanzarFase={handleAvanzarFase}
            onCancelar={() => {
              if (pacienteId && !protocoloIdProp) {
                setMostrarLista(true);
              } else if (onVolver) {
                onVolver();
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors mr-4"
                  >
                    <ArrowLeft size={20} className="text-gray-600" />
                  </button>
                )}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Activity size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Implantología: Carga Inmediata
                  </h1>
                  <p className="text-gray-600">Gestión de protocolos de carga inmediata</p>
                </div>
              </div>
              {pacienteId && (
                <button
                  onClick={handleCrearProtocolo}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-sm"
                >
                  <Plus size={20} />
                  Nuevo Protocolo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de protocolos */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {error && (
          <div className="mb-6 bg-white shadow-sm rounded-xl p-4 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-700">Error</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!pacienteId ? (
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccione un paciente</h3>
            <p className="text-gray-600">Seleccione un paciente para ver sus protocolos</p>
          </div>
        ) : protocolos.length === 0 ? (
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay protocolos</h3>
            <p className="text-gray-600 mb-4">
              No hay protocolos de carga inmediata para este paciente
            </p>
            <button
              onClick={handleCrearProtocolo}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-sm"
            >
              <Plus size={20} />
              Crear Primer Protocolo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {protocolos.map((prot) => (
              <div
                key={prot._id}
                onClick={() => prot._id && cargarProtocolo(prot._id)}
                className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                      <Activity size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Protocolo de Carga Inmediata</h3>
                      <p className="text-sm text-gray-600">
                        Creado:{' '}
                        {prot.fechaCreacion
                          ? new Date(prot.fechaCreacion).toLocaleDateString('es-ES')
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadgeColor(
                      prot.estado
                    )}`}
                  >
                    {prot.estado}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



