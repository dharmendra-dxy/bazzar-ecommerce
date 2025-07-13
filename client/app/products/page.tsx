'use client';

import FilterSection from "@/components/client/FilterSection";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListFilter } from "lucide-react";
import React from "react";

const ProductsPage = () => {


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

          
          <div className="flex items-center gap-4">
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
                <FilterSection/>
                </div>
              </DialogContent>

            </Dialog>

            <Select
              name='sort'
              // value={formState.brand}
              // onValueChange={(value) => handleSelectChange('brand', value)}
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Sort by: Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>


        <div className="flex gap-8 ">
          {/* Desktop filter: */}
          <div className="hidden lg:block w-64 shrink-0 ">
            <FilterSection/>
          </div>

        </div>


      </div>


    </div>
  );
};

export default ProductsPage;
