import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "../cart/AddToCartButton";

import ResetLocation from "../../helpers/ResetLocation";

const MenuGridItem = ({
  singleProduct,
  handleAddProduct,
  handleRemoveProduct,
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


  const [selectedCrust, setSelectedCrust] = useState(allCrustData[0]); // Set the default selected crust

  const handleCrustChange = (event) => {
    const selectedCrustId = parseInt(event.target.value, 10);
    const newSelectedCrust = allCrustData.find((crust) => crust.crust_id === selectedCrustId);
    setSelectedCrust(newSelectedCrust);
   
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
          <span>Rs </span>
          {singleProduct.price}
        </p>

        <AddToCartButton
          handleAddProduct={handleAddProduct}
          handleRemoveProduct={handleRemoveProduct}
          singleProduct={singleProduct}
          selectedAttributes={selectedAttributes}
          targetAttribute={targetAttribute}
          // setTargetAttribute={setTargetAttribute}
        />
      </div>
    </article>
  );
};

export default MenuGridItem;
