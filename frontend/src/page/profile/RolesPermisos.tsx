import { useState, useMemo } from 'react';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import Buttons from '../../components/ui/Buttons';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended';
}

interface PermissionRow {
  key: string;
  label: string;
  description: string;
}

function RolesPermisos() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [roles, setRoles] = useState<string[]>(['Administrador', 'Técnico Soporte', 'Cajero', 'Agente Ventas']);
  const [newRole, setNewRole] = useState('');

  const [users, setUsers] = useState<UserItem[]>([
    { id: 1, name: 'DaniDev', email: 'dani@zymtaxis.com', role: 'Administrador', status: 'active' },
    { id: 2, name: 'Marcos Pérez', email: 'marcos@zymtaxis.com', role: 'Técnico Soporte', status: 'active' },
    { id: 3, name: 'Carla Espinoza', email: 'carla@zymtaxis.com', role: 'Cajero', status: 'active' },
    { id: 4, name: 'Juan Gómez', email: 'juan@zymtaxis.com', role: 'Agente Ventas', status: 'active' },
    { id: 5, name: 'Sofía Méndez', email: 'sofia@zymtaxis.com', role: 'Cajero', status: 'active' },
    { id: 6, name: 'David Rondón', email: 'david@zymtaxis.com', role: 'Agente Ventas', status: 'active' },
  ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Agente Ventas' });

  const [usersPage, setUsersPage] = useState(1);
  const usersPerPage = 3;

  const permissions: PermissionRow[] = [
    { key: 'reports', label: 'Ver Reportes Financieros', description: 'Acceso completo a gráficos e ingresos generales.' },
    { key: 'pos', label: 'Operar Ventas (POS)', description: 'Registrar ventas directas y generar facturas.' },
    { key: 'cashier', label: 'Apertura y Cierre de Caja', description: 'Control de cuadre diario y flujo de efectivo.' },
    { key: 'support', label: 'Órdenes de Soporte Técnico', description: 'Creación e inspección del Kanban de servicio.' },
    { key: 'inventory', label: 'Modificar Stock e Inventario', description: 'Editar cantidades, precios y SKU de productos.' },
    { key: 'egresos', label: 'Registrar Control de Gastos', description: 'Registrar egresos de capital operativo de la empresa.' },
    { key: 'admin', label: 'Ajustes del Sistema y Roles', description: 'Configuraciones críticas de base de datos y accesos.' },
  ];

  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    'Administrador': { reports: true, pos: true, cashier: true, support: true, inventory: true, egresos: true, admin: true },
    'Técnico Soporte': { reports: false, pos: false, cashier: false, support: true, inventory: true, egresos: false, admin: false },
    'Cajero': { reports: false, pos: true, cashier: true, support: false, inventory: false, egresos: true, admin: false },
    'Agente Ventas': { reports: false, pos: true, cashier: false, support: false, inventory: false, egresos: false, admin: false },
  });

  const togglePermission = (role: string, permKey: string) => {
    setMatrix((prev) => {
      const rolePerms = prev[role] ? { ...prev[role] } : {};
      rolePerms[permKey] = !rolePerms[permKey];
      return { ...prev, [role]: rolePerms };
    });
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim()) return;

    if (roles.includes(newRole.trim())) {
      showAlert({ title: 'Rol existente', description: 'Este rol ya se encuentra registrado.', variant: 'warning' });
      return;
    }

    showLoading({ title: 'Registrando Rol', subtitle: 'Actualizando matriz de seguridad...' });
    setTimeout(() => {
      hideLoading();
      setRoles((prev) => [...prev, newRole.trim()]);
      setMatrix((prev) => ({
        ...prev,
        [newRole.trim()]: { reports: false, pos: false, cashier: false, support: false, inventory: false, egresos: false, admin: false }
      }));
      setNewRole('');
      showAlert({ title: 'Rol Registrado', description: `El rol "${newRole.trim()}" fue creado de forma segura.`, variant: 'success' });
    }, 1000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    showLoading({ title: 'Creando Usuario', subtitle: 'Registrando credenciales y perfil...' });
    setTimeout(() => {
      hideLoading();
      setUsers((prev) => [
        {
          id: prev.length ? Math.max(...prev.map((u) => u.id)) + 1 : 1,
          name: newUser.name.trim(),
          email: newUser.email.trim(),
          role: newUser.role,
          status: 'active',
        },
        ...prev,
      ]);
      setNewUser({ name: '', email: '', role: 'Agente Ventas' });
      setUsersPage(1);
      showAlert({ title: 'Usuario Creado', description: 'Nuevo perfil registrado. Se envió clave provisoria al correo.', variant: 'success' });
    }, 1000);
  };

  const handleUserRoleChange = (userId: number, role: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    showAlert({ title: 'Rol Actualizado', description: 'Cambio de permisos aplicado al instante.', variant: 'success' });
  };

  const handleUserStatusToggle = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          showAlert({
            title: nextStatus === 'active' ? 'Usuario Activado' : 'Usuario Suspendido',
            description: `Estado cambiado para ${u.name}.`,
            variant: nextStatus === 'active' ? 'success' : 'danger',
          });
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const totalUsersPages = useMemo(() => Math.max(1, Math.ceil(users.length / usersPerPage)), [users]);
  const paginatedUsers = useMemo(() => {
    const start = (usersPage - 1) * usersPerPage;
    return users.slice(start, start + usersPerPage);
  }, [users, usersPage]);

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Matriz de Roles y Permisos de Seguridad</h1>
        <p className="mt-1 text-xs text-gray-400">Administración de niveles de acceso a bases de datos, control de caja y operaciones comerciales.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-8 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border-dark/60 pb-3 gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">Matriz de Seguridad General</h2>
            <span className="text-[10px] text-purple-400 font-bold uppercase bg-purple-950/20 border border-purple-900/30 px-2 py-0.5 rounded">
              Cambios Auto-Guardados
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-dark/60 text-gray-400 font-bold uppercase text-[9px] tracking-wider bg-bg-panel/40">
                  <th className="p-3">Permiso / Operación</th>
                  {roles.map((role) => (
                    <th key={role} className="p-3 text-center min-w-[110px]">{role}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark/40 text-gray-300">
                {permissions.map((perm) => (
                  <tr key={perm.key} className="hover:bg-bg-panel/10 transition">
                    <td className="p-3">
                      <span className="font-bold text-white block">{perm.label}</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">{perm.description}</span>
                    </td>
                    {roles.map((role) => {
                      const isChecked = !!matrix[role]?.[perm.key];
                      return (
                        <td key={role} className="p-3 text-center">
                          <label className="inline-flex items-center justify-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePermission(role, perm.key)}
                              className="peer sr-only"
                              disabled={role === 'Administrador'}
                            />
                            <span className={`w-8 h-4 rounded-full transition-colors relative flex items-center ${
                              role === 'Administrador' ? 'bg-purple-950/50 cursor-not-allowed' :
                              isChecked ? 'bg-purple-600' : 'bg-gray-800'
                            }`}>
                              <span className={`w-3.5 h-3.5 rounded-full bg-white shadow-md transform transition-transform ${
                                isChecked ? 'translate-x-4' : 'translate-x-0.5'
                              }`} />
                            </span>
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg:col-span-4 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Registrar Nuevo Rol</h2>
          <form onSubmit={handleAddRole} className="space-y-4">
            <Inputs
              label="Nombre del Rol Administrativo"
              value={newRole}
              onChange={setNewRole}
              placeholder="Ej. Auditor de Caja"
              required
            />
            <Buttons type="submit" variant="primary" className="w-full justify-center">
              Crear Rol
            </Buttons>
          </form>

          <div className="border-t border-border-dark/60 pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-3">Resumen de Roles Activos</h2>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <span
                  key={role}
                  className="px-2.5 py-1 rounded border border-border-dark bg-bg-panel/40 text-[10px] text-gray-300 font-bold uppercase"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-8 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-border-dark/60 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">Usuarios del Sistema</h2>
            <span className="text-[10px] text-gray-400">Total Operadores: {users.length}</span>
          </div>

          <div className="overflow-x-auto rounded border border-border-dark bg-bg-panel custom-scrollbar">
            <table className="min-w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border-dark bg-black/40 text-gray-450 uppercase tracking-wider text-[9px] font-bold">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Correo</th>
                  <th className="p-3">Rol del Usuario</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark/60">
                {paginatedUsers.map((u) => (
                  <tr key={u.id} className="bg-bg-panel/50 hover:bg-bg-panel/80 transition duration-150">
                    <td className="p-3 font-semibold text-white">{u.name}</td>
                    <td className="p-3 text-gray-450">{u.email}</td>
                    <td className="p-3">
                      <div className="max-w-[150px]">
                        <Selects
                          label=""
                          value={u.role}
                          onChange={(role) => handleUserRoleChange(u.id, role)}
                          options={roles}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        u.status === 'active'
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                          : 'bg-red-950/40 text-red-400 border border-red-900/30'
                      }`}>
                        {u.status === 'active' ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUserStatusToggle(u.id)}
                        className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded cursor-pointer transition ${
                          u.status === 'active'
                            ? 'bg-red-950/40 text-red-400 hover:bg-red-900/40'
                            : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspender' : 'Activar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => showAlert({ title: 'Clave Restablecida', description: `Se ha generado la clave temporal para ${u.name}.`, variant: 'info' })}
                        className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded cursor-pointer transition"
                      >
                        Reset Clave
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalUsersPages > 1 && (
            <div className="flex items-center justify-between border-t border-border-dark/30 pt-3 text-[10px] text-gray-450 mt-2">
              <button
                type="button"
                onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                disabled={usersPage === 1}
                className="px-2.5 py-1 rounded bg-bg-panel border border-border-dark text-gray-400 hover:text-white disabled:opacity-40 disabled:hover:text-gray-400 cursor-pointer"
              >
                Anterior
              </button>
              <span className="font-bold text-gray-400">
                {usersPage} / {totalUsersPages}
              </span>
              <button
                type="button"
                onClick={() => setUsersPage((p) => Math.min(totalUsersPages, p + 1))}
                disabled={usersPage === totalUsersPages}
                className="px-2.5 py-1 rounded bg-bg-panel border border-border-dark text-gray-400 hover:text-white disabled:opacity-40 disabled:hover:text-gray-400 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          )}
        </section>

        <section className="lg:col-span-4 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Registrar Nuevo Operador</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <Inputs
              label="Nombre Completo"
              value={newUser.name}
              onChange={(v) => setNewUser((prev) => ({ ...prev, name: v }))}
              placeholder="Ej. Roberto Díaz"
              required
            />
            <Inputs
              label="Correo Electrónico"
              type="email"
              value={newUser.email}
              onChange={(v) => setNewUser((prev) => ({ ...prev, email: v }))}
              placeholder="ejemplo@zymtaxis.com"
              required
            />
            <Selects
              label="Asignar Rol Inicial"
              value={newUser.role}
              onChange={(v) => setNewUser((prev) => ({ ...prev, role: v }))}
              options={roles}
            />
            <Buttons type="submit" variant="primary" className="w-full justify-center">
              Crear Operador
            </Buttons>
          </form>
        </section>
      </div>
    </div>
  );
}

export default RolesPermisos;
