'use client';

import FilterSection from "@/components/client/FilterSection";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ListFilter, MoveRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/store/useProduct.store";
import LoadingScreen from "@/components/common/LoadingScreen";
import ProductCard from "@/components/client/ProductCard";

const ProductsPage = () => {

  // filters state:
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const router = useRouter();

  const {
    products,
    isLoding,
    error,
    currentPage,
    totalCount,
    totalPages,
    fetchFilteredProducts,
    setCurrentPage,
  } = useProductStore();

  // fetch filtered products:
  const fetchProducts = () => {
    fetchFilteredProducts({
      page: currentPage,
      limit: 2,
      categories: selectedCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      brands: selectedBrands,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy: sortBy,
      sortOrder: sortOrder,
    })
  }

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategories, selectedSizes, selectedBrands, selectedBrands, selectedColors, priceRange, sortBy, sortOrder]);

  console.log("products:", products);


  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as 'asc' | 'desc');
  }

  const handleToggleFilter = (filterType: 'categories' | 'sizes' | 'brands' | 'colors', value: string) => {
    const setterMap = {
      categories: setSelectedCategories,
      sizes: setSelectedSizes,
      colors: setSelectedColors,
      brands: setSelectedBrands,
    }

    setterMap[filterType]((prev) => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Image and text */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
          alt="Listing Page Banner"
          className="w-full object-cover h-full"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-semibold">Special Collection</h1>
            <p className="text-sm mt-4">Discover from our special Collection</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">
            All Products
          </h2>


          <div className=" flex items-center gap-4">
            {/* Mobile filter */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={'outline'}
                  className="lg:hidden"
                >
                  Filter <ListFilter className="h-4 w-4 mr-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[400px]">
                <DialogTitle className="text-sm border-b border-gray-300">
                  Product Filter
                </DialogTitle>

                <div className="max-h-[500px] overflow-y-auto">
                  <FilterSection
                    handleToggleFilter={handleToggleFilter}
                    selectedCategories={selectedCategories}
                    selectedSizes={selectedSizes}
                    selectedColors={selectedColors}
                    selectedBrands={selectedBrands}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                  />
                </div>
              </DialogContent>
            </Dialog>

            <Select
              name='sort'
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => handleSortChange(value)}
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="createdAt-asc">Newest First</SelectItem>
                <SelectItem value="createdAt-desc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>


        <div className="flex gap-8 ">
          {/* Desktop filter: */}
          <div className="hidden lg:block w-64 shrink-0 ">
            <FilterSection
              handleToggleFilter={handleToggleFilter}
              selectedCategories={selectedCategories}
              selectedSizes={selectedSizes}
              selectedColors={selectedColors}
              selectedBrands={selectedBrands}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {
              isLoding && <LoadingScreen />
            }
            {
              error && <div className="text-sm text-red-500 text-center">{error}</div>
            }

            {
              products.length > 0 ? (
                <ProductCard
                  products={products}
                />
              ): (
                <div className="text-sm text-gray-400 font-semibold text-center">
                  No Products Found.
                </div>
              )
            }
          </div>

          {/* Pagination: */}
          

        </div>


      </div>

    </div>
  );
};

export default ProductsPage;
