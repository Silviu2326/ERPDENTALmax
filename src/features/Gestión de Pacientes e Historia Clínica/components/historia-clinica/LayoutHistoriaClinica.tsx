import { useState, useEffect } from 'react';
import { FileText, Tooth, Activity, ClipboardList, Stethoscope, FileImage, CheckCircle, AlertTriangle } from 'lucide-react';
import { HistoriaClinica, obtenerHistoriaClinica, obtenerHistoriaMedica, actualizarHistoriaMedica, HistoriaMedica } from '../../api/historiaClinicaApi';
import FormularioAnamnesis from './FormularioAnamnesis';
import FormularioAntecedentesMedicos from '../FormularioAntecedentesMedicos';
import OdontogramaInteractivo from './OdontogramaInteractivo';
import PeriodontogramaGrafico from './PeriodontogramaGrafico';
import TablaPlanesTratamiento from './TablaPlanesTratamiento';
import SeccionNotasEvolucion from './SeccionNotasEvolucion';
import VisorDocumentosClinicos from './VisorDocumentosClinicos';
import TratamientosRealizadosPage from '../../pages/TratamientosRealizadosPage';

interface LayoutHistoriaClinicaProps {
  pacienteId: string;
}

type SeccionActiva = 'anamnesis' | 'alergias-antecedentes' | 'odontograma' | 'periodontograma' | 'planes' | 'tratamientos-realizados' | 'notas' | 'documentos';

export default function LayoutHistoriaClinica({ pacienteId }: LayoutHistoriaClinicaProps) {
  const [historiaClinica, setHistoriaClinica] = useState<HistoriaClinica | null>(null);
  const [historiaMedica, setHistoriaMedica] = useState<HistoriaMedica | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seccionActiva, setSeccionActiva] = useState<SeccionActiva>('anamnesis');

  useEffect(() => {
    const cargarHistoriaClinica = async () => {
      setLoading(true);
      setError(null);
      try {
        const [dataClinica, dataMedica] = await Promise.all([
          obtenerHistoriaClinica(pacienteId),
          obtenerHistoriaMedica(pacienteId).catch(() => null), // Si falla, usar null
        ]);
        setHistoriaClinica(dataClinica);
        setHistoriaMedica(dataMedica);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la historia clínica');
      } finally {
        setLoading(false);
      }
    };

    if (pacienteId) {
      cargarHistoriaClinica();
    }
  }, [pacienteId]);

  const secciones = [
    { id: 'anamnesis' as SeccionActiva, label: 'Anamnesis', icon: Stethoscope },
    { id: 'alergias-antecedentes' as SeccionActiva, label: 'Alergias y Antecedentes', icon: AlertTriangle },
    { id: 'odontograma' as SeccionActiva, label: 'Odontograma', icon: Tooth },
    { id: 'periodontograma' as SeccionActiva, label: 'Periodontograma', icon: Activity },
    { id: 'planes' as SeccionActiva, label: 'Planes de Tratamiento', icon: ClipboardList },
    { id: 'tratamientos-realizados' as SeccionActiva, label: 'Tratamientos Realizados', icon: CheckCircle },
    { id: 'notas' as SeccionActiva, label: 'Notas de Evolución', icon: FileText },
    { id: 'documentos' as SeccionActiva, label: 'Documentos Clínicos', icon: FileImage },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!historiaClinica) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500">No se pudo cargar la historia clínica</p>
      </div>
    );
  }

  const renderSeccion = () => {
    switch (seccionActiva) {
      case 'anamnesis':
        return (
          <FormularioAnamnesis
            pacienteId={pacienteId}
            datos={historiaClinica.anamnesis || {}}
            onUpdate={(data) => {
              setHistoriaClinica({
                ...historiaClinica,
                anamnesis: data,
              });
            }}
          />
        );
      case 'alergias-antecedentes':
        return (
          <FormularioAntecedentesMedicos
            pacienteId={pacienteId}
            historiaMedica={historiaMedica || {
              alergias: [],
              antecedentes: [],
              medicacionActual: [],
              notasGenerales: '',
            }}
            onUpdate={async (historiaMedicaActualizada) => {
              try {
                const dataActualizada = await actualizarHistoriaMedica(pacienteId, historiaMedicaActualizada);
                setHistoriaMedica(dataActualizada);
              } catch (err) {
                throw err;
              }
            }}
          />
        );
      case 'odontograma':
        return (
          <OdontogramaInteractivo
            pacienteId={pacienteId}
            odontogramaData={historiaClinica.odontograma || {}}
            onUpdate={(data) => {
              setHistoriaClinica({
                ...historiaClinica,
                odontograma: data,
              });
            }}
          />
        );
      case 'periodontograma':
        return (
          <PeriodontogramaGrafico
            pacienteId={pacienteId}
            periodontogramaData={historiaClinica.periodontograma || {}}
            onUpdate={(data) => {
              setHistoriaClinica({
                ...historiaClinica,
                periodontograma: data,
              });
            }}
          />
        );
      case 'planes':
        return <TablaPlanesTratamiento pacienteId={pacienteId} />;
      case 'tratamientos-realizados':
        return <TratamientosRealizadosPage pacienteId={pacienteId} />;
      case 'notas':
        return (
          <SeccionNotasEvolucion
            pacienteId={pacienteId}
            notas={historiaClinica.notasEvolucion || []}
            onNotaAgregada={(nota) => {
              setHistoriaClinica({
                ...historiaClinica,
                notasEvolucion: [...(historiaClinica.notasEvolucion || []), nota],
              });
            }}
          />
        );
      case 'documentos':
        return (
          <VisorDocumentosClinicos
            pacienteId={pacienteId}
            documentos={historiaClinica.documentos || []}
            onDocumentoAgregado={(doc) => {
              setHistoriaClinica({
                ...historiaClinica,
                documentos: [...(historiaClinica.documentos || []), doc],
              });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navegación por pestañas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {secciones.map((seccion) => {
            const Icon = seccion.icon;
            return (
              <button
                key={seccion.id}
                onClick={() => setSeccionActiva(seccion.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors
                  border-b-2 whitespace-nowrap
                  ${
                    seccionActiva === seccion.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {seccion.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido de la sección activa */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderSeccion()}
      </div>
    </div>
  );
}

