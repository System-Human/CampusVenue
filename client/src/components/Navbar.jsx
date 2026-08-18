import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
      <div className="flex items-center md:hidden">
        <button className="text-gray-500 hover:text-gray-700">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      
      <div className="hidden md:flex flex-1">
        {/* Placeholder for desktop breadcrumbs or search */}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 text-indigo-700 p-2 rounded-full hidden sm:block">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-sm hidden sm:block">
            <span className="font-semibold text-slate-800">{user?.name}</span>
            <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="text-gray-500 hover:text-rose-600 transition-colors p-2"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
