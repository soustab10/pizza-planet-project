import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Modal({ closeModal }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>Login</h2>
        {/* Add more details or components as needed */}
      </div>
    </div>
  );
}

const SingleItem = () => {
  const [singleProduct, setSingleProduct] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [targetAttribute, setTargetAttribute] = useState("");
  const [selectedSize, setSelectedSize] = useState(4); //change it to first starting size_id
  const [selectedCrust, setSelectedCrust] = useState(6); // change it to first starting crust_id
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const [allProductsData, setAllProductsData] = useState([]);
  const [allCrustData, setAllCrustData] = useState([]);
  const [allToppingsData, setAllToppingsData] = useState([]);
  const [allSizesData, setAllSizesData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const notifyAddtoCart = () =>
    toast.success("Item has been added to cart successfully.");
  const notifyLogin = () =>
    toast.warn("Login with your credentials to add to cart.");
  const notifyError = () =>
    toast.error("Incorrect credentials. Please try again.");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchPizzaData = async () => {
      try {
        const response = await fetch("http://localhost:8080/landing/pizza");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllProductsData(data);
        console.log(data);
        console.log(allProductsData);
        console.log(window.location.pathname.toString().substring(6));
        const pizzaId = window.location.pathname.toString().substring(6);
        const selectedPizza = data.find(
          (pizza) => pizza.pizza_id.toString() === pizzaId
        );

        if (selectedPizza) {
          setSingleProduct(selectedPizza);
          setTotalPrice(selectedPizza.price);
        } else {
          setSingleProduct(null);
        }
        console.log(selectedPizza);
      } catch (error) {
        console.error("Error fetching pizza details:", error);
      }
    };
    const fetchCrustData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/landing/pizza-crust"
        );
        // console.log("bb");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllCrustData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching pizza details:", error);
      }
    };
    const fetchToppingsData = async () => {
      try {
        const response = await fetch("http://localhost:8080/landing/topping");
        // console.log("bb");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllToppingsData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching pizza details:", error);
      }
    };

    const fetchSizesData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/landing/pizza-size"
        );
        // console.log("bb");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllSizesData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching pizza details:", error);
      }
    };
    fetchPizzaData();
    fetchCrustData();
    fetchToppingsData();
    fetchSizesData();

    // console.log(allProductsData);
    // console.log(window.location.pathname.toString().substring(6));
    // const pizzaId = window.location.pathname.toString().substring(6);
    // const selectedPizza = allProductsData.find(
    //   (pizza) => pizza.pizza_id.toString() === pizzaId
    // );
    // if (selectedPizza) {
    //   setSingleProduct(selectedPizza);
    // } else {
    //   setSingleProduct(null);
    // }
    // console.log(selectedPizza);
  }, []);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSizeChange = (event) => {
    const sizeId = event.target.value;
    setSelectedSize(event.target.value);
    const selectedItemId = allSizesData.find(
      (item) => item.size_id.toString() === sizeId
    );
    const newPrice = Math.round(totalPrice * selectedItemId.cost_multiplier);

    setTotalPrice(newPrice);
  };

  const handleCrustChange = (event) => {
    const crustId = event.target.value;
    setSelectedCrust(event.target.value);
    const selectedCrustPrice = allCrustData.find(
      (crust) => crust.crust_id.toString() === crustId
    )?.price;
    const newPrice = totalPrice + selectedCrustPrice;
    setTotalPrice(newPrice);
  };

  const handleToppingChange = (topping) => {
    let newPrice = totalPrice;
    const selectedToppingPrice = allToppingsData.find(
      (t) => t.topping_id === topping
    )?.price;

    if (selectedToppings.includes(topping)) {
      newPrice -= selectedToppingPrice;
    } else {
      newPrice += selectedToppingPrice;
    }

    setTotalPrice(newPrice);
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter((item) => item !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };
  const addToCart = async (e) => {
    console.log("add to cart");
    e.preventDefault();
    var myHeaders = new Headers();
    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);
    const convertedToppings = selectedToppings.map((toppingId) => ({
      topping_id: toppingId,
    }));

    var dataSend = JSON.stringify({
      pizza: {
        pizza_id: window.location.pathname.toString().substring(6),
      },
      quantity: quantity,
      pizzaCrust: {
        crust_id: selectedCrust,
      },
      pizzaSize: {
        size_id: selectedSize,
      },
      toppings: convertedToppings,
    });

    console.log(dataSend);

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
        }
        else if (!response.ok) {
          notifyError();
        }
        else if(response.ok){
          notifyAddtoCart();
        }
        // return response.json();
      })
      .then((data) => {
        // notifyAddtoCart();
        console.log(data);
      });
  };

  //   const dataSend = {
  //     token: sessionStorage.getItem("token"),
  //     pizza: {
  //       pizza_id: window.location.pathname.toString().substring(6),
  //     },
  //     quantity: quantity,
  //     pizzaCrust: {
  //       crust_id: selectedCrust,
  //     },
  //     pizzaSize: {
  //       size_id: selectedSize,
  //     },
  //     toppings: selectedToppings,
  //   };

  return (
    <main className="single-item-container">
      <Link to="/menu" className="back-btn">
        ← Back
      </Link>
      {isModalOpen && <Modal closeModal={closeModal} />}
      <article className="single-item flex-container flex-column txt-white">
        <img
          src={singleProduct?.pizza_image_url}
          alt={`${singleProduct?.pizza_name}`}
        />
        <section className="single-item-info">
          <section className="single-item-title">
            <h2>{singleProduct?.pizza_name}</h2>
            <p>{singleProduct?.description}</p>
          </section>
          <section className="single-item-title">
            <label className="select-label">
              Select Size:
              <select
                value={selectedSize.id}
                className="select-dropdown"
                onChange={handleSizeChange}
              >
                {allSizesData.map((size) => (
                  <option key={size.size_id} value={size.size_id}>
                    {size.size_name}
                  </option>
                ))}
              </select>
            </label>
          </section>
          <section className="single-item-title">
            <label className="select-label">
              Select Crust:
              <select
                value={selectedCrust.id}
                className="select-dropdown"
                onChange={handleCrustChange}
              >
                {allCrustData.map((crust) => (
                  <option key={crust.crust_id} value={crust.crust_id}>
                    {crust.crust_name}
                  </option>
                ))}
              </select>
            </label>
          </section>
          <section className="single-item-title">
            <label className="toppings-label">
              Select Toppings (Multiple Selections Allowed):
              <div>
                <form>
                  {allToppingsData.map((topping) => (
                    <label key={topping.topping_id} className="checkbox-label">
                      <input
                        type="checkbox"
                        className="checkbox-input"
                        value={topping.topping_id}
                        checked={selectedToppings.includes(topping.topping_id)}
                        onChange={() => handleToppingChange(topping.topping_id)}
                      />
                      {topping.topping_name}
                    </label>
                  ))}
                </form>
              </div>
            </label>
          </section>
          <section>
            <div className="quantity-counter">
              <h2 className="counter-heading">Quantity Counter</h2>
              <div className="quantity-control">
                <button className="counter-btn" onClick={decreaseQuantity}>
                  -
                </button>
                <span className="counter-count">{quantity}</span>
                <button className="counter-btn" onClick={increaseQuantity}>
                  +
                </button>
              </div>
            </div>
          </section>

          <section className="price">
            <p className="price-num">
              <span>INR. </span>
              {totalPrice}
            </p>
            <br/>
            <p className="price-num">Net Total: INR {totalPrice * quantity}</p>

            <button
              onClick={addToCart}
              className={`passive-button-style active-add-to-cart`}
            >
              Add to Cart
            </button>
          </section>

          {/* <div>
            <p>Selected Size: {selectedSize}</p>
            <p>Selected Crust: {selectedCrust}</p>
            <p>Selected Toppings: {selectedToppings.join(", ") || "None"}</p>
            <p>Quantity: {quantity}</p>
          </div> */}
        </section>
      </article>
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

export default SingleItem;
