import React, { useState, useEffect, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";
import CustomAgGrid from "../../features/CustomAgGrid";

const Remarks = ({ poDetails }) => {
  const [remarkdata,setRemarkData]=useState(null);
  const initialRowData = [
    { remarkLabel: "Remark 1", remarkName: "" },
    { remarkLabel: "Remark 2", remarkName: "" },
    { remarkLabel: "Remark 3", remarkName: "" },
  ];
  const [rowData, setRowData] = useState(initialRowData);
  // Column definitions
  // const columnDefs = useMemo(() => [
  //   { field: "remarkLabel", headerName: "Remark Label", width: 200 },
  //   { 
  //     field: "remarkName", 
  //     headerName: "Remark Name", 
  //     editable: true,
  //   },
  // ], []);
  const columnDefs = [
    { field: "remarkLabel", headerName: "Remark Label", width: 200 },
    { field: "remarkName", headerName: "Remark Name", editable: true, cellStyle: {'background-color': '#e9f7f7'}, }, 
  ];

  useEffect(() => {
    if (poDetails && poDetails.length > 0) {
      const initialRowData = poDetails.map((remark, index) => ({
        id: index, 
        remarkLabel: `Remark ${index + 1}`,
        remarkName: '',
      }));
      setRowData(initialRowData);
    }
  }, [poDetails]);

 // const [rowData, setRowData] = useState([]);

  const gridOptions = useMemo(() => ({
    onCellValueChanged: (event) => {
     setRemarkData(event.data)
    },
  }), []);

useEffect(()=>{
   console.log(remarkdata);
},[remarkdata])



  return (
    <>
      <div
        className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
        style={{  width: "100%", marginTop: "10px" }}
      >
        <CustomAgGrid
                gridHeight="250px"
                rowData={rowData}
                columnDefs={columnDefs}
                editEnabled={false}
                deleteEnabled={false}
                pagination={false}
              />
      </div>
    </>
  );
};

export default Remarks;
