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
      limit:2,
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

  useEffect(()=> {
    fetchProducts();
  }, [currentPage, selectedCategories, selectedSizes, selectedBrands, selectedBrands,selectedColors,priceRange, sortBy, sortOrder]);

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
              isLoding && <LoadingScreen/>
            }
            {
              error && <div className="text-sm text-red-500 text-center">{error}</div>
            }
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {
                products.map((product) => (
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
                          product?.colors?.map((color, index) => (
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

          </div>

        </div>


      </div>

    </div>
  );
};

export default ProductsPage;
