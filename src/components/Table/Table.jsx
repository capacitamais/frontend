import CardBox from "../CardBox/CardBox";
import "./style.css";

export default function Table({ path, data }) {
  return (
    <ul className="table">
      {data.map((item) => (
        <li key={item.id} className="table-row">
          <CardBox
            to={`${path}/${item.id}`}
            tag={item.tag}
            title={item.title}
          />
        </li>
      ))}
    </ul>
  );
}
