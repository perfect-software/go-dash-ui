import React, { useState, useEffect, useRef, useMemo,useCallback } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";


const WorkOrder = ({bsId,onBomSelect}) => {

  const columnDefs = useMemo(
    () => [
      { field: "code", headerName: "Morder No." },
      { field: "head", headerName: "Article No." },
      { field: "percent", headerName: "EX-Factory Date" },
      {
        field: 'action',
        headerName: 'Action',
        cellStyle: { textAlign: 'center' },
        cellRenderer: function (params) {
          return (
            <div style={{
              height: '100%', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center' 
            }}>
              <button  className={tableStyles.minus}
              onClick={() => handleRemoveItem(params.data.code)}
              >
              </button>
            </div>
          );
        },
    },
    ],
    []
  );

  const [rowData, setRowData] = useState([]);
  const [bomDetails, setBomDetails] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [newItem, setNewItem] = useState({
    code: '',
    head: '',
    percent: '',
    rate: '',
  });
  // const handleAddMaterial = () => {
  //   setRowData([...rowData, newItem]);
  //   setNewItem({ code: '', head: '', percent: '', rate: '' });
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewItem({ ...newItem, [name]: value });
  // };
 
  // const onGridReady = useCallback((params) => {
  //   setGridApi(params.api);
  // }, []);

  // useEffect(() => {
  //   if (gridApi) {
  //     if (isFetching) {
  //       gridApi.showLoadingOverlay();
  //     } else if (fetchError) {
  //       gridApi.showNoRowsOverlay();
  //     } else if (!isFetching && bomDetails.length === 0) {
  //       gridApi.showNoRowsOverlay();
  //     } else {
  //       const rowDataToUpdate = [].concat(bomDetails);
  //       gridApi.updateGridOptions({ rowData: rowDataToUpdate });
  //       gridApi.hideOverlay();
  //     }
  //   }
    
  // }, [gridApi, isFetching, fetchError, bomDetails]);


  const columnDe = useMemo(() => [
    {headerName: "Select",  field:'edit' , maxWidth: 150,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    showDisabledCheckboxes: true},
    { headerName: 'ID', field: 'id', sortable: true, filter: true, },
    { headerName: 'Value', field: 'value', sortable: true, filter: true },
    { headerName: 'Date', field: 'delDate', sortable: true, filter: true },
    { headerName: 'Rate', field: 'rate', sortable: true, filter: true }
  ], []);


  const rowDa  = useMemo(() => [
    { id: 1, value: 'Row 1',delDate:'20-12-2001',rate:'200' },
    { id: 2, value: 'Row 2',delDate:'22-12-2001',rate:'233'},
    { id: 3, value: 'Row 3',delDate:'23-12-2001' ,rate:'233'},
  ], []);
 const fetchBomDetails = async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      if (bsId) {
        const BASE_URL = 'bom/viewbomdetails';
        const response = await getDataApiService({ bsId: bsId }, BASE_URL);
        console.log(response);
        setBomDetails(response); 
        setIsFetching(false);
      }
    } catch (error) {
      console.error(error);
      setFetchError("Failed to fetch BOM details");
      setIsFetching(false);
    }
  };
  // useEffect(() => {
  //   if(bsId)
  //   {
  //     fetchBomDetails();
  //   }
  // }, [bsId]); 

  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    onBomSelect(selectedData.length > 0 ? selectedData : null);
  };
  const handleRemoveItem = (code) => {
    setRowData(rowData.filter((item) => item.code !== code));
  };

  return (
    <>
  
      <div
        className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
        style={{ height: 250, width: "100%", marginTop: "10px" }}
      >
        <AgGridReact
              columnDefs={columnDe}
             rowData={rowDa}
              pagination={true}
              paginationPageSize={12}
              paginationPageSizeSelector={[10, 12, 20, 50, 100]}
              animateRows={true}
              rowSelection={"multiple"}
              onSelectionChanged={onRowSelected}
              filter={true}
        
            //  onGridReady={onGridReady}
            //  overlayLoadingTemplate={
            //     '<span class="ag-overlay-loading-center">Loading...</span>'
            //   }
            //   overlayNoRowsTemplate={
            //     `<span class="ag-overlay-loading-center">${fetchError ? 'Failed to load data' : 'No data found'}</span>`
            //   }
      
            />
      </div>
    </>
  );
};

export default WorkOrder;
