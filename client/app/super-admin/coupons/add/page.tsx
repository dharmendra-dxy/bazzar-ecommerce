'use client';
import { protectCouponFormAction } from "@/actions/coupons.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCouponStore } from "@/store/useCoupon.store";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

const SuperAdminCouponAddingPage = () => {

  const router = useRouter();
  const { createCoupon, isLoading } = useCouponStore();

  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: 0,
    startDate: '',
    endDate: '',
    usageLimit: 0,
  });

  // handleInputChange:
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => (
      {
        ...prev,
        [e.target.name]: e.target.value,
      }
    ))
  }

  // handleGenerateCouponCode:
  const handleGenerateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i <= 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData(prev => (
      {
        ...prev,
        code,
      }
    ))
  }


  // handleFormSubmit:
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // handle first level of validation by -> arcjet:
    const checkFirstValidation = await protectCouponFormAction();
    if (!checkFirstValidation.success) {
      toast.error(checkFirstValidation?.error);
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error("End date must be after Start date");
      return;
    }

    const couponPayload = {
      ...formData,
      discountPercent: parseFloat(formData.discountPercentage.toString()),
      usageLimit: parseInt(formData.usageLimit.toString()),
    }

    const result = await createCoupon(couponPayload);
    if (result) {
      toast.success("Coupon created Succesfully");
      router.push('/super-admin/coupons/list')
    }
    else {
      toast.error("Error in creating coupons");
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        {/* Heading: */}
        <header className="flex items-center justify-between">
          <h1 className="font-bold text-2xl"> Create New Coupon</h1>
        </header>

        {/* FORM: */}
        <form
          onSubmit={handleFormSubmit}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"
        >
          <div className="space-y-4 flex flex-col gap-3">
            {/* Code */}
            <div>
              <Label>
                Coupon Code
              </Label>
              <div className="flex items-center justify-between gap-4">
                <Input
                  type="text"
                  name='code'
                  placeholder="Enter Coupon Code"
                  className="mt-1.5"
                  value={formData.code}
                  onChange={handleInputChange}
                />
                <Button type="button" variant='ghost' onClick={handleGenerateCouponCode}>
                  Generate Code
                </Button>
              </div>
            </div>

            {/* Satrt Date */}
            <div>
              <Label>
                Start Date
              </Label>
              <Input
                name='startDate'
                type="date"
                placeholder="Enter start date"
                className="mt-1.5"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>

            {/* End Date */}
            <div>
              <Label>
                End Date
              </Label>
              <Input
                name='endDate'
                type="date"
                placeholder="Enter end date"
                className="mt-1.5"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>

            {/* Discount percentage */}
            <div>
              <Label>
                Discount percentage
              </Label>
              <Input
                type="number"
                name='discountPercentage'
                placeholder="Enter discount percentage"
                className="mt-1.5"
                value={formData.discountPercentage}
                onChange={handleInputChange}
              />
            </div>

            {/* Code */}
            <div>
              <Label>
                Usage Limit
              </Label>
              <Input
                type="number"
                name='usageLimit'
                placeholder="Enter Coupon Usage Limit"
                className="mt-1.5"
                value={formData.usageLimit}
                onChange={handleInputChange}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"} <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>

      </div >
    </div >
  );
};

export default SuperAdminCouponAddingPage;
