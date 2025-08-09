'use client';

import { useProductStore } from "@/store/useProduct.store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../common/LoadingScreen";
import { Button } from "../ui/button";
import { ShoppingBag } from "lucide-react";

const ProductIdPageComponent = ({ id }: { id: string }) => {

    const { getProduct, isLoding, error } = useProductStore();
    const router = useRouter();


    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        const fetchProductById = async () => {
            const response = await getProduct(id);
            if (response) setProduct(response);
            else router.push('/404');
        }

        fetchProductById();
    }, [id, getProduct, router])

    console.log("product: ", product);

    if (isLoding) return <LoadingScreen />

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
                                        className="border-2"
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
                                src={product.images[0]}
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
                                            className="h-6 w-6 rounded-full border-2"
                                            style={{ backgroundColor: color }}
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
                                                variant={'default'}
                                                size={'icon'}
                                                className=""
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
                                <Button variant='outline' size='icon'>-</Button>
                                <Button variant='default' size='icon'>1</Button>
                                <Button variant='outline' size='icon'>+</Button>
                            </div>
                        </div>

                        <div>
                            <Button variant='default' className="w-full">
                                Add To Cart <ShoppingBag />
                            </Button>

                        </div>

                    </div>

                </div>
                <div>

                </div>

            </div>

        </div>
    );
};

export default ProductIdPageComponent;
