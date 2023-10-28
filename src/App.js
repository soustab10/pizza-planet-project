import React, { useState, useRef, useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Header from "./routes/landing/Header.js";
import Footer from "./components/footer/Footer";
import {
  About,
  Cart,
  RootSection,
  Menu,
  Payment,
  Register,
  RegisterPartner,
  RegisterKitchen,
  PartnerLogin,
  SingleItem,
  PartnerDashboard,
} from "./routes/index";

import { AllCategories } from "./data/AllCategories";
import LoginModal from "./components/login/LoginModal.js";
import NotFound from "./routes/not-found/NotFound.js";
import Terms from "./routes/terms/Terms.js";
import Profile from "./routes/profile/Profile.js";
import ResetLocation from "./helpers/ResetLocation.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [allCategories, setAllCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Menu");
  const [cartItems, setCartItems] = useState([]);
  const [clearedCart, setClearedCart] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [productsQuantity, setProductsQuantity] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [validLogin, setValidLogin] = useState(false);
  const [role, setRole] = useState(0);
  const [validPartnerLogin, setValidPartnerLogin] = useState(false);
  
  const [isModalActive, setIsModalActive] = useState(false);
  const [loginModalWindow, setLoginModalWindow] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [allProductsData, setAllProductsData] = useState([]);
  const [allCrustData, setAllCrustData] = useState([]);
  const [allToppingsData, setAllToppingsData] = useState([]);
  const [allSizesData, setAllSizesData] = useState([]);


  const notifyLogout = () => toast.success("User Logged Out successfully");
  const notifyLogin = () => toast.warn("Login with your credentials to add to cart.");
  const notifyError = () => toast.error("Something went wrong. Please try again.");

  useEffect(() => {
    const fetchPizzaData = async () => {
      try {
        const response = await fetch("http://localhost:8080/landing/pizza");
        // console.log("bb");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllProductsData(data);
        console.log(data);
        console.log(allProductsData);
      } catch (error) {
        console.error("Error fetching pizza details:", error);
      }
    };
    const fetchCrustData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/landing/pizza-crust"
        );
        // console.log("bb");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllCrustData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching pizza details:", error);
      }
    };
    const fetchToppingsData = async () => {
      try {
        const response = await fetch("http://localhost:8080/landing/topping");
        // console.log("bb");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllToppingsData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching pizza details:", error);
      }
    };

    const fetchSizesData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/landing/pizza-size"
        );
        // console.log("bb");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllSizesData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching pizza details:", error);
      }
    };
    fetchPizzaData();
    fetchCrustData();
    fetchToppingsData();
    fetchSizesData();
    setAllProducts(allProductsData);
  }, []);

  const getUser = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_USERS_URL}/${id}`);
      const body = await response.json();
      setCurrentUser(body.data[0]);
      const jsonUser = JSON.stringify(body.data[0]);
      sessionStorage.setItem("currentUser", jsonUser);
      if (response.status === 200) {
        return true;
      }
    } catch (err) {
      console.log(err.message);
      return false;
    }
  };

  const updateUser = async (id, user) => {
    console.log(user);
  };

  useEffect(() => {
    if (sessionStorage.getItem("currentUser") !== null) {
      const user = JSON.parse(sessionStorage.getItem("currentUser"));
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (validLogin && sessionStorage.getItem("validLogin") === null) {
      sessionStorage.setItem("validLogin", true);
    }
    if (sessionStorage.getItem("validLogin") !== null) {
      setValidLogin(sessionStorage.getItem("validLogin"));
    }
    if (sessionStorage.getItem("role") !== null) {
      setRole(sessionStorage.getItem("role"));
    }
  }, [validLogin]);

  const activateLoginModal = () => {
    hideMenu();
    setLoginModalWindow(!loginModalWindow);
  };

  const handleLogout = () => {
    notifyLogout();
    setValidLogin(false);
    hideMenu();
    setCurrentUser({});
    ResetLocation();
    setCartItems([]);
    setProductsQuantity(0);
    sessionStorage.clear();
  };

  const findMenuItem = (e) => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/landing/pizza");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllProductsData(data);
      } catch (error) {
        console.error("Error fetching pizza details:", error);
      }
    };
    fetchData();
    e.preventDefault();
    const inputValue = e.target.value.toLowerCase();

    const collectData = allProductsData.filter((product) =>
      product.pizza_name.toLowerCase().includes(inputValue)
    );

    if (collectData.length > 0) {
      setAllProducts(collectData);
    } else {
      setAllProducts([]);
    }
  };

  const showModal = () => {
    setIsModalActive(!isModalActive);
  };
  const hideMenu = () => {
    setIsModalActive(false);
  };

  const getAllCategories = async () => {
    setAllCategories(AllCategories);
  };

  const getAllProducts = () => {
    setAllProducts(allProductsData);
  };
  // CART LOGIC
  /*******************************************************/

  const CheckRepeatableProducts = (
    cartItems,
    targetProduct,
    userSelectedAttributes
  ) => {
    let item;
    let productsById = cartItems.filter((item) => item.id === targetProduct.id);
    productsById.forEach((targetItem) => {
      if (MatchingAttributes(userSelectedAttributes, targetItem)) {
        item = targetItem;
      }
      if (userSelectedAttributes.length === 0) {
        item = targetItem;
      }
    });

    return item;
  };

  const MatchingAttributes = (userSelectedAttributes, targetProduct) => {
    const attributesMatch = (groupOne, groupTwo) => {
      return Object.values(groupOne)[1] === Object.values(groupTwo)[1];
    };

    let truthyValuesCounter = 0;
    let i = 0;
    while (i < userSelectedAttributes.length) {
      if (
        attributesMatch(
          userSelectedAttributes[i],
          targetProduct?.userSelectedAttributes[i]
        )
      ) {
        truthyValuesCounter += 1;
      }
      i += 1;
    }

    return truthyValuesCounter === userSelectedAttributes?.length;
  };

  const updateCartQuantity = (
    actionToPerfrom,
    productAlreadyInCart,
    userSelectedAttributes
  ) => {
    const repeatableProduct = CheckRepeatableProducts(
      cartItems,
      productAlreadyInCart,
      userSelectedAttributes
    );
    const indexOfRepeatableProduct = cartItems.indexOf(repeatableProduct);

    const currentProductList = [...cartItems];
    if (actionToPerfrom === "addProduct") {
      currentProductList[indexOfRepeatableProduct].quantity += 1;
    } else {
      currentProductList[indexOfRepeatableProduct].quantity -= 1;
    }

    return currentProductList;
  };
  const handleAddProduct = (targetProduct, userSelectedAttributes) => {
    const productAlreadyInCart = CheckRepeatableProducts(
      cartItems,
      targetProduct,
      userSelectedAttributes
    );

    let currentCartItems = [...cartItems];
    let newQuantity;
    //if product doesn't exists yet
    if (productAlreadyInCart === undefined) {
      const itemToAdd = targetProduct;

      newQuantity = 1;

      currentCartItems.push({
        ...itemToAdd,
        userSelectedAttributes,
        quantity: newQuantity,
      });
    }
    //if product already exists
    else {
      let index;
      //if there are no attributes find index by id
      if (userSelectedAttributes.length === 0) {
        index = cartItems.findIndex(
          (item) => item.id.toString() === targetProduct.id.toString()
        );
      }

      //if there are attributes find index by attributes and id at the same time
      else {
        index = cartItems.findIndex(
          (item) =>
            item.userSelectedAttributes[0]?.attributeValue ===
              userSelectedAttributes[0].attributeValue &&
            item.id === targetProduct.id
        );
      }
      // console.log(userSelectedAttributes);
      if (index !== -1) {
        newQuantity = cartItems[index].quantity;

        currentCartItems[index] = {
          ...cartItems[index],
          quantity: newQuantity + 1,
        };
      }
    }

    const totalCartQuantity = currentCartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const jsonUser = JSON.stringify(currentCartItems);
    sessionStorage.setItem("cartItems", jsonUser);
    setCartItems(currentCartItems);
    sessionStorage.setItem("cartQuantity", totalCartQuantity);
    setProductsQuantity(totalCartQuantity);
    successMsg();
  };

  useEffect(() => {
    if (sessionStorage.getItem("cartItems") !== null) {
      const jsonCartItems = sessionStorage.getItem("cartItems");
      const cartItems = JSON.parse(jsonCartItems);
      setCartItems(cartItems);
    }
    if (sessionStorage.getItem("cartQuantity") !== null) {
      setProductsQuantity(sessionStorage.getItem("cartQuantity"));
    }
  }, []);

  const handleRemoveProduct = (targetProduct, userSelectedAttributes) => {
    let updatedProductList;
    let repeatableProduct = CheckRepeatableProducts(
      cartItems,
      targetProduct,
      userSelectedAttributes
    );

    if (repeatableProduct.quantity > 1) {
      updatedProductList = updateCartQuantity(
        "removeProduct",
        repeatableProduct,
        userSelectedAttributes
      );
    } else {
      const products = [...cartItems];
      const indexOfProduct = products.indexOf(repeatableProduct);
      products.splice(indexOfProduct, 1);
      updatedProductList = products;
    }

    setCartItems(updatedProductList);
    const jsonUser = JSON.stringify(updatedProductList);
    sessionStorage.setItem("cartItems", jsonUser);

    if (updatedProductList.length <= 1) {
      setProductsQuantity(updatedProductList[0]?.quantity || 0);
    } else {
      const productListArray = updatedProductList.map((item) => item.quantity);
      const sum = productListArray.reduce((a, b) => a + b, 0);
      sessionStorage.setItem("cartQuantity", sum);
      setProductsQuantity(sum);
    }

    if (updatedProductList.length === 0) {
      sessionStorage.setItem("cartQuantity", 0);
      setProductsQuantity(0);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setProductsQuantity(0);
    setClearedCart(true);
    sessionStorage.removeItem("cartItems");
    sessionStorage.removeItem("cartQuantity");
    ResetLocation();
  };

  const getTotalPrice = (cartItems) => {
    let total = cartItems.reduce((prevState, currentItem) => {
      const singleItemQuantity = currentItem.ItemPrice * currentItem.quantity;
      return prevState + singleItemQuantity;
    }, 0);
    setTotalPayment(total.toFixed(2));
    setTaxes(((total * 10) / 100).toFixed(2));
  };

  const successMsg = () => {
    const alertMessage = document.querySelector(".success-msg");
    alertMessage.classList.add("visible");
    setTimeout(() => {
      alertMessage.classList.remove("visible");
    }, 1000);
  };

  // Other
  /*******************************************************/

  useEffect(() => {
    getAllCategories();
    getAllProducts();

    getTotalPrice(cartItems);
  }, [activeCategory, cartItems]);

  const changeCategory = (newCategory) => {
    setActiveCategory(newCategory);
  };

  return (
    <BrowserRouter>
      <Header
        loginModal={
          <LoginModal
            validLogin={validLogin}
            role = {role}
            setValidLogin={setValidLogin}
            setRole = {setRole}
            setLoginModalWindow={setLoginModalWindow}
            loginModalWindow={loginModalWindow}
            hideMenu={hideMenu}
            getUser={getUser}
            setCurrentUser={setCurrentUser}
          />
        }
        activateLoginModal={activateLoginModal}
        showModal={showModal}
        isModalActive={isModalActive}
        hideMenu={hideMenu}
        handleLogout={handleLogout}
        validLogin={validLogin}
        role = {role}
        productsQuantity={productsQuantity}
      />
      <Routes>
        <Route path="/" element={<RootSection />} />

        <Route
          path="/cart"
          element={
            <Cart
              CartItem
              allProductsData={allProductsData}
              allCrustData={allCrustData}
              allToppingsData={allToppingsData}
              allSizesData={allSizesData}
            />
          }
        />

        <Route
          exact
          path="/menu"
          element={
            <Menu
              findMenuItem={findMenuItem}
              allProducts={allProducts}
              allProductsData={allProductsData}
              allCrustData={allCrustData}
              allToppingsData={allToppingsData}
              allSizesData={allSizesData}
              allCategories={allCategories}
              changeCategory={changeCategory}
              handleAddProduct={handleAddProduct}
              handleRemoveProduct={handleRemoveProduct}
              activeCategory={activeCategory}
            />
          }
        />
        <Route
          path="/menu/:name"
          element={
            <SingleItem
              handleAddProduct={handleAddProduct}
              handleRemoveProduct={handleRemoveProduct}
            />
          }
        />

        <Route path="/about" element={<About />} />
        <Route
          path="/register"
          element={
            validLogin ? (
              <NotFound />
            ) : (
              <Register activateLoginModal={activateLoginModal} />
            )
          }
        />
        <Route
          path="/registerkitchen"
          element={
            validLogin ? (
              <NotFound />
            ) : (
              <RegisterKitchen activateLoginModal={activateLoginModal} />
            )
          }
        />
        <Route
          path="/partnerlogin"
          element={
            validLogin ? (
              <NotFound />
            ) : (
              <PartnerLogin activateLoginModal={activateLoginModal} />
            )
          }
        />
        <Route
          path="/registerpartner"
          element={
            validLogin ? (
              <NotFound />
            ) : (
              <RegisterPartner activateLoginModal={activateLoginModal} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            !validLogin ? (
              <NotFound />
            ) : (
              <Profile
                currentUser={currentUser}
                getUser={getUser}
                handleLogout={handleLogout}
                updateUser={updateUser}
              />
            )
          }
        />
        <Route
          path="/partnerdashboard"
          element={
            !validLogin ? (
              <NotFound />
            ) : (
              <PartnerDashboard
                currentUser={currentUser}
                getUser={getUser}
                handleLogout={handleLogout}
                updateUser={updateUser}
              />
            )
          }
        />
        
        <Route
          path="/payment"
          element={
            <Payment
              cartItems={cartItems}
              totalPayment={totalPayment}
              currentUser={currentUser}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
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

      <Footer />
    </BrowserRouter>
  );
}

export default App;
