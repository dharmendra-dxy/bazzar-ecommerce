import React from "react";
import { Button } from "../ui/button";
import { MoveRight } from "lucide-react";
import { Product } from "@/store/useProduct.store";

interface ProductCardProps {
    products: Product[]
}

const ProductCard: React.FC<ProductCardProps> = ({products}) => {
  return(
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {
                products.map((product:any) => (
                  <div
                  key={product?.id}
                  className="group shadow-md p-2 rounded-md bg-gray-100/50"
                  >
                    <div className="relative aspect-[3/4] mb-4 bg-gray-100 overflow-hidden">
                      <img
                      src={product?.images[0]}      
                      alt={product?.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 "
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          className="bg-white text-black hover:bg-gray-100"
                        >
                          Quick View <MoveRight className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold">{product?.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold">
                        Rs. {product?.price.toFixed(2)}
                      </span>
                      <div className="flex gap-1 flex-wrap">
                        { product?.colors.length>0 &&
                          product?.colors?.map((color:any, index:number) => (
                          <div 
                          key={index} 
                          className={`w-4 h-4 rounded-full border`} 
                          style={{backgroundColor: color}}
                          />

                          ))
                        }
                      </div>
                    </div>
                  </div>
                ))
              }

            </div>
  );
};

export default ProductCard;
