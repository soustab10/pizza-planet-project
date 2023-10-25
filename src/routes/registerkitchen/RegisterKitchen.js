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
  return (
    <main className="register-main">
      <h2>
        {submit && Object.keys(formError).length === 0
          ? "Success!"
          : " Kitchen Registration"}
      </h2>
      {loading ? (
        <div role="status" className="loader">
          <p>Almost there...</p>
          <img
            alt="Processing request"
            src="https://media0.giphy.com/media/L05HgB2h6qICDs5Sms/giphy.gif?cid=ecf05e472hf2wk1f2jou3s5fcnx1vek6ggnfcvhsjbeh7v5u&ep=v1_stickers_search&rid=giphy.gif&ct=s"
          />
        </div>
      ) : submit && Object.keys(formError).length === 0 ? (
        <section className="registration-success">
          <p className="form-submit-msg">
            You can now log in and make an order!
          </p>
          <button
            className="passive-button-style txt-white"
            onClick={() => {
              ResetLocation();
              activateLoginModal();
              setSubmit(false);
            }}
          >
            Log in
          </button>
        </section>
      ) : (
        <form className="registration-form" onSubmit={handleSubmit}>
          {registrationFail ? (
            <p className="registration-input-err">
              Seems like this email has already been registered!
            </p>
          ) : null}
          <section className="name-section">
            <input
              type="text"
              placeholder="First name of Business Owner"
              name="first_name"
              value={formValue.first_name}
              onChange={handleValidation}
            />
            <span className="registration-input-err">
              {formError.first_name}
            </span>
          </section>
          <section className="name-section">
            <input
              type="text"
              placeholder="Last name of Business Owner"
              name="last_name"
              value={formValue.last_name}
              onChange={handleValidation}
            />
            <span className="registration-input-err">
              {formError.last_name}
            </span>
          </section>
          <section className="email-section">
            <input
              type="text"
              placeholder="Kitchen Name"
              name="username"
              value={formValue.username}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formError.username}</span>
          </section>
          <section className="email-section">
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={formValue.email}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formError.email}</span>
          </section>
          <section className="birthday">
            <input
              type="text"
              placeholder="Phone Number"
              name="number"
              value={formValue.number}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formError.number}</span>
          </section>
          <section className="password-section">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formValue.password}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formError.password}</span>
            <input
              type="password"
              placeholder="Repeat password"
              name="repeatPassword"
              value={formValue.repeatPassword}
              onChange={handleValidation}
            />
            <span className="registration-input-err">
              {formError.repeatPassword}
            </span>
          </section>
          <p style={{ color: "white", padding: "10px" }}>
            {" "}
            Enter Address of Kitchen:{" "}
          </p>
          <section className="birthday">
            <input
              type="text"
              placeholder="House No"
              name="house_number"
              value={formValue.house_number}
              onChange={handleValidation}
            />
            <span className="registration-input-err">
              {formError.house_number}
            </span>
          </section>
          <section className="birthday">
            <input
              type="text"
              placeholder="Street Name"
              name="street_name"
              value={formValue.street_name}
              onChange={handleValidation}
            />
            <span className="registration-input-err">
              {formError.street_name}
            </span>
          </section>
          <section className="birthday">
            <input
              type="text"
              placeholder="City"
              name="city"
              value={formValue.city}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formError.city}</span>
          </section>
          <section className="birthday">
            <input
              type="text"
              placeholder="State"
              name="state"
              value={formValue.state}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formError.state}</span>
          </section>
          <section className="birthday">
            <input
              type="text"
              placeholder="Pincode"
              name="pincode"
              value={formValue.pincode}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formError.pincode}</span>
          </section>

          <p className="terms-warning">
            By clicking Sign Up, you agree to our Terms, Data Policy and Cookies
            Policy. You may receive an email notification from us and can opt
            out any time.
          </p>
          <button className="register-btn" type="submit">
            Sign up
          </button>
        </form>
      )}
    </main>
  );
};

export default Register;
