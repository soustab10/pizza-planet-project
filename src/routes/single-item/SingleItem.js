import React, { useEffect, useState } from "react";
import AddToCartButton from "../cart/AddToCartButton";
import { allProductsData } from "../../data/AllProductsData.js";
import { Link } from "react-router-dom";

const SingleItem = ({ handleAddProduct, handleRemoveProduct }) => {
  const [singleProduct, setSingleProduct] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [targetAttribute, setTargetAttribute] = useState("");
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [selectedCrust, setSelectedCrust] = useState("Regular");
  const [selectedToppings, setSelectedToppings] = useState([]);

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleCrustChange = (event) => {
    setSelectedCrust(event.target.value);
  };

  const handleToppingChange = (event) => {
    const topping = event.target.value;
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter((item) => item !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  useEffect(() => {
    document.title = `${singleProduct.pizza_name}| Pizza Planet`;
    console.log(allProductsData);
    console.log(window.location.pathname.toString().substring(6));
    const pizzaId = window.location.pathname.toString().substring(6);
    const selectedPizza = allProductsData.find(
      (pizza) => pizza.pizza_id.toString() === pizzaId
    );
    if (selectedPizza) {
      setSingleProduct(selectedPizza);
    } else {
      setSingleProduct(null);
    }
    console.log(selectedPizza);
  }, singleProduct.pizza_name);

  return (
    <main className="single-item-container">
      <Link to="/menu" className="back-btn">
        ← Back
      </Link>
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
                className="select-dropdown"
                value={selectedSize}
                onChange={handleSizeChange}
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </label>
          </section>
          <section className="single-item-title">
            <label className="select-label">
              Select Crust:
              <select
                className="select-dropdown"
                value={selectedCrust}
                onChange={handleCrustChange}
              >
                <option value="Regular">Regular</option>
                <option value="Thin Crust">Thin Crust</option>
                <option value="Stuffed Crust">Stuffed Crust</option>
              </select>
            </label>
          </section>
          <section className="single-item-title">
            <label className="toppings-label">
              Select Toppings (Multiple Selections Allowed):
              <div>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="Pepperoni"
                    checked={selectedToppings.includes("Pepperoni")}
                    onChange={handleToppingChange}
                    className="checkbox-input"
                  />
                  Pepperoni
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="Mushrooms"
                    checked={selectedToppings.includes("Mushrooms")}
                    onChange={handleToppingChange}
                    className="checkbox-input"
                  />
                  Mushrooms
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="Olives"
                    checked={selectedToppings.includes("Olives")}
                    onChange={handleToppingChange}
                    className="checkbox-input"
                  />
                  Olives
                </label>
              </div>
            </label>
          </section>

          <section className="price">
            <p className="price-num">
              <span>$</span>
              {singleProduct.price}
            </p>

            <AddToCartButton
              handleAddProduct={handleAddProduct}
              handleRemoveProduct={handleRemoveProduct}
              singleProduct={singleProduct}
              selectedAttributes={selectedAttributes}
              targetAttribute={targetAttribute}
              setTargetAttribute={setTargetAttribute}
            />
          </section>

          <div>
            <p>Selected Size: {selectedSize}</p>
            <p>Selected Crust: {selectedCrust}</p>
            <p>Selected Toppings: {selectedToppings.join(", ") || "None"}</p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default SingleItem;
