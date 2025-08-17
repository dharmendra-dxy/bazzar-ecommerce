'use client';

import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import CheckoutSuspense from "./CheckoutSuspense";

const CheckoutPage = () => {

  const options = {
    clientId: "",
  }

  return (
    <PayPalScriptProvider options={options}>
      <CheckoutSuspense/>
    </PayPalScriptProvider>
  )
  
};

export default CheckoutPage;
