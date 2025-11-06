import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Wrench } from 'lucide-react';
import { RevisionTecnica } from '../api/revisionesTecnicasApi';

interface CalendarioRevisionesGridProps {
  revisiones: RevisionTecnica[];
  fechaInicio: Date;
  fechaFin: Date;
  vista: 'dia' | 'semana' | 'mes';
  onRevisionClick: (revision: RevisionTecnica) => void;
  onSlotClick: (fecha: Date) => void;
}

const getColorPorEstado = (estado: string) => {
  switch (estado) {
    case 'Programada':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'Completada':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'Retrasada':
      return 'bg-red-100 border-red-300 text-red-800';
    case 'Cancelada':
      return 'bg-gray-100 border-gray-300 text-gray-600';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

export default function CalendarioRevisionesGrid({
  revisiones,
  fechaInicio,
  fechaFin,
  vista,
  onRevisionClick,
  onSlotClick,
}: CalendarioRevisionesGridProps) {
  const [fechaActual, setFechaActual] = useState(new Date(fechaInicio));

  const horasDelDia = Array.from({ length: 14 }, (_, i) => {
    const hora = 8 + i; // De 8:00 a 21:00
    return `${hora.toString().padStart(2, '0')}:00`;
  });

  const getDiasVista = () => {
    const dias: Date[] = [];
    const inicio = new Date(fechaActual);
    
    if (vista === 'dia') {
      dias.push(new Date(inicio));
    } else if (vista === 'semana') {
      // Lunes de la semana
      const diaSemana = inicio.getDay();
      const lunes = new Date(inicio);
      lunes.setDate(inicio.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
      
      for (let i = 0; i < 7; i++) {
        const dia = new Date(lunes);
        dia.setDate(lunes.getDate() + i);
        dias.push(dia);
      }
    } else {
      // Mes: mostrar solo la semana actual simplificada
      const diaSemana = inicio.getDay();
      const lunes = new Date(inicio);
      lunes.setDate(inicio.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
      
      for (let i = 0; i < 7; i++) {
        const dia = new Date(lunes);
        dia.setDate(lunes.getDate() + i);
        dias.push(dia);
      }
    }
    
    return dias;
  };

  const getRevisionesPorDiaYHora = (dia: Date, hora: string) => {
    const [horaStr] = hora.split(':');
    const horaInicio = new Date(dia);
    horaInicio.setHours(parseInt(horaStr), 0, 0, 0);
    const horaFin = new Date(horaInicio);
    horaFin.setHours(horaFin.getHours() + 1);

    return revisiones.filter((revision) => {
      const fechaProgramada = new Date(revision.fechaProgramada);
      
      return (
        fechaProgramada >= horaInicio &&
        fechaProgramada < horaFin &&
        fechaProgramada.toDateString() === dia.toDateString()
      );
    });
  };

  const navegarFecha = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    if (vista === 'dia') {
      nuevaFecha.setDate(nuevaFecha.getDate() + (direccion === 'siguiente' ? 1 : -1));
    } else if (vista === 'semana') {
      nuevaFecha.setDate(nuevaFecha.getDate() + (direccion === 'siguiente' ? 7 : -7));
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + (direccion === 'siguiente' ? 1 : -1));
    }
    setFechaActual(nuevaFecha);
  };

  const irHoy = () => {
    setFechaActual(new Date());
  };

  const dias = getDiasVista();
  const nombreDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const nombreMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getTituloVista = () => {
    if (vista === 'dia') {
      return fechaActual.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } else if (vista === 'semana') {
      const inicioSemana = dias[0];
      const finSemana = dias[dias.length - 1];
      return `${inicioSemana.getDate()} - ${finSemana.getDate()} de ${nombreMeses[inicioSemana.getMonth()]} ${inicioSemana.getFullYear()}`;
    } else {
      return `${nombreMeses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navegarFecha('anterior')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            {getTituloVista()}
          </h3>
          <button
            onClick={() => navegarFecha('siguiente')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={irHoy}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Hoy
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {dias.map((dia, index) => (
              <div
                key={index}
                className={`p-3 text-center border-r border-gray-200 last:border-r-0 ${
                  dia.toDateString() === new Date().toDateString()
                    ? 'bg-blue-50 font-semibold'
                    : 'bg-gray-50'
                }`}
              >
                <div className="text-xs text-gray-500 uppercase">
                  {nombreDias[dia.getDay()]}
                </div>
                <div className="text-lg mt-1">
                  {dia.getDate()}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {dias.map((dia, diaIndex) => (
              <div
                key={diaIndex}
                className="border-r border-gray-200 last:border-r-0 min-h-[600px]"
              >
                {horasDelDia.map((hora, horaIndex) => {
                  const revisionesEnSlot = getRevisionesPorDiaYHora(dia, hora);
                  const esHoy = dia.toDateString() === new Date().toDateString();
                  const horaActual = new Date().getHours();
                  const [horaSlot] = hora.split(':');
                  const esHoraPasada = esHoy && parseInt(horaSlot) < horaActual;

                  return (
                    <div
                      key={horaIndex}
                      className={`border-b border-gray-100 p-2 min-h-[80px] ${
                        esHoraPasada ? 'bg-gray-50 opacity-60' : 'hover:bg-blue-50/30'
                      } transition-colors relative group`}
                    >
                      <div className="text-xs text-gray-400 mb-1">{hora}</div>
                      <div className="space-y-1">
                        {revisionesEnSlot.map((revision) => {
                          const fechaRevision = new Date(revision.fechaProgramada);
                          const horaRevision = `${fechaRevision.getHours().toString().padStart(2, '0')}:${fechaRevision.getMinutes().toString().padStart(2, '0')}`;
                          
                          return (
                            <div
                              key={revision._id}
                              onClick={() => onRevisionClick(revision)}
                              className={`${getColorPorEstado(revision.estado)} border rounded px-2 py-1 text-xs cursor-pointer hover:shadow-md transition-shadow`}
                              title={`${revision.equipo.nombre} - ${revision.tecnicoResponsable} - ${horaRevision}`}
                            >
                              <div className="font-semibold truncate">
                                {revision.equipo.nombre}
                              </div>
                              <div className="text-xs truncate text-gray-600">
                                {revision.tecnicoResponsable}
                              </div>
                              <div className="text-xs">{horaRevision}</div>
                            </div>
                          );
                        })}
                      </div>
                      {revisionesEnSlot.length === 0 && (
                        <button
                          onClick={() => {
                            const fechaSlot = new Date(dia);
                            const [horaStr] = hora.split(':');
                            fechaSlot.setHours(parseInt(horaStr), 0, 0, 0);
                            onSlotClick(fechaSlot);
                          }}
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <Plus className="w-6 h-6 text-blue-600" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


