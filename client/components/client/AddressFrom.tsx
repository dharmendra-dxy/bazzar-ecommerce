import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useAddressStore } from "@/store/useAddress";
import { toast } from "sonner";
import { AddressFormState } from "@/app/account/page";

interface AddressFromProps {
    formData: AddressFormState,
    setFormData: React.Dispatch<React.SetStateAction<AddressFormState>>;
    editAddress: string | null;
    setEditAddress: React.Dispatch<React.SetStateAction<string | null>>
    setShowAddress: React.Dispatch<React.SetStateAction<boolean>>
}

const AddressFrom = ({
    formData,
    setFormData,
    editAddress,
    setEditAddress,
    setShowAddress,
}: AddressFromProps) => {

    const { updateAddress, createAddress, fetchAllAddresses } = useAddressStore();

    // handleSubmitAddress
    const handleSubmitAddress = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editAddress) {
                const response = await updateAddress(editAddress, formData);
                if (response) {
                    setEditAddress(null);
                    setShowAddress(false);
                    toast.success("Address updated succesfully");
                    fetchAllAddresses();
                }
            }
            else {
                const response = await createAddress(formData);
                if (response) {
                    setShowAddress(false);
                    toast.success("Address created succesfully");
                    fetchAllAddresses();
                }
            }
        }
        catch (err) {
            toast.error("Address created succesfully");
        }
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmitAddress}>
            {/* name */}
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    required
                    placeholder="Enter Your Name"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            {/* Address */}
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    value={formData.address}
                    required
                    placeholder="Enter Your address"
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
            </div>

            {/* City */}
            <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                    id="city"
                    value={formData.city}
                    required
                    placeholder="Enter Your city"
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
            </div>

            {/* County */}
            <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                    id="country"
                    value={formData.country}
                    required
                    placeholder="Enter Your country"
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
            </div>

            {/* PostalCode */}
            <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                    id="address"
                    value={formData.postalCode}
                    required
                    placeholder="Enter Your postal code"
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    value={formData.phone}
                    required
                    placeholder="Enter Your phone"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>

            {/* isDefault */}
            <div className="flex gap-2">
                <Checkbox
                    id="default"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
                />
                <Label htmlFor="default">Set as default address ?</Label>
            </div>

            <div className="space-x-6 text-center">
                <Button
                    type="submit"
                    className="cursor-pointer"
                >
                    {editAddress ? "Update" : "Add"} Address <Send />
                </Button>
                <Button
                    variant='outline'
                    type="button"
                    onClick={() => {
                        setShowAddress(false);
                        setEditAddress(null);
                    }}
                    className="cursor-pointer"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}

export default AddressFrom;
