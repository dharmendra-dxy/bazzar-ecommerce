import ProductIdPageComponent from "@/components/client/ProductIdPageComponent";
import ProductIdSkeleton from "@/components/client/ProductIdSkeleton";
import React, { Suspense } from "react";

const ProductIdPage = ({params}: {params: {id: string}}) => {

  return (
    <Suspense fallback={<ProductIdSkeleton/>}>
      <ProductIdPageComponent id={params.id}/>
    </Suspense>
  );
};

export default ProductIdPage;
