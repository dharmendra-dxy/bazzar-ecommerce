'use client';

import AddressFrom from "@/components/client/AddressFrom";
import AddressList from "@/components/client/AddressList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useAddressStore } from "@/store/useAddress";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { LoaderIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface AddressFormState {
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

const initialAddressFormState = {
  name: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
  phone: "",
  isDefault: false,
}

const AccountPage = () => {

  const {
    addresses,
    isLoading: addressLoading,
    error: addressError,
    fetchAllAddresses, createAddress, updateAddress, deleteAddress
  } = useAddressStore();

  const [showAddress, setShowAddress] = useState(false);
  const [editAddress, setEditAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormState>(initialAddressFormState);

  useEffect(() => {
    fetchAllAddresses();
  }, [fetchAllAddresses])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <h2 className="">Orders</h2>
          </TabsContent>

          <TabsContent value="address">
            <Card>
              <CardContent className="">
                <div className="flex justify-between items-center mb-6 border-b border-gray-400 pb-2">
                  <h2 className="text-xl font-semibold">Address</h2>
                  <Button
                    onClick={() => {
                      setEditAddress(null);
                      setFormData(initialAddressFormState);
                      setShowAddress(true);
                    }}
                  >
                    Add Address
                  </Button>
                </div>
                {
                  editAddress || addressLoading ? (
                    <div className="flex items-center justify-between">
                      <div className="animate-spin">
                        <LoaderIcon />
                      </div>
                    </div>) : showAddress ?
                    <AddressFrom
                      formData={formData}
                      setFormData={setFormData}
                      editAddress={editAddress}
                      setEditAddress={setEditAddress}
                      setShowAddress={setShowAddress}
                    /> : (
                      <AddressList
                        addresses={addresses}
                      />
                    )
                }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default AccountPage;
