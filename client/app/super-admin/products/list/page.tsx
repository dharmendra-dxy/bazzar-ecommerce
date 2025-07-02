'use client';

import React, {useEffect, useRef} from "react";
import { useProductStore } from "@/store/useProduct.store";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import LoadingScreen from "@/components/common/LoadingScreen";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const SuperAdminProductListingPage = () => {

  const router = useRouter();
  const {products, fetchAllProductsForAdmin, deleteProduct, isLoding, error} = useProductStore();

  const productFetchRef = useRef(false);

  useEffect(()=>{
    if(!productFetchRef.current){
      fetchAllProductsForAdmin();
      productFetchRef.current= true;
    }
  },[fetchAllProductsForAdmin]);

  console.log("products: ", products);


  // handleDeleteProduct:
  const handleDeleteProduct = async (id: string) => {
    if(window.confirm('Are you confirm to delete the product ? ')){
      const result = await deleteProduct(id);
      if(result){
        fetchAllProductsForAdmin();
        toast.success("Product deleted successfully");
      }
      else{
        toast.error("Error occured while deleting product");
      }
    }
  }


  if(isLoding) return <LoadingScreen/>;

  return(
    <div className="p-6">
      <div className="flex flex-col gap-6">
        {/* Heading and Add Button */}
        <header className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">All Listed Products</h1>
          <Button type="button" onClick={()=> router.push(`/super-admin/products/add`)}> <PlusCircle/>  <span>Add New Product</span></Button>
        </header>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <Table>

              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {
                  products?.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-l bg-gray-100 overflow-hidden">
                            {
                              product.images[0] &&
                              <Image
                                src={product.images[0]}
                                alt="product-image"
                                width={60}
                                height={60}
                                className="h-full w-full object-cover"
                              />
                            }
                          </div>
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground">Sizes: {product.sizes.join(',')}</p>
                          </div>

                        </div>
                      </TableCell>
                      <TableCell>
                        <p> Rs. {product.price}</p>
                      </TableCell>
                      <TableCell>
                        <p> {product.stock} Items Left </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{product.category.toLocaleUpperCase()}</p>
                      </TableCell>

                      <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={()=> router.push(`/super-admin/products/add?id=${product.id}`)}
                              variant='ghost'
                              size='icon'
                            >
                              <Pencil className="h-4 w-4"/>
                            </Button>
                            <Button
                              onClick={()=>handleDeleteProduct(product.id)}
                              variant='ghost'
                              size='icon'
                            >
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </div>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>

            </Table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SuperAdminProductListingPage;
