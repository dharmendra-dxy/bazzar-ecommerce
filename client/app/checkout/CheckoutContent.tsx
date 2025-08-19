import React, { useEffect, useState } from "react";
import { useAddressStore } from "@/store/useAddress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Input } from "@/components/ui/input";
import { CartItem, useCartStore } from "@/store/useCart.store";
import { useProductStore } from "@/store/useProduct.store";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Coupon, useCouponStore } from "@/store/useCoupon.store";
import { paymentAction } from "@/actions/payment.action";
import { toast } from "sonner";

const CheckoutContent = () => {

  const router = useRouter();

  const { isLoading: addressLoading, addresses, fetchAllAddresses } = useAddressStore();
  const { isLoading: cartLoading, items: cartItem, fetchCart, clearCart } = useCartStore();
  const { isLoding: productLoading, getProduct } = useProductStore();
  const { isLoading: couponLoading, coupons, fetchCoupon } = useCouponStore();

  const [selectedAddress, setSelectedAddress] = useState("");
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");

  const [cartItemsDetails, setCartItemsDetails] = useState<(CartItem & { product: any })[]>([]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllAddresses();
    fetchCart();
    fetchCoupon();
  }, [fetchAllAddresses, fetchCart, fetchCoupon]);

  // to automatically get default address:
  useEffect(() => {
    const isDefaultAddress = addresses.find(address => address.isDefault);
    if (isDefaultAddress) {
      setSelectedAddress(isDefaultAddress?.id);
    }
  }, [addresses])

  useEffect(() => {

    const fetchSingleProduct = async () => {
      const itemsDetails = await Promise.all(
        cartItem.map(async (item) => {
          const product = await getProduct(item.productId);
          return { ...item, product }
        })
      )

      setCartItemsDetails(itemsDetails);
    }

    fetchSingleProduct();

  }, [cartItem, getProduct]);


  // handleApplyCoupon:
  const handleApplyCoupon = () => {
    const getCurrentCoupon = coupons.find((coupon) => coupon.code == couponCode);
    if(!getCurrentCoupon){
      setCouponError("Invalid Coupon code");
      setAppliedCoupon(null);
      return;
    }

    const now =  new Date();

    if(now< new Date(getCurrentCoupon.startDate) || now > new Date(getCurrentCoupon.endDate)){
      setCouponError("Coupon code Expired");
      setAppliedCoupon(null);
      return;
    }

    if(getCurrentCoupon.usageCount >= getCurrentCoupon.usageLimit){
      setCouponError("Coupon code usage exceed the limit");
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(getCurrentCoupon);
    setCouponError(null);
  }

  // handlePrePaymentFlow:
  const handlePrePaymentFlow = async() => {
    const result = await paymentAction(checkoutEmail);
    if(!result.success){
      toast.error(result.error);
      return;
    }

    setShowPaymentFlow(true);
  }

  const subTotal = cartItemsDetails.reduce((acc, item) => acc + Number(item.product?.price || 0) * item.quantity, 0);
  const discountAmount = appliedCoupon ? (subTotal * appliedCoupon?.discountPercent) / 100 : 0;
  const total = subTotal - discountAmount;
  
  return (
    <div className="min-h-screen p-2 md:p-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
                <CardDescription>
                  Check you delivery details from below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {addressLoading &&
                  <div className="animate-spin">
                    <Loader2 size={14} />
                  </div>
                }
                {
                  addresses.map((address) => (
                    <div key={address.id}
                      className="flex items-center space-x-4"
                    >
                      <Checkbox
                        id={address.id}
                        checked={selectedAddress === address.id}
                        onCheckedChange={() => setSelectedAddress(address.id)}
                      />
                      <Label className="flex-grow">
                        <div className="flex gap-4">
                          <span className="font-medium text-neutral-700">{address.name}</span>
                          {
                            address.isDefault && <Badge className="bg-green-300">Default</Badge>
                          }
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">
                            {address.address}, {address.city}, {address.country}
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))
                }
                <Button
                  onClick={() => router.push('/account')}
                  className="cursor-pointer"
                >
                  Add a new Address
                </Button>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>
                {showPaymentFlow ? "All transactions are secure and encrypted." : "Enter details to get started"}

              </CardDescription>
            </CardHeader>
            <CardContent>
              {
                showPaymentFlow ? (
                  <div>
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        color: "black",
                        shape: "rect",
                        label: "pay",
                      }}
                      fundingSource="card"

                    />
                  </div>
                ) : (
                  <div>
                    <div className="gap-2 flex flex-col items-center">
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        className="w-full"
                        value={checkoutEmail}
                        onChange={(e) => setCheckoutEmail(e.target.value)}
                      />
                      <Button
                        type="button"
                        className="w-full"
                        onClick={handlePrePaymentFlow}
                      >
                        Procced to Pay
                      </Button>

                    </div>
                  </div>
                )
              }
            </CardContent>
          </Card>
        </div>

        {/* order summary */}
        <div className="lg:col-span-1 mt-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Check and confirm your order from the list of items selected by you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {
                cartLoading &&
                <div className="animate-spin">
                  <Loader2 size={16} className="text-black" />
                </div>
              }
              {
                cartItemsDetails.map((item) => (
                  <div key={item.id}
                    className="flex items-center space-x-4"
                  >
                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                      <Image
                        src={item?.product?.images[0]}
                        alt={item?.product?.name}
                        width={60}
                        height={60}
                        className="object-contain rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item?.product?.name} / <span className="text-neutral-500 text-xs">
                        {item?.sizes}</span></p>
                      <p className="text-xs text-neutral-500 font-medium">
                        Qnt <span className="text-neutral-700"> {item?.quantity} </span>
                      </p>
                      <p className="text-xs text-neutral-500 font-medium">
                        Rs. <span className="text-neutral-700"> {Number(item?.quantity) * Number(item?.price)} </span>
                      </p>
                    </div>

                  </div>
                ))
              }
              <Separator />
              <div className="space-y-2 my-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code or Gift Code"
                    onChange={(e) => setCouponCode(e.target.value)}
                    value={couponCode}
                  />
                  <Button
                    variant={"default"}
                    className="w-fit"
                    onClick={handleApplyCoupon}
                  >
                    Apply Code
                  </Button>
                </div>
                {
                  appliedCoupon && <p className="text-green-600 text-sm font-normal">
                    Coupon Code applied succesfully
                  </p>
                }
                {
                  couponError && <p className="text-red-400 text-base font-semibold">
                    {couponError}
                  </p>
                }
              </div>
              <Separator />
              <div className="space-y-2 my-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {subTotal.toFixed(2)}</span>
                </div>
                {
                  appliedCoupon && <div className="flex justify-between text-green-500 font-semibold">
                    <span>Discount - {appliedCoupon?.discountPercent}%</span>
                    <span>Rs. {discountAmount.toFixed(2)}</span>
                  </div>
                }
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
