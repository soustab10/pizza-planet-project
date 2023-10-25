import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollBtn from "../../helpers/ScrollBtn";
import EmptyCart from "./EmptyCart";

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    document.title = "Shopping Cart | Pizza Planet";
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

    fetch("http://localhost:8080/cart", requestOptions)
      .then((response) => {
        console.log(response.status);
        if (response.status === 403) {
          window.alert("Please login to add to cart");
        }
        if (!response.ok) {
          throw new Error("Username and password do not match.");
        }
        return response.json();
      })
      .then((data) => {
        setCartData(data);
      });
  }, []);
  return (
    <main className="cart">
      <h2>Shopping cart</h2>
      <article className="cart-content">
        {cartData.length === 0 ? (
          <EmptyCart />
        ) : (
          <React.Fragment>
            {cartData.map((cartItem, index) => {
              return (
                <section className="cart-item" key={index}>
                  <img
                    src={cartItem.pizza.pizza_image_url}
                    alt={cartItem.pizza.pizza_name}
                  />
                  <section className="cart-item-content">
                    <section className="cart-item-info">
                      <h3 className="cart-item-title">
                        {cartItem.pizza.pizza_name}
                      </h3>

                      <p className="cart-item-ingredients">
                        {cartItem.pizza.description}
                      </p>
                    </section>
                    <section>
                      Selected Crust: {cartItem.pizzaCrust.crust_name}
                    </section>
                    <section>
                      Selected Crust: {cartItem.pizzaSize.size_name}
                    </section>
                    <section>
                      Selected Toppings:{" "}
                      {cartItem.toppings.join(", ") || "None"}
                    </section>
                    <section className="cart-item-quantity">
                      Quantity: {cartItem.quantity}
                    </section>

                    <section>
                      <div className="">
                        <p className="">Quantity Counter</p>
                        <div className="quantity-control">
                          <button
                            className="counter-btn"
                            onClick={decreaseQuantity}
                          >
                            -
                          </button>
                          <span className="counter-count">{quantity}</span>
                          <button
                            className="counter-btn"
                            onClick={increaseQuantity}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </section>
                    <section className="cart-item-interaction">
                      <p className="cart-item-price">Rs. {cartItem.price}</p>
                    </section>
                  </section>
                </section>
              );
            })}
             <button className="cart-clear-btn">
              remove all items from the cart
            </button>

            <section className="cart-totals"> 
            Net Total: Rs. {cartData.reduce((acc, item) => acc + item.price, 0)}
            </section>
            <section className="checkout-interaction-btns">
              <Link to="/payment" className="active-button-style" >
                Proceed to payment
              </Link>
              <Link to="/menu" className="checkout-backtomenu-btn">
                Back to menu
              </Link>
            </section>
           
          </React.Fragment>
        )}
      </article>
      <ScrollBtn />
    </main>
  );
};

export default Cart;
