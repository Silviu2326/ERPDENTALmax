import { useState } from 'react';
import { Shield, Settings, FileText, Eye, Plus } from 'lucide-react';
import PanelConfiguracionPoliticas from '../components/PanelConfiguracionPoliticas';
import TablaSolicitudesDerechos from '../components/TablaSolicitudesDerechos';
import FormularioNuevaSolicitudDerechos from '../components/FormularioNuevaSolicitudDerechos';
import VisorLogsAcceso from '../components/VisorLogsAcceso';

type VistaRGPD = 'configuracion' | 'solicitudes' | 'logs' | 'nueva-solicitud';

export default function GestionRGPDPage() {
  const [vistaActual, setVistaActual] = useState<VistaRGPD>('solicitudes');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const renderVista = () => {
    switch (vistaActual) {
      case 'configuracion':
        return <PanelConfiguracionPoliticas />;
      case 'solicitudes':
        return (
          <div className="space-y-4">
            {mostrarFormulario && (
              <FormularioNuevaSolicitudDerechos
                onGuardado={() => {
                  setMostrarFormulario(false);
                  // Recargar la tabla de solicitudes
                }}
                onCancelar={() => setMostrarFormulario(false)}
              />
            )}
            <TablaSolicitudesDerechos
              onNuevaSolicitud={() => {
                setMostrarFormulario(true);
                setVistaActual('solicitudes');
              }}
            />
          </div>
        );
      case 'logs':
        return <VisorLogsAcceso />;
      default:
        return (
          <div className="space-y-4">
            {mostrarFormulario && (
              <FormularioNuevaSolicitudDerechos
                onGuardado={() => {
                  setMostrarFormulario(false);
                  setVistaActual('solicitudes');
                }}
                onCancelar={() => {
                  setMostrarFormulario(false);
                  setVistaActual('solicitudes');
                }}
              />
            )}
            <TablaSolicitudesDerechos
              onNuevaSolicitud={() => {
                setMostrarFormulario(true);
                setVistaActual('solicitudes');
              }}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Módulo */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cumplimiento RGPD y LOPD</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gestión de consentimientos, solicitudes de derechos y auditoría de accesos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de Submódulos */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-1">
            <button
              onClick={() => {
                setVistaActual('solicitudes');
                setMostrarFormulario(false);
              }}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'solicitudes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Solicitudes de Derechos
            </button>
            <button
              onClick={() => {
                setVistaActual('configuracion');
                setMostrarFormulario(false);
              }}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'configuracion'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configuración
            </button>
            <button
              onClick={() => {
                setVistaActual('logs');
                setMostrarFormulario(false);
              }}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'logs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Logs de Auditoría
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-6 py-6">{renderVista()}</div>
    </div>
  );
}



