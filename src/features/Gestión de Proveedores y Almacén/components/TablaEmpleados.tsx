import { useState } from 'react';
import { MoreVertical, Edit, Eye, UserX, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { Empleado } from '../api/empleadosApi';

interface TablaEmpleadosProps {
  empleados: Empleado[];
  loading: boolean;
  onEditar: (empleado: Empleado) => void;
  onVerDetalle: (empleado: Empleado) => void;
  onDesactivar: (empleadoId: string) => void;
}

interface FilaEmpleadoProps {
  empleado: Empleado;
  onEditar: (empleado: Empleado) => void;
  onVerDetalle: (empleado: Empleado) => void;
  onDesactivar: (empleadoId: string) => void;
}

function FilaEmpleado({
  empleado,
  onEditar,
  onVerDetalle,
  onDesactivar,
}: FilaEmpleadoProps) {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const getRolBadge = (rol: string) => {
    const colores: Record<string, { bg: string; text: string }> = {
      Odontologo: { bg: 'bg-blue-100', text: 'text-blue-800' },
      Asistente: { bg: 'bg-purple-100', text: 'text-purple-800' },
      Recepcionista: { bg: 'bg-green-100', text: 'text-green-800' },
      'RR.HH.': { bg: 'bg-orange-100', text: 'text-orange-800' },
      Gerente: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    };

    const color = colores[rol] || { bg: 'bg-gray-100', text: 'text-gray-800' };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text}`}>
        {rol}
      </span>
    );
  };

  const getEstadoBadge = (estado: string) => {
    if (estado === 'Activo') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Activo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Inactivo
      </span>
    );
  };

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
            {empleado.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => onVerDetalle(empleado)}
              className="text-left font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              {empleado.nombre} {empleado.apellidos}
            </button>
            <span className="text-xs text-gray-500">DNI: {empleado.dni}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        {getRolBadge(empleado.rol)}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{empleado.email}</span>
          </div>
          {empleado.telefono && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{empleado.telefono}</span>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        {empleado.sede ? (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{empleado.sede.nombre}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatearFecha(empleado.fechaContratacion)}
      </td>
      <td className="px-4 py-3">
        {getEstadoBadge(empleado.estado)}
      </td>
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setMostrarMenu(!mostrarMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menú de acciones"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          {mostrarMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMostrarMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <button
                  onClick={() => {
                    onVerDetalle(empleado);
                    setMostrarMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalle
                </button>
                <button
                  onClick={() => {
                    onEditar(empleado);
                    setMostrarMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                {empleado.estado === 'Activo' && (
                  <button
                    onClick={() => {
                      if (empleado._id && window.confirm(`¿Está seguro de desactivar a ${empleado.nombre} ${empleado.apellidos}?`)) {
                        onDesactivar(empleado._id);
                      }
                      setMostrarMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                    Desactivar
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function TablaEmpleados({
  empleados,
  loading,
  onEditar,
  onVerDetalle,
  onDesactivar,
}: TablaEmpleadosProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando empleados...</p>
      </div>
    );
  }

  if (empleados.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No se encontraron empleados con los filtros seleccionados</p>
        <p className="text-gray-400 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sede
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Contratación
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {empleados.map((empleado) => (
              <FilaEmpleado
                key={empleado._id}
                empleado={empleado}
                onEditar={onEditar}
                onVerDetalle={onVerDetalle}
                onDesactivar={onDesactivar}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


