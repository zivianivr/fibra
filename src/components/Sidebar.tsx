import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Box, Network, Users, Wrench, GitFork } from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Caixas', href: '/caixas', icon: Box },
  { name: 'Switches', href: '/switches', icon: Network },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Chamados', href: '/chamados', icon: Wrench },
];

export function Sidebar() {
  return (
    <div className="flex h-full max-h-screen flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 px-6 w-64">
      <div className="flex h-16 shrink-0 items-center gap-x-2">
        <GitFork className="h-8 w-8 text-brand-600" />
        <span className="text-xl font-bold text-gray-900 dark:text-white">FibraManager</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                        isActive
                          ? 'bg-brand-50 text-brand-600 dark:bg-brand-950'
                          : 'text-gray-700 hover:text-brand-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                      )
                    }
                  >
                    <item.icon
                      className={cn(
                        'h-6 w-6 shrink-0',
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
