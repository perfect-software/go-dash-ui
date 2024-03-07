import React, { useState, useEffect, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";

const Remarks = ({ poDetails }) => {
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
      console.log('Data after change:', event.data);
    },
  }), []);

  return (
    <>
      <div
        className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
        style={{ height: 250, width: "100%", marginTop: "10px" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          gridOptions={gridOptions}
          domLayout='autoHeight'
          paginationPageSize={12}
          paginationPageSizeSelector={[10, 12, 20, 50, 100]}
          animateRows={true}
        />
      </div>
    </>
  );
};

export default Remarks;
