import Footer from '@/LandingPage/components/Footer';
import Nav from '@/LandingPage/components/Nav';
import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <main className="relative">
      <Nav />
      <Outlet />
      <Footer />
    </main>
  );
};

export default AuthLayout;
