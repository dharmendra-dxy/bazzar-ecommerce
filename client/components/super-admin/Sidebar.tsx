'use client';

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, CirclePlus, LogOut, Package, Settings, ShoppingBag, Tag, Tags } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuth.store";

interface SidebarProps {
    isOpen: boolean;
    toggle: () => void
}


const menuItems = [
    {
        name: 'Products',
        icon: Package,
        href: '/super-admin/products/list'
    },
    {
        name: 'Add new Products',
        icon: CirclePlus,
        href: '/super-admin/products/add'
    },
    {
        name: 'Orders',
        icon: ShoppingBag,
        href: '/super-admin/orders'
    },
    {
        name: 'Coupons',
        icon: Tag,
        href: '/super-admin/coupons/list'
    },
    {
        name: 'Create Coupons',
        icon: Tags,
        href: '/super-admin/coupons/add'
    },
    {
        name: 'Settings',
        icon: Settings,
        href: '/super-admin/settings'
    },
    {
        name: 'Logout',
        icon: LogOut,
        href: ''
    },
];

const SuperAdminSidebar = ({ isOpen, toggle }: SidebarProps) => {

    const router = useRouter();
    const {logout} = useAuthStore();

    const handleLogout = async () => {
        await logout();
        router.push('/auth/login');
    }

    return (
        <div className={cn('fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-300', isOpen ? "w-64" : "w-16", 'border-r')}>
            <div className="flex h-16 items-center justify-between px-4">

                <h1 className={cn('font-bold ', !isOpen && 'hidden')}>
                    Admin Panel
                </h1>
                <Button
                    variant='default'
                    size='icon'
                    className="ml-auto cursor-pointer"
                    onClick={toggle}
                >
                    {
                        isOpen ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />
                    }
                </Button>

            </div>
            <div className="space-y-4 py-4">
                {
                    menuItems.map(item=> 
                        <div 
                            key={item.name}
                            onClick={item.name==='Logout' ? handleLogout : ()=> router.push(item.href)}
                            className={cn('flex items-center cursor-pointer px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground w-full')}
                        >
                            <item.icon className="size-4"/>

                            <span
                            className={cn('ml-3', !isOpen && 'hidden')}
                            >
                                {item.name}
                            </span>

                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default SuperAdminSidebar;
