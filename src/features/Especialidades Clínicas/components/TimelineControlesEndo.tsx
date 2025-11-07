import { Calendar, Plus, Eye } from 'lucide-react';
import { ControlEndodontico } from '../api/controlesEndodonciaApi';
import CardDetalleControlEndo from './CardDetalleControlEndo';

interface TimelineControlesEndoProps {
  controles: ControlEndodontico[];
  onNuevoControl: () => void;
  onVerDetalle?: (control: ControlEndodontico) => void;
  onEditar?: (control: ControlEndodontico) => void;
  onEliminar?: (control: ControlEndodontico) => void;
}

export default function TimelineControlesEndo({
  controles,
  onNuevoControl,
  onVerDetalle,
  onEditar,
  onEliminar,
}: TimelineControlesEndoProps) {
  // Ordenar controles por fecha (más recientes primero)
  const controlesOrdenados = [...controles].sort((a, b) => {
    return new Date(b.fechaControl).getTime() - new Date(a.fechaControl).getTime();
  });

  if (controlesOrdenados.length === 0) {
    return (
      <div className="bg-white shadow-sm p-8 text-center">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay controles registrados
        </h3>
        <p className="text-gray-600 mb-4">
          Comience registrando el primer control postoperatorio para este tratamiento.
        </p>
        <button
          onClick={onNuevoControl}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Registrar Primer Control
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <button
          onClick={onNuevoControl}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Control
        </button>
      </div>

      {/* Timeline de controles */}
      <div className="relative">
        {/* Línea vertical del timeline */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>

        <div className="space-y-6">
          {controlesOrdenados.map((control, index) => {
            const fechaControl = new Date(control.fechaControl);
            const fechaFormateada = fechaControl.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            const tiempoTranscurrido = Math.floor(
              (new Date().getTime() - fechaControl.getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div key={control._id || index} className="relative pl-20">
                {/* Punto del timeline */}
                <div className="absolute left-6 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                {/* Contenido del control */}
                <div className="ml-4">
                  <CardDetalleControlEndo
                    control={control}
                    onEditar={onEditar ? () => onEditar(control) : undefined}
                    onEliminar={onEliminar ? () => onEliminar(control) : undefined}
                  />

                  {/* Información adicional del timeline */}
                  <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                    <span>{fechaFormateada}</span>
                    {tiempoTranscurrido > 0 && (
                      <span>
                        {tiempoTranscurrido === 1
                          ? 'Hace 1 día'
                          : tiempoTranscurrido < 30
                          ? `Hace ${tiempoTranscurrido} días`
                          : tiempoTranscurrido < 365
                          ? `Hace ${Math.floor(tiempoTranscurrido / 30)} meses`
                          : `Hace ${Math.floor(tiempoTranscurrido / 365)} años`}
                      </span>
                    )}
                    {onVerDetalle && (
                      <button
                        onClick={() => onVerDetalle(control)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Eye size={16} />
                        Ver detalles
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



