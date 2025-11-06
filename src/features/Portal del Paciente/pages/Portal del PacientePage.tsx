import { useState, useEffect } from 'react';
import { Calendar, User, FileText, CreditCard, Settings, LogOut, Clock, Stethoscope, Image, Receipt, MessageSquare, ClipboardList, AlertCircle } from 'lucide-react';
import { obtenerEncuestasPendientes, EncuestaRespuesta } from '../api/encuestasApi';

interface PortalDelPacientePageProps {
  onLogout?: () => void;
  onGoToLogin?: () => void;
  onGoToMisCitas?: () => void;
  onGoToMisDocumentos?: () => void;
  onGoToMisImagenes?: () => void;
  onGoToMisPresupuestos?: () => void;
  onGoToMensajeria?: () => void;
  onResponderEncuesta?: (respuestaId: string) => void;
}

export default function PortalDelPacientePage({ onLogout, onGoToLogin, onGoToMisCitas, onGoToMisDocumentos, onGoToMisImagenes, onGoToMisPresupuestos, onGoToMensajeria, onResponderEncuesta }: PortalDelPacientePageProps) {
  const [user, setUser] = useState<any>(null);
  const [encuestasPendientes, setEncuestasPendientes] = useState<EncuestaRespuesta[]>([]);
  const [cargandoEncuestas, setCargandoEncuestas] = useState(true);

  useEffect(() => {
    // Verificar si hay token de paciente
    const token = localStorage.getItem('patientToken');
    if (!token) {
      if (onGoToLogin) {
        onGoToLogin();
      }
      return;
    }

    // Aquí se podría cargar la información del paciente desde el backend
    // Por ahora, usamos datos mock
    setUser({
      nombre: 'Paciente',
      apellidos: 'Ejemplo',
      email: 'paciente@example.com',
    });

    // Cargar encuestas pendientes
    cargarEncuestasPendientes();
  }, [onGoToLogin]);

  const cargarEncuestasPendientes = async () => {
    try {
      setCargandoEncuestas(true);
      const encuestas = await obtenerEncuestasPendientes();
      setEncuestasPendientes(encuestas);
    } catch (error) {
      // Silenciar errores si no hay encuestas o hay problemas de autenticación
      console.error('Error al cargar encuestas:', error);
      setEncuestasPendientes([]);
    } finally {
      setCargandoEncuestas(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    if (onLogout) {
      onLogout();
    } else if (onGoToLogin) {
      onGoToLogin();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portal del Paciente</h1>
                <p className="text-sm text-gray-600">
                  Bienvenido, {user.nombre} {user.apellidos}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Mis Citas */}
          <div 
            onClick={onGoToMisCitas}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mis Citas</h3>
                <p className="text-sm text-gray-600">Ver y gestionar tus citas</p>
              </div>
            </div>
          </div>

          {/* Mi Perfil */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mi Perfil</h3>
                <p className="text-sm text-gray-600">Actualizar información personal</p>
              </div>
            </div>
          </div>

          {/* Mis Documentos */}
          <div 
            onClick={onGoToMisDocumentos}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mis Documentos</h3>
                <p className="text-sm text-gray-600">Consentimientos, recetas y planes</p>
              </div>
            </div>
          </div>

          {/* Mis Imágenes */}
          <div 
            onClick={onGoToMisImagenes}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-cyan-100 p-3 rounded-lg">
                <Image className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mis Imágenes</h3>
                <p className="text-sm text-gray-600">Radiografías y fotos clínicas</p>
              </div>
            </div>
          </div>

          {/* Historia Clínica */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Historia Clínica</h3>
                <p className="text-sm text-gray-600">Ver tu historial médico</p>
              </div>
            </div>
          </div>

          {/* Facturas y Pagos */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Facturas y Pagos</h3>
                <p className="text-sm text-gray-600">Consultar facturas y pagos</p>
              </div>
            </div>
          </div>

          {/* Mis Presupuestos */}
          <div 
            onClick={onGoToMisPresupuestos}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Receipt className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mis Presupuestos</h3>
                <p className="text-sm text-gray-600">Revisa y aprueba tus presupuestos</p>
              </div>
            </div>
          </div>

          {/* Mensajería Segura */}
          <div 
            onClick={onGoToMensajeria}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mensajería Segura</h3>
                <p className="text-sm text-gray-600">Comunícate con la clínica</p>
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Configuración</h3>
                <p className="text-sm text-gray-600">Ajustes de cuenta</p>
              </div>
            </div>
          </div>
        </div>

        {/* Encuestas Pendientes */}
        {encuestasPendientes.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border border-yellow-200 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <ClipboardList className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Encuestas Pendientes ({encuestasPendientes.length})
              </h2>
            </div>
            <div className="space-y-3">
              {encuestasPendientes.map((encuesta) => {
                const plantilla = typeof encuesta.plantilla === 'object' ? encuesta.plantilla : null;
                return (
                  <div
                    key={encuesta._id}
                    onClick={() => {
                      if (onResponderEncuesta && encuesta._id) {
                        onResponderEncuesta(encuesta._id);
                      }
                    }}
                    className="bg-white rounded-lg p-4 border border-yellow-200 hover:border-yellow-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {plantilla?.titulo || 'Encuesta de Satisfacción'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {plantilla?.descripcion || 'Comparte tu opinión sobre tu última visita'}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
                      Responder
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Próximas Citas */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Próximas Citas</h2>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No tienes citas programadas</p>
          </div>
        </div>
      </main>
    </div>
  );
}

