import React, { useState } from "react";

interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div>
      <nav className="bg-gray-800"></nav>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
