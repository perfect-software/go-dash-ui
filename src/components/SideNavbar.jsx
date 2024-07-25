import React, { useEffect, useState } from "react";
import styles from "../styles/sideNav.module.css";
import { useNavigate } from "react-router-dom";
import PlusIcon from "../assets/plus.svg";
import MinusIcon from "../assets/minus.svg";
import SampleIcon from "../assets/sample.svg";
import srIcon from "../assets/book-open.svg";
import SalesIcon from "../assets/sales.svg";
import PurchaseIcon from "../assets/shopping-cart.svg";
import ProductionIcon from "../assets/layers.svg";
import HamburgerIcon from "../assets/hamburger.svg";
import UpIcon from "../assets/up.svg";
import SampleReq from "../assets/check-circle.svg";
import BuyerIcon from "../assets/users.svg";
import PurchaseOrder from "../assets/file-text.svg";
import BuyerOrder from "../assets/package.svg";
import IcrIcon from "../assets/sidebar.svg";
import GatePassIcon from "../assets/file.svg";
import StockIcon from "../assets/box.svg";
import NewWorkIcon from "../assets/hexagon.svg";
import NewJobIcon from "../assets/git-pull-request.svg";
import BomIcon from "../assets/hash.svg";
import ArticleIcon from "../assets/articleDirectory.svg";
import ItemIcon from "../assets/itemDirectory.svg";
import useIsSmallScreen from "../features/useIsSmallScreen";
import { useSidebar } from "../context/SidebarContext";


const MENU_ITEMS = {
  sample: {
    title: "Sample",
    icon: SampleIcon,
    subItems: ["Sample Request", "SR BOM","Sample Costing","Sample Pipeline","Sample Progress"],
  },
  sales: {
    title: "Sales",
    icon: SalesIcon,
    subItems: ["Buyer", "Buyer Order","Dmtr","Gate Pass","Gate Pass Receive","Gate Pass Out Misc","Gate Pass Receive Misc"],
  },
  purchase: {
    title: "Purchase",
    icon: PurchaseIcon,
    subItems: ["Supplier", "Purchase Order","New PO", "ICR Challan", "Gate Pass","Performa Invoice","Order Check List","Material Floor Return"],
  },
  production: {
    title: "Production",
    icon: ProductionIcon,
    subItems: ["Prod Purchase Order", "New Job",'PR BOM','Karigar Job Card','Karigar Job Card Second','Karigar Job Card Receive'],
  },
  stock: {
    title: "Stock",
    icon: StockIcon,
    subItems: ["Article Directory", "Item Directory" , "Item Quotation","Credit Note","Invoice Without WO","Material Issue","Stock Transfer","Stock Adjustment"],
  },
};
const SUBITEM_ICONS = {
  "Sample Request": SampleReq,
  "Sample Pipeline":IcrIcon,
  "Sample Progress":NewJobIcon,
  Buyer: BuyerIcon,
  "Buyer Order": BuyerOrder,
  Supplier: BuyerIcon,
  "Purchase Order": PurchaseOrder,
  "Performa Invoice": IcrIcon,
  "Prod Purchase Order":PurchaseOrder,
  "ICR Challan": IcrIcon,
  "New PO":PurchaseOrder,
  "Stock Adjustment":BuyerIcon,
  "Order Check List":BomIcon,
  "Dmtr":PurchaseOrder,
  "Stock Transfer":PurchaseOrder,
  "Gate Pass":GatePassIcon,
  "Material Issue":BuyerIcon,
  "Credit Note":GatePassIcon,
  "Invoice Without WO":PurchaseOrder,
  "Gate Pass Receive":NewWorkIcon,
  "Gate Pass Out Misc":BomIcon,
  "Karigar Job Card":ArticleIcon,
  "Karigar Job Card Second":PurchaseOrder,
  "Karigar Job Card Receive":NewWorkIcon,
  "Gate Pass Receive Misc":NewWorkIcon, 
  "New Work Order": NewWorkIcon,
  "New Job": NewJobIcon,
  "SR BOM": BomIcon,
  "Material Floor Return": BomIcon,
  "Sample Costing":GatePassIcon,
  "PR BOM": BomIcon,
  "Article Directory": ArticleIcon,
  "Item Directory": ItemIcon,
  "Item Quotation":GatePassIcon,
};

const SideNavbar = ({isOpen,toggleSidebar }) => {
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const [expandedItems, setExpandedItems] = useState({});
  const {isCollapsed , toggleNavbar} = useSidebar();


  const toggleSpread = () => {
    const allExpanded = Object.values(expandedItems).every((val) => val);

    const updatedExpandedItems = {};
    for (const key in expandedItems) {
      updatedExpandedItems[key] = !allExpanded;
    }
    setExpandedItems(updatedExpandedItems);
  };

  const toggleExpanded = (key) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const allExpanded = Object.values(expandedItems).some((val) => val);

  return (
   
    <aside  onMouseEnter={() => isCollapsed && toggleNavbar()} className={`${styles.navbar} ${isCollapsed&&!isSmallScreen ? styles.collapsed : ''} ${isOpen ? styles.close : ''}`}>
      <div className={styles.navbarTop}>
      <img
          className={styles.menuIcons}
          src={HamburgerIcon}
          alt="Hamburger"
          onClick={toggleNavbar} 
        />
        <img
          className={`${styles.menuIcons2} ${
            allExpanded ? "" : `${styles.chervRotate}`
          }`}
          src={UpIcon}
          alt={"ChrevIcon"}
          onClick={toggleSpread}
        />
      </div>
      <div className={styles.navbarMain}>
        {Object.entries(MENU_ITEMS).map(([key, { title, icon, subItems }]) => (
          <div key={key}>
            <div
              className={styles.navbarTitle}
              onClick={() => toggleExpanded(key)}
            >
   <div
      className={`${styles.navbarTitleItem}`}
    >
      <img className={styles.icons} src={icon} alt={title.toLowerCase()} />
      <h2 className={styles.titleName}>{title}</h2>
    </div>

              <div className={styles.addSub}>
                <img
                  className={styles.plusMinus}
                  src={expandedItems[key] ? MinusIcon : PlusIcon}
                  alt={expandedItems[key] ? "minus" : "plus"}
                />
              </div>
            </div>
            {expandedItems[key] && (
             <div className={styles.expandedOptions}>
                {subItems.map((subItem) => (
                  <div
                    key={subItem}
                    className={styles.expandedOptionsTitle}
                    onClick={() => {
                      navigate(`/${subItem.replace(/\s+/g, "").toLowerCase()}`);
                     if(isSmallScreen)
                     {
                      toggleSidebar();
                     }
                    }}
                  >
                    <div className={styles.navbarTitleItem}>
                      <img
                        className={styles.icons}
                        src={SUBITEM_ICONS[subItem]}
                        alt={subItem.toLowerCase()}
                      />
                      <h2 className={styles.titleName}>{subItem}</h2>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>

  );
};

export default SideNavbar;
