import { useState } from 'react';
import { X, Mail, Phone, Users, Calendar } from 'lucide-react';
import { Comunicacion } from '../../api/crmApi';

interface ModalRegistroComunicacionProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (comunicacion: Omit<Comunicacion, '_id' | 'createdAt'>) => void;
  proveedores?: Array<{ _id: string; nombreComercial: string }>;
}

export default function ModalRegistroComunicacion({
  isOpen,
  onClose,
  onGuardar,
  proveedores = [],
}: ModalRegistroComunicacionProps) {
  const [formData, setFormData] = useState({
    proveedorId: '',
    tipo: 'Email' as 'Email' | 'Llamada' | 'Reunión',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    resumen: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.proveedorId || !formData.resumen.trim()) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const fechaCompleta = new Date(`${formData.fecha}T${formData.hora}`);
    const usuarioId = localStorage.getItem('userId') || '1'; // En producción, obtener del contexto de autenticación

    onGuardar({
      proveedorId: formData.proveedorId,
      usuarioId,
      fecha: fechaCompleta.toISOString(),
      tipo: formData.tipo,
      resumen: formData.resumen,
    });

    // Resetear formulario
    setFormData({
      proveedorId: '',
      tipo: 'Email',
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0, 5),
      resumen: '',
    });
  };

  if (!isOpen) return null;

  const tiposComunicacion = [
    { value: 'Email', label: 'Email', icon: Mail },
    { value: 'Llamada', label: 'Llamada', icon: Phone },
    { value: 'Reunión', label: 'Reunión', icon: Users },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Registrar Comunicación</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proveedor <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.proveedorId}
              onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor._id} value={proveedor._id}>
                  {proveedor.nombreComercial}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Comunicación <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {tiposComunicacion.map((tipo) => {
                const Icon = tipo.icon;
                const isSelected = formData.tipo === tipo.value;
                return (
                  <button
                    key={tipo.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: tipo.value as any })}
                    className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                      {tipo.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumen <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.resumen}
              onChange={(e) => setFormData({ ...formData, resumen: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe el contenido de la comunicación..."
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar Comunicación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


