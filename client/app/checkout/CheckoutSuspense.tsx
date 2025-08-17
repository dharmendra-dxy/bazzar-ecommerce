import React, { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";

const CheckoutSkeleton = () => {
    return (
        <div>Skeleton</div>
    )
}

const CheckoutSuspense = () => {
  return(
    <Suspense fallback={<CheckoutSkeleton/>}>
        <CheckoutContent/>
    </Suspense>
  )
};

export default CheckoutSuspense;
