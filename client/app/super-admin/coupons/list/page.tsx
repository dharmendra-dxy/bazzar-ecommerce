'use client';

import React, { useEffect, useRef } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableCell, TableHead, TableRow, TableBody } from "@/components/ui/table";
import { useCouponStore } from "@/store/useCoupon.store";
import {  PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const SuperAdminCouponsPage = () => {

  const router = useRouter();

  const { coupons, fetchCoupon, deleteCoupon, isLoading } = useCouponStore();

  const couponFetchRef = useRef(false);

  useEffect(() => {
    if (!couponFetchRef.current) {
      fetchCoupon();
      couponFetchRef.current = true;
    }
  }, [fetchCoupon])

  // handleDeleteCoupon:
  const handleDeleteCoupon = async (id: string) => {
    if(window.confirm('Are you confirm to delete the coupon? ')){
      const result = await deleteCoupon(id);
      if(result){
        toast.success("Coupon deleted successfully");
        fetchCoupon();
      }
      else{
        toast.error("Error occured while deleting Coupons");
      }
    }
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-6">

        {/* Heading and Add Button */}
        <header className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">All Listed Products</h1>
          <Button type="button" onClick={() => router.push(`/super-admin/coupons/add`)}> <PlusCircle />  <span>Add Coupon</span></Button>
        </header>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coupon Code</TableHead>
                  <TableHead>Discount %</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {
                  coupons?.map(coupon => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <p className="font-semibold">{coupon.code}</p>
                      </TableCell>
                      <TableCell>
                        <p>{coupon.discountPercent} %</p>
                      </TableCell>
                      <TableCell>
                        <p> {coupon.usageCount}/{coupon.usageLimit} </p>
                      </TableCell>
                      <TableCell>
                        <p> {format(new Date(coupon.startDate), 'dd MMM yyyy')} </p>
                      </TableCell>
                      <TableCell>
                        <p> {format(new Date(coupon.endDate), 'dd MMM yyyy')} </p>
                      </TableCell>
                      <TableCell>
                        <Badge>
                          {new Date(coupon.endDate) > new Date() ? "Active" : "Expired"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                          <Button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            variant='ghost'
                            size='icon'
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

export default SuperAdminCouponsPage;
