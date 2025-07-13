'use client';

import { brands, categories, colors, sizes } from "@/constant/super-admin/products";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";

const FilterSection = () => {
    return (
        <div className=" space-y-6">
            <div>
                {/* Categories: */}
                <div>
                    <h3 className="mb-3 font-semibold">Categories</h3>
                    <div className="space-y-2">
                        {
                            categories.map((categorie) => (
                                <div
                                    key={categorie}
                                    className="flex items-center"
                                >
                                    <Checkbox
                                        id={categorie}
                                    />
                                    <Label htmlFor={categorie} className="ml-2 text-xs cursor-pointer">
                                        {categorie}
                                    </Label>

                                </div>
                            ))
                        }

                    </div>
                </div>

                {/* Brands: */}
                <div>
                    <h3 className="mb-3 font-semibold mt-6">Brands</h3>
                    <div className="space-y-2">
                        {
                            brands.map((brand) => (
                                <div
                                    key={brand}
                                    className="flex items-center"
                                >
                                    <Checkbox
                                        id={brand}
                                    />
                                    <Label htmlFor={brand} className="ml-2 text-xs cursor-pointer">
                                        {brand}
                                    </Label>

                                </div>
                            ))
                        }

                    </div>
                </div>


                {/* Size: */}
                <div>
                    <h3 className="mb-3 font-semibold mt-6">Size</h3>
                    <div className="flex flex-wrap gap-2">
                        {
                            sizes.map((size) => (
                                <Button key={size} variant={'outline'} size={'sm'}>
                                    {size}
                                </Button>
                            ))
                        }

                    </div>
                </div>

                {/* colors: */}
                <div>
                    <h3 className="mb-3 font-semibold mt-6">Colors </h3>
                    <div className="flex flex-wrap gap-2">
                        {
                            colors.map((color) => (
                                <button
                                    key={color?.name}
                                    className={`w-6 h-6 rounded-full ${color?.class}`}
                                    title={color?.name}
                                />
                            ))
                        }

                    </div>
                </div>

                {/* Price Range: */}
                <div>
                    <h3 className="mb-3 font-semibold mt-6">Price</h3>
                    <Slider
                        defaultValue={[0, 100000]}
                        max={100000}
                        step={1}
                        className="w-full"
                    />

                    <div className="flex justify-between mt-2 text-sm">
                        <span>Rs. 100</span>
                        <span>Rs. 2000</span>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default FilterSection;
