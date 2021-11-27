import React, { useEffect } from "react";
// react router
import { useHistory } from "react-router-dom";
// components
import Header from "./Header";

export default function BuyerFail() {
  useEffect(() => {
    setTimeout(() => {
      routeChange();
    }, 5000);
  }, []);
  // redirect function
  const history = useHistory();
  const routeChange = () =>{ 
    let path = `/buyer`; 
    history.push(path);
  }  
  return (
    <>
      <Header userStatus="buyer" />
      <h1 className='text-center'>Sorry, we could not process your request 😞</h1>
    </>
  );
}
