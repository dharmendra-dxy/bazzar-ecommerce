import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProductIdSkeleton = () => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row gap-5 w-full container mx-auto p-8">
        <Skeleton className="w-[10%] h-32 hidden lg:block" />
        <Skeleton className="w-full lg:w-[50%] h-[400px] lg:h-screen" />
        <div className="flex flex-col gap-4 w-[40%]">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-1/2 h-8" />
          <Skeleton className="w-24 h-8" />
          <Skeleton className="w-24 h-8" />
          <Skeleton className="w-1/2 h-8" />
          <Skeleton className="w-full h-8" />
        </div>
      </div>
    </div>
  );
};

export default ProductIdSkeleton;
