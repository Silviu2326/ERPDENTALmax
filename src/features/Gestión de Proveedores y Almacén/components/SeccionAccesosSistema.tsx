import { Lock, Key, Shield } from 'lucide-react';
import { Rol } from '../api/empleadosApi';

interface AccesosSistema {
  rolId: string;
  password: string;
  confirmPassword: string;
}

interface SeccionAccesosSistemaProps {
  datos: AccesosSistema;
  roles: Rol[];
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
  loadingRoles?: boolean;
}

export default function SeccionAccesosSistema({
  datos,
  roles,
  onChange,
  errors = {},
  loadingRoles = false,
}: SeccionAccesosSistemaProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-600" />
        Acceso al Sistema
      </h3>
      <p className="text-sm text-gray-600">
        Configura las credenciales de acceso al sistema para el nuevo empleado.
        Se creará una cuenta de usuario asociada automáticamente.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Rol del Sistema *
          </label>
          {loadingRoles ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
              Cargando roles...
            </div>
          ) : (
            <select
              required
              value={datos.rolId}
              onChange={(e) => onChange('rolId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.rolId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol._id} value={rol._id}>
                  {rol.nombre}
                  {rol.descripcion && ` - ${rol.descripcion}`}
                </option>
              ))}
            </select>
          )}
          {errors.rolId && (
            <p className="mt-1 text-sm text-red-600">{errors.rolId}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Key className="w-4 h-4" />
            Contraseña Inicial *
          </label>
          <input
            type="password"
            required
            value={datos.password}
            onChange={(e) => onChange('password', e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            El empleado podrá cambiar su contraseña después del primer inicio de sesión.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            required
            value={datos.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  );
}


