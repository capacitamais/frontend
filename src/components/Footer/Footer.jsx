import './style.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        © {new Date().getFullYear()} Capacita+.
      </div>
      <div>
        Todos os direitos reservados.
      </div>
    </footer>
  );
}
