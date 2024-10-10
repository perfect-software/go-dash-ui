import React, { useEffect, useState } from "react";
import styles from "../styles/newPo.module.css";
import { useSidebar } from "../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import MenuIcon from "../assets/menuIcon.svg";
import { fetchAllBuyers } from "../reducer/buyersSlice";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import { useDispatch, useSelector } from "react-redux";
const NewPurchaseOrder = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(-1);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { buyers, loaded, loading, error } = useSelector(
    (state) => state.buyer
  );
  useEffect(() => {
    dispatch(fetchAllBuyers());

  }, [dispatch]);
  const toggleDropdown = (index) => {
    if (dropdownOpen === index) {
      setDropdownOpen(-1);
    } else {
      setDropdownOpen(index);
    }
  };
  const filteredBuyers = buyers.filter((buyer) => {
    if (searchQuery.length < 2) return true;  // Only filter after second letter
    return (
      buyer.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.bsName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  const orders = [
    {
      orderNumber: "ORD001",
      gstin: "GSTIN12105RF4D",
      contact: "John Doe",
      creationDate: "2024-04-01",
      paymentTerms: "Net 30",
      orderValue: "$1000",
      stisRecorded: "Yes",
    },
    {
      orderNumber: "ORD002",
      gstin: "GSTIN12105RF4D",
      contact: "Jane Smith",
      creationDate: "2024-03-25",
      paymentTerms: "Net 45",
      orderValue: "$1500",
      stisRecorded: "No",
    },
    {
      orderNumber: "ORD003",
      gstin: "GSTIN12105RF4D",
      contact: "Alice Johnson",
      creationDate: "2024-04-05",
      paymentTerms: "Net 60",
      orderValue: "$1200",
      stisRecorded: "Yes",
    },
    {
      orderNumber: "ORD004",
      gstin: "GSTIN12105RF4D",
      contact: "Bob Brown",
      creationDate: "2024-03-28",
      paymentTerms: "Net 30",
      orderValue: "$900",
      stisRecorded: "No",
    },
    {
      orderNumber: "ORD005",
      gstin: "GSTIN12105RF4D",
      contact: "Eve Wilson",
      creationDate: "2024-04-02",
      paymentTerms: "Net 45",
      orderValue: "$2000",
      stisRecorded: "Yes",
    },
    {
      orderNumber: "ORD006",
      gstin: "GSTIN12105RF4D",
      contact: "Michael White",
      creationDate: "2024-04-10",
      paymentTerms: "Net 30",
      orderValue: "$1800",
      stisRecorded: "No",
    },
    {
      orderNumber: "ORD007",
      gstin: "GSTIN12105RF4D",
      contact: "Sarah Davis",
      creationDate: "2024-03-30",
      paymentTerms: "Net 60",
      orderValue: "$1500",
      stisRecorded: "Yes",
    },
    {
      orderNumber: "ORD008",
      gstin: "GSTIN12105RF4D",
      contact: "Chris Lee",
      creationDate: "2024-04-03",
      paymentTerms: "Net 30",
      orderValue: "$1100",
      stisRecorded: "No",
    },
    {
      orderNumber: "ORD009",
      gstin: "GSTIN12105RF4D",
      contact: "Linda Martinez",
      creationDate: "2024-04-08",
      paymentTerms: "Net 45",
      orderValue: "$1300",
      stisRecorded: "Yes",
    },
    {
      orderNumber: "ORD010",
      gstin: "GSTIN12105RF4D",
      contact: "David Clark",
      creationDate: "2024-04-07",
      paymentTerms: "Net 60",
      orderValue: "$1400",
      stisRecorded: "No",
    },
  ];

  useEffect(() => {
    if (selectedOrder) {
      navigate(`/newpurchaseorderdetails/${selectedOrder.code}`);
    }
  }, [selectedOrder, navigate]);

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Purchase Orders</h1>
          <div className={styles.searchBox}>
            <input
              className={styles.searchBoxInput}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by PO number or Supplier Name"
            />
            <i className="fas fa-search"></i>
          </div>

          <div className={styles.buttonDiv}>
            <button className={styles.allOptionsPoButton}>
              All
              <i
                style={{ marginLeft: "9px" }}
                className="fas fa-caret-down"
              ></i>{" "}
            </button>

            <button className={styles.filterPoButton}>
              <i
                className="fa-solid fa-filter"
                style={{ color: "#7B3AEF" }}
              ></i>
              Filters
            </button>
            <button className={styles.createPoButton}   onClick={() => navigate('/purchaseorder')}>
              <i className="fas fa-plus"></i> Create PO{" "}
              <div className={styles.divider}></div>{" "}
              <i
                style={{ marginLeft: "9px" }}
                className="fas fa-caret-down"
              ></i>{" "}
            </button>
            <button className={styles.downloadPoButton}>
              <i className="fa-solid fa-download"></i>
            </button>
          </div>
        </div>

        <div className={styles.bodyContainer}>
          <div
            className={
              isCollapsed ? styles.tableContainerOpen : styles.tableContainer
            }
          >
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th style={{ minWidth: "200px" }}>Order Number</th>
                  <th style={{ minWidth: "200px" }}>Contact</th>
                  <th style={{ minWidth: "200px" }}>Creation Date</th>
                  <th style={{ minWidth: "200px" }}>Payment Terms</th>
                  <th style={{ minWidth: "200px" }}>Order Value</th>
                  <th style={{ minWidth: "200px" }}>STIs Recorded</th>
                  <th style={{ minWidth: "200px" }}>Order Value</th>
                  <th style={{ minWidth: "200px" }}>STIs Recorded</th>
                  <th style={{ minWidth: "200px" }}>Order Value</th>
                  <th style={{ minWidth: "200px" }}>STIs Recorded</th>
                  <th style={{ minWidth: "200px" }}>Order Value</th>
                  <th style={{ minWidth: "200px" }}>STIs Recorded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {loading && <p>Loading...</p>}
{error && <p>Error loading buyers: {error}</p>}
{filteredBuyers && filteredBuyers.length > 0 ? (
  filteredBuyers.slice(0, 50).map((buyer, index) =>(
                  <tr
                    className={styles.dataRow}
                    key={index}
                    onClick={() => setSelectedOrder(buyer)}
                  >
                    <td style={{ minWidth: "200px" }}>{buyer.code}</td>
                    <td style={{ minWidth: "200px" }}>
                      {buyer.phone}
                      <span className={styles.gstinTag}>{buyer.code}</span>
                      <span className={styles.supplierTag}>Supplier</span>
                    </td>
                    <td style={{ minWidth: "200px" }}>{formatDDMMYYYYDate(buyer.entDate)}</td>
                    <td style={{ minWidth: "200px" }}>{buyer.bsName}</td>
                    <td style={{ minWidth: "200px" }}>{buyer.username}</td>
                    <td style={{ minWidth: "200px" }}>{buyer.billingAddress}</td>
                    <td style={{ minWidth: "200px" }}>{buyer.deliveryAddress}</td>
                    <td style={{ minWidth: "200px" }}>{buyer.city}</td>
                    <td style={{ minWidth: "200px" }}>{buyer.pincode}</td>
                    <td style={{ minWidth: "200px" }}>{buyer.contactPerson}</td>
                    <td style={{ minWidth: "200px" }}>{buyer.mobileExt}</td>
                    <td style={{ minWidth: "200px" }}>{buyer.email}</td>
                    <td
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <button
                        onClick={() => {
                          toggleDropdown(index);
                        }}
                        className={styles.actionButton}
                      >
                         <img className={styles.menuIcon} src={MenuIcon} alt="" />
                      </button>
                      {dropdownOpen === index && (
                        <div className={styles.dropdownMenu}>
                          <button>
                            <i className="fas fa-truck"></i> Create Delivery
                          </button>
                          <button>
                            <i className="fas fa-share-square"></i> Share Po
                          </button>
                          <button>
                            <i className="fas fa-download"></i> Download PDF
                          </button>
                        
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                !loading && <p>No buyers found.</p>
              )}
              </tbody>
            </table>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPurchaseOrder;