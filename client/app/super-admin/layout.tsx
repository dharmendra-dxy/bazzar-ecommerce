'use client';

import SuperAdminSidebar from "@/components/super-admin/Sidebar";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {

    const [isSidebarOpen,setIsSidebarOpen] = useState<boolean>(true);



    return (
        <div className="min-h-screen bg-background">
            <SuperAdminSidebar 
                isOpen={isSidebarOpen}
                toggle={()=> setIsSidebarOpen((prev) => (!prev))}
            />
            <div className={cn('trasition-all duration-300', isSidebarOpen ? 'ml-64' : 'ml-16', 'min-h-screen')}>
                {children}
            </div>

        </div>
    );
};

export default SuperAdminLayout;
