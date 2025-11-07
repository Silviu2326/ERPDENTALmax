import { Calendar } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import MobileAgendaView from '../components/MobileAgendaView';
import ReceptionMobileAgendaPage from './ReceptionMobileAgendaPage';

export default function PortalDeCitaOnlineYMovilPage() {
  const { user } = useAuth();

  // Determinar si mostrar la vista de recepción (columnas por profesional)
  // Los roles de recepción y call center ven la vista completa con columnas
  const esRecepcionOCallCenter =
    user?.role === 'recepcionista' || 
    user?.role === 'callcenter' ||
    user?.role === 'propietario' || 
    user?.role === 'director';

  // Si es recepción/call center, mostrar la vista de recepción con columnas
  if (esRecepcionOCallCenter) {
    return <ReceptionMobileAgendaPage />;
  }

  // Para profesionales, mostrar la vista individual optimizada
  const mostrarFiltroProfesional = false;

  // Si el usuario es un profesional, solo ver su propia agenda
  // Nota: En producción, esto debería obtener el ID del profesional asociado al usuario
  const profesionalId = user?.role === 'odontologo' || user?.role === 'higienista' 
    ? (user as any).profesionalId || user.id 
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Calendar size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Portal de Cita Online y Móvil
                </h1>
                <p className="text-gray-600">
                  Vista profesional optimizada para dispositivos móviles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <MobileAgendaView
          profesionalId={profesionalId}
          mostrarFiltroProfesional={mostrarFiltroProfesional}
        />
      </div>
    </div>
  );
}

