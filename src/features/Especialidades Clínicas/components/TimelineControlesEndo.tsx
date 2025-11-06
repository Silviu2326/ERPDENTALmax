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
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No hay controles registrados
          </h3>
          <p className="text-gray-600 mb-6">
            Comience registrando el primer control postoperatorio para este tratamiento.
          </p>
          <button
            onClick={onNuevoControl}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Registrar Primer Control
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de nuevo control */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Controles Postoperatorios</h2>
          <p className="text-sm text-gray-600 mt-1">
            {controlesOrdenados.length} control(es) registrado(s)
          </p>
        </div>
        <button
          onClick={onNuevoControl}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
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
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
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
                        <Eye className="w-4 h-4" />
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


