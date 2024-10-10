import React, { useState } from "react";
import styles from "../styles/newPo.module.css";
import CustomAgGridSecond from "../features/CustomAgGridSecond";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
const BuyerOrderView = () => {
  const [orderStatus, setOrderStatus] = useState({
    receivedOrder: false,
    pendingOrder: false,
    dispatchOrder: false,
    holdOrder: false,
    cancelledOrder: false,
    freshOrder: false,
  });
  const [formData, setFormData] = useState({
    season: "",
    buyerGroup: "",
    buyer: "",
    branding: "",
    buyerOrderNo: "",
    article: "",
    merchandiser: "",
    last: "",
    sole: "",
    orderType:"",
    rangeOrderDate: "",
    rangeExFactory: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checkboxName) => {
    if (
      ["receivedOrder", "pendingOrder", "dispatchOrder"].includes(checkboxName)
    ) {
      setOrderStatus({
        ...orderStatus,
        receivedOrder: checkboxName === "receivedOrder",
        pendingOrder: checkboxName === "pendingOrder",
        dispatchOrder: checkboxName === "dispatchOrder",
      });
    } else if (
      ["holdOrder", "cancelledOrder", "freshOrder"].includes(checkboxName)
    ) {
      setOrderStatus({
        ...orderStatus,
        holdOrder: checkboxName === "holdOrder",
        cancelledOrder: checkboxName === "cancelledOrder",
        freshOrder: checkboxName === "freshOrder",
      });
    }
  };
  const [orderRange, setOrderRange] = useState([null, null]);
  const [factoryRange, setFactoryRange] = useState([null, null]);
  const columnDefs = [
    // Define columns based on your grid data
  ];
  const options = [
    {
      name: "Received Order",
      details: "Order has been received and is being processed.",
    },
    {
      name: "Pending Order",
      details: "Order is pending approval or processing.",
    },
    {
      name: "Dispatched Order",
      details: "Order has been dispatched to the customer.",
    },
  ];

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Buyer Order (Order In Hand)</h1>
        </div>
        <div className={styles.parentReportOptions}>
          <div className={styles.leftReportOptions}>
            <div className={styles.parentInOrder}>
              <div className={styles.orderInTopGrid}>
                <div className={styles.inputbox}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="holdOrder"
                      checked={orderStatus.holdOrder}
                      onChange={() => handleCheckboxChange("holdOrder")}
                      className={styles.customCheckbox}
                    />
                    Hold Order
                  </label>
                </div>

                <div className={styles.inputbox}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="cancelledOrder"
                      checked={orderStatus.cancelledOrder}
                      onChange={() => handleCheckboxChange("cancelledOrder")}
                      className={styles.customCheckbox}
                    />
                    Cancelled Order
                  </label>
                </div>

                <div className={styles.inputbox}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="freshOrder"
                      checked={orderStatus.freshOrder}
                      onChange={() => handleCheckboxChange("freshOrder")}
                      className={styles.customCheckbox}
                    />
                    Fresh Order
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.topContainer}>
              <div className={styles.gateOutTopGrid}>
                {/* Season */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="season"
                      value={formData.season}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Season</option>
                      {/* Add more options here */}
                    </select>
                    <span>SEASON</span>
                  </div>
                </div>

                {/* Buyer Group */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="buyerGroup"
                      value={formData.buyerGroup}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Buyer Group</option>
                      {/* Add more options here */}
                    </select>
                    <span>BUYER GROUP</span>
                  </div>
                </div>

                {/* Buyer */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="buyer"
                      value={formData.buyer}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Buyer</option>
                      {/* Add more options here */}
                    </select>
                    <span>BUYER</span>
                  </div>
                </div>

                {/* Branding */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="branding"
                      value={formData.branding}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Branding</option>
                      {/* Add more options here */}
                    </select>
                    <span>BRANDING</span>
                  </div>
                </div>

                {/* Buyer Order No */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="buyerOrderNo"
                      value={formData.buyerOrderNo}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Buyer Order No.</option>
                    </select>
                    <span>BUYER ORDER NO.</span>
                  </div>
                </div>

                {/* Article */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="article"
                      value={formData.article}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Article</option>
                    </select>
                    <span>ARTICLE</span>
                  </div>
                </div>

                {/* Merchandiser */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="merchandiser"
                      value={formData.merchandiser}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Merchandiser</option>
                      {/* Add more options here */}
                    </select>
                    <span>MERCHANDISER</span>
                  </div>
                </div>

                {/* Last */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="last"
                      value={formData.last}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Last</option>
                      {/* Add more options here */}
                    </select>
                    <span>LAST</span>
                  </div>
                </div>

                {/* Sole */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="sole"
                      value={formData.sole}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Sole</option>
                      {/* Add more options here */}
                    </select>
                    <span>SOLE</span>
                  </div>
                </div>

                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="orderType"
                      value={formData.orderType}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Order Type</option>
                      {/* Add more options here */}
                    </select>
                    <span>ORDER TYPE</span>
                  </div>
                </div>

                <div className={styles.colSpan4} style={{gap:'30px'}}>
                  <DateRangePicker
                    appearance="default"
                    placeholder="Select Order date range"
                    value={orderRange}
                    onChange={(dates) => setOrderRange(dates)}
                  />

                  <DateRangePicker
                    appearance="default"
                    placeholder="Select Ex Factory Date range"
                    value={factoryRange}
                    onChange={(dates) => setFactoryRange(dates)}
                  />
                </div>
              </div>
            </div>
            <div style={{ margin: "10px" }}>
              <CustomAgGridSecond
                columnDefs={columnDefs}
                rowData={[]} // Pass dynamic row data here
                gridHeight="320px"
                deleteEnabled={false}
                editEnabled={false}
                pagination={true}
              />
            </div>
          </div>
          <div className={styles.rightReportOptions}>
            <div className={styles.listScroll}>
              {options.map((option, index) => (
                <div className={styles.listRow2} key={index}>
               <h2>   {option.name}</h2>
                  <span className={styles.gstinTag}>{option.details}</span>
                </div>
              ))}
            </div>

             <div className={styles.rightReportOptionsButton}>
              <button className={styles.submitButton}>Export</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerOrderView;
