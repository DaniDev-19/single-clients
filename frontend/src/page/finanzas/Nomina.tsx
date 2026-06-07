import { useState, useMemo } from 'react';
import Table from '../../components/Table';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';
import loginIllustration from '../../assets/login_illustration.png';

interface Employee {
  id: number;
  name: string;
  position: string;
  baseSalary: number;
  payFrequency: 'diario' | 'semanal' | 'quincenal' | 'mensual';
  status: 'activo' | 'vacaciones' | 'comision' | 'suspendido';
  email: string;
}

interface PayrollConcept {
  id: number;
  name: string;
  type: 'ingreso' | 'egreso';
  amount: number;
  description: string;
}

interface PaymentRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  period: string;
  payDate: string;
  baseAmount: number;
  bonuses: number;
  deductions: number;
  netAmount: number;
  payFrequency: string;
  hasCapture: boolean;
  status: 'completed' | 'pending';
}

function Nomina() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: 'Marcos Pérez', position: 'Técnico Soporte Senior', baseSalary: 350.00, payFrequency: 'quincenal', status: 'activo', email: 'marcos@zymtaxis.com' },
    { id: 2, name: 'Carla Espinoza', position: 'Cajera Principal', baseSalary: 280.00, payFrequency: 'quincenal', status: 'vacaciones', email: 'carla@zymtaxis.com' },
    { id: 3, name: 'Juan Gómez', position: 'Agente de Ventas POS', baseSalary: 200.00, payFrequency: 'semanal', status: 'comision', email: 'juan@zymtaxis.com' },
    { id: 4, name: 'Sofía Méndez', position: 'Cajera Turno Tarde', baseSalary: 280.00, payFrequency: 'quincenal', status: 'activo', email: 'sofia@zymtaxis.com' },
    { id: 5, name: 'David Rondón', position: 'Administrador de Servidores', baseSalary: 50.00, payFrequency: 'diario', status: 'activo', email: 'david@zymtaxis.com' },
  ]);

  const [concepts, setConcepts] = useState<PayrollConcept[]>([
    { id: 1, name: 'Bono Vacacional Especial', type: 'ingreso', amount: 150.00, description: 'Bono otorgado por período de vacaciones reglamentarias.' },
    { id: 2, name: 'Comisión de Ventas POS', type: 'ingreso', amount: 75.00, description: 'Bono variable por cumplimiento de meta de ventas POS.' },
    { id: 3, name: 'Bono Asistencia Perfecta', type: 'ingreso', amount: 30.00, description: 'Concepto por cumplimiento de horario completo del mes.' },
    { id: 4, name: 'Deducción Seguro Social', type: 'egreso', amount: 12.50, description: 'Retención de ley para cotización de seguro social.' },
    { id: 5, name: 'Adelanto Quincenal', type: 'egreso', amount: 50.00, description: 'Adelanto de sueldo solicitado por el operador.' },
  ]);

  const [payments, setPayments] = useState<PaymentRecord[]>([
    { id: 101, employeeId: 1, employeeName: 'Marcos Pérez', period: '2026-05-30 (Fin de Mes)', payDate: '2026-05-30', baseAmount: 350.00, bonuses: 30.00, deductions: 12.50, netAmount: 367.50, payFrequency: 'quincenal', hasCapture: true, status: 'completed' },
    { id: 102, employeeId: 2, employeeName: 'Carla Espinoza', period: '2026-05-30 (Fin de Mes)', payDate: '2026-05-30', baseAmount: 280.00, bonuses: 150.00, deductions: 0, netAmount: 430.00, payFrequency: 'quincenal', hasCapture: true, status: 'completed' },
    { id: 103, employeeId: 3, employeeName: 'Juan Gómez', period: '2026-06-05 (Semana 22)', payDate: '2026-06-05', baseAmount: 200.00, bonuses: 75.00, deductions: 50.00, netAmount: 225.00, payFrequency: 'semanal', hasCapture: false, status: 'completed' },
  ]);

  const [activeTab, setActiveTab] = useState<'employees' | 'concepts' | 'history'>('employees');
  
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [historyPeriodFilter, setHistoryPeriodFilter] = useState('all');

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [isDetailEmployeeOpen, setIsDetailEmployeeOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeNameInput, setEmployeeNameInput] = useState('');
  const [employeePosInput, setEmployeePosInput] = useState('');
  const [employeeSalaryInput, setEmployeeSalaryInput] = useState('');
  const [employeeFreqInput, setEmployeeFreqInput] = useState<'diario' | 'semanal' | 'quincenal' | 'mensual'>('quincenal');
  const [employeeStatusInput, setEmployeeStatusInput] = useState<'activo' | 'vacaciones' | 'comision' | 'suspendido'>('activo');
  const [employeeEmailInput, setEmployeeEmailInput] = useState('');

  const [employeeDocs, setEmployeeDocs] = useState<Record<number, string[]>>({
    1: ['Contrato_Trabajo.pdf', 'Cedula_Identidad.pdf'],
  });

  const [conceptNameInput, setConceptNameInput] = useState('');
  const [conceptTypeInput, setConceptTypeInput] = useState<'ingreso' | 'egreso'>('ingreso');
  const [conceptAmountInput, setConceptAmountInput] = useState('');
  const [conceptDescInput, setConceptDescInput] = useState('');

  const [isPayOpen, setIsPayOpen] = useState(false);
  const [payBaseAmount, setPayBaseAmount] = useState('');
  const [payBonuses, setPayBonuses] = useState('');
  const [payDeductions, setPayDeductions] = useState('');
  const [payPeriod, setPayPeriod] = useState('');
  const [paySendEmail, setPaySendEmail] = useState(true);

  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [paymentCaptures, setPaymentCaptures] = useState<Record<number, string[]>>({
    101: [loginIllustration],
    102: [loginIllustration],
  });

  const handleOpenAddEmployee = () => {
    setEmployeeNameInput('');
    setEmployeePosInput('');
    setEmployeeSalaryInput('');
    setEmployeeFreqInput('quincenal');
    setEmployeeStatusInput('activo');
    setEmployeeEmailInput('');
    setIsAddEmployeeOpen(true);
  };

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const salary = parseFloat(employeeSalaryInput);
    if (!employeeNameInput.trim() || isNaN(salary)) {
      showAlert({ title: 'Error', description: 'Por favor complete todos los datos.', variant: 'danger' });
      return;
    }

    showLoading({ title: 'Registrando Empleado', subtitle: 'Creando ficha de personal...' });
    setTimeout(() => {
      const newEmp: Employee = {
        id: employees.length ? Math.max(...employees.map((emp) => emp.id)) + 1 : 1,
        name: employeeNameInput.trim(),
        position: employeePosInput.trim() || 'Operador',
        baseSalary: salary,
        payFrequency: employeeFreqInput,
        status: employeeStatusInput,
        email: employeeEmailInput.trim(),
      };
      setEmployees((prev) => [...prev, newEmp]);
      hideLoading();
      setIsAddEmployeeOpen(false);
      showAlert({ title: 'Empleado Creado', description: `Se registró la ficha de ${newEmp.name} con éxito.`, variant: 'success' });
    }, 1000);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setEmployeeNameInput(emp.name);
    setEmployeePosInput(emp.position);
    setEmployeeSalaryInput(emp.baseSalary.toString());
    setEmployeeFreqInput(emp.payFrequency);
    setEmployeeStatusInput(emp.status);
    setEmployeeEmailInput(emp.email);
    setIsEditEmployeeOpen(true);
  };

  const handleEditEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    const salary = parseFloat(employeeSalaryInput);
    if (!employeeNameInput.trim() || isNaN(salary)) {
      showAlert({ title: 'Error', description: 'Complete todos los campos válidamente.', variant: 'danger' });
      return;
    }

    showLoading({ title: 'Actualizando Ficha', subtitle: 'Guardando en base de datos de personal...' });
    setTimeout(() => {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedEmployee.id
            ? {
                ...emp,
                name: employeeNameInput.trim(),
                position: employeePosInput.trim(),
                baseSalary: salary,
                payFrequency: employeeFreqInput,
                status: employeeStatusInput,
                email: employeeEmailInput.trim(),
              }
            : emp
        )
      );
      hideLoading();
      setIsEditEmployeeOpen(false);
      showAlert({ title: 'Ficha Actualizada', description: `Cambios para ${employeeNameInput} guardados correctamente.`, variant: 'info' });
    }, 1000);
  };

  const handleUploadDoc = (empId: number) => {
    const docName = `Doc_Soporte_${Math.floor(100 + Math.random() * 900)}.pdf`;
    showLoading({ title: 'Subiendo archivo', subtitle: 'Adjuntando documento a ficha de empleado...' });
    setTimeout(() => {
      hideLoading();
      setEmployeeDocs((prev) => {
        const current = prev[empId] || [];
        return { ...prev, [empId]: [...current, docName] };
      });
      showAlert({ title: 'Archivo Guardado', description: `El documento "${docName}" fue anexado con éxito.`, variant: 'success' });
    }, 1000);
  };

  const handleRemoveDoc = (empId: number, index: number) => {
    setEmployeeDocs((prev) => {
      const current = [...(prev[empId] || [])];
      current.splice(index, 1);
      return { ...prev, [empId]: current };
    });
    showAlert({ title: 'Documento Retirado', description: 'El archivo adjunto fue eliminado.', variant: 'info' });
  };

  const handleAddConcept = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(conceptAmountInput);
    if (!conceptNameInput.trim() || isNaN(amount)) {
      showAlert({ title: 'Error', description: 'Complete todos los datos.', variant: 'danger' });
      return;
    }

    showLoading({ title: 'Registrando Concepto', subtitle: 'Añadiendo fórmula de pago...' });
    setTimeout(() => {
      const newConcept: PayrollConcept = {
        id: concepts.length ? Math.max(...concepts.map((c) => c.id)) + 1 : 1,
        name: conceptNameInput.trim(),
        type: conceptTypeInput,
        amount,
        description: conceptDescInput.trim() || 'Sin descripción adicional.',
      };
      setConcepts((prev) => [...prev, newConcept]);
      hideLoading();
      setConceptNameInput('');
      setConceptAmountInput('');
      setConceptDescInput('');
      showAlert({ title: 'Concepto Creado', description: `El concepto "${newConcept.name}" fue agregado.`, variant: 'success' });
    }, 800);
  };

  const handleOpenPay = (emp: Employee) => {
    setSelectedEmployee(emp);
    setPayBaseAmount(emp.baseSalary.toString());
    setPayBonuses('0');
    setPayDeductions('0');
    setPayPeriod(new Date().toISOString().split('T')[0] + ' (Nómina)');
    setPaySendEmail(true);
    setIsPayOpen(true);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    const base = parseFloat(payBaseAmount) || 0;
    const bonus = parseFloat(payBonuses) || 0;
    const ded = parseFloat(payDeductions) || 0;

    setIsPayOpen(false);
    showLoading({ title: 'Procesando Nómina', subtitle: 'Calculando neto y registrando desembolso...' });

    setTimeout(() => {
      const newPay: PaymentRecord = {
        id: payments.length ? Math.max(...payments.map((p) => p.id)) + 1 : 201,
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name,
        period: payPeriod,
        payDate: new Date().toISOString().split('T')[0],
        baseAmount: base,
        bonuses: bonus,
        deductions: ded,
        netAmount: base + bonus - ded,
        payFrequency: selectedEmployee.payFrequency,
        hasCapture: false,
        status: 'completed',
      };

      setPayments((prev) => [newPay, ...prev]);
      hideLoading();
      
      if (paySendEmail) {
        showAlert({
          title: 'Nómina Pagada & Correo Enviado',
          description: `Se procesó el pago por $${newPay.netAmount.toFixed(2)} y se envió el recibo digital a ${selectedEmployee.email}.`,
          variant: 'success',
        });
      } else {
        showAlert({
          title: 'Nómina Pagada',
          description: `Se registró el pago de $${newPay.netAmount.toFixed(2)} para ${newPay.employeeName}.`,
          variant: 'success',
        });
      }
    }, 1500);
  };

  const handleUploadPaymentCapture = (paymentId: number) => {
    showLoading({ title: 'Subiendo captura', subtitle: 'Adjuntando capture de transferencia bancaria...' });
    setTimeout(() => {
      hideLoading();
      setPaymentCaptures((prev) => ({
        ...prev,
        [paymentId]: [loginIllustration],
      }));
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, hasCapture: true } : p))
      );
      showAlert({ title: 'Capture Adjuntado', description: 'La imagen de transferencia bancaria fue enlazada al pago.', variant: 'success' });
    }, 1000);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      return emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
             emp.position.toLowerCase().includes(employeeSearch.toLowerCase());
    });
  }, [employees, employeeSearch]);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch = p.employeeName.toLowerCase().includes(historySearch.toLowerCase()) ||
                            p.period.toLowerCase().includes(historySearch.toLowerCase());
      const matchesPeriod = historyPeriodFilter === 'all' || p.payFrequency === historyPeriodFilter;
      return matchesSearch && matchesPeriod;
    });
  }, [payments, historySearch, historyPeriodFilter]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      activo: 'border-emerald-900/30 bg-emerald-950/20 text-emerald-400',
      vacaciones: 'border-blue-900/30 bg-blue-950/20 text-blue-400',
      comision: 'border-purple-900/30 bg-purple-950/20 text-purple-400',
      suspendido: 'border-red-900/30 bg-red-950/20 text-red-400',
    };
    return (
      <span className={`inline-block border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${styles[status] ?? styles.suspendido}`}>
        {status}
      </span>
    );
  };

  const employeeRows = filteredEmployees.map((emp) => ({
    name: (
      <div>
        <span className="font-bold text-white block">{emp.name}</span>
        <span className="text-[10px] text-gray-500 block">{emp.email}</span>
      </div>
    ),
    position: <span className="font-medium text-gray-300">{emp.position}</span>,
    salary: (
      <div>
        <span className="font-bold text-purple-400 block">${emp.baseSalary.toFixed(2)}</span>
        <span className="text-[9px] text-gray-500 block uppercase font-black tracking-wide">{emp.payFrequency}</span>
      </div>
    ),
    status: getStatusBadge(emp.status),
    acciones: (
      <div className="flex items-center gap-1.5 justify-start">
        <button
          type="button"
          onClick={() => {
            setSelectedEmployee(emp);
            setIsDetailEmployeeOpen(true);
          }}
          className="p-1 rounded border border-border-dark bg-bg-card text-gray-400 hover:text-white hover:border-purple-500/50 transition cursor-pointer"
          title="Ficha Empleado (ID)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedEmployee(emp);
            setIsUploadDocOpen(true);
          }}
          className="p-1 rounded border border-border-dark bg-bg-card text-gray-400 hover:text-white hover:border-purple-500/50 transition cursor-pointer"
          title="Documentos de Ficha"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleOpenEditEmployee(emp)}
          className="p-1 rounded border border-border-dark bg-bg-card text-gray-400 hover:text-white hover:border-purple-500/50 transition cursor-pointer"
          title="Editar Ficha"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleOpenPay(emp)}
          className="px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded border border-purple-600 bg-purple-950/20 text-purple-400 hover:bg-purple-900/35 transition cursor-pointer"
        >
          Pagar Nómina
        </button>
      </div>
    ),
  }));

  const historyRows = filteredPayments.map((p) => ({
    name: <span className="font-bold text-white">{p.employeeName}</span>,
    period: <span className="font-medium text-gray-300">{p.period}</span>,
    net: (
      <div>
        <span className="font-bold text-emerald-400 block">${p.netAmount.toFixed(2)}</span>
        <span className="text-[9px] text-gray-500 block uppercase tracking-wide">Base: ${p.baseAmount.toFixed(2)}</span>
      </div>
    ),
    payDate: <span className="text-gray-400 font-mono">{p.payDate}</span>,
    capture: (
      <div className="flex items-center gap-1.5 justify-start">
        {p.hasCapture ? (
          <button
            type="button"
            onClick={() => {
              setSelectedPayment(p);
              setIsCaptureOpen(true);
            }}
            className="p-1 rounded border border-border-dark bg-bg-card text-emerald-400 hover:text-emerald-350 cursor-pointer"
            title="Ver Capture de Pago"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleUploadPaymentCapture(p.id)}
            className="px-2 py-0.5 rounded border border-border-dark bg-black/25 text-gray-400 hover:text-white text-[9px] font-bold uppercase tracking-wide cursor-pointer"
          >
            Adjuntar Capture
          </button>
        )}
      </div>
    ),
    acciones: (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => showAlert({ title: 'Recibo Enviado', description: `Se reenvió la constancia de pago por correo a ${employees.find(e => e.id === p.employeeId)?.email || 'correo de destino'}.`, variant: 'success' })}
          className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded cursor-pointer transition border border-border-dark"
        >
          Reenviar Correo
        </button>
      </div>
    ),
  }));

  const employeeFilters = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
      <Inputs
        label=""
        value={employeeSearch}
        onChange={setEmployeeSearch}
        placeholder="Buscar empleado por nombre o cargo..."
        className="max-w-xs text-xs h-9"
      />
    </div>
  );

  const historyFilters = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
      <Inputs
        label=""
        value={historySearch}
        onChange={setHistorySearch}
        placeholder="Filtrar por empleado o período..."
        className="max-w-xs text-xs h-9"
      />

      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Frecuencia:</span>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'diario', label: 'Diario' },
          { key: 'semanal', label: 'Semanal' },
          { key: 'quincenal', label: 'Quincenal' },
          { key: 'mensual', label: 'Mensual' },
        ].map((freq) => (
          <button
            key={freq.key}
            type="button"
            onClick={() => setHistoryPeriodFilter(freq.key)}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition cursor-pointer ${
              historyPeriodFilter === freq.key
                ? 'border-purple-600 bg-purple-950/20 text-purple-400'
                : 'border-border-dark bg-bg-card text-gray-400 hover:text-white'
            }`}
          >
            {freq.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Nómina y Gestión de Empleados</h1>
        <p className="mt-1 text-xs text-gray-400">Control de nóminas del personal, asignación de conceptos salariales (bonos/descuentos) e historial de pagos.</p>
      </div>

      <div className="flex border-b border-border-dark gap-2">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeTab === 'employees' ? 'border-purple-650 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'
          }`}
        >
          Lista de Empleados
        </button>
        <button
          onClick={() => setActiveTab('concepts')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeTab === 'concepts' ? 'border-purple-650 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'
          }`}
        >
          Conceptos Salariales & Bonos
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeTab === 'history' ? 'border-purple-650 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'
          }`}
        >
          Historial de Nóminas Realizadas
        </button>
      </div>

      {activeTab === 'employees' && (
        <Table
          title="Ficha de Personal Activo"
          button={
            <Buttons variant="primary" size="sm" onClick={handleOpenAddEmployee}>
              Registrar Empleado
            </Buttons>
          }
          filters={employeeFilters}
          data={employeeRows}
          columns={['name', 'position', 'salary', 'status', 'acciones']}
        />
      )}

      {activeTab === 'concepts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-8 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Conceptos de Nómina Definidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-1">
              {concepts.map((concept) => (
                <div key={concept.id} className="border border-border-dark bg-bg-panel/40 p-4 rounded-lg flex flex-col justify-between min-h-[120px]">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-xs text-white block truncate">{concept.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      concept.type === 'ingreso' ? 'bg-emerald-950/45 text-emerald-400 border border-emerald-900/30' : 'bg-red-950/45 text-red-400 border border-red-900/30'
                    }`}>
                      {concept.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed mt-2">{concept.description}</p>
                  <div className="border-t border-border-dark/40 pt-2 mt-2 flex justify-between items-center text-[10px]">
                    <span className="text-gray-500">Monto Concepto:</span>
                    <strong className="text-white">${concept.amount.toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="lg:col-span-4 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Crear Nuevo Concepto</h2>
            <form onSubmit={handleAddConcept} className="space-y-4">
              <Inputs label="Nombre del Concepto" value={conceptNameInput} onChange={setConceptNameInput} placeholder="Ej. Bono de Transporte" required />
              <Selects label="Tipo de Concepto" value={conceptTypeInput} onChange={(v: any) => setConceptTypeInput(v)} options={['ingreso', 'egreso']} />
              <Inputs label="Monto Estándar ($)" type="number" step="0.01" value={conceptAmountInput} onChange={setConceptAmountInput} placeholder="Ej. 25.00" required />
              <Inputs label="Descripción del Concepto" value={conceptDescInput} onChange={setConceptDescInput} placeholder="Motivo o regla de aplicación" />
              <Buttons type="submit" variant="primary" className="w-full justify-center">
                Registrar Concepto
              </Buttons>
            </form>
          </section>
        </div>
      )}

      {activeTab === 'history' && (
        <Table
          title="Historial de Pagos de Personal"
          button={null}
          filters={historyFilters}
          data={historyRows}
          columns={['name', 'period', 'net', 'payDate', 'capture', 'acciones']}
        />
      )}

      <Modal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        title="Registrar Empleado en Nómina"
        onSubmit={handleAddEmployeeSubmit}
        primaryButtonText="Registrar Ficha"
      >
        <div className="space-y-4">
          <Inputs label="Nombre Completo" value={employeeNameInput} onChange={setEmployeeNameInput} placeholder="Ej. Marcos Pérez" required />
          <Inputs label="Correo Electrónico" type="email" value={employeeEmailInput} onChange={setEmployeeEmailInput} placeholder="marcos@zymtaxis.com" required />
          <Inputs label="Cargo / Puesto" value={employeePosInput} onChange={setEmployeePosInput} placeholder="Ej. Técnico de Redes" required />
          
          <div className="grid grid-cols-2 gap-4">
            <Inputs label="Salario Base ($)" type="number" step="0.01" value={employeeSalaryInput} onChange={setEmployeeSalaryInput} placeholder="Ej. 350.00" required />
            <Selects label="Frecuencia de Pago" value={employeeFreqInput} onChange={(v: any) => setEmployeeFreqInput(v)} options={['diario', 'semanal', 'quincenal', 'mensual']} />
          </div>

          <Selects label="Estado Laboral Inicial" value={employeeStatusInput} onChange={(v: any) => setEmployeeStatusInput(v)} options={['activo', 'vacaciones', 'comision', 'suspendido']} />
        </div>
      </Modal>

      <Modal
        isOpen={isEditEmployeeOpen}
        onClose={() => setIsEditEmployeeOpen(false)}
        title="Editar Ficha de Empleado"
        onSubmit={handleEditEmployeeSubmit}
        primaryButtonText="Guardar Ficha"
      >
        <div className="space-y-4">
          <Inputs label="Nombre Completo" value={employeeNameInput} onChange={setEmployeeNameInput} required />
          <Inputs label="Correo Electrónico" type="email" value={employeeEmailInput} onChange={setEmployeeEmailInput} required />
          <Inputs label="Cargo / Puesto" value={employeePosInput} onChange={setEmployeePosInput} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Inputs label="Salario Base ($)" type="number" step="0.01" value={employeeSalaryInput} onChange={setEmployeeSalaryInput} required />
            <Selects label="Frecuencia de Pago" value={employeeFreqInput} onChange={(v: any) => setEmployeeFreqInput(v)} options={['diario', 'semanal', 'quincenal', 'mensual']} />
          </div>

          <Selects label="Estado Laboral" value={employeeStatusInput} onChange={(v: any) => setEmployeeStatusInput(v)} options={['activo', 'vacaciones', 'comision', 'suspendido']} />
        </div>
      </Modal>

      <Modal
        isOpen={isDetailEmployeeOpen}
        onClose={() => setIsDetailEmployeeOpen(false)}
        title="Ficha Descriptiva de Personal (ID)"
        showActions={true}
        actions={[{ label: 'Cerrar', onClick: () => setIsDetailEmployeeOpen(false), variant: 'secondary' }]}
      >
        {selectedEmployee && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-border-dark pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedEmployee.name}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{selectedEmployee.position}</p>
              </div>
              {getStatusBadge(selectedEmployee.status)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-border-dark bg-bg-panel/40 p-2.5 rounded">
                <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Salario Asignado</span>
                <span className="text-white font-bold text-sm mt-1 block">${selectedEmployee.baseSalary.toFixed(2)}</span>
              </div>
              <div className="border border-border-dark bg-bg-panel/40 p-2.5 rounded">
                <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Período de Pago</span>
                <span className="text-white font-bold text-xs mt-1.5 block uppercase tracking-wide">{selectedEmployee.payFrequency}</span>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-border-dark/60 pt-3">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Correo Electrónico:</span><span className="text-gray-300">{selectedEmployee.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Contrato Vigente:</span><span className="text-emerald-400 font-semibold uppercase">Activo</span></div>
            </div>

            <div className="border-t border-border-dark/60 pt-3 space-y-2.5">
              <h5 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Documentos y Expediente PDF</h5>
              {employeeDocs[selectedEmployee.id]?.length ? (
                <div className="space-y-1.5">
                  {employeeDocs[selectedEmployee.id].map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-bg-panel border border-border-dark p-2 rounded">
                      <span className="text-[10px] text-gray-300 font-bold truncate max-w-[200px]">{doc}</span>
                      <button
                        type="button"
                        onClick={() => showAlert({ title: 'Descarga Iniciada', description: `Descargando archivo adjunto: ${doc}`, variant: 'success' })}
                        className="text-[9px] font-black uppercase text-purple-400 hover:text-purple-300 cursor-pointer"
                      >
                        Descargar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-550 italic text-[10px]">Sin documentación adjunta en este expediente.</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        title="Expediente de Documentos de Personal"
        showActions={true}
        actions={[{ label: 'Terminar', onClick: () => setIsUploadDocOpen(false), variant: 'primary' }]}
      >
        {selectedEmployee && (
          <div className="space-y-4 text-xs">
            <p className="text-gray-400">Adjunte contratos, identificaciones o comprobantes para <strong className="text-white">{selectedEmployee.name}</strong>.</p>
            
            <div className="border-2 border-dashed border-border-dark bg-bg-panel/20 p-6 rounded-lg text-center cursor-pointer hover:border-purple-500/40 transition" onClick={() => handleUploadDoc(selectedEmployee.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs text-gray-300 font-bold uppercase block">Haga Clic para Adjuntar PDF</span>
              <span className="text-[10px] text-gray-500 block mt-1">Soporta PDF de hasta 10MB</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider font-semibold">Documentos Cargados ({employeeDocs[selectedEmployee.id]?.length || 0})</h4>
              {employeeDocs[selectedEmployee.id]?.length ? (
                <div className="space-y-1.5">
                  {employeeDocs[selectedEmployee.id].map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-bg-panel border border-border-dark p-2.5 rounded">
                      <span className="text-[10px] text-gray-350 font-bold truncate max-w-[220px]">{doc}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => showAlert({ title: 'Descarga Iniciada', description: `Descargando archivo adjunto: ${doc}`, variant: 'success' })}
                          className="text-[9px] font-black uppercase text-purple-400 hover:text-purple-300 cursor-pointer"
                        >
                          Descargar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(selectedEmployee.id, idx)}
                          className="text-[9px] font-black uppercase text-red-500 hover:text-red-400 cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-550 italic text-[10px]">No se han adjuntado especificaciones técnicas.</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isPayOpen}
        onClose={() => setIsPayOpen(false)}
        title="Procesar Pago de Nómina Personal"
        onSubmit={handleExecutePayment}
        primaryButtonText="Registrar & Pagar"
      >
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="border-b border-border-dark pb-3">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Empleado Destinatario</span>
              <p className="text-white font-bold text-sm">{selectedEmployee.name}</p>
              <p className="text-[10px] text-purple-400 font-semibold">{selectedEmployee.position} • Frecuencia: <span className="uppercase">{selectedEmployee.payFrequency}</span></p>
            </div>

            <Inputs label="Período del Pago" value={payPeriod} onChange={setPayPeriod} placeholder="Ej. Primera Quincena Junio" required />

            <div className="grid grid-cols-3 gap-3">
              <Inputs label="Sueldo Base ($)" type="number" step="0.01" value={payBaseAmount} onChange={setPayBaseAmount} required />
              <Inputs label="Bonos / Extras ($)" type="number" step="0.01" value={payBonuses} onChange={setPayBonuses} required />
              <Inputs label="Deducciones ($)" type="number" step="0.01" value={payDeductions} onChange={setPayDeductions} required />
            </div>

            <div className="bg-bg-panel/40 border border-border-dark p-3 rounded-md flex justify-between items-center text-xs">
              <span className="text-gray-400">Total Neto a Desembolsar:</span>
              <strong className="text-emerald-400 text-sm">${((parseFloat(payBaseAmount) || 0) + (parseFloat(payBonuses) || 0) - (parseFloat(payDeductions) || 0)).toFixed(2)}</strong>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={paySendEmail}
                onChange={(e) => setPaySendEmail(e.target.checked)}
                className="h-4 w-4 rounded border-gray-700 bg-bg-panel text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <span>Enviar comprobante de pago digital al correo institucional</span>
            </label>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        title="Visualizador de Capture de Pago / Transferencia"
        showActions={true}
        actions={[{ label: 'Cerrar', onClick: () => setIsCaptureOpen(false), variant: 'secondary' }]}
      >
        {selectedPayment && (
          <div className="space-y-4 text-xs text-center">
            <h4 className="text-sm font-bold text-white">Capture de Transferencia de Nómina</h4>
            <p className="text-[10px] text-gray-450 uppercase tracking-wider">Empleado: {selectedPayment.employeeName} • Neto Pago: ${selectedPayment.netAmount.toFixed(2)}</p>
            <div className="rounded-lg border border-border-dark bg-[#0e0e16] p-3 shadow-xl max-h-[350px] flex items-center justify-center overflow-hidden">
              <img
                src={paymentCaptures[selectedPayment.id]?.[0] || loginIllustration}
                alt="Capture de Transferencia de Pago"
                className="rounded max-h-[320px] object-contain"
              />
            </div>
            <p className="text-[10px] text-gray-550 uppercase font-semibold">Comprobante de Conciliación Bancaria</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Nomina;
