import React, { useEffect, useState } from "react";
import ResetLocation from "../../helpers/ResetLocation";
import { useNavigate } from "react-router-dom";
import validateForm from "../../components/validateForm";

const PartnerDashboard = ({ currentUser, handleLogout, updateUser }) => {
  const [editForm, setEditForm] = useState(false);
  const [formValue, setFormValue] = useState({
    partner_id: "",
    user_id: "",
    first_name: "",
    last_name: "",    
    status: "",
    city: "",
    vehicle_number: "",
    phone_number: "",
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
  const navigate = useNavigate();
  const validate = validateForm("partner_dashboard");
  const toggleForm = () => {
    setEditForm(!editForm);
  };

  const handleValidation = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  useEffect(() => {
    document.title = "Partner Dashboard | Pizza Planet";
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

    fetch("http://localhost:8080/partner/profile", requestOptions)
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
        console.log("data");
        
        setProfileData(data);
        setFormValue({
          partner_id: data.partner_id,
          user_id: data.user_id,
          first_name: data.first_name,
          last_name: data.last_name,
          status: data.status,
          city: data.city,
          vehicle_number: data.vehicle_number,
          phone_number: data.phone_number,
        });
        
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
          window.alert("Please login with credentials!");
        }
        if (!response.ok) {
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
          window.alert("Please login with credentials!");
        }
        if (!response.ok) {
          throw new Error("Username and password do not match.");
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
          window.alert("Please login with credentials!");
        }
        if (!response.ok) {
          setLoading(false);
          return;
        }
        console.log(response);
        setLoading(false);
        window.alert("Profile Updated!");
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
      <h2>Partner information</h2>
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
              placeholder="Vehicle Number"
              name="vehicle_number"
              value={formValue.vehicle_number}
              onChange={handleValidation}
            />
            <span className="registration-input-err">{formErrors.vehicle_number}</span>
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
                  <ul className="kitchen-list-item">
                    {orderList.map((item) => (
                      <li key={item.order_id} className="kitchen-list-item-3">
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
    </main>
  );
};

export default PartnerDashboard;
