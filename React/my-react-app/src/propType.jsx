import PropTypes from "prop-types";

function User({ name, age, isAdmin }) {
  return (
    <div>
      <p>{name}</p>
      <p>{age}</p>
      <p>{isAdmin ? "Admin" : "User"}</p>
    </div>
  );
}

User.propTypes = {
  name: PropTypes.string,
  age: PropTypes.number,
  isAdmin: PropTypes.bool
};
