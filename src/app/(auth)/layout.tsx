import { Toaster } from "@/components/ui/sonner";
import React, { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="py-10 flex justify-center items-center">
        <div className="flex justify-center w-96 bg-card rounded-lg shadow-lg p-10">
          {children}
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Layout;
