import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ResetLocation from "../../helpers/ResetLocation";

const PizzaMenuPreview = () => {
  return (
    <div>
      <article className="section-4 flex-container flex-column">
        <section className="section-4-info txt-center">
          <h2 className="pop-font txt-white">Hot Pizza Meals</h2>
          <p className="section-description">
            Pizza Planet holds the market of the pizza industry and continuously
            offers more than pizza. Check out our hottest menu options with
            cheese, meat, chicken and veggies!
          </p>
        </section>

        <Link
          onClick={ResetLocation}
          to="/menu"
          className="active-button-style txt-white"
        >
          View Our Menu!!
        </Link>
      </article>
      <article className="section-4 flex-container flex-column">
        <section className="section-4-info txt-center">
          <h2 className="pop-font txt-white">Best in Class ingredients</h2>
          <p className="section-description">
            "At Pizza Planet, we take pride in our commitment to using only the
            freshest and highest-quality ingredients in our pizza-making
            process. Our dedication to freshness begins with hand-picked,
            farm-fresh vegetables and herbs that are bursting with flavor. We
            source premium, locally-sourced meats and cheeses to ensure a rich
            and authentic taste experience. Our dough is made daily, using the
            finest flour and allowed to rise naturally, resulting in a light and
            airy crust. The combination of these fresh, thoughtfully chosen
            ingredients creates the foundation for our delicious and
            mouthwatering pizzas. When you savor a slice at Pizza Planet, you
            can taste the difference that fresh ingredients make."
          </p>
        </section>

        <Link
          onClick={ResetLocation}
          to="/menu"
          className="active-button-style txt-white"
        >
          View Our Menu!!
        </Link>
      </article>
    </div>
  );
};

export default PizzaMenuPreview;
