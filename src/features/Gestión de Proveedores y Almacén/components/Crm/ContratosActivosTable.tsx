import { useEffect, useState } from 'react';
import { FileText, AlertTriangle, Calendar, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Contrato } from '../../api/crmApi';

export default function ContratosActivosTable() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diasLimite, setDiasLimite] = useState(60);

  const calcularDiasRestantes = (fechaFin: string) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diff = Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  useEffect(() => {
    cargarContratos();
  }, [diasLimite]);

  const cargarContratos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos completos de contratos
      const contratosMock: Contrato[] = [
        {
          _id: '1',
          proveedorId: '1',
          proveedor: { _id: '1', nombreComercial: 'Dental Supplies Pro' },
          fechaInicio: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          terminos: 'Contrato anual de suministro de materiales dentales. Descuento del 10% en pedidos superiores a 5000€. Plazo de entrega garantizado 48h.',
          estado: 'Activo',
          diasRestantes: 30,
        },
        {
          _id: '2',
          proveedorId: '2',
          proveedor: { _id: '2', nombreComercial: 'MedTech Solutions' },
          fechaInicio: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          fechaFin: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          terminos: 'Contrato semestral para servicios de laboratorio y equipamiento. Incluye mantenimiento técnico y soporte.',
          estado: 'Activo',
          diasRestantes: 45,
        },
        {
          _id: '3',
          proveedorId: '4',
          proveedor: { _id: '4', nombreComercial: 'ProDental Equipment' },
          fechaInicio: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
          fechaFin: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          terminos: 'Contrato bienal para equipamiento dental. Garantía extendida de 3 años incluida. Renovación automática si no se cancela.',
          estado: 'Activo',
          diasRestantes: 15,
        },
        {
          _id: '4',
          proveedorId: '5',
          proveedor: { _id: '5', nombreComercial: 'BioDental Materials' },
          fechaInicio: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          fechaFin: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
          terminos: 'Contrato anual para materiales biocompatibles. Precios fijos durante todo el año. Entrega prioritaria.',
          estado: 'Activo',
          diasRestantes: 275,
        },
        {
          _id: '5',
          proveedorId: '8',
          proveedor: { _id: '8', nombreComercial: 'Premium Dental Tools' },
          fechaInicio: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
          fechaFin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          terminos: 'Contrato trimestral para instrumental de precisión. Vencido - requiere renovación urgente.',
          estado: 'Vencido',
          diasRestantes: -5,
        },
        {
          _id: '6',
          proveedorId: '7',
          proveedor: { _id: '7', nombreComercial: 'MaxiDental Supplies' },
          fechaInicio: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          fechaFin: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
          terminos: 'Contrato anual para consumibles y material de oficina. Descuentos progresivos según volumen mensual.',
          estado: 'Activo',
          diasRestantes: 305,
        },
        {
          _id: '7',
          proveedorId: '9',
          proveedor: { _id: '9', nombreComercial: 'LabDental Pro' },
          fechaInicio: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          fechaFin: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000).toISOString(),
          terminos: 'Contrato anual para materiales de laboratorio dental. Incluye servicio técnico y asesoramiento.',
          estado: 'Activo',
          diasRestantes: 245,
        },
        {
          _id: '8',
          proveedorId: '11',
          proveedor: { _id: '11', nombreComercial: 'Radiología Dental Avanzada' },
          fechaInicio: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
          fechaFin: new Date(Date.now() + 165 * 24 * 60 * 60 * 1000).toISOString(),
          terminos: 'Contrato para equipos de radiografía digital. Mantenimiento preventivo incluido. Renovación automática.',
          estado: 'Activo',
          diasRestantes: 165,
        },
      ];
      
      // Filtrar por días límite
      const contratosFiltrados = contratosMock.filter(c => {
        const dias = calcularDiasRestantes(c.fechaFin);
        return dias <= diasLimite;
      });
      
      setContratos(contratosFiltrados);
    } catch (err) {
      setError('Error al cargar contratos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getEstadoBadge = (contrato: Contrato) => {
    const dias = calcularDiasRestantes(contrato.fechaFin);
    if (dias < 0) {
      return {
        label: 'Vencido',
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
      };
    }
    if (dias <= 30) {
      return {
        label: `Vence en ${dias} días`,
        color: 'bg-yellow-100 text-yellow-800',
        icon: AlertTriangle,
      };
    }
    return {
      label: 'Activo',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle,
    };
  };

  if (loading && contratos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Contratos por Vencer</h3>
          <p className="text-sm text-gray-600 mt-1">
            Contratos que vencen en los próximos {diasLimite} días
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Días límite:</label>
          <select
            value={diasLimite}
            onChange={(e) => setDiasLimite(Number(e.target.value))}
            className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
          >
            <option value={30}>30 días</option>
            <option value={60}>60 días</option>
            <option value={90}>90 días</option>
          </select>
        </div>
      </div>

      {error && !contratos.length && !loading ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      ) : contratos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay contratos próximos a vencer</h3>
          <p className="text-gray-600">Todos los contratos están vigentes más allá del período seleccionado</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fecha Fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Días Restantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Términos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contratos.map((contrato) => {
                const estadoBadge = getEstadoBadge(contrato);
                const Icon = estadoBadge.icon;
                const diasRestantes = calcularDiasRestantes(contrato.fechaFin);
                return (
                  <tr key={contrato._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {contrato.proveedor?.nombreComercial || 'Proveedor'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-400" />
                        {formatearFecha(contrato.fechaInicio)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-400" />
                        {formatearFecha(contrato.fechaFin)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          diasRestantes <= 30
                            ? 'text-yellow-600'
                            : diasRestantes < 0
                            ? 'text-red-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {diasRestantes < 0
                          ? `Vencido hace ${Math.abs(diasRestantes)} días`
                          : `${diasRestantes} días`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estadoBadge.color}`}
                      >
                        <Icon size={12} />
                        {estadoBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {contrato.terminos}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


