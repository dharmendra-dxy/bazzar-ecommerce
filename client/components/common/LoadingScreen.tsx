import { Loader } from "lucide-react";
import React from "react";

const LoadingScreen = () => {
  return <div className="h-screen w-full flex items-center justify-center">
      <Loader className="h-12 w-12 text-gray-700"/>
    </div>
};

export default LoadingScreen;
