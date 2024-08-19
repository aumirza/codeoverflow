import React, { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex justify-center w-96 bg-orange-500 rounded-xl shadow-lg p-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;
