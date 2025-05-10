import CallAction from './components/CallAction';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Nav from './components/Nav';
import ToolsSection from './components/ToolsSection';

const Main = () => {
  return (
    <main>
      <Nav />
      <Hero />
      <ToolsSection />
      <CallAction />
      <Footer />
      <div className="container mx-auto p-12">
        
      </div>
    </main>
  );
};

export default Main;
