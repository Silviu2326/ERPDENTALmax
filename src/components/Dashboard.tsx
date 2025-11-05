import { useAuth } from '../contexts/AuthContext';
import { ROLE_LABELS } from '../types/auth';
import { Calendar, Users, FileText, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenido, {user.name}
          </h1>
          <p className="text-gray-600 mt-2">
            {ROLE_LABELS[user.role]} - Panel de Control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Citas Hoy</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">24</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pacientes</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">1,248</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tratamientos</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">86</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Ingresos Mes</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">€45.2K</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Próximas Citas</h3>
            <div className="space-y-3">
              {[
                { time: '09:00', patient: 'María García', treatment: 'Limpieza dental' },
                { time: '10:30', patient: 'Juan Pérez', treatment: 'Revisión general' },
                { time: '12:00', patient: 'Ana López', treatment: 'Ortodoncia' },
                { time: '14:30', patient: 'Carlos Ruiz', treatment: 'Implante dental' }
              ].map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-blue-700 font-semibold text-sm px-3 py-1 rounded">
                      {appointment.time}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{appointment.patient}</p>
                      <p className="text-sm text-gray-500">{appointment.treatment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
            <div className="space-y-3">
              {[
                { action: 'Nueva cita registrada', time: 'Hace 5 minutos' },
                { action: 'Historial actualizado', time: 'Hace 15 minutos' },
                { action: 'Pago procesado', time: 'Hace 30 minutos' },
                { action: 'Informe generado', time: 'Hace 1 hora' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
