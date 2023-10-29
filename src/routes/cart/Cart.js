import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollBtn from "../../helpers/ScrollBtn";
import EmptyCart from "./EmptyCart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [couponList, setCouponList] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const notifyLogin = () =>
    toast.warn("Login with your credentials to add to cart.");
  const notifyError = () =>
    toast.error("Something went wrong. Please try again.");
  const notifyCart = () => toast.success("Item deleted from cart.");

  // Initialize the selected coupon with the first coupon (optional)
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const handleCouponChange = (event) => {
    const couponId = event.target.value;
    console.log(couponId);
    const sCoupon = couponList.find(
      (coupon) => coupon.coupon_id.toString() === couponId.toString()
    );
    setSelectedCoupon(sCoupon);

    sessionStorage.setItem("coupon_code", sCoupon.coupon_code);
  };
  useEffect(() => {
    document.title = "Shopping Cart | Pizza Planet";
    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);
    var itemsTotal = 0;
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:8080/cart", requestOptions)
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
        console.log(data);
        setCartData(data);

        setCartTotal(data.reduce((acc, item) => acc + item.price, 0));
      });

    fetch("http://localhost:8080/coupons", requestOptions)
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
        console.log("coupon data");
        console.log(data);
        setCouponList(data);
        console.log(itemsTotal);
      });
  }, []);

  const deleteCartItem = (cartItem) => {
    console.log("delete from cart");

    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);
    const convertedToppings = cartItem.toppings.map((item) => ({
      topping_id: item.topping_id,
    }));

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
          notifyLogin();
        }
        if (!response.ok) {
          console.log("error", response);
        }
        // return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
        notifyCart();
      });
  };
  const increaseCartItem = (cartItem) => {
    console.log("delete from cart");
    if(cartItem.quantity >= 10){
      return;
    }
    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);
    
    const itemQuantity = cartItem.quantity + 1;
    var dataSend = JSON.stringify({
      cart_id: cartItem.cart_id,      
      quantity: itemQuantity,      
    });

    console.log(dataSend);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: dataSend,
      redirect: "follow",
    };

    fetch("http://localhost:8080/cart/update", requestOptions)
      .then((response) => {
        console.log(response.status);
        if (response.status === 403) {
          notifyLogin();
        }
        if (!response.ok) {
          console.log("error", response);
        }
        // return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
        // notifyCart();
      });
  };
  const decreaseCartItem = (cartItem) => {
    console.log("delete from cart");
    if(cartItem.quantity === 1){
      return;
    }
    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);
    
    const itemQuantity = cartItem.quantity - 1;
    var dataSend = JSON.stringify({
      cart_id: cartItem.cart_id,      
      quantity: itemQuantity,      
    });

    console.log(dataSend);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: dataSend,
      redirect: "follow",
    };

    fetch("http://localhost:8080/cart/update", requestOptions)
      .then((response) => {
        console.log(response.status);
        if (response.status === 403) {
          notifyLogin();
        }
        if (!response.ok) {
          console.log("error", response);
        }
        // return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
        // notifyCart();
      });
  };

  const clearCart = () => {
    const userToken = sessionStorage.getItem("token");
    console.log(userToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:8080/cart/remove-all", requestOptions)
      .then((response) => {
        console.log(response.status);
        if (response.status === 403) {
          notifyLogin();
        } else if (!response.ok) {
          console.log("error", response);
          notifyError();
        }
        // return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
        notifyCart();
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
                    <section className="cart-item-qty">
                      
                      <button className="cart-item-quantity" onClick={() => increaseCartItem(cartItem)}>
                        +
                      </button>
                      Quantity: {cartItem.quantity}
                      <button className="cart-item-quantity" onClick={() => decreaseCartItem(cartItem)}>
                        -
                      </button>
                    </section>
                    <section>
                      
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
                      <p className="cart-item-price">INR. {cartItem.price}</p>
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
            <section className="cart-footer">
              <button className="cart-clear-btn" onClick={clearCart}>
                Clear Cart
              </button>

              <div>
                <select value={selectedCoupon} onChange={handleCouponChange}>
                  <option value="">Select a Coupon</option>
                  {couponList.map((coupon) => {
                    if (coupon.activationPrice <= cartTotal) {
                      return (
                        <option key={coupon.coupon_id} value={coupon.coupon_id}>
                          {coupon.coupon_code}: Discount Amount INR.{" "}
                          {coupon.discountPrice.toFixed(2)}
                        </option>
                      );
                    }
                    return null; // Return null for coupons that don't meet the condition
                  })}
                </select>
              </div>

              <section className="cart-totals">
                <div>Cart Total: INR.{cartTotal}</div>
                {selectedCoupon && (
                  <div>
                    <p>Selected Coupon: {selectedCoupon.coupon_code}</p>
                    <p>Discount Amount: INR. {selectedCoupon.discountPrice} </p>
                  </div>
                )}
                {selectedCoupon ? (
                  <div className="cart-totals-net">
                    Net Total: {cartTotal - selectedCoupon.discountPrice}
                  </div>
                ) : (
                  <div className="cart-totals-net">Net Total: {cartTotal}</div>
                )}
              </section>
              <section className="checkout-interaction-btns1">
                <Link to="/payment" className="active-button-style">
                  Proceed to payment
                </Link>
                <Link to="/menu" className="checkout-backtomenu-btn">
                  Back to menu
                </Link>
              </section>
            </section>
          </React.Fragment>
        )}
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
      <ScrollBtn />
    </main>
  );
};

export default Cart;
