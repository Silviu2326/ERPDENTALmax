import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, AlertCircle, Receipt } from 'lucide-react';
import { obtenerFacturaPorId, FacturaDetallada } from '../api/facturacionApi';
import FormularioEdicionFactura from '../components/FormularioEdicionFactura';

interface EditarFacturaPageProps {
  facturaId: string;
  onVolver?: () => void;
  onFacturaActualizada?: (factura: FacturaDetallada) => void;
}

export default function EditarFacturaPage({
  facturaId,
  onVolver,
  onFacturaActualizada,
}: EditarFacturaPageProps) {
  const [factura, setFactura] = useState<FacturaDetallada | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarFactura = async () => {
      setLoading(true);
      setError(null);

      try {
        const facturaData = await obtenerFacturaPorId(facturaId);
        setFactura(facturaData);
      } catch (err) {
        // Datos mock para desarrollo
        const facturaMock: FacturaDetallada = {
          _id: facturaId,
          paciente: {
            _id: '1',
            nombre: 'Ana',
            apellidos: 'Martínez',
            documentoIdentidad: '12345678A',
          },
          numeroFactura: 'FAC-2024-001',
          fechaEmision: new Date().toISOString(),
          fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              _id: '1',
              tratamiento: {
                _id: '1',
                nombre: 'Limpieza dental',
              },
              descripcion: 'Limpieza dental profesional',
              cantidad: 1,
              precioUnitario: 50,
              descuento: 0,
              impuesto: 21,
              totalItem: 60.5,
            },
            {
              _id: '2',
              tratamiento: {
                _id: '2',
                nombre: 'Revisión general',
              },
              descripcion: 'Revisión completa de la boca',
              cantidad: 1,
              precioUnitario: 30,
              descuento: 10,
              impuesto: 21,
              totalItem: 32.67,
            },
          ],
          subtotal: 90,
          totalImpuestos: 18.9,
          totalDescuentos: 3,
          total: 108.9,
          estado: 'emitida',
          historialCambios: [
            {
              usuario: {
                _id: '1',
                nombre: 'Juan Pérez',
              },
              fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              campo: 'Cantidad',
              valorAnterior: '2',
              valorNuevo: '1',
            },
          ],
          notas: 'Factura de prueba',
        };
        setFactura(facturaMock);
        setError(err instanceof Error ? err.message : 'Error al cargar la factura');
      } finally {
        setLoading(false);
      }
    };

    if (facturaId) {
      cargarFactura();
    }
  }, [facturaId]);

  const handleGuardar = (facturaActualizada: FacturaDetallada) => {
    setFactura(facturaActualizada);
    if (onFacturaActualizada) {
      onFacturaActualizada(facturaActualizada);
    }
    if (onVolver) {
      // Opcional: redirigir después de guardar
      // onVolver();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando factura...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !factura) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar la factura</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            {onVolver && (
              <button
                onClick={onVolver}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
              >
                <ArrowLeft size={20} />
                <span>Volver</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!factura) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontró la factura</h3>
            <p className="text-gray-600 mb-4">La factura solicitada no existe o no está disponible</p>
            {onVolver && (
              <button
                onClick={onVolver}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
              >
                <ArrowLeft size={20} />
                <span>Volver</span>
              </button>
            )}
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
            {onVolver && (
              <button
                onClick={onVolver}
                className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-slate-600 hover:text-slate-900 transition-all"
              >
                <ArrowLeft size={18} />
                <span>Volver al Panel de Facturación</span>
              </button>
            )}
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Receipt size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Editar Factura
                </h1>
                <p className="text-gray-600">
                  Modifica los datos de la factura antes de que sea cerrada o pagada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Formulario */}
        <FormularioEdicionFactura
          factura={factura}
          onGuardar={handleGuardar}
          onCancelar={onVolver || (() => {})}
        />

        {/* Mostrar error si existe pero también hay factura (datos mock) */}
        {error && factura && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700">
                Nota: Se están mostrando datos de ejemplo. {error}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



