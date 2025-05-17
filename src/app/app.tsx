import { Link, Outlet } from 'react-router';

import { list, type INavLink } from './constant/NavLinks';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuthDataStore } from '@/store/useAuthStore';
import Profile from '../assets/profile.png'; 
import SettingsModal from './SettingsModal';

const AppLayout = () => {
  const [selected,setSelected] = useState<string>("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { logout } = useAuthDataStore();
  return (
    <div className="h-screen w-screen container mx-auto ">
      {/* you can seperate this nav to another component */}
      <div className="text-2xl font-bold flex justify-between items-center backdrop-blur-lg shadow-md  py-4 px-16">
        <div>Productivity Suite</div>
        <div className='flex items-center space-x-4'>
          <Button variant="outline">
            <Link to='/summary'>
                View Summary
            </Link>
          </Button>
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                <img src={Profile} alt="" />
              </div>
              {isProfileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
              
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">hello</p>
                  <p className="text-xs text-gray-500 truncate">hello</p>
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
                    logout();
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

      <ul className="flex  mt-6 mx-24 border rounded-md items-center ">
        {list.map((item: INavLink) => (
          <li key={item.name} className=''>
            <Button asChild variant="ghost" className={`mt-0.5 ${selected === item.href ? 'bg-gray-100' : 'bg-none'}`} onClick={()=> setSelected(item.href)} >
              <Link to={item.href} className="flex text-lg text-gray-600   items-center justify-center">
              {item.icon}
                {item.name}
              </Link>
            </Button>
          </li>
        ))}
      </ul>

      <div className="my-12 mx-24 border rounded-sm ">
        <Outlet />
      </div>

      {/* 🔸 Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default AppLayout;
