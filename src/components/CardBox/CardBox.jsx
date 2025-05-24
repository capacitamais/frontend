import { Link } from "react-router-dom";
import './style.css';

export default function CardBox({ to, tag, title, name, description }) {
    return (
        <Link to={to} className="cardBox">
            <div className="tag">{tag}</div>
            <div className="name">{name}</div>
            <div className="title">{title}</div>
            <div className="description">{description}</div>
        </Link>
    );
}
