// components/AddCard.jsx
import { useNavigate } from 'react-router-dom';
import './AddCard.css';
import { FaPlus } from 'react-icons/fa';

export default function AddCard({ to, label = "Adicionar" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <div className="add-card" onClick={handleClick}>
      <span>{label}</span>
      <FaPlus size={20} />
    </div>
  );
}
