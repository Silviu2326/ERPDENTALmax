import { useState, useEffect } from 'react';
import { ArrowLeft, Warehouse, MapPin, User, Building2, Edit, ArrowRightLeft, Loader2, AlertCircle } from 'lucide-react';
import { AlmacenDetalle } from '../api/almacenesApi';
import InventarioPorAlmacenList from '../components/InventarioPorAlmacenList';
import ModalCrearEditarAlmacen from '../components/ModalCrearEditarAlmacen';
import ModalTransferenciaStock from '../components/ModalTransferenciaStock';
import { Almacen } from '../api/almacenesApi';

interface DetalleAlmacenPageProps {
  almacenId: string;
  onVolver: () => void;
  almacenes?: Almacen[];
  productos?: Array<{
    _id: string;
    nombre: string;
    sku?: string;
    categoria?: string;
    stockDisponible?: number;
  }>;
  clinicas?: Array<{ _id: string; nombre: string }>;
  responsables?: Array<{ _id: string; nombre: string; apellidos?: string }>;
}

export default function DetalleAlmacenPage({
  almacenId,
  onVolver,
  almacenes = [],
  productos = [],
  clinicas = [],
  responsables = [],
}: DetalleAlmacenPageProps) {
  const [almacen, setAlmacen] = useState<AlmacenDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalTransferir, setMostrarModalTransferir] = useState(false);

  useEffect(() => {
    cargarDetalleAlmacen();
  }, [almacenId]);

  const cargarDetalleAlmacen = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay y construir detalle desde props + datos falsos
      await new Promise(resolve => setTimeout(resolve, 400));
      const base = almacenes.find(a => a._id === almacenId);
      if (!base) {
        throw new Error('Almacén no encontrado');
      }
      const detalleMock: AlmacenDetalle = {
        _id: base._id,
        nombre: base.nombre,
        direccion: base.direccion || { calle: '', ciudad: '', codigoPostal: '' },
        esPrincipal: !!base.esPrincipal,
        activo: base.activo !== false,
        clinicaAsociada: base.clinicaAsociada,
        responsable: base.responsable as any,
        inventario: [
          {
            producto: productos[0] ? { _id: productos[0]._id, nombre: productos[0].nombre, sku: productos[0].sku, categoria: productos[0].categoria } : { _id: '1', nombre: 'Guantes Nitrilo', sku: 'GNT-001', categoria: 'Consumible' },
            cantidad: 150,
          },
          {
            producto: productos[1] ? { _id: productos[1]._id, nombre: productos[1].nombre, sku: productos[1].sku, categoria: productos[1].categoria } : { _id: '2', nombre: 'Jeringas 5ml', sku: 'JNG-002', categoria: 'Consumible' },
            cantidad: 320,
          },
          {
            producto: productos[3] ? { _id: productos[3]._id, nombre: productos[3].nombre, sku: productos[3].sku, categoria: productos[3].categoria } : { _id: '4', nombre: 'Fresas Dentales', sku: 'FRD-004', categoria: 'Instrumental' },
            cantidad: 22,
          },
        ],
      };
      setAlmacen(detalleMock);
    } catch (err) {
      console.error('Error al cargar detalle del almacén:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el almacén');
      // Datos mock para desarrollo
      setAlmacen({
        _id: almacenId,
        nombre: 'Almacén Principal',
        direccion: {
          calle: 'Av. Principal 123',
          ciudad: 'Madrid',
          codigoPostal: '28001',
        },
        esPrincipal: true,
        activo: true,
        inventario: [
          {
            producto: {
              _id: '1',
              nombre: 'Composite A2',
              sku: 'COMP-A2',
              categoria: 'Materiales',
            },
            cantidad: 50,
          },
          {
            producto: {
              _id: '2',
              nombre: 'Guantes Latex',
              sku: 'GUANT-LAT',
              categoria: 'Consumibles',
            },
            cantidad: 200,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarAlmacen = async (datos: any) => {
    if (!almacen?._id) return;
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Actualizando almacén (mock):', almacen._id, datos);
    await cargarDetalleAlmacen();
    setMostrarModalEditar(false);
  };

  const handleTransferir = async (transferencia: any) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    console.log('Transferencia de stock (mock):', transferencia);
    await cargarDetalleAlmacen();
    setMostrarModalTransferir(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando almacén...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !almacen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error || 'No se pudo cargar el almacén'}</p>
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label="Volver"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <Warehouse size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      {almacen.nombre}
                    </h1>
                    <p className="text-gray-600">Detalle del almacén</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMostrarModalTransferir(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <ArrowRightLeft size={20} />
                  Transferir Stock
                </button>
                <button
                  onClick={() => setMostrarModalEditar(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Edit size={20} />
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Información General */}
          <div className="bg-white shadow-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Dirección</p>
                  <p className="font-medium text-gray-900">
                    {almacen.direccion.calle}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {almacen.direccion.ciudad}, {almacen.direccion.codigoPostal}
                  </p>
                </div>
              </div>

              {almacen.clinicaAsociada && (
                <div className="flex items-start gap-3">
                  <Building2 size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Clínica Asociada</p>
                    <p className="font-medium text-gray-900">
                      {almacen.clinicaAsociada.nombre}
                    </p>
                  </div>
                </div>
              )}

              {almacen.responsable && (
                <div className="flex items-start gap-3">
                  <User size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Responsable</p>
                    <p className="font-medium text-gray-900">
                      {almacen.responsable.nombre} {almacen.responsable.apellidos || ''}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Warehouse size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Estado</p>
                  <p className="font-medium text-gray-900">
                    {almacen.activo ? 'Activo' : 'Inactivo'}
                  </p>
                  {almacen.esPrincipal && (
                    <p className="text-sm text-yellow-600 font-medium mt-1">Almacén Principal</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Inventario */}
          <div className="bg-white shadow-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Inventario</h2>
            <InventarioPorAlmacenList almacen={almacen} />
          </div>
        </div>
      </div>

      {/* Modales */}
      {mostrarModalEditar && (
        <ModalCrearEditarAlmacen
          almacen={almacen}
          isOpen={mostrarModalEditar}
          onClose={() => setMostrarModalEditar(false)}
          onSave={handleGuardarAlmacen}
          clinicas={clinicas}
          responsables={responsables}
        />
      )}

      {mostrarModalTransferir && (
        <ModalTransferenciaStock
          almacenOrigen={almacen}
          almacenes={almacenes}
          productos={productos}
          isOpen={mostrarModalTransferir}
          onClose={() => setMostrarModalTransferir(false)}
          onTransferir={handleTransferir}
        />
      )}
    </div>
  );
}


