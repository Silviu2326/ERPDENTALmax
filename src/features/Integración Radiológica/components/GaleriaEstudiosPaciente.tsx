import { useState, useEffect } from 'react';
import { Loader2, Calendar, FileImage } from 'lucide-react';
import { obtenerEstudiosPorPaciente, RadiografiaEstudio } from '../api/radiologiaApi';

interface GaleriaEstudiosPacienteProps {
  pacienteId: string;
  estudioSeleccionadoId?: string;
  onSeleccionarEstudio: (estudioId: string) => void;
}

export default function GaleriaEstudiosPaciente({
  pacienteId,
  estudioSeleccionadoId,
  onSeleccionarEstudio,
}: GaleriaEstudiosPacienteProps) {
  const [estudios, setEstudios] = useState<RadiografiaEstudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarEstudios = async () => {
      if (!pacienteId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const datos = await obtenerEstudiosPorPaciente(pacienteId);
        // Ordenar por fecha más reciente primero
        const estudiosOrdenados = datos.sort(
          (a, b) => new Date(b.fechaEstudio).getTime() - new Date(a.fechaEstudio).getTime()
        );
        setEstudios(estudiosOrdenados);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar estudios');
      } finally {
        setLoading(false);
      }
    };

    cargarEstudios();
  }, [pacienteId]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTipoEstudioColor = (tipo: string) => {
    const colores: { [key: string]: string } = {
      Panorámica: 'bg-blue-100 text-blue-800',
      Periapical: 'bg-green-100 text-green-800',
      CBCT: 'bg-purple-100 text-purple-800',
      Cefalometría: 'bg-orange-100 text-orange-800',
      Oclusal: 'bg-yellow-100 text-yellow-800',
      'Aleta de mordida': 'bg-pink-100 text-pink-800',
    };
    return colores[tipo] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (estudios.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <FileImage className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No hay estudios radiológicos disponibles para este paciente</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Estudios Radiológicos</h3>
      <div className="grid grid-cols-1 gap-3">
        {estudios.map((estudio) => (
          <button
            key={estudio._id}
            onClick={() => onSeleccionarEstudio(estudio._id)}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              estudioSeleccionadoId === estudio._id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getTipoEstudioColor(estudio.tipoEstudio)}`}>
                {estudio.tipoEstudio}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatearFecha(estudio.fechaEstudio)}</span>
              </div>
            </div>
            {estudio.descripcion && (
              <p className="text-sm text-gray-600 mt-2">{estudio.descripcion}</p>
            )}
            {estudio.series && estudio.series.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {estudio.series.length} serie{estudio.series.length !== 1 ? 's' : ''}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}


