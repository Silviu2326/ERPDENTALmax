import { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import {
  RecallCircuit,
  RecallStats,
} from '../api/recallsApi';
import RecallsTable from '../components/RecallsTable';
import RecallCircuitForm from '../components/RecallCircuitForm';
import RecallStatsWidget from '../components/RecallStatsWidget';
import PatientPreviewModal from '../components/PatientPreviewModal';
import ConfiguracionRecallPage from './ConfiguracionRecallPage';

export default function CircuitosRecallsPage() {
  const [circuitos, setCircuitos] = useState<RecallCircuit[]>([]);
  const [stats, setStats] = useState<RecallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [circuitoEditando, setCircuitoEditando] = useState<RecallCircuit | undefined>();
  const [circuitoPreviewId, setCircuitoPreviewId] = useState<string | null>(null);
  const [vistaConfiguracion, setVistaConfiguracion] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Datos falsos completos de circuitos de recall
      const circuitosData: RecallCircuit[] = [
        {
          _id: '1',
          name: 'Recordatorio Limpieza Dental',
          description: 'Recordatorio automático para pacientes que necesitan limpieza dental cada 6 meses',
          isActive: true,
          trigger: {
            type: 'treatment_completed',
            details: {
              treatmentId: 'limpieza-dental',
            },
            daysAfter: 180,
          },
          communicationSequence: [
            {
              step: 1,
              channel: 'email',
              templateId: 'template-1',
              delayDays: 0,
            },
            {
              step: 2,
              channel: 'sms',
              templateId: 'template-2',
              delayDays: 7,
            },
          ],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-03-10T14:30:00Z',
        },
        {
          _id: '2',
          name: 'Seguimiento Ortodoncia',
          description: 'Recordatorios para pacientes en tratamiento de ortodoncia',
          isActive: true,
          trigger: {
            type: 'treatment_completed',
            details: {
              treatmentId: 'ortodoncia',
            },
            daysAfter: 30,
          },
          communicationSequence: [
            {
              step: 1,
              channel: 'whatsapp',
              templateId: 'template-3',
              delayDays: 0,
            },
            {
              step: 2,
              channel: 'sms',
              templateId: 'template-4',
              delayDays: 3,
            },
          ],
          createdAt: '2024-02-01T09:00:00Z',
          updatedAt: '2024-03-05T11:15:00Z',
        },
        {
          _id: '3',
          name: 'Revisión Anual',
          description: 'Recordatorio para pacientes que no han visitado la clínica en más de 12 meses',
          isActive: true,
          trigger: {
            type: 'last_visit',
            details: {},
            daysAfter: 365,
          },
          communicationSequence: [
            {
              step: 1,
              channel: 'email',
              templateId: 'template-5',
              delayDays: 0,
            },
            {
              step: 2,
              channel: 'sms',
              templateId: 'template-6',
              delayDays: 14,
            },
            {
              step: 3,
              channel: 'email',
              templateId: 'template-7',
              delayDays: 30,
            },
          ],
          createdAt: '2024-01-20T11:00:00Z',
          updatedAt: '2024-02-28T16:45:00Z',
        },
        {
          _id: '4',
          name: 'Seguimiento Implante',
          description: 'Recordatorios post-operatorios para pacientes con implantes',
          isActive: true,
          trigger: {
            type: 'treatment_completed',
            details: {
              treatmentId: 'implantologia',
            },
            daysAfter: 90,
          },
          communicationSequence: [
            {
              step: 1,
              channel: 'email',
              templateId: 'template-8',
              delayDays: 0,
            },
            {
              step: 2,
              channel: 'whatsapp',
              templateId: 'template-9',
              delayDays: 7,
            },
          ],
          createdAt: '2024-02-10T08:30:00Z',
          updatedAt: '2024-03-12T10:20:00Z',
        },
        {
          _id: '5',
          name: 'Recordatorio Blanqueamiento',
          description: 'Recordatorio para pacientes que han realizado blanqueamiento dental',
          isActive: false,
          trigger: {
            type: 'treatment_completed',
            details: {
              treatmentId: 'blanqueamiento',
            },
            daysAfter: 365,
          },
          communicationSequence: [
            {
              step: 1,
              channel: 'email',
              templateId: 'template-10',
              delayDays: 0,
            },
          ],
          createdAt: '2024-01-05T12:00:00Z',
          updatedAt: '2024-02-15T09:00:00Z',
        },
        {
          _id: '6',
          name: 'Control Endodoncia',
          description: 'Recordatorio para controles post-endodoncia',
          isActive: true,
          trigger: {
            type: 'treatment_completed',
            details: {
              treatmentId: 'endodoncia',
            },
            daysAfter: 180,
          },
          communicationSequence: [
            {
              step: 1,
              channel: 'sms',
              templateId: 'template-11',
              delayDays: 0,
            },
            {
              step: 2,
              channel: 'email',
              templateId: 'template-12',
              delayDays: 14,
            },
          ],
          createdAt: '2024-02-20T14:00:00Z',
          updatedAt: '2024-03-08T13:30:00Z',
        },
      ];
      
      // Datos falsos de estadísticas
      const statsData: RecallStats = {
        totalCircuits: 6,
        activeCircuits: 5,
        totalMessagesSent: 2847,
        appointmentsBooked: 342,
        conversionRate: 12.01,
        messagesByChannel: {
          email: 1523,
          sms: 987,
          whatsapp: 337,
        },
      };
      
      setCircuitos(circuitosData);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los circuitos de recall');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoCircuito = () => {
    setCircuitoEditando(undefined);
    setMostrarFormulario(true);
  };

  const handleEditarCircuito = (circuito: RecallCircuit) => {
    setCircuitoEditando(circuito);
    setMostrarFormulario(true);
  };

  const handleGuardarCircuito = async (
    circuito: Omit<RecallCircuit, '_id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (circuitoEditando?._id) {
        // Simular actualización
        console.log('Actualizando circuito:', circuitoEditando._id, circuito);
      } else {
        // Simular creación
        console.log('Creando nuevo circuito:', circuito);
      }
      setMostrarFormulario(false);
      setCircuitoEditando(undefined);
      cargarDatos();
    } catch (error: any) {
      alert(error.message || 'Error al guardar el circuito');
    }
  };

  const handleEliminarCircuito = async (id: string) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simular eliminación
      console.log('Eliminando circuito:', id);
      cargarDatos();
    } catch (error) {
      alert('Error al eliminar el circuito');
    }
  };

  const handleToggleActivo = async (id: string, isActive: boolean) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 400));
      // Simular actualización
      console.log('Cambiando estado del circuito:', id, isActive);
      cargarDatos();
    } catch (error) {
      alert('Error al cambiar el estado del circuito');
    }
  };

  const handleVerDetalle = (id: string) => {
    setVistaConfiguracion(id);
  };

  const handlePreviewPacientes = (id: string) => {
    setCircuitoPreviewId(id);
  };

  if (vistaConfiguracion) {
    return (
      <ConfiguracionRecallPage
        circuitId={vistaConfiguracion}
        onVolver={() => setVistaConfiguracion(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Circuitos Automáticos (Recalls)</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los circuitos de comunicación automatizados con pacientes
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={cargarDatos}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={handleNuevoCircuito}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Circuito
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && <RecallStatsWidget stats={stats} />}

      {/* Formulario */}
      {mostrarFormulario && (
        <RecallCircuitForm
          circuito={circuitoEditando}
          onGuardar={handleGuardarCircuito}
          onCancelar={() => {
            setMostrarFormulario(false);
            setCircuitoEditando(undefined);
          }}
          loading={loading}
        />
      )}

      {/* Tabla de Circuitos */}
      {!mostrarFormulario && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <RecallsTable
            circuitos={circuitos}
            onEditar={handleEditarCircuito}
            onEliminar={handleEliminarCircuito}
            onVerDetalle={handleVerDetalle}
            onToggleActivo={handleToggleActivo}
            onPreviewPacientes={handlePreviewPacientes}
            loading={loading}
          />
        </div>
      )}

      {/* Modal de Preview de Pacientes */}
      {circuitoPreviewId && (
        <PatientPreviewModal
          circuitId={circuitoPreviewId}
          onCerrar={() => setCircuitoPreviewId(null)}
        />
      )}
    </div>
  );
}


