import { useState } from 'react';
import { Stethoscope, FileText, Heart, Activity, Brain, Eye, ClipboardCheck, Tooth, Calendar, Layers, Zap, TrendingUp, Baby, Shield, Package } from 'lucide-react';
import PlanificacionEndodonciaPage from './PlanificacionEndodonciaPage';
import EndodonciaControlPostoperatorioPage from './EndodonciaControlPostoperatorioPage';
import PeriodontogramaPage from './PeriodontogramaPage';
import MantenimientoPeriodontalPage from './MantenimientoPeriodontalPage';
import PlanificacionImplantologia3DPage from './PlanificacionImplantologia3DPage';
import CargaInmediataProtocoloPage from './CargaInmediataProtocoloPage';
import ControlOsteointegracionPage from './ControlOsteointegracionPage';
import OrtodonciaDiagnosticoPage from './OrtodonciaDiagnosticoPage';
import PlanTratamientoOrtodonciaPage from './PlanTratamientoOrtodonciaPage';
import DetallePlanTratamientoOrtodonciaPage from './DetallePlanTratamientoOrtodonciaPage';
import OrtodonciaRetencionPage from './OrtodonciaRetencionPage';
import FichaPediatricaPage from './FichaPediatricaPage';
import OdontopediatriaFluorSelladoresPage from './OdontopediatriaFluorSelladoresPage';
import CirugiaIntraoperatorioPage from './CirugiaIntraoperatorioPage';
import CirugiaOralPostoperatorioPage from './CirugiaOralPostoperatorioPage';
import BlanqueamientoDentalPacientePage from './BlanqueamientoDentalPacientePage';
import ProtesisRemovibleAjusteEntregaPage from './ProtesisRemovibleAjusteEntregaPage';
import AtmDolorOrofacialPage from './AtmDolorOrofacialPage';

type EspecialidadActiva = 'endodoncia' | 'endodoncia-control' | 'periodoncia' | 'mantenimiento-periodontal' | 'implantologia-3d' | 'carga-inmediata' | 'osteointegracion' | 'ortodoncia' | 'ortodoncia-plan-tratamiento' | 'ortodoncia-retencion' | 'odontopediatria' | 'odontopediatria-fluor-selladores' | 'cirugia-oral-intraoperatorio' | 'cirugia-oral-postoperatorio' | 'estetica' | 'protesis-removible' | 'atm-dolor-orofacial' | null;

interface EspecialidadesClinicasPageProps {
  pacienteId?: string;
  tratamientoId?: string;
  diente?: number;
  onRegistroEndodoncia?: (tratamientoId: string, pacienteId: string, diente: number) => void;
}

export default function EspecialidadesClinicasPage({ 
  pacienteId: pacienteIdProp, 
  tratamientoId: tratamientoIdProp,
  diente: dienteProp,
  onRegistroEndodoncia
}: EspecialidadesClinicasPageProps) {
  const [especialidadActiva, setEspecialidadActiva] = useState<EspecialidadActiva>(null);
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [tratamientoId, setTratamientoId] = useState<string>(tratamientoIdProp || '');
  const [diente, setDiente] = useState<number | undefined>(dienteProp);
  const [planTratamientoId, setPlanTratamientoId] = useState<string | null>(null);

  const especialidades = [
    {
      id: 'endodoncia' as const,
      nombre: 'Endodoncia',
      descripcion: 'Planificación de tratamientos de conducto radicular',
      icono: FileText,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'endodoncia-control' as const,
      nombre: 'Control Postoperatorio - Endodoncia',
      descripcion: 'Seguimiento y evaluación de tratamientos de endodoncia',
      icono: ClipboardCheck,
      color: 'from-green-600 to-emerald-600',
    },
    {
      id: 'periodoncia' as const,
      nombre: 'Periodoncia',
      descripcion: 'Periodontograma avanzado y diagnóstico periodontal',
      icono: Tooth,
      color: 'from-teal-600 to-cyan-600',
    },
    {
      id: 'mantenimiento-periodontal' as const,
      nombre: 'Mantenimiento Periodontal',
      descripcion: 'Seguimiento y control a largo plazo de pacientes periodontales',
      icono: Calendar,
      color: 'from-teal-600 to-cyan-600',
    },
    {
      id: 'implantologia-3d' as const,
      nombre: 'Implantología: Planificación 3D',
      descripcion: 'Planificación 3D de implantes dentales mediante CBCT',
      icono: Layers,
      color: 'from-purple-600 to-indigo-600',
    },
    {
      id: 'carga-inmediata' as const,
      nombre: 'Implantología: Carga Inmediata',
      descripcion: 'Protocolos de carga inmediata con seguimiento completo',
      icono: Zap,
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'osteointegracion' as const,
      nombre: 'Implantología: Control de Osteointegración',
      descripcion: 'Seguimiento riguroso del proceso de osteointegración de implantes',
      icono: TrendingUp,
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'cirugia-oral-intraoperatorio' as const,
      nombre: 'Cirugía Oral: Intraoperatorio',
      descripcion: 'Registro en tiempo real durante procedimientos quirúrgicos orales',
      icono: Activity,
      color: 'from-red-600 to-rose-600',
    },
    {
      id: 'cirugia-oral-postoperatorio' as const,
      nombre: 'Cirugía Oral: Postoperatorio',
      descripcion: 'Gestión y seguimiento del cuidado postoperatorio de cirugías orales',
      icono: ClipboardCheck,
      color: 'from-orange-600 to-amber-600',
    },
    {
      id: 'ortodoncia' as const,
      nombre: 'Ortodoncia: Diagnóstico',
      descripcion: 'Gestión de fotos, modelos y registros diagnósticos ortodóncicos',
      icono: Brain,
      color: 'from-purple-600 to-violet-600',
    },
    {
      id: 'ortodoncia-plan-tratamiento' as const,
      nombre: 'Ortodoncia: Plan de Tratamiento',
      descripcion: 'Documentación, planificación y gestión integral de tratamientos de ortodoncia',
      icono: FileText,
      color: 'from-purple-600 to-violet-600',
    },
    {
      id: 'ortodoncia-retencion' as const,
      nombre: 'Ortodoncia: Retención y Contención',
      descripcion: 'Gestión de planes de retención post-ortodoncia y seguimiento a largo plazo',
      icono: Calendar,
      color: 'from-purple-600 to-violet-600',
    },
    {
      id: 'estetica' as const,
      nombre: 'Estética Dental: Blanqueamiento',
      descripcion: 'Planificación, ejecución y seguimiento de tratamientos de blanqueamiento dental',
      icono: Eye,
      color: 'from-pink-600 to-fuchsia-600',
    },
    {
      id: 'odontopediatria' as const,
      nombre: 'Odontopediatría: Fichas Pediátricas',
      descripcion: 'Registro y seguimiento de pacientes infantiles con odontograma mixto',
      icono: Baby,
      color: 'from-cyan-600 to-blue-600',
    },
    {
      id: 'odontopediatria-fluor-selladores' as const,
      nombre: 'Odontopediatría: Fluorizaciones y Selladores',
      descripcion: 'Registro y seguimiento de aplicaciones preventivas (flúor y selladores)',
      icono: Shield,
      color: 'from-cyan-600 to-blue-600',
    },
    {
      id: 'protesis-removible' as const,
      nombre: 'Prótesis Removible: Ajustes y Entrega',
      descripcion: 'Gestión de ajustes, pruebas y entrega final de prótesis removibles',
      icono: Package,
      color: 'from-amber-600 to-orange-600',
    },
    {
      id: 'atm-dolor-orofacial' as const,
      nombre: 'ATM y Dolor Orofacial',
      descripcion: 'Evaluación y seguimiento de trastornos temporomandibulares y dolor orofacial',
      icono: Activity,
      color: 'from-red-600 to-pink-600',
    },
  ];

  const handleSeleccionarEspecialidad = (id: EspecialidadActiva) => {
    setEspecialidadActiva(id);
  };

  if (especialidadActiva === 'endodoncia') {
    return (
      <PlanificacionEndodonciaPage
        pacienteId={pacienteId}
        tratamientoId={tratamientoId}
        diente={diente}
        onVolver={() => setEspecialidadActiva(null)}
        onRegistroEndodoncia={onRegistroEndodoncia}
      />
    );
  }

  if (especialidadActiva === 'endodoncia-control') {
    return (
      <EndodonciaControlPostoperatorioPage
        tratamientoId={tratamientoId}
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'periodoncia') {
    return (
      <PeriodontogramaPage
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'mantenimiento-periodontal') {
    return (
      <MantenimientoPeriodontalPage
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'implantologia-3d') {
    return (
      <PlanificacionImplantologia3DPage
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'carga-inmediata') {
    return (
      <CargaInmediataProtocoloPage
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'osteointegracion') {
    return (
      <ControlOsteointegracionPage
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'ortodoncia') {
    return (
      <OrtodonciaDiagnosticoPage
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'ortodoncia-plan-tratamiento') {
    if (planTratamientoId) {
      return (
        <DetallePlanTratamientoOrtodonciaPage
          planId={planTratamientoId}
          onVolver={() => setPlanTratamientoId(null)}
          onGuardado={() => setPlanTratamientoId(null)}
        />
      );
    }
    return (
      <PlanTratamientoOrtodonciaPage
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
        onVerDetalle={(planId) => setPlanTratamientoId(planId)}
        onEditar={(planId) => setPlanTratamientoId(planId)}
        onCrearNuevo={() => {
          // Por ahora, redirigir a la lista. En el futuro se podría crear una página de creación
          alert('Funcionalidad de creación de nuevo plan - próximamente');
        }}
      />
    );
  }

  if (especialidadActiva === 'ortodoncia-retencion') {
    return (
      <OrtodonciaRetencionPage
        pacienteId={pacienteId}
        tratamientoId={tratamientoId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'odontopediatria') {
    if (!pacienteId) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-lg max-w-md w-full">
            <div className="text-center">
              <Baby className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Seleccione un Paciente</h2>
              <p className="text-gray-600 mb-4">Para acceder a la ficha pediátrica, necesita seleccionar un paciente primero.</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">ID del Paciente</label>
                <input
                  type="text"
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                  placeholder="Ingrese el ID del paciente"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setEspecialidadActiva(null)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <FichaPediatricaPage
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'odontopediatria-fluor-selladores') {
    return (
      <OdontopediatriaFluorSelladoresPage
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'cirugia-oral-intraoperatorio') {
    return (
      <CirugiaIntraoperatorioPage
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'cirugia-oral-postoperatorio') {
    return (
      <CirugiaOralPostoperatorioPage
        tratamientoId={tratamientoId}
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'estetica') {
    return (
      <BlanqueamientoDentalPacientePage
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'protesis-removible') {
    return (
      <ProtesisRemovibleAjusteEntregaPage
        tratamientoId={tratamientoId}
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  if (especialidadActiva === 'atm-dolor-orofacial') {
    return (
      <AtmDolorOrofacialPage
        pacienteId={pacienteId}
        onVolver={() => setEspecialidadActiva(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Especialidades Clínicas</h1>
              <p className="text-sm text-gray-600">Planificación y gestión de tratamientos especializados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Seleccione una especialidad</h2>
          <p className="text-gray-600">Elija la especialidad clínica para la que desea planificar un tratamiento</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {especialidades.map((especialidad) => {
            const Icono = especialidad.icono;
            return (
              <button
                key={especialidad.id}
                onClick={() => handleSeleccionarEspecialidad(especialidad.id)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 text-left border-2 border-transparent hover:border-blue-300 group"
              >
                <div className={`bg-gradient-to-br ${especialidad.color} p-4 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <Icono className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{especialidad.nombre}</h3>
                <p className="text-sm text-gray-600">{especialidad.descripcion}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

