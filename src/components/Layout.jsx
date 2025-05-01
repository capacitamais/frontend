import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-4">
        <Outlet /> {/* Aqui será renderizado o conteúdo da rota */}
      </main>
      <Footer />
    </div>
  );
}
