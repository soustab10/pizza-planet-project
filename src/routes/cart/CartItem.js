import React from "react";
//components
import ChangeItemQuantity from "./ChangeItemQuantity";

const CartItem = ({
  handleAddProduct,
  handleRemoveProduct,
  clearCart,
  cartItems, cartTotals }) => {
  return (
    <React.Fragment>
      {cartItems.map((cartItem, index) => {
        return (
          <section className="cart-item" key={index}>
            <img src={cartItem.pizza_image_url} alt={cartItem.pizza_name} />
            <section className="cart-item-content">
              <section className="cart-item-info">
                
                  <h3 className="cart-item-title">{cartItem.pizza_name}</h3>
                 
                <p className="cart-item-ingredients">{cartItem.description}</p>
              </section>

              <section className="cart-item-interaction">
                <ChangeItemQuantity
                  handleAddProduct={handleAddProduct}
                  handleRemoveProduct={handleRemoveProduct}
                  cartItem={cartItem}
                />

                <p className="cart-item-price">${cartItem.price}</p>
              </section>
            </section>
          </section>
        );
      })
      }
      <button onClick={clearCart} className="cart-clear-btn">
        remove all items from the cart
      </button>
      {cartTotals}
    </React.Fragment>
  );
}



export default CartItem;