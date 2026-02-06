import useForm from "./useForm";

function FormDemo() {
  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Name is required";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!values.email.includes("@")) {
      errors.email = "Invalid email";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const submitForm = (formData) => {
    alert("Form Submitted Successfully!");
    console.log(formData);
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = useForm(initialValues, validate);

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Registration Form</h2>

      <form onSubmit={handleSubmit(submitForm)}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={values.name}
            onChange={handleChange}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password}</p>
          )}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default FormDemo;
