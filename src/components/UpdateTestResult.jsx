import React, { useState } from "react";
import styles from "../styles/newPo.module.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import CustomAgGrid from "../features/CustomAgGrid";
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4
import Delete3dIcon from "../assets/eraser.svg";
const UpdateTestResult = () => {
  const [formData, setFormData] = useState({
    poNumber: '',
    poDate: '',
    labName: '',
    materialType: '',
    labInvoiceNo: '',
    labInvoiceDate: '',
    resultRecDate: '',
    labInvoiceAmt: '',
    taxAmount: '',
    taxableAmount: '',
    accountDate: '',
    reportNo: '',
    failedProdPO: '',
    testCopy:null,
    debitNote: false,
    release: false,
    dispute: false,
  });
  

  const [itemGridData, setItemGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [inputKeys, setInputKeys] = useState({}); // For file input key management

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      testCopy: file,
    });
  };
  const rowData = [
    {
      testName: 'Durability Test',
      testParameter: 'Tensile Strength',
      status: 'Completed',
      redParameter: 'None',
      price: 500,
      actPrice: 450,
      amount: 450,
      comment: 'Test passed successfully.'
    },
    {
      testName: 'Waterproof Test',
      testParameter: 'Water Absorption',
      status: 'Not Completed',
      redParameter: 'High Absorption',
      price: 600,
      actPrice: 600,
      amount: 600,
      comment: 'Product failed the waterproof test.'
    },
    {
      testName: 'Heat Resistance Test',
      testParameter: 'Heat Threshold',
      status: 'Completed',
      redParameter: 'None',
      price: 700,
      actPrice: 700,
      amount: 700,
      comment: 'No issues, passed the test.'
    },
    {
      testName: 'Color Fastness Test',
      testParameter: 'UV Resistance',
      status: 'Completed',
      redParameter: 'None',
      price: 400,
      actPrice: 400,
      amount: 400,
      comment: 'The product showed high color fastness.'
    }
  ];
  
  // Grid column definitions
  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: 'select',
      headerName: 'Select',
    },
    { headerName: 'Test Name', field: 'testName', sortable: true, filter: true, resizable: true },
    { headerName: 'Test Parameter', field: 'testParameter', sortable: true, filter: true, resizable: true },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true, 
      resizable: true,
      editable: true, // Make the field editable
      cellEditor: 'agSelectCellEditor', // Use the select dropdown editor
      cellEditorParams: {
        values: ['Completed', 'Not Completed'] // Dropdown options
      } 
    },
    { headerName: 'Red. Parameter', field: 'redParameter', sortable: true, filter: true, resizable: true },
    { 
      headerName: 'Price', 
      field: 'price', 
      sortable: true, 
      filter: true, 
      resizable: true, 
      type: 'numericColumn', 
      editable: true // Make the Price field editable
    },
    { headerName: 'Act. Price', field: 'actPrice', sortable: true, filter: true, resizable: true, type: 'numericColumn' },
    { headerName: 'Amount', field: 'amount', sortable: true, filter: true, resizable: true, type: 'numericColumn' },
    { headerName: 'Comment', field: 'comment', sortable: true, filter: true, resizable: true }
  ];
  

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Update Test Result</h1>
          <button className={styles.viewDataButton}>Update Data</button>
        </div>

        {/* Input Fields */}
        <div className={styles.topContainer}>
        <div className={styles.gateOutTopGrid}>
  {/* PO Number */}
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input
        type="text"
        name="poNumber"
        value={formData.poNumber}
        onChange={handleInputChange}
        className={styles.basicInput}
      />
      <span>PO No.</span>
    </div>
  </div>

  {/* PO Date */}
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input
        type="date"
        name="poDate"
        value={formData.poDate}
        onChange={handleInputChange}
        className={styles.basicInput}
      />
      <span>PO Date</span>
    </div>
  </div>

  {/* Lab Name */}
  <div className={styles.colSpan2}>
    <div className={styles.inputbox}>
      <select
        name="labName"
        value={formData.labName}
        onChange={handleInputChange}
        className={styles.basicInput}
      >
        <option value="">Select Lab Name</option>
        <option value="INTERTEK INDIA PVT LTD">INTERTEK INDIA PVT LTD</option>
        {/* Add more options if needed */}
      </select>
      <span>Lab Name</span>
    </div>
  </div>

  {/* Material Type */}
  <div className={styles.colSpan2}>
    <div className={styles.inputbox}>
      <select
        name="materialType"
        value={formData.materialType}
        onChange={handleInputChange}
        className={styles.basicInput}
      >
        <option value="">Select Material Type</option>
        <option value="Complete Shoe">Complete Shoe</option>
        {/* Add more options if needed */}
      </select>
      <span>Material Type</span>
    </div>
  </div>

  {/* Lab Invoice No. */}
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input
        type="text"
        name="labInvoiceNo"
        value={formData.labInvoiceNo}
        onChange={handleInputChange}
        className={styles.basicInput}
      />
      <span>Lab Invoice No.</span>
    </div>
  </div>

  {/* Lab Invoice Date */}
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input
        type="date"
        name="labInvoiceDate"
        value={formData.labInvoiceDate}
        onChange={handleInputChange}
        className={styles.basicInput}
      />
      <span>Lab Invoice Date</span>
    </div>
  </div>

  {/* Result Rec. Date */}
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input
        type="date"
        name="resultRecDate"
        value={formData.resultRecDate}
        onChange={handleInputChange}
        className={styles.basicInput}
      />
      <span>Result Rec. Date</span>
    </div>
  </div>

  {/* Lab Invoice Amt. */}
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input
        type="number"
        name="labInvoiceAmt"
        value={formData.labInvoiceAmt}
        onChange={handleInputChange}
        className={styles.basicInput}
      />
      <span>Lab Invoice Amt.</span>
    </div>
  </div>

  {/* Tax Amount */}
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input
        type="number"
        name="taxAmount"
        value={formData.taxAmount}
        onChange={handleInputChange}
        className={styles.basicInput}
      />
      <span>Tax Amount</span>
    </div>
  </div>

  {/* Taxable Amount */}
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input
        type="number"
        name="taxableAmount"
        value={formData.taxableAmount}
        onChange={handleInputChange}
        className={styles.basicInput}
      />
      <span>Taxable Amount</span>
    </div>
  </div>

  {/* Account Date */}
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input
        type="date"
        name="accountDate"
        value={formData.accountDate}
        onChange={handleInputChange}
        className={styles.basicInput}
      />
      <span>Account Date</span>
    </div>
  </div>

  {/* Report No. */}
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input
        type="text"
        name="reportNo"
        value={formData.reportNo}
        onChange={handleInputChange}
        className={styles.basicInput}
      />
      <span>Report No.</span>
    </div>
  </div>


  <div className={styles.colSpan2}>
            <div className={styles.imageInputBox}>
              <input
                key={inputKeys.toolingNotesImage}
                type="file"
                name="toolingNotesImage"
                onChange={handleFileChange}
                className={styles.basicInput}
              />
              <span>Upload Test Copy</span>
            </div>
          </div>

    {/* Failed Prod. PO */}
    <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <select
        name="failedProdPO"
        value={formData.failedProdPO}
        onChange={handleInputChange}
        className={styles.basicInput}
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      <span>Failed Prod. PO</span>
    </div>
  </div>
  <div className={styles.colSpan2} style={{gap:'20px'}}>
              <div className={styles.checkboxWrapper}>
                <input
                  id="debitNote"
                  type="checkbox"
                  checked={formData.debitNote}
                  onChange={handleInputChange}
                />
                <label className={styles.cbx} htmlFor="debitNote"></label>
                <label className={styles.lbl} htmlFor="debitNote">
                  Debit Note
                </label>
              </div>
          

         
              <div className={styles.checkboxWrapper}>
                <input
                  id="release"
                  type="checkbox"
                  checked={formData.release}
                  onChange={handleInputChange}
                />
                <label className={styles.cbx} htmlFor="release"></label>
                <label className={styles.lbl} htmlFor="release">
                Release
                </label>
              </div>
           


         
              <div className={styles.checkboxWrapper}>
                <input
                  id="dispute"
                  type="checkbox"
                  checked={formData.dispute}
                  onChange={handleInputChange}
                />
                <label className={styles.cbx} htmlFor="dispute"></label>
                <label className={styles.lbl} htmlFor="dispute">
                Dispute
                </label>
              </div>
            </div>
         

</div>


         
        </div>
   <div style={{marginLeft:"10px",marginRight:'10px'}}>
        {/* AG Grid Component */}
        <CustomAgGrid
          rowData={rowData}
          setIsEditing={setIsEditing}
          setRowData={setItemGridData}
          columnDefs={columnDefs}
          setFormData={setFormData}
          gridHeight="370px"
          editEnabled={true}
          pagination={true}
          deleteEnabled={true}
        />
        </div>
      </div>
    </div>
  );
};

export default UpdateTestResult;
