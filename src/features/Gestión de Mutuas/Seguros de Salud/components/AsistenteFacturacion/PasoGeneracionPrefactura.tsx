import { useState, useEffect } from 'react';
import { FileText, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import {
  generarPrefactura,
  PrefacturaMutua,
  DetalleCobertura,
  TratamientoFacturable,
} from '../../api/facturacionMutuaApi';
import VisorPrefacturaMutua from './VisorPrefacturaMutua';

interface PasoGeneracionPrefacturaProps {
  pacienteId: string;
  mutuaId: string;
  tratamientosSeleccionados: TratamientoFacturable[];
  detallesCobertura: DetalleCobertura[];
  onPrefacturaGenerada: (prefactura: PrefacturaMutua) => void;
}

export default function PasoGeneracionPrefactura({
  pacienteId,
  mutuaId,
  tratamientosSeleccionados,
  detallesCobertura,
  onPrefacturaGenerada,
}: PasoGeneracionPrefacturaProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefactura, setPrefactura] = useState<PrefacturaMutua | null>(null);

  useEffect(() => {
    const generar = async () => {
      if (tratamientosSeleccionados.length === 0 || detallesCobertura.length === 0) {
        setPrefactura(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Mapear los tratamientos seleccionados con los detalles de cobertura
        const tratamientosParaFactura = tratamientosSeleccionados.map((tratamiento) => {
          const detalle = detallesCobertura.find(
            (d) => d.tratamientoId === tratamiento.tratamiento._id
          );
          if (!detalle) {
            throw new Error(`No se encontró el detalle de cobertura para el tratamiento ${tratamiento.tratamiento._id}`);
          }

          return {
            tratamientoId: tratamiento.tratamiento._id,
            codigoMutua: detalle.codigoMutua,
            descripcion: detalle.descripcion,
            precio: detalle.precio,
            cantidad: tratamiento.cantidad,
            importeCubierto: detalle.importeCubierto,
            copago: detalle.copago,
          };
        });

        const resultado = await generarPrefactura(pacienteId, mutuaId, tratamientosParaFactura);
        setPrefactura(resultado);
        onPrefacturaGenerada(resultado);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al generar prefactura');
        setPrefactura(null);
      } finally {
        setLoading(false);
      }
    };

    generar();
  }, [pacienteId, mutuaId, tratamientosSeleccionados, detallesCobertura]);

  const handleRegenerar = async () => {
    setPrefactura(null);
    setError(null);
    // El useEffect se encargará de regenerar automáticamente
  };

  if (tratamientosSeleccionados.length === 0 || detallesCobertura.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos suficientes</h3>
        <p className="text-gray-600">No hay datos suficientes para generar la prefactura</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Generando prefactura...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al generar prefactura</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRegenerar}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold"
          >
            <RefreshCw size={20} className="inline mr-2" />
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  if (!prefactura) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Paso 4: Generación de Prefactura</h3>
          <p className="text-gray-600 text-sm">
            Revisa el borrador de la factura antes de confirmar y enviar.
          </p>
        </div>
        <button
          onClick={handleRegenerar}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <RefreshCw size={20} className="mr-2" />
          Regenerar
        </button>
      </div>

      {/* Mensaje de éxito */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-medium text-green-900">Prefactura generada correctamente</div>
          <div className="text-sm text-green-700 mt-1">
            Revisa todos los detalles antes de continuar al siguiente paso.
          </div>
        </div>
      </div>

      {/* Visor de prefactura */}
      <VisorPrefacturaMutua prefactura={prefactura} />
    </div>
  );
}



