import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetLocation from "../../helpers/ResetLocation";

const MenuGridItem = ({
  singleProduct,
  
  allCrustData,
  allSizesData,
  allToppingsData,
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [targetAttribute, setTargetAttribute] = useState("");

  const handleSelectedAttributes = (attributeId, attributeValue) => {
    setTargetAttribute(attributeValue);
    const newSelectedAttribute = { attributeId, attributeValue };
    setSelectedAttributes((prevAttributes) => {
      const existingAttributeIndex = prevAttributes.findIndex(
        (attribute) =>
          attribute.attributeId === newSelectedAttribute.attributeId
      );
      if (existingAttributeIndex !== -1) {
        const updatedAttributes = [...prevAttributes];
        updatedAttributes[existingAttributeIndex] = { ...newSelectedAttribute };
        return updatedAttributes;
      } else {
        return [...prevAttributes, newSelectedAttribute];
      }
    });
  };

  const [selectedCrust, setSelectedCrust] = useState(allCrustData[0].crust_id);
  const [selectedSize, setSelectedSize] = useState(allSizesData[0].size_id); // Set the default selected crust

  const notifyAddtoCart = () => toast.success("Item has been added to cart successfully.");
  const notifyLogin = () => toast.warn("Login with credentials to add to cart.");
  const notifyError = () => toast.error("Something went wrong. Please try again.");
  const handleCrustChange = (event) => {
    const selectedCrustId = parseInt(event.target.value, 10);
    const newSelectedCrust = allCrustData.find(
      (crust) => crust.crust_id === selectedCrustId
    );
    setSelectedCrust(newSelectedCrust);
  };

  const addToCart = async (e) => {
    console.log("add to cart");
    e.preventDefault();
    var myHeaders = new Headers();
    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);

    var dataSend = JSON.stringify({
      pizza: {
        pizza_id: singleProduct.pizza_id,
      },
      quantity: 1,
      pizzaCrust: {
        crust_id: selectedCrust,
      },
      pizzaSize: {
        size_id: selectedSize,
      },
      toppings: [],
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: dataSend,
      redirect: "follow",
    };

    fetch("http://localhost:8080/cart/add", requestOptions)
      .then((response) => {
        console.log(response.status);
        if (response.status === 403) {
          notifyLogin();
          return;
        }
        if (!response.ok) {
          notifyError();
        }
        // return response.json();
      })
      .then((data) => {

        console.log(data);
        notifyAddtoCart();
        if(data===undefined){
          return;
        }
        
        console.log(data);
      });

    // const dataSend = {
    //   token: sessionStorage.getItem("token"),
    //   pizza: {
    //     pizza_id: window.location.pathname.toString().substring(6),
    //   },
    //   quantity: 1,
    //   pizzaCrust: {
    //     crust_id: selectedCrust,
    //   },
    //   pizzaSize: {
    //     size_id: selectedSize,
    //   },
    //   toppings: [],
    // };
    // const bodySend = JSON.stringify(dataSend);
    // console.log(bodySend);

    // fetch("http://localhost:8080/cart/add", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: bodySend,
    // })
    //   .then((response) => {
    //     console.log(response.status);
    //     if (response.status === 403) {

    //       window.alert("Please login to add to cart");
    //     }
    //     if (!response.ok) {
    //       throw new Error("Username and password do not match.");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     // setFormError(error.message);
    //   });
  };

  return (
    <article className="menu-grid-item flex-container flex-row txt-white">
      <Link
        onClick={ResetLocation}
        to={`/menu/${singleProduct.pizza_id}`}
        className="menu-item-link"
      >
        <img
          src={singleProduct.pizza_image_url}
          alt={`${singleProduct.pizza_name}`}
        />
      </Link>
      <h3>{singleProduct.pizza_name}</h3>
      <p>{singleProduct.description}</p>

      <div className="price">
        <p className="price-num">
          <span>INR </span>
          {singleProduct.price}
        </p>

        <button
          onClick={addToCart}
          className={`passive-button-style active-add-to-cart`}
        >
          Add to Cart
        </button>
      </div>

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
    </article>
  );
};

export default MenuGridItem;
