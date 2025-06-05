import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './style.css';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    const updateMainContentHeight = () => {
      const navbar = document.querySelector('.navbar');
      const footer = document.querySelector('.footer');
      const main = document.querySelector('.main-content');

      if (navbar && footer && main) {
        const navbarHeight = navbar.offsetHeight;
        const footerHeight = footer.offsetHeight;
        const newMaxHeight = `calc(100vh - ${navbarHeight}px - ${footerHeight}px)`;
        main.style.maxHeight = newMaxHeight;
      }
    };

    updateMainContentHeight();
    window.addEventListener('resize', updateMainContentHeight);

    return () => {
      window.removeEventListener('resize', updateMainContentHeight);
    };
  }, [location]);

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
