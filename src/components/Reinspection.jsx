import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import AutoTable from "../features/AutoTable";
import { useSidebar } from "../context/SidebarContext";
import KarigarDataViewPopup from "../popups/KarigarDataViewPopup";
import CustomAgGrid from "../features/CustomAgGrid";


const ItemDetails = () => {
  const [formData, setFormData] = useState({
    defect: '',
    pairQty: '',
  });
  
  const [itemGridData, setItemGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = () => {
    if (isEditing) {
      const updatedGridData = itemGridData.map(item =>
        item.id === formData.id ? { ...formData } : item
      );
      setItemGridData(updatedGridData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setItemGridData([...itemGridData, { id: uuidv4(), ...formData }]);
    }
    setFormData({
      id: '',
      defect: '',
      pairQty: '',
    });
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      id: '',
      defect: '',
      pairQty: '',
    });
  };



  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field:'select',
      headerName: 'Select',
    },
    // { headerName: "ID", field: "id", sortable: true, filter: true, width: 200 }, // Display the ID column
    { headerName: "Defect Name", field: "defect", sortable: true, filter: true, width: 400 },
    { headerName: "Pair Qty", field: "pairQty", sortable: true, filter: true },
  ];

  return (
    <div className={styles.dmtrparentOthersDiv}>
      <div className={styles.leftkarigarItemDiv} style={{ width: '100%' }}>
        <div className={styles.itemNameKarigarInputDiv}>
          <div className={styles.inputbox}>
            <input
              type="text"
              className={styles.basicInput}
              name="defect"
              value={formData.defect}
              onChange={handleInputChange}
              required
            />
            <span>Defect</span>
          </div>
          <div className={styles.inputbox}>
            <input
              type="text"
              className={styles.basicInput}
              name="pairQty"
              value={formData.pairQty}
              onChange={handleInputChange}
              required
            />
            <span>Pair Qty</span>
          </div>

          <div className={styles.colSpan2}>
              <button
                onClick={handleAddItem}
                className={styles.button50}
                aria-label="Add"
              >
                <span className={styles.button50__Content}>
                  <span className={styles.button50__Text}>
                    {isEditing ? "Edit" : "Add"}
                  </span>
                </span>
              </button>
              {isEditing && (
                <button
                  onClick={handleCancelEdit}
                  className={styles.button50}
                  aria-label="Cancel"
                >
                  <span className={styles.button50__Content}>
                    <span className={styles.button50__Text}>Cancel</span>
                  </span>
                </button>
              )}
            </div>
      
        </div>
        <div>
          <CustomAgGrid
            rowData={itemGridData}
            setIsEditing={setIsEditing}
            setRowData={setItemGridData}
            columnDefs={columnDefs}
            setFormData={setFormData}
            gridHeight='350px'
            editEnabled={true}
            pagination={true}
            deleteEnabled={true}
          />
        </div>
      </div>
    </div>
  );
};



const Reinspection = () => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [activePage, setActivePage] = useState("itemDetails");
  const [formData, setFormData] = useState({
    date: '',
    group: '',
    department: '',
    karigarName: '',
    articleNo: '',
    workOrderNo: '',
    activityName: '',
    sampleRequestNo: '',
    repairSlipNo: '',
    remark: '',
    qty: '',
    rate: '',
  });

  const columns = {
    date: { label: 'Date', width: '140px' },
    departmentName: { label: 'Department Name', width: '300px' },
    articleNo: { label: 'Article No', width: isCollapsed ? "200px" : "170px" },
    workOrder: { label: 'Work Order', width: isCollapsed ? "285px" : "250px" },
    qcName: { label: 'QC Name', width: isCollapsed ? "200px" : "170px" },
    remark: { label: 'Remark', width: isCollapsed ? "240px" : "200px" },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [isViewData, setViewDataPopup] = useState(false);

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Re-Inspection</h1>
          <button className={styles.viewDataButton}  onClick={() => setViewDataPopup(true)}>View Data</button>
        </div>
        <div className={styles.gatePassReceivetopContainer}>
  <div className={styles.gatePassReceiveTopGrid}>
    <div className={styles.colSpan2}>
      <div className={styles.inputbox}>
        <input
          type="text"
          className={styles.basicInput}
          name="date"
          disabled
       
        />
        <span>Buyer Name</span>
      </div>
    </div>

    <div className={styles.colSpan}>
      <div className={styles.inputbox}>
        <input
          type="text"
          className={styles.basicInput}
          name="date"
          disabled
       
        />
        <span>Total Order Qty</span>
      </div>
    </div>

    <div className={styles.colSpan}>
      <div className={styles.inputbox}>
        <input
          type="text"
          className={styles.basicInput}
          name="color"
          disabled
       
        />
        <span>Color</span>
      </div>
    </div>


  </div>
</div>

        <div className={styles.karigarTopContainer}>
        <div className={styles.inputLinerGrid}>
      <div className={styles.colSpanInputLiner}>
        <div className={styles.itemDetailsInput}>
          {Object.keys(columns).map((key, index) => (
            <div key={index} className={styles.inputboxScroll}>
              <input
                type={key === 'date' ? 'date' : key === 'qty' || key === 'rate' ? 'number' : 'text'}
                name={key}
                className={styles.basicInput}
                required
                value={formData[key]}
                onChange={handleInputChange}
                style={{ width: columns[key].width }}
              />
              <span>{columns[key].label}</span>
            </div>
          ))}
        
        </div>
      </div>
    </div>

  </div>
    
  <div className={styles.headBorder} style={{marginLeft:'10px', marginRight:'10px'}}></div>

       <ItemDetails />
      
      </div>
      {isViewData && (
        <KarigarDataViewPopup
          onCancel={() => {
            setViewDataPopup(false);
          }}
       
        />
      )}
    </div>
    
  );
};

export default Reinspection;