import { useState, useEffect, useMemo } from 'react';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';

interface TaskItem {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface CredentialItem {
  id: number;
  platform: string;
  username: string;
  secret: string;
  url?: string;
}

function NotasCredenciales() {
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<'tasks' | 'creds' | 'scratch'>('tasks');

  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 1, title: 'Comprar bobinas de papel térmico de 80mm para facturas', completed: false, priority: 'medium' },
    { id: 2, title: 'Renovar dominio de hosting del servidor de staging', completed: true, priority: 'high' },
    { id: 3, title: 'Revisar niveles de stock de queso Palmita en nevera principal', completed: false, priority: 'low' },
    { id: 4, title: 'Llamar a soporte de CANTV por inestabilidad de fibra óptica', completed: false, priority: 'high' },
    { id: 5, title: 'Conciliar ventas del cierre de caja del fin de semana', completed: false, priority: 'medium' },
    { id: 6, title: 'Actualizar inventario de licencias SaaS corporativas', completed: false, priority: 'low' },
  ]);

  const [creds, setCreds] = useState<CredentialItem[]>([
    { id: 1, platform: 'Banahosting (Servidor VPS)', username: 'admin@empresa.com', secret: 'VPSPass2026_SecureKey!', url: 'https://billing.banahosting.com' },
    { id: 2, platform: 'Portal SENIAT (Impuestos)', username: 'J123456789', secret: 'ClaveFiscalSeniat_98', url: 'https://declaraciones.seniat.gob.ve' },
    { id: 3, platform: 'Cpanel Hostinger (Desarrollo)', username: 'developer@danidev.org', secret: 'DB_Master_Pass_99x!', url: 'https://cpanel.hostinger.com' },
    { id: 4, platform: 'Firebase Console (Bases de Datos)', username: 'firebase@danidev.org', secret: 'FB_App_Token_8801!', url: 'https://console.firebase.google.com' },
    { id: 5, platform: 'AWS S3 Console (Catálogo)', username: 'aws-s3-admin', secret: 'S3_Storage_Bucket_Key_xyz!', url: 'https://aws.amazon.com/console' },
  ]);

  const [scratchpad, setScratchpad] = useState<string>(() => {
    return localStorage.getItem('quick_scratchpad') || 'Escribe aquí cualquier nota rápida de soporte, claves temporales o números telefónicos...';
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitleInput, setTaskTitleInput] = useState('');
  const [taskPriorityInput, setTaskPriorityInput] = useState('medium');

  const [isCredModalOpen, setIsCredModalOpen] = useState(false);
  const [credPlatformInput, setCredPlatformInput] = useState('');
  const [credUserInput, setCredUserInput] = useState('');
  const [credSecretInput, setCredSecretInput] = useState('');
  const [credUrlInput, setCredUrlInput] = useState('');

  const [visibleSecrets, setVisibleSecrets] = useState<Record<number, boolean>>({});

  const [tasksPage, setTasksPage] = useState(1);
  const [credsPage, setCredsPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    localStorage.setItem('quick_scratchpad', scratchpad);
  }, [scratchpad]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitleInput.trim()) return;

    const newTask: TaskItem = {
      id: Date.now(),
      title: taskTitleInput,
      completed: false,
      priority: taskPriorityInput as any,
    };

    setTasks((prev) => [newTask, ...prev]);
    setTaskTitleInput('');
    setIsTaskModalOpen(false);
    setTasksPage(1);
    showAlert({ title: 'Tarea añadida', description: 'La tarea pendiente fue registrada.', variant: 'success' });
  };

  const handleToggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setTasksPage(1);
  };

  const handleAddCred = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credPlatformInput.trim() || !credUserInput.trim() || !credSecretInput.trim()) {
      showAlert({ title: 'Faltan datos', description: 'Por favor complete plataforma, usuario y clave.', variant: 'warning' });
      return;
    }

    const newCred: CredentialItem = {
      id: Date.now(),
      platform: credPlatformInput,
      username: credUserInput,
      secret: credSecretInput,
      url: credUrlInput || undefined,
    };

    setCreds((prev) => [newCred, ...prev]);
    setCredPlatformInput('');
    setCredUserInput('');
    setCredSecretInput('');
    setCredUrlInput('');
    setIsCredModalOpen(false);
    setCredsPage(1);
    showAlert({ title: 'Acceso registrado', description: 'Las credenciales de acceso se guardaron exitosamente.', variant: 'success' });
  };

  const handleDeleteCred = (id: number) => {
    setCreds((prev) => prev.filter((c) => c.id !== id));
    setCredsPage(1);
  };

  const toggleSecretVisibility = (id: number) => {
    setVisibleSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showAlert({ title: 'Copiado', description: `${label} copiado al portapapeles.`, variant: 'info' });
  };

  const totalTasksPages = useMemo(() => Math.max(1, Math.ceil(tasks.length / itemsPerPage)), [tasks]);
  const paginatedTasks = useMemo(() => {
    const start = (tasksPage - 1) * itemsPerPage;
    return tasks.slice(start, start + itemsPerPage);
  }, [tasks, tasksPage]);

  const totalCredsPages = useMemo(() => Math.max(1, Math.ceil(creds.length / itemsPerPage)), [creds]);
  const paginatedCreds = useMemo(() => {
    const start = (credsPage - 1) * itemsPerPage;
    return creds.slice(start, start + itemsPerPage);
  }, [creds, credsPage]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Gestor de Tareas, Accesos & Notas</h1>
        <p className="mt-1 text-xs text-gray-400">Panel administrativo privado para guardar credenciales de sistemas, checklist de pendientes y notas rápidas.</p>
      </div>

      <div className="flex border-b border-border-dark gap-2">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeTab === 'tasks' ? 'border-purple-650 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'
          }`}
        >
          Checklist de Pendientes
        </button>
        <button
          onClick={() => setActiveTab('creds')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeTab === 'creds' ? 'border-purple-650 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'
          }`}
        >
          Claves & Plataformas
        </button>
        <button
          onClick={() => setActiveTab('scratch')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeTab === 'scratch' ? 'border-purple-650 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'
          }`}
        >
          Bloc de Notas Rápido
        </button>
      </div>

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-bg-card border border-border-dark p-4 rounded-lg">
            <span className="text-xs text-gray-400">Lista de compras, recordatorios u operaciones del día.</span>
            <Buttons variant="primary" size="sm" onClick={() => setIsTaskModalOpen(true)}>
              Agregar Tarea
            </Buttons>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {paginatedTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-lg border bg-bg-card transition ${
                  task.completed ? 'border-emerald-950/20 bg-emerald-950/5' : 'border-border-dark'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    className="h-4 w-4 rounded border-gray-700 bg-bg-panel text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <span className={`text-xs block truncate ${task.completed ? 'text-gray-500 line-through' : 'text-white font-medium'}`}>
                      {task.title}
                    </span>
                    <span className={`inline-block text-[8px] font-black uppercase px-1 rounded mt-1 border ${
                      task.priority === 'high' ? 'border-red-900/40 bg-red-950/20 text-red-400' :
                      task.priority === 'medium' ? 'border-amber-900/40 bg-amber-950/20 text-amber-400' :
                      'border-gray-800 bg-gray-900 text-gray-400'
                    }`}>
                      Prioridad {task.priority}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 text-gray-500 hover:text-red-400 transition cursor-pointer"
                  title="Eliminar tarea"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {totalTasksPages > 1 && (
            <div className="flex items-center justify-between border-t border-border-dark/30 pt-3 text-[10px] text-gray-450 mt-2">
              <button
                type="button"
                onClick={() => setTasksPage((p) => Math.max(1, p - 1))}
                disabled={tasksPage === 1}
                className="px-2.5 py-1 rounded bg-bg-panel border border-border-dark text-gray-400 hover:text-white disabled:opacity-40 disabled:hover:text-gray-400 cursor-pointer"
              >
                Anterior
              </button>
              <span className="font-bold text-gray-400">
                {tasksPage} / {totalTasksPages}
              </span>
              <button
                type="button"
                onClick={() => setTasksPage((p) => Math.min(totalTasksPages, p + 1))}
                disabled={tasksPage === totalTasksPages}
                className="px-2.5 py-1 rounded bg-bg-panel border border-border-dark text-gray-400 hover:text-white disabled:opacity-40 disabled:hover:text-gray-400 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'creds' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-bg-card border border-border-dark p-4 rounded-lg">
            <span className="text-xs text-gray-400">Credenciales de servidores, bases de datos o portales gubernamentales.</span>
            <Buttons variant="primary" size="sm" onClick={() => setIsCredModalOpen(true)}>
              Nuevo Acceso
            </Buttons>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paginatedCreds.map((cred) => (
              <div key={cred.id} className="p-4 rounded-lg border border-border-dark bg-bg-card flex flex-col justify-between gap-4">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-white font-bold text-xs uppercase tracking-wide truncate">{cred.platform}</h3>
                    <button
                      onClick={() => handleDeleteCred(cred.id)}
                      className="text-gray-600 hover:text-red-400 transition cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {cred.url && (
                    <a
                      href={cred.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-purple-400 hover:underline inline-block mt-0.5"
                    >
                      Visitar enlace oficial
                    </a>
                  )}
                </div>

                <div className="space-y-2.5 bg-bg-panel/40 border border-border-dark p-3 rounded">
                  <div className="flex justify-between items-center">
                    <div className="min-w-0">
                      <span className="text-[9px] text-gray-500 uppercase font-black block">Usuario / Cédula</span>
                      <span className="text-xs text-white truncate block mt-0.5">{cred.username}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(cred.username, 'Usuario')}
                      className="p-1 rounded text-gray-500 hover:bg-bg-panel hover:text-white transition cursor-pointer shrink-0"
                      title="Copiar usuario"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex justify-between items-center border-t border-border-dark/30 pt-2">
                    <div className="min-w-0">
                      <span className="text-[9px] text-gray-500 uppercase font-black block">Contraseña / Clave</span>
                      <span className="text-xs font-mono tracking-wider text-purple-400 block mt-0.5">
                        {visibleSecrets[cred.id] ? cred.secret : '••••••••••••'}
                      </span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => toggleSecretVisibility(cred.id)}
                        className="p-1 rounded text-gray-500 hover:bg-bg-panel hover:text-white transition cursor-pointer"
                        title="Ver clave"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => copyToClipboard(cred.secret, 'Contraseña')}
                        className="p-1 rounded text-gray-500 hover:bg-bg-panel hover:text-white transition cursor-pointer"
                        title="Copiar contraseña"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalCredsPages > 1 && (
            <div className="flex items-center justify-between border-t border-border-dark/30 pt-3 text-[10px] text-gray-450 mt-2">
              <button
                type="button"
                onClick={() => setCredsPage((p) => Math.max(1, p - 1))}
                disabled={credsPage === 1}
                className="px-2.5 py-1 rounded bg-bg-panel border border-border-dark text-gray-400 hover:text-white disabled:opacity-40 disabled:hover:text-gray-400 cursor-pointer"
              >
                Anterior
              </button>
              <span className="font-bold text-gray-400">
                {credsPage} / {totalCredsPages}
              </span>
              <button
                type="button"
                onClick={() => setCredsPage((p) => Math.min(totalCredsPages, p + 1))}
                disabled={credsPage === totalCredsPages}
                className="px-2.5 py-1 rounded bg-bg-panel border border-border-dark text-gray-400 hover:text-white disabled:opacity-40 disabled:hover:text-gray-400 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'scratch' && (
        <div className="space-y-4">
          <div className="bg-bg-card border border-border-dark p-4 rounded-lg space-y-3">
            <span className="text-xs text-gray-400 block">Bloc temporal de guardado automático para anotaciones y textos rápidos.</span>
            <textarea
              value={scratchpad}
              onChange={(e) => setScratchpad(e.target.value)}
              rows={12}
              className="w-full bg-bg-panel border border-border-dark rounded-md p-4 text-xs font-mono text-gray-200 focus:outline-none focus:border-purple-600/70"
            />
          </div>
        </div>
      )}

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Agregar Nueva Tarea Pendiente"
        onSubmit={handleAddTask}
        primaryButtonText="Registrar Tarea"
      >
        <div className="space-y-4">
          <Inputs
            label="Descripción de la Tarea"
            value={taskTitleInput}
            onChange={setTaskTitleInput}
            placeholder="Ej. Comprar rollos de papel térmico"
            required
          />
          <div className="flex gap-2 justify-start items-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase mr-2">Prioridad:</span>
            {['low', 'medium', 'high'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setTaskPriorityInput(p)}
                className={`px-3 py-1 text-[10px] font-bold uppercase rounded border transition cursor-pointer ${
                  taskPriorityInput === p
                    ? 'border-purple-600 bg-purple-950/20 text-purple-400'
                    : 'border-border-dark bg-bg-panel/40 text-gray-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCredModalOpen}
        onClose={() => setIsCredModalOpen(false)}
        title="Registrar Credencial de Acceso"
        onSubmit={handleAddCred}
        primaryButtonText="Guardar Acceso"
      >
        <div className="space-y-4">
          <Inputs
            label="Nombre de la Plataforma / Sistema"
            value={credPlatformInput}
            onChange={setCredPlatformInput}
            placeholder="Ej. Portal SENIAT o Banahosting Admin"
            required
          />
          <Inputs
            label="Usuario / Correo / RIF"
            value={credUserInput}
            onChange={setCredUserInput}
            placeholder="admin@empresa.com"
            required
          />
          <Inputs
            label="Contraseña"
            type="password"
            value={credSecretInput}
            onChange={setCredSecretInput}
            placeholder="Ingrese clave secreta"
            required
          />
          <Inputs
            label="URL de Acceso (Opcional)"
            value={credUrlInput}
            onChange={setCredUrlInput}
            placeholder="https://..."
          />
        </div>
      </Modal>
    </div>
  );
}

export default NotasCredenciales;
