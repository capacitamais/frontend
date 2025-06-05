import { useNavigate } from 'react-router-dom';
import './AddCard.css';
import { FaPlus } from 'react-icons/fa';

export default function AddCard({ to, label = "Adicionar" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button
      type="button"
      className="add-card"
      onClick={handleClick}
      aria-label={`${label} novo item`}
    >
      <span>{label}</span>
      <FaPlus size={20} aria-hidden="true" />
    </button>
  );
}
