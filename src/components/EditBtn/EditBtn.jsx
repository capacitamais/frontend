import { Link } from "react-router-dom";
import "./style.css"

export default function EditBtn({ to }) {
    return (
        <Link to={to} className="editBtn">
            Editar
        </Link>
    );
}