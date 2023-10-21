import React, { useEffect, useState } from "react";
import AddToCartButton from "../cart/AddToCartButton";
import { allProductsData } from "../../data/AllProductsData.js";
import { Link } from "react-router-dom";

const SingleItem = ({ handleAddProduct, handleRemoveProduct }) => {
  const [singleProduct, setSingleProduct] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [targetAttribute, setTargetAttribute] = useState("");

  useEffect(() => {
    document.title = `${singleProduct.pizza_name}| Pizza Planet`;
    setSingleProduct(
      allProductsData.filter(
        (item) => item.id === window.location.pathname.toString().substring(6)
      )[0]
    );
  }, [singleProduct.pizza_name]);

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
        </section>
      </article>
    </main>
  );
};

export default SingleItem;
