import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import img375 from "../../assets/images/section-one/section-one-375.webp";
import img700 from "../../assets/images/section-one/section-one-700.webp";
import img1440 from "../../assets/images/section-one/section-one-1440.webp";
import PizzaOne from "../../assets/images/welcome-section/pizza-one-parallax.webp";
import PizzaTwo from "../../assets/images/welcome-section/pizza-two-parallax.webp";
import { motion } from "framer-motion";

const WelcomeSection = () => {
  return (
    <article className="welcome-section">
      <section className="section-2-info flex-container flex-column txt-center pop-font">
        <motion.img
          src={PizzaTwo}
          alt=""
          className=" pizza-two"
          initial={{ opacity: 0, translateX: -200 }}
          whileInView={{
            opacity: 1,
            translateX: -100,
          }}
          transition={{ duration: 5 }}
        />
        <motion.img
          src={PizzaOne}
          alt=""
          className=" pizza-one"
          initial={{ opacity: 0, translateX: 200 }}
          whileInView={{
            opacity: 1,
            translateX: 100,
          }}
          transition={{ duration: 5 }}
        />
        <h2 className="txt-white">
          Welcome to
          <br /> <span>Pizza Planet</span>
        </h2>
        <p>
          Pizza Planet is a renowned pizza restaurant chain dedicated to
          delivering the ultimate pizza experience. With a passion for crafting
          the perfect pizzas, we offer a delectable selection of hand-tossed,
          oven-baked creations. Our commitment to quality ingredients, a variety
          of mouthwatering toppings, and a commitment to taste perfection
          ensures that every slice is a journey through flavor. Whether you're a
          fan of classic favorites or crave adventurous combinations, Pizza
          Planet is your go-to destination for savoring the finest, freshly made
          pizzas. Come and enjoy the taste of perfection at Pizza Planet, where
          every pizza is a slice of culinary excellence.
        </p>
      </section>
      <LazyLoadImage
        className="section-two-img"
        src={img375}
        srcSet={`${img1440} 1440w, ${img700} 700w, ${img375} 375w`}
        sizes="(min-width: 1440px) 1440px, (min-width: 700px) 700px, 375px"
        alt="Pizza Planet restaurant interior with people at the tabel and the staff serving the customers"
      />
    </article>
  );
};

export default WelcomeSection;
