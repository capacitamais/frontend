import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'; // Supondo que o caminho está correto
import Footer from '../Footer/Footer'; // Supondo que o caminho está correto
import './style.css';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    const updateMainContentHeight = () => {
      const navbarElement = document.querySelector('.navbar');
      const footerElement = document.querySelector('.footer');
      const mainContentElement = document.querySelector('.main-content');

      if (navbarElement && footerElement && mainContentElement) {
        const navbarHeight = navbarElement.offsetHeight;
        const footerHeight = footerElement.offsetHeight;
        const newMaxHeight = `calc(100vh - ${navbarHeight}px - ${footerHeight}px)`;
        mainContentElement.style.maxHeight = newMaxHeight;
      }
    };

    // Chame a função inicialmente e sempre que a janela for redimensionada
    updateMainContentHeight();
    window.addEventListener('resize', updateMainContentHeight);

    // Limpeza do listener no desmontar do componente
    return () => {
      window.removeEventListener('resize', updateMainContentHeight);
    };
  }, [location]); // Dependência do location para atualizar em mudanças de rota, se necessário

  return (
    <div className='app-container'>
      <Navbar />
      <main className='main-content'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}