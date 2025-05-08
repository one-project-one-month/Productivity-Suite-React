import { Button } from "@/components/ui/button"
import { Link } from "react-router"


const Nav = () => {
  return (
  <nav className="flex justify-between items-center">
        <div>Nav</div>

        <Link to="/app">
            <Button className="cursor-pointer">Get Started</Button>
        </Link>
  </nav>

  )
}

export default Nav