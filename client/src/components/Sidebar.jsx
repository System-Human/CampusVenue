import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CalendarDays, BookMarked, Users, Settings, Building2 } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Rooms', path: '/rooms', icon: Building2 },
    { name: 'My Bookings', path: '/my-bookings', icon: BookMarked },
  ];

  const adminItems = [
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Manage Rooms', path: '/admin/rooms', icon: Settings },
  ];

  const linkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-indigo-50 text-indigo-700 font-semibold' 
        : 'text-slate-600 hover:bg-gray-100 hover:text-slate-900'
    }`;

  return (
    <aside className="bg-white w-64 border-r border-gray-200 hidden md:flex flex-col h-screen shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">Campus<span className="text-slate-800">Venue</span></h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => (
          <NavLink key={item.name} to={item.path} className={linkClass}>
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <div className="px-3 mt-8 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Admin
            </div>
            {adminItems.map((item) => (
              <NavLink key={item.name} to={item.path} className={linkClass}>
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
