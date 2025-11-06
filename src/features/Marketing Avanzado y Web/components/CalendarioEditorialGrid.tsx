import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { PublicacionSocial, FiltrosPublicaciones, obtenerPublicaciones } from '../api/publicacionesSocialesApi';

interface CalendarioEditorialGridProps {
  vista: 'mes' | 'semana' | 'dia';
  fechaInicio: Date;
  fechaFin: Date;
  filtros: FiltrosPublicaciones;
  onPublicacionClick: (publicacion: PublicacionSocial) => void;
  onNuevaPublicacion: (fecha: Date) => void;
  onReprogramarPublicacion: (publicacionId: string, nuevaFecha: Date) => void;
}

const NOMBRES_DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function CalendarioEditorialGrid({
  vista,
  fechaInicio,
  fechaFin,
  filtros,
  onPublicacionClick,
  onNuevaPublicacion,
  onReprogramarPublicacion,
}: CalendarioEditorialGridProps) {
  const [publicaciones, setPublicaciones] = useState<PublicacionSocial[]>([]);
  const [loading, setLoading] = useState(true);
  const [mesActual, setMesActual] = useState(fechaInicio.getMonth() + 1);
  const [anioActual, setAnioActual] = useState(fechaInicio.getFullYear());

  useEffect(() => {
    const cargarPublicaciones = async () => {
      setLoading(true);
      try {
        const datos = await obtenerPublicaciones({
          ...filtros,
          fechaInicio: fechaInicio.toISOString(),
          fechaFin: fechaFin.toISOString(),
        });
        setPublicaciones(datos);
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
        // Datos mock para desarrollo
        setPublicaciones([]);
      } finally {
        setLoading(false);
      }
    };

    cargarPublicaciones();
  }, [fechaInicio, fechaFin, filtros]);

  const getPublicacionesPorDia = (fecha: Date): PublicacionSocial[] => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return publicaciones.filter((pub) => {
      if (!pub.fechaProgramacion) return false;
      const pubFecha = new Date(pub.fechaProgramacion).toISOString().split('T')[0];
      return pubFecha === fechaStr;
    });
  };

  const getColorPorEstado = (estado: string) => {
    switch (estado) {
      case 'borrador':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'programado':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'publicado':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'archivado':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const renderVistaMes = () => {
    const primerDia = new Date(anioActual, mesActual - 1, 1);
    const ultimoDia = new Date(anioActual, mesActual, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();

    const diasMesAnterior: number[] = [];
    const mesAnterior = mesActual === 1 ? 12 : mesActual - 1;
    const anioMesAnterior = mesActual === 1 ? anioActual - 1 : anioActual;
    const ultimoDiaMesAnterior = new Date(anioMesAnterior, mesAnterior, 0).getDate();

    for (let i = diaInicioSemana - 1; i >= 0; i--) {
      diasMesAnterior.push(ultimoDiaMesAnterior - i);
    }

    const diasMesSiguiente: number[] = [];
    const diasRestantes = 42 - (diasMesAnterior.length + diasEnMes);
    for (let i = 1; i <= diasRestantes; i++) {
      diasMesSiguiente.push(i);
    }

    const hoy = new Date();
    const esHoy = (dia: number) => {
      return hoy.getDate() === dia &&
        hoy.getMonth() + 1 === mesActual &&
        hoy.getFullYear() === anioActual;
    };

    const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
      if (direccion === 'anterior') {
        if (mesActual === 1) {
          setMesActual(12);
          setAnioActual(anioActual - 1);
        } else {
          setMesActual(mesActual - 1);
        }
      } else {
        if (mesActual === 12) {
          setMesActual(1);
          setAnioActual(anioActual + 1);
        } else {
          setMesActual(mesActual + 1);
        }
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => cambiarMes('anterior')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {NOMBRES_MESES[mesActual - 1]} {anioActual}
          </h2>
          <button
            onClick={() => cambiarMes('siguiente')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {NOMBRES_DIAS.map((dia) => (
            <div key={dia} className="text-center font-semibold text-gray-600 py-2">
              {dia}
            </div>
          ))}

          {diasMesAnterior.map((dia) => (
            <div
              key={`prev-${dia}`}
              className="min-h-[100px] p-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400"
            />
          ))}

          {Array.from({ length: diasEnMes }, (_, i) => {
            const dia = i + 1;
            const fecha = new Date(anioActual, mesActual - 1, dia);
            const publicacionesDia = getPublicacionesPorDia(fecha);
            const esHoyDia = esHoy(dia);

            return (
              <div
                key={dia}
                className={`min-h-[100px] p-2 border rounded-lg transition-colors ${
                  esHoyDia
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-semibold ${esHoyDia ? 'text-blue-600' : 'text-gray-700'}`}>
                    {dia}
                  </span>
                  <button
                    onClick={() => onNuevaPublicacion(fecha)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Nueva publicación"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  {publicacionesDia.slice(0, 3).map((pub) => (
                    <div
                      key={pub._id}
                      onClick={() => onPublicacionClick(pub)}
                      className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getColorPorEstado(pub.estado)}`}
                      title={`${pub.contenido.substring(0, 50)}...`}
                    >
                      {pub.contenido.substring(0, 20)}...
                    </div>
                  ))}
                  {publicacionesDia.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{publicacionesDia.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {diasMesSiguiente.map((dia) => (
            <div
              key={`next-${dia}`}
              className="min-h-[100px] p-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400"
            />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {vista === 'mes' && renderVistaMes()}
      {vista === 'semana' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-center text-gray-500">Vista semanal - En desarrollo</p>
        </div>
      )}
      {vista === 'dia' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-center text-gray-500">Vista diaria - En desarrollo</p>
        </div>
      )}
    </div>
  );
}


