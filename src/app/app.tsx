import { Link, Outlet, useLocation, useNavigate } from 'react-router';

import { list, type INavLink } from './constant/NavLinks';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthDataStore } from '@/store/useAuthStore';
import SettingsModal from './SettingsModal';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/api/auth';
import { toast } from 'sonner';
import { removeToken } from '@/lib/auth';

const AppLayout = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const logoutZustand = useAuthDataStore((state) => state.logout);

  const user = useAuthDataStore((state) => state.user);

  const [selected, setSelected] = useState<string>('');

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: async () =>
      await logout()
        .then((response) => {
          if (response.data.code === 200) {
            logoutZustand();
            toast.success('Success Logout!');
            removeToken();
            navigate('/');
          }
        })
        .catch(() => {
          toast.error('Logout failed, please try again.');
        }),
  });

  const getProductInfo = () => {
    const currentPath = location.pathname.split('/').filter(Boolean);
    const matchedItem = list.find((item: INavLink) =>
      currentPath.includes(item.href)
    );

    return matchedItem
      ? {
          name: matchedItem.name,
          icon: matchedItem.icon,
          textColor: matchedItem.textColor,
          bgColor: matchedItem.bgColor,
        }
      : {
          name: 'Productivity Suite',
          icon: null,
          textColor: 'text-black',
          bgColor: 'bg-transparent',
        };
  };

  const { name, icon, textColor, bgColor } = getProductInfo();

  return (
    <div className={`${bgColor} min-h-screen`}>
      <div className="mx-auto h-full">
        {/* you can seperate this nav to another component */}
        <div className=" flex justify-between items-center backdrop-blur-lg shadow-md  py-4 px-16 bg-white">
          <div className="flex space-x-2">
            {icon}{' '}
            <span className={`text-2xl font-bold ${textColor}`}>{name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Link to="/summary">Category Management</Link>
            </Button>
            <Button variant="outline">
              <Link to="/summary">View Summary</Link>
            </Button>
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                {isProfileOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      mutateAsync();
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`py-6 px-12 rounded-sm  h-full`}>
          <ul className="flex mt-2  justify-center space-x-3 rounded-md items-center mb-6">
            {list.map((item: INavLink) => (
              <li key={item.name} className="">
                <Button
                  asChild
                  variant="ghost"
                  className={`mt-0.5 ${
                    selected === item.href ? 'bg-gray-100' : 'bg-none'
                  }`}
                  onClick={() => setSelected(item.href)}
                >
                  <Link
                    to={item.href}
                    className="flex text-lg text-gray-600   items-center justify-center"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>

          <Outlet />
        </div>

        {/* 🔸 Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </div>
  );
};

export default AppLayout;
