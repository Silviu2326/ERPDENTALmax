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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm border-b px-4 py-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Agenda Mobile</h1>
          <p className="text-sm text-gray-600 mt-1">
            Vista profesional optimizada para dispositivos móviles
          </p>
        </div>

        <MobileAgendaView
          profesionalId={profesionalId}
          mostrarFiltroProfesional={mostrarFiltroProfesional}
        />
      </div>
    </div>
  );
}

