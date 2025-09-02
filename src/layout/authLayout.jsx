import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Auth pages will render here */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
