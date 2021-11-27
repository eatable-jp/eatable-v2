import React from "react";
// components
import Header from "./Header.js";
import SellerHome from "./SellerHome";
import BuyerHome from "./BuyerHome";

function Home({ userStatus }) {
  // displaying different component based on user type
  return userStatus === "seller" ? (
    <div>
      <Header userStatus="seller" />
      <SellerHome />
    </div>
  ) : (
    <div>
      <Header userStatus="buyer" />
      <BuyerHome />
    </div>
  )
}

export default Home;
