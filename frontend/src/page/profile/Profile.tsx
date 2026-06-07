import { useState } from 'react';
import Inputs from '../../components/ui/Inputs';
import Buttons from '../../components/ui/Buttons';
import CheckBox from '../../components/ui/CheckBox';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

function Profile() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [username, setUsername] = useState('DaniDev');
  const [email, setEmail] = useState('danidev@example.com');
  const [phone, setPhone] = useState('+58 412-1234567');

  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);

  const [appTitle, setAppTitle] = useState('zymtaxis solutions');
  const [appSlogan, setAppSlogan] = useState('aprende creando y crea aprendiendo');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    showLoading({ title: 'Guardando Configuración', subtitle: 'Actualizando variables del sistema...' });

    setTimeout(() => {
      hideLoading();
      showAlert({
        title: 'Ajustes guardados',
        description: 'La configuración del perfil y parámetros del sistema se guardaron correctamente.',
        variant: 'success',
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Ajustes del Sistema & Perfil</h1>
        <p className="mt-1 text-xs text-gray-400">Configuración general de marca blanca, credenciales de seguridad y parámetros comerciales.</p>
      </div>

      <form onSubmit={handleSaveConfig} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Información de Cuenta</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Inputs
                label="Nombre del Usuario"
                value={username}
                onChange={setUsername}
                required
              />
              <Inputs
                label="Teléfono de Contacto"
                value={phone}
                onChange={setPhone}
              />
            </div>
            <Inputs
              label="Correo Electrónico de Acceso"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />
          </section>

          <section className="rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Seguridad & Credenciales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Inputs
                label="Contraseña Actual"
                type="password"
                value={currPassword}
                onChange={setCurrPassword}
                placeholder="••••••••"
              />
              <Inputs
                label="Nueva Contraseña"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="••••••••"
              />
              <Inputs
                label="Confirmar Contraseña"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="••••••••"
              />
            </div>
            <div className="pt-2">
              <CheckBox
                type="checkbox"
                label="Habilitar Autenticación de Doble Factor (2FA)"
                checked={twoFactor}
                onChange={(checked) => setTwoFactor(checked)}
              />
            </div>
          </section>

          <section className="rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Parámetros del Sistema (Marca Blanca)</h2>
            <Inputs
              label="Nombre del Negocio (Título)"
              value={appTitle}
              onChange={setAppTitle}
              required
            />
            <Inputs
              label="Lema Comercial (Pie de Página)"
              value={appSlogan}
              onChange={setAppSlogan}
              required
            />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-4 text-center">
            <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto shadow-md">
              {username
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{username}</h3>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mt-0.5">Rol: Administrador</p>
            </div>
            <div className="border-t border-border-dark/60 pt-4 text-xs text-gray-400 text-left space-y-2">
              <div className="flex justify-between"><span>Estado Cuenta:</span><span className="text-emerald-400 font-semibold">Activo</span></div>
              <div className="flex justify-between"><span>Último Acceso:</span><span>2026-06-07 09:20</span></div>
            </div>
          </section>

          <section className="rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Guardar Parámetros</h2>
            <p className="text-xs text-gray-400 leading-relaxed">Las modificaciones realizadas a nivel de base de datos se propagarán al sistema en tiempo real.</p>
            <Buttons type="submit" variant="primary" className="w-full justify-center">
              Guardar Configuración
            </Buttons>
          </section>
        </div>
      </form>
    </div>
  );
}

export default Profile;
