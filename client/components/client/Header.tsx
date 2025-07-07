'use client';

import Link from "next/link";
import React from "react";
import { headerNavItems } from "@/constant/client/constant";
import { useRouter } from "next/navigation";
import { Menu, ShoppingCart, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useAuthStore } from "@/store/useAuth.store";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

const Header = () => {

    const router = useRouter();

    const {logout} = useAuthStore();


    // handleUserLogout:
    const handleUserLogout=async () => {
        await logout();
        router.push('/auth/login');
    }


  return(
    <header className="sticky top-0 z-50 shadow-sm ">
        <div className="container mx-auto px-4 bg-white">
            <div className="flex items-center justify-between h-16">
                <Link 
                href='/home'
                className="text-2xl font-semibold"
                >
                    Baazar
                </Link>
                
                {/* navLinks [only for lg] */}
                <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
                    <nav className="flex items-center space-x-8">
                        {
                            headerNavItems.map((nav) => (
                                <Link 
                                key={nav?.to}
                                href={nav?.to}
                                className="text-sm font-medium hover:text-gray-700"
                                >
                                    {nav?.title}
                                </Link>
                            ))
                        }
                    </nav>

                </div>

                {/* Icons: [only for lg] */}
                <div className="hidden lg:flex items-center space-x-4">
                    <button 
                    className="relative cursor-pointer"
                    onClick={()=> router.push('/cart')}
                    >
                        <ShoppingCart className="h-6 w-6"/>
                        <span className="absolute -top-1 -right-1 h-4 w-4 text-white bg-black text-xs rounded-full flex items-center justify-center">
                            1
                        </span>
                    </button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button>
                                <User className="h-6 w-6"/>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="p-2">
                            <DropdownMenuItem onClick={()=> router.push('/account')}>
                                Your Account
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleUserLogout}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>

                {/* For sm devices: */}
                <div className="lg:hidden ">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size={'icon'} variant={'ghost'}>
                                <Menu className="h-6 w-6"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                            <SheetHeader>Baazar</SheetHeader>


                        </SheetContent>
                    </Sheet>

                </div>

            </div>


        </div>
        
    </header>
  );
};

export default Header;
