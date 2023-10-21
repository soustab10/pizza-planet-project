import React, { useEffect } from "react";
import ScrollButton from "../../helpers/ScrollBtn";

import WelcomeSection from "./WelcomeSection";
import PizzaMenuPreview from "./PizzaMenuPreview";
import ResetLocation from "../../helpers/ResetLocation";


const RootSection = () => {
  useEffect(() => {
    document.title = "Pizza Planet";
    ResetLocation();
  }, []);
  return (
    <React.Fragment>
      <WelcomeSection />
      <PizzaMenuPreview />      
      <ScrollButton />
    </React.Fragment>
  );
}

export default RootSection;
