import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import RentabilidadDashboard from '../components/RentabilidadDashboard';

export default function RentabilidadAnalisisPage() {
  // Inicializar fechas con el mes en curso
  const [fechaInicio, setFechaInicio] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setDate(1); // Primer día del mes
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  });

  const [fechaFin, setFechaFin] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setHours(23, 59, 59, 999);
    return fecha;
  });

  const [sedeSeleccionada, setSedeSeleccionada] = useState<string | null>(null);

  // Datos mock de sedes (en producción vendrían de una API)
  const sedes = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

  const handleCambioFecha = (inicio: Date, fin: Date) => {
    setFechaInicio(inicio);
    setFechaFin(fin);
  };

  const handleCambioSede = (sedeId: string | null) => {
    setSedeSeleccionada(sedeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Rentabilidad y Análisis</h2>
            <p className="text-gray-600 mt-1">
              Análisis financiero y rentabilidad de la clínica
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard de Rentabilidad */}
      <RentabilidadDashboard
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        sedeId={sedeSeleccionada}
        sedes={sedes}
        onCambioFecha={handleCambioFecha}
        onCambioSede={handleCambioSede}
      />
    </div>
  );
}


