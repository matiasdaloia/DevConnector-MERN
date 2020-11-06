import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  //Create state for the form fields
  const [formData, setFormdata] = useState({
    email: "",
    password: "",
  });

  //apply destructuring from formData so we can access those fields easier
  const { email, password } = formData;

  //Build onChange function
  const onChange = (e) => {
    setFormdata({
      //grab a copy from current state
      ...formData,
      //we set the field that is currently being updated applying "e.target.name"
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("SUCCESS");
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            required
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

export default Login;
