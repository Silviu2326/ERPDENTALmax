import { useState } from 'react';
import { User, Phone, Mail, Calendar, DollarSign, CheckSquare, Square } from 'lucide-react';
import { PacienteLista } from '../api/listasPacientesApi';

interface TablaResultadosPacientesProps {
  pacientes: PacienteLista[];
  loading: boolean;
  pacientesSeleccionados: Set<string>;
  onToggleSeleccionar: (pacienteId: string) => void;
  onToggleSeleccionarTodos: () => void;
  onOrdenar: (campo: string, direccion: 'asc' | 'desc') => void;
  ordenCampo?: string;
  ordenDireccion?: 'asc' | 'desc';
}

export default function TablaResultadosPacientes({
  pacientes,
  loading,
  pacientesSeleccionados,
  onToggleSeleccionar,
  onToggleSeleccionarTodos,
  onOrdenar,
  ordenCampo,
  ordenDireccion,
}: TablaResultadosPacientesProps) {
  const formatearFecha = (fecha?: string) => {
    if (!fecha) return '-';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return '-';
    }
  };

  const formatearSaldo = (saldo?: number) => {
    if (saldo === undefined || saldo === null) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(saldo);
  };

  const todosSeleccionados = pacientes.length > 0 && pacientes.every(p => pacientesSeleccionados.has(p._id));
  const algunosSeleccionados = pacientes.some(p => pacientesSeleccionados.has(p._id));

  const handleSort = (campo: string) => {
    const nuevaDireccion = ordenCampo === campo && ordenDireccion === 'asc' ? 'desc' : 'asc';
    onOrdenar(campo, nuevaDireccion);
  };

  const getSortIcon = (campo: string) => {
    if (ordenCampo !== campo) return null;
    return ordenDireccion === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando pacientes...</p>
        </div>
      </div>
    );
  }

  if (pacientes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center text-gray-500">
          <User className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-lg font-medium">No se encontraron pacientes</p>
          <p className="text-sm mt-2">Ajusta los filtros para obtener resultados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={onToggleSeleccionarTodos}
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  {todosSeleccionados ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('apellidos')}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Nombre Completo
                  {getSortIcon('apellidos') && <span className="text-blue-600">{getSortIcon('apellidos')}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('dni')}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  DNI/NIE
                  {getSortIcon('dni') && <span className="text-blue-600">{getSortIcon('dni')}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Contacto</th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('ultimaVisita')}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Última Visita
                  {getSortIcon('ultimaVisita') && <span className="text-blue-600">{getSortIcon('ultimaVisita')}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('saldo')}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Saldo
                  {getSortIcon('saldo') && <span className="text-blue-600">{getSortIcon('saldo')}</span>}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pacientes.map((paciente) => {
              const estaSeleccionado = pacientesSeleccionados.has(paciente._id);
              return (
                <tr
                  key={paciente._id}
                  className={`hover:bg-blue-50 transition-colors ${estaSeleccionado ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onToggleSeleccionar(paciente._id)}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {estaSeleccionado ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {paciente.nombre} {paciente.apellidos}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {paciente.dni || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex flex-col gap-1">
                      {paciente.telefono && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{paciente.telefono}</span>
                        </div>
                      )}
                      {paciente.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-xs">{paciente.email}</span>
                        </div>
                      )}
                      {!paciente.telefono && !paciente.email && (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {formatearFecha(paciente.ultimaVisita)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className={paciente.saldo && paciente.saldo > 0 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                        {formatearSaldo(paciente.saldo)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {algunosSeleccionados && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-3">
          <p className="text-sm text-blue-700 font-medium">
            {pacientesSeleccionados.size} paciente(s) seleccionado(s)
          </p>
        </div>
      )}
    </div>
  );
}


