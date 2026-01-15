import React from "react";
import PropTypes from "prop-types";

function UserProfile({
  name,
  age,
  isActive,
  role,
  skills,
  address,
  score,
  onLogout,
  avatar,
  footer,
}) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", width: "400px" }}>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Status: {isActive ? "Active" : "Inactive"}</p>
      <p>Role: {role}</p>
      <p>Score: {score}</p>

      <h4>Skills</h4>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>

      <h4>Address</h4>
      <p>
        {address.city}, {address.country}
      </p>

      <div>{avatar}</div>

      <button onClick={onLogout}>Logout</button>

      <div>{footer}</div>
    </div>
  );
}

/* 
   PROPTYPES DEFINITION
 */

UserProfile.propTypes = {
  /*  BASIC TYPES  */
  name: PropTypes.string.isRequired,       // required string
  age: PropTypes.number.isRequired,        // required number
  isActive: PropTypes.bool,                // boolean

  /*  ENUM (ONE OF FIXED VALUES)  */
  role: PropTypes.oneOf(["admin", "user", "guest"]).isRequired,
  // ONLY these values allowed

  /*  ARRAY  */
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
  // array of strings only

  /*  OBJECT WITH SHAPE  */
  address: PropTypes.shape({
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    pincode: PropTypes.number,
  }).isRequired,

  /*  MULTIPLE POSSIBLE TYPES  */
  score: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  // score can be number OR string

  /*  FUNCTION  */
  onLogout: PropTypes.func.isRequired,

  /*  REACT ELEMENT */
  avatar: PropTypes.element,
  // only JSX element allowed

  /*  NODE (ANYTHING RENDERABLE) */
  footer: PropTypes.node,

  /* CUSTOM VALIDATOR */
  age: function (props, propName, componentName) {
    if (props[propName] < 18) {
      return new Error(
        `${componentName}: age must be 18 or above`
      );
    }
  },
};

/*  DEFAULT PROPS  */
UserProfile.defaultProps = {
  isActive: true,
  score: "N/A",
};

export default function PropTypeDemo() {
  return (
    <UserProfile
      name="Drashti Sitapara"
      
      role="admin"
      skills={["React", "JavaScript", "CSS"]}
      address={{
        city: "Ahmedabad",
        country: "India",
        pincode: 380001,
      }}
      onLogout={() => alert("Logged out")}
      avatar={<img src="https://via.placeholder.com/50" alt="avatar" />}
      footer={<small>© 2026 My Company</small>}
    />
  );
}
