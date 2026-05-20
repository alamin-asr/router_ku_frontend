import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Activities from '../components/Activities';
import Events from '../components/Events';
import Workshops from '../components/Workshops';
import Competitions from '../components/Competitions';
import Projects from '../components/Projects';
import Team from '../components/Team';
import Gallery from '../components/Gallery';
import JoinUs from '../components/JoinUs';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Activities />
      <Events />
      <Workshops />
      <Competitions />
      <Projects />
      <Team />
      <Gallery />
      <JoinUs />
      <Footer />
      <Chatbot />
    </div>
  );
}
