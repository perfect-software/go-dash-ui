
import React from 'react';

const SideNavContext = React.createContext({
  isExpanded: false,
  toggleOpen: () => {}
});

export default SideNavContext;
