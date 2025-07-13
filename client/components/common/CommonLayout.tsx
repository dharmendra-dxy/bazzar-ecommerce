'use client';

import React from "react";
import Header from "../client/Header";
import { usePathname } from "next/navigation";


const noHeadersPath = ['/auth', '/super-admin'];

const CommonLayout = ({children}: {children : React.ReactNode}) => {
  const path = usePathname();


  const showHeaders = !noHeadersPath.some((currentPath) => path.startsWith(currentPath));

  return (
    <div className="min-h-screen bg-white">
      { showHeaders && <Header/> }
      <main>
        {children}
      </main>
    </div>
  );
};

export default CommonLayout;
