import React, { useEffect, useState } from "react";
import styles from "../styles/newPo.module.css";
import { useSidebar } from "../context/SidebarContext";
import { useNavigate, useParams } from "react-router-dom";
import MemoIcon from "../assets/memo.svg";
import Cross from "../assets/cross.svg";
import GmailIcon from "../assets/gmail.svg";
import WhatsappIcon from "../assets/whatsapp.svg";
import VerifiedIcon from "../assets/verified.svg";
import axios from "axios";
import qs from "qs";

const ItemDetails = ({ orders }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={styles.itemDetailsTableContainer}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginBottom: "2px",
        }}
      >
        <img className={styles.memoIcon} src={MemoIcon} alt="" />
        <h1>Items</h1>
      </div>
      <div
        className={
          isCollapsed
            ? styles.detailsTableContainerOpen
            : styles.detailsTableContainer
        }
      >
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th style={{ minWidth: "200px" }}>Item Name</th>
              <th style={{ minWidth: "200px" }}>HSN</th>
              <th style={{ minWidth: "200px" }}>Quantity</th>
              <th style={{ minWidth: "200px" }}>Pkg Qty</th>
              <th style={{ minWidth: "200px" }}>Unit</th>

              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                className={styles.dataRow}
                key={index}
                onClick={() => setSelectedOrder(order)}
              >
                <td style={{ minWidth: "200px" }}>{order.orderNumber}</td>
                <td style={{ minWidth: "200px" }}>{order.contact}</td>
                <td style={{ minWidth: "200px" }}>{order.creationDate}</td>
                <td style={{ minWidth: "200px" }}>{order.paymentTerms}</td>
                <td style={{ minWidth: "200px" }}>{order.orderValue}</td>

                <td style={{ minWidth: "120px" }}>12133.4</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OtherDetails = ({ orders }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailFailed, setEmailFailed] = useState(false);
  const [whatsAppFailed, setWhatsAppFailed] = useState(false);

  const [whatsAppSent, setWhatsAppSent] = useState(false);
  const terms = [
    "A proper fit is crucial for comfortable wearing of our shoes.",
    "Shoes must be worn and cared for according to the provided instructions to ensure their longevity.",
    "Customers must report any defects or damages upon receipt of the product for timely resolution.",
    "Any alterations made to the shoes by a third party voids warranty and return policies.",
    "Customers must provide accurate sizing information to ensure correct fitting of the shoes.",
    "Returns are accepted within 30 days of purchase for unworn shoes in original condition.",
    "Exchanges are available for shoes of equal or lesser value within the specified return period.",
    "Refunds are issued within 5-7 business days upon receipt and inspection of returned items.",
    "International orders may be subject to additional customs duties and taxes, which are the responsibility of the customer.",
    "We reserve the right to update these terms and conditions at any time without prior notice.",
  ];
  const [expandedState, setExpandedState] = useState({
    terms: false,
    uploaded: false,
    remarks: false,
  });
  const handleEmailShare = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toEmail = "chaudharypiyush30@gmail.com";
    const subject = "Attached Document";
    const body = "This is a test mail";
    const attachmentName = "jp.pdf";
    const data = qs.stringify({
      toEmail,
      subject,
      body,
      attachmentName,
    });

    try {
      const response = await axios.post(
        "http://localhost:8081/api/sendEmail",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
     
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
    
      setEmailFailed(true);
      setTimeout(() => setEmailFailed(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = async (e) => {
    e.preventDefault();
    setLoading(true);
    const phoneNumber = "+917007920320";
    const fileName = "jp.pdf";
    try {
      const response = await axios.post(
        "http://localhost:8081/api/sendWhatsapp",
        {
          to: phoneNumber,
          attachmentName: fileName,
        }
      );
     
      setWhatsAppSent(true);
      setTimeout(() => setWhatsAppSent(false), 3000);
    } catch (error) {
     
      setWhatsAppFailed(true);
      setTimeout(() => setWhatsAppFailed(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailHover = () => {
    setHoveredIcon("email");
  };

  const handleWhatsAppHover = () => {
    setHoveredIcon("whatsapp");
  };

  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  const toggleExpanded = (section) => {
    setExpandedState((prevState) => ({
      terms: section === "terms" ? !prevState.terms : false,
      uploaded: section === "uploaded" ? !prevState.uploaded : false,
      remarks: section === "remarks" ? !prevState.remarks : false,
    }));
  };
  return (
    <div className={styles.parentOthersDiv}>
      <div className={styles.leftOthersDiv}>
        <div
          className={styles.termsDiv}
          onClick={() => toggleExpanded("terms")}
        >
          <div style={{ display: "flex", gap: "9px", alignItems: "center" }}>
            <i class="fa-solid fa-gavel"></i>
            <h1>Terms and Conditions (10)</h1>
          </div>

          <i
            className={`fa-solid fa-circle-chevron-down ${
              expandedState.terms && styles.rotateTerms180
            }`}
          ></i>
        </div>

        {expandedState.terms && (
          <>
            <div className={styles.roundedDivider}></div>
            <div className={styles.termsContent}>
              <ol className={styles.termsList}>
                {terms.map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
              </ol>
            </div>
          </>
        )}
        <div
          className={styles.remarksDiv}
          onClick={() => toggleExpanded("remarks")}
        >
          <div style={{ display: "flex", gap: "9px", alignItems: "center" }}>
            <i class="fas fa-file-invoice"></i>
            <h1>Remarks</h1>
          </div>

          <i
            className={`fa-solid fa-circle-chevron-down ${
              expandedState.remarks && styles.rotateRemarks180
            }`}
          ></i>
        </div>
        <div
          className={styles.uploadedDocumentsDiv}
          onClick={() => toggleExpanded("uploaded")}
        >
          <div style={{ display: "flex", gap: "9px", alignItems: "center" }}>
            <i class="fa fa-upload" aria-hidden="true"></i>
            <h1>Uploaded Documents</h1>
          </div>

          <i
            className={`fa-solid fa-circle-chevron-down ${
              expandedState.uploaded && styles.rotateUpload180
            }`}
          ></i>
        </div>
        {expandedState.uploaded && (
          <>
            <div className={styles.roundedDivider}></div>
            <div className={styles.downContent}>
              <div className={styles.downList}>
                <p>PI32.pdf</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                >
                  <span className={styles.supplierTag}>OTHER</span>
                  <i
                    class="fa-solid fa-share"
                    onClick={() => setShareOpen(true)}
                  ></i>
                  <i class="fa-solid fa-pen"></i>
                  <i class="fa-solid fa-trash"></i>
                </div>
              </div>
              <div className={styles.downList}>
                <p>PI33.pdf</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                >
                  <span className={styles.supplierTag}>OTHER</span>
                  <i
                    class="fa-solid fa-share"
                    onClick={() => setShareOpen(true)}
                  ></i>
                  <i class="fa-solid fa-pen"></i>
                  <i class="fa-solid fa-trash"></i>
                </div>
              </div>
              <div className={styles.downList}>
                <p>PI34.pdf</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                >
                  <span className={styles.supplierTag}>OTHER</span>
                  <i
                    class="fa-solid fa-share"
                    onClick={() => setShareOpen(true)}
                  ></i>
                  <i class="fa-solid fa-pen"></i>
                  <i class="fa-solid fa-trash"></i>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={styles.rightOthersDiv}>
        <div style={{ display: "flex", gap: "9px", alignItems: "center" }}>
          <i class="fa fa-inr" aria-hidden="true"></i>
          <h1>Pricing Details</h1>
        </div>
        <div>
          <div className={styles.priceGridContainer}>
            <div>
              <p>Taxable Value</p>
              <p>₹ 12434.543</p>
            </div>

            <div>
              <p>Total Gst</p>
              <p>₹ 45446</p>
            </div>

            <div>
              <p>Total Cess</p>
              <p>₹ 34343</p>
            </div>

            <div>
              <p>Additional Discount</p>
              <p>₹ 3443</p>
            </div>

            <div>
              <p>Round Off</p>
              <p>₹ 3333</p>
            </div>
            <div className={styles.roundedDivider}></div>
            <div>
              <p>Total Amount</p>
              <strong>₹ 434553</strong>
            </div>
          </div>
          <p className={styles.totalInWords}>
            Four hundred thirty-four thousand five hundred fifty-three
          </p>
        </div>
      </div>
      {shareOpen && (
        <div className={styles.popupOverlay} onMouseLeave={handleMouseLeave}>
          <div className={styles.popupContent}>
            <div className={styles.popupTitle}>
              <img
                onClick={() => setShareOpen(false)}
                src={Cross}
                alt="Select Icon"
                className={styles.crossIcon}
              />
            </div>
            <div className={styles.popupImage}>
              {loading ? (
                <div className={styles.loader}></div>
              ) : (
                <>
                  {emailSent ? (
                    <div className={styles.successTick}>✓</div>
                  ) : emailFailed ? (
                    <div className={styles.failureTick}>✗</div>
                  ) : (
                    <img
                      onClick={handleEmailShare}
                      onMouseEnter={handleEmailHover}
                      src={GmailIcon}
                      alt="Select Icon"
                      className={styles.shareIcon}
                    />
                  )}
                  {whatsAppSent ? (
                    <div className={styles.successTick}>✓</div>
                  ) : whatsAppFailed ? (
                    <div className={styles.failureTick}>✗</div>
                  ) : (
                    <img
                      onClick={handleWhatsAppShare}
                      onMouseEnter={handleWhatsAppHover}
                      src={WhatsappIcon}
                      alt="Select Icon"
                      className={styles.shareIcon}
                    />
                  )}
                </>
              )}
            </div>

            {hoveredIcon === "email" && (
              <div className={styles.sendInfo}>chaudharypiyush30@gmail.com</div>
            )}
            {hoveredIcon === "whatsapp" && (
              <div className={styles.sendInfo}>+917007920320</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SupplierDetails = ({ orders }) => {
  return (
    <div className={styles.parentSupplierDiv}>
      <div className={styles.supplierInfo}>
        <div className={styles.supplierTitle}>
          <i class="fa-solid fa-industry"></i>
          <div className={styles.supplierTitleContainer}>
            <h1>INFINITE ADHESIVE PRIVATE LIMITED</h1>
            <p>
              {" "}
              GSTIN : ALUPC343DE{" "}
              <span>
                {" "}
                <img
                  className={styles.verifiedIcon}
                  src={VerifiedIcon}
                  alt=""
                />{" "}
              </span>
            </p>
          </div>
        </div>
        <div className={styles.roundedDivider}></div>
        <div className={styles.supplierGridContainer}>
          <p>Contact Person</p>
          <p>Mr. Ram Kumar</p>

          <p>Phone Number</p>
          <p>9455645346</p>

          <p>Email Address</p>
          <p>ramkumar@12gmail.com</p>
        </div>
      </div>
    </div>
  );
};

const NewPurchaseOrder = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isCollapsed } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const buttons = [
    { label: "Create Delivery", icon: "fas fa-truck" },
    { label: "Duplicate", icon: "fas fa-clone" },
    { label: "Edit", icon: "fas fa-edit" },
    { label: "Share PO", icon: "fas fa-share" },
    { label: "Download PDF", icon: "fas fa-download" },
    { label: "Record Purchase Bill", icon: "fas fa-file-invoice" },
    { label: "Record Expense Bill", icon: "fas fa-file-invoice-dollar" },
    { label: "Mark Complete", icon: "fas fa-check-circle" },
    { label: "Revoke", icon: "fas fa-times-circle" },
    { label: "Comparison", icon: "fas fa-balance-scale" },
  ];
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

                <button
                  className={styles.actionButton}
                  onClick={toggleDropdown}
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
                {dropdownOpen && (
                  <div
                    style={{ top: "15%", right: "70px" }}
                    className={styles.dropdownMenu}
                  >
                    {buttons.map((button) => (
                      <button key={button.label}>
                        <i className={button.icon}></i> {button.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.topDetailsData}>
                <div className={styles.topData}>
                  <div className={styles.gridContainer}>
                    <p>Supplier</p>
                    <strong>
                      {selectedOrder && selectedOrder.gstin
                        ? selectedOrder.gstin
                        : "Not Available"}
                    </strong>

                    <p>Group</p>
                    <strong>
                      {selectedOrder && selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>Version</p>
                    <strong>
                      {selectedOrder && selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>Creation Date</p>
                    <strong>
                      {selectedOrder && selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>Payment Terms</p>
                    <strong>
                      {selectedOrder && selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>Account Manager</p>
                    <strong>
                      {selectedOrder && selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>Plain Name</p>
                    <strong>
                      {selectedOrder && selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>
                  </div>
                </div>

                <div className={styles.topData}>
                  <div className={styles.gridContainer}>
                    <p>GSTIN</p>
                    <strong>
                      {selectedOrder && selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>PO Number</p>
                    <strong>
                      {selectedOrder && selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>PO Amount</p>
                    <strong>
                      {selectedOrder && selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>PO Date</p>
                    <strong>
                      {selectedOrder && selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>EOD</p>
                    <strong>
                      {selectedOrder && selectedOrder.contact
                        ? selectedOrder.contact
                        : "Not Available"}
                    </strong>

                    <p>Mode of Shipment</p>
                    <strong>
                      {selectedOrder && selectedOrder.contact
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
                    Supplier Details
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
                      activePage === "itemDetails" ? styles.active : ""
                    }`}
                    onClick={() => setActivePage("itemDetails")}
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
              <div className={styles.midDetailsData}>
                {activePage === "itemDetails" && (
                  <ItemDetails orders={orders} />
                )}
                {activePage === "others" && <OtherDetails orders={orders} />}
                {activePage === "deliveries" && (
                  <SupplierDetails orders={orders} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPurchaseOrder;
