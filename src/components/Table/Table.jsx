import CardBox from "../CardBox/CardBox";
import "./style.css";

export default function Table({ path, data, label }) {
  return (
    <div className="table-container">
      <div className="table-label">
        <span>{label}</span>
      </div>
      <ul className="table">
        {data.map((item) => (
          <li key={item.id} className="table-row">
            <CardBox
              to={`${path}/${item.id}`}
              tag={item.tag}
              title={item.title}
              name={item.name}
              description={item.description}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
