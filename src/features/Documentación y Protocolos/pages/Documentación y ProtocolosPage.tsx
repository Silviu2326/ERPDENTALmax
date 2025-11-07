import { useState } from 'react';
import { FileText, Settings, RefreshCw, FileCheck, Pill, Mail, PenTool, Building2, Circle, FileCode, Receipt } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import SelectorPlantillas from '../components/SelectorPlantillas';
import BuscadorPacientes from '../components/BuscadorPacientes';
import VistaPreviaDocumento from '../components/VistaPreviaDocumento';
import ConsentimientosInformadosPage from './ConsentimientosInformadosPage';
import RecetasMedicasPage from './RecetasMedicasPage';
import CartasPacientePage from './CartasPacientePage';
import GestionPlantillasPage from './GestionPlantillasPage';
import EditorPlantillaPage from './EditorPlantillaPage';
import FirmaPresupuestoPage from './FirmaPresupuestoPage';
import OrdenesLaboratorioPage from './OrdenesLaboratorioPage';
import CrearOrdenLaboratorioPage from './CrearOrdenLaboratorioPage';
import DetalleOrdenLaboratorioPage from './DetalleOrdenLaboratorioPage';
import SeguimientoProtesisDashboardPage from './SeguimientoProtesisDashboardPage';
import CrearOrdenProtesisPage from './CrearOrdenProtesisPage';
import DetalleOrdenProtesisPage from './DetalleOrdenProtesisPage';
import EstadosFabricacionPage from './EstadosFabricacionPage';
import DetalleOrdenFabricacionPage from './DetalleOrdenFabricacionPage';
import FacturacionLaboratorioPage from './FacturacionLaboratorioPage';
import {
  PlantillaDocumento,
  generarDocumento,
  guardarDocumento,
} from '../api/documentosApi';
import { DocumentoPlantilla } from '../api/plantillasApi';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  email?: string;
  dni?: string;
}

type Vista = 'principal' | 'consentimientos' | 'recetas' | 'cartas' | 'gestion-plantillas' | 'editor-plantilla' | 'firma-presupuesto' | 'ordenes-laboratorio' | 'crear-orden-laboratorio' | 'detalle-orden-laboratorio' | 'seguimiento-protesis' | 'crear-orden-protesis' | 'detalle-orden-protesis' | 'estados-fabricacion' | 'detalle-orden-fabricacion' | 'facturacion-laboratorio';

export default function DocumentacionYProtocolosPage() {
  const { user } = useAuth();
  const [vista, setVista] = useState<Vista>('principal');
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<PlantillaDocumento | null>(null);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [contenidoGenerado, setContenidoGenerado] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plantillaSeleccionadaParaEditar, setPlantillaSeleccionadaParaEditar] = useState<DocumentoPlantilla | null>(null);
  const [plantillaIdParaEditar, setPlantillaIdParaEditar] = useState<string | null>(null);
  const [presupuestoIdParaFirma, setPresupuestoIdParaFirma] = useState<string | null>(null);
  const [ordenIdSeleccionada, setOrdenIdSeleccionada] = useState<string | null>(null);
  const [protesisIdSeleccionada, setProtesisIdSeleccionada] = useState<string | null>(null);
  const [fabricacionIdSeleccionada, setFabricacionIdSeleccionada] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'director';

  // Si estamos en la vista de consentimientos, mostrar esa página
  if (vista === 'consentimientos') {
    return <ConsentimientosInformadosPage />;
  }

  // Si estamos en la vista de recetas médicas, mostrar esa página
  if (vista === 'recetas') {
    return <RecetasMedicasPage />;
  }

  // Si estamos en la vista de cartas al paciente, mostrar esa página
  if (vista === 'cartas') {
    return <CartasPacientePage />;
  }

  // Si estamos en la vista de gestión de plantillas, mostrar esa página
  if (vista === 'gestion-plantillas') {
    return (
      <GestionPlantillasPage
        onCrearNueva={() => {
          setPlantillaIdParaEditar(null);
          setPlantillaSeleccionadaParaEditar(null);
          setVista('editor-plantilla');
        }}
        onEditar={(plantilla) => {
          setPlantillaIdParaEditar(plantilla._id || null);
          setPlantillaSeleccionadaParaEditar(plantilla);
          setVista('editor-plantilla');
        }}
        onVer={(plantilla) => {
          setPlantillaIdParaEditar(plantilla._id || null);
          setPlantillaSeleccionadaParaEditar(plantilla);
          setVista('editor-plantilla');
        }}
      />
    );
  }

  // Si estamos en la vista de editor de plantilla, mostrar esa página
  if (vista === 'editor-plantilla') {
    return (
      <EditorPlantillaPage
        plantillaId={plantillaIdParaEditar || undefined}
        onVolver={() => {
          setVista('gestion-plantillas');
          setPlantillaIdParaEditar(null);
          setPlantillaSeleccionadaParaEditar(null);
        }}
        onGuardado={() => {
          setVista('gestion-plantillas');
          setPlantillaIdParaEditar(null);
          setPlantillaSeleccionadaParaEditar(null);
        }}
      />
    );
  }

  // Si estamos en la vista de firma de presupuesto, mostrar esa página
  if (vista === 'firma-presupuesto') {
    return (
      <FirmaPresupuestoPage
        presupuestoId={presupuestoIdParaFirma || undefined}
        onVolver={() => {
          setVista('principal');
          setPresupuestoIdParaFirma(null);
        }}
        onFirmado={() => {
          setVista('principal');
          setPresupuestoIdParaFirma(null);
        }}
      />
    );
  }

  // Si estamos en la vista de órdenes a laboratorio, mostrar esa página
  if (vista === 'ordenes-laboratorio') {
    return (
      <OrdenesLaboratorioPage
        onNuevaOrden={() => {
          setOrdenIdSeleccionada(null);
          setVista('crear-orden-laboratorio');
        }}
        onVerDetalle={(ordenId) => {
          setOrdenIdSeleccionada(ordenId);
          setVista('detalle-orden-laboratorio');
        }}
        onEditar={(ordenId) => {
          setOrdenIdSeleccionada(ordenId);
          setVista('detalle-orden-laboratorio');
        }}
      />
    );
  }

  // Si estamos en la vista de crear orden de laboratorio, mostrar esa página
  if (vista === 'crear-orden-laboratorio') {
    return (
      <CrearOrdenLaboratorioPage
        onVolver={() => {
          setVista('ordenes-laboratorio');
          setOrdenIdSeleccionada(null);
        }}
        onOrdenCreada={(ordenId) => {
          setOrdenIdSeleccionada(ordenId);
          setVista('detalle-orden-laboratorio');
        }}
      />
    );
  }

  // Si estamos en la vista de detalle de orden de laboratorio, mostrar esa página
  if (vista === 'detalle-orden-laboratorio' && ordenIdSeleccionada) {
    return (
      <DetalleOrdenLaboratorioPage
        ordenId={ordenIdSeleccionada}
        onVolver={() => {
          setVista('ordenes-laboratorio');
          setOrdenIdSeleccionada(null);
        }}
        onEditar={(ordenId) => {
          setOrdenIdSeleccionada(ordenId);
          // Aquí podrías navegar a una página de edición si la creas
        }}
      />
    );
  }

  // Si estamos en la vista de seguimiento de prótesis, mostrar esa página
  if (vista === 'seguimiento-protesis') {
    return (
      <SeguimientoProtesisDashboardPage
        onNuevaOrden={() => {
          setProtesisIdSeleccionada(null);
          setVista('crear-orden-protesis');
        }}
        onVerDetalle={(protesisId) => {
          setProtesisIdSeleccionada(protesisId);
          setVista('detalle-orden-protesis');
        }}
        onEditar={(protesisId) => {
          setProtesisIdSeleccionada(protesisId);
          setVista('detalle-orden-protesis');
        }}
      />
    );
  }

  // Si estamos en la vista de crear orden de prótesis, mostrar esa página
  if (vista === 'crear-orden-protesis') {
    return (
      <CrearOrdenProtesisPage
        onVolver={() => {
          setVista('seguimiento-protesis');
          setProtesisIdSeleccionada(null);
        }}
        onOrdenCreada={(ordenId) => {
          setProtesisIdSeleccionada(ordenId);
          setVista('detalle-orden-protesis');
        }}
      />
    );
  }

  // Si estamos en la vista de detalle de orden de prótesis, mostrar esa página
  if (vista === 'detalle-orden-protesis' && protesisIdSeleccionada) {
    return (
      <DetalleOrdenProtesisPage
        ordenId={protesisIdSeleccionada}
        onVolver={() => {
          setVista('seguimiento-protesis');
          setProtesisIdSeleccionada(null);
        }}
        onEditar={(ordenId) => {
          setProtesisIdSeleccionada(ordenId);
          // Aquí podrías navegar a una página de edición si la creas
        }}
      />
    );
  }

  // Si estamos en la vista de estados de fabricación, mostrar esa página
  if (vista === 'estados-fabricacion') {
    return (
      <EstadosFabricacionPage
        onVerDetalle={(ordenId) => {
          setFabricacionIdSeleccionada(ordenId);
          setVista('detalle-orden-fabricacion');
        }}
      />
    );
  }

  // Si estamos en la vista de detalle de orden de fabricación, mostrar esa página
  if (vista === 'detalle-orden-fabricacion' && fabricacionIdSeleccionada) {
    return (
      <DetalleOrdenFabricacionPage
        ordenId={fabricacionIdSeleccionada}
        onVolver={() => {
          setVista('estados-fabricacion');
          setFabricacionIdSeleccionada(null);
        }}
      />
    );
  }

  // Si estamos en la vista de facturación de laboratorio, mostrar esa página
  if (vista === 'facturacion-laboratorio') {
    return <FacturacionLaboratorioPage />;
  }

  const handleGenerarDocumento = async () => {
    if (!plantillaSeleccionada || !pacienteSeleccionado) {
      setError('Por favor, selecciona una plantilla y un paciente');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resultado = await generarDocumento({
        plantillaId: plantillaSeleccionada._id!,
        pacienteId: pacienteSeleccionado._id,
      });

      setContenidoGenerado(resultado.contenidoHtml);
    } catch (err) {
      setError('Error al generar el documento. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarDocumento = async () => {
    if (!plantillaSeleccionada || !pacienteSeleccionado || !contenidoGenerado) {
      setError('No hay documento para guardar');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await guardarDocumento({
        pacienteId: pacienteSeleccionado._id,
        plantillaId: plantillaSeleccionada._id!,
        contenidoFinal: contenidoGenerado,
        formato: 'HTML',
      });

      alert('Documento guardado correctamente en el historial del paciente');
    } catch (err) {
      setError('Error al guardar el documento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarPDF = async () => {
    // Esta funcionalidad se implementaría en el backend
    alert('Funcionalidad de generación de PDF pendiente de implementar en el backend');
  };

  const handleEnviarEmail = async () => {
    // Esta funcionalidad se implementaría en el backend
    alert('Funcionalidad de envío por email pendiente de implementar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileText size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Documentación y Protocolos
                  </h1>
                  <p className="text-gray-600">
                    Generador de documentos y gestión de plantillas
                  </p>
                </div>
              </div>
              
              {/* Toolbar de acciones */}
              <div className="flex items-center justify-end gap-2 flex-wrap">
                <button
                  onClick={() => {
                    const presupuestoId = prompt('Ingrese el ID del presupuesto a firmar:');
                    if (presupuestoId) {
                      setPresupuestoIdParaFirma(presupuestoId);
                      setVista('firma-presupuesto');
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
                >
                  <PenTool size={18} />
                  <span>Firma de Presupuestos</span>
                </button>
                <button
                  onClick={() => setVista('cartas')}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
                >
                  <Mail size={18} />
                  <span>Cartas al Paciente</span>
                </button>
                <button
                  onClick={() => setVista('recetas')}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
                >
                  <Pill size={18} />
                  <span>Recetas Médicas</span>
                </button>
                <button
                  onClick={() => setVista('consentimientos')}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
                >
                  <FileCheck size={18} />
                  <span>Consentimientos</span>
                </button>
                <button
                  onClick={() => setVista('ordenes-laboratorio')}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
                >
                  <Building2 size={18} />
                  <span>Órdenes Laboratorio</span>
                </button>
                <button
                  onClick={() => setVista('facturacion-laboratorio')}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
                >
                  <Receipt size={18} />
                  <span>Facturación Lab</span>
                </button>
                <button
                  onClick={() => setVista('seguimiento-protesis')}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
                >
                  <Circle size={18} />
                  <span>Prótesis</span>
                </button>
                <button
                  onClick={() => setVista('estados-fabricacion')}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
                >
                  <FileCode size={18} />
                  <span>Fabricación</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setVista('gestion-plantillas')}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
                  >
                    <Settings size={18} />
                    <span>Gestionar Plantillas</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl ring-1 ring-red-200/70">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel izquierdo: Selección */}
            <div className="lg:col-span-1 space-y-6">
              {/* Selector de Plantilla */}
              <div className="bg-white rounded-xl shadow-sm p-4 ring-1 ring-slate-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Seleccionar Plantilla</h2>
                <SelectorPlantillas
                  plantillaSeleccionada={plantillaSeleccionada}
                  onPlantillaSeleccionada={setPlantillaSeleccionada}
                />
              </div>

              {/* Buscador de Paciente */}
              <div className="bg-white rounded-xl shadow-sm p-4 ring-1 ring-slate-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Seleccionar Paciente</h2>
                <BuscadorPacientes
                  pacienteSeleccionado={pacienteSeleccionado}
                  onPacienteSeleccionado={setPacienteSeleccionado}
                />
              </div>

              {/* Botón de Generar */}
              <div className="bg-white rounded-xl shadow-sm p-4 ring-1 ring-slate-200">
                <button
                  onClick={handleGenerarDocumento}
                  disabled={!plantillaSeleccionada || !pacienteSeleccionado || loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      <span>Generar Documento</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Panel derecho: Vista Previa */}
            <div className="lg:col-span-2">
              <VistaPreviaDocumento
                contenidoHtml={contenidoGenerado}
                nombrePlantilla={plantillaSeleccionada?.nombre}
                onGenerarPDF={handleGenerarPDF}
                onImprimir={() => window.print()}
                onEnviarEmail={handleEnviarEmail}
                onGuardar={handleGuardarDocumento}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

