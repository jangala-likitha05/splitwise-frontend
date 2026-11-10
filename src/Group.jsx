import { Link } from "react-router-dom";

function Groups(props) {
  return (
    <div className="card">
      <h2>My Groups</h2>
      {props.groups.map((group) => (
        <Link
          key={group._id}
          className="group-link"
          to={`/groups/${group._id}`}
        >
          {group.name}
        </Link>
      ))}
    </div>
  );
}

export default Groups;
