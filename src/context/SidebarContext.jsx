import React, { createContext, useState, useContext } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <SidebarContext.Provider value={{ isCollapsed,toggleNavbar  }}>
      {children}
    </SidebarContext.Provider>
  );
};
