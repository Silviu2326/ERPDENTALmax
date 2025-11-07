import { useEffect, useState } from 'react';
import { Mail, Phone, Users, Plus, Clock, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Comunicacion,
  FiltrosComunicaciones,
} from '../../api/crmApi';
import ModalRegistroComunicacion from './ModalRegistroComunicacion';

interface HistorialComunicacionListProps {
  filtros?: FiltrosComunicaciones;
  proveedores?: Array<{ _id: string; nombreComercial: string }>;
}

export default function HistorialComunicacionList({
  filtros = {},
  proveedores = [],
}: HistorialComunicacionListProps) {
  const [comunicaciones, setComunicaciones] = useState<Comunicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    cargarComunicaciones();
  }, [filtros, page]);

  const cargarComunicaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos completos de comunicaciones
      const comunicacionesMock: Comunicacion[] = [
        {
          _id: '1',
          proveedorId: '1',
          proveedor: { _id: '1', nombreComercial: 'Dental Supplies Pro' },
          usuarioId: '1',
          usuario: { _id: '1', nombre: 'Juan Pérez' },
          fecha: new Date().toISOString(),
          tipo: 'Llamada',
          resumen: 'Llamada para consultar disponibilidad de guantes de nitrilo. Confirmado stock disponible para entrega inmediata.',
        },
        {
          _id: '2',
          proveedorId: '1',
          proveedor: { _id: '1', nombreComercial: 'Dental Supplies Pro' },
          usuarioId: '1',
          usuario: { _id: '1', nombre: 'Juan Pérez' },
          fecha: new Date(Date.now() - 86400000).toISOString(),
          tipo: 'Email',
          resumen: 'Solicitud de cotización para nuevo pedido de material odontológico. Enviada lista de productos requeridos.',
        },
        {
          _id: '3',
          proveedorId: '2',
          proveedor: { _id: '2', nombreComercial: 'MedTech Solutions' },
          usuarioId: '2',
          usuario: { _id: '2', nombre: 'María López' },
          fecha: new Date(Date.now() - 2 * 86400000).toISOString(),
          tipo: 'Reunión',
          resumen: 'Reunión presencial para presentación de nuevo equipamiento de radiología digital. Muy interesante, evaluando presupuesto.',
        },
        {
          _id: '4',
          proveedorId: '4',
          proveedor: { _id: '4', nombreComercial: 'ProDental Equipment' },
          usuarioId: '1',
          usuario: { _id: '1', nombre: 'Juan Pérez' },
          fecha: new Date(Date.now() - 3 * 86400000).toISOString(),
          tipo: 'Email',
          resumen: 'Consulta sobre garantía extendida para sillones dentales adquiridos. Respuesta positiva, se aplicará garantía de 3 años.',
        },
        {
          _id: '5',
          proveedorId: '5',
          proveedor: { _id: '5', nombreComercial: 'BioDental Materials' },
          usuarioId: '3',
          usuario: { _id: '3', nombre: 'Carlos Martínez' },
          fecha: new Date(Date.now() - 5 * 86400000).toISOString(),
          tipo: 'Llamada',
          resumen: 'Llamada para coordinar entrega urgente de composites. Entrega programada para mañana por la mañana.',
        },
        {
          _id: '6',
          proveedorId: '7',
          proveedor: { _id: '7', nombreComercial: 'MaxiDental Supplies' },
          usuarioId: '2',
          usuario: { _id: '2', nombre: 'María López' },
          fecha: new Date(Date.now() - 7 * 86400000).toISOString(),
          tipo: 'Email',
          resumen: 'Negociación de descuentos por volumen para pedido trimestral. Oferta recibida con 15% de descuento.',
        },
        {
          _id: '7',
          proveedorId: '8',
          proveedor: { _id: '8', nombreComercial: 'Premium Dental Tools' },
          usuarioId: '1',
          usuario: { _id: '1', nombre: 'Juan Pérez' },
          fecha: new Date(Date.now() - 10 * 86400000).toISOString(),
          tipo: 'Reunión',
          resumen: 'Reunión técnica para revisión de instrumental quirúrgico. Demostración de nuevos productos de alta precisión.',
        },
        {
          _id: '8',
          proveedorId: '2',
          proveedor: { _id: '2', nombreComercial: 'MedTech Solutions' },
          usuarioId: '3',
          usuario: { _id: '3', nombre: 'Carlos Martínez' },
          fecha: new Date(Date.now() - 12 * 86400000).toISOString(),
          tipo: 'Llamada',
          resumen: 'Seguimiento de pedido de sensores de radiografía. Confirmado envío para la próxima semana.',
        },
        {
          _id: '9',
          proveedorId: '9',
          proveedor: { _id: '9', nombreComercial: 'LabDental Pro' },
          usuarioId: '1',
          usuario: { _id: '1', nombre: 'Juan Pérez' },
          fecha: new Date(Date.now() - 14 * 86400000).toISOString(),
          tipo: 'Email',
          resumen: 'Consulta sobre materiales de laboratorio para prótesis. Catálogo completo enviado.',
        },
        {
          _id: '10',
          proveedorId: '11',
          proveedor: { _id: '11', nombreComercial: 'Radiología Dental Avanzada' },
          usuarioId: '2',
          usuario: { _id: '2', nombre: 'María López' },
          fecha: new Date(Date.now() - 16 * 86400000).toISOString(),
          tipo: 'Reunión',
          resumen: 'Reunión técnica para actualización de software de radiografía. Nueva versión disponible con mejoras significativas.',
        },
        {
          _id: '11',
          proveedorId: '12',
          proveedor: { _id: '12', nombreComercial: 'OrthoMaterials' },
          usuarioId: '3',
          usuario: { _id: '3', nombre: 'Carlos Martínez' },
          fecha: new Date(Date.now() - 18 * 86400000).toISOString(),
          tipo: 'Llamada',
          resumen: 'Coordinación de entrega mensual de materiales de ortodoncia. Pedido confirmado para el día 25.',
        },
        {
          _id: '12',
          proveedorId: '1',
          proveedor: { _id: '1', nombreComercial: 'Dental Supplies Pro' },
          usuarioId: '4',
          usuario: { _id: '4', nombre: 'Ana García' },
          fecha: new Date(Date.now() - 20 * 86400000).toISOString(),
          tipo: 'Email',
          resumen: 'Negociación de nuevos términos comerciales. Propuesta de descuento del 12% para pedidos trimestrales.',
        },
      ];
      
      // Aplicar filtros básicos
      let comunicacionesFiltradas = [...comunicacionesMock];
      
      if (filtros.proveedorId) {
        comunicacionesFiltradas = comunicacionesFiltradas.filter(c => c.proveedorId === filtros.proveedorId);
      }
      
      if (filtros.tipo) {
        comunicacionesFiltradas = comunicacionesFiltradas.filter(c => c.tipo === filtros.tipo);
      }
      
      // Paginación
      const limit = 10;
      const total = comunicacionesFiltradas.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const comunicacionesPaginadas = comunicacionesFiltradas.slice(startIndex, endIndex);
      
      setComunicaciones(comunicacionesPaginadas);
      setTotalPages(totalPages);
    } catch (err) {
      setError('Error al cargar comunicaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (error && comunicaciones.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>
    );
  }

  const handleCrearComunicacion = async (datos: Omit<Comunicacion, '_id' | 'createdAt'>) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 600));
      // Simular creación
      console.log('Creando comunicación:', datos);
      setMostrarModal(false);
      cargarComunicaciones();
    } catch (err) {
      console.error('Error al crear comunicación:', err);
      alert('Error al registrar la comunicación');
    }
  };

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'Email':
        return <Mail className="w-5 h-5 text-blue-600" />;
      case 'Llamada':
        return <Phone className="w-5 h-5 text-green-600" />;
      case 'Reunión':
        return <Users className="w-5 h-5 text-purple-600" />;
      default:
        return <Mail className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'Email':
        return 'bg-blue-100 text-blue-800';
      case 'Llamada':
        return 'bg-green-100 text-green-800';
      case 'Reunión':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && comunicaciones.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Historial de Comunicaciones</h3>
            <p className="text-sm text-gray-600 mt-1">
              Registro de todas las interacciones con proveedores
            </p>
          </div>
          <button
            onClick={() => setMostrarModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
          >
            <Plus size={20} />
            <span>Registrar Comunicación</span>
          </button>
        </div>

        <div>
          {comunicaciones.length === 0 && !loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Mail size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay comunicaciones registradas</h3>
              <p className="text-gray-600 mb-4">Comienza registrando tu primera comunicación con un proveedor</p>
              <button
                onClick={() => setMostrarModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
              >
                <Plus size={20} />
                <span>Registrar Comunicación</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {comunicaciones.map((comunicacion) => (
                <div key={comunicacion._id} className="p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{getIconoTipo(comunicacion.tipo)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-semibold text-gray-900">
                            {comunicacion.proveedor?.nombreComercial || 'Proveedor'}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                              comunicacion.tipo
                            )}`}
                          >
                            {comunicacion.tipo}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={16} />
                          {formatearFecha(comunicacion.fecha)}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{comunicacion.resumen}</p>
                      <p className="text-xs text-gray-500">
                        Registrado por: {comunicacion.usuario?.nombre || 'Usuario'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="inline-flex items-center justify-center p-2 rounded-xl text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-slate-200"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-4 py-2 text-sm text-slate-700">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="inline-flex items-center justify-center p-2 rounded-xl text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-slate-200"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ModalRegistroComunicacion
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onGuardar={handleCrearComunicacion}
        proveedores={proveedores}
      />
    </>
  );
}


