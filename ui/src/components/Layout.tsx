import React from "react";
import { NavLink } from "react-router-dom";

interface Props {
  onLogout: () => void;
  children: React.ReactNode;
}

function Layout({ children, onLogout }: Props) {
  return (
    <div>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8  text-gray-300">
          <div className="relative flex items-center justify-between h-12">
            <div className="flex-1 flex items-center justify-start ">
              <div className="flex space-x-4">
                <NavLink
                  to="/time"
                  className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  activeClassName="bg-gray-900 text-white"
                  aria-current="page"
                >
                  Time
                </NavLink>

                <NavLink
                  to="/invoices"
                  className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  activeClassName="bg-gray-900 text-white"
                >
                  Invoices
                </NavLink>
              </div>
            </div>
            <div
              role="button"
              onClick={onLogout}
              className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto" style={{ maxWidth: "1024px" }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
