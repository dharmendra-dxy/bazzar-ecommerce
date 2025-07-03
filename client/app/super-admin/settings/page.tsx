'use client'

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { ImageIcon, Send, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useSettingStore } from "@/store/useSetting.store";
import { useProductStore } from "@/store/useProduct.store";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


const SuperAdminSettingsPage = () => {

  const router = useRouter();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const { products, fetchAllProductsForAdmin, isLoding } = useProductStore();
  const {
    banners: featuredBanners,
    products: featuredProducts,
    isLoading: isLodingSetting,
    fetchFeaturedBanners,
    fetchFeaturedProducts,
    addFeaturedBanners,
    updateFeaturedProducts
  } = useSettingStore();


  const productFetchRef = useRef(false);

  useEffect(() => {
    if (!productFetchRef.current) {
      fetchAllProductsForAdmin();
      fetchFeaturedProducts();
      fetchFeaturedBanners();
      productFetchRef.current = true;
    }
  }, [fetchAllProductsForAdmin]);

  console.log("products: ", products);
  console.log("featuredBanners: ", featuredBanners);
  console.log("featuredProducts: ", featuredProducts);

  // handleImageUpload:
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      setUploadedFiles(Array.from(files));
    }
  }

  // handleRemoveSelectedImg:
  const handleRemoveSelectedImg = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, index) => index!==idx));
  }

  // handleFeaturedProductSelect:
  const handleFeaturedProductSelect = (productId: string) => {
    setSelectedProducts((prev) => {
      if(prev.includes(productId)){
        return prev.filter(id => id!== productId);
      }

      if(prev.length>8){
        toast.error("You can only select upto 8 featured products.");
        return prev;
      }
      return [...prev, productId];
    })

  }

  // handleSaveChanges:
  const handleSaveChanges = async () => {

    // for featured banner:
    if (uploadedFiles.length > 0) {
      const result = await addFeaturedBanners(uploadedFiles);
      if (result) {
        toast.success("Featured Banner added Succesfully");
        fetchFeaturedBanners();
        setUploadedFiles([]);
      }
      else {
        toast.success("Error while adding Featured banner");
      }
    }

    // for featured products:
    const result = await updateFeaturedProducts(selectedProducts);
    if(result){
      fetchFeaturedProducts();
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-6">
        {/* Heading and Add Button */}
        <header className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">Settings Page </h1>
        </header>

        <div className="space-y-6">

          {/* Featured Images Section: */}
          <div>
            <h2 className="text-xl font-bold">Featured Images</h2>
            <div className="flex items-center space-x-4 mt-4">
              <Label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full h-32 px-4 transition border-2 border-gray-400 border-dashed rounded-md appearance-none"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-7 w-7 text-gray-400" />
                  <span className="text-sm text-gray-500 font-semibold">
                    Click to upload Featured Images
                  </span>
                  <Input
                    name='image-upload'
                    type='file'
                    className=""
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </div>

              </Label>

            </div>

            {/* Selected Images: */}
            {
              uploadedFiles.length > 0 &&
              <div className="border shadow-md rounded-lg p-2 mt-4">
                <p className="text-gray-500 font-semibold">Selected Images</p>
                <div className="my-4 grid lg:grid-cols-4 gap-4">
                  {
                    uploadedFiles.map((file, index) => (
                      <div key={index+1} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`uploaded-image-${index+1}`}
                          className="w-full h-32 object-contain rounded-md"
                        />
                        <Button 
                          variant='destructive' 
                          size='icon' 
                          className="absolute top-2 right-2 hidden group-hover:flex"
                          onClick={()=>handleRemoveSelectedImg(index)}
                        >
                          <X className="size-4"/>
                        </Button>
                      </div>
                    ))
                  }
                </div>
              </div>
            }

            {/* display Featured Images: */}
            <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-6">
              {
                featuredBanners.map((banner, index) => (
                  <div key={banner.id} className="relative">
                    <img
                      src={banner.imageUrl}
                      alt={`bannerimage-${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                ))
              }
            </div>
          </div>


          {/* Featured Products Section: */}
          <div className="mt-16">
            <div>
              <h2 className="text-xl font-bold">Featured Products</h2>
              <p className="text-xs text-gray-500 font-semibold">Select upto 8 products to feature in client view</p>
            </div>
            {
              isLoding && <LoadingScreen />
            }
            <div className="grid grid-cols-1 md:grid-cols-3 lg:gird-cols-4 gap-4 mt-6">
              {
                products.map(product => (
                  <div 
                    key={product.id} 
                    className="relative"
                  >
                    <div className="absolute top-2 right-2">
                      <Checkbox checked={true} />
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                        {
                          product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-gray-500" />
                          )
                        }

                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">{product.category.toLocaleUpperCase()}</p>
                      <p className="text-sm text-gray-500 font-bold">Rs. {product.price.toFixed(2)}</p>
                    </div>

                  </div>
                ))
              }

            </div>


          </div>


          {/* Save button: */}
          <div className="mt-16">
            <Button
              type="submit"
              className="w-full"
              onClick={handleSaveChanges}
              disabled={isLoding || isLodingSetting}
            >
              {(isLoding || isLodingSetting) ? "Saving..." : "Save"} <Send className="size-4" />
            </Button>
          </div>

        </div>


      </div>

    </div>
  );
};

export default SuperAdminSettingsPage;
