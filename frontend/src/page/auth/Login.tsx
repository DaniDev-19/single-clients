import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Inputs from '../../components/ui/Inputs';
import Toggle from '../../components/ui/CheckBox';
import Buttons from '../../components/ui/Buttons';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';
import loginIllustration from '../../assets/login_illustration.png';

function Login() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [email, setEmail] = useState('admin@zymtaxis.com');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const [view, setView] = useState<'login' | 'forgot' | 'verify' | 'reset'>('login');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const testimonials = [
    {
      text: "El control de órdenes de servicio y la facturación bimonetaria automatizaron por completo el soporte técnico de mi negocio. Un sistema premium, rápido y elegante.",
      author: "DaniDev",
      role: "Director de Soporte Técnico"
    },
    {
      text: "La matriz de permisos detallada y el control de inventario en tiempo real con alertas críticas nos ahorró incontables horas de auditoría.",
      author: "Marcos Pérez",
      role: "Gerente de Operaciones"
    },
    {
      text: "El módulo de créditos y fiados es una mina de oro. Nos permite cobrar puntualmente las cuotas y hacer seguimiento sin perder un centavo.",
      author: "Carla Espinoza",
      role: "Administradora General"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showAlert({
        title: 'Credenciales incompletas',
        description: 'Por favor, rellene todos los campos de acceso.',
        variant: 'warning',
      });
      return;
    }

    showLoading({ title: 'Autenticando', subtitle: 'Verificando firma de seguridad del usuario...' });

    setTimeout(() => {
      hideLoading();
      showAlert({
        title: 'Acceso Autorizado',
        description: '¡Bienvenido de nuevo al panel de administración!',
        variant: 'success',
      });
      navigate('/');
    }, 1500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) {
      showAlert({ title: 'Campo requerido', description: 'Por favor, ingrese su correo de acceso.', variant: 'warning' });
      return;
    }
    showLoading({ title: 'Buscando Cuenta', subtitle: 'Verificando existencia en base de datos...' });
    setTimeout(() => {
      hideLoading();
      showAlert({ title: 'Código Enviado', description: 'Se ha enviado un código de 6 dígitos a su correo electrónico.', variant: 'success' });
      setView('verify');
    }, 1200);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      showAlert({ title: 'Código inválido', description: 'El código de verificación debe tener 6 dígitos.', variant: 'warning' });
      return;
    }
    showLoading({ title: 'Validando Código', subtitle: 'Verificando firma del token temporal...' });
    setTimeout(() => {
      hideLoading();
      showAlert({ title: 'Código Autorizado', description: 'Acceso temporal concedido. Proceda a cambiar su clave.', variant: 'success' });
      setView('reset');
    }, 1000);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showAlert({ title: 'Clave insegura', description: 'La nueva contraseña debe tener al menos 6 caracteres.', variant: 'warning' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showAlert({ title: 'Claves no coinciden', description: 'Las contraseñas ingresadas no son iguales.', variant: 'warning' });
      return;
    }
    showLoading({ title: 'Actualizando Credenciales', subtitle: 'Encriptando y guardando nueva clave...' });
    setTimeout(() => {
      hideLoading();
      showAlert({ title: 'Contraseña Actualizada', description: 'Su clave ha sido cambiada con éxito. Inicie sesión.', variant: 'success' });
      setView('login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#07070a] flex flex-col lg:flex-row relative overflow-hidden font-sans">
      <div className="hidden lg:flex lg:w-[55%] bg-[#09090f] border-r border-border-dark flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-600/10 border border-purple-500/20 text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xs font-black tracking-widest text-white uppercase">
            {import.meta.env.VITE_APP_TITLE || 'zymtaxis solutions'}
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 max-w-lg mx-auto py-12">
          <div className="rounded-xl border border-border-dark bg-[#0e0e16]/80 p-3 shadow-2xl backdrop-blur-md transition hover:scale-[1.01] duration-300">
            <img
              src={loginIllustration}
              alt="Dashboard Mockup"
              className="rounded-lg object-cover max-h-[380px] w-full"
            />
          </div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto w-full min-h-[90px] flex flex-col justify-end">
          <div className="transition-all duration-500 transform translate-y-0 opacity-100 space-y-2">
            <p className="text-xs text-gray-300 italic leading-relaxed">
              &ldquo;{testimonials[testimonialIndex].text}&rdquo;
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-white font-bold">{testimonials[testimonialIndex].author}</span>
              <span className="text-[9px] text-gray-500 font-medium">— {testimonials[testimonialIndex].role}</span>
            </div>
          </div>
          <div className="flex gap-1.5 mt-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  testimonialIndex === idx ? 'w-6 bg-purple-600' : 'w-1.5 bg-gray-700'
                }`}
                title={`Testimonial slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-md w-full bg-[#0d0d14]/70 backdrop-blur-xl border border-border-dark p-8 rounded-xl shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex lg:hidden h-12 w-12 items-center justify-center rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-400 shadow-md mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-sm font-black tracking-widest text-white uppercase lg:text-base">
              {import.meta.env.VITE_APP_TITLE || 'zymtaxis solutions'}
            </h1>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
              {import.meta.env.VITE_APP_SLOGAN || 'aprende creando y crea aprendiendo'}
            </p>
          </div>

          {view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Inputs
                label="Correo de Acceso"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="ejemplo@correo.com"
                required
              />

              <div className="space-y-1">
                <Inputs
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  required
                />
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-[9px] text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>
              </div>

              <div className="py-1">
                <Toggle
                  checked={rememberMe}
                  onChange={(checked) => setRememberMe(checked)}
                  label="Mantener sesión iniciada en este equipo"
                />
              </div>

              <Buttons type="submit" variant="primary" className="w-full justify-center py-2.5">
                Iniciar Sesión
              </Buttons>
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1 text-xs text-gray-400">
                <span className="text-[10px] text-purple-400 uppercase font-black tracking-widest block">Recuperar Acceso</span>
                <p>Ingrese su correo registrado para recibir un código de verificación de 6 dígitos.</p>
              </div>

              <Inputs
                label="Correo de Acceso"
                type="email"
                value={recoveryEmail}
                onChange={setRecoveryEmail}
                placeholder="ejemplo@correo.com"
                required
              />

              <div className="flex gap-2 pt-2">
                <Buttons
                  type="button"
                  variant="secondary"
                  onClick={() => setView('login')}
                  className="w-1/2 justify-center py-2"
                >
                  Volver
                </Buttons>
                <Buttons
                  type="submit"
                  variant="primary"
                  className="w-1/2 justify-center py-2"
                >
                  Enviar Código
                </Buttons>
              </div>
            </form>
          )}

          {view === 'verify' && (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="space-y-1 text-xs text-gray-400">
                <span className="text-[10px] text-purple-400 uppercase font-black tracking-widest block">Verificar Código</span>
                <p>Hemos enviado un código a su correo. Ingrese el código para autorizar el restablecimiento.</p>
              </div>

              <Inputs
                label="Código de Verificación (6 dígitos)"
                value={verificationCode}
                onChange={setVerificationCode}
                placeholder="Ej. 123456"
                maxLength={6}
                required
              />

              <div className="flex gap-2 pt-2">
                <Buttons
                  type="button"
                  variant="secondary"
                  onClick={() => setView('forgot')}
                  className="w-1/2 justify-center py-2"
                >
                  Atrás
                </Buttons>
                <Buttons
                  type="submit"
                  variant="primary"
                  className="w-1/2 justify-center py-2"
                >
                  Verificar
                </Buttons>
              </div>
            </form>
          )}

          {view === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="space-y-1 text-xs text-gray-400">
                <span className="text-[10px] text-purple-400 uppercase font-black tracking-widest block">Restablecer Clave</span>
                <p>Ingrese su nueva contraseña de acceso segura para actualizar la cuenta.</p>
              </div>

              <Inputs
                label="Nueva Contraseña"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="••••••••"
                required
              />

              <Inputs
                label="Confirmar Nueva Contraseña"
                type="password"
                value={confirmNewPassword}
                onChange={setConfirmNewPassword}
                placeholder="••••••••"
                required
              />

              <Buttons type="submit" variant="primary" className="w-full justify-center py-2.5 mt-2">
                Actualizar Contraseña
              </Buttons>
            </form>
          )}

          <div className="text-center pt-2">
            <span className="text-[9px] text-gray-600 uppercase font-bold tracking-wider">
              Consola Comercial Segura v1.0.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
