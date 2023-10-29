import React, { useEffect, useState } from "react";
import ResetLocation from "../../helpers/ResetLocation";
import { useNavigate } from "react-router-dom";
import validateForm from "../../components/validateForm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [selectedStatus, setSelectedStatus] = useState("");
  const notifySucess = () => toast.success("Order Status has been updated successfully.");
  const notifyLogin = () => toast.warn("Login with your credentials to add to cart.");
  const notifyUpdate = () => toast.success("Profile updated successfully!");
  const notifyOrders = () => toast.warn("No orders found!");



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
          notifyLogin();
          return;
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
      `http://localhost:8080/kitchen/getByCity/${profileData.city}`,
      newRequestOptions
    )
      .then((response) => {
        console.log(response.status);
        if (response.status === 403) {
          notifyLogin();
          
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

    fetch(`http://localhost:8080/partner/orders`, newRequestOptions)
      .then((response) => {
        console.log(response.status);
        if (response.status === 500) {
          notifyOrders();
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
      partner_id: formValue.partner_id,
      user_id: formValue.user_id,
      first_name: formValue.first_name,
      last_name: formValue.last_name,
      city: formValue.city,
      vehicle_number: formValue.vehicle_number,
      phone_number: formValue.phone_number,
      formValue: formValue.status,
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

    fetch(`http://localhost:8080/partner/update`, requestOptions).then(
      (response) => {
        console.log(response.status);
        if (response.status === 403) {
          notifyLogin();
          return;
        }
        if (!response.ok) {
          setLoading(false);
          return;
        }
        console.log(response);
        setLoading(false);
        notifyUpdate();
        window.location.reload();
      }
    );
  };

  const handleStatusChange = (event, order_id) => {
    const selectedValue = event.target.value;
    console.log(selectedValue);
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

    fetch(
      `http://localhost:8080/partner/update-order-status/${selectedValue}/${order_id}`,
      requestOptions
    ).then((response) => {
      console.log(response.status);
      if (response.status === 403) {
        notifyLogin();
        return;
      }
      if (!response.ok) {
        setLoading(false);
        return;
      }
      console.log(response);
      setLoading(false);
      notifySucess();
      window.location.reload();
    });
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
            <span className="registration-input-err">
              {formErrors.vehicle_number}
            </span>
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
              <h3>Vehicle Number</h3>
              <p value={email}>{profileData.vehicle_number}</p>
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
              <h3>City</h3>

              <p>
                {profileData.city !== null ? (
                  <p>{profileData.city}</p>
                ) : (
                  <p></p>
                )}
              </p>
            </section>
            <hr />
            <section className="profile-information-section">
              <h3>Contact Number</h3>
              {profileData.phone_number}
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
            {/* <button
              type="button"
              className="passive-button-style"
              onClick={() => confirmDeleteUser()}
            >
              Delete account
            </button> */}
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
                    <div className="kitchen-list-item">No Orders</div>
                  ) : (
                    <ul className="kitchen-list-item">
                      {orderList.map((item) => (
                        <li key={item.order_id} className={"kitchen-list-item-3 " + ((item.delivery_status === "DELIVERED") ?"delivered-background":"")}>
                          <p>Order Details:</p>
                          <p>Order ID: {item.order_id}</p>
                          <p>
                            Delivering From Kitchen Address:{" "}
                            {item.kitchen.street_name} {item.kitchen.plot}{" "}
                            {item.kitchen.city} {item.kitchen.state}
                            {item.kitchen.pincode}{" "}
                          </p>
                          <p>
                            Delivery Customer: {item.customer.first_name+" " +item.customer.last_name}
                          </p>
                          <p>
                            Customer Address:{" "}
                            {item.customer.street_name} {item.customer.plot}{" "}
                            {item.customer.city} {item.customer.state}
                            {item.customer.pincode}{" "}
                          </p>
                          <p>Order Total: {item.total_amount}</p>
                          <p>Status: {item.delivery_status}</p>
                          <div>
                            {item.delivery_status === "DELIVERED" ? (
                              <div>
                                <p>Order is Delivered</p>
                              </div>
                            ) : (
                              <section>
                                Change Order Status
                                <select
                                  value={selectedStatus}
                                  onChange={(event) =>
                                    handleStatusChange(event, item.order_id)
                                  }
                                >
                                  <option value="">Select Status</option>
                                  <option value="WITH_RESTAURANT">
                                    WITH RESTAURANT
                                  </option>
                                  <option value="OTW">Out for Delivery</option>
                                  <option value="DELIVERED">Delivered</option>
                                </select>
                              </section>
                            )}
                          </div>
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

export default PartnerDashboard;
