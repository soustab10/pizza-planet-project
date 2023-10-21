import React, { useState } from "react";
import "./loginModal.css";
import LinkButton from "../Button";
import { useNavigate } from "react-router-dom";
import validateForm from "../validateForm";


const LoginModal = ({ setLoginModalWindow, setValidLogin, loginModalWindow, hideMenu, validLogin, getUser }) => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({ username: '', password: '' });
  const [formError, setFormError] = useState({});
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const validate = validateForm("login");

  const getUsers = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_USERS_URL);
      const body = await response.json();
      return body.data;
    }
    catch (err) {
      console.log(err.message)
    }
  }


  const handleValidation = (e) => {

    const { name, value } = e.target;
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [name]: value,
    }));
  };

  const hideLoginModal = () => {
    setLoginModalWindow(false);
    setFormValue({ username: '', password: '' });
    setFormError({});
    setSubmit(false);
  }

  const handleLogin = async (e) => {
    setVerificationError('');
    e.preventDefault();
    setLoading(true);
    setFormError(validate(formValue));
    if (Object.keys(validate(formValue)).length > 0) {
      setLoading(false);
      return;
    }
    else {
      //find all users
      const existingUsers = await getUsers(formValue.username.toLowerCase());
      //filter existence by username
      const findByusername = existingUsers.filter((u) => u.username === formValue.username.toLowerCase());
      // if user not found by username
      if (findByusername.length === 0) {
        setLoading(false);
        setSubmit(false);
        setFormValue({ username: '', password: '' });
        setFormError({})
        setVerificationError("Wrong username");
        return;
      }
      else if (findByusername.length > 0 && findByusername[0].password !== formValue.password) {
        setLoading(false);
        setSubmit(false);
        setFormValue({ username: '', password: '' });
        setFormError({});
        setVerificationError("Wrong password");
        return;
      }
      else if (findByusername.length > 0 && findByusername[0].password === formValue.password) {
        getUser(findByusername[0].id);
        setLoading(false);
        hideLoginModal();
        setFormValue({ username: '', password: '' });
        setFormError({});
        setVerificationError("");
        setValidLogin(true);
        navigate('/menu');
      }
    }
  };


  return (
    <article className={`modal ${loginModalWindow ? 'active-modal' : null}`}>
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
          {loading ?
            <div role="status" className="loader">
              <p>Almost there...</p>
              <img alt="Processing request" src="https://media0.giphy.com/media/L05HgB2h6qICDs5Sms/giphy.gif?cid=ecf05e472hf2wk1f2jou3s5fcnx1vek6ggnfcvhsjbeh7v5u&ep=v1_stickers_search&rid=giphy.gif&ct=s" />
            </div> :
            <form onSubmit={handleLogin}>
              {verificationError.length === 0 ? null : <p className="login-input-err">{verificationError}</p>}
              <input onChange={handleValidation} value={formValue.username} name="username" type="text" placeholder="Username" />
              <span className="login-input-err">{formError.username}</span>
              <input onChange={handleValidation} value={formValue.password} name="password" type="password" autoComplete="true" placeholder="Password" />
              <span className="login-input-err">{formError.password}</span>
              {submit && Object.keys(formError).length === 0 && !validLogin ?
                <p className="login-input-err">We couldn't find an account. Try another credentials</p> :
                null}
              <section className="login-and-signup">
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
                <button type="submit" className="modal-login-btn">Log in</button>
              </section>
            </form>
          }
        </section>
      </section>
    </article>
  );
}

export default LoginModal;