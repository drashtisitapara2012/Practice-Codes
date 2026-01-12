//Form Handling using react-hook-form
import React from "react";
import { useForm } from "react-hook-form";

export default function FormHandling() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* EMAIL */}
        <div className="form-control">
          <label>Email</label>
          <input
            type="text"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Email is not valid"
              }
            })}
          />

          <p className="errorMsg">{errors.email?.message}</p>
        </div>

        {/* PASSWORD */}
        <div className="form-control">
          <label>Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password should be at least 6 characters"
              }
            })}
          />

          <p className="errorMsg">{errors.password?.message}</p>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
