'use client'

import { protectProductFormAction } from "@/actions/products.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { brands, categories, colors, sizes, } from "@/constant/super-admin/addProducts";
import { useProductStore } from "@/store/useProduct.store";
import { Plus, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";

interface FormState {
  name: string,
  brand: string,
  description: string,
  category: string,
  gender: string,
  price: string,
  stock: string,
}


const SuperAdminProductAddingPage = () => {

  const router = useRouter();
  const { createProduct, updateProduct, getProduct, isLoding, error } = useProductStore();

  const [formState, setFormState] = useState({
    name: '',
    brand: '',
    description: '',
    category: '',
    gender: '',
    price: '',
    stock: '',
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // For EDIT PRODUCT:
  // check params for id : if id-> add page ,  else: update/edit page
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditMode = editId ? true : false;

  useEffect(() => {
    if (isEditMode) {
      getProduct(editId as string).then(product => {
        if (product) {
          setFormState({
            name: product.name,
            brand: product.brand,
            description: product.description,
            category: product.category,
            gender: product.gender,
            price: `${product.price}`,
            stock: `${product.stock}`,
          })
          setSelectedSizes(product.sizes);
          setSelectedColors(product.colors);
        }
      })
    }
  }, [isEditMode, getProduct, editId]);



  // handleInputChange
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => (
      {
        ...prev,
        [e.target.name]: e.target.value,
      }
    ))
  }

  // handleSelectChange:
  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => (
      {
        ...prev,
        [name]: value,
      }
    ))
  }

  // handleToggleSize:
  const handleToggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? (prev.filter(s => s !== size)) : ([...prev, size]));
  }

  // handleToggleColor:
  const handleToggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? (prev.filter(c => c !== color)) : ([...prev, color]));
  }

  // handleFileChange:
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };


  // handleFormSubmit:
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // handle first level of validation by -> arcjet:
    const checkFirstValidation = await protectProductFormAction();
    if (!checkFirstValidation.success) {
      toast.error(checkFirstValidation?.error);
      return;
    }

    // formData and api calling:
    const formData = new FormData();

    Object.entries(formState).forEach(([Key, value]) => (
      formData.append(Key, value)
    ));

    formData.append('sizes', selectedSizes.join(','));
    formData.append('colors', selectedColors.join(','));

    // append images only while creating
    if (!isEditMode) {
      selectedFiles.forEach(file => (
        formData.append('images', file)
      ));
    }

    // call create/ update API
    const response = isEditMode ? await updateProduct(editId as string, formData) : await createProduct(formData);
    if (response) {
      router.push('/super-admin/products/list');
      toast.success(`Product ${isEditMode ? "Updated" : "Created"} Successfully`);
    }
    else {
      toast.error("Process Failed");
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">{isEditMode ? "Edit" : "Add"} Product</h1>
        </header>

        <form
          onSubmit={handleFormSubmit}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"
        >

          {/* Image upload */}
          {
            isEditMode ? null : (
              <div className="mt-2 w-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-400 p-12">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <Label>
                      <span>Click to browse Images</span>
                      <input
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileChange}
                      />
                    </Label>
                  </div>
                </div>
                {
                  selectedFiles.length > 0 &&
                  <div className="mt-4 flex flex-wrap gap-2">
                    {
                      selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview-${index + 1}`}
                            width={80}
                            height={80}
                            className="h-20 w-20 object-cover rounded-md"
                          />
                        </div>
                      ))
                    }

                  </div>
                }
              </div>
            )
          }


          <div className="space-y-4">
            {/* Pruduct */}
            <div>
              <Label>
                Product Name
              </Label>
              <Input
                name='name'
                placeholder="Enter product name"
                className="mt-1.5"
                value={formState.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Brand */}
            <div className="w-full">
              <Label>
                Brand Name
              </Label>
              <Select
                name='brand'
                value={formState.brand}
                onValueChange={(value) => handleSelectChange('brand', value)}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder='Select Brand' />
                </SelectTrigger>
                <SelectContent>
                  {
                    brands.map(item =>
                      <SelectItem key={item} value={item.toLowerCase()}>{item}</SelectItem>
                    )
                  }
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label>
                Product Description
              </Label>
              <Textarea
                name="description"
                className="mt-1.5 min-h-[150px]"
                placeholder="Enter Product Description"
                value={formState.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Categories */}
            <div className="w-full">
              <Label>
                Category
              </Label>
              <Select
                name='category'
                value={formState.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder='Select Category' />
                </SelectTrigger>
                <SelectContent>
                  {
                    categories.map(item =>
                      <SelectItem key={item} value={item.toLowerCase()}>{item}</SelectItem>
                    )
                  }
                </SelectContent>
              </Select>
            </div>

            {/* Gender */}
            <div className="w-full">
              <Label>
                Gender
              </Label>
              <Select
                name='gender'
                value={formState.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder='Select Gender' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'men'}>Men</SelectItem>
                  <SelectItem value={'women'}>Women</SelectItem>
                  <SelectItem value={'kids'}>Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>


            {/* Sizes */}
            <div className="w-full">
              <Label>
                Size
              </Label>
              <div className="mt-1.5 flex flex-wrap gap-2 ">
                {
                  sizes.map(item => (
                    <Button
                      key={item}
                      type="button"
                      size='sm'
                      variant={selectedSizes.includes(item) ? "default" : "outline"}
                      onClick={() => handleToggleSize(item)}
                      className="cursor-pointer"
                    >
                      {item}
                    </Button>
                  ))
                }
              </div>
            </div>

            {/* Colors */}
            <div className="w-full">
              <Label>
                Colors
              </Label>
              <div className="mt-1.5 flex flex-wrap gap-2 ">
                {
                  colors.map(item => (
                    <Button
                      key={item.name}
                      type="button"
                      className={`h-8 w-8 rounded-full cursor-pointer hover:${item.class} ${item.class} ${selectedColors.includes(item.name) ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      onClick={() => handleToggleColor(item.name)}
                    >
                    </Button>
                  ))
                }
              </div>
            </div>

            {/* Price */}
            <div>
              <Label>
                Product Price
              </Label>
              <Input
                name='price'
                placeholder="Enter product price"
                className="mt-1.5"
                value={formState.price}
                onChange={handleInputChange}
              />
            </div>

            {/* Stock */}
            <div>
              <Label>
                Product Stock
              </Label>
              <Input
                name='stock'
                placeholder="Enter product stock"
                className="mt-1.5"
                value={formState.stock}
                onChange={handleInputChange}
              />
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full mt-8"
              disabled={isLoding}
            >
              {isEditMode ? "Update" : "Create"}<Plus className="mt-1" />

            </Button>

          </div>
        </form>


      </div>

    </div>

  );
};

export default SuperAdminProductAddingPage;
