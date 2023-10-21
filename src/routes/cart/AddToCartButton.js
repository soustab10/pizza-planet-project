import React from "react";

const AddToCartButton = ({ singleProduct,
  selectedAttributes,
  handleAddProduct, targetAttribute, setTargetAttribute }) => {
  return (
    <button
      onClick={() => {
        handleAddProduct(singleProduct, selectedAttributes);
        setTargetAttribute(false);
      }}
      className={`passive-button-style active-add-to-cart`}
      
    >
      Add to cart
    </button>
  );
}
export default AddToCartButton;