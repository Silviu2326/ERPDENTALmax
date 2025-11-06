import { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';

interface LoginPageProps {
  onLoginSuccess?: () => void;
  onGoToPortal?: () => void;
}

export default function LoginPage({ onLoginSuccess, onGoToPortal }: LoginPageProps) {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot-password'>('login');

  const handleLoginSuccess = (token: string) => {
    // Guardar token ya está en LoginForm
    if (onGoToPortal) {
      onGoToPortal();
    } else if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const handleGoToRegister = () => {
    setCurrentView('register');
  };

  const handleGoToForgotPassword = () => {
    setCurrentView('forgot-password');
  };

  const handleGoToLogin = () => {
    setCurrentView('login');
  };

  if (currentView === 'register') {
    return <RegisterPage onLogin={handleGoToLogin} />;
  }

  if (currentView === 'forgot-password') {
    return <ForgotPasswordPage onBack={handleGoToLogin} />;
  }

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Accede a tu Portal del Paciente"
    >
      <LoginForm
        onLoginSuccess={handleLoginSuccess}
        onForgotPassword={handleGoToForgotPassword}
        onRegister={handleGoToRegister}
      />
    </AuthLayout>
  );
}

