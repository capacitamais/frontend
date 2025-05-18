import { Link } from "react-router-dom";
import './style.css';

export default function CardBox({ to, tag, title }) {
    return (
        <Link to={to} className="cardBox">
            <div className="tag">{tag}</div>
            <div className="description">{title}</div>
        </Link>
    );
}
