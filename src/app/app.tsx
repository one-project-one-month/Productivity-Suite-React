import { Link, Outlet } from "react-router"


import { list, type INavLink } from "./constant/NavLinks"
import { Button } from "@/components/ui/button"

const AppLayout = () => {
  return (


    <div className='h-screen w-screen container mx-auto p-12'>

        {/* you can seperate this nav to another component */}
        <div className="text-2xl font-bold flex justify-between items-center ">
            <div>
                 Productivity Sute
            </div>
            <div>
                <Button variant="ghost">Logout</Button> 
            </div>
        </div>

        <ul className="flex gap-4 mt-6">
            {list.map((item: INavLink) => (
                <li key={item.name}>
                    <Button asChild variant="ghost">
                        <Link to={item.href} className="text-xl">{item.name}</Link>
                    </Button>
                </li>
            ))}
        </ul>


            <div className="mt-2 px-4">
                <Outlet />
            </div>

    </div>
  )
}

export default AppLayout