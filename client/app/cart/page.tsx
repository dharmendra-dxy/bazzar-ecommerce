'use client';

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCartStore } from "@/store/useCart.store";
import Image from "next/image";
import React, { useEffect } from "react";

const CartPage = () => {

  const { fetchCart, items } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  console.log("items: ", items);

  return (
    <div className="min-h-screen container mx-auto p-8">
      <h1 className="text-xl font-semibold">
        Your Cart ({items.length})
      </h1>

      <Card className="w-full overflow-x-auto mt-10 p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item?.name}</TableCell>
                <TableCell>
                  <Image
                    src={item?.images}
                    alt={item?.name}
                    height={40}
                    width={40}
                    className="rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>{item?.color}</TableCell>
                <TableCell>{item?.sizes}</TableCell>
                <TableCell>{item?.quantity}</TableCell>
                <TableCell>{item?.price}</TableCell>
                <TableCell className="text-right">Delete</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>

    </div>
  );
};

export default CartPage;
