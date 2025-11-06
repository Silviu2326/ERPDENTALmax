import { useState, useEffect } from 'react';
import { Plus, Tag } from 'lucide-react';
import { Promocion, obtenerPromociones, eliminarPromocion, FiltrosPromociones } from '../api/promocionesApi';
import ListaPromociones from '../components/ListaPromociones';
import FormularioPromocion from '../components/FormularioPromocion';
import TarjetaDetallePromocion from '../components/TarjetaDetallePromocion';
import FiltrosPromocionesComponent from '../components/FiltrosPromociones';
import ModalConfirmacionEliminar from '../components/ModalConfirmacionEliminar';

type Vista = 'lista' | 'crear' | 'editar' | 'detalle';

export default function PromocionesOfertasPage() {
  const [vista, setVista] = useState<Vista>('lista');
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState<Promocion | null>(null);
  const [filtros, setFiltros] = useState<FiltrosPromociones>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [promocionAEliminar, setPromocionAEliminar] = useState<Promocion | null>(null);

  useEffect(() => {
    cargarPromociones();
  }, [filtros]);

  const cargarPromociones = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos completos de promociones
      const datosFalsos: Promocion[] = [
        {
          _id: '1',
          nombre: 'Limpieza Dental 30% Descuento',
          descripcion: 'Oferta especial de limpieza dental profesional con un 30% de descuento. Incluye limpieza, pulido y fluorización.',
          tipo: 'porcentaje',
          valor: 30,
          fechaInicio: '2024-03-01',
          fechaFin: '2024-03-31',
          codigo: 'LIMPIEZA30',
          condiciones: 'Válido solo para nuevos pacientes. No acumulable con otras ofertas.',
          tratamientosAplicables: [
            { _id: '1', nombre: 'Limpieza Dental' },
          ],
          estado: 'activa',
          usosMaximos: 100,
          usosActuales: 45,
          soloNuevosPacientes: true,
          creadoPor: {
            _id: '1',
            nombre: 'Roberto García',
          },
          createdAt: '2024-02-25T10:00:00Z',
          updatedAt: '2024-03-15T14:30:00Z',
        },
        {
          _id: '2',
          nombre: 'Ortodoncia Invisible - 500€ Descuento',
          descripcion: 'Descuento fijo de 500€ en tratamientos de ortodoncia invisible. Financiación sin intereses disponible.',
          tipo: 'fijo',
          valor: 500,
          fechaInicio: '2024-01-01',
          fechaFin: '2024-12-31',
          codigo: 'ORTODONCIA500',
          condiciones: 'Aplicable a tratamientos superiores a 2000€. Financiación hasta 24 meses.',
          tratamientosAplicables: [
            { _id: '2', nombre: 'Ortodoncia Invisible' },
            { _id: '3', nombre: 'Ortodoncia Tradicional' },
          ],
          estado: 'activa',
          usosMaximos: 50,
          usosActuales: 18,
          soloNuevosPacientes: false,
          creadoPor: {
            _id: '1',
            nombre: 'Roberto García',
          },
          createdAt: '2023-12-20T09:00:00Z',
          updatedAt: '2024-03-10T11:15:00Z',
        },
        {
          _id: '3',
          nombre: '2x1 en Blanqueamiento Dental',
          descripcion: 'Segunda sesión de blanqueamiento dental gratis al contratar la primera.',
          tipo: '2x1',
          valor: 0,
          fechaInicio: '2024-03-15',
          fechaFin: '2024-04-15',
          codigo: 'BLANQUEAMIENTO2X1',
          condiciones: 'Válido para blanqueamiento en consulta. Debe realizarse en el mismo mes.',
          tratamientosAplicables: [
            { _id: '4', nombre: 'Blanqueamiento Dental' },
          ],
          estado: 'activa',
          usosMaximos: 30,
          usosActuales: 12,
          soloNuevosPacientes: false,
          creadoPor: {
            _id: '2',
            nombre: 'María López',
          },
          createdAt: '2024-03-10T14:00:00Z',
          updatedAt: '2024-03-16T10:20:00Z',
        },
        {
          _id: '4',
          nombre: 'Paquete Revisión Completa',
          descripcion: 'Paquete completo de revisión dental que incluye consulta, radiografías y limpieza con un precio especial.',
          tipo: 'paquete',
          valor: 150,
          fechaInicio: '2024-02-01',
          fechaFin: '2024-05-31',
          codigo: 'PAQUETE150',
          condiciones: 'Precio fijo de 150€ para el paquete completo. Ahorro de 80€ respecto al precio individual.',
          tratamientosAplicables: [
            { _id: '5', nombre: 'Revisión Completa' },
            { _id: '1', nombre: 'Limpieza Dental' },
          ],
          estado: 'activa',
          usosMaximos: 200,
          usosActuales: 89,
          soloNuevosPacientes: false,
          creadoPor: {
            _id: '1',
            nombre: 'Roberto García',
          },
          createdAt: '2024-01-25T11:00:00Z',
          updatedAt: '2024-03-12T16:45:00Z',
        },
        {
          _id: '5',
          nombre: 'Implantología - 10% Descuento',
          descripcion: 'Descuento del 10% en tratamientos de implantología dental. Garantía de por vida incluida.',
          tipo: 'porcentaje',
          valor: 10,
          fechaInicio: '2024-01-15',
          fechaFin: '2024-06-30',
          codigo: 'IMPLANTE10',
          condiciones: 'Aplicable a tratamientos completos de implantología. Incluye garantía extendida.',
          tratamientosAplicables: [
            { _id: '6', nombre: 'Implantología' },
          ],
          estado: 'activa',
          usosMaximos: 25,
          usosActuales: 8,
          soloNuevosPacientes: false,
          creadoPor: {
            _id: '1',
            nombre: 'Roberto García',
          },
          createdAt: '2024-01-10T09:30:00Z',
          updatedAt: '2024-03-08T13:20:00Z',
        },
        {
          _id: '6',
          nombre: 'Promoción Navidad 2023',
          descripcion: 'Promoción navideña con descuentos especiales en todos los tratamientos.',
          tipo: 'porcentaje',
          valor: 20,
          fechaInicio: '2023-12-01',
          fechaFin: '2023-12-31',
          codigo: 'NAVIDAD2023',
          condiciones: 'Válido durante el mes de diciembre de 2023.',
          estado: 'expirada',
          usosMaximos: 150,
          usosActuales: 142,
          soloNuevosPacientes: false,
          creadoPor: {
            _id: '1',
            nombre: 'Roberto García',
          },
          createdAt: '2023-11-25T10:00:00Z',
          updatedAt: '2024-01-05T09:00:00Z',
        },
        {
          _id: '7',
          nombre: 'Primera Consulta Gratis',
          descripcion: 'Consulta inicial gratuita para nuevos pacientes. Incluye exploración y diagnóstico.',
          tipo: 'fijo',
          valor: 0,
          fechaInicio: '2024-01-01',
          fechaFin: '2024-12-31',
          codigo: 'PRIMERACONSULTA',
          condiciones: 'Solo para pacientes que nunca han visitado la clínica. Válido todo el año.',
          tratamientosAplicables: [
            { _id: '7', nombre: 'Consulta Inicial' },
          ],
          estado: 'activa',
          usosMaximos: 500,
          usosActuales: 234,
          soloNuevosPacientes: true,
          creadoPor: {
            _id: '1',
            nombre: 'Roberto García',
          },
          createdAt: '2023-12-15T08:00:00Z',
          updatedAt: '2024-03-14T15:30:00Z',
        },
      ];
      
      // Aplicar filtros
      let promocionesFiltradas = [...datosFalsos];
      
      if (filtros.estado) {
        promocionesFiltradas = promocionesFiltradas.filter(p => p.estado === filtros.estado);
      }
      
      if (filtros.tipo) {
        promocionesFiltradas = promocionesFiltradas.filter(p => p.tipo === filtros.tipo);
      }
      
      if (filtros.search) {
        const searchLower = filtros.search.toLowerCase();
        promocionesFiltradas = promocionesFiltradas.filter(p => 
          p.nombre.toLowerCase().includes(searchLower) ||
          p.descripcion.toLowerCase().includes(searchLower) ||
          p.codigo?.toLowerCase().includes(searchLower)
        );
      }
      
      setPromociones(promocionesFiltradas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las promociones');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearNueva = () => {
    setPromocionSeleccionada(null);
    setVista('crear');
  };

  const handleEditar = (promocion: Promocion) => {
    setPromocionSeleccionada(promocion);
    setVista('editar');
  };

  const handleVerDetalle = (promocion: Promocion) => {
    setPromocionSeleccionada(promocion);
    setVista('detalle');
  };

  const handleEliminar = (promocion: Promocion) => {
    setPromocionAEliminar(promocion);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminar = async () => {
    if (!promocionAEliminar?._id) return;

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simular eliminación
      console.log('Eliminando promoción:', promocionAEliminar._id);
      await cargarPromociones();
      setMostrarModalEliminar(false);
      setPromocionAEliminar(null);
      if (vista === 'detalle' && promocionSeleccionada?._id === promocionAEliminar._id) {
        setVista('lista');
        setPromocionSeleccionada(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la promoción');
      setMostrarModalEliminar(false);
    }
  };

  const handleGuardar = () => {
    setVista('lista');
    setPromocionSeleccionada(null);
    cargarPromociones();
  };

  const handleCancelar = () => {
    setVista('lista');
    setPromocionSeleccionada(null);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({});
  };

  if (vista === 'crear') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Promoción</h2>
          <p className="text-gray-600 mt-1">Completa el formulario para crear una nueva promoción</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <FormularioPromocion onGuardar={handleGuardar} onCancelar={handleCancelar} />
        </div>
      </div>
    );
  }

  if (vista === 'editar' && promocionSeleccionada) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Editar Promoción</h2>
          <p className="text-gray-600 mt-1">Modifica los datos de la promoción</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <FormularioPromocion
            promocion={promocionSeleccionada}
            onGuardar={handleGuardar}
            onCancelar={handleCancelar}
          />
        </div>
      </div>
    );
  }

  if (vista === 'detalle' && promocionSeleccionada) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={handleCancelar}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Volver a la lista
          </button>
        </div>
        <TarjetaDetallePromocion
          promocion={promocionSeleccionada}
          onEditar={() => handleEditar(promocionSeleccionada)}
          onEliminar={() => handleEliminar(promocionSeleccionada)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="w-7 h-7 text-blue-600" />
            Promociones y Ofertas
          </h2>
          <p className="text-gray-600 mt-1">
            Gestiona las promociones y ofertas de la clínica
          </p>
        </div>
        <button
          onClick={handleCrearNueva}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Nueva Promoción
        </button>
      </div>

      {/* Filtros */}
      <FiltrosPromocionesComponent
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onLimpiar={handleLimpiarFiltros}
      />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Lista de promociones */}
      <ListaPromociones
        promociones={promociones}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        onVerDetalle={handleVerDetalle}
        loading={loading}
      />

      {/* Modal de confirmación de eliminación */}
      <ModalConfirmacionEliminar
        isOpen={mostrarModalEliminar}
        onClose={() => {
          setMostrarModalEliminar(false);
          setPromocionAEliminar(null);
        }}
        onConfirmar={confirmarEliminar}
        titulo="Eliminar Promoción"
        mensaje="¿Estás seguro de que deseas eliminar esta promoción? Esta acción no se puede deshacer."
        nombreItem={promocionAEliminar?.nombre}
      />
    </div>
  );
}


