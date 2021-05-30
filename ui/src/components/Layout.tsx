import React from "react";
import { NavLink } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <div>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-12">
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex space-x-4 text-gray-300">
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

                <a
                  href="#"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Projects
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div
        style={{ maxHeight: "calc(100vh - 48px)" }}
        className="overflow-y-auto overflow-x-auto flex sm:justify-center"
      >
        <div className="w-100 flex-grow" style={{ maxWidth: "900px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
