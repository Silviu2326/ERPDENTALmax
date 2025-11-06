import { useState } from 'react';
import { Shield, Lock, FileText, AlertTriangle, CheckCircle, UserCog, Gavel, Database } from 'lucide-react';
import RegistroAccesosPage from './RegistroAccesosPage';
import GestionPermisosPage from './GestionPermisosPage';
import GestionRGPDPage from './GestionRGPDPage';
import CopiasSeguridadPage from './CopiasSeguridadPage';

type VistaSeguridad = 'gestion-permisos' | 'registro-accesos' | 'rgpd-lopd' | 'copias-seguridad' | 'politicas-seguridad' | 'auditorias' | 'incidentes';

export default function SeguridadYCumplimientoPage() {
  const [vistaActual, setVistaActual] = useState<VistaSeguridad>('gestion-permisos');

  const renderVista = () => {
    switch (vistaActual) {
      case 'gestion-permisos':
        return <GestionPermisosPage />;
      case 'registro-accesos':
        return <RegistroAccesosPage />;
      case 'rgpd-lopd':
        return <GestionRGPDPage />;
      case 'copias-seguridad':
        return <CopiasSeguridadPage />;
      case 'politicas-seguridad':
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Políticas de Seguridad</h2>
                <p className="text-gray-600">Esta funcionalidad estará disponible próximamente</p>
              </div>
            </div>
          </div>
        );
      case 'auditorias':
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Auditorías</h2>
                <p className="text-gray-600">Esta funcionalidad estará disponible próximamente</p>
              </div>
            </div>
          </div>
        );
      case 'incidentes':
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Incidentes</h2>
                <p className="text-gray-600">Esta funcionalidad estará disponible próximamente</p>
              </div>
            </div>
          </div>
        );
      default:
        return <GestionPermisosPage />;
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
              <h1 className="text-2xl font-bold text-gray-900">Seguridad y Cumplimiento</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gestión de seguridad, auditoría y cumplimiento normativo
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
              onClick={() => setVistaActual('gestion-permisos')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'gestion-permisos'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <UserCog className="w-4 h-4 inline mr-2" />
              Gestión de Permisos
            </button>
            <button
              onClick={() => setVistaActual('registro-accesos')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'registro-accesos'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Registro de Accesos
            </button>
            <button
              onClick={() => setVistaActual('rgpd-lopd')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'rgpd-lopd'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Gavel className="w-4 h-4 inline mr-2" />
              RGPD y LOPD
            </button>
            <button
              onClick={() => setVistaActual('copias-seguridad')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'copias-seguridad'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Database className="w-4 h-4 inline mr-2" />
              Copias de Seguridad
            </button>
            <button
              onClick={() => setVistaActual('politicas-seguridad')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'politicas-seguridad'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Políticas de Seguridad
            </button>
            <button
              onClick={() => setVistaActual('auditorias')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'auditorias'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Auditorías
            </button>
            <button
              onClick={() => setVistaActual('incidentes')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'incidentes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Incidentes
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido */}
      {renderVista()}
    </div>
  );
}

