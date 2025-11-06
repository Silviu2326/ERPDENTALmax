import { ConceptoFactura } from '../api/facturacionApi';

interface ResumenTotalesFacturaProps {
  conceptos: ConceptoFactura[];
}

export default function ResumenTotalesFactura({ conceptos }: ResumenTotalesFacturaProps) {
  const calcularTotales = () => {
    let subtotal = 0;
    let totalImpuestos = 0;

    conceptos.forEach((concepto) => {
      const cantidad = concepto.cantidad || 0;
      const precioUnitario = concepto.precioUnitario || 0;
      const descuento = concepto.descuento || 0;
      const subtotalConcepto = cantidad * precioUnitario;
      const subtotalConDescuento = subtotalConcepto - (subtotalConcepto * descuento) / 100;
      const impuestoConcepto = (subtotalConDescuento * (concepto.porcentajeImpuesto || 0)) / 100;

      subtotal += subtotalConDescuento;
      totalImpuestos += impuestoConcepto;
    });

    const total = subtotal + totalImpuestos;

    return {
      subtotal,
      impuestos: totalImpuestos,
      total,
    };
  };

  const { subtotal, impuestos, total } = calcularTotales();

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Totales</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Subtotal:</span>
          <span className="text-sm font-semibold text-gray-900">{subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Impuestos (IVA):</span>
          <span className="text-sm font-semibold text-gray-900">{impuestos.toFixed(2)} €</span>
        </div>
        <div className="border-t border-gray-300 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-blue-600">{total.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}


