import { useState } from 'react';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

interface PaymentMethod {
  id: number;
  platform: 'pago_movil' | 'paypal' | 'zinli' | 'binance' | 'transferencia';
  alias: string;
  isEnabled: boolean;
  details: {
    bank?: string;
    phone?: string;
    idNumber?: string;
    email?: string;
    binanceId?: string;
    accountNumber?: string;
    accountType?: string;
  };
}

function MetodosPago() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      platform: 'pago_movil',
      alias: 'Pago Móvil Banesco Principal',
      isEnabled: true,
      details: {
        bank: 'Banesco (0134)',
        phone: '0412-5556677',
        idNumber: 'V-12345678',
      },
    },
    {
      id: 2,
      platform: 'paypal',
      alias: 'PayPal Corporativo Single',
      isEnabled: true,
      details: {
        email: 'pagos@singleclient.com',
      },
    },
    {
      id: 3,
      platform: 'binance',
      alias: 'Binance Pay Negocio',
      isEnabled: false,
      details: {
        binanceId: '998877665',
        email: 'binance@singleclient.com',
      },
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [platformInput, setPlatformInput] = useState<'pago_movil' | 'paypal' | 'zinli' | 'binance' | 'transferencia'>('pago_movil');
  const [aliasInput, setAliasInput] = useState('');
  
  const [bankInput, setBankInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [idNumberInput, setIdNumberInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [binanceIdInput, setBinanceIdInput] = useState('');
  const [accountNumberInput, setAccountNumberInput] = useState('');
  const [accountTypeInput, setAccountTypeInput] = useState('Corriente');

  const handleOpenAdd = () => {
    setPlatformInput('pago_movil');
    setAliasInput('');
    setBankInput('');
    setPhoneInput('');
    setIdNumberInput('');
    setEmailInput('');
    setBinanceIdInput('');
    setAccountNumberInput('');
    setAccountTypeInput('Corriente');
    setIsAddOpen(true);
  };

  const handleCreateMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aliasInput.trim()) {
      showAlert({ title: 'Error', description: 'Por favor complete el alias descriptivo del método.', variant: 'warning' });
      return;
    }

    showLoading({ title: 'Guardando Método de Pago', subtitle: 'Registrando credenciales de recaudación...' });

    setTimeout(() => {
      const newMethod: PaymentMethod = {
        id: methods.length ? Math.max(...methods.map((m) => m.id)) + 1 : 1,
        platform: platformInput,
        alias: aliasInput.trim(),
        isEnabled: true,
        details: {
          bank: ['pago_movil', 'transferencia'].includes(platformInput) ? bankInput : undefined,
          phone: platformInput === 'pago_movil' ? phoneInput : undefined,
          idNumber: ['pago_movil', 'transferencia'].includes(platformInput) ? idNumberInput : undefined,
          email: ['paypal', 'zinli', 'binance'].includes(platformInput) ? emailInput : undefined,
          binanceId: platformInput === 'binance' ? binanceIdInput : undefined,
          accountNumber: platformInput === 'transferencia' ? accountNumberInput : undefined,
          accountType: platformInput === 'transferencia' ? accountTypeInput : undefined,
        },
      };

      setMethods((prev) => [...prev, newMethod]);
      hideLoading();
      setIsAddOpen(false);
      showAlert({ title: 'Canal Configurado', description: `Se habilitó "${newMethod.alias}" correctamente.`, variant: 'success' });
    }, 1000);
  };

  const handleToggleMethodStatus = (id: number) => {
    setMethods((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextState = !m.isEnabled;
          showAlert({ title: 'Canal de Recaudación', description: `Canal de pago está ahora ${nextState ? 'HABILITADO' : 'INHABILITADO'}.`, variant: 'info' });
          return { ...m, isEnabled: nextState };
        }
        return m;
      })
    );
  };

  const getPlatformLabel = (platform: string) => {
    const labels: Record<string, string> = {
      pago_movil: 'Pago Móvil 🇻🇪',
      paypal: 'PayPal 💳',
      zinli: 'Zinli 💸',
      binance: 'Binance Pay 🪙',
      transferencia: 'Trans. Bancaria 🏦',
    };
    return labels[platform] || platform.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Métodos de Pago del E-Commerce</h1>
          <p className="mt-1 text-xs text-gray-400 font-medium">Configuración de los canales de recaudación financiera y cuentas de banco para facturas públicas.</p>
        </div>
        <Buttons onClick={handleOpenAdd} variant="primary" className="cursor-pointer">
          Agregar Método
        </Buttons>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.map((m) => (
          <div key={m.id} className="border border-border-dark bg-bg-card rounded-lg p-5 shadow-lg flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-purple-400 font-black uppercase tracking-wider bg-bg-panel border border-border-dark px-2 py-0.5 rounded">
                  {getPlatformLabel(m.platform)}
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${m.isEnabled ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-gray-600'}`} />
              </div>
              <h3 className="text-white font-bold text-xs uppercase tracking-wide line-clamp-1">{m.alias}</h3>
            </div>

            <div className="bg-bg-panel/40 border border-border-dark/60 p-3 rounded space-y-1.5 text-[10px] text-gray-300 font-mono">
              {m.details.phone && (
                <div className="flex justify-between"><span className="text-gray-500">Teléfono:</span><strong>{m.details.phone}</strong></div>
              )}
              {m.details.bank && (
                <div className="flex justify-between"><span className="text-gray-500">Banco:</span><strong>{m.details.bank}</strong></div>
              )}
              {m.details.idNumber && (
                <div className="flex justify-between"><span className="text-gray-500">Cédula/RIF:</span><strong>{m.details.idNumber}</strong></div>
              )}
              {m.details.email && (
                <div className="flex justify-between"><span className="text-gray-500">Correo:</span><strong className="truncate max-w-[130px]">{m.details.email}</strong></div>
              )}
              {m.details.binanceId && (
                <div className="flex justify-between"><span className="text-gray-500">Pay ID:</span><strong>{m.details.binanceId}</strong></div>
              )}
              {m.details.accountNumber && (
                <div className="flex flex-col space-y-0.5 mt-1 border-t border-border-dark/30 pt-1 text-[9px]">
                  <span className="text-gray-500">Nro Cuenta:</span>
                  <strong className="text-white select-all">{m.details.accountNumber}</strong>
                </div>
              )}
              {m.details.accountType && (
                <div className="flex justify-between"><span className="text-gray-500">Tipo:</span><strong>{m.details.accountType}</strong></div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border-dark/40 pt-3 text-[10px]">
              <span className="text-gray-500">Exponer en Portal: <strong className={m.isEnabled ? 'text-emerald-400' : 'text-gray-500'}>{m.isEnabled ? 'SÍ' : 'NO'}</strong></span>
              <button
                type="button"
                onClick={() => handleToggleMethodStatus(m.id)}
                className={`px-2 py-1.5 rounded transition text-[9px] uppercase font-bold cursor-pointer ${
                  m.isEnabled
                    ? 'bg-red-950/20 text-red-400 hover:bg-red-900/35 border border-red-900/30'
                    : 'bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/35 border border-emerald-900/30'
                }`}
              >
                {m.isEnabled ? 'Desactivar' : 'Habilitar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Configurar Nuevo Método de Recaudación"
        onSubmit={handleCreateMethodSubmit}
        primaryButtonText="Guardar Canal"
      >
        <div className="space-y-4">
          <Selects
            label="Plataforma de Recaudación"
            value={platformInput}
            onChange={(v: any) => setPlatformInput(v)}
            options={['pago_movil', 'paypal', 'zinli', 'binance', 'transferencia']}
          />

          <Inputs
            label="Alias / Nombre Descriptivo"
            value={aliasInput}
            onChange={setAliasInput}
            placeholder="Ej. Banesco Pago Móvil Negocio o PayPal Dólares"
            required
          />

          {['pago_movil', 'transferencia'].includes(platformInput) && (
            <Inputs
              label="Nombre del Banco"
              value={bankInput}
              onChange={setBankInput}
              placeholder="Ej. Banesco o Banco de Venezuela"
              required
            />
          )}

          {platformInput === 'pago_movil' && (
            <Inputs
              label="Número de Teléfono"
              value={phoneInput}
              onChange={setPhoneInput}
              placeholder="Ej. 0412-5556677"
              required
            />
          )}

          {['pago_movil', 'transferencia'].includes(platformInput) && (
            <Inputs
              label="Documento de Identidad (ID / Cédula / RIF)"
              value={idNumberInput}
              onChange={setIdNumberInput}
              placeholder="Ej. V-12345678 o J-30002221"
              required
            />
          )}

          {['paypal', 'zinli', 'binance'].includes(platformInput) && (
            <Inputs
              label="Correo de la Cuenta"
              type="email"
              value={emailInput}
              onChange={setEmailInput}
              placeholder="Ej. correo@dominio.com"
              required
            />
          )}

          {platformInput === 'binance' && (
            <Inputs
              label="Binance Pay ID (Opcional)"
              value={binanceIdInput}
              onChange={setBinanceIdInput}
              placeholder="Ej. 99887766"
            />
          )}

          {platformInput === 'transferencia' && (
            <div className="grid grid-cols-2 gap-3">
              <Inputs
                label="Número de Cuenta"
                value={accountNumberInput}
                onChange={setAccountNumberInput}
                placeholder="20 dígitos bancarios"
                required
              />
              <Selects
                label="Tipo de Cuenta"
                value={accountTypeInput}
                onChange={setAccountTypeInput}
                options={['Corriente', 'Ahorros']}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default MetodosPago;
