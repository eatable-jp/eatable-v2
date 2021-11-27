import React, { useEffect } from "react";
// react router
import { useHistory } from "react-router-dom";
// components
import Header from "./Header";

export default function BuyerSuccess() {
  useEffect(() => {
    setTimeout(() => {
      routeChange();
    }, 5000);
  }, []);
  // redirect function
  const history = useHistory();
  const routeChange = () =>{ 
    let path = `/buyer-profile`; 
    history.push(path);
  }  
  return (
    <>
      <Header userStatus="buyer" />
      <h1 className='text-center'>Thank you for the purchase!</h1>
    </>
  );
}
