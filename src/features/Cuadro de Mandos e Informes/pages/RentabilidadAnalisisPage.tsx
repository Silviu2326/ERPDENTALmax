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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Rentabilidad y Análisis
                </h1>
                <p className="text-gray-600">
                  Análisis financiero y rentabilidad de la clínica
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
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
    </div>
  );
}



