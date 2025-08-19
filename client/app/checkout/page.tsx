'use client';

import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import CheckoutSuspense from "./CheckoutSuspense";

const CheckoutPage = () => {

  const options = {
    clientId: "AQaYsqF8B8lshzGPo2bBFWMhOZROWuqp30ImB5gsrzWWNFELcc9UM3ontPZME-Rh2L4LFpwZrcTg2BJj",
  }

  return (
    <PayPalScriptProvider options={options}>
      <CheckoutSuspense/>
    </PayPalScriptProvider>
  )
  
};

export default CheckoutPage;
