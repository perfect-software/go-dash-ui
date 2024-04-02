import React, { useEffect, useState } from "react";
import styles from "../styles/newPo.module.css";
import { useSidebar } from "../context/SidebarContext";
import { useNavigate, useParams } from "react-router-dom";
import MemoIcon from "../assets/memo.svg";

const NewPurchaseOrder = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isCollapsed } = useSidebar();
  const { orderId } = useParams();
  const [activePage, setActivePage] = useState("itemDetails");
  useEffect(() => {
    const foundOrder = orders.find((order) => order.orderNumber === orderId);
    if (foundOrder) {
      setSelectedOrder(foundOrder);
    }
  }, [orderId]);

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

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.detailsSubContainer}>
        <div className={styles.detailsTitleContainer}>
          <i style={{ cursor: "pointer" }} className="fa fa-arrow-left"></i>
          <h1>Purchase Order Details</h1>
        </div>
        <div className={styles.poDetailsBody}>
          <div className={styles.listContainer}>
            <div className={styles.detailSearchBox}>
              <input
                className={styles.searchBoxInput}
                type="text"
                placeholder="Search by PO number or Contact Name"
              />
              <i className="fas fa-search"></i>
            </div>
            <div className={styles.listScroll}>
              {orders.map((order, index) => (
                <div className={styles.listRow} key={index}>
                  {order.orderNumber}
                  <span className={styles.gstinTag}>{order.contact}</span>
                  <span className={styles.gstinTag}>{order.gstin}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.detailsContainer}>
            <div className={styles.topDetails}>
              <div className={styles.topDetailsTitle}>
                <div className={styles.titleInfo}>
                  <img className={styles.memoIcon} src={MemoIcon} alt="" />
                  <h1>Basic Details</h1>
                  <span className={styles.supplierTag}>Active</span>
                  <span className={styles.supplierTag}>Material</span>
                  <span className={styles.supplierTag}>Regular</span>
                </div>

                <button className={styles.actionButton}>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
              </div>

              <div className={styles.topDetailsData}>
                <div className={styles.topData}>
                  <div className={styles.gridContainer}>
                    <p>Supplier</p>
                    <strong>
                      {selectedOrder&&selectedOrder.gstin
                        ? selectedOrder.gstin
                        : "Not Available"}
                    </strong>

                    <p>Group</p>
                    <strong>
                      {selectedOrder&&selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>Version</p>
                    <strong>
                      {selectedOrder&&selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>Creation Date</p>
                    <strong>
                      {selectedOrder&&selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>Payment Terms</p>
                    <strong>
                      {selectedOrder&&selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>Account Manager</p>
                    <strong>
                      {selectedOrder&&selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>Plain Name</p>
                    <strong>
                      {selectedOrder&&selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>
                  </div>
                </div>

                <div className={styles.topData}>
                  <div className={styles.gridContainer}>
                    <p>GSTIN</p>
                    <strong>
                      {selectedOrder&&selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>PO Number</p>
                    <strong>
                      {selectedOrder&&selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>PO Amount</p>
                    <strong>
                      {selectedOrder&&selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>PO Date</p>
                    <strong>
                      {selectedOrder&&selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>EOD</p>
                    <strong>
                      {selectedOrder&&selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>Mode of Shipment</p>
                    <strong>
                      {selectedOrder&&selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.midDetails}>
              <div className={styles.midDetailsTitle}>
              <div className={styles.toggleButtons}>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "deliveries" ? styles.active : ""
                }`}
                onClick={() => setActivePage("deliveries")}
              >
               Deliveries
              </button>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "bills" ? styles.active : ""
                }`}
                onClick={() => setActivePage("bills")}
              >
              Bills
              </button>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "comment" ? styles.active : ""
                }`}
                onClick={() => setActivePage("comment")}
              >
                Item Details
              </button>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "expense" ? styles.active : ""
                }`}
                onClick={() => setActivePage("expense")}
              >
               Expense
              </button>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "others" ? styles.active : ""
                }`}
                onClick={() => setActivePage("others")}
              >
               Other Details
              </button>
            </div>

              </div>
              <div className={styles.midDetailsData}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPurchaseOrder;
