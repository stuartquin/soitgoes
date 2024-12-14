import React from "react";
import { Await, NavLink, Outlet, useAsyncValue } from "react-router-dom";

interface Props {
  onLogout: () => void;
}

function Layout({ onLogout }: Props) {
  const data = useAsyncValue();

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
                  aria-current="page"
                >
                  Time
                </NavLink>

                <NavLink
                  to="/invoices"
                  className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Invoices
                </NavLink>
                <NavLink
                  to="/contacts"
                  className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contacts
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
        <React.Suspense fallback={<p>Loading projects location...</p>}>
          <Await
            resolve={data}
            errorElement={<p>Error loading package location!</p>}
          >
            <Outlet />
          </Await>
        </React.Suspense>
      </div>
    </div>
  );
}

export default Layout;
