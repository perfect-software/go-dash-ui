import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import tableStyles from "../../styles/bom.module.css";
import CustomAgGrid from "../../features/CustomAgGrid";

const Size = ({ sizeDetails }) => {
  const columnDefs = useMemo(() => [
    { field: "orderNo", headerName: "Morder No.", width: 200, editable: false }, 
    { field: "size", headerName: "Size", editable: true,cellStyle: {'background-color': '#e9f7f7'}, },
    { field: "balqty", headerName: "Bal. Qty", editable: true ,cellStyle: {'background-color': '#e9f7f7'},},
    { field: "qty", headerName: "Qty", editable: true,cellStyle: {'background-color': '#e9f7f7'}, },
    { field: "printSize", headerName: "Print Size", editable: true, cellStyle: {'background-color': '#e9f7f7'}, },
  ], []);

  // const [rowData, setRowData] = useState([]);
  const [rowData, setRowData] = useState([
    { orderNo: "001", size: "Medium", balqty: "10", qty: "100", printSize: "A4" },
    { orderNo: "002", size: "Small", balqty: "15", qty: "150", printSize: "A5" },
    { orderNo: "003", size: "Large", balqty: "5", qty: "200", printSize: "A3" },
  ]);

  // useEffect(() => {
  //   if (Array.isArray(sizeDetails)) {
  //     setRowData(sizeDetails);
  //   } else if (sizeDetails !== null) {
  //     console.error("sizeDetails is not in expected format");

  //   }
  // }, [sizeDetails]);

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

export default Size;
