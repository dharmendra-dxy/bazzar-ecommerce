'use client';

import Link from "next/link";
import React, { useState } from "react";
import { headerNavItems } from "@/constant/client/constant";
import { useRouter } from "next/navigation";
import { Menu, MoveLeft, ShoppingCart, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useAuthStore } from "@/store/useAuth.store";
import { Sheet, SheetContent, SheetHeader } from "../ui/sheet";

const Header = () => {

    const router = useRouter();
    const { logout } = useAuthStore();

    const [mobileView, setMobileView] = useState<"menu" | "account">("menu");
    const [showSheet, setShowSheet] = useState<boolean>(false);

    // handleUserLogout:
    const handleUserLogout = async () => {
        await logout();
        router.push('/auth/login');
    }

    const renderMobileHeader = () => {
        switch (mobileView) {
            case "account":
                return (
                    <div className="space-y-4 ml-4">
                        <div className="flex items-center">
                            <Button
                                variant={'ghost'}
                                size={'icon'}
                                onClick={() => setMobileView("menu")}
                            >
                                <MoveLeft /> Back
                            </Button>
                        </div>

                        <nav className="space-y-2">
                            <button
                                className="block w-full p-2 text-left"
                                onClick={() => {
                                    router.push('/account');
                                    setShowSheet(prev => !prev);
                                    setMobileView("menu");
                                }}
                            >
                                Your Account
                            </button>

                            <Button onClick={() => {
                                handleUserLogout();
                                setShowSheet(prev => !prev);
                                setMobileView("menu");
                            }}>
                                Logout
                            </Button>
                        </nav>
                    </div>
                )

            default:
                return (
                    <div className="space-y-6 py-6 mx-4">
                        <div className="space-y-3">
                            {
                                headerNavItems.map((nav) => (
                                    <button
                                        key={nav?.to}
                                        className="block text-left w-full p-2 font-semibold"
                                        onClick={() => {
                                            router.push(nav?.to);
                                            setShowSheet(prev => !prev);
                                        }}
                                    >
                                        {nav?.title}
                                    </button>
                                ))
                            }
                        </div>
                        <div>
                            <Button
                                variant='outline'
                                className="w-full justify-start"
                                onClick={() => setMobileView("account")}
                            >
                                <User className="mr-3 h-4 w-4" />
                                Account
                            </Button>
                        </div>
                        <div>
                            <Button
                                variant='outline'
                                className="w-full justify-start"
                                onClick={() => {
                                    router.push('/cart');
                                    setShowSheet(prev => !prev);
                                }}
                            >
                                <ShoppingCart className="mr-3 h-4 w-4" />
                                Cart (2)
                            </Button>
                        </div>

                    </div>
                )

        }
    }


    return (
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
                            onClick={() => router.push('/cart')}
                        >
                            <ShoppingCart className="h-6 w-6" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 text-white bg-black text-xs rounded-full flex items-center justify-center">
                                1
                            </span>
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button>
                                    <User className="h-6 w-6" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="p-2">
                                <DropdownMenuItem onClick={() => router.push('/account')}>
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
                        <Sheet
                            open={showSheet}
                            onOpenChange={() => {
                                setShowSheet(prev => !prev);
                                setMobileView("menu");
                            }
                            }
                        >
                            <Button
                                onClick={() => setShowSheet(prev => !prev)}
                                size={'icon'}
                                variant={'ghost'}
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                            <SheetContent side="left" className="w-64">
                                <SheetHeader>Baazar</SheetHeader>
                                {
                                    renderMobileHeader()
                                }

                            </SheetContent>
                        </Sheet>

                    </div>

                </div>


            </div>

        </header>
    );
};

export default Header;
