import { AlertCircle, Calendar } from 'lucide-react';
import { Autoclave } from '../api/mantenimientoAutoclaveApi';

interface AlertaProximoMantenimientoProps {
  autoclaves: Autoclave[];
  diasAlerta?: number;
}

export default function AlertaProximoMantenimiento({
  autoclaves,
  diasAlerta = 7,
}: AlertaProximoMantenimientoProps) {
  const getDiasProximoMantenimiento = (fecha: Date | string) => {
    const fechaMantenimiento = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaMantenimiento.setHours(0, 0, 0, 0);
    const diffTime = fechaMantenimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const autoclavesConAlerta = autoclaves.filter((autoclave) => {
    if (autoclave.estado !== 'activo') return false;
    const dias = getDiasProximoMantenimiento(autoclave.proximoMantenimiento);
    return dias <= diasAlerta && dias >= -30; // Alerta hasta 30 días después de vencido
  });

  if (autoclavesConAlerta.length === 0) {
    return null;
  }

  const autoclavesVencidos = autoclavesConAlerta.filter((autoclave) => {
    const dias = getDiasProximoMantenimiento(autoclave.proximoMantenimiento);
    return dias < 0;
  });

  const autoclavesProximos = autoclavesConAlerta.filter((autoclave) => {
    const dias = getDiasProximoMantenimiento(autoclave.proximoMantenimiento);
    return dias >= 0;
  });

  return (
    <div className="space-y-3">
      {autoclavesVencidos.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                {autoclavesVencidos.length} Autoclave{autoclavesVencidos.length > 1 ? 's' : ''} con Mantenimiento Vencido
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {autoclavesVencidos.map((autoclave) => {
                    const dias = getDiasProximoMantenimiento(autoclave.proximoMantenimiento);
                    return (
                      <li key={autoclave._id}>
                        <span className="font-medium">{autoclave.nombre}</span> - Mantenimiento vencido hace{' '}
                        {Math.abs(dias)} día{dias !== -1 ? 's' : ''}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {autoclavesProximos.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                {autoclavesProximos.length} Autoclave{autoclavesProximos.length > 1 ? 's' : ''} con Mantenimiento Próximo
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  {autoclavesProximos.map((autoclave) => {
                    const dias = getDiasProximoMantenimiento(autoclave.proximoMantenimiento);
                    return (
                      <li key={autoclave._id}>
                        <span className="font-medium">{autoclave.nombre}</span> - Mantenimiento en {dias} día
                        {dias !== 1 ? 's' : ''}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


