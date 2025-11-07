import { ReactNode } from 'react';
import { Stethoscope } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-8 ring-1 ring-gray-200/60">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Stethoscope size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-gray-600 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
          {children}
        </div>
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 DentalERP. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}



