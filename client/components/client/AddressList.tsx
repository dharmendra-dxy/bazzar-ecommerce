import { Address, useAddressStore } from "@/store/useAddress";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LocateFixed, MapPin, PhoneCall } from "lucide-react";
import { AddressFormState } from "@/app/account/page";
import { toast } from "sonner";

interface AddressListProps {
    addresses: Address[];
    formData: AddressFormState,
    setFormData: React.Dispatch<React.SetStateAction<AddressFormState>>;
    setEditAddress: React.Dispatch<React.SetStateAction<string | null>>;
    setShowAddress: React.Dispatch<React.SetStateAction<boolean>>
}

const AddressList = ({ addresses, formData, setFormData, setEditAddress, setShowAddress }: AddressListProps) => {

    const { deleteAddress } = useAddressStore();

    // handleEditAddress:
    const handleEditAddress = (address: Address) => {
        setFormData({
            name: address.name,
            address: address.address,
            city: address.city,
            country: address.country,
            postalCode: address.postalCode,
            phone: address.phone,
            isDefault: address.isDefault,
        });
        setEditAddress(address.id);
        setShowAddress(true);
    }

    // handleDeleteAddress:
    const handleDeleteAddress = async (id: string) => {

        const confirm = window.confirm("Are you sure to delete the address ?");

        if (confirm) {
            const result = await deleteAddress(id);
            if (result) {
                toast.success("Address Deleted succesfully");
            }
        }   
        return;
    }

    return (
        <div className="space-y-4">
            {
                addresses.map((address) => (
                    <Card key={address.id}>
                        <CardContent className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-6">
                                    <p className="font-medium">{address.name}</p>

                                    {
                                        address.isDefault &&
                                        <Badge variant={'secondary'} className="bg-green-300"> Default</Badge>
                                    }
                                </div>
                                <p className="flex gap-2 items-center font-medium text-neutral-500">
                                    <MapPin size={16} /> {address.address}
                                </p>
                                <p className="flex gap-2 items-center font-medium text-neutral-500">
                                    <LocateFixed size={16} /> {address.postalCode},{address.city}, {address.country}
                                </p>
                                <p className="flex gap-2 items-center">
                                    <PhoneCall size={16} /> {address.phone}
                                </p>

                            </div>
                            <div className="space-x-2">
                                <Button
                                    variant={'outline'}
                                    size={'sm'}
                                    onClick={() => handleEditAddress(address)}
                                    className="cursor-pointer"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant={'destructive'}
                                    size={'sm'}
                                    onClick={() => handleDeleteAddress(address.id)}
                                    className="cursor-pointer"
                                >
                                    Delete
                                </Button>
                            </div>
                        </CardContent>

                    </Card>
                ))
            }
        </div>
    );
};

export default AddressList;
