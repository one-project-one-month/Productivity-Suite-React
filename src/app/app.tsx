import { Link, Outlet } from 'react-router';

import { list, type INavLink } from './constant/NavLinks';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const AppLayout = () => {
  const [selected,setSelected] = useState<string>("")
  return (
    <div className="h-screen w-screen container mx-auto ">
      {/* you can seperate this nav to another component */}
      <div className="text-2xl font-bold flex justify-between items-center backdrop-blur-lg shadow-md  py-4 px-16">
        <div>Productivity Suite</div>
        <div>
          <Button variant="outline">
            <Link to='/summary'>
                View Summary
            </Link>
          </Button>
          <Button variant="ghost">Logout</Button>
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
        
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
