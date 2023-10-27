import React, { useEffect, useState } from "react";
import validateForm from "../../components/validateForm";
import { v4 as uuidv4 } from "uuid";
import ResetLocation from "../../helpers/ResetLocation";
const Register = ({ activateLoginModal }) => {
  const [formValue, setFormValue] = useState({
    id: "",
    email: "",
    password: "",
    repeatPassword: "",
    first_name: "",
    last_name: "",
    username: "",
    house_number: "",
    street_name: "",
    city: "",
    state: "",
    pincode: "",
    number: "",
  });
  const [formError, setFormError] = useState({});
  const [submit, setSubmit] = useState(false);
  const [registrationFail, setRegistrationFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  
  const handleSubmit = async (e) => {
    console.log(formValue);

    const currentDate = new Date();

    const formattedDate = currentDate
      .toISOString()
      .replace(/\.(\d+)Z$/, ".$10000+0000");
    const signupData = {
      kitchen_name: formValue.username,
      password: formValue.password,
      first_name: formValue.first_name,
      last_name: formValue.last_name,
      email: [{ email: formValue.email }],
      phone_no: [{ phone_number: formValue.number }],
      date_of_reg: formattedDate,
      house_number: formValue.house_number,
      street_name: formValue.street_name,
      city: formValue.city,
      state: formValue.state,
      pincode: formValue.pincode,
    };
    setLoading(true);
    e.preventDefault();
    setFormError(validate(formValue));
    window.scrollTo(0, 0);
    let currForm = { ...formValue };
    currForm.email = currForm.email.toLowerCase();

    setVerificationError("");
    const bodySend = JSON.stringify({ ...signupData });
    console.log(bodySend);
    fetch("http://localhost:8080/kitchen/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodySend,
    }).then((resp) => {
      resp.json().then((res) => {
        console.warn(
          res + "Click on Login to Login with Username and Password!"
        );
        // const token = res.token;
        // localStorage.setItem("token", token);
      });
    });
    if (Object.keys(validate(formValue)).length > 0) {
      setLoading(false);
      return;
    } else {
      let currForm = { ...formValue };
      if (currForm.repeatPassword.length > 0) {
        delete currForm.repeatPassword;
      }
      if (currForm.address !== undefined) {
        delete currForm.address;
      }
      if (currForm.number !== undefined) {
        delete currForm.number;
      }
    }

    // const accCreation = await createUser(currForm);
    // if (accCreation === false) {
    //   setLoading(false);
    //   setSubmit(false);
    //   setRegistrationFail(true);
    //   setFormValue({
    //     id: "",
    //     email: "",
    //     password: "",
    //     repeatPassword: "",
    //     first_name: "",
    //     last_name: "",
    //     username: "",
    //     house_number: "",
    //     street_name: "",
    //     city: "",
    //     state: "",
    //     pincode: "",
    //     number: "",
    //   });
    // } else {
    //   setLoading(false);
    //   setRegistrationFail(false);
    //   setSubmit(true);
    //   setFormValue({
    //     id: "",
    //     email: "",
    //     password: "",
    //     repeatPassword: "",
    //     first_name: "",
    //     last_name: "",
    //     username: "",
    //     house_number: "",
    //     street_name: "",
    //     city: "",
    //     state: "",
    //     pincode: "",
    //     number: "",
    //   });
    // }
  };
  const handleValidation = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };
  const validate = validateForm("registration");

  useEffect(() => {
    document.title = "Registration | Pizza Planet";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setVerificationError("");
    
    const bodySend = JSON.stringify({ ...formValue });
    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:bodySend,
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 403) {
          setFormError( "Username and password do not match.")
        }
        if (!response.ok) {
          throw new Error("Username and password do not match.");
        }
        return response.json();
      })
      .then((data) => {
        console.log(2);
        const token = data.token;
        if(token.length === 0){
          throw new Error("Username and password do not match.");
        }
        // Store the token in localStorage
        sessionStorage.setItem("token", token);
        // setValidLogin(true);
        // Redirect to the home page
        window.location.href = "/";
      })
      .catch((error) => {
        // setFormError(error.message);
      });
  };
  return (
    <div>
      <form onSubmit={handleLogin}>
              {verificationError.length === 0 ? null : (
                <p className="login-input-err">{verificationError}</p>
              )}
              <input
                onChange={handleValidation}
                value={formValue.username}
                name="username"
                type="text"
                placeholder="Username"
              />
              
              <input
                onChange={handleValidation}
                value={formValue.password}
                name="password"
                type="password"
                autoComplete="true"
                placeholder="Password"
              />
              <span className="login-input-err">{formError}</span>

              <section className="login-and-signup">
                <button type="submit" className="modal-login-btn">
                  Log in
                </button>
              </section>
              </form>
    </div>
    
  );
};

export default Register;
