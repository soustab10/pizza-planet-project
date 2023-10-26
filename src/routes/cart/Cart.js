import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollBtn from "../../helpers/ScrollBtn";
import EmptyCart from "./EmptyCart";

const Cart = () => {
  const [cartData, setCartData] = useState([]);

  const increaseQuantity = () => {
    // setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    // if (quantity > 1) {
    //   setQuantity(quantity - 1);
    // }
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
        console.log(data);
        setCartData(data);
      });
  }, []);


  const deleteCartItem = (cartItem) => {
    console.log("delete from cart");
    // e.preventDefault();
    // var myHeaders = new Headers();
    // const userToken = sessionStorage.getItem("token");
    // console.log(userToken);
    // myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", `Bearer ${userToken}`);
    // const convertedToppings = selectedToppings.map((toppingId) => ({
    //   topping_id: toppingId,
    // }));

    // var dataSend = JSON.stringify({
    //   pizza: {
    //     pizza_id: window.location.pathname.toString().substring(6),
    //   },
    //   quantity: quantity,
    //   pizzaCrust: {
    //     crust_id: selectedCrust,
    //   },
    //   pizzaSize: {
    //     size_id: selectedSize,
    //   },
    //   toppings: convertedToppings,
    // });

    // console.log(dataSend);

    // var requestOptions = {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: dataSend,
    //   redirect: "follow",
    // };

    // fetch("http://localhost:8080/cart/add", requestOptions)
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
    //   });
    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);
    const convertedToppings = cartItem.toppings.map((item) => ({ topping_id: item.topping_id }));

    var dataSend = JSON.stringify({
      cart_id: cartItem.cart_id,
      user_id: cartItem.user_id,
      pizza: {
        pizza_id: cartItem.pizza.pizza_id,
      },
      quantity: cartItem.quantity,
      pizzaCrust: {
        crust_id: cartItem.pizzaCrust.crust_id,
      },
      pizzaSize: {
        size_id: cartItem.pizzaSize.size_id,
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

    fetch("http://localhost:8080/cart/delete", requestOptions)
      .then((response) => {
        console.log(response.status);
        if (response.status === 403) {
          window.alert("Please login to add to cart");
        }
        if (!response.ok) {
          console.log("error",response);
        }
        // return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
      });
  };
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
                      Selected Size: {cartItem.pizzaSize.size_name}
                    </section>
                    <section>
                      Selected Toppings:{" "}
                      <ul>
                        {cartItem.toppings.map((item) => (
                          <li key={item.topping_id}>
                            <p>{item.topping_name}</p>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* <section>
                      <div className="">
                        <div className="quantity-control">
                          <button
                            className="counter-btn"
                            onClick={decreaseQuantity}
                          >
                            -
                          </button>
                          <section className="cart-item-quantity">
                            Quantity: {cartItem.quantity}
                          </section>
                          <button
                            className="counter-btn"
                            onClick={increaseQuantity}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </section> */}
                    <section className="cart-item-interaction">
                      <p className="cart-item-price">Rs. {cartItem.price}</p>
                    </section>
                    <button
                      className="delete-button"
                      onClick={() => deleteCartItem(cartItem)}
                    >
                      Delete from Cart
                    </button>
                  </section>
                </section>
              );
            })}
            <button className="cart-clear-btn">
              remove all items from the cart
            </button>

            <section className="cart-totals">
              Net Total: Rs.{" "}
              {cartData.reduce((acc, item) => acc + item.price, 0)}
            </section>
            <section className="checkout-interaction-btns">
              <Link to="/payment" className="active-button-style">
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
