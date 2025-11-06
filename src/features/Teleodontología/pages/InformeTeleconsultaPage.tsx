import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import ResumenPacienteTeleconsultaHeader from '../components/ResumenPacienteTeleconsultaHeader';
import InformeTeleconsultaForm from '../components/InformeTeleconsultaForm';
import {
  obtenerTeleconsultaDetalle,
  crearInformeTeleconsulta,
  actualizarInformeTeleconsulta,
  CrearInformeData,
  ActualizarInformeData,
  TeleconsultaDetalle,
} from '../api/informeTeleconsultaApi';
import { useAuth } from '../../../contexts/AuthContext';

interface InformeTeleconsultaPageProps {
  teleconsultaId: string;
  onVolver?: () => void;
}

export default function InformeTeleconsultaPage({
  teleconsultaId,
  onVolver,
}: InformeTeleconsultaPageProps) {
  const { user } = useAuth();

  const [teleconsulta, setTeleconsulta] = useState<TeleconsultaDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (teleconsultaId) {
      cargarTeleconsulta();
    } else {
      setError('ID de teleconsulta no proporcionado');
      setLoading(false);
    }
  }, [teleconsultaId]);

  const cargarTeleconsulta = async () => {
    if (!teleconsultaId) return;

    setLoading(true);
    setError(null);

    try {
      const datos = await obtenerTeleconsultaDetalle(teleconsultaId);
      setTeleconsulta(datos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos de la teleconsulta');
      console.error('Error al cargar teleconsulta:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async (datos: CrearInformeData | ActualizarInformeData) => {
    if (!teleconsultaId) return;

    try {
      if (teleconsulta?.informe) {
        // Actualizar informe existente
        await actualizarInformeTeleconsulta(teleconsultaId, datos);
      } else {
        // Crear nuevo informe
        await crearInformeTeleconsulta(teleconsultaId, datos);
      }

      // Recargar datos
      await cargarTeleconsulta();

      // Si es final, ejecutar callback de volver después de un momento
      if (!datos.esBorrador && onVolver) {
        setTimeout(() => {
          onVolver();
        }, 2000);
      }
    } catch (err: any) {
      throw err;
    }
  };

  const handleGuardarBorrador = async (datos: CrearInformeData | ActualizarInformeData) => {
    if (!teleconsultaId) return;

    try {
      if (teleconsulta?.informe) {
        await actualizarInformeTeleconsulta(teleconsultaId, datos);
      } else {
        await crearInformeTeleconsulta(teleconsultaId, datos);
      }
      // Recargar datos para reflejar el borrador
      await cargarTeleconsulta();
    } catch (err: any) {
      throw err;
    }
  };

  const nombreOdontologo = teleconsulta?.odontologo
    ? `${teleconsulta.odontologo.nombre} ${teleconsulta.odontologo.apellidos}`
    : user?.name || 'Odontólogo';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos de la teleconsulta...</p>
        </div>
      </div>
    );
  }

  if (error && !teleconsulta) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-start">
            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">Error al cargar la teleconsulta</h3>
              <p>{error}</p>
              <button
                onClick={onVolver}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Volver a Teleodontología
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!teleconsulta) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header con botón de volver */}
        <div className="mb-6">
          {onVolver && (
            <button
              onClick={onVolver}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Agenda de Teleconsultas</span>
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">Informe de Teleconsulta</h1>
          <p className="text-gray-600 mt-2">
            Documente los hallazgos, diagnóstico y recomendaciones de la consulta a distancia
          </p>
        </div>

        {/* Resumen del paciente */}
        <ResumenPacienteTeleconsultaHeader
          paciente={teleconsulta.paciente}
          teleconsulta={{
            motivoConsulta: teleconsulta.motivoConsulta,
            fechaHoraInicio: teleconsulta.fechaHoraInicio,
          }}
        />

        {/* Formulario de informe */}
        <InformeTeleconsultaForm
          informeInicial={teleconsulta.informe}
          teleconsultaId={teleconsulta._id}
          nombreOdontologo={nombreOdontologo}
          onGuardar={handleGuardar}
          onGuardarBorrador={handleGuardarBorrador}
          esEdicion={!!teleconsulta.informe}
        />
      </div>
    </div>
  );
}

