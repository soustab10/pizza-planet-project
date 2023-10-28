import React from "react";
import { createRoot } from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
// CSS
import "./core-ui/app.css";
import "./core-ui/responsive.css";
import "./core-ui/leaflet.css";
import './routes/menu/menu.css'
import './routes/about/about.css'

import './routes/cart/cart.css'
import './routes/registration/register.css'
import './routes/cart/checkout.css'
import './routes/payment/payments.css'
import './routes/not-found/notFound.css'

import './routes/profile/profile.css'
import './routes/single-item/singleItem.css'


//Components
import App from "./App.js";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
