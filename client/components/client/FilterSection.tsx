'use client';

import { brands, categories, colors, sizes } from "@/constant/super-admin/products";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";


interface FilterSectionProps {
    handleToggleFilter: (filterType: 'categories' | 'sizes' | 'brands' | 'colors', value: string) => void,
    selectedCategories: string[],
    selectedSizes: string[],
    selectedColors: string[],
    selectedBrands: string[],
    priceRange: number[],
    setPriceRange: any,
}

const FilterSection: React.FC<FilterSectionProps> = ({
    handleToggleFilter,
    selectedCategories,
    selectedSizes,
    selectedColors,
    selectedBrands,
    priceRange,
    setPriceRange
}) => {
    return (
        <div className=" space-y-6">
            <div>
                {/* Categories: */}
                <div>
                    <h3 className="mb-3 font-semibold">Categories</h3>
                    <div className="space-y-2">
                        {
                            categories.map((category) => (
                                <div
                                    key={category}
                                    className="flex items-center"
                                >
                                    <Checkbox
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onCheckedChange={() => handleToggleFilter('categories', category)}
                                    />
                                    <Label htmlFor={category} className="ml-2 text-xs cursor-pointer">
                                        {category}
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
                                        checked={selectedBrands.includes(brand)}
                                        onCheckedChange={() => handleToggleFilter('brands', brand)}
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
                                <Button
                                    key={size}
                                    size={'sm'}
                                    variant={selectedSizes.includes(size) ? 'default' : 'outline'}
                                    onClick={() => handleToggleFilter('sizes', size)}
                                >
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
                                    className={`w-6 h-6 rounded-full cursor-pointer ${color?.class} ${selectedColors.includes(color?.name) ? "ring-offset-2 ring-black ring-2" : ""}`}
                                    title={color?.name}
                                    onClick={() => handleToggleFilter('colors', color?.name)}
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
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value)}
                    />

                    <div className="flex justify-between mt-2 text-sm">
                        <span>Rs. {priceRange[0]}</span>
                        <span>Rs. {priceRange[1]}</span>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default FilterSection;
