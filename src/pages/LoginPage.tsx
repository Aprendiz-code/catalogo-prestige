import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/brand/BrandLogo';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onGoBackToCatalog: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onGoBackToCatalog }) => {
  const { login, recoverPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [isRecoveringMode, setIsRecoveringMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    if (isRecoveringMode) {
      const { error } = await recoverPassword(email);
      setIsSubmitting(false);
      if (error) {
        setErrorMessage(error);
      } else {
        setRecoverySuccess(true);
      }
      return;
    }

    const { error } = await login(email, password);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#171717] flex items-center justify-center p-4 relative">
      
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#F8F7F4] to-[#ECEAE5] pointer-events-none" />

      <div className="relative w-full max-w-md bg-white border border-[#E6E3DD] rounded-xs p-8 shadow-[0_18px_50px_rgba(23,23,23,0.1)] space-y-6">
        
        {/* Logo Brand */}
        <div className="text-center">
          <BrandLogo size="lg" />
          <p className="text-xs text-[#8C8C8C] mt-2 font-mono tracking-widest uppercase">
            ACCESO PANEL ADMINISTRATIVO
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {recoverySuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Se ha enviado una instrucción de recuperación a tu correo.</span>
            </div>
          )}

          <div className="space-y-1 text-xs">
            <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px]">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-[#8C8C8C]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@prestigecol.online"
                className="w-full bg-[#F8F7F4] border border-[#E6E3DD] focus:border-[#B08D57] text-[#171717] pl-9 pr-3 py-2.5 rounded-xs outline-none"
              />
            </div>
          </div>

          {!isRecoveringMode && (
            <div className="space-y-1 text-xs">
              <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px]">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#8C8C8C]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8F7F4] border border-[#E6E3DD] focus:border-[#B08D57] text-[#171717] pl-9 pr-3 py-2.5 rounded-xs outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#B08D57] hover:bg-[#8E6E40] text-white font-bold text-xs tracking-widest py-3 rounded-xs flex items-center justify-center space-x-2 transition-transform transform hover:scale-[1.01] shadow-lg disabled:opacity-50"
          >
            <span>{isSubmitting ? 'PROCESANDO...' : isRecoveringMode ? 'ENVIAR RECUPERACIÓN' : 'INICIAR SESIÓN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Opciones de ayuda */}
        <div className="pt-4 border-t border-[#333333] flex items-center justify-between text-xs text-[#8C8C8C]">
          <button
            onClick={() => setIsRecoveringMode(!isRecoveringMode)}
            className="hover:text-[#E6D19A] transition-colors"
          >
            {isRecoveringMode ? 'Volver al inicio de sesión' : '¿Olvidaste tu contraseña?'}
          </button>

          <button
            onClick={onGoBackToCatalog}
            className="hover:text-white transition-colors underline"
          >
            Volver al catálogo
          </button>
        </div>

      </div>

    </div>
  );
};
