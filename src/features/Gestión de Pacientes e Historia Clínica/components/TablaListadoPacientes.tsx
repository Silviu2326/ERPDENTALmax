import { useState } from 'react';
import { User, Phone, Mail, FileText, Calendar, DollarSign, MoreVertical, Eye, CalendarPlus, CreditCard, FileEdit, Loader2 } from 'lucide-react';
import { Paciente, FiltrosBusquedaPacientes } from '../api/pacientesApi';

interface TablaListadoPacientesProps {
  pacientes: Paciente[];
  loading: boolean;
  filtros: FiltrosBusquedaPacientes;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onVerPaciente: (pacienteId: string) => void;
  onNuevaCita?: (pacienteId: string) => void;
  onRegistrarPago?: (pacienteId: string) => void;
  onGenerarPresupuesto?: (pacienteId: string) => void;
}

interface FilaPacienteProps {
  paciente: Paciente;
  onVerPaciente: (pacienteId: string) => void;
  onNuevaCita?: (pacienteId: string) => void;
  onRegistrarPago?: (pacienteId: string) => void;
  onGenerarPresupuesto?: (pacienteId: string) => void;
}

function FilaPaciente({
  paciente,
  onVerPaciente,
  onNuevaCita,
  onRegistrarPago,
  onGenerarPresupuesto,
}: FilaPacienteProps) {
  const [mostrarMenu, setMostrarMenu] = useState(false);

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

  const getStatusBadge = (status: string) => {
    const styles = {
      activo: 'bg-green-100 text-green-800 ring-1 ring-green-200',
      inactivo: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
      archivado: 'bg-slate-100 text-slate-800 ring-1 ring-slate-200',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles] || styles.activo
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3">
        <button
          onClick={() => onVerPaciente(paciente._id || '')}
          className="text-left font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          {paciente.nombre} {paciente.apellidos}
        </button>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {paciente.DNI || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {paciente.numeroHistoriaClinica || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        <div className="flex flex-col gap-1">
          {paciente.telefonos && paciente.telefonos.length > 0 ? (
            paciente.telefonos.map((tel, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{tel}</span>
              </div>
            ))
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {paciente.email || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {formatearFecha(paciente.ultimaVisita)}
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={paciente.saldoPendiente && paciente.saldoPendiente > 0 ? 'text-red-600 font-medium' : 'text-slate-600'}>
          {formatearSaldo(paciente.saldoPendiente)}
        </span>
      </td>
      <td className="px-4 py-3">
        {getStatusBadge(paciente.status)}
      </td>
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setMostrarMenu(!mostrarMenu)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Menú de acciones"
          >
            <MoreVertical className="w-4 h-4 text-slate-600" />
          </button>

          {mostrarMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMostrarMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-slate-200 z-20 py-1">
                <button
                  onClick={() => {
                    onVerPaciente(paciente._id || '');
                    setMostrarMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ver ficha completa
                </button>
                {onNuevaCita && (
                  <button
                    onClick={() => {
                      onNuevaCita(paciente._id || '');
                      setMostrarMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    Nueva cita
                  </button>
                )}
                {onRegistrarPago && (
                  <button
                    onClick={() => {
                      onRegistrarPago(paciente._id || '');
                      setMostrarMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    Registrar pago
                  </button>
                )}
                {onGenerarPresupuesto && (
                  <button
                    onClick={() => {
                      onGenerarPresupuesto(paciente._id || '');
                      setMostrarMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                  >
                    <FileEdit className="w-4 h-4" />
                    Generar presupuesto
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

export default function TablaListadoPacientes({
  pacientes,
  loading,
  filtros,
  onSortChange,
  onVerPaciente,
  onNuevaCita,
  onRegistrarPago,
  onGenerarPresupuesto,
}: TablaListadoPacientesProps) {
  const [sortBy, setSortBy] = useState<string>(filtros.sortBy || 'apellidos');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(filtros.sortOrder || 'asc');

  const handleSort = (campo: string) => {
    const nuevoOrder = sortBy === campo && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(campo);
    setSortOrder(nuevoOrder);
    onSortChange(campo, nuevoOrder);
  };

  const SortIcon = ({ campo }: { campo: string }) => {
    if (sortBy !== campo) {
      return <span className="text-gray-400 ml-1">↕</span>;
    }
    return sortOrder === 'asc' ? (
      <span className="text-blue-600 ml-1">↑</span>
    ) : (
      <span className="text-blue-600 ml-1">↓</span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (pacientes.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron pacientes</h3>
        <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('apellidos')}
                  className="flex items-center hover:text-blue-600 transition-colors"
                >
                  Paciente
                  <SortIcon campo="apellidos" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('DNI')}
                  className="flex items-center hover:text-blue-600 transition-colors"
                >
                  DNI
                  <SortIcon campo="DNI" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('numeroHistoriaClinica')}
                  className="flex items-center hover:text-blue-600 transition-colors"
                >
                  Nº Historia
                  <SortIcon campo="numeroHistoriaClinica" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('ultimaVisita')}
                  className="flex items-center hover:text-blue-600 transition-colors"
                >
                  Última Visita
                  <SortIcon campo="ultimaVisita" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('saldoPendiente')}
                  className="flex items-center hover:text-blue-600 transition-colors"
                >
                  Saldo Pendiente
                  <SortIcon campo="saldoPendiente" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {pacientes.map((paciente) => (
              <FilaPaciente
                key={paciente._id}
                paciente={paciente}
                onVerPaciente={onVerPaciente}
                onNuevaCita={onNuevaCita}
                onRegistrarPago={onRegistrarPago}
                onGenerarPresupuesto={onGenerarPresupuesto}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



