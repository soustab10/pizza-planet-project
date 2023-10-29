import React, { useState } from "react";
// import { Navigate } from "react-router-dom";
import axios from "axios";
import "./loginModal.css";
import LinkButton from "../Button";
import { useNavigate } from "react-router-dom";
import validateForm from "../validateForm";
import api from "../../api";

const LoginModal = ({
  setLoginModalWindow,
  setValidLogin,
  setRole,
  role,
  loginModalWindow,
  hideMenu,
  validLogin,
}) => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({ username: "", password: "" });
  const [formError, setFormError] = useState("");
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const validate = validateForm("login");

  const handleValidation = (e) => {
    const { name, value } = e.target;
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [name]: value,
    }));
  };

  const hideLoginModal = () => {
    setLoginModalWindow(false);
    setFormValue({ username: "", password: "" });
    setFormError("");
    setSubmit(false);
  };

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
        const role = data.role;
        if(token.length === 0){
          throw new Error("Username and password do not match.");
        }
        // Store the token in localStorage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        setValidLogin(true);
        setRole(role);
        // Redirect to the home page
        window.location.href = "/";
      })
      .catch((error) => {
        // setFormError(error.message);
      });
  };

  // const handleLogin = async (e) => {
  //   setVerificationError("");
  //   e.preventDefault();
  //   setFormError(validate(formValue));
  //   const bodySend = JSON.stringify({ ...formValue });
  //   // console.log(bodySend);
  //   fetch("http://localhost:8080/auth/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: bodySend,
  //   }).then((resp) => {
  //     resp.json().then((res) => {
  //       console.warn(res);
  //       const token = res.token;
  //       localStorage.setItem("token", token);
  //       return <Navigate to="/" />;
  //     });
  //   });
  // };

  return (
    <article className={`modal ${loginModalWindow ? "active-modal" : null}`}>
      <section className="modal-main">
        <button
          className="close-modal-btn"
          type="button"
          onClick={() => {
            hideLoginModal();
          }}
        >
          X
        </button>
        <section className="modal-content">
          <h2>Log in</h2>
          {loading ? (
            <div role="status" className="loader">
              <p>Almost there...</p>
              <img
                alt="Processing request"
                src="https://media0.giphy.com/media/L05HgB2h6qICDs5Sms/giphy.gif?cid=ecf05e472hf2wk1f2jou3s5fcnx1vek6ggnfcvhsjbeh7v5u&ep=v1_stickers_search&rid=giphy.gif&ct=s"
              />
            </div>
          ) : (
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
                <small className="forgot-password">
                  Forgot Password? Conatct us at: <a href="mailto:contact@pizza.com">contact@pizza.com</a>
                </small>

              <section className="login-and-signup">
                Don't have an account?
                <LinkButton
                  onClick={() => {
                    hideLoginModal();
                    hideMenu();
                  }}
                  to="/register"
                  className="modal-signup-btn"
                >
                  Sign up
                </LinkButton>
              </section>
               
              <section className="login-and-signup">
                Register as:
                {/* <LinkButton
                  onClick={() => {
                    hideLoginModal();
                    hideMenu();
                  }}
                  to="/registerkitchen"
                  className="modal-signup-btn2 "
                
                >
    
                  Kitchen
                </LinkButton> */}
                <LinkButton
                  onClick={() => {
                    hideLoginModal();
                    hideMenu();
                  }}
                  to="/registerpartner"
                  className="modal-signup-btn2"
                >
                  Delivery Partner
                </LinkButton>
              </section>
            </form>
          )}
        </section>
      </section>
    </article>
  );
};

export default LoginModal;
