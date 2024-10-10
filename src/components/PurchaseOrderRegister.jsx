import React, { useState } from "react";
import styles from "../styles/newPo.module.css";
import CustomAgGridSecond from "../features/CustomAgGridSecond";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
const PurchaseOrderRegister = () => {
  const [orderStatus, setOrderStatus] = useState({
    production: false,
    sample: false,
    other: false,
    domestic: false,
    import: false,
    open: false,
    workOrder: false,
  });

  // Handle checkbox groups where only one can be selected at a time
  const handleCheckboxChange = (checkboxName, group) => {
    switch (group) {
      case "productionSampleOther":
        setOrderStatus({
          ...orderStatus,
          production: checkboxName === "production",
          sample: checkboxName === "sample",
          other: checkboxName === "other",
        });
        break;
      case "domesticImport":
        setOrderStatus({
          ...orderStatus,
          domestic: checkboxName === "domestic",
          import: checkboxName === "import",
        });
        break;
      case "openWorkOrder":
        setOrderStatus({
          ...orderStatus,
          open: checkboxName === "open",
          workOrder: checkboxName === "workOrder",
        });
        break;
      default:
        break;
    }
  };
  const [formData, setFormData] = useState({
    season: "",
    buyer: "",
    buyerOrder: "",
    article: "",
    workOrder: "",
    supplierName: "",
    itemName: "",
    itemGroup: "",
    user: "",
    store: "",
    cancelledPo: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [orderRange, setOrderRange] = useState([null, null]);
  const columnDefs = [
    // Define columns based on your grid data
  ];
  const options = [
    {
      name: "Purchase Order Register",
      details: "View All purchase orders in the register.",
    },
    {
      name: "List of Cancelled PO",
      details: "List of purchase orders that have been cancelled.",
    },
    {
      name: "List of PO Qty Transferred",
      details: "Check the purchase orders with quantities transferred.",
    },
  ];
  
  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Purchase Order Register</h1>
        </div>
        <div className={styles.parentReportOptions}>
          <div className={styles.leftReportOptions}>
        <div className={styles.parentInOrder}>
          {/* First Group: Production, Sample, Other */}
          <div className={styles.orderInTopGrid}>
            <div className={styles.inputbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="production"
                  checked={orderStatus.production}
                  onChange={() =>
                    handleCheckboxChange("production", "productionSampleOther")
                  }
                  className={styles.customCheckbox}
                />
                Production
              </label>
            </div>

            <div className={styles.inputbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="sample"
                  checked={orderStatus.sample}
                  onChange={() =>
                    handleCheckboxChange("sample", "productionSampleOther")
                  }
                  className={styles.customCheckbox}
                />
                Sample
              </label>
            </div>

            <div className={styles.inputbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="other"
                  checked={orderStatus.other}
                  onChange={() =>
                    handleCheckboxChange("other", "productionSampleOther")
                  }
                  className={styles.customCheckbox}
                />
                Other
              </label>
            </div>
          </div>

          {/* Second Group: Domestic, Import */}
          <div className={styles.orderInTopGrid}>
            <div className={styles.inputbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="domestic"
                  checked={orderStatus.domestic}
                  onChange={() =>
                    handleCheckboxChange("domestic", "domesticImport")
                  }
                  className={styles.customCheckbox}
                />
                Domestic
              </label>
            </div>

            <div className={styles.inputbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="import"
                  checked={orderStatus.import}
                  onChange={() =>
                    handleCheckboxChange("import", "domesticImport")
                  }
                  className={styles.customCheckbox}
                />
                Import
              </label>
            </div>
          </div>

          {/* Third Group: Open, Work Order */}
          <div className={styles.orderInTopGrid}>
            <div className={styles.inputbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="open"
                  checked={orderStatus.open}
                  onChange={() => handleCheckboxChange("open", "openWorkOrder")}
                  className={styles.customCheckbox}
                />
                Open
              </label>
            </div>

            <div className={styles.inputbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="workOrder"
                  checked={orderStatus.workOrder}
                  onChange={() =>
                    handleCheckboxChange("workOrder", "openWorkOrder")
                  }
                  className={styles.customCheckbox}
                />
                Work Order
              </label>
            </div>
          </div>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.gateOutTopGrid}>
            {/* Season */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Type</option>
                  <option value="Leather">Leather</option>
                  <option value="Material">Material</option>
                  <option value="Packing">Packing</option>
                  {/* Add more options here */}
                </select>
                <span>PUR TYPE</span>
              </div>
            </div>
            <div className={styles.colSpan}>
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

            {/* Buyer Order */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="buyerOrder"
                  value={formData.buyerOrder}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Buyer Order</option>
                  {/* Add more options here */}
                </select>
                <span>BUYER ORDER</span>
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
                  {/* Add more options here */}
                </select>
                <span>ARTICLE</span>
              </div>
            </div>

            {/* Work Order */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="workOrder"
                  value={formData.workOrder}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Work Order</option>
                  {/* Add more options here */}
                </select>
                <span>WORK ORDER</span>
              </div>
            </div>

            {/* Supplier Name */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Supplier</option>
                  {/* Add more options here */}
                </select>
                <span>SUPPLIER NAME</span>
              </div>
            </div>

            {/* Item Name */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Item</option>
                  {/* Add more options here */}
                </select>
                <span>ITEM NAME</span>
              </div>
            </div>

            {/* Item Group */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="itemGroup"
                  value={formData.itemGroup}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Item Group</option>
                  {/* Add more options here */}
                </select>
                <span>ITEM GROUP</span>
              </div>
            </div>

            {/* User */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select User</option>
                  {/* Add more options here */}
                </select>
                <span>USER</span>
              </div>
            </div>

            {/* Store */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="store"
                  value={formData.store}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Store</option>
                  {/* Add more options here */}
                </select>
                <span>STORE</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
                  <DateRangePicker
                    appearance="default"
                    placeholder="Select Order date range"
                    value={orderRange}
                    onChange={(dates) => setOrderRange(dates)}
                  />

                </div>
            {/* Cancelled PO */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="cancelledPo"
                  value={formData.cancelledPo}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
                <span>CANCELLED PO</span>
              </div>
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

export default PurchaseOrderRegister;
