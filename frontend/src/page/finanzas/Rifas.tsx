import { useState, useEffect } from 'react';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import TextArea from '../../components/ui/TextArea';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';
import loginIllustration from '../../assets/login_illustration.png';

interface TicketSale {
  number: number;
  buyerName: string;
  phone: string;
  paid: boolean;
  hasCapture: boolean;
}

interface Raffle {
  id: number;
  title: string;
  prize: string;
  ticketCount: number;
  ticketCost: number;
  drawDate: string;
  description: string;
  imageUrl?: string;
  sales: Record<number, TicketSale>;
}

function Rifas() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [raffles, setRaffles] = useState<Raffle[]>([
    {
      id: 1,
      title: 'Sorteo Especial de Inauguración',
      prize: 'Servidor VPS Linux Pro (1 Año Gratis) + Soporte Especializado',
      ticketCount: 50,
      ticketCost: 5.00,
      drawDate: '2026-06-25',
      description: 'Gran sorteo para celebrar nuestro nuevo portal. El ticket ganador se anunciará por Instagram Live.',
      imageUrl: loginIllustration,
      sales: {
        5: { number: 5, buyerName: 'Marcos Pérez', phone: '0412-5551234', paid: true, hasCapture: true },
        12: { number: 12, buyerName: 'Carla Espinoza', phone: '0424-9998877', paid: true, hasCapture: false },
        44: { number: 44, buyerName: 'Roberto Díaz', phone: '0416-8889900', paid: false, hasCapture: true },
      },
    },
  ]);

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  const [titleInput, setTitleInput] = useState('');
  const [prizeInput, setPrizeInput] = useState('');
  const [ticketCountInput, setTicketCountInput] = useState('50');
  const [ticketCostInput, setTicketCostInput] = useState('2.00');
  const [drawDateInput, setDrawDateInput] = useState('2026-06-30');
  const [descInput, setDescInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const [isRaffleDetailsOpen, setIsRaffleDetailsOpen] = useState(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawWinner, setDrawWinner] = useState<TicketSale | null>(null);
  const [currentFlashNumber, setCurrentFlashNumber] = useState<number | null>(null);
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);

  const [isTicketSaleOpen, setIsTicketSaleOpen] = useState(false);
  const [selectedTicketNumber, setSelectedTicketNumber] = useState<number | null>(null);
  const [buyerNameInput, setBuyerNameInput] = useState('');
  const [buyerPhoneInput, setBuyerPhoneInput] = useState('');
  const [ticketPaidInput, setTicketPaidInput] = useState(true);

  const [isViewCaptureOpen, setIsViewCaptureOpen] = useState(false);
  const [captureViewerNumber, setCaptureViewerNumber] = useState<number | null>(null);

  const [timeTick, setTimeTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountdownText = (drawDateStr: string) => {
    if (timeTick < 0) return '';
    const target = new Date(drawDateStr + 'T23:59:59').getTime();
    const now = new Date().getTime();
    const diff = target - now;
    if (diff <= 0) return 'Sorteo finalizado / Por realizar';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const handleCreateRaffleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(ticketCountInput);
    const cost = parseFloat(ticketCostInput);

    if (!titleInput.trim() || !prizeInput.trim() || isNaN(count) || isNaN(cost)) {
      showAlert({ title: 'Error', description: 'Por favor complete todos los datos del sorteo.', variant: 'warning' });
      return;
    }

    showLoading({ title: 'Registrando Dinámica', subtitle: 'Configurando taletario digital de la rifa...' });

    setTimeout(() => {
      const newRaffle: Raffle = {
        id: raffles.length ? Math.max(...raffles.map((r) => r.id)) + 1 : 1,
        title: titleInput.trim(),
        prize: prizeInput.trim(),
        ticketCount: count,
        ticketCost: cost,
        drawDate: drawDateInput,
        description: descInput.trim() || 'Sin descripción adicional.',
        imageUrl: imageInput || undefined,
        sales: {},
      };

      setRaffles((prev) => [newRaffle, ...prev]);
      hideLoading();
      setActiveTab('list');
      showAlert({ title: 'Rifa Creada', description: `Se configuró el sorteo para rifar "${newRaffle.prize}".`, variant: 'success' });

      setTitleInput('');
      setPrizeInput('');
      setTicketCountInput('50');
      setTicketCostInput('2.00');
      setDescInput('');
      setImageInput('');
    }, 1200);
  };

  const handleOpenTicketSale = (num: number) => {
    if (!selectedRaffle) return;
    const existing = selectedRaffle.sales[num];

    setSelectedTicketNumber(num);
    if (existing) {
      setBuyerNameInput(existing.buyerName);
      setBuyerPhoneInput(existing.phone);
      setTicketPaidInput(existing.paid);
    } else {
      setBuyerNameInput('');
      setBuyerPhoneInput('');
      setTicketPaidInput(true);
    }
    setIsTicketSaleOpen(true);
  };

  const handleSaveTicketSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRaffle || selectedTicketNumber === null) return;

    const updatedSales = { ...selectedRaffle.sales };
    if (!buyerNameInput.trim()) {
      delete updatedSales[selectedTicketNumber];
      showAlert({ title: 'Número Liberado', description: `El boleto #${selectedTicketNumber} está disponible nuevamente.`, variant: 'info' });
    } else {
      updatedSales[selectedTicketNumber] = {
        number: selectedTicketNumber,
        buyerName: buyerNameInput.trim(),
        phone: buyerPhoneInput.trim(),
        paid: ticketPaidInput,
        hasCapture: updatedSales[selectedTicketNumber]?.hasCapture ?? false,
      };
      showAlert({ title: 'Boleto Asignado', description: `Boleto #${selectedTicketNumber} registrado para ${buyerNameInput.trim()}.`, variant: 'success' });
    }

    const updatedRaffle = { ...selectedRaffle, sales: updatedSales };
    setSelectedRaffle(updatedRaffle);
    setRaffles((prev) => prev.map((r) => (r.id === selectedRaffle.id ? updatedRaffle : r)));
    setIsTicketSaleOpen(false);
  };

  const handleUploadTicketCapture = (num: number) => {
    if (!selectedRaffle) return;
    showLoading({ title: 'Subiendo comprobante', subtitle: 'Anexando capture de pago al boleto...' });
    setTimeout(() => {
      hideLoading();
      const updatedSales = { ...selectedRaffle.sales };
      if (updatedSales[num]) {
        updatedSales[num].hasCapture = true;
      }
      const updatedRaffle = { ...selectedRaffle, sales: updatedSales };
      setSelectedRaffle(updatedRaffle);
      setRaffles((prev) => prev.map((r) => (r.id === selectedRaffle.id ? updatedRaffle : r)));
      showAlert({ title: 'Capture Anexado', description: `Se adjuntó comprobante para el boleto #${num}.`, variant: 'success' });
    }, 1000);
  };

  const handleDeleteRaffle = (id: number) => {
    showLoading({ title: 'Cancelando Sorteo', subtitle: 'Eliminando registros y liberando boletos...' });
    setTimeout(() => {
      hideLoading();
      setRaffles((prev) => prev.filter((r) => r.id !== id));
      showAlert({ title: 'Actividad Cancelada', description: 'La rifa ha sido cancelada y removida del panel.', variant: 'success' });
      if (selectedRaffle?.id === id) {
        setSelectedRaffle(null);
        setIsRaffleDetailsOpen(false);
      }
    }, 1000);
  };

  const handleStartDraw = () => {
    if (!selectedRaffle) return;
    const soldNumbers = Object.keys(selectedRaffle.sales).map(Number);
    if (soldNumbers.length === 0) {
      showAlert({ title: 'Error', description: 'No hay boletos vendidos para realizar el sorteo.', variant: 'warning' });
      return;
    }

    setIsDrawModalOpen(true);
    setIsDrawing(true);
    setDrawWinner(null);

    let ticks = 0;
    const maxTicks = 25;
    let speed = 80;

    const doTick = () => {
      ticks++;
      const randomNum = soldNumbers[Math.floor(Math.random() * soldNumbers.length)];
      setCurrentFlashNumber(randomNum);

      if (ticks >= maxTicks) {
        const finalWinnerNum = soldNumbers[Math.floor(Math.random() * soldNumbers.length)];
        const winner = selectedRaffle.sales[finalWinnerNum];
        setCurrentFlashNumber(finalWinnerNum);
        setDrawWinner(winner);
        setIsDrawing(false);
        showAlert({ title: 'Sorteo Completado', description: `¡El número ganador es el ${finalWinnerNum.toString().padStart(2, '0')} de ${winner.buyerName}!`, variant: 'success' });
      } else {
        speed += 12;
        setTimeout(doTick, speed);
      }
    };

    setTimeout(doTick, speed);
  };

  const handleExportWinner = () => {
    if (!selectedRaffle || !drawWinner) return;
    showLoading({ title: 'Generando Acta Digital', subtitle: 'Dibujando certificado oficial...' });

    setTimeout(() => {
      hideLoading();
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 800, 600);
      gradient.addColorStop(0, '#0f0c1b');
      gradient.addColorStop(1, '#050209');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);

      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, 760, 560);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, 750, 550);

      ctx.shadowColor = '#9333ea';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ACTA OFICIAL DE GANADOR', 400, 95);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText('Z Y M T A X I S   S O L U T I O N S', 400, 135);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'italic 18px sans-serif';
      ctx.fillText('Por medio de la presente se certifica al ganador del sorteo:', 400, 200);

      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(selectedRaffle.title.toUpperCase(), 400, 240);

      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(150, 280, 500, 150);
      ctx.strokeStyle = '#a855f7';
      ctx.strokeRect(150, 280, 500, 150);

      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('GANADOR(A)', 400, 315);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(drawWinner.buyerName.toUpperCase(), 400, 360);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`BOLETO GANADOR: #${drawWinner.number.toString().padStart(2, '0')}`, 400, 405);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('PREMIO ENTREGADO:', 400, 470);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.fillText(selectedRaffle.prize, 400, 495);

      ctx.fillStyle = '#475569';
      ctx.font = '13px sans-serif';
      ctx.fillText(`Fecha de Emisión: ${new Date().toLocaleDateString()} • Código: SN-${Math.floor(100000 + Math.random() * 900000)}`, 400, 550);

      const link = document.createElement('a');
      link.download = `ganador_boleto_${drawWinner.number}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showAlert({ title: 'Acta Exportada', description: 'Se descargó el comprobante oficial en formato PNG.', variant: 'success' });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Dinámicas de Rifas & Sorteos</h1>
          <p className="mt-1 text-xs text-gray-400">Diseño de sorteos de incentivo para ventas y control de boletería vendida/reservada.</p>
        </div>

        <div className="flex border border-border-dark bg-bg-card p-1 rounded gap-1 self-start sm:self-auto shadow-md">
          <button
            onClick={() => {
              setSelectedRaffle(null);
              setIsRaffleDetailsOpen(false);
              setActiveTab('list');
            }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition cursor-pointer ${
              activeTab === 'list' ? 'bg-purple-650 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Sorteos Vigentes
          </button>
          <button
            onClick={() => {
              setSelectedRaffle(null);
              setIsRaffleDetailsOpen(false);
              setActiveTab('create');
            }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition cursor-pointer ${
              activeTab === 'create' ? 'bg-purple-650 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Nueva Rifa
          </button>
        </div>
      </div>

      {activeTab === 'list' && !isRaffleDetailsOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {raffles.map((r) => {
            const soldCount = Object.keys(r.sales).length;
            const progress = (soldCount / r.ticketCount) * 100;
            const revenue = Object.values(r.sales).filter((s) => s.paid).length * r.ticketCost;

            return (
              <div key={r.id} className="border border-border-dark bg-bg-card rounded-lg overflow-hidden flex flex-col justify-between shadow-lg relative group">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRaffle(r.id);
                  }}
                  className="absolute top-3 right-3 p-1.5 bg-black/70 hover:bg-red-950/80 border border-border-dark hover:border-red-900/40 text-gray-400 hover:text-red-400 rounded transition cursor-pointer z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 duration-200"
                  title="Cancelar y eliminar rifa"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div className="relative h-40 bg-[#07070a] border-b border-border-dark flex items-center justify-center overflow-hidden">
                  <img src={r.imageUrl || loginIllustration} alt={r.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-purple-950/80 border border-purple-800 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    Costo: ${r.ticketCost.toFixed(2)} por Número
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/75 border border-purple-500/30 text-purple-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-wider flex items-center gap-1 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {getCountdownText(r.drawDate)}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-xs uppercase tracking-wide line-clamp-1">{r.title}</h3>
                    <p className="text-[10px] text-gray-500 font-semibold text-purple-400">Premio: {r.prize}</p>
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed mt-1">{r.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                      <span>Boletería Vendida: <strong>{soldCount} / {r.ticketCount}</strong></span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-bg-panel/40 border border-border-dark/60 p-2.5 rounded text-[10px]">
                    <div>
                      <span className="text-gray-550 block">RECAUDADO EFECTIVO</span>
                      <strong className="text-emerald-400 font-bold block mt-0.5">${revenue.toFixed(2)} USD</strong>
                    </div>
                    <div>
                      <span className="text-gray-550 block">PROYECCIÓN MÁXIMA</span>
                      <strong className="text-white font-bold block mt-0.5">${(r.ticketCount * r.ticketCost).toFixed(2)} USD</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border-dark/40 pt-3 text-[10px]">
                    <span className="text-gray-550">Sortea: <strong className="text-gray-400 font-mono">{r.drawDate}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRaffle(r);
                        setIsRaffleDetailsOpen(true);
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-550 text-white rounded font-bold uppercase text-[9px] transition cursor-pointer"
                    >
                      Gestionar Números
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'list' && isRaffleDetailsOpen && selectedRaffle && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-8 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-4">
            <div className="flex justify-between items-center border-b border-border-dark/60 pb-3">
              <div>
                <button
                  onClick={() => setIsRaffleDetailsOpen(false)}
                  className="text-purple-400 hover:text-purple-300 text-[10px] uppercase font-bold tracking-wider mb-1 block cursor-pointer"
                >
                  ← Volver a Sorteos
                </button>
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">Taletario de Números</h2>
              </div>
              <span className="text-[10px] text-gray-500 uppercase bg-bg-panel border border-border-dark px-2.5 py-0.5 rounded font-black">
                {Object.keys(selectedRaffle.sales).length} Vendidos
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: selectedRaffle.ticketCount }, (_, i) => i + 1).map((num) => {
                const sale = selectedRaffle.sales[num];
                const isSold = !!sale;
                const isPaid = sale?.paid;

                return (
                  <button
                    key={num}
                    onClick={() => handleOpenTicketSale(num)}
                    className={`aspect-square flex flex-col items-center justify-center rounded border transition text-center cursor-pointer relative group ${
                      isSold
                        ? isPaid
                          ? 'border-emerald-600/50 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/30'
                          : 'border-amber-600/50 bg-amber-950/20 text-amber-400 hover:bg-amber-900/30'
                        : 'border-border-dark bg-bg-panel/40 text-gray-400 hover:border-purple-500/40 hover:text-white'
                    }`}
                  >
                    <span className="font-mono font-bold text-xs">{num.toString().padStart(2, '0')}</span>
                    {isSold && (
                      <span className="text-[7px] block max-w-[50px] truncate uppercase font-bold mt-0.5 leading-none">
                        {sale.buyerName.split(' ')[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="lg:col-span-4 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Resumen de Ventas</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-450">Premio Mayor:</span>
                <span className="text-purple-400 font-bold text-right truncate max-w-[150px]">{selectedRaffle.prize}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-450">Costo por Boleto:</span>
                <span className="text-white font-bold font-mono">${selectedRaffle.ticketCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-450">Boletería Vendida:</span>
                <span className="text-white font-bold">{Object.keys(selectedRaffle.sales).length} Números</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-450">Total Neto Colectado:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  ${(Object.values(selectedRaffle.sales).filter((s) => s.paid).length * selectedRaffle.ticketCost).toFixed(2)} USD
                </span>
              </div>
              
              {Object.keys(selectedRaffle.sales).length > 0 && (
                <button
                  type="button"
                  onClick={() => handleStartDraw()}
                  className="w-full py-2 bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-550 hover:to-indigo-550 text-white font-extrabold uppercase text-[10px] tracking-wider rounded transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Realizar Sorteo Digital
                </button>
              )}
            </div>

            <div className="border-t border-border-dark/60 pt-4 space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Últimas Asignaciones</h4>
              {Object.values(selectedRaffle.sales).length === 0 ? (
                <p className="text-[10px] text-gray-550 italic">Haga clic en un número para venderlo.</p>
              ) : (
                Object.values(selectedRaffle.sales).map((sale) => (
                  <div key={sale.number} className="bg-bg-panel/50 border border-border-dark p-2 rounded text-[10px] flex justify-between items-center">
                    <div>
                      <strong className="text-white font-bold">Boleto #{sale.number}</strong>
                      <span className="text-gray-550 block">{sale.buyerName}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {sale.hasCapture ? (
                        <button
                          type="button"
                          onClick={() => {
                            setCaptureViewerNumber(sale.number);
                            setIsViewCaptureOpen(true);
                          }}
                          className="p-1 rounded bg-black/30 border border-border-dark text-emerald-400 hover:text-emerald-350 cursor-pointer"
                          title="Ver capture"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUploadTicketCapture(sale.number)}
                          className="px-1.5 py-0.5 rounded bg-black/30 border border-border-dark text-gray-550 hover:text-white text-[8px] font-bold uppercase cursor-pointer"
                        >
                          + Capture
                        </button>
                      )}

                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                        sale.paid ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                      }`}>
                        {sale.paid ? 'Pagado' : 'Falta'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'create' && (
        <form onSubmit={handleCreateRaffleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-8 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Detalles de la Dinámica Sorteo</h2>
            
            <Inputs label="Título de la Rifa / Actividad" value={titleInput} onChange={setTitleInput} placeholder="Ej. Gran Rifa Navideña Single Client" required />
            <Inputs label="Premio Principal" value={prizeInput} onChange={setPrizeInput} placeholder="Ej. Pizza Familiar + Combo de Refrescos" required />
            
            <div className="grid grid-cols-3 gap-3">
              <Inputs label="Total Números" type="number" value={ticketCountInput} onChange={setTicketCountInput} placeholder="Ej. 100" required />
              <Inputs label="Costo por Número ($)" type="number" step="0.01" value={ticketCostInput} onChange={setTicketCostInput} placeholder="Ej. 2.00" required />
              <Inputs label="Fecha del Sorteo" type="date" value={drawDateInput} onChange={setDrawDateInput} required />
            </div>

            <TextArea label="Reglamento e Instrucciones" value={descInput} onChange={setDescInput} placeholder="Describa los términos, lugar de entrega del premio y método de sorteo..." />
            <Inputs label="Enlace de Imagen Publicitaria (Opcional)" value={imageInput} onChange={setImageInput} placeholder="https://ejemplo.com/sorteo.png" />

            <Buttons type="submit" variant="primary" className="w-full justify-center">
              Registrar Actividad y Activar
            </Buttons>
          </section>
        </form>
      )}

      <Modal
        isOpen={isTicketSaleOpen}
        onClose={() => setIsTicketSaleOpen(false)}
        title={`Venta de Boleto #${selectedTicketNumber}`}
        onSubmit={handleSaveTicketSaleSubmit}
        primaryButtonText="Guardar Boleto"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-400">Ingrese los datos para registrar o liberar el boleto número <strong className="text-white">#{selectedTicketNumber}</strong>.</p>
          <Inputs label="Nombre del Comprador" value={buyerNameInput} onChange={setBuyerNameInput} placeholder="Ej. Marcos Pérez (Dejar vacío para liberar)" />
          <Inputs label="Teléfono / Contacto" value={buyerPhoneInput} onChange={setBuyerPhoneInput} placeholder="Ej. 0412-5551234" />
          
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none mt-2">
            <input
              type="checkbox"
              checked={ticketPaidInput}
              onChange={(e) => setTicketPaidInput(e.target.checked)}
              className="h-4 w-4 rounded border-gray-700 bg-bg-panel text-purple-650 focus:ring-purple-500 cursor-pointer"
            />
            <span>Marcar boleto como Cancelado / Pagado</span>
          </label>
        </div>
      </Modal>

      <Modal
        isOpen={isViewCaptureOpen}
        onClose={() => setIsViewCaptureOpen(false)}
        title={`Capture de Boleto #${captureViewerNumber}`}
        showActions={true}
        actions={[{ label: 'Cerrar', onClick: () => setIsViewCaptureOpen(false), variant: 'secondary' }]}
      >
        <div className="space-y-4 text-center text-xs">
          <h4 className="text-sm font-bold text-white">Comprobante de Pago</h4>
          <p className="text-[10px] text-gray-450 uppercase tracking-wider">Número de Boleto: #{captureViewerNumber}</p>
          <div className="rounded-lg border border-border-dark bg-[#0e0e16] p-3 shadow-xl max-h-[350px] flex items-center justify-center overflow-hidden">
            <img src={loginIllustration} alt="Capture de Pago" className="rounded max-h-[320px] object-contain" />
          </div>
          <p className="text-[10px] text-gray-550 uppercase font-semibold">Conciliación de Boletería Digital</p>
        </div>
      </Modal>

      <Modal
        isOpen={isDrawModalOpen}
        onClose={() => !isDrawing && setIsDrawModalOpen(false)}
        title="Tómbola de Sorteo Digital"
        showActions={!isDrawing}
        actions={[
          { label: 'Exportar Acta PNG', onClick: handleExportWinner, variant: 'primary' },
          { label: 'Cerrar', onClick: () => setIsDrawModalOpen(false), variant: 'secondary' }
        ]}
      >
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-6">
          {isDrawing ? (
            <div className="space-y-4">
              <span className="text-[10px] text-purple-400 font-black tracking-widest uppercase block animate-pulse">Mezclando Boletería...</span>
              <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-purple-900 to-indigo-900 border-4 border-purple-500 flex items-center justify-center shadow-[0_0_25px_#a855f7] animate-spin-slow">
                <span className="text-4xl font-mono font-black text-white">{currentFlashNumber?.toString().padStart(2, '0') ?? '--'}</span>
              </div>
              <p className="text-xs text-gray-550 italic font-medium">Extrayendo número ganador de la tómbola...</p>
            </div>
          ) : (
            drawWinner && (
              <div className="space-y-6 w-full animate-fade-in">
                <div className="inline-block px-3 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-[10px] font-black uppercase tracking-wider rounded animate-bounce">
                  ¡TENEMOS GANADOR!
                </div>

                <div className="border border-purple-600/40 bg-purple-950/15 p-6 rounded-lg shadow-xl relative overflow-hidden space-y-4 max-w-sm mx-auto">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-purple-600/10 rounded-bl-full flex items-center justify-center">
                    <span className="text-purple-400 font-mono font-black text-[10px] mr-2 mb-2">★</span>
                  </div>

                  <div className="text-gray-400 text-[9px] uppercase tracking-widest font-black">Ticket Ganador</div>
                  <div className="text-6xl font-black font-mono text-emerald-400 tracking-tight drop-shadow-[0_0_15px_#10b981]">
                    #{drawWinner.number.toString().padStart(2, '0')}
                  </div>

                  <div className="border-t border-purple-900/40 pt-3">
                    <span className="text-gray-550 text-[9px] uppercase font-bold block">Propietario del Boleto</span>
                    <strong className="text-white text-lg font-black block tracking-wide mt-0.5">{drawWinner.buyerName}</strong>
                    <span className="text-[10px] text-gray-450 font-mono mt-0.5 block">{drawWinner.phone}</span>
                  </div>

                  <div className="border-t border-purple-900/40 pt-3 text-[10px] text-gray-400 leading-relaxed">
                    Premio: <strong className="text-white block mt-0.5">{selectedRaffle?.prize}</strong>
                  </div>
                </div>

                <p className="text-xs text-gray-450">Puede descargar el acta de sorteo digital oficial para certificar este resultado en sus canales informativos.</p>
              </div>
            )
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Rifas;
