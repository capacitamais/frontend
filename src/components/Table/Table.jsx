import CardBox from "../CardBox/CardBox";
import "./style.css";

export default function Table({ path, data, label }) {
  return (
    <>
    <div className="label">{label}</div>
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
    </>
  );
}
