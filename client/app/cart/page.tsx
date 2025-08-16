'use client';

import LoadingScreen from "@/components/common/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuthStore } from "@/store/useAuth.store";
import { useCartStore } from "@/store/useCart.store";
import { Minus, MoveRight, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CartPage = () => {

  const router = useRouter();
  const { user } = useAuthStore();
  const { fetchCart, items, isLoading, updateCartQuantity, removeFromCart } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalPrice = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleUpdateQuantity = async (id: string, newQnt: number) => {
    newQnt = Math.max(1, newQnt); // to make sure it min value in 1.
    setIsUpdating(true);
    await updateCartQuantity(id, newQnt);
    setIsUpdating(false);
  }

  const handleRemoveItem = async (id: string) => {
    await removeFromCart(id);
  }

  if (isLoading) return <LoadingScreen />

  return (
    <div className="min-h-screen container mx-auto p-8">
      <h1 className="text-xl font-semibold">
        Your Cart ({items.length})
      </h1>

      {/* Display Table here: */}
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
              <TableHead>Total Price</TableHead>
              <TableHead>Action</TableHead>
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
                <TableCell className="flex items-center gap-2">
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={isUpdating}
                  >
                    <Minus size={12} />
                  </Button>
                  <Button
                    variant='default'
                    size='icon'
                  >
                    {item?.quantity}
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={isUpdating}
                  >
                    <Plus size={12} />
                  </Button>
                </TableCell>
                <TableCell className="font-semibold">Rs. {item?.price}</TableCell>
                <TableCell className="font-semibold">Rs. {(Number(item?.price) * Number(item?.quantity)).toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant={'default'}
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 size={12} /> Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">R.S. {totalPrice}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>

      <div className="flex flex-col md:flex-row gap-6 mt-8 text-center justify-center">
        <Button
          variant='outline'
          onClick={() => router.push('/checkout')}
        >
          Procced to Checkout <MoveRight />
        </Button>
        <Button
          variant='outline'
          onClick={() => router.push('/products')}
        >
          Continue Shopping <MoveRight />
        </Button>

      </div>


    </div>
  );
};

export default CartPage;
