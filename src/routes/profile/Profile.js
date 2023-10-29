import React, { useEffect, useState } from "react";
import ResetLocation from "../../helpers/ResetLocation";
import { useNavigate } from "react-router-dom";
import validateForm from "../../components/validateForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = ({ currentUser, handleLogout, updateUser }) => {
  const [editForm, setEditForm] = useState(false);
  const [formValue, setFormValue] = useState({
    id: "",
    email: [],
    first_name: "",
    last_name: "",
    house_number: "",
    street_name: "",
    dob: "",
    city: "",
    state: "",
    pincode: "",
    number: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [email, setEmail] = useState("");
  const [phone_no, setPhone_no] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [viewKitchen, setViewKitchen] = useState(false);
  const [viewOrder, setViewOrder] = useState(false);
  const [kitchenList, setKitchenList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const notifySuccess = () => toast.success("Customer updated successfully");
  const notifyLogin = () =>
    toast.warn("Login with your credentials to add to cart.");
  const notifyError = () =>
    toast.error("Something went wrong. Please try again.");

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
          notifyLogin();
        }
        if (!response.ok) {
          notifyError();
          throw new Error("Username and password do not match.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("data");
        console.log(data);
        console.log(data.city);
        setCustomerCity(data.city);
        setProfileData(data);
        setFormValue({
          id: data.id,
          email: [data.email[0].email],
          first_name: data.first_name,
          last_name: data.last_name,
          house_number: data.house_number,
          street_name: data.street_name,
          dob: data.dob,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          number: [data.phone_no[0].phone_no],
        });
        setEmail(data.email[0].email);
        setPhone_no(data.phone_no[0].phone_no);
      });
  }, []);

  const viewKitchens = async (e) => {
    e.preventDefault();
    setViewKitchen(!viewKitchen);
    console.log("getting cities");
    console.log(customerCity);
    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);
    var newRequestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8080/kitchen/getByCity/${customerCity}`,
      newRequestOptions
    )
      .then((response) => {
        console.log(response.status);
        if (response.status === 403) {
          notifyLogin();
        }
        if (!response.ok) {
          notifyError();
          throw new Error("Username and password do not match.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("data");
        console.log(data);
        setKitchenList(data);
      });
  };
  const viewOrders = async (e) => {
    e.preventDefault();
    setViewOrder(!viewOrder);
    console.log("getting orders");
    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);
    var newRequestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:8080/order`, newRequestOptions)
      .then((response) => {
        console.log(response.status);
        if (response.status === 403) {
          notifyLogin();
        }
        if (!response.ok) {
          notifyError();
        }
        return response.json();
      })
      .then((data) => {
        console.log("data");
        console.log(data);
        setOrderList(data);
      });
  };

  const handleSubmit = async (e) => {
    console.log(formValue);

    const signupData = {
      username: formValue.username,
      password: formValue.password,
      first_name: formValue.first_name,
      last_name: formValue.last_name,
      house_number: formValue.house_number,
      street_name: formValue.street_name,
      city: formValue.city,
      state: formValue.state,
      pincode: formValue.pincode,
    };
    setLoading(true);

    const bodySend = JSON.stringify({ ...signupData });
    console.log(bodySend);
    console.log(validate(formValue));
    if (Object.keys(validate(formValue)).length > 0) {
      setLoading(false);
      return;
    }

    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);

    var requestOptions = {
      method: "PUT",
      body: bodySend,
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:8080/customer/update`, requestOptions).then(
      (response) => {
        console.log(response.status);
        if (response.status === 403) {
          notifyLogin();
          return;
        }
        if (!response.ok) {
          notifyError();
          setLoading(false);
          return;
        }
        console.log(response);
        setLoading(false);
        notifySuccess();
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
            <span className="registration-input-err">
              {formErrors.first_name}
            </span>
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

          {/* <section className="email-section">
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={formValue.email}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formErrors.email}</span>
          </section> */}

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
          {/* <section className="birthday">
            <input
              type="text"
              placeholder="Phone Number"
              name="number"
              value={formValue.number}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formErrors.number}</span>
          </section> */}
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
              <p value={email}>{email}</p>
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
              {phone_no}
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
          <section className="kitchen-list">
            <p className="kitchen-title">View Orders:</p>
            <button
              onClick={viewOrders}
              className="active-button-style kitchen-view-btn"
            >
              {" "}
              {viewOrder ? "Hide" : "View"}
            </button>
            <div>
              {viewOrder ? (
                <div>
                  {orderList.length === 0 ? (
                    <p>No Orders to Show!</p>
                  ) : (
                    <ul className="kitchen-list-item">
                      {orderList.map((item) => (
                        <li key={item.order_id} className={"kitchen-list-item-3 " + ((item.delivery_status === "DELIVERED") ?"delivered-background":"")} >
                          <p>Order Details:</p>
                          <p>Order ID: {item.order_id}</p>
                          <p>
                            Delivering From Kitchen Address:{" "}
                            {item.kitchen.street_name} {item.kitchen.plot}{" "}
                            {item.kitchen.city} {item.kitchen.state}
                            {item.kitchen.pincode}{" "}
                          </p>
                          <p>
                            Your Delivery Partner Details:{" "}
                            {item.partner.first_name} {item.partner.last_name}{" "}
                            Phone:{item.partner.phone_number}
                          </p>
                          <p>Order Total: {item.total_amount}</p>
                          <p>Status: {item.delivery_status}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}
            </div>
          </section>
          <section className="kitchen-list">
            <p className="kitchen-title">Kitchens in your City:</p>
            <button
              onClick={viewKitchens}
              className="active-button-style kitchen-view-btn"
            >
              {" "}
              {viewKitchen ? "Hide" : "View"}
            </button>
            <div>
              {viewKitchen ? (
                <div>
                  <ul className="kitchen-list-item">
                    {kitchenList.map((item) => (
                      <li key={item.kitchen_id} className="kitchen-list-item-2">
                        <p>Kitchen {item.kitchen_id}</p>
                        <p>
                          Address: {item.street_name} {item.plot} {item.city}{" "}
                          {item.state}{" "}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </main>
  );
};

export default Profile;
