import { Building2, MapPin, Globe, Mail, Phone, Briefcase } from 'lucide-react';
import { EmpresaObjetivo, EstadoEmpresa } from '../api/abmApi';

interface AbmEmpresaProfileCardProps {
  empresa: EmpresaObjetivo;
  onActualizarEstado?: (empresaId: string, nuevoEstado: EstadoEmpresa) => void;
}

const ESTADO_COLORS: Record<EstadoEmpresa, string> = {
  Identificada: 'bg-gray-500',
  Contactada: 'bg-blue-500',
  Negociando: 'bg-yellow-500',
  Cliente: 'bg-green-500',
  Descartada: 'bg-red-500',
};

export default function AbmEmpresaProfileCard({
  empresa,
  onActualizarEstado,
}: AbmEmpresaProfileCardProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Building2 size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{empresa.nombre}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Briefcase size={16} />
                <span className="font-medium">{empresa.sector}</span>
              </div>
              <span>•</span>
              <span>{empresa.tamano}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold text-white ${ESTADO_COLORS[empresa.estado]}`}
        >
          {empresa.estado}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {empresa.direccion && (
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dirección</p>
              <p className="text-sm text-gray-900">{empresa.direccion}</p>
            </div>
          </div>
        )}

        {empresa.sitioWeb && (
          <div className="flex items-start gap-3">
            <Globe size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sitio Web</p>
              <a
                href={empresa.sitioWeb}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline text-sm transition-colors"
              >
                {empresa.sitioWeb}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{empresa.contactos?.length || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Contactos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {empresa.campañasAsociadas?.length || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Campañas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {empresa.historialInteracciones?.length || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Interacciones</p>
          </div>
        </div>
      </div>
    </div>
  );
}



