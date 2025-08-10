'use client';

import { useProductStore } from "@/store/useProduct.store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../common/LoadingScreen";
import { Button } from "../ui/button";
import { ShoppingBag } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import ProductIdSkeleton from "./ProductIdSkeleton";
import { useCartStore } from "@/store/useCart.store";
import { toast } from "sonner";

const ProductIdPageComponent = ({ id }: { id: string }) => {

    const { getProduct, isLoding } = useProductStore();
    const {addToCart, isLoading: addToCartLoading} = useCartStore();
    const router = useRouter();

    const [product, setProduct] = useState<any>(null);

    const [selectedImg,setSelectedImg ] = useState<string | null>(null);
    const [selectedColor,setSelectedColor] = useState<number|null>(null);
    const [selectedSize,setSelectedSize] = useState<string|null>(null);
    const [quantity,setQuantity] = useState<number>(1);

    useEffect(() => {
        const fetchProductById = async () => {
            const response = await getProduct(id);
            if (response){
                setProduct(response);
                setSelectedImg(response.images[0]);
            }
            else router.push('/404');
        }

        fetchProductById();
    }, [id, getProduct, router]);

    // handleAddToCart:
    const handleAddToCart = async () => {
        if(product){
            const result = await addToCart({
                productId: product?.id,
                name: product?.name,
                price: product?.price,
                image: product?.images[0],
                color: product?.colors[selectedColor as number] ?? "white",
                size: selectedSize as string,
                quantity: quantity,
            });
            if(result) toast.success('Product is added to the cart');
            else toast.error("Some error occurred | Select all the fields");

            // clear states:
            setSelectedColor(null);
            setSelectedSize(null);
            setQuantity(1);
        }

    }


    if (isLoding) return <ProductIdSkeleton/>

    if (!product) return <div className="text-gray-600 font-semibold text-center mt-24">No Product Found</div>

    return (
        <div className="min-h-screen bg-white ">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 flex gap-4">

                        {/* Disaply all images in small sizes: */}
                        <div className="hidden lg:block flex-col gap-2 w-24">
                            {
                                product?.images?.map((image: string, index: number) => (
                                    <button
                                        key={index}
                                        className={` border-2 cursor-pointer ${selectedImg===image ? "border-gray-700" : "border-gray-300"}`}
                                        onClick={()=> setSelectedImg(image)}
                                    >
                                        <img
                                            src={image}
                                            alt={`Product-${index + 1}`}
                                            className="w-full aspect-square object-cover"
                                        />

                                    </button>
                                ))
                            }
                        </div>

                        {/* Display large image */}
                        <div className="flex-1 relative w-[200px]">
                            <img
                                src={selectedImg ?? product.images[0]}
                                alt={product.name}
                                className="w-full h-fit object-cover"
                            />
                        </div>
                    </div>

                    <div className="lg:w-1/3 space-y-6">
                        <div>
                            <h1 className="font-semibold text-3xl">
                                {product?.name}
                            </h1>
                            <p className="font-medium text-sm text-gray-600">
                                {product?.description}
                            </p>
                        </div>

                        <div className="font-bold text-2xl">
                            Rs. {product?.price.toFixed(2)}
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">Color</h3>
                            <div className="flex gap-2">
                                {
                                    product?.colors.map((color: string, index: number) => (
                                        <button
                                            key={index}
                                            className={`h-6 w-6 rounded-full border-2 ${selectedColor===index ? "border-gray-700": "border-gray-300"
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={()=> setSelectedColor(index)}
                                        />
                                    ))
                                }
                            </div>
                        </div>

                        {
                            product?.sizes.length > 0 &&
                            <div>
                                <h3 className="font-medium mb-2">Size</h3>
                                <div className="flex gap-2">
                                    {
                                        product?.sizes.map((size: string, index: number) => (
                                            size!=="" &&
                                            <Button
                                                key={index}
                                                variant={selectedSize===size ? "default" : "outline"}
                                                size={'icon'}
                                                onClick={()=> setSelectedSize(size)}
                                            >
                                                {size}
                                            </Button>
                                        ))
                                    }
                                </div>
                            </div>
                        }


                        <div>
                            <h3 className="font-medium mb-2">
                                Quantity
                            </h3>
                            <div className="flex gap-2">
                                <Button variant='outline' size='icon' onClick={()=>setQuantity((prev) => prev>1 ? prev-1 : 1)}>-</Button>
                                <Button variant='default' size='icon'>{quantity}</Button>
                                <Button variant='outline' size='icon' onClick={()=>setQuantity((prev) => prev+1)}>+</Button>
                            </div>
                        </div>

                        <div>
                            <Button 
                            variant='default' 
                            className="w-full" 
                            onClick={handleAddToCart}
                            disabled={addToCartLoading}
                            >
                                {
                                    addToCartLoading ? "Adding..." :" Add To Cart" 
                                }
                                <ShoppingBag />
                            </Button>

                        </div>

                    </div>

                </div>
                <div className="mt-16">
                    <Tabs defaultValue="details">
                        <TabsList className="w-full justify-start border-b mb-6">
                            <TabsTrigger value="details">Product Description</TabsTrigger>
                            <TabsTrigger value="reviews">Product Reviews</TabsTrigger>
                            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details">
                            <p className="text-gray-700 mb-4">
                                {product.description}
                            </p>
                        </TabsContent>
                        <TabsContent value="reviews">2</TabsContent>
                        <TabsContent value="shipping">
                            <p className="text-gray-700 mb-4">
                                Shipping and returns information goes here. Please read the info before making any purchases.
                            </p>
                        </TabsContent>
                    </Tabs>

                </div>
            </div>

        </div>
    );
};

export default ProductIdPageComponent;
