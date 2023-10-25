import React, { useEffect, useState } from "react";
import ResetLocation from "../../helpers/ResetLocation";
import { useNavigate } from "react-router-dom";
import validateForm from "../../components/validateForm";

const Profile = ({ currentUser, handleLogout, updateUser }) => {
  const [editForm, setEditForm] = useState(false);
  const [formValue, setFormValue] = useState({
    id: "",
    email: [],
    password: "",
    repeatPassword: "",
    first_name: "",
    last_name: "",
    house_number: "",
    street_name: "",
    dob: "",
    city: "",
    state: "",
    pincode: "",
    number: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [profileData, setProfileData] = useState({});
  const navigate = useNavigate();
  const validate = validateForm("profile");
  const toggleForm = () => {
    setEditForm(!editForm);
  };

  const handleValidation = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  useEffect(() => {
    document.title = "Profile | Pizza Planet";
    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:8080/customer/", requestOptions)
      .then((response) => {
        console.log(response.status);
        if (response.status === 403) {
          window.alert("Please login with credentials!");
        }
        if (!response.ok) {
          throw new Error("Username and password do not match.");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setProfileData(data);
        setFormValue({
          id: data.id,
          email: data.email,
          password: "",
          repeatPassword: "",
          first_name: data.first_name,
          last_name: data.last_name,
          house_number: data.house_number,
          street_name: data.street_name,
          dob: data.dob,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          number: data.phone_no,
        });
      });
  }, []);

  const handleSubmit = async (e) => {
    console.log(formValue);

    const signupData = {
      username: formValue.username,
      password: formValue.password,
      first_name: formValue.first_name,
      last_name: formValue.last_name,
      email: [{ email: formValue.email }],
      phone_no: [{ phone_number: formValue.number }],

      house_number: formValue.house_number,
      street_name: formValue.street_name,
      city: formValue.city,
      state: formValue.state,
      pincode: formValue.pincode,
    };
    setLoading(true);
    console.log(1);
    e.preventDefault();
    window.scrollTo(0, 0);
    let currForm = { ...formValue };
    currForm.email = currForm.email.toLowerCase();
    console.log(1);

    const bodySend = JSON.stringify({ ...signupData });
    console.log(bodySend);
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

    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:8080/customer/update", requestOptions).then(
      (response) => {
        console.log(response.status);
        if (response.status === 403) {
          window.alert("Please login with credentials!");
        }
        if (!response.ok) {
          throw new Error("Username and password do not match.");
        }
        window.alert("User updated successfully.");
        window.location.reload();
      }
    );
  };

  const confirmDeleteUser = () => {
    ResetLocation();
    setConfirmationModal(true);
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_USERS_URL}/${id}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        navigate("/");
        handleLogout();
        return true;
      }
    } catch (err) {
      console.log(err.message);
      return false;
    }
  };

  return (
    <main className="profile">
      <h2>Profile information</h2>
      <p>Personal details and application</p>
      {loading ? (
        <div role="status" className="loader">
          <p>Almost there...</p>
          <img
            alt="Processing request"
            src="https://media0.giphy.com/media/L05HgB2h6qICDs5Sms/giphy.gif?cid=ecf05e472hf2wk1f2jou3s5fcnx1vek6ggnfcvhsjbeh7v5u&ep=v1_stickers_search&rid=giphy.gif&ct=s"
          />
        </div>
      ) : editForm ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <hr />
          {/* <section className="profile-information-section">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="text"
              value={formValue.email}
              placeholder={currentUser.email}
              onChange={handleValidation}
            />
          </section>
          <span className="input-validation-error">{formErrors.email}</span>
          <hr />
          <section className="profile-information-section">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              value={formValue.password}
              placeholder="********"
              onChange={handleValidation}
            />
          </section>
          <span className="input-validation-error">{formErrors.password}</span>
          <hr />
          <section className="profile-information-section">
            <label htmlFor="fullname">Fullname</label>
            <input
              name="fullname"
              type="text"
              value={formValue.fullname}
              placeholder={currentUser.fullname}
              onChange={handleValidation}
            />
          </section>
          <span className="input-validation-error">{formErrors.fullname}</span>
          <hr />
          <section className="profile-information-section">
            <label htmlFor="address">Address</label>
            <input
              name="address"
              type="text"
              value={formValue.address}
              placeholder={
                currentUser.address !== null
                  ? currentUser.address
                  : "Add address..."
              }
              onChange={handleValidation}
            />
          </section>
          <span className="input-validation-error">{formErrors.address}</span>
          <hr />
          <section className="profile-information-section">
            <label htmlFor="number">Number</label>
            <input
              name="number"
              type="text"
              value={formValue.number}
              placeholder={
                currentUser.number !== null
                  ? currentUser.number
                  : "Add number..."
              }
              onChange={handleValidation}
            />
          </section>
          <span className="input-validation-error">{formErrors.number}</span>
          <hr /> */}
          <section className="name-section">
            <input
              type="text"
              placeholder="First name"
              name="first_name"
              value={formValue.first_name}
              onChange={handleValidation}
            />
          </section>
          <section className="name-section">
            <input
              type="text"
              placeholder="Last name"
              name="last_name"
              value={formValue.last_name}
              onChange={handleValidation}
            />
            <span className="registration-input-err">
              {formErrors.last_name}
            </span>
          </section>

          <section className="email-section">
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={formValue.email}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formErrors.email}</span>
          </section>
          <section className="email-section">
            <input
              type="date"
              placeholder="Date of Birth"
              name="dob"
              style={{ color: "#bfbfbf" }}
              value={formValue.dob}
              onChange={handleValidation}
            />
          </section>
          <section className="password-section">
            <input
              type="password"
              placeholder="New password"
              name="password"
              value={formValue.password}
              onChange={handleValidation}
            />
            <span className="registration-input-err">
              {formErrors.password}
            </span>
            <input
              type="password"
              placeholder="Repeat password"
              name="repeatPassword"
              value={formValue.repeatPassword}
              onChange={handleValidation}
            />
            <span className="registration-input-err">
              {formErrors.repeatPassword}
            </span>
          </section>
          <section className="birthday">
            <input
              type="text"
              placeholder="House No"
              name="house_number"
              value={formValue.house_number}
              onChange={handleValidation}
            />
            <span className="registration-input-err">
              {formErrors.house_number}
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
              {formErrors.street_name}
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
            <span className="registration-input-err">{formErrors.city}</span>
          </section>
          <section className="birthday">
            <input
              type="text"
              placeholder="State"
              name="state"
              value={formValue.state}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formErrors.state}</span>
          </section>
          <section className="birthday">
            <input
              type="text"
              placeholder="Pincode"
              name="pincode"
              value={formValue.pincode}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formErrors.pincode}</span>
          </section>
          <section className="birthday">
            <input
              type="text"
              placeholder="Phone Number"
              name="number"
              value={formValue.number}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formErrors.number}</span>
          </section>
          <section className="profile-buttons">
            <button
              type="button"
              className="active-button-style"
              onClick={() => {
                toggleForm();
                ResetLocation();
              }}
            >
              Cancel edit
            </button>
            <button className="passive-button-style">Save profile</button>
          </section>
        </form>
      ) : (
        <React.Fragment>
          <article className="profile-information">
            <hr />
            <section className="profile-information-section">
              <h3>Email</h3>
              <p>
                {profileData.email !== null ? (
                  <p>
                    {/* <ul>
                      {profileData.email.map((mail) => (
                        <li key={mail.id}>
                          <p> {mail.email}</p>
                        </li>
                      ))}
                    </ul> */}
                  </p>
                ) : (
                  <p>N/A</p>
                )}
              </p>
            </section>
            <hr />
            <section className="profile-information-section">
              <h3>Password</h3>
              <p>*********</p>
            </section>
            <hr />
            <section className="profile-information-section">
              <h3>Fullname</h3>
              <p>
                {profileData.first_name} {profileData.last_name}
              </p>
            </section>
            <hr />
            <section className="profile-information-section">
              <h3>Address</h3>

              <p>
                {profileData.house_number !== null ? (
                  <p>{profileData.house_number}</p>
                ) : (
                  <p></p>
                )}
                {profileData.street_name !== null ? (
                  <p>{profileData.street_name}</p>
                ) : (
                  <p></p>
                )}
                {profileData.city !== null ? (
                  <p>{profileData.city}</p>
                ) : (
                  <p></p>
                )}
                {profileData.state !== null ? (
                  <p>{profileData.state}</p>
                ) : (
                  <p></p>
                )}
                {profileData.pincode !== null ? (
                  <p>{profileData.pincode}</p>
                ) : (
                  <p></p>
                )}
              </p>
            </section>
            <hr />
            <section className="profile-information-section">
              <h3>Contact Number</h3>
              {profileData.phone_no !== null ? (
                <p>{profileData.phone}</p>
              ) : (
                <p>N/A</p>
              )}
            </section>
            <hr />
          </article>
          <section className="profile-buttons">
            <button
              type="button"
              className="active-button-style"
              onClick={() => {
                toggleForm();
                ResetLocation();
              }}
            >
              Edit profile
            </button>
            <button
              type="button"
              className="passive-button-style"
              onClick={() => confirmDeleteUser()}
            >
              Delete account
            </button>
          </section>
        </React.Fragment>
      )}
      {confirmationModal ? (
        <section className="deletion-modal">
          <section className="deletion-window">
            <h3>Delete account</h3>
            <p>
              Are you sure you want to delete your account? This action cannot
              be reversed and all the data will be lost
            </p>
            <section>
              <button
                type="button"
                className="confirm-deletion"
                onClick={() => deleteUser(currentUser.id)}
              >
                Confirm
              </button>
              <button
                type="button"
                className="cancel-deletion"
                onClick={() => {
                  setConfirmationModal(false);
                  ResetLocation();
                }}
              >
                Cancel
              </button>
            </section>
          </section>
        </section>
      ) : null}
    </main>
  );
};

export default Profile;
