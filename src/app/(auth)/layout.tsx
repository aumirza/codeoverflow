import { Toaster } from "@/components/ui/sonner";
import React, { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="py-10 flex justify-center items-center">

          {children}
      </div>
      <Toaster />
    </>
  );
};

export default Layout;
